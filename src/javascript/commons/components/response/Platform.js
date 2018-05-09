import React from 'react';
import Responsive from 'react-responsive';

const DesktopLayout = (props) => {
    return (<Responsive {...props} minWidth={768} />);
}

const MobileLayout = (props) => {
    return (<Responsive {...props} maxWidth={767} />);
}

export {
    DesktopLayout,
    MobileLayout,
}
