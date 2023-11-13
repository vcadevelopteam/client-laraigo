import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dictionary, IFetchData } from "@types";
import { resetAllMain } from "store/main/actions";
import OrderListDetail from "./views/OrderListDetail";
import OrderListMainView from "./views/OrderListMainView";
import OrderListDetail2 from "./views/OrderListDetail2";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const OrderList: FC = () => {
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
  const [viewSelected, setViewSelected] = useState("main-view");

  const fetchData = ({
    pageSize,
    pageIndex,
    filters,
    sorts,
    daterange,
  }: IFetchData) => {
    setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange });
    
  };

  useEffect(() => {
    return () => {
      dispatch(resetAllMain());
    };
  }, []);
  
  if(viewSelected === "main-view") {
    return (
      <OrderListMainView
        setViewSelected={setViewSelected}
        setRowSelected={setRowSelected}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
  } else if(viewSelected === "detail-view") {
    return (
      <OrderListDetail
        setViewSelected={setViewSelected}
        data={rowSelected}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
  } else {
    return (
      <OrderListDetail2
        setViewSelected={setViewSelected}
        data={rowSelected}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
  }
};

export default OrderList;
