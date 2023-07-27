import { IActionCall } from "@types";
import { RasaService } from "network";
import actionTypes from "./actionTypes";


export const trainrasaia = (request:any): any => ({
    callAPI: () => RasaService.rasatrain(request),
    types: {
        loading: actionTypes.TRAINMODEL_SEND,
        success: actionTypes.TRAINMODEL_SUCCESS,
        failure: actionTypes.TRAINMODEL_FAILURE,
    },
    type: null,
});

export const resetRasaiaTrain = (): IActionCall => ({type: actionTypes.TRAINMODEL_RESET});


export const downloadrasaia = (request:any): any => ({
    callAPI: () => RasaService.rasadownload(request),
    types: {
        loading: actionTypes.DOWNLOADMODEL_SEND,
        success: actionTypes.DOWNLOADMODEL_SUCCESS,
        failure: actionTypes.DOWNLOADMODEL_FAILURE,
    },
    type: null,
});

export const resetRasaiaDownload = (): IActionCall => ({type: actionTypes.DOWNLOADMODEL_RESET});

export const uploadrasaia = (request:any): any => ({
    callAPI: () => RasaService.rasaupload(request),
    types: {
        loading: actionTypes.UPLOADMODEL_SEND,
        success: actionTypes.UPLOADMODEL_SUCCESS,
        failure: actionTypes.UPLOADMODEL_FAILURE,
    },
    type: null,
});

export const resetRasaiaUpload = (): IActionCall => ({type: actionTypes.UPLOADMODEL_RESET});

export const modellistrasaia = (request:any): any => ({
    callAPI: () => RasaService.rasamodellist(request),
    types: {
        loading: actionTypes.MODELLIST_SEND,
        success: actionTypes.MODELLIST_SUCCESS,
        failure: actionTypes.MODELLIST_FAILURE,
    },
    type: null,
});

export const resetRasaiaModelList = (): IActionCall => ({type: actionTypes.MODELLIST_RESET});

export const downloadmodelrasaia = (request:any): any => ({
    callAPI: () => RasaService.rasamodedownload(request),
    types: {
        loading: actionTypes.MODELDOWNLOAD_SEND,
        success: actionTypes.MODELDOWNLOAD_SUCCESS,
        failure: actionTypes.MODELDOWNLOAD_FAILURE,
    },
    type: null,
});

export const resetdownloadmodelrasaia = (): IActionCall => ({type: actionTypes.MODELDOWNLOAD_RESET});