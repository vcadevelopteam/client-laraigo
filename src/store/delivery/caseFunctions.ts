import { IAction } from "@types";
import { IState, initialState } from "./reducer";

export const deliveryLoading = (state: IState): IState => ({
    ...state,
    deliveryResult: { 
        ...state.deliveryResult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const deliverySuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        deliveryResult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        },
    }
};

export const deliveryFailure = (state: IState, action: IAction): IState => ({
    ...state,
    deliveryResult: {
        ...state.deliveryResult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const deliveryReset = (state: IState): IState => ({
    ...state,
    deliveryResult: initialState.deliveryResult,
});