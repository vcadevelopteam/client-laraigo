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

export const entityins = (requestBodies: any): IActionCall => ({
    callAPI: () => WitaiService.witaientityins(requestBodies),
    types: {
        loading: actionTypes.OPERATIONPOST_SEND,
        success: actionTypes.OPERATIONPOST_SUCCESS,
        failure: actionTypes.OPERATIONPOST_FAILURE,
    },
    type: null,
});

export const intentutteranceins = (requestBodies: any): IActionCall => ({
    callAPI: () => WitaiService.witaiintentutteranceins(requestBodies),
    types: {
        loading: actionTypes.OPERATIONPOST_SEND,
        success: actionTypes.OPERATIONPOST_SUCCESS,
        failure: actionTypes.OPERATIONPOST_FAILURE,
    },
    type: null,
});

export const entitydel = (requestBodies: any): IActionCall => ({
    callAPI: () => WitaiService.witaientitydel(requestBodies),
    types: {
        loading: actionTypes.OPERATIONPOST_SEND,
        success: actionTypes.OPERATIONPOST_SUCCESS,
        failure: actionTypes.OPERATIONPOST_FAILURE,
    },
    type: null,
});

export const intentdel = (requestBodies: any): IActionCall => ({
    callAPI: () => WitaiService.witaiintentdel(requestBodies),
    types: {
        loading: actionTypes.OPERATIONPOST_SEND,
        success: actionTypes.OPERATIONPOST_SUCCESS,
        failure: actionTypes.OPERATIONPOST_FAILURE,
    },
    type: null,
});

export const entityimport = (requestBodies: any): IActionCall => ({
    callAPI: () => WitaiService.witaientityimport(requestBodies),
    types: {
        loading: actionTypes.OPERATIONPOST_SEND,
        success: actionTypes.OPERATIONPOST_SUCCESS,
        failure: actionTypes.OPERATIONPOST_FAILURE,
    },
    type: null,
});
export const intentimport = (requestBodies: any): IActionCall => ({
    callAPI: () => WitaiService.witaiintentimport(requestBodies),
    types: {
        loading: actionTypes.OPERATIONPOST_SEND,
        success: actionTypes.OPERATIONPOST_SUCCESS,
        failure: actionTypes.OPERATIONPOST_FAILURE,
    },
    type: null,
});

export const resetOperationResult = (): IActionCall => ({type: actionTypes.RESETOPERATIONRESULT});
