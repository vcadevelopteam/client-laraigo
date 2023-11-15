/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TitleDetail } from 'components';
import { getInventoryConsumptionDetail, insInventoryConsumption, inventoryConsumptionDetailIns } from 'common/helpers';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute, getCollection, getMultiCollectionAux2, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import InventoryConsumptionTabDetail from './detailTabs/InventoryConsumptionTabDetail';
import CompleteInventoryConsumptionDialog from '../dialogs/CompleteInventoryConsumptionDialog';
import { ExtrasMenu } from '../components/components';
import SeeTransactionsDialog from '../dialogs/SeeTransactionsDialog';
import StatusHistoryDialog from '../dialogs/StatusHistoryDialog';



interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData?: any;
    fetchDataAux?: any;
    viewSelected: string;
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

const InventoryConsumptionDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData, fetchDataAux, viewSelected }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const [openModal, setOpenModal] = useState(false);
    const [openModalSeeTransactions, setOpenModalSeeTransactions] = useState(false);
    const [openModalStatusHistory, setOpenModalStatusHistory] = useState(false);
    const [dataDetail, setDataDetail] = useState<Dictionary[]>([]);
    const mainData = useSelector(state => state.main.mainData);


    const arrayBread = [
        { id: "main-view", name: t(langKeys.inventory_consumption) },
        { id: "detail-view", name: `${t(langKeys.inventory_consumption)} ${t(langKeys.detail)}` },
    ];
    
    const { register, handleSubmit:handleMainSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            inventoryconsumptionid: row?.inventoryconsumptionid || 0,
            description: row?.description || '',
            ordernumber: row?.ordernumber || '',
            transactiontype: row?.transactiontype || 'DESPACHO',
            warehouseid: row?.warehouseid || 0,
            inventorybookingid: row?.inventorybookingid || 0,
            status: row?.status || 'INGRESADO',
            type: row?.type || '',
            comment: row?.comment || '',
            operation: edit ? "EDIT" : "INSERT"
        }
    });

    useEffect(() => {
        if (viewSelected==="detail-view" && edit) {
            if(edit){
                dispatch(
                    getCollection(getInventoryConsumptionDetail(row?.inventoryconsumptionid || 0))
                );
            }
        }       
    }, [viewSelected]);

    useEffect(() => {
        if(!mainData?.loading && !mainData?.error && edit){
            if(mainData?.key === "UFN_INVENTORYCONSUMPTION_DETAILSELECT"){
                setDataDetail(mainData?.data||[])
            }
        }   
    }, [mainData]);

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
        register('inventoryconsumptionid');
        register('inventorybookingid');
        register('description');
        register('transactiontype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('warehouseid', { validate: (value) => (value && value>0) || t(langKeys.field_required) } );
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type');
        register('comment');
        register('operation');

        dispatch(resetMainAux());
    }, [register]);

    const onMainSubmit = handleMainSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute({
                header: insInventoryConsumption({ ...data }),
                detail: [
                    ...dataDetail.filter(x => !!x.operation).map(x => inventoryConsumptionDetailIns({ ...data, ...x, p_tableid: x?.inventoryconsumptionid || 0 }))
                ]
            }, true));

            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    function handleOpenModalSeeTransactions () {
        setOpenModalSeeTransactions(true)
    }
    
    function handleOpenModalStatusHistory () {
        setOpenModalStatusHistory(true)
    }

    return (
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
                            title={row?.name || t(langKeys.inventory_consumption)}
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
                        >
                            {t(langKeys.back)}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            disabled={!edit}
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => {
                                setOpenModal(true)
                            }}
                        >
                            {`${t(langKeys.complete)} ${t(langKeys.inventory_consumption)}`}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >
                            {t(langKeys.save)}
                        </Button>

                        {edit && <ExtrasMenu
                            generatelabel={()=>{}}
                            referralguide={()=>{}}
                            transactions={handleOpenModalSeeTransactions}
                            statushistory={handleOpenModalStatusHistory}
                        />}
                    </div>

                </div>
                <InventoryConsumptionTabDetail
                    row={row}
                    edit={edit}
                    setValue={setValue}
                    getValues={getValues}                   
                    errors={errors}
                    setDataDetail={setDataDetail}
                    viewSelected={viewSelected}
                    dataDetail={dataDetail}
                />
                <CompleteInventoryConsumptionDialog
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    row={row}
                />
                <SeeTransactionsDialog
                    openModal={openModalSeeTransactions}
                    setOpenModal={setOpenModalSeeTransactions}
                />
                <StatusHistoryDialog
                    openModal={openModalStatusHistory}
                    setOpenModal={setOpenModalStatusHistory}
                />
            </form>
    );
}


export default InventoryConsumptionDetail;