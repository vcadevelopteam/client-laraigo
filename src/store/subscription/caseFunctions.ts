import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const changePassword = (state: IState): IState => ({
    ...state,
    requestChangePassword: {
        ...state.requestChangePassword,
        error: false,
        loading: true,
    }
})

export const changePasswordFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestChangePassword: {
        ...state.requestChangePassword,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const changePasswordSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestChangePassword: {
        ...state.requestChangePassword,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const changePasswordReset = (state: IState): IState => ({
    ...state,
    requestChangePassword: initialState.requestChangePassword,
})

export const recoverPassword = (state: IState): IState => ({
    ...state,
    requestRecoverPassword: {
        ...state.requestRecoverPassword,
        error: false,
        loading: true,
    }
})

export const recoverPasswordFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestRecoverPassword: {
        ...state.requestRecoverPassword,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const recoverPasswordSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestRecoverPassword: {
        ...state.requestRecoverPassword,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const recoverPasswordReset = (state: IState): IState => ({
    ...state,
    requestRecoverPassword: initialState.requestRecoverPassword
})

export const validateChannels = (state: IState): IState => ({
    ...state,
    requestValidateChannels: {
        ...state.requestValidateChannels,
        error: false,
        loading: true,
    }
})

export const validateChannelsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestValidateChannels: {
        ...state.requestValidateChannels,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const validateChannelsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestValidateChannels: {
        ...state.requestValidateChannels,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const validateChannelsReset = (state: IState): IState => ({
    ...state,
    requestValidateChannels: initialState.requestValidateChannels,
})