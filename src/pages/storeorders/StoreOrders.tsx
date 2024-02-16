import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dictionary, IFetchData } from "@types";
import { resetAllMain } from "store/main/actions";
import StoreOrdersMainView from "./views/StoreOrdersMainView";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

const StoreOrders: FC = () => {
    const dispatch = useDispatch();
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({
        pageSize: 0,
        pageIndex: 0,
        filters: {},
        sorts: {},
        daterange: null,
    });
    const [rowSelected, setRowSelected] = useState<RowSelected>({
        row: null,
        edit: false,
    });

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange });  
    };

    useEffect(() => {
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    return <StoreOrdersMainView 
      setRowSelected={setRowSelected} 
      fetchData={fetchData} 
      fetchDataAux={fetchDataAux} 
    />;
};

export default StoreOrders;
