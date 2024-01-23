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
        loading: actionTypes.GPTTHREAD,
        success: actionTypes.THREAD_SUCCESS,
        failure: actionTypes.THREAD_FAILURE,
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
        loading: actionTypes.GPTTHREAD,
        success: actionTypes.THREAD_SUCCESS,
        failure: actionTypes.THREAD_FAILURE,
    },
    type: null,
});

export const deleteFile = (requestBody: any): IActionCall => ({
    callAPI: () => GptService.deleteFile(requestBody),
    types: {
        loading: actionTypes.GPTTHREAD,
        success: actionTypes.THREAD_SUCCESS,
        failure: actionTypes.THREAD_FAILURE,
    },
    type: null,
});

export const resetGptThread = (): IActionCall => ({type: actionTypes.THREAD_RESET});