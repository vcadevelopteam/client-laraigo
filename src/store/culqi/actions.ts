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

export const paymentOrder = (request: any): IActionCall => ({
    callAPI: () => CulqiService.paymentOrder(request),
    types: {
        loading: actionTypes.PAYMENTORDER,
        success: actionTypes.PAYMENTORDER_SUCCESS,
        failure: actionTypes.PAYMENTORDER_FAILURE,
    },
    type: null,
});

export const resetPaymentOrder = (): IActionCall => ({ type: actionTypes.PAYMENTORDER_RESET });

export const balance = (request: any): IActionCall => ({
    callAPI: () => CulqiService.balance(request),
    types: {
        loading: actionTypes.BALANCE,
        success: actionTypes.BALANCE_SUCCESS,
        failure: actionTypes.BALANCE_FAILURE,
    },
    type: null,
});

export const resetBalance = (): IActionCall => ({ type: actionTypes.BALANCE_RESET });

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

export const getExchangeRate = (request: any): IActionCall => ({
    callAPI: () => CulqiService.getExchangeRate(request),
    types: {
        loading: actionTypes.GET_EXCHANGERATE,
        success: actionTypes.GET_EXCHANGERATE_SUCCESS,
        failure: actionTypes.GET_EXCHANGERATE_FAILURE,
    },
    type: null,
});

export const resetGetExchangeRate = (): IActionCall => ({ type: actionTypes.GET_EXCHANGERATE_RESET });

export const emitInvoice = (request: any): IActionCall => ({
    callAPI: () => CulqiService.emitInvoice(request),
    types: {
        loading: actionTypes.EMIT_INVOICE,
        success: actionTypes.EMIT_INVOICE_SUCCESS,
        failure: actionTypes.EMIT_INVOICE_FAILURE,
    },
    type: null,
});

export const resetEmitInvoice = (): IActionCall => ({ type: actionTypes.EMIT_INVOICE_RESET });

export const cardCreate = (request: any): IActionCall => ({
    callAPI: () => CulqiService.cardCreate(request),
    types: {
        failure: actionTypes.CARD_CREATE_FAILURE,
        loading: actionTypes.CARD_CREATE,
        success: actionTypes.CARD_CREATE_SUCCESS,
    },
    type: null,
});

export const resetCardCreate = (): IActionCall => ({ type: actionTypes.CARD_CREATE_RESET });

export const cardDelete = (request: any): IActionCall => ({
    callAPI: () => CulqiService.cardDelete(request),
    types: {
        failure: actionTypes.CARD_DELETE_FAILURE,
        loading: actionTypes.CARD_DELETE,
        success: actionTypes.CARD_DELETE_SUCCESS,
    },
    type: null,
});

export const resetCardDelete = (): IActionCall => ({ type: actionTypes.CARD_DELETE_RESET });

export const cardGet = (request: any): IActionCall => ({
    callAPI: () => CulqiService.cardGet(request),
    types: {
        failure: actionTypes.CARD_GET_FAILURE,
        loading: actionTypes.CARD_GET,
        success: actionTypes.CARD_GET_SUCCESS,
    },
    type: null,
});

export const resetCardGet = (): IActionCall => ({ type: actionTypes.CARD_GET_RESET });

export const reportPdf = (request: any): IActionCall => ({
    callAPI: () => CulqiService.reportPdf(request),
    types: {
        failure: actionTypes.DRAW_REPORTPDF_FAILURE,
        loading: actionTypes.DRAW_REPORTPDF,
        success: actionTypes.DRAW_REPORTPDF_SUCCESS,
    },
    type: null,
});

export const resetReportPdf = (): IActionCall => ({ type: actionTypes.DRAW_REPORTPDF_RESET });