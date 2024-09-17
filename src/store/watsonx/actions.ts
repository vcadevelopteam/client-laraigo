import { IActionCall, IRequestBodyPaginated, IRequestBody, ITransaction, IRequestBodyDynamic, Dictionary } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";
import { watsonxModelItemSel } from "common/helpers";



export const getItemsWatson = (id: number): IActionCall => ({
    callAPI: () => CommonService.main(watsonxModelItemSel(id)),
    types: {
        loading: actionTypes.ITEMS,
        success: actionTypes.ITEMS_SUCCESS,
        failure: actionTypes.ITEMS_FAILURE,
    },
    type: null,
});

export const setWatsonRow = (payload: { row: any }): IActionCall => ({ type: actionTypes.SETROW, payload });
