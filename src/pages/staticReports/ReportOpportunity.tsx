import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { cleanViewChange, getCollectionAux, getMainGraphic, getMultiCollection, resetMainAux, setViewChange } from "store/main/actions";
import {
    getReportColumnSel,
    getReportFilterSel,
    getUserProductivityGraphic,
    getUserProductivitySel,
    selBookingCalendar
} from "common/helpers/requestBodies";
import {
    DateRangePicker,
    DialogZyx,
    FieldMultiSelect,
    FieldSelect,
    IOSSwitch,
    TemplateBreadcrumbs,
    TitleDetail
} from "components";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@material-ui/core";
import { CalendarIcon, DownloadIcon } from "icons";
import { Range } from "react-date-range";
import CategoryIcon from "@material-ui/icons/Category";
import TableZyx from "components/fields/table-simple";
import { convertLocalDate,
    getCommChannelLst,
    getDateCleaned, getLeadReportGraphicSel, getLeadsReportSel, getRecordVoicecallGraphic, getReportGraphic, exportExcel } from "common/helpers";
import { langKeys } from "lang/keys";
import {Dictionary, IFetchData} from "@types";
import { useForm } from "react-hook-form";
import { CellProps } from 'react-table';
import Graphic from "components/fields/Graphic";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ListIcon from "@material-ui/icons/List";
import { Settings } from "@material-ui/icons";
import CalendarScheduledEvents from "../calendar/CalendarScheduledEvents";
import CalendarWithInfo from "components/fields/CalendarWithInfo";

interface DetailProps {
    row: Dictionary | null;
    allFilters: Dictionary[];
    calendarEventID: number;
    event: Dictionary;
}

const useStyles = makeStyles((theme) => ({
    containerFilter: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        backgroundColor: "white",
        justifyContent: "space-between",
    },
    filterComponent: {
        minWidth: "220px",
        maxWidth: "260px",
    },
    containerHeader: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    containerDetails: {
        paddingBottom: theme.spacing(2),
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },
    BackGrRed: {
        backgroundColor: "#fb5f5f",
    },
    BackGrGreen: {
        backgroundColor: "#55bd84",
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: "pointer",
    },
    containerHeaderItem: {
        backgroundColor: "#FFF",
        padding: 8,
        display: "block",
        flexWrap: "wrap",
        gap: 8,
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    calendarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

const columnsTemp = [
    "ticketnum",
    "createdate",
    "description",
    "lastchangestatusdate",
    "date_deadline",
    "displayname",
    "phone",
    "email",
    "expected_revenue",
    "estimatedimplementationdate",
    "estimatedbillingdate",
    "tags",
    "phase",
    "priority",
    "fullname",
    "products",

];

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}


const OpportunityReport: FC<DetailProps> = ({ allFilters ,calendarEventID, event }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const mainAux = useSelector((state) => state.main.mainAux);
    const [groupsdata, setgroupsdata] = useState<any>([]);
    const [allParameters, setAllParameters] = useState({});
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection",
    });
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [isday, setisday] = useState(false);
    const [columnGraphic, setColumnGraphic] = useState("");
    const [anchorElSeButtons, setAnchorElSeButtons] = React.useState<null | HTMLElement>(null);
    const [, setOpenSeButtons] = useState(false);
    const [viewSelected2, setViewSelected2] = useState("view-2");
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, distinct: {}, daterange: null });

    const [desconectedmotives, setDesconectedmotives] = useState<any[]>([]);
    const [bookingSelected, setBookingSelected] = useState<Dictionary | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [view, setView] = useState("GRID");

    const [dataGrid, setdataGrid] = useState<any[]>([]);

    const [detailCustomReport, setDetailCustomReport] = useState<{
        loading: boolean;
        data: Dictionary[];
    }>({
        loading: false,
        data: [],
    });
    const [selectedChannel, setSelectedChannel] = useState(0);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);


    useEffect(() => {
        dispatch(setViewChange("report_opportunity"));
        dispatch(getMultiCollection([
            getLeadsReportSel(
                {
                    communicationchannel: selectedChannel || 0,
                    startdate: dateRangeCreateDate.startDate,
                    enddate: dateRangeCreateDate.endDate,
                }
            ),
            getReportFilterSel("UFN_COMMUNICATIONCHANNEL_LST", "UFN_COMMUNICATIONCHANNEL_LST", "probando"),
            getReportFilterSel("UFN_DOMAIN_LST_VALORES", "UFN_DOMAIN_LST_VALORES_GRUPOS", "GRUPOS"),

        ]));
        return () => {
            dispatch(cleanViewChange());
        };
    }, []);

    const cell = (props: CellProps<Dictionary>) => {
        const column = props.cell.column;
        const row = props.cell.row.original;
        return (
            <div>
                {column.sortType === "datetime" && !!row[column.id]
                    ? convertLocalDate(row[column.id]).toLocaleString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric"
                    })
                    : row[column.id]}
            </div>
        );
    };

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_opportunity_ticket),
                accessor: 'ticketnum',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_datehour),
                accessor: 'createdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { createdate } = props.cell.row.original || {};
                    return createdate ? new Date(createdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_description),
                accessor: 'description',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_lastupdate),
                accessor: 'lastchangestatusdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { lastchangestatusdate } = props.cell.row.original || {};
                    return lastchangestatusdate ? new Date(lastchangestatusdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_dateinopportunity),
                accessor: 'date_deadline',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { date_deadline } = props.cell.row.original || {};
                    return date_deadline ? new Date(date_deadline).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_displayname),
                accessor: 'displayname',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_phone),
                accessor: 'phone',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_email),
                accessor: 'email',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_expectedincome),
                accessor: 'expected_revenue',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_expectedimplementationdate),
                accessor: 'estimatedimplementationdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { estimatedimplementationdate } = props.cell.row.original || {};
                    return estimatedimplementationdate ? new Date(estimatedimplementationdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_expectedbillingdate),
                accessor: 'estimatedbillingdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { estimatedbillingdate } = props.cell.row.original || {};
                    return estimatedbillingdate ? new Date(estimatedbillingdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_tags),
                accessor: 'tags',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_phase),
                accessor: 'phase',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_priority),
                accessor: 'priority',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_fullname),
                accessor: 'fullname',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_products),
                accessor: 'products',
                Cell: cell
            },
        ],
        [t]
    );

    useEffect(() => {
        if (allFilters) {
            if (!multiData.loading && !multiData.error && multiData.data.length) {
                const groupitem = allFilters.find((e) => e.values[0].label === "group");
                if (groupitem) {
                    const arraygroups =
                        multiData?.data[
                            multiData?.data?.findIndex(
                                (x) =>
                                    x.key ===
                                    (groupitem?.values[0].isListDomains
                                        ? groupitem?.values[0].filter + "_" + groupitem?.values[0].domainname
                                        : groupitem?.values[0].filter)
                            )
                            ];
                    setgroupsdata(arraygroups.data);
                }
            }
        }
    }, [multiData, allFilters]);
    useEffect(() => {
        if (!mainAux.error && !mainAux.loading && mainAux.key === "UFN_LEAD_REPORT_SEL") {
            setDetailCustomReport(mainAux);
            setdataGrid(mainAux.data.map((x) => ({
                ...x,
                ...(x.desconectedtimejson ? JSON.parse(x.desconectedtimejson) : {})
            })));

            if (mainAux.data.length > 0) {
                const desconectedMotives = Array.from(
                    new Set(
                        (mainAux.data as any).reduce(
                            (ac: string[], x: any) =>
                                x.desconectedtimejson ? [...ac, ...Object.keys(JSON.parse(x.desconectedtimejson))] : ac,
                            []
                        )
                    )
                );
                setDesconectedmotives([...desconectedMotives]);
            }
        }
    }, [mainAux]);


    useEffect(() => {
        setAllParameters({
            ...allParameters,
            startdate: dateRange.startDate
                ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10)
                : null,
            enddate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null,
        });
    }, [dateRange]);

    const fetchData = () => {
        const stardate = dateRange.startDate
            ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10)
            : null;
        const enddate = dateRange.endDate
            ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10)
            : null;
        setisday(stardate === enddate);

        dispatch(resetMainAux());
        dispatch(getCollectionAux(getLeadsReportSel({
            communicationchannel: selectedChannel || 0,
            startdate: dateRangeCreateDate.startDate,
            enddate: dateRangeCreateDate.endDate,
        })));

    };

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };


    const format = (date: Date) => date.toISOString().split("T")[0];

    const handlerSearchGraphic = (daterange: any, column: string) => {
        setfetchDataAux(prev => ({ ...prev, daterange }));
        dispatch(getMainGraphic(getReportGraphic(
            "UFN_LEAD_REPORT_GRAPHIC_SEL", "report_crm",
            {
                filters: {},
                sorts: {},
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column,
                summarization: 'COUNT',
                ...allParameters,
            }
        )));
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (anchorElSeButtons && !anchorElSeButtons.contains(target)) {
                setAnchorElSeButtons(null);
                setOpenSeButtons(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [anchorElSeButtons, setOpenSeButtons]);

    if (viewSelected2 === "view-2") {
        return (
            <>
                {view === "GRID" ? (
                    <TableZyx
                        columns={columns}
                        filterGeneral={false}
                        data={dataGrid}
                        download={false}
                        showHideColumns={true}
                        groupedBy={true}
                        loading={detailCustomReport.loading}
                        register={false}
                        ButtonsElement={
                            <div className={classes.containerFilter}>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <div style={{ display: "flex" }}>
                                        <Box width={1}>
                                            <Box
                                                className={classes.containerHeader}
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                    <DateRangePicker
                                                        open={openDateRangeModal}
                                                        setOpen={setOpenDateRangeModal}
                                                        range={dateRange}
                                                        onSelect={setDateRange}
                                                    >
                                                        <Button
                                                            disabled={detailCustomReport.loading}
                                                            style={{
                                                                border: "1px solid #bfbfc0",
                                                                borderRadius: 4,
                                                                color: "rgb(143, 146, 161)",
                                                            }}
                                                            startIcon={<CalendarIcon />}
                                                            onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                                                        >
                                                            {format(dateRange.startDate!) +
                                                                " - " +
                                                                format(dateRange.endDate!)}
                                                        </Button>
                                                    </DateRangePicker>
                                                </div>
                                            </Box>
                                        </Box>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <Box width={1}>
                                            <Box
                                                className={classes.containerHeader}
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                    <FieldSelect

                                                        label={t(langKeys.report_opportunity_channels)}
                                                        className={classes.filterComponent}
                                                        key={"UFN_COMMUNICATIONCHANNEL_LST"}
                                                        valueDefault={selectedChannel}
                                                        onChange={(value) =>
                                                            setValue("channel", value?.typedesc || "ayuda2")
                                                        }
                                                        variant="outlined"
                                                        data={
                                                            multiData?.data?.find(x => x.key === "UFN_COMMUNICATIONCHANNEL_LST")?.data || []
                                                        }
                                                        loading={multiData.loading}
                                                        optionDesc={"communicationchanneldesc"}
                                                        optionValue={"typedesc"}
                                                    />
                                                </div>
                                            </Box>
                                        </Box>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <Box width={1}>
                                            <Box
                                                className={classes.containerHeader}
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                    <Button
                                                        disabled={detailCustomReport.loading}
                                                        variant="contained"
                                                        color="primary"
                                                        style={{ backgroundColor: "#55BD84", width: 120 }}
                                                        onClick={() => {
                                                            setDetailCustomReport({
                                                                loading: true,
                                                                data: [],
                                                            });
                                                            fetchData();
                                                        }}
                                                    >
                                                        {t(langKeys.search)}
                                                    </Button>
                                                </div>
                                            </Box>
                                        </Box>
                                    </div>
                                </div>
                                <div>
                                    <Box width={1} style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                        {view === "GRID" && (
                                            <>
                                                <Button
                                                    className={classes.button}
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={
                                                        detailCustomReport.loading || !(detailCustomReport.data.length > 0)
                                                    }
                                                    onClick={() => setOpenModal(true)}
                                                    startIcon={<AssessmentIcon />}
                                                >
                                                    {t(langKeys.graphic_view)}
                                                </Button>
                                                <Button
                                                    className={classes.button}
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={detailCustomReport.loading}
                                                    onClick={() =>
                                                        exportExcel(
                                                            "report" + new Date().toISOString(),
                                                            dataGrid,
                                                            columns.filter((x: any) => !x.isComponent && !x.activeOnHover)
                                                        )
                                                    }
                                                    startIcon={<DownloadIcon />}
                                                >
                                                    {t(langKeys.download)}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </div>
                            </div>
                        }
                        ExtraMenuOptions={
                            <MenuItem
                                style={{ padding: "0.7rem 1rem", fontSize: "0.96rem" }}
                                onClick={() => setViewSelected2('calendar')}
                            >
                                <CalendarIcon style={{ marginRight: "1rem" }}>
                                    <CategoryIcon fontSize="small" style={{ fill: "grey", height: "25px" }} />
                                </CalendarIcon>
                                <Typography variant="inherit">{ t(langKeys.report_opportunity_calendarview)}</Typography>
                            </MenuItem>
                        }
                    />
                ) : (
                    <div>
                        <Box
                            style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
                            className={classes.containerHeaderItem}
                        >
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={detailCustomReport.loading || !(detailCustomReport.data.length > 0)}
                                onClick={() => setOpenModal(true)}
                                startIcon={<Settings />}
                            >
                                {t(langKeys.configuration)}
                            </Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={() => setView("GRID")}
                                startIcon={<ListIcon />}
                            >
                                {t(langKeys.grid_view)}
                            </Button>
                        </Box>
                        <Graphic
                            graphicType={view.split("-")?.[1] || "BAR"}
                            column={view.split("-")?.[2] || "summary"}
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            daterange={{
                                startDate: dateRange.startDate?.toISOString().substring(0, 10),
                                endDate: dateRange.endDate?.toISOString().substring(0, 10),
                            }}
                            withFilters={false}
                            setView={setView}
                            withButtons={false}
                            row={{ origin: "opportunity" }}
                            handlerSearchGraphic={handlerSearchGraphic}
                        />
                    </div>
                )}

                <SummaryGraphic
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    setColumnGraphic={setColumnGraphic}
                    setView={setView}
                    daterange={dateRange}
                    filters={allParameters}
                    columns={columnsTemp.map(c => ({
                        key: c, value: `report_opportunity_${c}`
                    }))}
                    allParameters={allParameters}
                />
            </>
        );

    }
    else if (viewSelected2 === 'calendar') {
        return (
            <div style={{ width: '100%' }}>
                <div className={classes.calendarContainer}>
                    <div style={{ marginTop: '20px', width: '100%' }}>
                        <CalendarWithInfo
                            rb={getLeadsReportSel(
                                {
                                    communicationchannel: selectedChannel || 0,
                                    startdate: dateRangeCreateDate.startDate,
                                    enddate: dateRangeCreateDate.endDate,
                                }
                            )}
                            date={dateRange.startDate!!}
                            selectBooking={(item) => {
                                setBookingSelected(item);
                                setOpenDialog(true);
                            }}
                            ButtonAux={
                                <Button
                                    color="primary"
                                    style={{ backgroundColor: "#FB5F5F" }}
                                    type="button"
                                    variant="contained"
                                    onClick={() => setViewSelected2("view-2")}
                                >
                                    {t(langKeys.back)}
                                </Button>
                            }
                            setDateRange={setDateRange}
                        />

                    </div>

                </div>
            </div>
        );
    } else {
        return <div>error</div>;
    }
};

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    setColumnGraphic: (value: string) => void;
    row?: Dictionary | null;
    daterange: any;
    filters?: Dictionary;
    columns: any[];
    columnsprefix?: string;
    allParameters?: any;

}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({
                                                           openModal,
                                                           setOpenModal,
                                                           setView,
                                                           daterange,
                                                           filters,
                                                           columns,
                                                           setColumnGraphic,
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
            column: "chamare",
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
        setView(`CHART-${data.graphictype}-${data.column?.split("::")[0]}`);
        setOpenModal(false);
        setColumnGraphic(data.column);
        dispatch(getMainGraphic(getLeadReportGraphicSel(
            {
                communicationchannel: filters?.communicationchannel || 0,
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column: data.column,
                summarization: 'COUNT',
                ...allParameters,
            }
        )));
    };
    const excludeLeadsOpportunity= [
        "ticketnum",
        "createdate",
        "lastchangestatusdate",
        "date_deadline",
        "phone",
        "expected_revenue",
        "estimatedimplementationdate",
        "estimatedbillingdate",
        "phase",
    ];

    const filteredColumns = columns.filter((column) => !excludeLeadsOpportunity.includes(column.key));

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
                    error={errors?.graphictype?.message}
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
                    error={errors?.column?.message}
                    onChange={(value) => setValue("column", value?.key)}
                    data={filteredColumns}
                    optionDesc="value"
                    optionValue="key"
                    uset={true}
                    prefixTranslation=""
                />
            </div>
        </DialogZyx>
    );
};

export default OpportunityReport;