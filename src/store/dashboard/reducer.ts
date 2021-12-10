import { DashboardTemplate, IObjectState } from "@types";
import { createReducer, initialObjectState } from "common/helpers";
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
}

export const initialState: IState = {
    dashboard: initialObjectState,
    dashboardtemplate: initialObjectState,
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
});
