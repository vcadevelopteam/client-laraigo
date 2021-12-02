import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { Dictionary } from "@types";
import { getCommChannelLst, getdashboardPushHSMCATEGORYRANKSel, getdashboardPushHSMRANKSel, getdashboardPushMENSAJEXDIASel, getdashboardPushSUMMARYSel, getLabelsSel, getSupervisorsSel, getValuesFromDomain } from "common/helpers";
import { DateRangePicker, DialogZyx, FieldMultiSelect } from "components";
import { useSelector } from "hooks";
import { CalendarIcon } from "icons";
import { langKeys } from "lang/keys";
import { FC, Fragment, useEffect, useState } from "react";
import { Range } from 'react-date-range';
import ChatIcon from '@material-ui/icons/Chat';
import AdbIcon from '@material-ui/icons/Adb';
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getMultiCollection, getMultiCollectionAux, resetMain } from "store/main/actions";
import { showBackdrop, showSnackbar } from "store/popus/actions";

const COLORS = ["#0f8fe5", "#067713", "#296680", "#fc3617", "#e8187a", "#7cfa57", "#cfbace", "#4cd45f", "#fd5055", "#7e1be4", "#bf1490", "#66c6cf", "#011c3d", "#1a9595", "#4ae2c7", "#515496", "#a2aa65", "#df909c", "#3aa343", "#e0606e"];

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
        }
    })
);

const initialRange = {
    startDate: new Date(new Date().setDate(0)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}
const format = (date: Date) => date.toISOString().split('T')[0];

const DashboardOperationalPush: FC = () => {
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const remultiaux = useSelector(state => state.main.multiDataAux);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const { t } = useTranslation();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [dataqueue, setdataqueue] = useState<any>([]);
    const [dataprovider, setdataprovider] = useState<any>([]);
    const [datachannels, setdatachannels] = useState<any>([]);
    const [datasupervisors, setdatasupervisors] = useState<any>([]);
    const [dataLabel, setdataLabel] = useState<any>([]);
    const [datacategoriaHSM, setdatacategoriaHSM] = useState<any>([]);
    const [dataHSMCATEGORYRANK, setdataHSMCATEGORYRANK] = useState<any>([]);
    const [dataHSMRANK, setdataHSMRANK] = useState<any>([]);
    const [dataPushSUMMARYSel, setdataPushSUMMARYSel] = useState<any>([]);
    const [dataMENSAJEXDIA, setdataMENSAJEXDIA] = useState<any>([]);
    const [dataSummary, setdataSummary] = useState({
        failMns: "0",
        dataSuccessMns: "0",
        totalMns: "0",
        successMns: "0",
        dataFailMns: "0",
        attendedMns: "0",
        dataAttendedMns: "0",
        dataBot: "0",
        dataAsesor: "0"
    });
    const [searchfields, setsearchfields] = useState({
        queue: "",
        provider: "",
        channels: "",
        supervisor: "",
        label: "",
        categoriaHSM: ""
    });
    async function funcsearch() {
        let tosend = { 
            startdate: dateRangeCreateDate.startDate, 
            enddate: dateRangeCreateDate.endDate, 
            channel: searchfields.channels, 
            group: searchfields.queue, 
            company: searchfields.provider,
            label: searchfields.label,
            category: searchfields.categoriaHSM,
            supervisor: searchfields.supervisor
        }
        dispatch(showBackdrop(true));
        setOpenDialog(false)
        dispatch(getMultiCollectionAux([
            getdashboardPushHSMCATEGORYRANKSel(tosend),
            getdashboardPushSUMMARYSel(tosend),
            getdashboardPushHSMRANKSel(tosend),
            getdashboardPushMENSAJEXDIASel(tosend),
        ]))
        setWaitSave(true)
    }
    useEffect(() => {
        setdataSummary({
            failMns: "0",
            dataSuccessMns: "0",
            totalMns: "0",
            successMns: "0",
            dataFailMns: "0",
            attendedMns: "0",
            dataAttendedMns: "0",
            dataBot: "0",
            dataAsesor: "0"
        });
        if(dataPushSUMMARYSel && dataPushSUMMARYSel.length){
            const {fail,success,total,attended,bot,asesor} = dataPushSUMMARYSel[0];
            setdataSummary({
                failMns: fail,
                dataSuccessMns: (success * 100 / total).toFixed() + " %",
                totalMns: total,
                successMns: success,
                dataFailMns: (fail * 100 / total).toFixed() + " %",
                attendedMns: attended,
                dataAttendedMns: (attended * 100 / total).toFixed() + " %",
                dataBot: bot,
                dataAsesor: asesor
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [dataPushSUMMARYSel])
    useEffect(() => {
        if (waitSave) {
            if (!remultiaux.loading && !remultiaux.error) {
                setdataHSMCATEGORYRANK(remultiaux.data[0].data)
                setdataPushSUMMARYSel(remultiaux.data[1].data)
                setdataHSMRANK(remultiaux.data[2].data)
                setdataMENSAJEXDIA(remultiaux.data[3].data)
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
    useEffect(() => {
        if (mainResult.multiData.data.length !== 0) {
            let multiData = mainResult.multiData.data;
            setdataqueue(multiData[0] && multiData[0].success ? multiData[0].data : []);
            setdataprovider(multiData[1] && multiData[1].success ? multiData[1].data : []);
            setdatachannels(multiData[2] && multiData[2].success ? multiData[2].data : []);
            setdatasupervisors(multiData[3] && multiData[3].success ? multiData[3].data : []);
            setdataLabel(multiData[4] && multiData[4].success ? multiData[4].data : []);
            setdatacategoriaHSM(multiData[5] && multiData[5].success ? multiData[5].data : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainResult])
    useEffect(() => {
        dispatch(getMultiCollection([
            getValuesFromDomain("GRUPOS"),
            getValuesFromDomain("EMPRESA"),
            getCommChannelLst(),
            getSupervisorsSel(),
            getLabelsSel(),
            getValuesFromDomain("CATEGORIAHSM"),
        ]));
        funcsearch()
        return () => {
            dispatch(resetMain());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <FieldMultiSelect
                        label={t(langKeys.provider)}
                        className={classes.fieldsfilter}
                        onChange={(value) => { setsearchfields((p) => ({ ...p, provider: value.map((o: Dictionary) => o.domainvalue).join() })) }}
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
                <div className="row-zyx" style={{ marginTop: "15px" }}>
                    <FieldMultiSelect
                        label={t(langKeys.categoriaHSM)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => { setsearchfields((p) => ({ ...p, categoriaHSM: value.map((o: Dictionary) => o.domainvalue).join() })) }}
                        valueDefault={searchfields.categoriaHSM}
                        data={datacategoriaHSM}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>

            </DialogZyx>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className={classes.maintitle}> {t(langKeys.operationalpush)}</div>
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
                        className={classes.columnCard}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.sentmessages)}</div>
                        <div className={classes.datafieldquarter}>{dataSummary.totalMns}</div>                    
                    </Box>
                    <Box
                        className={classes.columnCard}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.messagessuccesfullydelivered)}</div>
                        <div className={classes.datafieldquarter}>{dataSummary.successMns}</div>                    
                    </Box>
                    <Box
                        className={classes.columnCard}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.failedmessages)}</div>
                        <div className={classes.datafieldquarter}>{dataSummary.failMns}</div>                    
                    </Box>
                    <Box
                        className={classes.columnCard}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.answeredmessages)}</div>
                        <div className={classes.datafieldquarter}>{dataSummary.attendedMns}</div>                    
                    </Box>
                </div>
                <div className={classes.replacerowzyx}>
                    <Box
                        className={classes.itemCard}
                        style={{ backgroundColor: "#53a6fa", display: 'flex', flex: 1, gap: 8 }}
                    >
                        <div className={classes.containerFieldsQuarter}>
                            <ChatIcon style={{color:"white",margin: "3px 5px"}}/>
                            <div className={classes.boxtitle}>{t(langKeys.closedbyadviser)}</div>
                            <div className={classes.boxtitledata}>{dataSummary.dataAsesor}</div>    
                        </div>            
                    </Box>
                    <Box
                        className={classes.itemCard}
                        style={{ backgroundColor: "#fdab29", display: 'flex', flex: 1, gap: 8 }}
                    >
                        <div className={classes.containerFieldsQuarter}>
                            <AdbIcon style={{color:"white",margin: "3px 5px"}}/>
                            <div className={classes.boxtitle}>{t(langKeys.closedbybot)}</div>
                            <div className={classes.boxtitledata}>{dataSummary.dataBot}</div>    
                        </div>            
                    </Box>
                </div>
                <div className={classes.replacerowzyx} >
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.boxtitle}  style={{ width:"100%"}}>{t(langKeys.distributionbycategoryHSM)}</div>
                        <div style={{ width: "100%", height: 240 }} >
                            <ResponsiveContainer width="100%" aspect={4.0 / 1.3}>
                                <PieChart>
                                    <Tooltip />
                                    <Pie data={dataHSMCATEGORYRANK} dataKey="quantity" nameKey="categoria" cx="50%" cy="50%" innerRadius={40} fill="#8884d8">
                                        {dataHSMCATEGORYRANK.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Box>
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.boxtitle} style={{ width:"100%"}}> Ranking HSM </div>
                        <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                            <BarChart data={dataHSMRANK}>
                                <XAxis dataKey="templatename" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="quantity" fill="#8884d8" >
                                    {dataHSMRANK.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        
                    </Box>
                </div>
                <div className={classes.replacerowzyx}>
                    <Box
                        className={classes.itemCard}
                    >
                        <div className={classes.boxtitle}>{t(langKeys.messagesbyday)}</div>
                        <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                            <ComposedChart
                                data={dataMENSAJEXDIA}
                                >
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis dataKey="fecha" scale="band" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" barSize={20} fill="#2499ee" />
                                <Line type="monotone" dataKey="attended" stroke="#52307c" />
                                </ComposedChart>
                        </ResponsiveContainer>
                    </Box>
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardOperationalPush;