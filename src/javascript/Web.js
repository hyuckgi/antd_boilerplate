import React from 'react';
import { connect } from 'react-redux';

import { Layout, BackTop, Icon, notification } from 'antd';
import { StickyContainer } from 'react-sticky';

import { Spinner, WrapperContainer } from './layout';
import { HeaderContainer } from './layout/web';



notification.config({placement: 'topRight'});

const { Content } = Layout;

const mapStateToProps = ({ fetch }) => ({
    // spinning : fetch.isFetching || fetch.isPosting,
    // show: !fetch.isPosting,
    // error: fetch.error
});

const mapDispatchProps = dispatch => ({
    // initialize: (cookies) => dispatch(action.tag(cookies)),
});

class Web extends React.Component {

    render() {
        return (
            <Spinner spinning={this.props.spinning} tip={'Loading...'} >
                <StickyContainer>
                    <Layout className="web-container">
                        <HeaderContainer {...this.props}/>

                        <Content className="section">
                            
                            <WrapperContainer />
                        </Content>
                    </Layout>
                </StickyContainer>
            </Spinner>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Web);
