import { FC } from "react";
import { createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import IOSSwitch from "components/fields/IOSSwitch";
import { Trans } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from 'hooks';
import { emitEvent, connectAgentUI, connectAgentAPI } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';

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
    const dispatch = useDispatch();
    const userConnected = useSelector(state => state.inbox.userConnected);

    const onChecked = () => {
        dispatch(connectAgentAPI(!userConnected))
        dispatch(connectAgentUI(!userConnected))
        dispatch(emitEvent({
            event: 'connectAgent',
            data: {
                isconnected: !userConnected,
                userid: 0,
                orgid: 0
            }
        }));
    }
    
    return (
        <Paper elevation={0} className={classes.root}>
            <label className={classes.connectionText}><Trans>{userConnected ? langKeys.online : langKeys.offline}</Trans></label>
            <div style={{ width: 6 }} />
            <IOSSwitch checked={userConnected} onChange={onChecked} name="checkedB" />
        </Paper>
    );
};

export default Status;
