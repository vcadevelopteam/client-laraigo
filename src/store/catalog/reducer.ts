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
    requestCatalogSynchroProduct: IRequest;
    requestCatalogImportProduct: IRequest;
    requestCatalogManageProduct: IRequest;
    requestCatalogDeleteProduct: IRequest;
    requestCatalogDownloadProduct: IRequest;
}

export const initialState: IState = {
    requestCatalogBusinessList: { ...initialCommon, data: null, loading: false, error: false },
    requestCatalogManageCatalog: { ...initialCommon, data: null, loading: false, error: false },
    requestCatalogSynchroCatalog: { ...initialCommon, data: null, loading: false, error: false },
    requestCatalogSynchroProduct: { ...initialCommon, data: null, loading: false, error: false },
    requestCatalogImportProduct: { ...initialCommon, data: null, loading: false, error: false },
    requestCatalogManageProduct: { ...initialCommon, data: null, loading: false, error: false },
    requestCatalogDeleteProduct: { ...initialCommon, data: null, loading: false, error: false },
    requestCatalogDownloadProduct: { ...initialCommon, data: null, loading: false, error: false },
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

    [actionTypes.CATALOG_SYNCHROPRODUCT]: caseFunctions.catalogSynchroProduct,
    [actionTypes.CATALOG_SYNCHROPRODUCT_FAILURE]: caseFunctions.catalogSynchroProductFailure,
    [actionTypes.CATALOG_SYNCHROPRODUCT_SUCCESS]: caseFunctions.catalogSynchroProductSuccess,
    [actionTypes.CATALOG_SYNCHROPRODUCT_RESET]: caseFunctions.catalogSynchroProductReset,

    [actionTypes.CATALOG_IMPORTPRODUCT]: caseFunctions.catalogImportProduct,
    [actionTypes.CATALOG_IMPORTPRODUCT_FAILURE]: caseFunctions.catalogImportProductFailure,
    [actionTypes.CATALOG_IMPORTPRODUCT_SUCCESS]: caseFunctions.catalogImportProductSuccess,
    [actionTypes.CATALOG_IMPORTPRODUCT_RESET]: caseFunctions.catalogImportProductReset,

    [actionTypes.CATALOG_MANAGEPRODUCT]: caseFunctions.catalogManageProduct,
    [actionTypes.CATALOG_MANAGEPRODUCT_FAILURE]: caseFunctions.catalogManageProductFailure,
    [actionTypes.CATALOG_MANAGEPRODUCT_SUCCESS]: caseFunctions.catalogManageProductSuccess,
    [actionTypes.CATALOG_MANAGEPRODUCT_RESET]: caseFunctions.catalogManageProductReset,

    [actionTypes.CATALOG_DELETEPRODUCT]: caseFunctions.catalogDeleteProduct,
    [actionTypes.CATALOG_DELETEPRODUCT_FAILURE]: caseFunctions.catalogDeleteProductFailure,
    [actionTypes.CATALOG_DELETEPRODUCT_SUCCESS]: caseFunctions.catalogDeleteProductSuccess,
    [actionTypes.CATALOG_DELETEPRODUCT_RESET]: caseFunctions.catalogDeleteProductReset,

    [actionTypes.CATALOG_DOWNLOADPRODUCT]: caseFunctions.catalogDownloadProduct,
    [actionTypes.CATALOG_DOWNLOADPRODUCT_FAILURE]: caseFunctions.catalogDownloadProductFailure,
    [actionTypes.CATALOG_DOWNLOADPRODUCT_SUCCESS]: caseFunctions.catalogDownloadProductSuccess,
    [actionTypes.CATALOG_DOWNLOADPRODUCT_RESET]: caseFunctions.catalogDownloadProductReset,
});