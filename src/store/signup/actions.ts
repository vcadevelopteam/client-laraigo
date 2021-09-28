import { IActionCall, IChatWebAdd, IRequestBody } from "@types";
import { ChannelsService, CommonService } from "network";
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
        success: actionTypes.PAGELIST_SUCCESS,
        failure: actionTypes.SIGNUP_FAILURE,
    },
    type: null,
});

export const resetGetChannelsListSub = (): IActionCall => ({type: actionTypes.PAGELIST_RESET});



