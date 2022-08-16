import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { Dictionary } from "@types";
import { exportExcel, getCommChannelLst, getdashboardPushAppDataSel, getdashboardPushAppSel, getdashboardPushHSMCATEGORYRANKSel, getdashboardPushHSMCATEGORYRANKSelData, getdashboardPushHSMRANKSel, getdashboardPushHSMRANKSelData, getdashboardPushMENSAJEXDIASel, getdashboardPushMENSAJEXDIASelData, getdashboardPushSUMMARYSel, getdashboardPushSUMMARYSelData, getDateCleaned, getLabelsSel, getSupervisorsSel, getValuesFromDomain } from "common/helpers";
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
import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, Label } from "recharts";
import { getCollectionAux, getMultiCollection, getMultiCollectionAux, resetMainAux, resetMultiMainAux } from "store/main/actions";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Tooltip from "@material-ui/core/Tooltip"
import InfoIcon from '@material-ui/icons/Info';

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
        boxtitle: {
            fontWeight: "bold",
            fontSize: "1.6em",
            width: "50%"
        },
        boxtitledata: {
            fontSize: "1.6em",
            width: "50%",
            textAlign: "end"
        },
        boxtitlequarter: {
            width: "100%",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5em",
        },
        maintitle: {
            fontWeight: "bold",
            fontSize: "2em",
            padding: "0 0 20px;"
        },
        rowstyles: {
            margin: "0!important"
        },
        containerFields: {
            border: "black 1px solid",
            margin: "0!important",
            display: "flex",
            padding: "0 15px"
        },
        label: {
            width: "60%",
            fontSize: "1.2em",
            padding: "5px"
        },
        datafield: {
            fontSize: "1.2em",
            padding: "5px"
        },
        datafieldquarter: {
            fontSize: "1.2em",
            textAlign: "center",
            width: "100%",
            padding: "5px"
        },
        containerFieldsQuarter: {
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
            minHeight: 136,
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
        downloadiconcontainer: {
            width: "100%", display: "flex", justifyContent: "end"
        },
        styleicon: {
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

const DashboardOperationalPush: FC = () => {
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const remultiaux = useSelector(state => state.main.multiDataAux);
    const resaux = useSelector(state => state.main.mainAux);
    const user = useSelector(state => state.login.validateToken.user);
    const groups = user?.groups?.split(",") || [];
    const [downloaddatafile, setdownloaddatafile] = useState(false);
    const [section, setSection] = useState('')
    const [titlefile, settitlefile] = useState('');
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
    const [dataAppRank, setdataAppRank] = useState<any>([]);
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
            getdashboardPushAppSel(tosend)
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
        if (dataPushSUMMARYSel && dataPushSUMMARYSel.length) {
            const { fail, success, total, attended, bot, asesor } = dataPushSUMMARYSel[0];
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
                setdataAppRank(remultiaux.data[4].data.map(x=>{ return ({...x, application: t((x.application).toLowerCase())})}))
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
            setdataqueue(multiData[0] && multiData[0].success ? multiData[0].data.filter(x => groups.length > 0 ? groups.includes(x.domainvalue) : true) : []);
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
            dispatch(resetMainAux());
            dispatch(resetMultiMainAux());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (downloaddatafile) {
            if (!resaux.loading) {
                if (resaux.data.length > 0) {
                    const dataToExport = resaux.data.map(x => ({
                        ...x,
                        status: x.status === "success" ? t(langKeys.status_SENT) : t(langKeys.failed),
                    }))
                    exportExcel(titlefile, dataToExport, Object.keys(resaux.data[0]).reduce((ac: any[], c: any) => (
                        [
                            ...ac,
                            {
                                Header: t((langKeys as any)[`dashboard_operationalpush_${section}_${c}`]),
                                accessor: c
                            }
                        ]),
                        []
                    ))
                }
                else {
                    exportExcel(titlefile, [{ '': t(langKeys.no_records) }])
                }
                setdownloaddatafile(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resaux, downloaddatafile])
    async function downloaddata(tipeoffilter: string) {
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
        setdownloaddatafile(true)
        if (tipeoffilter === "SUMMARY") {
            settitlefile(t(langKeys.messagesentreceivedfailedanswered));
            setSection('summary')
            dispatch(getCollectionAux(getdashboardPushSUMMARYSelData(tosend)))
        } else if (tipeoffilter === "CATEGORYRANK") {
            settitlefile(t(langKeys.distributionbycategoryHSM));
            setSection('categoryrank')
            dispatch(getCollectionAux(getdashboardPushHSMCATEGORYRANKSelData(tosend)))
        } else if (tipeoffilter === "HSMRANK") {
            settitlefile('Ranking HSM');
            setSection('hsmrank')
            dispatch(getCollectionAux(getdashboardPushHSMRANKSelData(tosend)))
        } else if (tipeoffilter === "MESSAGEPERDAY") {
            settitlefile(t(langKeys.messagesbyday));
            setSection('messageperday')
            dispatch(getCollectionAux(getdashboardPushMENSAJEXDIASelData(tosend)))
        } else {
            settitlefile(t(langKeys.numberofHSMShipments));
            setSection('application')
            dispatch(getCollectionAux(getdashboardPushAppDataSel(tosend)))
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
                    <div className={classes.downloadiconcontainer}>
                        <CloudDownloadIcon onClick={() => downloaddata("SUMMARY")} className={classes.styleicon} />
                    </div>
                    <Box
                        className={classes.columnCard}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.sentmessages)}
                            <Tooltip title={`${t(langKeys.sentmessagestooltip)}`} placement="top-start">
                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                            </Tooltip>
                        </div>
                        <div className={classes.datafieldquarter}>{dataSummary.totalMns}</div>
                    </Box>
                    <Box
                        className={classes.columnCard}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.messagessuccessfullydelivered)}
                            <Tooltip title={`${t(langKeys.messagessuccessfullydeliveredtooltip)}`} placement="top-start">
                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                            </Tooltip>
                        </div>
                        <div className={classes.datafieldquarter}>{dataSummary.successMns}</div>
                    </Box>
                    <Box
                        className={classes.columnCard}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.failedmessages)}
                            <Tooltip title={`${t(langKeys.failedmessagestooltip)}`} placement="top-start">
                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                            </Tooltip>
                        </div>
                        <div className={classes.datafieldquarter}>{dataSummary.failMns}</div>
                    </Box>
                    <Box
                        className={classes.columnCard}
                    >
                        <div className={classes.boxtitlequarter}>{t(langKeys.answeredmessages)}
                            <Tooltip title={`${t(langKeys.answeredmessagestooltip)}`} placement="top-start">
                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                            </Tooltip>
                        </div>
                        <div className={classes.datafieldquarter}>{dataSummary.attendedMns}</div>
                    </Box>
                </div>
                <div className={classes.replacerowzyx}>
                    <Box
                        className={classes.itemCard}
                        style={{ backgroundColor: "#53a6fa", display: 'flex', flex: 1, gap: 8 }}
                    >
                        <div className={classes.containerFieldsQuarter}>
                            <ChatIcon style={{ color: "white", margin: "3px 5px" }} />
                            <div className={classes.boxtitle}>{t(langKeys.closedbyadviser)}
                                <Tooltip title={`${t(langKeys.closedbyadvisertooltip)}`} placement="top-start">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </div>
                            <div className={classes.boxtitledata}>{dataSummary.dataAsesor}</div>
                        </div>
                    </Box>
                    <Box
                        className={classes.itemCard}
                        style={{ backgroundColor: "#fdab29", display: 'flex', flex: 1, gap: 8 }}
                    >
                        <div className={classes.containerFieldsQuarter}>
                            <AdbIcon style={{ color: "white", margin: "3px 5px" }} />
                            <div className={classes.boxtitle}>{t(langKeys.closedbybot)}
                                <Tooltip title={`${t(langKeys.closedbybottooltip)}`} placement="top-start">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </div>
                            <div className={classes.boxtitledata}>{dataSummary.dataBot}</div>
                        </div>
                    </Box>
                </div>
                <div className={classes.replacerowzyx} >
                    <Box
                        className={classes.itemCard}
                        style={{ width: "50%" }}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={() => downloaddata("CATEGORYRANK")} className={classes.styleicon} />
                        </div>
                        <div className={classes.boxtitle} style={{ width: "100%" }}>{t(langKeys.distributionbycategoryHSM)}
                            <Tooltip title={`${t(langKeys.distributionbycategoryHSMtooltip)}`} placement="top-start">
                                <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                            </Tooltip>
                        </div>
                        <div style={{ height: 240, margin: 'auto' }} >
                            <ResponsiveContainer width="100%" aspect={4.0 / 1.3}>
                                <PieChart>
                                    <RechartsTooltip />
                                    <Pie data={dataHSMCATEGORYRANK} dataKey="quantity" nameKey="categoria" cx="50%" cy="50%" innerRadius={40} fill="#8884d8">
                                        {dataHSMCATEGORYRANK.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Box>
                </div>
                <div className={classes.replacerowzyx} >
                    <Box
                        className={classes.itemCard}
                        style={{ width: "50%" }}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={() => downloaddata("HSMRANK")} className={classes.styleicon} />
                        </div>
                        <div style={{ width: "100%" }}>
                            <div style={{ display: "flex" }}>
                                <div style={{ fontWeight: "bold", fontSize: "1.6em", }}> Ranking HSM </div>
                                <Tooltip title={`${t(langKeys.rankinghsmtooltip)}`} placement="top-end">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </div>
                        </div>
                        <div style={{ height: 240 }}>
                            <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                                <BarChart data={dataHSMRANK}>
                                    <XAxis domain={["",""]} type="category" dataKey="templatename" height={50} label={{ value: `${t(langKeys.templatename)}`, position: 'insideBottom', offset: 5 }} />
                                    <YAxis label={{ value: `${t(langKeys.hsmquantitysimple)}`, angle: -90, position: 'insideLeft' }} />
                                    <RechartsTooltip formatter={(value: any, name: any) => [value, t(name)]} />
                                    <Bar dataKey="quantity" fill="#8884d8" >
                                        {dataHSMRANK.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Box>
                </div>
                <div className={classes.replacerowzyx}>
                    <Box
                        className={classes.itemCard}
                        style={{ width: "50%" }}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={() => downloaddata("aPPHSM")} className={classes.styleicon} />
                        </div>
                        <div style={{ width: "100%" }}>
                            <div style={{ display: "flex" }}>
                                <div style={{ fontWeight: "bold", fontSize: "1.6em", }}> {t(langKeys.numberofHSMShipments)} </div>
                                <Tooltip title={`${t(langKeys.numberofHSMShipmentstooltip)}`} placement="top-end">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </div>
                        </div>
                        <div style={{ height: 240 }}>
                            <ResponsiveContainer width="100%" aspect={4.0 / 1.0}>
                                <BarChart data={dataAppRank}>
                                    <XAxis domain={["",""]} type="category" dataKey="application" height={50} label={{ value: `${t(langKeys.employeeaplication)}`, position: 'insideBottom', offset: 5 }} />
                                    <YAxis label={{ value: `${t(langKeys.hsmquantitysimple)}`, angle: -90, position: 'insideLeft' }} />
                                    <RechartsTooltip formatter={(value: any, name: any) => [value, t(name)]} />
                                    <Bar dataKey="quantity" fill="#8884d8" >
                                        {dataAppRank.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Box>
                </div>
                <div className={classes.replacerowzyx} >
                    <Box
                        className={classes.itemCard}
                        style={{ width: "50%" }}
                    >
                        <div className={classes.downloadiconcontainer}>
                            <CloudDownloadIcon onClick={() => downloaddata("MESSAGEPERDAY")} className={classes.styleicon} />
                        </div>
                        <div style={{ width: "100%" }}>
                            <div style={{ display: "flex" }}>
                                <div style={{ fontWeight: "bold", fontSize: "1.6em", }}>{t(langKeys.messagesbyday)}</div>
                                <Tooltip title={`${t(langKeys.hsmperdaytooltip)}`} placement="top-end">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </div>
                        </div>
                        <div style={{ height: 240 }}>
                            <ResponsiveContainer width="100%" aspect={4.0 / 1.0} >
                                <ComposedChart
                                    data={dataMENSAJEXDIA}
                                >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <XAxis domain={["",""]} type="category" height={50} dataKey="fecha" scale="band">
                                        <Label
                                            value={`${t(langKeys.day)}`}
                                            position="insideBottom"
                                            offset={5}
                                        />
                                    </XAxis>
                                    <YAxis label={{ value: `${t(langKeys.hsmquantitysimple)}`, angle: -90, position: 'insideLeft' }} />
                                    <RechartsTooltip formatter={(value: any, name: any) => [value, t(name)]} />
                                    <Legend verticalAlign="top" formatter={(value: any, entry: any) => t(value)} />
                                    <Bar dataKey="total" barSize={20} fill="#2499ee" />
                                    <Line type="monotone" dataKey="attended" stroke="#52307c" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </Box>
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardOperationalPush;