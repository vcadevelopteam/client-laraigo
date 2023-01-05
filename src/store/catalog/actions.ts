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