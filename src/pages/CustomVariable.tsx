/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TableZyx from '../components/fields/table-simple';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { DialogZyx, TemplateIcons, TemplateBreadcrumbs, FieldView, FieldEdit, FieldSelect } from 'components';
import { getValuesFromDomain, getCustomVariableSel, getCustomVariableSelByTableName, insCustomVariable, getDomainSel } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, getCollectionAux, resetMainAux, resetAllMain, getMultiCollectionAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Tooltip } from '@material-ui/core';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

interface RowSelected {
    row: Dictionary | null;
    domainname: string | "";
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData?: () => void;
    arrayBread: any;
}

interface ModalProps {
    data: RowSelected;
    dataDomain: Dictionary[] | null;
    mainRow: any;
    openModal: boolean;
    multiData: MultiData[];
    setOpenModal: (open: boolean) => void;
    updateRecords?: (record: any) => void;
}


const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),       
        padding: theme.spacing(2),
        background: "#fff",
    },
    button: {
        marginRight: theme.spacing(2),
    },
    title: {
        fontSize: "22px",
        color: theme.palette.text.primary,
    },
    subtitle: {
        fontSize: "20px",
        color: theme.palette.text.primary,
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    }
}));

const DetailValue: React.FC<ModalProps> = ({ data: { row, domainname, edit }, dataDomain,mainRow, openModal,multiData, setOpenModal, updateRecords }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const { register, handleSubmit, setValue, formState: { errors }, reset, getValues } = useForm();
    const [showDomains, setShowDomains] = useState(row?.variabletype === "domain");
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDomainList = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const onSubmit = handleSubmit((data) => {
        if (!edit && dataDomain && dataDomain.some(d => d.variablename === data.variablename)) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.code_duplicate) }))
        }
        else {     
            if (edit)
                updateRecords && updateRecords((p: Dictionary[]) => p.map(x => x.variablename === row?.variablename || '' ? { ...x, ...data, operation: (x.operation || "UPDATE") } : x));
            else
                updateRecords && updateRecords((p: Dictionary[]) => [...p, { ...data, org_name: user?.orgdesc || '', status: row?.status || 'ACTIVO', operation: "INSERT" }]);

            setOpenModal(false);
        }
    });

    useEffect(() => {
        if (openModal) {
            reset({
                id: row?.customvariableid || 0,
                description: row?.description || '',
                variablename: row?.variablename || '',
                variabletype: row?.variabletype || '',
                domainname: row?.domainname || '',
                status: row?.status || 'ACTIVO',
            })
            setShowDomains(row?.variabletype === "domain")
        }
    }, [openModal])
    useEffect(() => {
        if (openModal) {
            register('domainname', { validate: (value) => (showDomains?((value && value.length) || t(langKeys.field_required)):true) });
            register('description', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
            register('variablename', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
            register('variabletype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
            register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
            register('id');
        }
    }, [openModal,showDomains])

    return (
        <DialogZyx
            open={openModal}
            title={`${t(langKeys.register)} ${t(langKeys.customvariable)}` }
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
            maxWidth="lg"
        >
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.app)}
                    disabled={true}
                    className="col-3"
                    valueDefault={t(`${mainRow.application_name}`.toLowerCase())}
                    onChange={(value) => setValue('domainname', value)}
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.custom_field)}
                    disabled={edit ? true : false}
                    className="col-3"
                    valueDefault={getValues('variablename')}
                    onChange={(value) => setValue('variablename', value)}
                    error={errors?.variablename?.message}
                />
                <FieldEdit
                    label={t(langKeys.description)}
                    className="col-3"
                    valueDefault={getValues('description')}
                    onChange={(value) => setValue('description', value)}
                    error={errors?.description?.message}
                />   
                <FieldSelect
                    label={t(langKeys.datatype)}
                    className="col-3"
                    valueDefault={getValues('variabletype')}
                    onChange={(value) => { setValue('variabletype', value?.domainvalue||'');
                        setValue('domainname', '');
                        setShowDomains(value?.domainvalue === "domain")
                     }}
                    error={errors?.variabletype?.message}
                    data={[
                        {domaindesc: "ENTEROS", domainvalue:"number"},
                        {domaindesc: "ALFANUMÉRICO", domainvalue:"string"},
                        {domaindesc: "FECHA Y HORA", domainvalue:"datetime-local"},
                        {domaindesc: "DOMINIO", domainvalue:"domain"},
                    ]}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />                             
                {showDomains && <FieldSelect
                    label={t(langKeys.domainname)}
                    className="col-3"
                    valueDefault={getValues('domainname')}
                    onChange={(value) => { setValue('domainname', value ? value.domainname : ''); }}
                    error={errors?.domainname?.message}
                    data={dataDomainList}
                    optionDesc="domainname"
                    optionValue="domainname"
                />  }                          
                <FieldSelect
                    label={t(langKeys.status)}
                    className="col-3"
                    valueDefault={row?.status || "ACTIVO"}
                    onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                    error={errors?.status?.message}
                    data={dataDomainStatus}
                    optionDesc="domaindesc"
                    uset={true}
                    prefixTranslation="status_"
                    optionValue="domainvalue"
                />
            </div>
        </DialogZyx>
    );
}

const DetailCustomVariable: React.FC<DetailProps> = ({ data: { row, domainname, edit }, setViewSelected, multiData, fetchData, arrayBread }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const detailRes = useSelector(state => state.main.mainAux);
    const [dataDomain, setdataDomain] = useState<Dictionary[]>([]);
    const [domainToDelete, setDomainToDelete] = useState<Dictionary[]>([]);
    const [openDialogDomain, setOpenDialogDomain] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, domainname: "", edit: false });

    const columns = React.useMemo(
        () => [
            {
                accessor: 'customvariableapplicationid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    if (!edit)
                        return null;
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.customvariable),
                accessor: 'variablename',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.datatype),
                accessor: 'variabletype',
                NoFilter: true,
                prefixTranslation: 'datatype_',
                Cell: (props: any) => {
                    const { variabletype } = props.cell.row.original || {}; 
                    return (t(`datatype_${variabletype}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.organization),
                accessor: 'org_name',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                prefixTranslation: 'status_',
                accessor: 'status',
                NoFilter: true
            }
        ],
        []
    );

    useEffect(() => {
        if (!detailRes.loading && !detailRes.error) {
            setdataDomain(detailRes.data);
        }
    }, [detailRes]);

    const handleRegister = () => {
        setOpenDialogDomain(true)
        setRowSelected({ row:null, domainname:"", edit: false })
    }

    const handleDelete = (row: Dictionary) => {
        if (row && row.operation !== "INSERT") {
            setDomainToDelete(p => [...p, { ...row, operation: "DELETE", status: 'ELIMINADO' }]);
        } else {
            row.operation = 'DELETE';
        }

        setdataDomain(p => p.filter(x => (row.operation === "DELETE" ? x.operation !== "DELETE" : row.customvariableid !== x.customvariableid)));
    }

    const handleEdit = (row: Dictionary) => {
        setOpenDialogDomain(true)
        setRowSelected({ row, domainname, edit: true })
    }

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.customvariableapplicationid || 0,
            operation: row ? "EDIT" : "INSERT",
            description: row?.description || '',
            corporation: row?.corpdesc || '',
            organization: row?.orgdesc || '',
            domainname: row?.domainname || '',
            type: row?.type || '',
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

        dispatch(resetMainAux());
        dispatch(getCollectionAux(getCustomVariableSelByTableName((row?.table_name || ""), row?.customvariableapplicationid)));
    }, [register]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(getMultiCollectionAux([
                    ...dataDomain.filter(x => !!x.operation).map(x => insCustomVariable({ ...row, ...x, id: x?.customvariableid||0 })),
                    ...domainToDelete.map(x => insCustomVariable({ ...x, id: x.customvariableid, operation: "UPDATE"}))
                ]
            ));

            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.detail)} ${t(langKeys.customvariables)}` }]}
                            handleClick={setViewSelected}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}>
                            {t(langKeys.back)}
                        </Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    
                    <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
                        <div className={classes.title}> {t(langKeys.customvariables) + " de " + t(`${row.application_name}`.toLowerCase())}</div>
                        
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            label={t(langKeys.app)}
                            value={t(`${row.application_name}`.toLowerCase())}
                            className="col-6"
                            />
                        <FieldView
                            label={t(langKeys.description)}
                            value={t(langKeys.customvariabledesc) + t(`${row.application_name}`.toLowerCase())}
                            className="col-6"
                        />
                    </div>
                </div>
            </form>

            <div className={classes.containerDetail}>
                <div className={classes.subtitle}> {t(langKeys.customvariableslist)}
                        <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.customvariableslist_helper)}</div>} arrow placement="top" >
                            <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                        </Tooltip>
                </div>
                {detailRes.error ? <h1>ERROR</h1> : (
                    <TableZyx
                        columns={columns}
                        data={dataDomain}
                        download={false}
                        onClickRow={handleEdit}
                        loading={detailRes.loading}
                        filterGeneral={false}
                        register={true}
                        handleRegister={handleRegister}
                        pageSizeDefault={10}
                    />
                )}
            </div>
            <DetailValue
                data={rowSelected}
                openModal={openDialogDomain}
                setOpenModal={setOpenDialogDomain}
                updateRecords={setdataDomain}
                mainRow={row}
                dataDomain={dataDomain}
                multiData={multiData}
            />
        </div>
    );
}

const CustomVariable: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, domainname: "", edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [dataTable, setDataTable] = useState<Dictionary[]>([]);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.customvariables) },
    ];
    function redirectFunc(view: string) {
        setViewSelected(view)
    }
    const columns = React.useMemo(
        () => [
            {
                accessor: 'customvariableapplicationid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: () => {
                    return (
                        <></>
                    )
                }
            },
            {
                Header: t(langKeys.app),
                accessor: 'application_name_t',
                helpText: t(langKeys.application_helper),
                NoFilter: true,
            },
            {
                Header: t(langKeys.description),
                accessor: 'description_t',
                NoFilter: true,
            },
            {
                Header: t(langKeys.organization),
                accessor: 'org_name',
                NoFilter: true,
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original || {}; 
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            }
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getCustomVariableSel()));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("TIPODOMINIO"),
            getDomainSel("")
        ]));

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if(!mainResult.mainData.loading && !mainResult.mainData.error){
            const changeddata = mainResult.mainData.data.map(x=>({...x,
                application_name_t: t(`${x.application_name}`.toLowerCase()) || "",
                description_t: t(langKeys.customvariabledesc) + t(`${x.application_name}`.toLowerCase()) || ""
            }))
            setDataTable(changeddata)
        }
    }, [mainResult]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, domainname: row.domainname, edit: true });
    }

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.customvariables)}
                    helperText={t(langKeys.custom_fields_helper)}
                    data={dataTable}
                    download={true}
                    onClickRow={handleEdit}
                    loading={mainResult.mainData.loading}
                    register={false}
                />
            </div>
        )
    }
    else
        return (
            <DetailCustomVariable
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
}

export default CustomVariable;