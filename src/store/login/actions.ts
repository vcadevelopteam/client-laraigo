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

export const resetLogin = (): IActionCall => ({type: actionTypes.LOGIN_RESET});
