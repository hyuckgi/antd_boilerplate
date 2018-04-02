import React from 'react';
import moment from 'moment';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { APICaller } from 'wink_mobile_commons/dist/api';

import { fetch, security } from '../../../redux/actions';
import { fetch as creators } from '../../../redux/creators';

import { service, api, values, path } from '../../configs';
import { CustomIcon } from '../';

import { List, Tabs, Flex, Steps, WingBlank, Modal } from 'antd-mobile';

import imgWinkBot from '../../../../resource/images/experience/wink_bot.png';
import imgBooks from '../../../../resource/images/experience/books.png';

import { Step01, Step02, Step03 } from './';

const Step = Steps.Step;

const mapStateToProps = ({fetch, security, router, code}) => {
    const actor = service.getValue(security, 'actor', false);
    const family = service.getValue(fetch, 'multipleList.family', false);
    const issue = service.getValue(fetch, 'multipleList.issue', false);
    const search = service.getValue(router, 'location.search', false);
    const replyWork = service.getValue(code, 'workType.1105', false);

    return {
        actor,
        family,
        search,
        issue,
        replyWork
    }
};

const mapDispatchProps = dispatch => ({
    silentUpdateMultipleList : (list) => dispatch(fetch.silentUpdateMultipleList(list)),
    simpleSilentUpdateList: (list) => dispatch(fetch.simpleSilentUpdateList(list)),
    postStart : () => dispatch(creators.postStart()),
    postEnd : () => dispatch(creators.postEnd()),
    move: (location) => dispatch(push(location)),
    silentMultipleList : (list) => dispatch(fetch.silentMultipleList(list)),
    login: (params) => dispatch(security.login(params)),
    multipleList : (list) => dispatch(fetch.multipleList(list)),
});

class RequestStudy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current : 0,
            params : {},
            onShop : false,
            visible : false,
            modalContent : {
                title : "",
                contents : "",
                url : "",
            }
        };

        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onModal = this.onModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);

        this.isAuthToken = this.isAuthToken.bind(this);
        this.checkIssue = this.checkIssue.bind(this);
    }

    componentDidMount() {
        const { search } = this.props;
        if(search){
            this.isAuthToken(search);
        }
    }

    isAuthToken(search){
        const query = queryString.parse(search);

        if(query.issue){
            return this.checkIssue(query.issue)
                .then(() => {
                    const { issue } = this.props;
                    if(issue){
                         return this.props.login({authToken : query.token});
                    }
                })
        }

        return this.onModal({
            title : '올바른 접근이 아닙니다',
            contents : `홈으로 이동합니다.`,
            url : path.main
        });
    }

    checkIssue(queryIssue){
        const obj = api.getIssue(parseInt(queryIssue, 10));
        return this.props.multipleList([{id: 'issue', url : obj.url, params : obj.params}])
            .then(() => {
                const { issue, replyWork } = this.props;
                const currentWorkType = service.getValue(issue, 'currentWorkType', false);
                if(currentWorkType === (replyWork.id || 1105)){
                    return this.setState({
                        onShop : true,
                    });
                }

                return this.onModal({
                    title : '이미 가입신청 되었습니다.',
                    contents : `이미 가입신청 처리되었습니다.
                    홈으로 이동합니다.`,
                    url : path.main
                });
            })
            .catch((err) => {
                if(err.response){
                    return this.onFail(err.response);
                }
            });
    }

    getSteps(){
        const { current } = this.state;
        const type = service.getValue(values, 'requestType', {});
        return Object.keys(type)
            .map((item, idx) => (<Step className={current === idx ? 'active' : 'inactive'} key={idx} title={type[item].label} />));
    }

    getTabs(){
        const type = service.getValue(values, 'requestType', {});

        return Object.keys(type)
            .map((item, idx) => {
                return {title : ''}
            })
    }

    onChange(tab, idx){
        console.log("idx", idx);
    }

    onSubmit(data){
        const { params } = this.state;
        const { actor } = this.props;
        const { humanAddress, humanMdn, humanDetailAddress, humanName, humanPostalCode, parentCategoryTagName, categoryTag } = params;

        const authParams = {
            humanAddress,
            humanMdn,
            humanDetailAddress,
            humanName,
            humanPostalCode,
            data : {
                privateInfoAgreement : data['privateInfoAgreement'],
                winkTermsAgreement : data['winkTermsAgreement'],
                parentCategoryTagName : parentCategoryTagName,
            }
        };

        if(actor){
            this.props.postStart();
            return this.props.simpleSilentUpdateList([
                {...api.modifyAuth(service.getValue(actor, 'auth'), authParams)},
                {...api.modifyActor(service.getValue(actor, 'id'), {categoryTag})},
            ])
            .then((docs) => {
                return this.makeStudent(data)
            });
        }

        return this.onReTry();
    }

    makeStudent(param){
        const { family, actor, issue } = this.props;
        const { params, onShop } = this.state;
        const { isMale } = params;

        const childParams = {
            birthday : moment(params.birthday).format(values.format.DATE_FORMAT),
            isMale,
            humanName : params.studentName
        };

        const obj = api[onShop ? 'setStudent' : 'addStudent'](service.getValue(family, 'id'), childParams);
        return APICaller.post(obj.url, obj.params)
            .then(({data}) => {
                const studentId = service.getValue(data, 'id');
                const { levels } = param;
                const studentParams = {
                    levels,
                    levelsRegistDate : moment().utc().format(),
                };
                const obj = api.modifyActor(studentId, {data : studentParams})
                return APICaller.post(obj.url, obj.params);
            })
            .then(({data}) => {
                const { deliveryMessage, registerCode } = params;
                const experienceParams = {
                    deliveryMessage,
                    registerCode,
                };

                if(onShop){
                    const obj = api.modifyIssue(issue.id, {data : experienceParams});
                    return this.props.silentUpdateMultipleList([{id: 'experienceIssue', url : obj.url,  params : obj.params}])
                        .then(() => {
                            return this.props.simpleSilentUpdateList([{...api.completeWork(issue.currentWork, {routeTo : 'CSRAvailableWinkServiceCheckWork'})}])
                        });
                }else{
                    const studentId = service.getValue(data, 'id');
                    experienceParams['requestChannel'] = values.channel.MOBILE;
                    const obj = api.addExperience(studentId, experienceParams);
                    return this.props.silentUpdateMultipleList([
                        {id: 'experienceIssue', url : obj.url,  params : obj.params}
                    ]);
                }
            })
            .then((docs) => {
                const parent = service.getValue(actor, 'id');
                const obj = api.getActor(`${parent}/`);

                return this.props.silentMultipleList([{id: 'parent', url : obj.url, params : obj.params}]);
            })
            .then((docs) => {
                this.props.postEnd();
                return this.onSuccess();
            })
            .catch((err) => {
                if(err.response){
                    this.props.postEnd();
                    return this.onFail(err.response);
                }
            })
    }

    onModal(modalContent){
        this.setState({
            visible : true,
            modalContent,
        });
    }

    onReTry(){
        return this.onModal({
            title : '오류가 발생했습니다.',
            contents : '무료체험 학습 신청 중 오류가 발생했습니다. 처음 부터 다시 진행해주세요.',
            url : path.home
        })
    }

    onFail(response){
        return this.onModal({
            title : '오류가 발생했습니다.',
            contents : service.getValue(response, 'data.detail', response['status']),
            url : path.home
        })
    }

    onSuccess(){
        this.onModal({
           title : `무료학습 신청완료`,
           contents : '무료학습 신청이 완료되었습니다.',
           url : path.requestComplete,
       });
    }

    onClickPrev(){
        const { current } = this.state;
        const prev = (current - 1) < 0  ? 0 : current - 1;

        return this.setState({
            current : prev,
        })
    }

    onClickNext(params){
        const type = service.getValue(values, 'requestType', {});
        const { current } = this.state;
        const next = (current + 1) > (Object.keys(type).length - 1) ? (Object.keys(type).length - 1) : current + 1;

        return this.setState({
            current : next,
            params : {
                ...this.state.params,
                ...params
            }
        })
    }

    onCloseModal(){
        const { modalContent } = this.state;
        this.setState({
            visible : false,
        });

        if(modalContent.url === path.home){
            return window.location.reload();
        }
        return this.props.move(modalContent.url);
    }

    getModalContents(){
        const { modalContent } = this.state;
        return modalContent.contents;
    }

    getModalTitle(){
        const { modalContent } = this.state;
        return modalContent.title;
    }

    render() {
        const { actor } = this.props;
        const { current, visible, onShop } = this.state;
        const stepProps = {
            onShop : onShop,
            actor : actor,
            onClickNext : this.onClickNext,
            onClickPrev : this.onClickPrev,
            onSubmit : this.onSubmit
        };

        return (
            <div className="request-wrapper">
                <Flex >
                    <Flex.Item>
                        <h2 className="title">무료학습 신청</h2>
                    </Flex.Item>
                </Flex>

                <List full="true" className="sub-wrapper">

                    <Flex justify="center" align="center">
                        <Flex.Item>
                            <img src={imgWinkBot} alt="winkbot" />
                        </Flex.Item>
                        <Flex.Item>
                            <CustomIcon type="FaPlusCircle" roots="FontAwesome" style={{color:'#9F9F9F'}}/>
                        </Flex.Item>
                        <Flex.Item>
                            <img src={imgBooks} alt="books" />
                        </Flex.Item>
                    </Flex>

                    <List.Item>
                        <p>학부모님, 배송을 위해 아래의 정보를 입력해 주세요.</p>
                        <p>입력한 배송지로 학습전용단말기와 교재 등이 배송됩니다.</p>
                    </List.Item>
                </List>

                <WingBlank>
                    <Steps
                        current={current}
                        direction="horizontal"
                        size="small"
                        className="request-steps"
                    >
                        {this.getSteps()}
                    </Steps>
                </WingBlank>

                <Tabs
                    tabs={this.getTabs()}
                    initialPage={0}
                    page={current}
                    swipeable={false}
                    onChange={this.onChange.bind(this)}
                    tabBarBackgroundColor='transparent'
                    tabBarTextStyle={{fontSize:'13px'}}
                    tabBarUnderlineStyle={{display : 'none'}}
                >
                    <Step01
                        stepProps={stepProps}
                    />

                    <Step02
                        stepProps={stepProps}
                    />

                    <Step03
                        stepProps={stepProps}
                    />
                </Tabs>

                <Modal
                    visible={visible}
                    transparent
                    maskClosable={false}
                    title={this.getModalTitle()}
                    footer={[{ text: 'Ok', onPress: this.onCloseModal}]}
                >
                    {this.getModalContents()}
                </Modal>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(RequestStudy);
