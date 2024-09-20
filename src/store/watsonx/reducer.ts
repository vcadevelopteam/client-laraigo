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
    createmention: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    intent: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    itemsdetail: IListStatePaginated<Dictionary> & { key?: string };
    deleteitems: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    entity: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    mentions: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    bulkload: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    conflicts: IListStatePaginated<Dictionary> & { key?: string };
    resolveconflict: IListStatePaginated<Dictionary> & { success: boolean | undefined | null };
    exportItems: IListStatePaginated<Dictionary> & { key?: string };
}

export const initialState: IState = {
    items: initialListPaginatedState,
    selectedRow: null,
    createmention: { success: undefined, ...initialListPaginatedState },
    intent: { success: undefined, ...initialListPaginatedState },
    itemsdetail: initialListPaginatedState,
    deleteitems: { success: undefined, ...initialListPaginatedState },
    entity: { success: undefined, ...initialListPaginatedState },
    mentions: { success: undefined, ...initialListPaginatedState },
    bulkload: { success: undefined, ...initialListPaginatedState },
    conflicts: initialListPaginatedState,
    resolveconflict: { success: undefined, ...initialListPaginatedState },
    exportItems: initialListPaginatedState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.ITEMS]: caseFunctions.items,
    [actionTypes.ITEMS_SUCCESS]: caseFunctions.itemsSuccess,
    [actionTypes.ITEMS_FAILURE]: caseFunctions.itemsFailure,
    [actionTypes.ITEMS_RESET]: caseFunctions.itemsReset,

    [actionTypes.CREATEMENTION_MAIN]: caseFunctions.createmention,
    [actionTypes.CREATEMENTION_MAIN_SUCCESS]: caseFunctions.creatementionSuccess,
    [actionTypes.CREATEMENTION_MAIN_FAILURE]: caseFunctions.creatementionFailure,
    [actionTypes.CREATEMENTION_MAIN_RESET]: caseFunctions.creatementionReset,

    [actionTypes.INTENT]: caseFunctions.intent,
    [actionTypes.INTENT_SUCCESS]: caseFunctions.intentSuccess,
    [actionTypes.INTENT_FAILURE]: caseFunctions.intentFailure,
    [actionTypes.INTENT_RESET]: caseFunctions.intentReset,

    [actionTypes.ITEMSDETAIL]: caseFunctions.itemsdetail,
    [actionTypes.ITEMSDETAIL_SUCCESS]: caseFunctions.itemsdetailSuccess,
    [actionTypes.ITEMSDETAIL_FAILURE]: caseFunctions.itemsdetailFailure,
    [actionTypes.ITEMSDETAIL_RESET]: caseFunctions.itemsdetailReset,

    [actionTypes.DELETEITEMS]: caseFunctions.deleteitems,
    [actionTypes.DELETEITEMS_SUCCESS]: caseFunctions.deleteitemsSuccess,
    [actionTypes.DELETEITEMS_FAILURE]: caseFunctions.deleteitemsFailure,
    [actionTypes.DELETEITEMS_RESET]: caseFunctions.deleteitemsReset,

    [actionTypes.ENTITY]: caseFunctions.entity,
    [actionTypes.ENTITY_SUCCESS]: caseFunctions.entitySuccess,
    [actionTypes.ENTITY_FAILURE]: caseFunctions.entityFailure,
    [actionTypes.ENTITY_RESET]: caseFunctions.entityReset,

    [actionTypes.SETROW]: caseFunctions.setRow,

    [actionTypes.MENTIONS]: caseFunctions.mentions,
    [actionTypes.MENTIONS_SUCCESS]: caseFunctions.mentionsSuccess,
    [actionTypes.MENTIONS_FAILURE]: caseFunctions.mentionsFailure,
    [actionTypes.MENTIONS_RESET]: caseFunctions.mentionsReset,

    [actionTypes.BULKLOAD]: caseFunctions.bulkload,
    [actionTypes.BULKLOAD_SUCCESS]: caseFunctions.bulkloadSuccess,
    [actionTypes.BULKLOAD_FAILURE]: caseFunctions.bulkloadFailure,
    [actionTypes.BULKLOAD_RESET]: caseFunctions.bulkloadReset,

    [actionTypes.CONFLICTS]: caseFunctions.conflicts,
    [actionTypes.CONFLICTS_SUCCESS]: caseFunctions.conflictsSuccess,
    [actionTypes.CONFLICTS_FAILURE]: caseFunctions.conflictsFailure,
    [actionTypes.CONFLICTS_RESET]: caseFunctions.conflictsReset,

    [actionTypes.RESOLVECONFLICT]: caseFunctions.resolveconflict,
    [actionTypes.RESOLVECONFLICT_SUCCESS]: caseFunctions.resolveconflictSuccess,
    [actionTypes.RESOLVECONFLICT_FAILURE]: caseFunctions.resolveconflictFailure,
    [actionTypes.RESOLVECONFLICT_RESET]: caseFunctions.resolveconflictReset,

    [actionTypes.EXPORTITEMS]: caseFunctions.exportItems,
    [actionTypes.EXPORTITEMS_SUCCESS]: caseFunctions.exportItemsSuccess,
    [actionTypes.EXPORTITEMS_FAILURE]: caseFunctions.exportItemsFailure,
    [actionTypes.EXPORTITEMS_RESET]: caseFunctions.exportItemsReset,
});