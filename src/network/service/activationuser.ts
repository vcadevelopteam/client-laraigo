import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function postActivationUser(token: string) {
    const data = { token };
    return APIManager.post(apiUrls.ACTIVATION_USER, { data }, false);
}
