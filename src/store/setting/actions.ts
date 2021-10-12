import { IActionCall, IRequestBody } from "@types";
import { CommonService,InboxService } from "network";
import actionTypes from "./actionTypes";

export const getSetting = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.GET_SETTING,
        success: actionTypes.GET_SETTING_SUCCESS,
        failure: actionTypes.GET_SETTING_FAILURE,
    },
    type: null,
});

export const resetGetSetting = (): IActionCall => ({type: actionTypes.GET_SETTING_RESET});

export const getPropertySettings = (requestBodies: IRequestBody[]): IActionCall => ({
    callAPI: () => CommonService.multiMain(requestBodies),
    types: {
        loading: actionTypes.GET_PROPERTY_SETTINGS,
        success: actionTypes.GET_PROPERTY_SETTINGS_SUCCESS,
        failure: actionTypes.GET_PROPERTY_SETTINGS_FAILURE,
    },
    type: null,
});
export const updateUserSettings = (requestBodies: any): IActionCall => ({
    callAPI: () => InboxService.updateUserSettings(requestBodies),
    types: {
        loading: actionTypes.UPDATE_USER,
        success: actionTypes.UPDATE_USER_SUCCESS,
        failure: actionTypes.UPDATE_USER_FAILURE,
    },
    type: null,
});

export const resetGetPropertySettings = (): IActionCall => ({type: actionTypes.GET_PROPERTY_SETTINGS_RESET});
