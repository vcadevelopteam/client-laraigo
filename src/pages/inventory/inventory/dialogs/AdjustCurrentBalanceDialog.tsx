/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { getInventoryBalance, insarrayInventoryBalance } from "common/helpers";
import { execute, getCollectionAux2 } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import {
  manageConfirmation,
  showBackdrop,
  showSnackbar,
} from "store/popus/actions";
import TableZyxEditable from "components/fields/table-editable";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const AdjustCurrentBalanceDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
}> = ({ openModal, setOpenModal, row }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector((state) => state.main.execute);
  const data = useSelector((state) => state.main.mainAux2);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [skipAutoReset, setSkipAutoReset] = useState(false);
  const [updatingDataTable, setUpdatingDataTable] = useState(false);

  useEffect(() => {
    if (openModal) {
      dispatch(getCollectionAux2(getInventoryBalance(row?.inventoryid)));
    }
  }, [openModal]);

  useEffect(() => {
    if (!data.loading && !data.error) {
      const newdata:any = data.data.reduce((acc:any,x)=>[...acc,{...x,oldbalance: x.currentbalance}],[])
      setDataTable(newdata);
    }
  }, [data]);

  useEffect(() => {
    if (waitSave) {
      if (!executeRes.loading && !executeRes.error) {
        dispatch(
          showSnackbar({
            show: true,
            severity: "success",
            message: t(
              row ? langKeys.successful_edit : langKeys.successful_register
            ),
          })
        );
        dispatch(showBackdrop(false));
        setOpenModal(false);
      } else if (executeRes.error) {
        const errormessage = t(executeRes.code ?? "error_unexpected_error", {
          module: t(langKeys.domain).toLocaleLowerCase(),
        });
        dispatch(
          showSnackbar({ show: true, severity: "error", message: errormessage })
        );
        setWaitSave(false);
        dispatch(showBackdrop(false));
      }
    }
  }, [executeRes, waitSave]);

  function submitData() {
    const callback = () => {
      dispatch(showBackdrop(true));
      dispatch(execute(insarrayInventoryBalance(dataTable)));
      setWaitSave(true);
    };
    dispatch(
      manageConfirmation({
        visible: true,
        question: t(langKeys.confirmation_save),
        callback,
      })
    );
  };

  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.shelf),
        accessor: "shelf",
        sortType: "string",
      },
      {
        Header: t(langKeys.batch),
        accessor: "lotecode",
        sortType: "string",
      },
      {
        Header: t(langKeys.current_balance),
        accessor: "oldbalance",
        type: "number",
        sortType: "number",        
        Cell: (props: any) => {
          const row = props.cell.row.original;
          return parseFloat(row.oldbalance);
      }
      },
      {
        Header: t(langKeys.newbalance),
        accessor: "currentbalance",
        type: "number",
        sortType: "number",
        editable: true,
      },
    ],
    []
  );
  useEffect(() => {
    setSkipAutoReset(false);
  }, [updatingDataTable]);

  const updateCell = (rowIndex: number, columnId: any, value: any) => {
    // We also turn on the flag to not reset the page
    setSkipAutoReset(true);
    setDataTable((old: any) =>
      old.map((row: any, index: number) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
    setUpdatingDataTable(!updatingDataTable);
  };
  const updateColumn = (rowIndexs: number[], columnId: any, value: any) => {
    // We also turn on the flag to not reset the page
    setSkipAutoReset(true);
    setDataTable((old: any) =>
      old.map((row: any, index: number) => {
        if (rowIndexs.includes(index)) {
          return {
            ...old[index],
            [columnId]: value,
          };
        }
        return row;
      })
    );
    setUpdatingDataTable(!updatingDataTable);
  };

  return (
    <DialogZyx
      open={openModal}
      title={t(langKeys.adjustcurrentbalance)}
      maxWidth="md"
    >
      <form onSubmit={submitData}>
        <div className="row-zyx">
          <TableZyxEditable
            columns={columns}
            data={dataTable}
            loading={data?.loading}
            download={false}
            filterGeneral={false}
            register={false}
            updateCell={updateCell}
            updateColumn={updateColumn}
            skipAutoReset={skipAutoReset}
          />
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            variant="contained"
            type="button"
            color="primary"
            startIcon={<ClearIcon color="secondary" />}
            style={{ backgroundColor: "#FB5F5F" }}
            onClick={() => {
              setOpenModal(false);
            }}
          >
            {t(langKeys.back)}
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="button"
            startIcon={<SaveIcon color="secondary" />}
            style={{ backgroundColor: "#55BD84" }}
            onClick={submitData}
          >
            {t(langKeys.save)}
          </Button>
        </div>
      </form>
    </DialogZyx>
  );
};

export default AdjustCurrentBalanceDialog;