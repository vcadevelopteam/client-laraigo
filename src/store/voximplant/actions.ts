import { Call } from "voximplant-websdk/Call/Call";
import { Dictionary, IActionCall, ITicket } from "@types";
import { CommonService, VoximplantService } from "network";

import actionTypes from "./actionTypes";
import { getConversationSelVoxi, getAdvisorListVoxi } from "common/helpers";

export const voximplantConnect = (payload: Dictionary): IActionCall => ({ type: actionTypes.INIT_SDK, payload });

export const answerCall = (payload?: { call: Call, conversationid: number } | null): IActionCall => ({ type: actionTypes.ANSWER_CALL, payload });

export const rejectCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.REJECT_CALL, payload });

export const hangupCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.HANGUP_CALL, payload });

export const muteCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.MUTE_CALL, payload });

export const unmuteCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.UNMUTE_CALL, payload });

export const holdCall = (payload?: Dictionary): IActionCall => ({ type: actionTypes.HOLD_CALL, payload });

export const makeCall = (payload: { number: string, site: string, data: ITicket }): IActionCall => ({ type: actionTypes.MAKE_CALL, payload });

export const setModalCall = (payload?: Boolean): IActionCall => ({ type: actionTypes.SET_MODAL_CALL, payload });

export const manageStatusVox = (payload: boolean): IActionCall => ({ type: actionTypes.MANAGE_STATUS_VOX, payload });

export const disconnectVoxi = (): IActionCall => ({ type: actionTypes.DISCONNECT });

export const getCategories = (request: any): IActionCall => ({
    callAPI: () => VoximplantService.getCategories(request),
    types: {
        loading: actionTypes.GET_CATEGORIES,
        success: actionTypes.GET_CATEGORIES_SUCCESS,
        failure: actionTypes.GET_CATEGORIES_FAILURE,
    },
    type: null,
});

export const resetGetCategories = (): IActionCall => ({ type: actionTypes.GET_CATEGORIES_RESET });

export const getCountryStates = (request: any): IActionCall => ({
    callAPI: () => VoximplantService.getCountryStates(request),
    types: {
        loading: actionTypes.GET_COUNTRYSTATES,
        success: actionTypes.GET_COUNTRYSTATES_SUCCESS,
        failure: actionTypes.GET_COUNTRYSTATES_FAILURE,
    },
    type: null,
});

export const resetGetCountryStates = (): IActionCall => ({ type: actionTypes.GET_COUNTRYSTATES_RESET });

export const getRegions = (request: any): IActionCall => ({
    callAPI: () => VoximplantService.getRegions(request),
    types: {
        loading: actionTypes.GET_REGIONS,
        success: actionTypes.GET_REGIONS_SUCCESS,
        failure: actionTypes.GET_REGIONS_FAILURE,
    },
    type: null,
});

export const getHistory = (): IActionCall => ({
    callAPI: () => CommonService.main(getConversationSelVoxi()),
    types: {
        loading: actionTypes.GET_HISTORY,
        success: actionTypes.GET_HISTORY_SUCCESS,
        failure: actionTypes.GET_HISTORY_FAILURE,
    },
    type: null,
});

export const geAdvisors = (): IActionCall => ({
    callAPI: () => CommonService.main(getAdvisorListVoxi()),
    types: {
        loading: actionTypes.GET_ADVISORS,
        success: actionTypes.GET_ADVISORS_SUCCESS,
        failure: actionTypes.GET_ADVISORS_FAILURE,
    },
    type: null,
});

export const resetGetRegions = (): IActionCall => ({ type: actionTypes.GET_REGIONS_RESET });

export const getMaximumConsumption = (request: any): IActionCall => ({
    callAPI: () => VoximplantService.getMaximumConsumption(request),
    types: {
        loading: actionTypes.GET_MAXIMUMCONSUMPTION,
        success: actionTypes.GET_MAXIMUMCONSUMPTION_SUCCESS,
        failure: actionTypes.GET_MAXIMUMCONSUMPTION_FAILURE,
    },
    type: null,
});

export const resetGetMaximumConsumption = (): IActionCall => ({ type: actionTypes.GET_MAXIMUMCONSUMPTION_RESET });

export const transferAccountBalance = (request: any): IActionCall => ({
    callAPI: () => VoximplantService.transferAccountBalance(request),
    types: {
        loading: actionTypes.TRANSFER_ACCOUNTBALANCE,
        success: actionTypes.TRANSFER_ACCOUNTBALANCE_SUCCESS,
        failure: actionTypes.TRANSFER_ACCOUNTBALANCE_FAILURE,
    },
    type: null,
});

export const resetTransferAccountBalance = (): IActionCall => ({ type: actionTypes.TRANSFER_ACCOUNTBALANCE_RESET });

export const getAccountBalance = (request: any): IActionCall => ({
    callAPI: () => VoximplantService.getAccountBalance(request),
    types: {
        loading: actionTypes.GET_ACCOUNTBALANCE,
        success: actionTypes.GET_ACCOUNTBALANCE_SUCCESS,
        failure: actionTypes.GET_ACCOUNTBALANCE_FAILURE,
    },
    type: null,
});

export const resetGetAccountBalance = (): IActionCall => ({ type: actionTypes.GET_ACCOUNTBALANCE_RESET });

export const getCallRecord = (request: any): IActionCall => ({
    callAPI: () => VoximplantService.getCallRecord(request),
    types: {
        loading: actionTypes.GET_CALLRECORD,
        success: actionTypes.GET_CALLRECORD_SUCCESS,
        failure: actionTypes.GET_CALLRECORD_FAILURE,
    },
    type: null,
});

export const resetGetCallRecord = (): IActionCall => ({ type: actionTypes.GET_CALLRECORD_RESET });