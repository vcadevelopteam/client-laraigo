import { createReducer, initialCommon } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { ITemplate } from "@types";

export interface IRequest extends ITemplate {
    data: any;
    success: boolean | undefined | null;
}

export interface IState {
    witaitestresult: IRequest,
}

export const initialState: IState = {
    witaitestresult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
};

export default createReducer<IState>(initialState, {
    [actionTypes.TESTMESSAGE_SEND]: caseFunctions.witaiTest,
    [actionTypes.TESTMESSAGE_FAILURE]: caseFunctions.witaiTestFailure,
    [actionTypes.TESTMESSAGE_SUCCESS]: caseFunctions.witaiTestSuccess,
    [actionTypes.TESTMESSAGE_RESET]: caseFunctions.witaiTestReset,
});