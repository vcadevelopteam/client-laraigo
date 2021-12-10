import { IActionCall, IRequestBody } from "@types";
import { DashboardService, CommonService } from "network";
import actionTypes from "./actionTypes";

interface GetDashboardParams {
    dashboardtemplateid: number | string;
    startdate: string;
    enddate: string;
    offset: number;
}

export const getDashboard = (parameters: GetDashboardParams): IActionCall => ({
    callAPI: () => DashboardService.getDashboard({ parameters }),
    types: {
        loading: actionTypes.GET_DASHBOARD,
        success: actionTypes.GET_DASHBOARD_SUCCESS,
        failure: actionTypes.GET_DASHBOARD_FAILURE,
    },
    type: null,
});

export const resetGetDashboard = (): IActionCall => ({type: actionTypes.GET_DASHBOARD_RESET});

export const getDashboardTemplate = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.GET_DASHBOARDTEMPLATE,
        success: actionTypes.GET_DASHBOARDTEMPLATE_SUCCESS,
        failure: actionTypes.GET_DASHBOARDTEMPLATE_FAILURE,
    },
    type: null,
});

export const resetGetDashboardTemplate = (): IActionCall => ({type: actionTypes.GET_DASHBOARDTEMPLATE_RESET});

export const saveDashboardTemplate = (body: IRequestBody): IActionCall => ({
    callAPI: () => CommonService.main(body),
    types: {
        loading: actionTypes.SAVE_DASHBOARDTEMPLATE,
        success: actionTypes.SAVE_DASHBOARDTEMPLATE_SUCCESS,
        failure: actionTypes.SAVE_DASHBOARDTEMPLATE_FAILURE,
    },
    type: null,
});

export const resetSaveDashboardTemplate = (): IActionCall => ({type: actionTypes.SAVE_DASHBOARDTEMPLATE_RESET});
