import React from 'react';
import { connect } from 'react-redux';
import { StickyContainer } from 'react-sticky';

import { DesktopLayout, MobileLayout } from './commons/components/response';

import Mobile from './Mobile';
import Web from './Web';

const mapStateToProps = ({ fetch }) => ({
    spinning : fetch.isFetching || fetch.isPosting,
});

const mapDispatchProps = dispatch => ({
    // initialize: () => dispatch(action.tag()),
});


class App extends React.Component {

    componentDidMount() {
        // this.props.initialize();
    }

    render() {
        return (
            <div className="app-container">
                <DesktopLayout>
                    <Web {...this.props}/>
                </DesktopLayout>
                <MobileLayout>
                    <Mobile {...this.props}/>
                </MobileLayout>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(App);
