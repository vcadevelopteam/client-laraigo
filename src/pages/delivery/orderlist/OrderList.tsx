/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { Dictionary, IFetchData } from "@types";
import { getCollectionPaginated, resetAllMain } from "store/main/actions";
import OrderListDetail from "./views/OrderListDetail";
import OrderListMainView from "./views/OrderListMainView";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const OrderList: FC = () => {
  const dispatch = useDispatch();
  const mainResult = useSelector((state) => state.main);
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
    /*dispatch(
      getCollectionPaginated(
        getPaginatedInventory({
          startdate: daterange?.startDate || null,
          enddate: daterange?.endDate || null,
          take: pageSize,
          skip: pageIndex * pageSize,
          sorts: sorts,
          filters: {
            ...filters,
          },
        })
      )
    );*/
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
  } else
    return (
      <OrderListDetail
        setViewSelected={setViewSelected}
        data={rowSelected}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
};

export default OrderList;