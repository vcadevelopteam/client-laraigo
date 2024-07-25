import { Call } from "voximplant-websdk/Call/Call";
import { Dictionary, IActionCall, ICallGo, ITicket } from "@types";
import { CommonService, VoximplantService } from "network";

import actionTypes from "./actionTypes";
import { getConversationSelVoxi, getAdvisorListVoxi } from "common/helpers";

export const voximplantConnect = (payload: Dictionary): IActionCall => ({ type: actionTypes.INIT_SDK, payload });

export const answerCall = (payload?: { call: Call, number?: string, callComplete?: ICallGo, method?: string }): IActionCall => ({ type: actionTypes.ANSWER_CALL, payload });

export const rejectCall = (payload?: { call: Call, number?: string, ticketSelected?: ITicket | null }): IActionCall => ({ type: actionTypes.REJECT_CALL, payload });

export const hangupCall = (payload?: { call: Call, number?: string, ticketSelected?: ITicket | null }): IActionCall => ({ type: actionTypes.HANGUP_CALL, payload });

export const muteCall = (payload?: { call: Call, number?: string }): IActionCall => ({ type: actionTypes.MUTE_CALL, payload });

export const unmuteCall = (payload?: { call: Call, number?: string }): IActionCall => ({ type: actionTypes.UNMUTE_CALL, payload });

export const holdCall = (payload?: { call: Call, number?: string, flag: boolean }): IActionCall => ({ type: actionTypes.HOLD_CALL, payload });

export const resetCall = (payload: string): IActionCall => ({ type: actionTypes.RESET_CALL, payload });

export const setTransferAction = (payload?: boolean): IActionCall => ({ type: actionTypes.SET_TRANSFER_ACTION, payload });

export const transferCall = (payload: { url: string, number?: string, transfername: string, transfernumber: string, conversationid: number }): IActionCall => ({ type: actionTypes.TRANSFER_CALL, payload });

export const completeTransferCall = (payload?: { call?: Call | null, number?: string, conversationid: number }): IActionCall => ({ type: actionTypes.COMPLETE_TRANSFER_CALL, payload });

export const hangupTransferCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.HANGUP_TRANSFER_CALL, payload });

export const muteTransferCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.MUTE_TRANSFER_CALL, payload });

export const unmuteTransferCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.UNMUTE_TRANSFER_CALL, payload });

export const holdTransferCall = (payload?: { call?: Call | null, hold?: boolean }): IActionCall => ({ type: actionTypes.HOLD_TRANSFER_CALL, payload });

export const makeCall = (payload: { number: string, site: string }): IActionCall => ({ type: actionTypes.MAKE_CALL, payload });

export const setModalCall = (showModalCall?: boolean, transferAction?: boolean): IActionCall => ({ type: actionTypes.SET_MODAL_CALL, payload: { showModalCall, transferAction } });

export const setPhoneNumber = (payload?: string): IActionCall => ({ type: actionTypes.SET_PHONE_NUMBER, payload });

export const setHold = (payload: { hold: boolean, number?: string }): IActionCall => ({ type: actionTypes.SET_HOLD, payload });

export const setMute = (payload: { mute: boolean, number?: string }): IActionCall => ({ type: actionTypes.SET_MUTE, payload });

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

export const updateScenario = (request: any): IActionCall => ({
    callAPI: () => VoximplantService.updateScenario(request),
    types: {
        loading: actionTypes.UPDATE_SCENARIO,
        success: actionTypes.UPDATE_SCENARIO_SUCCESS,
        failure: actionTypes.UPDATE_SCENARIO_FAILURE,
    },
    type: null,
});

export const resetUpdateScenario = (): IActionCall => ({ type: actionTypes.UPDATE_SCENARIO_RESET });