import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const executeCorp = (state: IState): IState => ({
    ...state,
    executecorp: { ...state.executecorp, loading: true, error: false, success: undefined }
});

export const executeCorpSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        executecorp: {
            data: action.payload.data || [],
            key: action.payload.key,
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const executeCorpFailure = (state: IState, action: IAction): IState => ({
    ...state,
    executecorp: {
        ...state.executecorp,
        loading: false,
        key: action.payload.key,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const executeCorpReset = (state: IState): IState => ({
    ...state,
    executecorp: initialState.executecorp,
});



export const corpGet = (state: IState): IState => ({
    ...state,
    mainData: { ...state.mainData, data: [], loading: true, error: false }
});

export const corpGetSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainData: {
            key: action.payload.key,
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const corpGetFailure = (state: IState, action: IAction): IState => ({
    ...state,
    mainData: {
        ...state.mainData,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const corpGetReset = (state: IState): IState => ({
    ...state,
    mainData: initialState.mainData,
});

