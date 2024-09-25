import { IActionCall } from "@types";
import { CommonService } from "network";
import actionTypes from "./actionTypes";
import { getOrderSel, getOrderLineSel, getOrderHistory } from 'common/helpers';

export const getOrders = (): IActionCall => ({
    callAPI: () => CommonService.main(getOrderSel()),
    types: {
        loading: actionTypes.GET_ORDER,
        success: actionTypes.GET_ORDER_SUCCESS,
        failure: actionTypes.GET_ORDER_FAILURE,
    },
    type: null,
});

export const resetOrders = (): IActionCall => ({ type: actionTypes.GET_ORDER_RESET });

export const getOrderDetail = (orderid:number): IActionCall => ({
    callAPI: () => CommonService.multiMain([getOrderLineSel(orderid),getOrderHistory(orderid)]),
    types: {
        loading: actionTypes.GET_ORDERDETAIL,
        success: actionTypes.GET_ORDERDETAIL_SUCCESS,
        failure: actionTypes.GET_ORDERDETAIL_FAILURE,
    },
    type: null,
});

export const resetOrderDetail = (): IActionCall => ({ type: actionTypes.GET_ORDERDETAIL_RESET });