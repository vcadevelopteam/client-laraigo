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