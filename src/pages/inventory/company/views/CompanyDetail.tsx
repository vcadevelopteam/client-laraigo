/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel } from 'components';
import { getWarehouseProducts, insCompany, insWarehouse } from 'common/helpers';
import { Dictionary } from "@types";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute, getCollectionAux, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import CompanyTabDetail from './detailTabs/CompanyTabDetail';
interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
    duplicated: boolean;
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

const CompanyDetail: React.FC<DetailProps> = ({ data: { row, edit, duplicated }, setViewSelected, fetchData, fetchDataAux }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();
    if(duplicated){
        dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.satisfactoryduplication) }))
    }
    const arrayBread = [
        { id: "main-view", name: t(langKeys.company) },
        { id: "detail-view", name: `${t(langKeys.company)} ${t(langKeys.detail)}` },
    ];
    
    const { register, handleSubmit:handleMainSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            manufacturerid: row?.manufacturerid || 0,
            operation: edit ? "EDIT" : "INSERT",
            description: row?.description || '',
            manufacturercode: row?.manufacturercode || '',
            status: row?.status || 'ACTIVO',
            type: row?.type || 'NINGUNO',
            descriptionlarge: row?.descriptionlarge || '',
            clientenumbers: row?.clientenumbers || '',
            beginpage: row?.beginpage || '',
            currencyid: row?.currencyid || 0,
            taxeid: row?.taxeid || 0,
            ispaymentdelivery: row?.ispaymentdelivery || false,
            typemanufacterid: row?.typemanufacterid || 0,
        }
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setViewSelected("main-view");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.warehouse).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('manufacturerid');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('manufacturercode', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('descriptionlarge');
        register('clientenumbers', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('beginpage', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('currencyid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('taxeid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('typemanufacterid', { validate: (value) => (value && value>0) || t(langKeys.field_required) });

        dispatch(resetMainAux());
    }, [register]);

    const onMainSubmit = handleMainSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insCompany(data)));

            setWaitSave(true);
        }
        if(duplicated){
            callback()
        }else{
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    });

    function handleReturnMainView(){
        if(duplicated){
            const callback = () => {
                onMainSubmit()
            }
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.saveduplicatechanges),
                callback,
                callbackcancel: ()=>setViewSelected("main-view")
            }))
        }else{
            setViewSelected("main-view")
        }        
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
                            title={row?.name || `${t(langKeys.new)} ${t(langKeys.company)}`}
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
                                handleReturnMainView()
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
                        
                        {/*!edit && <ExtrasMenu
                            changeStatus={()=>{setOpenModalChangeStatus(true)}}
                            statusHistory={()=>setOpenModalStatusHistory(true)}
                            addToWarehouse={()=>setOpenModalAddToWarehouse(true)}
                        />*/}
                    </div>

                </div>
                <CompanyTabDetail
                    row={row}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                />
            </form>
        </>
    );
}


export default CompanyDetail;