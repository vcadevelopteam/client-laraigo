import { IActionCall } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const getTickets = (page = 1, pageSize = 10): IActionCall => ({
    callAPI: () => CommonService.getTickets(page, pageSize),
    types: {
        loading: actionTypes.GET_TICKETS,
        success: actionTypes.GET_TICKETS_SUCCESS,
        failure: actionTypes.GET_TICKETS_FAILURE,
    },
    type: null,
});

export const resetGetTickets = (): IActionCall => ({type: actionTypes.GET_TICKETS_RESET});
