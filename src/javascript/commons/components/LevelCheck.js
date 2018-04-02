import React from 'react';
import PropTypes from 'prop-types';
import { createForm } from 'rc-form';

import { values } from '../configs';
import { CustomIcon } from './';

import { List, Radio, WhiteSpace, Flex } from 'antd-mobile';

class LevelCheck extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            levels : {
                한글 : 1,
                수학 : 1,
                스토리영어 : 1,
                파닉스 : 1,
            }
        }
        this.getListItem = this.getListItem.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    componentDidMount() {
        const { levels } = this.state;

        return this.props.onChange(levels, 'init');
    }

    onSelect(key, item){
        this.setState({
            ...this.state,
            levels : {
                ...this.state.levels,
                [key] : item.value,
            },
        });

        return this.props.onChange({[key] : item.value});
    }

    getOptions(key, options){
        const { levels } = this.state;
        return (
            <Flex align="start" direction="column">
                {options.map((item, idx) => {
                    if(item.notice){
                        return(
                            <Flex.Item
                                key={idx}
                                className="notification"
                            >
                                <CustomIcon type="MdInfo" style={{color:'#ccc'}} />
                                {item.label}
                                <WhiteSpace size="lg"/>
                            </Flex.Item>
                        );
                    }

                    return(
                        <Flex.Item key={idx} onClick={() => this.onSelect(key, item)}>
                           <Radio className="circle-radio"  checked={levels[key] === item.value}>
                               <p>{item.label}</p>
                               {item.extra && <p className="extra">{item.extra}</p>}
                           </Radio>
                           <WhiteSpace size="lg"/>
                        </Flex.Item>
                    );
                })}
            </Flex>
        );
    }

    getListItem(){
        const { levelContents } = values.requestValue;


        return Object.keys(levelContents).map((item, idx) => {

            const isDescript = levelContents[item].descript;
            const isOptions = levelContents[item].options;

            return(
                <List.Item key={idx} >
                    <WhiteSpace size="lg"/>
                    <p className="title">{`${idx + 1}. 윙크 "${levelContents[item].name}" 학습 단계 설정을 위한 문항입니다. 해당하는 항목에 체크해 주세요.`}</p>
                    <WhiteSpace size="xl"/>
                    {isDescript && (<p className="sub-title">{isDescript}</p>)}
                    {isDescript && (<WhiteSpace size="xl"/>)}
                    {isOptions && this.getOptions(item, isOptions)}
                </List.Item>
            )
        })
    }

    render() {
        return (
            <List full="true" className="level-check-wrapper">
                {this.getListItem()}
            </List>
        );
    }
}

LevelCheck.propTypes = {
    onChange : PropTypes.func.isRequired,
};

LevelCheck.defaultProps = {

};

export default createForm()(LevelCheck);
