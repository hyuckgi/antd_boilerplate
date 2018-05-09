import React from 'react';
import { connect } from 'react-redux';

import { service } from '../../commons/configs';

import { GlobalNavigation, SubNavigation } from '../mobile';

const mobileLayout = [
    {id: '100', name: '홈',  level: 0,  link:'/main', defaultLink: '/main', idx : 1},
]

const mapStateToProps = ({layout, router}) => {
    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, []).concat(mobileLayout);

    const globalMenu = service.getValue(layout, 'list', []).filter(item => item.level === 0).concat(mobileLayout);
    const currentPath = service.getValue(router, 'location.pathname', "/main");
    console.log("currentPath", currentPath);
    const currentMenu = allMenu.filter(item => item.link === currentPath).find(item => item);

    const isGlobalMenu = globalMenu.some(item => item.id === service.getValue(currentMenu, 'id', 0));
    const subMenu = isGlobalMenu && service.getValue(currentMenu, 'defaultLink', false)
        ? allMenu.filter(item => item.parent ===  currentMenu.id)
        : false;

    return {
        currentPath,
        globalMenu,
        currentMenu,
        isGlobalMenu,
        subMenu
    }
};

class MobileWrapper extends React.Component {

    render() {
        const { isGlobalMenu } = this.props;

        return (
            <div className="wrapper-container">
                {isGlobalMenu ? (<GlobalNavigation {...this.props}/>) : (<SubNavigation {...this.props} />)}
            </div>
        );
    }

}

export default connect(mapStateToProps)(MobileWrapper);
