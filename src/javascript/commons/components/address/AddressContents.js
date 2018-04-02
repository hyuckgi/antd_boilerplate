import React from 'react';
import jsonp from 'fetch-jsonp';
import { createForm } from 'rc-form';

import { service } from '../../configs';
import { api, values } from '../../configs/address';

import { CustomIcon } from '../';
import { SubHeader } from '../../../layout/navigation';

import { List, Button, Flex, Toast, Modal, Tabs, SearchBar } from 'antd-mobile';


const defaultTabIdx = 0;

class AddressContents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            results : [],
            tab : values.tabs[defaultTabIdx],
            tabIdx : 0,
        }

        this.onConfirm = this.onConfirm.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(tab, tabIdx){
        this.setState({
            tab,
            tabIdx,
            results : []
        })
    }

    onSubmit(value){
        const { tabIdx } = this.state;
        const reg = /^[가-힣()][가-힣()\s]*[0-9]+/gm;

        if(!value || value.trim() === ''){
            return Toast.fail('상세주소를 입력하세요.', 1);
        }

        if(tabIdx === 0 && !reg.test(value)){
            return Toast.fail('도로명과 건물번호를 입력해주세요.', 1);
        }

        jsonp(api.address(value))
            .then(res => res.json())
            .then(({results}) => {
                const length =  service.getValue(results, 'length', false);
                if(!length){
                    Toast.fail('검색결과가 없습니다', 1);
                    return this.setState({
                        results : [],
                    });
                }
                return this.setState({
                    results
                });
            });
    }

    componentWillAppear(...args){
        console.log("args", args);
    }

    renderDetail(){
        const { tab } = this.state;
        return (
            <List.Item>
                <SearchBar
                    placeholder={tab.placeholder}
                    cancelText={'검색'}
                    onCancel={this.onSubmit}
                    onSubmit={this.onSubmit}
                />

                <Flex className="flex-wrapper" align="start" direction='column'>
                    <Flex.Item className="plain-text notification"><CustomIcon type="MdInfo" style={{color:'#ccc'}} />{tab.notification}</Flex.Item>
                    {tab.subText.map((item, idx) => {
                        return(<Flex.Item className="plain-text" key={idx}>{item}</Flex.Item>)
                    })}
                </Flex>
            </List.Item>
        )
    }

    renderResult(){
        const { results } = this.state;
        const length = service.getValue(results, 'length', false);

        if(!length){
            return null;
        }

        return(
            <div className="address-results-wrapper">
                <List.Item
                    extra={`${length} 건`}
                >검색결과
                </List.Item>

                {results.map((item, idx) => {
                    return(
                        <List.Item
                            extra={<Button
                                        type="primary"
                                        size="small"
                                        onClick={this.onConfirm.bind(this, item)}
                                    >선택</Button>}
                            arrow="empty"
                            multipleLine
                            wrap
                            key={idx}
                        >
                            <Flex className="flex-wrapper" align="start" direction="column">
                                <Flex.Item className="plain-text zipcode">
                                    <span>우편번호</span>{item.postcode5}
                                </Flex.Item>
                                <Flex.Item className="plain-text old-address">
                                    <span>도로명</span>{`${item.ko_common} ${item.ko_doro}`}
                                </Flex.Item>
                                <Flex.Item className="plain-text old-address">
                                    <span>지번</span>{`${item.ko_common} ${item.ko_jibeon}`}
                                </Flex.Item>
                            </Flex>
                        </List.Item>
                    )
                })}
            </div>
        )
    }

    onConfirm(item, e){
        e.preventDefault();
        this.setState({
            results : [],
            tab : values.tabs[defaultTabIdx],
        })

        const data = Object.keys(item).reduce((result, key) => {
            result['humanPostalCode'] = item['postcode5'];
            result['humanAddress'] = item['ko_common'] + " " + item['ko_doro'];
            return result;
        }, {})

        this.props.onConfirm(data);
    }

    render() {
        const { visible } = this.props;

        return (
            <Modal
                wrapClassName="address-popup-wrapper"
                visible={visible}
                popup={true}
                maskClosable={false}
                title={<SubHeader title="우편번호 찾기" onLeftClick={this.props.onCloseModal}/>}
                footer={[{ text: '취소', onPress: this.props.onCloseModal}]}
            >
                <Tabs
                    tabs={values.tabs}
                    initialPage={defaultTabIdx}
                    swipeable={false}
                    onChange={this.onChange}
                    onTabClick={this.onChange}
                    prerenderingSiblingsNumber={0}
                    destroyInactiveTab={true}
                >
                    <List
                        className='address-select-wrapper'
                    >

                        {this.renderDetail()}

                        {this.renderResult()}
                    </List>

                    <List
                        className='address-select-wrapper'
                    >
                        {this.renderDetail()}

                        {this.renderResult()}
                    </List>

                </Tabs>
            </Modal>
        );
    }

}

AddressContents.propTypes = {

};

AddressContents.defaultProps = {

};


export default createForm()(AddressContents);
