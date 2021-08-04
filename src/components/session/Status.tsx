import { FC, useState } from "react";
import { createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import IOSSwitch from "components/fields/IOSSwitch";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        root: {
            backgroundColor: '#F9F9FA', padding: '10px 12px', display: 'flex', height: 42
        },
        connectionText: {
            fontSize: 14,
        },
    }),
);

const Status: FC = () => {
    const classes = useStyles();

    const [status, setStatus] = useState(true);

    return (
        <Paper elevation={0} className={classes.root}>
            <label className={classes.connectionText}>{status ? 'Connected' : 'Disconnected'}</label>
            <div style={{ width: 6 }} />
            <IOSSwitch checked={status} onChange={() => setStatus(!status)} name="checkedB" />
        </Paper>
    );
};

export default Status;
