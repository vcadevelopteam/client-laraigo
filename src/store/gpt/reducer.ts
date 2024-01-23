import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import actionType from "./actionTypes";
import * as caseFunctions from './caseFunctions';

export interface IRequest extends ITemplate {
    data: any;
    success: boolean | undefined | null;
}

export interface IState {
    gptthreadresult: IRequest,
}

export const initialState: IState = {
    gptthreadresult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
};

export default createReducer<IState>(initialState, {
    [actionType.GPTTHREAD]: caseFunctions.gptThread,
    [actionType.THREAD_SUCCESS]: caseFunctions.gptThreadSuccess,
    [actionType.THREAD_FAILURE]: caseFunctions.gptThreadFailure,
    [actionType.THREAD_RESET]: caseFunctions.gptThreadReset,
});