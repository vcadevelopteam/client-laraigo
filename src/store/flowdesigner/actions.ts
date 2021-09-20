import { IActionCall } from "@types";
import actionTypes from "./actionTypes";

export const chatblock_set = (data: any): IActionCall => ({
    payload: data,
    type: actionTypes.CHATBLOCK_SET
});

export const chatblock_reset = (): IActionCall => ({type: actionTypes.CHATBLOCK_RESET});