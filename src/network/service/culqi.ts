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

export function sendInvoice(request: any) {
    return APIManager.post(apiUrls.SEND_INVOICE, { data: request }, true);
}

export function createInvoice(request: any) {
    return APIManager.post(apiUrls.BILLINGCREATEINVOICE, { data: request }, true);
}

export function createCreditNote(request: any) {
    return APIManager.post(apiUrls.BILLINGCREATECREDITNOTE, { data: request }, true);
}

export function regularizeInvoice(request: any) {
    return APIManager.post(apiUrls.BILLINGREGULARIZEINVOICE, { data: request }, true);
}

export function getExchangeRate(request: any) {
    return APIManager.post(apiUrls.GETEXCHANGERATE, { data: request }, true);
}