import { Dictionary, IListStatePaginated, IObjectState } from "@types";
import { createReducer, initialListPaginatedState, initialObjectState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    channelList: IListStatePaginated<Dictionary>;
    currencyList: IListStatePaginated<Dictionary>;
    countryList: IListStatePaginated<Dictionary>;
    successinsert: Boolean;
    insertChannel: IObjectState<{ success : boolean, integrationid: string }>;
    verifyPlan: IListStatePaginated<Dictionary>;
    isvalid: Boolean;
    loading: Boolean;
    error: Boolean;
    message: String;
}

export const initialState: IState = {
    channelList: initialListPaginatedState,
    currencyList: initialListPaginatedState,
    countryList: initialListPaginatedState,
    successinsert: false,
    insertChannel: initialObjectState,
    verifyPlan: initialListPaginatedState,
    isvalid: false,
    loading: false,
    error: false,
    message: ""
};

export default createReducer<IState>(initialState, {
    [actionTypes.PAGELIST]: caseFUnctions.getChannels,
    [actionTypes.PAGELIST_SUCCESS]: caseFUnctions.getChannelsSuccess,
    [actionTypes.PAGELIST_FAILURE]: caseFUnctions.getChannelsFailure,
    [actionTypes.PAGELIST_RESET]: caseFUnctions.getChannelsReset,
    [actionTypes.SIGNUP]: caseFUnctions.insertChannel,
    [actionTypes.SIGNUP_SUCCESS]: caseFUnctions.insertChannelSuccess,
    [actionTypes.SIGNUP_FAILURE]: caseFUnctions.insertChannelFailure,
    [actionTypes.SIGNUP_RESET]: caseFUnctions.insertChannelReset,
    [actionTypes.ISVALID]: caseFUnctions.checkvalidity,
    [actionTypes.ISVALID_SUCCESS]: caseFUnctions.checkvaliditySuccess,
    [actionTypes.ISVALID_FAILURE]: caseFUnctions.checkvalidityFailure,
    [actionTypes.ISVALID_RESET]: caseFUnctions.checkvalidityReset,
    [actionTypes.ISVALID_RESET]: caseFUnctions.checkvalidityReset,
    [actionTypes.VERIFYPLAN]: caseFUnctions.verifyPlanFunc,
    [actionTypes.VERIFYPLAN_SUCCESS]: caseFUnctions.verifyPlanSuccess,
    [actionTypes.VERIFYPLAN_FAILURE]: caseFUnctions.verifyPlanFailure,
    [actionTypes.CURRENCYLIST]: caseFUnctions.getCurrency,
    [actionTypes.CURRENCYLIST_SUCCESS]: caseFUnctions.getCurrencySuccess,
    [actionTypes.CURRENCYLIST_FAILURE]: caseFUnctions.getCurrencyFailure,
    [actionTypes.COUNTRYLIST]: caseFUnctions.getCountry,
    [actionTypes.COUNTRYLIST_SUCCESS]: caseFUnctions.getCountrySuccess,
    [actionTypes.COUNTRYLIST_FAILURE]: caseFUnctions.getCountryFailure,
});
