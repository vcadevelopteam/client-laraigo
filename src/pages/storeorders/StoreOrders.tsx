import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCollection, resetAllMain } from "store/main/actions";
import StoreOrdersMainView from "./views/StoreOrdersMainView";
import { ordersInStoreSel } from "common/helpers";

const StoreOrders: FC = () => {
    const dispatch = useDispatch();

    const fetchData = () => {
        dispatch(getCollection(ordersInStoreSel()));
    };

    useEffect(() => {
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    return (
        <StoreOrdersMainView
            fetchData={fetchData}
        />
    );
};

export default StoreOrders;
