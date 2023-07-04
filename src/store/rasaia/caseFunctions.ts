import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const rasaiaTrain = (state: IState): IState => ({
    ...state,
    rasaiatrainresult: { 
        ...state.rasaiatrainresult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const rasaiaTrainSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        rasaiatrainresult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const rasaiaTrainFailure = (state: IState, action: IAction): IState => ({
    ...state,
    rasaiatrainresult: {
        ...state.rasaiatrainresult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const rasaiaTrainReset = (state: IState): IState => ({
    ...state,
    rasaiatrainresult: initialState.rasaiatrainresult,
});

export const rasaiaDownload = (state: IState): IState => ({
    ...state,
    rasaiadownloadresult: { 
        ...state.rasaiadownloadresult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const rasaiaDownloadSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        rasaiadownloadresult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const rasaiaDownloadFailure = (state: IState, action: IAction): IState => ({
    ...state,
    rasaiadownloadresult: {
        ...state.rasaiadownloadresult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const rasaiaDownloadReset = (state: IState): IState => ({
    ...state,
    rasaiadownloadresult: initialState.rasaiadownloadresult,
});

export const rasaiaUpload = (state: IState): IState => ({
    ...state,
    rasaiauploadresult: { 
        ...state.rasaiauploadresult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const rasaiaUploadSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        rasaiauploadresult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const rasaiaUploadFailure = (state: IState, action: IAction): IState => ({
    ...state,
    rasaiauploadresult: {
        ...state.rasaiauploadresult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const rasaiaUploadReset = (state: IState): IState => ({
    ...state,
    rasaiauploadresult: initialState.rasaiauploadresult,
});

export const rasaiaModelList = (state: IState): IState => ({
    ...state,
    rasaiamodellistresult: { 
        ...state.rasaiamodellistresult, 
        loading: true, 
        error: false, 
        success: undefined 
    }
});

export const rasaiaModelListSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        rasaiamodellistresult: {
            ...action.payload,
            data: action.payload.data || [],
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const rasaiaModelListFailure = (state: IState, action: IAction): IState => ({
    ...state,
    rasaiamodellistresult: {
        ...state.rasaiamodellistresult,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const rasaiaModelListReset = (state: IState): IState => ({
    ...state,
    rasaiamodellistresult: initialState.rasaiamodellistresult,
});
