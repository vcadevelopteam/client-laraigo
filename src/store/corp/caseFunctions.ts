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


