import { IActionCall } from "@types";
import { LlamaService } from "network";
import actionTypes from "./actionTypes";

export const createCollection = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService.createCollection(requestBody),
    types: {
        loading: actionTypes.CREATE_COLLECTION,
        success: actionTypes.CREATE_COLLECTION_SUCCESS,
        failure: actionTypes.CREATE_COLLECTION_FAILURE,
    },
    type: null,
})

export const deleteCollection = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService.deleteCollection(requestBody),
    types: {
        loading: actionTypes.DELETE_COLLECTION,
        success: actionTypes.DELETE_COLLECTION_SUCCESS,
        failure: actionTypes.DELETE_COLLECTION_FAILURE,
    },
    type: null,
})

export const editCollection = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService.editCollection(requestBody),
    types: {
        loading: actionTypes.EDIT_COLLECTION,
        success: actionTypes.EDIT_COLLECTION_SUCCESS,
        failure: actionTypes.EDIT_COLLECTION_FAILURE,
    },
    type: null,
})

export const addFileLlama = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService.addFile(requestBody),
    types: {
        loading: actionTypes.ADD_FILE,
        success: actionTypes.ADD_FILE_SUCCESS,
        failure: actionTypes.ADD_FILE_FAILURE,
    },
    type: null,
})

export const deleteFileLlama = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService.deleteFile(requestBody),
    types: {
        loading: actionTypes.DELETE_FILE,
        success: actionTypes.DELETE_FILE_SUCCESS,
        failure: actionTypes.DELETE_FILE_FAILURE,
    },
    type: null,
})

export const query = (requestBody: any): IActionCall => ({
    callAPI: () => LlamaService.query(requestBody),
    types: {
        loading: actionTypes.QUERY,
        success: actionTypes.QUERY_SUCCESS,
        failure: actionTypes.QUERY_FAILURE,
    },
    type: null,
})

export const resetLlama = (): IActionCall => ({type: actionTypes.CREATE_COLLECTION_RESET});