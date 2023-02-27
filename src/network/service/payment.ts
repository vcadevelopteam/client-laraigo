import { APIManager } from '../manager';
import { apiUrls } from '../../common/constants';

export function niubizAuthorizeTransaction(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_NIUBIZ_AUTHORIZETRANSACTION, { data: request }, true);
}

export function niubizCreateSessionToken(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_NIUBIZ_CREATESESSIONTOKEN, { data: request }, true);
}