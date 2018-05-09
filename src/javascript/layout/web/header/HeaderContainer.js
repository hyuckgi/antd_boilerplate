import React from 'react';
import { Sticky } from 'react-sticky';

import { GlobalNavigation } from '../index';
import { Row, Col, Dropdown, Layout, Button, Menu, Icon } from 'antd';

import imgLogo from '../../../../resource/commons/logo.png'

const { Header } = Layout;
const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://teacher.wink.co.kr/client/teacher_center/"><Icon type="team"/>윙크교사센터</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://admin.wink.co.kr/client/warehouse/"><Icon type="shopping-cart"/>물류센터</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://admin.wink.co.kr/client/cs_center"><Icon type="customer-service"/>공감센터</a>
        </Menu.Item>
    </Menu>
);


class HeaderContainer extends React.Component {


    onClick() {
        this.props.history.push('/');
    }

    renderTabBar(){
        return(
            <Sticky topOffset={80}>
                {({style}) => {
                    return(
                        <div style={{...style, zIndex: 1 }}>
                            <Row type="flex" justify="center" align="middle" className="global-navigation-wrap"  >
                                <Col span={12}>
                                    <GlobalNavigation />
                                </Col>
                            </Row>
                        </div>
                    )
                }}
            </Sticky>
        )
    }

    render() {
        return (
            <Header className="header-container">
                <Row type="flex" justify="space-between" align="middle" className="header-wrap" >
                    <Col span={4} className="logo" >
                        <img src={imgLogo} alt="logo" onClick={this.onClick.bind(this)}/>
                    </Col>
                    <Col className="dropdown" span={4}>
                        <Dropdown overlay={menu} placement="bottomLeft">
                          <Button>다른 관리자센터<Icon type="down" /></Button>
                        </Dropdown>
                    </Col>
                </Row>
                {this.renderTabBar()}
            </Header>
        );
    }

}

export default HeaderContainer;
