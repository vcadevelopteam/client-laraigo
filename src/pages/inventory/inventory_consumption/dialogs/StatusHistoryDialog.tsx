/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles, Tabs } from "@material-ui/core";
import { DialogZyx, AntTab, AntTabPanel } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { dateToLocalDate, getInventoryMovement } from "common/helpers";
import { getCollectionAux2 } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { Trans, useTranslation } from 'react-i18next';
import TableZyx from "components/fields/table-simple";


const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
  tabs: {
    color: '#989898',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 'inherit',
  },
}));

const StatusHistoryDialog : React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
}> = ({ openModal, setOpenModal}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const [tabIndex, setTabIndex] = useState(0);
  const data = useSelector((state) => state.main.mainAux);
  console.log(data)


const columns = React.useMemo(
  () => [
    {
      Header: t(langKeys.status),
      accessor: "status",
      width: "auto",
    },
    {
      Header: t(langKeys.modificationDate),
      accessor: "changedate",
      width: "auto",
      Cell: (props: any) => {
          const row = props.cell.row.original;
          return <div>{dateToLocalDate(row.changedate)}</div>;
      },
    },
    {
      Header: t(langKeys.modifiedBy),
      accessor: "changeby",
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

  return (
    <DialogZyx open={openModal} title={t(langKeys.seestatushistory)} maxWidth="md">
      <TableZyx
        columns={columns}
        data={data?.data}
        loading={data.loading}
        download={false}
        filterGeneral={false}
        register={false}
      />
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: 'flex-end' }}>
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