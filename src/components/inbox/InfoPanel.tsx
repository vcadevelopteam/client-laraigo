import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { AntTab } from 'components';
import Tabs from '@material-ui/core/Tabs';
import Avatar from '@material-ui/core/Avatar';
import { EMailInboxIcon, PhoneIcon } from 'icons';
import { getTicketsPerson } from 'store/inbox/actions';

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
    const person = useSelector(state => state.inbox.person.data);
    return (
        <div className={classes.containerInfoClient}>
            <div className={classes.containerName}>
                <Avatar alt="" src={person?.imageurldef} />
                <div style={{ flex: 1 }}>
                    <div>{person?.firstname} {person?.lastname}</div>
                    <div className={classes.label}>{`ID# ${person?.personid}`}</div>
                </div>
                <div className={classes.btn}>Active</div>
            </div>
            <div className={classes.containerName}>
                <EMailInboxIcon className={classes.propIcon} />
                <div style={{ flex: 1 }}>
                    <div className={classes.label}>Email</div>
                    <div>{`${person?.email}`}</div>
                </div>
            </div>
            <div className={classes.containerName}>
                <PhoneIcon className={classes.propIcon} />
                <div style={{ flex: 1 }}>
                    <div className={classes.label}>Phone</div>
                    <div>{`${person?.phone}`}</div>
                </div>
            </div>
        </div>
    )
}

const Variables: React.FC = () => {
    const variablecontext = useSelector(state => state.inbox.person.data?.variablecontext);
    const classes = useStyles();

    return (
        <div className={classes.containerInfoClient} style={{ overflowY: 'auto', flex: 1 }}>
            {variablecontext && Object.entries(variablecontext).map(([key, value], index) => (
                <div key={index} className={classes.containerName}>
                    <div>
                        <div className={classes.label}>{key}</div>
                        <div >{value.Value}</div>
                    </div>
                </div>
            ))}

        </div>
    )
}

const PreviewTickets = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const previewTicketList = useSelector(state => state.inbox.previewTicketList);
    console.log(previewTicketList.data)
    useEffect(() => {
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
    }, [])

    return (
        <div>
            {previewTicketList.loading ? "espera" :
                previewTicketList.data?.map((ticket, index) => (
                    <div key={index} className={classes.containerInfoClient} style={{ overflowY: 'auto', flex: 1 }}>
                        <div className={classes.containerName}>
                            <div>
                                <div className={classes.label}>{ticket.ticketnum}</div>
                                <div >{ticket.personid}</div>
                            </div>
                        </div>
                    </div>
                ))
            }
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
                <AntTab label="Variables" />
                <AntTab label="Tickets" />
                {/* <AntTab label="Attachments" /> */}
            </Tabs>
            {pageSelected === 0 && <InfoClient />}
            {pageSelected === 1 && <Variables />}
            {pageSelected === 2 && <PreviewTickets />}

        </div>
    );
}

export default InfoPanel;