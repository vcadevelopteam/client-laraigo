import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data: any;
}

export interface IState {
    request: IRequest;
    processzip: IRequest;
}

export const initialState: IState = {
    request: { ...initialCommon, data: null, loading: false, error: false },
    processzip: { ...initialCommon, data: null, loading: false, error: false }
};

export default createReducer<IState>(initialState, {
    [actionTypes.REQUEST_SEND]: caseFUnctions.request_send,
    [actionTypes.REQUEST_FAILURE]: caseFUnctions.requestFailure,
    [actionTypes.REQUEST_SUCCESS]: caseFUnctions.requestSuccess,
    [actionTypes.REQUEST_RESET]: caseFUnctions.requestReset,

    [actionTypes.PROCESSZIP_SEND]: caseFUnctions.processzip_send,
    [actionTypes.PROCESSZIP_FAILURE]: caseFUnctions.processzipFailure,
    [actionTypes.PROCESSZIP_SUCCESS]: caseFUnctions.processzipSuccess,
    [actionTypes.PROCESSZIP_RESET]: caseFUnctions.processzipReset
});