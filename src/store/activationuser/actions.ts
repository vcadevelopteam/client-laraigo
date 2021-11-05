import { IActionCall } from "@types";
import { ActivationUserService } from "network";
import actionTypes from "./actionTypes";

export const sendActivation = (token: string): IActionCall => ({
    callAPI: () => ActivationUserService.postActivationUser(token),
    types: {
        loading: actionTypes.ACTIVATIONUSER_SEND,
        success: actionTypes.ACTIVATIONUSER_SUCCESS,
        failure: actionTypes.ACTIVATIONUSER_FAILURE,
    },
    type: null,
});

export const resetActivation = (): IActionCall => ({type: actionTypes.ACTIVATIONUSER_RESET});