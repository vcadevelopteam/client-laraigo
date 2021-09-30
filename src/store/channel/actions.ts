import { IActionCall, IChatWebAdd, IRequestBody } from "@types";
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
export const deleteChannel = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => ChannelsService.deletechnl(requestBody),
    types: {
        loading: actionTypes.CHANNELS,
        success: actionTypes.CHANNELS_INSERTSUCCESS,
        failure: actionTypes.CHANNELS_FAILURE,
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

        console.log("antes de insertchnl", payload);

        return ChannelsService.insertchnl(payload);
    },
    types: {
        loading: actionTypes.INSERT_CHANNEL,
        failure: actionTypes.INSERT_CHANNEL_FAILURE,
        success: actionTypes.INSERT_CHANNEL_SUCCESS,
    },
    type: null,
});

export const reserInsertChannel = () => ({type: actionTypes.INSERT_CHANNEL_RESET });
