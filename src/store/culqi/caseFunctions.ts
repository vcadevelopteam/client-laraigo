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