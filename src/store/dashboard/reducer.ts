import { DashboardTemplate, IObjectState, IProcessState } from "@types";
import { createReducer, initialObjectState, initialProccessState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

interface IDashboardData {
    [key: string]: {
        data: {
            [label: string]: number;
        };
        reportname: string;
    }
}

export interface IState {
    dashboard: IObjectState<IDashboardData>;
    dashboardtemplate: IObjectState<DashboardTemplate>;
    dashboardtemplateSave: IProcessState;
}

export const initialState: IState = {
    dashboard: initialObjectState,
    dashboardtemplate: initialObjectState,
    dashboardtemplateSave: initialProccessState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.GET_DASHBOARD]: caseFUnctions.getDashboard,
    [actionTypes.GET_DASHBOARD_SUCCESS]: caseFUnctions.getDashboardSuccess,
    [actionTypes.GET_DASHBOARD_FAILURE]: caseFUnctions.getDashboardFailure,
    [actionTypes.GET_DASHBOARD_RESET]: caseFUnctions.getDashboardReset,

    [actionTypes.GET_DASHBOARDTEMPLATE]: caseFUnctions.getDashboardTemplate,
    [actionTypes.GET_DASHBOARDTEMPLATE_SUCCESS]: caseFUnctions.getDashboardTemplateSuccess,
    [actionTypes.GET_DASHBOARDTEMPLATE_FAILURE]: caseFUnctions.getDashboardTemplateFailure,
    [actionTypes.GET_DASHBOARDTEMPLATE_RESET]: caseFUnctions.getDashboardTemplateReset,

    [actionTypes.SAVE_DASHBOARDTEMPLATE]: caseFUnctions.saveDashboardTemplate,
    [actionTypes.SAVE_DASHBOARDTEMPLATE_SUCCESS]: caseFUnctions.saveDashboardTemplateSuccess,
    [actionTypes.SAVE_DASHBOARDTEMPLATE_FAILURE]: caseFUnctions.saveDashboardTemplateFailure,
    [actionTypes.SAVE_DASHBOARDTEMPLATE_RESET]: caseFUnctions.saveDashboardTemplateReset,
});
