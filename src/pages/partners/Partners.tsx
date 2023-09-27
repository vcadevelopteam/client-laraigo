/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { Dictionary, IFetchData } from "@types";
import { getCollectionPaginated, getMultiCollectionAux, resetAllMain } from "store/main/actions";
import PartnersMainView from "./views/PartnersMainView";
import PartnersDetail from "./views/PartnersDetail";
import { getCorpSel, getOrgSel, getOrgSelList, getValuesFromDomain } from "common/helpers";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const Partners: FC = () => {
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
    dispatch(
      getMultiCollectionAux([
        getOrgSelList(0),
        getCorpSel(0),
        getValuesFromDomain('PRODUCTOMONEDA')
      ])
    );
    return () => {
      dispatch(resetAllMain());
    };
  }, []);

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
      <PartnersMainView
        setViewSelected={setViewSelected}
        setRowSelected={setRowSelected}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
  } else
    return (
      <PartnersDetail
        data={rowSelected}
        setViewSelected={redirectFunc}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
};

export default Partners;
