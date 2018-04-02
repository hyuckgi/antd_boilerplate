import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';

import { service } from '../../configs';
import { FormMode } from '../../types';
import { AddressContents } from './'

import { List, InputItem, Button, Toast} from 'antd-mobile';

const mapStateToProps = ({security}) => {

    return {
    }
};

const mapDispatchProps = dispatch => ({

});


class Address extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible : false,
            address : {
                humanAddress : '',
                humanPostalCode : '',
            }
        };

        this.onOpenMadal = this.onOpenMadal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    onConfirm(address){
        this.setState({
            address
        });
        this.onCloseModal();
    }

    onOpenMadal(){
        this.setState({
            visible : true,
        })
    }

    onCloseModal(){
        this.setState({
            visible : false,
        });
    }

    getInitialValue(key){
        const { actor } = this.props;
        const authDetail = actor && service.getValue(actor, 'authDetail');
        const { address } = this.state;
    
        return  address[key] || authDetail[key];
    }

    render() {
        const { visible } = this.state;
        const { form, mode, actor } = this.props;
        const { getFieldProps, getFieldError } = form;
        // initial
        const initialValue = service.getValue(actor, 'authDetail.humanPostalCode', false);
        const readonly = mode === FormMode.READ ? true : false;

        if(readonly && initialValue){
            return(
                <List className="address-wrapper">
                    <InputItem
                        {...getFieldProps('humanPostalCode', {
                            initialValue : service.getValue(actor, 'authDetail.humanPostalCode'),
                        })}
                        editable={!readonly}
                    >우편번호</InputItem>
                    <InputItem
                        {...getFieldProps('humanAddress', {
                            initialValue : service.getValue(actor, 'authDetail.humanAddress') + service.getValue(actor, 'authDetail.humanDetailAddress'),
                        })}
                        editable={!readonly}
                    >주소</InputItem>
                </List>
            )
        }

        return (
            <List className="address-wrapper">
                <List.Item
                    className={"extra-button"}
                    extra={<Button type="primary" size="small" onClick={this.onOpenMadal}>우편번호 찾기</Button>}
                >
                    <InputItem
                        {...getFieldProps('humanPostalCode', {
                            initialValue : this.getInitialValue('humanPostalCode')
                        })}

                        disabled={true}
                    ></InputItem>
                </List.Item>

                <InputItem
                    {...getFieldProps('humanAddress', {
                        initialValue : this.getInitialValue('humanAddress')
                    })}
                    disabled={true}
                ></InputItem>

                <InputItem
                    {...getFieldProps('humanDetailAddress', {
                        rules: [{ required: true, message: '상세주소를 입력해주세요'}],
                        initialValue : this.getInitialValue('humanDetailAddress')
                    })}
                    placeholder="상세 주소 입력"
                    clear
                    error={!!getFieldError('humanDetailAddress')}
                    onErrorClick={() => {
                      Toast.fail(getFieldError('humanDetailAddress').join('、'), 1);
                    }}
                ></InputItem>

                <AddressContents
                    visible={visible}
                    onCloseModal={this.onCloseModal}
                    onConfirm={this.onConfirm}
                />
            </List>
        );
    }
}

Address.propTypes = {
    mode : PropTypes.string.isRequired,
};

Address.defaultProps = {
    mode : FormMode.WRITE,
};

export default connect(mapStateToProps, mapDispatchProps)(createForm()(Address));
