import { IAction } from "@types";
import { IState, initialState } from "./reducer";

export const gptLoading = (state: IState): IState => ({
    ...state,
    gptResult: { 
        ...state.gptResult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const gptSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        gptResult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        },
    }
};

export const gptFailure = (state: IState, action: IAction): IState => ({
    ...state,
    gptResult: {
        ...state.gptResult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const gptReset = (state: IState): IState => ({
    ...state,
    gptResult: initialState.gptResult,
});