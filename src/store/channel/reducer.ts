import { Dictionary, IListStatePaginated, IObjectState, IProcessState } from "@types";
import { createReducer, initialListPaginatedState, initialObjectState, initialProccessState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IState {
    channelList: IListStatePaginated<Dictionary>;
    successinsert: Boolean;
    insertChannel: IObjectState<{ success : boolean, integrationid: string }>;
    activateChannel: IObjectState<{ success : boolean}>;
    checkPaymentPlan: IObjectState<{ success : boolean, createChannel : boolean, providerWhatsApp: string }>;
    editChannel: IProcessState;
}

export const initialState: IState = {
    channelList: initialListPaginatedState,
    successinsert: false,
    insertChannel: initialObjectState,
    checkPaymentPlan: initialObjectState,
    editChannel: initialProccessState,
    activateChannel: initialObjectState,
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

    [actionTypes.CHECK_PAYMENTPLAN]: caseFUnctions.checkPaymentPlan,
    [actionTypes.CHECK_PAYMENTPLAN_SUCCESS]: caseFUnctions.checkPaymentPlanSuccess,
    [actionTypes.CHECK_PAYMENTPLAN_FAILURE]: caseFUnctions.checkPaymentPlanFailure,
    [actionTypes.CHECK_PAYMENTPLAN_RESET]: caseFUnctions.checkPaymentPlanReset,

    [actionTypes.ACTIVATECHANNEL]: caseFUnctions.activateChannel,
    [actionTypes.ACTIVATECHANNEL_SUCCESS]: caseFUnctions.activateChannelSuccess,
    [actionTypes.ACTIVATECHANNEL_FAILURE]: caseFUnctions.activateChannelFailure,
    [actionTypes.ACTIVATECHANNEL_RESET]: caseFUnctions.activateChannelReset,
});
