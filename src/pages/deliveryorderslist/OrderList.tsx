import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { getCollection, getMultiCollection, resetAllMain } from "store/main/actions";
import OrderListDetail from "./views/OrderListDetail";
import OrderListMainView from "./views/OrderListMainView";
import OrderListDetail2 from "./views/OrderListDetail2";
import { deliveryAppUsersSel, deliveryConfigurationSel, getOrderHistory, listOrderSel, reasonNonDeliverySel } from "common/helpers";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

const OrderList: FC = () => {
    const dispatch = useDispatch();
    const [rowSelected, setRowSelected] = useState<RowSelected>({
        row: null,
        edit: false,
    });
    const [viewSelected, setViewSelected] = useState("main-view");

    const fetchData = (flag: boolean) => {
        dispatch(getCollection(listOrderSel(flag)));
    };

    const fetchMulti = (orderid: number) => dispatch(getMultiCollection([
        reasonNonDeliverySel(0),
        deliveryConfigurationSel({id: 0, all: true}),
        deliveryAppUsersSel(),
        getOrderHistory(orderid),
    ]))

    useEffect(() => {
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    if (viewSelected === "main-view") {
        return (
            <OrderListMainView
                setViewSelected={setViewSelected}
                setRowSelected={setRowSelected}
                fetchData={fetchData}
                fetchMulti={fetchMulti}
            />
        );
    } else if (viewSelected === "detail-view") {
        return (
            <OrderListDetail
                setViewSelected={setViewSelected}
                data={rowSelected}
                fetchData={fetchData}
                setRowSelected={setRowSelected}
            />
        );
    } else {
        return (
            <OrderListDetail2
                setViewSelected={setViewSelected}
                data={rowSelected}
                fetchData={fetchData}
                setRowSelected={setRowSelected}
                fetchMulti={fetchMulti}
            />
        );
    }
};

export default OrderList;
