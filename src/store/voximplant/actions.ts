import { Dictionary, IActionCall } from "@types";
import { Call } from "voximplant-websdk/Call/Call";
import actionTypes from "./actionTypes";

export const voximplantConnect = (payload: Dictionary): IActionCall => ({ type: actionTypes.INIT_SDK, payload });

export const answerCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.ANSWER_CALL, payload });

export const rejectCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.REJECT_CALL, payload });

export const hangupCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.HANGUP_CALL, payload });

export const muteCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.MUTE_CALL, payload });

export const unmuteCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.UNMUTE_CALL, payload });

export const holdCall = (payload?:  Dictionary): IActionCall => ({ type: actionTypes.HOLD_CALL, payload });

export const makeCall = (payload?: string): IActionCall => ({ type: actionTypes.MAKE_CALL, payload });

export const setModalCall = (payload?: Boolean): IActionCall => ({ type: actionTypes.SET_MODAL_CALL, payload });

export const manageStatusVox = (payload: boolean): IActionCall => ({ type: actionTypes.MANAGE_STATUS_VOX, payload });