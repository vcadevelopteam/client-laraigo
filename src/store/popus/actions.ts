import { IActionCall } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";

export const showSnackbar = (payload: any): IActionCall => ({ type: actionTypes.SHOWSNACKBAR, payload });
