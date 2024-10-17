import { Dictionary, IActionCall } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";
import { removeAuthorizationToken } from "common/helpers";

export const login = (usr: string | null, password: string | null, facebookid?: string | null, googleid?: string | null, token_recaptcha?: string | null, samlCode?: string | null): IActionCall => ({
    callAPI: () => CommonService.login(usr || "", password || "", facebookid || "", googleid || "", token_recaptcha || "", samlCode || ""),
    types: {
        loading: actionTypes.LOGIN,
        success: actionTypes.LOGIN_SUCCESS,
        failure: actionTypes.LOGIN_FAILURE,
    },
    type: null,
});

export const resetLogin = (): IActionCall => ({ type: actionTypes.LOGIN_RESET });


export const invokeIncremental = (): IActionCall => ({
    callAPI: () => CommonService.incrementalInvokeToken(),
    types: {
        loading: actionTypes.INVOKE_INCREMENTAL,
        success: actionTypes.INVOKE_INCREMENTAL_SUCCESS,
        failure: actionTypes.INVOKE_INCREMENTAL_FAILURE,
    },
    type: null,
});

export const resetInvokeIncremental = (): IActionCall => ({ type: actionTypes.INVOKE_INCREMENTAL });

export const validateToken = (firstLoad: string): IActionCall => ({
    callAPI: () => CommonService.validateToken(firstLoad),
    types: {
        loading: actionTypes.VALIDATE_TOKEN,
        success: actionTypes.VALIDATE_TOKEN_SUCCESS,
        failure: actionTypes.VALIDATE_TOKEN_FAILURE,
    },
    type: null,
});

export const resetValidateToken = (): IActionCall => ({ type: actionTypes.VALIDATE_TOKEN_RESET });


export const changeOrganization = (newcorpid: number, neworgid: number, corpdesc: string, orgdesc: string): IActionCall => ({
    callAPI: () => CommonService.changeOrganization(newcorpid, neworgid, corpdesc, orgdesc),
    types: {
        loading: actionTypes.CHANGE_ORGANIZATION,
        success: actionTypes.CHANGE_ORGANIZATION_SUCCESS,
        failure: actionTypes.CHANGE_ORGANIZATION_FAILURE,
    },
    type: null,
});

export const updateUserInformation = (firstname: string, lastname: string, image: string): IActionCall => ({ type: actionTypes.CHANGE_DATA_USER, payload: { firstname, lastname, image } });

export const resetChangeOrganization = (): IActionCall => ({ type: actionTypes.CHANGE_ORGANIZATION_RESET });



export const logout = (): IActionCall => ({
    callAPI: () => CommonService.logout(),
    types: {
        loading: actionTypes.LOGOUT,
        success: actionTypes.LOGOUT_SUCCESS,
        failure: actionTypes.LOGOUT_FAILURE,
    },
    type: null,
});

export const setPwdFirsLogin = (value: boolean, ignorePwdchangefirstloginValidation: boolean): IActionCall => ({
    type: actionTypes.CHANGE_PWD_FIRST_LOGIN,
    payload: { value, ignorePwdchangefirstloginValidation },
});

export const updateListOrgs = (org: Dictionary): IActionCall => ({
    type: actionTypes.NEW_UPDATE_ORG,
    payload: { org },
});

export const cleanValidateToken = (): IActionCall => {
    removeAuthorizationToken()
    return { type: actionTypes.CLEAN_VALIDATETOKEN };
};

export const updateLocalLanguage = (value: String): IActionCall => {
    return { type: actionTypes.UPDATE_LANGUAGE, payload: { value } };
};