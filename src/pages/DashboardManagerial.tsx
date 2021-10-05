import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { DateRangePicker, DialogZyx, FieldMultiSelect, FieldSelect } from "components";
import { useSelector } from "hooks";
import { CalendarIcon } from "icons";
import { langKeys } from "lang/keys";
import { FC, Fragment, useEffect, useState } from "react";
import { getCollection, resetMain, getMultiCollection, execute, getMultiCollectionAux } from 'store/main/actions';
import { Range } from 'react-date-range';
import clsx from 'clsx';
import { useTranslation } from "react-i18next";
import { gerencialasesoresconectadosbarsel, gerencialconversationsel, gerencialencuestasel, gerencialetiquetassel, gerencialinteractionsel, gerencialsummarysel, gerencialTMEsel, gerencialTMOsel, getCommChannelLst, getValuesFromDomain } from "common/helpers";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

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
function formatNumber(num:any) {
    if (num)
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0"
}
function formattime(cc:any){
    if (!cc)
        return "0";
    let hh = Math.floor(cc/3600)>0 ? `${Math.floor(cc/3600)}h `: ""
    let mm = Math.floor((cc%3600)/60) > 0 ? `${Math.floor((cc%3600)/60)}m `: ""
    let ss = `${cc%60}s`
    return `${hh}${mm}${ss}`
}

function timetoseconds(cc:any) {
    if (!cc)
        return 0;
    const times = cc.split(":");
    
    const hour = parseInt(times[0]);
    const minutes = parseInt(times[1]);
    const seconds = times[2] ? parseInt(times[2]) : 0;
    return (hour * 60 * 60) + (minutes * 60) + seconds;
}
function timetomin(cc:any) {
    if (!cc)
        return 0;
    const times = cc.split(":");
    const hour = parseInt(times[0]);
    const minutes = parseInt(times[1]);
    const seconds = parseInt(times[2]);
    return hour * 60 + minutes + (seconds >= 30 ? 1 : 0);
}
function formatname(cc:any) {
    let newname = cc.toLowerCase();
    let names = newname.split(" ");
    for (let i = 0; i < names.length; i++) {
        names[i] = (names[i] ? names[i][0].toUpperCase(): "") + names[i].substr(1);
    }
    return names.join(" ")
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        halfbox: {
            width: "49%",
            margin: "0 1% 2% 0",
            backgroundColor: 'white',
        },
        quarterbox: {
            width: "24%",
            margin: "0 1% 2% 0",
            backgroundColor: 'white',
            padding: "15px"
        },
        boxtitle:{
            fontWeight: "bold",
            fontSize: "1.6em",
            paddingTop: "15px",
            width: "50%"
        },
        boxtitledata:{
            fontSize: "1.6em",
            width: "50%",
            paddingTop: "15px",
            textAlign: "end"
        },
        boxtitlequarter:{
            fontWeight: "bold",
            fontSize: "1.5em",
        },
        maintitle:{
            fontWeight: "bold",
            fontSize: "2em",
            padding: "0 0 20px;"
        },
        rowstyles:{
            margin:"0!important"
        },
        containerFields:{
            margin: "0!important",
            display: "flex",
            width: "100%",
            padding: "0 20px 10px 20px"
        },
        containerFieldsTitle:{
            margin: "0!important",
            display: "flex",
            width: "100%",
            padding: "0 20px 30px 20px"
        },
        containerFieldsQuarter:{
            margin: "0!important",
            display: "flex",
            width: "100%",
            color: "white"
        },
        label:{
            width: "60%",
            fontSize: "1.2em",
        },
        datafield:{
            fontSize: "1.2em",
            width: "40%",
            textAlign: "end"
        },
        datafieldquarter:{
            fontSize: "1.2em",
            padding: "5px"
        },
        widthhalf:{
            width: "50%"
        },
        widthsecondhalf:{
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
        fieldsfilter:{
            width: "100%",
        },
        colorgreen: {
            color: "#22B66E"
        },
        colorred: {
            color: "rgb(180, 26, 26)"
        },
    }),
);
const initialRange = {
    startDate: new Date(new Date().setDate(0)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}
const format = (date: Date) => date.toISOString().split('T')[0];

const DashboardManagerial: FC = () => {
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const remultiaux = useSelector(state => state.main.multiDataAux);
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
        tmrglobal:  "0m",
        dataTMRBot:  "0m",
        dataTMRAsesor:  "0m",
        dataTMRCliente:  "0m",
        maxavgtickethour:  "0",
        minvgtickethour:  "0",
        avgtickethour:  "0",
        maxavgtickethourdescdate:  "",
        maxavgtickethourdeschour:  "",
        minavgtickethourdescdate:  "",
        minavgtickethourdeschour:  "",
        maxavgticketasesorhour:  "0",
        minvgticketasesorhour:  "0",
        avgticketasesorhour:  "0",
        maxavgticketasesorhourdescdate:  "",
        maxavgticketasesorhourdeschour:  "",
        minavgticketasesorhourdescdate:  "",
        minavgticketasesorhourdeschour:  "",
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
        avgconversationsattended:  "0%",
        maxavgconversationsattendedasesor:  "0%",
        minvgconversationsattendedbot:  "0%",
    });
    const [dataInteraction, setDataInteraction] = useState({
        avginteractionsxconversations: "0",
        maxavginteractionsxconversations: "0",
        minvginteractionsxconversations: "0",
    });
    const [dataAsesoreconectadosbar, setDataAsesoreconectadosbar] = useState({
        avgasesoresconectados: "0",
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [resTMO, setResTMO] = useState<any>([]);
    const [resTME, setResTME] = useState<any>([]);
    const [resSummary, setResSummary] = useState<any>([]);
    const [resEncuesta, setResEncuesta] = useState<any>([]);
    const [resDashboard, setResDashboard] = useState<any>([]);
    const [resInteraction, setResInteraction] = useState<any>([]);
    const [resEtiquetas, setResEtiquetas] = useState<any>([]);
    const [resAsesoreconectadosbar, setResAsesoreconectadosbar] = useState<any>([]);
    const [resAsesoreconectados, setResAsesoreconectados] = useState([
        {hora: 0, asesoresconectados: "0"},
        {hora: 1, asesoresconectados: "0"},
        {hora: 2, asesoresconectados: "0"},
        {hora: 3, asesoresconectados: "0"},
        {hora: 4, asesoresconectados: "0"},
        {hora: 5, asesoresconectados: "0"},
        {hora: 6, asesoresconectados: "0"},
        {hora: 7, asesoresconectados: "0"},
        {hora: 8, asesoresconectados: "0"},
        {hora: 9, asesoresconectados: "0"},
        {hora: 10, asesoresconectados: "0"},
        {hora: 11, asesoresconectados: "0"},
        {hora: 12, asesoresconectados: "0"},
        {hora: 13, asesoresconectados: "0"},
        {hora: 14, asesoresconectados: "0"},
        {hora: 15, asesoresconectados: "0"},
        {hora: 16, asesoresconectados: "0"},
        {hora: 17, asesoresconectados: "0"},
        {hora: 18, asesoresconectados: "0"},
        {hora: 19, asesoresconectados: "0"},
        {hora: 20, asesoresconectados: "0"},
        {hora: 21, asesoresconectados: "0"},
        {hora: 22, asesoresconectados: "0"},
        {hora: 23, asesoresconectados: "0"},
    ]);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [dataqueue, setdataqueue] = useState<any>([]);
    const [dataprovider, setdataprovider] = useState<any>([]);
    const [datachannels, setdatachannels] = useState<any>([]);
    const [waitSave, setWaitSave] = useState(false);
    const [searchfields, setsearchfields] = useState({
        queue: "",
        provider: "",
        channels: ""
    });
    useEffect(() => {
        if(mainResult.multiData.data.length !== 0){
            let multiData = mainResult.multiData.data;
            setdataqueue(multiData[0] && multiData[0].success ? multiData[0].data : []);
            setdataprovider(multiData[1] && multiData[1].success ? multiData[1].data : []);
            setdatachannels(multiData[2] && multiData[2].success ? multiData[2].data : []);
        }
    }, [mainResult])
    useEffect(() => {
        if(resTMO.length){
            const { time_avg, tickets_comply, tickets_total, target_max, target_min, time_max, time_min,tickets_analyzed,target_percmax,closedby,slaid } = resTMO[0];
            const promtt = tickets_total ? (tickets_comply * 100 / tickets_total) : 0;
            let seconds= timetoseconds(time_avg)
            if (seconds >= 0) {
                let variacionperc = tickets_comply/tickets_analyzed - parseFloat(target_percmax)
                let hh = (Math.floor(seconds/3600)) == 0 ? "" : (Math.floor(seconds/3600) + "h ")
                let mm = Math.floor((seconds%3600)/60) == 0 ? "" : (Math.floor((seconds%3600)/60) + "m ")
                let ss = seconds%60 + "s"
                let objetivo_max = timetomin(target_max)
                let dataTMO=`${hh}${mm}${ss}`
                setData(p=>({...p,dataTMO:dataTMO}))
                setData(p=>({...p,obj_max:`< ${objetivo_max}m `}))

                let vartmo = timetoseconds(target_max)-seconds
                vartmo = seconds < timetoseconds(target_min)?  Math.abs(vartmo)*-1:vartmo
                let sign = vartmo>0 ? "" : "-"
                vartmo = Math.abs(vartmo)
                let variacioncolor = vartmo <= 0;

                hh = (Math.floor(vartmo/3600)) == 0 ? "" : (Math.floor(vartmo/3600) + "h ")
                mm = Math.floor((vartmo%3600)/60) == 0 ? "" : (Math.floor((vartmo%3600)/60) + "m ")
                ss = vartmo%60 + "s"
                let variaciontxt = `${sign}${hh}${mm}${ss}`
                setData(p=>({...p,variaciontxt:variaciontxt}))
                setData(p=>({...p,variacioncolor:variacioncolor}))

                let secondsmax= timetoseconds(time_max)
                hh = (Math.floor(secondsmax/3600)) == 0 ? "" : (Math.floor(secondsmax/3600) + "h ")
                mm = Math.floor((secondsmax%3600)/60) == 0 ? "" : (Math.floor((secondsmax%3600)/60) + "m ")
                ss = secondsmax%60 + "s"
                let timeMax= `${hh}${mm}${ss}`
                setData(p=>({...p,timeMax:timeMax}))

                let secondsmin= timetoseconds(time_min)
                hh = (Math.floor(secondsmin/3600)) == 0 ? "" : (Math.floor(secondsmin/3600) + "h ")
                mm = Math.floor((secondsmin%3600)/60) == 0 ? "" : (Math.floor((secondsmin%3600)/60) + "m ")
                ss = secondsmin%60 + "s"
                let timeMin= `${hh}${mm}${ss}`
                setData(p=>({...p,timeMin:timeMin}))

                setData(p=>({...p,sla:`${(parseFloat(target_percmax)*100).toFixed(2)}%`}))
                
                let variacionperccolor = variacionperc >= 0;
                setData(p=>({...p,variacionperc:variacionperc}))
                setData(p=>({...p,variacionperccolor: variacionperccolor}))
                setData(p=>({...p,tickets_comply: tickets_comply}))
                setData(p=>({...p,tickets_analyzed: tickets_analyzed}))
                setData(p=>({...p,tickets_total: tickets_total}))

                
            }
        }
    }, [resTMO])
    useEffect(() => {
        if(resTME.length){
            const { time_avg, tickets_comply, tickets_total, target_max, target_min, time_max, time_min,tickets_analyzed,target_percmax,closedby,slaid } = resTME[0];
            const promtt = tickets_total ? (tickets_comply * 100 / tickets_total) : 0;
            let seconds= timetoseconds(time_avg)
            if (seconds >= 0) {
                let variacionperc = tickets_comply/tickets_analyzed - parseFloat(target_percmax)
                let hh = (Math.floor(seconds/3600)) == 0 ? "" : (Math.floor(seconds/3600) + "h ")
                let mm = Math.floor((seconds%3600)/60) == 0 ? "" : (Math.floor((seconds%3600)/60) + "m ")
                let ss = seconds%60 + "s"
                let objetivo_max = timetomin(target_max)
                let dataTMO=`${hh}${mm}${ss}`
                setDataTME(p=>({...p,dataTME:dataTMO}))
                setDataTME(p=>({...p,obj_max:`< ${objetivo_max}m `}))

                let vartmo = timetoseconds(target_max)-seconds
                vartmo = seconds < timetoseconds(target_min)?  Math.abs(vartmo)*-1:vartmo
                let sign = vartmo>0 ? "" : "-"
                vartmo = Math.abs(vartmo)
                let variacioncolor = vartmo <= 0;

                hh = (Math.floor(vartmo/3600)) == 0 ? "" : (Math.floor(vartmo/3600) + "h ")
                mm = Math.floor((vartmo%3600)/60) == 0 ? "" : (Math.floor((vartmo%3600)/60) + "m ")
                ss = vartmo%60 + "s"
                let variaciontxt = `${sign}${hh}${mm}${ss}`
                setDataTME(p=>({...p,variaciontxt:variaciontxt}))
                setDataTME(p=>({...p,variacioncolor:variacioncolor}))

                let secondsmax= timetoseconds(time_max)
                hh = (Math.floor(secondsmax/3600)) == 0 ? "" : (Math.floor(secondsmax/3600) + "h ")
                mm = Math.floor((secondsmax%3600)/60) == 0 ? "" : (Math.floor((secondsmax%3600)/60) + "m ")
                ss = secondsmax%60 + "s"
                let timeMax= `${hh}${mm}${ss}`
                setDataTME(p=>({...p,timeMax:timeMax}))

                let secondsmin= timetoseconds(time_min)
                hh = (Math.floor(secondsmin/3600)) == 0 ? "" : (Math.floor(secondsmin/3600) + "h ")
                mm = Math.floor((secondsmin%3600)/60) == 0 ? "" : (Math.floor((secondsmin%3600)/60) + "m ")
                ss = secondsmin%60 + "s"
                let timeMin= `${hh}${mm}${ss}`
                setDataTME(p=>({...p,timeMin:timeMin}))

                setDataTME(p=>({...p,sla:`${(parseFloat(target_percmax)*100).toFixed(2)}%`}))
                
                let variacionperccolor = variacionperc >= 0;
                setDataTME(p=>({...p,variacionperc:variacionperc}))
                setDataTME(p=>({...p,variacionperccolor: variacionperccolor}))
                setDataTME(p=>({...p,tickets_comply: tickets_comply}))
                setDataTME(p=>({...p,tickets_analyzed: tickets_analyzed}))
                setDataTME(p=>({...p,tickets_total: tickets_total}))

                
            }
        }
    }, [resTME])
    useEffect(() => {
        setDataSummary({
            tmrglobal:  "0m",
            dataTMRBot:  "0m",
            dataTMRAsesor:  "0m",
            dataTMRCliente:  "0m",
            maxavgtickethour:  "0",
            minvgtickethour:  "0",
            avgtickethour:  "0",
            maxavgtickethourdescdate:  "",
            maxavgtickethourdeschour:  "",
            minavgtickethourdescdate:  "",
            minavgtickethourdeschour:  "",
            maxavgticketasesorhour:  "0",
            minvgticketasesorhour:  "0",
            avgticketasesorhour:  "0",
            maxavgticketasesorhourdescdate:  "",
            maxavgticketasesorhourdeschour:  "",
            minavgticketasesorhourdescdate:  "",
            minavgticketasesorhourdeschour:  "",
        })
        if(resSummary.length){
            if (resSummary[0] && resSummary[0].ticketstotal != 0) {
                const attendedconversations = (resSummary[0].ticketscerrados / resSummary[0].ticketstotal) * 100;
                let txtmaxavgticketusername = formatname(resSummary[0].maxavgticketusername)
                let txtminavgticketusername = formatname(resSummary[0].minavgticketusername)
                let txtmaxavgticketasesorusername = formatname(resSummary[0].maxavgticketasesorusername)
                let txtminavgticketasesorusername = formatname(resSummary[0].minavgticketasesorusername)
                const mm = resSummary[0].maxavgtickethourdesc ? resSummary[0].maxavgtickethourdesc.split(" ") : null;
                const mm1 = resSummary[0].minavgtickethourdesc ? resSummary[0].minavgtickethourdesc.split(" ") : null;
                const mm2 = resSummary[0].maxavgticketasesorhourdesc ? resSummary[0].maxavgticketasesorhourdesc.split(" ") : null;
                const mm3 = resSummary[0].minavgticketasesorhourdesc ? resSummary[0].minavgticketasesorhourdesc.split(" ") : null;
                setDataSummary({
                    tmrglobal:  formattime(timetoseconds(resSummary[0].averagereplytime) + timetoseconds(resSummary[0].useraveragereplytime) / 2),
                    dataTMRBot:  formattime(timetoseconds(resSummary[0].averagereplytime)),
                    dataTMRAsesor:  formattime(timetoseconds(resSummary[0].useraveragereplytime)),
                    dataTMRCliente:  formattime(timetoseconds(resSummary[0].personaveragereplytime)),
                    maxavgtickethour:  `${resSummary[0].maxavgtickethour}(${txtmaxavgticketusername})`,
                    minvgtickethour:  `${resSummary[0].minavgtickethour} (${txtminavgticketusername})`,
                    avgtickethour:  resSummary[0].avgtickethour,
                    maxavgtickethourdescdate:  mm ? mm[0] + " " + arraymonth[parseInt(mm[1]) - 1] : "",
                    maxavgtickethourdeschour:  mm ? mm[2] + " " + mm[3].toLowerCase() : "",
                    minavgtickethourdescdate:  mm1 ? mm1[0] + " " + arraymonth[parseInt(mm1[1]) - 1] : "",
                    minavgtickethourdeschour:  mm1 ? mm1[2] + " " + mm1[3].toLowerCase() : "",
                    maxavgticketasesorhour:  `${resSummary[0].maxavgticketasesorhour} (${txtmaxavgticketasesorusername})`,
                    minvgticketasesorhour:  `${resSummary[0].minavgticketasesorhour} (${txtminavgticketasesorusername})`,
                    avgticketasesorhour:  resSummary[0].avgticketasesorhour,
                    maxavgticketasesorhourdescdate:  mm2 ? mm2[0] + " " + arraymonth[parseInt(mm2[1]) - 1] : "",
                    maxavgticketasesorhourdeschour:  mm2 ? mm2[2] + " " + mm2[3].toLowerCase() : "",
                    minavgticketasesorhourdescdate:  mm3 ? mm3[0] + " " + arraymonth[parseInt(mm3[1]) - 1] : "",
                    minavgticketasesorhourdeschour:  mm3 ? mm3[2] + " " + mm3[3].toLowerCase() : "",
                })
            }
        }            
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
        if(resEncuesta.length){
            const { nps_high, total, nps_low, nps_green,nps_medium,nps_total } = resEncuesta[0]
            const { csat_high, csat_low, csat_green,csat_medium,csat_total } = resEncuesta[0];
            const { fcr_yes, fcr_no, fcr_green,fcr_total, total_bot } = resEncuesta[0];
            const { fix_yes, fix_no, fix_green,fix_total } = resEncuesta[0];
            const toshow = nps_total ? ((nps_high - nps_low) / nps_total) : 0;
            const toshowcsat = csat_total ? ((csat_high - csat_low) / csat_total) : 0;
            const toshowfcr = fcr_total ? ((fcr_yes - fcr_no) / fcr_total) : 0;
            const toshowfix = fix_total ? ((fix_yes - fix_no) / fix_total) : 0;
            let variacioncolor = (toshow-nps_green)*100 >= 0
            setDataEncuesta({
                dataNPS: `${((toshow)*100).toFixed(2)}%`,
                npsvariacioncolor: variacioncolor,
                nps_green: `${(parseFloat(nps_green)*100).toFixed(2)}%`,
                npsvariation: `${((toshow-nps_green)*100).toFixed(2)}%`,
                npspollssent: `${formatNumber(total)}`,
                npspollsanswered: `${formatNumber(nps_total)}`,
                npstotalpromoters: nps_high,
                npstotaldetractors: nps_low,
                npstotalneutral: nps_medium,
                npstotalconversations: total,
                dataCSAT: `${((toshowcsat)*100).toFixed(2)}%`,
                csatvariacioncolor: (toshowcsat-nps_green)*100 >= 0,
                csat_green:`${(parseFloat(csat_green)*100).toFixed(2)}%`,
                csatvariation:`${((toshowcsat-csat_green)*100).toFixed(2)}%`,
                csatpollssent:`${formatNumber(total)}`,
                csatpollsanswered:`${formatNumber(csat_total)}`,
                csattotalpromoters:csat_high,
                csattotaldetractors:csat_low,
                csattotalneutral:csat_medium,
                csattotalconversations:total,
                dataFCR: `${((toshowfcr)*100).toFixed(2)}%`,
                fcrvariacioncolor: (toshowfcr-nps_green)*100 >= 0,
                fcr_green:`${(parseFloat(fcr_green)*100).toFixed(2)}%`,
                fcrvariation:`${((toshowfcr-fcr_green)*100).toFixed(2)}%`,
                fcrpollssent:`${formatNumber(total)}`,
                fcrpollsanswered:`${formatNumber(fcr_total)}`,
                fcrtotalpromoters:fcr_yes,
                fcrtotaldetractors:fcr_no,
                fcrtotalconversations:total_bot,
                dataFIX: `${((toshowfcr)*100).toFixed(2)}%`,
                fixvariacioncolor: (toshowfix-nps_green)*100 >= 0,
                fix_green:`${(parseFloat(fix_green)*100).toFixed(2)}%`,
                fixvariation:`${((toshowfix-fix_green)*100).toFixed(2)}%`,
                fixpollssent:`${formatNumber(total)}`,
                fixpollsanswered:`${formatNumber(fix_total)}`,
                fixtotalpromoters:fix_yes,
                fixtotaldetractors:fix_no,
                fixtotalconversations:total,
            })

        }
    }, [resEncuesta]);
    useEffect(() => {
        setDataDASHBOARD({
            avgconversationsattended:  "0%",
            maxavgconversationsattendedasesor:  "0%",
            minvgconversationsattendedbot:  "0%",
        })
        if(resDashboard.length){
            const { avgparam, ticketscerrados, ticketstotal, ticketscerradosasesor, ticketscerradosbot } = resDashboard[0];
            setDataDASHBOARD({
                avgconversationsattended:  ((ticketscerrados * 100) / ticketstotal).toFixed() + "%",
                maxavgconversationsattendedasesor:  ((ticketscerradosasesor * 100) / ticketstotal).toFixed() + "%",
                minvgconversationsattendedbot:  ((ticketscerradosbot * 100) / ticketstotal).toFixed() + "%",
            })

        }
    }, [resDashboard]);
    useEffect(() => {
        setDataInteraction({
            avginteractionsxconversations: "0",
            maxavginteractionsxconversations: "0",
            minvginteractionsxconversations: "0",
        })
        if(resInteraction.length){
            const { avginteracciones, avginteraccionesasesor, avginteracionesbot }  = resInteraction[0];
            setDataInteraction({
                avginteractionsxconversations:  avginteracciones,
                maxavginteractionsxconversations:  avginteraccionesasesor,
                minvginteractionsxconversations:  avginteracionesbot,
            })

        }
    }, [resInteraction]);
    useEffect(() => {
        setDataAsesoreconectadosbar({
            avgasesoresconectados: "0"
        })
        if (resAsesoreconectadosbar && resAsesoreconectadosbar.length > 0) {
            setDataAsesoreconectadosbar({
                avgasesoresconectados: resAsesoreconectadosbar[0].avgasesoresconectados
            })
            resAsesoreconectadosbar.forEach((x:any)=>{
                setResAsesoreconectados((p)=>[...p])
            })
        }
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
                setResEtiquetas(remultiaux.data[6].data)
                setResAsesoreconectadosbar(remultiaux.data[7].data)
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (remultiaux.error) {
                const errormessage = t(remultiaux.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [remultiaux, waitSave])
    async function funcsearch(){
        dispatch(showBackdrop(true));
        setOpenDialog(false)
        dispatch(getMultiCollectionAux([
            gerencialTMOsel({startdate:initialRange.startDate, enddate: initialRange.endDate,channel:searchfields.channels,group:searchfields.queue, company: searchfields.provider}),
            gerencialTMEsel({startdate:initialRange.startDate, enddate: initialRange.endDate,channel:searchfields.channels,group:searchfields.queue, company: searchfields.provider}),
            gerencialsummarysel({startdate:initialRange.startDate, enddate: initialRange.endDate,channel:searchfields.channels,group:searchfields.queue, company: searchfields.provider}),
            gerencialencuestasel({startdate:initialRange.startDate, enddate: initialRange.endDate,channel:searchfields.channels,group:searchfields.queue, company: searchfields.provider}),
            gerencialconversationsel({startdate:initialRange.startDate, enddate: initialRange.endDate,channel:searchfields.channels,group:searchfields.queue, company: searchfields.provider}),
            gerencialinteractionsel({startdate:initialRange.startDate, enddate: initialRange.endDate,channel:searchfields.channels,group:searchfields.queue, company: searchfields.provider}),
            gerencialetiquetassel({startdate:initialRange.startDate, enddate: initialRange.endDate,channel:searchfields.channels,group:searchfields.queue, company: searchfields.provider}),
            gerencialasesoresconectadosbarsel({startdate:initialRange.startDate, enddate: initialRange.endDate,channel:searchfields.channels,group:searchfields.queue, company: searchfields.provider}),
        ]))
        setWaitSave(true)
    }
    

    useEffect(() => {
        dispatch(getMultiCollection([
            getValuesFromDomain("GRUPOS"),
            getValuesFromDomain("EMPRESA"),
            getCommChannelLst()
        ]));
        funcsearch()
        return () => {
            dispatch(resetMain());
        };
    }, []);
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
                <div className="row-zyx" style={{ marginTop: "15px"}}>
                    <FieldMultiSelect
                        label={t(langKeys.queue)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => {setsearchfields(p=>({...p, queue:value.map((o: Dictionary) => o.domainvalue).join()}))}}
                        valueDefault={searchfields.queue}
                        data={dataqueue}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div className="row-zyx" style={{ marginTop: "15px"}}>
                    <FieldSelect
                        label={t(langKeys.provider)}
                        className={classes.fieldsfilter}
                        onChange={(value) => {setsearchfields((p)=>({...p, provider:value.domainvalue}))}}
                        valueDefault={searchfields.provider}
                        data={dataprovider}
                        optionDesc="domaindesc"
                        variant="outlined"
                        optionValue="domainvalue"
                    />  
                </div>
                <div className="row-zyx" style={{ marginTop: "15px"}}>
                    <FieldMultiSelect
                        label={t(langKeys.channel_plural)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => {setsearchfields((p)=>({...p, channels:value.map((o: Dictionary) => o.communicationchannelid).join()}))}}
                        valueDefault={searchfields.channels}
                        data={datachannels}
                        optionDesc="communicationchanneldesc"
                        optionValue="communicationchannelid"
                    />
                </div>

            </DialogZyx>
            <div className={classes.maintitle}> {t(langKeys.managerial)}</div>
            <div className="row-zyx " style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                    className="col-4"
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: "#007bff" }}
                    onClick={() => setOpenDialog(true)}
                >{t(langKeys.stablishfilters)}
                </Button>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
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
                        <div className={classes.widthsecondhalf}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>{data.sla}</div>
                            </div>
                            <div className={clsx(classes.containerFields, data.variacionperccolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{data.variacionperc}%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>{data.tickets_comply}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>{data.tickets_analyzed-data.tickets_comply}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>{data.tickets_total}</div>
                            </div>
                        </div>
                    </div>
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
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
                        <div className={classes.widthsecondhalf}>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.sla)}</div>
                                <div className={classes.datafield}>{dataTME.sla}</div>
                            </div>
                            <div className={clsx(classes.containerFields, dataTME.variacionperccolor ? classes.colorgreen : classes.colorred)}>
                                <div className={classes.label}>{t(langKeys.variation)}</div>
                                <div className={classes.datafield}>{dataTME.variacionperc}%</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeets)}</div>
                                <div className={classes.datafield}>{dataTME.tickets_comply}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.quantitymeetsnot)}</div>
                                <div className={classes.datafield}>{dataTME.tickets_analyzed-dataTME.tickets_comply}</div>
                            </div>
                            <div className={classes.containerFields}>
                                <div className={classes.label}>{t(langKeys.totalconversation)}</div>
                                <div className={classes.datafield}>{dataTME.tickets_total}</div>
                            </div>
                        </div>
                    </div>
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.quarterbox}
                    style={{backgroundColor:"#53a6fa"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>TMR</div>
                        <div className={classes.boxtitledata}>{dataSummary.tmrglobal}</div>    
                    </div>            
                </Box>
                <Box
                    className={classes.quarterbox}
                    style={{backgroundColor:"#22b66e"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>TMR Asesor</div>
                        <div className={classes.boxtitledata}>{dataSummary.dataTMRAsesor}</div>    
                    </div>                  
                </Box>
                <Box
                    className={classes.quarterbox}
                    style={{backgroundColor:"#fdab29"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>TMR Bot</div>
                        <div className={classes.boxtitledata}>{dataSummary.dataTMRBot}</div>    
                    </div>                  
                </Box>
                <Box
                    className={classes.quarterbox}
                    style={{backgroundColor:"#907eec"}}
                >
                    <div className={classes.containerFieldsQuarter}>
                        <div className={classes.boxtitle}>TMR Client</div>
                        <div className={classes.boxtitledata}>{dataSummary.dataTMRCliente}</div>    
                    </div>                  
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
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
                        <div className={classes.widthsecondhalf}>
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
                    </div>
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
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
                        <div className={classes.widthsecondhalf}>
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
                    </div>
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
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
                        <div className={classes.widthsecondhalf}>
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
                    </div>
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={"row-zyx  " + classes.rowstyles}>
                        <div className={classes.widthhalf}>
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
                        <div className={classes.widthsecondhalf}>
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
                    </div>
                </Box>
            </div>
            <div className="row-zyx ">
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>{dataSummary.avgtickethour}</div>
                    <div className={classes.boxtitlequarter}>Average conversations attended by hour</div>
                    <div className="row-zyx" style={{paddingTop:"10px"}}>
                        <div style={{width:"50%"}}>{dataSummary.maxavgtickethour}</div>
                        <div style={{width:"50%",textAlign: "end"}}>{dataSummary.maxavgtickethourdescdate}</div>
                    </div>              
                    <div className="row-zyx" style={{paddingTop:"0"}}>
                        <div style={{width:"50%"}}>{t(langKeys.highestvalue)}</div>
                        <div style={{width:"50%",textAlign: "end"}}>{dataSummary.maxavgtickethourdeschour}</div>
                    </div>              
                    <div className="row-zyx" style={{paddingTop:"30px"}}>
                        <div style={{width:"50%"}}>{dataSummary.minvgtickethour}</div>
                        <div style={{width:"50%",textAlign: "end"}}>{dataSummary.minavgtickethourdescdate}</div>
                    </div>              
                    <div className="row-zyx" style={{paddingTop:"0"}}>
                        <div style={{width:"50%"}}>{t(langKeys.lowestvalue)}</div>
                        <div style={{width:"50%",textAlign: "end"}}>{dataSummary.minavgtickethourdeschour}</div>
                    </div>              
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>{dataSummary.avgticketasesorhour}</div>
                    <div className={classes.boxtitlequarter}>Average conversations attended by the advisor by hour</div>
                    <div className="row-zyx" style={{paddingTop:"10px"}}>
                        <div style={{width:"50%"}}>{dataSummary.maxavgticketasesorhour}</div>
                        <div style={{width:"50%",textAlign: "end"}}>{dataSummary.maxavgticketasesorhourdescdate}</div>
                    </div>              
                    <div className="row-zyx" style={{paddingTop:"0"}}>
                        <div style={{width:"50%"}}>{t(langKeys.highestvalue)}</div>
                        <div style={{width:"50%",textAlign: "end"}}>{dataSummary.maxavgticketasesorhourdeschour}</div>
                    </div>              
                    <div className="row-zyx" style={{paddingTop:"30px"}}>
                        <div style={{width:"50%"}}>{dataSummary.minvgtickethour}</div>
                        <div style={{width:"50%",textAlign: "end"}}>{dataSummary.minavgticketasesorhourdescdate}</div>
                    </div>              
                    <div className="row-zyx" style={{paddingTop:"0"}}>
                        <div style={{width:"50%"}}>{t(langKeys.lowestvalue)}</div>
                        <div style={{width:"50%",textAlign: "end"}}>{dataSummary.minavgticketasesorhourdeschour}</div>
                    </div>                
                </Box>
                <Box
                    className={classes.halfbox}
                    style={{padding: "15px"}}
                >
                    <div className={classes.boxtitlequarter}>{dataAsesoreconectadosbar.avgasesoresconectados}</div>
                    <div className={classes.boxtitlequarter}>Average number of advisers connected by hour</div> 
                    <div style={{paddingTop:"20px"}}>
                        <ResponsiveContainer width="100%" aspect={4.0/2.0}>
                            <LineChart data={resAsesoreconectados}>
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
            <div className="row-zyx ">
                <Box
                    className={classes.quarterbox}
                >
                    
                    <div className={classes.boxtitlequarter}>{dataDASHBOARD.avgconversationsattended}</div>
                    <div className={classes.boxtitlequarter}>Conversations attended </div>
                    <div className="row-zyx" style={{paddingTop:"10px", margin: 0}}>{dataDASHBOARD.maxavgconversationsattendedasesor} </div>                   
                    <div className="row-zyx" style={{paddingTop:"0"}}>{t(langKeys.attendedbyasesor)}</div>                   
                    <div className="row-zyx" style={{paddingTop:"30px", margin: 0}}>{dataDASHBOARD.minvgconversationsattendedbot} </div>                   
                    <div className="row-zyx" style={{paddingTop:"0"}}>{t(langKeys.attendedbybot)}</div>
                </Box>
                <Box
                    className={classes.quarterbox}
                >
                    <div className={classes.boxtitlequarter}>{dataInteraction.avginteractionsxconversations}</div>
                    <div className={classes.boxtitlequarter}>Average Interaction by conversation</div>
                    <div className="row-zyx" style={{paddingTop:"10px", margin: 0}}>{dataInteraction.maxavginteractionsxconversations} </div>                   
                    <div className="row-zyx" style={{paddingTop:"0"}}>Asesor</div>                   
                    <div className="row-zyx" style={{paddingTop:"30px", margin: 0}}>{dataInteraction.minvginteractionsxconversations} </div>                   
                    <div className="row-zyx" style={{paddingTop:"0"}}>Bot</div>               
                </Box>
                <Box
                    className={classes.halfbox}
                >
                    <div className={classes.boxtitlequarter}>Ranking 5 top labels</div>
                    <div className={classes.datafieldquarter}> &lt;0min </div>    
                </Box>
            </div>
            
        </Fragment>
    )
}

export default DashboardManagerial;