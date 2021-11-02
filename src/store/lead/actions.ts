import { IActionCall, ICrmLeadNoteSave, IRequestBody } from "@types";
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

export const getLeadLogNotes = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.GET_LEADNOTES,
        success: actionTypes.GET_LEADNOTES_SUCCESS,
        failure: actionTypes.GET_LEADNOTES_FAILURE,
    },
    type: null,
});

export const resetGetLeadLogNotes = (): IActionCall => ({type: actionTypes.GET_LEADNOTES_RESET});

export const getLeadActivities = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.GET_LEADACTIVITIES,
        success: actionTypes.GET_LEADACTIVITIES_SUCCESS,
        failure: actionTypes.GET_LEADACTIVITIES_FAILURE,
    },
    type: null,
});

export const resetGetLeadActivities = (): IActionCall => ({type: actionTypes.GET_LEADACTIVITIES_RESET});

export const saveLeadActivity = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.SAVE_LEADACTIVITY,
        success: actionTypes.SAVE_LEADACTIVITY_SUCCESS,
        failure: actionTypes.SAVE_LEADACTIVITY_FAILURE,
    },
    type: null,
});

export const resetSaveLeadActivity = (): IActionCall => ({type: actionTypes.SAVE_LEADACTIVITY_RESET});

export const saveLeadLogNote = (body: IRequestBody): IActionCall => ({
    callAPI: async () => {
        const mediaFile: File = (body.parameters as ICrmLeadNoteSave).media as File;
        const fd = new FormData();
        fd.append('file', mediaFile, mediaFile.name);
        const url = (await CommonService.uploadFile(fd)).data["url"] as string;
        (body.parameters as ICrmLeadNoteSave).media = url;
        return CommonService.main(body);
    },
    types: {
        loading: actionTypes.SAVE_LEADNOIE,
        success: actionTypes.SAVE_LEADNOIE_SUCCESS,
        failure: actionTypes.SAVE_LEADNOIE_FAILURE,
    },
    type: null,
});

export const resetSaveLeadLogNote = (): IActionCall => ({type: actionTypes.SAVE_LEADNOIE_RESET});
