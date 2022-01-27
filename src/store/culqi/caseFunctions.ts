import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const charge = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false
    }
})

export const chargeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code,
        message: action.payload.message
    }
})

export const chargeSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code,
        message: action.payload.message
    }
})

export const chargeReset = (state: IState): IState => ({
    ...state,
    request: initialState.request
})

export const createInvoice = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateInvoice: {
        ...state.requestCreateInvoice,
        loading: true,
        error: false
    }
})

export const createInvoiceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateInvoice: {
        ...state.requestCreateInvoice,
        loading: false,
        error: true,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message
    }
})

export const createInvoiceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateInvoice: {
        ...state.requestCreateInvoice,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message
    }
})

export const createInvoiceReset = (state: IState): IState => ({
    ...state,
    requestCreateInvoice: initialState.requestCreateInvoice
})

export const subscribe = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false
    }
})

export const subscribeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code,
        message: action.payload.message
    }
})

export const subscribeSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code,
        message: action.payload.message
    }
})

export const subscribeReset = (state: IState): IState => ({
    ...state,
    request: initialState.request
})

export const unsubscribe = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false
    }
})

export const unsubscribeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code,
        message: action.payload.message
    }
})

export const unsubscribeSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code,
        message: action.payload.message
    }
})

export const unsubscribeReset = (state: IState): IState => ({
    ...state,
    request: initialState.request
})


export const sendInvoice = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false
    }
})

export const sendInvoiceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message
    }
})

export const sendInvoiceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code,
        message: action.payload.message
    }
})

export const sendInvoiceReset = (state: IState): IState => ({
    ...state,
    request: initialState.request
})

export const createCreditNote = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateCreditNote: {
        ...state.requestCreateCreditNote,
        loading: true,
        error: false
    }
})

export const createCreditNoteFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateCreditNote: {
        ...state.requestCreateCreditNote,
        loading: false,
        error: true,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message
    }
})

export const createCreditNoteSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCreateCreditNote: {
        ...state.requestCreateCreditNote,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message
    }
})

export const createCreditNoteReset = (state: IState): IState => ({
    ...state,
    requestCreateCreditNote: initialState.requestCreateCreditNote
})

export const regularizeInvoice = (state: IState, action: IAction): IState => ({
    ...state,
    requestRegularizeInvoice: {
        ...state.requestRegularizeInvoice,
        loading: true,
        error: false
    }
})

export const regularizeInvoiceFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestRegularizeInvoice: {
        ...state.requestRegularizeInvoice,
        loading: false,
        error: true,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message
    }
})

export const regularizeInvoiceSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestRegularizeInvoice: {
        ...state.requestRegularizeInvoice,
        loading: false,
        error: false,
        data: action.payload.data,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message
    }
})

export const regularizeInvoiceReset = (state: IState): IState => ({
    ...state,
    requestRegularizeInvoice: initialState.requestRegularizeInvoice
})

export const getExchangeRate = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetExchangeRate: {
        ...state.requestGetExchangeRate,
        loading: true,
        error: false
    }
})

export const getExchangeRateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetExchangeRate: {
        ...state.requestGetExchangeRate,
        loading: false,
        error: true,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message
    }
})

export const getExchangeRateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetExchangeRate: {
        ...state.requestGetExchangeRate,
        loading: false,
        error: false,
        exchangerate: action.payload.exchangerate,
        code: action.payload.code ? action.payload.code : action.payload.message,
        message: action.payload.message
    }
})

export const getExchangeRateReset = (state: IState): IState => ({
    ...state,
    requestGetExchangeRate: initialState.requestGetExchangeRate
})