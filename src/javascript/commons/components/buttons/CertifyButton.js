import React from 'react';
import PropTypes from 'prop-types';

import { APICaller } from 'wink_mobile_commons/dist/api';
import { service, api } from '../../configs';

import { Button, Toast } from 'antd-mobile';

class CertifyButton extends React.Component {

    constructor(props) {
        super(props);

        this.onStartTimer = this.onStartTimer.bind(this);
        this.onStopTimer = this.onStopTimer.bind(this);
    }

    run(){
        const { current, timer } = this.state;
        const { duration, timeOver, countDown, complete } = this.props;

        this.animationId = requestAnimationFrame(() => {

            const fromNow = current ? (current.getTime() - timer.getTime()) : duration.asMilliseconds() - 1;
            countDown(fromNow);

            if(!complete && fromNow < duration.asMilliseconds()){
                this.setState({
                    current : new Date(),
                });
                this.run();
            }else if( duration.asMilliseconds() <= fromNow ){
                Toast.fail('인증번호 유효시간을 초과했습니다.', 1);
                timeOver();
                return this.onStopTimer();
            }else if(!complete){
                return this.onStopTimer();
            }
        });
    }

    onStartTimer(){
        this.setState({
            timer: new Date(),
        });
        this.run();
    }

    onStopTimer(){
        cancelAnimationFrame(this.animationId)
    }

    componentWillUnmount() {
        this.onStopTimer();
    }

    onClickSend(e){
        e.preventDefault();
        const { humanMdn, humanName, onError } = this.props;
        const obj = api.getAuth({humanMdn : humanMdn});

        if(!humanMdn){
            return Toast.fail('휴대폰번호를 입력해주세요.', 1);
        }
        if(!humanName || !humanName.trim()){
            return Toast.fail('이름을 입력해주세요.', 1);
        }

        APICaller.get(obj.url, obj.params)
        .then(({data}) => {
            const isExist = service.getValue(data, 'count', false);

            const obj = api.sendOneTimePassword({humanMdn : humanMdn});
            APICaller.post(obj.url, obj.params)
            .then((res) => {
                this.onStartTimer();
                onError({
                    title : '인증번호 발송',
                    contents : `인증번호를 ${humanMdn}로
                    발송하였습니다.`
                })
            });
            // return 값이 필요할때
            return this.props.onClick(isExist);
        })
        .catch((err) => {
            console.log("err", err);
        })
    }

    render() {
        const { complete } = this.props;
        return (
            <Button
                type="primary"
                size="small"
                disabled={complete}
                onClick={this.onClickSend.bind(this)}
            >인증번호 발송</Button>
        );
    }
}

CertifyButton.propTypes = {
    duration : PropTypes.any.isRequired,
    complete : PropTypes.any.isRequired,
    timeOver : PropTypes.func.isRequired,
    countDown : PropTypes.func.isRequired,
    humanMdn : PropTypes.string,
};

CertifyButton.defaultProps = {
    duration : 180000,
    complete : false,
};

export default CertifyButton;
