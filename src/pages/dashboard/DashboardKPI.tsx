import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { Dictionary } from "@types";
import { getDisconnectionTimes, getDateCleaned, getUserAsesorByOrgID, getValuesFromDomain, timetoseconds, formattime, exportExcel, getUserGroupsSel, dataYears, dataMonths, datesInMonth} from "common/helpers";
import { DateRangePicker, DialogZyx, FieldMultiSelect, FieldSelect } from "components";
import { useSelector } from "hooks";
import { CalendarIcon } from "icons";
import { langKeys } from "lang/keys";
import { FC, Fragment, useEffect, useState } from "react";
import { Range } from 'react-date-range';
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, Pie, PieChart, Legend } from "recharts";
import { cleanViewChange, getMultiCollection, getMultiCollectionAux, resetMainAux, resetMultiMainAux, setViewChange } from "store/main/actions";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const COLORS = ["#0087e0", "#ff0000", "#296680", "#fc3617", "#e8187a", "#7cfa57", "#cfbace", "#4cd45f", "#fd5055", "#7e1be4", "#bf1490", "#66c6cf", "#011c3d", "#1a9595", "#4ae2c7", "#515496", "#a2aa65", "#df909c", "#3aa343", "#e0606e"];

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
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [dataasesors, setdataasesors] = useState<any>([]);
    const [dataGroup, setDataGroup] = useState<any>([]);
    const [datatotaltime, setdatatotaltime] = useState<any>([]);
    const [disconnectiontypes, setdisconnectiontypes] = useState<any>([]);
    const [tcovstdc, settcovstdc] = useState<any>([]);
    const [usersearch, setusersearch] = useState(0);
    const [searchfields, setsearchfields] = useState({
        day: "",
        month: String(new Date().getMonth()+1).padStart(2, '0'),
        year: String(new Date().getFullYear()),
        groups: "",
        origin: "",
    });
    const [dayData, setDayData] = useState<any>([]);
    const user = useSelector(state => state.login.validateToken.user);
    
    useEffect(() => {
        setDayData(datesInMonth(+searchfields.year, +searchfields.month))
    }, [searchfields.month, searchfields.year])

    async function funcsearch() {
        let tosend = { 
            startdate: dateRangeCreateDate.startDate, 
            enddate: dateRangeCreateDate.endDate, 
            asesorid: usersearch, 
            supervisorid: user?.userid||0,
        }
        dispatch(showBackdrop(true));
        setOpenDialog(false)
        dispatch(getMultiCollectionAux([
            getDisconnectionTimes(tosend)
        ]))
        setWaitSave(true)
    }
    useEffect(() => {
        if (waitSave) {
            if (!remultiaux.loading && !remultiaux.error) {
                let arraydisconnectiontimes =disconnectiontypes.map((x:any)=>0)
                let userereasons = remultiaux?.data[0]?.data || []
                let timestotal = [0,0]
                userereasons.forEach(x=>{
                    if(x.desconectedtimejson){
                        timestotal[0]+=timetoseconds(x.conectedtime)
                        timestotal[1]+=timetoseconds(x.desconectedtime)
                        let arraydesconectionjson = JSON.parse(x.desconectedtimejson)
                        let times = Object.keys(arraydesconectionjson)
                        times.forEach(y=>{
                            arraydisconnectiontimes[disconnectiontypes.indexOf(y)]+=timetoseconds(arraydesconectionjson[y])
                        })
                    }
                })
                setdatatotaltime(disconnectiontypes.reduce((acc:any,x:string, i:number)=>[...acc,{type:x, time: arraydisconnectiontimes[i]}],[]).filter((x:any)=>x.time!==0))
                settcovstdc([{title: t(langKeys.totaltimeconnected), time: timestotal[0]},{title: t(langKeys.totaltimeoffline), time: timestotal[1]}])
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
            setdisconnectiontypes(multiData[1]?.data?.reduce((acc:any,x)=>[...acc,x.domainvalue],[]))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainResult])
    useEffect(() => {
        dispatch(getMultiCollection([
            getUserGroupsSel(),
            getValuesFromDomain("TIPODESCONEXION"),
        ]));
        funcsearch()
        return () => {
            dispatch(resetMainAux());
            dispatch(resetMultiMainAux());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(setViewChange("disconnections"))
        return () => {
            dispatch(cleanViewChange());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index,}:Dictionary) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
            {`${formattime(tcovstdc[index].time)}`}
            </text>
        );
    }

    function downloaddata(data:any,title:string) {
        if (data.length !== 0) {
            let seteddata = data.map((x:any)=>{return {...x,time:formattime(x.time)}})
            exportExcel(title, seteddata, Object.keys(seteddata[0]).reduce((ac: any[], c: any) => (
                [
                    ...ac,
                    { Header: t((langKeys as any)[`dashboard_operationalpush_disconnections_${c}`]), accessor: c }
                ]),
                []
            ))
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
                <div className="row-zyx" style={{ marginTop: "15px" }}>
                    <FieldMultiSelect
                        label={t(langKeys.day)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        valueDefault={searchfields.day}
                        onChange={(value) => {debugger;setsearchfields(p => ({ ...p, day: value.map((o: any) => o.val).join() }))}}
                        data={dayData}
                        optionValue="val"
                        optionDesc="val"
                    />
                    <FieldSelect
                        label={t(langKeys.month)}
                        className={classes.fieldsfilter}
                        valueDefault={searchfields.month}
                        variant="outlined"
                        onChange={(value) => setsearchfields({...searchfields, month: value?.val || String(new Date().getMonth()+1).padStart(2, '0')})}
                        data={dataMonths}
                        uset={true}
                        prefixTranslation="month_"
                        optionDesc="val"
                        optionValue="val"
                    />
                    <FieldSelect
                        label={t(langKeys.year)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        valueDefault={searchfields.year}
                        onChange={(value) => setsearchfields({...searchfields, year: value?.value || new Date().getFullYear()})}
                        data={dataYears}
                        optionDesc="value"
                        optionValue="value"
                    />
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
                        ]}
                        optionValue="value"
                        optionDesc="value"
                    />
                </div>
            </DialogZyx>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className={classes.maintitle}> {t(langKeys.dashboardkpi)}</div>
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
                        style={{width:"100%"}}
                    >
                        <div className={classes.downloadiconcontainer}>                            
                            <CloudDownloadIcon onClick={()=>downloaddata(datatotaltime,t(langKeys.totaltimeduetodisconnectionreasons))} className={classes.styleicon}/>
                        </div>
                        <div style={{width: "100%"}}> 
                            <div style={{display: "flex"}}>
                                <div style={{fontWeight: "bold",fontSize: "1.6em",}}> {t(langKeys.totaltimeduetodisconnectionreasons)} </div>
                            </div>
                        </div>
                        <div style={{width: "100%", display:"flex"}}>
                            <div style={{width: "100%", paddingTop: 50}}>
                                <ResponsiveContainer width="100%" aspect={5.0 / 2.0}>
                                    <BarChart data={datatotaltime}>
                                        <XAxis domain={["",""]} angle={-40} interval={0} textAnchor="end"  type="category" dataKey="type" height={95}/>
                                        <YAxis tickFormatter={v=>formattime(v)} width={100}/>
                                        <RechartsTooltip formatter={(value: any, name: any) => [formattime(value), t(name)]} />
                                        <Bar dataKey="time" fill="#8884d8" > </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                        </div>
                    </Box>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
                <div className={classes.replacerowzyx}>
                    <Box
                        className={classes.itemCard}
                        style={{width:"100%"}}
                    >
                        <div className={classes.downloadiconcontainer}>                            
                            <CloudDownloadIcon onClick={()=>downloaddata(tcovstdc,t(langKeys.timeconnectedvstimeoff))} className={classes.styleicon}/>
                        </div>
                        <div style={{width: "100%"}}> 
                            <div style={{display: "flex"}}>
                                <div style={{fontWeight: "bold",fontSize: "1.6em",}}> {t(langKeys.timeconnectedvstimeoff)} </div>
                            </div>
                        </div>
                        <div style={{width: "100%", display:"flex"}}>
                            <div style={{width: "100%", paddingTop: 50}}>
                                <ResponsiveContainer width="100%" aspect={5.0 / 2.0}>
                                    <PieChart>
                                        <RechartsTooltip formatter={(value: any, name: any) => [formattime(value), t(name)]} />
                                        <Pie isAnimationActive={false} data={tcovstdc} dataKey="time" nameKey="title" cx="50%" cy="50%" fill="#8884d8" labelLine={false} label={renderCustomizedLabel}>
                                            {
                                                tcovstdc.map((entry:any, index:number) => <Cell key={entry.title} fill={COLORS[index % COLORS.length]}/>)
                                            }
                                        </Pie>
                                        <Legend verticalAlign="bottom"/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                        </div>
                    </Box>
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardKPI;