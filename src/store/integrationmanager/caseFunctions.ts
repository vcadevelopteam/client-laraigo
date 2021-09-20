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