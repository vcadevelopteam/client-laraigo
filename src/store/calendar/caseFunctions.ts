import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const calendarGoogleReset = (state: IState): IState => ({
    ...state,
    requestGoogleLogIn: initialState.requestGoogleLogIn,
    requestGoogleDisconnect: initialState.requestGoogleDisconnect,
    requestGoogleValidate: initialState.requestGoogleValidate,
})

export const calendarGoogleLogIn = (state: IState): IState => ({
    ...state,
    requestGoogleLogIn: {
        ...state.requestGoogleLogIn,
        error: false,
        loading: true,
    }
})

export const calendarGoogleLogInFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGoogleLogIn: {
        ...state.requestGoogleLogIn,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const calendarGoogleLogInSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGoogleLogIn: {
        ...state.requestGoogleLogIn,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const calendarGoogleLogInReset = (state: IState): IState => ({
    ...state,
    requestGoogleLogIn: initialState.requestGoogleLogIn,
})

export const calendarGoogleDisconnect = (state: IState): IState => ({
    ...state,
    requestGoogleDisconnect: {
        ...state.requestGoogleDisconnect,
        error: false,
        loading: true,
    }
})

export const calendarGoogleDisconnectFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGoogleDisconnect: {
        ...state.requestGoogleDisconnect,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const calendarGoogleDisconnectSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGoogleDisconnect: {
        ...state.requestGoogleDisconnect,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const calendarGoogleDisconnectReset = (state: IState): IState => ({
    ...state,
    requestGoogleDisconnect: initialState.requestGoogleDisconnect,
})

export const calendarGoogleValidate = (state: IState): IState => ({
    ...state,
    requestGoogleValidate: {
        ...state.requestGoogleValidate,
        error: false,
        loading: true,
    }
})

export const calendarGoogleValidateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGoogleValidate: {
        ...state.requestGoogleValidate,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const calendarGoogleValidateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGoogleValidate: {
        ...state.requestGoogleValidate,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const calendarGoogleValidateReset = (state: IState): IState => ({
    ...state,
    requestGoogleValidate: initialState.requestGoogleValidate,
})