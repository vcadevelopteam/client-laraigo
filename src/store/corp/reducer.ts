import { IListStatePaginated, MultiData, Dictionary, ITemplate } from "@types";
import { createReducer, initialListPaginatedState, initialCommon } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface itemMulti {
    data: Dictionary[];
    success: boolean;
}

export interface IFilter {
    value: string;
    operator: string;
    type: string;
}

export interface IMemoryTable {
    page: number;
    pageSize: number;
    id: string;
    filters: { [key: string]: IFilter }
}

export interface IUpload extends ITemplate {
    url?: string;
    height?: string;
    width?: string;
    name?: string;
    thumbnail?: string;
}


export interface IState {
    executecorp: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    mainData: IListStatePaginated<Dictionary> & { key?: string };
}

export const initialState: IState = {
    executecorp: { success: undefined, ...initialListPaginatedState },
    mainData: initialListPaginatedState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.EXECUTECORP_MAIN]: caseFunctions.executeCorp,
    [actionTypes.EXECUTECORP_MAIN_SUCCESS]: caseFunctions.executeCorpSuccess,
    [actionTypes.EXECUTECORP_MAIN_FAILURE]: caseFunctions.executeCorpFailure,
    [actionTypes.EXECUTECORP_MAIN_RESET]: caseFunctions.executeCorpReset,

    [actionTypes.CORP_MAIN]: caseFunctions.corpGet,
    [actionTypes.CORP_MAIN_SUCCESS]: caseFunctions.corpGetSuccess,
    [actionTypes.CORP_MAIN_FAILURE]: caseFunctions.corpGetFailure,
    [actionTypes.CORP_MAIN_RESET]: caseFunctions.corpGetReset,
});