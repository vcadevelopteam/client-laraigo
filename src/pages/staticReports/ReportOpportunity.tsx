import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import {
    cleanViewChange,
    execute,
    getCollectionAux,
    getMainGraphic,
    getMultiCollection,
    resetMainAux,
    setViewChange
} from "store/main/actions";
import {
    getReportFilterSel,

} from "common/helpers/requestBodies";
import {
    DateRangePicker,
    DialogZyx,
    FieldSelect, FieldView,

} from "components";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@material-ui/core";
import {CalendarIcon, CalendaryIcon, DownloadIcon} from "icons";
import { Range } from "react-date-range";
import CategoryIcon from "@material-ui/icons/Category";
import TableZyx from "components/fields/table-simple";
import {
    convertLocalDate,

    getLeadReportGraphicSel,
    getLeadsReportSel,
    getReportGraphic,
    exportExcel, getDateCleaned,
} from "common/helpers";
import { langKeys } from "lang/keys";
import {Dictionary, IFetchData} from "@types";
import { useForm } from "react-hook-form";
import { CellProps } from 'react-table';
import Graphic from "components/fields/Graphic";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ListIcon from "@material-ui/icons/List";
import { Settings } from "@material-ui/icons";
import CalendarWithInfo from "components/fields/CalendarWithInfo";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import DialogInteractions from "../../components/inbox/DialogInteractions";

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
    colInput: {
        width: '100%'
    },
    title: {
        fontSize: "25px",
        fontWeight: "bold",
        margin: theme.spacing(0.5, 0),
    }
}));

const PriorityStars = ({ priority }: { priority: string }) => {
    let stars = 0;

    switch (priority) {
        case 'HIGH':
            stars = 3;
            break;
        case 'MEDIUM':
            stars = 2;
            break;
        case 'LOW':
            stars = 1;
            break;
        default:
            stars = 0;
            break;
    }

    return (
        <div>
            {Array.from({ length: 3 }).map((_, index) =>
                index < stars ? '⭐' : ''
            )}
        </div>
    );
};

const formatDateHour = (dateString: string) => {
    if (!dateString) return "";

    const localDateString = dateString.replace("Z", "");
    const date = new Date(localDateString);

    return date.toLocaleString();
};

const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString();
};

const DialogOpportunity: React.FC<{
    setOpenModal: (param: any) => void;
    openModal: boolean;
    event: Dictionary;
    booking: Dictionary | null;
    fetchData: () => void
}> = ({ setOpenModal, openModal, event, booking, fetchData }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Dialog
            open={openModal}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {booking?.personname}
            </DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: "50%", display: 'flex', gap: 8 }}>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                                <FieldView
                                    label={`${t(langKeys.report_opportunity_ticket)}`}
                                    value={booking?.ticketnum}
                                    className={classes.colInput}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_datehour)}`}
                                value={ formatDateHour(booking?.createdate)}
                                className={classes.colInput}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_description)}`}
                                value={booking?.description}
                                className={classes.colInput}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_fullname)}`}
                                value={booking?.fullname}
                                className={classes.colInput}
                            />
                        </div>
                    </div>


                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_lastupdate)}`}
                                value={formatDateHour(booking?.lastchangestatusdate)}
                                className={classes.colInput}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_dateinopportunity)}`}
                                value={formatDateHour(booking?.date_deadline)}
                                className={classes.colInput}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_displayname)}`}
                                value={booking?.displayname}
                                className={classes.colInput}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_priority)}`}
                                value={<PriorityStars priority={booking?.priority} />}
                                className={classes.colInput}
                            />
                        </div>

                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_phone)}`}
                                value={booking?.phone}
                                className={classes.colInput}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_tags)}`}
                                value={booking?.tags}
                                className={classes.colInput}
                            />
                        </div>

                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_email)}`}
                                value={booking?.email}
                                className={classes.colInput}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_products)}`}
                                value={booking?.products}
                                className={classes.colInput}
                            />
                        </div>

                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={`${t(langKeys.report_opportunity_expectedincome)}`}
                                value={booking?.expected_revenue}
                                className={classes.colInput}
                            />
                        </div>


                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                        <FieldView
                            label={`${t(langKeys.report_opportunity_expectedimplementationdate)}`}
                            value={formatDate(booking?.estimatedimplementationdate)}
                            className={classes.colInput}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                        <FieldView
                            label={`${t(langKeys.report_opportunity_expectedbillingdate)}`}
                            value={formatDate(booking?.estimatedbillingdate)}
                            className={classes.colInput}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenModal(false)}>
                    {t(langKeys.cancel)}
                </Button>
            </DialogActions>
        </Dialog >
    )
}

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
    const [openModalInteractions, setOpenModalInteractions] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const [view, setView] = useState("GRID");
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [dataGrid, setdataGrid] = useState<any[]>([]);
    const openDialogInteractions = (row: any) => {
        setOpenModalInteractions(true);
        setRowSelected(row)
    }
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

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_opportunity_ticket),
                accessor: 'ticketnum',
                showGroupedBy: true,
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const ticketnum = props.cell.value;
                    return (
                        <label
                            onClick={() => openDialogInteractions(props.cell.row.original)}
                        >
                            {ticketnum}
                        </label>
                    );
                },
            },
            {
                Header: t(langKeys.report_opportunity_datehour),
                accessor: 'createdate',
                type: 'date',
                showGroupedBy: true,
                showColumn: true,
                Cell: ({ value }) => formatDateHour(value),

            },
            {
                Header: t(langKeys.report_opportunity_description),
                accessor: 'description',
                showGroupedBy: true,
                showColumn: true,
            },
            {
                Header: t(langKeys.report_opportunity_lastupdate),
                accessor: 'lastchangestatusdate',
                type: 'date',
                showGroupedBy: true,
                showColumn: true,
                Cell: ({ value }) => formatDateHour(value),

            },
            {
                Header: t(langKeys.report_opportunity_dateinopportunity),
                accessor: 'date_deadline',
                type: 'date',
                showGroupedBy: true,
                showColumn: true,
                Cell: ({ value }) => formatDateHour(value),


            },
            {
                Header: t(langKeys.report_opportunity_displayname),
                accessor: 'displayname',
                showGroupedBy: true,
                showColumn: true,
            },
            {
                Header: t(langKeys.report_opportunity_phone),
                accessor: 'phone',
                showGroupedBy: true,
                showColumn: true,
            },
            {
                Header: t(langKeys.report_opportunity_email),
                accessor: 'email',
                showGroupedBy: true,
                showColumn: true,
            },
            {
                Header: t(langKeys.report_opportunity_expectedincome),
                accessor: 'expected_revenue',
                showGroupedBy: true,
                showColumn: true,
            },
            {
                Header: t(langKeys.report_opportunity_expectedimplementationdate),
                accessor: 'estimatedimplementationdate',
                type: 'date',
                showGroupedBy: true,
                showColumn: true,
                Cell: ({ value }) => formatDate(value),

            },
            {
                Header: t(langKeys.report_opportunity_expectedbillingdate),
                accessor: 'estimatedbillingdate',
                type: 'date',
                showGroupedBy: true,
                showColumn: true,

                Cell: ({ value }) => formatDate(value),

            },
            {
                Header: t(langKeys.report_opportunity_tags),
                accessor: 'tags',
                showGroupedBy: true,
                showColumn: true,
            },
            {
                Header: t(langKeys.report_opportunity_phase),
                accessor: 'phase',
                Cell: ({ value }) => t(value),
                showGroupedBy: true,
                showColumn: true,
            },
            {
                Header: t(langKeys.report_opportunity_priority),
                accessor: 'priority',
                Cell: ({ value }) => t(value),
                showGroupedBy: true,
                showColumn: true,              
            },
            {
                Header: t(langKeys.report_opportunity_fullname),
                accessor: 'fullname',
                showGroupedBy: true,
                showColumn: true,              
            },
            {
                Header: t(langKeys.report_opportunity_products),
                accessor: 'products',
                showGroupedBy: true,
                showColumn: true,              
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
        const startdate: string | null = dateRange.startDate
            ? new Date(dateRange.startDate).toISOString()
            : null;
        const enddate: string | null = dateRange.endDate
            ? new Date(dateRange.endDate).toISOString()
            : null;
        setisday(startdate === enddate);

        dispatch(resetMainAux());
        dispatch(getCollectionAux(getLeadsReportSel({
            communicationchannel: selectedChannel || 0,
            startdate: startdate,
            enddate: enddate,
        })));

    };

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };
    const BookingViewer = ({ item }: { item: Dictionary }) => {
        const [color, setColor] = useState(item?.color || "#e1e1e1");

        useEffect(() => {
            if (item.priority) {
                switch (item.priority.toUpperCase()) {
                    case 'LOW':
                        setColor('#069ce2');
                        break;
                    case 'MEDIUM':
                        setColor('#f4be25');
                        break;
                    case 'HIGH':
                        setColor('#cf0100');
                        break;
                    default:
                        setColor("#e1e1e1");
                        break;
                }
            }
        }, [item]);

        return (
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#7721AD', paddingLeft: '6px'}}
                 title={`${item.personname}`}
            >
                <div
                    style={{
                        width: 6,
                        height: 6,
                        backgroundColor: color,
                        borderRadius: '50%',
                        marginRight: 4,
                        padding: '4px'

                    }}

                />
                <div style={{ color: '#fff' }}> {}

                    {item.personname}
                </div>
            </div>
        );
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

    const handleExportExcel = () => {
        const formattedData = dataGrid.map(row => ({
            ...row,
            createdate: formatDateHour(row.createdate),
            lastchangestatusdate: formatDateHour(row.lastchangestatusdate),
            date_deadline: formatDateHour(row.date_deadline),
            estimatedimplementationdate: formatDateHour(row.estimatedimplementationdate),
            estimatedbillingdate: formatDateHour(row.estimatedbillingdate),
            phase: t(row.phase),
            priority: t(row.priority),
        }));

        exportExcel(
            "report" + new Date().toISOString(),
            formattedData,
            columns.filter((x: any) => !x.isComponent && !x.activeOnHover)
        );
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
                                                            {getDateCleaned(dateRange.startDate!) + " - " + getDateCleaned(dateRange.endDate!)}

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
                                                    onClick={handleExportExcel}
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
                                <CalendaryIcon style={{ marginRight: "1rem", width: '23px', height: '23px', display: 'flex', alignItems: 'center', fill: "grey"}}>
                                    <CategoryIcon fontSize="small" style={{ fill: "grey", width: '16px', height: '16px' }} />
                                </CalendaryIcon>
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
                <DialogInteractions
                    openModal={openModalInteractions}
                    ticket={rowSelected}
                    setOpenModal={setOpenModalInteractions}
                />
            </>
        );

    }
    else if (viewSelected2 === 'calendar') {
        return (
            <div style={{ width: '100%' }}>
                <p className={classes.title}>{t(langKeys.report_opportunity).toUpperCase()}</p>
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
                            BookingView={BookingViewer}
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
                                    <CloseIcon style={{ marginRight: 4 }} />
                                    {t(langKeys.back)}
                                </Button>
                            }
                            setDateRange={setDateRange}
                        />

                    </div>

                </div>
                <DialogOpportunity
                    booking={bookingSelected}
                    setOpenModal={setOpenDialog}
                    openModal={openDialog}
                    event={event}
                    fetchData={fetchData}
                />
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