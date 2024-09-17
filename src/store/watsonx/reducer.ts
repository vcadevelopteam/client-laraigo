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
    items: IListStatePaginated<Dictionary> & { key?: string };
    selectedRow: any;
}

export const initialState: IState = {
    items: initialListPaginatedState,
    selectedRow: null,
};

export default createReducer<IState>(initialState, {
    [actionTypes.ITEMS]: caseFunctions.items,
    [actionTypes.ITEMS_SUCCESS]: caseFunctions.itemsSuccess,
    [actionTypes.ITEMS_FAILURE]: caseFunctions.itemsFailure,
    [actionTypes.ITEMS_RESET]: caseFunctions.itemsReset,

    [actionTypes.SETROW]: caseFunctions.setRow,

});