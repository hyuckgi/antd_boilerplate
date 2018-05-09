import moment from 'moment';
// en
import antdEn from 'antd/lib/locale-provider/en_US';
import enAppLocaleData from 'react-intl/locale-data/en';
import enMessages from './translate/en.json';

// ch
import zhCN from 'antd/lib/locale-provider/zh_CN';
import zhAppLocaleData from 'react-intl/locale-data/zh';
import zhMessages from './translate/zh.json';
import 'moment/locale/zh-cn';

// ko
import koKR from 'antd/lib/locale-provider/ko_KR';
import krAppLocaleData from 'react-intl/locale-data/ko';
import krMessages from './translate/kr.json';
import 'moment/locale/ko';



export const locale = {
    init : (lang) => {
        switch (lang) {
            case 'en-US':
                moment.locale('en');
                return{
                    messages: {
                       ...enMessages,
                   },
                   antd: antdEn,
                   locale: 'en-US',
                   data: enAppLocaleData,
                }
            case 'CN':
                moment.locale('zh-cn');
                return{
                    messages: {
                        ...zhMessages,
                    },
                    antd: zhCN,
                    locale: 'zh-Hans-CN',
                    data: zhAppLocaleData,
                }
            case 'Ko':
                moment.locale('ko');
                return{
                    messages: {
                        ...krMessages,
                    },
                    antd: koKR,
                    locale: 'ko',
                    data: krAppLocaleData,
                }
            default:
                moment.locale('en');
                return{
                    messages: {
                       ...enMessages,
                   },
                   antd: antdEn,
                   locale: 'en-US',
                   data: enAppLocaleData,
                }
        }
    },
}

export default{
    locale
}
