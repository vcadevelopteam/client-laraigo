import { createReducer, initialCommon, initialListPaginatedState } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { Dictionary, ITemplate, IListStatePaginated } from "@types";

export interface IRequest extends ITemplate {
    data: any;
}

export interface IState {
    activation: IRequest;
    getLocations: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
}

export const initialState: IState = {
    activation: { ...initialCommon, data: null, loading: false, error: false },
    getLocations: { success: undefined, ...initialListPaginatedState },
};

export default createReducer<IState>(initialState, {
    [actionTypes.GETLOCATION]: caseFunctions.getLocations,
    [actionTypes.GETLOCATION_SUCCESS]: caseFunctions.getLocationsSuccess,
    [actionTypes.GETLOCATION_FAILURE]: caseFunctions.getLocationsFailure,
    [actionTypes.GETLOCATION_RESET]: caseFunctions.getLocationsReset,
});