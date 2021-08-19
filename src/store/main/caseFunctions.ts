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

export const mainAux = (state: IState): IState => ({
    ...state,
    mainAux: { ...state.mainAux, loading: true, error: false }
});

export const mainAuxSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainAux: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const mainAuxFailure = (state: IState, action: IAction): IState => ({
    ...state,
    mainAux: {
        ...state.mainAux,
        loading: false,
        error: true,
        code: action.payload.code || 'loginFailure:error',
        message: action.payload.message || 'Error al intentar loguearse',
    }
});

export const mainAuxReset = (state: IState): IState => ({
    ...state,
    mainAux: initialState.mainAux,
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




export const auxMultiMain = (state: IState): IState => ({
    ...state,
    multiDataAux: { ...state.multiDataAux, loading: true, error: false }
});

export const auxMultiMainSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        multiDataAux: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const auxMultiMainFailure = (state: IState, action: IAction): IState => ({
    ...state,
    multiDataAux: {
        ...state.multiDataAux,
        loading: false,
        error: true,
        code: action.payload.code || 'loginFailure:error',
        message: action.payload.message || 'Error al intentar loguearse',
    }
});

export const auxMultiMainReset = (state: IState): IState => ({
    ...state,
    multiDataAux: initialState.multiDataAux,
});



export const execute = (state: IState): IState => ({
    ...state,
    execute: { ...state.execute, loading: true, error: false }
});

export const executeSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        execute: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const executeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    execute: {
        ...state.execute,
        loading: false,
        error: true,
        code: action.payload.code || 'loginFailure:error',
        message: action.payload.message || 'Error al intentar loguearse',
    }
});

export const executeReset = (state: IState): IState => ({
    ...state,
    execute: initialState.execute,
});

export const mainPaginated = (state: IState): IState => ({
    ...state,
    mainPaginated: { ...state.mainPaginated, loading: true, error: false }
});

export const mainPaginatedSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainPaginated: {
            data: action.payload.data || [],
            count: action.payload.count || 0,
            loading: false,
            error: false
        }
    }
};

export const mainPaginatedFailure = (state: IState, action: IAction): IState => ({
    ...state,
    mainPaginated: {
        ...state.mainPaginated,
        loading: false,
        error: true,
        code: action.payload.code || 'loginFailure:error',
        message: action.payload.message || 'Error al intentar loguearse',
    }
});

export const mainPaginatedReset = (state: IState): IState => ({
    ...state,
    mainPaginated: initialState.mainPaginated,
});
