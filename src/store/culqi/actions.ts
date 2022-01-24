import { IActionCall } from "@types";
import { CulqiService } from "network";
import actionTypes from "./actionTypes";

export const charge = (request: any): IActionCall => ({
    callAPI: () => CulqiService.charge(request),
    types: {
        loading: actionTypes.CHARGE,
        success: actionTypes.CHARGE_SUCCESS,
        failure: actionTypes.CHARGE_FAILURE,
    },
    type: null,
});

export const resetCharge = (): IActionCall => ({ type: actionTypes.CHARGE_RESET });

export const subscribe = (request: any): IActionCall => ({
    callAPI: () => CulqiService.subscribe(request),
    types: {
        loading: actionTypes.SUBSCRIBE,
        success: actionTypes.SUBSCRIBE_SUCCESS,
        failure: actionTypes.SUBSCRIBE_FAILURE,
    },
    type: null,
});

export const resetSubscribe = (): IActionCall => ({ type: actionTypes.SUBSCRIBE_RESET });

export const unsubscribe = (request: any): IActionCall => ({
    callAPI: () => CulqiService.unsubscribe(request),
    types: {
        loading: actionTypes.UNSUBSCRIBE,
        success: actionTypes.UNSUBSCRIBE_SUCCESS,
        failure: actionTypes.UNSUBSCRIBE_FAILURE,
    },
    type: null,
});

export const resetUnsubscribe = (): IActionCall => ({ type: actionTypes.UNSUBSCRIBE_RESET });

export const sendInvoice = (invoiceid: number): IActionCall => ({
    callAPI: () => CulqiService.sendInvoice({ parameters: { invoiceid } }),
    types: {
        loading: actionTypes.SEND_INVOICE,
        success: actionTypes.SEND_INVOICE_SUCCESS,
        failure: actionTypes.SEND_INVOICE_FAILURE,
    },
    type: null,
});

export const resetSendInvoice = (): IActionCall => ({ type: actionTypes.SEND_INVOICE_RESET });

export const createInvoice = (request: any): IActionCall => ({
    callAPI: () => CulqiService.createInvoice(request),
    types: {
        loading: actionTypes.CREATE_INVOICE,
        success: actionTypes.CREATE_INVOICE_SUCCESS,
        failure: actionTypes.CREATE_INVOICE_FAILURE,
    },
    type: null,
});

export const resetcreateInvoice = (): IActionCall => ({ type: actionTypes.CREATE_INVOICE_RESET });

export const createCreditNote = (request: any): IActionCall => ({
    callAPI: () => CulqiService.createCreditNote(request),
    types: {
        loading: actionTypes.CREATE_CREDITNOTE,
        success: actionTypes.CREATE_CREDITNOTE_SUCCESS,
        failure: actionTypes.CREATE_CREDITNOTE_FAILURE,
    },
    type: null,
});

export const resetCreateCreditNote = (): IActionCall => ({ type: actionTypes.CREATE_CREDITNOTE_RESET });

export const regularizeInvoice = (request: any): IActionCall => ({
    callAPI: () => CulqiService.regularizeInvoice(request),
    types: {
        loading: actionTypes.REGULARIZE_INVOICE,
        success: actionTypes.REGULARIZE_INVOICE_SUCCESS,
        failure: actionTypes.REGULARIZE_INVOICE_FAILURE,
    },
    type: null,
});

export const resetRegularizeInvoice = (): IActionCall => ({ type: actionTypes.REGULARIZE_INVOICE_RESET });