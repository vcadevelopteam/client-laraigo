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

export function paymentOrder(request: any) {
    const uri = `${apiUrls.PAYMENTORDER_PAY}`;
    return APIManager.post(uri, { data: request }, true);
}

export function balance(request: any) {
    const uri = `${apiUrls.CULQI}/createbalance`;
    return APIManager.post(uri, { data: request }, true);
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

export function emitInvoice(request: any) {
    return APIManager.post(apiUrls.BILLINGEMITINVOICE, { data: request }, true);
}

export function cardCreate(request: any) {
    return APIManager.post(apiUrls.CARDCREATE, { data: request }, true);
}

export function cardDelete(request: any) {
    return APIManager.post(apiUrls.CARDDELETE, { data: request }, true);
}

export function cardGet(request: any) {
    return APIManager.post(apiUrls.CARDGET, { data: request }, true);
}

export function reportPdf(request: any) {
    return APIManager.post(apiUrls.BILLING_REPORTPDF, { data: request }, true);
}