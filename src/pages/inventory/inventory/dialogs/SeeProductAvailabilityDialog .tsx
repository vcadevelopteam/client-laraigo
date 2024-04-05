/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles, Tabs } from "@material-ui/core";
import { DialogZyx,  AntTab, AntTabPanel } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { getInventoryBooking, getInventoryLote, getInventoryWarehouse, getProductProduct } from "common/helpers";
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

const SeeProductAvailabilityDialog : React.FC<{
  openModal: any;
  setOpenModal: (dat: any) => void;
  row: any;
}> = ({ openModal, setOpenModal, row }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [waitSave, setWaitSave] = useState(false);
  const executeRes = useSelector(state => state.main.execute);
  const [tabIndex, setTabIndex] = useState(0);
  const data = useSelector(state => state.main.mainAux2);

  useEffect(() => {
    if(openModal){
      if(tabIndex === 0)
        dispatch(getCollectionAux2(getInventoryWarehouse(row?.inventoryid)));
      if(tabIndex === 1)
        dispatch(getCollectionAux2(getInventoryLote(row?.inventoryid)));
      if(tabIndex === 2)
        dispatch(getCollectionAux2(getProductProduct(row?.productid)));
      if(tabIndex === 3)
        dispatch(getCollectionAux2(getInventoryBooking(row?.inventoryid)));

    }
  }, [openModal, tabIndex]);

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            setOpenModal(false);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code ?? "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

const warehousecolumns = React.useMemo(
  () => [
    {
      Header: t(langKeys.warehouse),
      accessor: "warehousename",
      width: "auto",
    },
    {
      Header: t(langKeys.current_balance),
      accessor: "currentbalance",
      width: "auto",
    },
    {
      Header: t(langKeys.overdueamount),
      accessor: "expiredquantity",
      width: "auto",
    },
    {
      Header: t(langKeys.currentreservedamount),
      accessor: "reservedquantity",
      width: "auto",
    },
    {
      Header: t(langKeys.availablequantity),
      accessor: "avaiblequantity",
      width: "auto",
    },
  ],
  []
);
const batchcolumns = React.useMemo(
  () => [
    {
      accessor: 'batchid',
      NoFilter: true,
      isComponent: true,
      minWidth: 60,
      width: '1%',
    },
    {
      Header: t(langKeys.warehouse),
      accessor: "warehousename",
      width: "auto",
    },
    {
      Header: t(langKeys.shelf),
      accessor: "rackcode",
      width: "auto",
    },
    {
      Header: t(langKeys.batch),
      accessor: "lotecode",
      width: "auto",
    },
    {
      Header: t(langKeys.dueDate),
      accessor: "expiredate",
      width: "auto",
    },
    {
      Header: t(langKeys.current_balance),
      accessor: "currentbalance",
      width: "auto",
    },
    {
      Header: t(langKeys.physicalcount),
      accessor: "recount",
      width: "auto",
    }
    ,
    {
      Header: t(langKeys.lastcountdate),
      accessor: "lastrecountdate",
      width: "auto",
    }
    ,
    {
      Header: t(langKeys.isconciliated),
      accessor: "isreconciled",
      width: "auto",
      sortType: "basic",
      type: "boolean",
      Cell: (props: any) => {
          const { isreconciled } = props.cell.row.original;
          return isreconciled ? t(langKeys.yes) : "No";
      },
    }
  ],
  []
);
const alternativecolumns = React.useMemo(
  () => [
    {
      Header: t(langKeys.product),
      accessor: "product",
      width: "auto",
    },
    {
      Header: t(langKeys.description),
      accessor: "productdescription",
      width: "auto",
    },
    {
      Header: t(langKeys.warehouse),
      accessor: "warehousename",
      width: "auto",
    },
    {
      Header: t(langKeys.current_balance),
      accessor: "currentbalance",
      width: "auto",
    }
  ],
  []
);
const reservationscolumns = React.useMemo(
  () => [
    {
      Header: t(langKeys.ticketapplication),
      accessor: "ticketid",
      width: "auto",
    },
    {
      Header: t(langKeys.creationdate),
      accessor: "createdate",
      width: "auto",
    },
    {
      Header: t(langKeys.reservationtype),
      accessor: "bookingtype",
      width: "auto",
    },
    {
      Header: t(langKeys.reservedquantity),
      accessor: "bookingquantity",
      width: "auto",
    },
    {
      Header: t(langKeys.warehouse),
      accessor: "warehousename",
      width: "auto",
    },
  ],
  []
);

  return (
    <DialogZyx open={openModal} title={t(langKeys.seeproductavailability)} maxWidth="xl">
      <Tabs
          value={tabIndex} 
          onChange={(_:any, i:any) => setTabIndex(i)}
          className={classes.tabs}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
      >
          <AntTab
              label={(
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Trans i18nKey={langKeys.warehouses} />
                  </div>
              )}
          />
          <AntTab
              label={(
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Trans i18nKey={langKeys.batches}/>
                  </div>
              )}
          />
          <AntTab
              label={(
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Trans i18nKey={langKeys.alternativeproducts}/>
                  </div>
              )}
          />
          <AntTab
              label={(
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Trans i18nKey={langKeys.reservations}/>
                  </div>
              )}
          />
      </Tabs>
      <AntTabPanel index={0} currentIndex={tabIndex}>
        <TableZyx
          columns={warehousecolumns}
          data={data?.data}
          loading={data?.loading}
          download={false}
          filterGeneral={false}
          register={false}
        />
      </AntTabPanel>
      <AntTabPanel index={1} currentIndex={tabIndex}>
        <TableZyx
          columns={batchcolumns}
          data={data?.data}
          loading={data?.loading}
          download={false}
          filterGeneral={false}
          register={false}
        /> 
      </AntTabPanel>
      <AntTabPanel index={2} currentIndex={tabIndex}>
        <TableZyx
          columns={alternativecolumns}
          data={data?.data}
          loading={data?.loading}
          download={false}
          filterGeneral={false}
          register={false}
        />
      </AntTabPanel>
      <AntTabPanel index={3} currentIndex={tabIndex}>
        <TableZyx
          columns={reservationscolumns}
          data={data?.data}
          loading={data?.loading}
          download={false}
          filterGeneral={false}
          register={false}
        /> 
      </AntTabPanel>
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

export default SeeProductAvailabilityDialog ;