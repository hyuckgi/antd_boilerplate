import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import { APICaller } from 'wink_mobile_commons/dist/api';

import { service, values, api } from '../configs';
import { FormMode } from '../types';

import { DeliveryMessage } from './delivery';
import { Address } from './address';
import { ButtonWrapper } from './buttons';
import { CustomIcon, CertifyPhone } from './';

import { List, InputItem, Radio, WhiteSpace, Flex, Badge, Toast } from 'antd-mobile';

const mapStateToProps = ({security}) => {
    return {
    }
};

const mapDispatchProps = dispatch => ({

});


class UserInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            parentCategoryTagName : '엄마',
            categoryTag : '',
        };

        this.onChangeParent = this.onChangeParent.bind(this);
        this.onClickButton = this.onClickButton.bind(this);

        this.getParentCategory = this.getParentCategory.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(!prevState.categoryTag ){
            this.getParentCategory();
        }
    }

    renderREgisterCode(){
        const { mode, form } = this.props;
        const { getFieldProps, getFieldError } = form;

        if(mode === FormMode.READ){
            return;
        }

        return(
            <div className='register-code-wrapper'>
                <Flex className="flex-wrapper" align="center">
                    <Flex.Item className="plain-text">가입코드</Flex.Item>
                </Flex>

                <Flex className="flex-wrapper" align="center">
                    <Flex.Item className="plain-text notification"><CustomIcon type="MdInfo" style={{color:'#ccc'}} />사전에 안내 받은 경우에만 기입해주세요.</Flex.Item>
                </Flex>

                <WhiteSpace size="md"/>

                <InputItem
                    {...getFieldProps('registerCode', {

                    })}
                    placeholder="가입코드"
                    clear
                    error={!!getFieldError('registerCode')}
                    onErrorClick={() => {
                      Toast.fail(getFieldError('registerCode').join('、'), 1);
                    }}
                ></InputItem>
            </div>
        );
    }

    renderDelivery(){
        const { mode, form } = this.props;

        if(mode === FormMode.READ){
            return;
        }

        return(
            <div className="delivery-message">
                <Flex className="flex-wrapper" align="center">
                    <Flex.Item className="plain-text">배송메시지</Flex.Item>
                </Flex>

                <DeliveryMessage form={form} />
                <WhiteSpace size="md"/>
            </div>
        )
    }

    onChangeParent(e){
        e.preventDefault();
        const parentCategoryTagName = e.target.children;
        this.getParentCategory(parentCategoryTagName);
    }

    getParentCategory(parentCategoryTagName = this.state.parentCategoryTagName){
        const obj = api.getTagName('ParentCategoryTag/get_named', {name : parentCategoryTagName});

        APICaller.get(obj.url, obj.params)
            .then(({data}) => {
                const categoryTag = service.getValue(data, 'id', false);
                this.setState({
                    categoryTag,
                    parentCategoryTagName
                });
            });
    }

    renderParents(){
        const { actor, mode, form } = this.props;
        const { getFieldError, getFieldProps } = form;
        const { parentCategoryTagName } = this.state;
        const { parents } = values.requestValue;

        const initialCategory = actor && service.getValue(actor, 'categoryTagName', null);
        const parentCategory = initialCategory ? initialCategory : parentCategoryTagName;

        if(mode === FormMode.READ && initialCategory){
            return (
                <InputItem
                    {...getFieldProps('categoryTagName', {
                        initialValue : initialCategory,
                    })}
                    placeholder="양육자 구분"
                    clear
                    error={!!getFieldError('categoryTagName')}
                    onErrorClick={() => {
                      Toast.fail(getFieldError('categoryTagName').join('、'), 1);
                    }}
                >{this.renderBadge('양육자 구분')}</InputItem>
            )
        }

        return(
            <div className="select-parent-category">
                <Flex className="flex-wrapper" align="center">
                    <Flex.Item className="plain-text">{this.renderBadge('양육자 구분')}</Flex.Item>
                </Flex>

                <Flex align="center">
                    {parents.map((item, idx) => (
                        <Flex.Item key={idx} className={`category-${item.value} ${parentCategory === item.label ? 'checked' : ''}`}>
                            <Radio
                                checked={parentCategory === item.label}
                                onChange={this.onChangeParent}
                            >{item.label}</Radio>
                        </Flex.Item>
                    ))}
                </Flex>
            </div>
        )
    }

    makeToast(messages){

        const duration = messages.length;

        return Toast.fail(
            (<div>
                {messages.map((message, idx) => {
                    return (<p key={idx}>{message}</p>)
                })}
            </div>)
            , duration
        );
    }

    errorToast(errors = null){
        const { getFieldError } = this.props.form;
        if(!errors){
            return;
        }

        const messages = Object.keys(errors)
            .map(item => {
                return getFieldError(item);
            })
            .reduce((result, item, idx) => {
                return result.concat(item);
            }, []);

        return this.makeToast(messages);
    }

    onClickButton(type){
        const { form } = this.props;
        const { parentCategoryTagName, categoryTag } = this.state;

        if(!this.categoryTag){
            this.getParentCategory(parentCategoryTagName);
        }

        form.validateFields((errors, value) => {
            if(!errors){
                const humanPostalCode = service.getValue(value, 'humanPostalCode', null);
                if(!humanPostalCode){
                    return Toast.fail('우편번호를 입력해주세요', 1);
                }
                const delivery = form.getFieldValue('deliveryMessageWrite') || service.getValue(value, 'deliveryMessageType', []).find(item => item);
                let params = {};
                params = {...value, categoryTag, parentCategoryTagName};
                params['deliveryMessage'] = delivery;

                return this.props.onSubmit(params);
            }
            return this.errorToast(errors);
        });
    }

    renderBadge(key){
        const { mode } = this.props;
        if(mode === FormMode.READ){
            return key;
        }
        return (<Badge dot>{key}</Badge>)
    }

    render() {
        const { form, duration, actor, mode, buttons, onShop } = this.props;
        const { getFieldProps, getFieldError } = form;
        const readonly = mode === FormMode.READ ? true : false;

        return (
            <div className="user-info-wrapper">
                <List full="true" >
                    <InputItem
                        {...getFieldProps('humanName', {
                            rules: [{ required: true, message: '이름 입력하세요!'}],
                            initialValue : service.getValue(actor, 'authHumanName', null),
                        })}
                        placeholder="학부모 이름 입력"
                        clear
                        editable={!readonly}
                        error={!!getFieldError('humanName')}
                        onErrorClick={() => {
                          Toast.fail(getFieldError('humanName').join('、'), 1);
                        }}
                    >{this.renderBadge('이름')}</InputItem>

                    <WhiteSpace size="md"/>

                    {this.renderParents()}

                    <WhiteSpace size="md"/>

                    <CertifyPhone
                        onShop={onShop}
                        mode={mode}
                        actor={actor}
                        humanName={form.getFieldValue('humanName')}
                        duration={duration}
                        form={form}
                    />

                    <WhiteSpace size="md"/>

                    <Flex className="flex-wrapper" align="center">
                        <Flex.Item className="plain-text">{this.renderBadge('주소')}</Flex.Item>
                    </Flex>

                    <Flex className={`flex-wrapper ${readonly ? 'read-mode': ''}`} align="center">
                        <Flex.Item className="plain-text notification"><CustomIcon type="MdInfo" style={{color:'#ccc'}} />학습기 및 교재 배송을 위해 정확한 주소를 입력해주셔야 합니다.</Flex.Item>
                    </Flex>

                    <Address
                        mode={mode}
                        actor={actor}
                        form={form}
                    />

                    <WhiteSpace size="md"/>

                    {this.renderDelivery()}

                    { this.renderREgisterCode() }
                </List>

                { buttons.length > 0 && (<ButtonWrapper buttons={buttons} onClickButton={this.onClickButton} />)}
            </div>
        );
    }
}

UserInfo.propTypes = {
    mode : PropTypes.string.isRequired,
    duration : PropTypes.any,
    buttons : PropTypes.array,
    onSubmit : PropTypes.func,
};

UserInfo.defaultProps = {
    mode : FormMode.WRITE,
};

export default connect(mapStateToProps, mapDispatchProps)(createForm()(UserInfo));
