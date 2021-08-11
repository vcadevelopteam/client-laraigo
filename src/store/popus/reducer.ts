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
}

export default createReducer<IState>(initialState, {
    [actionTypes.SHOW_BACKDROP]: caseFUnctions.showBackdrop,
    [actionTypes.SHOW_QUESTION]: caseFUnctions.showSnackbar,
    [actionTypes.SHOWSNACKBAR]: caseFUnctions.showSnackbar,
});
