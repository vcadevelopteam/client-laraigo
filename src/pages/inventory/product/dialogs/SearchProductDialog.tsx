/* eslint-disable react-hooks/exhaustive-deps */
import { DialogZyx, TemplateIcons } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import TableZyx from "components/fields/table-simple";
import React, { useEffect, useState } from "react";
import { Dictionary } from "@types";
import SearchDealerDialog from "./SearchDealerDialog";
import { useSelector } from "hooks";
import { insProductAlternative } from "common/helpers";
import { useDispatch } from "react-redux";
import { execute } from "store/main/actions";
import { showBackdrop, showSnackbar } from "store/popus/actions";

const selectionKey = "productid";

interface SearchProductDialogProps {
  openModal: boolean;
  setOpenModal: (estado: boolean) => void;
  row?: any;
  fetchData?: any;
}

const SearchProductDialog: React.FC<SearchProductDialogProps> = ({
  openModal,
  setOpenModal,
  row,
  fetchData
}) => {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [cleanSelected, setCleanSelected] = useState(false);
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const multiData = useSelector(state => state.main.multiDataAux);
  const dispatch = useDispatch();
  const executeRes = useSelector(state => state.main.execute);
  const [waitSave, setWaitSave] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.product),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "descriptionlarge",
        width: "auto",
      },
      {
        Header: t(langKeys.family),
        accessor: "familydescription",
        width: "auto",
      },
      {
        Header: t(langKeys.subfamily),
        accessor: "subfamilydescription",
        width: "auto",
      },
    ],
    []
  );

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            setOpenModal(false);
            fetchData();
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.warehouse).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

  const addAlternativeProduct = (data: Dictionary) => {
    dispatch(execute(insProductAlternative({
      productalternativeid: 0,
      productid: row.productid,
      productaltid: data.productid,
      status: data.status,
      type: 'NINGUNO',
      operation: 'INSERT'
    })))
    setWaitSave(true);
  }

  return (
    <DialogZyx
      open={openModal}
      maxWidth="lg"
      title={`${t(langKeys.search)} ${t(langKeys.product)}`}
      buttonText2={t(langKeys.close)}
      handleClickButton2={() => setOpenModal(false)}
      buttonStyle2={{
        backgroundColor: "#fb5f5f",
        color: "#fff",
      }}
    >
      <TableZyx
        columns={columns}
        data={multiData?.data?.[7]?.data || []}
        download={false}
        filterGeneral={false}
        register={false}
        onClickRow={addAlternativeProduct}
      />
      <SearchDealerDialog 
        openModal={openModalSearch}
        setOpenModal={setOpenModalSearch}
      />
    </DialogZyx>
  );
};

export default SearchProductDialog;
