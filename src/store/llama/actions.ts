import { IActionCall } from "@types";
import { GptService } from "network";
import actionTypes from "./actionTypes";

interface ILlamaFileUpload {
    file_url: string;
}

interface ILlamaMessage {
    text: string;
    assistant_id: number;
    node_id: string;
}

export const uploadFileLlama = (requestBody: ILlamaFileUpload): IActionCall => ({
    callAPI: () => GptService.uploadFileLlama(requestBody),
    types: {
        loading: actionTypes.UPLOAD_FILE,
        success: actionTypes.UPLOAD_FILE_SUCCESS,
        failure: actionTypes.UPLOAD_FILE_FAILURE,
    },
    type: null,
});

export const messagesLlama = (requestBody: ILlamaMessage): IActionCall => ({
    callAPI: () => GptService.messagesLlama(requestBody),
    types: {
        loading: actionTypes.LLAMA_MESSAGE,
        success: actionTypes.LLAMA_MESSAGE_SUCCESS,
        failure: actionTypes.LLAMA_MESSAGE_FAILURE,
    },
    type: null,
});

export const resetUploadFile = (): IActionCall => ({type: actionTypes.UPLOAD_FILE_RESET});