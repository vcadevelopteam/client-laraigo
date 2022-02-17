import { IActionCall, ITransaction } from "@types";
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


/**Action type = EXECUTE_MAIN */
export const saveUser = (requestBody: ITransaction, transaction: boolean = false): IActionCall => ({
    callAPI: () => ActivationUserService.postSaveUser(requestBody),
    types: {
        loading: actionTypes.EXECUTE_MAIN,
        success: actionTypes.EXECUTE_MAIN_SUCCESS,
        failure: actionTypes.EXECUTE_MAIN_FAILURE,
    },
    type: null,
});

export const resetSaveUser = (): IActionCall => ({ type: actionTypes.EXECUTE_MAIN_RESET });