import { IActionCall, IRequestBody } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const getLead = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.GET_LEAD,
        success: actionTypes.GET_LEAD_SUCCESS,
        failure: actionTypes.GET_LEAD_FAILURE,
    },
    type: null,
});

export const resetGetLead = (): IActionCall => ({type: actionTypes.GET_LEAD_RESET});

export const saveLead = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.SAVE_LEAD,
        success: actionTypes.SAVE_LEAD_SUCCESS,
        failure: actionTypes.SAVE_LEAD_FAILURE,
    },
    type: null,
});

export const resetSaveLead = (): IActionCall => ({type: actionTypes.SAVE_LEAD_RESET});

export const getLeadTags = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.GET_TAGS,
        success: actionTypes.GET_TAGS_SUCCESS,
        failure: actionTypes.GET_TAGS_FAILURE,
    },
    type: null,
});

export const resetGetLeadTags = (): IActionCall => ({type: actionTypes.GET_TAGS_RESET});

export const getAdvisers = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.GET_ADVISERS,
        success: actionTypes.GET_ADVISERS_SUCCESS,
        failure: actionTypes.GET_ADVISERS_FAILURE,
    },
    type: null,
});

export const resetGetAdvisers = (): IActionCall => ({type: actionTypes.GET_ADVISERS_RESET});
