import { IActionCall, IRequestBodyPaginated, IRequestBody, ITransaction } from "@types";
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
