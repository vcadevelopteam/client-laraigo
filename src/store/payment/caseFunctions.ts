import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const niubizAuthorizeTransaction = (state: IState, action: IAction): IState => ({
    ...state,
    requestNiubizAuthorizeTransaction: {
        ...state.requestNiubizAuthorizeTransaction,
        error: false,
        loading: true,
    }
})

export const niubizAuthorizeTransactionFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestNiubizAuthorizeTransaction: {
        ...state.requestNiubizAuthorizeTransaction,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const niubizAuthorizeTransactionSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestNiubizAuthorizeTransaction: {
        ...state.requestNiubizAuthorizeTransaction,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const niubizAuthorizeTransactionReset = (state: IState): IState => ({
    ...state,
    requestNiubizAuthorizeTransaction: initialState.requestNiubizAuthorizeTransaction,
})

export const niubizCreateSessionToken = (state: IState, action: IAction): IState => ({
    ...state,
    requestNiubizCreateSessionToken: {
        ...state.requestNiubizCreateSessionToken,
        error: false,
        loading: true,
    }
})

export const niubizCreateSessionTokenFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestNiubizCreateSessionToken: {
        ...state.requestNiubizCreateSessionToken,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const niubizCreateSessionTokenSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestNiubizCreateSessionToken: {
        ...state.requestNiubizCreateSessionToken,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const niubizCreateSessionTokenReset = (state: IState): IState => ({
    ...state,
    requestNiubizCreateSessionToken: initialState.requestNiubizCreateSessionToken,
})

export const openpayGetPaymentOrder = (state: IState, action: IAction): IState => ({
    ...state,
    requestOpenpayGetPaymentOrder: {
        ...state.requestOpenpayGetPaymentOrder,
        error: false,
        loading: true,
    }
})

export const openpayGetPaymentOrderFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestOpenpayGetPaymentOrder: {
        ...state.requestOpenpayGetPaymentOrder,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const openpayGetPaymentOrderSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestOpenpayGetPaymentOrder: {
        ...state.requestOpenpayGetPaymentOrder,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const openpayGetPaymentOrderReset = (state: IState): IState => ({
    ...state,
    requestOpenpayGetPaymentOrder: initialState.requestOpenpayGetPaymentOrder,
})

export const openpayProcessTransaction = (state: IState, action: IAction): IState => ({
    ...state,
    requestOpenpayProcessTransaction: {
        ...state.requestOpenpayProcessTransaction,
        error: false,
        loading: true,
    }
})

export const openpayProcessTransactionFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestOpenpayProcessTransaction: {
        ...state.requestOpenpayProcessTransaction,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const openpayProcessTransactionSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestOpenpayProcessTransaction: {
        ...state.requestOpenpayProcessTransaction,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const openpayProcessTransactionReset = (state: IState): IState => ({
    ...state,
    requestOpenpayProcessTransaction: initialState.requestOpenpayProcessTransaction,
})

export const izipayGetPaymentOrder = (state: IState, action: IAction): IState => ({
    ...state,
    requestIzipayGetPaymentOrder: {
        ...state.requestIzipayGetPaymentOrder,
        error: false,
        loading: true,
    }
})

export const izipayGetPaymentOrderFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestIzipayGetPaymentOrder: {
        ...state.requestIzipayGetPaymentOrder,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const izipayGetPaymentOrderSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestIzipayGetPaymentOrder: {
        ...state.requestIzipayGetPaymentOrder,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const izipayGetPaymentOrderReset = (state: IState): IState => ({
    ...state,
    requestIzipayGetPaymentOrder: initialState.requestIzipayGetPaymentOrder,
})

export const izipayProcessTransaction = (state: IState, action: IAction): IState => ({
    ...state,
    requestIzipayProcessTransaction: {
        ...state.requestIzipayProcessTransaction,
        error: false,
        loading: true,
    }
})

export const izipayProcessTransactionFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestIzipayProcessTransaction: {
        ...state.requestIzipayProcessTransaction,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const izipayProcessTransactionSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestIzipayProcessTransaction: {
        ...state.requestIzipayProcessTransaction,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const izipayProcessTransactionReset = (state: IState): IState => ({
    ...state,
    requestIzipayProcessTransaction: initialState.requestIzipayProcessTransaction,
})