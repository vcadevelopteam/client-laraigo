import { createReducer, initialListPaginatedState } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { IGroupInteraction, IListStatePaginated } from "@types";

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
    data?: ConversationData|null;
}

const initialTransaction: IBaseState = {
    loading: false,
    code: undefined,
    error: false,
    message: undefined,
    data: null
}

export interface IState {
    conversationData: IBaseState;
    interactionData: IListStatePaginated<IGroupInteraction>;
}

export const initialState: IState = {
    conversationData: initialTransaction,
    interactionData: initialListPaginatedState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.CONVERSATIONDATA]: caseFunctions.conversation,
    [actionTypes.CONVERSATIONDATA_SUCCESS]: caseFunctions.conversationSuccess,
    [actionTypes.CONVERSATIONDATA_FAILURE]: caseFunctions.conversationFailure,
    [actionTypes.CONVERSATIONDATA_RESET]: caseFunctions.conversationReset,

    [actionTypes.INTERACTIONDATA]: caseFunctions.interaction,
    [actionTypes.INTERACTIONDATA_SUCCESS]: caseFunctions.interactionSuccess,
    [actionTypes.INTERACTIONDATA_FAILURE]: caseFunctions.interactionFailure,
    [actionTypes.INTERACTIONDATA_RESET]: caseFunctions.interactionReset,
});