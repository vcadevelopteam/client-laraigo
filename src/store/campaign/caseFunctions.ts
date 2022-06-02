import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const campaignStart = (state: IState, action: IAction): IState => ({
    ...state,
    startRequest: {
        ...state.startRequest,
        error: false,
        loading: true,
    }
})

export const campaignStartFailure = (state: IState, action: IAction): IState => ({
    ...state,
    startRequest: {
        ...state.startRequest,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const campaignStartSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    startRequest: {
        ...state.startRequest,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const campaignStartReset = (state: IState): IState => ({
    ...state,
    startRequest: initialState.startRequest,
})

export const campaignStop = (state: IState, action: IAction): IState => ({
    ...state,
    stopRequest: {
        ...state.stopRequest,
        error: false,
        loading: true,
    }
})

export const campaignStopFailure = (state: IState, action: IAction): IState => ({
    ...state,
    stopRequest: {
        ...state.stopRequest,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const campaignStopSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    stopRequest: {
        ...state.stopRequest,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const campaignStopReset = (state: IState): IState => ({
    ...state,
    stopRequest: initialState.stopRequest,
})