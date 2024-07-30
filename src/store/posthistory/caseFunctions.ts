import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const schedulePost = (state: IState): IState => ({
    ...state,
    requestSchedulePost: {
        ...state.requestSchedulePost,
        error: false,
        loading: true,
    }
})

export const schedulePostFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestSchedulePost: {
        ...state.requestSchedulePost,
        code: action?.payload?.code,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message || 'error_unexpected_error',
    }
})

export const schedulePostSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestSchedulePost: {
        ...state.requestSchedulePost,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: action?.payload?.success ? false : true,
        loading: false,
        msg: action?.payload?.message,
    }
})

export const schedulePostReset = (state: IState): IState => ({
    ...state,
    requestSchedulePost: initialState.requestSchedulePost,
})