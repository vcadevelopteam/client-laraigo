import { IActionCall } from "@types";
import { CulqiService } from "network";
import actionTypes from "./actionTypes";

export const charge = (request: any): IActionCall => ({
    callAPI: () => CulqiService.charge(request),
    types: {
        loading: actionTypes.CHARGE,
        success: actionTypes.CHARGE_SUCCESS,
        failure: actionTypes.CHARGE_FAILURE,
    },
    type: null,
});

export const resetCharge = (): IActionCall => ({type: actionTypes.CHARGE_RESET});

export const subscribe = (request: any): IActionCall => ({
    callAPI: () => CulqiService.subscribe(request),
    types: {
        loading: actionTypes.SUBSCRIBE,
        success: actionTypes.SUBSCRIBE_SUCCESS,
        failure: actionTypes.SUBSCRIBE_FAILURE,
    },
    type: null,
});

export const resetSubscribe = (): IActionCall => ({type: actionTypes.SUBSCRIBE_RESET});

export const unsubscribe = (request: any): IActionCall => ({
    callAPI: () => CulqiService.unsubscribe(request),
    types: {
        loading: actionTypes.UNSUBSCRIBE,
        success: actionTypes.UNSUBSCRIBE_SUCCESS,
        failure: actionTypes.UNSUBSCRIBE_FAILURE,
    },
    type: null,
});

export const resetUnsubscribe = (): IActionCall => ({type: actionTypes.UNSUBSCRIBE_RESET});