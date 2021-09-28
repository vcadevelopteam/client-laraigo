import { IActionCall, IRequestBodyPaginated, IRequestBody, ITransaction, IRequestBodyDynamic } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const getCollection = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(requestBody),
    types: {
        loading: actionTypes.MAIN,
        success: actionTypes.MAIN_SUCCESS,
        failure: actionTypes.MAIN_FAILURE,
    },
    type: null,
});

export const resetMain = (): IActionCall => ({type: actionTypes.MAIN_RESET});

export const getCollectionDynamic = (requestBody: IRequestBodyDynamic): IActionCall => ({
    callAPI: () => CommonService.mainDynamic(requestBody),
    types: {
        loading: actionTypes.DATA_DYNAMIC,
        success: actionTypes.DATA_DYNAMIC_SUCCESS,
        failure: actionTypes.DATA_DYNAMIC_FAILURE,
    },
    type: null,
});

export const resetMainDynamic = (): IActionCall => ({type: actionTypes.DATA_DYNAMIC_RESET});


export const exportDynamic = (requestBody: IRequestBodyDynamic): IActionCall => ({
    callAPI: () => CommonService.mainDynamicExport(requestBody),
    types: {
        loading: actionTypes.DATA_EXPORT_DYNAMIC,
        success: actionTypes.DATA_EXPORT_DYNAMIC_SUCCESS,
        failure: actionTypes.DATA_EXPORT_DYNAMIC_FAILURE,
    },
    type: null,
});

export const resetExportMainDynamic = (): IActionCall => ({type: actionTypes.DATA_EXPORT_DYNAMIC_RESET});




export const uploadFile = (data: FormData): IActionCall => ({
    callAPI: () => CommonService.uploadFile(data),
    types: {
        loading: actionTypes.UPLOAD_FILE,
        success: actionTypes.UPLOAD_FILE_SUCCESS,
        failure: actionTypes.UPLOAD_FILE_FAILURE,
    },
    type: null,
});

export const resetUploadFile = (): IActionCall => ({type: actionTypes.UPLOAD_FILE_RESET});


export const exportData = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.exportData(requestBody),
    types: {
        loading: actionTypes.EXPORT_DATA,
        success: actionTypes.EXPORT_DATA_SUCCESS,
        failure: actionTypes.EXPORT_DATA_FAILURE,
    },
    type: null,
});

export const resetexportData = (): IActionCall => ({type: actionTypes.EXPORT_DATA_RESET});


export const getCollectionAux = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(requestBody),
    types: {
        loading: actionTypes.AUX_MAIN,
        success: actionTypes.AUX_MAIN_SUCCESS,
        failure: actionTypes.AUX_MAIN_FAILURE,
    },
    type: null,
});

export const resetMainAux = (): IActionCall => ({type: actionTypes.AUX_MAIN_RESET});

export const execute = (requestBody: IRequestBody | ITransaction, transaction: boolean = false): IActionCall => ({
    callAPI: () => CommonService.main(requestBody, transaction),
    types: {
        loading: actionTypes.EXECUTE_MAIN,
        success: actionTypes.EXECUTE_MAIN_SUCCESS,
        failure: actionTypes.EXECUTE_MAIN_FAILURE,
    },
    type: null,
});

export const resetExecute = (): IActionCall => ({type: actionTypes.EXECUTE_MAIN_RESET});

export const getMultiCollection = (requestBodies: IRequestBody[]): IActionCall => ({
    callAPI: () => CommonService.multiMain(requestBodies),
    types: {
        loading: actionTypes.MULTI_MAIN,
        success: actionTypes.MULTI_MAIN_SUCCESS,
        failure: actionTypes.MULTI_MAIN_FAILURE,
    },
    type: null,
});

export const resetMultiMain = (): IActionCall => ({type: actionTypes.MULTI_MAIN_RESET});

export const getMultiCollectionAux = (requestBodies: IRequestBody[]): IActionCall => ({
    callAPI: () => CommonService.multiMain(requestBodies),
    types: {
        loading: actionTypes.AUX_MULTI_MAIN,
        success: actionTypes.AUX_MULTI_MAIN_SUCCESS,
        failure: actionTypes.AUX_MULTI_MAIN_FAILURE,
    },
    type: null,
});

export const resetMultiMainAux = (): IActionCall => ({type: actionTypes.AUX_MULTI_MAIN_RESET});

export const getCollectionPaginated = (requestBody: IRequestBodyPaginated): IActionCall => ({
    callAPI: () => CommonService.mainPaginated(requestBody),
    types: {
        loading: actionTypes.PAGINATED_MAIN,
        success: actionTypes.PAGINATED_MAIN_SUCCESS,
        failure: actionTypes.PAGINATED_MAIN_FAILURE,
    },
    type: null,
});

export const resetCollectionPaginated = (): IActionCall => ({type: actionTypes.PAGINATED_MAIN_RESET});
