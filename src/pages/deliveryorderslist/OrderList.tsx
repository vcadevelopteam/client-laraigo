import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { getCollection, resetAllMain } from "store/main/actions";
import OrderListDetail from "./views/OrderListDetail";
import OrderListMainView from "./views/OrderListMainView";
import OrderListDetail2 from "./views/OrderListDetail2";
import { listOrderSel } from "common/helpers";

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

    const fetchData = () => {
        dispatch(getCollection(listOrderSel(true)));
    };

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
            />
        );
    } else if (viewSelected === "detail-view") {
        return (
            <OrderListDetail
                setViewSelected={setViewSelected}
                data={rowSelected}
                fetchData={fetchData}
            />
        );
    } else {
        return (
            <OrderListDetail2
                setViewSelected={setViewSelected}
                data={rowSelected}
                fetchData={fetchData}
            />
        );
    }
};

export default OrderList;
