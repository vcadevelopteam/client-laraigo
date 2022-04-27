import { Dictionary, IActionCall } from "@types";
import { Call } from "voximplant-websdk/Call/Call";
import actionTypes from "./actionTypes";

export const voximplantConnect = (payload: Dictionary): IActionCall => ({ type: actionTypes.INIT_SDK, payload });

export const answerCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.ANSWER_CALL, payload });

export const rejectCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.REJECT_CALL, payload });

export const hangupCall = (payload?: Call | null): IActionCall => ({ type: actionTypes.HANGUP_CALL, payload });

export const manageStatusVox = (payload: boolean): IActionCall => ({ type: actionTypes.MANAGE_STATUS_VOX, payload });