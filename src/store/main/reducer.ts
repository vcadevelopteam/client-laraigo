import { IListStatePaginated, ITicket } from "@types";
import { IBaseState, Dictionary } from "@types";
import { createReducer, initialListPaginatedState } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface itemMulti {
    data: Dictionary[];
    success: boolean;
}

export interface IState {
    mainData: IListStatePaginated<Dictionary>,
    multiData: IListStatePaginated<itemMulti>,
    execute: IListStatePaginated<Dictionary>,
}

export const initialState: IState = { 
    mainData: initialListPaginatedState,
    multiData: initialListPaginatedState,
    execute: initialListPaginatedState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.MAIN]: caseFunctions.main,
    [actionTypes.MAIN_SUCCESS]: caseFunctions.mainSuccess,
    [actionTypes.MAIN_FAILURE]: caseFunctions.mainFailure,
    [actionTypes.MAIN_RESET]: caseFunctions.mainReset,

    [actionTypes.MULTI_MAIN]: caseFunctions.multiMain,
    [actionTypes.MULTI_MAIN_SUCCESS]: caseFunctions.multiMainSuccess,
    [actionTypes.MULTI_MAIN_FAILURE]: caseFunctions.multiMainFailure,
    [actionTypes.MULTI_MAIN_RESET]: caseFunctions.multiMainReset,

    [actionTypes.EXECUTE_MAIN]: caseFunctions.execute,
    [actionTypes.EXECUTE_MAIN_SUCCESS]: caseFunctions.executeSuccess,
    [actionTypes.EXECUTE_MAIN_FAILURE]: caseFunctions.executeFailure,
    [actionTypes.EXECUTE_MAIN_RESET]: caseFunctions.executeReset,


});
