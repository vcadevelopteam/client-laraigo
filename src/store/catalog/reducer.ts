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
}

export const initialState: IState = {
    requestCatalogBusinessList: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.CATALOG_BUSINESSLIST]: caseFunctions.catalogBusinessList,
    [actionTypes.CATALOG_BUSINESSLIST_FAILURE]: caseFunctions.catalogBusinessListFailure,
    [actionTypes.CATALOG_BUSINESSLIST_SUCCESS]: caseFunctions.catalogBusinessListSuccess,
    [actionTypes.CATALOG_BUSINESSLIST_RESET]: caseFunctions.catalogBusinessListReset,
});