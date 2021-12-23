import { apiUrls } from '../../common/constants';
import { APIManager } from '../manager';

export function charge(request: any) {
    if (request.invoiceid) {
        const uri = `${apiUrls.CULQI}/chargeinvoice`;
        return APIManager.post(uri, { data: request }, true);
    }
    else {
        const uri = `${apiUrls.CULQI}/charge`;
        return APIManager.post(uri, { data: request }, true);
    }
}
export function subscribe(request: any) {
    const uri = `${apiUrls.CULQI}/subscribe`;
    return APIManager.post(uri, { data: request }, true);
}
export function unsubscribe(request: any) {
    const uri = `${apiUrls.CULQI}/unsubscribe`;
    return APIManager.post(uri, { data: request }, true);
}
