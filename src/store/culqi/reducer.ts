import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";

import * as caseFunctions from "./caseFunctions";
import actionTypes from "./actionTypes";

interface culqiResponse {
    code: string;
    exchangerate: number;
    exchangeratesol: number;
    id: string;
    message: string;
    object: string;
}

export interface IRequest extends ITemplate {
    data: culqiResponse | null;
    datacard?: any | null;
    datareport?: any | null;
    exchangerate?: number | null;
    exchangeratesol?: number | null;
    msg?: string | null;
}

export interface IState {
    request: IRequest;
    requestCardCreate: IRequest;
    requestCardDelete: IRequest;
    requestCreateCreditNote: IRequest;
    requestCreateInvoice: IRequest;
    requestEmitInvoice: IRequest;
    requestGetExchangeRate: IRequest;
    requestRegularizeInvoice: IRequest;
    requestReportPdf: IRequest;
}

export const initialState: IState = {
    request: { ...initialCommon, data: null, loading: false, error: false },
    requestCardCreate: { ...initialCommon, data: null, loading: false, error: false },
    requestCardDelete: { ...initialCommon, data: null, loading: false, error: false },
    requestCreateCreditNote: { ...initialCommon, data: null, loading: false, error: false },
    requestCreateInvoice: { ...initialCommon, data: null, loading: false, error: false },
    requestEmitInvoice: { ...initialCommon, data: null, loading: false, error: false },
    requestRegularizeInvoice: { ...initialCommon, data: null, loading: false, error: false },
    requestReportPdf: { ...initialCommon, data: null, loading: false, error: false },
    requestGetExchangeRate: {
        ...initialCommon,
        data: null,
        error: false,
        exchangerate: 0,
        exchangeratesol: 0,
        loading: false,
    },
};

export default createReducer<IState>(initialState, {
    [actionTypes.CHARGE]: caseFunctions.charge,
    [actionTypes.CHARGE_FAILURE]: caseFunctions.chargeFailure,
    [actionTypes.CHARGE_SUCCESS]: caseFunctions.chargeSuccess,
    [actionTypes.CHARGE_RESET]: caseFunctions.chargeReset,

    [actionTypes.BALANCE]: caseFunctions.balance,
    [actionTypes.BALANCE_FAILURE]: caseFunctions.balanceFailure,
    [actionTypes.BALANCE_SUCCESS]: caseFunctions.balanceSuccess,
    [actionTypes.BALANCE_RESET]: caseFunctions.balanceReset,

    [actionTypes.PAYMENTORDER]: caseFunctions.paymentOrder,
    [actionTypes.PAYMENTORDER_FAILURE]: caseFunctions.paymentOrderFailure,
    [actionTypes.PAYMENTORDER_SUCCESS]: caseFunctions.paymentOrderSuccess,
    [actionTypes.PAYMENTORDER_RESET]: caseFunctions.paymentOrderReset,

    [actionTypes.CREATE_INVOICE]: caseFunctions.createInvoice,
    [actionTypes.CREATE_INVOICE_FAILURE]: caseFunctions.createInvoiceFailure,
    [actionTypes.CREATE_INVOICE_SUCCESS]: caseFunctions.createInvoiceSuccess,
    [actionTypes.CREATE_INVOICE_RESET]: caseFunctions.createInvoiceReset,

    [actionTypes.CREATE_CREDITNOTE]: caseFunctions.createCreditNote,
    [actionTypes.CREATE_CREDITNOTE_FAILURE]: caseFunctions.createCreditNoteFailure,
    [actionTypes.CREATE_CREDITNOTE_SUCCESS]: caseFunctions.createCreditNoteSuccess,
    [actionTypes.CREATE_CREDITNOTE_RESET]: caseFunctions.createCreditNoteReset,

    [actionTypes.REGULARIZE_INVOICE]: caseFunctions.regularizeInvoice,
    [actionTypes.REGULARIZE_INVOICE_FAILURE]: caseFunctions.regularizeInvoiceFailure,
    [actionTypes.REGULARIZE_INVOICE_SUCCESS]: caseFunctions.regularizeInvoiceSuccess,
    [actionTypes.REGULARIZE_INVOICE_RESET]: caseFunctions.regularizeInvoiceReset,

    [actionTypes.GET_EXCHANGERATE]: caseFunctions.getExchangeRate,
    [actionTypes.GET_EXCHANGERATE_FAILURE]: caseFunctions.getExchangeRateFailure,
    [actionTypes.GET_EXCHANGERATE_SUCCESS]: caseFunctions.getExchangeRateSuccess,
    [actionTypes.GET_EXCHANGERATE_RESET]: caseFunctions.getExchangeRateReset,

    [actionTypes.EMIT_INVOICE]: caseFunctions.emitInvoice,
    [actionTypes.EMIT_INVOICE_FAILURE]: caseFunctions.emitInvoiceFailure,
    [actionTypes.EMIT_INVOICE_SUCCESS]: caseFunctions.emitInvoiceSuccess,
    [actionTypes.EMIT_INVOICE_RESET]: caseFunctions.emitInvoiceReset,

    [actionTypes.CARD_CREATE]: caseFunctions.cardCreate,
    [actionTypes.CARD_CREATE_FAILURE]: caseFunctions.cardCreateFailure,
    [actionTypes.CARD_CREATE_SUCCESS]: caseFunctions.cardCreateSuccess,
    [actionTypes.CARD_CREATE_RESET]: caseFunctions.cardCreateReset,

    [actionTypes.CARD_DELETE]: caseFunctions.cardDelete,
    [actionTypes.CARD_DELETE_FAILURE]: caseFunctions.cardDeleteFailure,
    [actionTypes.CARD_DELETE_SUCCESS]: caseFunctions.cardDeleteSuccess,
    [actionTypes.CARD_DELETE_RESET]: caseFunctions.cardDeleteReset,

    [actionTypes.DRAW_REPORTPDF]: caseFunctions.reportPdf,
    [actionTypes.DRAW_REPORTPDF_FAILURE]: caseFunctions.reportPdfFailure,
    [actionTypes.DRAW_REPORTPDF_SUCCESS]: caseFunctions.reportPdfSuccess,
    [actionTypes.DRAW_REPORTPDF_RESET]: caseFunctions.reportPdfReset,
});