import { IAction } from "@types";
import { IState } from "./reducer";

export const chatblock_set = (state: IState, action: IAction): IState => ({
    ...state,
    chatblock: action.payload
})

export const chatblock_reset = (state: IState): IState => ({
    ...state,
    chatblock: null
})