import { IActionCall, IRequestBody } from "@types";
import { ActivationUserService } from "network";
import actionTypes from "./actionTypes";

export const getLocations = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ActivationUserService.getLocations(requestBody),
    types: {
        loading: actionTypes.GETLOCATION,
        success: actionTypes.GETLOCATION_SUCCESS,
        failure: actionTypes.GETLOCATION_FAILURE,
    },
    type: null,
});

export const resetgetLocations = (): IActionCall => ({ type: actionTypes.GETLOCATION_RESET });