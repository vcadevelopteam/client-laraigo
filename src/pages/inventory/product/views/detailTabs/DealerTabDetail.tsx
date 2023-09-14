/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import TableZyx from "components/fields/table-simple";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import SearchDealerDialog from "../../dialogs/SearchDealerDialog";
import RegisterDealerDialog from "../../dialogs/RegisterDealerDialog";
import { useSelector } from "hooks";
import { TemplateIcons } from "components";
import { Dictionary } from "@types";
import { useDispatch } from "react-redux";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { execute } from "store/main/actions";
import { insProductDealer } from "common/helpers";

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

interface DealerTabProps { 
  row:any;
  fetchData: any;
  tabIndex: any;
  setTabIndex: any;
}

const DealerTab: React.FC<DealerTabProps> = ({row, fetchData, tabIndex, setTabIndex}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const [waitSave, setWaitSave] = useState(false);
  const [openModalDealer, setOpenModalDealer] = useState(false);
  const dataDealer = useSelector(state => state.main.mainAux);
  const executeResult = useSelector((state) => state.main.execute);

  useEffect(() => {
    if (waitSave) {
      if (!executeResult.loading && !executeResult.error) {
        dispatch(
          showSnackbar({
            show: true,
            severity: "success",
            message: t(langKeys.successful_delete),
          })
        );
        fetchData();
        dispatch(showBackdrop(false));
        setWaitSave(false);
      } else if (executeResult.error) {
        const errormessage = t(executeResult.code || "error_unexpected_error", {
          module: t(langKeys.domain).toLocaleLowerCase(),
        });
        dispatch(
          showSnackbar({ show: true, severity: "error", message: errormessage })
        );
        dispatch(showBackdrop(false));
        setWaitSave(false);
      }
    }
  }, [executeResult, waitSave]);

  const handleDelete = (row: Dictionary) => {
    const callback = () => {
      dispatch(
        execute(insProductDealer({ ...row, operation: "DELETE", status: "ELIMINADO" }))
      );
      dispatch(showBackdrop(true));
      setWaitSave(true);
    };

    dispatch(
      manageConfirmation({
        visible: true,
        question: t(langKeys.confirmation_delete),
        callback,
      })
    );
  };
  
  const columns = React.useMemo(
    () => [
      {
          accessor: 'productcompanyid',
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
        Header: t(langKeys.dealer),
        accessor: "distribuidordescription",
        width: "auto",
      },
      {
        Header: t(langKeys.manufacturer),
        accessor: "manufacturerdescription",
        width: "auto",
      },
      {
        Header: t(langKeys.model),
        accessor: "model",
        width: "auto",
      },
      {
        Header: t(langKeys.catalog_nro),
        accessor: "catalognumber",
        width: "auto",
      },
      {
        Header: t(langKeys.current_balance),
        accessor: "current_balance",
        width: "auto",
      },
      {
        Header: t(langKeys.last_price),
        accessor: "lastprice",
        width: "auto",
      },
      {
        Header: t(langKeys.last_order_date),
        accessor: "lastorderdate",
        width: "auto",
      },
      {
        Header: t(langKeys.purchase_unit),
        accessor: "unitbuydesc",
        width: "auto",
      },
      {
        Header: `${t(langKeys.dealer)} ${t(langKeys.default)}`,
        accessor: "isstockistdefault",
        width: "auto",
      },
    ],
    []
  );
  useEffect(() => {
      if (tabIndex === 2) {
        fetchData()
      }
  }, [tabIndex])

  function handleRegister() {
    setOpenModalDealer(true)
  }
  function search() {
    setOpenModalSearch(true)
  }
  return (
    <div className={classes.containerDetail}>
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={dataDealer.data}
          download={false}
          filterGeneral={false}
          register={true}
          ButtonsElement={() => (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: 120, backgroundColor: "#55BD84" }}
                startIcon={<SearchIcon style={{ color: "white" }} />}
                onClick={() => search()}
              >
                {t(langKeys.search)}
              </Button>
            </div>
          )}
          handleRegister={handleRegister}
        />
      </div>
      <SearchDealerDialog
        openModal={openModalSearch}
        setOpenModal={setOpenModalSearch}
      />
      <RegisterDealerDialog
        fetchData={fetchData}
        openModal={openModalDealer}
        setOpenModal={setOpenModalDealer}
        row={row}
      />
    </div>
  );
};

export default DealerTab;
