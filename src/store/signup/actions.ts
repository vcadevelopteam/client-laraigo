import { IActionCall, IRequestBody } from "@types";
import { ChannelsService } from "network";
import actionTypes from "./actionTypes";

export const getChannelsListSub = (accessToken: String): IActionCall => ({
    callAPI: () => ChannelsService.getPagelistSub(accessToken),
    types: {
        loading: actionTypes.PAGELIST,
        success: actionTypes.PAGELIST_SUCCESS,
        failure: actionTypes.PAGELIST_FAILURE,
    },
    type: null,
});
export const executeSubscription = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.execSub(requestBody),
    types: {
        loading: actionTypes.SIGNUP,
        success: actionTypes.SIGNUP_SUCCESS,
        failure: actionTypes.SIGNUP_FAILURE,
    },
    type: null,
});
export const executeCheckNewUser = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.validateNewUser(requestBody),
    types: {
        loading: actionTypes.ISVALID,
        success: actionTypes.ISVALID_SUCCESS,
        failure: actionTypes.ISVALID_FAILURE,
    },
    type: null,
});
export const verifyPlan = (accessToken: String): IActionCall => ({
    callAPI: () => ChannelsService.vrfplan(accessToken),
    types: {
        loading: actionTypes.VERIFYPLAN,
        success: actionTypes.VERIFYPLAN_SUCCESS,
        failure: actionTypes.VERIFYPLAN_FAILURE,
    },
    type: null,
});
export const resetGetChannelsListSub = (): IActionCall => ({type: actionTypes.PAGELIST_RESET});



