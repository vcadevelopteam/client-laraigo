/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel } from 'components';
import { insDomain } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Tabs } from '@material-ui/core';
import ProductTabDetail from './detailTabs/ProductTabDetail';
import { ExtrasMenu } from '../components/components';
import { ChangeStatusModal } from '../components/ChangeStatusModal';
import { StatusHistory } from '../components/StatusHistory';
import AlternativeProductTab from './detailTabs/AlternativeProductTabDetail';



interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData?: () => void;
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

const ProductMasterDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [dataDomain, setdataDomain] = useState<Dictionary[]>([]);
    const executeRes = useSelector(state => state.main.execute);
    const detailRes = useSelector(state => state.main.mainAux);
    const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
    const [openModalStatusHistory, setOpenModalStatusHistory] = useState(false);
    const classes = useStyles();

    const arrayBread = [
        { id: "view-1", name: t(langKeys.productMaster) },
        { id: "view-2", name: `${t(langKeys.productMaster)} ${t(langKeys.detail)}` },
    ];

    useEffect(() => {
        if (!detailRes.loading && !detailRes.error) {
            setdataDomain(detailRes.data);
        }
    }, [detailRes]);
    
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.domainid || 0,
            operation: edit ? "EDIT" : "INSERT",
            code: edit? row?.code : '',
            description: row?.description || '',
            purchase_unit: row?.purchase_unit || '',
            dispatch_unit: row?.dispatch_unit || '',
            longdescription: row?.longdescription || '',
            type: row?.type || '',
            family: row?.family || '',
            subfamily: row?.subfamily || '',
            batch: row?.batch || '',
            status: row?.status || 'ACTIVO'
        }
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('id');
        register('code', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('longdescription', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('purchase_unit', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('dispatch_unit', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('family', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('subfamily', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('batch', { validate: (value) => (value && value.length) || t(langKeys.field_required) });

        dispatch(resetMainAux());
    }, [register]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insDomain(data)));

            setWaitSave(true);
        }
        if(!!dataDomain.length){
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }else{
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.errorneedvalues) }))
        }
    });
    return (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={(view) => {
                            setViewSelected(view);
                        }}
                    />
                    <TitleDetail
                        title={row?.name || `${t(langKeys.new)} ${t(langKeys.product)}`}
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
                            setViewSelected("view-1")
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
                    
                    {!edit && <ExtrasMenu
                        changeStatus={()=>{setOpenModalChangeStatus(true)}}
                        statusHistory={()=>setOpenModalStatusHistory(true)}
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
                <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Trans i18nKey={langKeys.schedule} count={2} />
                        </div>
                    )}
                />
                <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Trans i18nKey={langKeys.sendreminders} count={2} />
                        </div>
                    )}
                />
                <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Trans i18nKey={langKeys.alternativephone} count={2} />
                        </div>
                    )}
                />
            </Tabs>

            <AntTabPanel index={0} currentIndex={tabIndex}>
                <ProductTabDetail
                    row={row}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                />
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={tabIndex}>
                <div>test</div>
            </AntTabPanel>
            <AntTabPanel index={2} currentIndex={tabIndex}>
                <div>test</div>
            </AntTabPanel>
            <AntTabPanel index={3} currentIndex={tabIndex}>
                <AlternativeProductTab
                    row={row}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                />
            </AntTabPanel>
            <ChangeStatusModal 
                openModal={openModalChangeStatus}
                setOpenModal={setOpenModalChangeStatus}
                getValues={getValues}
            />
            <StatusHistory 
                openModal={openModalStatusHistory}
                setOpenModal={setOpenModalStatusHistory}
                getValues={getValues}
            />
        </form>
    );
}


export default ProductMasterDetail;