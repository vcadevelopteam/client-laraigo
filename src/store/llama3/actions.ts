import { IActionCall } from "@types";
import { LlamaService3 } from "network";
import actionTypes from "./actionTypes";

export const createCollection3 = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService3.createCollection3(requestBody),
    types: {
        loading: actionTypes.CREATE_COLLECTION,
        success: actionTypes.CREATE_COLLECTION_SUCCESS,
        failure: actionTypes.CREATE_COLLECTION_FAILURE,
    },
    type: null,
})

export const createCollectionDocuments3 = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService3.createCollectionDocuments3(requestBody),
    types: {
        loading: actionTypes.CREATE_COLLECTION_DOCUMENTS,
        success: actionTypes.CREATE_COLLECTION_DOCUMENTS_SUCCESS,
        failure: actionTypes.CREATE_COLLECTION_DOCUMENTS_FAILURE,
    },
    type: null,
})

export const massiveDeleteCollection3 = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService3.massiveDeleteCollection3(requestBody),
    types: {
        loading: actionTypes.MASSIVE_DELETE_COLLECTION,
        success: actionTypes.MASSIVE_DELETE_COLLECTION_SUCCESS,
        failure: actionTypes.MASSIVE_DELETE_COLLECTION_FAILURE,
    },
    type: null,
})

export const editCollection3 = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService3.editCollection3(requestBody),
    types: {
        loading: actionTypes.EDIT_COLLECTION,
        success: actionTypes.EDIT_COLLECTION_SUCCESS,
        failure: actionTypes.EDIT_COLLECTION_FAILURE,
    },
    type: null,
})

export const addFilesLlama3 = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService3.addFiles3(requestBody),
    types: {
        loading: actionTypes.ADD_FILES,
        success: actionTypes.ADD_FILES_SUCCESS,
        failure: actionTypes.ADD_FILES_FAILURE,
    },
    type: null,
})

export const deleteFileLlama3 = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService3.deleteFile3(requestBody),
    types: {
        loading: actionTypes.DELETE_FILE,
        success: actionTypes.DELETE_FILE_SUCCESS,
        failure: actionTypes.DELETE_FILE_FAILURE,
    },
    type: null,
})

export const deleteThreadLlama3 = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService3.deleteThread3(requestBody),
    types: {
        loading: actionTypes.DELETE_THREAD,
        success: actionTypes.DELETE_THREAD_SUCCESS,
        failure: actionTypes.DELETE_THREAD_FAILURE,
    },
    type: null,
})

export const query3 = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService3.query3(requestBody),
    types: {
        loading: actionTypes.QUERY,
        success: actionTypes.QUERY_SUCCESS,
        failure: actionTypes.QUERY_FAILURE,
    },
    type: null,
})

export const resetLlama = (): IActionCall => ({type: actionTypes.CREATE_COLLECTION_RESET});