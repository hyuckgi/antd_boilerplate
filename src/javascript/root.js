import '../stylesheet/root.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';

import UAParser from 'ua-parser-js';

import { path as commonPath } from './commons/configs';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { ConnectedRouter as Router, routerReducer, routerMiddleware } from 'react-router-redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import { createBrowserHistory } from 'history';
import * as reducers from './redux/reducers';

import App from './App';
import Web from './Web';

import registerServiceWorker from './registerServiceWorker';

import { Page404, Page500 } from './layout';

const parser = new UAParser();

const history = createBrowserHistory({});

const middleware = routerMiddleware(history);
const loggerMiddleware = createLogger({
    collapsed: (getState, action, logEntry) => true
});

const store = createStore(
    combineReducers({
        ...reducers,
        router: routerReducer
    }),
    applyMiddleware(
        middleware,
        thunkMiddleware,
        loggerMiddleware
    )
);

const Root = () => {

    const type = parser.getDevice().type;

    console.log("tes", type);

    return (
        <Provider store={store}>
            { type === 'mobile' ? <App history={history} /> : <Web history={history}/> }
        </Provider>
    );
};


ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
