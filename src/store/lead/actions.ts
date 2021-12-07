import { IActionCall, ICrmLeadNoteSave, IRequestBody, ITransaction } from "@types";
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

export const saveLead = (body: IRequestBody | ITransaction, transaction: boolean = false): IActionCall => ({
    callAPI: () => CommonService.main(body, transaction),
    types: {
        loading: actionTypes.SAVE_LEAD,
        success: actionTypes.SAVE_LEAD_SUCCESS,
        failure: actionTypes.SAVE_LEAD_FAILURE,
    },
    type: null,
});

type Url = string;
export const saveLeadWithFiles = (
    build: (uploader: (file: File) => Promise<Url>) => Promise<IRequestBody | ITransaction>,
    transaction: boolean = false,
): IActionCall => {
    const uploadCb = async (mediaFile: File): Promise<Url> => {
        const fd = new FormData();
        fd.append('file', mediaFile, mediaFile.name);
        const uploadResult = await CommonService.uploadFile(fd);
        return (uploadResult.data["url"] || '') as Url;
    };

    return {
        callAPI: async () => {
            const requestBody = await build(uploadCb);
            return CommonService.main(requestBody, transaction);
        },
        types: {
            loading: actionTypes.SAVE_LEAD,
            success: actionTypes.SAVE_LEAD_SUCCESS,
            failure: actionTypes.SAVE_LEAD_FAILURE,
        },
        type: null,
    };
}

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
        const mediaFile = (body.parameters as ICrmLeadNoteSave).media as File | null;
        if (mediaFile) {
            const fd = new FormData();
            fd.append('file', mediaFile, mediaFile.name);
            const uploadResult = await CommonService.uploadFile(fd);
            const url = uploadResult.data["url"] as string;
            (body.parameters as ICrmLeadNoteSave).media = url;
        }
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

export const getLeadPhases = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.GET_PHASES,
        success: actionTypes.GET_PHASES_SUCCESS,
        failure: actionTypes.GET_PHASES_FAILURE,
    },
    type: null,
});

export const resetGetLeadPhases = (): IActionCall => ({type: actionTypes.GET_PHASES_RESET});

export const setDisplay = (display: string): IActionCall => ({
    payload: display,
    type: actionTypes.DISPLAY_LEAD,
});

export const resetDisplay = (): IActionCall => ({type: actionTypes.DISPLAY_LEAD_RESET});

/**Close lead -> (status = "CERRADO") */
export const archiveLead = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.ARCHIVE_LEAD,
        success: actionTypes.ARCHIVE_LEAD_SUCCESS,
        failure: actionTypes.ARCHIVE_LEAD_FAILURE,
    },
    type: null,
});

export const resetArchiveLead = (): IActionCall => ({type: actionTypes.ARCHIVE_LEAD_RESET});

/**Done lead -> (status = "REALIZADO") */
export const markDoneActivity = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.MARK_DONE_ACTIVITY,
        success: actionTypes.MARK_DONE_ACTIVITY_SUCCESS,
        failure: actionTypes.MARK_DONE_ACTIVITY_FAILURE,
    },
    type: null,
});

export const resetMarkDoneActivity = (): IActionCall => ({type: actionTypes.MARK_DONE_ACTIVITY_RESET});

export const getLeadHistory = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.GET_LEAD_HISTORY,
        success: actionTypes.GET_LEAD_HISTORY_SUCCESS,
        failure: actionTypes.GET_LEAD_HISTORY_FAILURE,
    },
    type: null,
});

export const resetGetLeadHistory = (): IActionCall => ({type: actionTypes.GET_LEAD_HISTORY_RESET});

export const updateLeadTags = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.UPDATE_LEAD_TAGS,
        success: actionTypes.UPDATE_LEAD_TAGS_SUCCESS,
        failure: actionTypes.UPDATE_LEAD_TAGS_FAILURE,
    },
    type: null,
});

export const resetUpdateLeadTags = (): IActionCall => ({type: actionTypes.UPDATE_LEAD_TAGS_RESET});
