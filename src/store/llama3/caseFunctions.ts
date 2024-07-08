import { IAction } from "@types";
import { IState, initialState } from "./reducer";

export const llama3Loading = (state: IState): IState => ({
    ...state,
    llama3Result: {
        ...state.llama3Result,
        loading: true,
        error: false,
        success: undefined,
    }
});

export const llama3Success = (state: IState, action: IAction): IState => {
    return {
        ...state,
        llama3Result: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const llama3Failure = (state: IState, action: IAction): IState => ({
    ...state,
    llama3Result: {
        ...state.llama3Result,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const llama3Reset = (state: IState): IState => ({
    ...state,
    llama3Result: initialState.llama3Result,
});