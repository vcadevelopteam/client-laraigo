import { createReducer, initialCommon } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import { ITemplate } from "@types";
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data: any;
    success: boolean | undefined | null;
}

export interface IState {
    rasaiatrainresult: IRequest,
    rasaiadownloadresult: any,
    rasaiauploadresult: IRequest,
    rasaiamodellistresult: IRequest,
}

export const initialState: IState = {
    rasaiatrainresult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
    rasaiadownloadresult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
    rasaiauploadresult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
    rasaiamodellistresult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
};

export default createReducer<IState>(initialState, {
    [actionTypes.TRAINMODEL_SEND]: caseFunctions.rasaiaTrain,
    [actionTypes.TRAINMODEL_FAILURE]: caseFunctions.rasaiaTrainFailure,
    [actionTypes.TRAINMODEL_SUCCESS]: caseFunctions.rasaiaTrainSuccess,
    [actionTypes.TRAINMODEL_RESET]: caseFunctions.rasaiaTrainReset,

    [actionTypes.DOWNLOADMODEL_SEND]: caseFunctions.rasaiaDownload,
    [actionTypes.DOWNLOADMODEL_FAILURE]: caseFunctions.rasaiaDownloadFailure,
    [actionTypes.DOWNLOADMODEL_SUCCESS]: caseFunctions.rasaiaDownloadSuccess,
    [actionTypes.DOWNLOADMODEL_RESET]: caseFunctions.rasaiaDownloadReset,

    [actionTypes.UPLOADMODEL_SEND]: caseFunctions.rasaiaUpload,
    [actionTypes.UPLOADMODEL_FAILURE]: caseFunctions.rasaiaUploadFailure,
    [actionTypes.UPLOADMODEL_SUCCESS]: caseFunctions.rasaiaUploadSuccess,
    [actionTypes.UPLOADMODEL_RESET]: caseFunctions.rasaiaUploadReset,

    [actionTypes.MODELLIST_SEND]: caseFunctions.rasaiaModelList,
    [actionTypes.MODELLIST_FAILURE]: caseFunctions.rasaiaModelListFailure,
    [actionTypes.MODELLIST_SUCCESS]: caseFunctions.rasaiaModelListSuccess,
    [actionTypes.MODELLIST_RESET]: caseFunctions.rasaiaModelListReset,
});