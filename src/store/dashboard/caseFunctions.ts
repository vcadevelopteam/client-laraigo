import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const getDashboard = (state: IState): IState => ({
    ...state,
    dashboard: { ...state.dashboard, loading: true, error: false },
});

export const getDashboardSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    dashboard: {
        value: action.payload.result || [],
        loading: false,
        error: false,
    },
});

export const getDashboardFailure = (state: IState, action: IAction): IState => ({
    ...state,
    dashboard: {
        ...state.dashboard,
        loading: false,
        error: true,
        code: action.payload.code || 'getDashboardFailure:error',
        message: action.payload.message || 'Error al obtener el dashboard',
    },
});

export const getDashboardReset = (state: IState): IState => ({
    ...state,
    dashboard: initialState.dashboard,
});

export const getDashboardTemplate = (state: IState): IState => ({
    ...state,
    dashboardtemplate: { ...state.dashboardtemplate, loading: true, error: false },
});

export const getDashboardTemplateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    dashboardtemplate: {
        value: action.payload.data?.[0],
        loading: false,
        error: false,
    },
});

export const getDashboardTemplateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    dashboardtemplate: {
        ...state.dashboardtemplate,
        loading: false,
        error: true,
        code: action.payload.code || 'getDashboardTemplateFailure:error',
        message: action.payload.message || 'Error al obtener el dashboardtemplate',
    },
});

export const getDashboardTemplateReset = (state: IState): IState => ({
    ...state,
    dashboardtemplate: initialState.dashboardtemplate,
});
