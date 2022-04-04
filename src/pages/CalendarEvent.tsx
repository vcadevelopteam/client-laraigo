import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { makeStyles } from "@material-ui/core";
import { useParams } from 'react-router';
import { CalendarZyx } from "components";
import { getCollEventBooking } from 'store/main/actions';
import { getEventByCode, validateCalendaryBooking } from 'common/helpers';
import { Dictionary } from '@types';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Backdrop from '@material-ui/core/Backdrop';

interface IDay {
    date: Date;
    dateString: string;
    dom: number;
    dow: number;
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
        width: 800,
        height: 600,
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)'
    },
    panel: {
        flex: "1",
        padding: theme.spacing(2),
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
        marginTop: theme.spacing(3),
    },
    panelDays: {
        flex: '0 0 200px'
    }
}));

export const GetLocations: FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { orgid, eventcode }: any = useParams();
    const [event, setEvent] = useState<Dictionary | null>(null);
    const resMain = useSelector(state => state.main.mainEventBooking);
    const [daySelected, setDaySelected] = useState<IDay | null>(null)
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
                console.log(resMain.data)
            }
        }
    }, [resMain])

    const handlerSelectDate = (p: IDay[]) => {
        setDaySelected(p[0])
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
                <div className={classes.vertical}></div>
                <div className={classes.panel} style={{ position: 'relative' }}>
                    <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Select a Date & Time
                    </div>
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
                </div>
                {!!daySelected && (
                    <div className={classes.panelDays}>
                        dias!
                    </div>
                )}
            </div>
        </div>
    )
}

export default GetLocations;