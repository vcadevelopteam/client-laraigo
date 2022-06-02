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

export const campaignStop = (request: any): IActionCall => ({
    callAPI: () => CampaignService.stop(request),
    types: {
        loading: actionTypes.CAMPAIGN_STOP,
        success: actionTypes.CAMPAIGN_STOP_SUCCESS,
        failure: actionTypes.CAMPAIGN_STOP_FAILURE,
    },
    type: null,
});

export const resetCampaignStop = (): IActionCall => ({ type: actionTypes.CAMPAIGN_STOP_RESET });