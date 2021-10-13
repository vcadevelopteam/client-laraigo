import { IListState, IObjectState } from "@types";
import { createReducer, initialListState, initialObjectState } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { ISetting } from "@types";

export interface IState {
    setting: IObjectState<ISetting>;
    propertySettings: IListState<any>;
}

export const initialState: IState = {
    setting: initialObjectState,
    propertySettings: initialListState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.GET_SETTING]: caseFUnctions.getSetting,
    [actionTypes.GET_SETTING_SUCCESS]: caseFUnctions.getSettingSuccess,
    [actionTypes.GET_SETTING_FAILURE]: caseFUnctions.getSettingFailure,
    [actionTypes.GET_SETTING_RESET]: caseFUnctions.getSettingReset,

    [actionTypes.GET_PROPERTY_SETTINGS]: caseFUnctions.getPropertySettings,
    [actionTypes.GET_PROPERTY_SETTINGS_SUCCESS]: caseFUnctions.getPropertySettingsSuccess,
    [actionTypes.GET_PROPERTY_SETTINGS_FAILURE]: caseFUnctions.getPropertySettingsFailure,
    [actionTypes.GET_PROPERTY_SETTINGS_RESET]: caseFUnctions.getPropertySettingsReset,

    [actionTypes.UPDATE_USER]: caseFUnctions.getUpdateUser,
    [actionTypes.UPDATE_USER_SUCCESS]: caseFUnctions.getUpdateUserSuccess,
    [actionTypes.UPDATE_USER_FAILURE]: caseFUnctions.getUpdateUserFailure,
    [actionTypes.GET_SETTING_RESET]: caseFUnctions.getUpdateUserReset,
});
