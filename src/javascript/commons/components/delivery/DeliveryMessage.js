import React  from 'react';
import { createForm } from 'rc-form';


import { values } from '../../configs';

import { List, InputItem, Picker, Toast } from 'antd-mobile';

class DeliveryMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value : [],
        };

        this.onOK = this.onOK.bind(this);
    }

    onOK(value){
        return this.setState({
            value : value
        })
    }

    renderMessage(){
        const { value } = this.state;
        const { form } = this.props;
        const { getFieldProps, getFieldError } = form;
        const isEtc = value.filter(item => item === '메시지 직접 입력').length;

        if(isEtc){
            return (
                <InputItem
                    {...getFieldProps('deliveryMessageWrite')}
                    placeholder="배송메시지를 입력해주세요."
                    clear
                    error={!!getFieldError('deliveryMessageWrite')}
                    onErrorClick={() => {
                      Toast.fail(getFieldError('deliveryMessageWrite').join('、'), 1);
                    }}
                ></InputItem>
            );
        }

        return null;
    }

    render() {
        const { value } = this.state;
        const { form } = this.props;
        const { getFieldProps } = form;

        return (
            <div className="flex-wrapper picker-wrapper">
                <Picker
                    {...getFieldProps('deliveryMessageType', {
                    })}
                    data={values.requestValue.deliveryMessage}
                    cols={1}
                    title="배송메세지"
                    okText="완료"
                    dismissText="취소"
                    onOk={this.onOK}
                    value={value}
                    extra={'선택'}
                >
                    <List.Item arrow="horizontal">배송메세지를 선택해주세요.</List.Item>
                </Picker>

                {this.renderMessage()}
            </div>

        );
    }

}

export default createForm()(DeliveryMessage);
