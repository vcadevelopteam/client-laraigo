import { IAction } from "@types";
import { initialState, IState } from "./reducer";

export const getDataOrder = (state: IState): IState => ({
    ...state,
    orders: { ...state.orders, loading: true, error: false },
});

export const getDataOrderSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    orders: {
        data: action.payload.data || [],
        loading: false,
        error: false,
    },
});

export const getDataOrderFailure = (state: IState, action: IAction): IState => ({
    ...state,
    orders: {
        ...state.orders,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getDataOrderReset = (state: IState): IState => ({
    ...state,
    orders: initialState.orders,
});

export const getDataOrderDetail = (state: IState): IState => ({
    ...state,
    orderDetail: { ...state.orderDetail, loading: true, error: false },
});

export const getDataOrderDetailSuccess = (state: IState, action: IAction): IState => ({
    ...state,
    orderDetail: {
        data: action.payload.data || [],
        count: 0,
        loading: false,
        error: false
    },
});

export const getDataOrderDetailFailure = (state: IState, action: IAction): IState => ({
    ...state,
    orderDetail: {
        ...state.orderDetail,
        loading: false,
        error: true,
        code: action.payload.code ? "error_" + action.payload.code.toString().toLowerCase() : 'error_unexpected_error',
        message: action.payload.message || 'error_unexpected_error',
    },
});

export const getDataOrderDetailReset = (state: IState): IState => ({
    ...state,
    orderDetail: initialState.orderDetail,
});