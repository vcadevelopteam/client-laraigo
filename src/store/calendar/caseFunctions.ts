import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const calendarGoogleLogIn = (state: IState, action: IAction): IState => ({
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