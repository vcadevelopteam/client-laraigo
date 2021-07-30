import { IUser, ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState extends ITemplate {
    user: IUser | null;
}

export const initialState: IState = {
    user: null,
    ...initialCommon
};

export default createReducer<IState>(initialState, {
    [actionTypes.LOGIN]: caseFUnctions.login,
    [actionTypes.LOGIN_SUCCESS]: caseFUnctions.loginSuccess,
    [actionTypes.LOGIN_FAILURE]: caseFUnctions.loginFailure,
    [actionTypes.LOGIN_RESET]: caseFUnctions.loginReset,
});
