/* eslint-disable react-hooks/exhaustive-deps */
import { Button, makeStyles, Tabs } from "@material-ui/core";
import { DialogZyx, AntTab, AntTabPanel } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { getInventoryMovement } from "common/helpers";
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

const SeeInventoryTransactionsDialog  : React.FC<{
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

useEffect(() => {
  if(openModal) {
    dispatch(getCollectionAux2(getInventoryMovement(row?.inventoryid)));
  }
}, [openModal]);

const dispatchcolumns = React.useMemo(
  () => [
    {
      accessor: 'globalid',
      NoFilter: true,
      isComponent: true,
      minWidth: 60,
      width: '1%',
    },
    {
      Header: t(langKeys.inventoryconsumptionnumber),
      accessor: "inventorymovementid",
      width: "auto",
    },
    {
      Header: t(langKeys.transactiontype),
      accessor: "movementtype",
      width: "auto",
    },
    {
      Header: t(langKeys.realdate),
      accessor: "realdate",
      width: "auto",
    },
    {
      Header: t(langKeys.transactiondate),
      accessor: "transactiondate",
      width: "auto",
    },
    {
      Header: t(langKeys.quantity),
      accessor: "quantity",
      width: "auto",
    },
    {
      Header: t(langKeys.unitcost),
      accessor: "priceunit",
      width: "auto",
    }
    ,
    {
      Header: t(langKeys.linecost),
      accessor: "priceonline",
      width: "auto",
    }
    ,
    {
      Header: t(langKeys.createdBy),
      accessor: "createBy",
      width: "auto",
    }
    ,
    {
      Header: t(langKeys.dispatchedto),
      accessor: "dispatchto",
      width: "auto",
    }
  ],
  []
);

const transferscolumns = React.useMemo(
  () => [
    {
      accessor: 'globalid',
      NoFilter: true,
      isComponent: true,
      minWidth: 60,
      width: '1%',
    },
    {
      Header: t(langKeys.inventoryconsumptionnumber),
      accessor: "inventorymovementid",
      width: "auto",
    },
    {
      Header: t(langKeys.transactiontype),
      accessor: "movementtype",
      width: "auto",
    },
    {
      Header: t(langKeys.realdate),
      accessor: "realdate",
      width: "auto",
    },
    {
      Header: t(langKeys.transactiondate),
      accessor: "transactiondate",
      width: "auto",
    },
    {
      Header: t(langKeys.quantity),
      accessor: "quantity",
      width: "auto",
    }
    ,
    {
      Header: t(langKeys.unitcost),
      accessor: "priceunit",
      width: "auto",
    },
    {
      Header: t(langKeys.linecost),
      accessor: "priceonline",
      width: "auto",
    },
    {
      Header: t(langKeys.originwarehouse),
      accessor: "originwarehouse",
      width: "auto",
    },
    {
      Header: t(langKeys.originshelf),
      accessor: "originshelf",
      width: "auto",
    },
    {
      Header: t(langKeys.originbatch),
      accessor: "originbatch",
      width: "auto",
    },
    {
      Header: t(langKeys.destinationwarehouse),
      accessor: "destinationwarehouse",
      width: "auto",
    },
    {
      Header: t(langKeys.destinationshelf),
      accessor: "destinationshelf",
      width: "auto",
    },
    {
      Header: t(langKeys.destinationbatch),
      accessor: "destinationbatch",
      width: "auto",
    }
  ],
  []
);

const settingscolumns = React.useMemo(
  () => [
    {
      accessor: 'globalid',
      NoFilter: true,
      isComponent: true,
      minWidth: 60,
      width: '1%',
    },
    {
      Header: t(langKeys.transactiontype),
      accessor: "movementtype",
      width: "auto",
    },
    {
      Header: t(langKeys.transactiondate),
      accessor: "transactiondate",
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
      Header: t(langKeys.previousbalance),
      accessor: "previousbalance",
      width: "auto",
    },
    {
      Header: t(langKeys.current_balance),
      accessor: "current_balance",
      width: "auto",
    },
    {
      Header: t(langKeys.previouscost),
      accessor: "previouscost",
      width: "auto",
    },
    {
      Header: t(langKeys.newcost),
      accessor: "newcost",
      width: "auto",
    },
    {
      Header: t(langKeys.modifiedBy),
      accessor: "changeby",
      width: "auto",
    }
  ],
  []
);

  return (
    <DialogZyx open={openModal} title={t(langKeys.seeinventorytransactions)} maxWidth="xl">
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
                      <Trans i18nKey={langKeys.dispatchesandreturns} />
                  </div>
              )}
          />
          <AntTab
              label={(
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Trans i18nKey={langKeys.transfers}/>
                  </div>
              )}
          />
          <AntTab
              label={(
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Trans i18nKey={langKeys.inventorysettings}/>
                  </div>
              )}
          />
      </Tabs>
      <AntTabPanel index={0} currentIndex={tabIndex}>
        <TableZyx
          columns={dispatchcolumns}
          data={data?.data}
          loading={data?.loading}
          download={false}
          filterGeneral={false}
          register={false}
        />
      </AntTabPanel>
      <AntTabPanel index={1} currentIndex={tabIndex}>
        <TableZyx
          columns={transferscolumns}
          data={[]}
          download={false}
          filterGeneral={false}
          register={false}
        />
      </AntTabPanel>
      <AntTabPanel index={2} currentIndex={tabIndex}>
        <TableZyx
          columns={settingscolumns}
          data={[]}
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

export default SeeInventoryTransactionsDialog  ;