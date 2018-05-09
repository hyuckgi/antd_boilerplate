export const api = {
    logout : () => ('/account/auths/logout/'),
    authenticate : () => ('/account/auths/authenticate/'),
    login : (authId) => (`/account/auths/${authId}/login_actor/`)
};

export default api;
