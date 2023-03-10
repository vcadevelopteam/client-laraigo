import { createReducer, initialCommon } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { ITemplate } from "@types";

export interface IRequest extends ITemplate {
    data: any;
    success: boolean | undefined | null;
}

export interface IState {
    witaioperationresult: IRequest,
    witaitestresult: IRequest,
    witaitrainresult: IRequest,
}

export const initialState: IState = {
    witaioperationresult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
    witaitestresult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
    witaitrainresult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
};

export default createReducer<IState>(initialState, {
    [actionTypes.TESTMESSAGE_SEND]: caseFunctions.witaiTest,
    [actionTypes.TESTMESSAGE_FAILURE]: caseFunctions.witaiTestFailure,
    [actionTypes.TESTMESSAGE_SUCCESS]: caseFunctions.witaiTestSuccess,
    [actionTypes.TESTMESSAGE_RESET]: caseFunctions.witaiTestReset,
    
    [actionTypes.TRAINMODEL_SEND]: caseFunctions.witaiTrain,
    [actionTypes.TRAINMODEL_FAILURE]: caseFunctions.witaiTrainFailure,
    [actionTypes.TRAINMODEL_SUCCESS]: caseFunctions.witaiTrainSuccess,
    [actionTypes.TRAINMODEL_RESET]: caseFunctions.witaiTrainReset,

    [actionTypes.OPERATIONPOST_SEND]: caseFunctions.operationPost,
    [actionTypes.OPERATIONPOST_FAILURE]: caseFunctions.operationPostFailure,
    [actionTypes.OPERATIONPOST_SUCCESS]: caseFunctions.operationPostSuccess,
    [actionTypes.RESETOPERATIONRESULT]: caseFunctions.resteOperationResult,
});