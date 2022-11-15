import { IAction } from "@types";
import { initialState, IState } from "./reducer";


export const getVersion = (state: IState): IState => ({
    ...state,
    getVersion: { ...state.getVersion, loading: true, error: false, success: undefined }
});

export const getVersionSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        getVersion: {
            data: action.payload || [],
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const getVersionFailure = (state: IState, action: IAction): IState => ({
    ...state,
    getVersion: {
        ...state.getVersion,
        loading: false,
        error: true,
        key: action.payload.key,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const getVersionReset = (state: IState): IState => ({
    ...state,
    getVersion: initialState.getVersion,
});