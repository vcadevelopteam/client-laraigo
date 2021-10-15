import { Dictionary, IListStatePaginated, IObjectState, IProcessState } from "@types";
import { createReducer, initialListPaginatedState, initialObjectState, initialProccessState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    channelList: IListStatePaginated<Dictionary>;
    successinsert: Boolean;
    insertChannel: IObjectState<{ success : boolean, integrationid: string }>;
    editChannel: IProcessState;
}

export const initialState: IState = {
    channelList: initialListPaginatedState,
    successinsert: false,
    insertChannel: initialObjectState,
    editChannel: initialProccessState,
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

    [actionTypes.EDIT_CHANNEL]: caseFUnctions.editChannel,
    [actionTypes.EDIT_CHANNEL_SUCCESS]: caseFUnctions.editChannelSuccess,
    [actionTypes.EDIT_CHANNEL_FAILURE]: caseFUnctions.editChannelFailure,
    [actionTypes.EDIT_CHANNEL_RESET]: caseFUnctions.editChannelReset,
});
