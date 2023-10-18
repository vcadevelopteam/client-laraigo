/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel } from 'components';
import { getAllInventoryBalance, getInventoryBalance, getProductManufacturer, insOrderInventory } from 'common/helpers';
import { Dictionary } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute, getCollectionAux, getCollectionAux2, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Tabs } from '@material-ui/core';
import InventoryTabDetail from './detailTabs/InventoryTabDetail';
import NewOrderTabDetail from './detailTabs/NewOrderTabDetail';
import { ExtrasMenuInventory } from '../components/components';
import AdjustCurrentBalanceDialog from '../dialogs/AdjustCurrentBalanceDialog';
import AdjustPhysicalCountDialog from '../dialogs/AdjustPhysicalCountDialog';
import AdjustStandardCostDialog from '../dialogs/AdjustStandardCostDialog';
import AdjustAverageCostDialog from '../dialogs/AdjustAverageCostDialog';
import ReconcileBalanceDialog from '../dialogs/ReconcileBalanceDialog';
import SeeProductAvailabilityDialog from '../dialogs/SeeProductAvailabilityDialog ';
import SeeInventoryTransactionsDialog from '../dialogs/SeeInventoryTransactionsDialog ';
import ManageReservationsDialog from '../dialogs/ManageReservationsDialog';


interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData?: any;
    fetchDataAux?: any;
}


const useStyles = makeStyles((theme) => ({
    containerDetail: {
        // marginTop: theme.spacing(2),
        // marginRight: theme.spacing(2),
        // padding: theme.spacing(2),
        // background: '#fff',
        width: '100%'
    },
    button: {
        marginRight: theme.spacing(2),
    },
    containerHeader: {
        padding: theme.spacing(1),
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
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

const InventoryDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData, fetchDataAux }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();
    const dataBalances = useSelector(state => state.main.mainAux2)
    const [openModalAdjust, setOpenModalAdjust] = useState(false);
    const [openModalPhysicalCount, setOpenModalPhysicalCount] = useState(false);
    const [openModalStandardCost, setOpenModalStandardCost] = useState(false);
    const [openModalAverageCost, setOpenModalAverageCost] = useState(false);
    const [disableSave, setdisableSave] = useState(false);
    const [openModalReconcileBalance, setOpenModalReconcileBalance] = useState(false);
    const [openModalSeeProductAvailability, setOpenModalSeeProductAvailability] = useState(false);
    const [openModalSeeInventoryTransactions, setOpenModalSeeInventoryTransactions] = useState(false);
    const [openModalManageReservations, setOpenModalManageReservations] = useState(false);

    const arrayBread = [
        { id: "main-view", name: t(langKeys.inventory) },
        { id: "detail-view", name: `${t(langKeys.inventory)} ${t(langKeys.detail)}` },
    ];
    const fetchWarehouseProducts = () => {
        dispatch(
            getCollectionAux(getProductManufacturer(row?.productid))
        );
    }

    const { register, handleSubmit:handleMainSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            inventoryorderid: 0,
            inventoryid: row?.inventoryid,
            operation: "INSERT",
            isneworder:  true,
            replenishmentpoint: 0,
            deliverytimedays:  0,
            securitystock:  0,
            unitbuyid:  0,
            orderid:0,
            distributorid:  0,
            manufacturerid:  0,
            economicorderquantity:  1,
            model: '',
            catalognumber:  '',
            type:  '',
            status: 'ACTIVO'
        }
    });

    const fetchInventoryBalance = () => {
        dispatch(
          //getCollectionAux(getInventoryBalance(row?.inventoryid))
          getCollectionAux2(getAllInventoryBalance(row?.inventoryid))
        );
    }

    useEffect(() => {
        fetchWarehouseProducts()
    }, [])

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setViewSelected("main-view");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code ?? "error_unexpected_error", { module: t(langKeys.warehouse).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register("inventoryorderid");
        register("inventoryid");
        register("isneworder");
        register("replenishmentpoint", { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
        register("deliverytimedays", { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
        register("securitystock", { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
        register("unitbuyid", { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
        register("distributorid");
        register("manufacturerid");
        register("economicorderquantity", { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
        register("model");
        register("catalognumber");
        dispatch(resetMainAux());
    }, [register]);

    const onMainSubmit = handleMainSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insOrderInventory(data)));

            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    function handleOpenAdjustCurrentBalanceModal() {
        setOpenModalAdjust(true)
    }
    function handleOpenPhysicalCountModal() {
        setOpenModalPhysicalCount(true)
    }
    function handleOpenStandardCostModal() {
        setOpenModalStandardCost(true)
    }
    function handleOpenAverageCostModal() {
        setOpenModalAverageCost(true)
    }
    function handleOpenReconcileBalanceModal() {
        setOpenModalReconcileBalance(true)
    }
    function handleOpenSeeProductAvailabilityModal() {
        setOpenModalSeeProductAvailability(true)
    }
    function handleOpenSeeInventoryTransactionsModal() {
        setOpenModalSeeInventoryTransactions(true)
    }
    function handleOpenManageReservationsModal() {
        setOpenModalManageReservations(true)
    }

    return (
        <>
            <form onSubmit={onMainSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                        <TitleDetail
                            title={t(langKeys.inventory)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => {
                                setViewSelected("main-view")
                            }}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={disableSave}
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.save)}
                        </Button>
                        
                        <ExtrasMenuInventory 
                            currentbalance={handleOpenAdjustCurrentBalanceModal}
                            pyshicalcount={handleOpenPhysicalCountModal}
                            standardcost={handleOpenStandardCostModal}
                            averagecost={handleOpenAverageCostModal}
                            reconcilebalance={handleOpenReconcileBalanceModal}
                            seeproductavailability={handleOpenSeeProductAvailabilityModal}
                            seeinventorytransactions={handleOpenSeeInventoryTransactionsModal}
                            managereservations={handleOpenManageReservationsModal}
                        />
                    </div>

                </div>
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
                                <Trans i18nKey={langKeys.inventory} />
                            </div>
                        )}
                    />
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.newordersdetail}/>
                            </div>
                        )}
                    />
                </Tabs>
                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <InventoryTabDetail
                        row={row}
                        setValue={setValue}
                        getValues={getValues}
                        errors={errors}
                        tabIndex={tabIndex}
                        fetchdata={fetchInventoryBalance}
                    />
                </AntTabPanel>
                <AntTabPanel index={1} currentIndex={tabIndex}>
                    <NewOrderTabDetail fetchdata={fetchWarehouseProducts}
                        setValue={setValue}
                        setdisableSave={setdisableSave}
                        getValues={getValues} errors={errors} row={row} tabIndex={tabIndex}/>
                </AntTabPanel>
                <AdjustCurrentBalanceDialog
                    openModal={openModalAdjust}
                    setOpenModal={setOpenModalAdjust}
                    row={row}
                />
                <AdjustPhysicalCountDialog
                    openModal={openModalPhysicalCount}
                    setOpenModal={setOpenModalPhysicalCount}
                    row={row}
                />
                <AdjustStandardCostDialog
                    openModal={openModalStandardCost}
                    setOpenModal={setOpenModalStandardCost}
                    row={row}
                />
                <AdjustAverageCostDialog
                    openModal={openModalAverageCost}
                    setOpenModal={setOpenModalAverageCost}
                    row={row}
                />
                <ReconcileBalanceDialog
                    openModal={openModalReconcileBalance}
                    setOpenModal={setOpenModalReconcileBalance}
                    row={row}
                    data={dataBalances.data}
                />
                <SeeProductAvailabilityDialog
                    openModal={openModalSeeProductAvailability}
                    setOpenModal={setOpenModalSeeProductAvailability}
                    row={row}
                />
                <SeeInventoryTransactionsDialog
                    openModal={openModalSeeInventoryTransactions}
                    setOpenModal={setOpenModalSeeInventoryTransactions}
                    row={row}
                />
                <ManageReservationsDialog
                    openModal={openModalManageReservations}
                    setOpenModal={setOpenModalManageReservations}
                    row={row}
                />
            </form>
        </>
    );
}


export default InventoryDetail;