import { IBaseState } from "@types";
import { createReducer, initialListPaginatedState } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface Dictionary {
    [key: string]: any
}

export interface IState extends IBaseState {
    data: Dictionary[]
}

export const initialState: IState = initialListPaginatedState;

export default createReducer<IState>(initialState, {
    [actionTypes.MAIN]: caseFunctions.main,
    [actionTypes.MAIN_SUCCESS]: caseFunctions.mainSuccess,
    [actionTypes.MAIN_FAILURE]: caseFunctions.mainFailure,
    [actionTypes.MAIN_RESET]: caseFunctions.mainReset,
});
