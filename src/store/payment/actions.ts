import actionTypes from "./actionTypes";

import { IActionCall } from "@types";
import { PaymentService } from "network";

export const niubizAuthorizeTransaction = (request: any): IActionCall => ({
    callAPI: () => PaymentService.niubizAuthorizeTransaction(request),
    types: {
        loading: actionTypes.PAYMENT_NIUBIZ_AUTHORIZETRANSACTION,
        success: actionTypes.PAYMENT_NIUBIZ_AUTHORIZETRANSACTION_SUCCESS,
        failure: actionTypes.PAYMENT_NIUBIZ_AUTHORIZETRANSACTION_FAILURE,
    },
    type: null,
});

export const resetNiubizAuthorizeTransaction = (): IActionCall => ({ type: actionTypes.PAYMENT_NIUBIZ_AUTHORIZETRANSACTION_RESET });

export const niubizCreateSessionToken = (request: any): IActionCall => ({
    callAPI: () => PaymentService.niubizCreateSessionToken(request),
    types: {
        loading: actionTypes.PAYMENT_NIUBIZ_CREATESESSIONTOKEN,
        success: actionTypes.PAYMENT_NIUBIZ_CREATESESSIONTOKEN_SUCCESS,
        failure: actionTypes.PAYMENT_NIUBIZ_CREATESESSIONTOKEN_FAILURE,
    },
    type: null,
});

export const resetNiubizCreateSessionToken = (): IActionCall => ({ type: actionTypes.PAYMENT_NIUBIZ_CREATESESSIONTOKEN_RESET });

export const openpayGetPaymentOrder = (request: any): IActionCall => ({
    callAPI: () => PaymentService.openpayGetPaymentOrder(request),
    types: {
        loading: actionTypes.PAYMENT_OPENPAY_GETPAYMENTORDER,
        success: actionTypes.PAYMENT_OPENPAY_GETPAYMENTORDER_SUCCESS,
        failure: actionTypes.PAYMENT_OPENPAY_GETPAYMENTORDER_FAILURE,
    },
    type: null,
});

export const resetOpenpayGetPaymentOrder = (): IActionCall => ({ type: actionTypes.PAYMENT_OPENPAY_GETPAYMENTORDER_RESET });

export const openpayProcessTransaction = (request: any): IActionCall => ({
    callAPI: () => PaymentService.openpayProcessTransaction(request),
    types: {
        loading: actionTypes.PAYMENT_OPENPAY_PROCESSTRANSACTION,
        success: actionTypes.PAYMENT_OPENPAY_PROCESSTRANSACTION_SUCCESS,
        failure: actionTypes.PAYMENT_OPENPAY_PROCESSTRANSACTION_FAILURE,
    },
    type: null,
});

export const resetOpenpayProcessTransaction = (): IActionCall => ({ type: actionTypes.PAYMENT_OPENPAY_PROCESSTRANSACTION_RESET });

export const izipayGetPaymentOrder = (request: any): IActionCall => ({
    callAPI: () => PaymentService.izipayGetPaymentOrder(request),
    types: {
        loading: actionTypes.PAYMENT_IZIPAY_GETPAYMENTORDER,
        success: actionTypes.PAYMENT_IZIPAY_GETPAYMENTORDER_SUCCESS,
        failure: actionTypes.PAYMENT_IZIPAY_GETPAYMENTORDER_FAILURE,
    },
    type: null,
});

export const resetIzipayGetPaymentOrder = (): IActionCall => ({ type: actionTypes.PAYMENT_IZIPAY_GETPAYMENTORDER_RESET });

export const izipayProcessTransaction = (request: any): IActionCall => ({
    callAPI: () => PaymentService.izipayProcessTransaction(request),
    types: {
        loading: actionTypes.PAYMENT_IZIPAY_PROCESSTRANSACTION,
        success: actionTypes.PAYMENT_IZIPAY_PROCESSTRANSACTION_SUCCESS,
        failure: actionTypes.PAYMENT_IZIPAY_PROCESSTRANSACTION_FAILURE,
    },
    type: null,
});

export const resetIzipayProcessTransaction = (): IActionCall => ({ type: actionTypes.PAYMENT_IZIPAY_PROCESSTRANSACTION_RESET });

export const epaycoGetPaymentOrder = (request: any): IActionCall => ({
    callAPI: () => PaymentService.epaycoGetPaymentOrder(request),
    types: {
        loading: actionTypes.PAYMENT_EPAYCO_GETPAYMENTORDER,
        success: actionTypes.PAYMENT_EPAYCO_GETPAYMENTORDER_SUCCESS,
        failure: actionTypes.PAYMENT_EPAYCO_GETPAYMENTORDER_FAILURE,
    },
    type: null,
});

export const resetEpaycoGetPaymentOrder = (): IActionCall => ({ type: actionTypes.PAYMENT_EPAYCO_GETPAYMENTORDER_RESET });

export const epaycoProcessTransaction = (request: any): IActionCall => ({
    callAPI: () => PaymentService.epaycoProcessTransaction(request),
    types: {
        loading: actionTypes.PAYMENT_EPAYCO_PROCESSTRANSACTION,
        success: actionTypes.PAYMENT_EPAYCO_PROCESSTRANSACTION_SUCCESS,
        failure: actionTypes.PAYMENT_EPAYCO_PROCESSTRANSACTION_FAILURE,
    },
    type: null,
});

export const resetEpaycoProcessTransaction = (): IActionCall => ({ type: actionTypes.PAYMENT_EPAYCO_PROCESSTRANSACTION_RESET });