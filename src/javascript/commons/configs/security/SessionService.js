const StorageKey = 'SESSION_INFO';

class SessionService {
    // private //
    static __userInfo = null;

    static get isLogin() { return this.userInfo !== null };

    static get userInfo() {
        if (this.__userInfo === null) {
            var userData = sessionStorage.getItem(StorageKey);
            if (userData !== null ) {
                this.__userInfo = JSON.parse(userData);
            }
        }
        return this.__userInfo;
    };

    static login(params) {
        this.__userInfo = {...params};
        sessionStorage.setItem(StorageKey, JSON.stringify(this.__userInfo));
    };

    static logout() {
        sessionStorage.clear();
        this.__userInfo = null;
    };
}

export default SessionService;
