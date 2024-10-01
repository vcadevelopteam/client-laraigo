import { IUser, ITemplate, NotificationZyx, Dictionary } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";


export interface IUserTmp extends ITemplate {
    user: IUser | null;
    notifications?: NotificationZyx[];
    lastConnection?: string;
}

export interface IState {
    login: IUserTmp;
    triggerChangeOrganization: ITemplate & { automaticConnection?: boolean };
    validateToken: IUserTmp;
    logout: ITemplate & { data?: Dictionary };
    invokeIncremental: ITemplate;
    ignorePwdchangefirstloginValidation: boolean;
}

export const initialState: IState = {
    login: { ...initialCommon, user: null },
    triggerChangeOrganization: initialCommon,
    validateToken: { ...initialCommon, user: null, loading: true, notifications: [] },
    logout: initialCommon,
    invokeIncremental: initialCommon,
    ignorePwdchangefirstloginValidation: false,
};

export default createReducer<IState>(initialState, {
    [actionTypes.LOGIN]: caseFunctions.login,
    [actionTypes.LOGIN_SUCCESS]: caseFunctions.loginSuccess,
    [actionTypes.LOGIN_FAILURE]: caseFunctions.loginFailure,
    [actionTypes.LOGIN_RESET]: caseFunctions.loginReset,
    
    [actionTypes.INVOKE_INCREMENTAL]: caseFunctions.invokeIncremental,
    [actionTypes.INVOKE_INCREMENTAL_SUCCESS]: caseFunctions.invokeIncrementalSuccess,
    [actionTypes.INVOKE_INCREMENTAL_FAILURE]: caseFunctions.invokeIncrementalFailure,
    [actionTypes.INVOKE_INCREMENTAL_RESET]: caseFunctions.invokeIncrementalReset,

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
    [actionTypes.NEW_NOTIFICATION]: caseFunctions.newNotification,
    [actionTypes.UPDATE_CONNECTION]: caseFunctions.updateConnection,
    [actionTypes.CLEAN_VALIDATETOKEN]: caseFunctions.cleanValidateToken,

    [actionTypes.UPDATE_LANGUAGE]: caseFunctions.updateLanguage,
    [actionTypes.NEW_UPDATE_ORG]: caseFunctions.updateListOrgs,
});
