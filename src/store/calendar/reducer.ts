import { createReducer, initialCommon } from "common/helpers";
import { ITemplate } from "@types";

import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data?: any | null;
    msg?: string | null;
}

export interface IState {
    requestGoogleLogIn: IRequest;
    requestGoogleDisconnect: IRequest;
    requestGoogleValidate: IRequest;
}

export const initialState: IState = {
    requestGoogleLogIn: { ...initialCommon, data: null, loading: false, error: false },
    requestGoogleDisconnect: { ...initialCommon, data: null, loading: false, error: false },
    requestGoogleValidate: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.CALENDAR_GOOGLE_RESET]: caseFUnctions.calendarGoogleReset,

    [actionTypes.CALENDAR_GOOGLE_LOGIN]: caseFUnctions.calendarGoogleLogIn,
    [actionTypes.CALENDAR_GOOGLE_LOGIN_FAILURE]: caseFUnctions.calendarGoogleLogInFailure,
    [actionTypes.CALENDAR_GOOGLE_LOGIN_SUCCESS]: caseFUnctions.calendarGoogleLogInSuccess,
    [actionTypes.CALENDAR_GOOGLE_LOGIN_RESET]: caseFUnctions.calendarGoogleLogInReset,

    [actionTypes.CALENDAR_GOOGLE_DISCONNECT]: caseFUnctions.calendarGoogleDisconnect,
    [actionTypes.CALENDAR_GOOGLE_DISCONNECT_FAILURE]: caseFUnctions.calendarGoogleDisconnectFailure,
    [actionTypes.CALENDAR_GOOGLE_DISCONNECT_SUCCESS]: caseFUnctions.calendarGoogleDisconnectSuccess,
    [actionTypes.CALENDAR_GOOGLE_DISCONNECT_RESET]: caseFUnctions.calendarGoogleDisconnectReset,

    [actionTypes.CALENDAR_GOOGLE_VALIDATE]: caseFUnctions.calendarGoogleValidate,
    [actionTypes.CALENDAR_GOOGLE_VALIDATE_FAILURE]: caseFUnctions.calendarGoogleValidateFailure,
    [actionTypes.CALENDAR_GOOGLE_VALIDATE_SUCCESS]: caseFUnctions.calendarGoogleValidateSuccess,
    [actionTypes.CALENDAR_GOOGLE_VALIDATE_RESET]: caseFUnctions.calendarGoogleValidateReset,
});
