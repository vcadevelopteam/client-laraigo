/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@material-ui/core";
import {
  DialogZyx,
} from "components";
import { langKeys } from "lang/keys";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import TableZyx from "components/fields/table-simple";
import { useDispatch } from "react-redux";
import { getCollectionAux2 } from "store/main/actions";
import { useSelector } from "hooks";
import { convertLocalDate, getProductStatusHistory } from "common/helpers";

const StatusHistoryDialog: React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
  massive?: boolean;
}> = ({ openModal, setOpenModal, row, massive = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const statusHistoryData = useSelector(state => state.main.mainAux2);
  const columns = React.useMemo(
    () => [
      {
        Header: t(langKeys.status),
        accessor: "status",
        width: "auto",
      },
      {
        Header: t(langKeys.change_date),
        accessor: "createdate",
        width: "auto",
        type:"date",        
        sortType: "datetime",
        Cell: (props: any) => {
            const row = props.cell.row.original;
            return convertLocalDate(row.createdate).toLocaleString();
        },
      },
      {
        Header: t(langKeys.change_by),
        accessor: "createby",
        width: "auto",
      },
      {
        Header: t(langKeys.ticket_comment),
        accessor: "comment",
        width: "auto",
      },
    ],
    []
  );

  
  useEffect(() => {
    if(openModal){
      dispatch(getCollectionAux2(getProductStatusHistory(row?.productid)));
    }
  }, [openModal]);

  return (
    <DialogZyx open={openModal} title={t(langKeys.status_history)} maxWidth="md">
      <div className="row-zyx">
        <TableZyx
          columns={columns}
          data={statusHistoryData.data.reverse()}
          loading={false}
          filterGeneral={false}
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
      </div>
    </DialogZyx>
  );
};

export default StatusHistoryDialog;