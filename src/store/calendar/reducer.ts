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
}

export const initialState: IState = {
    requestGoogleLogIn: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.CALENDAR_GOOGLE_LOGIN]: caseFUnctions.calendarGoogleLogIn,
    [actionTypes.CALENDAR_GOOGLE_LOGIN_FAILURE]: caseFUnctions.calendarGoogleLogInFailure,
    [actionTypes.CALENDAR_GOOGLE_LOGIN_SUCCESS]: caseFUnctions.calendarGoogleLogInSuccess,
    [actionTypes.CALENDAR_GOOGLE_LOGIN_RESET]: caseFUnctions.calendarGoogleLogInReset,
});
