import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import actionType from "./actionTypes";
import * as caseFunctions from './caseFunctions';

export interface IRequest extends ITemplate {
    data: any;
    success: boolean | undefined | null;
}

export interface IState {
    gptResult: IRequest,
}

export const initialState: IState = {
    gptResult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
};

export default createReducer<IState>(initialState, {

    [actionType.GPTTHREAD]: caseFunctions.gptLoading,
    [actionType.THREAD_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.THREAD_FAILURE]: caseFunctions.gptFailure,
    [actionType.THREAD_RESET]: caseFunctions.gptReset,

    [actionType.DELETE_THREAD]: caseFunctions.gptLoading,
    [actionType.DELETE_THREAD_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.DELETE_THREAD_FAILURE]: caseFunctions.gptFailure,
    [actionType.DELETE_THREAD_RESET]: caseFunctions.gptReset,

    [actionType.CREATE_ASSISTANT]: caseFunctions.gptLoading,
    [actionType.CREATE_ASSISTANT_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.CREATE_ASSISTANT_FAILURE]: caseFunctions.gptFailure,
    [actionType.CREATE_ASSISTANT_RESET]: caseFunctions.gptReset,

    [actionType.MESSAGES]: caseFunctions.gptLoading,
    [actionType.MESSAGES_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.MESSAGES_FAILURE]: caseFunctions.gptFailure,
    [actionType.MESSAGES_RESET]: caseFunctions.gptReset,

    [actionType.DELETE_FILE]: caseFunctions.gptLoading,
    [actionType.DELETE_FILE_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.DELETE_FILE_FAILURE]: caseFunctions.gptFailure,
    [actionType.DELETE_FILE_RESET]: caseFunctions.gptReset,

    [actionType.ADD_FILE]: caseFunctions.gptLoading,
    [actionType.ADD_FILE_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.ADD_FILE_FAILURE]: caseFunctions.gptFailure,
    [actionType.ADD_FILE_RESET]: caseFunctions.gptReset,

    [actionType.ASSIGN_FILE]: caseFunctions.gptLoading,
    [actionType.ASSIGN_FILE_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.ASSIGN_FILE_FAILURE]: caseFunctions.gptFailure,
    [actionType.ASSIGN_FILE_RESET]: caseFunctions.gptReset,

    [actionType.VERIFY_FILE]: caseFunctions.gptLoading,
    [actionType.VERIFY_FILE_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.VERIFY_FILE_FAILURE]: caseFunctions.gptFailure,
    [actionType.VERIFY_FILE_RESET]: caseFunctions.gptReset,

    [actionType.UPDATE_ASSISTANT]: caseFunctions.gptLoading,
    [actionType.UPDATE_ASSISTANT_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.UPDATE_ASSISTANT_FAILURE]: caseFunctions.gptFailure,
    [actionType.UPDATE_ASSISTANT_RESET]: caseFunctions.gptReset,

    [actionType.DELETE_ASSISTANT]: caseFunctions.gptLoading,
    [actionType.DELETE_ASSISTANT_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.DELETE_ASSISTANT_FAILURE]: caseFunctions.gptFailure,
    [actionType.DELETE_ASSISTANT_RESET]: caseFunctions.gptReset,

    [actionType.DELETE_MASSIVE_ASSISTANT]: caseFunctions.gptLoading,
    [actionType.DELETE_MASSIVE_ASSISTANT_SUCCESS]: caseFunctions.gptSuccess,
    [actionType.DELETE_MASSIVE_ASSISTANT_FAILURE]: caseFunctions.gptFailure,
    [actionType.DELETE_MASSIVE_ASSISTANT_RESET]: caseFunctions.gptReset,

});