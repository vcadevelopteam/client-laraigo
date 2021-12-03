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
import DrawerFilter from 'components/inbox/DrawerFilter'
import { resetGetTickets, getTickets, selectTicket, getDataTicket, setIsFiltering } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import { ListItemSkeleton } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
    containerPanel: {
        flex: '1',
        display: 'flex'
    },
    titleTicketChat: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    interactionAgent: {
        marginLeft: 'auto'
    },
    groupInteractionAgent: {
        marginLeft: 'auto',
        display: 'flex'
    },
    interactionFromPost: {
        display: 'flex',
        gap: 8
    },
    containerTickets: {
        flex: '0 0 300px',
        maxWidth: 300,
        backgroundColor: '#FFF',
        flexDirection: 'column',
        display: 'flex',
        borderRight: '1px solid #84818a1a'
    },
    headChat: {
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
        borderBottom: '1px solid #84818a1a',
        display: 'flex',
        justifyContent: 'space-between',
        cursor: 'pointer'
    },
    containerInteractions: {
        padding: theme.spacing(2),
        flex: 1,
        // overflowY: 'auto',
        // backgroundColor: '#e0e0e0',
    },
    containerQuickreply: {
        whiteSpace: 'break-spaces',
        flexWrap: 'wrap',
        fontStyle: 'normal',
        fontWeight: 'normal',
        display: 'flex',
        gap: theme.spacing(.5),
    },
    containerPostback: {
        width: 200,
        padding: 0,
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
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: 2,
        color: '#2E2C34',
        wordBreak: 'break-word',
        width: 'fit-content',
        borderRadius: 12,
        borderBottomLeftRadius: 0,
        padding: `${theme.spacing(.5)}px ${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
        position: 'relative',
        maxWidth: 480,
        backgroundColor: '#FFF',
        boxShadow: '0 1px 2px 0 rgb(16 35 47 / 15%)'
    },
    interactionTextAgent: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 0,
        backgroundColor: "#eeffde",
    },
    interactionImage: {
        borderRadius: theme.spacing(1.5),
        backgroundColor: '#FFF',
        position: 'relative',
        width: '328px',
        height: '340px',
    },
    imageCard: {
        width: '100%',
        maxWidth: '100%',
        cursor: 'pointer',
        objectFit: 'cover',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 'inherit'
    },
    timeInteraction: {
        color: '#84818A',
        fontSize: 13,
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 2,
    },
    containerResponse: {
        padding: theme.spacing(2),
        background: '#FFF',
        position: 'relative',
        borderTop: '1px solid #84818a1a'
    },
    containerChat: {
        flex: '1',
        flexDirection: 'column',
        display: 'flex',

    },
    collapseInfo: {
        position: 'absolute',
        top: 'calc(50% - 20px)'
    },
    infoOpen: {
        right: -20,
    },
    infoClose: {
        right: 0,
    },
    containerProfile: {
        flex: '0 0 300px',
        display: 'none'
    },
    iconResponse: {
        cursor: 'pointer',
        poisition: 'relative',
        color: '#2E2C34',
        '&:hover': {
            // color: theme.palette.primary.main,
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
    },
    buttonCloseticket: {
        background: '#F9F9FA',
        border: '1px solid #EBEAED',
        boxSizing: 'border-box',
        borderRadius: '4px',
        width: '150px',
        height: '42px',
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
        padding: theme.spacing(1),
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
        flex: 1,
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '22px',
        wordBreak: 'break-word',

        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: 200
    },
    containerQuickReply: {
        boxShadow: '0px 3px 6px rgb(0 0 0 / 10%)',
        backgroundColor: '#FFF',
        width: 250,
    },
    headerQuickReply: {
        fontSize: 14,
        fontWeight: 500,
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(1.5),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    hotKeyQuickReply: {
        padding: theme.spacing(.5),
        flex: '0 0 28px',
        backgroundColor: theme.palette.primary.main,
        color: '#FFF',
        borderRadius: 4,
        width: 200,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
        textOverflow: 'ellipsis',
        '&:hover': {
            backgroundColor: '#bd95d7',
            fontWeight: 500
        }
    },
    titleFilter: {
        fontSize: 15,
        fontWeight: 500
    },
    containerDrawer: {
        width: 300,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
    },
    itemFilter: {
        flex: 1,
    },
}));

const filterAboutStatusName = (data: ITicket[], page: number, searchName: string): ITicket[] => {
    if (page === 0 && searchName === "") {
        return data.filter(item => item.status === "ASIGNADO");
    }
    if (page === 0 && searchName !== "") {
        return data.filter(item => item.status === "ASIGNADO" && (item.displayname + item.ticketnum).toLowerCase().includes(searchName.toLowerCase()));
    }
    if (page === 1 && searchName === "") {
        return data
    }
    if (page === 1 && searchName !== "") {
        return data.filter(item => (item.displayname + item.ticketnum).toLowerCase().includes(searchName.toLowerCase()));
    }
    if (page === 2 && searchName === "") {
        return data.filter(item => item.status === "PAUSADO");
    }
    if (page === 2 && searchName !== "") {
        return data.filter(item => item.status === "PAUSADO" && (item.displayname + item.ticketnum).toLowerCase().includes(searchName.toLowerCase()));
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
    const [drawerOpen, setDrawerOpen] = useState(false);
    const ticketList = useSelector(state => state.inbox.ticketList);
    const ticketFilteredList = useSelector(state => state.inbox.ticketFilteredList);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const isFiltering = useSelector(state => state.inbox.isFiltering);

    const setTicketSelected = React.useCallback((ticket: ITicket) => {
        dispatch(selectTicket(ticket))
        dispatch(getDataTicket(ticket))
    }, [dispatch]);

    useEffect(() => {
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

    const RenderRow = React.useCallback(
        ({ index, style }) => {
            const item = ticketsToShow[index]
            return (
                <div style={style}>
                    <ItemTicket key={item.conversationid} classes={classes} item={item} setTicketSelected={setTicketSelected} />
                </div>
            )
        },
        [ticketsToShow]
    )

    const RenderRowFilterd = React.useCallback(
        ({ index, style }) => {
            const item = ticketFilteredList.data[index]
            return (
                <div style={style}>
                    <ItemTicket key={item.conversationid} classes={classes} item={item} setTicketSelected={setTicketSelected} />
                </div>
            )
        },
        [ticketFilteredList.data]
    )

    return (
        <div className={classes.containerTickets}>
            <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid #EBEAED' }}>
                {!showSearch && !isFiltering ?
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
                            <AntTab label={t(langKeys.all)} />
                            <AntTab label={t(langKeys.paused)} />
                        </Tabs>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
                            <IconButton size="small" onClick={() => setShowSearch(true)}>
                                <SearchIcon />
                            </IconButton>
                        </div>
                    </>
                    :
                    <TextField
                        color="primary"
                        fullWidth
                        autoFocus
                        style={{ margin: '8px 10px' }}
                        onBlur={() => {
                            setTimeout(() => {
                                !search && setShowSearch(false)
                            }, 200);
                        }}
                        placeholder={t(langKeys.search_inbox)}
                        onChange={onChangeSearchTicket}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {isFiltering &&
                                        <Tooltip title={t(langKeys.clean) + ""} arrow>
                                            <IconButton size="small" onClick={() => dispatch(setIsFiltering(false))}>
                                                <ClearIcon />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    <Tooltip title={t(langKeys.advance_search) + ""} arrow>
                                        <IconButton size="small" onClick={() => setDrawerOpen(true)}>
                                            <FilterListIcon />
                                        </IconButton>
                                    </Tooltip>

                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton size="small">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                }
            </div>
            <div style={{ height: '100%', overflowY: 'hidden' }}>
                {
                    isFiltering ?
                        <>
                            <div style={{ fontWeight: 500, padding: 8, fontSize: 15, borderBottom: '1px solid rgb(235, 234, 237)' }}>
                                {t(langKeys.search_result)}
                            </div>
                            {ticketFilteredList.loading ?
                                <ListItemSkeleton />
                                :
                                (ticketFilteredList.data.length === 0 ?
                                    <div style={{ padding: 8 }}>
                                        {t(langKeys.without_result)}
                                    </div>
                                    :
                                    <AutoSizer>
                                        {({ height, width }: any) => (
                                            <FixedSizeList
                                                width={width}
                                                height={height}
                                                itemCount={ticketFilteredList.data.length}
                                                itemSize={97}
                                            >
                                                {RenderRowFilterd}
                                            </FixedSizeList>
                                        )}
                                    </AutoSizer>
                                )

                            }
                        </>
                        : (ticketList.loading ? <ListItemSkeleton /> :
                            <AutoSizer>
                                {({ height, width }: any) => (
                                    <FixedSizeList
                                        width={width}
                                        height={height}
                                        itemCount={ticketsToShow.length}
                                        itemSize={97}
                                    >
                                        {RenderRow}
                                    </FixedSizeList>
                                )}
                            </AutoSizer>
                        )
                }
                {/* {ticketList.loading ? <ListItemSkeleton /> :
                    ticketsToShow.map((item) => <ItemTicket key={item.conversationid} classes={classes} item={item} setTicketSelected={setTicketSelected} />)
                } */}
            </div>
            <DrawerFilter
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                classes={classes}
            />
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
                    <ChatPanel classes={classes} />
                    {showInfoPanel &&
                        <InfoPanel />
                    }
                </>
            }
        </div>
    );
}

export default InboxPanel;