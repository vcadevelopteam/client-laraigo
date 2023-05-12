import { IAction } from "@types";
import { initialState, IState } from "./reducer";


export const mainEventBooking = (state: IState): IState => ({
    ...state,
    mainEventBooking: { ...state.mainEventBooking, data: [], loading: true, error: false }
});

export const mainEventBookingSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainEventBooking: {
            key: action.payload.key,
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const mainEventBookingFailure = (state: IState, action: IAction): IState => ({
    ...state,
    mainEventBooking: {
        ...state.mainEventBooking,
        key: action.payload.key,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const mainEventBookingReset = (state: IState): IState => ({
    ...state,
    mainEventBooking: initialState.mainEventBooking,
});



export const main = (state: IState): IState => ({
    ...state,
    mainData: { ...state.mainData, data: [], loading: true, error: false }
});

export const mainSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainData: {
            key: action.payload.key,
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
            height: action.payload.height,
            width: action.payload.width,
            name: action.payload.name,
            thumbnail: action.payload.thumbnail,
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
            key: action.payload.key,
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

export const mainAux2 = (state: IState): IState => ({
    ...state,
    mainAux2: { ...state.mainAux2, loading: true, error: false }
});

export const mainAux2Success = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainAux2: {
            key: action.payload.key,
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const mainAux2Failure = (state: IState, action: IAction): IState => ({
    ...state,
    mainAux2: {
        ...state.mainAux2,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const mainAux2Reset = (state: IState): IState => ({
    ...state,
    mainAux2: initialState.mainAux2,
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

export const aux2MultiMain = (state: IState): IState => ({
    ...state,
    multiDataAux2: { ...state.multiDataAux2, loading: true, error: false }
});

export const aux2MultiMainSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        multiDataAux2: {
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const aux2MultiMainFailure = (state: IState, action: IAction): IState => ({
    ...state,
    multiDataAux2: {
        ...state.multiDataAux2,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const aux2MultiMainReset = (state: IState): IState => ({
    ...state,
    multiDataAux2: initialState.multiDataAux2,
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
            key: action.payload.key,
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
        key: action.payload.key,
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





export const testRequest = (state: IState): IState => ({
    ...state,
    testRequest: { ...state.testRequest, loading: true, error: false }
});

export const testRequestSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        testRequest: {
            data: action.payload || [],
            loading: false,
            error: false,
            code: "",
            message: "",
        }
    }
};

export const testRequestFailure = (state: IState, action: IAction): IState => {
    return {
    ...state,
    testRequest: {
        ...state.execute,
        data: action.payload || [],
        loading: false,
        error: (action.payload.data !== undefined) ? false : true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
}};

export const testRequestReset = (state: IState): IState => ({
    ...state,
    testRequest: initialState.testRequest,
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

export const mainAuxPaginated = (state: IState): IState => ({
    ...state,
    mainPaginatedAux: { ...state.mainPaginatedAux, loading: true, error: false }
});

export const mainAuxPaginatedSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainPaginatedAux: {
            data: action.payload.data || [],
            count: action.payload.count || 0,
            loading: false,
            error: false
        }
    }
};

export const mainAuxPaginatedFailure = (state: IState, action: IAction): IState => ({
    ...state,
    mainPaginatedAux: {
        ...state.mainPaginatedAux,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const mainAuxPaginatedReset = (state: IState): IState => ({
    ...state,
    mainPaginatedAux: initialState.mainPaginatedAux,
});

export const mainGraphic = (state: IState): IState => ({
    ...state,
    mainGraphic: { ...state.mainGraphic, loading: true, error: false }
});

export const mainGraphicSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mainGraphic: {
            key: action.payload.key,
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const mainGraphicFailure = (state: IState, action: IAction): IState => ({
    ...state,
    mainGraphic: {
        ...state.mainGraphic,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const mainGraphicReset = (state: IState): IState => ({
    ...state,
    mainGraphic: initialState.mainGraphic,
});

export const resetAll = (state: IState): IState => ({
    ...initialState,
});

export const setMemoryTable = (state: IState, action: IAction): IState => ({
    ...state,
    memoryTable: {
        page: (action.payload.page === undefined || action.payload.page === null) ? state.memoryTable.page : action.payload.page,
        id: (action.payload.id === undefined || action.payload.id === null) ? state.memoryTable.id : action.payload.id,
        pageSize: (action.payload.pageSize === undefined || action.payload.pageSize === null) ? state.memoryTable.pageSize : action.payload.pageSize,
        filters: {
            ...state.memoryTable.filters,
            ...(action.payload.filter || {})
        }
    },
});
export const setViewChange = (state: IState, action: IAction): IState => ({
    ...state,
    viewChange: action.payload,
});

export const cleanViewChange = (state: IState): IState => ({
    ...state,
    viewChange: "",
});
export const cleanMemoryTable = (state: IState): IState => ({
    ...state,
    memoryTable: initialState.memoryTable,
});