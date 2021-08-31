import { createReducer } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface ISnackBar {
    show: boolean;
    success: boolean;
    message: string;
}
export interface IQuestion {
    visible: boolean;
    question: string;
    callback?: (() => void) | null;
    callbackcancel?: (() => void) | null;
}

export interface IState {
    snackbar: ISnackBar;
    question: IQuestion;
    showBackDrop: boolean;
    openDrawer: boolean;
}

export const initialState: IState = {
    snackbar: {
        show: false,
        success: false,
        message: ''
    },
    question: {
        visible: false,
        question: '',
        callback: null,
        callbackcancel: null
    },
    showBackDrop: false,
    openDrawer: true,
}

export default createReducer<IState>(initialState, {
    [actionTypes.SHOW_BACKDROP]: caseFUnctions.showBackdrop,
    [actionTypes.MANAGE_QUESTION]: caseFUnctions.manageConfirmation,
    [actionTypes.SHOWSNACKBAR]: caseFUnctions.showSnackbar,
    [actionTypes.OPEN_DRAWER]: caseFUnctions.openDrawer,
});
