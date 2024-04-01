import { IAction } from "@types";
import { IState, initialState } from "./reducer";

export const llamaLoading = (state: IState): IState => ({
    ...state,
    llamaResult: {
        ...state.llamaResult,
        loading: true,
        error: false,
        success: undefined
    }
});

export const llamaSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        llamaResult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        },
    }
};

export const llamaFailure = (state: IState, action: IAction): IState => ({
    ...state,
    llamaResult: {
        ...state.llamaResult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const llamaReset = (state: IState): IState => ({
    ...state,
    llamaResult: initialState.llamaResult,
});