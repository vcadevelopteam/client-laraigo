import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FieldEdit, TemplateBreadcrumbs } from 'components';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { execute } from 'store/main/actions';
import { registeredLinksIns } from 'common/helpers';
import { useSelector } from 'hooks';

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void;
}

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: "#55BD84",
        '&:hover': {
            backgroundColor: "#55BD84",
        },
    },
    mainComponent: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    headerButtons: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    },
    marginB6: {
        marginBottom: 6,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    fieldColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    fieldStyle: {
        fontWeight: 'bold',
        fontSize: 18
    },
    formStyle: {
        backgroundColor: 'white',
        padding: 10,
        marginTop: 8
    },
}));

const LinkRegisterDetail: React.FC<DetailProps> = ({ data: { row }, setViewSelected, fetchData }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);

    const arrayBread = [
        { id: "crm", name: t(langKeys.app_crm) },
        { id: "main-view", name: t(langKeys.linkregister) },
        { id: "detail-view", name: `${t(langKeys.linkregister)} ${t(langKeys.detail)}` },
    ];
    
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            linkregisterid: row ? row.linkregisterid : 0,
            description: row?.description || "",
            url: row?.url || "",
            startdate: row?.startdate || '',
            enddate: row?.enddate || '',
            status: row?.status || 'ACTIVO',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    React.useEffect(() => {
        register('linkregisterid');
        register('description', { validate: (value) => (value && value.trim().length) || t(langKeys.field_required) });
        register('url', { 
            validate: (value) => {
                if (!value || !value.trim().length) {
                    return t(langKeys.field_required);
                }
                const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/;
                if (!urlRegex.test(value)) {
                    return t(langKeys.invalidurl);
                }
                return true;
            }
        });
        register('startdate', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('enddate', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status');
        register('operation');
    }, [register, setValue]);

    const onMainSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(registeredLinksIns(data)));
            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                setWaitSave(false);
                fetchData();
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

    return (
        <>
            <form onSubmit={onMainSubmit} className={classes.mainComponent}>
                <div className={classes.header}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                        <div className={classes.formTitle}>{row?.description}</div>
                    </div>
                    <div className={classes.headerButtons}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("main-view")}
                        >
                            {t(langKeys.cancel)}
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={`${classes.formStyle} row-zyx`}>
                    <div className='col-8'>
                        <div className={classes.fieldColumn}>
                            <span className={classes.fieldStyle}>{t(langKeys.name)}</span>
                            <span className={classes.marginB6}>{t(langKeys.linknamedesc)}</span>
                            <FieldEdit
                                size="small"
                                label={''}
                                valueDefault={getValues('description')}
                                onChange={(value) => setValue('description', value)}
                                error={typeof errors?.description?.message === 'string' ? errors?.description?.message : ''}
                                type="text"
                                maxLength={60}
                                variant="outlined"
                            />
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className={classes.fieldColumn}>
                            <span className={classes.fieldStyle}>{t(langKeys.startdate)}</span>
                            <span className={classes.marginB6}>{t(langKeys.linkstartdatedesc)}</span>
                            <FieldEdit
                                size="small"
                                label={''}
                                valueDefault={getValues('startdate')}
                                onChange={(value) => setValue('startdate', value)}
                                error={typeof errors?.startdate?.message === 'string' ? errors?.startdate?.message : ''}
                                type="date"
                                maxLength={60}
                                variant="outlined"
                            />
                        </div>
                    </div>
                    <div className='col-8'>
                        <div className={classes.fieldColumn}>
                            <span className={classes.fieldStyle}>{t(langKeys.bond)}</span>
                            <span className={classes.marginB6}>{t(langKeys.addlinkdesc)}</span>
                            <FieldEdit
                                size="small"
                                label={''}
                                type="text"
                                valueDefault={getValues('url')}
                                onChange={(value) => setValue('url', value)}
                                error={typeof errors?.url?.message === 'string' ? errors?.url?.message : ''}
                                maxLength={60}
                                variant="outlined"
                            />
                        </div>
                    </div>
                    <div className='col-4' style={{paddingRight: 16}}>
                        <div className={classes.fieldColumn}>
                            <span className={classes.fieldStyle}>{t(langKeys.endDate)}</span>
                            <span className={classes.marginB6}>{t(langKeys.linkenddatedesc)}</span>
                            <FieldEdit
                                size="small"
                                label={''}
                                valueDefault={getValues('enddate')}
                                onChange={(value) => setValue('enddate', value)}
                                error={typeof errors?.enddate?.message === 'string' ? errors?.enddate?.message : ''}
                                type="date"
                                maxLength={60}
                                variant="outlined"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default LinkRegisterDetail;