import { DashboardTemplate, IObjectState, IProcessState } from "@types";
import { createReducer, initialObjectState, initialProccessState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

interface IDashboardData {
    [key: string]: {
        /**kpi | report */
        contentType: string;
        data: {
            // contentType: report
            [label: string]: number;
        } | {
            // contentType: kpi
            target: number;
            cautionat: number;
            alertat: number;
            currentvalue: number;
        };
        /**solo en contentType: report */
        reportname?: string;
        /**
         * Array Json
         * 
         * type {
         *  key: string;
         *  value: string;
         *  filter: string;
         *  hasFilter: boolean;
         * }
         */
        // columnjson?: string;
        /**solo en contentType: report */
        dataorigin?: string;
        /**solo en contentType: report */
        columns?: {
            tablename: string;
            /**accessor */
            columnname: string;
            description: string;
            type: string;
            join_table: any;
            join_alias: any;
            join_on: any;
            disabled: boolean;
            /**Header */
            alias: string;
        }[];
    }
}

export interface IState {
    dashboard: IObjectState<IDashboardData>;
    dashboardtemplate: IObjectState<DashboardTemplate>;
    dashboardtemplateSave: IProcessState;
    dashboardtemplateDelete: IProcessState;
}

export const initialState: IState = {
    dashboard: initialObjectState,
    dashboardtemplate: initialObjectState,
    dashboardtemplateSave: initialProccessState,
    dashboardtemplateDelete: initialProccessState,
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

    [actionTypes.SET_DASHBOARDTEMPLATE]: caseFUnctions.setDashboardTemplate,

    [actionTypes.SAVE_DASHBOARDTEMPLATE]: caseFUnctions.saveDashboardTemplate,
    [actionTypes.SAVE_DASHBOARDTEMPLATE_SUCCESS]: caseFUnctions.saveDashboardTemplateSuccess,
    [actionTypes.SAVE_DASHBOARDTEMPLATE_FAILURE]: caseFUnctions.saveDashboardTemplateFailure,
    [actionTypes.SAVE_DASHBOARDTEMPLATE_RESET]: caseFUnctions.saveDashboardTemplateReset,

    [actionTypes.DELETE_DASHBOARDTEMPLATE]: caseFUnctions.deleteDashboardTemplate,
    [actionTypes.DELETE_DASHBOARDTEMPLATE_SUCCESS]: caseFUnctions.deleteDashboardTemplateSuccess,
    [actionTypes.DELETE_DASHBOARDTEMPLATE_FAILURE]: caseFUnctions.deleteDashboardTemplateFailure,
    [actionTypes.DELETE_DASHBOARDTEMPLATE_RESET]: caseFUnctions.deleteDashboardTemplateReset,
});
