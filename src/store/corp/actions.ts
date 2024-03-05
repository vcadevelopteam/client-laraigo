import { IActionCall, IRequestBody, ITransaction } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const executeCorp = (requestBody: IRequestBody | ITransaction): IActionCall => ({
    callAPI: () => CommonService.corporation(requestBody),
    types: {
        loading: actionTypes.EXECUTECORP_MAIN,
        success: actionTypes.EXECUTECORP_MAIN_SUCCESS,
        failure: actionTypes.EXECUTECORP_MAIN_FAILURE,
    },
    type: null,
});

export const resetExecuteCorp = (): IActionCall => ({ type: actionTypes.EXECUTECORP_MAIN_RESET });

export const getCorpDetails = (domain: string): IActionCall => ({
    callAPI: () => CommonService.corporationGet(domain),
    types: {
        loading: actionTypes.CORP_MAIN,
        success: actionTypes.CORP_MAIN_SUCCESS,
        failure: actionTypes.CORP_MAIN_FAILURE,
    },
    type: null,
});

export const resetCorpDetail = (): IActionCall => ({ type: actionTypes.CORP_MAIN_RESET });
