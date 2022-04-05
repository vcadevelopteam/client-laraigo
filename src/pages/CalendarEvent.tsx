import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { Button, Fab, IconButton, makeStyles, Typography } from "@material-ui/core";
import { useParams } from 'react-router';
import { FieldEdit, CalendarZyx, FieldEditMulti } from "components";
import { getCollEventBooking } from 'store/main/actions';
import { getEventByCode, validateCalendaryBooking, dayNames, calculateDateFromMonth } from 'common/helpers';
import { Dictionary } from '@types';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Backdrop from '@material-ui/core/Backdrop';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import clsx from 'clsx';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { useForm } from 'react-hook-form';

interface IDay {
    date: Date;
    dateString: string;
    dom: number;
    dow: number;
}

interface ITime {
    localyeardate: string;
    localstarthour: string;
    localendhour: string;
    localddow: number;
    localdday: number;
}

const useStyles = makeStyles(theme => ({
    back: {
        backgroundColor: '#fbfcfd',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        // minWidth: 800,
        maxHeight: 800,
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        flexWrap: 'wrap',
        maxWidth: '80vw',
        [theme.breakpoints.down('xs')]: {
            maxWidth: '100vw',
        },
    },
    panel: {
        minWidth: 300,
        padding: theme.spacing(3)
    },
    vertical: {
        width: 1,
        flex: '0 0 1px',
        backgroundColor: '#e1e1e1',
        height: '100%',
    },
    panelCalendar: {
        display: 'flex',
        justifyContent: 'center',
    },
    panelDays: {
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
    containerTimes: {
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        height: '100%',
    },
    itemTime: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        border: '1px solid rgb(119, 33, 173, 0.4)',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        color: "#7721AD",
        borderRadius: 5,
        fontWeight: 'bold',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#fbfcfd',
            border: '2px solid rgb(119, 33, 173, 0.9)',
            paddingTop: theme.spacing(1.5) - 1,
            paddingBottom: theme.spacing(1.5) - 1,
        }
    },
    itemTimeSelected: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        color: "white",
        backgroundColor: 'rgba(0,0,0,.6)',
        borderRadius: 5,
        fontWeight: 'bold',
    },
    itemTimeConfirm: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        backgroundColor: '#7721AD',
        color: "white",
        borderRadius: 5,
        fontWeight: 'bold',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(119, 33, 173, 0.7)',
        }
    },
    colInput: {
        width: 400
    }
}));

const TimeDate: FC<{ time: ITime, isSelected: boolean, setTimeSelected: (p: any) => void }> = ({ time, setTimeSelected, isSelected }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div style={{ display: 'flex', gap: 8, marginRight: 10 }}>
            <div
                className={clsx({
                    [classes.itemTime]: !isSelected,
                    [classes.itemTimeSelected]: isSelected
                })}
                onClick={() => setTimeSelected({ ...time, selected: true })}
            >
                {time.localstarthour}
            </div>
            {isSelected && (
                <div
                    className={classes.itemTimeConfirm}
                    onClick={() => setTimeSelected({ ...time, selected: true, confirm: true })}
                >
                    Confirm
                </div>
            )}
        </div>
    )
}

const FormToSend: FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            observation: '',
        }
    })

    React.useEffect(() => {
        register('name', { validate: (value) => (value && value.length) ? "" : (t(langKeys.field_required) + "") });
        register('email', { validate: (value) => (value && value.length) ? "" : (t(langKeys.field_required) + "") });
        register('phone', { validate: (value) => (value && value.length) ? "" : (t(langKeys.field_required) + "") });
    }, [register, t])

    const onSubmit = handleSubmit((data) => {
        console.log(data)
    });

    return (
        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>{t(langKeys.name)}</div>
                    <FieldEdit
                        className={classes.colInput}
                        size="small"
                        variant={'outlined'}
                        valueDefault={getValues('name')}
                        onChange={(value: any) => setValue('name', value)}
                        error={errors?.name?.message}
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>{t(langKeys.email)}</div>
                    <FieldEdit
                        size="small"
                        className={classes.colInput}
                        variant={'outlined'}
                        valueDefault={getValues('email')}
                        onChange={(value: any) => setValue('email', value)}
                        error={errors?.email?.message}
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>{t(langKeys.phone)}</div>
                    <FieldEdit
                        size="small"
                        className={classes.colInput}
                        variant={'outlined'}
                        valueDefault={getValues('phone')}
                        onChange={(value: any) => setValue('phone', value)}
                        error={errors?.phone?.message}
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>Please share anything that will help prepare for our meeting.</div>
                    <FieldEditMulti
                        size="small"
                        className={classes.colInput}
                        variant={'outlined'}
                        valueDefault={getValues('observation')}
                        onChange={(value: any) => setValue('observation', value)}
                        error={errors?.observation?.message}
                    />
                </div>
                <div style={{marginTop: 16}}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Schedule Event
                    </Button>

                </div>
            </div>
        </form>
    )
}

export const CalendarEvent: FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();
    const { orgid, eventcode }: any = useParams();
    const [event, setEvent] = useState<Dictionary | null>(null);
    const resMain = useSelector(state => state.main.mainEventBooking);
    const [daySelected, setDaySelected] = useState<IDay | null>(null);
    const [timeSelected, setTimeSelected] = useState<ITime & { selected?: boolean, confirm?: boolean } | null>(null);

    const [times, setTimes] = useState<ITime[]>([]);
    const [timesDateSelected, setTimesDateSelected] = useState<ITime[]>([]);
    const [daysAvailable, setDaysAvailable] = useState<string[]>([]);
    const [dateCurrent, setDateCurrent] = useState<{ month: number, year: number }>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });

    const onChangeMonth = (month: number, year: number) => {
        setDateCurrent({ month, year });
    }
    useEffect(() => {
        dispatch(getCollEventBooking(getEventByCode(orgid, eventcode)))
    }, [])

    useEffect(() => {
        if (!!event) {
            const { year, month } = dateCurrent;
            const { corpid, orgid, calendareventid } = event;
            const listDates = calculateDateFromMonth(year, month)
            dispatch(getCollEventBooking(validateCalendaryBooking({
                corpid,
                orgid,
                calendareventid,
                startdate: listDates[0].dateString,
                enddate: listDates[listDates.length - 1].dateString
            })))
        }
    }, [dateCurrent, dispatch, event])

    useEffect(() => {
        if (!resMain.loading && !resMain.error) {
            if (resMain.key === "QUERY_EVENT_BY_CODE") {
                if (resMain.data.length > 0) {
                    setEvent(resMain.data[0]);
                } else {
                    setEvent(null)
                }
            } else if (resMain.key === "UFN_CALENDARYBOOKING_SEL_DATETIME") {
                setDaysAvailable(Array.from(new Set(resMain.data.map(x => x.localyeardate))));
                setTimes((resMain.data as ITime[]).map(x => ({
                    ...x,
                    localstarthour: x.localstarthour.substring(0, 5),
                    localendhour: x.localendhour.substring(0, 5)
                })));
            }
        }
    }, [resMain])

    const handlerSelectDate = (p: IDay[]) => {
        setDaySelected(p[0]);
        setTimeSelected(null)
        setTimesDateSelected(times.filter(x => x.localyeardate === p[0].dateString))
    }

    if (resMain.loading && !event) {
        return (
            <div className={classes.back}>
                <CircularProgress />
            </div>
        )
    }

    if (!event) {
        return (
            <div className={classes.back}>
                <Typography variant="h5">Ningún evento encontrado</Typography>
            </div>
        )
    }

    return (
        <div className={classes.back}>
            <div className={classes.container}>
                <div className={classes.panel}>
                    {timeSelected?.confirm && (
                        <IconButton style={{border: '1px solid #e1e1e1'}} onClick={() => setTimeSelected({ ...timeSelected, confirm: false })}>
                            <ArrowBackIcon color="primary" />
                        </IconButton>
                    )}
                    <div style={{ fontWeight: 'bold', fontSize: 28, marginTop: 12, marginBottom: 16 }}>
                        {event?.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ScheduleIcon color="action" />
                        {event?.timeduration} {event?.timeunit}
                    </div>
                    {timeSelected?.confirm && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 }}>
                            <CalendarTodayIcon color="action" />
                            {timeSelected?.localstarthour} - {timeSelected?.localendhour}
                        </div>
                    )}
                </div>
                <div className={classes.vertical}></div>
                <div className={classes.panel} style={{ position: 'relative', display: 'flex', gap: 20, flexDirection: 'column', height: '600px', borderLeft: '1px solid #e1e1e1' }}>
                    {timeSelected?.confirm && (
                        <div style={{ width: 590 }}>
                            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
                                Enter details
                            </div>
                            <FormToSend />
                        </div>
                    )}
                    {!timeSelected?.confirm && (
                        <>
                            <div style={{ fontWeight: 'bold', fontSize: 18 }}>
                                Select a Date & Time
                            </div>
                            <div style={{ display: 'flex', gap: 20, overflowY: 'auto' }}>
                                <div className={classes.panelCalendar}>
                                    <CalendarZyx
                                        onChangeMonth={onChangeMonth}
                                        selectedDays={[]}
                                        daysAvailable={daysAvailable}
                                        onChange={handlerSelectDate}
                                    />
                                    <Backdrop style={{ zIndex: 999999999, position: 'absolute' }} open={resMain.loading}>
                                        <CircularProgress />
                                    </Backdrop>
                                </div>
                                {!!daySelected && (
                                    <div className={classes.panelDays}>
                                        <div>
                                            {t(dayNames[daySelected?.dow])}, {t(`month_${((daySelected?.date.getMonth() + 1) + "").padStart(2, "0")}`)} {daySelected?.date.getDate()}
                                        </div>
                                        <div className={classes.containerTimes}>
                                            {timesDateSelected.map((x, index) => (
                                                <TimeDate
                                                    isSelected={!!timeSelected && timeSelected?.localstarthour === x.localstarthour}
                                                    key={index}
                                                    time={x}
                                                    setTimeSelected={setTimeSelected}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div >
    )
}

export default CalendarEvent;