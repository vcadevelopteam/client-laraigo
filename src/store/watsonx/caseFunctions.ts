import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const items = (state: IState): IState => ({
    ...state,
    items: { ...state.items, data: [], loading: true, error: false }
});

export const itemsSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        items: {
            key: action.payload.key,
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const itemsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    items: {
        ...state.items,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const itemsReset = (state: IState): IState => ({
    ...state,
    items: initialState.items,
});

export const setRow = (state: IState, action: IAction): IState => {
    return {
        ...state,
        selectedRow: action?.payload?.row||null
    }
}


export const createmention = (state: IState): IState => ({
    ...state,
    createmention: { ...state.createmention, loading: true, error: false, success: undefined }
});

export const creatementionSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        createmention: {
            data: action.payload.data || [],
            key: action.payload.key,
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const creatementionFailure = (state: IState, action: IAction): IState => ({
    ...state,
    createmention: {
        ...state.createmention,
        loading: false,
        key: action.payload.key,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const creatementionReset = (state: IState): IState => ({
    ...state,
    createmention: initialState.createmention,
});

export const intent = (state: IState): IState => ({
    ...state,
    intent: { ...state.intent, loading: true, error: false, success: undefined }
});

export const intentSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        intent: {
            data: action.payload.data || [],
            key: action.payload.key,
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const intentFailure = (state: IState, action: IAction): IState => ({
    ...state,
    intent: {
        ...state.intent,
        loading: false,
        key: action.payload.key,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const intentReset = (state: IState): IState => ({
    ...state,
    intent: initialState.intent,
});


export const itemsdetail = (state: IState): IState => ({
    ...state,
    itemsdetail: { ...state.itemsdetail, data: [], loading: true, error: false }
});

export const itemsdetailSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        itemsdetail: {
            key: action.payload.key,
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const itemsdetailFailure = (state: IState, action: IAction): IState => ({
    ...state,
    itemsdetail: {
        ...state.itemsdetail,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const itemsdetailReset = (state: IState): IState => ({
    ...state,
    itemsdetail: initialState.itemsdetail,
});


export const deleteitems = (state: IState): IState => ({
    ...state,
    deleteitems: { ...state.deleteitems, loading: true, error: false, success: undefined }
});

export const deleteitemsSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        deleteitems: {
            data: action.payload.data || [],
            key: action.payload.key,
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const deleteitemsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    deleteitems: {
        ...state.deleteitems,
        loading: false,
        key: action.payload.key,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const deleteitemsReset = (state: IState): IState => ({
    ...state,
    deleteitems: initialState.deleteitems,
});


export const entity = (state: IState): IState => ({
    ...state,
    entity: { ...state.entity, loading: true, error: false, success: undefined }
});

export const entitySuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        entity: {
            data: action.payload.data || [],
            key: action.payload.key,
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const entityFailure = (state: IState, action: IAction): IState => ({
    ...state,
    entity: {
        ...state.entity,
        loading: false,
        key: action.payload.key,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const entityReset = (state: IState): IState => ({
    ...state,
    entity: initialState.entity,
});


export const mentions = (state: IState): IState => ({
    ...state,
    mentions: { ...state.mentions, loading: true, error: false, success: undefined }
});

export const mentionsSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        mentions: {
            data: action.payload.data || [],
            key: action.payload.key,
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const mentionsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    mentions: {
        ...state.mentions,
        loading: false,
        key: action.payload.key,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const mentionsReset = (state: IState): IState => ({
    ...state,
    mentions: initialState.intent,
});

export const bulkload = (state: IState): IState => ({
    ...state,
    bulkload: { ...state.bulkload, loading: true, error: false, success: undefined }
});

export const bulkloadSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        bulkload: {
            data: action.payload.data || [],
            key: action.payload.key,
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const bulkloadFailure = (state: IState, action: IAction): IState => ({
    ...state,
    bulkload: {
        ...state.bulkload,
        loading: false,
        key: action.payload.key,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const bulkloadReset = (state: IState): IState => ({
    ...state,
    bulkload: initialState.bulkload,
});


export const conflicts = (state: IState): IState => ({
    ...state,
    conflicts: { ...state.conflicts, data: [], loading: true, error: false }
});

export const conflictsSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        conflicts: {
            key: action.payload.key,
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const conflictsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    conflicts: {
        ...state.conflicts,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const conflictsReset = (state: IState): IState => ({
    ...state,
    conflicts: initialState.conflicts,
});

export const resolveconflict = (state: IState): IState => ({
    ...state,
    resolveconflict: { ...state.resolveconflict, loading: true, error: false, success: undefined }
});

export const resolveconflictSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        resolveconflict: {
            data: action.payload.data || [],
            key: action.payload.key,
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const resolveconflictFailure = (state: IState, action: IAction): IState => ({
    ...state,
    resolveconflict: {
        ...state.resolveconflict,
        loading: false,
        key: action.payload.key,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const resolveconflictReset = (state: IState): IState => ({
    ...state,
    resolveconflict: initialState.resolveconflict,
});


export const exportItems = (state: IState): IState => ({
    ...state,
    exportItems: { ...state.exportItems, data: [], loading: true, error: false }
});

export const exportItemsSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        exportItems: {
            key: action.payload.key,
            data: action.payload.data || [],
            count: 0,
            loading: false,
            error: false
        }
    }
};

export const exportItemsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    exportItems: {
        ...state.exportItems,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    }
});

export const exportItemsReset = (state: IState): IState => ({
    ...state,
    exportItems: initialState.exportItems,
});


export const sync = (state: IState): IState => ({
    ...state,
    sync: { ...state.sync, loading: true, error: false, success: undefined }
});

export const syncSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        sync: {
            data: action.payload.data || [],
            key: action.payload.key,
            count: 0,
            loading: false,
            error: false,
            success: true,
        }
    }
};

export const syncFailure = (state: IState, action: IAction): IState => ({
    ...state,
    sync: {
        ...state.sync,
        loading: false,
        key: action.payload.key,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
        success: false,
    }
});

export const syncReset = (state: IState): IState => ({
    ...state,
    sync: initialState.sync,
});