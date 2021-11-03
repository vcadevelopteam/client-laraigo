import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { DateRangePicker, DialogZyx, FieldMultiSelect, FieldSelect } from "components";
import { useSelector } from "hooks";
import { CalendarIcon } from "icons";
import { langKeys } from "lang/keys";
import { FC, Fragment, useEffect, useState } from "react";
import { resetMain, getMultiCollection, getMultiCollectionAux, getCollection } from 'store/main/actions';
import { Range } from 'react-date-range';
import clsx from 'clsx';
import PersonIcon from '@material-ui/icons/Person';
import ChatIcon from '@material-ui/icons/Chat';
import AdbIcon from '@material-ui/icons/Adb';
import { useTranslation } from "react-i18next";
import { exportExcel, getCommChannelLst, getdashboardoperativoEncuestaSel,getdashboardoperativoEncuestaSeldata, getdashboardoperativoProdxHoraDistSel, getdashboardoperativoProdxHoraSel,getdashboardoperativoSummarySeldata, getdashboardoperativoSummarySel,getdashboardoperativoTMEGENERALSeldata, getdashboardoperativoTMEGENERALSel, getdashboardoperativoTMOGENERALSel, getdashboardoperativoTMOGENERALSeldata, getLabelsSel, getSupervisorsSel, getValuesFromDomain } from "common/helpers";
import { useDispatch } from "react-redux";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Dictionary } from "@types";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Legend, Bar, PieChart, Pie, Cell, ComposedChart } from 'recharts';

const COLORS = ['#22b66e', '#b41a1a', '#ffcd56'];

function formatNumber(num: any) {
    if (num)
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0"
}
function formattime(cc: any) {
    if (!cc)
        return "0";
    let hh = Math.floor(cc / 3600) > 0 ? `${Math.floor(cc / 3600)}h ` : ""
    let mm = Math.floor((cc % 3600) / 60) > 0 ? `${Math.floor((cc % 3600) / 60)}m ` : ""
    let ss = `${cc % 60}s`
    return `${hh}${mm}${ss}`
}

function timetoseconds(cc: any) {
    if (!cc)
        return 0;
    const times = cc.split(":");

    const hour = parseInt(times[0]);
    const minutes = parseInt(times[1]);
    const seconds = times[2] ? parseInt(times[2]) : 0;
    return (hour * 60 * 60) + (minutes * 60) + seconds;
}
function timetomin(cc: any) {
    if (!cc)
        return 0;
    const times = cc.split(":");
    const hour = parseInt(times[0]);
    const minutes = parseInt(times[1]);
    const seconds = parseInt(times[2]);
    return hour * 60 + minutes + (seconds >= 30 ? 1 : 0);
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        halfbox: {
            backgroundColor: 'white',
        },
        quarterbox: {
            backgroundColor: 'white',
            padding: "10px"
        },
        boxtitle: {
            fontWeight: "bold",
            fontSize: "1.6em",
            width: "50%"
        },
        boxtitledata: {
            fontSize: "1.6em",
            width: "50%",
            textAlign: "end",
            whiteSpace: 'nowrap'
        },
        boxtitlequarter: {
            fontWeight: "bold",
            fontSize: "1.5em",
        },
        maintitle: {
            fontWeight: "bold",
            fontSize: "2em",
        },
        rowstyles: {
            margin: "0!important"
        },
        containerFields: {
            margin: "0!important",
            display: "flex",
            width: "100%",
            // padding: "0 20px 10px 20px"
        },
        containerFieldsTitle: {
            margin: "0!important",
            display: "flex",
            width: "100%",
            // padding: "0 20px 30px 20px"
        },
        containerFieldsQuarter: {
            margin: "0!important",
            display: "flex",
            width: "100%",
            color: "white"
        },
        label: {
            width: "60%",
            fontSize: "1.2em",
        },
        datafield: {
            fontSize: "1.2em",
            width: "40%",
            textAlign: "end"
        },
        datafieldquarter: {
            fontSize: "1.2em",
            padding: "5px"
        },
        widthhalf: {
            flex: 1
        },
        columnCard2: {
            backgroundColor: "#FFF",
            display: 'flex',
            height: '100%',
            flex: 1,
            textAlign: "center",
            padding: theme.spacing(2),
            flexDirection: 'column',
            gap: theme.spacing(1)
        },
        columnCard: {
            // flex: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1)
        },
        widthsecondhalf: {
            width: "50%",
            paddingTop: "5%"
        },
        itemDate: {
            minHeight: 40,
            height: 40,
            border: '1px solid #bfbfc0',
            borderRadius: 4,
            color: 'rgb(143, 146, 161)'
        },
        fieldsfilter: {
            width: "100%",
        },
        colorgreen: {
            color: "#22B66E"
        },
        colorred: {
            color: "rgb(180, 26, 26)"
        },
        replacerowzyx: {
            display: 'flex',
            flex: 1,
            gap: theme.spacing(2),
            flexWrap: "wrap",
        },
        itemCard: {
            backgroundColor: "#FFF",
            display: 'flex',
            height: '100%',
            flex: 1,
            gap: 8,
            flexWrap: 'wrap',
            padding: theme.spacing(2),
            alignItems: 'center'
        },
        itemGraphic: {
            width: 200
        },
        dontshow: {
            display: "none"
        },
        downloadiconcontainer:{
            width:"100%",display: "flex",justifyContent: "end"
        },
        styleicon:{
            width: "18px",
            height: "18px",
            '&:hover': {
                cursor: 'pointer',
            }
        },
        containertitleboxes:{
            display: "flex",
            justifyContent: "space-between",
            width: "100%"
        }
    }),
);
const initialRange = {
    startDate: new Date(new Date().setDate(0)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}
const format = (date: Date) => date.toISOString().split('T')[0];

const DashboardProductivity: FC = () => {
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const mainResultData = useSelector(state => state.main.mainData);
    const remultiaux = useSelector(state => state.main.multiDataAux);
    const [downloaddatafile,setdownloaddatafile]=useState(false)
    const [titlefile, settitlefile] = useState('');
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [data, setData] = useState({
        dataTMO: "0s",
        obj_max: "< 0m",
        variaciontxt: "0s",
        variacioncolor: true,
        timeMax: "0s",
        timeMin: "0s",
        sla: "0%",
        variacionperccolor: true,
        variacionperc: 0,
        tickets_comply: 0,
        tickets_analyzed: 0,
        tickets_total: 0,
    });
    const [dataTME, setDataTME] = useState({
        dataTME: "0s",
        obj_max: "< 0m",
        variaciontxt: "0s",
        variacioncolor: true,
        timeMax: "0s",
        timeMin: "0s",
        sla: "0%",
        variacionperccolor: true,
        variacionperc: 0,
        tickets_comply: 0,
        tickets_analyzed: 0,
        tickets_total: 0,
    });
    const [dataSummary, setDataSummary] = useState({
        tmrglobal: "0m",
        dataTMRBot: "0m",
        dataTMRAsesor: "0m",
        dataTMRCliente: "0m",
        tasaabandono: "0m"
    });
    const [dataEncuesta, setDataEncuesta] = useState({
        dataNPS: "0%",
        nps_green: "0%",
        npsvariacioncolor: true,
        npsvariation: "0%",
        npspollssent: "0",
        npspollsanswered: "0",
        npstotalpromoters: 0,
        npstotaldetractors: 0,
        npstotalneutral: 0,
        npstotalconversations: 0,
        dataCSAT: "0%",
        csat_green: "0%",
        csatvariacioncolor: true,
        csatvariation: "0%",
        csatpollssent: "0",
        csatpollsanswered: "0",
        csattotalpromoters: 0,
        csattotaldetractors: 0,
        csattotalneutral: 0,
        csattotalconversations: 0,
        dataFCR: "0%",
        fcr_green: "0%",
        fcrvariacioncolor: true,
        fcrvariation: "0%",
        fcrpollssent: "0",
        fcrpollsanswered: "0",
        fcrtotalpromoters: 0,
        fcrtotaldetractors: 0,
        fcrtotalconversations: 0,
        dataFIX: "0%",
        fix_green: "0%",
        fixvariacioncolor: true,
        fixvariation: "0%",
        fixpollssent: "0",
        fixpollsanswered: "0",
        fixtotalpromoters: 0,
        fixtotaldetractors: 0,
        fixtotalconversations: 0,
    });
    const [dataTMOgraph, setDataTMOgraph] = useState([
        { label: t(langKeys.quantitymeets), quantity: 0 },
        { label: t(langKeys.quantitymeetsnot), quantity: 0 }
    ]);
    const [dataTMEgraph, setDataTMEgraph] = useState([
        { label: t(langKeys.quantitymeets), quantity: 0 },
        { label: t(langKeys.quantitymeetsnot), quantity: 0 }
    ]);
    const [dataNPSgraph, setDataNPSgraph] = useState([
        { label: t(langKeys.totalpromoters), quantity: 0 },
        { label: t(langKeys.totaldetractors), quantity: 0 },
        { label: t(langKeys.totalneutral), quantity: 0 }
    ]);
    const [dataCSATgraph, setDataCSATgraph] = useState([
        { label: t(langKeys.totalpromoters), quantity: 0 },
        { label: t(langKeys.totaldetractors), quantity: 0 },
        { label: t(langKeys.totalneutral), quantity: 0 }
    ]);
    const [dataFCRgraph, setDataFCRgraph] = useState([
        { label: t(langKeys.totalresolved), quantity: 0 },
        { label: t(langKeys.totalnotresolved), quantity: 0 },
    ]);
    const [dataFIXgraph, setDataFIXgraph] = useState([
        { label: t(langKeys.totalresolved), quantity: 0 },
        { label: t(langKeys.totalnotresolved), quantity: 0 },
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [resTMO, setResTMO] = useState<any>([]);
    const [resTME, setResTME] = useState<any>([]);
    const [resSummary, setResSummary] = useState<any>([]);
    const [resEncuesta, setResEncuesta] = useState<any>([]);
    const [tmoDistribution, settmoDistribution] = useState<any>([]);
    const [tmeDistribution, settmeDistribution] = useState<any>([]);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [dataqueue, setdataqueue] = useState<any>([]);
    const [dataLabel, setdataLabel] = useState<any>([]);
    const [prodxHoralvl1, setprodxHoralvl1] = useState<any>([]);
    const [prodxHoraDist, setprodxHoraDist] = useState(
        [
            {label:"0 - 3",connected:0, notconnected: 0},
            {label:"4 - 7",connected:0, notconnected: 0},
            {label:"8 - 10",connected:0, notconnected: 0},
            {label:"11 - 12",connected:0, notconnected: 0},
            {label:"13 +", connected:0, notconnected: 0}]
    );
    const [prodxHora, setprodxHora] = useState({
        prodlog: "0",
        prodcon: "0",
        prodbot: "0",
    });
    const [datasupervisors, setdatasupervisors] = useState<any>([]);
    const [dataprovider, setdataprovider] = useState<any>([]);
    const [datachannels, setdatachannels] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);
    const [searchfields, setsearchfields] = useState({
        queue: "",
        provider: "",
        channels: "",
        supervisor: "",
        label: "",
    });
    useEffect(() => {
        if (mainResult.multiData.data.length !== 0) {
            let multiData = mainResult.multiData.data;
            setdataqueue(multiData[0] && multiData[0].success ? multiData[0].data : []);
            setdataprovider(multiData[1] && multiData[1].success ? multiData[1].data : []);
            setdatachannels(multiData[2] && multiData[2].success ? multiData[2].data : []);
            setdatasupervisors(multiData[3] && multiData[3].success ? multiData[3].data : []);
            setdataLabel(multiData[4] && multiData[4].success ? multiData[4].data : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainResult])
    useEffect(() => {
        
        if (resTMO.length) {
            const { time_avg, tickets_comply, tickets_total, target_max, target_min, time_max, time_min, tickets_analyzed, target_percmax} = resTMO[0];
            let seconds = timetoseconds(time_avg)
            if (seconds >= 0) {
                let variacionperc = (tickets_comply / tickets_analyzed - parseFloat(target_percmax))*100
                variacionperc=variacionperc? variacionperc: 0;
                let hh = (Math.floor(seconds / 3600)) === 0 ? "" : (Math.floor(seconds / 3600) + "h ")
                let mm = Math.floor((seconds % 3600) / 60) === 0 ? "" : (Math.floor((seconds % 3600) / 60) + "m ")
                let ss = seconds % 60 + "s"
                let objetivo_max = timetomin(target_max)
                let dataTMO = `${hh}${mm}${ss}`
                setData(p => ({ ...p, dataTMO: dataTMO }))
                setData(p => ({ ...p, obj_max: `< ${objetivo_max}m ` }))

                let vartmo = timetoseconds(target_max) - seconds
                vartmo = seconds < timetoseconds(target_min) ? Math.abs(vartmo) * -1 : vartmo
                let sign = vartmo > 0 ? "" : "-"
                vartmo = Math.abs(vartmo)
                let variacioncolor = vartmo <= 0;

                hh = (Math.floor(vartmo / 3600)) === 0 ? "" : (Math.floor(vartmo / 3600) + "h ")
                mm = Math.floor((vartmo % 3600) / 60) === 0 ? "" : (Math.floor((vartmo % 3600) / 60) + "m ")
                ss = vartmo % 60 + "s"
                let variaciontxt = `${sign}${hh}${mm}${ss}`
                setData(p => ({ ...p, variaciontxt: variaciontxt }))
                setData(p => ({ ...p, variacioncolor: variacioncolor }))

                let secondsmax = timetoseconds(time_max)
                hh = (Math.floor(secondsmax / 3600)) === 0 ? "" : (Math.floor(secondsmax / 3600) + "h ")
                mm = Math.floor((secondsmax % 3600) / 60) === 0 ? "" : (Math.floor((secondsmax % 3600) / 60) + "m ")
                ss = secondsmax % 60 + "s"
                let timeMax = `${hh}${mm}${ss}`
                setData(p => ({ ...p, timeMax: timeMax }))

                let secondsmin = timetoseconds(time_min)
                hh = (Math.floor(secondsmin / 3600)) === 0 ? "" : (Math.floor(secondsmin / 3600) + "h ")
                mm = Math.floor((secondsmin % 3600) / 60) === 0 ? "" : (Math.floor((secondsmin % 3600) / 60) + "m ")
                ss = secondsmin % 60 + "s"
                let timeMin = `${hh}${mm}${ss}`
                setData(p => ({ ...p, timeMin: timeMin }))
                let sla = target_percmax?`${(parseFloat(target_percmax) * 100).toFixed(2)}%`:"0%"
                setData(p => ({ ...p, sla: sla }))

                let variacionperccolor = variacionperc >= 0;
                setData(p => ({ ...p, variacionperc: variacionperc }))
                setData(p => ({ ...p, variacionperccolor: variacionperccolor }))
                setData(p => ({ ...p, tickets_comply: tickets_comply }))
                setData(p => ({ ...p, tickets_analyzed: tickets_analyzed }))
                setData(p => ({ ...p, tickets_total: tickets_total }))

                setDataTMOgraph([
                    { label: t(langKeys.quantitymeets), quantity: tickets_comply },
                    { label: t(langKeys.quantitymeetsnot), quantity: tickets_analyzed - tickets_comply }
                ]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resTMO])
    useEffect(() => {
        if (resTME.length) {
            const { time_avg, tickets_comply, tickets_total, target_max, target_min, time_max, time_min, tickets_analyzed, target_percmax} = resTME[0];
            let seconds = timetoseconds(time_avg)
            if (seconds >= 0) {
                let variacionperc = (tickets_comply / tickets_analyzed - parseFloat(target_percmax))*100
                variacionperc=variacionperc? variacionperc: 0;
                let hh = (Math.floor(seconds / 3600)) === 0 ? "" : (Math.floor(seconds / 3600) + "h ")
                let mm = Math.floor((seconds % 3600) / 60) === 0 ? "" : (Math.floor((seconds % 3600) / 60) + "m ")
                let ss = seconds % 60 + "s"
                let objetivo_max = timetomin(target_max)
                let dataTMO = `${hh}${mm}${ss}`
                setDataTME(p => ({ ...p, dataTME: dataTMO }))
                setDataTME(p => ({ ...p, obj_max: `< ${objetivo_max}m ` }))

                let vartmo = timetoseconds(target_max) - seconds
                vartmo = seconds < timetoseconds(target_min) ? Math.abs(vartmo) * -1 : vartmo
                let sign = vartmo > 0 ? "" : "-"
                vartmo = Math.abs(vartmo)
                let variacioncolor = vartmo <= 0;

                hh = (Math.floor(vartmo / 3600)) === 0 ? "" : (Math.floor(vartmo / 3600) + "h ")
                mm = Math.floor((vartmo % 3600) / 60) === 0 ? "" : (Math.floor((vartmo % 3600) / 60) + "m ")
                ss = vartmo % 60 + "s"
                let variaciontxt = `${sign}${hh}${mm}${ss}`
                setDataTME(p => ({ ...p, variaciontxt: variaciontxt }))
                setDataTME(p => ({ ...p, variacioncolor: variacioncolor }))

                let secondsmax = timetoseconds(time_max)
                hh = (Math.floor(secondsmax / 3600)) === 0 ? "" : (Math.floor(secondsmax / 3600) + "h ")
                mm = Math.floor((secondsmax % 3600) / 60) === 0 ? "" : (Math.floor((secondsmax % 3600) / 60) + "m ")
                ss = secondsmax % 60 + "s"
                let timeMax = `${hh}${mm}${ss}`
                setDataTME(p => ({ ...p, timeMax: timeMax }))

                let secondsmin = timetoseconds(time_min)
                hh = (Math.floor(secondsmin / 3600)) === 0 ? "" : (Math.floor(secondsmin / 3600) + "h ")
                mm = Math.floor((secondsmin % 3600) / 60) === 0 ? "" : (Math.floor((secondsmin % 3600) / 60) + "m ")
                ss = secondsmin % 60 + "s"
                let timeMin = `${hh}${mm}${ss}`
                setDataTME(p => ({ ...p, timeMin: timeMin }))

                let sla = target_percmax?`${(parseFloat(target_percmax) * 100).toFixed(2)}%`:"0%"
                setDataTME(p => ({ ...p, sla: sla }))

                let variacionperccolor = variacionperc >= 0;
                setDataTME(p => ({ ...p, variacionperc: variacionperc }))
                setDataTME(p => ({ ...p, variacionperccolor: variacionperccolor }))
                setDataTME(p => ({ ...p, tickets_comply: tickets_comply }))
                setDataTME(p => ({ ...p, tickets_analyzed: tickets_analyzed }))
                setDataTME(p => ({ ...p, tickets_total: tickets_total }))
                setDataTMEgraph([
                    { label: t(langKeys.quantitymeets), quantity: tickets_comply },
                    { label: t(langKeys.quantitymeetsnot), quantity: tickets_analyzed - tickets_comply }
                ]);


            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resTME])
    useEffect(() => {
        setprodxHora({
            prodlog: "0",
            prodcon: "0",
            prodbot: "0",
        });
        if(prodxHoralvl1){
            const firstDate = new Date( String(dateRangeCreateDate.startDate));
            const secondDate = new Date( String(dateRangeCreateDate.endDate));
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

            let diffDays = Math.ceil(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
            const fullhours = 24 * diffDays
            const { horalogueo, horaconectado, ticketsasesor, ticketsbot } = prodxHoralvl1;
            const prodlogofi = horalogueo ? (ticketsasesor / horalogueo) : 0;
            const prodconofi = horaconectado ? (ticketsasesor / horaconectado) : 0;
            const prodbotofi = ticketsbot? (ticketsbot/ fullhours):0 ;
            setprodxHora({
                prodlog: prodlogofi.toFixed(2),
                prodcon: prodconofi.toFixed(2),
                prodbot: prodbotofi.toFixed(2),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[prodxHoralvl1])
    useEffect(() => {
        setDataSummary({
            tmrglobal: "0m",
            dataTMRBot: "0m",
            dataTMRAsesor: "0m",
            dataTMRCliente: "0m",
            tasaabandono: "0m"
        })
        settmoDistribution([
            {label:"0 - 5", quantity: 0},
            {label:"5 - 10", quantity: 0},
            {label:"10 - 15", quantity: 0},
            {label:"15 - 20", quantity: 0},
            {label:"20 - 30", quantity: 0},
            {label:"30 +", quantity: 0}
        ])
        settmeDistribution([
            {label:"0 - 5", quantity: 0},
            {label:"5 - 10", quantity: 0},
            {label:"10 - 15", quantity: 0},
            {label:"15 - 20", quantity: 0},
            {label:"20 - 30", quantity: 0},
            {label:"30 +", quantity: 0}
        ])
        if (resSummary.length) {
            if (resSummary[0] && resSummary[0].ticketstotal !== 0) {
                const {averagereplytime,botaveragereplytime,useraveragereplytime,personaveragereplytime,tmoasesorrange0, tmoasesorrange1, tmoasesorrange2, tmoasesorrange3, tmoasesorrange4, tmoasesorrange5,
                    tmeasesorrange0, tmeasesorrange1,  tmeasesorrange2, tmeasesorrange3, tmeasesorrange4, tmeasesorrange5,ticketsabandonados,ticketstotal} = resSummary[0]
                setDataSummary({
                    tmrglobal: formattime(timetoseconds(averagereplytime)),
                    dataTMRBot: formattime(timetoseconds(botaveragereplytime)),
                    dataTMRAsesor: formattime(timetoseconds(useraveragereplytime)),
                    dataTMRCliente: formattime(timetoseconds(personaveragereplytime)),
                    tasaabandono: (ticketsabandonados * 100 / ticketstotal).toFixed(0) + "%"
                })
                settmoDistribution([
                    {label:"0 - 5", quantity: tmoasesorrange0},
                    {label:"5 - 10", quantity: tmoasesorrange1},
                    {label:"10 - 15", quantity: tmoasesorrange2},
                    {label:"15 - 20", quantity: tmoasesorrange3},
                    {label:"20 - 30", quantity: tmoasesorrange4},
                    {label:"30 +", quantity: tmoasesorrange5}

                ])
                settmeDistribution([
                    {label:"0 - 5", quantity: tmeasesorrange0},
                    {label:"5 - 10", quantity: tmeasesorrange1},
                    {label:"10 - 15", quantity: tmeasesorrange2},
                    {label:"15 - 20", quantity: tmeasesorrange3},
                    {label:"20 - 30", quantity: tmeasesorrange4},
                    {label:"30 +", quantity: tmeasesorrange5}

                ])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resSummary])
    useEffect(() => {
        setDataEncuesta({
            dataNPS: "0%",
            npsvariacioncolor: true,
            nps_green: "0%",
            npsvariation: "0%",
            npspollssent: "0",
            npspollsanswered: "0",
            npstotalpromoters: 0,
            npstotaldetractors: 0,
            npstotalneutral: 0,
            npstotalconversations: 0,
            dataCSAT: "0%",
            csatvariacioncolor: true,
            csat_green: "0%",
            csatvariation: "0%",
            csatpollssent: "0",
            csatpollsanswered: "0",
            csattotalpromoters: 0,
            csattotaldetractors: 0,
            csattotalneutral: 0,
            csattotalconversations: 0,
            dataFCR: "0%",
            fcr_green: "0%",
            fcrvariacioncolor: true,
            fcrvariation: "0%",
            fcrpollssent: "0",
            fcrpollsanswered: "0",
            fcrtotalpromoters: 0,
            fcrtotaldetractors: 0,
            fcrtotalconversations: 0,
            dataFIX: "0%",
            fix_green: "0%",
            fixvariacioncolor: true,
            fixvariation: "0%",
            fixpollssent: "0",
            fixpollsanswered: "0",
            fixtotalpromoters: 0,
            fixtotaldetractors: 0,
            fixtotalconversations: 0,
        })
        if (resEncuesta.length) {
            const { nps_high, total, nps_low, nps_green, nps_medium, nps_total } = resEncuesta[0]
            const { csat_high, csat_low, csat_green, csat_medium, csat_total } = resEncuesta[0];
            const { fcr_yes, fcr_no, fcr_green, fcr_total, total_bot } = resEncuesta[0];
            const { fix_yes, fix_no, fix_green, fix_total } = resEncuesta[0];
            const toshow = nps_total ? ((nps_high - nps_low) / nps_total) : 0;
            const toshowcsat = csat_total ? ((csat_high - csat_low) / csat_total) : 0;
            const toshowfcr = fcr_total ? ((fcr_yes - fcr_no) / fcr_total) : 0;
            const toshowfix = fix_total ? ((fix_yes - fix_no) / fix_total) : 0;
            let variacioncolor = (toshow - nps_green) * 100 >= 0
            setDataEncuesta({
                dataNPS: `${((toshow) * 100).toFixed(2)}%`,
                npsvariacioncolor: variacioncolor,
                nps_green: `${(parseFloat(nps_green) * 100).toFixed(2)}%`,
                npsvariation: `${((toshow - nps_green) * 100).toFixed(2)}%`,
                npspollssent: `${formatNumber(total)}`,
                npspollsanswered: `${formatNumber(nps_total)}`,
                npstotalpromoters: nps_high,
                npstotaldetractors: nps_low,
                npstotalneutral: nps_medium,
                npstotalconversations: total,
                dataCSAT: `${((toshowcsat) * 100).toFixed(2)}%`,
                csatvariacioncolor: (toshowcsat - nps_green) * 100 >= 0,
                csat_green: `${(parseFloat(csat_green) * 100).toFixed(2)}%`,
                csatvariation: `${((toshowcsat - csat_green) * 100).toFixed(2)}%`,
                csatpollssent: `${formatNumber(total)}`,
                csatpollsanswered: `${formatNumber(csat_total)}`,
                csattotalpromoters: csat_high,
                csattotaldetractors: csat_low,
                csattotalneutral: csat_medium,
                csattotalconversations: total,
                dataFCR: `${((toshowfcr) * 100).toFixed(2)}%`,
                fcrvariacioncolor: (toshowfcr - nps_green) * 100 >= 0,
                fcr_green: `${(parseFloat(fcr_green) * 100).toFixed(2)}%`,
                fcrvariation: `${((toshowfcr - fcr_green) * 100).toFixed(2)}%`,
                fcrpollssent: `${formatNumber(total)}`,
                fcrpollsanswered: `${formatNumber(fcr_total)}`,
                fcrtotalpromoters: fcr_yes,
                fcrtotaldetractors: fcr_no,
                fcrtotalconversations: total_bot,
                dataFIX: `${((toshowfix) * 100).toFixed(2)}%`,
                fixvariacioncolor: (toshowfix - nps_green) * 100 >= 0,
                fix_green: `${(parseFloat(fix_green) * 100).toFixed(2)}%`,
                fixvariation: `${((toshowfix - fix_green) * 100).toFixed(2)}%`,
                fixpollssent: `${formatNumber(total)}`,
                fixpollsanswered: `${formatNumber(fix_total)}`,
                fixtotalpromoters: fix_yes,
                fixtotaldetractors: fix_no,
                fixtotalconversations: total,
            })
            setDataNPSgraph([
                { label: t(langKeys.totalpromoters), quantity: nps_high },
                { label: t(langKeys.totaldetractors), quantity: nps_low },
                { label: t(langKeys.totalneutral), quantity: nps_medium }
            ]);
            setDataCSATgraph([
                { label: t(langKeys.totalpromoters), quantity: csat_high },
                { label: t(langKeys.totaldetractors), quantity: csat_low },
                { label: t(langKeys.totalneutral), quantity: csat_medium }
            ]);
            setDataFCRgraph([
                { label: t(langKeys.totalresolved), quantity: fcr_yes },
                { label: t(langKeys.totalnotresolved), quantity: fcr_no },
            ]);
            setDataFIXgraph([
                { label: t(langKeys.totalresolved), quantity: fix_yes },
                { label: t(langKeys.totalnotresolved), quantity: fix_no },
            ]);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resEncuesta]);

    useEffect(() => {
        if (waitSave) {
            if (!remultiaux.loading && !remultiaux.error) {
                setResTMO(remultiaux.data[0].data)
                setResTME(remultiaux.data[1].data)
                setResSummary(remultiaux.data[2].data)
                setprodxHoralvl1(remultiaux.data[3].data)
                if(remultiaux.data[4].success){
                    setprodxHoraDist(
                        [
                            {label:"0 - 3",connected:remultiaux.data[4].data[0].horaconectadorange0, notconnected: remultiaux.data[4].data[0].horalogueorange0},
                            {label:"4 - 7",connected:remultiaux.data[4].data[0].horaconectadorange1, notconnected: remultiaux.data[4].data[0].horalogueorange1},
                            {label:"8 - 10",connected:remultiaux.data[4].data[0].horaconectadorange2, notconnected: remultiaux.data[4].data[0].horalogueorange2},
                            {label:"11 - 12",connected:remultiaux.data[4].data[0].horaconectadorange3, notconnected: remultiaux.data[4].data[0].horalogueorange3},
                            {label:"13 +", connected:remultiaux.data[4].data[0].horaconectadorange4, notconnected: remultiaux.data[4].data[0].horalogueorange4}]
                    );
                }
                setResEncuesta(remultiaux.data[5].data)
                //setprodxHoraDist(remultiaux.data[4].data)
                //setResLabels(remultiaux.data[6].data)



                /*const asesoretmp = [...remultiaux.data[7].data];

                setResAsesoreconectadosbar([...Array(24)].map((_, i) => {
                    const hourFound = asesoretmp.find((x: Dictionary) => x.hora === i);
                    if (hourFound)
                        return hourFound
                    else
                        return { hora: i, asesoresconectados: "0", avgasesoresconectados: "0" }
                }))*/



                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (remultiaux.error) {
                const errormessage = t(remultiaux.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remultiaux, waitSave])
    async function funcsearch() {
        let tosend = { 
            startdate: dateRangeCreateDate.startDate, 
            enddate: dateRangeCreateDate.endDate, 
            channel: searchfields.channels, 
            group: searchfields.queue, 
            company: searchfields.provider,
            label: searchfields.label,
            supervisor: searchfields.supervisor
        }
        dispatch(showBackdrop(true));
        setOpenDialog(false)
        dispatch(getMultiCollectionAux([
            getdashboardoperativoTMOGENERALSel(tosend),
            getdashboardoperativoTMEGENERALSel(tosend),
            getdashboardoperativoSummarySel(tosend),
            getdashboardoperativoProdxHoraSel({...tosend,level:0}),
            getdashboardoperativoProdxHoraDistSel(tosend),
            getdashboardoperativoEncuestaSel(tosend)
        ]))
        setWaitSave(true)
    }


    useEffect(() => {
        dispatch(getMultiCollection([
            getValuesFromDomain("GRUPOS"),
            getValuesFromDomain("EMPRESA"),
            getCommChannelLst(),
            getSupervisorsSel(),
            getLabelsSel(),
        ]));
        funcsearch()
        return () => {
            dispatch(resetMain());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if(downloaddatafile && !mainResultData.loading){
            exportExcel(titlefile,mainResultData.data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainResultData])
    async function downloaddata(tipeoffilter:string){
        let tosend = { 
            startdate: dateRangeCreateDate.startDate, 
            enddate: dateRangeCreateDate.endDate, 
            channel: searchfields.channels, 
            group: searchfields.queue, 
            company: searchfields.provider,
            label: searchfields.label,
            supervisor: searchfields.supervisor
        }
        setdownloaddatafile(true)
        settitlefile(`DashboardManagerial-${tipeoffilter}`)
        if(tipeoffilter==="TMO"){
            dispatch(getCollection(getdashboardoperativoTMOGENERALSeldata(tosend)))
        }else if(tipeoffilter==="TME"){
            dispatch(getCollection(getdashboardoperativoTMEGENERALSeldata(tosend)))
        }else if(tipeoffilter==="TMODistribution"||tipeoffilter==="TMEDistribution"){
            dispatch(getCollection(getdashboardoperativoSummarySeldata(tosend)))
        }else if(tipeoffilter==="prodxHoraDist"){
            dispatch(getCollection(getdashboardoperativoProdxHoraDistSel(tosend)))
        }else if(tipeoffilter==="NPS"||tipeoffilter==="CSAT"||tipeoffilter==="FIX"||tipeoffilter==="FCR"){
            dispatch(getCollection(getdashboardoperativoEncuestaSeldata(tosend)))
        }
    }
    return (
        <Fragment>
            <DialogZyx
                open={openDialog}
                title=""
                buttonText1={t(langKeys.close)}
                buttonText2={t(langKeys.search)}
                handleClickButton1={() => setOpenDialog(false)}
                handleClickButton2={() => funcsearch()}
            >
                <DateRangePicker
                    open={openDateRangeCreateDateModal}
                    setOpen={setOpenDateRangeCreateDateModal}
                    range={dateRangeCreateDate}
                    onSelect={setDateRangeCreateDate}
                >
                    <Button
                        className={classes.itemDate}
                        startIcon={<CalendarIcon />}
                        onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                    >
                        {format(dateRangeCreateDate.startDate!) + " - " + format(dateRangeCreateDate.endDate!)}
                    </Button>
                </DateRangePicker>
                <div className="row-zyx" style={{ marginTop: "15px" }}>
                    <FieldMultiSelect
                        label={t(langKeys.queue)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => { setsearchfields(p => ({ ...p, queue: value.map((o: Dictionary) => o.domainvalue).join() })) }}
                        valueDefault={searchfields.queue}
                        data={dataqueue}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div className="row-zyx" style={{ marginTop: "15px" }}>
                    <FieldSelect
                        label={t(langKeys.provider)}
                        className={classes.fieldsfilter}
                        onChange={(value) => { setsearchfields((p) => ({ ...p, provider: value.domainvalue })) }}
                        valueDefault={searchfields.provider}
                        data={dataprovider}
                        optionDesc="domaindesc"
                        variant="outlined"
                        optionValue="domainvalue"
                    />
                </div>
                <div className="row-zyx" style={{ marginTop: "15px" }}>
                    <FieldMultiSelect
                        label={t(langKeys.channel_plural)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => { setsearchfields((p) => ({ ...p, channels: value.map((o: Dictionary) => o.communicationchannelid).join() })) }}
                        valueDefault={searchfields.channels}
                        data={datachannels}
                        optionDesc="communicationchanneldesc"
                        optionValue="communicationchannelid"
                    />
                </div>
                <div className="row-zyx" style={{ marginTop: "15px" }}>
                    <FieldMultiSelect
                        label={t(langKeys.supervisor)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => { setsearchfields((p) => ({ ...p, supervisor: value.map((o: Dictionary) => o.userid).join() })) }}
                        valueDefault={searchfields.supervisor}
                        data={datasupervisors}
                        optionDesc="userdesc"
                        optionValue="userid"
                    />
                </div>
                <div className="row-zyx" style={{ marginTop: "15px" }}>
                    <FieldMultiSelect
                        label={t(langKeys.labels)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => { setsearchfields((p) => ({ ...p, label: value.map((o: Dictionary) => o.userid).join() })) }}
                        valueDefault={searchfields.label}
                        data={dataLabel}
                        optionDesc="description"
                        optionValue="labelid"
                    />
                </div>

            </DialogZyx>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className={classes.maintitle}> {t(langKeys.productivity)}</div>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ width: 200, backgroundColor: "#007bff" }}
                    onClick={() => setOpenDialog(true)}
                >{t(langKeys.stablishfilters)}
                </Button>
            </div>
            <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
                <div className={classes.replacerowzyx}>
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}><CloudDownloadIcon onClick={()=>downloaddata("TMO")} className={classes.styleicon}/></div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>TMO</div>
                                <div className={classes.boxtitledata}>{data.dataTMO}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>{data.obj_max}</div>
                            </div>
                            <div className={clsx(classes.containerFields, data.variacioncolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{data.variaciontxt}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.highestTMO)}</div>
                                <div className={classes.datafield}>{data.timeMax}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.lowestTMO)}</div>
                                <div className={classes.datafield}>{data.timeMin}</div>
                            </div>
                        </div>
                        <div style={{ flex: '0 0 200px', height: 200 }} className={clsx({
                                [classes.dontshow]: !data.tickets_total,

                            })}>
                            <ResponsiveContainer className={classes.itemGraphic}>
                                <PieChart>
                                    <Tooltip />
                                    <Pie data={dataTMOgraph} dataKey="quantity" nameKey="label" cx="50%" cy="50%" innerRadius={40} fill="#8884d8">
                                        {dataTMOgraph.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>{data.sla}</div>
                            </div>
                            <div className={clsx(classes.containerFields, data.variacionperccolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{data.variacionperc.toFixed(2)}%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>{data.tickets_comply}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>{data.tickets_analyzed - data.tickets_comply}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>{data.tickets_total}</div>
                            </div>
                        </div>
                    </Box>


                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}><CloudDownloadIcon onClick={()=>downloaddata("TME")} className={classes.styleicon}/></div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>TME</div>
                                <div className={classes.boxtitledata}>{dataTME.dataTME}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>{dataTME.obj_max}</div>
                            </div>
                            <div className={clsx(classes.containerFields, dataTME.variacioncolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{dataTME.variaciontxt}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.highestTME)}</div>
                                <div className={classes.datafield}>{dataTME.timeMax}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.lowestTME)}</div>
                                <div className={classes.datafield}>{dataTME.timeMin}</div>
                            </div>
                        </div>
                        <div style={{ flex: '0 0 200px', height: 200 }} className={clsx({
                                [classes.dontshow]: !dataTME.tickets_total,

                            })}>
                            <ResponsiveContainer className={classes.itemGraphic}>
                                <PieChart>
                                    <Tooltip />
                                    <Pie data={dataTMEgraph} dataKey="quantity" nameKey="label" cx="50%" cy="50%" innerRadius={40} fill="#8884d8">
                                        {dataTMEgraph.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>{dataTME.sla}</div>
                            </div>
                            <div className={clsx(classes.containerFields, dataTME.variacionperccolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{dataTME.variacionperc.toFixed(2)}%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>{dataTME.tickets_comply}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>{dataTME.tickets_analyzed - dataTME.tickets_comply}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>{dataTME.tickets_total}</div>
                            </div>
                        </div>
                    </Box>

                </div>
                <div className={classes.replacerowzyx}>
                    <Box
                        className={classes.itemCard}
                        style={{ backgroundColor: "#53a6fa", display: 'flex', flex: 1, gap: 8 }}
                    >
                        <div className={classes.containerFieldsQuarter}>
                            <ChatIcon style={{color:"white",margin: "3px 5px"}}/>
                            <div className={classes.boxtitle} style={{ padding: 0 }}>TMR</div>
                            <div className={classes.boxtitledata} style={{ padding: 0 }}>{dataSummary.tmrglobal}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.itemCard}
                        style={{ backgroundColor: "#22b66e", display: 'flex', flex: 1, gap: 8 }}
                    >
                        <div className={classes.containerFieldsQuarter}>
                            <PersonIcon style={{color:"white",margin: "3px 5px"}}/>
                            <div className={classes.boxtitle} style={{ padding: 0 }}>TMR Asesor</div>
                            <div className={classes.boxtitledata} style={{ padding: 0 }}>{dataSummary.dataTMRAsesor}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.itemCard}
                        style={{ backgroundColor: "#fdab29", display: 'flex', flex: 1, gap: 8 }}
                    >
                        <div className={classes.containerFieldsQuarter}>
                            <AdbIcon style={{color:"white",margin: "3px 5px"}}/>
                            <div className={classes.boxtitle} style={{ padding: 0 }}>TMR Bot</div>
                            <div className={classes.boxtitledata} style={{ padding: 0 }}>{dataSummary.dataTMRBot}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.itemCard}
                        style={{ backgroundColor: "#907eec", display: 'flex', flex: 1, gap: 8 }}
                    >
                        <div className={classes.containerFieldsQuarter}>
                            <PersonIcon style={{color:"white",margin: "3px 5px"}}/>
                            <div className={classes.boxtitle} style={{ padding: 0 }}>TMR Client</div>
                            <div className={classes.boxtitledata} style={{ padding: 0 }}>{dataSummary.dataTMRCliente}</div>
                        </div>
                    </Box>
                </div>
                <div className={classes.replacerowzyx}>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.productivitycard1)}</div>
                        <div className={classes.datafieldquarter}>{prodxHora.prodlog}</div>                    
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.productivitycard2)}</div>
                        <div className={classes.datafieldquarter}>{prodxHora.prodcon}</div>                    
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.productivitycard3)}</div>
                        <div className={classes.datafieldquarter}>{prodxHora.prodbot}</div>                    
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.productivitycard4)}</div>
                        <div className={classes.datafieldquarter}>{dataSummary.tasaabandono}</div>                    
                    </Box>
                </div>
                <div className={classes.replacerowzyx} >
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.containertitleboxes}>
                            <div style={{ fontWeight: "bold", fontSize: "1.6em"}}>{t(langKeys.distributionTMO)}</div>
                            <CloudDownloadIcon  onClick={()=>downloaddata("TMODistribution")} className={classes.styleicon}/>
                        </div>
                        <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                            <BarChart data={tmoDistribution}>
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="quantity" fill="#8884d8" >
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        
                    </Box>
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.containertitleboxes}>
                            <div style={{ fontWeight: "bold", fontSize: "1.6em"}}>{t(langKeys.distributionTME)}</div>
                            <CloudDownloadIcon onClick={()=>downloaddata("TMEDistribution")} className={classes.styleicon}/>
                        </div>
                        <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                            <BarChart data={tmeDistribution}>
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="quantity" fill="#8884d8" >
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        
                    </Box>
                </div>
                <div className={classes.replacerowzyx} style={{width:"50%"}} >
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.containertitleboxes} >
                            <div  style={{ fontWeight: "bold", fontSize: "1.6em"}}>{t(langKeys.distributionProductivity)}</div>
                            <CloudDownloadIcon className={classes.styleicon} onClick={()=>downloaddata("prodxHoraDist")} />
                        </div>
                        <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                            <ComposedChart
                                data={prodxHoraDist}
                                >
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis dataKey="label" scale="band" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="notconnected" stroke="#52307c" name={t(langKeys.hourlogin)}/>
                                <Bar dataKey="connected" barSize={20} fill="#2499ee" name={t(langKeys.hourconnected)}/>
                            </ComposedChart>
                        </ResponsiveContainer>
                        
                    </Box>
                </div>
                <div className={classes.replacerowzyx}>
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}><CloudDownloadIcon onClick={()=>downloaddata("NPS")} className={classes.styleicon}/></div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>NPS</div>
                                <div className={classes.boxtitledata}>{dataEncuesta.dataNPS}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>{dataEncuesta.nps_green}</div>
                            </div>
                            <div className={clsx(classes.containerFields, dataEncuesta.npsvariacioncolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{dataEncuesta.npsvariation}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollssent)}</div>
                                <div className={classes.datafield}>{dataEncuesta.npspollssent}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollsanswered)}</div>
                                <div className={classes.datafield}>{dataEncuesta.npspollsanswered}</div>
                            </div>
                        </div>
                        <div style={{ flex: '0 0 200px', height: 200 }} className={clsx({
                                [classes.dontshow]: dataEncuesta.npspollsanswered==="0",

                            })}>
                            <ResponsiveContainer className={classes.itemGraphic}>
                                <PieChart>
                                    <Tooltip />
                                    <Pie data={dataNPSgraph} dataKey="quantity" nameKey="label" cx="50%" cy="50%" innerRadius={40} fill="#8884d8">
                                        {dataNPSgraph.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalpromoters)}</div>
                                <div className={classes.datafield}>{dataEncuesta.npstotalpromoters}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totaldetractors)}</div>
                                <div className={classes.datafield}>{dataEncuesta.npstotaldetractors}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalneutral)}</div>
                                <div className={classes.datafield}>{dataEncuesta.npstotalneutral}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversations)}</div>
                                <div className={classes.datafield}>{dataEncuesta.npstotalconversations}</div>
                            </div>
                        </div>
                    </Box>
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}><CloudDownloadIcon onClick={()=>downloaddata("CSAT")} className={classes.styleicon}/></div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>CSAT</div>
                                <div className={classes.boxtitledata}>{dataEncuesta.dataCSAT}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>{dataEncuesta.csat_green}</div>
                            </div>
                            <div className={clsx(classes.containerFields, dataEncuesta.csatvariacioncolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{dataEncuesta.csatvariation}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollssent)}</div>
                                <div className={classes.datafield}>{dataEncuesta.csatpollssent}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollsanswered)}</div>
                                <div className={classes.datafield}>{dataEncuesta.csatpollsanswered}</div>
                            </div>
                        </div>
                        <div style={{ flex: '0 0 200px', height: 200 }} className={clsx({
                                [classes.dontshow]: dataEncuesta.csatpollsanswered==="0",

                            })}>
                            <ResponsiveContainer className={classes.itemGraphic}>
                                <PieChart>
                                    <Tooltip />
                                    <Pie data={dataCSATgraph} dataKey="quantity" nameKey="label" cx="50%" cy="50%" innerRadius={40} fill="#8884d8">
                                        {dataCSATgraph.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalpromoters)}</div>
                                <div className={classes.datafield}>{dataEncuesta.csattotalpromoters}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totaldetractors)}</div>
                                <div className={classes.datafield}>{dataEncuesta.csattotaldetractors}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalneutral)}</div>
                                <div className={classes.datafield}>{dataEncuesta.csattotalneutral}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversations)}</div>
                                <div className={classes.datafield}>{dataEncuesta.csattotalconversations}</div>
                            </div>
                        </div>
                    </Box>
                </div>
                <div className={classes.replacerowzyx} >
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}><CloudDownloadIcon onClick={()=>downloaddata("FCR")} className={classes.styleicon}/></div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>FCR</div>
                                <div className={classes.boxtitledata}>{dataEncuesta.dataFCR}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcr_green}</div>
                            </div>
                            <div className={clsx(classes.containerFields, dataEncuesta.fcrvariacioncolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrvariation}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollssent)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrpollssent}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollsanswered)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrpollsanswered}</div>
                            </div>
                        </div>
                        <div style={{ flex: '0 0 200px', height: 200 }} className={clsx({
                                [classes.dontshow]: dataEncuesta.fcrpollsanswered==="0",

                            })}>
                            <ResponsiveContainer className={classes.itemGraphic}>
                                <PieChart>
                                    <Tooltip />
                                    <Pie data={dataFCRgraph} dataKey="quantity" nameKey="label" cx="50%" cy="50%" innerRadius={40} fill="#8884d8">
                                        {dataFCRgraph.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalresolved)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrtotalpromoters}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalnotresolved)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrtotaldetractors}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversations)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrtotalconversations}</div>
                            </div>
                        </div>
                    </Box>
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}><CloudDownloadIcon onClick={()=>downloaddata("FIX")} className={classes.styleicon}/></div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>FIX</div>
                                <div className={classes.boxtitledata}>{dataEncuesta.dataFIX}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fix_green}</div>
                            </div>
                            <div className={clsx(classes.containerFields, dataEncuesta.fixvariacioncolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fixvariation}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollssent)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fixpollssent}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollsanswered)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fixpollsanswered}</div>
                            </div>
                        </div>
                        <div style={{ flex: '0 0 200px', height: 200 }} className={clsx({
                                [classes.dontshow]: dataEncuesta.fixpollsanswered==="0",

                            })}>
                            <ResponsiveContainer className={classes.itemGraphic}>
                                <PieChart>
                                    <Tooltip />
                                    <Pie data={dataFIXgraph} dataKey="quantity" nameKey="label" cx="50%" cy="50%" innerRadius={40} fill="#8884d8">
                                        {dataFIXgraph.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalresolved)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fixtotalpromoters}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalnotresolved)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fixtotaldetractors}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversations)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fixtotalconversations}</div>
                            </div>
                        </div>
                    </Box>
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardProductivity;