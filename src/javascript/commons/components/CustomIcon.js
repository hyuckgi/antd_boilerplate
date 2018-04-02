import React from 'react';
import PropTypes from 'prop-types';

import * as Material from 'react-icons/lib/md';
import * as FontAwesome from 'react-icons/lib/fa';

// react-icons 참고 : http://gorangajic.github.io/react-icons/index.

class CustomIcon extends React.Component {

    makeFontAwesome(){
        const { type } = this.props;
        const item = FontAwesome[type];

        return this.renderIcon(item);
    }

    makeMaterial(){
        const { type } = this.props;
        const item = Material[type];

        return this.renderIcon(item);
    }

    renderIcon(Icon){
        if(!Icon){
            return(<div {...this.props} style={{display : 'none'}}></div>);
        }

        return(<Icon {...this.props} />)
    }

    getIcon(){
        const { roots } = this.props;

        switch (roots) {
            case 'FontAwesome':
                return this.makeFontAwesome();
            default:
                return this.makeMaterial();
        }
    }

    render() {
        const { sizes, className } = this.props;
        const classNames = className ? `am-icon am-icon-${sizes} ${className}` : `am-icon am-icon-${sizes}`;

        return (
            <span className={classNames}>
                {this.getIcon()}
            </span>
        );
    }

}


CustomIcon.propTypes = {
    roots : PropTypes.string.isRequired,
    type : PropTypes.string.isRequired,
    className : PropTypes.string,
    sizes : PropTypes.string
};

CustomIcon.defaultProps = {
    roots : 'Material',
    sizes : 'md',
};

export default CustomIcon;
