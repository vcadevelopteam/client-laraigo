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
        flex: 1,
        padding: theme.spacing(2),
    },
    vertical: {
        width: 1,
        backgroundColor: '#e1e1e1',
        height: '100%',
    },
    panelCalendar: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(3),
    }
}));
export const GetLocations: FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { orgid, eventcode }: any = useParams();
    const resMain = useSelector(state => state.main.mainEventBooking);

    const [event, setEvent] = useState<Dictionary | null>(null)

    console.log(event)

    useEffect(() => {
        dispatch(getCollEventBooking(getEventByCode(orgid, eventcode)))
    }, [])

    useEffect(() => {
        if (!resMain.loading && !resMain.error) {
            console.log(console.log(resMain))
            if (resMain.key === "QUERY_EVENT_BY_CODE") {
                if (resMain.data.length > 0) {
                    setEvent(resMain.data[0]);

                    // validateCalendaryBooking
                    const { corpid, orgid, calendareventid } = resMain.data[0];
                    dispatch(getCollEventBooking(validateCalendaryBooking({
                        corpid,
                        orgid,
                        calendareventid,
                        startdate: '2022-04-01',
                        enddate: '2022-04-01',
                    })))
                } else {
                    setEvent(null)
                }
            }
        }
    }, [resMain])

    return (
        <div className={classes.back}>
            {resMain.loading && (
                <CircularProgress />
            )}
            {(!resMain.loading && !!event) && (
                <div className={classes.container}>
                    <div className={classes.panel}>
                        <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>
                            {event.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ScheduleIcon color="action" />
                            {event.timeduration} {event.timeunit}
                        </div>
                    </div>
                    <div className={classes.vertical}></div>
                    <div className={classes.panel}>
                        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
                            Select a Date & Time
                        </div>
                        <div className={classes.panelCalendar}>
                            <CalendarZyx
                                selectedDays={[]}
                                onChange={() => null}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GetLocations;