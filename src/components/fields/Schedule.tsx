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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import RepeatIcon from '@material-ui/icons/Repeat';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CalendarZyx, FieldSelect } from "components";
import { useFieldArray, useForm } from 'react-hook-form';
import { hours, calculateDateFromMonth } from "common/helpers";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
]

const dataExample = [
    { "dow": 0, "status": "available", "start": "09:00:00", "end": "18:00:00" },
    { "dow": 1, "status": "available", "start": "07:00:00", "end": "18:00:00" },
    { "dow": 2, "status": "available", "start": "09:00:00", "end": "18:00:00" },
    { "dow": 3, "status": "available", "start": "09:00:00", "end": "18:00:00" },
    { "dow": 5, "status": "available", "start": "08:00:00", "end": "18:00:00" },
    { "dow": 6, "status": "available", "start": "09:00:00", "end": "18:00:00" },
    { "date": "2022-03-18", "status": "available", "dow": 5, "start": "09:00:00", "end": "13:00:00" },
    // { "date": "2022-03-18", "status": "available", "dow": 5, "start": "14:00", "end": "18:00" },
    // { "date": "2022-03-19", "status": "available", "dow": 6, "start": "09:00", "end": "13:00" },
    // { "date": "2022-03-20", "status": "available", "dow": 0, "start": "09:00", "end": "12:00" },
    // { "date": "2022-03-21", "status": "available", "dow": 1, "start": "09:00", "end": "13:00" },
    // { "date": "2022-03-21", "status": "available", "dow": 1, "start": "14:00", "end": "18:00" },
    // { "date": "2022-03-22", "status": "unavailable", "dow": 2, "start": "", "end": "" },
    // { "date": "2022-03-23", "status": "available", "dow": 3, "start": "09:00", "end": "18:00" }
]
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
    data: ISchedule[]
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
        width: 20,
        textAlign: 'center',
        borderRadius: '50%',
    },
    dow: {
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: 12
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
    }
}));

const BoxDay: FC<DayInputProps> = ({ day, notPreviousDays, handleClick }) => {
    const classes = useScheduleStyles();
    const [isAvailable, setIsAvailable] = useState(true);

    useEffect(() => {
        setIsAvailable(!day.data.some(x => x.status === "unavailable") && day.data.length > 0)
    }, [day.data])

    return (
        <div
            onClick={(e: any) => handleClick(e, day)}
            className={clsx(classes.boxDay, {
                [classes.boxDayHover]: !day.isDayPreview,
                [classes.boxDayForbidden]: notPreviousDays && day.isDayPreview,
            })}
        >
            <div className={clsx(classes.dow, {
                [classes.isToday]: day.isToday
            })}>
                {day.dom}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {!isAvailable && (
                    <div>unavailable</div>
                )}
                {isAvailable && day.data.map((item, index) => (
                    <div key={index} className={classes.timeDate}>
                        {item.start} - {item.end}
                    </div>
                ))}
            </div>
        </div>
    )
}

const DialogDate: React.FC<{ open: boolean, setOpen: (param: any) => void, day?: DayProp }> = ({ open, setOpen, day }) => {
    const { t } = useTranslation();
    const classes = useScheduleStyles();

    const [dateSelected, setDateSelected] = useState<DayProp[]>([])

    const onHandlerChange = (p1: any, p2: any, p3: string) => {
        console.log(p1)
    }

    const { control, register, reset, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm<{ times: ISchedule[] }>({
        defaultValues: {
            times: day?.data || []
        }
    });

    useEffect(() => {
        reset({
            times: day?.data || []
        })
    }, [reset, day])

    const { fields: fieldstimes, append: timesAppend, remove: timesRemove } = useFieldArray({
        control,
        name: 'times',
    });


    const onSubmit = handleSubmit((data) => {
        console.log("submitted")
    });


    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth={"xs"}
        >
            <DialogTitle style={{ textAlign: 'center' }}>
                Select the date(s) you want to assign specific hours
            </DialogTitle>
            <DialogContent>
                <form onSubmit={onSubmit} id="form-date-calendar">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                        <CalendarZyx
                            selectedDays={[day?.dateString!!]}
                            onChange={onHandlerChange}
                        />
                    </div>
                    <div style={{ borderTop: '1px solid #e1e1e1', borderBottom: '1px solid #e1e1e1', paddingTop: 16, paddingBottom: 16 }}>
                        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 'bold' }}>
                                What hours are you available?
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
                                                const exists = fieldstimes.findIndex((y: any, cont: number) => (
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
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    form="form-date-calendar"
                >
                    Apply
                </Button>
            </DialogActions>
        </Dialog >
    )
}

const ScheduleBase: FC<ScheduleInputProps> = ({ notPreviousDays = true, data }) => {
    const classes = useScheduleStyles();
    const { t } = useTranslation();
    const [daysToShow, setDaysToShow] = useState<DayProp[]>([]);
    const [dateCurrent, setDateCurrent] = useState<{ month: number, year: number }>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });
    const [daySelected, setDaySelected] = useState<DayProp | undefined>(undefined);
    const [openDialogDate, setOpenDialogDate] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any, day: DayProp) => {
        if (day.isDayPreview && notPreviousDays)
            return
        setDaySelected(day);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectItemDay = () => {
        setAnchorEl(null);
        setOpenDialogDate(true);
    };


    useEffect(() => {
        const monthDates = calculateDateFromMonth(dateCurrent.year, dateCurrent.month).map(x => ({
            ...x,
            data: dataExample.filter(y => y.dow === x.dow || y.date === x.dateString)
        }));

        setDaysToShow(monthDates);
    }, [dateCurrent, data])

    const handleChangeMonth = useCallback((manageMonth: number) => {
        setDateCurrent({
            year: dateCurrent.year,
            month: dateCurrent.month + manageMonth
        })
    }, [dateCurrent])


    return (
        <div className={classes.container}>
            <div className={classes.containerInfo}>
                <div>
                    <div className={classes.containerInfoTitle}>
                        {t((langKeys as Dictionary)[`month_${("" + (dateCurrent.month + 1)).padStart(2, "0")}`])} {dateCurrent.year}
                    </div>
                    <div>
                        Set your weekly hours
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
                <MenuItem onClick={selectItemDay}>
                    <ListItemIcon color="inherit">
                        <CalendarTodayIcon style={{ width: 16, color: "#7721AD" }} fontSize="small" />
                    </ListItemIcon>
                    <div style={{ fontSize: 16 }}>Edit date(s)</div>
                </MenuItem>
                <MenuItem onClick={selectItemDay}>
                    <ListItemIcon color="inherit">
                        <RepeatIcon style={{ width: 16, color: "#7721AD" }} fontSize="small" />
                    </ListItemIcon>
                    <div style={{ fontSize: 16 }}>Edit each day</div>
                </MenuItem>
            </Menu>
            <DialogDate
                day={daySelected}
                open={openDialogDate}
                setOpen={setOpenDialogDate}
            />
        </div>
    )
}

export default ScheduleBase;