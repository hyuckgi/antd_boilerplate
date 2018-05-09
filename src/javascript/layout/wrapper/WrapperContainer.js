import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { path } from '../../commons/configs';
import { Main } from '../../routes';

class WrapperContainer extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path={path.home} component={Main} />
                <Route path={path.main} component={Main} />
            </Switch>
        );
    }

}

export default WrapperContainer;
