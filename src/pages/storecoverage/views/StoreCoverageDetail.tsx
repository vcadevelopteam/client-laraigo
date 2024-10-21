import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs, TitleDetail } from 'components';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import NewStoreCoverageTabDetail from './detailTabs/NewStoreCoverageTabDetail';
import { execute, resetMainAux } from 'store/main/actions';
import { insStore } from 'common/helpers';

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(2),
        display: 'flex', 
        gap: '10px', 
        alignItems: 'center', 
    },  
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',        
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: theme.spacing(2),
    }
}));

interface RowSelected {
    row: Dictionary;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void;
}



const StoreCoverageDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [coverageError, setCoverageError] = useState(false)

    const arrayBread = [
        { id: "main-view", name: t(langKeys.delivery) },
        { id: "detail-view", name: `${t(langKeys.storecoveragearea)} ${t(langKeys.detail)}` },
    ];
    
    const [storeAreaCoordinates, setStoreAreaCoordinates]=useState([]);
    
    const { register, handleSubmit:handleMainSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.storeid || 0,
            description: row?.description || '',
            phone: row?.phone || '',
            address: row?.address || '',           
            status: row?.status || 'ACTIVO',
            warehouseinstore: row?.warehouseinstore || false,
            warehouseid: row?.warehouseid || 0,
            type: row?.type || '',
            operation: edit ? 'UPDATE' : 'INSERT'
        }
    });


    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("main-view");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.product).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('id');
        register('warehouseid');
        register('warehouseinstore');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('phone', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('address', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status');
        register('type');
        register('operation');

        dispatch(resetMainAux());
    }, [register]);

    const onMainSubmit = handleMainSubmit((data) => {
        if(storeAreaCoordinates?.length >= 4) {
            const callback = () => {
                dispatch(showBackdrop(true));
                dispatch(execute(insStore({...data, coveragearea: JSON.stringify(storeAreaCoordinates)})));
                setWaitSave(true);
            }
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        } else {
            setCoverageError(true);
        }
    });

    return (
        <>
            <form onSubmit={onMainSubmit} className={classes.form}>
                <div className={classes.header}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                        <TitleDetail
                            title={row?.name || `${t(langKeys.new)} ${t(langKeys.storecoveragearea)}`}
                        />
                    </div>
                    <div className={classes.button}>
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
                            style={{ backgroundColor: "#55BD84" }}
                            onChange={onMainSubmit}    
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>

                </div>
                <NewStoreCoverageTabDetail
                    errors={errors}
                    row={row}
                    getValues={getValues}
                    setValue={setValue}
                    setStoreAreaCoordinates={setStoreAreaCoordinates}
                    storeAreaCoordinates={storeAreaCoordinates}
                    coverageError={coverageError}
                    setCoverageError={setCoverageError}
                />
            </form>
        </>
    );
}


export default StoreCoverageDetail;