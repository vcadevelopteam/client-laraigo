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
    [actionTypes.CHANNELS]: caseFUnctions.getChannels,
    [actionTypes.CHANNELS_SUCCESS]: caseFUnctions.getChannelsSuccess,
    [actionTypes.CHANNELS_FAILURE]: caseFUnctions.getChannelsFailure,
    [actionTypes.CHANNELS_RESET]: caseFUnctions.getChannelsReset,
    [actionTypes.CHANNELS_INSERTSUCCESS]: caseFUnctions.getChannelsSuccessInsert,
    [actionTypes.CHANNELS_INSERTSUCCESS_RESET]: caseFUnctions.resetChannelInsert,

    [actionTypes.INSERT_CHANNEL]: caseFUnctions.insertChannel,
    [actionTypes.INSERT_CHANNEL_SUCCESS]: caseFUnctions.insertChannelSuccess,
    [actionTypes.INSERT_CHANNEL_FAILURE]: caseFUnctions.insertChannelFailure,
    [actionTypes.INSERT_CHANNEL_RESET]: caseFUnctions.insertChannelReset,
});
