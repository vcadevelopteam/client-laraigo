import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import actionTypes from "./actionTypes";
import * as caseFunctions from './caseFunctions';
export interface IRequest extends ITemplate {
    node_id: string|null;
    text: string|null;
    data: any;
    success: boolean | undefined | null;
}

export interface IState {
    llamaResult: IRequest,
}

export const initialState: IState = {
    llamaResult: { ...initialCommon, node_id: null, text: null, data: null, loading: false, error: false, success: undefined },
}

export default createReducer<IState>(initialState, {
    [actionTypes.UPLOAD_FILE]: caseFunctions.llamaLoading,
    [actionTypes.UPLOAD_FILE_SUCCESS]: caseFunctions.llamaSuccess,
    [actionTypes.UPLOAD_FILE_FAILURE]: caseFunctions.llamaFailure,
    [actionTypes.UPLOAD_FILE_RESET]: caseFunctions.llamaReset,

    [actionTypes.LLAMA_MESSAGE]: caseFunctions.llamaLoading,
    [actionTypes.LLAMA_MESSAGE_SUCCESS]: caseFunctions.llamaSuccess,
    [actionTypes.LLAMA_MESSAGE_FAILURE]: caseFunctions.llamaFailure,
    [actionTypes.LLAMA_MESSAGE_RESET]: caseFunctions.llamaReset,
})