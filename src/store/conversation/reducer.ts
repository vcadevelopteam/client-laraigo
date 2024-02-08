import { createReducer, initialListPaginatedState } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { Dictionary, IGroupInteraction, IListStatePaginated } from "@types";

export interface ConversationData {
    corpid: number;
    orgid: number;
    conversationid: number;
    personid: number;
}
export interface IBaseState {
    loading: boolean;
    code?: string;
    key?: string;
    error: boolean;
    message?: string;
    interactions?: IGroupInteraction[];
    ticket?: Dictionary[];
}

const initialTransaction: IBaseState = {
    loading: false,
    code: undefined,
    error: false,
    message: undefined,
    interactions: [],
    ticket: [],
}

export interface IState {
    conversationData: IBaseState;
}

export const initialState: IState = {
    conversationData: initialTransaction,
};

export default createReducer<IState>(initialState, {
    [actionTypes.CONVERSATIONDATA]: caseFunctions.conversation,
    [actionTypes.CONVERSATIONDATA_SUCCESS]: caseFunctions.conversationSuccess,
    [actionTypes.CONVERSATIONDATA_FAILURE]: caseFunctions.conversationFailure,
    [actionTypes.CONVERSATIONDATA_RESET]: caseFunctions.conversationReset,
});