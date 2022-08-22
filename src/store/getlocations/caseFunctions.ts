import { IAction } from "@types";
import { initialState, IState } from "./reducer";


export const getLocations = (state: IState): IState => ({
    ...state,
    getLocations: { ...state.getLocations, loading: true, error: false, success: undefined }
});

export const getLocationsSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        getLocations: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const getLocationsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    getLocations: {
        ...state.getLocations,
        loading: false,
        error: true,
        key: action.payload.key,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const getLocationsReset = (state: IState): IState => ({
    ...state,
    getLocations: initialState.getLocations,
});