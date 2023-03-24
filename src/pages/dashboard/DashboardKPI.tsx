import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { timetoseconds, formattime, getUserGroupsSel, dashboardKPISummaryGraphSel, dashboardKPISummarySel, addTimes, varpercTime, varpercnumber, divisionTimeNumber, getDateCleaned} from "common/helpers";
import { DateRangePicker, DialogZyx, FieldMultiSelect } from "components";
import { useSelector } from "hooks";
import { DownloadIcon } from "icons";
import { langKeys } from "lang/keys";
import { FC, Fragment, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Range } from 'react-date-range';
import { ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, Legend, LineChart, CartesianGrid, Line, LabelList } from "recharts";
import { getMultiCollection, getMultiCollectionAux, resetMainAux, resetMultiMainAux } from "store/main/actions";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import DomToImage from 'dom-to-image';
import clsx from 'clsx';
import React from "react";
import { CalendarIcon } from "icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        halfbox: {
            width: "49%",
            margin: "0 1% 2% 0",
            backgroundColor: 'white',
        },
        fullbox: {
            width: "100%",
            margin: "0 0 2% 0",
            backgroundColor: 'white',
        },
        quarterbox: {            
            textAlign: "center",
            width: "24%",
            margin: "0 1% 2% 0",
            backgroundColor: 'white',
            padding: "15px"
        },
        quarterbox2: {
            width: "24%",
            margin: "0 1% 2% 0",
            backgroundColor: 'white',
            padding: "15px"
        },
        boxtitle:{
            fontWeight: "bold",
            fontSize: "1.6em",
            width: "50%"
        },
        boxtitledata:{
            fontSize: "1.6em",
            width: "50%",
            textAlign: "end"
        },
        boxtitlequarter:{
            width: "100%",
            textAlign: "center",
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
            border: "black 1px solid",
            margin: "0!important",
            display: "flex",
            padding: "0 15px"
        },
        label:{
            width: "60%",
            fontSize: "1.2em",
            padding: "5px"
        },
        datafield:{
            fontSize: "1.2em",
            padding: "5px"
        },
        datafieldquarter:{
            fontSize: "1.2em",
            textAlign: "center",
            width: "100%",
            padding: "5px"
        },
        containerFieldsQuarter:{
            margin: "0!important",
            display: "flex",
            width: "100%",
            color: "white"
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
            padding: "10px 0"
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
        columnCard: {
            backgroundColor: "#FFF",
            display: 'flex',
            height: '100%',
            flex: 1,
            padding: theme.spacing(2),
            flexDirection: 'column',
            gap: theme.spacing(1)
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
        columnCard2: {
            backgroundColor: "#FFF",
            display: 'flex',
            minHeight: '100%',
            flex: 1,
            textAlign: "center",
            padding: theme.spacing(2),
            flexDirection: 'column',
            gap: theme.spacing(1)
        },
        subtitle: {
            fontSize:"0.8em"
        },
        less: {
            color: "#ff5b5b",
        },
        more: {
            color: "#8bafd6",
        },
        containertitleboxes:{
            display: "flex",
            justifyContent: "space-between",
            width: "100%"
        }
    })
);

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

  
const DashboardKPI: FC = () => {
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const remultiaux = useSelector(state => state.main.multiDataAux);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const { t } = useTranslation();
    const [openDialog, setOpenDialog] = useState(false);
    const [dataGroup, setDataGroup] = useState<any>([]);
    const [auxdata, setauxdata] = useState({
        mes: "",
        year: ""
    });

    const [dataSummary, setDataSummary] = useState<any>([]);
    const [filteredDays, setfilteredDays] = useState("");
    const el = React.useRef<null | HTMLDivElement>(null);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [searchfields, setsearchfields] = useState({
        groups: "",
        origin: "",
    });
    const user = useSelector(state => state.login.validateToken.user);
    
    async function funcsearch() {
        let mes = String((dateRangeCreateDate?.endDate?.getMonth()||0)+1).padStart(2, '0')
        let year = String(dateRangeCreateDate?.endDate?.getFullYear())||""
        setauxdata({
            mes,year
        })
        let tosend = { 
            date: `${year}-${mes}-01`, 
            origin: searchfields.origin,
            usergroup: searchfields.groups,
            supervisorid: user?.userid||0,
        }
        let days=[]
        for (let i = dateRangeCreateDate?.startDate?.getDate()||1; i <= (dateRangeCreateDate?.endDate?.getDate()||1); i++) {
            days.push(i);            
        }
        setfilteredDays(days.join())
        dispatch(showBackdrop(true));
        setOpenDialog(false)
        dispatch(getMultiCollectionAux([
            dashboardKPISummarySel(tosend),
            dashboardKPISummaryGraphSel(tosend)
        ]))
        setWaitSave(true)
    }
    useEffect(() => {
        if (waitSave) {
            if (!remultiaux.loading && !remultiaux.error) {
                processSummary();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (remultiaux.error) {
                const errormessage = t(remultiaux.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remultiaux, waitSave])
    useEffect(() => {
        if (mainResult.multiData.data.length !== 0) {
            let multiData = mainResult.multiData.data;
            setDataGroup(multiData[0] && multiData[0].success ? multiData[0].data : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainResult])
    useEffect(() => {
        dispatch(getMultiCollection([
            getUserGroupsSel(),
        ]));
        funcsearch()
        return () => {
            dispatch(resetMainAux());
            dispatch(resetMultiMainAux());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const GenericPdfDownloader: React.FC<{ downloadFileName: string }> = ({ downloadFileName }) => {
        const downloadPdfDocument = () => {
            import('jspdf').then(jsPDF => {
                if (el.current) {
                    const gg = document.createElement('div');
                    gg.style.display = 'flex';
                    gg.style.flexDirection = 'column';
                    gg.style.gap = '8px';
                    gg.style.width = '460mm';
                    gg.style.paddingTop = '14mm';
                    gg.id = "newexportcontainer"

                    gg.innerHTML = el.current.innerHTML;

                    gg.querySelectorAll(".interaction-gmap").forEach(x => x.remove())
                    gg.querySelectorAll(".interaction-gmap-text").forEach(x => (x as HTMLDivElement).style.display = "")
                    document.body.appendChild(gg);
                    const pdf = new jsPDF.jsPDF('l', 'mm');
                    if (pdf) {
                        DomToImage.toPng(gg)
                            .then(imgData => {
                                var imgWidth = 280;
                                var pageHeight = 210;
                                var imgHeight = Math.ceil(gg.scrollHeight * 0.2645833333);
                                var heightLeft = imgHeight;
                                var doc = new jsPDF.jsPDF('l', 'mm');
                                var topPadding = 10;
                                var position = topPadding; // give some top padding to first page

                                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                                heightLeft -= pageHeight;

                                while (heightLeft >= 0) {
                                    position = heightLeft - imgHeight + topPadding; // top padding for other pages
                                    doc.addPage();
                                    doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                                    heightLeft -= pageHeight;
                                }
                                doc.save(`${downloadFileName}.pdf`);
                                document.getElementById('newexportcontainer')?.remove();
                            });
                    }
                }
            });

        }
        return (
            <Button
                variant="contained"
                color="primary"
                onClick={downloadPdfDocument}
                startIcon={<DownloadIcon />}
            ><Trans i18nKey={langKeys.download} />
            </Button>
        )
    }


    function processSummary() {
        const emptydata={
            firstassignedtime_avg: "00:00:00",
            holdingwaitingtime_avg: "00:00:00",
            firstreplytime_avg: "00:00:00",
            tmr_avg: "00:00:00",
            tme_avg: "00:00:00",
            agents: 0,
            tickets_count: 0,
            abandoned_tickets: 0,
            balancetimes_avg: "00:00:00",
        }
        const prevmonth= remultiaux?.data?.[0]?.data[0]||emptydata;
        const actmonth= remultiaux?.data?.[0]?.data[1]||emptydata;
        const selectedDays = filteredDays.split(",")
        const cantdays = selectedDays.length
        const dataDays = remultiaux?.data?.[1]?.data?.filter(x=>selectedDays.includes(String(x.day)))||[]
        console.log(remultiaux)
        //tme: timetoseconds(dataDays.filter(y=>String(y.day)===x)?.[0]?.tme_avg || "00:00:00")
        function compareFn(a:any,b:any){
            let na = Number(a.date.split(" ")[1])
            let nb = Number(b.date.split(" ")[1])
            if(na<nb) return -1;
            if(na>nb) return 1;
            return 0;
        }
        let graphdata = selectedDays.reduce((acc:any,x:string)=>{
            let foundDay = dataDays.filter(y=>String(y.day)===x)?.[0];
            return [...acc, {
            date: t(langKeys.day) + " "+ x,
            tme: timetoseconds(foundDay?.tme_avg || "00:00:00"),
            tmr: timetoseconds(foundDay?.tmr_avg || "00:00:00"),
            tickets_agents: foundDay?.tickets_agents||0,
            agents: foundDay?.agents||1,
            balancetimes_avg: foundDay?.balancetimes_avg||0,
            tickets_count: (foundDay?.tickets_count + foundDay?.abandoned_tickets)||0,
            abandoned_tickets: foundDay?.abandoned_tickets||0,
            //faltauno
            holdingwaitingtime_avg: timetoseconds(foundDay?.holdingwaitingtime_avg || "00:00:00"),
            firstassignedtime_avg: timetoseconds(foundDay?.firstassignedtime_avg || "00:00:00"),
            firstreplytime_avg: timetoseconds(foundDay?.firstreplytime_avg || "00:00:00"),
            participacion: foundDay?.stake||0,
        }]}, [])
        setDataSummary({
            month: auxdata.mes,
            year: auxdata.year,
            firstassignedtime_avg: divisionTimeNumber(dataDays.reduce((acc,x)=>(addTimes(acc,x.firstassignedtime_avg)),"00:00:00"),cantdays),
            holdingwaitingtime_avg: divisionTimeNumber(dataDays.reduce((acc,x)=>(addTimes(acc,x.holdingwaitingtime_avg)),"00:00:00"),cantdays),
            firstreplytime_avg: divisionTimeNumber(dataDays.reduce((acc,x)=>(addTimes(acc,x.firstreplytime_avg)),"00:00:00"),cantdays),
            tmr_avg: divisionTimeNumber(dataDays.reduce((acc,x)=>(addTimes(acc,x.tmr_avg)),"00:00:00"),cantdays),
            tme_avg: divisionTimeNumber(dataDays.reduce((acc,x)=>(addTimes(acc,x.tme_avg)),"00:00:00"),cantdays),
            agents: (dataDays.reduce((acc,x)=>(acc + x.agents),0)/cantdays).toFixed(0),
            tickets_count: (dataDays.reduce((acc,x)=>(acc + x.tickets_count + x.abandoned_tickets),0)/cantdays).toFixed(0),
            abandoned_tickets: (dataDays.reduce((acc,x)=>(acc + x.abandoned_tickets),0)/cantdays).toFixed(0),
            balancetimes_avg: (dataDays.reduce((acc,x)=>(acc + x.balancetimes_avg),0)/cantdays).toFixed(2),
            varperfata: varpercTime(actmonth.firstassignedtime_avg, prevmonth.firstassignedtime_avg,0),
            varperhwta: varpercTime(actmonth.holdingwaitingtime_avg, prevmonth.holdingwaitingtime_avg,0),
            varperfrta: varpercTime(actmonth.firstreplytime_avg, prevmonth.firstreplytime_avg,0),
            varpertmr_avg: varpercTime(actmonth.tmr_avg, prevmonth.tmr_avg,0),
            varpertme_avg: varpercTime(actmonth.tme_avg, prevmonth.tme_avg,0),
            varperagents: varpercnumber(actmonth.agents, prevmonth.agents,0),
            varpertc: varpercnumber(actmonth.tickets_count + actmonth.abandoned_tickets, prevmonth.tickets_count + prevmonth.abandoned_tickets,0),
            varperat: varpercnumber(actmonth.abandoned_tickets, prevmonth.abandoned_tickets,0),
            varperbta: varpercnumber(actmonth.balancetimes_avg, prevmonth.balancetimes_avg,0),
            graphdata: graphdata.sort(compareFn),
        })
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
                <div className="row-zyx" style={{ marginTop: "15px" }}>
                    <DateRangePicker
                        open={openDateRangeCreateDateModal}
                        setOpen={setOpenDateRangeCreateDateModal}
                        range={dateRangeCreateDate}
                        onSelect={setDateRangeCreateDate}
                        //months={1}
                        limitMonth={1}
                    >
                        <Button
                            className={classes.itemDate}
                            startIcon={<CalendarIcon />}
                            onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                        >
                            {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                        </Button>
                    </DateRangePicker>
                    <FieldMultiSelect
                        label={t(langKeys.group)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        valueDefault={searchfields.groups}
                        onChange={(value) => setsearchfields(p => ({ ...p, groups: value.map((o: any) => o.domainvalue).join() }))}
                        data={dataGroup}
                        optionValue="domainvalue"
                        optionDesc="domaindesc"
                    />
                    <FieldMultiSelect
                        label={t(langKeys.origin)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        valueDefault={searchfields.origin}
                        onChange={(value) => setsearchfields(p => ({ ...p, origin: value.map((o: any) => o.value).join() }))}
                        data={[
                            {value:"INBOUND"},
                            {value:"OUTBOUND"},
                            {value:"EXTERNAL"},
                        ]}
                        optionValue="value"
                        optionDesc="value"
                    />
                </div>
            </DialogZyx>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className={classes.maintitle}> {t(langKeys.dashboardkpi)}</div>
                <div style={{display:"flex",gap: 6}}>
                    <GenericPdfDownloader
                        downloadFileName={`kpi-${dataSummary.year}-${dataSummary.month}-${filteredDays}`}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: 200, backgroundColor: "#007bff" }}
                        onClick={() => setOpenDialog(true)}
                    >{t(langKeys.stablishfilters)}
                    </Button>
                </div>
            </div>
            <div ref={el} style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
                <div className={classes.replacerowzyx} style={{alignItems: "stretch"}}>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.firstavgassignment)}
                        <div className={classes.datafieldquarter}>{dataSummary?.firstassignedtime_avg || "00:00:00"}</div>
                        <div className={clsx(classes.subtitle, {[classes.more]: dataSummary.varperfata<0, [classes.less]: dataSummary.varperfata>0})}>{dataSummary.varperfata>0?"+":""}{dataSummary.varperfata}% {t(langKeys.vsprevmonth)}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.averageholdingtime)}
                        <div className={classes.datafieldquarter}>{dataSummary?.holdingwaitingtime_avg || "00:00:00"}</div>
                        <div className={clsx(classes.subtitle, {[classes.more]: dataSummary.varperhwta<0, [classes.less]: dataSummary.varperhwta>0})}>{dataSummary.varperhwta>0?"+":""}{dataSummary.varperhwta}% {t(langKeys.vsprevmonth)}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.avg1stresponsetime)}
                        <div className={classes.datafieldquarter}>{dataSummary?.firstreplytime_avg || "00:00:00"}</div>
                        <div className={clsx(classes.subtitle, {[classes.more]: dataSummary.varperfrta<0, [classes.less]: dataSummary.varperfrta>0})}>{dataSummary.varperfrta>0?"+":""}{dataSummary.varperfrta}% {t(langKeys.vsprevmonth)}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.tmrprom)}
                        <div className={classes.datafieldquarter}>{dataSummary?.tmr_avg || "00:00:00"}</div>
                        <div className={clsx(classes.subtitle, {[classes.less]: dataSummary.varpertmr_avg<0, [classes.more]: dataSummary.varpertmr_avg>0})}>{dataSummary.varpertmr_avg>0?"+":""}{dataSummary.varpertmr_avg}% {t(langKeys.vsprevmonth)}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.tmeprom)}
                        <div className={classes.datafieldquarter}>{dataSummary?.tme_avg || "00:00:00"}</div>
                        <div className={clsx(classes.subtitle, {[classes.less]: dataSummary.varpertme_avg<0, [classes.more]: dataSummary.varpertme_avg>0})}>{dataSummary.varpertme_avg>0?"+":""}{dataSummary.varpertme_avg}% {t(langKeys.vsprevmonth)}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.asesoresprom)}
                        <div className={classes.datafieldquarter}>{dataSummary?.agents || "0"}</div>
                        <div className={clsx(classes.subtitle, {[classes.less]: dataSummary.varperagents<0, [classes.more]: dataSummary.varperagents>0})}>{dataSummary.varperagents>0?"+":""}{dataSummary.varperagents}% {t(langKeys.vsprevmonth)}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.ticketsprom)}
                        <div className={classes.datafieldquarter}>{dataSummary?.tickets_count || "0"}</div>
                        <div className={clsx(classes.subtitle, {[classes.less]: dataSummary.varpertc<0, [classes.more]: dataSummary.varpertc>0})}>{dataSummary.varpertc>0?"+":""}{dataSummary.varpertc}% {t(langKeys.vsprevmonth)}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.unattendedticketsavg)}
                        <div className={classes.datafieldquarter}>{dataSummary?.abandoned_tickets || "0"}</div>
                        <div className={clsx(classes.subtitle, {[classes.more]: dataSummary.varperat<0, [classes.less]: dataSummary.varperat>0})}>{dataSummary.varperat>0?"+":""}{dataSummary.varperat}% {t(langKeys.vsprevmonth)}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.nprombalanceos)}
                        <div className={classes.datafieldquarter}>{dataSummary?.balancetimes_avg || "0"}</div>
                        <div className={clsx(classes.subtitle, {[classes.more]: dataSummary.varperbta<0, [classes.less]: dataSummary.varperbta>0})}>{dataSummary.varperbta>0?"+":""}{dataSummary.varperbta}% {t(langKeys.vsprevmonth)}</div>
                        </div>
                    </Box>
                </div>
                <div className="todown" style={{display:"flex", gap:8}}>

                    <div className={classes.replacerowzyx} style={{width:"100%"}} >
                        <Box
                            className={classes.itemCard}
                        >
                            <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
                                <LineChart data={dataSummary?.graphdata||[]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="date" />
                                    <YAxis tickFormatter={v=>formattime(v)} width={100} domain={[0, (dataMax:any) => (Math.floor(dataMax * 1.1) + 5)]}/>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <RechartsTooltip formatter={(value: any, name: any) => [formattime(value), t(name)]}/>
                                    <Legend verticalAlign="top" height={70}/>
                                    <Line type="monotone" name="TME" dataKey="tme" stroke="#c0504d" strokeWidth={2}>
                                        <LabelList dataKey="tme" position="insideBottomLeft" fill="#c0504d" formatter={(v:any)=>formattime(v)} angle={-90}/>
                                    </Line>
                                    <Line type="monotone" name="TMR" dataKey="tmr" stroke="#4f81bd" strokeWidth={2}>
                                        <LabelList dataKey="tmr" position="insideBottomLeft" fill="#4f81bd" formatter={(v:any)=>formattime(v)} angle={-90}/>
                                    </Line>
                                </LineChart>
                            </ResponsiveContainer>                        
                        </Box>
                    </div>
                    <div className={classes.replacerowzyx} style={{width:"100%"}} >
                        <Box
                            className={classes.itemCard}
                        >
                            <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
                                <LineChart width={730} height={250} data={dataSummary?.graphdata||[]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <Legend verticalAlign="top"/>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <XAxis dataKey="date" />
                                    <YAxis tickFormatter={v=>(v)} width={50} domain={[0, (dataMax:any) => (Math.floor(dataMax * 1.1) + 5)]}/>
                                    <RechartsTooltip formatter={(value: any, name: any) => [(value), t(name)]} />
                                    <Line type="monotone" name={t(langKeys.ticketsattendedbyadvisor)} dataKey="tickets_agents" stroke="#c0504d" strokeWidth={2}>
                                        <LabelList dataKey="tickets_agents" position="top"  fill="#c0504d"/>
                                    </Line>
                                    <Line type="monotone" name={t(langKeys.agent_plural)} dataKey="agents" stroke="#4f81bd" strokeWidth={2}>
                                        <LabelList dataKey="agents" position="top" fill="#4f81bd"/>
                                    </Line>
                                    <Line type="monotone" name={t(langKeys.ticket_balancetimes)} dataKey="balancetimes_avg" stroke="#9bbb59" strokeWidth={2}>
                                        <LabelList dataKey="balancetimes_avg" position="top" fill="#9bbb59"/>
                                    </Line>
                                </LineChart>
                            </ResponsiveContainer>                        
                        </Box>
                    </div>
                </div>
                <div className="todown" style={{display:"flex", gap:8}}>
                    <div className={classes.replacerowzyx} style={{width:"100%"}} >
                        <Box
                            className={classes.itemCard}
                        >
                            <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
                                <LineChart width={730} height={250} data={dataSummary?.graphdata||[]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="right" orientation="right" tickFormatter={v=>v + " %"} domain={[0,150]}/>
                                    <YAxis yAxisId="left"width={100} domain={[0, (dataMax:any) => (Math.floor(dataMax * 1.1) + 5)]}/>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <RechartsTooltip formatter={(value: any, name: any, props:any) => [props.dataKey==="participacion"?value+"%":value, t(name)]} />
                                    <Legend verticalAlign="top" height={50}/>
                                    <Line yAxisId="left" type="monotone" name={t(langKeys.report_kpioperativo_tickets)} dataKey="tickets_count" stroke="#c0504d" strokeWidth={2}>
                                        <LabelList dataKey="tickets_count" position="top"  fill="#4f81bd"/>
                                    </Line>
                                    <Line yAxisId="left" type="monotone" name={t(langKeys.report_kpioperativo_abandoned_tickets)} dataKey="abandoned_tickets" stroke="#4f81bd" strokeWidth={2}>
                                        <LabelList dataKey="abandoned_tickets" position="top" fill="#c0504d"/>
                                    </Line>
                                    <Line yAxisId="right" type="monotone" name={t(langKeys.percparticipation)} dataKey="participacion" stroke="#9bbb59" strokeWidth={2}>
                                        <LabelList dataKey="participacion" position="top"  fill="#9bbb59" formatter={(value: any, name: any) => [value + "%", t(name)]}/>
                                    </Line>
                                </LineChart>
                            </ResponsiveContainer>                        
                        </Box>
                    </div>
                    <div className={classes.replacerowzyx} style={{width:"100%"}} >
                        <Box
                            className={classes.itemCard}
                        >
                            <ResponsiveContainer width="100%" aspect={4.0 / 2.0}>
                                <LineChart width={730} height={250} data={dataSummary?.graphdata||[]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <XAxis dataKey="date" />
                                    <YAxis tickFormatter={v=>formattime(v)}  width={50} domain={[0, (dataMax:any) => (Math.floor(dataMax * 1.1) + 5)]}/>
                                    <RechartsTooltip formatter={(value: any, name: any) => [formattime(value), t(name)]} />
                                    <Legend verticalAlign="top" height={50}/>
                                    <Line type="monotone" name={t(langKeys.report_voicecall_holdingtime)} dataKey="holdingwaitingtime_avg" stroke="#c0504d" strokeWidth={2}>
                                        <LabelList dataKey="holdingwaitingtime_avg" position="top"  fill="#c0504d" formatter={(v:any)=>formattime(v)}/>
                                    </Line>
                                    <Line type="monotone" name={t(langKeys.firstassignmenttime)} dataKey="firstassignedtime_avg" stroke="#4f81bd" strokeWidth={2}>
                                        <LabelList dataKey="firstassignedtime_avg" position="top" fill="#4f81bd" formatter={(v:any)=>formattime(v)}/>
                                    </Line>
                                    <Line type="monotone" name={t(langKeys.ticket_tiempoprimerarespuesta)} dataKey="firstreplytime_avg" stroke="#9bbb59" strokeWidth={2}>
                                        <LabelList dataKey="firstreplytime_avg" position="top"  fill="#9bbb59" formatter={(v:any)=>formattime(v)}/>
                                    </Line>

                                </LineChart>
                            </ResponsiveContainer>                        
                        </Box>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardKPI;