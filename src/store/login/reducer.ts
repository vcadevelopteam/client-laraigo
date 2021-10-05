import { IUser, ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";


export interface IUserTmp extends ITemplate {
    user: IUser | null;
}


export interface IState {
    login: IUserTmp;
    triggerChangeOrganization: ITemplate;
    validateToken: IUserTmp;
    logout: ITemplate;
}

export const initialState: IState = {
    login: { ...initialCommon, user: null },
    triggerChangeOrganization: initialCommon,
    validateToken: { ...initialCommon, user: null, loading: true },
    logout: initialCommon
};

export default createReducer<IState>(initialState, {
    [actionTypes.LOGIN]: caseFUnctions.login,
    [actionTypes.LOGIN_SUCCESS]: caseFUnctions.loginSuccess,
    [actionTypes.LOGIN_FAILURE]: caseFUnctions.loginFailure,
    [actionTypes.LOGIN_RESET]: caseFUnctions.loginReset,

    [actionTypes.VALIDATE_TOKEN]: caseFUnctions.validateToken,
    [actionTypes.VALIDATE_TOKEN_SUCCESS]: caseFUnctions.validateTokenSuccess,
    [actionTypes.VALIDATE_TOKEN_FAILURE]: caseFUnctions.validateTokenFailure,
    [actionTypes.VALIDATE_TOKEN_RESET]: caseFUnctions.validateTokenReset,

    [actionTypes.CHANGE_ORGANIZATION]: caseFUnctions.changeOrganization,
    [actionTypes.CHANGE_ORGANIZATION_SUCCESS]: caseFUnctions.changeOrganizationSuccess,
    [actionTypes.CHANGE_ORGANIZATION_FAILURE]: caseFUnctions.changeOrganizationFailure,
    [actionTypes.CHANGE_ORGANIZATION_RESET]: caseFUnctions.changeOrganizationReset,

    [actionTypes.LOGOUT]: caseFUnctions.logout,
    [actionTypes.LOGOUT_SUCCESS]: caseFUnctions.logoutSuccess,
    [actionTypes.LOGOUT_FAILURE]: caseFUnctions.logoutFailure,
    [actionTypes.LOGOUT_RESET]: caseFUnctions.logoutReset,
});
