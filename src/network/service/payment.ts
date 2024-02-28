import { APIManager } from '../manager';
import { apiUrls } from '../../common/constants';

export function niubizAuthorizeTransaction(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_NIUBIZ_AUTHORIZETRANSACTION, { data: request }, true);
}

export function niubizCreateSessionToken(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_NIUBIZ_CREATESESSIONTOKEN, { data: request }, true);
}

export function openpayGetPaymentOrder(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_OPENPAY_GETPAYMENTORDER, { data: request }, true);
}

export function openpayProcessTransaction(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_OPENPAY_PROCESSTRANSACTION, { data: request }, true);
}

export function izipayGetPaymentOrder(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_IZIPAY_GETPAYMENTORDER, { data: request }, true);
}

export function izipayProcessTransaction(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_IZIPAY_PROCESSTRANSACTION, { data: request }, true);
}

export function epaycoGetPaymentOrder(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_EPAYCO_GETPAYMENTORDER, { data: request }, true);
}

export function epaycoProcessTransaction(request: any) {
    return APIManager.post(apiUrls.PAYMENTORDER_EPAYCO_PROCESSTRANSACTION, { data: request }, true);
}