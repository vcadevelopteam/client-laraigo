import { createReducer, initialCommon } from "common/helpers";
import { ITemplate } from "@types";

import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data?: any | null;
    msg?: string | null;
}

export interface IState {
    requestCatalogBusinessList: IRequest;
    requestCatalogManageCatalog: IRequest;
    requestCatalogSynchroCatalog: IRequest;
}

export const initialState: IState = {
    requestCatalogBusinessList: { ...initialCommon, data: null, loading: false, error: false },
    requestCatalogManageCatalog: { ...initialCommon, data: null, loading: false, error: false },
    requestCatalogSynchroCatalog: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.CATALOG_BUSINESSLIST]: caseFunctions.catalogBusinessList,
    [actionTypes.CATALOG_BUSINESSLIST_FAILURE]: caseFunctions.catalogBusinessListFailure,
    [actionTypes.CATALOG_BUSINESSLIST_SUCCESS]: caseFunctions.catalogBusinessListSuccess,
    [actionTypes.CATALOG_BUSINESSLIST_RESET]: caseFunctions.catalogBusinessListReset,

    [actionTypes.CATALOG_MANAGECATALOG]: caseFunctions.catalogManageCatalog,
    [actionTypes.CATALOG_MANAGECATALOG_FAILURE]: caseFunctions.catalogManageCatalogFailure,
    [actionTypes.CATALOG_MANAGECATALOG_SUCCESS]: caseFunctions.catalogManageCatalogSuccess,
    [actionTypes.CATALOG_MANAGECATALOG_RESET]: caseFunctions.catalogManageCatalogReset,

    [actionTypes.CATALOG_SYNCHROCATALOG]: caseFunctions.catalogSynchroCatalog,
    [actionTypes.CATALOG_SYNCHROCATALOG_FAILURE]: caseFunctions.catalogSynchroCatalogFailure,
    [actionTypes.CATALOG_SYNCHROCATALOG_SUCCESS]: caseFunctions.catalogSynchroCatalogSuccess,
    [actionTypes.CATALOG_SYNCHROCATALOG_RESET]: caseFunctions.catalogSynchroCatalogReset,
});