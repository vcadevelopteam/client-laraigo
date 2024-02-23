import { IActionCall } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const getConversationData = (token: string): IActionCall => ({
    callAPI: () => CommonService.conversation(token),
    types: {
        loading: actionTypes.CONVERSATIONDATA,
        success: actionTypes.CONVERSATIONDATA_SUCCESS,
        failure: actionTypes.CONVERSATIONDATA_FAILURE,
    },
    type: null,
});

export const resetConversationData = (): IActionCall => ({ type: actionTypes.CONVERSATIONDATA_RESET });

export const getInteractionData = (token: string, requestBody: any): IActionCall => ({
    callAPI: () => CommonService.interactions(token, requestBody),
    types: {
        loading: actionTypes.INTERACTIONDATA,
        success: actionTypes.INTERACTIONDATA_SUCCESS,
        failure: actionTypes.INTERACTIONDATA_FAILURE,
    },
    type: null,
});

export const resetInteractionData = (): IActionCall => ({ type: actionTypes.INTERACTIONDATA_RESET });