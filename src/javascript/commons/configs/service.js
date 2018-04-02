// import moment from 'moment';

export const service = {
    getValue: (obj, key, defaultValue) => {
        if(!obj) {
            return defaultValue;
        }
        if(!key) {
            return defaultValue;
        }

        const keys = key.split('.');
        let value = obj;
        for(let inx = 0, len = keys.length ; inx < len ; inx++) {
            let newValue = value[keys[inx]];
            if(!newValue) {
                return defaultValue;
            }
            value = newValue;
        }
        return value;
    },

    getUserName : (actor) => {
        if(!Object.keys(actor).length){
            return '';
        }
        const userName = service.getValue(actor, 'authUsername', false);

        if(!userName || (userName.search('@noid') + 1)){
            return '';
        }
        const masking = service.getMasking(userName);
        return masking;
    },

    getMasking : (str, number = 5) => {
        if(!str){
            return;
        }
        const noPattern = str.slice(0, number);
        const isPattern = str.slice(number, -1).replace(/\w/g, "*");

        return `${noPattern}${isPattern}`
    },

    makeMdn : (mdn) => {
        return (mdn && mdn.indexOf('-') < 0) ? mdn.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3") : mdn;
    },

    getTimes : (gap) => {
        let time = gap;
        const ms =  ('000' + (time % 1000)).substr(-3);
        time = Math.floor(time / 1000);
        const ss = ('00' + (time % 60)).substr(-2);
        time = Math.floor(time / 60);
        const mm = ('00' + (time % 60)).substr(-2);
        time = Math.floor(time / 60);
        const hh = ('00' + (time % 60)).substr(-2);

        return {hh, mm, ss, ms};
    }
};
export default {
    service
};
