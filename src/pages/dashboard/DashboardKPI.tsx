import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { Dictionary } from "@types";
import { getDisconnectionTimes, getDateCleaned, getUserAsesorByOrgID, getValuesFromDomain, timetoseconds, formattime, exportExcel, getUserGroupsSel, dataYears, dataMonths, datesInMonth, dashboardKPISummaryGraphSel, dashboardKPISummarySel} from "common/helpers";
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
import clsx from 'clsx';

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
        subtitle: {
            fontSize:"0.8em"
        },
        less: {
            color: "#ff5b5b",
        },
        more: {
            color: "#8bafd6",
        },
    })
);

const DashboardKPI: FC = () => {
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const remultiaux = useSelector(state => state.main.multiDataAux);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const { t } = useTranslation();
    const [openDialog, setOpenDialog] = useState(false);
    const [dataGroup, setDataGroup] = useState<any>([]);
    const [dataSummary, setDataSummary] = useState<any>([]);
    const [filteredDays, setfilteredDays] = useState("");
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
            date: `${searchfields.year}-${searchfields.month}-01`, 
            origin: searchfields.origin,
            usergroup: searchfields.groups,
            supervisorid: user?.userid||0,
        }
        setfilteredDays(searchfields.day)
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

    /*useEffect(() => {
        dispatch(setViewChange("disconnections"))
        return () => {
            dispatch(cleanViewChange());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])*/
    
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
    function processSummary() {
        const prevmonth= remultiaux?.data?.[0]?.data[0];
        const actmonth= remultiaux?.data?.[0]?.data[1];
        console.log(remultiaux?.data?.[0]?.data||[])
        setDataSummary({
            firstassignedtime_avg: actmonth.firstassignedtime_avg,
            holdingwaitingtime_avg: actmonth.holdingwaitingtime_avg,
            firstreplytime_avg: actmonth.firstreplytime_avg,
            tmr_avg: actmonth.tmr_avg,
            tme_avg: actmonth.tme_avg,
            agents: actmonth.agents,
            tickets_count: actmonth.tickets_count,
            abandoned_tickets: actmonth.abandoned_tickets,
            balancetimes_avg: actmonth.balancetimes_avg,
            //variationfirstassignedtime_avg: timeVariationPorc()
        })
        debugger
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
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.firstavgassignment)}
                        <div className={classes.datafieldquarter}>{dataSummary?.firstassignedtime_avg || "00:00:00"}</div>
                        <div className={clsx(classes.subtitle, {[classes.less]: true, [classes.more]: false})}>poop</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.averageholdingtime)}
                        <div className={classes.datafieldquarter}>{dataSummary?.holdingwaitingtime_avg || "00:00:00"}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.avg1stresponsetime)}
                        <div className={classes.datafieldquarter}>{dataSummary?.firstreplytime_avg || "00:00:00"}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.tmrprom)}
                        <div className={classes.datafieldquarter}>{dataSummary?.tmr_avg || "00:00:00"}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.tmeprom)}
                        <div className={classes.datafieldquarter}>{dataSummary?.tme_avg || "00:00:00"}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.asesoresprom)}
                        <div className={classes.datafieldquarter}>{dataSummary?.agents || "0"}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.ticketsprom)}
                        <div className={classes.datafieldquarter}>{dataSummary?.tickets_count || "0"}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.unattendedticketsavg)}
                        <div className={classes.datafieldquarter}>{dataSummary?.abandoned_tickets || "0"}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.columnCard2}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.nprombalanceos)}
                        <div className={classes.datafieldquarter}>{dataSummary?.balancetimes_avg || "0"}</div>
                        </div>
                    </Box>
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardKPI;