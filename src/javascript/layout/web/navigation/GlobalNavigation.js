import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';

import { Menu } from 'antd';
import { layout as action } from '../../../redux/actions';
import { service } from '../../../commons/configs';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const mapStateToProps = ({ layout, router, security}) => {
    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, []);

    const globalMenu = service.getValue(layout, 'list', []).filter(item => item.level === 0);
    const currentPath = service.getValue(router, 'location.pathname', "/main");
    const currentMenu = globalMenu.filter(item => item.link.indexOf(currentPath.split("/")[1]) === 1).find(item => item);

    return {
        globalMenu,
        currentMenu,
        allMenu
    }
};

const mapDispatchProps = dispatch => ({
    masterLevel1 : () => dispatch(action.masterLevel1()),
    masterLevel2 : () => dispatch(action.masterLevel2()),
    masterLevel3 : () => dispatch(action.masterLevel3()),
});

class GlobalNavigation extends React.Component {

    componentDidMount(prevProps) {
        // this.props.masterLevel1();
    }

    renderChild(menu){
        const { allMenu } = this.props;

        return allMenu.filter(item => item.parent === menu.id).map((item, idx) => {
            if(item.hasChild){
                return this.renderSubMenu(item);
            }
            return(
                <Menu.Item key={idx}>
                    <NavLink to={item.link} activeClassName="selected">{item.name}</NavLink>
                </Menu.Item>
            );
        })
    }

    renderSubMenu(menu, opt = null){
        if(!menu){
            return;
        }
        const { currentMenu } = this.props;
        const width = opt ? opt.width : 100;
        const crruent = currentMenu && menu.id === currentMenu.id ? 'on' : ''

        return(
            <SubMenu key={menu.id}  title={menu.name} style={{width : `${width}%`}} className={`${crruent}`}>
                {this.renderChild(menu)}
            </SubMenu>
        )
    }

    render() {
        const { globalMenu } = this.props;

        return(
            <Menu mode="horizontal" className="global-navigation" multiple={true}>
                {globalMenu.map(menu => {
                    const width = 100 / globalMenu.length;
                    return this.renderSubMenu(menu, {width : width})
                })}
            </Menu>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(GlobalNavigation);
