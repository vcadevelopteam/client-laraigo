import { IActionCall } from "@types";
import { CampaignService } from "network";
import actionTypes from "./actionTypes";

export const campaignStart = (request: any): IActionCall => ({
    callAPI: () => CampaignService.start(request),
    types: {
        loading: actionTypes.CAMPAIGN_START,
        success: actionTypes.CAMPAIGN_START_SUCCESS,
        failure: actionTypes.CAMPAIGN_START_FAILURE,
    },
    type: null,
});

export const resetCampaignStart = (): IActionCall => ({ type: actionTypes.CAMPAIGN_START_RESET });