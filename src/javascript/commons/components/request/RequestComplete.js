import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetch, security } from '../../../redux/actions';
import { service, path } from '../../configs';
import { FormButton } from '../../types';

import { CustomIcon } from '../';
import { ButtonWrapper } from '../buttons';
import { List, TextareaItem } from 'antd-mobile';

import imgDanbi from '../../../../resource/images/common/character_danbi.png';

const Item = List.Item;

const mapStateToProps = ({fetch, security}) => {
    const issue = service.getValue(fetch, 'multipleList.experienceIssue', false);
    const parent = service.getValue(fetch, 'multipleList.parent', false);

    return {
        issue,
        parent
    }
};


const mapDispatchProps = dispatch => ({
    silentMultipleList : (list) => dispatch(fetch.silentMultipleList(list)),
    resetMultipleList : () => dispatch(fetch.resetMultipleList()),
    move: (location) => dispatch(push(location)),
    logout : () => dispatch(security.logout()),
});



class RequestComplete extends React.Component {

    onClickButton(id){
        switch (id) {
            case FormButton.CONFIRM:
                return this.props.move(path.home);
            default:
                break;
        }
    }

    componentWillUnmount() {
        this.props.logout()
        this.props.resetMultipleList();
    }

    componentDidMount() {
        const { issue } = this.props;

        if(!issue){
            return this.props.move(path.home);
        }
    }

    getButtons(){
        return [
            { id : FormButton.CONFIRM, label : '메인으로 이동', size : 'large'},
        ];
    }

    render() {
        const { form, issue, parent } = this.props;
        const { getFieldProps } = form;
        const addressTop = parent && service.getValue(parent, 'authDetail.humanAddress', null);
        const addressDetail = parent && service.getValue(parent, 'authDetail.humanDetailAddress', null);
        const address = parent ? `${addressTop} ${addressDetail}` : null;

        return (
            <div className="request-complete">
                <List className="request-complete-01">
                    <Item wrap multipleLine >
                        <img src={imgDanbi} alt='danbi' className="image"/>
                        <div className="text-wrap">
                            <p>윙크 무료학습 신청이 완료되었습니다. </p>
                            <p>무료학습 체험 관련 궁금한 사항이 있으시면</p>
                            <p>윙크 학부모님 공감센터로 문의부탁드립니다.</p>
                            <p>감사합니다.^^</p>
                        </div>

                        <p>윙크 학부모님 공감센터 1522-1244 (평일 10:00~20:00)</p>
                    </Item>
                </List>

                <List className="request-complete-02" renderHeader={() => (<h4><CustomIcon type="MdAssignment" style={{color:'#00bbd4'}}/>배송정보</h4>)}>
                    <TextareaItem
                        {...getFieldProps('humanName', {
                            initialValue : issue ? service.getValue(issue, 'authHumanName') : null
                        })}
                        title="이름"
                        autoHeight
                        editable={false}
                    />

                    <TextareaItem
                        {...getFieldProps('address', {
                            initialValue : address
                        })}
                        title="주소"
                        autoHeight
                        editable={false}
                    />

                    <TextareaItem
                        {...getFieldProps('humanMdn', {
                            initialValue : parent ? service.getValue(parent, 'authHumanMdn') : null
                        })}
                        title="휴대폰번호"
                        autoHeight
                        editable={false}
                    />

                    <TextareaItem
                        {...getFieldProps('deliveryMessage', {
                            initialValue : issue ? service.getValue(issue, 'data.deliveryMessage') : null
                        })}
                        title="배송메시지"
                        autoHeight
                        editable={false}
                    />
                </List>

                <List className="request-complete-03" renderHeader={() => (<h4 className="notice"><CustomIcon type="MdInfo" style={{color: '#00bbd4'}}/>꼭 확인해 주세요!</h4>)}>
                    <div className="text-wrap">
                        <p>입력해 주신 주소로 윙크 전용 학습기와 교재를 배송해 드릴 예정입니다. </p>
                        <p>학습기를 받으시고 로그인을 하셔야 우리 아이의 맞춤학습 설정과 함께 윙크 선생님이 연락을 드리게 됩니다. 배송받으시고 빠른 시일 내에 윙크에 로그인해 주세요.</p>
                        <p>윙크는 학부모님들께서 매우 만족하신 신개념 가정 학습서비스입니다. 1주의 체험기간 동안 모든 콘텐츠는 유료회원과 동일한 권한으로 경험하실 수 있으므로, 우리 아이에게 즐겁고 재미있는 학습의 시간을 만들어주시길 바랍니다.</p>
                    </div>
                </List>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(createForm()(RequestComplete));
