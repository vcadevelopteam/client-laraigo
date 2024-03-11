import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { getCollection, resetAllMain } from "store/main/actions";
import AttentionOrdersMainView from "./views/AttentionOrdersMainView";
import AttentionOrdersDetail from "./views/AttentionOrdersDetail";
import { ordersInAttentionSel } from "common/helpers";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

const AttentionOrders: FC = () => {
    const dispatch = useDispatch();
    const [viewSelected, setViewSelected] = useState("main-view");
    const [rowSelected, setRowSelected] = useState<RowSelected>({
        row: null,
        edit: false,
    });

    const fetchData = () => {
        dispatch(getCollection(ordersInAttentionSel()));
    };

    useEffect(() => {
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    if (viewSelected === "main-view") {
        return (
            <AttentionOrdersMainView
                setViewSelected={setViewSelected}
                setRowSelected={setRowSelected}
                fetchData={fetchData}
            />
        );
    } else return (
        <AttentionOrdersDetail
            data={rowSelected}
            setViewSelected={setViewSelected} 
            setRowSelected={setRowSelected}
        />
    );
};

export default AttentionOrders;
