import { Dictionary, IListStatePaginated, IObjectState } from "@types";
import { createReducer, initialListPaginatedState, initialObjectState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    channelList: IListStatePaginated<Dictionary>;
    successinsert: Boolean;
    insertChannel: IObjectState<{ success : boolean, integrationid: string }>;
}

export const initialState: IState = {
    channelList: initialListPaginatedState,
    successinsert: false,
    insertChannel: initialObjectState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.PAGELIST]: caseFUnctions.getChannels,
    [actionTypes.PAGELIST_SUCCESS]: caseFUnctions.getChannelsSuccess,
    [actionTypes.PAGELIST_FAILURE]: caseFUnctions.getChannelsFailure,
    [actionTypes.PAGELIST_RESET]: caseFUnctions.getChannelsReset,
    [actionTypes.SIGNUP]: caseFUnctions.getChannels,
    [actionTypes.SIGNUP_SUCCESS]: caseFUnctions.getChannelsSuccess,
    [actionTypes.SIGNUP_FAILURE]: caseFUnctions.getChannelsFailure,
    [actionTypes.SIGNUP_RESET]: caseFUnctions.getChannelsReset,
});
