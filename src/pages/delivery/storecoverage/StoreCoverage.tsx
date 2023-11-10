/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { Dictionary, IFetchData } from "@types";
import { getCollection, getMultiCollection, resetAllMain } from "store/main/actions";
import StoreCoverageMainView from "./views/StoreCoverageMainView";
import StoreCoverageDetail from "./views/StoreCoverageDetail";
import { getWarehouseSel, selStore } from "common/helpers";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const StoreCoverage: FC = () => {
  const dispatch = useDispatch();
  const mainResult = useSelector((state) => state.main);
  const [viewSelected, setViewSelected] = useState("main-view"); 

  const [rowSelected, setRowSelected] = useState<RowSelected>({
    row: null,
    edit: false,
  });
  function redirectFunc(view: string) {
    setViewSelected(view);
  }

  const fetchData = () => {    
    dispatch(
      getCollection(
        selStore(0)
      )
    );
  };

  useEffect(() => {
    return () => {
      dispatch(resetAllMain());
    };
  }, []);

  /*
   useEffect(() => {
      dispatch(
        getMultiCollection([
            getWarehouseSel(0)
        ])
    );
  }, []);  
  */
 

  if (viewSelected === "main-view") {
    if (mainResult.mainData.error) {
      return <h1>ERROR</h1>;
    }
    return (
      <StoreCoverageMainView
        setViewSelected={setViewSelected}
        setRowSelected={setRowSelected}
        fetchData={fetchData}
      />
    );
  } else
    return (
      <StoreCoverageDetail
        data={rowSelected}
        setViewSelected={redirectFunc}
        fetchData={fetchData}
      />
    );
};

export default StoreCoverage;
