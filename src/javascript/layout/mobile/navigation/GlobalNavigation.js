import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Tabs, WhiteSpace } from 'antd-mobile';
import { Sticky } from 'react-sticky';

import { service } from '../../../commons/configs';

const mapStateToProps = ({fetch}) => {
    return {
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location))
});


class GlobalNavigation extends React.Component {

    constructor(props) {
        super(props);

        this.renderTabBar = this.renderTabBar.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderSubTabBar = this.renderSubTabBar.bind(this);
        this.moveTab = this.moveTab.bind(this);
        this.onSwipe = this.onSwipe.bind(this);
        this.onChildChange = this.onChildChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.swipeObj !== this.props.swipeObj){
            return this.onSwipe(this.props.swipeObj);
        }
    }

    globalSwipe(direction){
        const { globalMenu, currentMenu } = this.props;
        const globalIndex = currentMenu.idx;
        let swipe = {};

        switch (direction) {
            case 'next':
                if((globalIndex + 1) > (globalMenu.length - 1)){
                    swipe = globalMenu[0];
                }else{
                    swipe = globalMenu[globalIndex + 1];
                }
                break;

            case 'prev':
                if(globalIndex === 0){
                    swipe = globalMenu[globalMenu.length - 1];
                }else{
                    swipe = globalMenu[globalIndex - 1];
                }
                break;

            default:
                break;

        }
        return this.moveTab(swipe);
    }

    localSwipe(direction){
        const { subMenu, globalMenu, currentMenu, currentPath } = this.props;
        const globalIndex = currentMenu.idx;
        const subIndex = subMenu.findIndex(item => item.link === currentPath);

        let swipe = {};

        switch (direction) {
            case 'next':
                if((subIndex + 1) > (subMenu.length - 1)){
                    const idx = (globalIndex + 1) > (globalMenu.length - 1) ? 0 : (globalIndex + 1);
                    swipe = globalMenu[idx];
                }else{
                    swipe = subMenu[subIndex + 1];
                }
                break;

            case 'prev':
                if(subIndex === 0){
                    const idx = (globalIndex === 0) ? (globalMenu.length - 1) : (globalIndex - 1);
                    swipe = globalMenu[idx];
                }else{
                    swipe = subMenu[subIndex - 1];
                }
                break;
            default:
                break;
        }
        return this.moveTab(swipe);
    }

    onSwipe(swipeObj){
        const { subMenu, isGlobalMenu } = this.props;
        const moveStatus = service.getValue(swipeObj, 'moveStatus', false);

        if(!moveStatus || !isGlobalMenu){
            console.log("exept");
            return;
        }

        if(Math.abs(parseInt(moveStatus.x, 10)) < (window.innerWidth / 3)){
            return;
        }

        if(swipeObj.direction === 2){
            if(subMenu){
                return this.localSwipe('next');
            }
            return this.globalSwipe('next');
        }else if(swipeObj.direction === 4){
            if(subMenu){
                return this.localSwipe('prev');
            }
            return this.globalSwipe('prev');
        }
        return;
    }


    renderTab(layout){
        return(
            <span className={`navigation-menu-1depth navigation-menu ${layout.id === '4000000' ? 'prewarp' : '' }`}>{layout.name}</span>
        );
    }

    onChildChange(layout, idx){
        return this.moveTab(layout);
    }

    onChange(layout){
        return this.moveTab(layout);
    }

    moveTab(layout){
        const link = service.getValue(layout, 'defaultLink', false) || service.getValue(layout, 'link', '/');
        return this.props.move(link);
    }

    renderSubTabBar(props){
        return(
            <Tabs.DefaultTabBar
                {...props}
                renderTab={tab => <span className="navigation-menu">{tab.name}</span>}
            />
        );
    }

    renderSubTab(subMenu){
        const { currentPath } = this.props;
        const subIndex = subMenu.findIndex(item => item.link === currentPath);

        return(
            <div className="sub-navigations" >
                <WhiteSpace size="xs" className="white-space" style={{backgroundColor:'#f5f5f5'}}/>
                <Tabs
                    tabs={subMenu}
                    page={subIndex}
                    swipeable={false}
                    onChange={this.onChildChange}
                    renderTabBar={this.renderSubTabBar}
                    prerenderingSiblingsNumber={0}
                    destroyInactiveTab={true}
                />
            </div>
        );
    }

    renderTabBar(props) {
        const { subMenu } = this.props;

        return (
            <Sticky topOffset={70}>
                {({style}) => {
                    return(
                        <div style={{...style, zIndex: 1 }} >
                            <div className="global-navigations">
                                <Tabs.DefaultTabBar
                                    {...props}
                                    renderTab={tab => this.renderTab(tab)}
                                />
                            </div>
                            {subMenu ? this.renderSubTab(subMenu) : null}
                        </div>
                    );
                }}
            </Sticky>
        );
    }

    render() {
        const { globalMenu, currentMenu, children, isGlobalMenu } = this.props;

        return (
            <Tabs
                tabs={globalMenu}
                page={isGlobalMenu ? currentMenu.idx : null}
                onChange={this.onChange}
                renderTabBar={this.renderTabBar}
                swipeable={false}
                prerenderingSiblingsNumber={0}
                destroyInactiveTab={true}
            >
                {children}
            </Tabs>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(GlobalNavigation);
