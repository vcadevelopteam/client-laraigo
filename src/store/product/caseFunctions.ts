import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const importXml = (state: IState, action: IAction): IState => ({
    ...state,
    requestImportXml: {
        ...state.requestImportXml,
        error: false,
        loading: true,
    }
})

export const importXmlFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestImportXml: {
        ...state.requestImportXml,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const importXmlSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestImportXml: {
        ...state.requestImportXml,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const importXmlReset = (state: IState): IState => ({
    ...state,
    requestImportXml: initialState.requestImportXml,
})