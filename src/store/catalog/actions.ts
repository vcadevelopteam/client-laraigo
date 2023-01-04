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