import actionTypes from "./actionTypes";

import { IActionCall } from "@types";
import { PostHistoryService } from "network";

export const schedulePost = (request: any): IActionCall => ({
    callAPI: () => PostHistoryService.schedulePost(request),
    types: {
        loading: actionTypes.POSTHISTORY_SCHEDULE,
        success: actionTypes.POSTHISTORY_SCHEDULE_SUCCESS,
        failure: actionTypes.POSTHISTORY_SCHEDULE_FAILURE,
    },
    type: null,
});

export const resetSchedulePost = (): IActionCall => ({ type: actionTypes.POSTHISTORY_SCHEDULE_RESET });