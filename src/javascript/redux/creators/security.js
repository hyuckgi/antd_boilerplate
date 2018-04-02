import {security as type} from '../types';

export const loginRequest = () => {
    return {
        type: type.LOGIN_REQUEST
    }
};
export const loginAuth = (params) => {
    return {
        type: type.LOGIN_AUTH,
        payload: params
    };
};

export const loginSuccess = (params) => {
    return {
        type: type.LOGIN_SUCCESS,
        payload: params
    };
};

export const loginFail = () => {
    return {
        type: type.LOGIN_FAIL
    }
};
export const logout = () => {
    return {
        type: type.LOGOUT
    }
};

// TODO: 화면 refesh 할 때, SessionService 에서 정보를 가져오는 것 필요함.
