import React from 'react';
import moment from 'moment';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';

import { fetch } from '../../../redux/actions';
import { service, api, values } from '../../configs';
import { FormButton } from '../../types';

import { ButtonWrapper } from '../';

import { List, InputItem, Radio, WhiteSpace, Toast, Flex, Badge } from 'antd-mobile';

const startDate = moment().subtract(7, 'years').startOf('year').format(values.format.DATE_FORMAT);
const endDate = moment().subtract(3, 'years').endOf('year').format(values.format.DATE_FORMAT);

const mapStateToProps = ({security, fetch}) => {
    const actor = service.getValue(security, 'actor', false);
    const studentList = service.getValue(fetch, 'multipleList.studentList.results', []);
    const family = service.getValue(fetch, 'multipleList.family', false);

    return {
        actor,
        studentList,
        family
    }
};

const mapDispatchProps = dispatch => ({
    silentMultipleList : (list) => dispatch(fetch.silentMultipleList(list)),
    silentUpdateMultipleList: (list) => dispatch(fetch.silentUpdateMultipleList(list)),
});


class Step02 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMale : true,
            defaultValue : ''
        };

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.actor !== this.props.actor){
            this.getStudents();
        }
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

    onBlur(value){
        const { studentList, form } = this.props;
        const isExit = studentList.filter(item => service.getValue(item, 'authHumanName') === value.trim());

        if(isExit.length){
            Toast.fail('이미 등록된 아이입니다', 1);
            form.resetFields('studentName');
            return this.studentName.focus();
        }
    }

    getStudents(){
        const { actor } = this.props;

        if(actor){
            return this.props.silentUpdateMultipleList([{ id: 'family', url : api.getFamilyActor(actor.id), params : {}}])
                    .then((docs) => {
                        const { family } = this.props;
                        if(family.id){
                            return this.props.silentMultipleList([{id: 'studentList', ...api.getMembers(family.id, {modelType : values.actorType.student})}])
                        }
                    });
        }
    }

    onClickPrev(){
        const { stepProps } = this.props;
        return stepProps.onClickPrev();
    }

    onClickNext(){
        const { isMale } = this.state;
        const { stepProps, form } = this.props;

        form.validateFields((errors, value) => {

            if(value.birthday.trim().length !== 8){
                return Toast.fail('생년월일을 8자리로 입력해주세요.', 1);
            }
            const isBetween = moment(value.birthday, values.format.DATE_FORMAT).isBetween(startDate, endDate);
            if(!isBetween){
                Toast.fail('가입가능한 연령이 아닙니다.', 1);
                form.resetFields('birthday');
                return this.birthday.focus();
            }

            if(!errors){
                let params = {...value, isMale};
                this.setState({
                    defaultValue : params,
                })
                return stepProps.onClickNext(params);
            }
            return this.errorToast(errors);
        });
    }

    onChange(value){
        return this.setState({
            isMale : value
        });
    }

    onClickButton(id){
        switch (id) {
            case FormButton.PREV:
                return this.onClickPrev();
            case FormButton.NEXT:
                return this.onClickNext();
            default:
                break;
        }
    }

    getButtons(){
        return [
            { id : FormButton.PREV, label : '이전', type : 'default' },
            { id : FormButton.NEXT, label : '다음', style : { marginLeft: '5px'} },
        ];
    }

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        const { isMale } = this.state;
        const { genderOptions } = values.requestValue;


        return (
            <div className="request-step-wrapper step-02">
                <List full="true">
                    <InputItem
                        {...getFieldProps('studentName', {
                            rules: [{ required: true, message: '아이 이름을 입력하세요!'}],
                        })}
                        ref={el => this.studentName = el}
                        placeholder="아이 이름 입력"
                        clear
                        onBlur={this.onBlur}
                        error={!!getFieldError('studentName')}
                        onErrorClick={() => {
                          alert(getFieldError('studentName').join('、'));
                        }}
                    ><Badge dot>아이이름</Badge></InputItem>

                    <WhiteSpace size="md"/>

                    <Flex className="flex-wrapper" align="center">
                        <Flex.Item className="plain-text"><Badge dot>성별</Badge></Flex.Item>
                    </Flex>

                    <Flex className="flex-wrapper" align="center">
                        {genderOptions.map((item, idx) => (
                            <Flex.Item key={idx}>
                               <Radio className="circle-radio" checked={isMale === item.value} onChange={() => this.onChange(item.value)}>{item.label}</Radio>
                            </Flex.Item>
                        ))}
                    </Flex>

                    <WhiteSpace size="md"/>

                    <Flex className="flex-wrapper" align="center">
                        <Flex.Item className="plain-text"><Badge dot>생년월일(숫자 8자리)</Badge></Flex.Item>
                    </Flex>

                    <InputItem
                        type="number"
                        {...getFieldProps('birthday', {
                            rules: [{ required: true, message: '생년월일을 입력하세요.'}]
                        })}
                        ref={el => this.birthday = el}
                        placeholder="(예, 2014년3월2일생은 20140302 입력)"
                        clear
                        error={!!getFieldError('birthday')}
                        onErrorClick={() => {
                          alert(getFieldError('birthday').join('、'));
                        }}
                    ></InputItem>
                </List>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(createForm()(Step02));
