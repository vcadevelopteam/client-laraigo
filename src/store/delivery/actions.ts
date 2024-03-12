import { IActionCall } from "@types";
import { DeliveryService } from "network";
import actionTypes from "./actionTypes";

export const deliveryRouting = (requestBody: any): IActionCall => ({
    callAPI: () => DeliveryService.deliveryRouting(requestBody),
    types: {
        loading: actionTypes.DELIVERYROUTING,
        success: actionTypes.DELIVERYROUTING_SUCCESS,
        failure: actionTypes.DELIVERYROUTING_FAILURE,
    },
    type: null,
});

export const resetDeliveryRouting = (): IActionCall => ({type: actionTypes.DELIVERYROUTING_RESET});