import { APICaller } from '../../api';
import { api } from './'

export default class SecurityService {

    static logout() {
        return APICaller.post(api.logout());
    }

    static authenticate(params) {
        return APICaller.post(api.authenticate(), params)
            .then(({data}) => {
                return {authId: data.id, humanName : data.humanName, isAdmin: data.isAdmin, userName : data.username};
            });
    }

    static actorLogin({authId, actorType}) {
        return APICaller.post(api.login(authId), {actor_type: actorType})
            .then(({data}) => {
                return {
                    actor : data,
                }
            });
    }
}
