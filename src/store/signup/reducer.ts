import { createReducer, initialListPaginatedState, initialObjectState } from "common/helpers";
import { Dictionary, IListStatePaginated, IObjectState } from "@types";

import * as caseFunctions from "./caseFunctions";
import actionTypes from "./actionTypes";

export interface IState {
    channelList: IListStatePaginated<Dictionary>;
    countryList: IListStatePaginated<Dictionary>;
    currencyList: IListStatePaginated<Dictionary>;
    error: boolean;
    insertChannel: IObjectState<{ success: boolean; code: string; message: string }>;
    isvalid: boolean;
    loading: boolean;
    message: string;
    successinsert: boolean;
    valChannelsChannel: IObjectState<{ success: boolean; code: string; message: string }>;
    verifyPlan: IListStatePaginated<Dictionary>;
}

export const initialState: IState = {
    channelList: initialListPaginatedState,
    countryList: initialListPaginatedState,
    currencyList: initialListPaginatedState,
    error: false,
    insertChannel: initialObjectState,
    isvalid: false,
    loading: false,
    message: "",
    successinsert: false,
    valChannelsChannel: initialObjectState,
    verifyPlan: initialListPaginatedState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.COUNTRYLIST]: caseFunctions.getCountry,
    [actionTypes.COUNTRYLIST_FAILURE]: caseFunctions.getCountryFailure,
    [actionTypes.COUNTRYLIST_SUCCESS]: caseFunctions.getCountrySuccess,
    [actionTypes.CURRENCYLIST]: caseFunctions.getCurrency,
    [actionTypes.CURRENCYLIST_FAILURE]: caseFunctions.getCurrencyFailure,
    [actionTypes.CURRENCYLIST_SUCCESS]: caseFunctions.getCurrencySuccess,
    [actionTypes.ISVALID]: caseFunctions.checkvalidity,
    [actionTypes.ISVALID_FAILURE]: caseFunctions.checkvalidityFailure,
    [actionTypes.ISVALID_RESET]: caseFunctions.checkvalidityReset,
    [actionTypes.ISVALID_RESET]: caseFunctions.checkvalidityReset,
    [actionTypes.ISVALID_SUCCESS]: caseFunctions.checkvaliditySuccess,
    [actionTypes.PAGELIST]: caseFunctions.getChannels,
    [actionTypes.PAGELIST_FAILURE]: caseFunctions.getChannelsFailure,
    [actionTypes.PAGELIST_RESET]: caseFunctions.getChannelsReset,
    [actionTypes.PAGELIST_SUCCESS]: caseFunctions.getChannelsSuccess,
    [actionTypes.SIGNUP]: caseFunctions.insertChannel,
    [actionTypes.SIGNUP_FAILURE]: caseFunctions.insertChannelFailure,
    [actionTypes.SIGNUP_RESET]: caseFunctions.insertChannelReset,
    [actionTypes.SIGNUP_SUCCESS]: caseFunctions.insertChannelSuccess,
    [actionTypes.VALCHANNELS]: caseFunctions.valChannelsChannel,
    [actionTypes.VALCHANNELS_FAILURE]: caseFunctions.valChannelsChannelSuccess,
    [actionTypes.VALCHANNELS_RESET]: caseFunctions.valChannelsChannelReset,
    [actionTypes.VALCHANNELS_SUCCESS]: caseFunctions.valChannelsChannelFailure,
    [actionTypes.VERIFYPLAN]: caseFunctions.verifyPlanFunc,
    [actionTypes.VERIFYPLAN_FAILURE]: caseFunctions.verifyPlanFailure,
    [actionTypes.VERIFYPLAN_SUCCESS]: caseFunctions.verifyPlanSuccess,
});