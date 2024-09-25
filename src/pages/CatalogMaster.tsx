import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import FacebookLogin from "react-facebook-login";
import React, { FC, useEffect, useState } from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import TableZyx from '../components/fields/table-simple';

import { apiUrls } from "common/constants";
import { Box, FormControlLabel } from "@material-ui/core";
import { Dictionary, MultiData } from "@types";
import { Facebook as FacebookIcon, Search as SearchIcon } from "@material-ui/icons";
import { getCollection, getMultiCollection, resetAllMain, cleanMemoryTable, setMemoryTable } from 'store/main/actions';
import { getValuesFromDomain, metaCatalogSel, metaBusinessSel } from 'common/helpers';
import { IOSSwitch, TemplateIcons, TemplateBreadcrumbs, FieldEdit, FieldSelect, TitleDetail } from 'components';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core/styles';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { catalogBusinessList, catalogManageCatalog, resetCatalogBusinessList, catalogSynchroCatalog } from "store/catalog/actions";
import { CellProps } from 'react-table';

interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}

interface DetailProps {
    data: RowSelected;
    fetchData?: () => void;
    multiData: MultiData[];
    setViewSelected: (view: string) => void;
}

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(2),
    },
    containerDetail: {
        background: '#fff',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
}));

const IDCATALOGMASTER = "IDCATALOGMASTER";
const CatalogMaster: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const memoryTable = useSelector(state => state.main.memoryTable);
    const resultMain = useSelector(state => state.main);
    const resultManageCatalog = useSelector(state => state.catalog.requestCatalogManageCatalog);
    const resultSynchroCatalog = useSelector(state => state.catalog.requestCatalogSynchroCatalog);
    const user = useSelector(state => state.login.validateToken.user);
    const superadmin = (user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(v));

    const [businessId, setBusinessId] = useState(0);
    const [metaBusinessList, setMetaBusinessList] = useState<Dictionary[]>([]);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSynchronize, setWaitSynchronize] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'metacatalogid',
                isComponent: true,
                minWidth: 60,
                NoFilter: true,
                width: '1%',
                Cell: (props: any) => {
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
                accessor: 'catalogid',
                Header: t(langKeys.catalogid),
                NoFilter: true,
            },
            {
                accessor: 'catalogname',
                Header: t(langKeys.name),
                NoFilter: true,
            },
            {
                accessor: 'catalogdescription',
                Header: t(langKeys.description),
                NoFilter: true,
            },
            {
                accessor: 'catalogtype',
                Header: t(langKeys.type),
                NoFilter: true,
                prefixTranslation: 'type_domain_mastercatalog_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    if (row && row.original && row.original.catalogtype) {
                        const { catalogtype } = row.original;
                        return (t(`type_domain_mastercatalog_${catalogtype}`.toLowerCase()) || "").toUpperCase();
                    } else {
                        return "";
                    }
                }
            },
            {
                accessor: 'businessid',
                Header: t(langKeys.catalogmaster_businessid),
                NoFilter: true,
            },
            {
                accessor: 'businessname',
                Header: t(langKeys.catalogmaster_businessname),
                NoFilter: true,
            },
            {
                accessor: 'status',
                Header: t(langKeys.status),
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    if (row && row.original && row.original.status) {
                        const { status } = row.original;
                        return (t(`status_${status}`.toLowerCase()) || "").toUpperCase();
                    } else {
                        return "";
                    }
                }
            }
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(metaCatalogSel({ metabusinessid: businessId || 0, id: 0 })));

    useEffect(() => {
        fetchData();
        dispatch(setMemoryTable({
            id: IDCATALOGMASTER
        }));
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("TIPOCATALOGOMAESTRO"),
            metaBusinessSel({ id: 0 }),
        ]));

        return () => {
            dispatch(resetAllMain());
            dispatch(cleanMemoryTable());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!resultManageCatalog.loading && !resultManageCatalog.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                fetchData();
            } else if (resultManageCatalog.error) {
                const errormessage = t(resultManageCatalog.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resultManageCatalog, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(catalogManageCatalog({ ...row, operation: 'DELETE', status: 'ELIMINADO' }));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleSynchronize = (metabusinessid: any) => {
        const callback = () => {
            dispatch(catalogSynchroCatalog({ metabusinessid: metabusinessid }));
            dispatch(showBackdrop(true));
            setWaitSynchronize(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.catalogmaster_synchroalert),
            callback
        }))
    }

    useEffect(() => {
        if (waitSynchronize) {
            if (!resultSynchroCatalog.loading && !resultSynchroCatalog.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(resultSynchroCatalog.code || "success") }))
                dispatch(showBackdrop(false));
                fetchData();
                setWaitSynchronize(false);
            }
            else if (resultSynchroCatalog.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultSynchroCatalog.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitSynchronize(false);
            }
        }
    }, [resultSynchroCatalog, waitSynchronize])

    useEffect(() => {
        if (resultMain.multiData.data.length > 0) {
            if (resultMain.multiData.data[2] && resultMain.multiData.data[2].success) {
                setMetaBusinessList(resultMain.multiData.data[2].data || []);
            }
        }
    }, [resultMain.multiData.data])

    if (viewSelected === "view-1") {
        if (resultMain.mainData.error) {
            return <h1>ERROR</h1>;
        }
        return (
            <div style={{ width: "100%" }}>
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <Button
                                color="primary"
                                disabled={resultMain.mainData.loading}
                                onClick={() => { fetchData(); }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >{t(langKeys.search)}
                            </Button>
                            <FieldSelect
                                label={t(langKeys.catalogmaster_businesschoose)}
                                style={{ width: 300 }}
                                valueDefault={businessId}
                                variant="outlined"
                                optionDesc="businessname"
                                optionValue="metabusinessid"
                                data={metaBusinessList}
                                onChange={(value) => { setBusinessId(value?.metabusinessid || 0) }}
                            />
                            <Button
                                disabled={!businessId}
                                variant="contained"
                                color="primary"
                                style={{ width: 140, backgroundColor: "#55BD84" }}
                                startIcon={<RefreshIcon style={{ color: 'white' }} />}
                                onClick={() => { handleSynchronize(businessId) }}
                            >{t(langKeys.messagetemplate_synchronize)}
                            </Button>
                        </div>
                    )}
                    columns={columns}
                    data={resultMain.mainData.data}
                    download={true}
                    handleRegister={handleRegister}
                    loading={resultMain.mainData.loading}
                    onClickRow={handleEdit}
                    register={superadmin}
                    titlemodule={t(langKeys.catalogmaster)}
                    pageSizeDefault={IDCATALOGMASTER === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDCATALOGMASTER === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDCATALOGMASTER === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </div>
        )
    }
    else
        return (
            <CatalogMasterDetail
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={resultMain.multiData.data}
                fetchData={fetchData}
            />
        )
}

const CatalogMasterDetail: React.FC<DetailProps> = ({ data: { row, edit }, fetchData, multiData, setViewSelected }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const domainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const domainCatalogType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const resultBusinessList = useSelector(state => state.catalog.requestCatalogBusinessList);
    const resultManageCatalog = useSelector(state => state.catalog.requestCatalogManageCatalog);

    const [checkedCatalog, setCheckedCatalog] = useState(row ? row?.haslink : true);
    const [businessList, setBusinessList] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);
    const [waitBusiness, setWaitBusiness] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            catalogdescription: row?.catalogdescription || '',
            catalogid: row?.catalogid || '',
            catalogname: row?.catalogname || '',
            catalogtype: row?.catalogtype || '',
            description: row?.description || '',
            haslink: row ? row?.haslink : true,
            id: row?.metacatalogid || 0,
            metabusinessid: row ? row.metabusinessid : null,
            operation: row ? "EDIT" : "CREATE",
            status: row?.status || '',
            type: row?.type || '',
        }
    });

    React.useEffect(() => {
        register('catalogdescription');
        register('catalogid');
        register('catalogname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('catalogtype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description');
        register('haslink');
        register('id');
        register('metabusinessid', { validate: (value) => ((value || value === 0) && value >= 0) || t(langKeys.field_required) });
        register('operation');
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type');
    }, [register]);

    useEffect(() => {
        dispatch(catalogBusinessList({}));
        dispatch(showBackdrop(true));
        setWaitBusiness(true);

        return () => {
            dispatch(resetCatalogBusinessList());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!resultManageCatalog.loading && !resultManageCatalog.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
                fetchData && fetchData();
                setViewSelected("view-1");
            } else if (resultManageCatalog.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultManageCatalog.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() }) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resultManageCatalog, waitSave])

    useEffect(() => {
        if (waitBusiness) {
            if (!resultBusinessList.loading && !resultBusinessList.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setWaitBusiness(false);
                setBusinessList(resultBusinessList.data);
            } else if (resultBusinessList.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultBusinessList.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() }) }));
                dispatch(showBackdrop(false));
                setWaitBusiness(false);
            }
        }
    }, [resultBusinessList, waitBusiness])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(catalogManageCatalog(data));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const processFacebookCallback = async (facebookevent: any) => {
        if (facebookevent.status !== "unknown" && !facebookevent.error) {
            dispatch(catalogBusinessList({
                accesstoken: facebookevent.accessToken,
                appid: apiUrls.CATALOGAPP,
                graphdomain: facebookevent.graphDomain,
                userfullname: facebookevent.name,
                userid: facebookevent.id,
            }));
            dispatch(showBackdrop(true));
            setWaitBusiness(true);
        }
    }

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[
                                { id: "view-1", name: `${t(langKeys.catalogmaster)}` },
                                { id: "view-2", name: `${t(langKeys.catalogmaster_detail)}` }
                            ]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.catalogname}` : `${t(langKeys.new)} ${t(langKeys.catalogmaster)}`}
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
                <div className={classes.containerDetail}>
                    {(!row && checkedCatalog) && <div className="row-zyx" style={{ paddingBottom: "10px" }}>
                        <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>{t(langKeys.catalogmaster_businessalert)}</div>
                        <FacebookLogin
                            appId={`${apiUrls.CATALOGAPP}`}
                            autoLoad={false}
                            buttonStyle={{ margin: "auto", backgroundColor: "#7721ad", textTransform: "none", display: "flex", textAlign: "center", justifyItems: "center", alignItems: "center", justifyContent: "center" }}
                            fields="name,email,picture"
                            scope="business_management,catalog_management"
                            callback={processFacebookCallback}
                            textButton={t(langKeys.catalogmaster_businesslink)}
                            icon={<FacebookIcon style={{ color: "white", marginRight: "8px" }} />}
                            onClick={(e: any) => {
                                e.view.window.FB.init({
                                    appId: apiUrls.CATALOGAPP,
                                    cookie: true,
                                    xfbml: true,
                                    version: apiUrls.FACEBOOKVERSION,
                                });
                            }}
                            disableMobileRedirect={true}
                        />
                    </div>}
                    {row && <div className="row-zyx">
                        <FieldEdit
                            className="col-12"
                            disabled={row ? true : false}
                            error={errors?.catalogid?.message}
                            label={t(langKeys.catalogid)}
                            onChange={(value) => setValue('catalogid', value || '')}
                            valueDefault={row?.catalogid || ''}
                        />
                    </div>}
                    <div className="row-zyx">
                        <div className={"col-6"} style={{ paddingBottom: "3px" }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">
                                {t(langKeys.catalogmaster_haslink)}
                            </Box>
                            <FormControlLabel
                                label={""}
                                style={{ paddingLeft: 10 }}
                                control={
                                    <IOSSwitch
                                        checked={checkedCatalog}
                                        disabled={row ? true : false}
                                        onChange={(e) => {
                                            setCheckedCatalog(e.target.checked);
                                            setValue("haslink", e.target.checked);

                                            if (e.target.checked) {
                                                setValue("metabusinessid", null);
                                            }
                                            else {
                                                setValue("metabusinessid", 0);
                                            }
                                        }}
                                    />
                                }
                            />
                        </div>
                        <FieldSelect
                            className="col-6"
                            data={businessList}
                            disabled={row ? true : (checkedCatalog ? false : true)}
                            error={errors?.metabusinessid?.message}
                            label={t(langKeys.catalogmaster_businesschoose)}
                            onChange={(value) => setValue('metabusinessid', value?.metabusinessid || null)}
                            optionDesc="businessname"
                            optionValue="metabusinessid"
                            valueDefault={row?.metabusinessid || null}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.catalogname?.message}
                            label={t(langKeys.name)}
                            onChange={(value) => setValue('catalogname', value || '')}
                            valueDefault={row?.catalogname || ''}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.catalogdescription?.message}
                            label={t(langKeys.description)}
                            onChange={(value) => setValue('catalogdescription', value || '')}
                            valueDefault={row?.catalogdescription || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={domainCatalogType}
                            disabled={row ? true : false}
                            error={errors?.catalogtype?.message}
                            label={t(langKeys.type)}
                            onChange={(value) => setValue('catalogtype', value?.domainvalue || '')}
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                            prefixTranslation="type_domain_mastercatalog_"
                            uset={true}
                            valueDefault={row?.catalogtype || ''}
                        />
                        <FieldSelect
                            className="col-6"
                            data={domainStatus}
                            disabled={!edit}
                            error={errors?.status?.message}
                            label={t(langKeys.status)}
                            onChange={(value) => setValue('status', value?.domainvalue || '')}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            prefixTranslation="status_"
                            uset={true}
                            valueDefault={row?.status || ''}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CatalogMaster;