/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, FieldEditMulti, RichText, ColorInput, AntTabPanel } from 'components';
import { calcKPIManager, convertLocalDate, dictToArrayKV, getDateCleaned, getDateToday, getFirstDayMonth, getLastDayMonth, getValuesFromDomain, insCalendar, hours, selCalendar, selKPIManager, selKPIManagerHistory } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain, getCollectionAux, getCollectionAux2, resetMainAux, resetMainAux2 } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, ListItemIcon, Menu, MenuItem, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@material-ui/core';
import { Range } from 'react-date-range';
import { DateRangePicker } from 'components';
import { CalendarIcon, DuplicateIcon } from 'icons';
import GaugeChart from 'react-gauge-chart'
import {ContactSupportOutlined, Search as SearchIcon }  from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import { Descendant } from 'slate';
import { renderToString, toElement } from 'components/fields/RichText';
import { ColorChangeHandler } from 'react-color';
import clsx from 'clsx';
import Schedule from 'components/fields/Schedule';
import AddIcon from '@material-ui/icons/Add';

interface RowSelected {
    row: Dictionary | null,
    operation: string
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailCalendarProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: (id?: number) => void;
}

type ISchedule = {
    start:string,
    end:string,
    dow:number,
    status: string,
    overlap?:number,
}

type FormFields = {
    id: number,
    eventcode: number,
    eventname: string,
    location: string,
    mailbody: string,
    color: string,
    status: string,
    notificationtype: string,
    notificationtemplate: string,
    daysintothefuture: number,
    quantity: number,
    operation: string,
    intervals: ISchedule[],
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    root:{
        width:"100%",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    richTextfield: {
        margin: theme.spacing(1),
        minHeight: 150,
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
    formControl: {
      margin: theme.spacing(3),
    },
    icon: {
      borderRadius: 3,
      width: 16,
      height: 16,
      boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
      backgroundColor: '#f5f8fa',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
      '$root.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
      },
      'input:hover ~ &': {
        backgroundColor: '#ebf1f5',
      },
      'input:disabled ~ &': {
        boxShadow: 'none',
        background: 'rgba(206,217,224,.5)',
      },
    },
    checkedIcon: {
      backgroundColor: '#137cbd',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
      '&:before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
          " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
          "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
      },
      'input:hover ~ &': {
        backgroundColor: '#106ba3',
      },
    },
    errorclass:{
        color: "#f44336",
        margin: 0,
        marginTop: "4px",
        fontSize: "0.75rem",
        textAlign: "left",
        fontFamily: "dm-sans",
        fontWeight: 400,
        lineHeight: 1.66,
    }
}));

const dataPeriod: Dictionary = {
    MINUTE: 'minute',
    HOUR: 'hour',
    DAY: 'day',
    MONTH: 'month'
};
const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

interface LabelDaysProps {
    flag: Boolean;
    fieldsIntervals?: any;
    errors?: any;
    intervalsAppend: (interval: ISchedule) => void;
    intervalsRemove: (index: number) => void;
    register: any;
    setValue: (value: any,value2:any) => void;
    getValues: (value: any) => any;
    trigger: (name:any) => any;
    dow: number;
    labelName: string;
}

const LabelDays: React.FC<LabelDaysProps>=({flag, fieldsIntervals,errors,intervalsAppend,intervalsRemove,register,setValue,dow,labelName,getValues,trigger})=>{
    const { t } = useTranslation();
    const classes = useStyles();
    let hoursvalue=hours.map((x:any)=>(x.value))
    let dowfields = fieldsIntervals?.filter((x:any)=>x.dow===dow)
    

    return (
        <>
        <div style={{display:"flex", width: "100%",paddingTop:5, marginRight:10}}>
            <div style={{display:"flex", margin: "auto",marginLeft: 0,fontWeight:"bold", width:100}}>{labelName}</div>
            {flag &&
                <>
                    {(fieldsIntervals?.filter((x:any)=>x.dow===dow).length)?
                        (<div style={{ marginLeft: 50, width:"100%" }}>
                            {fieldsIntervals.map((x:any,i:number) =>{
                                if (x.dow!==dow) return null
                                return (
                                    <div className="row-zyx" style={{margin:0}} key={`sun${i}`}>                                
                                        <>
                                        <FieldSelect
                                            fregister={{
                                                ...register(`intervals.${i}.start`, {
                                                    validate: {
                                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required),
                                                        timescross: (value: any) => ( getValues(`intervals.${i}.end`)>(value)) || t(langKeys.errorhoursdontmatch),
                                                    }
                                                    
                                                }),
                                            }}
                                            className="col-5nomargin"
                                            valueDefault={x?.start}
                                            error={errors?.intervals?.[i]?.start?.message}
                                            style={{pointerEvents: "auto"}}                                                                            
                                            onChange={(value) => {
                                                let overlap= getValues(`intervals.${i}.overlap`)
                                                let fieldEnd= getValues(`intervals.${i}.end`)
                                                let fieldStart= value?.value
                                                if((overlap+1)){
                                                    setValue(`intervals.${i}.overlap`, -1)
                                                    setValue(`intervals.${overlap}.overlap`, -1)
                                                }
                                                const exists = fieldsIntervals.findIndex((y:any,cont:number) => (y.dow === dow) && (cont!==i)
                                                    && (
                                                    ((y.start < fieldEnd) && (y.start > fieldStart)) ||
                                                    ((y.end < fieldEnd) && (y.end > fieldStart)) ||
                                                    ((fieldEnd < y.end) && (fieldEnd > y.start)) ||
                                                    ((fieldStart < y.end )&& (fieldStart > y.start)) ||
                                                    (y.start===fieldStart )|| (y.end===fieldEnd)
                                                ));
                                                if((exists+1)){
                                                    console.log(exists)
                                                    setValue(`intervals.${i}.overlap`, exists)
                                                    setValue(`intervals.${exists}.overlap`, i)
                                                }
                                                setValue(`intervals.${i}.start`, value?.value)
                                                trigger(`intervals.${i}.start`)
                                            }}
                                            data={hours}
                                            optionDesc="desc"
                                            optionValue="value"
                                        />                               
                                        <FieldSelect
                                            fregister={{
                                                ...register(`intervals.${i}.end`, {
                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                }),
                                            }}
                                            className="col-5nomargin"
                                            valueDefault={x?.end}
                                            error={errors?.intervals?.[i]?.end?.message}
                                            style={{pointerEvents: "auto"}}                                                                            
                                            onChange={(value) => {           
                                                let overlap= getValues(`intervals.${i}.overlap`)
                                                let fieldEnd= value?.value
                                                let fieldStart= getValues(`intervals.${i}.start`)
                                                if((overlap+1)){
                                                    setValue(`intervals.${i}.overlap`, -1)
                                                    setValue(`intervals.${overlap}.overlap`, -1)
                                                }
                                                const exists = fieldsIntervals.findIndex((y:any,cont:number) => (y.dow === dow) && (cont!==i)
                                                    && (
                                                    ((y.start < fieldEnd) && (y.start > fieldStart)) ||
                                                    ((y.end < fieldEnd) && (y.end > fieldStart)) ||
                                                    ((fieldEnd < y.end) && (fieldEnd > y.start)) ||
                                                    ((fieldStart < y.end )&& (fieldStart > y.start)) ||
                                                    (y.start===fieldStart )|| (y.end===fieldEnd)
                                                ));
                                                if((exists+1)){
                                                    setValue(`intervals.${exists}.overlap`, i)
                                                    setValue(`intervals.${i}.overlap`, exists)
                                                    trigger(`intervals.${exists}.start`)
                                                }                                     
                                                setValue(`intervals.${i}.end`, value?.value)
                                                trigger(`intervals.${i}.start`)
                                            }}
                                            data={hours}
                                            optionDesc="desc"
                                            optionValue="value"
                                        />                                                          
                                        <div style={{ width: "16.6%" }}>
                                            <IconButton style={{pointerEvents: "auto"}} aria-label="delete" onClick={(e) =>{e.preventDefault();intervalsRemove(i)}}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                        </>
                                        {!!((getValues(`intervals.${i}.overlap`))+1) && 
                                            <p className={classes.errorclass} >{t(langKeys.errorhours)}</p>
                                        }
                                    </div>
                                )
                            })}
                        </div>):
                        <div style={{ display: 'flex', margin: 'auto' }}>
                            {t(langKeys.notavailable)}
                        </div>
                        }
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                endIcon={<AddIcon style={{ color: "#deac32" }} />}
                                style={{ backgroundColor: "#6c757d", pointerEvents: "auto",width:150  }}
                                onClick={() => {
                                    if (dowfields?.length) {
                                        let indexofnexthour = hoursvalue.indexOf(dowfields[dowfields?.length-1].end)
                                        let startindex = (indexofnexthour+2)<48?indexofnexthour+2:indexofnexthour-46
                                        let endindex = (indexofnexthour+4)<48?indexofnexthour+4:indexofnexthour-44
                                        const exists = fieldsIntervals.findIndex((y:any,cont:number) => (y.dow === dow) && (
                                                    ((y.start < hoursvalue[endindex]) && (y.start > hoursvalue[startindex])) ||
                                                    ((y.end < hoursvalue[endindex]) && (y.end > hoursvalue[startindex])) ||
                                                    ((hoursvalue[endindex] < y.end) && (hoursvalue[endindex] > y.start)) ||
                                                    ((hoursvalue[startindex] < y.end )&& (hoursvalue[startindex] > y.start)) ||
                                                    (y.start===hoursvalue[startindex] )|| (y.end===hoursvalue[endindex])
                                        ));
                                        intervalsAppend({start:hoursvalue[startindex],end:hoursvalue[endindex],dow:dow, status: "available", overlap: exists})
                                        trigger(`intervals.${dowfields?.length-1}.start`)
                                    }else{
                                        intervalsAppend({start:"09:00:00",end:"17:00:00",dow:dow, status: "available",overlap:-1})
                                    }
                                }}
                                >{t(langKeys.newinterval)}
                            </Button>
                        </div>
                    </div>
                </>
            }
        </div>
        <div style={{width:"100%", border: "lightgrey 1px solid"}}></div>
        </>
    )
}

const DetailCalendar: React.FC<DetailCalendarProps> = ({ data: { row, operation }, setViewSelected, multiData, fetchData }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [bodyobject, setBodyobject] = useState<Descendant[]>(row?.mailbodyobject || [{ "type": "paragraph", "children": [{ "text": row?.mailbody || "" }] }])
    const [color, setColor] = useState(row?.color||"#aa53e0");
    const [tabIndex, setTabIndex] = useState(0);
    const [dateinterval, setdateinterval] = React.useState('daysintothefuture');
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [state, setState] = React.useState({
        sun: false,
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: false,
    });
    const [intervals, setIntervals] = React.useState<{sun: any[],mon: any[],tue: any[],wed: any[],thu: any[],fri: any[],sat: any[]}>({
        sun: [],
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
    })

    const handleChange = (event:any) => {
      setdateinterval(event.target.value);
    };

    const handleChangeAvailability = (event:any) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { control, register, reset, handleSubmit, setValue, getValues, trigger,formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            id: row?.id || 0,
            eventcode: row?.eventcode||0,
            eventname: row?.eventname||"",
            location: row?.location||"",
            mailbody: row?.mailbody || "",
            color: row?.color || "#aa53e0",
            status: row?.status || "ACTIVO",
            notificationtype: row?.notificationtype || "",
            notificationtemplate: row?.notificationtemplate || "",
            daysintothefuture: row?.daysintothefuture || 0,
            quantity: row?.quantity || 0,
            operation: operation==="DUPLICATE"? "INSERT":operation,
            intervals: row?.intervals || [],
        }
    });

    const { fields: fieldsIntervals, append: intervalsAppend, remove: intervalsRemove } = useFieldArray({
        control,
        name: 'intervals',
    });

    console.log(fieldsIntervals)
    
    React.useEffect(() => {
        register('eventcode', { validate: (value) => Boolean(value && value>0) || String(t(langKeys.field_required)) });
        register('quantity', { validate: (value) => Boolean(value && value>0) || String(t(langKeys.field_required)) });
        register('eventname', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('location', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('status', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('notificationtype', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('notificationtemplate', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        if(dateinterval==="daysintothefuture"){
            register('daysintothefuture', { validate: (value) => Boolean(value && value>0) || String(t(langKeys.field_required)) });
        }
    }, [register]);

    const handleColorChange: ColorChangeHandler = (e) => {
        setColor(e.hex);
        setValue('color', e.hex);
    }

    const onSubmit = handleSubmit((data) => {
        
        if(data.intervals.some(x=>(x.overlap||-1)!==-1)){
            console.log("submitted")
        }else{
            console.log("error overlap")
        }
        /*
        console.log(data)
        const callback = () => {
            data.mailbody = renderToString(toElement(bodyobject));
            if (data.mailbody === '<div data-reactroot=""><p><span></span></p></div>')
                return;
                
            //dispatch(execute(reportSchedulerIns({ ...data, filterjson: JSON.stringify(filtertosend), mailbodyobject: bodyobject })));
            //dispatch(execute(insKPIManager(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))*/
    });

    const arrayBread = [
        { id: "view-1", name: t(langKeys.calendar)},
        { id: "view-2", name: t(langKeys.calendar_detail) }
    ];
    const { sun,mon,tue,wed,thu,fri,sat } = state;
    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                        <TitleDetail
                            title={row?.id ? `${row.name}` : t(langKeys.newcalendar)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}>
                            {t(langKeys.save)}
                        </Button>
                    </div>
                    
                </div>
                <Tabs
                    value={tabIndex}
                    onChange={(_, i) => setTabIndex(i)}
                    className={classes.tabs}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.generalinformation} count={2} />
                            </div>
                        )}
                    />
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.schedule} count={2} />
                            </div>
                        )}
                    />
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                Calendario test
                            </div>
                        )}
                    />
                </Tabs>
                
                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.eventcode)}
                                className="col-6"
                                type="number"
                                valueDefault={getValues('eventcode')}
                                onChange={(value) => setValue('eventcode', value)}
                                error={errors?.eventcode?.message}
                            />
                            <FieldEdit
                                label={t(langKeys.eventname)}
                                className="col-6"
                                valueDefault={getValues('eventname')}
                                onChange={(value) => setValue('eventname', value)}
                                error={errors?.eventname?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.location)}
                                className="col-6"
                                valueDefault={getValues('location')}
                                onChange={(value) => setValue('location', value)}
                                error={errors?.location?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <React.Fragment>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.description)}</Box>
                                <RichText
                                    value={bodyobject}
                                    onChange={(value) => {
                                        setBodyobject(value)
                                    }}
                                    spellCheck
                                    image={false}
                                />
                            </React.Fragment>
                        </div>
                        <div className="row-zyx" >
                            <FieldView
                                label={t(langKeys.eventlink)}
                                className="col-6"
                                value={"eventlink"}
                            />
                            <a className='col-6' href="https://example.com">{t(langKeys.seeagendapage)}</a>
                        </div>
                        <div className="row-zyx" >
                            <div className="col-6">
                                <React.Fragment>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.color)}</Box>
                                    <ColorInput hex={color} onChange={handleColorChange} />
                                </React.Fragment>
                            </div>
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={row?.status || "ACTIVO"}
                                onChange={(value) => setValue('status', (value?value.domainvalue:""))}
                                error={errors?.status?.message}
                                data={dataStatus}
                                uset={true}
                                prefixTranslation="status_"
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className="row-zyx" >
                            <FieldSelect
                                label={t(langKeys.notificationtype)}
                                className="col-6"
                                valueDefault={row?.notificationtype || ""}
                                onChange={(value) => setValue('notificationtype', (value?.val||""))}
                                error={errors?.notificationtype?.message}
                                data={[{desc: "HSM",val: "HSM"},{desc: t(langKeys.email),val: "EMAIL"}]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                            <FieldSelect
                                label={t(langKeys.notificationtemplate)}
                                className="col-6"
                                valueDefault={row?.notificationtemplate || ""}
                                onChange={(value) => setValue('notificationtemplate', (value?.val||""))}
                                error={errors?.notificationtemplate?.message}
                                data={[{desc: "HSM",val: "HSM"},{desc: t(langKeys.email),val: "EMAIL"}]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                        </div>
                    </div>
                </AntTabPanel>
                <AntTabPanel index={1} currentIndex={tabIndex}>
                    <div className={classes.containerDetail}>
                        <div className="row-zyx" >
                            <div className="col-6">
                                <React.Fragment>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.dateinterval)}</Box>
                                    <RadioGroup aria-label="dateinterval" name="dateinterval1" value={dateinterval} onChange={handleChange}>
                                        <FormControlLabel value="daysintothefuture" control={<Radio color="primary"/>} label={<div style={{display:"flex", margin: "auto"}}>{dateinterval==="daysintothefuture" && (
                                            <>
                                                <FieldEdit
                                                    width={50}
                                                    valueDefault={getValues('daysintothefuture')}
                                                    type="number"
                                                    size="small"
                                                    onChange={(value) => setValue('daysintothefuture', value)}
                                                    error={errors?.daysintothefuture?.message}
                                                />
                                            </>
                                        )}
                                        <div style={{display:"flex", margin: "auto"}}>{t(langKeys.daysintothefuture)}</div></div>} />
                                        <FormControlLabel value="withinadaterange" control={<Radio color="primary"/>} label={
                                        <div style={{display:"flex", margin: "auto"}}>
                                            <div style={{display:"flex", margin: "auto", paddingRight:8}}>{t(langKeys.withinadaterange)}  </div>
                                            {dateinterval==="withinadaterange" && (
                                                <>
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
                                                </>
                                            )}
                                        </div>} />
                                        <FormControlLabel value="indefinetly" control={<Radio color="primary"/>} label={t(langKeys.indefinetly)} />
                                    </RadioGroup>
                                </React.Fragment>
                            </div>
                        </div>
                        <div className="row-zyx" >
                            <div className="col-4" style={{padding: 5}}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={16} mb={1} color="textPrimary">{t(langKeys.duration)}</Box>
                                <div className="row-zyx" >
                                    <FieldEdit
                                        label={t(langKeys.quantity)}
                                        className="col-6"
                                        valueDefault={getValues('quantity')}
                                        onChange={(value) => setValue('quantity', value)}
                                        error={errors?.quantity?.message}
                                    />
                                    <FieldSelect
                                        label={t(langKeys.unitofmeasure)}
                                        className="col-6"
                                        valueDefault={row?.notificationtemplate || ""}
                                        onChange={(value) => setValue('notificationtemplate', (value?.val||""))}
                                        error={errors?.notificationtemplate?.message}
                                        data={[{desc: "MM",val: "MM"},{desc: "HH",val: "HH"}]}
                                        optionDesc="desc"
                                        optionValue="val"
                                    />
                                </div>
                            </div>
                            <div className="col-4" style={{padding: 5}}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={16} mb={1} color="textPrimary">{t(langKeys.settimebeforetheevent)}</Box>
                                <div className="row-zyx" >
                                    <FieldEdit
                                        label={t(langKeys.quantity)}
                                        className="col-6"
                                        valueDefault={getValues('quantity')}
                                        onChange={(value) => setValue('quantity', value)}
                                        error={errors?.quantity?.message}
                                    />
                                    <FieldSelect
                                        label={t(langKeys.unitofmeasure)}
                                        className="col-6"
                                        valueDefault={row?.notificationtemplate || ""}
                                        onChange={(value) => setValue('notificationtemplate', (value?.val||""))}
                                        error={errors?.notificationtemplate?.message}
                                        data={[{desc: "MM",val: "MM"},{desc: "HH",val: "HH"}]}
                                        optionDesc="desc"
                                        optionValue="val"
                                    />
                                </div>
                            </div>
                            <div className="col-4" style={{padding: 5}}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={16} mb={1} color="textPrimary">{t(langKeys.settimeaftertheevent)}</Box>
                                <div className="row-zyx" >
                                    <FieldEdit
                                        label={t(langKeys.quantity)}
                                        className="col-6"
                                        valueDefault={getValues('quantity')}
                                        onChange={(value) => setValue('quantity', value)}
                                        error={errors?.quantity?.message}
                                    />
                                    <FieldSelect
                                        label={t(langKeys.unitofmeasure)}
                                        className="col-6"
                                        valueDefault={row?.notificationtemplate || ""}
                                        onChange={(value) => setValue('notificationtemplate', (value?.val||""))}
                                        error={errors?.notificationtemplate?.message}
                                        data={[{desc: "MM",val: "MM"},{desc: "HH",val: "HH"}]}
                                        optionDesc="desc"
                                        optionValue="val"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="row-zyx">
                            <Box fontWeight={500} lineHeight="18px" fontSize={20} mb={1} color="textPrimary">{t(langKeys.availability)}</Box>
                            <div>
                                <FormControl component="fieldset" className={classes.formControl} style={{width:"100%"}}>
                                    <FormGroup>
                                    <FormControlLabel
                                        style={{ pointerEvents: "none" }}
                                        classes={{label: classes.root}}
                                        control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sun} onChange={handleChangeAvailability} name="sun" />}
                                        label={<LabelDays 
                                            flag={sun} 
                                            fieldsIntervals={fieldsIntervals} 
                                            errors={errors} 
                                            intervalsAppend={intervalsAppend} 
                                            intervalsRemove={intervalsRemove} 
                                            register={register} 
                                            setValue={setValue} 
                                            dow={0} 
                                            labelName={t(langKeys.sunday)}
                                            getValues={getValues}
                                            trigger={trigger}
                                        />} />
                                    <FormControlLabel
                                        style={{ pointerEvents: "none" }}
                                        classes={{label: classes.root}}
                                        control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={mon} onChange={handleChangeAvailability} name="mon" />}
                                        label={<LabelDays 
                                            flag={mon} 
                                            fieldsIntervals={fieldsIntervals} 
                                            errors={errors} 
                                            intervalsAppend={intervalsAppend} 
                                            intervalsRemove={intervalsRemove} 
                                            register={register} 
                                            setValue={setValue} 
                                            dow={1} 
                                            labelName={t(langKeys.monday)}
                                            getValues={getValues}
                                            trigger={trigger}
                                        />}
                                    />
                                    <FormControlLabel
                                        style={{ pointerEvents: "none" }}
                                        classes={{label: classes.root}}
                                        control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={tue} onChange={handleChangeAvailability} name="tue" />}
                                        label={<LabelDays 
                                            flag={tue} 
                                            fieldsIntervals={fieldsIntervals} 
                                            errors={errors} 
                                            intervalsAppend={intervalsAppend} 
                                            intervalsRemove={intervalsRemove} 
                                            register={register} 
                                            setValue={setValue} 
                                            dow={2} 
                                            labelName={t(langKeys.tuesday)}
                                            getValues={getValues}
                                            trigger={trigger}
                                        />}
                                    />
                                    <FormControlLabel
                                        style={{ pointerEvents: "none" }}
                                        classes={{label: classes.root}}
                                        control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={wed} onChange={handleChangeAvailability} name="wed" />}
                                        label={<LabelDays 
                                            flag={wed} 
                                            fieldsIntervals={fieldsIntervals} 
                                            errors={errors} 
                                            intervalsAppend={intervalsAppend} 
                                            intervalsRemove={intervalsRemove} 
                                            register={register} 
                                            setValue={setValue} 
                                            dow={3} 
                                            labelName={t(langKeys.wednesday)}
                                            getValues={getValues}
                                            trigger={trigger}
                                        />}
                                    />
                                    <FormControlLabel
                                        style={{ pointerEvents: "none" }}
                                        classes={{label: classes.root}}
                                        control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={thu} onChange={handleChangeAvailability} name="thu" />}
                                        label={<LabelDays 
                                            flag={thu} 
                                            fieldsIntervals={fieldsIntervals} 
                                            errors={errors} 
                                            intervalsAppend={intervalsAppend} 
                                            intervalsRemove={intervalsRemove} 
                                            register={register} 
                                            setValue={setValue} 
                                            dow={4} 
                                            labelName={t(langKeys.thursday)}
                                            getValues={getValues}
                                            trigger={trigger}
                                        />}
                                    />
                                    <FormControlLabel
                                        style={{ pointerEvents: "none" }}
                                        classes={{label: classes.root}}
                                        control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={fri} onChange={handleChangeAvailability} name="fri" />}
                                        label={<LabelDays 
                                            flag={fri} 
                                            fieldsIntervals={fieldsIntervals} 
                                            errors={errors} 
                                            intervalsAppend={intervalsAppend} 
                                            intervalsRemove={intervalsRemove} 
                                            register={register} 
                                            setValue={setValue} 
                                            dow={5} 
                                            labelName={t(langKeys.friday)}
                                            getValues={getValues}
                                            trigger={trigger}
                                        />}
                                    />
                                    <FormControlLabel
                                        style={{ pointerEvents: "none" }}
                                        classes={{label: classes.root}}
                                        control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sat} onChange={handleChangeAvailability} name="sat" />}
                                        label={<LabelDays 
                                            flag={sun} 
                                            fieldsIntervals={fieldsIntervals} 
                                            errors={errors} 
                                            intervalsAppend={intervalsAppend} 
                                            intervalsRemove={intervalsRemove} 
                                            register={register} 
                                            setValue={setValue} 
                                            dow={6} 
                                            labelName={t(langKeys.saturday)}
                                            getValues={getValues}
                                            trigger={trigger}
                                        />}
                                    />
                                    </FormGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </AntTabPanel>
                <AntTabPanel index={2} currentIndex={tabIndex}>
                    <Schedule data={[]} />
                </AntTabPanel>
            </form>
        </div>
    );
}

const IconOptions: React.FC<{
    onDelete?: (e?: any) => void;
    onDuplicate?: (e?: any) => void;
    onCalc?: (e?: any) => void;
}> = ({ onDelete, onDuplicate, onCalc }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { t } = useTranslation();

    const handleClose = () => setAnchorEl(null);
    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClick={(e) => e.stopPropagation()}
                onClose={handleClose}
            >
                {onDelete &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onDelete();
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.delete)}
                    </MenuItem>
                }
                {onDuplicate &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onDuplicate();
                    }}>
                        <ListItemIcon>
                            <DuplicateIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.duplicate)}
                    </MenuItem>
                }
                {onCalc &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onCalc();
                    }}>
                        <ListItemIcon>
                            <UpdateIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.calculate)}
                    </MenuItem>
                }
            </Menu>
        </>
    )
}

const Calendar: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, operation: "" });
    const [waitSave, setWaitSave] = useState(false);
    const [waitDuplicate, setWaitDuplicate] = useState(false);
    const [dataGrid, setDataGrid] = useState<any[]>([]);

    useEffect(() => {
        setDataGrid(mainResult.mainData.data)
    }, [mainResult.mainData.data])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, operation: "INSERT" });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, operation: "EDIT" });
    }
    const handleDuplicate = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, operation: "DUPLICATE" });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insCalendar({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }
    
    const columns = React.useMemo(
        () => [
            {
                accessor: 'id',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <IconOptions
                            onDelete={() => {
                                handleDelete(row);
                            }}
                            onDuplicate={() => {
                                handleDuplicate(row);
                            }}
                            />
                            )
                        }
                    },
            {
                Header: t(langKeys.code),
                accessor: 'code',
            },
            {
                Header: t(langKeys.name),
                accessor: 'name',
            },
            {
                Header: t(langKeys.location),
                accessor: 'location',
            },
            {
                Header: t(langKeys.duration),
                accessor: 'duration',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (<div>{row.timeduration} {t((langKeys as any)[`${row.timeunit?.toLowerCase()}${row.timeduration > 1 ? '_plural' : ''}`])}</div>)
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.notificationtype),
                accessor: 'notificationtype',
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(selCalendar(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.calendar_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    

    useEffect(() => {
        if (waitDuplicate) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_duplicate) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitDuplicate(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.calendar_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitDuplicate(false);
            }
        }
    }, [executeResult, waitDuplicate])

    if (viewSelected === "view-1") {
        return (
            <div>
                <div>
                    <TableZyx
                        onClickRow={handleEdit}
                        columns={columns}
                        titlemodule={t(langKeys.calendar_plural, { count: 2 })}
                        data={dataGrid}
                        download={true}
                        loading={mainResult.mainData.loading}
                        register={true}
                        handleRegister={handleRegister}
                    />
                </div>
                <div style={{marginTop: 20}}>
                    <Schedule
                        data={[]}
                    />

                </div>
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailCalendar
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;
}

export default Calendar;