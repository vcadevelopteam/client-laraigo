import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const recoverPassword = (state: IState, action: IAction): IState => ({
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
        error: true,
        loading: false,
        msg: action?.payload?.msg || 'error_unexpected_error',
    }
})

export const recoverPasswordSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestRecoverPassword: {
        ...state.requestRecoverPassword,
        error: action?.payload?.success === false,
        loading: false,
        msg: action?.payload?.msg || 'error_unexpected_error',
    }
})

export const recoverPasswordReset = (state: IState): IState => ({
    ...state,
    requestRecoverPassword: initialState.requestRecoverPassword
})

export const changePassword = (state: IState, action: IAction): IState => ({
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
        error: true,
        loading: false,
        msg: action?.payload?.msg || 'error_unexpected_error',
    }
})

export const changePasswordSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestChangePassword: {
        ...state.requestChangePassword,
        error: action?.payload?.success === false,
        loading: false,
        msg: action?.payload?.msg || 'error_unexpected_error',
    }
})

export const changePasswordReset = (state: IState): IState => ({
    ...state,
    requestChangePassword: initialState.requestChangePassword
})

export const validateChannels = (state: IState, action: IAction): IState => ({
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
        error: true,
        loading: false,
        code: action?.payload?.code,
        msg: action?.payload?.msg,
    }
})

export const validateChannelsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestValidateChannels: {
        ...state.requestValidateChannels,
        error: action?.payload?.success === false,
        loading: false,
        code: action?.payload?.code,
        msg: action?.payload?.msg,
    }
})

export const validateChannelsReset = (state: IState): IState => ({
    ...state,
    requestValidateChannels: initialState.requestValidateChannels
})