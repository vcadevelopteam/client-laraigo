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
