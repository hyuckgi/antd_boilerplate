import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
const { SubMenu } = Menu;

const mapStateToProps = ({ layout, router}) => {
    const pathname = router.location.pathname;
    const parentMenu = layout.list.filter(item => pathname.indexOf(item.link) === 0)[0];
    const childList = parentMenu && layout.list.filter(item => item.parent === parentMenu.id );
    const menuList = layout.list;

    return {
        menuList,
        childList,
        menu : menuList.filter(menu => menu.link === pathname)[0]
    };
}

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location))
});

class LocalNavigationBar extends React.Component {

    isSubMenu(item) {
        return item.link ? false : true;
    }

    getMenu(item) {
        return (
            <Menu.Item key={item.id}>
                <NavLink to={ item.defaultLink ? item.defaultLink : item.link } activeClassName="active" >{item.name}</NavLink>
            </Menu.Item>);
    }

    getSubMenu(target) {
        const subMenuId = target.id;
        const childMenuList = this.props.menuList.filter(item => item.parent === subMenuId);
        return (
            <SubMenu key={subMenuId} title={<span><Icon type="user" />{target.name}</span>} >
                {childMenuList.map(item => this.getMenu(item))}
            </SubMenu>
        )
    }

    render() {
        const childList = this.props.childList;
        const selectedKeys = this.props.menu ? this.props.menu.id : null;
        const openKeys = this.props.menu ? this.props.menu.parent : null;

        return (
            <Menu mode="inline" defaultSelectedKeys={[selectedKeys]} defaultOpenKeys={[openKeys]} >
                {childList && childList.map((item) => {
                    return this.isSubMenu(item) ? (this.getSubMenu(item)) : (this.getMenu(item));
                })}
            </Menu>
        );
    }
}
export default connect(mapStateToProps, mapDispatchProps)(LocalNavigationBar);
