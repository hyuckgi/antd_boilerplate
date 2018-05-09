import axios from 'axios';

import {security as creator}  from '../creators';
import {fetch as fetchCreator}  from '../creators';
import {SecurityService} from '../../commons/configs/security';

export const errorHandler = (dispatch) => {
    axios.interceptors.response.use(response => {
        return response;
    }, (error) => {
        dispatch(fetchCreator.fetchEnd());
        dispatch(fetchCreator.postEnd());
        const {response} = error;
        if(response && response.status === 403) {
            dispatch(logout());
            // <Button onClick={() => alert('Delete', 'Are you sure???', [
            //     { text: 'Cancel', onPress: () => console.log('cancel') },
            //     { text: 'Ok', onPress: () => console.log('ok') },
            // ])}
            // >confirm</Button>
        } else if(response && response.status === 401) {
            dispatch(logout());
        } else {
            // <Button onClick={() => alert('Delete', 'Are you sure???', [
            //     { text: 'Cancel', onPress: () => console.log('cancel') },
            //     { text: 'Ok', onPress: () => console.log('ok') },
            // ])}
            // >confirm</Button>
        }

        return Promise.reject(error);
    });
};

export const login = (params) => {
    return (dispatch, getState) => {
        const actorType = getState().security.actorType;
        // 로그인 시작
        dispatch(creator.loginRequest());
        return SecurityService.authenticate(params)
            .then(({authId, humanName, isAdmin, userName}) => {
                return SecurityService.actorLogin({authId, actorType});
            })
            .then(data=> {
                dispatch(creator.loginSuccess(data));
                return data;
            })
    };
};

export const actorlogin = (authId) => {
    return (dispatch, getState) => {
        const actorType = getState().security.actorType;
        // 로그인 시작
        dispatch(creator.loginRequest());
        return SecurityService.actorLogin({authId, actorType})
            .then(data=> {
                dispatch(creator.loginSuccess(data));
                return data;
            })
    };
};

export const loginFail = () => {
    return (dispatch) => {
        dispatch(creator.loginFail());
    };
};

export const logout = () => {
    return (dispatch) => {
        dispatch(creator.logout());
    };
};
