/* eslint-disable react-hooks/exhaustive-deps */
import { Button, createStyles, makeStyles, Tabs, TextField, Theme } from '@material-ui/core';
import { AntTab, DialogInteractions, DialogZyx, TemplateSwitchYesNo } from 'components';
import { langKeys } from 'lang/keys';
import React, { FC, Fragment, useEffect, useState ,useCallback} from 'react';
import { FieldMultiSelect } from "components";
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { showBackdrop } from 'store/popus/actions';
import { getasesoresbyorgid, getValuesFromDomain, heatmappage1, heatmappage1detail, heatmappage2, heatmappage2detail1, heatmappage2detail2, heatmappage3, heatmappage3detail } from 'common/helpers/requestBodies';
import { getCollectionAux, getMultiCollection, getMultiCollectionAux, getMultiCollectionAux2, resetMainAux, resetMultiMain, resetMultiMainAux, resetMultiMainAux2 } from 'store/main/actions';
import { useSelector } from 'hooks';
import { Dictionary } from '@types';
import TableZyx from 'components/fields/table-simple';

const hours=["00:00 a 01:00","01:00 a 02:00","02:00 a 03:00","03:00 a 04:00","04:00 a 05:00","05:00 a 06:00","06:00 a 07:00","07:00 a 08:00","08:00 a 09:00","09:00 a 10:00","10:00 a 11:00","11:00 a 12:00",
                       "12:00 a 13:00","13:00 a 14:00","14:00 a 15:00","15:00 a 16:00","16:00 a 17:00","17:00 a 18:00","18:00 a 19:00","19:00 a 20:00","20:00 a 21:00","21:00 a 22:00","22:00 a 23:00","23:00 a 00:00","TOTAL"]
const hoursProm=["00:00 a 01:00","01:00 a 02:00","02:00 a 03:00","03:00 a 04:00","04:00 a 05:00","05:00 a 06:00","06:00 a 07:00","07:00 a 08:00","08:00 a 09:00","09:00 a 10:00","10:00 a 11:00","11:00 a 12:00",
                       "12:00 a 13:00","13:00 a 14:00","14:00 a 15:00","15:00 a 16:00","16:00 a 17:00","17:00 a 18:00","18:00 a 19:00","19:00 a 20:00","20:00 a 21:00","21:00 a 22:00","22:00 a 23:00","23:00 a 00:00","PRM"]


const LIMITHOUR = 24;
const lowestcolornum = parseInt("55bd84",16)
const higuestcolornum = parseInt("fb5f5f",16)

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
        labellink: {
            color: '#7721ad',
            textDecoration: 'underline',
            cursor: 'pointer'
        },
    })
)
function capitalize(word:string){
    let wordlower = word.toLowerCase()
    const words = wordlower.split(" ");
    let wordresult = "";
    for (let i = 0; i < words.length; i++) {
        if(words[i].trim()!==""){
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            wordresult = wordresult + words[i] + " ";
        }
    }
    return wordresult

}

interface ModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => any;
    title: string;
    row: Dictionary | null;
    columns: Dictionary[];
    data: Dictionary[];
}

const ModalHeatMap: React.FC<ModalProps> = ({ openModal, setOpenModal, title = '', row = null, columns = [], data = [] }) => {
    const { t } = useTranslation();

    const handleCancelModal = () => {
        setOpenModal(false);
    }

    return (
        <DialogZyx
            open={openModal}
            title={title}
            maxWidth="lg"
            button1Type="button"
            buttonText1={t(langKeys.close)}
            handleClickButton1={handleCancelModal}
        >
            <TableZyx
                columns={columns}
                data={data}
                download={true}
                pageSizeDefault={20}
                filterGeneral={false}
            />
        </DialogZyx>
    )
}

const MainHeatMap: React.FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [realizedsearch, setrealizedsearch] = useState(false);  
    const [heatMapConversations, setheatMapConversations] = useState<any>([]);
    const [heatMapConversationsData, setheatMapConversationsData] = useState<any>([]);
    const [averageHeatMapTMOTitle, setaverageHeatMapTMOTitle] = useState<any>([]);
    const [averageHeatMapTMOData, setaverageHeatMapTMOData] = useState<any>([]);
    const [heatmapaverageagentTMETitle, setheatmapaverageagentTMETitle] = useState<any>([]);
    const [heatmapaverageagentTMEData, setheatmapaverageagentTMEData] = useState<any>([]);
    const [userAverageReplyTimexFechaTitle, setuserAverageReplyTimexFechaTitle] = useState<any>([]);
    const [userAverageReplyTimexFechaData, setuserAverageReplyTimexFechaData] = useState<any>([]);
    const [personAverageReplyTimexFechaTitle, setpersonAverageReplyTimexFechaTitle] = useState<any>([]);
    const [personAverageReplyTimexFechaData, setpersonAverageReplyTimexFechaData] = useState<any>([]);
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);
    const mainResult = useSelector(state => state.main);
    const dataAdvisor = [{domaindesc: t(langKeys.agent), domainvalue: "ASESOR"},{domaindesc: "Bot", domainvalue: "BOT"}]
    const [dataMainHeatMap, setdataMainHeatMap] = useState({
        communicationchannel: "",
        closedby: "ASESOR",
        startdate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`
    });
    
    const [waitDetail, setWaitDetail] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModalTicket, setOpenModalTicket] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalRow, setModalRow] = useState<Dictionary | null>(null);
    const [modalColumns, setModalColumns] = useState<any>([]);
    const openDialogInteractions = useCallback((row: any) => {
        setOpenModalTicket(true);
        setRowSelected({ ...row, displayname: row.asesor, ticketnum: row.ticketnum })
    }, [mainResult]);
    const fetchDetail = (grid: string, column: Dictionary, row: Dictionary, mes: number, year: number) => {
        if (row.hournum!=="TOTAL" && row.hournum!=="PRM" && ((typeof(row[column.id]) === 'number' && row[column.id] > 0)
        || (typeof(row[column.id]) === 'string' && row[column.id] !== '00:00:00')) ) {
            setModalRow(row);
            const day = column.id.replace('day','');
            const hour = row.hour - 1;
            const hournum = row.hournum.replace('a','-');
            switch (grid) {
                case '1.1':
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`)
                    setModalColumns([
                        { Header: t(langKeys.ticket), accessor: 'ticketnum',
                            Cell: (props: any) => {
                                const row = props.cell.row.original;
                                return <label
                                    className={classes.labellink}
                                    onClick={() => openDialogInteractions(row)}
                                >
                                    {row.ticketnum}
                                </label>
                            }
                        },
                        { Header: t(langKeys.agent), accessor: 'asesor' },
                        { Header: t(langKeys.tmo), accessor: 'totalduration' },
                    ])
                    break;
                case '1.2':
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`)
                    setModalColumns([
                        { Header: t(langKeys.ticket), accessor: 'ticketnum',
                            Cell: (props: any) => {
                                const row = props.cell.row.original;
                                return <label
                                    className={classes.labellink}
                                    onClick={() => openDialogInteractions(row)}
                                >
                                    {row.ticketnum}
                                </label>
                            }
                        },
                        { Header: t(langKeys.tmo), accessor: 'totalduration' },
                        { Header: t(langKeys.agent), accessor: 'asesor' },
                    ])
                    break;
                case '1.3':
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`)
                    setModalColumns([
                        { Header: t(langKeys.ticket), accessor: 'ticketnum',
                            Cell: (props: any) => {
                                const row = props.cell.row.original;
                                return <label
                                    className={classes.labellink}
                                    onClick={() => openDialogInteractions(row)}
                                >
                                    {row.ticketnum}
                                </label>
                            }
                        },
                        { Header: t(langKeys.tme), accessor: 'userfirstreplytime' },
                        { Header: t(langKeys.agent), accessor: 'asesor' },
                    ])
                    break;
                case '1.4':
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`)
                    setModalColumns([
                        { Header: t(langKeys.ticket), accessor: 'ticketnum',
                            Cell: (props: any) => {
                                const row = props.cell.row.original;
                                return <label
                                    className={classes.labellink}
                                    onClick={() => openDialogInteractions(row)}
                                >
                                    {row.ticketnum}
                                </label>
                            }
                        },
                        { Header: t(langKeys.tmr), accessor: 'useraveragereplytime' },
                        { Header: t(langKeys.agent), accessor: 'asesor' },
                    ])
                    break;
                case '1.5':
                    setModalTitle(`Tickets ${t(langKeys.day)} ${day} ${hournum}`)
                    setModalColumns([
                        { Header: t(langKeys.ticket), accessor: 'ticketnum',
                            Cell: (props: any) => {
                                const row = props.cell.row.original;
                                return <label
                                    className={classes.labellink}
                                    onClick={() => openDialogInteractions(row)}
                                >
                                    {row.ticketnum}
                                </label>
                            }
                        },
                        { Header: t(langKeys.tmr_client), accessor: 'personaveragereplytime' },
                    ])
                    break;
                default:
                    break;
            }
            dispatch(getMultiCollectionAux2([heatmappage1detail({
                ...dataMainHeatMap,
                startdate: new Date(year, mes-1, day),
                enddate: new Date(year, mes-1, day),
                horanum: ['TOTAL','PRM'].includes(row.hournum) ? '' : hour
            })]));
            dispatch(showBackdrop(true));
            setWaitDetail(true);
        }
    }

    useEffect(() => {
        if(waitDetail) {
            if (!multiDataAux2.loading){
                dispatch(showBackdrop(false));
                setWaitDetail(false);
                setOpenModal(true);
            }
        }
    }, [multiDataAux2])
    
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
            if(multiData.data[0].key === "UFN_REPORT_HEATMAP_PAGE1_SEL"){
                initAtencionesxFechaAsesorGrid(multiData.data[0]?.data||[])
                averageHeatMapTMO(multiData.data[0]?.data||[])
                initUserFirstReplyTimexFechaGrid(multiData.data[0]?.data||[])
                initUserAverageReplyTimexFechaGrid(multiData.data[0]?.data||[])
                initPersonAverageReplyTimexFechaGrid(multiData.data[0]?.data||[])
            }else{
                initAtencionesxFechaAsesorGrid([])
                averageHeatMapTMO([])
                initUserFirstReplyTimexFechaGrid([])
                initUserAverageReplyTimexFechaGrid([])
                initPersonAverageReplyTimexFechaGrid([]) 
            }
        }
    }, [multiData,realizedsearch])

    useEffect(() => {
        search()
    }, [])

    function search(){
        setheatMapConversationsData([])
        setaverageHeatMapTMOData([])
        setheatmapaverageagentTMEData([])
        setuserAverageReplyTimexFechaData([])
        setpersonAverageReplyTimexFechaData([])
        setrealizedsearch(true)
        dispatch(showBackdrop(true))
        dispatch(getMultiCollection([
            heatmappage1(dataMainHeatMap)
        ]));
    }

    function initAtencionesxFechaAsesorGrid(data:any){
        let arrayfree: any = [];
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let rowmax = 0;
        let dateend = new Date(year, mes, 0).getDate()
        let arrayvalidvalues=new Array(24).fill(0);

        for(let i = 1; i <= LIMITHOUR+1; i++) {
            const objectfree: Dictionary = {
                hour: i,
                hournum: hours[i - 1],
            }
            for(let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = 0;
            }
            objectfree[`totalcol`] = 0;
            arrayfree.push(objectfree);
        }
        
        data.forEach( (row:any) => {
            
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.hora;     
            arrayvalidvalues[row.horanum]++
            arrayfree = arrayfree.map((x:any) => x.hournum === hour ? ({
                ...x, 
                [`day${day}`]: x[`day${day}`] + row.atencionesxfecha,
                [`totalcol`]: (x.totalcol + row.atencionesxfecha)
            }) : x) 
            
            rowmax = row.atencionesxfecha>rowmax ? row.atencionesxfecha:rowmax;
            arrayfree[24][`day${day}`] += row.atencionesxfecha;
            arrayfree[24][`totalcol`] += row.atencionesxfecha;
        });
        arrayvalidvalues.forEach((x,i)=>{
            if(x!==0){
                arrayfree[i].totalcol = arrayfree[i].totalcol/x 
            }
        })
        setheatMapConversationsData(arrayfree)

        function gradient(num:number,rowcounter:number){
            let scale = num/rowmax
            if(isNaN(scale)) scale=0

            if ( rowcounter >= 24 ) {
                return "FFFFFF";
            }

            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }
        
        let rowcounter = 0;
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                const column = props.cell.column;
                const row = props.cell.row.original;
                if (key !== "totalcol") {
                    let color = "white"
                    if (props.data[rowcounter]) {
                        color = gradient(parseInt(props.data[rowcounter][key]),rowcounter)
                    }
                    return (
                        <div
                            style={{background: `#${color}`, textAlign: "center", color:"black"}}
                            onClick={() => fetchDetail('1.1', column, row,mes,year)}
                        >
                            {(props.data[rowcounter][key])}
                        </div>
                    )
                }
                else {
                    if (rowcounter < 24)
                        rowcounter++;
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{props.data[rowcounter-1][key]>0?(props.data[rowcounter-1][key].toFixed(2)):"0"}</div>
                }
            },
        }));
        setheatMapConversations([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }

    function averageHeatMapTMO(data:any) {
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let dateend = new Date(year, mes, 0).getDate()
        let rowmax = 0;    
        let arrayfree:any = [];
        let arrayvalidvalues=new Array(25).fill(0);
        let arrayvalidvaluesmonth=new Array(32).fill(0);
        const LIMITHOUR = 24;

        for(let i = 1; i <= LIMITHOUR+1; i++) {
            const objectfree: Dictionary  = {
                hour: i,
                hournum: hoursProm[i - 1],
            }
            for(let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = "00:00:00";
            }
            objectfree[`totalcol`] = "00:00:00";
            arrayfree.push(objectfree);
        }

        data.forEach((row:any)=>{
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.hora;
            let timespent = row.totaldurationxfecha.split(':')
            let seconds = parseInt(timespent[0])*3600+parseInt(timespent[1])*60+parseInt(timespent[2])
            arrayfree = arrayfree.map((x:any) => x.hournum === hour ? ({...x, [`day${day}`]: row.totaldurationxfecha}) : x) 
            rowmax = seconds>rowmax ? seconds:rowmax;
            arrayvalidvalues[row.horanum]++
            arrayvalidvaluesmonth[day-1]++
            arrayfree.forEach((x:any) => {
                    if (x.hournum === hour){
                        let timespenttotal = x["totalcol"].split(':')
                        let secondstotalnum = ((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)
                        let hh= Math.floor(secondstotalnum/3600)
                        let mm= Math.floor((secondstotalnum-hh*3600)/60)
                        let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                        x["totalcol"] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
                        
                    }
                }
            )
            
            if(arrayvalidvaluesmonth[day-1] === 0){
                arrayfree[24][`day${day}`] = `00:00:00`
            }else{
                let timespenttotal = arrayfree[24][`day${day}`].split(':')
                let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
                let hh= Math.floor(secondstotalnum/3600)
                let mm= Math.floor((secondstotalnum-hh*3600)/60)
                let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[24][`day${day}`]=hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
                timespenttotal = arrayfree[24].totalcol.split(':')
                secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
                hh= Math.floor(secondstotalnum/3600)
                mm= Math.floor((secondstotalnum-hh*3600)/60)
                ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[24].totalcol = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            }
        })

        arrayvalidvaluesmonth.forEach((x,i)=>{
            if(x!==0){
                let timetoconvert = arrayfree[24][`day${i+1}`].split(':')
                let secondstotalnum = (((timetoconvert[0])*3600+(timetoconvert[1])*60+parseInt(timetoconvert[2])))/x
                let hh= Math.floor(secondstotalnum/3600)
                let mm= Math.floor((secondstotalnum-hh*3600)/60)
                let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[24][`day${i+1}`] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            }
        })

        arrayvalidvalues.forEach((x,i)=>{
            if(x!==0){
                let timetoconvert = arrayfree[i][`totalcol`].split(':')
                let secondstotalnum = (((timetoconvert[0])*3600+(timetoconvert[1])*60+parseInt(timetoconvert[2])))/x
                let hh= Math.floor(secondstotalnum/3600)
                let mm= Math.floor((secondstotalnum-hh*3600)/60)
                let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[i][`totalcol`]= hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            }
        })
        setaverageHeatMapTMOData(arrayfree)
                
        function gradient(num:number,rowcounter:number){
            let scale = num/rowmax
            if(isNaN(scale)) scale=0
            if ( rowcounter >= 24 ) {
                return "FFFFFF";
            }
            
            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }
        
        let rowcounter = 0;

        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                const column = props.cell.column;
                const row = props.cell.row.original;
                if (key !== "totalcol") {
                    let color = "white"                    
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    let seconds = parseInt(timespenttotal[0])*3600+parseInt(timespenttotal[1])*60+parseInt(timespenttotal[2])
                    if (props.data[rowcounter]) {
                        color = gradient(seconds,rowcounter)
                    }
                    return (
                        <div
                            style={{background: `#${color}`, textAlign: "center", color:"black"}}
                            onClick={() => fetchDetail('1.2', column, row,mes,year)}
                        >
                            {`${hh}${mm}${ss}s`}
                        </div>
                    )
                }
                else {
                    if (rowcounter < 24)
                        rowcounter++;
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{`${hh}${mm}${ss}s`}</div>
                }
            },
        }));
        setaverageHeatMapTMOTitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }

    function initUserFirstReplyTimexFechaGrid(data:any) {
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let dateend = new Date(year, mes, 0).getDate()
        let rowmax = 0;    
        let arrayfree:any = [];
        
        let arrayvalidvalues=new Array(25).fill(0);
        let arrayvalidvaluesmonth=new Array(32).fill(0);
        const LIMITHOUR = 24;

        for(let i = 1; i <= LIMITHOUR+1; i++) {
            const objectfree: Dictionary  = {
                hour: i,
                hournum: hoursProm[i - 1],
            }
            for(let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = "00:00:00";
            }
            objectfree[`totalcol`] = "00:00:00";
            arrayfree.push(objectfree);
        }

        data.forEach((row:any)=>{
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.hora;
            let timespent = row.userfirstreplytimexfecha.split(':')
            let seconds = parseInt(timespent[0])*3600+parseInt(timespent[1])*60+parseInt(timespent[2])
            
            arrayfree = arrayfree.map((x:any) => x.hournum === hour ? ({...x, [`day${day}`]: row.userfirstreplytimexfecha}) : x) 
            rowmax = seconds>rowmax ? seconds:rowmax;
            arrayvalidvalues[row.horanum]++
            arrayvalidvaluesmonth[day-1]++
            arrayfree.forEach((x:any) => {
                    if (x.hournum === hour){
                        let timespenttotal = x["totalcol"].split(':')
                        let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
                        let hh= Math.floor(secondstotalnum/3600)
                        let mm= Math.floor((secondstotalnum-hh*3600)/60)
                        let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                        x["totalcol"] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
                        
                    }
                }
            )
            let timespenttotal = arrayfree[24][`day${day}`].split(':')
            let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
            let hh= Math.floor(secondstotalnum/3600)
            let mm= Math.floor((secondstotalnum-hh*3600)/60)
            let ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24][`day${day}`]=hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            timespenttotal = arrayfree[24].totalcol.split(':')
            secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
            hh= Math.floor(secondstotalnum/3600)
            mm= Math.floor((secondstotalnum-hh*3600)/60)
            ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24].totalcol = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
        })
        
        arrayvalidvaluesmonth.forEach((x,i)=>{
            if(x!==0){
                let timetoconvert = arrayfree[24][`day${i+1}`].split(':')
                let secondstotalnum = (((timetoconvert[0])*3600+(timetoconvert[1])*60+parseInt(timetoconvert[2])))/x
                let hh= Math.floor(secondstotalnum/3600)
                let mm= Math.floor((secondstotalnum-hh*3600)/60)
                let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[24][`day${i+1}`] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            }
        })

        arrayvalidvalues.forEach((x,i)=>{
            if(x!==0){
                let timetoconvert = arrayfree[i][`totalcol`].split(':')
                let secondstotalnum = (((timetoconvert[0])*3600+(timetoconvert[1])*60+parseInt(timetoconvert[2])))/x
                let hh= Math.floor(secondstotalnum/3600)
                let mm= Math.floor((secondstotalnum-hh*3600)/60)
                let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[i][`totalcol`]= hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            }
        })

        setheatmapaverageagentTMEData(arrayfree)
                
        function gradient(num:number,rowcounter:number){
            let scale = num/rowmax
            if(isNaN(scale)) scale=0
            if ( rowcounter >= 24 ) {
                return "FFFFFF";
            }
            
            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }

        let rowcounter = 0;

        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                const column = props.cell.column;
                const row = props.cell.row.original;
                if (key!=="totalcol") {
                    
                    let color = "white"
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    let seconds = parseInt(timespenttotal[0])*3600+parseInt(timespenttotal[1])*60+parseInt(timespenttotal[2])
                    if (props.data[rowcounter]) {
                        color = gradient(seconds,rowcounter)
                    }
                    return (
                        <div
                            style={{background: `#${color}`, textAlign: "center", color:"black"}}
                            onClick={() => fetchDetail('1.3', column, row,mes,year)}
                        >
                            {`${hh}${mm}${ss}s`}
                        </div>
                    )
                }
                else {
                    if (rowcounter < 24)
                        rowcounter++;
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{`${hh}${mm}${ss}s`}</div>
                }
            },
        }));

        setheatmapaverageagentTMETitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }

    function initUserAverageReplyTimexFechaGrid(data:any) {
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let dateend = new Date(year, mes, 0).getDate()
        let rowmax = 0;    
        let arrayfree:any = [];
        const LIMITHOUR = 24;
        let arrayvalidvalues=new Array(25).fill(0);
        let arrayvalidvaluesmonth=new Array(32).fill(0);

        for(let i = 1; i <= LIMITHOUR+1; i++) {
            const objectfree: Dictionary  = {
                hour: i,
                hournum: hoursProm[i - 1],
            }
            for(let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = "00:00:00";
            }
            objectfree[`totalcol`] = "00:00:00";
            arrayfree.push(objectfree);
        }

        data.forEach((row:any)=>{
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.hora;
            let timespent = row.useraveragereplytimexfecha.split(':')
            let seconds = parseInt(timespent[0])*3600+parseInt(timespent[1])*60+parseInt(timespent[2])
            
            arrayfree = arrayfree.map((x:any) => x.hournum === hour ? ({...x, [`day${day}`]: row.useraveragereplytimexfecha}) : x) 
            rowmax = seconds>rowmax ? seconds:rowmax;
            arrayvalidvalues[row.horanum]++
            arrayvalidvaluesmonth[day-1]++
            arrayfree.forEach((x:any) => {
                    if (x.hournum === hour){
                        let timespenttotal = x["totalcol"].split(':')
                        let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
                        let hh= Math.floor(secondstotalnum/3600)
                        let mm= Math.floor((secondstotalnum-hh*3600)/60)
                        let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                        x["totalcol"] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
                        
                    }
                }
            )
            let timespenttotal = arrayfree[24][`day${day}`].split(':')
            let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
            let hh= Math.floor(secondstotalnum/3600)
            let mm= Math.floor((secondstotalnum-hh*3600)/60)
            let ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24][`day${day}`]=hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            timespenttotal = arrayfree[24].totalcol.split(':')
            secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
            hh= Math.floor(secondstotalnum/3600)
            mm= Math.floor((secondstotalnum-hh*3600)/60)
            ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24].totalcol = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
        })

        arrayvalidvaluesmonth.forEach((x,i)=>{
            if(x!==0){
                let timetoconvert = arrayfree[24][`day${i+1}`].split(':')
                let secondstotalnum = (((timetoconvert[0])*3600+(timetoconvert[1])*60+parseInt(timetoconvert[2])))/x
                let hh= Math.floor(secondstotalnum/3600)
                let mm= Math.floor((secondstotalnum-hh*3600)/60)
                let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[24][`day${i+1}`] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            }
        })

        arrayvalidvalues.forEach((x,i)=>{
            if(x!==0){
                let timetoconvert = arrayfree[i][`totalcol`].split(':')
                let secondstotalnum = (((timetoconvert[0])*3600+(timetoconvert[1])*60+parseInt(timetoconvert[2])))/x
                let hh= Math.floor(secondstotalnum/3600)
                let mm= Math.floor((secondstotalnum-hh*3600)/60)
                let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[i][`totalcol`]= hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            }
        })

        setuserAverageReplyTimexFechaData(arrayfree)
                
        function gradient(num:number,rowcounter:number){
            let scale = num/rowmax
            if(isNaN(scale)) scale=0
            if ( rowcounter >= 24 ) {
                return "FFFFFF";
            }
            
            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }
        
        let rowcounter = 0;

        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                const column = props.cell.column;
                const row = props.cell.row.original;
                if (key !== "totalcol") {
                    let color = "white"                    
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    let seconds = parseInt(timespenttotal[0])*3600+parseInt(timespenttotal[1])*60+parseInt(timespenttotal[2])
                    if (props.data[rowcounter]) {
                        color = gradient(seconds,rowcounter)
                    }
                    return (
                        <div
                            style={{background: `#${color}`, textAlign: "center", color:"black"}}
                            onClick={() => fetchDetail('1.4', column, row,mes,year)}
                        >
                            {`${hh}${mm}${ss}s`}
                        </div>
                    )
                }
                else {
                    if (rowcounter < 24)
                        rowcounter++;
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{`${hh}${mm}${ss}s`}</div>
                }
            },
        }));

        setuserAverageReplyTimexFechaTitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }

    function initPersonAverageReplyTimexFechaGrid(data:any) {
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let dateend = new Date(year, mes, 0).getDate()
        let rowmax = 0;    
        let arrayfree:any = [];
        const LIMITHOUR = 24;
        let arrayvalidvalues=new Array(25).fill(0);
        let arrayvalidvaluesmonth=new Array(32).fill(0);

        for(let i = 1; i <= LIMITHOUR+1; i++) {
            const objectfree: Dictionary  = {
                hour: i,
                hournum: hoursProm[i - 1],
            }
            for(let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = "00:00:00";
            }
            objectfree[`totalcol`] = "00:00:00";
            arrayfree.push(objectfree);
        }

        data.forEach((row:any)=>{
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.hora;
            let timespent = row.personaveragereplytimexfecha.split(':')
            let seconds = parseInt(timespent[0])*3600+parseInt(timespent[1])*60+parseInt(timespent[2])
            
            arrayfree = arrayfree.map((x:any) => x.hournum === hour ? ({...x, [`day${day}`]: row.personaveragereplytimexfecha}) : x) 
            rowmax = seconds>rowmax ? seconds:rowmax;
            arrayvalidvalues[row.horanum]++
            arrayvalidvaluesmonth[day-1]++
            arrayfree.forEach((x:any) => {
                    if (x.hournum === hour){
                        let timespenttotal = x["totalcol"].split(':')
                        let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
                        let hh= Math.floor(secondstotalnum/3600)
                        let mm= Math.floor((secondstotalnum-hh*3600)/60)
                        let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                        x["totalcol"] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
                        
                    }
                }
            )
            let timespenttotal = arrayfree[24][`day${day}`].split(':')
            let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
            let hh= Math.floor(secondstotalnum/3600)
            let mm= Math.floor((secondstotalnum-hh*3600)/60)
            let ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24][`day${day}`]=hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            timespenttotal = arrayfree[24].totalcol.split(':')
            secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds))
            hh= Math.floor(secondstotalnum/3600)
            mm= Math.floor((secondstotalnum-hh*3600)/60)
            ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24].totalcol = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
        })

        arrayvalidvaluesmonth.forEach((x,i)=>{
            if(x!==0){
                let timetoconvert = arrayfree[24][`day${i+1}`].split(':')
                let secondstotalnum = (((timetoconvert[0])*3600+(timetoconvert[1])*60+parseInt(timetoconvert[2])))/x
                let hh= Math.floor(secondstotalnum/3600)
                let mm= Math.floor((secondstotalnum-hh*3600)/60)
                let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[24][`day${i+1}`] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            }
        })

        arrayvalidvalues.forEach((x,i)=>{
            if(x!==0){
                let timetoconvert = arrayfree[i][`totalcol`].split(':')
                let secondstotalnum = (((timetoconvert[0])*3600+(timetoconvert[1])*60+parseInt(timetoconvert[2])))/x
                let hh= Math.floor(secondstotalnum/3600)
                let mm= Math.floor((secondstotalnum-hh*3600)/60)
                let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                arrayfree[i][`totalcol`]= hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            }
        })

        setpersonAverageReplyTimexFechaData(arrayfree)
                
        function gradient(num:number,rowcounter:number){
            let scale = num/rowmax
            if(isNaN(scale)) scale=0
            if ( rowcounter >= 24 ) {
                return "FFFFFF";
            }
            
            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }
        
        let rowcounter = 0;

        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                const column = props.cell.column;
                const row = props.cell.row.original;
                if (key !== "totalcol") {
                    let color = "white"                    
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    let seconds = parseInt(timespenttotal[0])*3600+parseInt(timespenttotal[1])*60+parseInt(timespenttotal[2])
                    if (props.data[rowcounter]) {
                        color = gradient(seconds,rowcounter)
                    }
                    return (
                        <div
                            style={{background: `#${color}`, textAlign: "center", color:"black"}}
                            onClick={() => fetchDetail('1.5', column, row,mes,year)}
                        >
                            {`${hh}${mm}${ss}s`}
                        </div>
                    )
                }
                else {
                    if (rowcounter < 24)
                        rowcounter++;
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{`${hh}${mm}${ss}s`}</div>
                }
            },
        }));

        setpersonAverageReplyTimexFechaTitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
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
            {
                heatMapConversationsData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={heatMapConversations}
                        titlemodule={t(langKeys.conversationheatmap)}
                        data={heatMapConversationsData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            {
                averageHeatMapTMOData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={averageHeatMapTMOTitle}
                        titlemodule={t(langKeys.averageheatmapTMOdata)}
                        data={averageHeatMapTMOData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            {
                heatmapaverageagentTMEData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={heatmapaverageagentTMETitle}
                        titlemodule={t(langKeys.heatmapaverageagentTME)}
                        data={heatmapaverageagentTMEData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            {
                userAverageReplyTimexFechaData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={userAverageReplyTimexFechaTitle}
                        titlemodule={t(langKeys.userAverageReplyTimexFecha)}
                        data={userAverageReplyTimexFechaData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            {
                personAverageReplyTimexFechaData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={personAverageReplyTimexFechaTitle}
                        titlemodule={t(langKeys.personAverageReplyTimexFecha)}
                        data={personAverageReplyTimexFechaData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            <ModalHeatMap
                openModal={openModal}
                setOpenModal={setOpenModal}
                title={modalTitle}
                row={modalRow}
                columns={modalColumns}
                data={multiDataAux2.data[0]?.data||[]}
            />
            <DialogInteractions
                openModal={openModalTicket}
                setOpenModal={setOpenModalTicket}
                ticket={rowSelected}
            />
        </div>
    )
}

const HeatMapAsesor: React.FC<{companydomain: any,groupsdomain: any}> = ({companydomain,groupsdomain}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [realizedsearch, setrealizedsearch] = useState(false);
    const [completadosxAsesorData, setCompletadosxAsesorData] = useState<any>([]);
    const [completadosxAsesorTitle, setCompletadosxAsesorTitle] = useState<any>([]);
    const [cantidadOportunidadesData, setCantidadOportunidadesData] = useState<any>([]);
    const [cantidadOportunidadesTitle, setCantidadOportunidadesTitle] = useState<any>([]);
    const [abandonosxAsesorData, setabandonosxAsesorData] = useState<any>([]);
    const [abandonosxAsesorTitle, setabandonosxAsesorTitle] = useState<any>([]);
    const [tasaAbandonosxAsesorData, settasaAbandonosxAsesorData] = useState<any>([]);
    const [tasaAbandonosxAsesorTitle, settasaAbandonosxAsesorTitle] = useState<any>([]);
    const [tasaOportunidadesData, setTasaOportunidadesData] = useState<any>([]);
    const [tasaOportunidadesTitle, setTasaOportunidadesTitle] = useState<any>([]);
    const [efectividadxAsesorData, setefectividadxAsesorData] = useState<any>([]);
    const [efectividadxAsesorTitle, setefectividadxAsesorTitle] = useState<any>([]);
    const [efectividadxAsesorOportunidadData, setefectividadxAsesorOportunidadData] = useState<any>([]);
    const [efectividadxAsesorOportunidadTitle, setefectividadxAsesorOportunidadTitle] = useState<any>([]);
    const [ventasxAsesorData, setventasxAsesorData] = useState<any>([]);
    const [ventasxAsesorTitle, setventasxAsesorTitle] = useState<any>([]);
    const [typeEfectiveness, settypeEfectiveness] = useState(true);
    const [listadvisers, setlistadvisers] = useState<any>([]);
    const dataAdvisor = [{domaindesc: t(langKeys.agent), domainvalue: "ASESOR"},{domaindesc: "Bot", domainvalue: "BOT"}]
    const dispatch = useDispatch();
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);
    const [modalRow, setModalRow] = useState<Dictionary | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalColumns, setModalColumns] = useState<any>([]);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModalTicket, setOpenModalTicket] = useState(false);
    const [waitDetail, setWaitDetail] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const mainResult = useSelector(state => state.main);
    const mainAux = useSelector(state => state.main.mainAux);
    const openDialogInteractions = useCallback((row: any) => {
        setOpenModalTicket(true);
        setRowSelected({ ...row, displayname: row.asesor, ticketnum: row.ticketnum })
    }, [mainResult]);
    const fetchDetail = (grid: string, column: Dictionary, row: Dictionary,page2:boolean, mes: number, year: number) => {
        if (row.hournum!=="TOTAL" && ((typeof(row[column.id]) === 'number' && row[column.id] > 0)
        || (typeof(row[column.id]) === 'string' && row[column.id] !== '00:00:00'))) {
            setModalRow(row);
            const day = column.id.replace('day','');
            const user = listadvisers.filter((x:any)=>x.userid === row.userid)[0]?.userdesc
            switch (grid) {
                case 'COMPLETED':
                    setModalTitle(`Tickets ${user} ${t(langKeys.day)} ${day}`)
                    setModalColumns([
                        { Header: t(langKeys.ticket), accessor: 'ticketnum',
                            Cell: (props: any) => {
                                const row = props.cell.row.original;
                                return <label
                                    className={classes.labellink}
                                    onClick={() => openDialogInteractions(row)}
                                >
                                    {row.ticketnum}
                                </label>
                            }
                        },
                        { Header: t(langKeys.agent), accessor: 'asesor' },
                    ])
                    break;
                case 'ABANDONED':
                    setModalTitle(`Tickets ${user} ${t(langKeys.day)} ${day}`)
                    setModalColumns([
                        { Header: t(langKeys.ticket), accessor: 'ticketnum',
                            Cell: (props: any) => {
                                const row = props.cell.row.original;
                                return <label
                                    className={classes.labellink}
                                    onClick={() => openDialogInteractions(row)}
                                >
                                    {row.ticketnum}
                                </label>
                            }
                        },
                    ])
                    break;
                case 'OPPORTUNITY':
                    setModalTitle(`${t(langKeys.opportunity_plural)} ${user} ${t(langKeys.day)} ${day}`)
                    setModalColumns([
                        { Header: t(langKeys.ticket), accessor: 'ticketnum',
                            Cell: (props: any) => {
                                const row = props.cell.row.original;
                                return <label
                                    className={classes.labellink}
                                    onClick={() => openDialogInteractions(row)}
                                >
                                    {row.ticketnum}
                                </label>
                            }
                        },
                        { Header: t(langKeys.opportunityname), accessor: 'leadname' },
                    ])
                    break;
                case 'OPPORTUNITYWON':
                    setModalTitle(`${t(langKeys.opportunity_plural)} ${user} ${t(langKeys.day)} ${day}`)
                    setModalColumns([
                        { Header: t(langKeys.ticket), accessor: 'ticketnum',
                            Cell: (props: any) => {
                                const row = props.cell.row.original;
                                return <label
                                    className={classes.labellink}
                                    onClick={() => openDialogInteractions(row)}
                                >
                                    {row.ticketnum}
                                </label>
                            }
                        },
                        { Header: t(langKeys.opportunitywon), accessor: 'opportunitywon' },
                    ])
                    break;
                default:
                    break;
            }
            (!page2)?(dispatch(getCollectionAux(heatmappage2detail1({
                ...dataMainHeatMap,
                startdate: new Date(year, mes-1, day),
                enddate: new Date(year, mes-1, day),
                agentid: row.userid,
                option: grid
            })))):(dispatch(getCollectionAux(heatmappage2detail2({
                ...dataMainHeatMap,
                startdate: new Date(year, mes-1, day),
                enddate: new Date(year, mes-1, day),
                agentid: row.userid,
                option: grid
            }))))
            dispatch(showBackdrop(true));
            setWaitDetail(true);
        }
    }
    const multiData = useSelector(state => state.main.multiData);
    const [dataMainHeatMap, setdataMainHeatMap] = useState({
        communicationchannel: "",
        closedby: "ASESOR",
        startdate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        company: "", 
        group: "",
    });
    useEffect(() => {
        search()
    }, [])

    useEffect(() => {

        if(!multiDataAux2.loading && realizedsearch){
            setlistadvisers(multiDataAux2.data[0]?.data||[])
        }
    }, [multiDataAux2,realizedsearch])
    useEffect(() => {
        if(waitDetail) {
            if (!mainAux.loading){
                dispatch(showBackdrop(false));
                setWaitDetail(false);
                setOpenModal(true);
            }
        }
    }, [mainAux])
    useEffect(() => {

        if(!multiData.loading && realizedsearch){
            let mes = dataMainHeatMap.startdate?.getMonth()+1
            let year = dataMainHeatMap.startdate?.getFullYear()
            let dateend = new Date(year, mes, 0).getDate()
            let arrayfree:any = []
            listadvisers.forEach((row:any) => {
                
                const objectfree: Dictionary = {
                    asesor: capitalize(row.userdesc),
                    userid: row.userid,
                }
                for(let j = 1; j <= dateend; j++) {
                    objectfree[`day${j}`] = 0;
                }
                objectfree[`totalcol`] = 0;
                arrayfree.push(objectfree);
            })
            setrealizedsearch(false)
            dispatch(showBackdrop(false))         
            initCompletadosxAsesorGrid(multiData.data[0]?.data||[],arrayfree)
            initAbandonosxAsesorGrid(multiData.data[0]?.data||[],arrayfree)
            initTasaAbandonosxAsesorGrid(multiData.data[0]?.data||[],arrayfree)
            initCantidadOportunidadesGrid(multiData.data[0]?.data||[],arrayfree)
            initTasaOportunidadesGrid(multiData.data[0]?.data||[],arrayfree)
            initVentasxAsesorGrid(multiData.data[0]?.data||[],arrayfree)            
            initEfectividadxAsesorGrid(multiData.data[0]?.data||[],arrayfree)
            initEfectividadxAsesorxoportunitiesGrid(multiData.data[0]?.data||[],arrayfree)
            
        }
    }, [multiData,realizedsearch])

    function initCompletadosxAsesorGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let rowmax = 0;
        let dateend = new Date(year, mes, 0).getDate()

        const objectlast:any = { asesor: "TOTAL" , userid: 0};
        for(let j = 1; j <= dateend; j++) {
            objectlast[`day${j}`] = 0;
        }
        objectlast[`totalcol`] = 0;
        arrayfree.push(objectlast)
        
        data.filter((x:any) => listadvisers.filter((e:any) => e.userid === x.userid).length>0).forEach((row:any) => {
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({
                ...x, 
                [`day${day}`]: row.completadosxasesor,
                [`totalcol`]: x.totalcol + row.completadosxasesor
            }) : x) 
            rowmax = row.completadosxasesor>rowmax ? row.completadosxasesor:rowmax;
            arrayfree[listadvisers.length][`day${day}`] += row.completadosxasesor;
            arrayfree[listadvisers.length][`totalcol`] += row.completadosxasesor;
        })
        setCompletadosxAsesorData(arrayfree)

        let m=0;
        function gradient(num:number){
            let scale = num/rowmax
            if(isNaN(scale)) scale=0
            m++;
            if ((listadvisers.length)*dateend<m){
                return "FFFFFF"
            }
            
            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                const column = props.cell.column;
                const row = props.cell.row.original;
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key])
                    
                    return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} 
                            onClick={() => fetchDetail('COMPLETED', column, row,false, mes, year)}>{(props.cell.row.original[key])}</div>
                    
                }
                else{
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{(props.cell.row.original[key])}</div>
                }
            },
        }));
        arraytemplate.shift()
        setCompletadosxAsesorTitle([
            {
                Header: `Adviser`,
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }
    function initAbandonosxAsesorGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let rowmax = 0;
        let dateend = new Date(year, mes, 0).getDate()

        const objectlast:any = { asesor: "TOTAL" , userid: 0};
        for(let j = 1; j <= dateend; j++) {
            objectlast[`day${j}`] = 0;
        }
        objectlast[`totalcol`] = 0;
        arrayfree.push(objectlast)
        console.log(data)
        data.filter((x:any) => listadvisers.filter((e:any) => e.userid === x.userid).length>0).forEach((row:any) => {
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({
                ...x, 
                [`day${day}`]: row.abandonosxasesor,
                [`totalcol`]: x.totalcol + row.abandonosxasesor
            }) : x) 
            rowmax = row.abandonosxasesor>rowmax ? row.abandonosxasesor:rowmax;
            arrayfree[listadvisers.length][`day${day}`] += row.abandonosxasesor;
            arrayfree[listadvisers.length][`totalcol`] += row.abandonosxasesor;
        })
        setabandonosxAsesorData(arrayfree)

        let m=0;
        function gradient(num:number){
            let scale = num/rowmax
            if(isNaN(scale)) scale=0
            m++;
            if ((listadvisers.length)*dateend<m){
                return "FFFFFF"
            }

            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key])
                    const column = props.cell.column;
                    const row = props.cell.row.original;
                    
                    return <div onClick={() => fetchDetail('ABANDONED', column, row,false, mes, year)} style={{background: `#${color}`, textAlign: "center", color:"black"}} >{(props.cell.row.original[key])}</div>
                    
                }
                else{
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{(props.cell.row.original[key])}</div>
                }
            },
        }));
        arraytemplate.shift()
        setabandonosxAsesorTitle([
            {
                Header: `Adviser`,
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }
    function initTasaAbandonosxAsesorGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        data.forEach((row:any)=>{
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({...x, [`day${day}`]: row.tasaabandonosxasesor}) : x) 
        })
        
        settasaAbandonosxAsesorData(arrayfree)
        
        function gradient(porcentage:number){

            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*porcentage).toString(16)
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                let color=gradient(Number(props.cell.row.original[key]))
                let number = `${(Number(props.cell.row.original[key])*100).toFixed(0)} %`
                return (
                    <div style={{background: `#${color}`, textAlign: "center", color:"black"} } >{number}</div>)
            },
        }));
        arraytemplate.shift()
        arraytemplate.pop()
        settasaAbandonosxAsesorTitle([
            {
                Header: `Adviser`,
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }
    function initCantidadOportunidadesGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let rowmax = 0;
        let dateend = new Date(year, mes, 0).getDate()

        const objectlast:any = { asesor: "TOTAL" , userid: 0};
        for(let j = 1; j <= dateend; j++) {
            objectlast[`day${j}`] = 0;
        }
        objectlast[`totalcol`] = 0;
        arrayfree.push(objectlast)
        console.log(data)
        data.filter((x:any) => listadvisers.filter((e:any) => e.userid === x.userid).length>0).forEach((row:any) => {
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({
                ...x, 
                [`day${day}`]: row.oportunidadesxasesor,
                [`totalcol`]: x.totalcol + row.oportunidadesxasesor
            }) : x) 
            rowmax = row.oportunidadesxasesor>rowmax ? row.oportunidadesxasesor:rowmax;
            arrayfree[listadvisers.length][`day${day}`] += row.oportunidadesxasesor;
            arrayfree[listadvisers.length][`totalcol`] += row.oportunidadesxasesor;
        })
        setCantidadOportunidadesData(arrayfree)

        let m=0;
        function gradient(num:number){
            let scale = num/rowmax
            if(isNaN(scale)) scale=0
            m++;
            if ((listadvisers.length)*dateend<m){
                return "FFFFFF"
            }

            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key])
                    const column = props.cell.column;
                    const row = props.cell.row.original;
                    
                    return <div onClick={() => fetchDetail('OPPORTUNITY', column, row,true, mes, year)}  style={{background: `#${color}`, textAlign: "center", color:"black"}} >{(props.cell.row.original[key])}</div>
                    
                }
                else{
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{(props.cell.row.original[key])}</div>
                }
            },
        }));
        arraytemplate.shift()
        setCantidadOportunidadesTitle([
            {
                Header: `Adviser`,
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }
    function initTasaOportunidadesGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1

        data.forEach((row:any)=>{
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({...x, [`day${day}`]: row.tasaoportunidadesxasesor}) : x) 
        })
        
        setTasaOportunidadesData(arrayfree)
        
        function gradient(porcentage:number){
            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*porcentage).toString(16)
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                let color=gradient(Number(props.cell.row.original[key]))
                let number = `${(Number(props.cell.row.original[key])*100).toFixed(0)} %`
                return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} >{number}</div>
            },
        }));
        arraytemplate.shift()
        arraytemplate.pop()
        setTasaOportunidadesTitle([
            {
                Header: `Adviser`,
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }

    function initVentasxAsesorGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let rowmax = 0;
        let dateend = new Date(year, mes, 0).getDate()

        const objectlast:any = { asesor: "TOTAL" , userid: 0};
        for(let j = 1; j <= dateend; j++) {
            objectlast[`day${j}`] = 0;
        }
        objectlast[`totalcol`] = 0;
        arrayfree.push(objectlast)
        
        data.filter((x:any) => listadvisers.filter((e:any) => e.userid === x.userid).length>0).forEach((row:any) => {
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({
                ...x, 
                [`day${day}`]: row.ventasxasesor,
                [`totalcol`]: x.totalcol + row.ventasxasesor
            }) : x) 
            rowmax = row.ventasxasesor>rowmax ? row.ventasxasesor:rowmax;
            arrayfree[listadvisers.length][`day${day}`] += row.ventasxasesor;
            arrayfree[listadvisers.length][`totalcol`] += row.ventasxasesor;
        })
        
        setventasxAsesorData(arrayfree)

        let m=0;
        
        function gradient(num:number){
            m++;
            if ((listadvisers.length)*dateend<m){
                return "00000000"
            }
            
            let scale = num/rowmax
            if(isNaN(scale)) scale=0
            
            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key])
                    const column = props.cell.column;
                    const row = props.cell.row.original;
                    
                    return <div onClick={() => fetchDetail('OPPORTUNITYWON', column, row,true, mes, year)}  style={{background: `#${color}`, textAlign: "center", color:"black"}} >{(props.cell.row.original[key])}</div>
                    
                }
                else{
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{(props.cell.row.original[key])}</div>
                }
            },
        }));
        arraytemplate.shift()
        setventasxAsesorTitle([
            {
                Header: `Adviser`,
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }
    function initEfectividadxAsesorGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1

        data.forEach((row:any)=>{
            let efectividad = row.tasaventasxticket == null? 0: row.tasaventasxticket;
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({...x, [`day${day}`]: efectividad}) : x) 
        })
        
        setefectividadxAsesorData(arrayfree)
        
        function gradient(porcentage:number){

            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*porcentage).toString(16)
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                let color=gradient(Number(props.cell.row.original[key]))
                let number = `${(Number(props.cell.row.original[key])*100).toFixed(0)} %`
                return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} >{number}</div>
            },
        }));
        arraytemplate.shift()
        arraytemplate.pop()
        setefectividadxAsesorTitle([
            {
                Header: `Adviser`,
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }
    function initEfectividadxAsesorxoportunitiesGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1

        data.forEach((row:any)=>{
            let efectividad = row.tasaventasxoportunidad == null? 0: row.tasaventasxoportunidad;
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({...x, [`day${day}`]: efectividad}) : x) 
        })
        
        setefectividadxAsesorOportunidadData(arrayfree)
        
        function gradient(porcentage:number){
            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*porcentage).toString(16)
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                let color=gradient(Number(props.cell.row.original[key]))
                let number = `${(Number(props.cell.row.original[key])*100).toFixed(0)} %`
                return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} >{number}</div>
            },
        }));
        arraytemplate.shift()
        arraytemplate.pop()
        setefectividadxAsesorOportunidadTitle([
            {
                Header: `Adviser`,
                accessor: "asesor",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
    }
    async function search(){
        setlistadvisers([])
        setCompletadosxAsesorData([])
        setabandonosxAsesorData([])
        settasaAbandonosxAsesorData([])
        setTasaOportunidadesData([])
        setventasxAsesorData([])
        setefectividadxAsesorOportunidadData([])
        setefectividadxAsesorData([])
        setCantidadOportunidadesData([])
        setrealizedsearch(true)
        dispatch(showBackdrop(true))
        dispatch(getMultiCollectionAux2([
            getasesoresbyorgid(dataMainHeatMap.closedby),            
        ]))
        dispatch(getMultiCollection([
            heatmappage2(dataMainHeatMap)
        ]));
    }
    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let startdate = new Date(year, mes-1, 1)
        let enddate = new Date(year, mes, 0)
        let datetoshow = `${startdate.getFullYear()}-${String(startdate.getMonth()+1).padStart(2, '0')}`
        setdataMainHeatMap(prev=>({...prev,startdate,enddate,datetoshow}))
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
                <div style={{flex:1,paddingRight: 10}}>
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
                <div style={{flex:1,paddingRight: 10}}>
                    <FieldMultiSelect
                        label={t(langKeys.company)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => { setdataMainHeatMap(p => ({ ...p, company: value.map((o: Dictionary) => o.domainvalue).join() })) }}
                        valueDefault={dataMainHeatMap.company}
                        data={companydomain}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                </div>
                <div style={{flex:1}}>
                    <FieldMultiSelect
                        label={t(langKeys.group)}
                        className={classes.fieldsfilter}
                        variant="outlined"
                        onChange={(value) => { setdataMainHeatMap(p => ({ ...p, group: value.map((o: Dictionary) => o.domainvalue).join() })) }}
                        valueDefault={dataMainHeatMap.group}
                        data={groupsdomain}
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
            {
                completadosxAsesorData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={completadosxAsesorTitle}
                        titlemodule={t(langKeys.completadosxAsesor)}
                        data={completadosxAsesorData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            {
                abandonosxAsesorData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={abandonosxAsesorTitle}
                        titlemodule={t(langKeys.abandonosxAsesor)}
                        data={abandonosxAsesorData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            {
                tasaAbandonosxAsesorData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={tasaAbandonosxAsesorTitle}
                        titlemodule={t(langKeys.tasaAbandonosxAsesor)}
                        data={tasaAbandonosxAsesorData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            {
                cantidadOportunidadesData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={cantidadOportunidadesTitle}
                        titlemodule={t(langKeys.cantidadOportunidades)}
                        data={cantidadOportunidadesData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            {
                tasaOportunidadesData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={tasaOportunidadesTitle}
                        titlemodule={t(langKeys.tasaOportunidades)}
                        data={tasaOportunidadesData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }




            {
                ventasxAsesorData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={ventasxAsesorTitle}
                        titlemodule={t(langKeys.ventasxAsesor)}
                        data={ventasxAsesorData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            {
                efectividadxAsesorData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={typeEfectiveness?efectividadxAsesorTitle:efectividadxAsesorOportunidadTitle}
                        titlemodule={t(langKeys.efectividadxAsesor)}
                        data={typeEfectiveness?efectividadxAsesorData:efectividadxAsesorOportunidadData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                        ButtonsElement={()=>(
                            <>
                                <TemplateSwitchYesNo
                                    valueDefault={typeEfectiveness}
                                    onChange={(value) => settypeEfectiveness(value)}
                                    textYes={t(langKeys.ticket)}
                                    textNo={t(langKeys.opportunity_plural)}
                                    labelPlacement="start"
                                    style={{padding: 10}}
                                />
                            </>
                        )}
                    />
                </div>:""
            }
            <ModalHeatMap
                openModal={openModal}
                setOpenModal={setOpenModal}
                title={modalTitle}
                row={modalRow}
                columns={modalColumns}
                data={mainAux?.data||[]}
            />
            <DialogInteractions
                openModal={openModalTicket}
                setOpenModal={setOpenModalTicket}
                ticket={rowSelected}
            />
        </div>
    )
}
const HeatMapTicket: React.FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);
    const [realizedsearch, setrealizedsearch] = useState(false);  
    const [asesoresConectadosData, setasesoresConectadosData] = useState<any>([]);  
    const [asesoresConectadosTitle, setasesoresConectadosTitle] = useState<any>([]);  
    const [dataMainHeatMap, setdataMainHeatMap] = useState({
        communicationchannel: "",
        startdate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
    });

    const [waitDetail, setWaitDetail] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalRow, setModalRow] = useState<Dictionary | null>(null);
    const [modalColumns, setModalColumns] = useState<any>([]);
    const fetchDetail = (grid: string, column: Dictionary, row: Dictionary, mes: number, year: number) => {
        if (typeof(row[column.id]) === 'number' && row[column.id] > 0) {
            setModalRow(row);
            const day = column.id.replace('day','');
            const hour = row.hour - 1;
            const hournum = row.hournum.replace('a','-');
            switch (grid) {
                case '3.1':
                    setModalTitle(`${t(langKeys.agent_plural)} ${t(langKeys.day)} ${day} ${hournum}`)
                    setModalColumns([
                        { Header: t(langKeys.agent), accessor: 'asesor' }
                    ])
                    break;
                default:
                    break;
            }
            dispatch(getMultiCollectionAux2([heatmappage3detail({
                ...dataMainHeatMap,
                startdate: new Date(year, mes-1, day),
                enddate: new Date(year, mes-1, day),
                horanum: row.hournum === 'TOTAL' ? '' : hour
            })]));
            dispatch(showBackdrop(true));
            setWaitDetail(true);
        }
    }

    useEffect(() => {
        if(waitDetail) {
            if (!multiDataAux2.loading){
                dispatch(showBackdrop(false));
                setWaitDetail(false);
                setOpenModal(true);
            }
        }
    }, [multiDataAux2])

    useEffect(() => {
        search()
    }, [])

    useEffect(() => {
        if(!multiData.loading && realizedsearch){
            setrealizedsearch(false)
            dispatch(showBackdrop(false))
            if(multiData.data[0].key === "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_SEL"){
                initAsesoresConectadosGrid(multiData.data[0]?.data||[])
            }else{
                initAsesoresConectadosGrid([])
            }
        }
    }, [multiData,realizedsearch])

    function search(){
        setasesoresConectadosData([])
        setrealizedsearch(true)
        dispatch(showBackdrop(true))
        dispatch(getMultiCollection([
            heatmappage3(dataMainHeatMap)
        ]));
    }

    function handleDateChange(e: any){
        let datetochange = new Date(e+"-02")
        let mes = datetochange?.getMonth()+1
        let year = datetochange?.getFullYear()
        let startdate = new Date(year, mes-1, 1)
        let enddate = new Date(year, mes, 0)
        let datetoshow = `${startdate.getFullYear()}-${String(startdate.getMonth()+1).padStart(2, '0')}`
        setdataMainHeatMap(prev=>({...prev,startdate,enddate,datetoshow}))
    }

    function initAsesoresConectadosGrid(data:any){
        let arrayfree: any = [];
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let year = dataMainHeatMap.startdate?.getFullYear()
        let rowmax = 0;
        let dateend = new Date(year, mes, 0).getDate()

        const LIMITHOUR = 24;
        for(let i = 1; i <= LIMITHOUR; i++) {
            const objectfree:Dictionary = {
                hour: i,
                hournum: hours[i - 1],
            }
            for(let j = 1; j <= dateend; j++) {
                objectfree[`day${j}`] = 0;
            }
            arrayfree.push(objectfree);
        }

        data.forEach((row:any)=>{
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.hora;
            arrayfree = arrayfree.map((x:any) => x.hournum === hour ? ({...x, [`day${day}`]: row.value}) : x) 
            rowmax = row.value>rowmax ? row.value:rowmax;
        })

        function gradient(num:number){
            let scale = num/rowmax
            if(isNaN(scale)) scale=0

            return Math.floor(lowestcolornum+(higuestcolornum-lowestcolornum)*scale).toString(16)
        }
        
        setasesoresConectadosData(arrayfree);

        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: `${key.split('day')[1]}/${mes}`,
            accessor: key,
            NoFilter: true,
            NoSort: true,
            Cell: (props: any) => {
                const column = props.cell.column;
                const row = props.cell.row.original;
                let color = gradient(props.cell.row.original[key]);
                return (
                    <div
                        style={{background: `#${color}`, textAlign: "center", color:"black"}}
                        onClick={() => fetchDetail('3.1', column, row, mes, year)}
                    >
                        {(props.cell.row.original[key])}
                    </div>
                )
            },
        }));

        setasesoresConectadosTitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
                NoSort: true,
            },
            ...arraytemplate
        ])
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
            {
                asesoresConectadosData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={asesoresConectadosTitle}
                        data={asesoresConectadosData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
            <ModalHeatMap
                openModal={openModal}
                setOpenModal={setOpenModal}
                title={modalTitle}
                row={modalRow}
                columns={modalColumns}
                data={multiDataAux2.data[0]?.data||[]}
            />
        </div>
    )
}

const Heatmap: FC = () => {
    const [pageSelected, setPageSelected] = useState(0);    
    const [listadvisers, setlistadvisers] = useState<any>([]);
    const [companydomain, setcompanydomain] = useState<any>([]);
    const [groupsdomain, setgroupsdomain] = useState<any>([]);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const dispatch = useDispatch();
    useEffect(() => {
        if(!multiDataAux.loading){
            setcompanydomain(multiDataAux.data[0]?.data||[]) 
            setgroupsdomain(multiDataAux.data[1]?.data||[])    
        }
    }, [multiDataAux])
    useEffect(() => {
        dispatch(getMultiCollectionAux([
            getValuesFromDomain("EMPRESA"),
            getValuesFromDomain("GRUPOS")
        ]))
        return () => {
            dispatch(resetMainAux());
            dispatch(resetMultiMain());
            dispatch(resetMultiMainAux());
            dispatch(resetMultiMainAux2());
        }
    }, [])
    const { t } = useTranslation();
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
            {pageSelected === 1 && <HeatMapAsesor companydomain={companydomain} groupsdomain={groupsdomain}/>}
            {pageSelected === 2 && <HeatMapTicket />}
        </Fragment>
    )
}

export default Heatmap;