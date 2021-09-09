import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { ITicket } from "@types";
import { AntTab } from 'components';
import Tabs from '@material-ui/core/Tabs';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { SearchIcon } from 'icons';
import IconButton from '@material-ui/core/IconButton';
import { DownloadIcon, DownloadReverseIcon, EMailInboxIcon, PhoneIcon, PinLocationIcon, PortfolioIcon } from 'icons';
export interface ChatProps {
}

const useStyles = makeStyles((theme) => ({
    containerInfo: {
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        overflowWrap: 'anywhere',
        borderLeft: '1px solid rgba(132, 129, 138, 0.101961);'
    },
    containerName: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2)
    },
    containerInfoClient: {
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2)
    },
    label: {
        overflowWrap: 'anywhere',
        fontWeight: 400,
        fontSize: 12,
        color: '#B6B4BA',
    },
    value: {
        fontSize: 14,
        fontWeight: 400,
        color: '#2E2C34',
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        padding: '3px 6px',
        fontSize: 12,
        color: 'white',
        backgroundColor: '#55BD84',
    },
    propIcon: {
        stroke: '#8F92A1'
    },
}));

const InfoClient: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.containerInfoClient}>
            <div className={classes.containerName}>
                <Avatar alt="" src="" />
                <div style={{ flex: 1 }}>
                    <div>Carlos</div>
                    <div className={classes.label}>{`ID# 23232`}</div>
                </div>
                <div className={classes.btn}>Active</div>
            </div>
            <div className={classes.containerName}>
                <EMailInboxIcon className={classes.propIcon} />
                <div style={{ flex: 1 }}>
                    <div className={classes.label}>Email</div>
                    <div>{`ID# 23232`}</div>
                </div>
            </div>
            <div className={classes.containerName}>
                <PhoneIcon className={classes.propIcon} />
                <div style={{ flex: 1 }}>
                    <div className={classes.label}>Phone</div>
                    <div>{`ID# 23232`}</div>
                </div>
            </div>
        </div>
    )
}

const InfoPanel: React.FC<ChatProps> = () => {
    const classes = useStyles();
    const [pageSelected, setPageSelected] = useState(0);

    return (
        <div className={classes.containerInfo}>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED' }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label="Client details" />
                <AntTab label="Tickets" />
                <AntTab label="Variables" />
                <AntTab label="Attachments" />
            </Tabs>
            {pageSelected === 0 && <InfoClient />}
            
        </div>
    );
}

export default InfoPanel;