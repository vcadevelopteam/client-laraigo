import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

interface subscriptionResponse {
    code: string,
    id: string,
    msg: string,
    object: string,
}

export interface IRequest extends ITemplate {
    data: subscriptionResponse | null;
    msg?: string | null;
}

export interface IState {
    requestRecoverPassword: IRequest;
    requestChangePassword: IRequest;
    requestValidateChannels: IRequest;
}

export const initialState: IState = {
    requestRecoverPassword: { ...initialCommon, data: null, loading: false, error: false },
    requestChangePassword: { ...initialCommon, data: null, loading: false, error: false },
    requestValidateChannels: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.RECOVER_PASSWORD]: caseFUnctions.recoverPassword,
    [actionTypes.RECOVER_PASSWORD_FAILURE]: caseFUnctions.recoverPasswordFailure,
    [actionTypes.RECOVER_PASSWORD_SUCCESS]: caseFUnctions.recoverPasswordSuccess,
    [actionTypes.RECOVER_PASSWORD_RESET]: caseFUnctions.recoverPasswordReset,

    [actionTypes.CHANGE_PASSWORD]: caseFUnctions.changePassword,
    [actionTypes.CHANGE_PASSWORD_FAILURE]: caseFUnctions.changePasswordFailure,
    [actionTypes.CHANGE_PASSWORD_SUCCESS]: caseFUnctions.changePasswordSuccess,
    [actionTypes.CHANGE_PASSWORD_RESET]: caseFUnctions.changePasswordReset,

    [actionTypes.VALIDATE_CHANNELS]: caseFUnctions.validateChannels,
    [actionTypes.VALIDATE_CHANNELS_FAILURE]: caseFUnctions.validateChannelsFailure,
    [actionTypes.VALIDATE_CHANNELS_SUCCESS]: caseFUnctions.validateChannelsSuccess,
    [actionTypes.VALIDATE_CHANNELS_RESET]: caseFUnctions.validateChannelsReset,
});