/* eslint-disable react-hooks/exhaustive-deps */
import { Button, createStyles, makeStyles, Tabs, TextField, Theme } from '@material-ui/core';
import { AntTab } from 'components';
import { langKeys } from 'lang/keys';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { FieldMultiSelect } from "components";
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { showBackdrop } from 'store/popus/actions';
import { getasesoresbyorgid, getValuesFromDomain, heatmappage1, heatmappage2, heatmappage3 } from 'common/helpers/requestBodies';
import {  getMultiCollection, getMultiCollectionAux} from 'store/main/actions';
import { useSelector } from 'hooks';
import { Dictionary } from '@types';
import TableZyx from 'components/fields/table-simple';

const hours=["00:00 a 01:00","01:00 a 02:00","02:00 a 03:00","03:00 a 04:00","04:00 a 05:00","05:00 a 06:00","06:00 a 07:00","07:00 a 08:00","08:00 a 09:00","09:00 a 10:00","10:00 a 11:00","11:00 a 12:00",
                       "12:00 a 13:00","13:00 a 14:00","14:00 a 15:00","15:00 a 16:00","16:00 a 17:00","17:00 a 18:00","18:00 a 19:00","19:00 a 20:00","20:00 a 21:00","21:00 a 22:00","22:00 a 23:00","23:00 a 00:00","TOTAL"]
const hoursProm=["00:00 a 01:00","01:00 a 02:00","02:00 a 03:00","03:00 a 04:00","04:00 a 05:00","05:00 a 06:00","06:00 a 07:00","07:00 a 08:00","08:00 a 09:00","09:00 a 10:00","10:00 a 11:00","11:00 a 12:00",
                       "12:00 a 13:00","13:00 a 14:00","14:00 a 15:00","15:00 a 16:00","16:00 a 17:00","17:00 a 18:00","18:00 a 19:00","19:00 a 20:00","20:00 a 21:00","21:00 a 22:00","22:00 a 23:00","23:00 a 00:00","PRM"]


const LIMITHOUR = 24;

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

const MainHeatMap: React.FC = () => {
    
    const { t } = useTranslation();
    const classes = useStyles();
    const [realizedsearch, setrealizedsearch] = useState(false);  
    const [heatMapConversations, setheatMapConversations] = useState<any>([]);
    const [heatMapConversationsData, setheatMapConversationsData] = useState<any>([]);
    const [averageHeatMapTMOTitle, setaverageHeatMapTMOTitle] = useState<any>([]);
    const [averageHeatMapTMOData, setaverageHeatMapTMOData] = useState<any>([]);
    const [heatMapAverageadvisorTMETitle, setheatMapAverageadvisorTMETitle] = useState<any>([]);
    const [heatMapAverageadvisorTMEData, setheatMapAverageadvisorTMEData] = useState<any>([]);
    const [userAverageReplyTimexFechaTitle, setuserAverageReplyTimexFechaTitle] = useState<any>([]);
    const [userAverageReplyTimexFechaData, setuserAverageReplyTimexFechaData] = useState<any>([]);
    const [personAverageReplyTimexFechaTitle, setpersonAverageReplyTimexFechaTitle] = useState<any>([]);
    const [personAverageReplyTimexFechaData, setpersonAverageReplyTimexFechaData] = useState<any>([]);
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
        setheatMapAverageadvisorTMEData([])
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
            arrayfree = arrayfree.map((x:any) => x.hournum === hour ? ({
                ...x, 
                [`day${day}`]: x[`day${day}`] + row.atencionesxfecha,
                [`totalcol`]: x.totalcol + row.atencionesxfecha
            }) : x) 
            
            rowmax = row.atencionesxfecha>rowmax ? row.atencionesxfecha:rowmax;
            arrayfree[24][`day${day}`] += row.atencionesxfecha;
            arrayfree[24][`totalcol`] += row.atencionesxfecha;
        });
        
        setheatMapConversationsData(arrayfree)

        let mid = rowmax/2;
        let scale = 255 / (mid);
        function gradient(num:number,rowcounter:number){
            let number = "";
            if ( rowcounter >= 24 ) {
                return "FFFFFF";
            }
            if ( num <= 0 ) {
                return "00FF99";
            }
            else if ( num >= rowmax ) {
                return "FF0099";
            }
            else if ( num <= mid ) {
                number=Math.imul(num,scale).toString(16)
                return "00".slice(number.length) + number +  "FF99" 
            }
            else {
                number= Math.imul(255-(num-mid),scale).toString(16)
                return  "FF" +"00".slice(number.length) + number +"99"  
            }
        }
        
        let rowcounter = 0;
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color="white"
                    if(props.data[rowcounter]){
                        color = gradient(parseInt(props.data[rowcounter][key]),rowcounter)
                    }
                    
                    return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} >{(props.data[rowcounter][key])}</div>
                    
                }
                else{
                    if (rowcounter < 24)
                        rowcounter++;
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{(props.data[rowcounter-1][key])}</div>
                }
            },
        }));
        setheatMapConversations([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
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
            let i = 0;
            arrayfree.forEach((x:any) => {
                i++;
                    if (x.hournum === hour){
                        let timespenttotal = x["totalcol"].split(':')
                        let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/i)
                        let hh= Math.floor(secondstotalnum/3600)
                        let mm= Math.floor((secondstotalnum-hh*3600)/60)
                        let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                        x["totalcol"] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
                        
                    }
                }
            )
            let timespenttotal = arrayfree[24][`day${day}`].split(':')
            let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/24)
            let hh= Math.floor(secondstotalnum/3600)
            let mm= Math.floor((secondstotalnum-hh*3600)/60)
            let ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24][`day${day}`]=hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            timespenttotal = arrayfree[24].totalcol.split(':')
            secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/24)
            hh= Math.floor(secondstotalnum/3600)
            mm= Math.floor((secondstotalnum-hh*3600)/60)
            ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24].totalcol = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
        })
        setaverageHeatMapTMOData(arrayfree)
                
        let mid = (rowmax/2);
        let scale = 255 / (mid);
        let n=0;
        function gradient(num:string,key:string){
            n++;
            if(dateend*24<n){
                if (key === "day30") n=0
                return "FFFFFF"
            }
            let timespent = num.split(':')
            let seconds = parseInt(timespent[0])*3600+parseInt(timespent[1])*60+parseInt(timespent[2])
            let number = ""
            if ( seconds <= 0 ) {
                return "00FF99";
            }
            else if ( seconds >= rowmax ) {
                return "FF0099";
            }
            else if ( seconds < mid ) {
                number = Math.imul(seconds, scale).toString(16);
                return '00'.slice(number.length) + number +  "FF99" 
            }
            else {
                number = Math.imul(255-(seconds-mid), scale).toString(16)
                return  "FF" + '00'.slice(number.length) + number +"99"  
            }
        }

        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key],key)
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    return <div style={{background: `#${color}`, textAlign: "center", color:"black"}}>{`${hh}${mm}${ss}s`}</div>                    
                    
                }
                else{
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
            let i = 0;
            arrayfree.forEach((x:any) => {
                    i++;
                    if (x.hournum === hour){
                        let timespenttotal = x["totalcol"].split(':')
                        let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/i)
                        let hh= Math.floor(secondstotalnum/3600)
                        let mm= Math.floor((secondstotalnum-hh*3600)/60)
                        let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                        x["totalcol"] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
                        
                    }
                }
            )
            let timespenttotal = arrayfree[24][`day${day}`].split(':')
            let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/24)
            let hh= Math.floor(secondstotalnum/3600)
            let mm= Math.floor((secondstotalnum-hh*3600)/60)
            let ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24][`day${day}`]=hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            timespenttotal = arrayfree[24].totalcol.split(':')
            secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/24)
            hh= Math.floor(secondstotalnum/3600)
            mm= Math.floor((secondstotalnum-hh*3600)/60)
            ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24].totalcol = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
        })
        setheatMapAverageadvisorTMEData(arrayfree)
                
        let mid = (rowmax/2);
        let scale = 255 / (mid);
        let n=0;
        function gradient(num:string,key:string){
            n++;
            if(dateend*24<n){
                if (key === "day30") n=0
                return "FFFFFF"
            }
            let timespent = num.split(':')
            let seconds = parseInt(timespent[0])*3600+parseInt(timespent[1])*60+parseInt(timespent[2])
            let number = ""
            if ( seconds <= 0 ) {
                return "00FF99";
            }
            else if ( seconds >= rowmax ) {
                return "FF0099";
            }
            else if ( seconds < mid ) {
                number = Math.imul(seconds, scale).toString(16);
                return '00'.slice(number.length) + number +  "FF99" 
            }
            else {
                number = Math.imul(255-(seconds-mid), scale).toString(16)
                return  "FF" + '00'.slice(number.length) + number +"99"  
            }
        }

        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key],key)
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    return <div style={{background: `#${color}`, textAlign: "center", color:"black"}}>{`${hh}${mm}${ss}s`}</div>                    
                    
                }
                else{
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    return <div style={{textAlign: "center", fontWeight: "bold",background: "white"}}>{`${hh}${mm}${ss}s`}</div>
                }
            },
        }));
        setheatMapAverageadvisorTMETitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
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
            let i = 0;
            arrayfree.forEach((x:any) => {
                    i++;
                    if (x.hournum === hour){
                        let timespenttotal = x["totalcol"].split(':')
                        let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/i)
                        let hh= Math.floor(secondstotalnum/3600)
                        let mm= Math.floor((secondstotalnum-hh*3600)/60)
                        let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                        x["totalcol"] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
                        
                    }
                }
            )
            let timespenttotal = arrayfree[24][`day${day}`].split(':')
            let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/24)
            let hh= Math.floor(secondstotalnum/3600)
            let mm= Math.floor((secondstotalnum-hh*3600)/60)
            let ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24][`day${day}`]=hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            timespenttotal = arrayfree[24].totalcol.split(':')
            secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/24)
            hh= Math.floor(secondstotalnum/3600)
            mm= Math.floor((secondstotalnum-hh*3600)/60)
            ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24].totalcol = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
        })
        setuserAverageReplyTimexFechaData(arrayfree)
                
        let mid = (rowmax/2);
        let scale = 255 / (mid);
        let n=0;
        function gradient(num:string,key:string){
            n++;
            if(dateend*24<n){
                if (key === "day30") n=0
                return "FFFFFF"
            }
            let timespent = num.split(':')
            let seconds = parseInt(timespent[0])*3600+parseInt(timespent[1])*60+parseInt(timespent[2])
            let number = ""
            if ( seconds <= 0 ) {
                return "00FF99";
            }
            else if ( seconds >= rowmax ) {
                return "FF0099";
            }
            else if ( seconds < mid ) {
                number = Math.imul(seconds, scale).toString(16);
                return '00'.slice(number.length) + number +  "FF99" 
            }
            else {
                number = Math.imul(255-(seconds-mid), scale).toString(16)
                return  "FF" + '00'.slice(number.length) + number +"99"  
            }
        }

        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key],key)
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    return <div style={{background: `#${color}`, textAlign: "center", color:"black"}}>{`${hh}${mm}${ss}s`}</div>                    
                    
                }
                else{
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
            let i = 0;
            arrayfree.forEach((x:any) => {
                    i++;
                    if (x.hournum === hour){
                        let timespenttotal = x["totalcol"].split(':')
                        let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/i)
                        let hh= Math.floor(secondstotalnum/3600)
                        let mm= Math.floor((secondstotalnum-hh*3600)/60)
                        let ss= Math.round(secondstotalnum)-hh*3600-mm*60
                        x["totalcol"] = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
                        
                    }
                }
            )
            let timespenttotal = arrayfree[24][`day${day}`].split(':')
            let secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/24)
            let hh= Math.floor(secondstotalnum/3600)
            let mm= Math.floor((secondstotalnum-hh*3600)/60)
            let ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24][`day${day}`]=hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
            timespenttotal = arrayfree[24].totalcol.split(':')
            secondstotalnum = (((timespenttotal[0])*3600+(timespenttotal[1])*60+parseInt(timespenttotal[2])+seconds)/24)
            hh= Math.floor(secondstotalnum/3600)
            mm= Math.floor((secondstotalnum-hh*3600)/60)
            ss= Math.round(secondstotalnum)-hh*3600-mm*60
            arrayfree[24].totalcol = hh.toString().padStart(2,"0") + ":" + mm.toString().padStart(2,"0") +":" + ss.toString().padStart(2,"0")
        })
        setpersonAverageReplyTimexFechaData(arrayfree)
                
        let mid = (rowmax/2);
        let scale = 255 / (mid);
        let n=0;
        function gradient(num:string,key:string){
            n++;
            if(dateend*24<n){
                if (key === "day30") n=0
                return "FFFFFF"
            }
            let timespent = num.split(':')
            let seconds = parseInt(timespent[0])*3600+parseInt(timespent[1])*60+parseInt(timespent[2])
            let number = ""
            if ( seconds <= 0 ) {
                return "00FF99";
            }
            else if ( seconds >= rowmax ) {
                return "FF0099";
            }
            else if ( seconds < mid ) {
                number = Math.imul(seconds, scale).toString(16);
                return '00'.slice(number.length) + number +  "FF99" 
            }
            else {
                number = Math.imul(255-(seconds-mid), scale).toString(16)
                return  "FF" + '00'.slice(number.length) + number +"99"  
            }
        }

        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : "Promedio",
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key],key)
                    let timespenttotal = props.cell.row.original[key].split(':')
                    let hh = timespenttotal[0] === "00" ? "" : (timespenttotal[0] + "h ")
                    let mm = timespenttotal[1] === "00" ? "" : (timespenttotal[1] + "m ")
                    let ss = timespenttotal[2]
                    return <div style={{background: `#${color}`, textAlign: "center", color:"black"}}>{`${hh}${mm}${ss}s`}</div>                    
                    
                }
                else{
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
                heatMapAverageadvisorTMEData.length?
                <div style={{padding:10}}>
                    <TableZyx
                        columns={heatMapAverageadvisorTMETitle}
                        titlemodule={t(langKeys.heatmapaverageadvisorTME)}
                        data={heatMapAverageadvisorTMEData}
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
        </div>
    )
}
const HeatMapAsesor: React.FC<{companydomain: any, listadvisers: any}> = ({companydomain,listadvisers}) => {
    
    const { t } = useTranslation();
    const classes = useStyles();
    const [realizedsearch, setrealizedsearch] = useState(false);
    const [completadosxAsesorData, setCompletadosxAsesorData] = useState<any>([]);
    const [abandonosxAsesorData, setabandonosxAsesorData] = useState<any>([]);
    const [abandonosxAsesorTitle, setabandonosxAsesorTitle] = useState<any>([]);
    const [tasaAbandonosxAsesorData, settasaAbandonosxAsesorData] = useState<any>([]);
    const [tasaAbandonosxAsesorTitle, settasaAbandonosxAsesorTitle] = useState<any>([]);
    const [efectividadxAsesorData, setefectividadxAsesorData] = useState<any>([]);
    const [efectividadxAsesorTitle, setefectividadxAsesorTitle] = useState<any>([]);
    const [ventasxAsesorData, setventasxAsesorData] = useState<any>([]);
    const [ventasxAsesorTitle, setventasxAsesorTitle] = useState<any>([]);
    const [completadosxAsesorTitle, setCompletadosxAsesorTitle] = useState<any>([]);
    const dataAdvisor = [{domaindesc: t(langKeys.advisor), domainvalue: "ASESOR"},{domaindesc: "Bot", domainvalue: "BOT"}]
    const dispatch = useDispatch();
    //const mainData = useSelector(state => state.main.mainData);
    const multiData = useSelector(state => state.main.multiData);
    const [dataMainHeatMap, setdataMainHeatMap] = useState({
        communicationchannel: "",
        closedby: "ASESOR",
        startdate: new Date(new Date().setDate(1)),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
        company: ""
    });
    useEffect(() => {
        search()
    }, [])

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
            if(multiData.data[0].key === "UFN_REPORT_HEATMAP_PAGE3_SEL"){
                initCompletadosxAsesorGrid(multiData.data[0]?.data||[],arrayfree)
                initAbandonosxAsesorGrid(multiData.data[0]?.data||[],arrayfree)
                initTasaAbandonosxAsesorGrid(multiData.data[0]?.data||[],arrayfree)
                initVentasxAsesorGrid(multiData.data[0]?.data||[],arrayfree)            
                initEfectividadxAsesorGrid(multiData.data[0]?.data||[],arrayfree)            
            }else{
                initCompletadosxAsesorGrid([],arrayfree)
                initAbandonosxAsesorGrid([],arrayfree)
                initTasaAbandonosxAsesorGrid([],arrayfree)
                initVentasxAsesorGrid([],arrayfree)            
                initEfectividadxAsesorGrid([],arrayfree)  
            }
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
        
        data.filter((x:any) => listadvisers.includes(x.asesor)).forEach((row:any) => {
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

        let mid = rowmax/2;
        let scale = 255 / (mid);
        let m=0;
        
        function gradient(num:number){
            m++;
            if ((listadvisers.length)*dateend<m){
                return "00000000"
            }
            let number = "";
            if ( num <= 0 ) {
                return "00FF0099";
            }
            else if ( num >= rowmax ) {
                return "FF000099";
            }
            else if ( num <= mid ) {
                number=Math.imul(num, scale).toString(16)
                return "00".slice(number.length) + number +  "FF0099" 
            }
            else {
                number= Math.imul((255-(num-mid)),scale).toString(16)
                return  "FF" +"00".slice(number.length) + number +"0099"  
            }
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key])
                    
                    return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} >{(props.cell.row.original[key])}</div>
                    
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
        let listasesores = listadvisers.map((x:any) => x.userdesc);
        data.filter((x:any) => listasesores.includes(x.asesor)).forEach((row:any) => {
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

        let mid = rowmax/2;
        let scale = 255 / (mid);
        let m=0;
        
        function gradient(num:number){
            m++;
            if ((listadvisers.length)*dateend<m){
                return "00000000"
            }
            let number = "";
            if ( num <= 0 ) {
                return "00FF0099";
            }
            else if ( num >= rowmax ) {
                return "FF000099";
            }
            else if ( num <= mid ) {
                number=Math.imul(num, scale).toString(16)
                return "00".slice(number.length) + number +  "FF0099" 
            }
            else {
                number= Math.imul((255-(num-mid)),scale).toString(16)
                return  "FF" +"00".slice(number.length) + number +"0099"  
            }
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key])
                    
                    return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} >{(props.cell.row.original[key])}</div>
                    
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
            },
            ...arraytemplate
        ])
    }
    function initTasaAbandonosxAsesorGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let rowmax = 100;

        data.forEach((row:any)=>{
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({...x, [`day${day}`]: row.tasaabandonosxasesor}) : x) 
        })
        
        let mid = 50;
        let scale = 255 / (50);
        settasaAbandonosxAsesorData(arrayfree)
        
        function gradient(porcentage:number){
            let number = "";
            let num = porcentage*100;

            if ( num <= 0 ) {
                return "00FF0099";
            }
            else if ( num >= rowmax ) {
                return "FF000099";
            }
            else if ( num <= mid ) {
                number=Math.imul(num, scale).toString(16)
                return "00".slice(number.length) + number +  "FF0099" 
            }
            else {
                number= Math.imul((255-(num-mid)),scale).toString(16)
                return  "FF" +"00".slice(number.length) + number +"0099"  
            }
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                let color=gradient(props.cell.row.original[key])
                let number = `${(parseInt(props.cell.row.original[key])*100).toFixed(0)} %`
                return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} >{number}</div>
            },
        }));
        arraytemplate.shift()
        arraytemplate.pop()
        settasaAbandonosxAsesorTitle([
            {
                Header: `Adviser`,
                accessor: "asesor",
                NoFilter: true,
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
        
        data.filter((x:any) => listadvisers.includes(x.asesor)).forEach((row:any) => {
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

        let mid = rowmax/2;
        let scale = 255 / (mid);
        let m=0;
        
        function gradient(num:number){
            m++;
            if ((listadvisers.length)*dateend<m){
                return "00000000"
            }
            let number = "";
            if ( num <= 0 ) {
                return "00FF0099";
            }
            else if ( num >= rowmax ) {
                return "FF000099";
            }
            else if ( num <= mid ) {
                number=Math.imul(num, scale).toString(16)
                return "00".slice(number.length) + number +  "FF0099" 
            }
            else {
                number= Math.imul((255-(num-mid)),scale).toString(16)
                return  "FF" +"00".slice(number.length) + number +"0099"  
            }
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor|horanum/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                if(key!=="totalcol"){
                    let color=gradient(props.cell.row.original[key])
                    
                    return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} >{(props.cell.row.original[key])}</div>
                    
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
            },
            ...arraytemplate
        ])
    }
    function initEfectividadxAsesorGrid(data:any,arraything:any){
        let arrayfree: any = [...arraything];
        let mes = dataMainHeatMap.startdate?.getMonth()+1
        let rowmax = 100;

        data.forEach((row:any)=>{
            let efectividad = row.efectividadxasesor == null? 0: row.efectividadxasesor;
            const day = parseInt(row.fecha.split("-")[2])
            const hour = row.userid;
            arrayfree = arrayfree.map((x:any) => x.userid === hour ? ({...x, [`day${day}`]: efectividad}) : x) 
        })
        
        let mid = 50;
        let scale = 255 / (50);
        setefectividadxAsesorData(arrayfree)
        
        function gradient(porcentage:number){
            let number = "";
            let num = porcentage*100;

            if ( num <= 0 ) {
                return "00FF0099";
            }
            else if ( num >= rowmax ) {
                return "FF000099";
            }
            else if ( num <= mid ) {
                number=Math.imul(num, scale).toString(16)
                return "00".slice(number.length) + number +  "FF0099" 
            }
            else {
                number= Math.imul((255-(num-mid)),scale).toString(16)
                return  "FF" +"00".slice(number.length) + number +"0099"  
            }
        }
        
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/asesor/gi.test(key)).map(([key, value]) => ({
            Header: key.includes('day') ? `${key.split('day')[1]}/${mes}` : (key==="asesor" ? "ASESOR" : "TOTAL"),
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                let color=gradient(props.cell.row.original[key])
                let number = `${(parseInt(props.cell.row.original[key])*100).toFixed(0)} %`
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
            },
            ...arraytemplate
        ])
    }
    function search(){
        setCompletadosxAsesorData([])
        setabandonosxAsesorData([])
        settasaAbandonosxAsesorData([])
        setventasxAsesorData([])
        setefectividadxAsesorData([])
        setrealizedsearch(true)
        dispatch(showBackdrop(true))
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
                <div style={{flex:1}}>
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
                        columns={efectividadxAsesorTitle}
                        titlemodule={t(langKeys.efectividadxAsesor)}
                        data={efectividadxAsesorData}
                        download={true}
                        pageSizeDefault={50}
                        filterGeneral={false}
                        toolsFooter={false}
                    />
                </div>:""
            }
        </div>
    )
}
const HeatMapTicket: React.FC = () => {
    
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const [realizedsearch, setrealizedsearch] = useState(false);  
    const [asesoresConectadosData, setasesoresConectadosData] = useState<any>([]);  
    const [asesoresConectadosTitle, setasesoresConectadosTitle] = useState<any>([]);  
    const [dataMainHeatMap, setdataMainHeatMap] = useState({
        communicationchannel: "",
        startdate: new Date(new Date().setDate(1)),
        enddate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        datetoshow: `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth()+1).padStart(2, '0')}`,
    });
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

        let mid = (rowmax/2);
        let scale = 255 / (mid);

        function gradient(num:number){
            let number = "";
            if ( num <= 0 ) {
                return "00FF0099";
            }
            else if ( num >= rowmax ) {
                return "FF000099";
            }
            else if ( num <= mid ) {
                number=Math.imul(num, scale).toString(16)
                return "00".slice(number.length) + number +  "FF0099" 
            }
            else {
                number= Math.imul((255-(num-mid)),scale).toString(16)
                return  "FF" +"00".slice(number.length) + number +"0099"  
            }
        }
        
        setasesoresConectadosData(arrayfree)
        const arraytemplate = Object.entries(arrayfree[0]).filter(([key]) => !/hour|horanum/gi.test(key)).map(([key, value]) => ({
            Header: `${key.split('day')[1]}/${mes}`,
            accessor: key,
            NoFilter: true,
            Cell: (props: any) => {
                let color=gradient(props.cell.row.original[key])
                return <div style={{background: `#${color}`, textAlign: "center", color:"black"}} >{(props.cell.row.original[key])}</div>
            },
        }));
        setasesoresConectadosTitle([
            {
                Header: `Hora`,
                accessor: "hournum",
                NoFilter: true,
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
        </div>
    )
}

const Heatmap: FC = () => {
    const [pageSelected, setPageSelected] = useState(0);    
    const [listadvisers, setlistadvisers] = useState<any>([]);
    const [companydomain, setcompanydomain] = useState<any>([]);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const dispatch = useDispatch();
    useEffect(() => {
        if(!multiDataAux.loading){
            setcompanydomain(multiDataAux.data[0]?.data||[])
            setlistadvisers(multiDataAux.data[1]?.data||[])    
        }
    }, [multiDataAux])
    useEffect(() => {
        dispatch(getMultiCollectionAux([
            getValuesFromDomain("EMPRESA"),
            getasesoresbyorgid()
        ]))
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
            {pageSelected === 1 && <HeatMapAsesor companydomain={companydomain} listadvisers={listadvisers}/>}
            {pageSelected === 2 && <HeatMapTicket />}
        </Fragment>
    )
}

export default Heatmap;