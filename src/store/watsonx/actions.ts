import { IActionCall, IRequestBodyPaginated, IRequestBody, ITransaction, IRequestBodyDynamic, Dictionary } from "@types";
import { CommonService, WatsonService } from "network";
import actionTypes from "./actionTypes";
import { getWatsonxMentions, watsonxModelConflictSel, watsonxModelItemSel } from "common/helpers";



export const getItemsWatson = (id: number): IActionCall => ({
    callAPI: () => CommonService.main(watsonxModelItemSel(id)),
    types: {
        loading: actionTypes.ITEMS,
        success: actionTypes.ITEMS_SUCCESS,
        failure: actionTypes.ITEMS_FAILURE,
    },
    type: null,
});

export const resetItemsWatson = (): IActionCall => ({ type: actionTypes.ITEMS_RESET });

export const createNewMention = (requestBody: any): IActionCall => ({
    callAPI: () => WatsonService.watsonmention(requestBody),
    types: {
        loading: actionTypes.CREATEMENTION_MAIN,
        success: actionTypes.CREATEMENTION_MAIN_SUCCESS,
        failure: actionTypes.CREATEMENTION_MAIN_FAILURE,
    },
    type: null,
});

export const insertIntentwatsonx = (requestBody: any): IActionCall => ({
    callAPI: () => WatsonService.watsonintent(requestBody),
    types: {
        loading: actionTypes.CREATEMENTION_MAIN,
        success: actionTypes.CREATEMENTION_MAIN_SUCCESS,
        failure: actionTypes.CREATEMENTION_MAIN_FAILURE,
    },
    type: null,
});

export const setWatsonRow = (payload: { row: any }): IActionCall => ({ type: actionTypes.SETROW, payload });


export const getItemsDetail = (requestBody: any): IActionCall => ({
    callAPI: () => CommonService.main(requestBody),
    types: {
        loading: actionTypes.ITEMSDETAIL,
        success: actionTypes.ITEMSDETAIL_SUCCESS,
        failure: actionTypes.ITEMSDETAIL_FAILURE,
    },
    type: null,
});

export const resetItemsDetail = (): IActionCall => ({ type: actionTypes.ITEMSDETAIL_RESET });

export const deleteitemswatson = (requestBody: any): IActionCall => ({
    callAPI: () => WatsonService.watsondeleteitem(requestBody),
    types: {
        loading: actionTypes.DELETEITEMS,
        success: actionTypes.DELETEITEMS_SUCCESS,
        failure: actionTypes.DELETEITEMS_FAILURE,
    },
    type: null,
});

export const insertEntitywatsonx = (requestBody: any): IActionCall => ({
    callAPI: () => WatsonService.watsonentity(requestBody),
    types: {
        loading: actionTypes.CREATEMENTION_MAIN,
        success: actionTypes.CREATEMENTION_MAIN_SUCCESS,
        failure: actionTypes.CREATEMENTION_MAIN_FAILURE,
    },
    type: null,
});


export const getMentionwatsonx = (entity_value: string): IActionCall => ({
    callAPI: () => CommonService.main(getWatsonxMentions(entity_value)),
    types: {
        loading: actionTypes.MENTIONS,
        success: actionTypes.MENTIONS_SUCCESS,
        failure: actionTypes.MENTIONS_FAILURE,
    },
    type: null,
});

export const importItems = (requestBody: any): IActionCall => ({
    callAPI: () => WatsonService.watsonbulkload(requestBody),
    types: {
        loading: actionTypes.BULKLOAD,
        success: actionTypes.BULKLOAD_SUCCESS,
        failure: actionTypes.BULKLOAD_FAILURE,
    },
    type: null,
});


export const getConflictsWatson = (data: Dictionary): IActionCall => ({
    callAPI: () => CommonService.main(watsonxModelConflictSel(data)),
    types: {
        loading: actionTypes.CONFLICTS,
        success: actionTypes.CONFLICTS_SUCCESS,
        failure: actionTypes.CONFLICTS_FAILURE,
    },
    type: null,
});


export const resetConflictsWatson = (): IActionCall => ({ type: actionTypes.CONFLICTS_RESET });


export const conflictResolution = (requestBody: any): IActionCall => ({
    callAPI: () => WatsonService.watsonconflictresolve(requestBody),
    types: {
        loading: actionTypes.BULKLOAD,
        success: actionTypes.BULKLOAD_SUCCESS,
        failure: actionTypes.BULKLOAD_FAILURE,
    },
    type: null,
});

export const getExportItemsWatson = (requestBody: any): IActionCall => ({
    callAPI: () => CommonService.main(requestBody),
    types: {
        loading: actionTypes.EXPORTITEMS,
        success: actionTypes.EXPORTITEMS_SUCCESS,
        failure: actionTypes.EXPORTITEMS_FAILURE,
    },
    type: null,
});

export const watsonxSync = (watsonid: number): IActionCall => ({
    callAPI: () => WatsonService.watsonsync({watsonid}),
    types: {
        loading: actionTypes.SYNC,
        success: actionTypes.SYNC_SUCCESS,
        failure: actionTypes.SYNC_FAILURE,
    },
    type: null,
});