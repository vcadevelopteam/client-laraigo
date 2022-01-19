import { Box, Button, CircularProgress, createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import { DateRangePicker, DialogZyx, FieldMultiSelect, FieldSelect, TemplateSwitch } from "components";
import { useSelector } from "hooks";
import { CalendarIcon } from "icons";
import { langKeys } from "lang/keys";
import { FC, Fragment, useEffect, useState } from "react";
import { resetMain, getMultiCollection, getMultiCollectionAux, getCollectionAux } from 'store/main/actions';
import { Range } from 'react-date-range';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import clsx from 'clsx';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PersonIcon from '@material-ui/icons/Person';
import ChatIcon from '@material-ui/icons/Chat';
import AdbIcon from '@material-ui/icons/Adb';
import { exportExcel } from 'common/helpers';
import { useTranslation } from 'react-i18next';
import { gerencialasesoresconectadosbarsel, gerencialconversationsel,gerencialEncuestassel,getdashboardgerencialconverstionxhoursel,gerencialasesoresconectadosbarseldata,gerencialencuestaseldata,gerencialinteractionseldata, gerencialconversationseldata,gerencialencuestasel,gerencialetiquetasseldata, gerencialetiquetassel, gerencialinteractionsel,gerencialsummaryseldata, gerencialsummarysel, gerencialTMEsel, gerencialTMOsel,gerencialTMOselData, getCommChannelLst, getValuesFromDomain } from "common/helpers";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import SettingsIcon from '@material-ui/icons/Settings';

const COLORS = ['#22b66e', '#b41a1a', '#ffcd56'];

const arraymonth = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
]
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
function formatname(cc: any) {
    let newname = cc.toLowerCase();
    let names = newname.split(" ");
    for (let i = 0; i < names.length; i++) {
        names[i] = (names[i] ? names[i][0].toUpperCase() : "") + names[i].substr(1);
    }
    return names.join(" ")
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
const format = (date: Date) => date.toISOString().split('T')[0];

const DashboardManagerial: FC = () => {
    const classes = useStyles();
    const mainResultMulti = useSelector(state => state.main.multiData);
    const remultiaux = useSelector(state => state.main.multiDataAux);
    const resaux = useSelector(state => state.main.mainAux);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [downloaddatafile,setdownloaddatafile]=useState(false)
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
        maxavgtickethour: "0",
        minvgtickethour: "0",
        avgtickethour: "0",
        maxavgtickethourdescdate: "",
        maxavgtickethourdeschour: "",
        minavgtickethourdescdate: "",
        minavgtickethourdeschour: "",
        maxavgticketasesorhour: "0",
        minvgticketasesorhour: "0",
        avgticketasesorhour: "0",
        maxavgticketasesorhourdescdate: "",
        maxavgticketasesorhourdeschour: "",
        minavgticketasesorhourdescdate: "",
        minavgticketasesorhourdeschour: "",
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
    const [dataDASHBOARD, setDataDASHBOARD] = useState({
        avgconversationsattended: "0%",
        maxavgconversationsattendedasesor: "0%",
        minvgconversationsattendedbot: "0%",
        iconconversationsattendedasesor: true,
        iconconversationsattendedbot: true
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
    const [dataInteraction, setDataInteraction] = useState({
        avginteractionsxconversations: "0",
        maxavginteractionsxconversations: "0",
        minvginteractionsxconversations: "0",
    });
    const [dataAsesoreconectadosbar, setDataAsesoreconectadosbar] = useState({
        avgasesoresconectados: "0",
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogPerRequest, setOpenDialogPerRequest] = useState(false);
    const [fieldToFilter, setFieldToFilter] = useState("");
    const [resTMO, setResTMO] = useState<any>([]);
    const [resTME, setResTME] = useState<any>([]);
    const [titlefile, settitlefile] = useState('');
    const [resSummary, setResSummary] = useState<any>([]);
    const [resEncuesta, setResEncuesta] = useState<any>([]);
    const [resDashboard, setResDashboard] = useState<any>([]);
    const [resInteraction, setResInteraction] = useState<any>([]);
    const [resAsesoreconectadosbar, setResAsesoreconectadosbar] = useState<any>([]);
    const [resLabels, setResLabels] = useState<any>([]);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [dataqueue, setdataqueue] = useState<any>([]);
    const [dataprovider, setdataprovider] = useState<any>([]);
    const [datachannels, setdatachannels] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);
    const [bringdataFilters, setbringdataFilters] = useState(false);
    const [waitSaveaux, setWaitSaveaux] = useState(false);
    const [searchfields, setsearchfields] = useState({
        queue: "",
        provider: "",
        channels: ""
    });
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
    useEffect(() => {
        if(bringdataFilters){
            if (mainResultMulti.data.length !== 0) {
                let multiData = mainResultMulti.data;
                setdataqueue(multiData[0] && multiData[0].success ? multiData[0].data : []);
                setdataprovider(multiData[1] && multiData[1].success ? multiData[1].data : []);
                setdatachannels(multiData[2] && multiData[2].success ? multiData[2].data : []);
                setbringdataFilters(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainResultMulti,bringdataFilters])

    useEffect(() => {
        if(downloaddatafile) {
            if(!resaux.loading){
                exportExcel(titlefile,resaux.data)
                setdownloaddatafile(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resaux,downloaddatafile])
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
                let objetivo_min = timetomin(target_min)
                let objetivo_max = timetomin(target_max)
                let dataTMO = `${hh}${mm}${ss}`
                setData(p => ({ ...p, dataTMO: dataTMO }))
                setData(p => ({ ...p, obj_max: `< ${objetivo_max}m `, obj_min: objetivo_min > 0 ? ` y > ${objetivo_min}m ` : '' }))

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
                    { label: t(langKeys.meets), quantity: tickets_comply },
                    { label: t(langKeys.meetsnot), quantity: tickets_analyzed - tickets_comply }
                ]);
            }else{
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
                })
                setDataTMOgraph([
                    { label: t(langKeys.meets), quantity: 0 },
                    { label: t(langKeys.meetsnot), quantity: 0 }
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
                    { label: t(langKeys.meets), quantity: tickets_comply },
                    { label: t(langKeys.meetsnot), quantity: tickets_analyzed - tickets_comply }
                ]);


            }else{
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
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resTME])
    useEffect(() => {
        setDataSummary({
            tmrglobal: "0m",
            dataTMRBot: "0m",
            dataTMRAsesor: "0m",
            dataTMRCliente: "0m",
            maxavgtickethour: "0",
            minvgtickethour: "0",
            avgtickethour: "0",
            maxavgtickethourdescdate: "",
            maxavgtickethourdeschour: "",
            minavgtickethourdescdate: "",
            minavgtickethourdeschour: "",
            maxavgticketasesorhour: "0",
            minvgticketasesorhour: "0",
            avgticketasesorhour: "0",
            maxavgticketasesorhourdescdate: "",
            maxavgticketasesorhourdeschour: "",
            minavgticketasesorhourdescdate: "",
            minavgticketasesorhourdeschour: "",
        })
        if (resSummary.length) {
            if (resSummary[0] && resSummary[0].ticketstotal !== 0) {
                let txtmaxavgticketusername = formatname(resSummary[0].maxavgticketusername)
                let txtminavgticketusername = formatname(resSummary[0].minavgticketusername)
                let txtmaxavgticketasesorusername = formatname(resSummary[0].maxavgticketasesorusername)
                let txtminavgticketasesorusername = formatname(resSummary[0].minavgticketasesorusername)
                const mm = resSummary[0].maxavgtickethourdesc ? resSummary[0].maxavgtickethourdesc.split(" ") : null;
                const mm1 = resSummary[0].minavgtickethourdesc ? resSummary[0].minavgtickethourdesc.split(" ") : null;
                const mm2 = resSummary[0].maxavgticketasesorhourdesc ? resSummary[0].maxavgticketasesorhourdesc.split(" ") : null;
                const mm3 = resSummary[0].minavgticketasesorhourdesc ? resSummary[0].minavgticketasesorhourdesc.split(" ") : null;
                setDataSummary({
                    tmrglobal: formattime(timetoseconds(resSummary[0].averagereplytime) + timetoseconds(resSummary[0].useraveragereplytime) / 2),
                    dataTMRBot: formattime(timetoseconds(resSummary[0].averagereplytime)),
                    dataTMRAsesor: formattime(timetoseconds(resSummary[0].useraveragereplytime)),
                    dataTMRCliente: formattime(timetoseconds(resSummary[0].personaveragereplytime)),
                    maxavgtickethour: `${resSummary[0].maxavgtickethour}(${txtmaxavgticketusername})`,
                    minvgtickethour: `${resSummary[0].minavgtickethour} (${txtminavgticketusername})`,
                    avgtickethour: resSummary[0].avgtickethour,
                    maxavgtickethourdescdate: mm ? mm[0] + " " + arraymonth[parseInt(mm[1]) - 1] : "",
                    maxavgtickethourdeschour: mm ? mm[2] + " " + mm[3].toLowerCase() : "",
                    minavgtickethourdescdate: mm1 ? mm1[0] + " " + arraymonth[parseInt(mm1[1]) - 1] : "",
                    minavgtickethourdeschour: mm1 ? mm1[2] + " " + mm1[3].toLowerCase() : "",
                    maxavgticketasesorhour: `${resSummary[0].maxavgticketasesorhour} (${txtmaxavgticketasesorusername})`,
                    minvgticketasesorhour: `${resSummary[0].minavgticketasesorhour} (${txtminavgticketasesorusername})`,
                    avgticketasesorhour: resSummary[0].avgticketasesorhour,
                    maxavgticketasesorhourdescdate: mm2 ? mm2[0] + " " + arraymonth[parseInt(mm2[1]) - 1] : "",
                    maxavgticketasesorhourdeschour: mm2 ? mm2[2] + " " + mm2[3].toLowerCase() : "",
                    minavgticketasesorhourdescdate: mm3 ? mm3[0] + " " + arraymonth[parseInt(mm3[1]) - 1] : "",
                    minavgticketasesorhourdeschour: mm3 ? mm3[2] + " " + mm3[3].toLowerCase() : "",
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resSummary])
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
        if(data.length){

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
        if(data.length){

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
        if(data.length){

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
    function setDataaverageconversationsattendedbyhour(data:any){
        setDataSummary((prev)=>({...prev,
            avgtickethour: "0",
            maxavgtickethour: "0",
            maxavgtickethourdescdate: "",
            maxavgtickethourdeschour: "",
            minvgtickethour: "0",
            minavgtickethourdescdate: "",
            minavgtickethourdeschour: "",
        }))
        if(data.length){
            let txtmaxavgticketusername = formatname(data[0].maxavgticketusername)
            let txtminavgticketusername = formatname(data[0].minavgticketusername)
            const mm = data[0].maxavgtickethourdesc ? data[0].maxavgtickethourdesc.split(" ") : null;
            const mm1 = data[0].minavgtickethourdesc ? data[0].minavgtickethourdesc.split(" ") : null;
            setDataSummary((prev)=>({...prev,
                avgtickethour: data[0].avgtickethour,
                maxavgtickethour: `${data[0].maxavgtickethour} (${txtmaxavgticketusername})`,
                maxavgtickethourdescdate: mm ? mm[0] + " " + arraymonth[parseInt(mm[1]) - 1] : "",
                maxavgtickethourdeschour: mm ? mm[2] + " " + mm[3].toLowerCase() : "",
                minvgtickethour: `${data[0].minavgtickethour} (${txtminavgticketusername})`,
                minavgtickethourdescdate: mm1 ? mm1[0] + " " + arraymonth[parseInt(mm1[1]) - 1] : "",
                minavgtickethourdeschour: mm1 ? mm1[2] + " " + mm1[3].toLowerCase() : "",
            }))
        }
    }
    function setDataaverageconversationsattendedbytheadvisorbyhour(data:any){
        setDataSummary((prev)=>({...prev,
            avgticketasesorhour: "0",
            maxavgticketasesorhour: "0",
            maxavgticketasesorhourdescdate: "",
            maxavgticketasesorhourdeschour: "",
            minvgtickethour: "0",
            minavgticketasesorhourdescdate: "",
            minavgticketasesorhourdeschour: "",
        }))
        if(data.length){
            let txtminavgticketusername = formatname(resSummary[0].minavgticketusername)
            let txtmaxavgticketasesorusername = formatname(resSummary[0].maxavgticketasesorusername)
            const mm2 = resSummary[0].maxavgticketasesorhourdesc ? resSummary[0].maxavgticketasesorhourdesc.split(" ") : null;
            const mm3 = resSummary[0].minavgticketasesorhourdesc ? resSummary[0].minavgticketasesorhourdesc.split(" ") : null;
            setDataSummary((prev)=>({...prev,
                avgticketasesorhour: resSummary[0].avgticketasesorhour,
                maxavgticketasesorhour: `${resSummary[0].maxavgticketasesorhour} (${txtmaxavgticketasesorusername})`,
                maxavgticketasesorhourdescdate: mm2 ? mm2[0] + " " + arraymonth[parseInt(mm2[1]) - 1] : "",
                maxavgticketasesorhourdeschour: mm2 ? mm2[2] + " " + mm2[3].toLowerCase() : "",
                minvgtickethour: `${resSummary[0].minavgtickethour} (${txtminavgticketusername})`,
                minavgticketasesorhourdescdate: mm3 ? mm3[0] + " " + arraymonth[parseInt(mm3[1]) - 1] : "",
                minavgticketasesorhourdeschour: mm3 ? mm3[2] + " " + mm3[3].toLowerCase() : "",
            }))
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
        if(data.length){

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
    useEffect(() => {
        setDataDASHBOARD({
            avgconversationsattended: "0%",
            maxavgconversationsattendedasesor: "0%",
            minvgconversationsattendedbot: "0%",
            iconconversationsattendedasesor: true,
            iconconversationsattendedbot: true
        })
        if (resDashboard.length) {
            const { avgparam,ticketscerrados, ticketstotal, ticketscerradosasesor, ticketscerradosbot } = resDashboard[0];
            setDataDASHBOARD({
                avgconversationsattended: ((ticketscerrados * 100) / ticketstotal).toFixed() + "%",
                maxavgconversationsattendedasesor: ((ticketscerradosasesor * 100) / ticketstotal).toFixed() + "%",
                minvgconversationsattendedbot: ((ticketscerradosbot * 100) / ticketstotal).toFixed() + "%",
                iconconversationsattendedasesor: parseFloat(avgparam) < (ticketscerradosasesor / ticketstotal),
                iconconversationsattendedbot: parseFloat(avgparam) < (ticketscerradosbot / ticketstotal)
            })

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resDashboard]);
    useEffect(() => {
        setDataInteraction({
            avginteractionsxconversations: "0",
            maxavginteractionsxconversations: "0",
            minvginteractionsxconversations: "0",
        })
        if (resInteraction.length) {
            const { avginteracciones, avginteraccionesasesor, avginteracionesbot } = resInteraction[0];
            setDataInteraction({
                avginteractionsxconversations: avginteracciones,
                maxavginteractionsxconversations: avginteraccionesasesor,
                minvginteractionsxconversations: avginteracionesbot,
            })

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resInteraction]);
    useEffect(() => {
        setDataAsesoreconectadosbar({
            avgasesoresconectados: "0"
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resAsesoreconectadosbar]);

    useEffect(() => {
        if (waitSave) {
            if (!remultiaux.loading && !remultiaux.error) {
                setResTMO(remultiaux.data[0].data)
                setResTME(remultiaux.data[1].data)
                setResSummary(remultiaux.data[2].data)
                setResEncuesta(remultiaux.data[3].data)
                setResDashboard(remultiaux.data[4].data)
                setResInteraction(remultiaux.data[5].data)
                setResLabels(remultiaux.data[6].data)



                const asesoretmp = [...remultiaux.data[7].data];

                setResAsesoreconectadosbar([...Array(24)].map((_, i) => {
                    const hourFound = asesoretmp.find((x: Dictionary) => x.hora === i);
                    if (hourFound)
                        return hourFound
                    else
                        return { hora: i, asesoresconectados: "0", avgasesoresconectados: "0" }
                }))



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
        dispatch(showBackdrop(true));
        setOpenDialog(false)
        dispatch(getMultiCollectionAux([
            gerencialTMOsel({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider }),
            gerencialTMEsel({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider }),
            gerencialsummarysel({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider }),
            gerencialencuestasel({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider }),
            gerencialconversationsel({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider }),
            gerencialinteractionsel({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider }),
            gerencialetiquetassel({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider }),
            gerencialasesoresconectadosbarsel({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider }),
        ]))
        setWaitSave(true)
    }
    async function funcsearchoneonly() {
        setOpenDialogPerRequest(false)
        
        if(fieldToFilter==="TMO"){
            setResTMO([])
            dispatch(getCollectionAux(gerencialTMOsel({ ...searchfieldsOnlyOne,startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })));
        }
        if(fieldToFilter==="TME"){
            setResTME([])
            dispatch(getCollectionAux(gerencialTMEsel({ ...searchfieldsOnlyOne,startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }
        if(fieldToFilter==="NPS"||fieldToFilter==="CSAT" || fieldToFilter==="FCR" || fieldToFilter==="FIX"){
            dispatch(getCollectionAux(gerencialEncuestassel({ ...searchfieldsOnlyOne,question: fieldToFilter,startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }
        if(fieldToFilter==="averageconversationsattendedbyhour" || fieldToFilter==="averageconversationsattendedbytheadvisorbyhour"){
            dispatch(getCollectionAux(getdashboardgerencialconverstionxhoursel({ ...searchfieldsOnlyOne,startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }
        if(fieldToFilter==="etiqueta"){
            setResLabels([])
            dispatch(getCollectionAux(gerencialetiquetassel({ ...searchfieldsOnlyOne,startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }
        setWaitSaveaux(true)
    }
    useEffect(() => {
        if (waitSaveaux) {
            if(!resaux.loading){
                if(fieldToFilter==="TMO")
                    setResTMO(resaux.data)
                if(fieldToFilter==="TME")
                    setResTME(resaux.data)
                if(fieldToFilter==="NPS")
                    setDataEncuestanps(resaux.data)
                if(fieldToFilter==="CSAT")
                    setDataEncuestacsat(resaux.data)
                if(fieldToFilter==="FIX")
                    setDataEncuestafix(resaux.data)
                if(fieldToFilter==="FCR")
                    setDataEncuestafcr(resaux.data)
                if(fieldToFilter==="averageconversationsattendedbyhour")
                    setDataaverageconversationsattendedbyhour(resaux.data)
                if(fieldToFilter==="averageconversationsattendedbytheadvisorbyhour")
                    setDataaverageconversationsattendedbytheadvisorbyhour(resaux.data)
                if(fieldToFilter==="etiqueta")
                    setResLabels(resaux.data)
                setWaitSaveaux(false);
            }
        }
        // eslint-disable-next-line
    },[resaux,waitSaveaux])


    useEffect(() => {
        setbringdataFilters(true)
        dispatch(getMultiCollection([
            getValuesFromDomain("GRUPOS"),
            getValuesFromDomain("EMPRESA"),
            getCommChannelLst()
        ]));
        funcsearch()

        // return () => {
        //     dispatch(resetMain());
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const downloaddata= (tipeoffilter:string) => {
        setdownloaddatafile(true)
        settitlefile(`DashboardManagerial-${tipeoffilter}`)
        if(tipeoffilter==="TMO" || tipeoffilter==="TME"){
            dispatch(getCollectionAux(gerencialTMOselData({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }else if(tipeoffilter==="NPS"||tipeoffilter==="CSAT"||tipeoffilter==="FIX"||tipeoffilter==="FCR"){
            dispatch(getCollectionAux(gerencialencuestaseldata({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }else if(tipeoffilter==="etiqueta"){
            dispatch(getCollectionAux(gerencialetiquetasseldata({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }else if(tipeoffilter==="averageconversations"){
            dispatch(getCollectionAux(gerencialconversationseldata({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }else if(tipeoffilter==="interaction"){
            dispatch(getCollectionAux(gerencialinteractionseldata({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }else if(tipeoffilter==="asesoresconectados"){
            dispatch(getCollectionAux(gerencialasesoresconectadosbarseldata({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
        }else{
            dispatch(getCollectionAux(gerencialsummaryseldata({ startdate: dateRangeCreateDate.startDate, enddate: dateRangeCreateDate.endDate, channel: searchfields.channels, group: searchfields.queue, company: searchfields.provider })))
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

            </DialogZyx>
            <DialogZyx
                open={openDialogPerRequest}
                title={`${t(langKeys.configuration)} ${fieldToFilter === "averageconversationsattendedbytheadvisorbyhour"? t(langKeys.averageconversationsattendedbytheadvisorbyhour): fieldToFilter === "averageconversationsattendedbyhour"? t(langKeys.averageconversationsattendedbyhour): fieldToFilter}`}
                buttonText1={t(langKeys.close)}
                buttonText2={t(langKeys.search)}
                handleClickButton1={() => setOpenDialogPerRequest(false)}
                handleClickButton2={() => funcsearchoneonly()}
            >
                <div>
                    {(fieldToFilter!=="FCR" && fieldToFilter!=="etiqueta" && fieldToFilter!=="averageconversationsattendedbytheadvisorbyhour" && fieldToFilter!=="averageconversationsattendedbyhour" ) &&
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
                    {(fieldToFilter==="TMO" || fieldToFilter==="TME" || fieldToFilter==="averageconversationsattendedbytheadvisorbyhour" || fieldToFilter==="averageconversationsattendedbyhour" ) &&
                        <div className="row-zyx">
                            <TextField 
                                label={`${t(langKeys.lowesttime)} (%)`} 
                                variant="outlined" 
                                value={searchfieldsOnlyOne.skipdown}
                                onChange={(e) => setsearchfieldsOnlyOne(prevState =>({...prevState, skipdown: (Number(e.target.value))}))}
                                type="number"
                                className="col-6"
                            />
                            <TextField 
                                label={`${t(langKeys.higuesttime)} (%)`} 
                                variant="outlined" 
                                value={searchfieldsOnlyOne.skipup}
                                onChange={(e) => setsearchfieldsOnlyOne(prevState =>({...prevState, skipup: (Number(e.target.value))}))}
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
                    { (fieldToFilter!=="etiqueta" && fieldToFilter!=="averageconversationsattendedbytheadvisorbyhour" && fieldToFilter!=="averageconversationsattendedbyhour") &&

                        <div className="row-zyx">
                            <TextField 
                                label={t(langKeys.targetvalue)}
                                variant="outlined" 
                                type="number"
                                className="col-12"
                                value={searchfieldsOnlyOne.target}
                                onChange={(e) => setsearchfieldsOnlyOne(prevState =>({...prevState, target: (Number(e.target.value))}))}
                            />
                        </div>
                    }
                    { (fieldToFilter==="etiqueta") &&

                        <div className="row-zyx">
                            <TextField 
                                label={t(langKeys.numberoflabels)}
                                variant="outlined" 
                                type="number"
                                className="col-12"
                                value={searchfieldsOnlyOne.limit}
                                onChange={(e) => setsearchfieldsOnlyOne(prevState =>({...prevState, limit: (Number(e.target.value))}))}
                            />
                        </div>
                    }
                </div>

            </DialogZyx>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className={classes.maintitle}> {t(langKeys.managerial)}</div>
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
                    { (resaux.loading && fieldToFilter==="TMO")?
                        (<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}>
                            <CircularProgress/>
                        </Box>):
                        (<Box
                            className={classes.itemCard}
                        >
                            <div className={classes.downloadiconcontainer}>                            
                                <CloudDownloadIcon onClick={()=>downloaddata("TMO")} className={classes.styleicon}/>
                                <SettingsIcon onClick={()=>{setFieldToFilter("TMO"); setOpenDialogPerRequest(true)}} className={classes.styleicon}/>
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
                                                return <li style={{display: "inline-block", marginRight: 10}} key={`dataTMOgraphlegend-${index}`}>
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
                        </Box>)
                    }

                    { (resaux.loading && fieldToFilter==="TME")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                        (<Box
                            className={classes.itemCard}
                        >
                            <div className={classes.downloadiconcontainer}>
                                <CloudDownloadIcon onClick={()=>downloaddata("TME")}  className={classes.styleicon}/>
                                <SettingsIcon onClick={()=>{setFieldToFilter("TME"); setOpenDialogPerRequest(true)}} className={classes.styleicon}/>
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
                                                return <li style={{display: "inline-block", marginRight: 10}} key={`dataTMEgraphlegend-${index}`}>
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
                        </Box>)
                    }

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
                    { (resaux.loading && fieldToFilter==="NPS")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        className={classes.itemCard}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={()=>downloaddata("NPS")} className={classes.styleicon}/>                            
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
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataNPSgraphlegend-${index}`}>
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
                            <CloudDownloadIcon onClick={()=>downloaddata("CSAT")} className={classes.styleicon}/>
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
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataCSATgraphlegend-${index}`}>
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
                            <CloudDownloadIcon onClick={()=>downloaddata("FCR")} className={classes.styleicon}/>
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
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataFCRgraphlegend-${index}`}>
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
                            <CloudDownloadIcon onClick={()=>downloaddata("FIX")} className={classes.styleicon}/>
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
                                            return <li style={{display: "inline-block", marginRight: 10}} key={`dataFIXgraphlegend-${index}`}>
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
                <div className={classes.replacerowzyx}>
                    { (resaux.loading && fieldToFilter==="averageconversationsattendedbyhour")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        style={{ backgroundColor: "white", padding: "10px", flex: 1.91 }}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={()=>downloaddata("averageconversationsattendedbyhour")} className={classes.styleicon}/>
                            <SettingsIcon onClick={()=>{setFieldToFilter("averageconversationsattendedbyhour"); setOpenDialogPerRequest(true)}} className={classes.styleicon}/>
                        </div>
                        <div className={classes.boxtitlequarter}>{dataSummary.avgtickethour}</div>
                        <div className={classes.boxtitlequarter}>{t(langKeys.averageconversationsattendedbyhour)}</div>
                        <div style={{display: "flex",  width: "100%"}}>
                            <div style={{width: "100%"}}>
                                <div className="row-zyx" style={{ paddingTop: "10px" }}>
                                    <div style={{ width: "50%" }}>{dataSummary.maxavgtickethour}</div>
                                    <div style={{ width: "50%", textAlign: "end" }}>{dataSummary.maxavgtickethourdescdate}</div>
                                </div>
                                <div className="row-zyx" style={{ paddingTop: "0"  }}>
                                    <div style={{ width: "50%" }}>{t(langKeys.highestvalue)}</div>
                                    <div style={{ width: "50%", textAlign: "end" }}>{dataSummary.maxavgtickethourdeschour}</div>
                                </div>
                            </div>
                            <ArrowDropUpIcon style={{color:"#55bd84",marginTop: "23px"}}/>                        
                        </div>
                        <div style={{display: "flex",  width: "100%"}}>
                            <div style={{width: "100%"}}>
                                <div className="row-zyx" style={{ paddingTop: "30px" }}>
                                    <div style={{ width: "50%" }}>{dataSummary.minvgtickethour}</div>
                                    <div style={{ width: "50%", textAlign: "end" }}>{dataSummary.minavgtickethourdescdate}</div>
                                </div>
                                <div className="row-zyx" style={{ paddingTop: "0" }}>
                                    <div style={{ width: "50%" }}>{t(langKeys.lowestvalue)}</div>
                                    <div style={{ width: "50%", textAlign: "end" }}>{dataSummary.minavgtickethourdeschour}</div>
                                </div>
                            </div>
                            <ArrowDropDownIcon style={{color:"#fb5f5f",marginTop: "43px"}}/>                        
                        </div>
                    </Box>)}
                    { (resaux.loading && fieldToFilter==="averageconversationsattendedbytheadvisorbyhour")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        style={{ backgroundColor: "white", padding: "10px", flex: 1.91 }}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={()=>downloaddata("averageconversationsattendedbytheadvisorbyhour")} className={classes.styleicon}/>
                            <SettingsIcon onClick={()=>{setFieldToFilter("averageconversationsattendedbytheadvisorbyhour"); setOpenDialogPerRequest(true)}} className={classes.styleicon}/>
                        </div>
                        <div className={classes.boxtitlequarter}>{dataSummary.avgticketasesorhour}</div>
                        <div className={classes.boxtitlequarter}>{t(langKeys.averageconversationsattendedbytheadvisorbyhour)}</div>
                        <div style={{display: "flex",  width: "100%"}}>
                            <div style={{width: "100%"}}>
                                <div className="row-zyx" style={{ paddingTop: "10px" }}>
                                    <div style={{ width: "50%" }}>{dataSummary.maxavgticketasesorhour}</div>
                                    <div style={{ width: "50%", textAlign: "end" }}>{dataSummary.maxavgticketasesorhourdescdate}</div>
                                </div>
                                <div className="row-zyx" style={{ paddingTop: "0" }}>
                                    <div style={{ width: "50%" }}>{t(langKeys.highestvalue)}</div>
                                    <div style={{ width: "50%", textAlign: "end" }}>{dataSummary.maxavgticketasesorhourdeschour}</div>
                                </div>
                            </div>
                            <ArrowDropUpIcon style={{color:"#55bd84",marginTop: "23px"}}/>                        
                        </div>
                        <div style={{display: "flex",  width: "100%"}}>
                            <div style={{width: "100%"}}>
                                <div className="row-zyx" style={{ paddingTop: "30px" }}>
                                    <div style={{ width: "50%" }}>{dataSummary.minvgtickethour}</div>
                                    <div style={{ width: "50%", textAlign: "end" }}>{dataSummary.minavgticketasesorhourdescdate}</div>
                                </div>
                                <div className="row-zyx" style={{ paddingTop: "0" }}>
                                    <div style={{ width: "50%" }}>{t(langKeys.lowestvalue)}</div>
                                    <div style={{ width: "50%", textAlign: "end" }}>{dataSummary.minavgticketasesorhourdeschour}</div>
                                </div>
                            </div>
                            <ArrowDropDownIcon style={{color:"#fb5f5f",marginTop: "43px"}}/>                        
                        </div>
                    </Box>)}
                    <Box
                        style={{ backgroundColor: "white", padding: "10px", flex: 4 }}
                    >
                        <div className={classes.containertitleboxes}>
                            <div style={{ fontWeight: "bold", fontSize: "1.6em"}}>{dataAsesoreconectadosbar.avgasesoresconectados}</div>
                            <CloudDownloadIcon onClick={()=>downloaddata("asesoresconectados")} className={classes.styleicon}/>
                        </div>
                        <div className={classes.boxtitlequarter}>{t(langKeys.averagenumberofadvisersconnectedbyhour)}</div>
                        <div style={{ paddingTop: "20px" }}>
                            <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                                <LineChart data={resAsesoreconectadosbar}>
                                    <Line type="monotone" dataKey="asesoresconectados" stroke="#8884d8" />
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey="hora" />
                                    <YAxis />
                                    <Tooltip />
                                </LineChart>
                            </ResponsiveContainer>

                        </div>

                    </Box>
                </div>
                <div className={classes.replacerowzyx}>
                    <Box
                        style={{ backgroundColor: "white", padding: "10px", flex: 1.91 }}
                    >
                        <div className={classes.downloadiconcontainer}><CloudDownloadIcon onClick={()=>downloaddata("averageconversations")} className={classes.styleicon}/></div>
                        <div className={classes.boxtitlequarter}>{dataDASHBOARD.avgconversationsattended}</div>
                        <div className={classes.boxtitlequarter}>{t(langKeys.conversationsattended)}</div>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                            <div>
                                <div className="row-zyx" style={{ paddingTop: "10px", margin: 0 }}>{dataDASHBOARD.maxavgconversationsattendedasesor} </div>
                                <div className="row-zyx" style={{ paddingTop: "0" }}>{t(langKeys.attendedbyasesor)}</div>
                            </div>
                            {
                                dataDASHBOARD.iconconversationsattendedasesor?
                                    <ArrowDropUpIcon style={{color:"#55bd84",marginTop: "23px"}}/>:<ArrowDropDownIcon style={{color:"#fb5f5f",marginTop: "23px"}}/>

                            }
                        </div>
                        
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                            <div>
                                <div className="row-zyx" style={{ paddingTop: "30px", margin: 0 }}>{dataDASHBOARD.minvgconversationsattendedbot} </div>
                                <div className="row-zyx" style={{ paddingTop: "0" }}>{t(langKeys.attendedbybot)}</div>
                            </div>
                            {
                                dataDASHBOARD.iconconversationsattendedbot?
                                    <ArrowDropUpIcon style={{color:"#55bd84",marginTop: "23px"}}/>:<ArrowDropDownIcon style={{color:"#fb5f5f",marginTop: "23px"}}/>

                            }
                        </div>
                    </Box>
                    <Box
                        style={{ backgroundColor: "white", padding: "10px", flex: 1.91 }}
                    >
                        <div className={classes.downloadiconcontainer}><CloudDownloadIcon onClick={()=>downloaddata("interaction")} className={classes.styleicon}/></div>
                        <div className={classes.boxtitlequarter}>{dataInteraction.avginteractionsxconversations}</div>
                        <div className={classes.boxtitlequarter}>{t(langKeys.averageinteractionbyconversation)}</div>
                        <div className="row-zyx" style={{ paddingTop: "10px", margin: 0 }}>{dataInteraction.maxavginteractionsxconversations} </div>
                        <div className="row-zyx" style={{ paddingTop: "0" }}>{t(langKeys.agent)}</div>
                        <div className="row-zyx" style={{ paddingTop: "30px", margin: 0 }}>{dataInteraction.minvginteractionsxconversations} </div>
                        <div className="row-zyx" style={{ paddingTop: "0" }}>Bot</div>
                    </Box>
                    { (resaux.loading && fieldToFilter==="etiqueta")?(<Box  className={classes.itemCard} style={{display: "flex", alignItems: 'center', justifyContent: "center"}}><CircularProgress/> </Box>):
                    (<Box
                        style={{ backgroundColor: "white", padding: "10px", flex: 4 }}
                    >
                        <div className={classes.containertitleboxes}>
                            <div style={{ fontWeight: "bold", fontSize: "1.6em"}}>{t(langKeys.top5labels)}</div>
                            <CloudDownloadIcon onClick={()=>downloaddata("etiqueta")} className={classes.styleicon}/>
                            <SettingsIcon onClick={()=>{setFieldToFilter("etiqueta"); setOpenDialogPerRequest(true)}} className={classes.styleicon}/>                            
                        </div>
                        <div style={{ paddingTop: "20px" }}>
                            <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                                <BarChart data={resLabels}>
                                    <XAxis dataKey="label" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="quantity" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    </Box>)}
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardManagerial;