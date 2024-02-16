import { createReducer, initialCommon } from "common/helpers";
import { ITemplate } from "@types";

import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data?: any | null;
    msg?: string | null;
}

export interface IState {
    requestNiubizAuthorizeTransaction: IRequest;
    requestNiubizCreateSessionToken: IRequest;
    requestOpenpayGetPaymentOrder: IRequest;
    requestOpenpayProcessTransaction: IRequest;
    requestIzipayGetPaymentOrder: IRequest;
    requestIzipayProcessTransaction: IRequest;
    requestEpaycoGetPaymentOrder: IRequest;
    requestEpaycoProcessTransaction: IRequest;
}

export const initialState: IState = {
    requestNiubizAuthorizeTransaction: { ...initialCommon, data: null, loading: false, error: false },
    requestNiubizCreateSessionToken: { ...initialCommon, data: null, loading: false, error: false },
    requestOpenpayGetPaymentOrder: { ...initialCommon, data: null, loading: false, error: false },
    requestOpenpayProcessTransaction: { ...initialCommon, data: null, loading: false, error: false },
    requestIzipayGetPaymentOrder: { ...initialCommon, data: null, loading: false, error: false },
    requestIzipayProcessTransaction: { ...initialCommon, data: null, loading: false, error: false },
    requestEpaycoGetPaymentOrder: { ...initialCommon, data: null, loading: false, error: false },
    requestEpaycoProcessTransaction: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.PAYMENT_NIUBIZ_AUTHORIZETRANSACTION]: caseFunctions.niubizAuthorizeTransaction,
    [actionTypes.PAYMENT_NIUBIZ_AUTHORIZETRANSACTION_FAILURE]: caseFunctions.niubizAuthorizeTransactionFailure,
    [actionTypes.PAYMENT_NIUBIZ_AUTHORIZETRANSACTION_SUCCESS]: caseFunctions.niubizAuthorizeTransactionSuccess,
    [actionTypes.PAYMENT_NIUBIZ_AUTHORIZETRANSACTION_RESET]: caseFunctions.niubizAuthorizeTransactionReset,

    [actionTypes.PAYMENT_NIUBIZ_CREATESESSIONTOKEN]: caseFunctions.niubizCreateSessionToken,
    [actionTypes.PAYMENT_NIUBIZ_CREATESESSIONTOKEN_FAILURE]: caseFunctions.niubizCreateSessionTokenFailure,
    [actionTypes.PAYMENT_NIUBIZ_CREATESESSIONTOKEN_SUCCESS]: caseFunctions.niubizCreateSessionTokenSuccess,
    [actionTypes.PAYMENT_NIUBIZ_CREATESESSIONTOKEN_RESET]: caseFunctions.niubizCreateSessionTokenReset,

    [actionTypes.PAYMENT_OPENPAY_GETPAYMENTORDER]: caseFunctions.openpayGetPaymentOrder,
    [actionTypes.PAYMENT_OPENPAY_GETPAYMENTORDER_FAILURE]: caseFunctions.openpayGetPaymentOrderFailure,
    [actionTypes.PAYMENT_OPENPAY_GETPAYMENTORDER_SUCCESS]: caseFunctions.openpayGetPaymentOrderSuccess,
    [actionTypes.PAYMENT_OPENPAY_GETPAYMENTORDER_RESET]: caseFunctions.openpayGetPaymentOrderReset,

    [actionTypes.PAYMENT_OPENPAY_PROCESSTRANSACTION]: caseFunctions.openpayProcessTransaction,
    [actionTypes.PAYMENT_OPENPAY_PROCESSTRANSACTION_FAILURE]: caseFunctions.openpayProcessTransactionFailure,
    [actionTypes.PAYMENT_OPENPAY_PROCESSTRANSACTION_SUCCESS]: caseFunctions.openpayProcessTransactionSuccess,
    [actionTypes.PAYMENT_OPENPAY_PROCESSTRANSACTION_RESET]: caseFunctions.openpayProcessTransactionReset,

    [actionTypes.PAYMENT_IZIPAY_GETPAYMENTORDER]: caseFunctions.izipayGetPaymentOrder,
    [actionTypes.PAYMENT_IZIPAY_GETPAYMENTORDER_FAILURE]: caseFunctions.izipayGetPaymentOrderFailure,
    [actionTypes.PAYMENT_IZIPAY_GETPAYMENTORDER_SUCCESS]: caseFunctions.izipayGetPaymentOrderSuccess,
    [actionTypes.PAYMENT_IZIPAY_GETPAYMENTORDER_RESET]: caseFunctions.izipayGetPaymentOrderReset,

    [actionTypes.PAYMENT_IZIPAY_PROCESSTRANSACTION]: caseFunctions.izipayProcessTransaction,
    [actionTypes.PAYMENT_IZIPAY_PROCESSTRANSACTION_FAILURE]: caseFunctions.izipayProcessTransactionFailure,
    [actionTypes.PAYMENT_IZIPAY_PROCESSTRANSACTION_SUCCESS]: caseFunctions.izipayProcessTransactionSuccess,
    [actionTypes.PAYMENT_IZIPAY_PROCESSTRANSACTION_RESET]: caseFunctions.izipayProcessTransactionReset,

    [actionTypes.PAYMENT_EPAYCO_GETPAYMENTORDER]: caseFunctions.epaycoGetPaymentOrder,
    [actionTypes.PAYMENT_EPAYCO_GETPAYMENTORDER_FAILURE]: caseFunctions.epaycoGetPaymentOrderFailure,
    [actionTypes.PAYMENT_EPAYCO_GETPAYMENTORDER_SUCCESS]: caseFunctions.epaycoGetPaymentOrderSuccess,
    [actionTypes.PAYMENT_EPAYCO_GETPAYMENTORDER_RESET]: caseFunctions.epaycoGetPaymentOrderReset,

    [actionTypes.PAYMENT_EPAYCO_PROCESSTRANSACTION]: caseFunctions.epaycoProcessTransaction,
    [actionTypes.PAYMENT_EPAYCO_PROCESSTRANSACTION_FAILURE]: caseFunctions.epaycoProcessTransactionFailure,
    [actionTypes.PAYMENT_EPAYCO_PROCESSTRANSACTION_SUCCESS]: caseFunctions.epaycoProcessTransactionSuccess,
    [actionTypes.PAYMENT_EPAYCO_PROCESSTRANSACTION_RESET]: caseFunctions.epaycoProcessTransactionReset,
});