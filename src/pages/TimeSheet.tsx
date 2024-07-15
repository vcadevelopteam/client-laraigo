import { Box } from "@material-ui/core";
import { Dictionary, MultiData } from "@types";
import { DialogZyx, FieldEdit, FieldSelect, TemplateBreadcrumbs, TemplateIcons, TitleDetail } from "components";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { langKeys } from "lang/keys";
import { makeStyles } from "@material-ui/core/styles";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { Search } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useSelector } from "hooks";
import { Trans, useTranslation } from "react-i18next";
import { DownloadIcon } from 'icons';
import AddIcon from "@material-ui/icons/Add";

import {
    cleanMemoryTable,
    execute,
    getCollection,
    getMultiCollection,
    resetAllMain,
    setMemoryTable,
} from "store/main/actions";

import {
    dateToLocalDate,
    exportExcel,
    exportExcelCustom,
    getOrgSelList,
    getValuesFromDomainCorp,
    localesLaraigo,
    timeSheetIns,
    timeSheetProfileSel,
    timeSheetSel,
    timeSheetUserSel,
} from "common/helpers";

import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/Clear";
import DateFnsUtils from "@date-io/date-fns";
import React, { FC, Fragment, useEffect, useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import TableZyx from "components/fields/table-simple";

interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}

interface DetailProps {
    data: RowSelected;
    fetchData: () => void;
    multiData: MultiData[];
    organizationList: any[];
    profileList: any[];
    setViewSelected: (view: string) => void;
    userList: any[];
}

const arrayBread = (view1: string, view2: string) => [
    { id: "view-1", name: view1 },
    { id: "view-2", name: view2 },
];

const useStyles = makeStyles((theme) => ({
    btnButton: {
        flexBasis: 0,
        flexGrow: 0,
        minHeight: "30px",
        minWidth: "max-content",
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
    },
    buttonTitle: {
        marginRight: "0.25rem",
        width: "auto",
    },
    containerDetail: {
        background: "#fff",
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    headerText: {
        flexBasis: "200px",
        flexGrow: 1,
    },
    headerType: {
        flexBasis: "130px",
        flexGrow: 0,
        marginRight: "10px",
    },
    mb1: {
        marginBottom: "0.25rem",
    },
    mediabutton: {
        flexBasis: 0,
        flexGrow: 1,
        margin: theme.spacing(1),
        minHeight: "30px",
        opacity: 0.8,
        padding: 0,
        "&:hover": {
            opacity: 1,
        },
    },
}));

const IDTIMESHEET = "IDTIMESHEET";
const TimeSheet: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const memoryTable = useSelector((state) => state.main.memoryTable);
    const multiResult = useSelector((state) => state.main.multiData);
    const user = useSelector((state) => state.login.validateToken.user);
    const userRole = user?.roledesc ?? "";

    const [getInformation, setGetInformation] = useState(false);
    const [organizationList, setOrganizationList] = useState<any>([]);
    const [profileList, setProfileList] = useState<any>([]);
    const [userList, setUserList] = useState<any>([]);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitDelete, setWaitDelete] = useState(false);

    const [rowSelected, setRowSelected] = useState<RowSelected>({
        edit: false,
        row: null,
    });

    const [mainFilter, setMainFilter] = useState({
        all: true,
        corpid: 0,
        orgid: 0,
        startdate: null,
        timesheetid: 0,
    });

    useEffect(() => {
        fetchData();
        dispatch(setMemoryTable({ id: IDTIMESHEET }));

        if (!getInformation) {
            setGetInformation(true);
            dispatch(
                getMultiCollection([
                    getOrgSelList(0),
                    getValuesFromDomainCorp("CONSULTINGPROFILE", null, 1, 0),
                    timeSheetUserSel({ corpid: 0, orgid: 0 }),
                ])
            );
        }

        return () => {
            dispatch(resetAllMain());
            dispatch(cleanMemoryTable());
        };
    }, []);

    useEffect(() => {
        if (!multiResult.loading && getInformation) {
            setGetInformation(false);
            setOrganizationList(multiResult.data[0] && multiResult.data[0].success ? multiResult.data[0].data : []);
            setProfileList(multiResult.data[1] && multiResult.data[1].success ? multiResult.data[1].data : []);
            setUserList(multiResult.data[2] && multiResult.data[2].success ? multiResult.data[2].data : []);
        }
    }, [multiResult, getInformation]);

    useEffect(() => {
        if (waitDelete) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                dispatch(showBackdrop(false));
                setWaitDelete(false);
                fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.timesheet).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [executeResult, waitDelete]);

    const fetchData = () => dispatch(getCollection(timeSheetSel(mainFilter)));

    const columns = React.useMemo(
        () => [
            {
                accessor: "id",
                isComponent: true,
                minWidth: 60,
                NoFilter: true,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons deleteFunction={() => handleDelete(row)} editFunction={() => handleEdit(row)} />
                    );
                },
            },
            {
                accessor: "startdate",
                Header: t(langKeys.timesheet_startdate),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return <div>{dateToLocalDate(row.startdate)}</div>;
                },
            },
            {
                accessor: "startuser",
                Header: t(langKeys.timesheet_startuser),
                NoFilter: true,
            },
            {
                accessor: "registerdate",
                Header: t(langKeys.timesheet_registerdate),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return <div>{dateToLocalDate(row.registerdate)}</div>;
                },
            },
            {
                accessor: "registeruser",
                Header: t(langKeys.timesheet_registeruser),
                NoFilter: true,
            },
            {
                accessor: "orgdescription",
                Header: t(langKeys.timesheet_organization),
                NoFilter: true,
            },
            {
                accessor: "registerprofile",
                Header: t(langKeys.timesheet_registerprofile),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (t(`${row.registerprofile}`.toLowerCase()) || "").toUpperCase();
                },
            },
            {
                accessor: "timeduration",
                Header: t(langKeys.timesheet_timeduration),
                type: "time",
                NoFilter: true,
            },
            {
                accessor: "registerdetail",
                Header: t(langKeys.timesheet_registerdetail),
                NoFilter: true,
                Cell: (props: any) => {
                    const { registerdetail } = props.cell.row.original || {};
                    return (
                        <Fragment>
                            <div style={{ display: "inline-block" }}>{(registerdetail || "").substring(0, 50)}... </div>
                        </Fragment>
                    );
                },
            },
            {
                accessor: "status",
                Header: t(langKeys.status),
                NoFilter: true,
                prefixTranslation: "status_",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (t(`status_${row.status}`.toLowerCase()) || "").toUpperCase();
                },
            },
        ],
        []
    );

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(timeSheetIns({ ...row, operation: "DELETE", status: "ELIMINADO" })));
            dispatch(showBackdrop(true));
            setWaitDelete(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_delete),
                visible: true,
            })
        );
    };

    const columnsExcel = React.useMemo(
        () => [         
            {
                Header: t(langKeys.timesheet_startdate),
                accessor: "startdate",
                NoFilter: true,   
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return <div>{dateToLocalDate(row.startdate)}</div>;
                },       
            },
            {
                Header: t(langKeys.timesheet_startuser),
                accessor: "startuser",
                NoFilter: true,               
            },
            {
                Header: t(langKeys.timesheet_registerdate),
                accessor: "registerdate",
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return <div>{dateToLocalDate(row.registerdate)}</div>;
                },
            },
            {
                Header: t(langKeys.timesheet_registeruser),
                accessor: "registeruser",
                NoFilter: true
            },
            {
                Header: t(langKeys.timesheet_organization),
                accessor: "orgdescription",
                NoFilter: true
            },
            {
                Header: t(langKeys.timesheet_registerprofile),
                accessor: "registerprofile",
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (t(`${row.registerprofile}`.toLowerCase()) || "").toUpperCase();
                },
            },
            {
                Header: t(langKeys.timesheet_timeduration),
                accessor: "timeduration",
                type: "time",
                NoFilter: true
            },
            {
                Header: t(langKeys.timesheet_registerdetail),
                accessor: "registerdetail",
                NoFilter: true,
                Cell: (props: any) => {
                    const { registerdetail } = props.cell.row.original || {};
                    return (
                        <Fragment>
                            <div style={{ display: "inline-block" }}>{(registerdetail || "").substring(0, 50)}... </div>
                        </Fragment>
                    );
                },
            },
            {
                Header: t(langKeys.status),
                accessor: "status",
                NoFilter: true,
                prefixTranslation: "status_",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (t(`status_${row.status}`.toLowerCase()) || "").toUpperCase();
                },
            },                    
        ],
        []
    );

    const handleDownload = () => {
        exportExcel('Horas Consultoría Reporto', mainResult.mainData.data, columnsExcel)    
    };    

    if (viewSelected === "view-1") {
        if (mainResult.mainData.error || !userRole?.includes("SUPERADMIN")) {
            return <h1>ERROR</h1>;
        } else {
            return (
                <>

                   
                    <TableZyx 
                        ButtonsElement={() => (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 10 }}>
                                <MuiPickersUtilsProvider
                                    locale={localesLaraigo()[navigator.language.split("-")[0]]}
                                    utils={DateFnsUtils}
                                >
                                    <KeyboardDatePicker
                                        defaultValue={mainFilter.startdate}
                                        format="dd-MM-yyyy"
                                        InputProps={{ disableUnderline: true }}
                                        invalidDateMessage={""}
                                        placeholder={t(langKeys.timesheet_startdate)}
                                        value={mainFilter.startdate}
                                        onChange={(value: any) =>
                                            setMainFilter((prev) => ({ ...prev, startdate: value || null }))
                                        }
                                        style={{
                                            border: "1px solid #bfbfc0",
                                            borderRadius: 4,
                                            color: "rgb(143, 146, 161)",
                                            paddingBottom: "3px",
                                            paddingLeft: "12px",
                                            paddingTop: "3px",
                                            width: 260,
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                                <FieldSelect
                                    data={organizationList || []}
                                    label={t(langKeys.timesheet_organization)}
                                    onChange={(value: any) =>
                                        setMainFilter((prev) => ({ ...prev, orgid: value?.orgid || 0 }))
                                    }
                                    optionDesc="orgdesc"
                                    optionValue="orgid"
                                    orderbylabel={true}
                                    style={{ width: 260 }}
                                    valueDefault={mainFilter.orgid}
                                    variant="outlined"
                                />
                                <Button
                                    color="primary"
                                    disabled={mainResult.mainData.loading}
                                    startIcon={<Search style={{ color: "white" }} />}
                                    style={{ width: 120, backgroundColor: "#55BD84" }}
                                    variant="contained"
                                    onClick={() => {
                                        fetchData();
                                    }}
                                >
                                    {t(langKeys.search)}
                                </Button>
                                <Button
                                    color="primary"                                    
                                    startIcon={<AddIcon style={{ color: "white" }} />}
                                    style={{ width: 120, backgroundColor: "#55BD84" }}
                                    variant="contained"
                                    onClick={handleRegister}
                                >
                                    {t(langKeys.register)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"  
                                    disabled={mainResult.mainData.loading}                            
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownload}                                       
                                >
                                    <Trans i18nKey={langKeys.download} />
                                </Button>                              
                            </div>
                        )}
                        columns={columns}
                        data={mainResult.mainData.data}
                        download={false}
                        filterGeneral={false}
                        hoverShadow={true}
                        loading={mainResult.mainData.loading}
                        onClickRow={handleEdit}
                        titlemodule={t(langKeys.timesheet)}
                        initialPageIndex={
                            IDTIMESHEET === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                        }
                        initialStateFilter={
                            IDTIMESHEET === memoryTable.id
                                ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                                : undefined
                        }
                        pageSizeDefault={
                            IDTIMESHEET === memoryTable.id ? (memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize) : 20
                        }
                    />
                </>
            );
        }
    } else
        return (
            <DetailTimeSheet
                data={rowSelected}
                fetchData={() => fetchData()}
                multiData={mainResult.multiData.data}
                organizationList={organizationList}
                profileList={profileList}
                setViewSelected={setViewSelected}
                userList={userList}
            />
        );
};

const DetailTimeSheet: React.FC<DetailProps> = ({
    data: { row, edit },
    fetchData,
    organizationList,
    profileList,
    setViewSelected,
    userList,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const multiResult = useSelector((state) => state.main.multiData);
    const user = useSelector((state) => state.login.validateToken.user);

    const userAvailable = (userList || []).filter((data) => data.userid === (user?.userid ?? 0))
        ? user?.userid ?? 0
        : 0;

    const [hasChange, setHasChange] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [profileAllowed, setProfileAllowed] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);

    const {
        formState: { errors },
        getValues,
        handleSubmit,
        register,
        setValue,
        trigger,
    } = useForm({
        defaultValues: {
            corpid: row?.corpid || (user?.corpid ?? 0),
            description: row?.description || "",
            id: row ? row.id : 0,
            operation: row ? "EDIT" : "INSERT",
            orgid: row?.orgid || (user?.orgid ?? 0),
            registerdate: row?.registerdate || new Date(),
            registerdetail: row?.registerdetail || "",
            registerprofile: row?.registerprofile || "",
            registeruserid: row ? row.registeruserid : userAvailable,
            startdate: row?.startdate || new Date(),
            startuserid: row ? row.startuserid : userAvailable,
            status: row?.status || "ACTIVO",
            timeduration: row?.timeduration || null,
            type: row?.type || "",
        },
    });

    useEffect(() => {
        getProfileAllowed(
            row?.corpid || (user?.corpid ?? 0),
            row?.orgid || (user?.orgid ?? 0),
            row?.startdate || new Date()
        );
    }, [row]);

    useEffect(() => {
        if (!multiResult.loading) {
            setProfileAllowed(multiResult.data[0] && multiResult.data[0].success ? multiResult.data[0].data : []);
        }
    }, [multiResult]);

    React.useEffect(() => {
        register("corpid");
        register("description");
        register("id");
        register("operation");
        register("orgid", { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register("registerdate", { validate: (value) => (value && value != null) || t(langKeys.field_required) });
        register("registerdetail", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("registerprofile", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("registeruserid", { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register("startdate", { validate: (value) => (value && value != null) || t(langKeys.field_required) });
        register("startuserid", { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register("status");
        register("timeduration", { validate: (value) => (value && value != null) || t(langKeys.field_required) });
        register("type");
    }, [edit, register]);

    const getProfileAllowed = (corpid: any, orgid: any, startdate: any) => {
        dispatch(
            getMultiCollection([
                timeSheetProfileSel({
                    corpid: corpid,
                    orgid: orgid,
                    startdate: startdate,
                }),
            ])
        );
    };

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(timeSheetIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        );
    });

    const onModalSuccess = () => {
        setOpenModal(false);
        setViewSelected("view-1");
        fetchData && fetchData();
    };

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }));
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
                fetchData && fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.timesheet).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    return (
        <div style={{ width: "100%" }}>
            <TimeSheetModal openModal={openModal} setOpenModal={setOpenModal} onTrigger={onModalSuccess} />
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            handleClick={setViewSelected}
                            breadcrumbs={arrayBread(t(langKeys.timesheet), t(langKeys.timesheet_detail))}
                        />
                        {row && <TitleDetail title={t(langKeys.timesheet)} />}
                        {!row && <TitleDetail title={t(langKeys.timesheet_new)} />}
                    </div>
                    <div
                        style={{
                            alignItems: "center",
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        <Button
                            color="primary"
                            onClick={() => {
                                if (hasChange) {
                                    setOpenModal(true);
                                } else {
                                    setViewSelected("view-1");
                                }
                            }}
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            type="button"
                            variant="contained"
                        >
                            {t(langKeys.back)}
                        </Button>
                        <Button
                            className={classes.button}
                            color="primary"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            type="submit"
                            variant="contained"
                        >
                            {t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <div className="col-6">
                            <MuiPickersUtilsProvider
                                locale={localesLaraigo()[navigator.language.split("-")[0]]}
                                utils={DateFnsUtils}
                            >
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    {t(langKeys.timesheet_startdate)}
                                </Box>
                                <KeyboardDatePicker
                                    className="col-6"
                                    defaultValue={row?.startdate}
                                    disabled={!edit}
                                    error={errors?.startdate?.message}
                                    format="dd-MM-yyyy"
                                    invalidDateMessage={t(langKeys.invalid_date_format)}
                                    placeholder={t(langKeys.timesheet_startdate)}
                                    style={{ width: "100%" }}
                                    value={getValues("startdate")}
                                    onChange={(value: any) => {
                                        setValue("startdate", value || null);
                                        trigger("startdate");
                                        setHasChange(true);
                                        getProfileAllowed(getValues("corpid"), getValues("orgid"), value);
                                        setValue("registerprofile", "");
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <FieldSelect
                            className="col-6"
                            data={userList || []}
                            disabled={!edit}
                            error={errors?.startuserid?.message}
                            label={t(langKeys.timesheet_startuser)}
                            optionDesc="usr"
                            optionValue="userid"
                            orderbylabel={true}
                            valueDefault={getValues("startuserid")}
                            onChange={(value: any) => {
                                setValue("startuserid", value?.userid || 0);
                                setHasChange(true);
                            }}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-6">
                            <MuiPickersUtilsProvider
                                locale={localesLaraigo()[navigator.language.split("-")[0]]}
                                utils={DateFnsUtils}
                            >
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    {t(langKeys.timesheet_registerdate)}
                                </Box>
                                <KeyboardDatePicker
                                    className="col-6"
                                    defaultValue={row?.registerdate}
                                    disabled={!edit}
                                    error={errors?.registerdate?.message}
                                    format="dd-MM-yyyy"
                                    invalidDateMessage={t(langKeys.invalid_date_format)}
                                    placeholder={t(langKeys.timesheet_registerdate)}
                                    style={{ width: "100%" }}
                                    value={getValues("registerdate")}
                                    onChange={(value: any) => {
                                        setValue("registerdate", value || null);
                                        trigger("registerdate");
                                        setHasChange(true);
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <FieldSelect
                            className="col-6"
                            data={userList || []}
                            disabled={!edit}
                            error={errors?.registeruserid?.message}
                            label={t(langKeys.timesheet_registeruser)}
                            optionDesc="usr"
                            optionValue="userid"
                            orderbylabel={true}
                            valueDefault={getValues("registeruserid")}
                            onChange={(value: any) => {
                                setValue("registeruserid", value?.userid || 0);
                                setHasChange(true);
                            }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={organizationList || []}
                            disabled={!edit}
                            error={errors?.orgid?.message}
                            label={t(langKeys.timesheet_organization)}
                            optionDesc="orgdesc"
                            optionValue="orgid"
                            orderbylabel={true}
                            valueDefault={getValues("orgid")}
                            onChange={(value: any) => {
                                setValue("corpid", value?.corpid || 0);
                                setValue("orgid", value?.orgid || 0);
                                setHasChange(true);
                                getProfileAllowed(value?.corpid || 0, value?.orgid || 0, getValues("startdate"));
                                setValue("registerprofile", "");
                            }}
                        />
                        <FieldSelect
                            className="col-6"
                            data={profileList.filter(function (item) {
                                return ((profileAllowed || [])[0]?.consultingprofile || "").includes(
                                    item?.domainvalue || ""
                                );
                            })}
                            disabled={!edit}
                            error={errors?.registerprofile?.message}
                            label={t(langKeys.timesheet_registerprofile)}
                            loading={multiResult.loading}
                            onChange={(value) => setValue("registerprofile", value?.domainvalue || "")}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            orderbylabel={true}
                            uset={true}
                            valueDefault={getValues("registerprofile")}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.timeduration?.message}
                            label={t(langKeys.timesheet_timeduration)}
                            onChange={(value: any) => {
                                setValue("timeduration", value || null);
                                setHasChange(true);
                            }}
                            size="small"
                            type="time"
                            valueDefault={getValues("timeduration")}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.registerdetail?.message}
                            label={t(langKeys.timesheet_registerdetail)}
                            onChange={(value) => {
                                setValue("registerdetail", value);
                                setHasChange(true);
                            }}
                            size="small"
                            valueDefault={getValues("registerdetail")}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

const TimeSheetModal: FC<{
    openModal: boolean;
    setOpenModal: (param: any) => void;
    onTrigger: () => void;
}> = ({ openModal, setOpenModal, onTrigger }) => {
    const { t } = useTranslation();

    const classes = useStyles();

    return (
        <DialogZyx
            button2Type="button"
            buttonText1={t(langKeys.modal_changevalidation_yes)}
            buttonText2={t(langKeys.modal_changevalidation_no)}
            handleClickButton1={() => onTrigger()}
            handleClickButton2={() => setOpenModal(false)}
            open={openModal}
            title={t(langKeys.modal_changevalidation_title)}
        >
            <div className={classes.containerDetail}>
                <span>{t(langKeys.modal_changevalidation_description)}</span>
            </div>
        </DialogZyx>
    );
};

export default TimeSheet;