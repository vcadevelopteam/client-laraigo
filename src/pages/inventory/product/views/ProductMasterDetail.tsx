/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel } from 'components';
import { getProductProduct, getProductsWarehouse, insProduct } from 'common/helpers';
import { Dictionary } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute, getCollectionAux, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Tabs } from '@material-ui/core';
import ProductTabDetail from './detailTabs/ProductTabDetail';
import { ExtrasMenu } from '../components/components';
import ChangeStatusDialog from '../dialogs/ChangeStatusDialog';
import StatusHistoryDialog from '../dialogs/StatusHistoryDialog';
import AlternativeProductTab from './detailTabs/AlternativeProductTabDetail';
import AddToWarehouseDialog from '../dialogs/AddToWarehouseDialog';
import WarehouseTab from './detailTabs/WarehouseTabDetail';
import DealerTab from './detailTabs/DealerTabDetail';
import SpecificationTabDetail from './detailTabs/SpecificationTabDetail';



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

const ProductMasterDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData, fetchDataAux }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
    const [openModalStatusHistory, setOpenModalStatusHistory] = useState(false);
    const [openModalAddToWarehouse, setOpenModalAddToWarehouse] = useState(false);
    const classes = useStyles();

    const arrayBread = [
        { id: "main-view", name: t(langKeys.productMaster) },
        { id: "detail-view", name: `${t(langKeys.productMaster)} ${t(langKeys.detail)}` },
    ];

    const { register, handleSubmit:handleMainSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            productid: row?.productid || 0,
            description: row?.description || '',
            descriptionlarge: row?.descriptionlarge || '',
            producttype: row?.producttype || '',
            familyid: row?.familyid || 0,
            unitbuyid: row?.unitbuyid || 0,
            unitdispatchid: row?.unitdispatchid || 0,
            status: row?.status || '',
            operation: edit ? "EDIT" : "INSERT",
            productcode: edit? row?.productcode : '',
            subfamilyid: row?.subfamilyid || 0,
            loteid: row?.loteid || 0,
            type: row?.type || 'NINGUNO',
            imagereference: row?.imagereference || '',
            attachments: row?.attachments || '',
        }
    });

    const fetchProductWarehouse = () => {
        dispatch(
          getCollectionAux(getProductsWarehouse(row?.productid))
        );
    }

    const fetchProductProduct = () => {
        dispatch(
          getCollectionAux(getProductProduct(row?.productid))
        );
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setViewSelected("main-view");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('productid');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('descriptionlarge', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('producttype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('familyid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('unitbuyid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('unitdispatchid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('productcode', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('subfamilyid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('loteid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('imagereference');

        dispatch(resetMainAux());
    }, [register]);

    const onMainSubmit = handleMainSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insProduct(data)));

            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
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
                            title={row?.description || `${t(langKeys.new)} ${t(langKeys.product)}`}
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
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.save)}
                        </Button>
                        
                        {edit && <ExtrasMenu
                            changeStatus={()=>{setOpenModalChangeStatus(true)}}
                            statusHistory={()=>setOpenModalStatusHistory(true)}
                            addToWarehouse={()=>setOpenModalAddToWarehouse(true)}
                        />}
                    </div>

                </div>
                <Tabs
                    value={tabIndex}
                    onChange={(_, i) => setTabIndex(i)}
                    className={classes.tabs}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.product} />
                            </div>
                        )}
                    />
                    {edit &&
                        <AntTab
                            label={(
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <Trans i18nKey={langKeys.warehouses}/>
                                </div>
                            )}
                        />
                    }
                    {edit &&
                        <AntTab
                            label={(
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <Trans i18nKey={langKeys.dealers} />
                                </div>
                            )}
                        />
                    }
                    {edit &&
                        <AntTab
                            label={(
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <Trans i18nKey={langKeys.specifications} />
                                </div>
                            )}
                        />
                    }
                </Tabs>

                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <ProductTabDetail
                        row={row}
                        setValue={setValue}
                        getValues={getValues}
                        errors={errors}
                    />
                    {edit &&
                        <AlternativeProductTab
                            row={row}
                            setValue={setValue}
                            getValues={getValues}
                            errors={errors}
                            fetchData={fetchProductProduct}
                        />
                    }
                </AntTabPanel>
                {edit &&
                    <AntTabPanel index={1} currentIndex={tabIndex}>
                        <WarehouseTab
                            row={row}
                            tabIndex={tabIndex}
                            fetchData={fetchProductWarehouse}
                         />
                    </AntTabPanel>
                }
                {edit &&
                        <AntTabPanel index={2} currentIndex={tabIndex}>
                            <DealerTab />
                        </AntTabPanel>
                }
                {edit &&
                    <AntTabPanel index={3} currentIndex={tabIndex}>
                        <SpecificationTabDetail />
                    </AntTabPanel>
                }
            <ChangeStatusDialog 
                openModal={openModalChangeStatus}
                setOpenModal={setOpenModalChangeStatus}
                row={row}
            />
            <StatusHistoryDialog 
                openModal={openModalStatusHistory}
                setOpenModal={setOpenModalStatusHistory}
                getValues={getValues}
            />
            <AddToWarehouseDialog 
                openModal={openModalAddToWarehouse}
                setOpenModal={setOpenModalAddToWarehouse}
                setTabIndex={setTabIndex}
                productid={row?.productid||0}
                fetchdata={fetchProductWarehouse}
            />
            </form>
        </>
    );
}


export default ProductMasterDetail;