import { IActionCall } from "@types";
import actionTypes from "./actionTypes";

export const showSnackbar = (payload: any): IActionCall => ({ type: actionTypes.SHOWSNACKBAR, payload });

export const showBackdrop = (payload: any): IActionCall => ({ type: actionTypes.SHOW_BACKDROP, payload });
