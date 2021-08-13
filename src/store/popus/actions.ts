import { IActionCall } from "@types";
import actionTypes from "./actionTypes";

export const showSnackbar = (payload: any): IActionCall => ({ type: actionTypes.SHOWSNACKBAR, payload });

export const showBackdrop = (payload: any): IActionCall => ({ type: actionTypes.SHOW_BACKDROP, payload });

export const setOpenDrawer = (open: boolean): IActionCall => ({ type: actionTypes.OPEN_DRAWER, payload: open });
