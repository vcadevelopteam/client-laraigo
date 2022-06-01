import { createReducer, initialCommon } from "common/helpers";
import { ITemplate } from "@types";

import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface IRequest extends ITemplate {
    data?: any | null;
    msg?: string | null;
}

export interface IState {
    startRequest: IRequest;
}

export const initialState: IState = {
    startRequest: { ...initialCommon, data: null, loading: false, error: false },
};

export default createReducer<IState>(initialState, {
    [actionTypes.CAMPAIGN_START]: caseFUnctions.campaignStart,
    [actionTypes.CAMPAIGN_START_FAILURE]: caseFUnctions.campaignStartFailure,
    [actionTypes.CAMPAIGN_START_SUCCESS]: caseFUnctions.campaignStartSuccess,
    [actionTypes.CAMPAIGN_START_RESET]: caseFUnctions.campaignStartReset,
});
