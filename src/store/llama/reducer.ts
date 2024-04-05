import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import actionType from "./actionTypes";
import * as caseFunctions from './caseFunctions';

export interface IRequest extends ITemplate {
    data: any;
    success: boolean | undefined | null;
}

export interface IState {
    llamaResult: IRequest,
}

export const initialState: IState = {
    llamaResult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
};

export default createReducer<IState>(initialState, {
    [actionType.CREATE_COLLECTION]: caseFunctions.llamaLoading,
    [actionType.CREATE_COLLECTION_SUCCESS]: caseFunctions.llamaSuccess,
    [actionType.CREATE_COLLECTION_FAILURE]: caseFunctions.llamaFailure,
    [actionType.CREATE_COLLECTION_RESET]: caseFunctions.llamaReset,

    [actionType.DELETE_COLLECTION]: caseFunctions.llamaLoading,
    [actionType.DELETE_COLLECTION_SUCCESS]: caseFunctions.llamaSuccess,
    [actionType.DELETE_COLLECTION_FAILURE]: caseFunctions.llamaFailure,
    [actionType.DELETE_COLLECTION_RESET]: caseFunctions.llamaReset,

    [actionType.ADD_FILE]: caseFunctions.llamaLoading,
    [actionType.ADD_FILE_SUCCESS]: caseFunctions.llamaSuccess,
    [actionType.ADD_FILE_FAILURE]: caseFunctions.llamaFailure,
    [actionType.ADD_FILE_RESET]: caseFunctions.llamaReset,

    [actionType.QUERY]: caseFunctions.llamaLoading,
    [actionType.QUERY_SUCCESS]: caseFunctions.llamaSuccess,
    [actionType.QUERY_FAILURE]: caseFunctions.llamaFailure,
    [actionType.QUERY_RESET]: caseFunctions.llamaReset,
});