import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import TablePaginated from "components/fields/table-paginated";
import Graphic from "components/fields/Graphic";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import CategoryIcon from "@material-ui/icons/Category";
import { TemplateBreadcrumbs, FieldSelect, DialogZyx, FieldMultiSelect,} from "components";
import { useSelector } from "hooks";
import { Dictionary, IFetchData } from "@types";
import { getPaginatedForReports, getReportExport, convertLocalDate, getReportGraphic, getUserAsesorByOrgID, getReportFilterSel, getCommChannelLstTypeDesc } from "common/helpers";
import { getCollectionPaginated, resetCollectionPaginated, exportData, getMultiCollection, resetMultiMain, getMainGraphic, cleanViewChange, setViewChange } from "store/main/actions";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { useForm } from "react-hook-form";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { ListItemIcon } from "@material-ui/core";
import { columnsHideShow } from "common/helpers/columnsReport";

interface ItemProps {
    setViewSelected: (view: string) => void;
    setSearchValue: (searchValue: string) => void;
    row: Dictionary | null;
}

const getArrayBread = (nametmp: string, nameView1: string) => [
    { id: "view-1", name: nameView1 || "Reports" },
    { id: "view-2", name: nametmp },
];

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    containerDetails: {
        marginTop: theme.spacing(3),
    },
    media: {
        objectFit: "contain",
    },
    containerSearch: {
        width: "100%",
        display: "flex",
        gap: theme.spacing(1),
        alignItems: "center",
        [theme.breakpoints.up("sm")]: {
            width: "50%",
        },
    },
    containerFilter: {
        width: "100%",
        marginBottom: theme.spacing(2),
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
    },
    filterComponent: {
        minWidth: "220px",
        maxWidth: "260px",
    },
    containerFilterGeneral: {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        padding: theme.spacing(1),
    },
    title: {
        fontSize: "22px",
        fontWeight: "bold",
        color: theme.palette.text.primary,
    },
    containerHeader: {
        display: "block",
        marginBottom: 0,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: "1px solid #bfbfc0",
        borderRadius: 4,
        color: "rgb(143, 146, 161)",
    },
}));

const ProductivityHoursReport: React.FC<ItemProps> = ({ setViewSelected, setSearchValue, row }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector((state) => state.main.multiData);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const resExportData = useSelector((state) => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);
    const [isTypificationFilterModalOpen, setTypificationFilterModalOpen] = useState(false);   
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({
        pageSize: 0,
        pageIndex: 0,
        filters: {},
        sorts: {},
        daterange: null,
    });
    const [allParameters, setAllParameters] = useState<any>({});
    const [openModal, setOpenModal] = useState(false);
    const [view, setView] = useState("GRID");

    useEffect(() => {
        dispatch(getMultiCollection([getReportFilterSel("UFN_REPORT_HOURS_SEL", "UFN_REPORT_HOURS_SEL", ""), getUserAsesorByOrgID(), getCommChannelLstTypeDesc()]));
        dispatch(setViewChange(`report_${"userproductivityhours"}`));
        return () => {
            dispatch(cleanViewChange());
        };
    }, []);

    const reportColumns = [
        {
        "proargnames": "datehour",
        "proargmodes": "t",
        "proargtype": "date"
        },
        {
        "proargnames": "agent",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "hoursrange",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "worktime",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "busytimewithinwork",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "freetimewithinwork",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "busytimeoutsidework",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "onlinetime",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "availabletime",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "idletime",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "idletimewithoutattention",
        "proargmodes": "t",
        "proargtype": "text"
        },
        {
        "proargnames": "qtytickets",
        "proargmodes": "t",
        "proargtype": "bigint"
        },
        {
        "proargnames": "qtyconnection",
        "proargmodes": "t",
        "proargtype": "bigint"
        },
        {
        "proargnames": "qtydisconnection",
        "proargmodes": "t",
        "proargtype": "bigint"
        }
    ];

    const columns = React.useMemo(
        () =>
            reportColumns.map((x) => {
                const showColumn = columnsHideShow["userproductivityhours"]?.[x.proargnames] ?? false;
                switch (x.proargtype) {
                    case "timestamp without time zone":
                        return {
                            Header: t("report_" + "userproductivityhours" + "_" + x.proargnames || ""),
                            accessor: x.proargnames,
                            helpText:
                                t("report_" + "userproductivityhours" + "_" + x.proargnames + "_help") ===
                                "report_" + "userproductivityhours" + "_" + x.proargnames + "_help"
                                    ? ""
                                    : t("report_" + "userproductivityhours" + "_" + x.proargnames + "_help"),
                            type: "date",
                            showColumn,
                            Cell: (props: any) => {
                                const column = props.cell.column;
                                const row = props.cell.row.original;
                                return (
                                    <div>
                                        {convertLocalDate(row[column.id]).toLocaleString(undefined, {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "numeric",
                                            minute: "numeric",
                                            second: "numeric",
                                            hour12: false,
                                        })}
                                    </div>
                                );
                            },
                        };
                    case "date":
                        return {
                            Header: t('report_' + "userproductivityhours" + '_' + x.proargnames || ''),
                            accessor: x.proargnames,
                            helpText: t('report_' + "userproductivityhours" + '_' + x.proargnames + "_help") === ('report_' + "userproductivityhours" + '_' + x.proargnames + "_help") ? "" : t('report_' + "userproductivityhours" + '_' + x.proargnames + "_help"),
                            type: "date",
                            showColumn,
                            Cell: (props: any) => {
                                const column = props.cell.column;
                                const row = props.cell.row.original;
                                return (<div>
                                    {new Date(
                                        row[column.id].split('-')[0],
                                        row[column.id].split('-')[1] - 1,
                                        row[column.id].split('-')[2]
                                    ).toLocaleString(undefined, {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit"
                                    })}
                                </div>)
                            }
                        }
                    default:
                        return {
                            Header: t("report_userproductivityhours_" + x.proargnames || ""),
                            accessor: x.proargnames,
                            showColumn,
                            helpText:
                                t("report_userproductivityhours_" + x.proargnames + "_help") ===
                                "report_userproductivityhours_" + x.proargnames + "_help"
                                    ? ""
                                    : t("report_userproductivityhours_" + x.proargnames + "_help"),
                            type: "string",
                        };
                }
            }),
        [reportColumns]
    );

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);

    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code ?? "error_unexpected_error", {
                    module: t(langKeys.property).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave]);

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = columns.map((x: Dictionary) => ({
            key: x.accessor,
            alias: x.Header,
        }));
        dispatch(
            exportData(
                getReportExport("UFN_REPORT_USERPRODUCTIVITYHOURS_EXPORT", "userproductivityhours", {
                    filters,
                    sorts,
                    startdate: daterange.startDate!,
                    enddate: daterange.endDate!,
                    ...allParameters,
                }),
                "",
                "excel",
                false,
                columnsExport
            )
        );
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange });
        dispatch(
            getCollectionPaginated(
                getPaginatedForReports(
                    "UFN_REPORT_USERPRODUCTIVITYHOURS_SEL",
                    "UFN_REPORT_USERPRODUCTIVITYHOURS_TOTALRECORDS",
                    "userproductivityhours",
                    {
                        startdate: daterange.startDate!,
                        enddate: daterange.endDate!,
                        take: pageSize,
                        skip: pageIndex * pageSize,
                        sorts: sorts,
                        filters: {...filters},
                        ...allParameters,
                    }
                )
            )
        );
    };

    const handlerSearchGraphic = (daterange: any, column: string) => {
        setfetchDataAux((prev) => ({ ...prev, daterange }));
        dispatch(
            getMainGraphic(
                getReportGraphic("UFN_REPORT_USERPRODUCTIVITYHOURS_GRAPHIC", "userproductivityhours", {
                    filters: {},
                    sorts: {},
                    startdate: daterange?.startDate!,
                    enddate: daterange?.endDate!,
                    column,
                    summarization: "COUNT",
                    ...allParameters,
                })
            )
        );
    };

    const handleSelected = () => {
        dispatch(resetCollectionPaginated());
        dispatch(resetMultiMain());
        setSearchValue("");
        setViewSelected("view-1");
    };

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };

    const [waitExport, setWaitExport] = useState(false);

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", {
                    module: t(langKeys.blacklist).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
            dispatch(showBackdrop(false));
        }
    }, [mainPaginated]);

    const handleOpeTypificationFilterModal = () => {
        setTypificationFilterModalOpen(true);
    };

    return (
        <div style={{ width: "100%", display: "flex", flex: 1, flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <TemplateBreadcrumbs
                    breadcrumbs={getArrayBread(t("report_" + "userproductivityhours"), t(langKeys.report_plural))}
                    handleClick={handleSelected}
                />
            </div>

            <>
                {view === "GRID" ? (
                    <TablePaginated
                        columns={columns}
                        data={mainPaginated.data}
                        totalrow={totalrow}
                        loading={mainPaginated.loading}
                        pageCount={pageCount}
                        filterrange={true}
                        showHideColumns={true}
                        ExtraMenuOptions={
                            <MenuItem
                                style={{ padding: "0.7rem 1rem", fontSize: "0.96rem" }}
                                onClick={handleOpeTypificationFilterModal}
                            >
                                <ListItemIcon>
                                    <CategoryIcon fontSize="small" style={{ fill: "grey", height: "25px" }} />
                                </ListItemIcon>
                                <Typography variant="inherit">{t(langKeys.filters) + " - " + t(langKeys.report_userproductivityhours)}</Typography>
                            </MenuItem>
                        }
                        FiltersElement={
                            <FieldSelect
                                valueDefault={allParameters["channel"]}
                                label={t("report_userproductivityhours_filter_channels")}
                                className={classes.filterComponent}
                                key={"UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"}
                                variant="outlined"
                                loading={multiData.loading}
                                onChange={(value) => setValue("channel", value ? value["typedesc"] : "")}
                                data={
                                    multiData?.data[
                                        multiData?.data?.findIndex(
                                            (x) => x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"
                                        )
                                    ]?.data
                                }
                                optionDesc={"type"}
                                optionValue={"typedesc"}
                            />
                        }
                        ButtonsElement={
                            <>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    disabled={mainPaginated.loading || mainPaginated.data.length <= 0}
                                    onClick={() => setOpenModal(true)}
                                    startIcon={<AssessmentIcon />}
                                >
                                    {t(langKeys.graphic_view)}
                                </Button>
                            </>
                        }
                        download={true}
                        fetchData={fetchData}
                        exportPersonalized={triggerExportData}
                    />
                ) : (
                    <div className={classes.container}>
                        <Graphic
                            graphicType={view.split("-")?.[1] || "BAR"}
                            column={view.split("-")?.[2] || "summary"}
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            daterange={fetchDataAux.daterange}
                            setView={setView}
                            row={row!!}
                            handlerSearchGraphic={handlerSearchGraphic}
                            FiltersElement={
                                <FieldSelect
                                    valueDefault={allParameters["channel"]}
                                    label={t("report_userproductivityhours_filter_channels")}
                                    className={classes.filterComponent}
                                    key={"UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"}
                                    variant="outlined"
                                    onChange={(value) => setValue("channel", value ? value["typedesc"] : "")}
                                    data={
                                        multiData?.data?.[
                                            multiData?.data.findIndex(
                                                (x) => x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"
                                            )
                                        ]?.data
                                    }
                                    optionDesc={"type"}
                                    optionValue={"typedesc"}
                                />
                            }
                        />
                    </div>
                )}
            </>

            <SummaryGraphic
                openModal={openModal}
                setOpenModal={setOpenModal}
                setView={setView}
                row={row}
                daterange={fetchDataAux.daterange}
                filters={fetchDataAux.filters}
                columns={reportColumns.map((x) => x.proargnames)}
                columnsprefix={"report_" + "userproductivityhours" + "_"}
                allParameters={allParameters}
            />
            <DialogZyx
                open={isTypificationFilterModalOpen}
                title={t(langKeys.filters)}
                buttonText1={t(langKeys.close)}         
                buttonText2={t(langKeys.apply)}         
                handleClickButton1={() => setTypificationFilterModalOpen(false)}      
                handleClickButton2={() => {
                    setTypificationFilterModalOpen(false);
                    fetchData(fetchDataAux)
                }}           
                maxWidth="sm"
                buttonStyle1={{ marginBottom: "0.3rem" }}
                buttonStyle2={{ marginRight: "1rem", marginBottom: "0.3rem" }}
            >
                <div className="row-zyx">
                    <FieldMultiSelect
                        limitTags={1}
                        label={t(langKeys.hours)}
                        className={classes.filterComponent + " col-6"}
                        valueDefault={allParameters?.hours || ""}
                        key={"UFN_REPORT_HOURS_SEL"}
                        onChange={(value) =>
                            setValue("hours", value ? value.map((o: Dictionary) => o["hours"]).join() : "")
                        }
                        variant="outlined"
                        data={multiData?.data?.find(x=>x.key==="UFN_REPORT_HOURS_SEL")?.data || []}
                        optionDesc={"hourdescription"}
                        optionValue={"hours"}
                    />
                    <FieldSelect 
                        label={t(langKeys.agent)}
                        className={classes.filterComponent + " col-6"}
                        valueDefault={allParameters?.asesorid || ""}
                        key={"UFN_USER_ASESORBYORGID_LST"}
                        onChange={(value) => setValue("asesorid", value?.userid || 0) }
                        variant="outlined"
                        data={multiData?.data?.find(x=>x.key==="UFN_USER_ASESORBYORGID_LST")?.data || []}
                        optionDesc={"userdesc"}
                        optionValue={"userid"}
                    />
                </div>
            </DialogZyx>
        </div>
    );
};

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    row: Dictionary | null;
    daterange: any;
    filters: Dictionary;
    columns: string[];
    columnsprefix: string;
    allParameters?: any;
}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({
    openModal,
    setOpenModal,
    setView,
    row,
    daterange,
    filters,
    columns,
    columnsprefix,
    allParameters = {},
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            graphictype: "BAR",
            column: "",
        },
    });

    useEffect(() => {
        register("graphictype", { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register("column", { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    const handleCancelModal = () => {
        setOpenModal(false);
    };

    const handleAcceptModal = handleSubmit((data) => {
        triggerGraphic(data);
    });

    const triggerGraphic = (data: any) => {
        setView(`CHART-${data.graphictype}-${data.column}`);
        setOpenModal(false);
        dispatch(
            getMainGraphic(
                getReportGraphic("UFN_REPORT_USERPRODUCTIVITYHOURS_GRAPHIC" || "", "userproductivityhours" || "", {
                    filters,
                    sorts: {},
                    startdate: daterange?.startDate!,
                    enddate: daterange?.endDate!,
                    column: data.column,
                    summarization: "COUNT",
                    ...allParameters,
                })
            )
        );
    };

    const excludeProductivityHours = [
        "busytimewithinwork",
        "freetimewithinwork",  
        "busytimeoutsidework",
        "availabletime",
        "idletime",
        "idletimewithoutattention",
        "qtydisconnection",   
    ];

    const filteredColumns = columns.filter((column) => !excludeProductivityHours.includes(column));
    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.graphic_configuration)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.accept)}
            handleClickButton2={handleAcceptModal}
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_type)}
                    className="col-12"
                    valueDefault={getValues("graphictype")}
                    error={(errors?.graphictype?.message as string) ?? ""}
                    onChange={(value) => setValue("graphictype", value?.key)}
                    data={[
                        { key: "BAR", value: "BAR" },
                        { key: "PIE", value: "PIE" },
                        { key: "LINE", value: "LINEA" },
                    ]}
                    uset={true}
                    prefixTranslation="graphic_"
                    optionDesc="value"
                    optionValue="key"
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_view_by)}
                    className="col-12"
                    valueDefault={getValues("column")}
                    error={(errors?.column?.message as string) ?? ""}
                    onChange={(value) => setValue("column", value?.key)}
                    data={filteredColumns.map((x) => ({ key: x, value: x }))}
                    optionDesc="value"
                    optionValue="key"
                    uset={true}
                    prefixTranslation={columnsprefix}
                />
            </div>
        </DialogZyx>
    );
};

export default ProductivityHoursReport;