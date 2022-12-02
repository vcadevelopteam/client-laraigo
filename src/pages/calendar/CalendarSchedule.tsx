/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import Button from '@material-ui/core/Button';
import { FieldSelect, DateRangePicker } from 'components';
import { getDateCleaned, hours } from 'common/helpers';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { langKeys } from 'lang/keys';
import { Control, FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, Radio, RadioGroup, Switch, TextField, Typography } from '@material-ui/core';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import DeleteIcon from '@material-ui/icons/Delete';
import Schedule from 'components/fields/Schedule';
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';
import { ICalendarSchedule, ICalendarFormFields } from './ICalendar';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerDescription: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    containerDescriptionTitle: {
        fontSize: 24
    },
    containerDescriptionSubtitle: {
        fontSize: 14,
        fontWeight: 500
    },
    root: {
        width: "100%",
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
    errorclass: {
        color: "#f44336",
        margin: 0,
        marginTop: "4px",
        fontSize: "0.75rem",
        textAlign: "left",
        fontFamily: "dm-sans",
        fontWeight: 400,
        lineHeight: 1.66,
    },
}));

interface LabelDaysProps {
    flag: Boolean;
    fieldsIntervals?: any;
    errors?: any;
    intervalsAppend: (interval: ICalendarSchedule) => void;
    intervalsRemove: (index: number) => void;
    register: any;
    setValue: (value: any, value2: any) => void;
    getValues: (value: any) => any;
    trigger: (name: any) => any;
    dow: number;
    labelName: string;
}

const LabelDays: React.FC<LabelDaysProps> = ({ flag, fieldsIntervals, errors, intervalsAppend, intervalsRemove, register, setValue, dow, labelName, getValues, trigger }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    let hoursvalue = hours.map((x: any) => (x.value))
    let dowfields = fieldsIntervals?.filter((x: any) => ((x.dow === dow) && (!x.date)))

    return (
        <>
            <div style={{ display: "grid", gridTemplateColumns: "[first] 100px [line2] 20px [col2] 450px [line3] 20px [col3] 100px [lol] auto [end]", width: "100%", minHeight: 50, marginRight: 10 }}>
                <div style={{ gridColumnStart: "first", margin: "auto", marginLeft: 0, fontWeight: "bold", }}>{labelName}</div>
                {flag &&
                    <>
                        {(fieldsIntervals?.filter((x: any) => ((x.dow === dow) && (!x.date))).length) ?
                            (<div style={{ gridColumnStart: "col2", marginLeft: 50, marginTop: 5, marginBottom: 5, width: "100%" }}>
                                {fieldsIntervals.map((x: any, i: number) => {
                                    if (x.dow !== dow) return null
                                    return (
                                        <div style={{ display: "grid", gridTemplateColumns: "[first] 150px [line1] 20px [col2] 150px [other] 20px [line2] 100px [land] auto [end]", margin: 0, marginTop: 5 }} key={`sun${i}`}>
                                            <>
                                                <div style={{ gridColumnStart: "first" }}>
                                                    <FieldSelect
                                                        fregister={{
                                                            ...register(`intervals.${i}.start`, {
                                                                validate: {
                                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required),
                                                                    timescross: (value: any) => (getValues(`intervals.${i}.end`) > (value)) || t(langKeys.errorhoursdontmatch),
                                                                }

                                                            }),
                                                        }}
                                                        variant="outlined"
                                                        className="col-5nomargin"
                                                        valueDefault={x?.start}
                                                        error={errors?.intervals?.[i]?.start?.message}
                                                        style={{ pointerEvents: "auto" }}
                                                        onChange={(value) => {
                                                            let overlap = getValues(`intervals.${i}.overlap`)
                                                            let fieldEnd = getValues(`intervals.${i}.end`)
                                                            let fieldStart = value?.value
                                                            if ((overlap + 1)) {
                                                                setValue(`intervals.${i}.overlap`, -1)
                                                                setValue(`intervals.${overlap}.overlap`, -1)
                                                            }
                                                            const exists = fieldsIntervals.findIndex((y: any, cont: number) => (y.dow === dow) && (cont !== i)
                                                                && (
                                                                    ((y.start < fieldEnd) && (y.start > fieldStart)) ||
                                                                    ((y.end < fieldEnd) && (y.end > fieldStart)) ||
                                                                    ((fieldEnd < y.end) && (fieldEnd > y.start)) ||
                                                                    ((fieldStart < y.end) && (fieldStart > y.start)) ||
                                                                    (y.start === fieldStart) || (y.end === fieldEnd)
                                                                ));
                                                            if ((exists + 1)) {
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
                                                </div>
                                                <div style={{ gridColumnStart: "col2" }}>
                                                    <FieldSelect
                                                        fregister={{
                                                            ...register(`intervals.${i}.end`, {
                                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                            }),
                                                        }}
                                                        variant="outlined"
                                                        className="col-5nomargin"
                                                        valueDefault={x?.end}
                                                        error={errors?.intervals?.[i]?.end?.message}
                                                        style={{ pointerEvents: "auto" }}
                                                        onChange={(value) => {
                                                            let overlap = getValues(`intervals.${i}.overlap`)
                                                            let fieldEnd = value?.value
                                                            let fieldStart = getValues(`intervals.${i}.start`)
                                                            if ((overlap + 1)) {
                                                                setValue(`intervals.${i}.overlap`, -1)
                                                                setValue(`intervals.${overlap}.overlap`, -1)
                                                            }
                                                            const exists = fieldsIntervals.findIndex((y: any, cont: number) => (y.dow === dow) && (cont !== i)
                                                                && (
                                                                    ((y.start < fieldEnd) && (y.start > fieldStart)) ||
                                                                    ((y.end < fieldEnd) && (y.end > fieldStart)) ||
                                                                    ((fieldEnd < y.end) && (fieldEnd > y.start)) ||
                                                                    ((fieldStart < y.end) && (fieldStart > y.start)) ||
                                                                    (y.start === fieldStart) || (y.end === fieldEnd)
                                                                ));
                                                            if ((exists + 1)) {
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
                                                </div>
                                                <div style={{ gridColumnStart: "line2", width: "16.6%" }}>
                                                    <IconButton style={{ pointerEvents: "auto" }} aria-label="delete" onClick={(e) => {

                                                        let overlap = getValues(`intervals.${i}.overlap`)
                                                        if (overlap !== -1) {
                                                            setValue(`intervals.${overlap}.overlap`, -1)
                                                        }
                                                        e.preventDefault();
                                                        intervalsRemove(i)
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </>
                                            {!!((getValues(`intervals.${i}.overlap`)) + 1) &&
                                                <div style={{ gridColumnStart: "first", gridColumn: "span 3", marginBottom: 5 }}>

                                                    <p className={classes.errorclass} >{t(langKeys.errorhours)}</p>
                                                </div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>) :
                            <div style={{ gridColumnStart: "col2", display: 'flex', margin: 'auto' }}>
                                {t(langKeys.notavailable)}
                            </div>
                        }
                        <div style={{ gridColumnStart: "col3", justifyContent: 'space-between' }}>
                            <div>
                                <IconButton
                                    style={{ pointerEvents: "auto", cursor: "pointer" }}
                                    onClick={() => {
                                        if (dowfields?.length) {
                                            let indexofnexthour = hoursvalue.indexOf(dowfields[dowfields?.length - 1].end)
                                            let startindex = (indexofnexthour + 2) < 48 ? indexofnexthour + 2 : indexofnexthour - 46
                                            let endindex = (indexofnexthour + 4) < 48 ? indexofnexthour + 4 : indexofnexthour - 44
                                            const exists = fieldsIntervals.findIndex((y: any, cont: number) => (y.dow === dow) && (
                                                ((y.start < hoursvalue[endindex]) && (y.start > hoursvalue[startindex])) ||
                                                ((y.end < hoursvalue[endindex]) && (y.end > hoursvalue[startindex])) ||
                                                ((hoursvalue[endindex] < y.end) && (hoursvalue[endindex] > y.start)) ||
                                                ((hoursvalue[startindex] < y.end) && (hoursvalue[startindex] > y.start)) ||
                                                (y.start === hoursvalue[startindex]) || (y.end === hoursvalue[endindex])
                                            ));
                                            intervalsAppend({ start: hoursvalue[startindex], end: hoursvalue[endindex], dow: dow, status: "available", overlap: exists })
                                            trigger(`intervals.${dowfields?.length - 1}.start`)
                                        } else {
                                            intervalsAppend({ start: "09:00:00", end: "17:00:00", dow: dow, status: "available", overlap: -1 })
                                        }
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </div>
                    </>
                }
            </div>
            <div style={{ width: "650px", border: "lightgrey 1px solid" }}></div>
        </>
    )
}

interface CalendarScheduleProps {
    row: Dictionary | null;

    control: Control<ICalendarFormFields, any>;
    register: UseFormRegister<ICalendarFormFields>;
    setValue: UseFormSetValue<ICalendarFormFields>;
    getValues: UseFormGetValues<ICalendarFormFields>;
    trigger: UseFormTrigger<ICalendarFormFields>;
    errors: FieldErrors<ICalendarFormFields>;

    generalstate: any,
    setgeneralstate: (value: any) => void;
    dateinterval: any,
    setdateinterval: (value: any) => void;
}

const CalendarSchedule: React.FC<CalendarScheduleProps> = ({
    row,

    control,
    register,
    setValue,
    getValues,
    trigger,
    errors,

    generalstate,
    setgeneralstate,
    dateinterval,
    setdateinterval,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const initialRange = {
        startDate: row?.startdate ? new Date(row?.startdate + "T00:00:00") : new Date(new Date().setDate(1)),
        endDate: row?.enddate ? new Date(row?.enddate + "T00:00:00") : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: 'selection'
    }
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

    const { sun, mon, tue, wed, thu, fri, sat } = state;

    const handleChange = (event: any) => {
        setdateinterval(event.target.value);
    };

    const handleChangeAvailability = (event: any) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handlerCalendar = (data: ICalendarSchedule[]) => {
        setValue('intervals', data);
        trigger('intervals')
    }

    const { fields: fieldsIntervals, append: intervalsAppend, remove: intervalsRemove } = useFieldArray({
        control,
        name: 'intervals',
    });

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <div className={classes.containerDescription}>
                    <Typography className={classes.containerDescriptionTitle} color="primary">
                        {t(langKeys.calendar_schedule_title)}
                    </Typography>
                    <Typography className={classes.containerDescriptionSubtitle} color="textPrimary">
                        {t(langKeys.calendar_schedule_subtitle)}
                    </Typography>
                </div>
            </div>
            <div style={{ display: 'flex', flexWrap: "wrap", gap: 16 }} >
                <div style={{ flex: 1, minWidth: 250 }}>
                    <div className="col-12" style={{ padding: 5 }}>
                        <Box fontWeight={500} lineHeight="18px" fontSize={16} mb={1} color="textPrimary">{t(langKeys.duration)}</Box>
                        <div className="row-zyx" >
                            <div className="col-6">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.quantity)}</Box>
                                <TextField
                                    color="primary"
                                    type="number"
                                    fullWidth
                                    value={generalstate.duration}
                                    error={!!errors?.duration?.message}
                                    helperText={errors?.duration?.message || null}
                                    onInput={(e: any) => {
                                        let val = Number(e.target.value.replace(/[^0-9 ]/g, ""))
                                        e.target.value = String(val)
                                    }}
                                    onChange={(e) => {
                                        setgeneralstate({ ...generalstate, duration: Number(e.target.value) });
                                        setValue('duration', Number(e.target.value))
                                    }}
                                />
                            </div>
                            <FieldSelect
                                label={t(langKeys.unitofmeasure)}
                                className="col-6"
                                valueDefault={row?.durationtype || "MINUTE"}
                                onChange={(value) => setValue('durationtype', (value?.val || ""))}
                                error={errors?.durationtype?.message}
                                data={[{ desc: t(langKeys.minute_plural), val: "MINUTE" }, { desc: t(langKeys.hour_plural), val: "HOUR" }]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                        </div>
                    </div>
                    <div className="col-12" style={{ padding: 5 }}>
                        <Box fontWeight={500} lineHeight="18px" fontSize={16} mb={1} color="textPrimary">{t(langKeys.settimebeforetheevent)}</Box>
                        <div className="row-zyx" >
                            <div className="col-6">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.quantity)}</Box>
                                <TextField
                                    color="primary"
                                    type="number"
                                    fullWidth
                                    value={generalstate.timebeforeeventduration}
                                    error={!!errors?.timebeforeeventduration?.message}
                                    helperText={errors?.timebeforeeventduration?.message || null}
                                    onInput={(e: any) => {
                                        let val = Number(e.target.value.replace(/[^0-9 ]/g, ""))
                                        e.target.value = String(val)
                                    }}
                                    onChange={(e) => {
                                        setgeneralstate({ ...generalstate, timebeforeeventduration: Number(e.target.value) });
                                        setValue('timebeforeeventduration', Number(e.target.value))
                                    }}
                                />
                            </div>
                            <FieldSelect
                                label={t(langKeys.unitofmeasure)}
                                className="col-6"
                                valueDefault={row?.timebeforeeventunit || "MINUTE"}
                                onChange={(value) => setValue('timebeforeeventunit', (value?.val || ""))}
                                error={errors?.timebeforeeventunit?.message}
                                data={[{ desc: t(langKeys.minute_plural), val: "MINUTE" }, { desc: t(langKeys.hour_plural), val: "HOUR" }]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                        </div>
                    </div>
                    <div className="col-12" style={{ padding: 5 }}>
                        <Box fontWeight={500} lineHeight="18px" fontSize={16} mb={1} color="textPrimary">{t(langKeys.settimeaftertheevent)}</Box>
                        <div className="row-zyx" >
                            <div className="col-6">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.quantity)}</Box>
                                <TextField
                                    color="primary"
                                    type="number"
                                    fullWidth
                                    value={generalstate.timeaftereventduration}
                                    error={!!errors?.timeaftereventduration?.message}
                                    helperText={errors?.timeaftereventduration?.message || null}
                                    onInput={(e: any) => {
                                        let val = Number(e.target.value.replace(/[^0-9 ]/g, ""))
                                        e.target.value = String(val)
                                    }}
                                    onChange={(e) => {
                                        setgeneralstate({ ...generalstate, timeaftereventduration: Number(e.target.value) });
                                        setValue('timeaftereventduration', Number(e.target.value))
                                    }}
                                />
                            </div>
                            <FieldSelect
                                label={t(langKeys.unitofmeasure)}
                                className="col-6"
                                valueDefault={row?.timeaftereventunit || "MINUTE"}
                                onChange={(value) => setValue('timeaftereventunit', (value?.val || ""))}
                                error={errors?.timeaftereventunit?.message}
                                data={[{ desc: t(langKeys.minute_plural), val: "MINUTE" }, { desc: t(langKeys.hour_plural), val: "HOUR" }]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1, minWidth: 250 }}>
                    <React.Fragment>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.dateinterval)}</Box>
                        <RadioGroup aria-label="dateinterval" name="dateinterval1" value={dateinterval} onChange={handleChange}>
                            <FormControlLabel value="DAYS" control={<Radio color="primary" />} label={<div style={{ display: "flex", margin: "auto" }}>{dateinterval === "DAYS" && (
                                <>
                                    <TextField
                                        color="primary"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        value={generalstate.daysintothefuture}
                                        error={!!errors?.daysintothefuture?.message}
                                        helperText={errors?.daysintothefuture?.message || null}
                                        onInput={(e: any) => {
                                            let val = Number(e.target.value.replace(/[^0-9 ]/g, ""))
                                            e.target.value = String(val)
                                        }}
                                        style={{ width: 50 }}
                                        onChange={(e) => {
                                            setgeneralstate({ ...generalstate, daysintothefuture: Number(e.target.value) });
                                            setValue('daysintothefuture', Number(e.target.value))
                                        }}
                                    />
                                </>
                            )}
                                <div style={{ display: "flex", margin: "auto" }}>{t(langKeys.daysintothefuture)}</div></div>} />
                            <FormControlLabel value="RANGE" control={<Radio color="primary" />} label={
                                <div style={{ display: "flex", margin: "auto" }}>
                                    <div style={{ display: "flex", margin: "auto", paddingRight: 8 }}>{t(langKeys.withinadaterange)}  </div>
                                    {dateinterval === "RANGE" && (
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
                            <FormControlLabel value="UNDEFINED" control={<Radio color="primary" />} label={t(langKeys.indefinetly)} />
                        </RadioGroup>
                    </React.Fragment>
                </div>

            </div>

            <div className="row-zyx">
                <div style={{ display: "flex", width: "50%", justifyContent: "space-between", alignItems: "center" }} >
                    <Box fontWeight={500} lineHeight="18px" fontSize={20} mb={1} color="textPrimary">{t(langKeys.availability)}</Box>
                    <div>
                        <FormControlLabel
                            disabled={getValues("intervals").some(x => (x.overlap || -1) !== -1)}
                            control={<Switch
                                color="primary" checked={generalstate.calendarview} onChange={(e) => {
                                    setgeneralstate({ ...generalstate, calendarview: e.target.checked });
                                }} />}
                            label={t(langKeys.calendarview)}
                        />
                    </div>
                </div>
            </div>
            <div className="row-zyx">
                {!generalstate.calendarview ? (
                    <div>
                        <FormControl component="fieldset" className={classes.formControl} >
                            <FormGroup>
                                <FormControlLabel
                                    style={{ pointerEvents: "none" }}
                                    classes={{ label: classes.root }}
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
                                    classes={{ label: classes.root }}
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
                                    classes={{ label: classes.root }}
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
                                    classes={{ label: classes.root }}
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
                                    classes={{ label: classes.root }}
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
                                    classes={{ label: classes.root }}
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
                                    classes={{ label: classes.root }}
                                    control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sat} onChange={handleChangeAvailability} name="sat" />}
                                    label={<LabelDays
                                        flag={sat}
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
                ) :
                    <Schedule
                        data={fieldsIntervals}
                        setData={handlerCalendar}
                    />
                }
            </div>
        </div>
    )
}

export default CalendarSchedule;