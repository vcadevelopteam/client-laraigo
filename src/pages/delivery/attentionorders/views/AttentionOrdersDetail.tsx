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
import NewAttentionOrdersTabDetail from './detailTabs/NewAttentionOrdersTabDetail';
import { resetMainAux } from 'store/main/actions';


const useStyles = makeStyles((theme) => ({   
    button: {
        marginRight: theme.spacing(2),
        display: 'flex', 
        justifyContent: 'space-between',
        gap: '1rem', alignItems: 'center' 
    },       
    clientdetailposition: {
        paddingTop:"2rem", 
        paddingLeft:"0.9rem"
    },   
   
}));

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData?: () => void;
    fetchDataAux?: () => void;
}



const AttentionOrdersDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData, fetchDataAux }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();

    const arrayBread = [
        { id: "main-view", name: t(langKeys.attentionorders) },
        { id: "detail-view", name: ` ${t(langKeys.detail)} ${t(langKeys.ordernumber)}` },
    ];
    
    const { register, handleSubmit:handleMainSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            storename: row?.storename || '',
            phonenumber: row?.phonenumber || '',
            address: row?.address || '',
            coveragearea: row?.coveragearea || '',
            status: row?.status || 'ACTIVO',
            isInStore: row?.isInStore || false,
            warehouseid: row?.warehouseid || 0,
            type: row?.type || '',
            operation: edit ? 'UPDATE' : 'INSERT'
        }
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                //fetchData && fetchData(fetchDataAux);
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
        register('warehouseid');
        register('isInStore');
        register('storename', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('phonenumber', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('address', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('coveragearea', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status');
        register('type');
        register('operation');

        dispatch(resetMainAux());
    }, [register]);

    const fetchWarehouseProducts = () => {
        /*dispatch(
          getCollectionAux(getWarehouseProducts(row?.warehouseid))
        );*/
    }

    const onMainSubmit = handleMainSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            //dispatch(execute(insWarehouse(data)));

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
            <form onSubmit={onMainSubmit}>
                <div className={classes.button}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                        <div className={classes.clientdetailposition}>            
                            <TitleDetail
                                title={row?.name || `${t(langKeys.client_detail)}`}
                            />                    
                        </div>                                               
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
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.save)}
                        </Button>
                    </div>

                </div>
                <NewAttentionOrdersTabDetail fetchdata={fetchWarehouseProducts} errors={errors} row={row} getValues={getValues} setValue={setValue}/>
            </form>
        </>
    );
}

export default AttentionOrdersDetail;