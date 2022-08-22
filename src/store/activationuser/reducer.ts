import { createReducer, initialCommon, initialListPaginatedState } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { Dictionary, ITemplate, IListStatePaginated } from "@types";

export interface IRequest extends ITemplate {
    data: any;
}

export interface IState {
    activation: IRequest;
    saveUser: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    delUser: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
}

export const initialState: IState = {
    activation: { ...initialCommon, data: null, loading: false, error: false },
    saveUser: { success: undefined, ...initialListPaginatedState },
    delUser: { success: undefined, ...initialListPaginatedState }
};

export default createReducer<IState>(initialState, {
    [actionTypes.ACTIVATIONUSER_SEND]: caseFunctions.send,
    [actionTypes.ACTIVATIONUSER_FAILURE]: caseFunctions.failure,
    [actionTypes.ACTIVATIONUSER_SUCCESS]: caseFunctions.success,
    [actionTypes.ACTIVATIONUSER_RESET]: caseFunctions.reset,

    [actionTypes.EXECUTE_MAIN]: caseFunctions.saveUser,
    [actionTypes.EXECUTE_MAIN_SUCCESS]: caseFunctions.saveUserSuccess,
    [actionTypes.EXECUTE_MAIN_FAILURE]: caseFunctions.saveUserFailure,
    [actionTypes.EXECUTE_MAIN_RESET]: caseFunctions.saveUserReset,

    [actionTypes.DELUSER_SEND]: caseFunctions.delUser,
    [actionTypes.DELUSER_SUCCESS]: caseFunctions.delUserSuccess,
    [actionTypes.DELUSER_FAILURE]: caseFunctions.delUserFailure,
    [actionTypes.DELUSER_RESET]: caseFunctions.delUserReset,
});