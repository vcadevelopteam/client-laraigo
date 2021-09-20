import { IActionCall } from "@types";
import actionTypes from "./actionTypes";
import { IQuestion, ISnackBar, ILightBox } from "./reducer";

export const showSnackbar = (payload: ISnackBar): IActionCall => ({ type: actionTypes.SHOWSNACKBAR, payload });

export const showBackdrop = (payload: any): IActionCall => ({ type: actionTypes.SHOW_BACKDROP, payload });

export const setOpenDrawer = (open: boolean): IActionCall => ({ type: actionTypes.OPEN_DRAWER, payload: open });

export const manageConfirmation = (payload: IQuestion): IActionCall => ({ type: actionTypes.MANAGE_QUESTION, payload });

export const manageLightBox = (payload: ILightBox): IActionCall => ({ type: actionTypes.OPEN_LIGHTBOX, payload });
