import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const manageConnection = (state: IState, action: IAction): IState => {
    return {
        ...state,
        connection: {
            error: action.payload.error,
            message: action.payload.message,
            loading: action.payload.loading
        }
    }
};

export const setModalCall = (state: IState, action: IAction): IState => {
    return {
        ...state,
        showcall: action.payload,
    }
}
export const initCall = (state: IState, action: IAction): IState => {

    return {
        ...state,
        call: action.payload,
        statusCall: "CONNECTING"
    }
}

export const manageStatusCall = (state: IState, action: IAction): IState => {
    return {
        ...state,
        statusCall: action.payload
    }
}

export const getCategories = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCategories: {
        ...state.requestGetCategories,
        error: false,
        loading: true,
    }
})

export const getCategoriesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCategories: {
        ...state.requestGetCategories,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getCategoriesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCategories: {
        ...state.requestGetCategories,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getCategoriesReset = (state: IState): IState => ({
    ...state,
    requestGetCategories: initialState.requestGetCategories,
})

export const getCountryStates = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCountryStates: {
        ...state.requestGetCountryStates,
        error: false,
        loading: true,
    }
})

export const getCountryStatesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCountryStates: {
        ...state.requestGetCountryStates,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getCountryStatesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetCountryStates: {
        ...state.requestGetCountryStates,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getCountryStatesReset = (state: IState): IState => ({
    ...state,
    requestGetCountryStates: initialState.requestGetCountryStates,
})

export const getRegions = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetRegions: {
        ...state.requestGetRegions,
        error: false,
        loading: true,
    }
})

export const getRegionsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetRegions: {
        ...state.requestGetRegions,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getRegionsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetRegions: {
        ...state.requestGetRegions,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getRegionsReset = (state: IState): IState => ({
    ...state,
    requestGetRegions: initialState.requestGetRegions,
})


export const getHistory = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetHistory: {
        ...state.requestGetHistory,
        error: false,
        loading: true,
    }
})

export const getHistoryFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetHistory: {
        ...state.requestGetHistory,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getHistorySuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetHistory: {
        ...state.requestGetHistory,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getHistoryReset = (state: IState): IState => ({
    ...state,
    requestGetHistory: initialState.requestGetHistory,
})

export const getAdvisors = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetAdvisors: {
        ...state.requestGetAdvisors,
        error: false,
        loading: true,
    }
})

export const getAdvisorsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetAdvisors: {
        ...state.requestGetAdvisors,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const getAdvisorsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetAdvisors: {
        ...state.requestGetAdvisors,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const getAdvisorsReset = (state: IState): IState => ({
    ...state,
    requestGetAdvisors: initialState.requestGetAdvisors,
})