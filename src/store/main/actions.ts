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
export const getCollectionPublic = (requestBody: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.mainPublic(requestBody),
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


export const exportDynamic = (requestBody: IRequestBodyDynamic, reportName: string = "", formatToExport: "excel" | "csv" = "excel"): IActionCall => ({
    callAPI: () => CommonService.mainDynamicExport({
        ...requestBody,
        parameters: {
            ...requestBody.parameters,
            formatToExport,
            reportName
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


export const exportData = (requestBody: IRequestBody, reportName: string = "", formatToExport: "excel" | "csv" = "excel", isNotPaginated: boolean = false): IActionCall => ({
    callAPI: () => CommonService.exportData({
        ...requestBody,
        parameters: {
            ...requestBody.parameters,
            formatToExport,
            isNotPaginated,
            reportName
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

export const resetAllMain = (): IActionCall => ({ type: actionTypes.RESET_ALL });