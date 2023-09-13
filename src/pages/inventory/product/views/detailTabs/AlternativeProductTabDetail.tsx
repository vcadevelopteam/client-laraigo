/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react"; // we need this to make JSX compile
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { Button } from "@material-ui/core";
import { useSelector } from 'hooks';
import TableZyx from "components/fields/table-simple";
import { Search as SearchIcon } from "@material-ui/icons";
import SearchProductDialog from "../../dialogs/SearchProductDialog";
import ClearIcon from "@material-ui/icons/Clear";

const selectionKey = "domainname";

const useStyles = makeStyles((theme) => ({
  containerDetail: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    background: "#fff",
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

interface AlternativeProductDetailProps {
  row: Dictionary | null;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  errors: FieldErrors<any>;
}

const AlternativeProductTab: React.FC<AlternativeProductDetailProps> = ({
  row,
  setValue,
  getValues,
  errors,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [cleanSelected, setCleanSelected] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.product),
        accessor: "product",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "description",
        width: "auto",
      },
      {
        Header: t(langKeys.family),
        accessor: "family",
        width: "auto",
      },
      {
        Header: t(langKeys.subfamily),
        accessor: "subfamily",
        width: "auto",
      },
    ],
    []
  );
  return (
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            variant="contained"
            type="button"
            color="primary"
            disabled={!selectedRows.length}
            startIcon={<ClearIcon color="secondary" />}
            style={{ backgroundColor: "#FB5F5F" }}
            onClick={() => {}}
          >
            {t(langKeys.delete)}
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="button"
            startIcon={<SearchIcon style={{ color: "white" }} />}
            style={{ backgroundColor: "#55BD84" }}
            onClick={() => setOpenModalSearch(true)}
          >
            {t(langKeys.search)} {t(langKeys.product)}
          </Button>
        </div>
      </div>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={[]}
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
      </div>
      <SearchProductDialog
        openModal={openModalSearch}
        setOpenModal={setOpenModalSearch}
      />
    </div>
  );
};

export default AlternativeProductTab;
