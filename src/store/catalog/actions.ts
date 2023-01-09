import { IActionCall } from "@types";
import { CatalogService } from "network";

import actionTypes from "./actionTypes";

export const catalogBusinessList = (request: any): IActionCall => ({
    callAPI: () => CatalogService.catalogBusinessList(request),
    types: {
        loading: actionTypes.CATALOG_BUSINESSLIST,
        success: actionTypes.CATALOG_BUSINESSLIST_SUCCESS,
        failure: actionTypes.CATALOG_BUSINESSLIST_FAILURE,
    },
    type: null,
});

export const resetCatalogBusinessList = (): IActionCall => ({ type: actionTypes.CATALOG_BUSINESSLIST_RESET });

export const catalogManageCatalog = (request: any): IActionCall => ({
    callAPI: () => CatalogService.catalogManageCatalog(request),
    types: {
        loading: actionTypes.CATALOG_MANAGECATALOG,
        success: actionTypes.CATALOG_MANAGECATALOG_SUCCESS,
        failure: actionTypes.CATALOG_MANAGECATALOG_FAILURE,
    },
    type: null,
});

export const resetCatalogManageCatalog = (): IActionCall => ({ type: actionTypes.CATALOG_MANAGECATALOG_RESET });

export const catalogSynchroCatalog = (request: any): IActionCall => ({
    callAPI: () => CatalogService.catalogSynchroCatalog(request),
    types: {
        loading: actionTypes.CATALOG_SYNCHROCATALOG,
        success: actionTypes.CATALOG_SYNCHROCATALOG_SUCCESS,
        failure: actionTypes.CATALOG_SYNCHROCATALOG_FAILURE,
    },
    type: null,
});

export const resetCatalogSynchroCatalog = (): IActionCall => ({ type: actionTypes.CATALOG_SYNCHROCATALOG_RESET });

export const catalogSynchroProduct = (request: any): IActionCall => ({
    callAPI: () => CatalogService.catalogSynchroProduct(request),
    types: {
        loading: actionTypes.CATALOG_SYNCHROPRODUCT,
        success: actionTypes.CATALOG_SYNCHROPRODUCT_SUCCESS,
        failure: actionTypes.CATALOG_SYNCHROPRODUCT_FAILURE,
    },
    type: null,
});

export const resetCatalogSynchroProduct = (): IActionCall => ({ type: actionTypes.CATALOG_SYNCHROPRODUCT_RESET });

export const catalogImportProduct = (request: any): IActionCall => ({
    callAPI: () => CatalogService.catalogImportProduct(request),
    types: {
        loading: actionTypes.CATALOG_IMPORTPRODUCT,
        success: actionTypes.CATALOG_IMPORTPRODUCT_SUCCESS,
        failure: actionTypes.CATALOG_IMPORTPRODUCT_FAILURE,
    },
    type: null,
});

export const resetCatalogImportProduct = (): IActionCall => ({ type: actionTypes.CATALOG_IMPORTPRODUCT_RESET });

export const catalogManageProduct = (request: any): IActionCall => ({
    callAPI: () => CatalogService.catalogManageProduct(request),
    types: {
        loading: actionTypes.CATALOG_MANAGEPRODUCT,
        success: actionTypes.CATALOG_MANAGEPRODUCT_SUCCESS,
        failure: actionTypes.CATALOG_MANAGEPRODUCT_FAILURE,
    },
    type: null,
});

export const resetCatalogManageProduct = (): IActionCall => ({ type: actionTypes.CATALOG_MANAGEPRODUCT_RESET });

export const catalogDeleteProduct = (request: any): IActionCall => ({
    callAPI: () => CatalogService.catalogDeleteProduct(request),
    types: {
        loading: actionTypes.CATALOG_DELETEPRODUCT,
        success: actionTypes.CATALOG_DELETEPRODUCT_SUCCESS,
        failure: actionTypes.CATALOG_DELETEPRODUCT_FAILURE,
    },
    type: null,
});

export const resetCatalogDeleteProduct = (): IActionCall => ({ type: actionTypes.CATALOG_DELETEPRODUCT_RESET });