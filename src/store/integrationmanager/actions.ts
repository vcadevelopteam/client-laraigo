import { IActionCall } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const request_send = (request: any): IActionCall => ({
    callAPI: () => CommonService.request_send(request),
    types: {
        loading: actionTypes.REQUEST_SEND,
        success: actionTypes.REQUEST_SUCCESS,
        failure: actionTypes.REQUEST_FAILURE,
    },
    type: null,
});

export const resetRequest = (): IActionCall => ({type: actionTypes.REQUEST_RESET});

export const processzip_send = (processzip: any): IActionCall => ({
    callAPI: () => CommonService.processzip_send(processzip),
    types: {
        loading: actionTypes.PROCESSZIP_SEND,
        success: actionTypes.PROCESSZIP_SUCCESS,
        failure: actionTypes.PROCESSZIP_FAILURE,
    },
    type: null,
});

export const resetProcesszip = (): IActionCall => ({type: actionTypes.PROCESSZIP_RESET});