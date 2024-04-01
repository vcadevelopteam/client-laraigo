/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getPaginatedCompanies, getValuesFromDomain } from "common/helpers";
import { Dictionary, IFetchData } from "@types";
import { getCollectionPaginated, getMultiCollectionAux, resetAllMain } from "store/main/actions";
import CompanyMainView from "./views/CompanyMainView";
import CompanyDetail from "./views/CompanyDetail";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const Company: FC = () => {
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
        getPaginatedCompanies({
          startdate: daterange?.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
          enddate: daterange?.endDate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime(),
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
    dispatch(
      getMultiCollectionAux([
        getValuesFromDomain("TIPOEMPRESA"),
        getValuesFromDomain("PRODUCTOMONEDA"),
        getValuesFromDomain("CODIGOSIMPUESTO"),
      ])
    );
    return () => {
      dispatch(resetAllMain());
    };
  }, []);
  

  if (viewSelected === "main-view") {
    if (mainResult.mainData.error) {
      return <h1>ERROR</h1>;
    }
    return (
      <CompanyMainView
        setViewSelected={setViewSelected}
        setRowSelected={setRowSelected}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
  } else
    return (
      <CompanyDetail
        data={rowSelected}
        setViewSelected={redirectFunc}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
};

export default Company;
