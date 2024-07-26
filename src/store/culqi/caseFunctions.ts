import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const charge = (state: IState): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false,
    },
});

export const chargeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const chargeSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const chargeReset = (state: IState): IState => ({
    ...state,
    request: initialState.request,
});

export const balance = (state: IState): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false,
    },
});

export const balanceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const balanceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const balanceReset = (state: IState): IState => ({
    ...state,
    request: initialState.request,
});

export const paymentOrder = (state: IState): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false,
    },
});

export const paymentOrderFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const paymentOrderSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const paymentOrderReset = (state: IState): IState => ({
    ...state,
    request: initialState.request,
});

export const createInvoice = (state: IState): IState => ({
    ...state,
    requestCreateInvoice: {
        ...state.requestCreateInvoice,
        loading: true,
        error: false,
    },
});

export const createInvoiceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateInvoice: {
        ...state.requestCreateInvoice,
        loading: false,
        error: true,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const createInvoiceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateInvoice: {
        ...state.requestCreateInvoice,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const createInvoiceReset = (state: IState): IState => ({
    ...state,
    requestCreateInvoice: initialState.requestCreateInvoice,
});

export const subscribe = (state: IState): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false,
    },
});

export const subscribeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const subscribeSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const subscribeReset = (state: IState): IState => ({
    ...state,
    request: initialState.request,
});

export const unsubscribe = (state: IState): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false,
    },
});

export const unsubscribeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const unsubscribeSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const unsubscribeReset = (state: IState): IState => ({
    ...state,
    request: initialState.request,
});

export const sendInvoice = (state: IState): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false,
    },
});

export const sendInvoiceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : "error_unexpected_error",
        message: action.payload.message,
    },
});

export const sendInvoiceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code,
        message: action.payload.message,
    },
});

export const sendInvoiceReset = (state: IState): IState => ({
    ...state,
    request: initialState.request,
});

export const createCreditNote = (state: IState): IState => ({
    ...state,
    requestCreateCreditNote: {
        ...state.requestCreateCreditNote,
        loading: true,
        error: false,
    },
});

export const createCreditNoteFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateCreditNote: {
        ...state.requestCreateCreditNote,
        loading: false,
        error: true,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const createCreditNoteSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateCreditNote: {
        ...state.requestCreateCreditNote,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const createCreditNoteReset = (state: IState): IState => ({
    ...state,
    requestCreateCreditNote: initialState.requestCreateCreditNote,
});

export const regularizeInvoice = (state: IState): IState => ({
    ...state,
    requestRegularizeInvoice: {
        ...state.requestRegularizeInvoice,
        loading: true,
        error: false,
    },
});

export const regularizeInvoiceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestRegularizeInvoice: {
        ...state.requestRegularizeInvoice,
        loading: false,
        error: true,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const regularizeInvoiceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestRegularizeInvoice: {
        ...state.requestRegularizeInvoice,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const regularizeInvoiceReset = (state: IState): IState => ({
    ...state,
    requestRegularizeInvoice: initialState.requestRegularizeInvoice,
});

export const getExchangeRate = (state: IState): IState => ({
    ...state,
    requestGetExchangeRate: {
        ...state.requestGetExchangeRate,
        loading: true,
        error: false,
    },
});

export const getExchangeRateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetExchangeRate: {
        ...state.requestGetExchangeRate,
        loading: false,
        error: true,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const getExchangeRateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetExchangeRate: {
        ...state.requestGetExchangeRate,
        loading: false,
        error: false,
        exchangerate: action.payload.exchangerate,
        exchangeratesol: action.payload.exchangeratesol,
        exchangeratecop: action.payload.exchangeratecop,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const getExchangeRateReset = (state: IState): IState => ({
    ...state,
    requestGetExchangeRate: initialState.requestGetExchangeRate,
});

export const emitInvoice = (state: IState): IState => ({
    ...state,
    requestEmitInvoice: {
        ...state.requestEmitInvoice,
        loading: true,
        error: false,
    },
});

export const emitInvoiceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestEmitInvoice: {
        ...state.requestEmitInvoice,
        loading: false,
        error: true,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const emitInvoiceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestEmitInvoice: {
        ...state.requestEmitInvoice,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message,
    },
});

export const emitInvoiceReset = (state: IState): IState => ({
    ...state,
    requestEmitInvoice: initialState.requestEmitInvoice,
});

export const cardCreate = (state: IState): IState => ({
    ...state,
    requestCardCreate: {
        ...state.requestCardCreate,
        error: false,
        loading: true,
    },
});

export const cardCreateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCardCreate: {
        ...state.requestCardCreate,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || "error_unexpected_error",
    },
});

export const cardCreateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCardCreate: {
        ...state.requestCardCreate,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    },
});

export const cardCreateReset = (state: IState): IState => ({
    ...state,
    requestCardCreate: initialState.requestCardCreate,
});

export const cardDelete = (state: IState): IState => ({
    ...state,
    requestCardDelete: {
        ...state.requestCardDelete,
        error: false,
        loading: true,
    },
});

export const cardDeleteFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCardDelete: {
        ...state.requestCardDelete,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || "error_unexpected_error",
    },
});

export const cardDeleteSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCardDelete: {
        ...state.requestCardDelete,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    },
});

export const cardDeleteReset = (state: IState): IState => ({
    ...state,
    requestCardDelete: initialState.requestCardDelete,
});

export const reportPdf = (state: IState): IState => ({
    ...state,
    requestReportPdf: {
        ...state.requestReportPdf,
        error: false,
        loading: true,
    },
});

export const reportPdfFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestReportPdf: {
        ...state.requestReportPdf,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || "error_unexpected_error",
    },
});

export const reportPdfSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestReportPdf: {
        ...state.requestReportPdf,
        datacard: action?.payload?.url,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    },
});

export const reportPdfReset = (state: IState): IState => ({
    ...state,
    requestReportPdf: initialState.requestReportPdf,
});