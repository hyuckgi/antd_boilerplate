import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import imgLogo from '../../../../resource/commons/logo.png';

import { NavBar } from 'antd-mobile';

import { CustomIcon } from '../../../commons/components';
import { path } from '../../../commons/configs';


const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location))
});

class HeaderContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            menu : false,
            mypage : false,
        };

        this.onOpenChange = this.onOpenChange.bind(this);
        this.getLeftContent = this.getLeftContent.bind(this);
        this.getRightContent = this.getRightContent.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    getLeftContent(){
        return [
            <CustomIcon type="MdDehaze" key="0" sizes="lg" className="am-icon-left" />
        ];
    }

    getRightContent(){
        return [
            <CustomIcon type="FaUser" roots="FontAwesome" sizes="lg" key="0" className="am-icon-right"  onClick={this.onOpenChange.bind(this, 'mypage')}/>
        ]
    }

    onClick(e){
        e.preventDefault();
        return this.props.move(path.main);
    }


    onOpenChange(target = null){
        const state = `${target}`;

        this.props.onOpenChange(state);
    }

    render() {

        return (
            <div className="header-container">
                <NavBar
                    mode="light"
                    className="header-wrap"
                    onLeftClick={this.onOpenChange.bind(this, 'menu')}
                    leftContent={this.getLeftContent()}
                    rightContent={this.getRightContent()}
                >
                    <a onClick={this.onClick}><img src={imgLogo} alt="logo" /></a>
                </NavBar>
            </div>
        );
    }

}

export default connect(null, mapDispatchProps)(HeaderContainer);
