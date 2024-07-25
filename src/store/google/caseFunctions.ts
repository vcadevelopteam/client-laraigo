import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const exchangeCode = (state: IState): IState => ({
    ...state,
    requestExchangeCode: {
        ...state.requestExchangeCode,
        error: false,
        loading: true,
    }
})

export const exchangeCodeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestExchangeCode: {
        ...state.requestExchangeCode,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const exchangeCodeSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestExchangeCode: {
        ...state.requestExchangeCode,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const exchangeCodeReset = (state: IState): IState => ({
    ...state,
    requestExchangeCode: initialState.requestExchangeCode,
})

export const listBlogger = (state: IState): IState => ({
    ...state,
    requestListBlogger: {
        ...state.requestListBlogger,
        error: false,
        loading: true,
    }
})

export const listBloggerFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestListBlogger: {
        ...state.requestListBlogger,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const listBloggerSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestListBlogger: {
        ...state.requestListBlogger,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const listBloggerReset = (state: IState): IState => ({
    ...state,
    requestListBlogger: initialState.requestListBlogger,
})

export const listYouTube = (state: IState): IState => ({
    ...state,
    requestListYouTube: {
        ...state.requestListYouTube,
        error: false,
        loading: true,
    }
})

export const listYouTubeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestListYouTube: {
        ...state.requestListYouTube,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const listYouTubeSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestListYouTube: {
        ...state.requestListYouTube,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const listYouTubeReset = (state: IState): IState => ({
    ...state,
    requestListYouTube: initialState.requestListYouTube,
})