import { IActionCall } from "@types";
import actionTypes from "./actionTypes";

export const voximplantConnect = (): IActionCall => ({ type: actionTypes.INIT_SDK });
