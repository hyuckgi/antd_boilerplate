import {fetch as creator} from '../creators';
import {APICaller} from '../../commons/api';

export const reset = () => {
    return (dispatch) => {
        return new Promise(resolve => {
            dispatch(creator.get({}));
            resolve();
        });
    };
};

export const resetList = () => {
    return (dispatch) => {
        return new Promise(resolve => {
            dispatch(creator.list({}));
            resolve();
        });
    };
};

export const resetMultipleList = () => {
    return (dispatch) => {
        return new Promise(resolve => {
            dispatch(creator.resetMultipleList({}));
            resolve();
        });
    };
};

export const get = (url, params = {}, isNoWarning = false) => {
    return (dispatch, getState) => {
        dispatch(creator.fetchStart());
        return APICaller.get(url, params, isNoWarning)
            .then(({data}) => {
                dispatch(creator.get(data));
            })
            .then(docs => dispatch(creator.fetchEnd()));
    };
};

export const list = (url, params = {}) => {
    return (dispatch) => {
        dispatch(creator.fetchStart());
        return APICaller.get(url, params)
            .then(({data}) => {
                dispatch(creator.list(data));
            })
            .then(docs => dispatch(creator.fetchEnd()));
    };
};

export const update = (url, params = {}) => {
    return (dispatch) => {
        dispatch(creator.postStart());
        return APICaller.post(url, params)
            .then(({data}) => dispatch(creator.update(data)))

            .then(docs => dispatch(creator.postEnd()));
    }
};

export const simpleUpdate = (url, params = {}, isPlain = false, notToConvert = false) => {
    return (dispatch) => {
        dispatch(creator.postStart());
        return APICaller.post(url, params, {}, isPlain, notToConvert)
            .then(docs => dispatch(creator.postEnd()));
    }
};

export const silentUpdate = (url, params) => {
    return (dispatch) => {
        return APICaller.post(url, params)
            .then(({data}) => dispatch(creator.update(data)))
    }
};

export const simpleSilentUpdate = (url, params) => {
    return (dispatch) => {
        return APICaller.post(url, params);
    }
};

export const deleteItem = (url, params = {}) => {
    return (dispatch) => {
        dispatch(creator.postStart());
        return APICaller.post(url, params)
            .then(({data}) => dispatch(creator.deleteItem()))
            .then(docs => dispatch(creator.postEnd()));
    }
};

export const multipleList = (list) => {
    return (dispatch, getState) => {
        dispatch(creator.fetchStart());
        return APICaller.all(list.map(item => APICaller.get(item.url, item.params)))
            .then(docs => {
                 const data = Object.keys(docs).reduce((result, key) => {
                    result[list[key].id] = docs[key].data;
                    return result;
                 }, {});
                 dispatch(creator.multipleList(data));
            })
            .then(docs => dispatch(creator.fetchEnd()));
    };
};

export const silentMultipleList = (list) => {
    return (dispatch) => {
        return APICaller.all(list.map(item => APICaller.get(item.url, item.params)))
            .then(docs => {
                 const data = Object.keys(docs).reduce((result, key) => {
                    result[list[key].id] = docs[key].data;
                    return result;
                 }, {});
                 dispatch(creator.multipleList(data));
            });
    };
};

export const updateMultipleList = (list, isPlain) => {
    return (dispatch, getState) => {
        dispatch(creator.postStart());
        return APICaller.all(list.map(item => APICaller.post(item.url, item.params, {}, isPlain)))
            .then(docs => {
                const data = Object.keys(docs).reduce((result, key) => {
                    result[list[key].id] = docs[key].data;
                    return result;
                }, {});
                dispatch(creator.updateMultipleList(data));
            })
            .then(docs => dispatch(creator.postEnd()));
    };
};

export const silentUpdateMultipleList = (list, isPlain) => {
    return (dispatch) => {
        return APICaller.all(list.map(item => APICaller.post(item.url, item.params, {}, isPlain)))
            .then(docs => {
                const data = Object.keys(docs).reduce((result, key) => {
                    result[list[key].id] = docs[key].data;
                    return result;
                }, {});
                dispatch(creator.updateMultipleList(data));
            });
    };
};

export const updateList = (list, isPlain) => {
    return (dispatch, getState) => {
        dispatch(creator.postStart());
        return APICaller.all(list.map(item => APICaller.post(item.url, item.params, {}, isPlain)))
            .then(docs => {
                dispatch(creator.updateList(Object.keys(docs).map(key => docs[key].data)));
            })
            .then(docs => dispatch(creator.postEnd()));
    }
};

export const simpleSilentUpdateList = (list, isPlain) => {
    return (dispatch, getState) => {
        return APICaller.all(list.map(item => APICaller.post(item.url, item.params, {}, isPlain)))
    }
};

export const postErrorEnd = (message) => {
    return (dispatch) => {
        dispatch(creator.postErrorEnd(message));
    }
};
