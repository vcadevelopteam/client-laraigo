import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const main = (state: IState): IState => ({
    ...state,
    mainData: { ...state.mainData, loading: true, error: false }
});

export const mainSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainData: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const mainFailure = (state: IState, action: IAction): IState => ({
    ...state,
    mainData: {
        ...state.mainData,
        loading: false,
        error: true,
        code: action.payload.code || 'loginFailure:error',
        message: action.payload.message || 'Error al intentar loguearse',
    }
});

export const mainReset = (state: IState): IState => ({
    ...state,
    mainData: initialState.mainData,
});


export const multiMain = (state: IState): IState => ({
    ...state,
    multiData: { ...state.multiData, loading: true, error: false }
});

export const multiMainSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        multiData: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const multiMainFailure = (state: IState, action: IAction): IState => ({
    ...state,
    multiData: {
        ...state.multiData,
        loading: false,
        error: true,
        code: action.payload.code || 'loginFailure:error',
        message: action.payload.message || 'Error al intentar loguearse',
    }
});

export const multiMainReset = (state: IState): IState => ({
    ...state,
    multiData: initialState.multiData,
});
