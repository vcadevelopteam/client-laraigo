import { createReducer, initialCommon } from "common/helpers";
import { ITemplate } from "@types";

import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data?: any | null;
    msg?: string | null;
}

export interface IState {
    requestImportXml: IRequest;
}

export const initialState: IState = {
    requestImportXml: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.IMPORT_XML]: caseFUnctions.importXml,
    [actionTypes.IMPORT_XML_FAILURE]: caseFUnctions.importXmlFailure,
    [actionTypes.IMPORT_XML_SUCCESS]: caseFUnctions.importXmlSuccess,
    [actionTypes.IMPORT_XML_RESET]: caseFUnctions.importXmlReset,
});