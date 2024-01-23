import { IActionCall } from "@types";
import { GptService } from "network";
import actionTypes from "./actionTypes";

export const createThread = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.createThread(requestBody),
    types: {
        loading: actionTypes.GPTTHREAD,
        success: actionTypes.THREAD_SUCCESS,
        failure: actionTypes.THREAD_FAILURE,
    },
    type: null,
});

export const deleteThread = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.deleteThread(requestBody),
    types: {
        loading: actionTypes.DELETE_THREAD,
        success: actionTypes.DELETE_THREAD_SUCCESS,
        failure: actionTypes.DELETE_THREAD_FAILURE,
    },
    type: null,
});

export const createAssistant = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.createAssistant(requestBody),
    types: {
        loading: actionTypes.CREATE_ASSISTANT,
        success: actionTypes.CREATE_ASSISTANT_SUCCESS,
        failure: actionTypes.CREATE_ASSISTANT_FAILURE
    },
    type: null,
});

export const sendMessages = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.messages(requestBody),
    types: {
        loading: actionTypes.MESSAGES,
        success: actionTypes.MESSAGES_SUCCESS,
        failure: actionTypes.MESSAGES_FAILURE,
    },
    type: null,
});

export const deleteFile = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.deleteFile(requestBody),
    types: {
        loading: actionTypes.DELETE_FILE,
        success: actionTypes.DELETE_FILE_SUCCESS,
        failure: actionTypes.DELETE_FILE_FAILURE,
    },
    type: null,
});

export const addFile = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.addFile(requestBody),
    types: {
        loading: actionTypes.ADD_FILE,
        success: actionTypes.ADD_FILE_SUCCESS,
        failure: actionTypes.ADD_FILE_FAILURE,
    },
    type: null,
});

export const assignFile = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.assignFile(requestBody),
    types: {
        loading: actionTypes.ASSIGN_FILE,
        success: actionTypes.ASSIGN_FILE_SUCCESS,
        failure: actionTypes.ASSIGN_FILE_FAILURE,
    },
    type: null,
});

export const verifyFile = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.verifyFile(requestBody),
    types: {
        loading: actionTypes.VERIFY_FILE,
        success: actionTypes.VERIFY_FILE_SUCCESS,
        failure: actionTypes.VERIFY_FILE_FAILURE
    },
    type: null,
});

export const updateAssistant = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.updateAssistant(requestBody),
    types: {
        loading: actionTypes.UPDATE_ASSISTANT,
        success: actionTypes.UPDATE_ASSISTANT_SUCCESS,
        failure: actionTypes.UPDATE_ASSISTANT_FAILURE,
    },
    type: null,
});

export const deleteAssistant = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.deleteAssistant(requestBody),
    types: {
        loading: actionTypes.DELETE_ASSISTANT,
        success: actionTypes.DELETE_ASSISTANT_SUCCESS,
        failure: actionTypes.DELETE_ASSISTANT_FAILURE,
    },
    type: null,
});

export const resetGptThread = (): IActionCall => ({type: actionTypes.THREAD_RESET});