import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import actionType from "./actionTypes";
import * as caseFunctions from './caseFunctions';

export interface IRequest extends ITemplate {
    data: any;
    success: boolean | undefined | null;
}

export interface IState {
    llama3Result: IRequest,
}

export const initialState: IState = {
    llama3Result: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
};

export default createReducer<IState>(initialState, {
    [actionType.CREATE_COLLECTION]: caseFunctions.llama3Loading,
    [actionType.CREATE_COLLECTION_SUCCESS]: caseFunctions.llama3Success,
    [actionType.CREATE_COLLECTION_FAILURE]: caseFunctions.llama3Failure,
    [actionType.CREATE_COLLECTION_RESET]: caseFunctions.llama3Reset,

    [actionType.CREATE_COLLECTION_DOCUMENT]: caseFunctions.llama3Loading,
    [actionType.CREATE_COLLECTION_DOCUMENT_SUCCESS]: caseFunctions.llama3Success,
    [actionType.CREATE_COLLECTION_DOCUMENT_FAILURE]: caseFunctions.llama3Failure,
    [actionType.CREATE_COLLECTION_DOCUMENT_RESET]: caseFunctions.llama3Reset,

    [actionType.CREATE_COLLECTION_DOCUMENTS]: caseFunctions.llama3Loading,
    [actionType.CREATE_COLLECTION_DOCUMENTS_SUCCESS]: caseFunctions.llama3Success,
    [actionType.CREATE_COLLECTION_DOCUMENTS_FAILURE]: caseFunctions.llama3Failure,
    [actionType.CREATE_COLLECTION_DOCUMENTS_RESET]: caseFunctions.llama3Reset,

    [actionType.DELETE_COLLECTION]: caseFunctions.llama3Loading,
    [actionType.DELETE_COLLECTION_SUCCESS]: caseFunctions.llama3Success,
    [actionType.DELETE_COLLECTION_FAILURE]: caseFunctions.llama3Failure,
    [actionType.DELETE_COLLECTION_RESET]: caseFunctions.llama3Reset,

    [actionType.MASSIVE_DELETE_COLLECTION]: caseFunctions.llama3Loading,
    [actionType.MASSIVE_DELETE_COLLECTION_SUCCESS]: caseFunctions.llama3Success,
    [actionType.MASSIVE_DELETE_COLLECTION_FAILURE]: caseFunctions.llama3Failure,
    [actionType.MASSIVE_DELETE_COLLECTION_RESET]: caseFunctions.llama3Reset,

    [actionType.EDIT_COLLECTION]: caseFunctions.llama3Loading,
    [actionType.EDIT_COLLECTION_SUCCESS]: caseFunctions.llama3Success,
    [actionType.EDIT_COLLECTION_FAILURE]: caseFunctions.llama3Failure,
    [actionType.EDIT_COLLECTION_RESET]: caseFunctions.llama3Reset,

    [actionType.ADD_FILE]: caseFunctions.llama3Loading,
    [actionType.ADD_FILE_SUCCESS]: caseFunctions.llama3Success,
    [actionType.ADD_FILE_FAILURE]: caseFunctions.llama3Failure,
    [actionType.ADD_FILE_RESET]: caseFunctions.llama3Reset,

    [actionType.ADD_FILES]: caseFunctions.llama3Loading,
    [actionType.ADD_FILES_SUCCESS]: caseFunctions.llama3Success,
    [actionType.ADD_FILES_FAILURE]: caseFunctions.llama3Failure,
    [actionType.ADD_FILES_RESET]: caseFunctions.llama3Reset,

    [actionType.DELETE_FILE]: caseFunctions.llama3Loading,
    [actionType.DELETE_FILE_SUCCESS]: caseFunctions.llama3Success,
    [actionType.DELETE_FILE_FAILURE]: caseFunctions.llama3Failure,
    [actionType.DELETE_FILE_RESET]: caseFunctions.llama3Reset,

    [actionType.QUERY]: caseFunctions.llama3Loading,
    [actionType.QUERY_SUCCESS]: caseFunctions.llama3Success,
    [actionType.QUERY_FAILURE]: caseFunctions.llama3Failure,
    [actionType.QUERY_RESET]: caseFunctions.llama3Reset,

    [actionType.DELETE_THREAD]: caseFunctions.llama3Loading,
    [actionType.DELETE_THREAD_SUCCESS]: caseFunctions.llama3Success,
    [actionType.DELETE_THREAD_FAILURE]: caseFunctions.llama3Failure,
    [actionType.DELETE_THREAD_RESET]: caseFunctions.llama3Reset,
});