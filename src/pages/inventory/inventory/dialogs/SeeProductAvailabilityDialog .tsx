/* eslint-disable react-hooks/exhaustive-deps */
import { Button, TextField, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect, AntTab, AntTabPanel } from "components";
import { langKeys } from "lang/keys";
import { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";
import { getInventoryWarehouse, getProductProduct, getProductsWarehouse, insProductAttribute } from "common/helpers";
import { execute, getCollectionAux2, resetMainAux } from "store/main/actions";
import { FieldCheckbox } from 'components';
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import React from "react";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { Tabs } from '@material-ui/core';
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
        dispatch(getCollectionAux2(getInventoryWarehouse(row?.productid)));
      if(tabIndex === 1)
        dispatch(getCollectionAux2(getProductsWarehouse(row?.productid)));
      if(tabIndex === 2)
        dispatch(getCollectionAux2(getProductProduct(row?.productid)));
      if(tabIndex === 3)
        dispatch(getCollectionAux2(getProductsWarehouse(row?.productid)));

    }
  }, [openModal, tabIndex]);

  const { register, handleSubmit:handleMainSubmit, setValue, getValues, reset} = useForm({
    defaultValues: {
        productattributeid: 0,
        productid: 0,
        attributeid: '',
        value: '',
        unitmeasureid: 0,
        status: 'ACTIVO',
        type: 'NINGUNO',
        operation: "INSERT"
    }
  });

  useEffect(() => {
    if (waitSave) {
        if (!executeRes.loading && !executeRes.error) {
            dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
            dispatch(showBackdrop(false));
            reset()
            setOpenModal(false);
        } else if (executeRes.error) {
            const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
            setWaitSave(false);
            dispatch(showBackdrop(false));
        }
    }
}, [executeRes, waitSave])

React.useEffect(() => {
  register('unitmeasureid', { validate: (value) =>((value && value>0) ? true : t(langKeys.field_required) + "") });
  register('attributeid', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
  register('value', { validate: (value) =>((value && value.length>0) ? true : t(langKeys.field_required) + "") });
}, [register]);

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
      accessor: "overdueamount",
      width: "auto",
    },
    {
      Header: t(langKeys.currentreservedamount),
      accessor: "subfamilydescription",
      width: "auto",
    },
    {
      Header: t(langKeys.availablequantity),
      accessor: "availablequantity",
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
      accessor: "warehouse",
      width: "auto",
    },
    {
      Header: t(langKeys.shelf),
      accessor: "shelf",
      width: "auto",
    },
    {
      Header: t(langKeys.batch),
      accessor: "batch",
      width: "auto",
    },
    {
      Header: t(langKeys.dueDate),
      accessor: "dueDate",
      width: "auto",
    },
    {
      Header: t(langKeys.current_balance),
      accessor: "current_balance",
      width: "auto",
    },
    {
      Header: t(langKeys.physicalcount),
      accessor: "physicalcount",
      width: "auto",
    }
    ,
    {
      Header: t(langKeys.lastcountdate),
      accessor: "lastcountdate",
      width: "auto",
    }
    ,
    {
      Header: t(langKeys.isconciliated),
      accessor: "isconciliated",
      width: "auto",
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
      accessor: 'productalternativeid',
      NoFilter: true,
      isComponent: true,
      minWidth: 60,
      width: '1%',
    },
    {
      Header: t(langKeys.ticketapplication),
      accessor: "ticketapplication",
      width: "auto",
    },
    {
      Header: t(langKeys.creationdate),
      accessor: "creationdate",
      width: "auto",
    },
    {
      Header: t(langKeys.reservationtype),
      accessor: "reservationtype",
      width: "auto",
    },
    {
      Header: t(langKeys.reservedquantity),
      accessor: "reservedquantity",
      width: "auto",
    },
    {
      Header: t(langKeys.warehouse),
      accessor: "warehouse",
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
            reset()
          }}
        >
          {t(langKeys.back)}
        </Button>
      </div>
    </DialogZyx>
  );
};

export default SeeProductAvailabilityDialog ;