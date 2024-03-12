import { ITemplate } from "@types";
import { createReducer, initialCommon } from "common/helpers";
import actionType from "./actionTypes";
import * as caseFunctions from './caseFunctions';

export interface IRequest extends ITemplate {
    data: any;
    success: boolean | undefined | null;
}

export interface IState {
    deliveryResult: IRequest,
}

export const initialState: IState = {
    deliveryResult: { ...initialCommon, data: null, loading: false, error: false, success: undefined },
};

export default createReducer<IState>(initialState, {
    [actionType.DELIVERYROUTING]: caseFunctions.deliveryLoading,
    [actionType.DELIVERYROUTING_SUCCESS]: caseFunctions.deliverySuccess,
    [actionType.DELIVERYROUTING_FAILURE]: caseFunctions.deliveryFailure,
    [actionType.DELIVERYROUTING_RESET]: caseFunctions.deliveryReset,
});