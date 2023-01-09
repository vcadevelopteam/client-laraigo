import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const catalogBusinessList = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogBusinessList: {
        ...state.requestCatalogBusinessList,
        error: false,
        loading: true,
    }
})

export const catalogBusinessListFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogBusinessList: {
        ...state.requestCatalogBusinessList,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const catalogBusinessListSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogBusinessList: {
        ...state.requestCatalogBusinessList,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const catalogBusinessListReset = (state: IState): IState => ({
    ...state,
    requestCatalogBusinessList: initialState.requestCatalogBusinessList,
})

export const catalogManageCatalog = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogManageCatalog: {
        ...state.requestCatalogManageCatalog,
        error: false,
        loading: true,
    }
})

export const catalogManageCatalogFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogManageCatalog: {
        ...state.requestCatalogManageCatalog,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const catalogManageCatalogSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogManageCatalog: {
        ...state.requestCatalogManageCatalog,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const catalogManageCatalogReset = (state: IState): IState => ({
    ...state,
    requestCatalogManageCatalog: initialState.requestCatalogManageCatalog,
})

export const catalogSynchroCatalog = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogSynchroCatalog: {
        ...state.requestCatalogSynchroCatalog,
        error: false,
        loading: true,
    }
})

export const catalogSynchroCatalogFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogSynchroCatalog: {
        ...state.requestCatalogSynchroCatalog,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const catalogSynchroCatalogSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogSynchroCatalog: {
        ...state.requestCatalogSynchroCatalog,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const catalogSynchroCatalogReset = (state: IState): IState => ({
    ...state,
    requestCatalogSynchroCatalog: initialState.requestCatalogSynchroCatalog,
})

export const catalogSynchroProduct = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogSynchroProduct: {
        ...state.requestCatalogSynchroProduct,
        error: false,
        loading: true,
    }
})

export const catalogSynchroProductFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogSynchroProduct: {
        ...state.requestCatalogSynchroProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const catalogSynchroProductSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogSynchroProduct: {
        ...state.requestCatalogSynchroProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const catalogSynchroProductReset = (state: IState): IState => ({
    ...state,
    requestCatalogSynchroProduct: initialState.requestCatalogSynchroProduct,
})

export const catalogImportProduct = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogImportProduct: {
        ...state.requestCatalogImportProduct,
        error: false,
        loading: true,
    }
})

export const catalogImportProductFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogImportProduct: {
        ...state.requestCatalogImportProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const catalogImportProductSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogImportProduct: {
        ...state.requestCatalogImportProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const catalogImportProductReset = (state: IState): IState => ({
    ...state,
    requestCatalogImportProduct: initialState.requestCatalogImportProduct,
})

export const catalogManageProduct = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogManageProduct: {
        ...state.requestCatalogManageProduct,
        error: false,
        loading: true,
    }
})

export const catalogManageProductFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogManageProduct: {
        ...state.requestCatalogManageProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const catalogManageProductSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogManageProduct: {
        ...state.requestCatalogManageProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const catalogManageProductReset = (state: IState): IState => ({
    ...state,
    requestCatalogManageProduct: initialState.requestCatalogManageProduct,
})

export const catalogDeleteProduct = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogDeleteProduct: {
        ...state.requestCatalogDeleteProduct,
        error: false,
        loading: true,
    }
})

export const catalogDeleteProductFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogDeleteProduct: {
        ...state.requestCatalogDeleteProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const catalogDeleteProductSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogDeleteProduct: {
        ...state.requestCatalogDeleteProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const catalogDeleteProductReset = (state: IState): IState => ({
    ...state,
    requestCatalogDeleteProduct: initialState.requestCatalogDeleteProduct,
})

export const catalogDownloadProduct = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogDownloadProduct: {
        ...state.requestCatalogDownloadProduct,
        error: false,
        loading: true,
    }
})

export const catalogDownloadProductFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogDownloadProduct: {
        ...state.requestCatalogDownloadProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const catalogDownloadProductSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestCatalogDownloadProduct: {
        ...state.requestCatalogDownloadProduct,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const catalogDownloadProductReset = (state: IState): IState => ({
    ...state,
    requestCatalogDownloadProduct: initialState.requestCatalogDownloadProduct,
})