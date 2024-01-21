import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const getChannels = (state: IState): IState => ({
    ...state,
    channelList: { ...state.channelList, loading: true, error: false },
});

export const getChannelsSuccessInsert = (state: IState, action: IAction): IState => {
    return {
        ...state,
        successinsert: true,
        channelList: {
            data: [{ applicationId: action.payload?.applicationId, integrationId: action.payload?.integrationId, communicantionchannelid:action.payload?.result?.ufn_communicationchannel_ins }],
            count: 0,
            error: false,
            loading: false,
        },
    };
};

export const getChannelsSuccess = (state: IState, action: IAction): IState => {
    return {
        ...state,
        successinsert: true,
        channelList: {
            count: action.payload.count,
            data: action.payload.pageData.data || [],
            error: false,
            loading: false,
        },
    };
};

export const getChannelsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    successinsert: false,
    channelList: {
        ...state.channelList,
        code: action.payload.code || "getChannelsFailure:error",
        error: true,
        loading: false,
        message: action.payload.message || "Error al obtener la lista de tickets",
    },
});

export const getChannelsReset = (state: IState): IState => ({
    ...state,
    channelList: initialState.channelList,
    successinsert: false,
});

export const resetChannelInsert = (state: IState): IState => ({
    ...state,
    successinsert: initialState.successinsert,
});

export const insertChannel = (state: IState): IState => ({
    ...state,
    insertChannel: { ...state.insertChannel, loading: true, error: false },
});

export const insertChannelSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    insertChannel: {
        ...state.insertChannel,
        error: false,
        loading: false,
        value: action.payload,
    },
});

export const insertChannelFailure = (state: IState, action: IAction): IState => ({
    ...state,
    insertChannel: {
        error: true,
        loading: false,
        message: action.payload?.channeltype || action.payload?.msg || "Ocurrio un error al insertar el canal",
        value: undefined,
    },
});

export const insertChannelReset = (state: IState): IState => ({
    ...state,
    insertChannel: initialState.insertChannel,
});

export const editChannel = (state: IState): IState => ({
    ...state,
    editChannel: { ...state.editChannel, loading: true, error: false },
});

export const editChannelSuccess = (state: IState): IState => ({
    ...state,
    editChannel: {
        ...state.editChannel,
        error: false,
        loading: false,
        success: true,
    },
});

export const editChannelFailure = (state: IState, action: IAction): IState => ({
    ...state,
    editChannel: {
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error al editar el canal",
        success: false,
    },
});

export const editChannelReset = (state: IState): IState => ({
    ...state,
    editChannel: initialState.editChannel,
});

export const checkPaymentPlan = (state: IState): IState => ({
    ...state,
    checkPaymentPlan: { ...state.checkPaymentPlan, loading: true, error: false },
});

export const checkPaymentPlanSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    checkPaymentPlan: {
        ...state.checkPaymentPlan,
        error: false,
        loading: false,
        value: action.payload,
    },
});

export const checkPaymentPlanFailure = (state: IState, action: IAction): IState => ({
    ...state,
    checkPaymentPlan: {
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error al obtener el plan",
        value: undefined,
    },
});

export const checkPaymentPlanReset = (state: IState): IState => ({
    ...state,
    checkPaymentPlan: initialState.checkPaymentPlan,
});

export const activateChannel = (state: IState): IState => ({
    ...state,
    activateChannel: { ...state.activateChannel, loading: true, error: false },
});

export const activateChannelSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    activateChannel: {
        ...state.activateChannel,
        error: false,
        loading: false,
        value: action.payload,
    },
});

export const activateChannelFailure = (state: IState, action: IAction): IState => ({
    ...state,
    activateChannel: {
        error: true,
        loading: false,
        message: action.payload?.message || "Ocurrio un error al activar el canal",
        value: undefined,
    },
});

export const activateChannelReset = (state: IState): IState => ({
    ...state,
    facebookPages: initialState.facebookPages,
});

export const facebookPages = (state: IState): IState => ({
    ...state,
    facebookPages: {
        ...state.facebookPages,
        error: false,
        loading: true,
    },
});

export const facebookPagesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    facebookPages: {
        ...state.facebookPages,
        count: action.payload.count,
        data: action.payload.pageData.data || [],
        error: false,
        loading: false,
    },
});

export const facebookPagesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    facebookPages: {
        ...state.facebookPages,
        code: action.payload.code || "facebookPagesFailure:error",
        error: true,
        loading: false,
        message: action.payload.message || "Error al obtener la lista de paginas de facebook",
    },
});

export const facebookPagesReset = (state: IState): IState => ({
    ...state,
    facebookPages: initialState.facebookPages,
});

export const messengerPages = (state: IState): IState => ({
    ...state,
    messengerPages: {
        ...state.messengerPages,
        error: false,
        loading: true,
    },
});

export const messengerPagesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    messengerPages: {
        ...state.messengerPages,
        count: action.payload.count,
        data: action.payload.pageData.data || [],
        error: false,
        loading: false,
    },
});

export const messengerPagesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    messengerPages: {
        ...state.messengerPages,
        code: action.payload.code || "messengerPagesFailure:error",
        error: true,
        loading: false,
        message: action.payload.message || "Error al obtener la lista de paginas de messenger",
    },
});

export const messengerPagesReset = (state: IState): IState => ({
    ...state,
    messengerPages: initialState.messengerPages,
});

export const instagramPages = (state: IState): IState => ({
    ...state,
    instagramPages: {
        ...state.instagramPages,
        error: false,
        loading: true,
    },
});

export const instagramPagesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    instagramPages: {
        ...state.instagramPages,
        count: action.payload.count,
        data: action.payload.pageData.data || [],
        error: false,
        loading: false,
    },
});

export const instagramPagesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    instagramPages: {
        ...state.instagramPages,
        code: action.payload.code || "messengerPagesFailure:error",
        error: true,
        loading: false,
        message: action.payload.message || "Error al obtener la lista de paginas de messenger",
    },
});

export const instagramPagesReset = (state: IState): IState => ({
    ...state,
    instagramPages: initialState.instagramPages,
});

export const instagramDMPages = (state: IState): IState => ({
    ...state,
    instagramDMPages: {
        ...state.instagramDMPages,
        error: false,
        loading: true,
    },
});

export const instagramDMPagesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    instagramDMPages: {
        ...state.instagramDMPages,
        count: action.payload.count,
        data: action.payload.pageData.data || [],
        error: false,
        loading: false,
    },
});

export const instagramDMPagesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    instagramDMPages: {
        ...state.instagramDMPages,
        code: action.payload.code || "messengerPagesFailure:error",
        error: true,
        loading: false,
        message: action.payload.message || "Error al obtener la lista de paginas de messenger",
    },
});

export const instagramDMPagesReset = (state: IState): IState => ({
    ...state,
    instagramDMPages: initialState.instagramDMPages,
});

export const synchronizeTemplate = (state: IState): IState => ({
    ...state,
    requestSynchronizeTemplate: {
        ...state.requestSynchronizeTemplate,
        error: false,
        loading: true,
    },
});

export const synchronizeTemplateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestSynchronizeTemplate: {
        ...state.requestSynchronizeTemplate,
        code: action?.payload?.code,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message || "error_unexpected_error",
    },
});

export const synchronizeTemplateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestSynchronizeTemplate: {
        ...state.requestSynchronizeTemplate,
        code: action?.payload?.code,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message,
    },
});

export const synchronizeTemplateReset = (state: IState): IState => ({
    ...state,
    requestSynchronizeTemplate: initialState.requestSynchronizeTemplate,
});

export const addTemplate = (state: IState): IState => ({
    ...state,
    requestAddTemplate: {
        ...state.requestAddTemplate,
        error: false,
        loading: true,
    },
});

export const addTemplateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestAddTemplate: {
        ...state.requestAddTemplate,
        code: action?.payload?.code,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message || "error_unexpected_error",
    },
});

export const addTemplateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestAddTemplate: {
        ...state.requestAddTemplate,
        code: action?.payload?.code,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message,
    },
});

export const addTemplateReset = (state: IState): IState => ({
    ...state,
    requestAddTemplate: initialState.requestAddTemplate,
});

export const deleteTemplate = (state: IState): IState => ({
    ...state,
    requestDeleteTemplate: {
        ...state.requestDeleteTemplate,
        error: false,
        loading: true,
    },
});

export const deleteTemplateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestDeleteTemplate: {
        ...state.requestDeleteTemplate,
        code: action?.payload?.code,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message || "error_unexpected_error",
    },
});

export const deleteTemplateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestDeleteTemplate: {
        ...state.requestDeleteTemplate,
        code: action?.payload?.code,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message,
    },
});

export const deleteTemplateReset = (state: IState): IState => ({
    ...state,
    requestDeleteTemplate: initialState.requestDeleteTemplate,
});

export const getGroupList = (state: IState): IState => ({
    ...state,
    requestGetGroupList: {
        ...state.requestGetGroupList,
        error: false,
        loading: true,
    },
});

export const getGroupListFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetGroupList: {
        ...state.requestGetGroupList,
        code: action?.payload?.code,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message || "error_unexpected_error",
    },
});

export const getGroupListSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetGroupList: {
        ...state.requestGetGroupList,
        code: action?.payload?.code,
        data: action?.payload?.data?.data,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message,
    },
});

export const getGroupListReset = (state: IState): IState => ({
    ...state,
    requestGetGroupList: initialState.requestGetGroupList,
});

export const getNumberList = (state: IState): IState => ({
    ...state,
    requestGetNumberList: {
        ...state.requestGetNumberList,
        error: false,
        loading: true,
    },
});

export const getNumberListFailure = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetNumberList: {
        ...state.requestGetNumberList,
        code: action?.payload?.code,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message || "error_unexpected_error",
    },
});

export const getNumberListSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    requestGetNumberList: {
        ...state.requestGetNumberList,
        code: action?.payload?.code,
        data: action?.payload?.data,
        error: !action?.payload?.success,
        loading: false,
        msg: action?.payload?.message,
    },
});

export const getNumberListReset = (state: IState): IState => ({
    ...state,
    requestGetNumberList: initialState.requestGetNumberList,
});