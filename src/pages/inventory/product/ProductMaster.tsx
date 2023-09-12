/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getPaginatedProducts, getValuesFromDomain } from "common/helpers";
import { Dictionary, IFetchData } from "@types";
import {
  getCollectionPaginated,
  getMultiCollectionAux,
  resetAllMain,
} from "store/main/actions";
import ProductMasterDetail from "./views/ProductMasterDetail";
import ProductMasterMainView from "./views/ProductMasterMainView";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const ProductMaster: FC = () => {
  const dispatch = useDispatch();
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
        getPaginatedProducts({
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
    dispatch(
      getMultiCollectionAux([
        getValuesFromDomain("TIPOPRODUCTO"),
        getValuesFromDomain("FAMILIAPRODUCTO"),
        getValuesFromDomain("SUBFAMILIAPRODUCTO"),
        getValuesFromDomain("UNIDADCOMPRA"),
        getValuesFromDomain("UNIDADDESPACHO"),
        getValuesFromDomain("ESTADOPRODUCTO"),
        getValuesFromDomain("LOTEPRODUCTO"),
      ])
    );
    return () => {
      dispatch(resetAllMain());
    };
  }, []);

  if (viewSelected === "main-view") {
    return (
      <ProductMasterMainView
        setViewSelected={setViewSelected}
        setRowSelected={setRowSelected}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
  } else
    return (
      <ProductMasterDetail
        data={rowSelected}
        setViewSelected={redirectFunc}
        fetchData={fetchData}
        fetchDataAux={fetchDataAux}
      />
    );
};

export default ProductMaster;
