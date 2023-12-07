import { ChannelsService } from "network";
import { IActionCall, IRequestBody } from "@types";

import actionTypes from "./actionTypes";

export const getChannelsListSub = (accessToken: string, appId: string): IActionCall => ({
    callAPI: () => ChannelsService.getPagelistSub(accessToken, appId),
    type: null,
    types: {
        failure: actionTypes.PAGELIST_FAILURE,
        loading: actionTypes.PAGELIST,
        success: actionTypes.PAGELIST_SUCCESS,
    },
});

export const executeSubscription = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.execSub(requestBody),
    type: null,
    types: {
        failure: actionTypes.SIGNUP_FAILURE,
        loading: actionTypes.SIGNUP,
        success: actionTypes.SIGNUP_SUCCESS,
    },
});

export const validatechannels = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.valChannels(requestBody),
    type: null,
    types: {
        failure: actionTypes.VALCHANNELS_FAILURE,
        loading: actionTypes.VALCHANNELS,
        success: actionTypes.VALCHANNELS_SUCCESS,
    },
});

export const executeCheckNewUser = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.validateNewUser(requestBody),
    type: null,
    types: {
        failure: actionTypes.ISVALID_FAILURE,
        loading: actionTypes.ISVALID,
        success: actionTypes.ISVALID_SUCCESS,
    },
});

export const verifyPlan = (accessToken: string): IActionCall => ({
    callAPI: () => ChannelsService.vrfplan(accessToken),
    type: null,
    types: {
        failure: actionTypes.VERIFYPLAN_FAILURE,
        loading: actionTypes.VERIFYPLAN,
        success: actionTypes.VERIFYPLAN_SUCCESS,
    },
});

export const resetGetChannelsListSub = (): IActionCall => ({ type: actionTypes.PAGELIST_RESET });

export const getCurrencyList = (): IActionCall => ({
    callAPI: () => ChannelsService.getCurrencyList(),
    type: null,
    types: {
        failure: actionTypes.CURRENCYLIST_FAILURE,
        loading: actionTypes.CURRENCYLIST,
        success: actionTypes.CURRENCYLIST_SUCCESS,
    },
});

export const getCountryList = (): IActionCall => ({
    callAPI: () => ChannelsService.getCountryList(),
    type: null,
    types: {
        failure: actionTypes.COUNTRYLIST_FAILURE,
        loading: actionTypes.COUNTRYLIST,
        success: actionTypes.COUNTRYLIST_SUCCESS,
    },
});