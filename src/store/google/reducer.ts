import { createReducer, initialCommon } from "common/helpers";
import { ITemplate } from "@types";

import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data?: any | null;
    msg?: string | null;
}

export interface IState {
    requestExchangeCode: IRequest;
    requestListBlogger: IRequest;
    requestListYouTube: IRequest;
}

export const initialState: IState = {
    requestExchangeCode: { ...initialCommon, data: null, loading: false, error: false },
    requestListBlogger: { ...initialCommon, data: null, loading: false, error: false },
    requestListYouTube: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.EXCHANGE_CODE]: caseFUnctions.exchangeCode,
    [actionTypes.EXCHANGE_CODE_FAILURE]: caseFUnctions.exchangeCodeFailure,
    [actionTypes.EXCHANGE_CODE_SUCCESS]: caseFUnctions.exchangeCodeSuccess,
    [actionTypes.EXCHANGE_CODE_RESET]: caseFUnctions.exchangeCodeReset,

    [actionTypes.LIST_BLOGGER]: caseFUnctions.listBlogger,
    [actionTypes.LIST_BLOGGER_FAILURE]: caseFUnctions.listBloggerFailure,
    [actionTypes.LIST_BLOGGER_SUCCESS]: caseFUnctions.listBloggerSuccess,
    [actionTypes.LIST_BLOGGER_RESET]: caseFUnctions.listBloggerReset,

    [actionTypes.LIST_YOUTUBE]: caseFUnctions.listYouTube,
    [actionTypes.LIST_YOUTUBE_FAILURE]: caseFUnctions.listYouTubeFailure,
    [actionTypes.LIST_YOUTUBE_SUCCESS]: caseFUnctions.listYouTubeSuccess,
    [actionTypes.LIST_YOUTUBE_RESET]: caseFUnctions.listYouTubeReset,
});
