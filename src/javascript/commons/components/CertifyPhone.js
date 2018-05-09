import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';

import { security } from '../../redux/actions';
import { APICaller } from '../api';
import { service, api } from '../configs';
import { FormMode } from '../types';
import { CertifyButton, CustomIcon } from './';

import { List, InputItem, Button, Toast, Modal, Flex, Badge } from 'antd-mobile';

const defaultDuration = moment.duration(3, 'minutes');

const mapStateToProps = ({router}) => {
    return {
    }
};

const mapDispatchProps = dispatch => ({
    login: (params) => dispatch(security.login(params)),
});


class CertifyPhone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isExist : false,
            fromNow : 0,
            disabled : true,
            visible : false,
            complete : false,
            modalContent : {
                title : "",
                contents : "",
            }
        };

        this.renderTimer = this.renderTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.onTimeOver = this.onTimeOver.bind(this);
        this.onClickSend = this.onClickSend.bind(this);
        this.onClickConfirm = this.onClickConfirm.bind(this);
        this.onError = this.onError.bind(this);

        this.onCloseModal = this.onCloseModal.bind(this);
        this.getModalContents = this.getModalContents.bind(this);

        this.onLogin = this.onLogin.bind(this);
        this.onCheckPassword = this.onCheckPassword.bind(this);
    }

    onLogin(){
        const { form, humanName } = this.props;
        const params = form.getFieldsValue(['humanMdn', 'onetimePassword']);

        return this.props.login({...params, humanName})
            .then(data => {
                const actor = service.getValue(data, 'actor', false);
                if(actor){
                    return this.onSuccess();
                }
            })
            .catch((err) => {
                if(err.response){
                    return this.onFail(err.response);
                }
            });
    }

    onCheckPassword(){
        const { form, humanName } = this.props;
        const params = form.getFieldsValue(['humanMdn', 'onetimePassword']);

        if(!params.onetimePassword || !params.onetimePassword.trim()){
            return this.onError({
                title : '인증 실패',
                contents : '올바른 인증번호를 입력해주세요.',
            })
        }

        const obj = api.checkOneTimePassword(params);
        APICaller.post(obj.url, obj.params)
        .then(({data}) => {
            const mdnToken = service.getValue(data, 'mdnToken', false);
            if(mdnToken){
                this.onSuccess();
            }
            return mdnToken;
        })
        .then((mdnToken) => {
            const postParams = {
                humanMdn : params['humanMdn'],
                humanName,
                mdnToken : mdnToken,
            };
            const obj = api.getAuth(postParams);
            return APICaller.post(obj.url, obj.params);
        })
        .then(({data}) => {
            const authToken = service.getValue(data, 'authToken', false);
            if(authToken){
                return this.props.login({authToken})
            }
        })
        .catch((err) => {
            if(err.response){
                return this.onFail(err.response);
            }
        })

    }

    onClickConfirm(e){
        e.preventDefault();
        const { isExist } = this.state;

        if(isExist){
            return this.onLogin();
        }else{
            return this.onCheckPassword()
        }
    }

    onError(modalContent){
        this.setState({
            visible : true,
            modalContent,
        });
    }

    renderTimer(){
        const { fromNow } = this.state;
        const { duration } = this.props;

        const remain = fromNow && (fromNow < duration.asMilliseconds())
                ? duration.asMilliseconds() - fromNow
                : duration.asMilliseconds();

        return (
            <em className="limit-time">{`유효시간 ${moment(remain, 'x').format('mm:ss')}`}</em>
        )
    }

    onFail(response){
        if(response.status === 400){
            return this.onError({
                title : '인증 실패',
                contents : `인증번호를 잘못 입력하셨습니다.
                다시 확인 후 입력해 주세요.`
            });
        }
        return this.onError({
            title : '인증 실패',
            contents : '올바른 인증번호를 입력해주세요.'
        });
    }

    onSuccess(){
        this.onError({
           title : `인증 성공`,
           contents : '인증되었습니다.'
       });
       return this.setState({
           complete : true,
       });
    }

    onTimeOver(){
        this.setState({
            disabled : true,
        });
    }

    countDown(fromNow){
        this.setState({
            fromNow,
            disabled : false,
        });
    }

    onClickSend(isExist){
        this.setState({
            isExist,
        })
    }

    getModalContents(){
        const { modalContent } = this.state;
        return modalContent.contents;
    }

    getModalTitle(){
        const { modalContent } = this.state;
        return modalContent.title;
    }

    onCloseModal(){
        this.setState({
            visible : false,
        });
    }

    renderConfirm(){
        const { disabled, complete } = this.state;
        const { form, mode } = this.props;
        const { getFieldProps, getFieldError } = form;

        return (
            <List.Item
                className="extra-button phone-fields"
                extra={
                    mode === FormMode.LOGIN
                    ? this.renderTimer()
                    : <Button
                        type="primary"
                        size="small"
                        disabled={disabled || complete}
                        onClick={this.onClickConfirm}
                     >인증번호 확인</Button>}
            >
                <InputItem
                    type="number"
                    {...getFieldProps('onetimePassword', {
                        rules: [{ required: true, message: '인증번호를 입력하세요'}],
                    })}
                    placeholder="인증번호 입력"
                    extra={mode === FormMode.LOGIN ? undefined : this.renderTimer()}
                    clear
                    disabled={disabled || complete}
                    error={!!getFieldError('onetimePassword')}
                    onErrorClick={() => {
                      Toast.fail(getFieldError('onetimePassword').join('、'), 1);
                    }}
                ></InputItem>
            </List.Item>
        )
    }

    render() {
        const { visible, complete } = this.state;
        const { form, duration, humanName, actor, mode, onShop } = this.props;
        const { getFieldProps, getFieldError } = form;
        const readonly = mode === FormMode.READ ? true : (onShop ? true : false);
        const mdn = service.getValue(actor, 'authHumanMdn', null) && service.getValue(actor, 'authHumanMdn', null).replace(/\-/g,'');

        return (
            <List className="certify-phone-wrapper">
                <Flex className="flex-wrapper" align="center">
                    <Flex.Item className="plain-text">{readonly ? '휴대폰 번호' : (<Badge dot>휴대폰 번호</Badge>)}</Flex.Item>
                </Flex>

                <Flex className={`flex-wrapper ${readonly ? 'read-mode': ''}`} align="center">
                    <Flex.Item className="plain-text notification"><CustomIcon type="MdInfo" style={{color:'#ccc'}} /> 휴대폰으로 전송된 인증번호를 입력한 후, <em>[인증번호 확인]</em> 버튼을 누르세요.</Flex.Item>
                </Flex>

                <List.Item
                    className={!readonly ? "extra-button" : ''}
                    extra={ !readonly
                        ?   (<CertifyButton
                                humanName={humanName}
                                humanMdn={form.getFieldValue('humanMdn')}
                                onClick={this.onClickSend}
                                duration={duration || defaultDuration}
                                timeOver={this.onTimeOver}
                                countDown={this.countDown}
                                onError={this.onError}
                                complete={complete}
                            />)
                        : undefined}
                >
                    <InputItem
                        {...getFieldProps('humanMdn', {
                            rules: [{ required: true, message: '휴대폰 번호를 필수 입력하세요'}],
                            initialValue : mdn,
                        })}
                        type="digit"
                        placeholder="휴대폰번호 입력(-생략)"
                        clear
                        editable={!readonly}
                        disabled={complete}
                        error={!!getFieldError('humanMdn')}
                        onErrorClick={() => {
                          Toast.fail(getFieldError('humanMdn').join('、'), 1);
                        }}
                    ></InputItem>
                </List.Item>

                { !readonly ? this.renderConfirm() : null }

                <Modal
                    visible={visible}
                    transparent
                    maskClosable={false}
                    title={this.getModalTitle()}
                    footer={[{ text: 'Ok', onPress: this.onCloseModal}]}
                >
                    {this.getModalContents()}
                </Modal>
            </List>
        );
    }
}

CertifyPhone.propTypes = {
    mode : PropTypes.string.isRequired,
    duration : PropTypes.any.isRequired,
    humanName : PropTypes.string,
};

CertifyPhone.defaultProps = {
    mode : FormMode.WRITE,
    duration : moment.duration(3, 'minutes'),
};

export default connect(mapStateToProps, mapDispatchProps)(createForm()(CertifyPhone));
