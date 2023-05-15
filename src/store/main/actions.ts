import { IActionCall, IRequestBodyPaginated, IRequestBody, ITransaction, IRequestBodyDynamic, Dictionary } from "@types";
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
export const getCollectionPublic = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.mainPublic(requestBody),
    types: {
        loading: actionTypes.MAIN,
        success: actionTypes.MAIN_SUCCESS,
        failure: actionTypes.MAIN_FAILURE,
    },
    type: null,
});
export const getCollectionPaymentOrder = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.mainPaymentOrder(requestBody),
    types: {
        loading: actionTypes.MAIN,
        success: actionTypes.MAIN_SUCCESS,
        failure: actionTypes.MAIN_FAILURE,
    },
    type: null,
});

export const getMultiCollectionPublic = (requestBodies: string[]): IActionCall => ({
    callAPI: () => CommonService.multiMainPublic(requestBodies),
    types: {
        loading: actionTypes.MULTI_MAIN,
        success: actionTypes.MULTI_MAIN_SUCCESS,
        failure: actionTypes.MULTI_MAIN_FAILURE,
    },
    type: null,
});

export const resetMain = (): IActionCall => ({ type: actionTypes.MAIN_RESET });

export const triggerRequest = (dictionary: Dictionary): IActionCall => ({
    callAPI: () => CommonService.testRequest(dictionary),
    types: {
        loading: actionTypes.TEST_REQUEST,
        success: actionTypes.TEST_REQUEST_SUCCESS,
        failure: actionTypes.TEST_REQUEST_FAILURE,
    },
    type: null,
});

export const resettriggerRequest = (): IActionCall => ({ type: actionTypes.TEST_REQUEST_RESET });

export const getCollectionDynamic = (requestBody: IRequestBodyDynamic): IActionCall => ({
    callAPI: () => CommonService.mainDynamic(requestBody),
    types: {
        loading: actionTypes.DATA_DYNAMIC,
        success: actionTypes.DATA_DYNAMIC_SUCCESS,
        failure: actionTypes.DATA_DYNAMIC_FAILURE,
    },
    type: null,
});

export const resetMainDynamic = (): IActionCall => ({ type: actionTypes.DATA_DYNAMIC_RESET });


export const exportDynamic = (requestBody: IRequestBodyDynamic, reportName: string = "", formatToExport: "excel" | "csv" = "excel", headerClient: Dictionary[] | null = null): IActionCall => ({
    callAPI: () => CommonService.mainDynamicExport({
        ...requestBody,
        parameters: {
            ...requestBody.parameters,
            formatToExport,
            reportName,
            headerClient
        }
    }),
    types: {
        loading: actionTypes.DATA_EXPORT_DYNAMIC,
        success: actionTypes.DATA_EXPORT_DYNAMIC_SUCCESS,
        failure: actionTypes.DATA_EXPORT_DYNAMIC_FAILURE,
    },
    type: null,
});

export const resetExportMainDynamic = (): IActionCall => ({ type: actionTypes.DATA_EXPORT_DYNAMIC_RESET });




export const uploadFile = (data: FormData): IActionCall => ({
    callAPI: () => CommonService.uploadFile(data),
    types: {
        loading: actionTypes.UPLOAD_FILE,
        success: actionTypes.UPLOAD_FILE_SUCCESS,
        failure: actionTypes.UPLOAD_FILE_FAILURE,
    },
    type: null,
});

export const resetUploadFile = (): IActionCall => ({ type: actionTypes.UPLOAD_FILE_RESET });

export const uploadFileMetadata = (data: FormData): IActionCall => ({
    callAPI: () => CommonService.uploadFileMetadata(data),
    types: {
        loading: actionTypes.UPLOAD_FILE,
        success: actionTypes.UPLOAD_FILE_SUCCESS,
        failure: actionTypes.UPLOAD_FILE_FAILURE,
    },
    type: null,
});

export const resetUploadFileMetadata = (): IActionCall => ({ type: actionTypes.UPLOAD_FILE_RESET });


export const exportData = (requestBody: IRequestBody, reportName: string = "", formatToExport: "excel" | "csv" = "excel", isNotPaginated: boolean = false, headerClient: Dictionary[] | null = null): IActionCall => ({
    callAPI: () => CommonService.exportData({
        ...requestBody,
        parameters: {
            ...requestBody.parameters,
            formatToExport,
            isNotPaginated,
            reportName,
            headerClient
        }
    }),
    types: {
        loading: actionTypes.EXPORT_DATA,
        success: actionTypes.EXPORT_DATA_SUCCESS,
        failure: actionTypes.EXPORT_DATA_FAILURE,
    },
    type: null,
});

export const resetexportData = (): IActionCall => ({ type: actionTypes.EXPORT_DATA_RESET });


export const getCollectionAux = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(requestBody),
    types: {
        loading: actionTypes.AUX_MAIN,
        success: actionTypes.AUX_MAIN_SUCCESS,
        failure: actionTypes.AUX_MAIN_FAILURE,
    },
    type: null,
});

export const resetMainAux = (): IActionCall => ({ type: actionTypes.AUX_MAIN_RESET });

export const getCollectionAux2 = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(requestBody),
    types: {
        loading: actionTypes.AUX2_MAIN,
        success: actionTypes.AUX2_MAIN_SUCCESS,
        failure: actionTypes.AUX2_MAIN_FAILURE,
    },
    type: null,
});

export const resetMainAux2 = (): IActionCall => ({ type: actionTypes.AUX2_MAIN_RESET });

/**Action type = EXECUTE_MAIN */
export const execute = (requestBody: IRequestBody | ITransaction, transaction: boolean = false): IActionCall => ({
    callAPI: () => CommonService.main(requestBody, transaction),
    types: {
        loading: actionTypes.EXECUTE_MAIN,
        success: actionTypes.EXECUTE_MAIN_SUCCESS,
        failure: actionTypes.EXECUTE_MAIN_FAILURE,
    },
    type: null,
});

type Url = string;
/**Action type = EXECUTE_MAIN */
export const executeWithFiles = (
    build: (uploader: (file: File) => Promise<Url>) => Promise<IRequestBody | ITransaction>,
    transaction: boolean = false,
): IActionCall => {
    const uploadCb = async (mediaFile: File): Promise<Url> => {
        const fd = new FormData();
        fd.append('file', mediaFile, mediaFile.name);
        const uploadResult = await CommonService.uploadFile(fd);
        return (uploadResult.data["url"] || '') as Url;
    };

    return {
        callAPI: async () => {
            const requestBody = await build(uploadCb);
            return CommonService.main(requestBody, transaction);
        },
        types: {
            loading: actionTypes.EXECUTE_MAIN,
            success: actionTypes.EXECUTE_MAIN_SUCCESS,
            failure: actionTypes.EXECUTE_MAIN_FAILURE,
        },
        type: null,
    };
}

/**Action type = EXECUTE_MAIN */
export const resetExecute = (): IActionCall => ({ type: actionTypes.EXECUTE_MAIN_RESET });

export const getMultiCollection = (requestBodies: IRequestBody[]): IActionCall => ({
    callAPI: () => CommonService.multiMain(requestBodies),
    types: {
        loading: actionTypes.MULTI_MAIN,
        success: actionTypes.MULTI_MAIN_SUCCESS,
        failure: actionTypes.MULTI_MAIN_FAILURE,
    },
    type: null,
});

export const resetMultiMain = (): IActionCall => ({ type: actionTypes.MULTI_MAIN_RESET });

export const getMultiCollectionAux = (requestBodies: IRequestBody[]): IActionCall => ({
    callAPI: () => CommonService.multiMain(requestBodies),
    types: {
        loading: actionTypes.AUX_MULTI_MAIN,
        success: actionTypes.AUX_MULTI_MAIN_SUCCESS,
        failure: actionTypes.AUX_MULTI_MAIN_FAILURE,
    },
    type: null,
});

export const resetMultiMainAux = (): IActionCall => ({ type: actionTypes.AUX_MULTI_MAIN_RESET });

export const getMultiCollectionAux2 = (requestBodies: IRequestBody[]): IActionCall => ({
    callAPI: () => CommonService.multiMain(requestBodies),
    types: {
        loading: actionTypes.AUX2_MULTI_MAIN,
        success: actionTypes.AUX2_MULTI_MAIN_SUCCESS,
        failure: actionTypes.AUX2_MULTI_MAIN_FAILURE,
    },
    type: null,
});

export const resetMultiMainAux2 = (): IActionCall => ({ type: actionTypes.AUX2_MULTI_MAIN_RESET });

export const getCollectionPaginated = (requestBody: IRequestBodyPaginated): IActionCall => ({
    callAPI: () => CommonService.mainPaginated(requestBody),
    types: {
        loading: actionTypes.PAGINATED_MAIN,
        success: actionTypes.PAGINATED_MAIN_SUCCESS,
        failure: actionTypes.PAGINATED_MAIN_FAILURE,
    },
    type: null,
});

export const resetCollectionPaginated = (): IActionCall => ({ type: actionTypes.PAGINATED_MAIN_RESET });

// export const resetAllMain = (): IActionCall => ({ type: actionTypes.RESET_ALL });

export const setMemoryTable = (payload: any): IActionCall => ({ type: actionTypes.SET_MEMORY_TABLE, payload });

export const cleanMemoryTable = (): IActionCall => ({ type: actionTypes.CLEAN_MEMORY_TABLE });

export const setViewChange = (payload: any): IActionCall => ({ type: actionTypes.VIEWCHANGE, payload });

export const cleanViewChange = (): IActionCall => ({ type: actionTypes.CLEAN_VIEWCHANGE });

export const getCollectionPaginatedAux = (requestBody: IRequestBodyPaginated): IActionCall => ({
    callAPI: () => CommonService.mainPaginated(requestBody),
    types: {
        loading: actionTypes.AUX_PAGINATED_MAIN,
        success: actionTypes.AUX_PAGINATED_MAIN_SUCCESS,
        failure: actionTypes.AUX_PAGINATED_MAIN_FAILURE,
    },
    type: null,
});

export const resetCollectionPaginatedAux = (): IActionCall => ({ type: actionTypes.AUX_PAGINATED_MAIN_RESET });

export const getMainGraphic = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.mainGraphic(requestBody),
    types: {
        loading: actionTypes.GRAPHIC_MAIN,
        success: actionTypes.GRAPHIC_MAIN_SUCCESS,
        failure: actionTypes.GRAPHIC_MAIN_FAILURE,
    },
    type: null,
});

export const resetMainGraphic = (): IActionCall => ({ type: actionTypes.GRAPHIC_MAIN_RESET });

export const resetAllMain = (): IActionCall => ({ type: actionTypes.RESET_ALL });


export const getCollEventBooking = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.mainEventBooking(requestBody),
    types: {
        loading: actionTypes.MAIN_EVENT_BOOKING,
        success: actionTypes.MAIN_EVENT_BOOKING_SUCCESS,
        failure: actionTypes.MAIN_EVENT_BOOKING_FAILURE,
    },
    type: null,
});
export const getCancelEventBooking = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.mainEventCancelBooking(requestBody),
    types: {
        loading: actionTypes.MAIN_EVENT_BOOKING,
        success: actionTypes.MAIN_EVENT_BOOKING_SUCCESS,
        failure: actionTypes.MAIN_EVENT_BOOKING_FAILURE,
    },
    type: null,
});