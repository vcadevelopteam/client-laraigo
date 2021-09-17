/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { ITicket } from "@types";
import { AntTab } from 'components';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import { SearchIcon } from 'icons';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ItemTicket from 'components/inbox/Ticket'
import ChatPanel from 'components/inbox/ChatPanel'
import InfoPanel from 'components/inbox/InfoPanel'
import { resetGetTickets, getTickets, selectTicket, getDataTicket } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import { ListItemSkeleton } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    containerPanel: {
        flex: '1',
        display: 'flex'
    },
    titleTicketChat: {
        fontWeight: 500,
        fontSize: 20,
        '&:hover': {
            cursor: 'pointer',
            borderBottom: '1px solid #2E2C34'
        }
    },
    interactionAgent: {
        marginLeft: 'auto'
    },
    groupInteractionAgent: {
        marginLeft: 'auto',
        display: 'flex'
    },
    containerTickets: {
        flex: '0 0 300px',
        backgroundColor: '#FFF',
        flexDirection: 'column',
        display: 'flex',
        borderRight: '1px solid rgba(132, 129, 138, 0.101961);'
    },
    headChat: {
        backgroundColor: '#FFF',
        padding: theme.spacing(2),
        borderBottom: '1px solid rgba(132, 129, 138, 0.101961);'
    },
    containerInteractions: {
        padding: theme.spacing(2),
        flex: 1,
        overflowY: 'auto',
    },
    containerQuickreply: {
        whiteSpace: 'break-spaces',
        fontFamily: 'DM Sans',
        flexWrap: 'wrap',
        fontStyle: 'normal',
        fontWeight: 'normal',
        display: 'flex',
        gap: theme.spacing(1),
    },
    containerPostback: {
        width: 200,
        padding: 0,
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: 2,
        borderRadius: 25
    },
    headerPostback: {
        textAlign: 'center',
        backgroundColor: 'rgb(132 129 138 / 0.4);',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    itemSelected: {
        backgroundColor: 'rgb(235, 234, 237, 0.50)'
    },
    buttonPostback: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        textAlign: 'center',
        borderTop: '1px solid #EBEAED',
        '&:hover': {
            color: theme.palette.primary.dark,
        }
    },
    buttonQuickreply: {
        padding: `0 ${theme.spacing(1)}px`,
        backgroundColor: theme.palette.primary.main,
        borderRadius: '6px',
        color: '#FFF',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    interactionText: {
        whiteSpace: 'break-spaces',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: 2,
        color: '#2E2C34',
        wordBreak: 'break-word',
        width: 'fit-content',
        borderRadius: 4,
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        backgroundColor: '#FFF',
    },
    interactionImage: {
        padding: theme.spacing(1),
        borderRadius: 4,
        backgroundColor: '#FFF',
        width: '200px'
    },
    timeInteraction: {
        color: '#84818A',
        fontSize: 13,
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 2,
    },
    containerResponse: {
        padding: theme.spacing(2),
        background: '#FFF',
    },
    containerChat: {
        flex: '1',
        flexDirection: 'column',
        display: 'flex',
    },
    containerProfile: {
        flex: '0 0 300px',
        display: 'none'
    },
    iconResponse: {
        cursor: 'pointer',
        poisition: 'relative',
        '&:hover': {
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    iconSend: {
        background: "#5542F6",
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        cursor: 'pointer',
    },
    iconSendDisabled: {
        backgroundColor: "#EBEAED",
        cursor: 'not-allowed',
    },
    containerButtonsChat: {
        display: 'flex',
        marginTop: 8,
        gap: '8px'
    },
    buttonCloseticket: {
        background: '#F9F9FA',
        border: '1px solid #EBEAED',
        boxSizing: 'border-box',
        borderRadius: '4px',
        width: '150px',
        height: '42px',
        fontFamily: 'Manrope',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ececec'
        }
    },
    buttonIcon: {
        width: 48,
        height: 42,
        border: '1px solid #EBEAED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#ececec'
        }
    },
    container: {
        display: 'flex',
        gap: theme.spacing(2),
        width: '100%'
    },
    containerItemTicket: {
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
        borderBottom: '1px solid #EBEAED',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(235, 234, 237, 0.18)'
        }
    },
    containerNewMessages: {
        minWidth: '22px',
        padding: '0px 4px',
        borderRadius: 12,
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        textAlign: 'center'
    },
    name: {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '22px',
        wordBreak: 'break-word'
    }
}));

const filterAboutStatusName = (data: ITicket[], page: number, searchName: string): ITicket[] => {
    if (page === 0 && searchName === "") {
        return data.filter(item => item.status === "ASIGNADO");
    }
    if (page === 0 && searchName !== "") {
        return data.filter(item => item.status === "ASIGNADO" && (item.displayname + item.ticketnum).toLowerCase().includes(searchName.toLowerCase()));
    }
    if (page === 1 && searchName === "") {
        return data.filter(item => item.status === "PAUSADO");
    }
    if (page === 1 && searchName !== "") {
        return data.filter(item => item.status === "PAUSADO" && (item.displayname + item.ticketnum).toLowerCase().includes(searchName.toLowerCase()));
    }
    if (page === 2 && searchName === "") {
        return data.filter(item => item.status !== "");
    }
    if (page === 2 && searchName !== "") {
        return data.filter(item => item.status !== "" && (item.displayname + item.ticketnum).toLowerCase().includes(searchName.toLowerCase()));
    }
    return data;
}

const TicketsPanel: React.FC<{ classes: any, userType: string }> = ({ classes, userType }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [showSearch, setShowSearch] = useState(false);
    const [pageSelected, setPageSelected] = useState(0);
    const [dataTickets, setDataTickets] = useState<ITicket[]>([])
    const [ticketsToShow, setTicketsToShow] = useState<ITicket[]>([]);
    const [search, setSearch] = useState("");

    const ticketList = useSelector(state => state.inbox.ticketList);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    
    const userTypeConnected = useSelector(state => state.inbox.userType);

    const setTicketSelected = React.useCallback((ticket: ITicket) => {
        dispatch(selectTicket(ticket))
        dispatch(getDataTicket(ticket))
    }, [dispatch]);

    useEffect(() => {
        console.log("userTypeConnected ", userTypeConnected)
        dispatch(getTickets(userType === "SUPERVISOR" ? agentSelected!.userid : null))
        return () => {
            dispatch(resetGetTickets())
        }
    }, [agentSelected, dispatch])

    useEffect(() => {
        if (!ticketList.loading && !ticketList.error) {
            setDataTickets(ticketList.data as ITicket[])
            setTicketsToShow((ticketList.data as ITicket[]).filter(item => item.status === "ASIGNADO"));
        }
    }, [ticketList])

    const onChangeSearchTicket = (e: any) => {
        setSearch(e.target.value)
    }
    
    useEffect(() => {
        setTicketsToShow(filterAboutStatusName(dataTickets, pageSelected, search));
        return () => setTicketsToShow(dataTickets)
    }, [pageSelected, search])

    return (
        <div className={classes.containerTickets}>
            <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid #EBEAED' }}>
                {!showSearch ?
                    <>
                        <Tabs
                            value={pageSelected}
                            indicatorColor="primary"
                            variant="fullWidth"
                            textColor="primary"
                            style={{ flex: 1 }}
                            onChange={(_, value) => setPageSelected(value)}
                        >
                            <AntTab label={t(langKeys.assigned)} />
                            <AntTab label={t(langKeys.pending)} />
                            <AntTab label={t(langKeys.paused)} />
                        </Tabs>
                        <IconButton style={{ width: '50px' }} size="small" onClick={() => setShowSearch(true)} edge="end">
                            <SearchIcon />
                        </IconButton>
                    </>
                    :
                    <TextField
                        color="primary"
                        fullWidth
                        autoFocus
                        style={{ margin: '8px 10px' }}
                        onBlur={() => !search && setShowSearch(false)}
                        onChange={onChangeSearchTicket}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                }
            </div>
            <div style={{ overflowY: 'auto' }}>
                {ticketList.loading ? <ListItemSkeleton /> :
                    ticketsToShow.map((item) => <ItemTicket key={item.conversationid} classes={classes} item={item} setTicketSelected={setTicketSelected} />)
                }
            </div>
        </div>
    )
}

const InboxPanel: React.FC<{ userType: "AGENT" | "SUPERVISOR" }> = ({ userType }) => {
    const classes = useStyles();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const showInfoPanel = useSelector(state => state.inbox.showInfoPanel);

    return (
        <div className={classes.containerPanel}>
            <TicketsPanel
                classes={classes}
                userType={userType}
            />
            {ticketSelected &&
                <>
                    <ChatPanel ticket={ticketSelected} classes={classes} />
                    {showInfoPanel &&
                        <InfoPanel />
                    }
                </>
            }
        </div>
    );
}

export default InboxPanel;