import { IActionCall, IChannel, IChatWebAdd, IRequestBody } from "@types";
import { ChannelsService, CommonService } from "network";
import actionTypes from "./actionTypes";

export const getChannelsList = (accessToken: String): IActionCall => ({
    callAPI: () => ChannelsService.getPagelist(accessToken),
    types: {
        loading: actionTypes.CHANNELS,
        success: actionTypes.CHANNELS_SUCCESS,
        failure: actionTypes.CHANNELS_FAILURE,
    },
    type: null,
});
export const getChannelsListSub = (accessToken: String): IActionCall => ({
    callAPI: () => ChannelsService.getPagelistSub(accessToken),
    types: {
        loading: actionTypes.CHANNELS,
        success: actionTypes.CHANNELS_SUCCESS,
        failure: actionTypes.CHANNELS_FAILURE,
    },
    type: null,
});
export const insertChannel = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.insertchnl(requestBody),
    types: {
        loading: actionTypes.CHANNELS,
        success: actionTypes.CHANNELS_INSERTSUCCESS,
        failure: actionTypes.CHANNELS_FAILURE,
    },
    type: null,
});
export const activateChannel = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.activateChannel(requestBody),
    types: {
        loading: actionTypes.ACTIVATECHANNEL,
        success: actionTypes.ACTIVATECHANNEL_SUCCESS,
        failure: actionTypes.ACTIVATECHANNEL_FAILURE,
    },
    type: null,
});
export const deleteChannel = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.deletechnl(requestBody),
    types: {
        loading: actionTypes.CHANNELS,
        success: actionTypes.CHANNELS_INSERTSUCCESS,
        failure: actionTypes.CHANNELS_FAILURE,
    },
    type: null,
});

export const checkPaymentPlan = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.checkPaymentPlan(requestBody),
    types: {
        loading: actionTypes.CHECK_PAYMENTPLAN,
        success: actionTypes.CHECK_PAYMENTPLAN_SUCCESS,
        failure: actionTypes.CHECK_PAYMENTPLAN_FAILURE,
    },
    type: null,
});

export const resetGetChannelsList = (): IActionCall => ({type: actionTypes.CHANNELS_RESET});

export const resetChannelInsert = (): IActionCall => ({type: actionTypes.CHANNELS_INSERTSUCCESS_RESET});

export const insertChannel2 = (payload: IRequestBody<IChatWebAdd>): IActionCall => ({
    callAPI: async () => {
        const chatIconFile = payload.service!.interface.iconbutton as File | null;
        const headerIconFile = payload.service!.interface.iconheader as File | null;
        const botIconFile = payload.service!.interface.iconbot as File | null;
        const bubbleIconFile = payload.service!.bubble.iconbubble as File | null;

        let chatIcon = "";
        let headerIcon = "";
        let botIcon = "";
        let bubbleIcon = "";

        if (chatIconFile) {
            const fd = new FormData();
            fd.append('file', chatIconFile, chatIconFile.name);
            chatIcon = (await CommonService.uploadFile(fd)).data["url"];
        }

        if (headerIconFile) {
            const fd = new FormData();
            fd.append('file', headerIconFile, headerIconFile.name);
            headerIcon = (await CommonService.uploadFile(fd)).data["url"];
        }

        if (botIconFile) {
            const fd = new FormData();
            fd.append('file', botIconFile, botIconFile.name);
            botIcon = (await CommonService.uploadFile(fd)).data["url"];
        }

        if (bubbleIconFile) {
            const fd = new FormData();
            fd.append('file', bubbleIconFile, bubbleIconFile.name);
            bubbleIcon = (await CommonService.uploadFile(fd)).data["url"];
        }

        payload.service!.interface.iconbutton = chatIcon;
        payload.service!.interface.iconheader = headerIcon;
        payload.service!.interface.iconbot = botIcon;
        payload.service!.bubble.iconbubble = bubbleIcon;

        return ChannelsService.insertchnl(payload);
    },
    types: {
        loading: actionTypes.INSERT_CHANNEL,
        failure: actionTypes.INSERT_CHANNEL_FAILURE,
        success: actionTypes.INSERT_CHANNEL_SUCCESS,
    },
    type: null,
});

export const resetInsertChannel = () => ({type: actionTypes.INSERT_CHANNEL_RESET });

export const editChannel = (payload: IRequestBody<IChannel | IChatWebAdd>, channelType?: string): IActionCall => ({
    callAPI: async () => {
        if (channelType === "CHAZ") {
            const service = payload.service as IChatWebAdd;
            let chatIcon = service.interface.iconbutton as File | string | null;
            let headerIcon = service.interface.iconheader as File | string | null;
            let botIcon = service.interface.iconbot as File | string | null;
            let bubbleIcon = service.bubble.iconbubble as File | string | null;

            if (chatIcon && typeof chatIcon === "object") {
                const fd = new FormData();
                fd.append('file', chatIcon, chatIcon.name);
                chatIcon = (await CommonService.uploadFile(fd)).data["url"] as string;
            }

            if (headerIcon && typeof headerIcon === "object") {
                const fd = new FormData();
                fd.append('file', headerIcon, headerIcon.name);
                headerIcon = (await CommonService.uploadFile(fd)).data["url"] as string;
            }

            if (botIcon && typeof botIcon === "object") {
                const fd = new FormData();
                fd.append('file', botIcon, botIcon.name);
                botIcon = (await CommonService.uploadFile(fd)).data["url"] as string;
            }

            if (bubbleIcon && typeof bubbleIcon === "object") {
                const fd = new FormData();
                fd.append('file', bubbleIcon, bubbleIcon.name);
                bubbleIcon = (await CommonService.uploadFile(fd)).data["url"] as string;
            }

            (payload.service as IChatWebAdd).interface.iconbutton = chatIcon;
            (payload.service as IChatWebAdd).interface.iconheader = headerIcon;
            (payload.service as IChatWebAdd).interface.iconbot = botIcon;
            (payload.service as IChatWebAdd).bubble.iconbubble = bubbleIcon;

            return ChannelsService.editchnl(payload);
        }
        return CommonService.main(payload);
    },
    types: {
        loading: actionTypes.EDIT_CHANNEL,
        failure: actionTypes.EDIT_CHANNEL_FAILURE,
        success: actionTypes.EDIT_CHANNEL_SUCCESS,
    },
    type: null,
});

export const resetEditChannel = () => ({type: actionTypes.EDIT_CHANNEL_RESET });
