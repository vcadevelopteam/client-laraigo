import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

interface culqiResponse {
    code: string,
    exchangerate: number,
    id: string,
    message: string,
    object: string,
}

export interface IRequest extends ITemplate {
    data: culqiResponse | null;
    datacard?: any | null;
    datareport?: any | null;
    exchangerate?: number | null;
    msg?: string | null;
}

export interface IState {
    request: IRequest;
    requestEmitInvoice: IRequest;
    requestCreateInvoice: IRequest;
    requestCreateCreditNote: IRequest;
    requestRegularizeInvoice: IRequest;
    requestGetExchangeRate: IRequest;
    requestCardCreate: IRequest;
    requestCardDelete: IRequest;
    requestCardGet: IRequest;
    requestReportPdf: IRequest;
}

export const initialState: IState = {
    request: { ...initialCommon, data: null, loading: false, error: false },
    requestEmitInvoice: { ...initialCommon, data: null, loading: false, error: false },
    requestCreateInvoice: { ...initialCommon, data: null, loading: false, error: false },
    requestCreateCreditNote: { ...initialCommon, data: null, loading: false, error: false },
    requestRegularizeInvoice: { ...initialCommon, data: null, loading: false, error: false },
    requestGetExchangeRate: { ...initialCommon, data: null, loading: false, error: false, exchangerate: 0 },
    requestCardCreate: { ...initialCommon, data: null, loading: false, error: false },
    requestCardDelete: { ...initialCommon, data: null, loading: false, error: false },
    requestCardGet: { ...initialCommon, data: null, loading: false, error: false },
    requestReportPdf: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.CHARGE]: caseFUnctions.charge,
    [actionTypes.CHARGE_FAILURE]: caseFUnctions.chargeFailure,
    [actionTypes.CHARGE_SUCCESS]: caseFUnctions.chargeSuccess,
    [actionTypes.CHARGE_RESET]: caseFUnctions.chargeReset,

    [actionTypes.BALANCE]: caseFUnctions.balance,
    [actionTypes.BALANCE_FAILURE]: caseFUnctions.balanceFailure,
    [actionTypes.BALANCE_SUCCESS]: caseFUnctions.balanceSuccess,
    [actionTypes.BALANCE_RESET]: caseFUnctions.balanceReset,

    [actionTypes.PAYMENTORDER]: caseFUnctions.paymentOrder,
    [actionTypes.PAYMENTORDER_FAILURE]: caseFUnctions.paymentOrderFailure,
    [actionTypes.PAYMENTORDER_SUCCESS]: caseFUnctions.paymentOrderSuccess,
    [actionTypes.PAYMENTORDER_RESET]: caseFUnctions.paymentOrderReset,

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

    [actionTypes.CREATE_CREDITNOTE]: caseFUnctions.createCreditNote,
    [actionTypes.CREATE_CREDITNOTE_FAILURE]: caseFUnctions.createCreditNoteFailure,
    [actionTypes.CREATE_CREDITNOTE_SUCCESS]: caseFUnctions.createCreditNoteSuccess,
    [actionTypes.CREATE_CREDITNOTE_RESET]: caseFUnctions.createCreditNoteReset,

    [actionTypes.REGULARIZE_INVOICE]: caseFUnctions.regularizeInvoice,
    [actionTypes.REGULARIZE_INVOICE_FAILURE]: caseFUnctions.regularizeInvoiceFailure,
    [actionTypes.REGULARIZE_INVOICE_SUCCESS]: caseFUnctions.regularizeInvoiceSuccess,
    [actionTypes.REGULARIZE_INVOICE_RESET]: caseFUnctions.regularizeInvoiceReset,

    [actionTypes.GET_EXCHANGERATE]: caseFUnctions.getExchangeRate,
    [actionTypes.GET_EXCHANGERATE_FAILURE]: caseFUnctions.getExchangeRateFailure,
    [actionTypes.GET_EXCHANGERATE_SUCCESS]: caseFUnctions.getExchangeRateSuccess,
    [actionTypes.GET_EXCHANGERATE_RESET]: caseFUnctions.getExchangeRateReset,

    [actionTypes.EMIT_INVOICE]: caseFUnctions.emitInvoice,
    [actionTypes.EMIT_INVOICE_FAILURE]: caseFUnctions.emitInvoiceFailure,
    [actionTypes.EMIT_INVOICE_SUCCESS]: caseFUnctions.emitInvoiceSuccess,
    [actionTypes.EMIT_INVOICE_RESET]: caseFUnctions.emitInvoiceReset,

    [actionTypes.CARD_CREATE]: caseFUnctions.cardCreate,
    [actionTypes.CARD_CREATE_FAILURE]: caseFUnctions.cardCreateFailure,
    [actionTypes.CARD_CREATE_SUCCESS]: caseFUnctions.cardCreateSuccess,
    [actionTypes.CARD_CREATE_RESET]: caseFUnctions.cardCreateReset,

    [actionTypes.CARD_DELETE]: caseFUnctions.cardDelete,
    [actionTypes.CARD_DELETE_FAILURE]: caseFUnctions.cardDeleteFailure,
    [actionTypes.CARD_DELETE_SUCCESS]: caseFUnctions.cardDeleteSuccess,
    [actionTypes.CARD_DELETE_RESET]: caseFUnctions.cardDeleteReset,

    [actionTypes.CARD_GET]: caseFUnctions.cardGet,
    [actionTypes.CARD_GET_FAILURE]: caseFUnctions.cardGetFailure,
    [actionTypes.CARD_GET_SUCCESS]: caseFUnctions.cardGetSuccess,
    [actionTypes.CARD_GET_RESET]: caseFUnctions.cardGetReset,

    [actionTypes.DRAW_REPORTPDF]: caseFUnctions.reportPdf,
    [actionTypes.DRAW_REPORTPDF_FAILURE]: caseFUnctions.reportPdfFailure,
    [actionTypes.DRAW_REPORTPDF_SUCCESS]: caseFUnctions.reportPdfSuccess,
    [actionTypes.DRAW_REPORTPDF_RESET]: caseFUnctions.reportPdfReset,
});