import { IListStatePaginated, ITicket, IGroupInteraction, IPerson, IAgent, Dictionary, IObjectState, IInteraction, IListState, ILibrary } from "@types";
import { createReducer, initialListPaginatedState, initialListState, initialObjectState } from "common/helpers";
import * as caseFunctions from './caseFunctions';
import actionTypes from "./actionTypes";
import { itemMulti } from "store/main/reducer";

export interface IBaseState {
    loading: boolean;
    code?: string;
    error: boolean;
    message?: string;
}

export interface IReplyState extends IBaseState {
    interactionid?: number; 
    uuid?: string
}

export interface IPesonState extends IBaseState {
    data?: IPerson | null;
}

const initialTransaction: IBaseState = {
    loading: false,
    code: undefined,
    error: false,
    message: undefined,
}

export interface IState {
    orders: IListState<Dictionary>;
    orderDetail: IListStatePaginated<itemMulti>;
}

export const initialState: IState = {
    orders: initialListState,
    orderDetail: initialListPaginatedState,
};

export default createReducer<IState>(initialState, {
    [actionTypes.GET_ORDER]: caseFunctions.getDataOrder,
    [actionTypes.GET_ORDER_SUCCESS]: caseFunctions.getDataOrderSuccess,
    [actionTypes.GET_ORDER_FAILURE]: caseFunctions.getDataOrderFailure,
    [actionTypes.GET_ORDER_RESET]: caseFunctions.getDataOrderReset,

    [actionTypes.GET_ORDERDETAIL]: caseFunctions.getDataOrderDetail,
    [actionTypes.GET_ORDERDETAIL_SUCCESS]: caseFunctions.getDataOrderDetailSuccess,
    [actionTypes.GET_ORDERDETAIL_FAILURE]: caseFunctions.getDataOrderDetailFailure,
    [actionTypes.GET_ORDERDETAIL_RESET]: caseFunctions.getDataOrderDetailReset,
});