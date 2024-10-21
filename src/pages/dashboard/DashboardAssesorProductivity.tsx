import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { cleanViewChange, getCollectionAux, getCollectionPaginated, getMainGraphic, getMultiCollection, resetMainAux, setViewChange } from "store/main/actions";
import { getPaginatedTicket, getReportColumnSel, getReportFilterSel, getUserProductivityGraphic, getUserProductivitySel } from "common/helpers/requestBodies";
import { AntTab, DateRangePicker, DialogZyx, IOSSwitch } from "components";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Box, Button, DialogActions, Divider, ListItemIcon, MenuItem, Paper, Popper, Tabs, TextField, Typography } from "@material-ui/core";
import { CalendarIcon } from "icons";
import { Range } from "react-date-range";
import TableZyx from "components/fields/table-simple";
import { exportExcel } from "common/helpers";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { Card, CardContent, Grid } from "@material-ui/core";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SettingsIcon from '@material-ui/icons/Settings';
import SubjectIcon from '@material-ui/icons/Subject';
import { XAxis, ResponsiveContainer, Tooltip as ChartTooltip, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, LabelList, Tooltip } from 'recharts';
import GaugeChart from "react-gauge-chart";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import PersonIcon from '@material-ui/icons/Person';
import TrendingDownIcon from '@material-ui/icons/TrendingDown'; import { CellProps } from 'react-table';
import DialogInteractions from "components/inbox/DialogInteractions";
import FileSaver from 'file-saver';
import i18n from 'i18next';
interface Assessor {
    row: Dictionary | null;
    allFilters: Dictionary[];
}

const useStyles = makeStyles((theme) => ({
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
    tabs: {
        color: "#989898",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "inherit",

    },
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));


type PieChartData = {
    name: string;
    value: number;
};

type ColumnTmp = {
    Header: string;
    accessor: string;
    prefixTranslation?: string;
    type?: string
}

const DashboardAssesorProductivity: FC<Assessor> = ({ allFilters }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const mainAux = useSelector((state) => state.main.mainAux);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const mainResult = useSelector(state => state.main);
    const [, setgroupsdata] = useState<Dictionary>([]);
    const [allParameters, setAllParameters] = useState({});
    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection",
    });
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [state, setState] = useState({ checkedA: false, checkedB: false });
    const [checkedA, setcheckedA] = useState(false);
    const [isday, setisday] = useState(false);
    const [columnGraphic,] = useState("");
    const [, setmaxmin] = useState({
        maxticketsclosed: 0,
        maxticketsclosedasesor: "",
        minticketsclosed: 0,
        minticketsclosedasesor: "",
        maxtimeconnected: "0",
        maxtimeconnectedasesor: "",
        mintimeconnected: "0",
        mintimeconnectedasesor: "",
    });
    const [desconectedmotives, setDesconectedmotives] = useState<Dictionary[]>([]);
    const [openModalTicket, setOpenModalTicket] = useState(false);
    const [view,] = useState("GRID");
    const [dataGrid, setdataGrid] = useState<Dictionary[]>([]);
    const [dataGridAgentAvg, setdataGridAgentAvg] = useState<Dictionary[]>([]);


    const [gaugeArcs,] = useState([100, 100]);
    const formatTooltip = (value: number) => `${value}%`;

    const [detailCustomReport, setDetailCustomReport] = useState<{
        loading: boolean;
        data: Dictionary[];
    }>({
        loading: false,
        data: [],
    });

    const [orderType, setOrderType] = useState("");
    const [sortBy, setSortBy] = useState("");

    const dataForClosedTickets = dataGrid.map(item => ({
        name: item.fullname,
        value: parseInt(item.closedtickets)
    }));

    const totalClosedTickets = dataGrid.reduce((total, item) => total + parseInt(item.closedtickets), 0);
    const [tabIndex, setTabIndex] = useState(0);
    const [tabTexts] = useState([
        { label: 'TMO', title: t(langKeys.tmoDescription) },
        { label: 'TME', title: t(langKeys.tmeDescription) },
        { label: 'TMR', title: t(langKeys.tmrDescription) }
    ]);

    const handleChangeTab = (event: Dictionary, newValue: number) => {
        setTabIndex(newValue);
    };

    let valueKey;
    switch (tabIndex) {
        case 0:
            valueKey = "avgtotalasesorduration";
            break;
        case 1:
            valueKey = "avgfirstreplytime";
            break;
        case 2:
            valueKey = "tmravg";
            break;
        default:
            valueKey = "tmravg";
            break;
    }

    useEffect(() => {
        dispatch(setViewChange("report_userproductivity"));
        dispatch(getMultiCollection([
            getReportColumnSel("UFN_REPORT_USERPRODUCTIVITY_SEL"),
            getReportFilterSel("UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC", "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC", "probando"),
            getReportFilterSel("UFN_DOMAIN_LST_VALORES", "UFN_DOMAIN_LST_VALORES_GRUPOS", "GRUPOS"),
            getReportFilterSel("UFN_DOMAIN_LST_VALORES", "UFN_DOMAIN_LST_VALORES_ESTADOORGUSER", "ESTADOORGUSER"),
        ]));
        return () => {
            dispatch(cleanViewChange());
        };
    }, []);

    const convertMinutesToHHMMSS = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(remainingMinutes).padStart(2, '0');
        const formattedSeconds = '00';
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_userproductivity_user),
                accessor: 'usr',
            },
            {
                Header: t(langKeys.report_userproductivity_fullname),
                accessor: 'fullname',
            },
            ...(isday ? [{
                Header: t(langKeys.report_userproductivity_hourfirstlogin),
                accessor: 'hourfirstlogin',
            }] : []),
            {
                Header: t(langKeys.report_userproductivity_totaltickets),
                accessor: 'totaltickets',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_closedtickets),
                accessor: 'closedtickets',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_asignedtickets),
                accessor: 'asignedtickets',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_suspendedtickets),
                accessor: 'suspendedtickets',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_avgfirstreplytime),
                accessor: 'avgfirstreplytime',
            },
            {
                Header: t(langKeys.report_userproductivity_maxfirstreplytime),
                accessor: 'maxfirstreplytime',
            },
            {
                Header: t(langKeys.report_userproductivity_minfirstreplytime),
                accessor: 'minfirstreplytime',
            },
            {
                Header: t(langKeys.report_userproductivity_avgtotalduration),
                accessor: 'avgtotalduration',
            },
            {
                Header: t(langKeys.report_userproductivity_maxtotalduration),
                accessor: 'maxtotalduration',
            },
            {
                Header: t(langKeys.report_userproductivity_mintotalduration),
                accessor: 'mintotalduration',
            },
            {
                Header: t(langKeys.report_userproductivity_avgtotalasesorduration),
                accessor: 'avgtotalasesorduration',
            },
            {
                Header: t(langKeys.report_userproductivity_maxtotalasesorduration),
                accessor: 'maxtotalasesorduration',
            },
            {
                Header: t(langKeys.report_userproductivity_mintotalasesorduration),
                accessor: 'mintotalasesorduration',
            },
            {
                Header: t(langKeys.report_userproductivity_tmravg),
                accessor: 'tmravg',
                helpText: t(langKeys.report_userproductivity_tmravg_help),
            },

            {
                Header: t(langKeys.maxTMR),
                accessor: 'tmradvisermax',
            },
            {
                Header: t(langKeys.minTMR),
                accessor: 'tmradvisermin',
            },

            {
                Header: t(langKeys.report_userproductivity_tmradviseravg),
                accessor: 'tmradviseravg',
            },
            {
                Header: t(langKeys.timeconnected),
                accessor: 'conectadotime',
            },
            {
                Header: t(langKeys.report_userproductivity_userstatus),
                accessor: 'userstatus',
            },
            {
                Header: t(langKeys.report_userproductivity_groups),
                accessor: 'groups',
            },
        ],
        [isday, mainAux, desconectedmotives]
    );

    const columnsGaugeChart = React.useMemo(

        () => [
            {
                Header: t(langKeys.ticket_number),
                accessor: 'numeroticket',
            },
            {
                Header: t(langKeys.agent),
                accessor: 'asesorinicial',
            },
            {
                Header: t(langKeys.channel),
                accessor: 'personcommunicationchannel',
            },
            {
                Header: t(langKeys.closedby),
                accessor: 'asesorfinal',
            },
            {
                Header: t(langKeys.tme),
                accessor: 'tiempoprimerarespuesta',
            },
            {
                Header: t(langKeys.propertytmemaximo),
                accessor: 'tiempoprimerarespuestaasesor',
            },
            {
                Header: t(langKeys.propertytmeminimo),
                accessor: 'tmoasesor',
            },
            {
                Header: t(langKeys.tmo),
                accessor: 'duraciontotal',
            },
            {
                Header: t(langKeys.propertytmomaximo),
                accessor: 'duracionpausa',
            },
            {
                Header: t(langKeys.propertytmominimo),
                accessor: 'supervisionduration',
            },
            {
                Header: t(langKeys.tmr),
                accessor: 'tiempopromediorespuesta',
            },
            {
                Header: t(langKeys.maxTMR),
                accessor: 'tiempopromediorespuestaasesor',
            },
            {
                Header: t(langKeys.minTMR),
                accessor: 'tiempopromediorespuestapersona',
            },
        ],
        []
    );

    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const openDialogInteractions = useCallback((row: Dictionary) => {
        setOpenModalTicket(true);
        setRowSelected({ ...row, displayname: row.name, ticketnum: row.numeroticket })
    }, [mainResult]);



    const getColumns = (tabIndex: number) => {
        switch (tabIndex) {
            case 0: // TMO
                return [
                    {
                        Header: t(langKeys.report_userproductivity_fullname),
                        accessor: 'fullname',
                        NoFilter: false,
                    },
                    {
                        Header: t(langKeys.report_userproductivity_maxtotalduration),
                        accessor: 'maxtotalduration',
                    },
                    {
                        Header: t(langKeys.report_userproductivity_mintotalduration),
                        accessor: 'mintotalduration',
                    },
                    {
                        Header: t(langKeys.timeconnected),
                        accessor: 'conectadotime',
                    },
                ];
            case 1: // TME
                return [
                    {
                        Header: t(langKeys.report_userproductivity_fullname),
                        accessor: 'fullname',
                        NoFilter: false,
                    },
                    {
                        Header: t(langKeys.report_userproductivity_maxfirstreplytime),
                        accessor: 'maxfirstreplytime',
                    },
                    {
                        Header: t(langKeys.report_userproductivity_minfirstreplytime),
                        accessor: 'minfirstreplytime',
                    },
                    {
                        Header: t(langKeys.timeconnected),
                        accessor: 'conectadotime',
                    },
                ];
            case 2: // TMR
                return [
                    {
                        Header: t(langKeys.report_userproductivity_fullname),
                        accessor: 'fullname',
                        NoFilter: false,
                    },
                    {
                        Header: 'TMR máximo',
                        accessor: 'tmradvisermax',
                    },
                    {
                        Header: 'TMR mínimo',
                        accessor: 'tmradvisermin',
                    },
                    {
                        Header: t(langKeys.timeconnected),
                        accessor: 'conectadotime',
                    },
                ];
            default:
                return [];
        }
    };

    const columnsFulfillmentByTicket = (tabIndex: number) => {
        switch (tabIndex) {
            case 0: // TMO
                return [
                    {
                        Header: t(langKeys.ticket_numeroticket),
                        accessor: "numeroticket",
                        NoFilter: true,
                        Cell: (props: CellProps<Dictionary>) => {
                            const row = props.cell.row.original;
                            if (row && row.numeroticket) {
                                return (
                                    <label
                                        className={classes.labellink}
                                        onClick={() => openDialogInteractions(row)}
                                    >
                                        {row.numeroticket}
                                    </label>
                                );
                            } else {
                                return "";
                            }
                        },

                    },
                    {
                        Header: t(langKeys.tmo),
                        accessor: 'duraciontotal',
                        NoFilter: true,
                    }
                ];
            case 1: // TME
                return [
                    {
                        Header: t(langKeys.ticket_numeroticket),
                        accessor: "numeroticket",
                        NoFilter: true,
                        Cell: (props: CellProps<Dictionary>) => {
                            const row = props.cell.row.original;
                            if (row && row.numeroticket) {
                                return (
                                    <label
                                        className={classes.labellink}
                                        onClick={() => openDialogInteractions(row)}
                                    >
                                        {row.numeroticket}
                                    </label>
                                );
                            } else {
                                return "";
                            }
                        },
                    },
                    {
                        Header: t(langKeys.tme),
                        accessor: 'tiempopromediorespuesta',
                        NoFilter: true,

                    }
                ];
            case 2: // TMR
                return [
                    {
                        Header: t(langKeys.ticket_numeroticket),
                        accessor: "numeroticket",
                        NoFilter: true,
                        Cell: (props: CellProps<Dictionary>) => {
                            const row = props.cell.row.original;
                            if (row && row.numeroticket) {
                                return (
                                    <label
                                        className={classes.labellink}
                                        onClick={() => openDialogInteractions(row)}
                                    >
                                        {row.numeroticket}
                                    </label>
                                );
                            } else {
                                return "";
                            }
                        },

                    },
                    {
                        Header: t(langKeys.tmr),
                        accessor: 'tiempopromediorespuestapersona',
                        NoFilter: true,

                    }
                ];
            default:
                return [];
        }
    };

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
        if (!mainAux.error && !mainAux.loading && mainAux.key === "UFN_REPORT_USERPRODUCTIVITY_SEL") {
            setDetailCustomReport(mainAux);
            setdataGrid(mainAux.data.map((x) => ({ ...x, ...JSON.parse(x.desconectedtimejson) })));
            let maxminaux = {
                maxticketsclosed: 0,
                maxticketsclosedasesor: "",
                minticketsclosed: 0,
                minticketsclosedasesor: "",
                maxtimeconnected: "0",
                maxtimeconnectedasesor: "",
                mintimeconnected: "0",
                mintimeconnectedasesor: "",
            };
            if (mainAux.data.length > 0) {
                const desconedtedmotives = Array.from(
                    new Set(
                        (mainAux.data as Dictionary).reduce(
                            (ac: string[], x: Dictionary) =>
                                x.desconectedtimejson ? [...ac, ...Object.keys(JSON.parse(x.desconectedtimejson))] : ac,
                            []
                        )
                    )
                );
                setDesconectedmotives([...desconedtedmotives]);
                mainAux.data
                    .filter((x) => x.usertype !== "HOLDING")
                    .forEach((x, i) => {
                        if (i === 0) {
                            maxminaux = {
                                maxticketsclosed: x.closedtickets,
                                maxticketsclosedasesor: x.fullname,
                                minticketsclosed: x.closedtickets,
                                minticketsclosedasesor: x.fullname,
                                maxtimeconnected: x.userconnectedduration,
                                maxtimeconnectedasesor: x.fullname,
                                mintimeconnected: x.userconnectedduration,
                                mintimeconnectedasesor: x.fullname,
                            };
                        } else {
                            if (maxminaux.maxticketsclosed < x.closedtickets) {
                                maxminaux.maxticketsclosed = x.closedtickets;
                                maxminaux.maxticketsclosedasesor = x.fullname;
                            }
                            if (maxminaux.minticketsclosed > x.closedtickets) {
                                maxminaux.minticketsclosed = x.closedtickets;
                                maxminaux.minticketsclosedasesor = x.fullname;
                            }
                            if (parseInt(maxminaux.maxtimeconnected) < parseInt(x.userconnectedduration)) {
                                maxminaux.maxtimeconnected = x.userconnectedduration;
                                maxminaux.maxtimeconnectedasesor = x.fullname;
                            }
                            if (parseInt(maxminaux.mintimeconnected) > parseInt(x.userconnectedduration)) {
                                maxminaux.mintimeconnected = x.userconnectedduration;
                                maxminaux.mintimeconnectedasesor = x.fullname;
                            }
                        }
                    });
            }
            setmaxmin(maxminaux);
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
        dispatch(getCollectionAux(getUserProductivitySel({
            ...allParameters,

        })));

        dispatch(getCollectionPaginated(getPaginatedTicket({
            startdate: stardate,
            enddate: enddate,
            take: 10,
            skip: 0,
            sorts: { duraciontotal: "desc" },
            filters: {},
            ...allParameters
        })))

        if (view !== "GRID") {
            dispatch(
                getMainGraphic(
                    getUserProductivityGraphic({
                        ...allParameters,
                        column: columnGraphic,
                        summarization: "COUNT",
                    })
                )
            );
        }
    };

    const setValue = (parameterName: string, value: string) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };

    const handleChange = (event: Dictionary) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        setValue("bot", event.target.checked);
        setcheckedA(event.target.checked);
    };

    const format = (date: Date) => date.toISOString().split("T")[0];



    function calculateAverageTime(data: { [key: string]: string }[], key: string) {
        const totalSeconds = data.reduce((totalSeconds, item) => {
            const timeValue = item[key];
            if (typeof timeValue === 'string') {
                const [hours, minutes, seconds] = timeValue.split(':').map(Number);
                return totalSeconds + (hours * 3600) + (minutes * 60) + seconds;
            } else {
                return totalSeconds;
            }
        }, 0);
        const avgSeconds = Math.round(totalSeconds / data.length);
        const avgHours = Math.floor(avgSeconds / 3600);
        const avgRemainingSeconds = avgSeconds % 3600;
        const avgMinutes = Math.floor(avgRemainingSeconds / 60);
        const avgSecondsFinal = avgRemainingSeconds % 60;
        return `${String(avgHours).padStart(2, '0')}:${String(avgMinutes).padStart(2, '0')}:${String(avgSecondsFinal).padStart(2, '0')}`;
    }

    const tmoValues = mainPaginated.data.map(item => ({ TMOAsesorPromedio: item.duraciontotal }));
    const tmeValues = mainPaginated.data.map(item => ({ TMEPromedio: item.tiempopromediorespuesta }));
    const tmrValues = mainPaginated.data.map(item => ({ TMRPromedio: item.tiempopromediorespuestapersona }));

    const avgTMO = calculateAverageTime(tmoValues, 'TMOAsesorPromedio');
    const avgTME = calculateAverageTime(tmeValues, 'TMEPromedio');
    const avgTMR = calculateAverageTime(tmrValues, 'TMRPromedio');

    function convertHHMMSStoSeconds(hora: string): number {
        const partes = hora.split(":");
        const horas = parseInt(partes[0]);
        const minutos = parseInt(partes[1]);
        const segundos = parseInt(partes[2]);
        const segundosTotales = horas * 3600 + minutos * 60 + segundos;
        return segundosTotales;
    }

    function convertSecondsToHHMMSS(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }

    const [dataForAgentAvg, setDataForAgentAvg] = useState<{ name: string; value: number; }[]>([]);

    useEffect(() => {
        switch (tabIndex) {
            case 0:
                setDataForAgentAvg(
                    dataGrid.map(item => ({
                        name: item.fullname,
                        value: convertHHMMSStoSeconds(item.avgtotalduration)
                    }))
                );
                break;
            case 1:
                setDataForAgentAvg(
                    dataGrid.map(item => ({
                        name: item.fullname,
                        value: convertHHMMSStoSeconds(item.avgfirstreplytime)
                    }))
                );
                break;
            case 2:
                setDataForAgentAvg(
                    dataGrid.map(item => ({
                        name: item.fullname,
                        value: convertHHMMSStoSeconds(item.tmravg)

                    }))
                );
                break;
            default:
                setDataForAgentAvg([]);
                break;
        }
    }, [tabIndex, dataGrid]);

    const sortedData = dataForClosedTickets.slice().sort((a, b) => {
        if (sortBy === "value") {
            if (orderType === "asc") {
                return a.value - b.value;
            } else if (orderType === "desc") {
                return b.value - a.value;
            }
        } else if (sortBy === "name") {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        }
        return 0;
    });

    const [orderTypeAvgAgent, setOrderTypevgAgent] = useState("");
    const [sortByvgAgent, setSortByvgAgent] = useState("");

    const sortedDataForAvgAgent = dataForAgentAvg.slice().sort((a, b) => {
        if (sortByvgAgent === "value") {
            if (orderTypeAvgAgent === "asc") {
                return a.value - b.value;
            } else if (orderTypeAvgAgent === "desc") {
                return b.value - a.value;
            }
        } else if (sortByvgAgent === "name") {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        }
        return 0;
    });

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const slicedData = sortedData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const [currentPageAsesor, setCurrentPageAsesor] = useState(0);
    const itemsPerPageAsesor = 10;

    const slicedDataAsesor = sortedDataForAvgAgent.slice(
        currentPageAsesor * itemsPerPageAsesor,
        (currentPageAsesor + 1) * itemsPerPageAsesor
    );

    const [openExpectedValueModal, setOpenExpectedValueModal] = useState(false);
    const [errorText, setErrorText] = useState('');

    const [hour, setHour] = useState('00');
    const [minute, setMinute] = useState('00');
    const [second, setSecond] = useState('00');
    const [dataForPie, setDataForPie] = useState<PieChartData[]>([]);

    const [expectedTMOValue, setExpectedTMOValue] = useState(localStorage.getItem('expectedTMOValue') || '00:00:00');
    const [expectedTMEValue, setExpectedTMEValue] = useState(localStorage.getItem('expectedTMEValue') || '00:00:00');
    const [expectedTMRValue, setExpectedTMRValue] = useState(localStorage.getItem('expectedTMRValue') || '00:00:00');
    const [expectedValue, setExpectedValue] = useState(expectedTMOValue);

    useEffect(() => {
        switch (tabIndex) {
            case 0:
                setExpectedValue(expectedTMOValue);
                break;
            case 1:
                setExpectedValue(expectedTMEValue);
                break;
            case 2:
                setExpectedValue(expectedTMRValue);
                break;
            default:
                setExpectedValue(expectedTMOValue);
                break;
        }
    }, [tabIndex, expectedTMOValue, expectedTMEValue, expectedTMRValue]);

    useEffect(() => {
        localStorage.setItem('expectedTMOValue', expectedTMOValue);
    }, [expectedTMOValue]);

    useEffect(() => {
        localStorage.setItem('expectedTMEValue', expectedTMEValue);
    }, [expectedTMEValue]);

    useEffect(() => {
        localStorage.setItem('expectedTMRValue', expectedTMRValue);
    }, [expectedTMRValue]);

    const validateTime = (h: string, m: string, s: string): boolean => {
        const hourInt = parseInt(h, 10);
        const minuteInt = parseInt(m, 10);
        const secondInt = parseInt(s, 10);

        if (
            isNaN(hourInt) || isNaN(minuteInt) || isNaN(secondInt) ||
            hourInt < 0 || minuteInt < 0 || minuteInt > 59 ||
            secondInt < 0 || secondInt > 59
        ) {
            setErrorText('Por favor, ingrese una hora válida.');
            return false;
        } else {
            setErrorText('');
            return true;
        }
    };

    const handleAccept = () => {
        let accepted = false;
        if (validateTime(hour, minute, second)) {
            const newValue = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
            switch (tabIndex) {
                case 0:
                    setExpectedTMOValue(newValue);
                    break;
                case 1:
                    setExpectedTMEValue(newValue);
                    break;
                case 2:
                    setExpectedTMRValue(newValue);
                    break;
                default:
                    break;
            }
            accepted = true;
        }
        return accepted;
    };

    const updateDataForPie = (tabIndex: number, data: { duraciontotal: string, TME: string, TMR: string }[]) => {
        let expectedValue: number = 0;
        if (tabIndex === 0) { expectedValue = getSecondsFromTimeString(expectedTMOValue); }
        else if (tabIndex === 1) { expectedValue = getSecondsFromTimeString(expectedTMEValue); }
        else if (tabIndex === 2) { expectedValue = getSecondsFromTimeString(expectedTMRValue); }

        const totalTickets = data.length;
        const ticketsMeetingExpectation = [];
        const ticketsNotMeetingExpectation = [];

        data.forEach(item => {
            let durationSeconds: number | undefined;
            if (tabIndex === 0) {
                durationSeconds = getSecondsFromTimeString(item.duraciontotal);
            } else if (tabIndex === 1) {
                durationSeconds = getSecondsFromTimeString(item.TME);
            } else if (tabIndex === 2) {
                durationSeconds = getSecondsFromTimeString(item.TMR);
            }

            if (durationSeconds !== undefined) {
                const meetsExpectation = durationSeconds <= expectedValue;
                if (meetsExpectation) {
                    ticketsMeetingExpectation.push(item);
                } else {
                    ticketsNotMeetingExpectation.push(item);
                }
            }
        });

        const percentageMeetingExpectation = (ticketsMeetingExpectation.length / totalTickets) * 100;
        const percentageNotMeetingExpectation = 100 - percentageMeetingExpectation;

        setDataForPie([
            { name: 'Cumple', value: percentageMeetingExpectation },
            { name: 'No Cumple', value: percentageNotMeetingExpectation },
        ]);
    };

    useEffect(() => {
        const duracionesTotales = mainPaginated.data.map(item => ({
            duraciontotal: item.duraciontotal,
            TME: item.tiempopromediorespuesta,
            TMR: item.tiempopromediorespuestapersona
        }));

        updateDataForPie(tabIndex, duracionesTotales);
    }, [mainPaginated.data, tabIndex]);

    const [openSeButtonsAgent, setOpenSeButtonsAgent] = useState(false);
    const [anchorElSeButtonsAgent, setAnchorElSeButtonsAgent] = useState<null | HTMLElement>(null);
    const [openSeButtonsTickets, setOpenSeButtonsTickets] = useState(false);
    const [anchorElSeButtonsTickets, setAnchorElSeButtonsTickets] = useState<null | HTMLElement>(null);

    const handleClickSeButtons = (event: React.MouseEvent<HTMLButtonElement>, type: string) => {
        if (type === 'agent') {
            setAnchorElSeButtonsAgent(anchorElSeButtonsAgent ? null : event.currentTarget);
            setOpenSeButtonsAgent((prevOpen) => !prevOpen);
        } else if (type === 'tickets') {
            setAnchorElSeButtonsTickets(anchorElSeButtonsTickets ? null : event.currentTarget);
            setOpenSeButtonsTickets((prevOpen) => !prevOpen);
        }
    };

    const RenderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, summary }: Dictionary) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {summary}
            </text>
        );
    };

    const isPromedioMenorEsperado = (avg: string, expected: string) => {
        const avgSeconds = getSecondsFromTimeString(avg);
        const expectedSeconds = getSecondsFromTimeString(expected);
        const toleranceThreshold = 0.5;
        if (Math.abs(avgSeconds - expectedSeconds) <= toleranceThreshold) {
            return true;
        }
        return avgSeconds < expectedSeconds;
    };

    const getSecondsFromTimeString = (timeString: string) => {
        if (typeof timeString === 'string') {
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            return hours * 3600 + minutes * 60 + seconds;
        } else {
            return 0;
        }
    };

    useEffect(() => {
        const handleClickOutsideAgent = (event: MouseEvent) => {
            const target = event.target as Node;
            if (anchorElSeButtonsAgent && !anchorElSeButtonsAgent.contains(target)) {
                setAnchorElSeButtonsAgent(null);
                setOpenSeButtonsAgent(false);
            }
        };
        document.addEventListener("click", handleClickOutsideAgent);
        return () => {
            document.removeEventListener("click", handleClickOutsideAgent);
        };
    }, [anchorElSeButtonsAgent, setOpenSeButtonsAgent]);

    useEffect(() => {
        const handleClickOutsideTickets = (event: MouseEvent) => {
            const target = event.target as Node;
            if (anchorElSeButtonsTickets && !anchorElSeButtonsTickets.contains(target)) {
                setAnchorElSeButtonsTickets(null);
                setOpenSeButtonsTickets(false);
            }
        };
        document.addEventListener("click", handleClickOutsideTickets);
        return () => {
            document.removeEventListener("click", handleClickOutsideTickets);
        };
    }, [anchorElSeButtonsTickets, setOpenSeButtonsTickets]);

    let avg: string;
    let tabExpectedValue: string;

    switch (tabIndex) {
        case 0:
            avg = avgTMO;
            tabExpectedValue = expectedTMOValue;
            break;
        case 1:
            avg = avgTME;
            tabExpectedValue = expectedTMEValue;
            break;
        case 2:
            avg = avgTMR;
            tabExpectedValue = expectedTMRValue;
            break;
        default:
            avg = '';
            tabExpectedValue = '';
    }

    function formatTime(timeString: string) {
        const timeParts = timeString.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = parseInt(timeParts[2]);
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    return (
        <>
            {/* Inicio de la Cabezera 1 ----------------------------------------------------*/}
            <div style={{ display: "flex", gap: 8, marginBottom: '1rem', marginTop: '0.5rem' }}>
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
                                    onSelect={setdateRange}
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
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: '0 15px' }}>
                                <div style={{ alignItems: 'center' }}>
                                    <div>
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary">{t(langKeys.report_userproductivity_filter_includebot)}</Box>
                                        <FormControlLabel
                                            style={{ paddingLeft: 10 }}
                                            control={<IOSSwitch checked={checkedA} onChange={handleChange} />}
                                            label={checkedA ? t(langKeys.yes) : "No"}
                                        />
                                    </div>
                                </div>
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

            {/* Tabs TMO TME TMR ----------------------------------------------------*/}
            <Tabs
                value={tabIndex}
                onChange={handleChangeTab}
                className={classes.tabs}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
            >
                {tabTexts.map((tab, index) => (
                    <AntTab key={index} label={tab.label} />
                ))}
            </Tabs>

            {/* Card Velocimetro TMO  ----------------------------------------------------*/}
            <div style={{ margin: '0.5rem 0' }}>
                <Card style={{ margin: '0', padding: 0 }}>
                    <CardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{tabTexts[tabIndex].label}</Typography>
                                <Typography>{tabTexts[tabIndex].title}</Typography>
                            </div>
                            <div style={{ display: 'flex', gap: 5 }}>
                                <CloudDownloadIcon style={{ color: "#2E2C34", cursor: 'pointer' }} onClick={() => exportExcel("report" + (new Date().toISOString()), mainPaginated.data, columnsGaugeChart.filter((x: Dictionary) => (!x.isComponent && !x.activeOnHover)))} />
                                <SettingsIcon style={{ color: "#2E2C34", cursor: "pointer" }} onClick={() => setOpenExpectedValueModal(true)} />
                            </div>
                        </div>

                        <div style={{ width: '85vw', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ color: '#783BA5', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                                <div>{tabTexts[tabIndex].label} {' '} {t(langKeys.expected)}</div>
                                <div style={{ fontWeight: 'normal' }}>{expectedValue}</div>
                            </div>
                            <GaugeChart
                                style={{ width: '450px' }}
                                id="gauge-chart"
                                arcsLength={gaugeArcs}
                                colors={['#00B050', '#FF0000']}
                                needleColor="#783BA5"
                                needleBaseColor="#783BA5"
                                textColor="#000000"
                                animate={false}
                                percent={
                                    isPromedioMenorEsperado(avg, tabExpectedValue)
                                        ? 4.3
                                        : 8.8
                                }
                                formatTextValue={() => ``}
                            />
                            <div style={{ color: '#783BA5', fontSize: '12px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>
                                <div>{tabTexts[tabIndex].label} {t(langKeys.function_average)}</div>
                                <div style={{ fontWeight: 'normal' }}>
                                    {tabIndex === 0 && !isNaN(parseFloat(avgTMO)) ? formatTime(avgTMO) : tabIndex === 0 ? '00:00:00' : ''}
                                    {tabIndex === 1 && !isNaN(parseFloat(avgTME)) ? formatTime(avgTME) : tabIndex === 1 ? '00:00:00' : ''}
                                    {tabIndex === 2 && !isNaN(parseFloat(avgTMR)) ? formatTime(avgTMR) : tabIndex === 2 ? '00:00:00' : ''}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <DialogZyx
                    open={openExpectedValueModal}
                    title={t(langKeys.expectedValueConfig)}
                >
                    <div style={{ marginBottom: '1rem', display: 'flex', gap: 10 }}>
                        <TextField
                            label="HH"
                            variant="outlined"
                            value={hour}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                                setHour(value);
                                validateTime(value, minute, second);
                            }}
                            fullWidth
                            inputProps={{ maxLength: 2 }}
                        />
                        <TextField
                            label="MM"
                            variant="outlined"
                            value={minute}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                                setMinute(value);
                                validateTime(hour, value, second);
                            }}
                            fullWidth
                            inputProps={{ maxLength: 2 }}
                        />
                        <TextField
                            label="SS"
                            variant="outlined"
                            value={second}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                                setSecond(value);
                                validateTime(hour, minute, value);
                            }}
                            fullWidth
                            inputProps={{ maxLength: 2 }}
                        />
                    </div>
                    {errorText && <div style={{ color: 'red', textAlign: 'center' }}>{errorText}</div>}
                    <DialogActions>
                        <Button onClick={() => setOpenExpectedValueModal(false)} color="default">
                            {t(langKeys.cancel)}
                        </Button>
                        <Button
                            onClick={() => {
                                handleAccept()
                                setOpenExpectedValueModal(false)
                                fetchData()
                            }}

                            color="primary"
                            disabled={Boolean(errorText)}>
                            {t(langKeys.accept)}
                        </Button>
                    </DialogActions>
                </DialogZyx>
            </div>

            <Grid container spacing={3} className={classes.containerDetails}>
                {/* Card Asesor con TMO Promedio  ----------------------------------------------------*/}
                <Grid item xs={12} md={6} lg={6}>
                    <Card style={{ height: '30rem', margin: 0 }}>
                        <CardContent >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}> {t(langKeys.agentWith)} {' '}  {tabTexts[tabIndex].label} {' '} {t(langKeys.function_average)} </Typography>
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <SubjectIcon style={{ color: '#2E2C34', cursor: 'pointer' }} onClick={(event) => handleClickSeButtons(event, 'agent')} />

                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Popper
                                            open={openSeButtonsAgent}
                                            anchorEl={anchorElSeButtonsAgent}
                                            placement="bottom"
                                            transition
                                            style={{ marginRight: '1rem' }}
                                        >
                                            {({ TransitionProps }) => (
                                                <Paper {...TransitionProps} elevation={5}>
                                                    <MenuItem
                                                        style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                        onClick={() => {
                                                            setOrderTypevgAgent("desc");
                                                            setSortByvgAgent("value");
                                                            event.stopPropagation();
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <TrendingDownIcon fontSize="small" style={{ fill: 'grey', height: '25px' }} />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">{t(langKeys.majorToMinor)}</Typography>
                                                    </MenuItem>
                                                    <Divider />
                                                    <div>
                                                        <MenuItem
                                                            style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                            onClick={() => {
                                                                setOrderTypevgAgent("asc");
                                                                setSortByvgAgent("value");
                                                                event.stopPropagation();
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <TrendingUpIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                                            </ListItemIcon>
                                                            <Typography variant="inherit">{t(langKeys.minorToMajor)}</Typography>
                                                        </MenuItem>
                                                        <Divider />
                                                    </div>
                                                    <div>
                                                        <MenuItem
                                                            style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                            onClick={() => {
                                                                setOrderTypevgAgent("asc");
                                                                setSortByvgAgent("name");
                                                                event.stopPropagation();
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <PersonIcon fontSize="small" style={{ fill: 'grey', height: '25px' }} />
                                                            </ListItemIcon>
                                                            <Typography variant="inherit">{t(langKeys.byAdvisorName)} </Typography>
                                                        </MenuItem>
                                                        <Divider />
                                                    </div>
                                                </Paper>
                                            )}
                                        </Popper>
                                    </div>

                                    <CloudDownloadIcon style={{ color: "#2E2C34", cursor: 'pointer' }} onClick={() => exportExcel("report" + (new Date().toISOString()), mainPaginated.data, columnsGaugeChart.filter((x: Dictionary) => (!x.isComponent && !x.activeOnHover)))} />
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                    <Button
                                        color="primary"
                                        onClick={() => setCurrentPageAsesor((prevPage) => Math.max(prevPage - 1, 0))}
                                        disabled={currentPageAsesor === 0}
                                    >
                                        <KeyboardArrowLeftIcon />
                                    </Button>
                                    <div>
                                        {`${currentPageAsesor + 1} de ${Math.ceil(dataForAgentAvg.length / itemsPerPageAsesor)}`}
                                    </div>
                                    <Button
                                        color="primary"
                                        onClick={() => setCurrentPageAsesor((prevPage) => prevPage + 1)}
                                        disabled={(currentPageAsesor + 1) * itemsPerPageAsesor >= dataForAgentAvg.length}
                                    >
                                        <KeyboardArrowRightIcon />
                                    </Button>
                                </div>
                                <ResponsiveContainer width="100%" height={itemsPerPage * 50}>
                                    <BarChart
                                        data={slicedDataAsesor}
                                        layout="horizontal"
                                        margin={{ top: 20, right: 50, left: 50, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" style={{ fontSize: "0.8em" }} angle={315} interval={0} textAnchor="end" height={330} dy={5} dx={-5} />
                                        <Tooltip
                                            labelFormatter={(name) => {
                                                const email = dataGrid.find(item => item.fullname.toLowerCase() === name.toLowerCase())?.email;
                                                return email ? email : name;
                                            }}
                                            formatter={(value: number, name: string) => [convertSecondsToHHMMSS(value), t(name)]}
                                        />
                                        <Bar dataKey="value" fill="#7721AD" textAnchor="end" stackId="a" type="monotone" >
                                            <LabelList dataKey="summary" position="top" />
                                            {
                                                dataForAgentAvg.map((entry: Dictionary, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={"#7721AD"} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card Cumplimiento TMO por Ticket  ----------------------------------------------------*/}
                <Grid item xs={12} md={6} lg={6}>
                    <Card style={{ height: '30rem' }}>
                        <CardContent style={{ paddingBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{t(langKeys.compliance)} {' '} {tabTexts[tabIndex].label}{' '} {t(langKeys.byTicket)} </Typography>
                                </div>
                            </div>
                            <div style={{ margin: '1rem 0', display: 'flex' }}>
                                <ResponsiveContainer height={300}>
                                    <PieChart>
                                        <Tooltip formatter={formatTooltip} />
                                        <Pie
                                            data={dataForPie}
                                            dataKey="value"
                                            labelLine={false}
                                            label={RenderCustomizedLabel}
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            fill="#7721AD"
                                        >
                                            {dataForClosedTickets.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#7721AD" : "#B41A1A"} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ overflowX: 'auto', width: '40vw', marginRight: '3rem' }}>
                                    <TableZyx
                                        columns={columnsFulfillmentByTicket(tabIndex)}
                                        filterGeneral={false}
                                        data={mainPaginated.data}
                                        download={false}
                                        loading={detailCustomReport.loading}
                                        register={false}
                                        toolsFooter={false}
                                        pageSizeDefault={10}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <DialogInteractions
                        openModal={openModalTicket}
                        setOpenModal={setOpenModalTicket}
                        ticket={rowSelected}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerDetails}>
                {/* Card N° Tickets Cerrados  ----------------------------------------------------*/}
                <Grid item xs={12} md={6} lg={6}>
                    <Card style={{ height: '32rem' }}>
                        <CardContent >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: 40 }}>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}> {t(langKeys.closedTicketsNum)}</Typography>
                                    <Typography style={{ fontSize: '1.3rem' }}>{totalClosedTickets}</Typography>
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <SubjectIcon style={{ color: '#2E2C34', cursor: 'pointer' }} onClick={(event) => handleClickSeButtons(event, 'tickets')} />
                                    <CloudDownloadIcon style={{ color: "#2E2C34", cursor: 'pointer' }} onClick={() => exportExcel("closedTicketsReport" + (new Date().toISOString()), dataGrid, columns.filter((x: Dictionary) => (!x.isComponent && !x.activeOnHover)))} />

                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Popper
                                            open={openSeButtonsTickets}
                                            anchorEl={anchorElSeButtonsTickets}
                                            placement="bottom"
                                            transition
                                            style={{ marginRight: '1rem' }}
                                        >
                                            {({ TransitionProps }) => (
                                                <Paper {...TransitionProps} elevation={5}>
                                                    <MenuItem
                                                        style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                        onClick={() => {
                                                            setOrderType("desc");
                                                            setSortBy("value");
                                                            event.stopPropagation();
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <TrendingDownIcon fontSize="small" style={{ fill: 'grey', height: '25px' }} />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">{t(langKeys.majorToMinor)}r</Typography>
                                                    </MenuItem>
                                                    <Divider />

                                                    <div>
                                                        <MenuItem
                                                            style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                            onClick={() => {
                                                                setOrderType("asc");
                                                                setSortBy("value");
                                                                event.stopPropagation();
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <TrendingUpIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                                            </ListItemIcon>
                                                            <Typography variant="inherit">{t(langKeys.minorToMajor)}</Typography>
                                                        </MenuItem>
                                                        <Divider />
                                                    </div>

                                                    <div>
                                                        <MenuItem
                                                            style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                            onClick={() => {
                                                                setOrderType("asc");
                                                                setSortBy("name");
                                                                event.stopPropagation();
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <PersonIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                                            </ListItemIcon>
                                                            <Typography variant="inherit">{t(langKeys.byAdvisorName)}</Typography>
                                                        </MenuItem>
                                                        <Divider />
                                                    </div>

                                                </Paper>
                                            )}
                                        </Popper>
                                    </div>



                                </div>
                            </div>

                            <div style={{ margin: '1rem 0' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Button
                                            color="primary"
                                            onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
                                            disabled={currentPage === 0}
                                        >
                                            <KeyboardArrowLeftIcon />
                                        </Button>
                                        <div>
                                            {`${currentPage + 1} de ${Math.ceil(dataForClosedTickets.length / itemsPerPage)}`}
                                        </div>
                                        <Button
                                            color="primary"
                                            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                                            disabled={(currentPage + 1) * itemsPerPage >= dataForClosedTickets.length}
                                        >
                                            <KeyboardArrowRightIcon />
                                        </Button>
                                    </div>
                                    <ResponsiveContainer height={350}>
                                        <BarChart
                                            data={slicedData}
                                            margin={{ top: 20, right: 50, left: 50, bottom: 40 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" style={{ fontSize: "0.8em" }} angle={315} interval={0} textAnchor="end" height={120} dy={5} dx={-5} />

                                            <ChartTooltip formatter={(value: number, name: string) => [value, t(name)]} />
                                            <Bar dataKey="value" fill="#7721AD" textAnchor="end" stackId="a" type="monotone" >
                                                <LabelList position="top" />
                                                {
                                                    dataForClosedTickets.map((entry: Dictionary, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={"#7721AD"} />
                                                    ))
                                                }
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card N° Asesores  ----------------------------------------------------*/}
                <Grid item xs={12} md={6} lg={6}>
                    <Card style={{ height: '32rem' }}>
                        <CardContent >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: 40 }}>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}> {t(langKeys.agentNumber)}</Typography>
                                    <Typography style={{ fontSize: '1.3rem' }}>{dataGrid.length}</Typography>
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <CloudDownloadIcon style={{ color: "#2E2C34", cursor: 'pointer' }} onClick={() => exportExcel("report" + (new Date().toISOString()), dataGrid, columns.filter((x: Dictionary) => (!x.isComponent && !x.activeOnHover)))} />
                                </div>
                            </div>

                            <TableZyx
                                columns={getColumns(tabIndex)}
                                filterGeneral={false}
                                data={dataGrid}
                                download={false}
                                loading={detailCustomReport.loading}
                                register={false}
                                pageSizeDefault={10}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};
export default DashboardAssesorProductivity;