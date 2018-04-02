import React from 'react';

import { createForm } from 'rc-form';

import { FormButton } from '../../types';

import { List, WhiteSpace, Flex, Toast } from 'antd-mobile';
import { CustomIcon, LevelCheck, ButtonWrapper } from '../';
import { Agreement } from '../agree';

class Step03 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            levels : {}

        }
        this.onChangeLevel = this.onChangeLevel.bind(this);
    }

    onChangeLevel(levels, flag=false){
        if(false){
            return this.setState({
                levels
            });
        }
        return this.setState({
            ...this.state,
            levels : {
                ...this.state.levels,
                ...levels
            },
        });
    }

    onChangeAgree(terms, flag=false){
        if(false){
            return this.setState({
                terms
            });
        }
        return this.setState({
            ...this.state,
            ...terms
        });
    }

    onClickPrev(){
        const { stepProps } = this.props;
        return stepProps.onClickPrev();

    }

    onSubmit(){
        const { levels } = this.state;
        const { stepProps, form } = this.props;

        form.validateFields((errors, value) => {

            if(!value.winkTermsAgreement || !value.privateInfoAgreement){
                return Toast.fail('이용약관과 개인정보 수집 및 활용에 동의해주세요.', 1)
            }

            if(!errors){
                let data = {};
                data = {...value, levels : levels};
                return stepProps.onSubmit(data);
            }
        });
    }

    onClickButton(id){
        switch (id) {
            case FormButton.PREV:
                return this.onClickPrev();
            case FormButton.NEXT:
                return this.onSubmit();
            default:
                break;
        }
    }

    getButtons(){
        return [
            { id : FormButton.PREV, label : '이전', type : 'default' },
            { id : FormButton.NEXT, label : '답변완료', style : { marginLeft: '5px'} },
        ];
    }

    render() {
        return (
            <div className="request-step-wrapper step-03">
                <List full="true">
                    <Flex className="flex-wrapper" align="center" direction="column">
                        <Flex.Item className="plain-text notification"><CustomIcon type="MdInfo" style={{color:'#ccc'}} />우리 아이 학습 단계에 맞춘 교재를 보내드리기 위한 사전 질의(4문항)입니다. 사전에 학습 단계를 정했더라도 실제 학습 중 우리 아이 단계와 맞지 않으면 윙크 선생님과 협의하여 조정할 수 있으니 언제든 선생님을 통해 의견 주시기 바랍니다.</Flex.Item>
                        <WhiteSpace size="md"/>
                        <Flex.Item className="plain-text notification"><CustomIcon type="MdInfo" style={{display: 'none'}} />단, 체험 교재는1회만 발송되오니 잘 살펴보시고 체크해 주실 것을 부탁드립니다.</Flex.Item>
                        <WhiteSpace size="md"/>
                        <Flex.Item className="plain-text notification"><CustomIcon type="MdInfo" style={{display: 'none'}} />또한, 권장 연령은 참고 자료일 뿐, 우리 아이의 사전 학습 여부에 따라 얼마든지 학습 단계가 달라질 수 있습니다. 따라서 현재 우리 아이의 나이와 맞지 않는다고 염려하실 필요는 전혀 없으며, 장기적 관점에서 우리 아이에게 맞는 올바른 적기 학습이 이루어질 수 있도록 체크해 주시기 바랍니다.</Flex.Item>
                        <WhiteSpace size="md"/>
                        <Flex.Item className="plain-text notification" style={{color:'red'}}><CustomIcon type="MdInfo" style={{display: 'none'}} />※ 윙크 서비스 이용 시 무선 공유기를 통한 와이파이 연결이 필수입니다.</Flex.Item>
                    </Flex>
                </List>

                <WhiteSpace size="md"/>

                <LevelCheck onChange={this.onChangeLevel} />

                <WhiteSpace size="md"/>

                <Agreement
                    onChange={this.onChangeAgree}
                    form={this.props.form}
                />


                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default createForm()(Step03);
