import React, { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { Dictionary, IFetchData } from "@types";
import { getMultiCollection, resetAllMain } from "store/main/actions";
import AttentionOrdersMainView from "./views/AttentionOrdersMainView";
import AttentionOrdersDetail from "./views/AttentionOrdersDetail";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const AttentionOrders: FC = () => {
  const dispatch = useDispatch();
  const mainResult = useSelector((state) => state.main);
  const [viewSelected, setViewSelected] = useState("main-view");
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
  function redirectFunc(view: string) {
    setViewSelected(view);
  }
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

  useEffect(() => {
      dispatch(
        getMultiCollection([
        ])
    );
  }, []);  

  if (viewSelected === "main-view") {
    if (mainResult.mainData.error) {
      return <h1>ERROR</h1>;
    }
    return (
      <AttentionOrdersMainView
        setViewSelected={setViewSelected}
        setRowSelected={setRowSelected}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
  } else
    return (
      <AttentionOrdersDetail
        data={rowSelected}
        setViewSelected={redirectFunc}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
};

export default AttentionOrders;
