import { IActionCall } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const login = (usr: string, password: string): IActionCall => ({
    callAPI: () => CommonService.login(usr, password),
    types: {
        loading: actionTypes.LOGIN,
        success: actionTypes.LOGIN_SUCCESS,
        failure: actionTypes.LOGIN_FAILURE,
    },
    type: null,
});

export const resetLogin = (): IActionCall => ({type: actionTypes.VALIDATE_TOKEN_RESET});

export const validateToken = (): IActionCall => ({
    callAPI: () => CommonService.validateToken(),
    types: {
        loading: actionTypes.VALIDATE_TOKEN,
        success: actionTypes.VALIDATE_TOKEN_SUCCESS,
        failure: actionTypes.VALIDATE_TOKEN_FAILURE,
    },
    type: null,
});

export const logout = (): IActionCall => ({
    callAPI: () => CommonService.logout(),
    types: {
        loading: actionTypes.LOGOUT,
        success: actionTypes.LOGOUT_SUCCESS,
        failure: actionTypes.LOGOUT_FAILURE,
    },
    type: null,
});
