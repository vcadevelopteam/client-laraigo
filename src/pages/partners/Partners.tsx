/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { Dictionary, IFetchData } from "@types";
import { getCollection, getCollectionPaginated, getMultiCollectionAux, resetAllMain } from "store/main/actions";
import PartnersMainView from "./views/PartnersMainView";
import PartnersDetail from "./views/PartnersDetail";
import { customerByPartnerSel, getCorpSel, getOrgSel, getOrgSelList, getPropertySelByName, getValuesFromDomain, partnerSel } from "common/helpers";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { langKeys } from "lang/keys";

interface RowSelected {
  row: Dictionary | null;
  edit: boolean;
}

const Partners: FC = () => {
  const dispatch = useDispatch();
  const mainResult = useSelector((state) => state.main);
  const [viewSelected, setViewSelected] = useState("main-view");
  const [waitSave, setWaitSave] = useState(false);
  const executeResult = useSelector(state => state.main.execute);
  const [rowSelected, setRowSelected] = useState<RowSelected>({
    row: null,
    edit: false,
  });
  function redirectFunc(view: string) {
    setViewSelected(view);
  }
  const fetchData = () => dispatch(getCollection(partnerSel({id: 0, all: true})));

  useEffect(() => {
    fetchData()
    dispatch(
      getMultiCollectionAux([
        getOrgSelList(0),
        getCorpSel(0),
        getValuesFromDomain('PRODUCTOMONEDA'),
        getValuesFromDomain('PLANFACTURACIONPARTNERS'),
        getValuesFromDomain('CALCULOCONTACTOADICIONAL'),
        getValuesFromDomain('TIPOSSOCIOS'),
        getPropertySelByName('PORCENTAJEDECOMISIONDEVELOPER'),
        getPropertySelByName('PORCENTAJEDECOMISIONRESELLER'),
        getPropertySelByName('PORCENTAJEDECOMISIONENTERPRISE'),
      ])
    );
    return () => {
      dispatch(resetAllMain());
    };
  }, []);

  useEffect(() => {
    if (waitSave) {
        if (!executeResult.loading && !executeResult.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
            fetchData();
            dispatch(showBackdrop(false));
            setWaitSave(false);
        } else if (executeResult.error) {
            const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }
  }, [executeResult, waitSave])

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
      />
    );
  } else
    return (
      <PartnersDetail
        data={rowSelected}
        setViewSelected={redirectFunc}
        fetchData={fetchData}
      />
    );
};

export default Partners;
