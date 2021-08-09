import { IActionCall, IRequestBody } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const getCollection = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(requestBody),
    types: {
        loading: actionTypes.MAIN,
        success: actionTypes.MAIN_SUCCESS,
        failure: actionTypes.MAIN_FAILURE,
    },
    type: null,
});

export const resetMain = (): IActionCall => ({type: actionTypes.MAIN_RESET});

export const execute = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(requestBody),
    types: {
        loading: actionTypes.EXECUTE_MAIN,
        success: actionTypes.EXECUTE_MAIN_SUCCESS,
        failure: actionTypes.EXECUTE_MAIN_FAILURE,
    },
    type: null,
});

export const resetExecute = (): IActionCall => ({type: actionTypes.EXECUTE_MAIN_RESET});

export const getMultiCollection = (requestBodies: IRequestBody[]): IActionCall => ({
    callAPI: () => CommonService.multiMain(requestBodies),
    types: {
        loading: actionTypes.MULTI_MAIN,
        success: actionTypes.MULTI_MAIN_SUCCESS,
        failure: actionTypes.MULTI_MAIN_FAILURE,
    },
    type: null,
});

export const resetMultiMain = (): IActionCall => ({type: actionTypes.MULTI_MAIN_RESET});