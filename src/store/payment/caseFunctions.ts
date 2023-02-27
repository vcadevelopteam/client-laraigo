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