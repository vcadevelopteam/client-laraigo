import { IActionCall, IChannel, IChatWebAdd, IRequestBody } from "@types";
import { ChannelsService, CommonService } from "network";
import actionTypes from "./actionTypes";

export const getChannelsList = (accessToken: string, appId: string): IActionCall => ({
    callAPI: () => ChannelsService.getPagelist(accessToken, appId),
    type: null,
    types: {
        failure: actionTypes.CHANNELS_FAILURE,
        loading: actionTypes.CHANNELS,
        success: actionTypes.CHANNELS_SUCCESS,
    },
});

export const getChannelsListSub = (accessToken: string, appId: string): IActionCall => ({
    callAPI: () => ChannelsService.getPagelistSub(accessToken, appId),
    type: null,
    types: {
        failure: actionTypes.CHANNELS_FAILURE,
        loading: actionTypes.CHANNELS,
        success: actionTypes.CHANNELS_SUCCESS,
    },
});

export const insertChannel = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.insertchnl(requestBody),
    type: null,
    types: {
        failure: actionTypes.CHANNELS_FAILURE,
        loading: actionTypes.CHANNELS,
        success: actionTypes.CHANNELS_INSERTSUCCESS,
    },
});

export const activateChannel = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.activateChannel(requestBody),
    type: null,
    types: {
        failure: actionTypes.ACTIVATECHANNEL_FAILURE,
        loading: actionTypes.ACTIVATECHANNEL,
        success: actionTypes.ACTIVATECHANNEL_SUCCESS,
    },
});

export const deleteChannel = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.deletechnl(requestBody),
    type: null,
    types: {
        failure: actionTypes.CHANNELS_FAILURE,
        loading: actionTypes.CHANNELS,
        success: actionTypes.CHANNELS_INSERTSUCCESS,
    },
});

export const checkPaymentPlan = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.checkPaymentPlan(requestBody),
    type: null,
    types: {
        failure: actionTypes.CHECK_PAYMENTPLAN_FAILURE,
        loading: actionTypes.CHECK_PAYMENTPLAN,
        success: actionTypes.CHECK_PAYMENTPLAN_SUCCESS,
    },
});

export const resetGetChannelsList = (): IActionCall => ({ type: actionTypes.CHANNELS_RESET });

export const resetGetChannelsSubList = (): IActionCall => ({ type: actionTypes.CHANNELS_RESET });

export const resetChannelInsert = (): IActionCall => ({ type: actionTypes.CHANNELS_INSERTSUCCESS_RESET });

export const insertChannel2 = (payload: IRequestBody<IChatWebAdd>): IActionCall => ({
    type: null,
    callAPI: async () => {
        const botIconFile = payload?.service?.interface.iconbot as File | null;
        const bubbleIconFile = payload?.service?.bubble.iconbubble as File | null;
        const chatIconFile = payload?.service?.interface.iconbutton as File | null;
        const headerIconFile = payload?.service?.interface.iconheader as File | null;

        let botIcon = "";
        let bubbleIcon = "";
        let chatIcon = "";
        let headerIcon = "";

        if (botIconFile) {
            const fd = new FormData();
            fd.append("file", botIconFile, botIconFile.name);
            botIcon = (await CommonService.uploadFile(fd)).data["url"];
        }

        if (bubbleIconFile) {
            const fd = new FormData();
            fd.append("file", bubbleIconFile, bubbleIconFile.name);
            bubbleIcon = (await CommonService.uploadFile(fd)).data["url"];
        }

        if (chatIconFile) {
            const fd = new FormData();
            fd.append("file", chatIconFile, chatIconFile.name);
            chatIcon = (await CommonService.uploadFile(fd)).data["url"];
        }

        if (headerIconFile) {
            const fd = new FormData();
            fd.append("file", headerIconFile, headerIconFile.name);
            headerIcon = (await CommonService.uploadFile(fd)).data["url"];
        }

        if (payload?.service) {
            payload.service.interface.iconbutton = chatIcon;
            payload.service.interface.iconheader = headerIcon;
            payload.service.interface.iconbot = botIcon;
            payload.service.bubble.iconbubble = bubbleIcon;
        }

        return ChannelsService.insertchnl(payload);
    },
    types: {
        failure: actionTypes.INSERT_CHANNEL_FAILURE,
        loading: actionTypes.INSERT_CHANNEL,
        success: actionTypes.INSERT_CHANNEL_SUCCESS,
    },
});

export const resetInsertChannel = () => ({ type: actionTypes.INSERT_CHANNEL_RESET });

export const editChannel = (payload: IRequestBody<IChannel | IChatWebAdd>, channelType?: string): IActionCall => ({
    type: null,
    callAPI: async () => {
        if (channelType === "CHAZ" || channelType === "SMOOCHANDROID") {
            const service = payload.service as IChatWebAdd;

            type editChannelType = File | string | null;

            let botIcon: editChannelType = service.interface.iconbot;
            let bubbleIcon: editChannelType = service.bubble.iconbubble;
            let chatIcon: editChannelType = service.interface.iconbutton;
            let headerIcon: editChannelType = service.interface.iconheader;

            if (botIcon && typeof botIcon === "object") {
                const fd = new FormData();
                fd.append("file", botIcon, botIcon.name);
                botIcon = (await CommonService.uploadFile(fd)).data["url"] as string;
            }

            if (bubbleIcon && typeof bubbleIcon === "object") {
                const fd = new FormData();
                fd.append("file", bubbleIcon, bubbleIcon.name);
                bubbleIcon = (await CommonService.uploadFile(fd)).data["url"] as string;
            }

            if (chatIcon && typeof chatIcon === "object") {
                const fd = new FormData();
                fd.append("file", chatIcon, chatIcon.name);
                chatIcon = (await CommonService.uploadFile(fd)).data["url"] as string;
            }

            if (headerIcon && typeof headerIcon === "object") {
                const fd = new FormData();
                fd.append("file", headerIcon, headerIcon.name);
                headerIcon = (await CommonService.uploadFile(fd)).data["url"] as string;
            }

            (payload.service as IChatWebAdd).bubble.iconbubble = bubbleIcon;
            (payload.service as IChatWebAdd).interface.iconbot = botIcon;
            (payload.service as IChatWebAdd).interface.iconbutton = chatIcon;
            (payload.service as IChatWebAdd).interface.iconheader = headerIcon;

            return ChannelsService.editchnl(payload);
        }

        return CommonService.main(payload);
    },
    types: {
        failure: actionTypes.EDIT_CHANNEL_FAILURE,
        loading: actionTypes.EDIT_CHANNEL,
        success: actionTypes.EDIT_CHANNEL_SUCCESS,
    },
});

export const resetEditChannel = () => ({ type: actionTypes.EDIT_CHANNEL_RESET });

export const getFacebookPages = (accessToken: string, appId: string): IActionCall => ({
    callAPI: () => ChannelsService.getPagelistSub(accessToken, appId),
    type: null,
    types: {
        failure: actionTypes.FACEBOOK_PAGES_FAILURE,
        loading: actionTypes.FACEBOOK_PAGES,
        success: actionTypes.FACEBOOK_PAGES_SUCCESS,
    },
});

export const resetGetFacebookPages = () => ({ type: actionTypes.FACEBOOK_PAGES_RESET });

export const getMessengerPages = (accessToken: string, appId: string): IActionCall => ({
    callAPI: () => ChannelsService.getPagelistSub(accessToken, appId),
    type: null,
    types: {
        failure: actionTypes.MESSENGER_PAGES_FAILURE,
        loading: actionTypes.MESSENGER_PAGES,
        success: actionTypes.MESSENGER_PAGES_SUCCESS,
    },
});

export const resetGetMessengerPages = () => ({ type: actionTypes.MESSENGER_PAGES_RESET });

export const getInstagramPages = (accessToken: string, appId: string): IActionCall => ({
    callAPI: () => ChannelsService.getPagelistSub(accessToken, appId),
    type: null,
    types: {
        failure: actionTypes.INSTAGRAM_PAGES_FAILURE,
        loading: actionTypes.INSTAGRAM_PAGES,
        success: actionTypes.INSTAGRAM_PAGES_SUCCESS,
    },
});

export const resetGetInstagramPages = () => ({ type: actionTypes.INSTAGRAM_PAGES_RESET });

export const getInstagramDMPages = (accessToken: string, appId: string): IActionCall => ({
    callAPI: () => ChannelsService.getPagelistSub(accessToken, appId),
    type: null,
    types: {
        failure: actionTypes.INSTAGRAMDM_PAGES_FAILURE,
        loading: actionTypes.INSTAGRAMDM_PAGES,
        success: actionTypes.INSTAGRAMDM_PAGES_SUCCESS,
    },
});

export const resetGetInstagramDMPages = () => ({ type: actionTypes.INSTAGRAMDM_PAGES_RESET });

export const synchronizeTemplate = (): IActionCall => ({
    callAPI: () => ChannelsService.synchronizeTemplate(),
    type: null,
    types: {
        failure: actionTypes.SYNCHRONIZE_TEMPLATE_FAILURE,
        loading: actionTypes.SYNCHRONIZE_TEMPLATE,
        success: actionTypes.SYNCHRONIZE_TEMPLATE_SUCCESS,
    },
});

export const resetSynchronizeTemplate = (): IActionCall => ({ type: actionTypes.SYNCHRONIZE_TEMPLATE_RESET });

export const addTemplate = (request: unknown): IActionCall => ({
    callAPI: () => ChannelsService.addTemplate(request),
    type: null,
    types: {
        failure: actionTypes.ADD_TEMPLATE_FAILURE,
        loading: actionTypes.ADD_TEMPLATE,
        success: actionTypes.ADD_TEMPLATE_SUCCESS,
    },
});

export const resetAddTemplate = (): IActionCall => ({ type: actionTypes.ADD_TEMPLATE_RESET });

export const deleteTemplate = (request: unknown): IActionCall => ({
    callAPI: () => ChannelsService.deleteTemplate(request),
    type: null,
    types: {
        failure: actionTypes.DELETE_TEMPLATE_FAILURE,
        loading: actionTypes.DELETE_TEMPLATE,
        success: actionTypes.DELETE_TEMPLATE_SUCCESS,
    },
});

export const resetDeleteTemplate = (): IActionCall => ({ type: actionTypes.DELETE_TEMPLATE_RESET });

export const getGroupList = (request: unknown): IActionCall => ({
    callAPI: () => ChannelsService.getGroupList(request),
    type: null,
    types: {
        failure: actionTypes.GET_GROUP_LIST_FAILURE,
        loading: actionTypes.GET_GROUP_LIST,
        success: actionTypes.GET_GROUP_LIST_SUCCESS,
    },
});

export const resetgetGroupList = (): IActionCall => ({ type: actionTypes.GET_GROUP_LIST_RESET });

export const getPhoneList = (request: unknown): IActionCall => ({
    callAPI: () => ChannelsService.getPhoneList(request),
    type: null,
    types: {
        failure: actionTypes.PHONE_LIST_FAILURE,
        loading: actionTypes.PHONE_LIST,
        success: actionTypes.PHONE_LIST_SUCCESS,
    },
});

export const resetGetPhoneList = (): IActionCall => ({ type: actionTypes.PHONE_LIST_RESET });