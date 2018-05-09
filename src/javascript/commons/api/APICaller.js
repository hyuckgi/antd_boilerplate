import axios from 'axios';

const config = {
	debug : false,
	caching: false,
	offlineMode : false,
	healthCheckTime : 10000,
	hostName: null
}

const getAPIHost = () => {
	if (process.env.NODE_ENV === 'development') {
		if (config.hostName) {
			return config.hostName;
		}
		return 'http://server.local.danbi:8080';
	} else if (process.env.NODE_ENV === 'test') {
		return '';
	} else {
		return '';
	}
};

const APIHost = getAPIHost();

axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const getMakeURL = (url) => {
	const postfix = url.substr(0, 1) === '/' ? '' : '/';
	const prefix = url.indexOf('http') === 0 ? '' : APIHost;
	return `${prefix}${url}${postfix}`;
};

const convertCamel = (str) => (str.replace(/_([a-z])/g, (m, w) => w.toUpperCase()));
const convertUnderscore = (str) => str.replace(/([a-z])([A-Z])/g, (text, p1, p2) => p1 + '_' + p2.toLowerCase());
const isObject = (val) => {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
};

const makeMapper = (item, isCamelcase = true) => {
    if(!item) { return {};}
    const keys = Object.keys(item);
    const mappingObj = Object.keys(item).reduce((obj, key) => {
        if(isCamelcase) {
            // obj[key] = key.replace(/_([a-z])/g, (m, w) => w.toUpperCase());
            obj[key] = convertCamel(key);
        } else {
            obj[key] = convertUnderscore(key);
        }
        return obj;
    }, {});
    return { keys, mappingObj };
};
const exceptionList = ['contentsStepInfo', 'contentsStepCount', 'PostCategoryTag', 'PostAgeTag', 'PostAttributeTag'];
const convertObject = (item, mapper, isCamelcase = true) => {
	const defaultObj = {};
	if(!isObject(item)) {
	    return item;
    }
	if(item.id) {
		defaultObj.key = item.id;
	}
	if(!mapper) {
	    mapper = makeMapper(item, isCamelcase);
    }
    return mapper.keys.reduce((obj, key) => {
        const newKey = mapper.mappingObj[key];
        // Worst case, LCMS 미디어 정보 관련
        if(!isCamelcase && exceptionList.find(item => item === key)) {
        	obj[key] = item[key];
        	return obj;
		}
        if(item[key]) {
            if(Array.isArray(item[key])) {
                item[key] = convertList(item[key], null, isCamelcase);
            } else if(isObject(item[key])) {
                item[key] = convertObject(item[key], null, isCamelcase);
            }
        }
        if(!obj[newKey]) {
            obj[newKey] = item[key];
        }
        return obj;
    }, defaultObj);
};
const convertList = (list, mapper, isCamelcase = true) => {
    return list.map(item => {
    	// 예외 케이스가 많아 그때마다 mapper 생성
        mapper = makeMapper(item, isCamelcase);
        return convertObject(item, mapper, isCamelcase);
    });
};
const docsToCamelCase = (docs, params = {}) => {
    let mapper = undefined;
    let data = docs.data;
    if(!data) {
        return docs;
    }
    mapper = makeMapper(data);
    data = convertObject(data, mapper);

    if(Array.isArray(data.results)) {
        data.results = data.results.map((item, inx) => {
            item.inx = (inx + 1) + (params.offset || 0);
            return item;
        });
    }

    docs.data = data;
    return docs;
};

const paramsToUnderscore = (params = {}) => {
    let mapper;
    const isCamelcase = false;
    if(params instanceof FormData) {
        return params;
    }
    return convertObject(params, makeMapper(params, isCamelcase), isCamelcase);
};

const jsonToParams = (obj = {}) => {
    return Object.keys(obj).reduce((str, key) => {
        str += ((str === '' ? '' : '&') + key + '=' + obj[key]);
        return str;
    }, '');
}

class APIMonitor {
	static initialize() {
		this._errorTime = null;
		this._isLive = true;

		this.timerGate();
	}

	static timerGate() {
		if (this.instanceTimer) {
			clearTimeout(this.instanceTimer);
			this.instanceTimer = undefined;
		}
		this.instanceTimer = setTimeout(() => {
			this.instanceTimer = undefined;
			APIMonitor.timerHealthCheck();
		}, config.healthCheckTime);
	}
	static timerHealthCheck() {
		if (config.caching === true) {
			const fullUrl = getMakeURL('/health.txt');
			axios.get(fullUrl)
				.then((response) => {
					this._isLive = true;
					return true;
				})
				.catch((e) => {
					if (e.message === 'Network error') {
						this._isLive = false;
						this.networkError();
					}
					return false;
				})
				.then((result) => {
					this.timerGate();
				});
		}
	}
	static networkError() {
		this._errorTime = Date.now();
		this._isLive = false;
	}

	static get isLive() {
		return this._isLive;
	}

	static defaults = {
		set healthCheckTime(value) {config.healthCheckTime = value;}
	}
}

class APICaller {
	static post(url, params = {}, options = {}) {
		const fullUrl = getMakeURL(url);
		return axios.post(fullUrl, paramsToUnderscore(params), options).then(docsToCamelCase);
	}
	static get(url, params = null,  isNoWarning = false) {
		const fullUrl = getMakeURL(url);

		const str = jsonToParams(paramsToUnderscore(params));
		if(isNoWarning){
			const instance = axios.create();
			return instance.get(fullUrl + (str === '' ? '' : '?') + str)
		}
		return axios.get(fullUrl + (str === '' ? '' : '?') + str)
			.then((response)=> {
				return response;
			})
			.then(docs => docsToCamelCase(docs, params));
	}
	static all(list) {
		return axios.all(list)
            .then(axios.spread(function(...response) {
			    return {...response};
		    }));
	}
	static defaults = {
		set debug(value) { config.debug = value; },
		get debug() { return config.debug },

		set caching(value) {
			if (config.offlineMode === false) {
				config.caching = value;
			} else {
				config.caching = true;
			}
			if (config.caching === true) {
				APIMonitor.initialize();
			}
		},
		get caching() { return config.caching; },

		set offlineMode(value) {
			config.offlineMode = value;
			if (value === true) {
				this.defaults.caching = true;
			}
		},
		get offlineMode() { return config.offlineMode; },

		set timeout(value) { axios.defaults.timeout = value; },
		get timeout() { return axios.defaults.timeout; },

		set hostName(value) { config.hostName = value;},
		get hostName() { return APIHost}
    };
    static upload(file) {
        const options = {headers: getCSRFToken(), 'content-type': 'multipart/form-data', withCredentials: true}

        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('model_type', 3);

        return APICaller.post('/aux/files/', formData, options);
    }
}

// if (process.env.NODE_ENV !== 'production') {
if (true) {
	axios.interceptors.request.use(
		(req) => {
			if (config.debug === true) {
				console.log('%c Request:', 'color: #4CAF50; font-weight: bold', req);
			}
			return req;
		},
		(err) => {
			if (config.debug === true) {
				console.log('%c Request:', 'color: #EC6060; font-weight: bold', err);
			}
			return Promise.reject(err);
		}
	);
	axios.interceptors.response.use(
		(res) => {
			if (config.debug === true) {
				console.log('%c Response:', 'color: #3d62e5; font-weight: bold', res);
			}
			return res;
		},
		(err) => {
			if (config.debug === true) {
				console.log('%c Response:', 'color: #EC6060; font-weight: bold', err);
			}
			return Promise.reject(err);
		}
	);
}

const getCSRFToken = () => {
    let token;
    for (let cookie of document.cookie.split('; ')) {
        let [name, value] = cookie.split("=");
        if(name === 'XSRF-TOKEN') {
            token = decodeURIComponent(value);
            break;
        }
    }
    return {'X-CSRFToken' : token};
};

const upload = {
    getProps : (fileList) => ({
        action: `${APIHost}/aux/files/`,
        headers: getCSRFToken(),
        data: {model_type: 3},
        withCredentials: true,
        defaultFileList : [...fileList]
    }),
    convertObject
};

export default APICaller
export {APIMonitor, APICaller, APIHost, axios, upload}
