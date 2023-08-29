/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getDomainSel } from "common/helpers";
import { Dictionary } from "@types";
import { getCollection, resetAllMain } from "store/main/actions";
import WarehouseMainView from "./views/WarehouseMainView";
import WarehouseDetail from "./views/WarehouseDetail";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const Warehouse: FC = () => {
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
  const fetchData = () => dispatch(getCollection(getDomainSel("")));

  useEffect(() => {
    return () => {
      dispatch(resetAllMain());
    };
  }, []);

  if (viewSelected === "main-view") {
    if (mainResult.mainData.error) {
      return <h1>ERROR</h1>;
    }
    return (
      <WarehouseMainView
        setViewSelected={setViewSelected}
        setRowSelected={setRowSelected}
        fetchData={fetchData}
        mainData={mainResult.mainData}
      />
    );
  } else
    return (
      <WarehouseDetail
        data={rowSelected}
        setViewSelected={redirectFunc}
        multiData={mainResult.multiData.data}
        fetchData={fetchData}
      />
    );
};

export default Warehouse;
