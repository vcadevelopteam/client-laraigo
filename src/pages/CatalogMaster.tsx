/* TODO: añadir la implementación con meta */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TableZyx from '../components/fields/table-simple';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons, TemplateBreadcrumbs, FieldEdit, FieldSelect, TitleDetail } from 'components';
import { getDomainValueSel, getDomainSel, getValuesFromDomain, insDomain, insDomainvalue } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, getCollectionAux, resetMainAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';

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
}

interface ModalProps {
    data: RowSelected;
    dataDomain: Dictionary[] | null;
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    updateRecords?: (record: any) => void;
}


const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        marginRight: theme.spacing(2),
    }
}));

const DetailDomains: React.FC<DetailProps> = ({ data: { row, domainname, edit }, setViewSelected, multiData, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const useradmin = ["ADMINISTRADOR","ADMINISTRADOR P"].includes(user?.roledesc || '');
    const newrow = row===null
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const detailRes = useSelector(state => state.main.mainAux);
    const [dataDomain, setdataDomain] = useState<Dictionary[]>([]);
    const [domainToDelete, setDomainToDelete] = useState<Dictionary[]>([]);
    const [openDialogDomain, setOpenDialogDomain] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, domainname: "", edit: false });
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDomainType = multiData[0] && multiData[1].success ? (useradmin?multiData[1].data.filter(x=>x.domainvalue === "BOT"):multiData[1].data) : [];

    const columns = React.useMemo(
        () => [
            {
                accessor: 'domainid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    if (!edit)
                        return null;
                    const row = props.cell.row.original;
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
                Header: t(langKeys.code),
                accessor: 'domainvalue',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'domaindesc',
                NoFilter: true
            },
            /*{
                Header: t(langKeys.bydefault),
                accessor: 'bydefault',
                NoFilter: true,
                Cell: (prop: any) => {
                    const row = prop.cell.row.original;
                    const val = (row ? (row.bydefault ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative))
                    return val;
                }
            },*/
            {
                Header: t(langKeys.organization),
                accessor: 'organization',
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
        setRowSelected({ row, domainname, edit: false });
    }

    const handleDelete = (row: Dictionary) => {
        if (row && row.operation !== "INSERT") {
            setDomainToDelete(p => [...p, { ...row, operation: "DELETE", status: 'ELIMINADO' }]);
        } else {
            row.operation = 'DELETE';
        }

        setdataDomain(p => p.filter(x => (row.operation === "DELETE" ? x.operation !== "DELETE" : row.domainid !== x.domainid)));
    }

    const handleView = (row: Dictionary) => {
        setOpenDialogDomain(true)
        setRowSelected({ row, domainname, edit: false })
    }

    const handleEdit = (row: Dictionary) => {
        setOpenDialogDomain(true)
        setRowSelected({ row, domainname, edit: true })
    }

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.domainid || 0,
            operation: row ? "EDIT" : "INSERT",
            description: row?.description || '',
            corporation: row?.corpdesc || '',
            organization: row?.orgdesc || '',
            name: row?.name || '',
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
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });

        dispatch(resetMainAux());
        dispatch(getCollectionAux(getDomainValueSel((row?.name || ""))));
    }, [register]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute({
                header: insDomain({ ...data }),
                detail: [
                    ...dataDomain.filter(x => !!x.operation).map(x => insDomainvalue({ ...data, ...x, status: data?.status, id: x.domainid ? x.domainid : 0 })),
                    ...domainToDelete.map(x => insDomainvalue({ ...x, id: x.domainid, description: data.description, type: data.type }))
                ]
            }, true));

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
        <div style={{width: "100%"}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[
                                { id: "view-1", name: `${t(langKeys.catalogmaster)}` },
                                { id: "view-2", name: `${t(langKeys.catalogmaster)} ${t(langKeys.detail)}` }
                            ]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.name}` : `${t(langKeys.new)} ${t(langKeys.catalogmaster)}`}
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
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}>
                                {t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.name)}
                            disabled={row ? true : false}
                            className="col-6"
                            valueDefault={row?.name || ""}
                            onChange={(value) => setValue('name', value)}
                            error={errors?.name?.message}
                        /> 
                        <FieldEdit
                            label={t(langKeys.description)}
                            className="col-6"
                            valueDefault={row?.description || ""}
                            onChange={(value) => setValue('description', value)}
                            error={errors?.description?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.type)}
                            className="col-6"
                            valueDefault={row?.type || ""}
                            onChange={(value) => setValue('type', value ? value.domainvalue : '')}
                            error={errors?.type?.message}
                            data={dataDomainType}
                            uset={true}
                            prefixTranslation="type_domain_mastercatalog_"
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                        /> 
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
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
                </div>
            </form>
        </div>
    );
}

const CatalogMaster: FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, domainname: "", edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const user = useSelector(state => state.login.validateToken.user);
    const superadmin = ["SUPERADMIN","ADMINISTRADOR","ADMINISTRADOR P"].includes(user?.roledesc || '');

    function redirectFunc(view:string){
        if(view ==="view-0"){
            history.push(paths.CONFIGURATION)
            return;
        }
        setViewSelected(view)
    }
    const columns = React.useMemo(
        () => [
            {
                accessor: 'domainid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
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
                Header: t(langKeys.name),
                accessor: 'domainname',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true,
                prefixTranslation: 'type_domain_mastercatalog_',
                Cell: (props: any) => {
                    const { type } = props.cell.row.original;
                    return (t(`type_domain_mastercatalog_${type}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            }
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getDomainSel('')));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("TIPOCATALOGOMAESTRO")
        ]));

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

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

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, domainname: "", edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, domainname: row.domainname, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, domainname: row.domainname, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insDomain({ ...row, operation: 'DELETE', status: 'ELIMINADO' })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <div style={{width:"100%"}}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.catalogmaster)}
                    data={mainResult.mainData.data}
                    download={true}
                    onClickRow={handleEdit}
                    loading={mainResult.mainData.loading}
                    register={superadmin}
                    handleRegister={handleRegister}
            />
            </div>
        )
    }
    else
        return (
            <DetailDomains
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
}

export default CatalogMaster;