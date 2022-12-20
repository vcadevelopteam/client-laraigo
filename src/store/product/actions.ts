import { IActionCall } from "@types";
import { ProductService } from "network";

import actionTypes from "./actionTypes";

export const importXml = (request: any): IActionCall => ({
    callAPI: () => ProductService.importXml(request),
    types: {
        loading: actionTypes.IMPORT_XML,
        success: actionTypes.IMPORT_XML_SUCCESS,
        failure: actionTypes.IMPORT_XML_FAILURE,
    },
    type: null,
});

export const resetImportXml = (): IActionCall => ({ type: actionTypes.IMPORT_XML_RESET });