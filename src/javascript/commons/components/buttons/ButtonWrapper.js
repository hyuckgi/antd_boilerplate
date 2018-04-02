import React from 'react';
import PropTypes from 'prop-types';

import { Button, Flex } from 'antd-mobile';

class ButtonWrapper extends React.Component {

    onClickButton(item, e){
        e.preventDefault();
        return this.props.onClickButton(item.id);
    }

    renderButton(){
        const { buttons } = this.props;

        return buttons.map((item, idx) => {
            return (
                <Button key={idx} type={item.type || 'primary'} size={item.size || 'small'} inline={item.inline || true} {...item} onClick={this.onClickButton.bind(this, item)}>{item.label}</Button>
            );
        });
    }

    render() {
        return (
            <Flex justify="center" className="button-wrapper" >
                <Flex.Item >
                    {this.renderButton()}
                </Flex.Item>
            </Flex>
        );
    }

}

ButtonWrapper.propTypes = {
    buttons : PropTypes.array.isRequired,
    onClickButton : PropTypes.func.isRequired,
};

ButtonWrapper.defaultProps = {

};

export default ButtonWrapper;
