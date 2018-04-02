import React from 'react';
import moment from 'moment';

import { FormButton } from '../../types';
import { UserInfo } from '../';

const duration = moment.duration(3, 'minutes');

class Step01 extends React.Component {

    onSubmit(params){
        this.onClickNext(params);
    }

    onClickNext(params){
        const { stepProps } = this.props;
        return stepProps.onClickNext(params);
    }

    getButtons(){
        return [
            { id : FormButton.NEXT, label : '다음' }
        ];
    }

    render() {
        const { stepProps } = this.props;
        const { actor, onShop } = stepProps;

        return (
            <div className="request-step-wrapper step-01">
                <UserInfo
                    onShop={onShop}
                    actor={actor}
                    buttons={this.getButtons()}
                    onSubmit={this.onSubmit.bind(this)}
                    duration={duration}
                />
            </div>
        );
    }

}

export default Step01;
