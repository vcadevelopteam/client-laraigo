/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getPaginatedInventory, getPaginatedWarehouse } from "common/helpers";
import { Dictionary, IFetchData } from "@types";
import { getCollectionPaginated, resetAllMain } from "store/main/actions";
import WarehouseMainView from "./views/WarehouseMainView";
import WarehouseDetail from "./views/WarehouseDetail";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const Inventory: FC = () => {
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
    dispatch(
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
    );
  };

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
        fetchDataAux={fetchDataAux}
      />
    );
  } else
    return (
      <WarehouseDetail
        data={rowSelected}
        setViewSelected={redirectFunc}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
};

export default Inventory;
