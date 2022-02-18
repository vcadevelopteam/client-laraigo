import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const getChannels = (state: IState): IState => ({
    ...state,
    channelList: { ...state.channelList, loading: true, error: false },
});

export const getChannelsSuccessInsert = (state: IState, action: IAction): IState => {
    return{
        ...state,
        channelList: {
            data: [ { applicationId: action.payload?.applicationId, integrationId: action.payload?.integrationId }],
            count: 0,
            loading: false,
            error: false,
        },
        successinsert:true
    }
}
;
export const getChannelsSuccess = (state: IState, action: IAction): IState => {
    return{
        ...state,
        channelList: {
            data: action.payload.pageData.data || [],
            count: action.payload.count,
            loading: false,
            error: false,
        },
        successinsert:true
    }
};

export const getChannelsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    channelList: {
        ...state.channelList,
        loading: false,
        error: true,
        code: action.payload.code || 'getChannelsFailure:error',
        message: action.payload.message || 'Error al obtener la lista de tickets',
    },
    successinsert:false
});

export const getChannelsReset = (state: IState): IState => ({
    ...state,
    channelList: initialState.channelList,
    successinsert: false
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
        value: action.payload,
        loading: false,
        error: false,
    },
});

export const insertChannelFailure = (state: IState, action: IAction): IState => ({
    ...state,
    insertChannel: {
        value: undefined,
        loading: false,
        error: true,
        message: action.payload?.message || "Ocurrio uun error al insertar el canal"
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

export const editChannelSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    editChannel: {
        ...state.editChannel,
        success: true,
        loading: false,
        error: false,
    },
});

export const editChannelFailure = (state: IState, action: IAction): IState => ({
    ...state,
    editChannel: {
        success: false,
        loading: false,
        error: true,
        message: action.payload?.message || "Ocurrio un error al editar el canal"
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
        value: action.payload,
        loading: false,
        error: false,
    },
});

export const checkPaymentPlanFailure = (state: IState, action: IAction): IState => ({
    ...state,
    checkPaymentPlan: {
        value: undefined,
        loading: false,
        error: true,
        message: action.payload?.message || "Ocurrio un error al obtener el plan"
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
        value: action.payload,
        loading: false,
        error: false,
    },
});

export const activateChannelFailure = (state: IState, action: IAction): IState => ({
    ...state,
    activateChannel: {
        value: undefined,
        loading: false,
        error: true,
        message: action.payload?.message || "Ocurrio uun error al insertar el canal"
    },
});

export const activateChannelReset = (state: IState): IState => ({
    ...state,
    facebookPages: initialState.facebookPages,
});

//#region FACEBOOK_PAGES
export const facebookPages = (state: IState): IState => ({
    ...state,
    facebookPages: {
        ...state.facebookPages,
        loading: true,
        error: false,
    },
});

export const facebookPagesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    facebookPages: {
        ...state.facebookPages,
        data: action.payload.pageData.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const facebookPagesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    facebookPages: {
        ...state.facebookPages,
        loading: false,
        error: true,
        code: action.payload.code || 'facebookPagesFailure:error',
        message: action.payload.message || 'Error al obtener la lista de paginas de facebook',
    },
});

export const facebookPagesReset = (state: IState): IState => ({
    ...state,
    facebookPages: initialState.facebookPages,
});
//#endregion

//#region MESSENGER_PAGES
export const messengerPages = (state: IState): IState => ({
    ...state,
    messengerPages: {
        ...state.messengerPages,
        loading: true,
        error: false,
    },
});

export const messengerPagesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    messengerPages: {
        ...state.messengerPages,
        data: action.payload.pageData.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const messengerPagesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    messengerPages: {
        ...state.messengerPages,
        loading: false,
        error: true,
        code: action.payload.code || 'messengerPagesFailure:error',
        message: action.payload.message || 'Error al obtener la lista de paginas de messenger',
    },
});

export const messengerPagesReset = (state: IState): IState => ({
    ...state,
    messengerPages: initialState.messengerPages,
});
//#endregion

//#region INSTAGRAM_PAGES
export const instagramPages = (state: IState): IState => ({
    ...state,
    instagramPages: {
        ...state.instagramPages,
        loading: true,
        error: false,
    },
});

export const instagramPagesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    instagramPages: {
        ...state.instagramPages,
        data: action.payload.pageData.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const instagramPagesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    instagramPages: {
        ...state.instagramPages,
        loading: false,
        error: true,
        code: action.payload.code || 'messengerPagesFailure:error',
        message: action.payload.message || 'Error al obtener la lista de paginas de messenger',
    },
});

export const instagramPagesReset = (state: IState): IState => ({
    ...state,
    instagramPages: initialState.instagramPages,
});
//#endregion

//#region INSTAGRAMDM_PAGES
export const instagramDMPages = (state: IState): IState => ({
    ...state,
    instagramDMPages: {
        ...state.instagramDMPages,
        loading: true,
        error: false,
    },
});

export const instagramDMPagesSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    instagramDMPages: {
        ...state.instagramDMPages,
        data: action.payload.pageData.data || [],
        count: action.payload.count,
        loading: false,
        error: false,
    },
});

export const instagramDMPagesFailure = (state: IState, action: IAction): IState => ({
    ...state,
    instagramDMPages: {
        ...state.instagramDMPages,
        loading: false,
        error: true,
        code: action.payload.code || 'messengerPagesFailure:error',
        message: action.payload.message || 'Error al obtener la lista de paginas de messenger',
    },
});

export const instagramDMPagesReset = (state: IState): IState => ({
    ...state,
    instagramDMPages: initialState.instagramDMPages,
});
//#endregion