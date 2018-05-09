import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';

import { path } from '../../../commons/configs';
import { CustomIcon } from '../../../commons/components';

import { NavBar } from 'antd-mobile';

const mapStateToProps = ({fetch}) => {
    return {
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
    goBack : () => dispatch(goBack())
});

class SubHeader extends React.Component {

    onLeftClick(e){
        e.preventDefault();
        const { onLeftClick } = this.props;
        if(onLeftClick){
            return onLeftClick();
        }
        return this.props.goBack();
    }

    onRightClick(e){
        e.preventDefault();
        return this.props.move(path.main);
    }

    render() {
        const { title } = this.props;

        return (
            <NavBar
             className="sub-navigations"
             mode="light"
             icon={<CustomIcon type="FaAngleLeft" roots="FontAwesome" />}
             onLeftClick={this.onLeftClick.bind(this)}
             rightContent={[
               <CustomIcon key="1" type="FaHome" roots="FontAwesome" onClick={this.onRightClick.bind(this)}/>
             ]}
           >
            <span>{title}</span>
           </NavBar>
        );
    }
}

SubHeader.propTypes = {
    title : PropTypes.string.isRequired,
    onLeftClick : PropTypes.func,
};

SubHeader.defaultProps = {
    title : ''
};

export default connect(mapStateToProps, mapDispatchProps)(SubHeader);
