import { IActionCall } from "@types";
import { SubscriptionService } from "network";
import actionTypes from "./actionTypes";

export const recoverPassword = (request: any): IActionCall => ({
    callAPI: () => SubscriptionService.recoverPassword(request),
    types: {
        failure: actionTypes.RECOVER_PASSWORD_FAILURE,
        loading: actionTypes.RECOVER_PASSWORD,
        success: actionTypes.RECOVER_PASSWORD_SUCCESS,
    },
    type: null,
});

export const resetRecoverPassword = (): IActionCall => ({ type: actionTypes.RECOVER_PASSWORD_RESET });

export const changePassword = (request: any): IActionCall => ({
    callAPI: () => SubscriptionService.changePassword(request),
    types: {
        failure: actionTypes.CHANGE_PASSWORD_FAILURE,
        loading: actionTypes.CHANGE_PASSWORD,
        success: actionTypes.CHANGE_PASSWORD_SUCCESS,
    },
    type: null,
});

export const resetChangePassword = (): IActionCall => ({ type: actionTypes.CHANGE_PASSWORD_RESET });

export const validateChannels = (request: any): IActionCall => ({
    callAPI: () => SubscriptionService.validateChannels(request),
    types: {
        failure: actionTypes.VALIDATE_CHANNELS_FAILURE,
        loading: actionTypes.VALIDATE_CHANNELS,
        success: actionTypes.VALIDATE_CHANNELS_SUCCESS,
    },
    type: null,
});

export const resetValidateChannels = (): IActionCall => ({ type: actionTypes.VALIDATE_CHANNELS_RESET });