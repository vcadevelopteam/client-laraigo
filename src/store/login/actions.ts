import { IActionCall } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const login = (usr: string | null, password: string | null, facebookid?: string | null, googleid?: string | null): IActionCall => ({
    callAPI: () => CommonService.login(usr || "", password || "", facebookid || "", googleid || ""),
    types: {
        loading: actionTypes.LOGIN,
        success: actionTypes.LOGIN_SUCCESS,
        failure: actionTypes.LOGIN_FAILURE,
    },
    type: null,
});

export const resetLogin = (): IActionCall => ({type: actionTypes.LOGIN_RESET});

export const validateToken = (): IActionCall => ({
    callAPI: () => CommonService.validateToken(),
    types: {
        loading: actionTypes.VALIDATE_TOKEN,
        success: actionTypes.VALIDATE_TOKEN_SUCCESS,
        failure: actionTypes.VALIDATE_TOKEN_FAILURE,
    },
    type: null,
});

export const resetValidateToken = (): IActionCall => ({type: actionTypes.VALIDATE_TOKEN_RESET});



export const logout = (): IActionCall => ({
    callAPI: () => CommonService.logout(),
    types: {
        loading: actionTypes.LOGOUT,
        success: actionTypes.LOGOUT_SUCCESS,
        failure: actionTypes.LOGOUT_FAILURE,
    },
    type: null,
});
