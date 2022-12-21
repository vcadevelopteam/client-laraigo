import { createReducer, initialCommon } from "common/helpers";
import { ICallGo, ITemplate } from "@types";

import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data?: any | null;
    msg?: string | null;
}

export interface IState {
    calls: ICallGo[];
    connection: { error: boolean; message: string; loading: boolean };
    error: string;
    phoneNumber: string; //phone to call on dial
    showcall: boolean; //show dial to call
    callOnLine: boolean;
    requestGetCategories: IRequest;
    requestGetCountryStates: IRequest;
    requestGetRegions: IRequest;
    requestGetHistory: IRequest;
    requestGetAdvisors: IRequest;
    transferAction: boolean,
    requestGetMaximumConsumption: IRequest;
    requestTransferAccountBalance: IRequest;
    requestGetAccountBalance: IRequest;
    requestGetCallRecord: IRequest;
    requestUpdateScenario: IRequest;
}

export const initialState: IState = {
    calls: [],
    connection: { error: true, message: "", loading: false },
    error: "",
    callOnLine: false,
    requestGetCategories: { ...initialCommon, data: null, loading: false, error: false },
    requestGetCountryStates: { ...initialCommon, data: null, loading: false, error: false },
    requestGetRegions: { ...initialCommon, data: null, loading: false, error: false },
    requestGetHistory: { ...initialCommon, data: null, loading: false, error: false },
    requestGetAdvisors: { ...initialCommon, data: null, loading: false, error: false },
    showcall: false,
    transferAction: false,
    phoneNumber: "",
    requestGetMaximumConsumption: { ...initialCommon, data: null, loading: false, error: false },
    requestTransferAccountBalance: { ...initialCommon, data: null, loading: false, error: false },
    requestGetAccountBalance: { ...initialCommon, data: null, loading: false, error: false },
    requestGetCallRecord: { ...initialCommon, data: null, loading: false, error: false },
    requestUpdateScenario: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.INIT_CALL]: caseFUnctions.initCall,
    // [actionTypes.MODIFY_CALL]: caseFUnctions.modifyCall,
    [actionTypes.SET_MODAL_CALL]: caseFUnctions.setModalCall,
    [actionTypes.SET_PHONE_NUMBER]: caseFUnctions.setPhoneNumber,
    [actionTypes.SET_HOLD]: caseFUnctions.setHold,
    [actionTypes.MANAGE_STATUS_CALL]: caseFUnctions.manageStatusCall,
    [actionTypes.MANAGE_CONNECTION]: caseFUnctions.manageConnection,
    [actionTypes.RESET_CALL]: caseFUnctions.resetCall,

    [actionTypes.SET_TRANSFER_ACTION]: caseFUnctions.setTransferAction,
    [actionTypes.INIT_TRANSFER_CALL]: caseFUnctions.initTransferCall,
    [actionTypes.CONNECTED_TRANSFER_CALL]: caseFUnctions.connectedTransferCall,
    [actionTypes.SET_TRANSFER_CALL]: caseFUnctions.setTransferCall,
    [actionTypes.RESET_TRANSFER_CALL]: caseFUnctions.resetTransferCall,

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

    [actionTypes.GET_HISTORY]: caseFUnctions.getHistory,
    [actionTypes.GET_HISTORY_FAILURE]: caseFUnctions.getHistoryFailure,
    [actionTypes.GET_HISTORY_SUCCESS]: caseFUnctions.getHistorySuccess,
    [actionTypes.GET_HISTORY_RESET]: caseFUnctions.getHistoryReset,

    [actionTypes.GET_ADVISORS]: caseFUnctions.getAdvisors,
    [actionTypes.GET_ADVISORS_FAILURE]: caseFUnctions.getAdvisorsFailure,
    [actionTypes.GET_ADVISORS_SUCCESS]: caseFUnctions.getAdvisorsSuccess,
    [actionTypes.GET_ADVISORS_RESET]: caseFUnctions.getAdvisorsReset,

    [actionTypes.GET_MAXIMUMCONSUMPTION]: caseFUnctions.getMaximumConsumption,
    [actionTypes.GET_MAXIMUMCONSUMPTION_FAILURE]: caseFUnctions.getMaximumConsumptionFailure,
    [actionTypes.GET_MAXIMUMCONSUMPTION_SUCCESS]: caseFUnctions.getMaximumConsumptionSuccess,
    [actionTypes.GET_MAXIMUMCONSUMPTION_RESET]: caseFUnctions.getMaximumConsumptionReset,

    [actionTypes.TRANSFER_ACCOUNTBALANCE]: caseFUnctions.transferAccountBalance,
    [actionTypes.TRANSFER_ACCOUNTBALANCE_FAILURE]: caseFUnctions.transferAccountBalanceFailure,
    [actionTypes.TRANSFER_ACCOUNTBALANCE_SUCCESS]: caseFUnctions.transferAccountBalanceSuccess,
    [actionTypes.TRANSFER_ACCOUNTBALANCE_RESET]: caseFUnctions.transferAccountBalanceReset,

    [actionTypes.GET_ACCOUNTBALANCE]: caseFUnctions.getAccountBalance,
    [actionTypes.GET_ACCOUNTBALANCE_FAILURE]: caseFUnctions.getAccountBalanceFailure,
    [actionTypes.GET_ACCOUNTBALANCE_SUCCESS]: caseFUnctions.getAccountBalanceSuccess,
    [actionTypes.GET_ACCOUNTBALANCE_RESET]: caseFUnctions.getAccountBalanceReset,

    [actionTypes.GET_CALLRECORD]: caseFUnctions.getCallRecord,
    [actionTypes.GET_CALLRECORD_FAILURE]: caseFUnctions.getCallRecordFailure,
    [actionTypes.GET_CALLRECORD_SUCCESS]: caseFUnctions.getCallRecordSuccess,
    [actionTypes.GET_CALLRECORD_RESET]: caseFUnctions.getCallRecordReset,

    [actionTypes.UPDATE_SCENARIO]: caseFUnctions.updateScenario,
    [actionTypes.UPDATE_SCENARIO_FAILURE]: caseFUnctions.updateScenarioFailure,
    [actionTypes.UPDATE_SCENARIO_SUCCESS]: caseFUnctions.updateScenarioSuccess,
    [actionTypes.UPDATE_SCENARIO_RESET]: caseFUnctions.updateScenarioReset,
    [actionTypes.SET_MUTE]: caseFUnctions.setMute,
});
