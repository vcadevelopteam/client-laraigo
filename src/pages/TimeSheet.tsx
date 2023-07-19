import { Dictionary, MultiData } from "@types";
import { FieldEdit, FieldSelect, TemplateBreadcrumbs, TemplateIcons, TitleDetail } from "components";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { langKeys } from "lang/keys";
import { makeStyles } from "@material-ui/core/styles";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { Search } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

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
    getOrgSelList,
    localesLaraigo,
    timeSheetIns,
    timeSheetSel,
    timeSheetUserSel,
} from "common/helpers";

import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/Clear";
import DateFnsUtils from "@date-io/date-fns";
import React, { FC, useEffect, useState } from "react";
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

    const executeResult = useSelector((state) => state.main.execute);
    const mainResult = useSelector((state) => state.main);
    const memoryTable = useSelector((state) => state.main.memoryTable);
    const multiResult = useSelector((state) => state.main.multiData);
    const user = useSelector((state) => state.login.validateToken.user);
    const userRole = user?.roledesc ?? "";

    const [getInformation, setGetInformation] = useState(false);
    const [organizationList, setOrganizationList] = useState<any>([]);
    const [userList, setUserList] = useState<any>([]);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitDelete, setWaitDelete] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

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
            dispatch(getMultiCollection([getOrgSelList(0), timeSheetUserSel({ corpid: 0, orgid: 0 })]));
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
            setUserList(multiResult.data[1] && multiResult.data[1].success ? multiResult.data[1].data : []);
        }
    }, [multiResult, getInformation]);

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
                    const row = props.cell.row.original;
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
                    const row = props.cell.row.original;
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
                    const row = props.cell.row.original;
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
            },
            {
                accessor: "status",
                Header: t(langKeys.status),
                NoFilter: true,
                prefixTranslation: "status_",
                Cell: (props: any) => {
                    const row = props.cell.row.original;
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

    if (viewSelected === "view-1") {
        if (mainResult.mainData.error || userRole !== "SUPERADMIN") {
            return <h1>ERROR</h1>;
        } else {
            return (
                <TableZyx
                    ButtonsElement={() => (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <MuiPickersUtilsProvider
                                locale={(localesLaraigo() as any)[navigator.language.split("-")[0]]}
                                utils={DateFnsUtils}
                            >
                                <KeyboardDatePicker
                                    defaultValue={mainFilter.startdate}
                                    format="dd-MM-yyyy"
                                    InputProps={{ disableUnderline: true }}
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
                        </div>
                    )}
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={true}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    hoverShadow={true}
                    initialPageIndex={
                        IDTIMESHEET === memoryTable.id ? (memoryTable.page === -1 ? 0 : memoryTable.page) : 0
                    }
                    initialStateFilter={
                        IDTIMESHEET === memoryTable.id
                            ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value }))
                            : undefined
                    }
                    loading={mainResult.mainData.loading}
                    onClickRow={handleEdit}
                    pageSizeDefault={
                        IDTIMESHEET === memoryTable.id ? (memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize) : 20
                    }
                    register={true}
                    titlemodule={t(langKeys.timesheet)}
                />
            );
        }
    } else
        return (
            <DetailTimeSheet
                data={rowSelected}
                fetchData={() => fetchData()}
                multiData={mainResult.multiData.data}
                organizationList={organizationList}
                setViewSelected={setViewSelected}
                userList={userList}
            />
        );
};

const DetailTimeSheet: React.FC<DetailProps> = ({
    data: { row, edit },
    fetchData,
    organizationList,
    setViewSelected,
    userList,
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const executeResult = useSelector((state) => state.main.execute);
    const classes = useStyles();

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
            corpid: row?.corpid || 0,
            description: row?.description || "",
            id: row ? row.id : 0,
            operation: row ? "EDIT" : "INSERT",
            orgid: row?.orgid || 0,
            registerdate: row?.registerdate || null,
            registerdetail: row?.registerdetail || "",
            registerprofile: row?.registerprofile || "",
            registeruserid: row ? row.registeruserid : 0,
            startdate: row?.startdate || null,
            startuserid: row ? row.startuserid : 0,
            status: row?.status || "ACTIVO",
            timeduration: row?.timeduration || null,
            type: row?.type || "",
        },
    });

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
                        message: t(executeResult.code || "error_unexpected_error", {
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
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            handleClick={setViewSelected}
                            breadcrumbs={arrayBread(t(langKeys.timesheet), t(langKeys.timesheet_detail))}
                        />
                        <TitleDetail title={t(langKeys.timesheet_new)} />
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
                            onClick={() => setViewSelected("view-1")}
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
                        <MuiPickersUtilsProvider
                            locale={(localesLaraigo() as any)[navigator.language.split("-")[0]]}
                            utils={DateFnsUtils}
                        >
                            <KeyboardDatePicker
                                className="col-6"
                                defaultValue={row?.startdate}
                                disabled={!edit}
                                error={errors?.startdate?.message}
                                format="dd-MM-yyyy"
                                invalidDateMessage={t(langKeys.invalid_date_format)}
                                placeholder={t(langKeys.timesheet_startdate)}
                                value={getValues("startdate")}
                                onChange={(value: any) => {
                                    setValue("startdate", value || null);
                                    trigger("startdate");
                                }}
                            />
                        </MuiPickersUtilsProvider>
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
                            variant="outlined"
                            onChange={(value: any) => {
                                setValue("startuserid", value?.userid || 0);
                            }}
                        />
                    </div>
                    <div className="row-zyx">
                        <MuiPickersUtilsProvider
                            locale={(localesLaraigo() as any)[navigator.language.split("-")[0]]}
                            utils={DateFnsUtils}
                        >
                            <KeyboardDatePicker
                                className="col-6"
                                defaultValue={row?.registerdate}
                                disabled={!edit}
                                error={errors?.registerdate?.message}
                                format="dd-MM-yyyy"
                                invalidDateMessage={t(langKeys.invalid_date_format)}
                                placeholder={t(langKeys.timesheet_registerdate)}
                                value={getValues("registerdate")}
                                onChange={(value: any) => {
                                    setValue("registerdate", value || null);
                                    trigger("registerdate");
                                }}
                            />
                        </MuiPickersUtilsProvider>
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
                            variant="outlined"
                            onChange={(value: any) => {
                                setValue("registeruserid", value?.userid || 0);
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
                            variant="outlined"
                            onChange={(value: any) => {
                                setValue("corpid", value?.corpid || 0);
                                setValue("orgid", value?.orgid || 0);
                            }}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.registerprofile?.message}
                            label={t(langKeys.timesheet_registerprofile)}
                            onChange={(value) => setValue("registerprofile", value)}
                            size="small"
                            valueDefault={getValues("registerprofile")}
                            variant="outlined"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.timeduration?.message}
                            label={t(langKeys.timesheet_timeduration)}
                            onChange={(value: any) => setValue("timeduration", value || null)}
                            size="small"
                            type="time"
                            valueDefault={getValues("timeduration")}
                            variant="outlined"
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.registerdetail?.message}
                            label={t(langKeys.timesheet_registerdetail)}
                            onChange={(value) => setValue("registerdetail", value)}
                            size="small"
                            valueDefault={getValues("registerdetail")}
                            variant="outlined"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TimeSheet;