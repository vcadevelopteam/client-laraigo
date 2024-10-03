import { createReducer } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";

export interface ISnackBar {
    show: boolean;
    severity?: "info" | "warning" | "error" | "success";
    message: string;
    vertical?: "top" | "bottom";
    horizontal?: "left" | "right" | "center";
    action?: React.ReactNode;
}
export interface IQuestion {
    visible: boolean;
    title?: string;
    question: string;
    textConfirm?: string;
    textCancel?: string;
    callback?: (() => void) | null;
    callbackcancel?: (() => void) | null;
    isBold?: boolean;
    showClose?: boolean;
}

export interface ILightBox {
    visible: boolean;
    index: number;
    images: string[]
}

export interface IState {
    snackbar: ISnackBar;
    question: IQuestion;
    showBackDrop: boolean;
    openDrawer: boolean;
    lightbox: ILightBox;
}

export const initialState: IState = {
    snackbar: {
        show: false,
        // severity: ,
        message: ''
    },
    question: {
        visible: false,
        question: '',
        callback: null,
        callbackcancel: null
    },
    lightbox: {
        visible: false,
        index: 0,
        images: []
    },
    showBackDrop: false,
    openDrawer: false,
}

export default createReducer<IState>(initialState, {
    [actionTypes.SHOW_BACKDROP]: caseFUnctions.showBackdrop,
    [actionTypes.MANAGE_QUESTION]: caseFUnctions.manageConfirmation,
    [actionTypes.SHOWSNACKBAR]: caseFUnctions.showSnackbar,
    [actionTypes.OPEN_DRAWER]: caseFUnctions.openDrawer,
    [actionTypes.OPEN_LIGHTBOX]: caseFUnctions.manageLightBox,
});