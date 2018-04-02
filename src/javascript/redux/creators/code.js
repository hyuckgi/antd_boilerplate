import {code as type} from '../types';

export const codeStart = () => {
    return {
        type: type.CODE_START,
        payload: {
            isInitializing: true,
        }
    }
};

export const codeEnd = () => {
    return {
        type: type.CODE_END,
        payload: {
            isInitializing: false,
            isInitialized: true
        }
    }
};

export const code = (code) => {
    return {
        type: type.CODE,
        payload: {
            code
        }
    }
};
