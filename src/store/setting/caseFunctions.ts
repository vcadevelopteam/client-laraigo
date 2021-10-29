import { IAction } from "@types";
import { initialState, IState } from "./reducer";
import { saveAuthorizationToken } from "common/helpers";

export const getSetting = (state: IState): IState => ({
    ...state,
    setting: { ...state.setting, loading: true, error: false },
});

export const getSettingSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    setting: {
        value: action.payload.data?.[0],
        loading: false,
        error: false,
    },
});

export const getSettingFailure = (state: IState, action: IAction): IState => ({
    ...state,
    setting: {
        ...state.setting,
        loading: false,
        error: true,
        code: action.payload.code || 'getSettingFailure:error',
        message: action.payload.message || 'Error al obtener las configuraciones',
    },
});

export const getSettingReset = (state: IState): IState => ({
    ...state,
    setting: initialState.setting,
});

export const getUpdateUser = (state: IState): IState => ({
    ...state,
    setting: { ...state.setting, loading: true, error: false },
});

export const getUpdateUserSuccess = (state: IState, action: IAction): IState => {
    saveAuthorizationToken(action.payload.data.token);

    return {
        ...state,
        setting: {
            value: action.payload.data?.[0],
            loading: false,
            error: false,
        },
    }
};

export const getUpdateUserFailure = (state: IState, action: IAction): IState => ({
    ...state,
    setting: {
        ...state.setting,
        loading: false,
        error: true,
        code: action.payload.code || 'getSettingFailure:error',
        message: action.payload.message || 'Error al obtener las configuraciones',
    },
});

export const getUpdateUserReset = (state: IState): IState => ({
    ...state,
    setting: initialState.setting,
});

export const getPropertySettings = (state: IState): IState => ({
    ...state,
    propertySettings: { ...state.propertySettings, loading: true, error: false },
});

export const getPropertySettingsSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    propertySettings: {
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getPropertySettingsFailure = (state: IState, action: IAction): IState => ({
    ...state,
    propertySettings: {
        ...state.propertySettings,
        loading: false,
        error: true,
        code: action.payload.code || 'getPropertySettingsFailure:error',
        message: action.payload.message || 'Error al obtener las configuraciones de Propiedades',
    },
});

export const getPropertySettingsReset = (state: IState): IState => ({
    ...state,
    propertySettings: initialState.propertySettings,
});
