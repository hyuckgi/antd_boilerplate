import {fetch as type} from '../types';

export const fetchStart = () => {
    return {
        type: type.FETCH_START,
        payload: {
            isFetching: true
        }
    }
};

export const fetchEnd = () => {
    return {
        type: type.FETCH_END,
        payload: {
            isFetching: false
        }
    }
};

export const postStart = () => {
    return {
        type: type.POST_START,
        payload: {
            isPosting: true
        }
    }
};

export const postEnd = () => {
    return {
        type: type.POST_END,
        payload: {
            isPosting: false
        }
    }
};

export const postErrorEnd = (message) => {
    return {
        type: type.POST_ERROR_END,
        payload: {
            error: message,
            isPosting: false
        }
    }
};


export const get = (item) => {
    return {
        type: type.GET,
        payload: {
            item
        }
    }
};

export const list = (list) => {
    return {
        type: type.LIST,
        payload: {
            list
        }
    }
};

export const multipleList = (item) => {
    return {
        type: type.MULTIPLE_LIST,
        payload: {
            item
        }
    }
};

export const updateMultipleList = (item) => {
    return {
        type: type.UPDATE_MULTIPLE_LIST,
        payload: {
            item
        }
    }
};

export const resetMultipleList = (item) => {
    return {
        type: type.RESET_MULTIPLE_LIST,
        payload: {
            item
        }
    }
};

export const update = (item) => {
    return {
        type: type.UPDATE,
        payload: {
            item
        }
    }
};

export const updateList = (list) => {
    return {
        type: type.UPDATE_LIST,
        payload: {
            list
        }
    }
};

export const deleteItem = (item) => {
    return {
        type: type.DELETE
    }
};
