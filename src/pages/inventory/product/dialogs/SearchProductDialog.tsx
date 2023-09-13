/* eslint-disable react-hooks/exhaustive-deps */
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import TableZyx from "components/fields/table-simple";
import React, { useState } from "react";
import { Dictionary } from "@types";
import SearchDealerDialog from "./SearchDealerDialog";
import { useSelector } from "hooks";

const selectionKey = "productid";

interface SearchProductDialogProps {
  openModal: boolean;
  setOpenModal: (estado: boolean) => void;
}

const SearchProductDialog: React.FC<SearchProductDialogProps> = ({
  openModal,
  setOpenModal,
}) => {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [cleanSelected, setCleanSelected] = useState(false);
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const multiData = useSelector(state => state.main.multiDataAux);
  
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
  return (
    <DialogZyx
      open={openModal}
      maxWidth="lg"
      title={`${t(langKeys.search)} ${t(langKeys.product)}`}
      buttonText1={t(langKeys.save)}
      buttonText2={t(langKeys.close)}
      handleClickButton2={() => setOpenModal(false)}
      buttonStyle1={{
        backgroundColor: "#55bd84",
        color: "#fff",
      }}
      buttonStyle2={{
        backgroundColor: "#fb5f5f",
        color: "#fff",
      }}
    >
      <TableZyx
        columns={columns}
        data={multiData.data[7].data}
        download={false}
        filterGeneral={false}
        useSelection={true}
        setSelectedRows={setSelectedRows}
        initialSelectedRows={selectedRows}
        cleanSelection={cleanSelected}
        setCleanSelection={setCleanSelected}
        register={false}
        selectionKey={selectionKey}
      />
      <SearchDealerDialog 
        openModal={openModalSearch}
        setOpenModal={setOpenModalSearch}
      />
    </DialogZyx>
  );
};

export default SearchProductDialog;
