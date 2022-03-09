import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { Dictionary } from "@types";
import { exportExcel, getCommChannelLst, getdashboardRankingPushDataSel, getdashboardRankingPushSel, getdashboardPushSUMMARYSelData, getDateCleaned, getLabelsSel, getValuesFromDomain} from "common/helpers";
import { DateRangePicker, DialogZyx, FieldMultiSelect } from "components";
import { useSelector } from "hooks";
import { CalendarIcon } from "icons";
import { langKeys } from "lang/keys";
import { FC, Fragment, useEffect, useState } from "react";
import { Range } from 'react-date-range';
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { getCollectionAux, getMultiCollection, getMultiCollectionAux, resetMainAux, resetMultiMainAux } from "store/main/actions";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

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

const DashboardTagRanking: FC = () => {
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const remultiaux = useSelector(state => state.main.multiDataAux);
    const resaux = useSelector(state => state.main.mainAux);
    const [downloaddatafile,setdownloaddatafile]=useState(false);
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
    const [dataLabel, setdataLabel] = useState<any>([]);
    const [datacategoriaHSM, setdatacategoriaHSM] = useState<any>([]);
    const [dataAppRank, setdataAppRank] = useState<any>([]);
    const [searchfields, setsearchfields] = useState({
        queue: "",
        provider: "",
        channels: "",
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
        }
        dispatch(showBackdrop(true));
        setOpenDialog(false)
        dispatch(getMultiCollectionAux([
            getdashboardRankingPushSel(tosend)
        ]))
        setWaitSave(true)
    }
    useEffect(() => {
        if (waitSave) {
            if (!remultiaux.loading && !remultiaux.error) {
                console.log(remultiaux.data[0].data)
                setdataAppRank(remultiaux.data[0].data)
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
            setdataLabel(multiData[3] && multiData[3].success ? multiData[3].data : []);
            setdatacategoriaHSM(multiData[4] && multiData[4].success ? multiData[4].data : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainResult])
    useEffect(() => {
        dispatch(getMultiCollection([
            getValuesFromDomain("GRUPOS"),
            getValuesFromDomain("EMPRESA"),
            getCommChannelLst(),
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
        if(downloaddatafile) {
            if(!resaux.loading){
                if (resaux.data.length > 0) {
                    exportExcel(titlefile, resaux.data, Object.keys(resaux.data[0]).reduce((ac: any[], c: any) => (
                        [
                            ...ac,
                            { Header: t((langKeys as any)[`dashboard_operationalpush_${section}_${c}`]), accessor: c }
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
            category: searchfields.categoriaHSM,
        }
        setdownloaddatafile(true)
        if (tipeoffilter === "SUMMARY") {
            settitlefile(t(langKeys.messagesentreceivedfailedanswered));
            setSection('summary')
            dispatch(getCollectionAux(getdashboardPushSUMMARYSelData(tosend)))
        }else{
            settitlefile(t(langKeys.numberofHSMShipments));
            setSection('application')
            dispatch(getCollectionAux(getdashboardRankingPushDataSel(tosend)))
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
                <div className={classes.maintitle}> {t(langKeys.tagranking)}</div>
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
                            <CloudDownloadIcon onClick={()=>downloaddata("aPPHSM")} className={classes.styleicon}/>
                        </div>
                        <div style={{width: "100%"}}> 
                            <div style={{display: "flex"}}>
                                <div style={{fontWeight: "bold",fontSize: "1.6em",}}> {t(langKeys.tagranking)} </div>
                                {/*<Tooltip title={`${t(langKeys.numberofHSMShipmentstooltip)}`} placement="top-end">
                                    <InfoIcon style={{padding: "5px 0 0 5px"}} />

                                    
                                            {dataAppRank?.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
    </Tooltip>*/}
                            </div>
                        </div>
                            <div style={{width: "100%"}}>
                                <ResponsiveContainer width="100%"  aspect={4.0 / 1.0}>
                                    <BarChart data={dataAppRank} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" height={50} domain={[0, 'dataMax']}  label={{ value: `${t(langKeys.quantity)}`, position: 'insideBottom' }}/>
                                        <YAxis type="category" width={80} dataKey="tag"  label={{ width:80, value: `Tags`, angle: -90, position: 'insideLeft' }}/>
                                        <RechartsTooltip />
                                        <Bar dataKey="quantity" fill="#8884d8" >
                                            {dataAppRank?.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                    </Box>
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardTagRanking;