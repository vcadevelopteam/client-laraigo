import { IActionCall } from "@types";
import { CalendarService } from "network";

import actionTypes from "./actionTypes";

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