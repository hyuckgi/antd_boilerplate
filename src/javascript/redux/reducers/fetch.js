import {fetch as type} from '../types';

const initialState = {
    isFetching: false,
    isPosting: false,
    item: {},
    list: [],
    multipleList: {}
};

const update = (list, item) => {
    const inx = list.findIndex(target => target.id === item.id), len = list.length;

    return [...list.splice(0, inx), item, ...list.splice(1, len - inx - 1)];

}

export const fetch = (state = initialState, action) => {
    switch(action.type)	 {
        case type.FETCH_START:
            return {
                ...state,
                isFetching: action.payload.isFetching
            };
        case type.FETCH_END:
            return {
                ...state,
                isFetching: action.payload.isFetching
            };
        case type.POST_START:
            delete state.error;
            return {
                ...state,
                isPosting: action.payload.isPosting
            };
        case type.POST_END:
            return {
                ...state,
                isPosting: action.payload.isPosting
            };
        case type.POST_ERROR_END:
            return {
                ...state,
                error: action.payload.error,
                isPosting: action.payload.isPosting
            };
        case type.GET:
            return {
                ...state,
                item: action.payload.item
            };
        case type.LIST:
            return {
                ...state,
                list: action.payload.list
            };
        case type.MULTIPLE_LIST:
            return {
                ...state,
                multipleList: {...state.multipleList, ...action.payload.item}
            };
        case type.UPDATE_MULTIPLE_LIST:
            return {
                ...state,
                multipleList: {...state.multipleList, ...action.payload.item}
            };
        case type.RESET_MULTIPLE_LIST:
            return {
                ...state,
                multipleList: {}
            };
        case type.UPDATE:
            return {
                ...state,
                // list: update(state.list, action.payload.item),
                item: action.payload.item
            };
        case type.UPDATE_LIST:
            const list = action.payload.list.reduce((list, item) => update(list, item), state.list);
            return {
                ...state,
                list,
            };
        case type.DELETE:
            return {
                ...state,
                // list: update(state.list, action.payload.item),
                item: {}
            };

        default:
            return state;
    }
}
