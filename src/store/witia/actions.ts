import { IActionCall } from "@types";
import { WitaiService } from "network";
import actionTypes from "./actionTypes";


export const testwitai = (requestBody: any): any => ({
    callAPI: () => WitaiService.witaitest(requestBody),
    types: {
        loading: actionTypes.TESTMESSAGE_SEND,
        success: actionTypes.TESTMESSAGE_SUCCESS,
        failure: actionTypes.TESTMESSAGE_FAILURE,
    },
    type: null,
});

export const resetWitaiTest = (): IActionCall => ({type: actionTypes.TESTMESSAGE_RESET});

export const trainwitai = (): any => ({
    callAPI: () => WitaiService.witaitrain(),
    types: {
        loading: actionTypes.TRAINMODEL_SEND,
        success: actionTypes.TRAINMODEL_SUCCESS,
        failure: actionTypes.TRAINMODEL_FAILURE,
    },
    type: null,
});

export const resetWitaiTrain = (): IActionCall => ({type: actionTypes.TRAINMODEL_RESET});
