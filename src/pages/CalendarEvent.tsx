import React, { FC } from 'react';
import { makeStyles } from "@material-ui/core";
import { useParams } from 'react-router';
import { CalendarZyx } from "components";

// #fbfcfd

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
        display: 'flex'
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

    const classes = useStyles();
    const { orgid, eventcode }: any = useParams();

    console.log(orgid, eventcode)

    return (
        <div className={classes.back}>
            <div className={classes.container}>
                <div className={classes.panel}>
                    1
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
        </div>
    )
}

export default GetLocations;