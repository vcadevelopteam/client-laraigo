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
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const mainReset = (state: IState): IState => ({
    ...state,
    mainData: initialState.mainData,
});




export const mainDynamic = (state: IState): IState => ({
    ...state,
    mainDynamic: { ...state.mainDynamic, loading: true, error: false }
});

export const mainDynamicSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainDynamic: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const mainDynamicFailure = (state: IState, action: IAction): IState => ({
    ...state,
    mainDynamic: {
        ...state.mainDynamic,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const mainDynamicReset = (state: IState): IState => ({
    ...state,
    mainDynamic: initialState.mainDynamic,
});

export const exportDataDynamic = (state: IState): IState => ({
    ...state,
    exportDynamicData: { ...state.exportDynamicData, loading: true, error: false }
});

export const exportDataDynamicSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        exportDynamicData: {
            url: action.payload.url,
            loading: false,
            code: undefined,
            error: false,
            message: undefined,
        }
    }
};

export const exportDataDynamicFailure = (state: IState, action: IAction): IState => ({
    ...state,
    exportDynamicData: {
        ...state.exportDynamicData,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const exportDataDynamicReset = (state: IState): IState => ({
    ...state,
    exportDynamicData: initialState.exportDynamicData,
});







export const uploadFile = (state: IState): IState => ({
    ...state,
    uploadFile: { ...state.uploadFile, loading: true, error: false }
});

export const uploadFileSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        uploadFile: {
            url: action.payload.url,
            loading: false,
            code: undefined,
            error: false,
            message: undefined,
        }
    }
};

export const uploadFileFailure = (state: IState, action: IAction): IState => ({
    ...state,
    uploadFile: {
        ...state.uploadFile,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const uploadFileReset = (state: IState): IState => ({
    ...state,
    uploadFile: initialState.uploadFile,
});





export const exportData = (state: IState): IState => ({
    ...state,
    exportData: { ...state.exportData, loading: true, error: false }
});

export const exportDataSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        exportData: {
            url: action.payload.url,
            loading: false,
            code: undefined,
            error: false,
            message: undefined,
        }
    }
};

export const exportDataFailure = (state: IState, action: IAction): IState => ({
    ...state,
    exportData: {
        ...state.exportData,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const exportDataReset = (state: IState): IState => ({
    ...state,
    exportData: initialState.exportData,
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
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
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
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
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
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const auxMultiMainReset = (state: IState): IState => ({
    ...state,
    multiDataAux: initialState.multiDataAux,
});



export const execute = (state: IState): IState => ({
    ...state,
    execute: { ...state.execute, loading: true, error: false, success: undefined }
});

export const executeSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        execute: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const executeFailure = (state: IState, action: IAction): IState => ({
    ...state,
    execute: {
        ...state.execute,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
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
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const mainPaginatedReset = (state: IState): IState => ({
    ...state,
    mainPaginated: initialState.mainPaginated,
});

export const resetAll = (state: IState): IState => ({
    ...initialState,
});
