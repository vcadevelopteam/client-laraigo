import { IActionCall } from "@types";
import { ActivationUserService } from "network";
import actionTypes from "./actionTypes";

export const getVersion = (): IActionCall => ({
    callAPI: () => ActivationUserService.getVersion(),
    types: {
        loading: actionTypes.GETVERSION,
        success: actionTypes.GETVERSION_SUCCESS,
        failure: actionTypes.GETVERSION_FAILURE,
    },
    type: null,
});

export const resetgetVersion = (): IActionCall => ({ type: actionTypes.GETVERSION_RESET });