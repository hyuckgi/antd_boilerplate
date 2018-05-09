import {layout as creator} from "../creators";

export const masterLevel1 = () => {
    return (dispatch) => {
        return new Promise(resolve => {
            dispatch(creator.masterLevel1());
            resolve();
        });
    };
};

export const masterLevel2 = () => {
    return (dispatch) => {
        return new Promise(resolve => {
            dispatch(creator.masterLevel2());
            resolve();
        });
    };
};

export const masterLevel3 = () => {
    return (dispatch) => {
        return new Promise(resolve => {
            dispatch(creator.masterLevel3());
            resolve();
        });
    };
};
