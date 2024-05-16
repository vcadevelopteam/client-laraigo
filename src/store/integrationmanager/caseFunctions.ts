import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const request_send = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: true,
        error: false
    }
})

export const requestFailure = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: true,
        data: action.payload
    }
})

export const requestSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    request: {
        ...state.request,
        loading: false,
        error: false,
        data: action.payload
    }
})

export const requestReset = (state: IState): IState => ({
    ...state,
    request: initialState.request
})

export const processzip_send = (state: IState, action: IAction): IState => ({
    ...state,
    processzip: {
        ...state.processzip,
        loading: true,
        error: false
    }
})

export const processzipFailure = (state: IState, action: IAction): IState => ({
    ...state,
    processzip: {
        ...state.processzip,
        code: action?.payload?.code,
        loading: false,
        error: true,
    }
})

export const processzipSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    processzip: {
        ...state.processzip,
        loading: false,
        error: false,
    }
})

export const processzipReset = (state: IState): IState => ({
    ...state,
    processzip: initialState.processzip
})