import { IAction } from "@types";
import { IState, initialState } from "./reducer";

export const gptThread = (state: IState): IState => ({
    ...state,
    gptthreadresult: { 
        ...state.gptthreadresult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const gptThreadSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        gptthreadresult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        },
    }
};

export const gptThreadFailure = (state: IState, action: IAction): IState => ({
    ...state,
    gptthreadresult: {
        ...state.gptthreadresult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const gptThreadReset = (state: IState): IState => ({
    ...state,
    gptthreadresult: initialState.gptthreadresult,
});