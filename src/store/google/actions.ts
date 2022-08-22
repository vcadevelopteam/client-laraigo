import { IActionCall } from "@types";
import { GoogleService } from "network";

import actionTypes from "./actionTypes";

export const exchangeCode = (request: any): IActionCall => ({
    callAPI: () => GoogleService.exchangeCode(request),
    types: {
        loading: actionTypes.EXCHANGE_CODE,
        success: actionTypes.EXCHANGE_CODE_SUCCESS,
        failure: actionTypes.EXCHANGE_CODE_FAILURE,
    },
    type: null,
});

export const resetExchangeCode = (): IActionCall => ({ type: actionTypes.EXCHANGE_CODE_RESET });

export const listBlogger = (request: any): IActionCall => ({
    callAPI: () => GoogleService.listBlogger(request),
    types: {
        loading: actionTypes.LIST_BLOGGER,
        success: actionTypes.LIST_BLOGGER_SUCCESS,
        failure: actionTypes.LIST_BLOGGER_FAILURE,
    },
    type: null,
});

export const resetListBlogger = (): IActionCall => ({ type: actionTypes.LIST_BLOGGER_RESET });

export const listYouTube = (request: any): IActionCall => ({
    callAPI: () => GoogleService.listYouTube(request),
    types: {
        loading: actionTypes.LIST_YOUTUBE,
        success: actionTypes.LIST_YOUTUBE_SUCCESS,
        failure: actionTypes.LIST_YOUTUBE_FAILURE,
    },
    type: null,
});

export const resetListYouTube = (): IActionCall => ({ type: actionTypes.LIST_YOUTUBE_RESET });