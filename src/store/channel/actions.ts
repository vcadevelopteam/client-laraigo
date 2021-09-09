import { IActionCall, IRequestBody } from "@types";
import { ChannelsService } from "network";
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

//export const resetGetTickets = (): IActionCall => ({type: actionTypes.GET_TICKETS_RESET});
