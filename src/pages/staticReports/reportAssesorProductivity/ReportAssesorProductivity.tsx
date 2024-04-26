import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { cleanViewChange, getCollectionAux, getCollectionPaginated, getMainGraphic, getMultiCollection, resetMainAux, setViewChange } from "store/main/actions";
import { getPaginatedTicket, getReportColumnSel, getReportFilterSel, getUserProductivityGraphic, getUserProductivitySel } from "common/helpers/requestBodies";
import { AntTab, DateRangePicker, DialogZyx, FieldSelect, IOSSwitch } from "components";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Box, Button, DialogActions, Divider, ListItemIcon, MenuItem, Paper, Popper, Tabs, TextField, Typography } from "@material-ui/core";
import { CalendarIcon, DownloadIcon } from "icons";
import { Range } from "react-date-range";
import TableZyx from "components/fields/table-simple";
import { convertLocalDate, exportExcel } from "common/helpers";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { useForm } from "react-hook-form";
import Graphic from "components/fields/Graphic";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ListIcon from "@material-ui/icons/List";
import { Settings } from "@material-ui/icons";
import {  Card, CardContent, Grid } from "@material-ui/core";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SettingsIcon from '@material-ui/icons/Settings';
import SubjectIcon from '@material-ui/icons/Subject';
import { XAxis, YAxis, ResponsiveContainer, Tooltip as ChartTooltip, Tooltip as RechartsTooltip, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, LabelList } from 'recharts';
import GaugeChart from "react-gauge-chart";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { CellProps } from 'react-table';
import DialogInteractions from "components/inbox/DialogInteractions";
interface Assessor {
    row: Dictionary | null;
    allFilters: Dictionary[];
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

const columnsTemp = [
    "usr",
    "fullname",
    "hourfirstlogin",
    "totaltickets",
    "closedtickets",
    "asignedtickets",
    "suspendedtickets",
    "avgfirstreplytime",
    "maxfirstreplytime",
    "minfirstreplytime",
    "maxtotalduration",
    "mintotalduration",
    "avgtotalasesorduration",
    "maxtotalasesorduration",
    "mintotalasesorduration",
    "userconnectedduration",
    "userstatus",
    "groups",
];

type TimeData = {
    fullname: string;
    TMEPromedio?: string;
    TMRPromedio?: string;
    TMOAsesorPromedio?: string;
};

type PieChartData = {
    name: string;
    value: number;
};


const AssesorProductivityReport: FC<Assessor> = ({ allFilters, row }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const mainAux = useSelector((state) => state.main.mainAux);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const mainResult = useSelector(state => state.main);

    const [groupsdata, setgroupsdata] = useState<any>([]);
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
    const [columnGraphic, setColumnGraphic] = useState("");
    const [anchorElSeButtons, setAnchorElSeButtons] = React.useState<null | HTMLElement>(null);
    const [openSeButtons, setOpenSeButtons] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [maxmin, setmaxmin] = useState({
        maxticketsclosed: 0,
        maxticketsclosedasesor: "",
        minticketsclosed: 0,
        minticketsclosedasesor: "",
        maxtimeconnected: "0",
        maxtimeconnectedasesor: "",
        mintimeconnected: "0",
        mintimeconnectedasesor: "",
    });
    const [desconectedmotives, setDesconectedmotives] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalTicket, setOpenModalTicket] = useState(false);
    const [view, setView] = useState("GRID");
    const [dataGrid, setdataGrid] = useState<any[]>([]);   
    
    const [detailCustomReport, setDetailCustomReport] = useState<{
        loading: boolean;
        data: Dictionary[];
    }>({
        loading: false,
        data: [],
    });

    const [selectedRow, setSelectedRow] = useState<Dictionary | undefined>({});

    const cell = (props: CellProps<Dictionary>) => {
        const column = props.cell.column;
        const row = props.cell.row.original;
        return (
            <div onClick={() => {
                setSelectedRow(row);                                
            }}>             
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
        )
    }
  
    useEffect(() => {        
        dispatch(setViewChange("report_userproductivity"));
        dispatch(getMultiCollection([
            getReportColumnSel("UFN_REPORT_USERPRODUCTIVITY_SEL"),
            getReportFilterSel("UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC","UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC","probando"),
            getReportFilterSel("UFN_DOMAIN_LST_VALORES","UFN_DOMAIN_LST_VALORES_GRUPOS","GRUPOS"),
            getReportFilterSel("UFN_DOMAIN_LST_VALORES","UFN_DOMAIN_LST_VALORES_ESTADOORGUSER","ESTADOORGUSER"),
        ]));
        return () => {
            dispatch(cleanViewChange());
        };
    }, []);

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
                Header: t(langKeys.report_userproductivity_tmradviseravg),
                accessor: 'tmradviseravg',
                helpText: t(langKeys.report_userproductivity_tmradviseravg_help),
            },
            {
                Header: t(langKeys.report_userproductivity_userconnectedduration),
                accessor: 'userconnectedduration',
                type: "number",
                sortType: 'number',
            },
            {
                Header: t(langKeys.report_userproductivity_userstatus),
                accessor: 'userstatus',
            },
            {
                Header: t(langKeys.report_userproductivity_groups),
                accessor: 'groups',
            },
            ...(mainAux.data.length > 0 ?
                [...desconectedmotives.map((d: any) =>
                ({
                    Header: d,
                    accessor: d,
                })
                )
                ] : []
            )
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
                Header: t(langKeys.tmeAgent),
                accessor: 'tiempoprimerarespuestaasesor',              
            },
            {
                Header: t(langKeys.tme_help),
                accessor: 'duraciontotal',             
            },
            {
                Header: t(langKeys.tmo),
                accessor: 'tmoasesor',
            },
            {
                Header: t(langKeys.tmo_help),
                accessor: 'duracionpausa',
            },
            {
                Header: t(langKeys.tmoasesorobj),
                accessor: 'supervisionduration',
            },          
            {
                Header: t(langKeys.tmrAgent),
                accessor: 'tiempopromediorespuesta',
            },
            {
                Header: t(langKeys.tmr),
                accessor: 'tiempopromediorespuestaasesor',
            },
            {
                Header: t(langKeys.tmrClient),
                accessor: 'tiempopromediorespuestapersona',
            },           
        ],
        []
    );

    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const openDialogInteractions = useCallback((row: any) => {
        setOpenModalTicket(true);
        setRowSelected({ ...row, displayname: row.name, ticketnum: row.numeroticket })
    }, [mainResult]); 

    const getColumns = (tabIndex: any) => {
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
                        Header: t(langKeys.report_userproductivity_userconnectedduration),
                        accessor: 'userconnectedduration',
                        type: "number",
                        sortType: 'number',
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
                        Header: t(langKeys.report_userproductivity_userconnectedduration),
                        accessor: 'userconnectedduration',
                        type: "number",
                        sortType: 'number',
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
                        Header: t(langKeys.report_userproductivity_userconnectedduration),
                        accessor: 'userconnectedduration',
                        type: "number",
                        sortType: 'number',
                    },
                ];
            default:
                return [];
        }
    };


    const columnsFulfillmentByTicket = (tabIndex: any) => {
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
                        Cell: cell
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
                        Cell: cell
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
                        Cell: cell
                    }
                ];
            default:
                return [];
        }
    };



    
    useEffect(() => {
        if (allFilters) {
            if(!multiData.loading && !multiData.error && multiData.data.length){
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
                        (mainAux.data as any).reduce(
                            (ac: string[], x: any) =>
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
            sorts: {duraciontotal : "desc"},
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

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };

    const handleChange = (event: any) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        setValue("bot", event.target.checked);
        setcheckedA(event.target.checked);
    };

    const format = (date: Date) => date.toISOString().split("T")[0];

    const handlerSearchGraphic = (daterange: any, column: string) => {
        dispatch(
            getMainGraphic(
                getUserProductivityGraphic({
                    ...allParameters,
                    startdate: daterange?.startDate!,
                    enddate: daterange?.endDate!,
                    column,
                    summarization: "COUNT",
                })
            )
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

    const [orderType, setOrderType] = useState("");
    const [sortBy, setSortBy] = useState("");

    const dataForClosedTickets = dataGrid.map(item => ({
        name: item.fullname,
        value: parseInt(item.closedtickets)
    }));


  


   

    const totalClosedTickets = dataGrid.reduce((total, item) => total + parseInt(item.closedtickets), 0);

    const [tabIndex, setTabIndex] = useState(0);
    const [tabTexts] = useState([
        { label: 'TMO', title: 'Tiempo Medio de la Operación' },
        { label: 'TME', title: 'Tiempo de primera respuesta' },
        { label: 'TMR', title: 'Tiempo promedio de respuesta' }
    ]);

    const handleChangeTab = (event, newValue) => {
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

    const dataForAvgAgent = dataGrid.map(item => ({
        name: item.fullname,
        value: item[valueKey]
    }));

    const timeToSeconds = (timeString: any) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };
    
    const dataForAvgAgentInSeconds = dataForAvgAgent.map(item => ({
        name: item.name,
        value: timeToSeconds(item.value)
    }));

    
    function calculateAverageTime(data: TimeData[], timeKey: keyof TimeData) {
        const totalSeconds = data.reduce((totalSeconds, item) => {
            const timeValue = item[timeKey];
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
    
    const tmeValues = dataGrid.map(item => ({ TMEPromedio: item.avgfirstreplytime }));
    const avgTME = calculateAverageTime(tmeValues, 'TMEPromedio');
    
    const tmrValues = dataGrid.map(item => ({ TMRPromedio: item.tmravg }));
    const avgTMR = calculateAverageTime(tmrValues, 'TMRPromedio');
    
    const tmoValues = dataGrid.map(item => ({ TMOAsesorPromedio: item.avgtotalasesorduration }));
    const avgTMO = calculateAverageTime(tmoValues, 'TMOAsesorPromedio');

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

    const sortedDataForAvgAgent = dataForAvgAgentInSeconds.slice().sort((a, b) => {
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

    const handleAccept = () => {
        if (validateTime()) {
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
        }
    };



  

    useEffect(() => {
        console.log('Nuevo tabIndex:', tabIndex);
        switch (tabIndex) {
            case 0:
                console.log('Valor esperado de TMO:', expectedTMOValue);
                setExpectedValue(expectedTMOValue);
                break;
            case 1:
                console.log('Valor esperado de TME:', expectedTMEValue);
                setExpectedValue(expectedTMEValue);
                break;
            case 2:
                console.log('Valor esperado de TMR:', expectedTMRValue);
                setExpectedValue(expectedTMRValue);
                break;
            default:
                console.log('Valor esperado de TMO:', expectedTMOValue);
                setExpectedValue(expectedTMOValue);
                break;
        }
    }, [tabIndex, expectedTMOValue, expectedTMEValue, expectedTMRValue]);
    
    const validateTime = () => {
        const h = parseInt(hour, 10);
        const m = parseInt(minute, 10);
        const s = parseInt(second, 10);

        if (isNaN(h) || isNaN(m) || isNaN(s) || h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
            setErrorText('Por favor, ingrese una hora válida.');
            return false;
        }
        setErrorText('');
        return true;
    };

   const updateDataForPie = (tabIndex: number, data: { duraciontotal: string }[]) => {
    let expectedValue: string = '00:00:00';
    if (tabIndex === 0) {
        expectedValue = expectedTMOValue;
    } else if (tabIndex === 1) {
        expectedValue = expectedTMEValue;
    } else if (tabIndex === 2) {
        expectedValue = expectedTMRValue;
    }
    const top10 = data.slice(0, 10);
    const belowOrEqualToExpected = top10.filter(item => item.duraciontotal <= expectedValue).length;
    const percentageBelowOrEqualToExpected = (belowOrEqualToExpected / 10) * 100;
    const percentageAboveExpected = 100 - percentageBelowOrEqualToExpected;
    setDataForPie([
        { name: 'Cumple', value: percentageBelowOrEqualToExpected },
        { name: 'No Cumple', value: percentageAboveExpected },
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

    

    const handleClickSeButtons = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElSeButtons(anchorElSeButtons ? null : event.currentTarget);
        setOpenSeButtons((prevOpen) => !prevOpen);
    };

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const slicedData = sortedData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage        
    );

    const [currentPageAsesor, setCurrentPageAsesor] = useState(0);
    const itemsPerPageAsesor = 5;

    const handlePrevPageAsesor = () => {
        setCurrentPageAsesor((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPageAsesor = () => {
        setCurrentPageAsesor((prevPage) => prevPage + 1);
    };

    const slicedDataAsesor = sortedDataForAvgAgent.slice(
        currentPageAsesor * itemsPerPageAsesor,
        (currentPageAsesor + 1) * itemsPerPageAsesor        
    );




    const generateRandomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    const getNextColorGenerator = (): (() => string) => {
        const predefinedColors = ["#7721AD", "#B41A1A", "#9DABBD", "#FFA000", "#50AE54", "#001AFF", "#2BD37B", "#FFA34F", "#FC0D1B", "#FFBF00", "#0F7F13", "#00CFE5", "#1D1856", "#FB5F5F", "#B061E1"];
        let currentIndex = 0;
        const usedColors = [...predefinedColors];
    
        return () => {
            if (currentIndex < predefinedColors.length) {
                const color = predefinedColors[currentIndex];
                currentIndex++;
                return color;
            } else {
                const randomColor = generateRandomColor();
                if (!usedColors.includes(randomColor)) {
                    usedColors.push(randomColor);
                    return randomColor;
                } else {
                    return getNextColorGenerator()();
                }
            }
        };
    };    
    const randomColorGenerator = getNextColorGenerator();

    

    const RenderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, summary, ...rest }: Dictionary) => {
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

    const isPromedioMenorEsperado = (avg: string) => {
        const avgSeconds = getSecondsFromTimeString(avg);
        const expectedSeconds = getSecondsFromTimeString(expectedValue);
        return avgSeconds < expectedSeconds;
    };

    const getSecondsFromTimeString = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };
    const [gaugeArcs, setGaugeArcs] = useState([100, 100]);
    const [detaildata, setDetaildata] = useState<any>({
        previousvalue: getRandomInt(0, 100),
        currentvalue: getRandomInt(0, 100),
        updatedate: new Date().toISOString(),
        target: isPromedioMenorEsperado(avgTMO) ? getRandomInt(50, 100) : getRandomInt(0, 50),
        cautionat: isPromedioMenorEsperado(avgTMO) ? getRandomInt(30, 70) : getRandomInt(0, 30),
        alertat: isPromedioMenorEsperado(avgTMO) ? getRandomInt(0, 30) : getRandomInt(70, 100)
    });
      
    function getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const COLORS = ["#0f8fe5", "#067713", "#296680", "#fc3617", "#e8187a", "#7cfa57", "#cfbace", "#4cd45f", "#fd5055", "#7e1be4", "#bf1490", "#66c6cf", "#011c3d", "#1a9595", "#4ae2c7", "#515496", "#a2aa65", "#df909c", "#3aa343", "#e0606e"];



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
            <div style={{margin: '0.5rem 0'}}>
                <Card style={{ margin: '0',  padding: 0}}>
                    <CardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{tabTexts[tabIndex].label}</Typography>
                                <Typography>{tabTexts[tabIndex].title}</Typography>
                            </div>
                            <div style={{ display: 'flex', gap: 5 }}>
                                <CloudDownloadIcon style={{ color: "#2E2C34", cursor: 'pointer' }} onClick={() => exportExcel("report" + (new Date().toISOString()), mainPaginated.data, columnsGaugeChart.filter((x: any) => (!x.isComponent && !x.activeOnHover)))} />
                                <SettingsIcon style={{ color: "#2E2C34", cursor: "pointer" }} onClick={() => setOpenExpectedValueModal(true)} />
                            </div>
                        </div>

                        <div style={{ width: '85vw', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ color: '#783BA5', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                                <div>{tabTexts[tabIndex].label} Esperado</div>
                                <div style={{ fontWeight: 'normal' }}>{expectedValue}</div>
                            </div>
                            <GaugeChart
                                style={{ width: '450px' }}
                                id="gauge-chart"
                                arcsLength={gaugeArcs}
                                colors={isPromedioMenorEsperado(avgTMO) ? ['#00B050', '#FF0000']: ['#FF0000', '#00B050'] }
                                needleColor="#783BA5"
                                needleBaseColor="#783BA5"
                                textColor="#000000"
                                animate={false}
                                percent={
                                    detaildata.target < detaildata.alertat
                                        ? detaildata?.currentvalue / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.alertat * 1.2 / 10) * 10))
                                        : detaildata?.currentvalue / (Math.max(detaildata?.currentvalue, Math.ceil(detaildata.target * 1.2 / 10) * 10))
                                }
                                formatTextValue={() => ``}
                            />
                            <div style={{ color: '#783BA5', fontSize: '12px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>
                                <div>{tabTexts[tabIndex].label} Promedio</div>
                                <div style={{ fontWeight: 'normal' }}>
                                    {tabIndex === 0 && avgTMO}
                                    {tabIndex === 1 && avgTME}
                                    {tabIndex === 2 && avgTMR}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <DialogZyx
                    open={openExpectedValueModal}
                    title="Configuración del valor esperado"
                >
                    <div style={{ marginBottom: '1rem', display: 'flex', gap: 10 }}>
                        <TextField
                            label="HH"
                            variant="outlined"
                            value={hour}
                            onChange={(e) => {
                                setHour(e.target.value.replace(/\D/g, '').slice(0, 2));
                                validateTime();
                            }}
                            fullWidth
                            inputProps={{ maxLength: 2 }}
                        />
                        <TextField
                            label="MM"
                            variant="outlined"
                            value={minute}
                            onChange={(e) => {
                                setMinute(e.target.value.replace(/\D/g, '').slice(0, 2));
                                validateTime();
                            }}
                            fullWidth
                            inputProps={{ maxLength: 2 }}
                        />
                        <TextField
                            label="SS"
                            variant="outlined"
                            value={second}
                            onChange={(e) => {
                                setSecond(e.target.value.replace(/\D/g, '').slice(0, 2));
                                validateTime();
                            }}
                            fullWidth
                            inputProps={{ maxLength: 2 }}
                        />
                    </div>
                    {errorText && <div style={{ color: 'red', textAlign: 'center' }}>{errorText}</div>}
                    <DialogActions>
                        <Button onClick={() => setOpenExpectedValueModal(false)} color="default">
                            Cancelar
                        </Button>
                        <Button 
                            onClick={() => {                                
                                handleAccept()
                                setOpenExpectedValueModal(false)
                                fetchData()
                            }}
                            
                            color="primary" 
                            disabled={Boolean(errorText)}>
                            Aceptar
                        </Button>
                    </DialogActions>
                </DialogZyx>
            </div>                    

            <Grid container spacing={3} className={classes.containerDetails}>
                {/* Card Asesor con TMO Promedio  ----------------------------------------------------*/}
                <Grid item xs={12} md={6} lg={6}>
                    <Card style={{height:'25rem', margin:0}}>
                        <CardContent >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}> Asesor con {tabTexts[tabIndex].label} Promedio</Typography>
                                </div>

                                <div style={{ display: 'flex', gap: 5 }}>
                                
                                    

                                    <SubjectIcon style={{ color: '#2E2C34', cursor:'pointer' }} onClick={(event) => handleClickSeButtons(event)} />
                       
                                
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <Popper
                                            open={openSeButtons}
                                            anchorEl={anchorElSeButtons}
                                            placement="bottom"
                                            transition
                                            style={{ marginRight: '1rem' }}
                                        >
                                            {({ TransitionProps }) => (
                                                <Paper {...TransitionProps} elevation={5}>
                                                    <MenuItem
                                                        style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                    
                                                    >
                                                        <ListItemIcon>
                                                            <SubjectIcon fontSize="small" style={{ fill: 'grey', height: '25px' }} />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Mayor a Menor</Typography>
                                                    </MenuItem>
                                                    <Divider />
                                                

                                                    <div>
                                                        <MenuItem
                                                            style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                        >
                                                            <ListItemIcon>
                                                                <SubjectIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                                            </ListItemIcon>
                                                            <Typography variant="inherit">Menor a Mayor</Typography>
                                                        </MenuItem>
                                                        <Divider />
                                                    </div>

                                                    <div>
                                                        <MenuItem
                                                            style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                            onClick={() => setOrderType("asc")}
                                                        >
                                                            <ListItemIcon>
                                                                <SubjectIcon fontSize="small" style={{ fill: 'grey', height: '25px' }} />
                                                            </ListItemIcon>
                                                            <Typography variant="inherit">Por Nombre de Asesor</Typography>
                                                        </MenuItem>

                                                        <Divider />
                                                    </div>
                                            
                                                
                                                </Paper>
                                            )}
                                        </Popper>
                                    </div>

                                    <CloudDownloadIcon style={{ color: "#2E2C34", cursor: 'pointer' }} onClick={() => exportExcel("report" + (new Date().toISOString()), mainPaginated.data, columnsGaugeChart.filter((x: any) => (!x.isComponent && !x.activeOnHover)))} />
                                            
                                </div>
                            </div>

                            <div style={{ margin: '1rem 0' }}>
                                                                                 
                                <div style={{ }}>   

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                        <Button
                                            color="primary"
                                            onClick={handlePrevPageAsesor}
                                            disabled={currentPageAsesor === 0}
                                        >
                                            <KeyboardArrowLeftIcon />
                                        </Button>
                                        <div>
                                            {`${currentPageAsesor + 1} de ${Math.ceil(dataForClosedTickets.length / itemsPerPageAsesor)}`}
                                        </div>
                                        <Button
                                            color="primary"
                                            onClick={handleNextPageAsesor}
                                            disabled={(currentPageAsesor + 1) * itemsPerPageAsesor >= dataForClosedTickets.length}
                                        >
                                            <KeyboardArrowRightIcon />
                                        </Button>

                                    </div>

                                    <ResponsiveContainer height={300}>
                                        <BarChart
                                            data={slicedDataAsesor}
                                            margin={{top: 20, right: 30, left: 20, bottom: 5}}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" style={{ fontSize: "0.8em" }} angle={315} interval={0} textAnchor="end"  height={150} dy={5} dx={-5} />
                                            <YAxis />
                                            <ChartTooltip formatter={(value:any, name:any)=> [value,t(name)]} />
                                            <Bar dataKey="value" fill="#7721AD" textAnchor="end" stackId="a" type="monotone" >
                                                <LabelList dataKey="summary" position="top" />
                                                {
                                                    dataForClosedTickets.map((entry: any, index: any) => (
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

                {/* Card Cumplimiento TMO por Ticket  ----------------------------------------------------*/}
                <Grid item xs={12} md={6} lg={6}>
                    <Card style={{height:'25rem'}}>
                        <CardContent style={{ paddingBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>Cumplimiento {tabTexts[tabIndex].label} por Ticket</Typography>
                                </div>
                              
                            </div>

                            <div style={{ margin: '1rem 0',  display: 'flex' }}>
                                <ResponsiveContainer height={300}>
                                    <PieChart>
                                        <ChartTooltip />
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
                                                <Cell key={`cell-${index}`} fill={randomColorGenerator()} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ overflowX: 'auto', width:'40vw', marginRight:'3rem' }}>
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
                    <Card style={{height:'32rem'}}>
                        <CardContent >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{display:'flex', gap: 40}}>
                                    <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}> N° Tickets Cerrados</Typography>
                                    <Typography style={{  fontSize: '1.3rem' }}>{totalClosedTickets}</Typography>
                                </div>

                                <div style={{ display: 'flex', gap: 5 }}>                               
                                    
                                    <SubjectIcon style={{ color: '#2E2C34', cursor:'pointer' }} onClick={(event) => handleClickSeButtons(event)} />
                       
                                
                                    <div style={{ display: 'flex', gap: 8 }}>
                                    <Popper
                                        open={openSeButtons}
                                        anchorEl={anchorElSeButtons}
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
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <SubjectIcon fontSize="small" style={{ fill: 'grey', height: '25px' }} />
                                                    </ListItemIcon>
                                                    <Typography variant="inherit">Mayor a Menor</Typography>
                                                </MenuItem>

                                                <Divider />

                                                <div>
                                                    <MenuItem
                                                        style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                        onClick={() => {
                                                            setOrderType("asc");
                                                            setSortBy("value");
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <SubjectIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Menor a Mayor</Typography>
                                                    </MenuItem>
                                                    <Divider />
                                                </div>

                                                <div>
                                                    <MenuItem
                                                        style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                        onClick={() => {
                                                            setOrderType("asc");
                                                            setSortBy("name");
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <SubjectIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Por Nombre de Asesor</Typography>
                                                    </MenuItem>
                                                    <Divider />
                                                </div>

                                            </Paper>
                                        )}
                                    </Popper>

                                    </div>

                                    <CloudDownloadIcon style={{ color: "#2E2C34", cursor: 'pointer' }} onClick={() => exportExcel("closedTicketsReport" + (new Date().toISOString()), dataGrid, columns.filter((x: Dictionary) => (!x.isComponent && !x.activeOnHover)))} />
                                            
                                </div>
                            </div>

                            <div style={{ margin: '1rem 0' }}>
                                                                                 
                                <div >   

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
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

                                    <ResponsiveContainer height={300}>
                                        <BarChart
                                            data={slicedData} 
                                            margin={{top: 0, right: 20, left: 0, bottom: 0}}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" style={{ fontSize: "0.8em" }} angle={315} interval={0} textAnchor="end"  height={160} dy={5} dx={-5} />
                                            <YAxis />
                                            <ChartTooltip formatter={(value:any, name:any)=> [value,t(name)]} />
                                            <Bar dataKey="value" fill="#7721AD" textAnchor="end" stackId="a" type="monotone" >
                                                <LabelList dataKey="summary" position="top" />
                                                {
                                                    dataForClosedTickets.map((entry: any, index: any) => (
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
                    <Card style={{height:'32rem'}}>
                        <CardContent >                          
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{display:'flex', gap: 40}}>
                                <Typography style={{ fontWeight: 'bold', fontSize: '1.3rem' }}> N° Asesores</Typography>
                                <Typography style={{  fontSize: '1.3rem' }}>{dataGrid.length}</Typography>
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







           






        
       

            {view === "GRID" ? (

                <>
                    <div style={{margin: '1rem 0'}}>
                        <Card style={{ margin: '0', boxShadow: 'none', background:'#F9F9FA' }}>
                         
                                <TableZyx
                                    columns={columns}
                                    filterGeneral={false}
                                    data={dataGrid}
                                    download={false}
                                    loading={detailCustomReport.loading}
                                    register={false}
                                    ButtonsElement={() => (
                                        <Box width={1} style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                disabled={detailCustomReport.loading || !(detailCustomReport.data.length > 0)}
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
                                                onClick={() => exportExcel("report" + (new Date().toISOString()), dataGrid, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                                                startIcon={<DownloadIcon />}
                                            >{t(langKeys.download)}
                                            </Button>
                                        </Box>
                                    )}
                                />
                           
                        </Card>

                      

                    </div>    
                
                </>
               
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
                        row={{ origin: "userproductivity" }}
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
                columns={[
                    ...columnsTemp.map((c) => ({
                        key: c,
                        value: `report_userproductivity_${c}`,
                    })),
                    ...desconectedmotives.map((d: any) => ({
                        key: `desconectedtimejson::json->>'${d}'`,
                        value: d,
                    })),
                ]}
            />          
        </>
    );
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
}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({
    openModal,
    setOpenModal,
    setView,  
    filters,
    columns,
    setColumnGraphic,
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
        dispatch(
            getMainGraphic(
                getUserProductivityGraphic({
                    ...filters,
                    column: data.column,
                    summarization: "COUNT",
                })
            )
        );
    };
    const excludeUserProductivity = [
        "hourfirstlogin",
        "avgfirstreplytime",
        "maxfirstreplytime",
        "minfirstreplytime",
        "avgtotalasesorduration",
        "groups",
    ];

    const filteredColumns = columns.filter((column) => !excludeUserProductivity.includes(column.key));

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

export default AssesorProductivityReport;