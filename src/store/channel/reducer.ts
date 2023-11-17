import { Dictionary, IListStatePaginated, IObjectState, IProcessState, ITemplate } from "@types";
import { createReducer, initialListPaginatedState, initialObjectState, initialProccessState, initialCommon } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

interface channelResponse {
    code: string,
    id: string,
    msg: string,
    object: string,
}

export interface IRequest extends ITemplate {
    data: channelResponse | null;
    msg?: string | null;
}

export interface IState {
    requestSynchronizeTemplate: IRequest;
    requestAddTemplate: IRequest;
    requestDeleteTemplate: IRequest;
    requestGetGroupList: IRequest;
    requestGetNumberList: IRequest;

    channelList: IListStatePaginated<Dictionary>;

    facebookPages: IListStatePaginated<any>;
    messengerPages: IListStatePaginated<any>;
    instagramPages: IListStatePaginated<any>;
    instagramDMPages: IListStatePaginated<any>;

    successinsert: Boolean;
    insertChannel: IObjectState<{ success: boolean, integrationid: string, integrationId: string, result: any }>;
    activateChannel: IObjectState<{ success: boolean }>;
    checkPaymentPlan: IObjectState<{ success: boolean, createChannel: boolean, providerWhatsApp: string }>;
    editChannel: IProcessState;
}

export const initialState: IState = {
    requestSynchronizeTemplate: { ...initialCommon, data: null, loading: false, error: false },
    requestAddTemplate: { ...initialCommon, data: null, loading: false, error: false },
    requestDeleteTemplate: { ...initialCommon, data: null, loading: false, error: false },
    requestGetGroupList: { ...initialCommon, data: null, loading: false, error: false },
    requestGetNumberList: { ...initialCommon, data: null, loading: false, error: false },

    channelList: initialListPaginatedState,

    facebookPages: initialListPaginatedState,
    messengerPages: initialListPaginatedState,
    instagramPages: initialListPaginatedState,
    instagramDMPages: initialListPaginatedState,

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

    [actionTypes.FACEBOOK_PAGES]: caseFUnctions.facebookPages,
    [actionTypes.FACEBOOK_PAGES_SUCCESS]: caseFUnctions.facebookPagesSuccess,
    [actionTypes.FACEBOOK_PAGES_FAILURE]: caseFUnctions.facebookPagesFailure,
    [actionTypes.FACEBOOK_PAGES_RESET]: caseFUnctions.facebookPagesReset,

    [actionTypes.MESSENGER_PAGES]: caseFUnctions.messengerPages,
    [actionTypes.MESSENGER_PAGES_SUCCESS]: caseFUnctions.messengerPagesSuccess,
    [actionTypes.MESSENGER_PAGES_FAILURE]: caseFUnctions.messengerPagesFailure,
    [actionTypes.MESSENGER_PAGES_RESET]: caseFUnctions.messengerPagesReset,

    [actionTypes.INSTAGRAM_PAGES]: caseFUnctions.instagramPages,
    [actionTypes.INSTAGRAM_PAGES_SUCCESS]: caseFUnctions.instagramPagesSuccess,
    [actionTypes.INSTAGRAM_PAGES_FAILURE]: caseFUnctions.instagramPagesFailure,
    [actionTypes.INSTAGRAM_PAGES_RESET]: caseFUnctions.instagramPagesReset,

    [actionTypes.INSTAGRAMDM_PAGES]: caseFUnctions.instagramDMPages,
    [actionTypes.INSTAGRAMDM_PAGES_SUCCESS]: caseFUnctions.instagramDMPagesSuccess,
    [actionTypes.INSTAGRAMDM_PAGES_FAILURE]: caseFUnctions.instagramDMPagesFailure,
    [actionTypes.INSTAGRAMDM_PAGES_RESET]: caseFUnctions.instagramDMPagesReset,

    [actionTypes.SYNCHRONIZE_TEMPLATE]: caseFUnctions.synchronizeTemplate,
    [actionTypes.SYNCHRONIZE_TEMPLATE_FAILURE]: caseFUnctions.synchronizeTemplateFailure,
    [actionTypes.SYNCHRONIZE_TEMPLATE_SUCCESS]: caseFUnctions.synchronizeTemplateSuccess,
    [actionTypes.SYNCHRONIZE_TEMPLATE_RESET]: caseFUnctions.synchronizeTemplateReset,

    [actionTypes.ADD_TEMPLATE]: caseFUnctions.addTemplate,
    [actionTypes.ADD_TEMPLATE_FAILURE]: caseFUnctions.addTemplateFailure,
    [actionTypes.ADD_TEMPLATE_SUCCESS]: caseFUnctions.addTemplateSuccess,
    [actionTypes.ADD_TEMPLATE_RESET]: caseFUnctions.addTemplateReset,

    [actionTypes.DELETE_TEMPLATE]: caseFUnctions.deleteTemplate,
    [actionTypes.DELETE_TEMPLATE_FAILURE]: caseFUnctions.deleteTemplateFailure,
    [actionTypes.DELETE_TEMPLATE_SUCCESS]: caseFUnctions.deleteTemplateSuccess,
    [actionTypes.DELETE_TEMPLATE_RESET]: caseFUnctions.deleteTemplateReset,

    [actionTypes.GET_GROUP_LIST]: caseFUnctions.getGroupList,
    [actionTypes.GET_GROUP_LIST_FAILURE]: caseFUnctions.getGroupListFailure,
    [actionTypes.GET_GROUP_LIST_SUCCESS]: caseFUnctions.getGroupListSuccess,
    [actionTypes.GET_GROUP_LIST_RESET]: caseFUnctions.getGroupListReset,

    [actionTypes.PHONE_LIST]: caseFUnctions.getNumberList,
    [actionTypes.PHONE_LIST_FAILURE]: caseFUnctions.getNumberListFailure,
    [actionTypes.PHONE_LIST_SUCCESS]: caseFUnctions.getNumberListSuccess,
    [actionTypes.PHONE_LIST_RESET]: caseFUnctions.getNumberListReset,
});
