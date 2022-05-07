import { Call } from 'voximplant-websdk/Call/Call';
import { Client } from 'voximplant-websdk/Client';
import { createReducer, initialCommon } from "common/helpers";
import { ITemplate, ITicket } from "@types";

import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data?: any | null;
    msg?: string | null;
}

export interface IState {
    call: { call?: Call | null, type: string, number: string, identifier: string, data?: ITicket };
    connection: { error: boolean; message: string; loading: boolean };
    error: string;
    requestGetCategories: IRequest;
    requestGetCountryStates: IRequest;
    requestGetRegions: IRequest;
    sdk: Client | null;
    showcall: boolean;
    statusCall: string;
}

export const initialState: IState = {
    call: { call: null, type: "", number: "", identifier: "" },
    connection: { error: false, message: "", loading: false },
    error: "",
    requestGetCategories: { ...initialCommon, data: null, loading: false, error: false },
    requestGetCountryStates: { ...initialCommon, data: null, loading: false, error: false },
    requestGetRegions: { ...initialCommon, data: null, loading: false, error: false },
    sdk: null,
    showcall: false,
    statusCall: "DISCONNECTED",
};

export default createReducer<IState>(initialState, {
    [actionTypes.INIT_CALL]: caseFUnctions.initCall,
    [actionTypes.SET_MODAL_CALL]: caseFUnctions.setModalCall,
    [actionTypes.MANAGE_STATUS_CALL]: caseFUnctions.manageStatusCall,
    [actionTypes.MANAGE_CONNECTION]: caseFUnctions.manageConnection,

    [actionTypes.GET_CATEGORIES]: caseFUnctions.getCategories,
    [actionTypes.GET_CATEGORIES_FAILURE]: caseFUnctions.getCategoriesFailure,
    [actionTypes.GET_CATEGORIES_SUCCESS]: caseFUnctions.getCategoriesSuccess,
    [actionTypes.GET_CATEGORIES_RESET]: caseFUnctions.getCategoriesReset,

    [actionTypes.GET_COUNTRYSTATES]: caseFUnctions.getCountryStates,
    [actionTypes.GET_COUNTRYSTATES_FAILURE]: caseFUnctions.getCountryStatesFailure,
    [actionTypes.GET_COUNTRYSTATES_SUCCESS]: caseFUnctions.getCountryStatesSuccess,
    [actionTypes.GET_COUNTRYSTATES_RESET]: caseFUnctions.getCountryStatesReset,

    [actionTypes.GET_REGIONS]: caseFUnctions.getRegions,
    [actionTypes.GET_REGIONS_FAILURE]: caseFUnctions.getRegionsFailure,
    [actionTypes.GET_REGIONS_SUCCESS]: caseFUnctions.getRegionsSuccess,
    [actionTypes.GET_REGIONS_RESET]: caseFUnctions.getRegionsReset,
});
