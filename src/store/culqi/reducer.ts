import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

interface culqiResponse {
    object: string,
    id: string,
    code: string,
    message: string
}

export interface IRequest extends ITemplate {
    data: culqiResponse | null;
}

export interface IState {
    request: IRequest;
    requestCreateInvoice: IRequest;
}

export const initialState: IState = {
    request: { ...initialCommon, data: null, loading: false, error: false },
    requestCreateInvoice: { ...initialCommon, data: null, loading: false, error: false }
};

export default createReducer<IState>(initialState, {
    [actionTypes.CHARGE]: caseFUnctions.charge,
    [actionTypes.CHARGE_FAILURE]: caseFUnctions.chargeFailure,
    [actionTypes.CHARGE_SUCCESS]: caseFUnctions.chargeSuccess,
    [actionTypes.CHARGE_RESET]: caseFUnctions.chargeReset,
    
    [actionTypes.SUBSCRIBE]: caseFUnctions.subscribe,
    [actionTypes.SUBSCRIBE_FAILURE]: caseFUnctions.subscribeFailure,
    [actionTypes.SUBSCRIBE_SUCCESS]: caseFUnctions.subscribeSuccess,
    [actionTypes.SUBSCRIBE_RESET]: caseFUnctions.subscribeReset,

    [actionTypes.UNSUBSCRIBE]: caseFUnctions.unsubscribe,
    [actionTypes.UNSUBSCRIBE_FAILURE]: caseFUnctions.unsubscribeFailure,
    [actionTypes.UNSUBSCRIBE_SUCCESS]: caseFUnctions.unsubscribeSuccess,
    [actionTypes.UNSUBSCRIBE_RESET]: caseFUnctions.unsubscribeReset,

    [actionTypes.SEND_INVOICE]: caseFUnctions.sendInvoice,
    [actionTypes.SEND_INVOICE_FAILURE]: caseFUnctions.sendInvoiceFailure,
    [actionTypes.SEND_INVOICE_SUCCESS]: caseFUnctions.sendInvoiceSuccess,
    [actionTypes.SEND_INVOICE_RESET]: caseFUnctions.sendInvoiceReset,

    [actionTypes.CREATE_INVOICE]: caseFUnctions.createInvoice,
    [actionTypes.CREATE_INVOICE_FAILURE]: caseFUnctions.createInvoiceFailure,
    [actionTypes.CREATE_INVOICE_SUCCESS]: caseFUnctions.createInvoiceSuccess,
    [actionTypes.CREATE_INVOICE_RESET]: caseFUnctions.createInvoiceReset,
});