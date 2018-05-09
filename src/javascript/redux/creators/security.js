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

export const refreshUser = (params) => {
    return {
        type: type.REFRESH_USER,
        payload: params
    };
}
