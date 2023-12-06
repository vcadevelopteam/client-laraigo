import { Dictionary, IListStatePaginated, IObjectState, IProcessState, ITemplate } from "@types";

import {
    createReducer,
    initialCommon,
    initialListPaginatedState,
    initialObjectState,
    initialProccessState,
} from "common/helpers";

import * as caseFunctions from "./caseFunctions";
import actionTypes from "./actionTypes";

interface ChannelData {
    code: string;
    id: string;
    msg: string;
    object: string;
}

export interface IRequest extends ITemplate {
    data: ChannelData | null;
    msg?: string | null;
}

export interface IState {
    activateChannel: IObjectState<{ success: boolean }>;
    channelList: IListStatePaginated<Dictionary>;
    checkPaymentPlan: IObjectState<{ success: boolean; createChannel: boolean; providerWhatsApp: string }>;
    editChannel: IProcessState;
    facebookPages: IListStatePaginated<unknown>;
    insertChannel: IObjectState<{ success: boolean; integrationid: string; integrationId: string }>;
    instagramDMPages: IListStatePaginated<unknown>;
    instagramPages: IListStatePaginated<unknown>;
    messengerPages: IListStatePaginated<unknown>;
    requestAddTemplate: IRequest;
    requestDeleteTemplate: IRequest;
    requestGetGroupList: IRequest;
    requestGetNumberList: IRequest;
    requestSynchronizeTemplate: IRequest;
    successinsert: boolean;
}

export const initialState: IState = {
    activateChannel: initialObjectState,
    channelList: initialListPaginatedState,
    checkPaymentPlan: initialObjectState,
    editChannel: initialProccessState,
    facebookPages: initialListPaginatedState,
    insertChannel: initialObjectState,
    instagramDMPages: initialListPaginatedState,
    instagramPages: initialListPaginatedState,
    messengerPages: initialListPaginatedState,
    requestAddTemplate: { ...initialCommon, data: null, loading: false, error: false },
    requestDeleteTemplate: { ...initialCommon, data: null, loading: false, error: false },
    requestGetGroupList: { ...initialCommon, data: null, loading: false, error: false },
    requestGetNumberList: { ...initialCommon, data: null, loading: false, error: false },
    requestSynchronizeTemplate: { ...initialCommon, data: null, loading: false, error: false },
    successinsert: false,
};

export default createReducer<IState>(initialState, {
    [actionTypes.ACTIVATECHANNEL]: caseFunctions.activateChannel,
    [actionTypes.ACTIVATECHANNEL_FAILURE]: caseFunctions.activateChannelFailure,
    [actionTypes.ACTIVATECHANNEL_RESET]: caseFunctions.activateChannelReset,
    [actionTypes.ACTIVATECHANNEL_SUCCESS]: caseFunctions.activateChannelSuccess,
    [actionTypes.ADD_TEMPLATE]: caseFunctions.addTemplate,
    [actionTypes.ADD_TEMPLATE_FAILURE]: caseFunctions.addTemplateFailure,
    [actionTypes.ADD_TEMPLATE_RESET]: caseFunctions.addTemplateReset,
    [actionTypes.ADD_TEMPLATE_SUCCESS]: caseFunctions.addTemplateSuccess,
    [actionTypes.CHANNELS]: caseFunctions.getChannels,
    [actionTypes.CHANNELS_FAILURE]: caseFunctions.getChannelsFailure,
    [actionTypes.CHANNELS_INSERTSUCCESS]: caseFunctions.getChannelsSuccessInsert,
    [actionTypes.CHANNELS_INSERTSUCCESS_RESET]: caseFunctions.resetChannelInsert,
    [actionTypes.CHANNELS_RESET]: caseFunctions.getChannelsReset,
    [actionTypes.CHANNELS_SUCCESS]: caseFunctions.getChannelsSuccess,
    [actionTypes.CHECK_PAYMENTPLAN]: caseFunctions.checkPaymentPlan,
    [actionTypes.CHECK_PAYMENTPLAN_FAILURE]: caseFunctions.checkPaymentPlanFailure,
    [actionTypes.CHECK_PAYMENTPLAN_RESET]: caseFunctions.checkPaymentPlanReset,
    [actionTypes.CHECK_PAYMENTPLAN_SUCCESS]: caseFunctions.checkPaymentPlanSuccess,
    [actionTypes.DELETE_TEMPLATE]: caseFunctions.deleteTemplate,
    [actionTypes.DELETE_TEMPLATE_FAILURE]: caseFunctions.deleteTemplateFailure,
    [actionTypes.DELETE_TEMPLATE_RESET]: caseFunctions.deleteTemplateReset,
    [actionTypes.DELETE_TEMPLATE_SUCCESS]: caseFunctions.deleteTemplateSuccess,
    [actionTypes.EDIT_CHANNEL]: caseFunctions.editChannel,
    [actionTypes.EDIT_CHANNEL_FAILURE]: caseFunctions.editChannelFailure,
    [actionTypes.EDIT_CHANNEL_RESET]: caseFunctions.editChannelReset,
    [actionTypes.EDIT_CHANNEL_SUCCESS]: caseFunctions.editChannelSuccess,
    [actionTypes.FACEBOOK_PAGES]: caseFunctions.facebookPages,
    [actionTypes.FACEBOOK_PAGES_FAILURE]: caseFunctions.facebookPagesFailure,
    [actionTypes.FACEBOOK_PAGES_RESET]: caseFunctions.facebookPagesReset,
    [actionTypes.FACEBOOK_PAGES_SUCCESS]: caseFunctions.facebookPagesSuccess,
    [actionTypes.GET_GROUP_LIST]: caseFunctions.getGroupList,
    [actionTypes.GET_GROUP_LIST_FAILURE]: caseFunctions.getGroupListFailure,
    [actionTypes.GET_GROUP_LIST_RESET]: caseFunctions.getGroupListReset,
    [actionTypes.GET_GROUP_LIST_SUCCESS]: caseFunctions.getGroupListSuccess,
    [actionTypes.INSERT_CHANNEL]: caseFunctions.insertChannel,
    [actionTypes.INSERT_CHANNEL_FAILURE]: caseFunctions.insertChannelFailure,
    [actionTypes.INSERT_CHANNEL_RESET]: caseFunctions.insertChannelReset,
    [actionTypes.INSERT_CHANNEL_SUCCESS]: caseFunctions.insertChannelSuccess,
    [actionTypes.INSTAGRAM_PAGES]: caseFunctions.instagramPages,
    [actionTypes.INSTAGRAM_PAGES_FAILURE]: caseFunctions.instagramPagesFailure,
    [actionTypes.INSTAGRAM_PAGES_RESET]: caseFunctions.instagramPagesReset,
    [actionTypes.INSTAGRAM_PAGES_SUCCESS]: caseFunctions.instagramPagesSuccess,
    [actionTypes.INSTAGRAMDM_PAGES]: caseFunctions.instagramDMPages,
    [actionTypes.INSTAGRAMDM_PAGES_FAILURE]: caseFunctions.instagramDMPagesFailure,
    [actionTypes.INSTAGRAMDM_PAGES_RESET]: caseFunctions.instagramDMPagesReset,
    [actionTypes.INSTAGRAMDM_PAGES_SUCCESS]: caseFunctions.instagramDMPagesSuccess,
    [actionTypes.MESSENGER_PAGES]: caseFunctions.messengerPages,
    [actionTypes.MESSENGER_PAGES_FAILURE]: caseFunctions.messengerPagesFailure,
    [actionTypes.MESSENGER_PAGES_RESET]: caseFunctions.messengerPagesReset,
    [actionTypes.MESSENGER_PAGES_SUCCESS]: caseFunctions.messengerPagesSuccess,
    [actionTypes.PHONE_LIST]: caseFunctions.getNumberList,
    [actionTypes.PHONE_LIST_FAILURE]: caseFunctions.getNumberListFailure,
    [actionTypes.PHONE_LIST_RESET]: caseFunctions.getNumberListReset,
    [actionTypes.PHONE_LIST_SUCCESS]: caseFunctions.getNumberListSuccess,
    [actionTypes.SYNCHRONIZE_TEMPLATE]: caseFunctions.synchronizeTemplate,
    [actionTypes.SYNCHRONIZE_TEMPLATE_FAILURE]: caseFunctions.synchronizeTemplateFailure,
    [actionTypes.SYNCHRONIZE_TEMPLATE_RESET]: caseFunctions.synchronizeTemplateReset,
    [actionTypes.SYNCHRONIZE_TEMPLATE_SUCCESS]: caseFunctions.synchronizeTemplateSuccess,
});