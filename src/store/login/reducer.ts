import { IUser, ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";


export interface IUserTmp extends ITemplate {
    user: IUser | null;
    
}

export interface IState {
    login: IUserTmp;
    triggerChangeOrganization: ITemplate;
    validateToken: IUserTmp;
    logout: ITemplate;
    ignorePwdchangefirstloginValidation: boolean;
}

export const initialState: IState = {
    login: { ...initialCommon, user: null },
    triggerChangeOrganization: initialCommon,
    validateToken: { ...initialCommon, user: null, loading: true },
    logout: initialCommon,
    ignorePwdchangefirstloginValidation: false,
};

export default createReducer<IState>(initialState, {
    [actionTypes.LOGIN]: caseFunctions.login,
    [actionTypes.LOGIN_SUCCESS]: caseFunctions.loginSuccess,
    [actionTypes.LOGIN_FAILURE]: caseFunctions.loginFailure,
    [actionTypes.LOGIN_RESET]: caseFunctions.loginReset,

    [actionTypes.VALIDATE_TOKEN]: caseFunctions.validateToken,
    [actionTypes.VALIDATE_TOKEN_SUCCESS]: caseFunctions.validateTokenSuccess,
    [actionTypes.VALIDATE_TOKEN_FAILURE]: caseFunctions.validateTokenFailure,
    [actionTypes.VALIDATE_TOKEN_RESET]: caseFunctions.validateTokenReset,

    [actionTypes.CHANGE_ORGANIZATION]: caseFunctions.changeOrganization,
    [actionTypes.CHANGE_ORGANIZATION_SUCCESS]: caseFunctions.changeOrganizationSuccess,
    [actionTypes.CHANGE_ORGANIZATION_FAILURE]: caseFunctions.changeOrganizationFailure,
    [actionTypes.CHANGE_ORGANIZATION_RESET]: caseFunctions.changeOrganizationReset,

    [actionTypes.CHANGE_DATA_USER]: caseFunctions.updateUserInformation,
    [actionTypes.LOGOUT]: caseFunctions.logout,
    [actionTypes.LOGOUT_SUCCESS]: caseFunctions.logoutSuccess,
    [actionTypes.LOGOUT_FAILURE]: caseFunctions.logoutFailure,
    [actionTypes.LOGOUT_RESET]: caseFunctions.logoutReset,

    [actionTypes.CHANGE_PWD_FIRST_LOGIN]: caseFunctions.changePwdFirstLogin,
});
