import React, { useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { FieldEdit, TemplateBreadcrumbs } from 'components';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';

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

    const arrayBread = [
        { id: "crm", name: t(langKeys.app_crm) },
        { id: "main-view", name: t(langKeys.linkregister) },
        { id: "detail-view", name: `${t(langKeys.linkregister)} ${t(langKeys.detail)}` },
    ];
    
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.partnerid : 0,
            name: row?.name || "",
            url: row?.url || "",
            startdate: row?.startdate || '',
            enddate: row?.enddate || '',
            status: row?.status || 'ACTIVO',
            type: row?.type || '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    React.useEffect(() => {
        register('id');
        register('status');
        register('type');
        register('operation');
    }, [register, setValue]);

    return (
        <>
            <form onSubmit={()=>{}} className={classes.mainComponent}>
                <div className={classes.header}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                        <div className={classes.formTitle}>{t(langKeys.linkregister)}</div>
                    </div>
                    <div className={classes.headerButtons}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("main-view")}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}>
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