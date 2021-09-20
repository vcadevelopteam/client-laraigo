import { createReducer } from "common/helpers";
import * as caseFUnctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { Dictionary } from "@types";

export interface IState {
    chatblock: Dictionary | null;
}

export const initialState: IState = {
    chatblock: null
};

export default createReducer<IState>(initialState, {
    [actionTypes.CHATBLOCK_SET]: caseFUnctions.chatblock_set,
    [actionTypes.CHATBLOCK_RESET]: caseFUnctions.chatblock_reset
});