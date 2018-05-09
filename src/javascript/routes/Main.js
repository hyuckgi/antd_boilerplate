import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { MainContainer } from '../main';

class Main extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.home} component={MainContainer}/>
                <Route path={path.main} component={MainContainer}/>
            </Switch>
        );
    }

}

export default Main;
