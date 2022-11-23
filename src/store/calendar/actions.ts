import { IActionCall } from "@types";
import { CalendarService } from "network";

import actionTypes from "./actionTypes";

export const resetCalendarGoogle = (): IActionCall => ({ type: actionTypes.CALENDAR_GOOGLE_RESET });

export const calendarGoogleLogIn = (request: any): IActionCall => ({
    callAPI: () => CalendarService.calendarLogIn(request),
    types: {
        loading: actionTypes.CALENDAR_GOOGLE_LOGIN,
        success: actionTypes.CALENDAR_GOOGLE_LOGIN_SUCCESS,
        failure: actionTypes.CALENDAR_GOOGLE_LOGIN_FAILURE,
    },
    type: null,
});

export const resetCalendarGoogleLogIn = (): IActionCall => ({ type: actionTypes.CALENDAR_GOOGLE_LOGIN_RESET });

export const calendarGoogleDisconnect = (request: any): IActionCall => ({
    callAPI: () => CalendarService.calendarDisconnect(request),
    types: {
        loading: actionTypes.CALENDAR_GOOGLE_DISCONNECT,
        success: actionTypes.CALENDAR_GOOGLE_DISCONNECT_SUCCESS,
        failure: actionTypes.CALENDAR_GOOGLE_DISCONNECT_FAILURE,
    },
    type: null,
});

export const resetCalendarGoogleDisconnect = (): IActionCall => ({ type: actionTypes.CALENDAR_GOOGLE_DISCONNECT_RESET });

export const calendarGoogleValidate = (request: any): IActionCall => ({
    callAPI: () => CalendarService.calendarValidate(request),
    types: {
        loading: actionTypes.CALENDAR_GOOGLE_VALIDATE,
        success: actionTypes.CALENDAR_GOOGLE_VALIDATE_SUCCESS,
        failure: actionTypes.CALENDAR_GOOGLE_VALIDATE_FAILURE,
    },
    type: null,
});

export const resetCalendarGoogleValidate = (): IActionCall => ({ type: actionTypes.CALENDAR_GOOGLE_VALIDATE_RESET });