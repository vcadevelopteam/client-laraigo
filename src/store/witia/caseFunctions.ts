import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const witaiTest = (state: IState): IState => ({
    ...state,
    witaitestresult: { 
        ...state.witaitestresult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const witaiTestSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        witaitestresult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const witaiTestFailure = (state: IState, action: IAction): IState => ({
    ...state,
    witaitestresult: {
        ...state.witaitestresult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const witaiTestReset = (state: IState): IState => ({
    ...state,
    witaitrainresult: initialState.witaitrainresult,
});

export const witaiTrain = (state: IState): IState => ({
    ...state,
    witaitrainresult: { 
        ...state.witaitrainresult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const witaiTrainSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        witaitrainresult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const witaiTrainFailure = (state: IState, action: IAction): IState => ({
    ...state,
    witaitrainresult: {
        ...state.witaitrainresult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const witaiTrainReset = (state: IState): IState => ({
    ...state,
    witaitrainresult: initialState.witaitrainresult,
});

export const operationPost = (state: IState): IState => ({
    ...state,
    witaioperationresult: { 
        ...state.witaioperationresult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const operationPostSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        witaioperationresult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const operationPostFailure = (state: IState, action: IAction): IState => ({
    ...state,
    witaioperationresult: {
        ...state.witaioperationresult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const resteOperationResult = (state: IState): IState => ({
    ...state,
    witaioperationresult: initialState.witaioperationresult,
});