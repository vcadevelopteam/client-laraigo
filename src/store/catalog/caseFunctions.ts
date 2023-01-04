import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const catalogBusinessList = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogBusinessList: {
        ...state.requestCatalogBusinessList,
        error: false,
        loading: true,
    }
})

export const catalogBusinessListFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogBusinessList: {
        ...state.requestCatalogBusinessList,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const catalogBusinessListSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogBusinessList: {
        ...state.requestCatalogBusinessList,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const catalogBusinessListReset = (state: IState): IState => ({
    ...state,
    requestCatalogBusinessList: initialState.requestCatalogBusinessList,
})