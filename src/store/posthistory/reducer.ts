import { createReducer, initialCommon } from "common/helpers";
import { ITemplate } from "@types";

import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data?: any | null;
    msg?: string | null;
}

export interface IState {
    requestSchedulePost: IRequest;
}

export const initialState: IState = {
    requestSchedulePost: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.POSTHISTORY_SCHEDULE]: caseFunctions.schedulePost,
    [actionTypes.POSTHISTORY_SCHEDULE_FAILURE]: caseFunctions.schedulePostFailure,
    [actionTypes.POSTHISTORY_SCHEDULE_SUCCESS]: caseFunctions.schedulePostSuccess,
    [actionTypes.POSTHISTORY_SCHEDULE_RESET]: caseFunctions.schedulePostReset,
});