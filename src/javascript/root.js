import '../stylesheet/root.less';

import React from 'react';
import UAParser from 'ua-parser-js';
import ReactDOM from 'react-dom';

import { Route, Switch } from 'react-router-dom';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { ConnectedRouter as Router, routerReducer, routerMiddleware } from 'react-router-redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import { createBrowserHistory } from 'history';
import * as reducers from './redux/reducers';

import { Page404, Page500 } from './layout';

import { LocaleProvider as LocaleProviderDesktop } from 'antd';
import { addLocaleData, IntlProvider } from 'react-intl';
import { locale } from './locales';

import registerServiceWorker from './registerServiceWorker';

import { DesktopLayout, MobileLayout } from './commons/components/response';
import { path } from './commons/configs';
import App from './App';

import { LocaleProvider as LocaleProviderMobile } from 'antd-mobile';

const parser = new UAParser();
const history = createBrowserHistory({forceRefresh: true});

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

const lang = locale.init('en-US');

addLocaleData(lang.data);

const Inner = () => {
    return(
        <IntlProvider locale={lang.locale} messages={lang.messages}>
            <Provider store={store}>
                <Router history={history}>
                    <Switch>
                        <Route exact path={path.notFound} name="notFound" component={Page404}/>
                        <Route exact path={path.serverError} name="serverError" component={Page500}/>
                        <Route path={path.home} name="home" component={App}/>
                    </Switch>
                </Router>
            </Provider>
        </IntlProvider>
    )
}

const LocaleProvider = (props) => {
    return(
        <div className="container">
            <DesktopLayout>
                <LocaleProviderDesktop locale={lang.antd}>
                    {props.children}
                </LocaleProviderDesktop>
            </DesktopLayout>
            <MobileLayout>
                <LocaleProviderMobile locale={lang.locale === 'zh-Hans-CN' ? null : lang.antd }>
                    {props.children}
                </LocaleProviderMobile>
            </MobileLayout>
        </div>
    )
}

const Root = () => {
    return (
        <LocaleProvider>
            {Inner()}
        </LocaleProvider>

    );
};


ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
