import { createReducer } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { ITemplate } from "@types";

export interface IRequest extends ITemplate {
    data: any;
}

export interface IState {
    getVersion: any;
}

export const initialState: IState = {
    getVersion: { success: undefined },
};

export default createReducer<IState>(initialState, {
    [actionTypes.GETVERSION]: caseFunctions.getVersion,
    [actionTypes.GETVERSION_SUCCESS]: caseFunctions.getVersionSuccess,
    [actionTypes.GETVERSION_FAILURE]: caseFunctions.getVersionFailure,
    [actionTypes.GETVERSION_RESET]: caseFunctions.getVersionReset,
});