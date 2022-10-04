import { IconButton, makeStyles } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import React, { FC, useCallback, useEffect, useState } from "react";
import clsx from 'clsx';
import { Dictionary } from "@types";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import EventIcon from '@material-ui/icons/Event';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import RepeatIcon from '@material-ui/icons/Repeat';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FieldSelect } from "components";
import { useFieldArray, useForm } from 'react-hook-form';
import { hours, calculateDateFromMonth, dayNames } from "common/helpers";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import CalendarZyx from "./Calendar";

interface ISchedule {
    dow: number;
    start: string;
    end: string;
    date?: string | undefined;
    status: string;
    overlap?: number;
}
interface ScheduleInputProps {
    notPreviousDays?: boolean;
    data: ISchedule[];
    setData: (p: any) => void;
    // hex: string;
    // onChange: ColorChangeHandler;
    // disabled?: boolean;
}
interface DayInputProps {
    day: DayProp;
    notPreviousDays?: boolean;
    handleClick: (event: any, day: DayProp) => void;
}

interface DayProp {
    date: Date;
    dateString: string;
    dow: number;
    dom: number;
    isToday?: boolean;
    isDayPreview?: boolean;
    notPreviousDays?: boolean;
    data: ISchedule[];
    type: string;
}

const getDay = (day?: number) => {
    return day ? (dayNames[day] || "") : "";
}

const useScheduleStyles = makeStyles(theme => ({
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
    boxDay: {
        height: 130,
        borderRight: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
        padding: 8,
    },
    boxDayHover: {
        cursor: 'pointer',
        '&:hover': {
            padding: 6,
            backgroundColor: '#eef5ff',
            border: '2px solid #5593ff'
        }
    },
    boxDayForbidden: {
        backgroundColor: '#dbdbdb3d',
        '& > div': {
            color: '#767676'
        }
    },
    isToday: {
        fontWeight: 'bold',
        backgroundColor: '#e1e1e1',
        textAlign: 'center',
        borderRadius: '50%',
    },
    dow: {
        fontWeight: 'bold',
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13
    },
    container: {
        width: '910px',
        backgroundColor: '#fff'
    },
    wrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderLeft: '1px solid #e0e0e0',
        borderTop: '1px solid #e0e0e0',
    },
    wrapperDays: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderLeft: '1px solid #e0e0e0',
        borderRight: '1px solid #e0e0e0',
    },
    dowHeader: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#767676',
        padding: '12px 0',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    containerInfo: {
        border: '1px solid #e0e0e0',
        padding: theme.spacing(3),
        display: 'grid',
        gridTemplateColumns: '1fr 120px',
    },
    containerInfoTitle: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    containerButtons: {
        borderRadius: 10,
        border: '1px solid #e0e0e0',
        display: 'flex',
        height: 40,
        justifySelf: 'center',
        alignSelf: 'center',
        width: '100%'
    },
    buttonMonth: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    timeDate: {
        fontSize: 14,
        display: 'flex',
        fontFamily: 'Calibri',
        justifyContent: 'center'
    },
    centerInput: {
        display: 'flex',
        alignItems: 'center'
    },
    infoBox: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

const BoxDay: FC<DayInputProps> = ({ day, notPreviousDays, handleClick }) => {
    const classes = useScheduleStyles();
    const [isAvailable, setIsAvailable] = useState(true);
    const [more3Items, setMore3Items] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        const isAvaialable = !day.data.some(x => x.status === "unavailable");
        setMore3Items(day.data.length > 3)
        setIsAvailable(isAvaialable);
        // if 
    }, [day.data])

    return (
        <div
            onClick={(e: any) => handleClick(e, day)}
            className={clsx(classes.boxDay, {
                [classes.boxDayHover]: !day.isDayPreview,
                [classes.boxDayForbidden]: notPreviousDays && day.isDayPreview,
            })}
        >
            <div className={classes.infoBox}>
                <div className={clsx(classes.dow, {
                    [classes.isToday]: day.isToday
                })}>
                    {day.dom}
                </div>
                <div>
                    {day.type === "personalized" && (
                        <EventIcon style={{ width: 16 }} color="action" />
                    )}
                    {day.type === "repeat" && (
                        <RepeatIcon style={{ width: 16 }} color="action" />
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {!isAvailable && (
                    <div>{t(langKeys.unavailable)}</div>
                )}
                {isAvailable && day?.data.slice(0, 3).map((item, index) => (
                    <div key={index} className={classes.timeDate}>
                        {item.start} - {item.end}
                    </div>
                ))}
                {isAvailable && more3Items && (
                    <div style={{ fontWeight: 'bold' }}>+ {day.data.length - 3} {t(langKeys.more_times)}</div>
                )}
            </div>
        </div>
    )
}

const DialogDate: React.FC<{
    open: boolean, setOpen: (param: any) => void, day?: DayProp, handlerChangeDates: (p: any) => void, type?: string
}> = ({ open, setOpen, day, handlerChangeDates, type }) => {
    const { t } = useTranslation();
    const classes = useScheduleStyles();

    const [dateSelected, setDateSelected] = useState<DayProp[]>([])

    useEffect(() => {
        if (!!day)
            setDateSelected([day])
    }, [day])

    const onHandlerChange = (p1: any, p2: any, p3: string) => {
        setDateSelected(p1)
    }

    const { control, register, reset, setValue, getValues, trigger, formState: { errors } } = useForm<{ times: ISchedule[] }>({
        defaultValues: {
            times: day?.data || []
        }
    });

    useEffect(() => {
        reset({
            times: day?.data.filter(x => x.status === "available") || []
        })
    }, [reset, day])

    const { fields: fieldstimes, append: timesAppend, remove: timesRemove } = useFieldArray({
        control,
        name: 'times',
    });

    const onSubmitManual = async () => {
        const allOk = await trigger();
        if (allOk) {
            const data = getValues();
            if (data.times.every(x => (x.overlap || -1) === -1)) {
                const haveTimes = data.times.length > 0;
                const timesToAdd = dateSelected.reduce((acc: ISchedule[], x) => ([
                    ...acc,
                    ...(haveTimes ? data.times.map(time => ({
                        start: time.start,
                        end: time.end,
                        dow: time.dow,
                        dom: x.dom,
                        date: type === "personalized" ? x.dateString : undefined,
                        status: "available"
                    })) : (type === "personalized" ? [{
                        start: "",
                        end: "",
                        dow: x.dow,
                        dom: x.dom,
                        date: x.dateString,
                        status: "unavailable"
                    }] : []))
                ]), []);
    
                handlerChangeDates(timesToAdd);
                setOpen(false)
            }
        }
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth={"xs"}
        >
            <DialogTitle style={{ textAlign: 'center' }}>
                {type === "personalized" ? t(langKeys.selectday) : t(getDay(day?.dow)) + t(langKeys.availability).toLowerCase()}

            </DialogTitle>
            <DialogContent>
                <div>
                    {type === "personalized" && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                            <CalendarZyx
                                selectedDays={[day?.dateString!!]}
                                onChange={onHandlerChange}
                                multiple
                            />
                        </div>
                    )}
                    <div style={{ borderTop: '1px solid #e1e1e1', borderBottom: '1px solid #e1e1e1', paddingTop: 16, paddingBottom: 16 }}>
                        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 'bold' }}>
                               {t(langKeys.schedule_availability)}
                            </div>
                            <IconButton
                                onClick={() => {
                                    const hoursvalue = hours.map((x: any) => (x.value));
                                    if (fieldstimes?.length) {
                                        let indexofnexthour = hoursvalue.indexOf(fieldstimes[fieldstimes?.length - 1].end);
                                        let startindex = (indexofnexthour + 2) < 48 ? indexofnexthour + 2 : indexofnexthour - 46;
                                        let endindex = (indexofnexthour + 4) < 48 ? indexofnexthour + 4 : indexofnexthour - 44;
                                        timesAppend({ start: hoursvalue[startindex], end: hours.map((x: any) => (x.value))[endindex], dow: day?.dow!!, status: "available", overlap: -1 })
                                        trigger(`times.${fieldstimes?.length - 1}.start`)
                                    } else {
                                        timesAppend({ start: "09:00:00", end: "17:00:00", dow: day?.dow!!, status: "available", overlap: -1 })
                                    }
                                }}
                            >
                                <AddIcon />
                            </IconButton>

                        </div>

                        {!!day && fieldstimes.map((x: any, i: number) => {
                            // if (x.dow !== dow) return null
                            return (
                                <div key={x.id}>
                                    <div style={{ margin: 0, display: 'grid', gridTemplateColumns: '130px 8px 130px 50px', gap: 8, alignContent: 'center' }}>
                                        <FieldSelect
                                            valueDefault={getValues(`times.${i}.start`)}
                                            fregister={{
                                                ...register(`times.${i}.start`, {
                                                    validate: {
                                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required),
                                                        timescross: (value: any) => (getValues(`times.${i}.end`) > (value)) || t(langKeys.errorhoursdontmatch) + "",
                                                    }

                                                }),
                                            }}
                                            variant="outlined"
                                            className={classes.centerInput}
                                            error={errors?.times?.[i]?.start?.message}
                                            style={{ pointerEvents: "auto", display: 'flex', alignItems: 'center' }}
                                            onChange={(value) => {
                                                let overlap = getValues(`times.${i}.overlap`) || -1
                                                let fieldEnd = getValues(`times.${i}.end`)
                                                let fieldStart = value?.value
                                                if ((overlap + 1)) {
                                                    setValue(`times.${i}.overlap`, -1)
                                                    setValue(`times.${overlap}.overlap`, -1)
                                                }
                                                const exists = fieldstimes.findIndex((y: any, cont: number) => cont !== i && (
                                                    ((y.start < fieldEnd) && (y.start > fieldStart)) ||
                                                    ((y.end < fieldEnd) && (y.end > fieldStart)) ||
                                                    ((fieldEnd < y.end) && (fieldEnd > y.start)) ||
                                                    ((fieldStart < y.end) && (fieldStart > y.start)) ||
                                                    (y.start === fieldStart) || (y.end === fieldEnd)
                                                ));
                                                if ((exists + 1)) {
                                                    setValue(`times.${i}.overlap`, exists)
                                                    setValue(`times.${exists}.overlap`, i)
                                                }
                                                setValue(`times.${i}.start`, value?.value)
                                                trigger(`times.${i}.start`)
                                            }}
                                            data={hours}
                                            optionDesc="desc"
                                            optionValue="value"
                                        />
                                        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}> - </div>
                                        <FieldSelect
                                            fregister={{
                                                ...register(`times.${i}.end`, {
                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                }),
                                            }}
                                            variant="outlined"
                                            className={classes.centerInput}
                                            valueDefault={getValues(`times.${i}.end`)}
                                            error={errors?.times?.[i]?.end?.message}
                                            style={{ pointerEvents: "auto", display: 'flex', alignItems: 'center' }}
                                            onChange={(value) => {
                                                let overlap = getValues(`times.${i}.overlap`) || -1
                                                let fieldEnd = value?.value
                                                let fieldStart = getValues(`times.${i}.start`)
                                                if ((overlap + 1)) {
                                                    setValue(`times.${i}.overlap`, -1)
                                                    setValue(`times.${overlap}.overlap`, -1)
                                                }
                                                const exists = fieldstimes.findIndex((y: any, cont: number) => (
                                                    ((y.start < fieldEnd) && (y.start > fieldStart)) ||
                                                    ((y.end < fieldEnd) && (y.end > fieldStart)) ||
                                                    ((fieldEnd < y.end) && (fieldEnd > y.start)) ||
                                                    ((fieldStart < y.end) && (fieldStart > y.start)) ||
                                                    (y.start === fieldStart) || (y.end === fieldEnd)
                                                ));
                                                if ((exists + 1)) {
                                                    setValue(`times.${exists}.overlap`, i)
                                                    setValue(`times.${i}.overlap`, exists)
                                                }
                                                setValue(`times.${i}.end`, value?.value)
                                                trigger(`times.${i}.start`)
                                            }}
                                            data={hours}
                                            optionDesc="desc"
                                            optionValue="value"
                                        />
                                        <IconButton style={{ pointerEvents: "auto" }} aria-label="delete" onClick={(e: any) => { e.preventDefault(); timesRemove(i) }}>
                                            <DeleteIcon />
                                        </IconButton>

                                    </div>
                                    {!!((getValues(`times.${i}.overlap`) || -1) + 1) &&
                                        <p className={classes.errorclass} >{t(langKeys.errorhours)}</p>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                    {t(langKeys.cancel)}
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    onClick={onSubmitManual}
                >
                    {t(langKeys.apply)}
                </Button>
            </DialogActions>
        </Dialog >
    )
}

const makeData = (year: number, month: number, schedule: ISchedule[]) => {
    return calculateDateFromMonth(year, month).map(x => ({
        ...x,
        ...(() => {
            const isPersonalized = schedule.some(y => y.date === x.dateString);
            const dataRepeatDay = isPersonalized ? [] : schedule.filter(y => y.dow === x.dow && !y.date)
            const data = isPersonalized ? schedule.filter(y => y.date === x.dateString) : dataRepeatDay;
            return {
                data,
                type: isPersonalized ? 'personalized' : dataRepeatDay.length ? 'repeat' : 'none'
            };
        })()
    }));
}

const ScheduleBase: FC<ScheduleInputProps> = ({ notPreviousDays = true, data, setData }) => {
    const classes = useScheduleStyles();
    const { t } = useTranslation();
    const [daysToShow, setDaysToShow] = useState<DayProp[]>([]);
    const [dateCurrent, setDateCurrent] = useState<{ month: number, year: number }>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });
    const [daySelected, setDaySelected] = useState<DayProp | undefined>(undefined);
    const [openDialogDate, setOpenDialogDate] = useState(false);
    const [dates, setDates] = useState<ISchedule[]>([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [typeSelected, setTypeSelected] = useState("")

    const handleClick = (event: any, day: DayProp) => {
        if (day.isDayPreview && notPreviousDays)
            return
        setDaySelected(day);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectItemDay = (type: string) => {
        setTypeSelected(type);
        setAnchorEl(null);
        setOpenDialogDate(true);
    };

    const handlerChangeDates = (scheduler: ISchedule[]) => {
        if (typeSelected === "personalized") {
            const datesDistinct = Array.from(new Set(scheduler.map(x => x.date)));
            const newScheduler = [...dates.filter(x => !datesDistinct.includes(x.date)), ...scheduler];
            setDates(newScheduler);
            setDaysToShow(makeData(dateCurrent.year, dateCurrent.month, newScheduler));
            setData(newScheduler);
        } else {
            const newScheduler = [...dates.filter(x => x.dow !== daySelected?.dow), ...scheduler];
            setDates(newScheduler);
            setDaysToShow(makeData(dateCurrent.year, dateCurrent.month, newScheduler));
            setData(newScheduler);
        }
    }

    useEffect(() => {
        setDates(data);
        setDaysToShow(makeData(dateCurrent.year, dateCurrent.month, data));
    }, [dateCurrent, data])

    const handleChangeMonth = useCallback((manageMonth: number) => {
        const newdate = new Date(new Date(dateCurrent.year, dateCurrent.month).setMonth(dateCurrent.month + manageMonth));
        const newyear = newdate.getFullYear();
        const newmonth = newdate.getMonth();

        setDateCurrent({
            year: newyear,
            month: newmonth
        });
    }, [dateCurrent])

    const resetWeekly = () => {
        const newScheduler = dates.filter(x => x.date !== daySelected?.dateString)
        setDates(newScheduler);
        setDaysToShow(makeData(dateCurrent.year, dateCurrent.month, newScheduler));
        setData(newScheduler); //actualizar
        setAnchorEl(null);
    }

    return (
        <div className={classes.container}>
            <div className={classes.containerInfo}>
                <div>
                    <div className={classes.containerInfoTitle}>
                        {t((langKeys as Dictionary)[`month_${("" + (dateCurrent.month + 1)).padStart(2, "0")}`])} {dateCurrent.year}
                    </div>
                    <div>
                        {t(langKeys.set_your_weekly)}
                    </div>
                </div>
                <div className={classes.containerButtons}>
                    <div
                        className={classes.buttonMonth}
                        onClick={() => handleChangeMonth(-1)}
                    >
                        <NavigateBeforeIcon />
                    </div>
                    <div
                        className={classes.buttonMonth}
                        style={{ borderLeft: '1px solid #e0e0e0' }}
                        onClick={() => handleChangeMonth(1)}
                    >
                        <NavigateNextIcon />
                    </div>
                </div>
            </div>
            <div className={classes.wrapperDays}>
                {dayNames.map((day, index) => (
                    <div key={index} className={classes.dowHeader}>
                        {(t((langKeys as Dictionary)[day])).substring(0, 3)}
                    </div>
                ))}
            </div>
            <div className={classes.wrapper}>
                {daysToShow.map((day, index) => (
                    <BoxDay
                        key={index}
                        day={day}
                        handleClick={handleClick}
                        notPreviousDays={notPreviousDays}
                    />
                ))}
            </div>
            <Menu
                id="calendar_box_day_menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => selectItemDay("personalized")}>
                    <ListItemIcon color="inherit">
                        <CalendarTodayIcon style={{ width: 16, color: "#7721AD" }} fontSize="small" />
                    </ListItemIcon>
                    <div style={{ fontSize: 16 }}>{t(langKeys.edit)}</div>
                </MenuItem>
                {["none", "repeat"].includes((daySelected?.type || "none")) && (
                    <MenuItem onClick={() => selectItemDay("repeat")}>
                        <ListItemIcon color="inherit">
                            <RepeatIcon style={{ width: 16, color: "#7721AD" }} fontSize="small" />
                        </ListItemIcon>
                        <div style={{ fontSize: 16 }}>{t(langKeys.edit_all )}{t(getDay(daySelected?.dow))}</div>
                    </MenuItem>
                )}
                {daySelected?.type === "personalized" && (
                    <MenuItem onClick={resetWeekly}>
                        <ListItemIcon color="inherit">
                            <RefreshIcon style={{ width: 16, color: "#7721AD" }} fontSize="small" />
                        </ListItemIcon>
                        <div style={{ fontSize: 16 }}>{t(langKeys.reset_weekly_hours)}</div>
                    </MenuItem>
                )}
            </Menu> 
            <DialogDate
                day={daySelected}
                type={typeSelected}
                open={openDialogDate}
                setOpen={setOpenDialogDate}
                handlerChangeDates={handlerChangeDates}
            />
        </div>
    )
}

export default ScheduleBase;