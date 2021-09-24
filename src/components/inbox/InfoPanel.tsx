/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { AntTab } from 'components';
import Tabs from '@material-ui/core/Tabs';
import Avatar from '@material-ui/core/Avatar';
import { EMailInboxIcon, PhoneIcon } from 'icons';
import { getTicketsPerson, showInfoPanel } from 'store/inbox/actions';
import { GetIcon } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { convertLocalDate } from 'common/helpers';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { DialogInteractions} from 'components';
import { Dictionary } from '@types';

const useStyles = makeStyles((theme) => ({
    containerInfo: {
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',

        overflowWrap: 'anywhere',
        borderLeft: '1px solid rgba(132, 129, 138, 0.101961);',
        position: 'relative'
    },
    collapseInfo: {
        position: 'absolute',
        top: 'calc(50% - 20px)',
    },
    infoClose: {
        left: -20,
    },
    containerName: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2)
    },
    containerNameHead: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(.5)
    },
    containerInfoClient: {
        padding: theme.spacing(1),
        display: 'flex',
        backgroundColor: '#fff',
        flexDirection: 'column',
        gap: theme.spacing(1)
    },
    containerPreviewTicket: {
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
        overflowY: 'auto',
        cursor: 'pointer',
        flex: 1,
        borderBottom: '1px solid #EBEAED'
    },
    label: {
        overflowWrap: 'anywhere',
        // fontWeight: 400,
        fontSize: 12,
        color: '#B6B4BA',
    },
    titlePreviewTicket: {
        fontWeight: 500,
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(.5),
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
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const showInfoPanelTrigger = () => dispatch(showInfoPanel())

    const person = useSelector(state => state.inbox.person.data);
    return (
        <div style={{ backgroundColor: 'white' }}>
            <IconButton
                onClick={showInfoPanelTrigger}
            >
                <CloseIcon />
            </IconButton>
            <div className={classes.containerInfoClient} style={{ paddingTop: 0 }}>
                <div className={classes.containerNameHead}>
                    <Avatar alt="" style={{ width: 120, height: 120 }} src={person?.imageurldef} />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 500 }}>{person?.firstname} {person?.lastname}</div>
                        <div className={classes.label}>{`ID# ${person?.personid}`}</div>
                    </div>
                    {/* <div className={classes.btn}>{t(langKeys.active)}</div> */}
                </div>
                <div className={classes.containerName}>
                    <EMailInboxIcon className={classes.propIcon} />
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.email)}</div>
                        <div>{`${person?.email || 'fdcarlosd1@gmail.com'}`}</div>
                    </div>
                </div>
                <div className={classes.containerName}>
                    <PhoneIcon className={classes.propIcon} />
                    <div style={{ flex: 1 }}>
                        <div className={classes.label}>{t(langKeys.phone)}</div>
                        <div>{`${person?.phone || '953845654'}`}</div>
                    </div>
                </div>

            </div>
        </div>
    )
}

const Variables: React.FC = () => {
    const variablecontext = useSelector(state => state.inbox.person.data?.variablecontext);
    const configurationVariables = useSelector(state => state.inbox.configurationVariables.data);
    const classes = useStyles();

    return (
        <div className={`scroll-style-go ${classes.containerInfoClient}`} style={{ overflowY: 'auto', flex: 1 }}>

            {variablecontext && !(variablecontext instanceof Array) && configurationVariables.map(({ description, fontbold, fontcolor, variable }, index) => {
                const variabletmp = variablecontext[variable];
                return (
                    <div key={index} className={classes.containerName}>
                        <div style={{ fontWeight: fontbold ? 'bold' : 'normal' }}>
                            <div className={classes.label}>{description}</div>
                            <div style={{ color: fontcolor }}>{variabletmp?.Value || '-'}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const PreviewTickets = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const previewTicketList = useSelector(state => state.inbox.previewTicketList);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(getTicketsPerson(ticketSelected?.personid!, ticketSelected?.conversationid!))
    }, [])

    const handleClickOpen = (row: any) => {
        setOpenModal(true);
        setRowSelected(row)
    };

    return (
        <div style={{ flex: 1 }} className="scroll-style-go">
            {previewTicketList.loading ? "Espere" :
                previewTicketList.data?.map((ticket, index) => (
                    <div key={index} className={classes.containerPreviewTicket} onClick={() => handleClickOpen(ticket)}>
                        <div className={classes.titlePreviewTicket}>
                            <GetIcon color={ticket.coloricon} channelType={ticket.communicationchanneltype} />
                            <div>#{ticket.ticketnum}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>
                                <div className={classes.label}>{t(langKeys.created_on)}</div>
                                <div>{convertLocalDate(ticket.firstconversationdate).toLocaleString()}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className={classes.label}>{t(langKeys.closed_on)}</div>
                                <div>{convertLocalDate(ticket.finishdate).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                ))
            }
            <DialogInteractions 
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
        </div>
    )
}

const InfoPanel: React.FC = () => {
    const classes = useStyles();
    const [pageSelected, setPageSelected] = useState(0);
    const { t } = useTranslation();

    return (
        <div className={classes.containerInfo}>
            <InfoClient />
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label="Variables" />
                <AntTab label="Tickets" />
            </Tabs>
            {pageSelected === 0 && <Variables />}
            {pageSelected === 1 && <PreviewTickets />}
        </div>
    );
}

export default InfoPanel;