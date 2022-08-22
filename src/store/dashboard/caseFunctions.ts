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

export const setDashboardTemplate = (state: IState, action: IAction): IState => ({
    ...state,
    dashboardtemplate: {
        value: action.payload,
        code: undefined,
        message: undefined,
        loading: false,
        error: false,
    },
});

export const saveDashboardTemplate = (state: IState): IState => ({
    ...state,
    dashboardtemplateSave: { ...state.dashboardtemplateSave, loading: true, error: false },
});

export const saveDashboardTemplateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    dashboardtemplateSave: {
        success: true,
        loading: false,
        error: false,
    },
});

export const saveDashboardTemplateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    dashboardtemplateSave: {
        success: false,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'Error al guardar el dashboardtemplate',
    },
});

export const saveDashboardTemplateReset = (state: IState): IState => ({
    ...state,
    dashboardtemplateSave: initialState.dashboardtemplateSave,
});

export const deleteDashboardTemplate = (state: IState): IState => ({
    ...state,
    dashboardtemplateDelete: { ...state.dashboardtemplateDelete, loading: true, error: false },
});

export const deleteDashboardTemplateSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    dashboardtemplateDelete: {
        success: true,
        loading: false,
        error: false,
    },
});

export const deleteDashboardTemplateFailure = (state: IState, action: IAction): IState => ({
    ...state,
    dashboardtemplateDelete: {
        success: false,
        loading: false,
        error: true,
        code: action.payload.code || 'deleteDashboardTemplateFailure:error',
        message: action.payload.message || 'Error al eliminar el dashboardtemplate',
    },
});

export const deleteDashboardTemplateReset = (state: IState): IState => ({
    ...state,
    dashboardtemplateDelete: initialState.dashboardtemplateDelete,
});
