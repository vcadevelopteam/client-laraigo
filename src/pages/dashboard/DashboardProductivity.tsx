import { Box, Button, CircularProgress, createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import { DateRangePicker, DialogZyx, FieldMultiSelect, FieldSelect, TemplateSwitch } from "components";
import { useSelector } from "hooks";
import { CalendarIcon } from "icons";
import { langKeys } from "lang/keys";
import { FC, Fragment, useEffect, useState } from "react";
import { getMultiCollection, getMultiCollectionAux, getCollectionAux, resetMainAux, resetMultiMainAux } from 'store/main/actions';
import { Range } from 'react-date-range';
import clsx from 'clsx';
import PersonIcon from '@material-ui/icons/Person';
import ChatIcon from '@material-ui/icons/Chat';
import AdbIcon from '@material-ui/icons/Adb';
import { useTranslation } from "react-i18next";
import { exportExcel, getCommChannelLst, getdashboardoperativoEncuestaSel,getdashboardoperativoEncuesta3Sel, getdashboardoperativoProdxHoraDistSel, getdashboardoperativoProdxHoraSel, getdashboardoperativoSummarySel,getdashboardoperativoTMEGENERALSeldata, getdashboardoperativoTMEGENERALSel, getdashboardoperativoTMOGENERALSel, getdashboardoperativoTMOGENERALSeldata, getLabelsSel, getSupervisorsSel, getValuesFromDomain, getdashboardoperativoTMOdistseldata, getdashboardoperativoTMEdistseldata, getdashboardoperativoProdxHoraDistSeldata, getdashboardoperativoEncuesta3Seldata, getdashboardoperativoEncuesta2Seldata, getDateCleaned } from "common/helpers";
import { useDispatch } from "react-redux";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Dictionary } from "@types";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Legend, Bar, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SettingsIcon from '@material-ui/icons/Settings';

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
        datafieldfooter: {
            display: "flex",
            justifyContent: "space-between"
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
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const DashboardProductivity: FC = () => {
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const remultiaux = useSelector(state => state.main.multiDataAux);
    const resaux = useSelector(state => state.main.mainAux);
    const [downloaddatafile,setdownloaddatafile]=useState(false)
    const [section, setSection] = useState('')
    const [titlefile, settitlefile] = useState('');
    const [openDialogPerRequest, setOpenDialogPerRequest] = useState(false);
    const [fieldToFilter, setFieldToFilter] = useState("");
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [searchfieldsOnlyOne, setsearchfieldsOnlyOne] = useState({
        closedbyasesor: true,  
        closedbybot:  true,
        closedby: "ASESOR,BOT",
        min: "", 
        max: "", 
        target:0, 
        skipdown:0, 
        skipup:0,
        limit: 5,
        bd: false
    });
    const [data, setData] = useState({
        dataTMO: "0s",
        obj_min: "",
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
        tasaabandono: "0"
    });
    const [tasaabandonoperc, setTasaabandonoperc] = useState(0);
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
        { label: t(langKeys.meets), quantity: 0 },
        { label: t(langKeys.meetsnot), quantity: 0 }
    ]);
    const [dataTMEgraph, setDataTMEgraph] = useState([
        { label: t(langKeys.meets), quantity: 0 },
        { label: t(langKeys.meetsnot), quantity: 0 }
    ]);
    const [dataNPSgraph, setDataNPSgraph] = useState([
        { label: t(langKeys.promoters), quantity: 0 },
        { label: t(langKeys.detractors), quantity: 0 },
        { label: t(langKeys.neutral), quantity: 0 }
    ]);
    const [dataCSATgraph, setDataCSATgraph] = useState([
        { label: t(langKeys.satisfied), quantity: 0 },
        { label: t(langKeys.dissatisfied), quantity: 0 },
        { label: t(langKeys.neutral), quantity: 0 }
    ]);
    const [dataFCRgraph, setDataFCRgraph] = useState([
        { label: t(langKeys.resolvedfirstcontact), quantity: 0 },
        { label: t(langKeys.notresolvedfirstcontact), quantity: 0 },
    ]);
    const [dataFIXgraph, setDataFIXgraph] = useState([
        { label: t(langKeys.resolved), quantity: 0 },
        { label: t(langKeys.notresolved), quantity: 0 },
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
    const [prodxHoralvl0, setprodxHoralvl0] = useState<any>([]);
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
    const [prodxHoraLabel, setprodxHoraLabel] = useState({
        prodlog: "0",
        prodcon: "0",
        prodbot: "0",
    });
    const [datasupervisors, setdatasupervisors] = useState<any>([]);
    const [dataprovider, setdataprovider] = useState<any>([]);
    const [datachannels, setdatachannels] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);
    const [waitSaveAux, setWaitSaveAux] = useState(false);
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
        setData({
            dataTMO: "0s",
            obj_min: "",
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
        setDataTMOgraph([
            { label: t(langKeys.meets), quantity: 0 },
            { label: t(langKeys.meetsnot), quantity: 0 }
        ]);
        if (resTMO.length) {
            const { time_avg, tickets_comply, tickets_total, target_max, target_min, time_max, time_min, tickets_analyzed, target_percmax} = resTMO[0];
            let seconds = timetoseconds(time_avg)
            if (seconds >= 0) {
                let variacionperc = (tickets_comply / tickets_analyzed - parseFloat(target_percmax))*100
                variacionperc=variacionperc? variacionperc: 0;
                let hh = (Math.floor(seconds / 3600)) === 0 ? "" : (Math.floor(seconds / 3600) + "h ")
                let mm = Math.floor((seconds % 3600) / 60) === 0 ? "" : (Math.floor((seconds % 3600) / 60) + "m ")
                let ss = seconds % 60 + "s"
                let objetivo_min = timetomin(target_min)
                let objetivo_max = timetomin(target_max)
                let dataTMO = `${hh}${mm}${ss}`
                setData(p => ({ ...p, dataTMO: dataTMO }))
                setData(p => ({ ...p, obj_max: `< ${objetivo_max}m `, obj_min: objetivo_min > 0 ? ` y > ${objetivo_min}m ` : '' }))

                let vartmo = timetoseconds(target_max) - seconds
                vartmo = seconds < timetoseconds(target_min) ? Math.abs(vartmo) * -1 : vartmo
                let sign = vartmo > 0 ? "" : "-"
                vartmo = Math.abs(vartmo)
                let variacioncolor = timetoseconds(target_min) <= seconds && timetoseconds(target_max) >= seconds

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
                    { label: t(langKeys.meets), quantity: tickets_comply },
                    { label: t(langKeys.meetsnot), quantity: tickets_analyzed - tickets_comply }
                ]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resTMO])
    useEffect(() => {
        setDataTME({
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
        })
        setDataTMEgraph([
            { label: t(langKeys.meets), quantity: 0 },
            { label: t(langKeys.meetsnot), quantity: 0 }
        ]);
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
                let variacioncolor = timetoseconds(target_min) <= seconds && timetoseconds(target_max) >= seconds

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
                    { label: t(langKeys.meets), quantity: tickets_comply },
                    { label: t(langKeys.meetsnot), quantity: tickets_analyzed - tickets_comply }
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
        if (prodxHoralvl0 && prodxHoralvl0.length > 0) {
            const firstDate = new Date( String(dateRangeCreateDate.startDate));
            const secondDate = new Date( String(dateRangeCreateDate.endDate));
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

            let diffDays = Math.ceil(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)) + 1;
            const fullhours = 24 * diffDays;
            const { horalogueo, horaconectado, ticketsasesor, ticketsbot } = prodxHoralvl0[0];
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
    },[prodxHoralvl0])
    useEffect(() => {
        setprodxHoraLabel({
            prodlog: "0",
            prodcon: "0",
            prodbot: "0",
        });
        if (prodxHoralvl1 && prodxHoralvl1.length > 0) {
            const firstDate = new Date( String(dateRangeCreateDate.startDate));
            const secondDate = new Date( String(dateRangeCreateDate.endDate));
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

            let diffDays = Math.ceil(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)) + 1;
            const fullhours = 24 * diffDays;
            
            let dataacum: any = prodxHoralvl1.reduce((full: any, i: any) => {
                const productivitylogueo = i.horalogueo ? i.ticketsasesor / i.horalogueo : 0;
                const productivitybot = i.ticketsbot / fullhours;
                const productivityconectado = i.horaconectado ? i.ticketsasesor / i.horaconectado : 0;
                const productivity = i.productivitybyhour ? parseFloat(i.productivitybyhour) : 0;

                full.horalogueotmp += productivity ? ((productivitylogueo / productivity) - 1) * 100 : 0;
                full.horaconectadotmp += productivity ? ((productivityconectado / (productivity)) - 1) * 100 : 0;
                full.productivitybyhour += productivity;
                full.productivitybot += productivity ? ((productivitybot / (productivity)) - 1) * 100 : 0;
                return full;
            }, {
                ticketstotalac: 0,
                horalogueotmp: 0,
                horaconectadotmp: 0,
                productivitybyhour: 0,
                productivitybot: 0
            });
            setprodxHoraLabel({
                prodlog: (dataacum.horalogueotmp ? (dataacum.horalogueotmp / prodxHoralvl1.length) : 0).toFixed(),
                prodcon: (dataacum.horaconectadotmp ? (dataacum.horaconectadotmp / prodxHoralvl1.length) : 0).toFixed(),
                prodbot: (dataacum.productivitybot ? (dataacum.productivitybot / prodxHoralvl1.length) : 0).toFixed()
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[prodxHoralvl1])
    useEffect(() => {
        setDataSummary({
            tmrglobal: "0m",
            dataTMRBot: "0m",
            dataTMRAsesor: "0m",
            dataTMRCliente: "0m",
            tasaabandono: "0"
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
                    tmeasesorrange0, tmeasesorrange1,  tmeasesorrange2, tmeasesorrange3, tmeasesorrange4, tmeasesorrange5,ticketsabandonados,ticketstmeasesor,ticketstmoasesor ,ticketstotal} = resSummary[0]
                setDataSummary({
                    tmrglobal: formattime(timetoseconds(averagereplytime)),
                    dataTMRBot: formattime(timetoseconds(botaveragereplytime)),
                    dataTMRAsesor: formattime(timetoseconds(useraveragereplytime)),
                    dataTMRCliente: formattime(timetoseconds(personaveragereplytime)),
                    tasaabandono: (ticketsabandonados * 100 / ticketstotal).toFixed(0)
                })
                settmoDistribution([
                    {label:"0 - 5", percentage: (tmoasesorrange0/ticketstmoasesor*100).toFixed(2)},
                    {label:"5 - 10", percentage: (tmoasesorrange1/ticketstmoasesor*100).toFixed(2)},
                    {label:"10 - 15", percentage: (tmoasesorrange2/ticketstmoasesor*100).toFixed(2)},
                    {label:"15 - 20", percentage: (tmoasesorrange3/ticketstmoasesor*100).toFixed(2)},
                    {label:"20 - 30", percentage: (tmoasesorrange4/ticketstmoasesor*100).toFixed(2)},
                    {label:"30 +", percentage: (tmoasesorrange5/ticketstmoasesor*100).toFixed(2)}

                ])
                settmeDistribution([
                    {label:"0 - 5", percentage: (tmeasesorrange0/ticketstmeasesor*100).toFixed(2)},
                    {label:"5 - 10", percentage: (tmeasesorrange1/ticketstmeasesor*100).toFixed(2)},
                    {label:"10 - 15", percentage: (tmeasesorrange2/ticketstmeasesor*100).toFixed(2)},
                    {label:"15 - 20", percentage: (tmeasesorrange3/ticketstmeasesor*100).toFixed(2)},
                    {label:"20 - 30", percentage: (tmeasesorrange4/ticketstmeasesor*100).toFixed(2)},
                    {label:"30 +", percentage: (tmeasesorrange5/ticketstmeasesor*100).toFixed(2)}

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
        setDataNPSgraph([
            { label: t(langKeys.promoters), quantity: 0 },
            { label: t(langKeys.detractors), quantity: 0 },
            { label: t(langKeys.neutral), quantity: 0 }
        ]);
        setDataCSATgraph([
            { label: t(langKeys.satisfied), quantity: 0 },
            { label: t(langKeys.dissatisfied), quantity: 0 },
            { label: t(langKeys.neutral), quantity: 0 }
        ]);
        setDataFCRgraph([
            { label: t(langKeys.resolvedfirstcontact), quantity: 0 },
            { label: t(langKeys.notresolvedfirstcontact), quantity: 0 },
        ]);
        setDataFIXgraph([
            { label: t(langKeys.resolved), quantity: 0 },
            { label: t(langKeys.notresolved), quantity: 0 },
        ]);
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
                { label: t(langKeys.promoters), quantity: nps_high },
                { label: t(langKeys.detractors), quantity: nps_low },
                { label: t(langKeys.neutral), quantity: nps_medium }
            ]);
            setDataCSATgraph([
                { label: t(langKeys.satisfied), quantity: csat_high },
                { label: t(langKeys.dissatisfied), quantity: csat_low },
                { label: t(langKeys.neutral), quantity: csat_medium }
            ]);
            setDataFCRgraph([
                { label: t(langKeys.resolvedfirstcontact), quantity: fcr_yes },
                { label: t(langKeys.notresolvedfirstcontact), quantity: fcr_no },
            ]);
            setDataFIXgraph([
                { label: t(langKeys.resolved), quantity: fix_yes },
                { label: t(langKeys.notresolved), quantity: fix_no },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resEncuesta]);
    function setDataEncuestanps(data:any){
        setDataEncuesta(prev =>({...prev,
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
        }))
        setDataNPSgraph([
            { label: t(langKeys.promoters), quantity: 0 },
            { label: t(langKeys.detractors), quantity: 0 },
            { label: t(langKeys.neutral), quantity: 0 }
        ]);
        if (data.length) {
            const { high, tickets, low, green, medium, total } = data[0]
            const toshow = total ? ((high - low) / total) : 0;
            let variacioncolor = (toshow - green) * 100 >= 0
            setDataEncuesta(prev =>({...prev,
                dataNPS: `${((toshow) * 100).toFixed(2)}%`,
                npsvariacioncolor: variacioncolor,
                nps_green: `${(parseFloat(green) * 100).toFixed(2)}%`,
                npsvariation: `${((toshow - green) * 100).toFixed(2)}%`,
                npspollssent: `${formatNumber(tickets)}`,
                npspollsanswered: `${formatNumber(total)}`,
                npstotalpromoters: high,
                npstotaldetractors: low,
                npstotalneutral: medium,
                npstotalconversations: tickets,
            }))
            setDataNPSgraph([
                { label: t(langKeys.promoters), quantity: high },
                { label: t(langKeys.detractors), quantity: low },
                { label: t(langKeys.neutral), quantity: medium }
            ]);
        }
    }
    function setDataEncuestacsat(data:any){
        setDataEncuesta(prev =>({...prev,
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
        }))
        setDataCSATgraph([
            { label: t(langKeys.satisfied), quantity: 0 },
            { label: t(langKeys.dissatisfied), quantity: 0 },
            { label: t(langKeys.neutral), quantity: 0 }
        ]);
        if (data.length) {
            const { high, tickets, low, green, medium, total } = data[0]
            const toshow = total ? ((high - low) / total) : 0;
            let variacioncolor = (toshow - green) * 100 >= 0
            setDataEncuesta(prev =>({...prev,
                dataCSAT: `${((toshow) * 100).toFixed(2)}%`,
                csatvariacioncolor: variacioncolor,
                csat_green: `${(parseFloat(green) * 100).toFixed(2)}%`,
                csatvariation: `${((toshow - green) * 100).toFixed(2)}%`,
                csatpollssent: `${formatNumber(tickets)}`,
                csatpollsanswered: `${formatNumber(total)}`,
                csattotalpromoters: high,
                csattotaldetractors: low,
                csattotalneutral: medium,
                csattotalconversations: tickets,
            }))
            setDataCSATgraph([
                { label: t(langKeys.satisfied), quantity: high },
                { label: t(langKeys.dissatisfied), quantity: low },
                { label: t(langKeys.neutral), quantity: medium }
            ]);
        }
    }
    function setDataEncuestafcr(data:any){
        setDataEncuesta(prev =>({...prev,
            dataFCR: "0%",
            fcr_green: "0%",
            fcrvariacioncolor: true,
            fcrvariation: "0%",
            fcrpollssent: "0",
            fcrpollsanswered: "0",
            fcrtotalpromoters: 0,
            fcrtotaldetractors: 0,
            fcrtotalconversations: 0,
        }))
        setDataFCRgraph([
            { label: t(langKeys.resolvedfirstcontact), quantity: 0 },
            { label: t(langKeys.notresolvedfirstcontact), quantity: 0 },
        ]);
        if (data.length) {
            const { high, tickets, low, green, total } = data[0]
            const toshow = total ? ((high - low) / total) : 0;
            let variacioncolor = (toshow - green) * 100 >= 0
            setDataEncuesta(prev =>({...prev,
                dataFCR: `${((toshow) * 100).toFixed(2)}%`,
                fcrvariacioncolor: variacioncolor,
                fcr_green: `${(parseFloat(green) * 100).toFixed(2)}%`,
                fcrvariation: `${((toshow - green) * 100).toFixed(2)}%`,
                fcrpollssent: `${formatNumber(tickets)}`,
                fcrpollsanswered: `${formatNumber(total)}`,
                fcrtotalpromoters: high,
                fcrtotaldetractors: low,
                fcrtotalconversations: tickets,
            }))
            setDataFCRgraph([
                { label: t(langKeys.resolvedfirstcontact), quantity: high },
                { label: t(langKeys.notresolvedfirstcontact), quantity: low },
            ]);
        }
    }    
    function setDataEncuestafix(data:any){
        setDataEncuesta(prev =>({...prev,
            dataFIX: "0%",
            fix_green: "0%",
            fixvariacioncolor: true,
            fixvariation: "0%",
            fixpollssent: "0",
            fixpollsanswered: "0",
            fixtotalpromoters: 0,
            fixtotaldetractors: 0,
            fixtotalconversations: 0,
        }))
        setDataFIXgraph([
            { label: t(langKeys.resolved), quantity: 0 },
            { label: t(langKeys.notresolved), quantity: 0 },
        ]);
        if (data.length) {
            const { high, tickets, low, green, total } = data[0]
            const toshow = total ? ((high - low) / total) : 0;
            let variacioncolor = (toshow - green) * 100 >= 0
            setDataEncuesta(prev =>({...prev,
                dataFIX: `${((toshow) * 100).toFixed(2)}%`,
                fixvariacioncolor: variacioncolor,
                fix_green: `${(parseFloat(green) * 100).toFixed(2)}%`,
                fixvariation: `${((toshow - green) * 100).toFixed(2)}%`,
                fixpollssent: `${formatNumber(tickets)}`,
                fixpollsanswered: `${formatNumber(total)}`,
                fixtotalpromoters: high,
                fixtotaldetractors: low,
                fixtotalconversations: tickets,
            }))
            setDataFIXgraph([
                { label: t(langKeys.resolved), quantity: high },
                { label: t(langKeys.notresolved), quantity: low },
            ]);
        }
    }
    useEffect(() => {
        if (waitSave) {
            if (!remultiaux.loading && !remultiaux.error) {
                setResTMO(remultiaux.data[0].data)
                setResTME(remultiaux.data[1].data)
                setResSummary(remultiaux.data[2].data)
                setTasaabandonoperc((+(remultiaux.data[2].data || [])[0]?.tasaabandonoperc || 0) * 100)
                setprodxHoralvl0(remultiaux.data[3].data)
                if(remultiaux.data[4].success){
                    const {horaconectadorange0,horaconectadorange1,horaconectadorange2,horaconectadorange3,horaconectadorange4,
                        horalogueorange0, horalogueorange1,  horalogueorange2, horalogueorange3, horalogueorange4} = remultiaux.data[4].data[0]
                    setprodxHoraDist(
                        [
                            {label:"0 - 3",connected:horaconectadorange0, notconnected: horalogueorange0},
                            {label:"4 - 7",connected:horaconectadorange1, notconnected: horalogueorange1},
                            {label:"8 - 10",connected:horaconectadorange2, notconnected: horalogueorange2},
                            {label:"11 - 12",connected:horaconectadorange3, notconnected: horalogueorange3},
                            {label:"13 +", connected:horaconectadorange4, notconnected: horalogueorange4}]
                    );
                }
                setResEncuesta(remultiaux.data[5].data)
                setprodxHoralvl1(remultiaux.data[6].data)

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
            getdashboardoperativoEncuestaSel(tosend),
            getdashboardoperativoProdxHoraSel({...tosend,level:1}),
        ]))
        setWaitSave(true)
    }
    useEffect(() => {
        
        if (waitSaveAux && !mainResult.mainAux.loading) {
            
            if(fieldToFilter==="TMO")
                setResTMO(mainResult.mainAux.data)
            if(fieldToFilter==="TME")
                setResTME(mainResult.mainAux.data)
            if(fieldToFilter==="NPS")
                setDataEncuestanps(mainResult.mainAux.data)
            if(fieldToFilter==="CSAT")
                setDataEncuestacsat(mainResult.mainAux.data)
            if(fieldToFilter==="FIX")
                setDataEncuestafix(mainResult.mainAux.data)
            if(fieldToFilter==="FCR")
                setDataEncuestafcr(mainResult.mainAux.data)
            setWaitSaveAux(false);
        }
        // eslint-disable-next-line
    },[mainResult.mainAux,waitSaveAux])


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
            dispatch(resetMainAux());
            dispatch(resetMultiMainAux());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if(downloaddatafile) {
            if(!resaux.loading){
                if (resaux.data.length > 0) {
                    exportExcel(titlefile, resaux.data, Object.keys(resaux.data[0]).reduce((ac: any[], c: any) => (
                        [
                            ...ac,
                            { Header: t((langKeys as any)[`dashboard_productivity_${section}_${c}`]), accessor: c }
                        ]),
                        []
                    ))
                }
                else {
                    exportExcel(titlefile, [{'': t(langKeys.no_records)}])
                }
                setdownloaddatafile(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resaux,downloaddatafile])
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
        if (tipeoffilter === "TMO") {
            settitlefile(tipeoffilter);
            setSection('tmo')
            dispatch(getCollectionAux(getdashboardoperativoTMOGENERALSeldata(tosend)))
        } else if (tipeoffilter === "TME") {
            settitlefile(tipeoffilter);
            setSection('tme')
            dispatch(getCollectionAux(getdashboardoperativoTMEGENERALSeldata(tosend)))
        } else if (tipeoffilter === "TMODistribution") {
            settitlefile(t(langKeys.distributionTMO));
            setSection('tmodistribution')
            dispatch(getCollectionAux(getdashboardoperativoTMOdistseldata(tosend)))
        } else if (tipeoffilter === "TMEDistribution") {
            settitlefile(t(langKeys.distributionTME));
            setSection('tmedistribution')
            dispatch(getCollectionAux(getdashboardoperativoTMEdistseldata(tosend)))
        } else if (tipeoffilter === "prodxHoraDist") {
            settitlefile(t(langKeys.distributionProductivity));
            setSection('prodxhoradist')
            dispatch(getCollectionAux(getdashboardoperativoProdxHoraDistSeldata(tosend)))
        } else if (tipeoffilter === "NPS" || tipeoffilter === "CSAT") {
            settitlefile(tipeoffilter);
            setSection('survey3')
            dispatch(getCollectionAux(getdashboardoperativoEncuesta3Seldata({...tosend, question: tipeoffilter})))
        } else if (tipeoffilter === "FIX" || tipeoffilter === "FCR") {
            settitlefile(tipeoffilter);
            setSection('survey2')
            dispatch(getCollectionAux(getdashboardoperativoEncuesta2Seldata({...tosend, question: tipeoffilter})))
        }
    }
    async function funcsearchoneonly() {
        setOpenDialogPerRequest(false)
        
        if(fieldToFilter==="TMO"){
            setResTMO([])
            dispatch(getCollectionAux(getdashboardoperativoTMOGENERALSel({ ...searchfieldsOnlyOne,supervisor: searchfields.supervisor, label:searchfields.label,startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })));
        }
        if(fieldToFilter==="TME"){
            setResTME([])
            dispatch(getCollectionAux(getdashboardoperativoTMEGENERALSel({ ...searchfieldsOnlyOne,supervisor: searchfields.supervisor, label:searchfields.label,startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }
        if(fieldToFilter==="NPS"||fieldToFilter==="CSAT" || fieldToFilter==="FCR" || fieldToFilter==="FIX"){
            dispatch(getCollectionAux(getdashboardoperativoEncuesta3Sel({ ...searchfieldsOnlyOne,supervisor: searchfields.supervisor, label:searchfields.label,question: fieldToFilter,startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }
        setWaitSaveAux(true)
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
                        {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
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
            
            <DialogZyx
                open={openDialogPerRequest}
                title={`${t(langKeys.configuration)} ${fieldToFilter}`}
                buttonText1={t(langKeys.close)}
                buttonText2={t(langKeys.search)}
                handleClickButton1={() => setOpenDialogPerRequest(false)}
                handleClickButton2={() => funcsearchoneonly()}
            >
                <div>
                    {(fieldToFilter!=="FCR" ) &&
                        <div className="row-zyx">
                            <TemplateSwitch
                                label={t(langKeys.agent)}
                                valueDefault={searchfieldsOnlyOne.closedbyasesor}
                                onChange={(value) => {
                                    let closedby = ""
                                    if(value && searchfieldsOnlyOne.closedbybot) {closedby="ASESOR,BOT"} else
                                    if (value) {closedby="ASESOR"} else
                                    if (searchfieldsOnlyOne.closedbybot) {closedby="BOT"}
                                    
                                    setsearchfieldsOnlyOne((prevState) =>({...prevState, closedbyasesor: value, closedby: closedby}))}}
                                className="col-6"
                            />
                            <TemplateSwitch
                                label="Bot"
                                className="col-6"
                                valueDefault={searchfieldsOnlyOne.closedbybot}
                                onChange={(value) =>{ 
                                    let closedby = ""
                                    if(value && searchfieldsOnlyOne.closedbyasesor) {closedby="ASESOR,BOT"} else
                                    if (value) {closedby="BOT"} else
                                    if (searchfieldsOnlyOne.closedbyasesor) {closedby="ASESOR"}
                                    setsearchfieldsOnlyOne((prevState) =>({...prevState, closedbybot: value, closedby: closedby}))}}
                            />
                        </div>
                    }
                    {(fieldToFilter==="TMO" || fieldToFilter==="TME" ) &&
                        <div className="row-zyx">
                            <TextField 
                                label={`${t(langKeys.lowesttime)} (%)`} 
                                variant="outlined" 
                                value={searchfieldsOnlyOne.skipdown}
                                onChange={(e) => setsearchfieldsOnlyOne(prevState =>({...prevState, skipdown: e.target.value as any}))}
                                type="number"
                                className="col-6"
                            />
                            <TextField 
                                label={`${t(langKeys.higuesttime)} (%)`} 
                                variant="outlined" 
                                value={searchfieldsOnlyOne.skipup}
                                onChange={(e) => setsearchfieldsOnlyOne(prevState =>({...prevState, skipup: e.target.value as any}))}
                                className="col-6"
                                type="number"
                            />
                        </div>
                    }
                    
                    {fieldToFilter==="TMO" &&
                        <div className="row-zyx">
                                <TextField 
                                    label={t(langKeys.timemin)} 
                                    variant="outlined" 
                                    type="time"
                                    className="col-12"
                                    value={searchfieldsOnlyOne.min}
                                    onChange={(e) => setsearchfieldsOnlyOne((prevState) =>({...prevState, min: e.target.value}))}
                                />
                        </div>
                    }
                    {(fieldToFilter==="TMO" || fieldToFilter==="TME") &&
                        <div className="row-zyx">
                            <TextField 
                                label={t(langKeys.timemax)}
                                variant="outlined" 
                                type="time"
                                className="col-12"
                                value={searchfieldsOnlyOne.max}
                                onChange={(e) => setsearchfieldsOnlyOne(prevState =>({...prevState, max: e.target.value}))}
                            />
                        </div>
                    }
                    {

                        <div className="row-zyx">
                            <TextField 
                                label={t(langKeys.targetvalue)}
                                variant="outlined" 
                                type="number"
                                className="col-12"
                                value={searchfieldsOnlyOne.target}
                                onChange={(e) => setsearchfieldsOnlyOne(prevState =>({...prevState, target: e.target.value as any}))}
                            />
                        </div>
                    }
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
                    { (resaux.loading && fieldToFilter==="TMO")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}>                            
                            <CloudDownloadIcon onClick={()=>downloaddata("TMO")} className={classes.styleicon}/>
                            <SettingsIcon onClick={()=>{setFieldToFilter("TMO"); setOpenDialogPerRequest(true);setsearchfieldsOnlyOne((prevState) =>({...prevState, min: resTMO[0].target_min, max: resTMO[0].target_max}))}} className={classes.styleicon}/>
                        </div>
                        <div className={classes.columnCard}>
                            <div className={classes.containerFieldsTitle}>
                                <div className={classes.boxtitle}>TMO</div>
                                <div className={classes.boxtitledata}>{data.dataTMO}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.objective)}</div>
                                <div className={classes.datafield}>{data.obj_max}{data.obj_min}</div>
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
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            {(dataTMOgraph[0].quantity + dataTMOgraph[1].quantity) > 0 &&
                                <div className={classes.containerFields}>
                                    <ul style={{padding: 0, margin: 0, textAlign: "center"}}>
                                        {dataTMOgraph.map((entry: any, index: number) => {
                                            let totalsum = dataTMOgraph[0].quantity + dataTMOgraph[1].quantity
                                            let perc = (dataTMOgraph[index].quantity*100)/totalsum
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataTMOgraphLegend-${index}`}>
                                                <svg width="14" height="14" viewBox="0 0 32 32" version="1.1" style={{display: "inline-block", verticalAlign: "middle", marginRight: 4}}>
                                                <path stroke="none" fill={COLORS[index % COLORS.length]} d="M0,4h32v24h-32z"></path></svg>
                                                <span style={{color: COLORS[index % COLORS.length]}}>{dataTMOgraph[index].label} {perc.toFixed(2)}%</span>
                                            </li>
                                            }
                                        )}
                                    </ul>
                                </div>
                            }
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.slaoptimum)}</div>
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
                                <div className={classes.label}>{t(langKeys.conversationsanalyzed)}</div>
                                <div className={classes.datafield}>{data.tickets_analyzed}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>{data.tickets_total}</div>
                            </div>
                        </div>
                    </Box>)}

                    { (resaux.loading && fieldToFilter==="TME")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={()=>downloaddata("TME")}  className={classes.styleicon}/>
                            <SettingsIcon onClick={()=>{setFieldToFilter("TME"); setOpenDialogPerRequest(true);setsearchfieldsOnlyOne((prevState) =>({...prevState, min: resTME[0].target_min, max: resTME[0].target_max}))}} className={classes.styleicon}/>
                        </div>
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
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            {(dataTMEgraph[0].quantity + dataTMEgraph[1].quantity) > 0 &&
                                <div className={classes.containerFields}>
                                    <ul style={{padding: 0, margin: 0, textAlign: "center"}}>
                                        {dataTMEgraph.map((entry: any, index: number) => {
                                            let totalsum = dataTMEgraph[0].quantity + dataTMEgraph[1].quantity
                                            let perc = (dataTMEgraph[index].quantity*100)/totalsum
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataTMEgraphLegend-${index}`}>
                                                <svg width="14" height="14" viewBox="0 0 32 32" version="1.1" style={{display: "inline-block", verticalAlign: "middle", marginRight: 4}}>
                                                <path stroke="none" fill={COLORS[index % COLORS.length]} d="M0,4h32v24h-32z"></path></svg>
                                                <span style={{color: COLORS[index % COLORS.length]}}>{dataTMEgraph[index].label} {perc.toFixed(2)}%</span>
                                            </li>
                                            }
                                        )}
                                    </ul>
                                </div>
                            }
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.slaoptimum)}</div>
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
                                    <div className={classes.label}>{t(langKeys.conversationsanalyzed)}</div>
                                    <div className={classes.datafield}>{dataTME.tickets_analyzed}</div>
                                </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>{dataTME.tickets_total}</div>
                            </div>
                        </div>
                    </Box>)}

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
                            <div className={classes.boxtitle} style={{ padding: 0 }}>TMR {t(langKeys.agent)}</div>
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
                            <div className={classes.boxtitle} style={{ padding: 0 }}>TMR {t(langKeys.client)}</div>
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
                        <div className={classes.datafieldfooter}>
                            <div>% {t(langKeys.compliance)}</div>
                            <div>{+prodxHoraLabel.prodlog>0?<ArrowDropUpIcon style={{color: "green", height: "15px"}}/>:<ArrowDropDownIcon style={{color: "red", height: "15px"}}/>}{prodxHoraLabel.prodlog} %</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.productivitycard2)}</div>
                        <div className={classes.datafieldquarter}>{prodxHora.prodcon}</div>
                        <div className={classes.datafieldfooter}>
                            <div>% {t(langKeys.compliance)}</div>
                            <div>{+prodxHoraLabel.prodcon>0?<ArrowDropUpIcon style={{color: "green", height: "15px"}}/>:<ArrowDropDownIcon style={{color: "red", height: "15px"}}/>}{prodxHoraLabel.prodcon} %</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.productivitycard3)}</div>
                        <div className={classes.datafieldquarter}>{prodxHora.prodbot}</div>
                        <div className={classes.datafieldfooter}>
                            <div>% {t(langKeys.compliance)}</div>
                            <div>{+prodxHoraLabel.prodbot>0?<ArrowDropUpIcon style={{color: "green", height: "15px"}}/>:<ArrowDropDownIcon style={{color: "red", height: "15px"}}/>}{prodxHoraLabel.prodbot} %</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.productivitycard4)}</div>
                        <div className={classes.datafieldquarter}>{dataSummary.tasaabandono} %</div>                    
                        <div className={classes.datafieldfooter}>
                            <div>% {t(langKeys.compliance)}</div>
                            <div>{+dataSummary.tasaabandono - tasaabandonoperc>0?<ArrowDropUpIcon style={{color: "green", height: "15px"}}/>:<ArrowDropDownIcon style={{color: "red", height: "15px"}}/>}{+dataSummary.tasaabandono - tasaabandonoperc} %</div>
                        </div> 
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
                                <Legend />
                                <Bar dataKey="percentage" fill="#8884d8" name={`% ${t(langKeys.tmo)}`}>
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
                                <Legend />
                                <Bar dataKey="percentage" fill="#8884d8" name={`% ${t(langKeys.tme)}`}/>
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
                    { (resaux.loading && fieldToFilter==="NPS")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={()=>downloaddata("NPS")}  className={classes.styleicon}/>
                            <SettingsIcon onClick={()=>{setFieldToFilter("NPS"); setOpenDialogPerRequest(true)}} className={classes.styleicon}/>
                        </div>
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
                                <div className={classes.label}>{t(langKeys.pollssent, { survey: 'NPS' })}</div>
                                <div className={classes.datafield}>{dataEncuesta.npspollssent}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollsanswered, { survey: 'NPS' })}</div>
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
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            {(dataNPSgraph[0].quantity + dataNPSgraph[1].quantity + dataNPSgraph[2].quantity) > 0 &&
                                <div className={classes.containerFields}>
                                    <ul style={{padding: 0, margin: 0, textAlign: "center"}}>
                                        {dataNPSgraph.map((entry: any, index: number) => {
                                            let totalsum = dataNPSgraph[0].quantity + dataNPSgraph[1].quantity + dataNPSgraph[2].quantity
                                            let perc = (dataNPSgraph[index].quantity*100)/totalsum
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataNPSgraphLegend-${index}`}>
                                                <svg width="14" height="14" viewBox="0 0 32 32" version="1.1" style={{display: "inline-block", verticalAlign: "middle", marginRight: 4}}>
                                                <path stroke="none" fill={COLORS[index % COLORS.length]} d="M0,4h32v24h-32z"></path></svg>
                                                <span style={{color: COLORS[index % COLORS.length]}}>{dataNPSgraph[index].label} {perc.toFixed(2)}%</span>
                                            </li>
                                            }
                                        )}
                                    </ul>
                                </div>
                            }
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
                    </Box>)}
                    { (resaux.loading && fieldToFilter==="CSAT")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={()=>downloaddata("CSAT")}  className={classes.styleicon}/>
                            <SettingsIcon onClick={()=>{setFieldToFilter("CSAT"); setOpenDialogPerRequest(true)}} className={classes.styleicon}/>
                        </div>
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
                                <div className={classes.label}>{t(langKeys.pollssent, { survey: 'CSAT' })}</div>
                                <div className={classes.datafield}>{dataEncuesta.csatpollssent}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollsanswered, { survey: 'CSAT' })}</div>
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
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            {(dataCSATgraph[0].quantity + dataCSATgraph[1].quantity + dataCSATgraph[2].quantity) > 0 &&
                                <div className={classes.containerFields}>
                                    <ul style={{padding: 0, margin: 0, textAlign: "center"}}>
                                        {dataCSATgraph.map((entry: any, index: number) => {
                                            let totalsum = dataCSATgraph[0].quantity + dataCSATgraph[1].quantity + dataCSATgraph[2].quantity
                                            let perc = (dataCSATgraph[index].quantity*100)/totalsum
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataCSATgraphLegend-${index}`}>
                                                <svg width="14" height="14" viewBox="0 0 32 32" version="1.1" style={{display: "inline-block", verticalAlign: "middle", marginRight: 4}}>
                                                <path stroke="none" fill={COLORS[index % COLORS.length]} d="M0,4h32v24h-32z"></path></svg>
                                                <span style={{color: COLORS[index % COLORS.length]}}>{dataCSATgraph[index].label} {perc.toFixed(2)}%</span>
                                            </li>
                                            }
                                        )}
                                    </ul>
                                </div>
                            }
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalsatisfied)}</div>
                                <div className={classes.datafield}>{dataEncuesta.csattotalpromoters}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totaldissatisfied)}</div>
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
                    </Box>)}
                </div>
                <div className={classes.replacerowzyx} >
                    { (resaux.loading && fieldToFilter==="FCR")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={()=>downloaddata("FCR")}  className={classes.styleicon}/>
                            <SettingsIcon onClick={()=>{setFieldToFilter("FCR"); setOpenDialogPerRequest(true)}} className={classes.styleicon}/>
                        </div>
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
                                <div className={classes.label}>{t(langKeys.pollssent, { survey: 'FCR' })}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrpollssent}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollsanswered, { survey: 'FCR' })}</div>
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
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            {(dataFCRgraph[0].quantity + dataFCRgraph[1].quantity) > 0 &&
                                <div className={classes.containerFields}>
                                    <ul style={{padding: 0, margin: 0, textAlign: "center"}}>
                                        {dataFCRgraph.map((entry: any, index: number) => {
                                            let totalsum = dataFCRgraph[0].quantity + dataFCRgraph[1].quantity
                                            let perc = (dataFCRgraph[index].quantity*100)/totalsum
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataFCRgraphLegend-${index}`}>
                                                <svg width="14" height="14" viewBox="0 0 32 32" version="1.1" style={{display: "inline-block", verticalAlign: "middle", marginRight: 4}}>
                                                <path stroke="none" fill={COLORS[index % COLORS.length]} d="M0,4h32v24h-32z"></path></svg>
                                                <span style={{color: COLORS[index % COLORS.length]}}>{dataFCRgraph[index].label} {perc.toFixed(2)}%</span>
                                            </li>
                                            }
                                        )}
                                    </ul>
                                </div>
                            }
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalresolvedfirstcontact)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrtotalpromoters}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalnotresolvedfirstcontact)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrtotaldetractors}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversations)}</div>
                                <div className={classes.datafield}>{dataEncuesta.fcrtotalconversations}</div>
                            </div>
                        </div>
                    </Box>)}
                    { (resaux.loading && fieldToFilter==="FIX")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={()=>downloaddata("FIX")}  className={classes.styleicon}/>
                            <SettingsIcon onClick={()=>{setFieldToFilter("FIX"); setOpenDialogPerRequest(true)}} className={classes.styleicon}/>
                        </div>
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
                                <div className={classes.label}>{t(langKeys.pollssent, { survey: 'FIX' })}</div>
                                <div className={classes.datafield}>{dataEncuesta.fixpollssent}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.pollsanswered, { survey: 'FIX' })}</div>
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
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={classes.columnCard}>
                            {(dataFIXgraph[0].quantity + dataFIXgraph[1].quantity) > 0 &&
                                <div className={classes.containerFields}>
                                    <ul style={{padding: 0, margin: 0, textAlign: "center"}}>
                                        {dataFIXgraph.map((entry: any, index: number) => {
                                            let totalsum = dataFIXgraph[0].quantity + dataFIXgraph[1].quantity
                                            let perc = (dataFIXgraph[index].quantity*100)/totalsum
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataFIXgraphLegend-${index}`}>
                                                <svg width="14" height="14" viewBox="0 0 32 32" version="1.1" style={{display: "inline-block", verticalAlign: "middle", marginRight: 4}}>
                                                <path stroke="none" fill={COLORS[index % COLORS.length]} d="M0,4h32v24h-32z"></path></svg>
                                                <span style={{color: COLORS[index % COLORS.length]}}>{dataFIXgraph[index].label} {perc.toFixed(2)}%</span>
                                            </li>
                                            }
                                        )}
                                    </ul>
                                </div>
                            }
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
                    </Box>)}
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardProductivity;