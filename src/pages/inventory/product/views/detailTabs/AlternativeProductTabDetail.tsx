/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"; // we need this to make JSX compile
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
import { TemplateIcons } from "components";
import { useDispatch } from "react-redux";
import { execute } from "store/main/actions";
import { insProductAlternative } from "common/helpers";
import { showBackdrop, showSnackbar } from "store/popus/actions";

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
  fetchData: any
}

const AlternativeProductTab: React.FC<AlternativeProductDetailProps> = ({
  row,
  setValue,
  getValues,
  errors,
  fetchData
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Dictionary>({});
  const [cleanSelected, setCleanSelected] = useState(false);
  const dataProduct = useSelector(state => state.main.mainAux);
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  
  useEffect(() => {
    fetchData(row?.productid)
  }, []);

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            fetchData(row?.productid);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.warehouse).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

  const handleDelete = (data: Dictionary) => {
    dispatch(execute(insProductAlternative({
      productalternativeid: data.productalternativeid,
      productid: data.productid,
      productaltid: data.productid,
      status: 'ELIMINADO',
      type: 'NINGUNO',
      operation: 'DELETE'
    })))
    setWaitSave(true);
  }

  const columns = React.useMemo(
    () => [
      {
        accessor: 'productalternativeid',
        NoFilter: true,
        isComponent: true,
        minWidth: 60,
        width: '1%',
        Cell: (props: any) => {
            const row = props.cell.row.original;
            return (
                <TemplateIcons
                    deleteFunction={() => handleDelete(row)}
                />
            )
        }
      },
      {
        Header: t(langKeys.product),
        accessor: "productdescription",
        width: "auto",
      },
      {
        Header: t(langKeys.description),
        accessor: "productdescriptionlarge",
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
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
          data={dataProduct.data}
          download={false}
          filterGeneral={false}
          register={false}
        />
      </div>
      <SearchProductDialog
        openModal={openModalSearch}
        setOpenModal={setOpenModalSearch}
        row={row}
        fetchData={fetchData}
      />
    </div>
  );
};

export default AlternativeProductTab;
