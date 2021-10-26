import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data: any;
}

export interface IState {
    activation: IRequest;
}

export const initialState: IState = {
    activation: { ...initialCommon, data: null, loading: false, error: false }
};

export default createReducer<IState>(initialState, {
    [actionTypes.ACTIVATIONUSER_SEND]: caseFUnctions.send,
    [actionTypes.ACTIVATIONUSER_FAILURE]: caseFUnctions.failure,
    [actionTypes.ACTIVATIONUSER_SUCCESS]: caseFUnctions.success,
    [actionTypes.ACTIVATIONUSER_RESET]: caseFUnctions.reset
});