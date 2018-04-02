import {code as creator}  from '../creators';
import { APICaller } from 'wink_mobile_commons/dist/api';

export const tag = (cookies) => {
    return (dispatch) => {
        const list = [
            {id: 'tag', url: '/aux/tags/?model_type__in=1,2,3,4,5,6,7,8,9,11,12&limit=1000&offset=0', params: {}},
            {id: 'workType', url: '/issue/work_types/?limit=200', params: {}},
            {id: 'K_M_E', url: '/aux/tag_types/SubjectTag/get_named/', params: {name: '한글・수학・영어'}},
            {id: 'K_M', url: '/aux/tag_types/SubjectTag/get_named/', params: {name: '한글・수학'}},
            {id: 'E', url: '/aux/tag_types/SubjectTag/get_named/', params: {name: '영어'}},
            {id: 'E_S', url: '/aux/tag_types/SubjectTag/get_named/', params: {name: '스토리영어'}},
            {id: 'E_P', url: '/aux/tag_types/SubjectTag/get_named/', params: {name: '파닉스'}},
        ];
        return APICaller.all(list.map(item => APICaller.get(item.url, item.params)))
            .then(docs => {
                const data = Object.keys(docs).reduce((result, key) => {
                    result[list[key].id] = docs[key].data.results || docs[key].data;
                    return result;
                }, {});
                dispatch(creator.code(data));
            })
            .then(docs => dispatch(creator.codeEnd()));
    };
};
