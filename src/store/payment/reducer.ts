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
}

export const initialState: IState = {
    requestNiubizAuthorizeTransaction: { ...initialCommon, data: null, loading: false, error: false },
    requestNiubizCreateSessionToken: { ...initialCommon, data: null, loading: false, error: false },
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
});