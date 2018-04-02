import {code as type} from '../types';

const initialState = {
    isInitializing: false,
    isInitialized: false
};

const flatten = (list) => {
    return list.reduce((flat, target) => {
        return flat.concat(Array.isArray(target.members) ? flatten(target.members) : target)
    }, list);
};
const getValues = (item) => {
    return flatten(item.members)
        .reduce((result, member) => {
            if(member) {
                result[member.name] = member.id;
            }
            return result;
        }, {});
};
const getOptions = (target) => {
    if(!Array.isArray(target.members)) {
        return null;
    }
    return target.members.map(item => {
        let result = {value: item.id + '', label: item.name};
        let children = getOptions(item);
        if(children) {
            result.children = children;
        }
        return result;
    });
};

const getTag = (list) => {
    return list.filter(item => item.sdata && item.sdata.hierachy && item.sdata.hierachy.members)
        .map(item => item.sdata.hierachy)
        .reduce((obj, item) => {
            item.values = getValues(item);
            item.options = getOptions(item);
            obj[item.name] = item;
            return obj;
        }, {});
};

const getWorkType = (list) => {
    return list.filter(item => item.id < 0 || (item.name && item.data && Array.isArray(item.data.routes)))
        .map(item => ({
            id: item.id,
            name: item.name,
            routes: item.data ? item.data.routes : []
        }))
        .reduce((obj, item) => {
            obj[item.id] = item;
            return obj;
        }, {});
};

const getSubject = (code) => {
    return {
        'K_M_E': code['K_M_E'].id,
        'K_M': code['K_M'].id,
        'E': code['E'].id,
        'E_P': code['E_P'].id,
        'E_S': code['E_S'].id,
    }
};

export const code = (state = initialState, action) => {
    switch(action.type)	 {
        case type.CODE_START:
            return {
                ...state,
                ...action.payload
            };
        case type.CODE_END:
            return {
                ...state,
                ...action.payload
            };
        case type.TAG:
            return {
                ...state,
                tag: getTag(action.payload.list)
            };
        case type.CODE:
            return {
                ...state,
                tag: getTag(action.payload.code.tag),
                workType: getWorkType(action.payload.code.workType),
                subject: getSubject(action.payload.code),
            };
        default:
            return state;
    }
}
