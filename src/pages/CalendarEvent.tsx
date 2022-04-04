import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { makeStyles } from "@material-ui/core";
import { useParams } from 'react-router';
import { CalendarZyx } from "components";
import { getCollEventBooking } from 'store/main/actions';
import { getEventByCode, validateCalendaryBooking, dayNames } from 'common/helpers';
import { Dictionary } from '@types';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Backdrop from '@material-ui/core/Backdrop';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
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
        // maxWidth: 1000
        flexWrap: 'wrap',
        maxWidth: '80vw',
        [theme.breakpoints.down('xs')]: {
            maxWidth: '100vw',
        },
    },
    panel: {
        // flex: "1",
        minWidth: 250,
        // width: 0,
        padding: theme.spacing(2)
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
        // marginTop: theme.spacing(1),
    },
    panelDays: {
        width: 200,
        // padding: theme.spacing(2),
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
        marginRight: 20,
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
    }
}));

const TimeDate: FC<{ time: ITime }> = ({ time }) => {
    const classes = useStyles();
    return (
        <div className={classes.itemTime}>
            {time.localstarthour}
        </div>
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
    const [times, setTimes] = useState<ITime[]>([]);
    const [timesDateSelected, setTimesDateSelected] = useState<ITime[]>([]);
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
        console.log(dateCurrent)
        if (!!event) {
            const { year, month } = dateCurrent;
            const { corpid, orgid, calendareventid } = event;
            dispatch(getCollEventBooking(validateCalendaryBooking({
                corpid,
                orgid,
                calendareventid,
                startdate: new Date(year, month, 1).toISOString().split('T')[0],
                enddate: new Date(year, month + 1, 0).toISOString().split('T')[0],
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
                setTimes(resMain.data as ITime[]);
            }
        }
    }, [resMain])

    const handlerSelectDate = (p: IDay[]) => {
        setDaySelected(p[0]);
        console.log(p[0])
        setTimesDateSelected(times.filter(x => x.localyeardate === p[0].dateString))
    }

    if (resMain.loading && !event) {
        return (
            <div className={classes.back}>
                <CircularProgress />
            </div>
        )
    }
    return (
        <div className={classes.back}>
            <div className={classes.container}>
                <div className={classes.panel}>
                    <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>
                        {event?.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ScheduleIcon color="action" />
                        {event?.timeduration} {event?.timeunit}
                    </div>
                </div>
                <div className={classes.panel} style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '600px' }}>
                    <div style={{ fontWeight: 'bold' }}>
                        Select a Date & Time
                    </div>
                    <div style={{ display: 'flex', gap: 8, overflowY: 'auto' }}>
                        <div className={classes.panelCalendar}>
                            <CalendarZyx
                                onChangeMonth={onChangeMonth}
                                selectedDays={[]}
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
                                        <TimeDate key={index} time={x} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CalendarEvent;