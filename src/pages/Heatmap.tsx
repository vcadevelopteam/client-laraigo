/* eslint-disable react-hooks/exhaustive-deps */
import { Button, createStyles, makeStyles, Tabs, TextField, Theme } from '@material-ui/core';
import { AntTab } from 'components';
import { langKeys } from 'lang/keys';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { DateRangePicker, FieldMultiSelect } from "components";
import { Range } from 'react-date-range';
import { useTranslation } from 'react-i18next';
import { CalendarIcon } from '../icons/index';
import { useDispatch } from 'react-redux';
import { showBackdrop } from 'store/popus/actions';
import { heatmappage1 } from 'common/helpers/requestBodies';
import { getCollection, getMultiCollection} from 'store/main/actions';
import { useSelector } from 'hooks';
import { Dictionary } from '@types';
import TableZyx from 'components/fields/table-simple';

const hours=["00:00 a 01:00","01:00 a 02:00","02:00 a 03:00","03:00 a 04:00","04:00 a 05:00","05:00 a 06:00","06:00 a 07:00","07:00 a 08:00","08:00 a 09:00","09:00 a 10:00","10:00 a 11:00","11:00 a 12:00",
                       "12:00 a 13:00","13:00 a 14:00","14:00 a 15:00","15:00 a 16:00","16:00 a 17:00","17:00 a 18:00","18:00 a 19:00","19:00 a 20:00","20:00 a 21:00","21:00 a 22:00","22:00 a 23:00","23:00 a 00:00","TOTAL"]
const hoursProm=["00:00 a 01:00","01:00 a 02:00","02:00 a 03:00","03:00 a 04:00","04:00 a 05:00","05:00 a 06:00","06:00 a 07:00","07:00 a 08:00","08:00 a 09:00","09:00 a 10:00","10:00 a 11:00","11:00 a 12:00",
                       "12:00 a 13:00","13:00 a 14:00","14:00 a 15:00","15:00 a 16:00","16:00 a 17:00","17:00 a 18:00","18:00 a 19:00","19:00 a 20:00","20:00 a 21:00","21:00 a 22:00","22:00 a 23:00","23:00 a 00:00","PRM"]

const initialRange = {
    startDate: new Date(new Date().setDate(0)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}
const format = (date: Date) => date.toISOString().split('T')[0];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        itemDate: {
            minHeight: 40,
            height: 40,
            border: '1px solid #bfbfc0',
            borderRadius: 4,
            width: "100%",
            color: 'rgb(143, 146, 161)'
        },
        fieldsfilter: {
            width: "100%",
        },
    })
)

const MainHeatMap: React.FC = () => {
    
    const { t } = useTranslation();
    const classes = useStyles();
    const [realizedsearch, setrealizedsearch] = useState(false); 
    const [heatMapConversationsData, setheatMapConversationsData] = useState<any>([]);
    const [heatMapConversations, setheatMapConversations] = useState<any>([]);
    const [firstnavresult, setfirstnavresult] = useState<any>([]);
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const dataAdvisor = [{domaindesc: t(langKeys.advisor), domainvalue: "ASESOR"},{domaindesc: "Bot", domainvalue: "BOT"}]
    const [dataMainHeatMap, setdataMainHeatMap] = useState({
        communicationchannel: "",
        closedby: "ASESOR",
        startdate: new Date(new Date().setDate(1)),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    });
    
    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let startdate = new Date(year, mes-1, 1)
        let enddate = new Date(year, mes, 0)
        let datetoshow = `${startdate.getFullYear()}-${String(startdate.getMonth()+1).padStart(2, '0')}`
        setdataMainHeatMap(prev=>({...prev,startdate,enddate,datetoshow}))
    }
    useEffect(() => {
        if(!multiData.loading && realizedsearch){
            setrealizedsearch(false)
            dispatch(showBackdrop(false))
            setfirstnavresult(multiData.data?multiData.data[0].data:[])
            initAtencionesxFechaAsesorGrid()
        }
    }, [multiData])
    useEffect(() => {
        search()
    }, [])
    function search(){
        setrealizedsearch(true)
        dispatch(showBackdrop(true))
        dispatch(getMultiCollection([
            heatmappage1(dataMainHeatMap)
        ]));
        dispatch(getCollection(heatmappage1(dataMainHeatMap)))
    }
    function initAtencionesxFechaAsesorGrid(){
        debugger
    }
    return (
        <div>
            <div style={{width:"100%", display: "flex", paddingTop: 10}}>
                <div style={{flex:1, paddingRight: "10px",}}>
                    <TextField
                        id="date"
                        className={classes.fieldsfilter}
                        type="month"
                        variant="outlined"
                        onChange={(e)=>handleDateChange(e.target.value)}
                        value={dataMainHeatMap.datetoshow}
                        size="small"
                    />
                </div>
                <div style={{flex:1}}>
                    <FieldMultiSelect
                        label={t(langKeys.advisor)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => { setdataMainHeatMap(p => ({ ...p, closedby: value.map((o: Dictionary) => o.domainvalue).join() })) }}
                        valueDefault={dataMainHeatMap.closedby}
                        data={dataAdvisor}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div style={{flex:1, paddingLeft: 20}}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "100%", backgroundColor: "#007bff" }}
                        onClick={() => search()}
                    >{t(langKeys.search)}
                    </Button>
                </div>
            </div>
        </div>
    )
}
const HeatMapAsesor: React.FC = () => {
    
    const { t } = useTranslation();
    const classes = useStyles();
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const dataAdvisor = [{domaindesc: t(langKeys.advisor), domainvalue: "ASESOR"},{domaindesc: "Bot", domainvalue: "BOT"}]
    return (
        <div>
            <div style={{width:"100%", display: "flex", paddingTop: 10}}>
                <div style={{flex:1, paddingRight: "10px",}}>
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
                </div>
                <div style={{flex:1, paddingRight: 10}}>
                    <FieldMultiSelect
                        label={t(langKeys.advisor)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        //onChange={(value) => { setsearchfields(p => ({ ...p, queue: value.map((o: Dictionary) => o.domainvalue).join() })) }}
                        //valueDefault={searchfields.queue}
                        data={dataAdvisor}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div style={{flex:1}}>
                    <FieldMultiSelect
                        label={t(langKeys.company)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        //onChange={(value) => { setsearchfields(p => ({ ...p, queue: value.map((o: Dictionary) => o.domainvalue).join() })) }}
                        //valueDefault={searchfields.queue}
                        data={dataAdvisor}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div style={{flex:1, paddingLeft: 20}}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "100%", backgroundColor: "#007bff" }}
                        //onClick={() => setOpenDialog(true)}
                    >{t(langKeys.search)}
                    </Button>
                </div>
            </div>
        </div>
    )
}
const HeatMapTicket: React.FC = () => {
    
    const { t } = useTranslation();
    const classes = useStyles();
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const dataAdvisor = [{domaindesc: t(langKeys.advisor), domainvalue: "ASESOR"},{domaindesc: "Bot", domainvalue: "BOT"}]
    return (
        <div>
            <div style={{width:"100%", display: "flex", paddingTop: 10}}>
                <div style={{flex:1, paddingRight: "10px",}}>
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
                </div>
                <div style={{flex:1, paddingLeft: 20}}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "100%", backgroundColor: "#007bff" }}
                        //onClick={() => setOpenDialog(true)}
                    >{t(langKeys.search)}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const Heatmap: FC = () => {
    const [pageSelected, setPageSelected] = useState(0);
    const { t } = useTranslation();
    let triggerMainGrid = true;
    let rulesobj = null;
    return (
        <Fragment>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={t(langKeys.heatmap)}/>
                <AntTab label={t(langKeys.heatmapasesor)}/>
                <AntTab label={t(langKeys.heatmapticket)}/>
            </Tabs>
            {pageSelected === 0 && <MainHeatMap />}
            {pageSelected === 1 && <HeatMapAsesor />}
            {pageSelected === 2 && <HeatMapTicket />}
        </Fragment>
    )
}

export default Heatmap;