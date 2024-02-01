import { IActionCall } from "@types";
import { GptService } from "network";
import actionTypes from "./actionTypes";

interface ILlamaFileUpload {
    file_url: string;
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

export const resetUploadFile = (): IActionCall => ({type: actionTypes.UPLOAD_FILE_RESET});