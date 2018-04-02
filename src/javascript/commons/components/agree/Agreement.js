import React from 'react';
import { createForm } from 'rc-form';

import { values } from '../../configs';
import { Accordion, List, Checkbox, Button } from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;

class Agreement extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            winkTermsAgreement : true,
            privateInfoAgreement : true,
        }

        this.onChange = this.onChange.bind(this);
        this.renderExtra = this.renderExtra.bind(this);
        this.onChangeAllTerms = this.onChangeAllTerms.bind(this);
    }

    onChange(e, item){
        return this.setState({
            [item.name] : e.target.checked
        });
    }

    onChangeAllTerms(e){
        const { form } = this.props;

        if(e.target.checked){
            form.setFieldsValue({
                winkTermsAgreement : true,
                privateInfoAgreement : true,
            })
            return this.setState({
                winkTermsAgreement : true,
                privateInfoAgreement : true,
            })
        }else{
            form.setFieldsValue({
                winkTermsAgreement : false,
                privateInfoAgreement : false,
            })
            return this.setState({
                winkTermsAgreement : false,
                privateInfoAgreement : false,
            })
        }
    }

    renderExtra(item){
        return(
            <Button href={item.url} target="_new" size="small" className="custom-btn">보기</Button>
        )
    }

    renderHeader(){
        return(
            <p className="title">학습기, 교재 배송과 무료 학습을 위한 윙크 이용약관과 개인정보 수집 및 활용에 동의합니다.</p>
        )
    }

    render() {
        const { form } = this.props;
        const { winkTermsAgreement, privateInfoAgreement } = this.state;
        const allTerms = winkTermsAgreement && privateInfoAgreement;
        const { agreementValue } = values;

        return (
            <Accordion defaultActiveKey="0" className="agreement-accordion" >
                <Accordion.Panel header={this.renderHeader()}>
                    <List className="my-list">
                        <CheckboxItem checked={allTerms} key={'allTerms'} onChange={this.onChangeAllTerms} >전체 동의합니다.</CheckboxItem>
                        {agreementValue.map((item, idx) => {
                            return(
                                <List.Item
                                    key={idx}
                                    extra={this.renderExtra(item)}
                                >
                                    <form >
                                        {form.getFieldDecorator(`${item.name}`, {
                                            initialValue : true,
                                        })(<CheckboxItem checked={this.state[item.name]} key={item.name} onChange={(e) => this.onChange(e, item)}>{item.label}</CheckboxItem>)}
                                    </form>
                                </List.Item>
                            )
                        })}
                    </List>
                </Accordion.Panel>
            </Accordion>
        );
    }

}

export default createForm()(Agreement);
