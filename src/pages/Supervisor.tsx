import React, { FC, useState, useEffect, memo } from 'react'; // we need this to make JSX compile
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import InboxPanel from 'components/inbox/InboxPanel'
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { getAgents, selectAgent, emitEvent, cleanAlerts, cleanInboxSupervisor, setAgentsToReassign, selectTicket, setLibraryByUser } from 'store/inbox/actions';
import { getCollectionAux2, getMultiCollection, resetAllMain } from 'store/main/actions';
import { getValuesFromDomainLight, getCommChannelLst, getListUsers, getClassificationLevel1, getListQuickReply, getMessageTemplateLst, getEmojiAllSel, getInappropriateWordsLst, getPropertySelByName, getUserChannelSel, getTimeWaiting, getDocumentLibraryByUser, getDomainByDomainName } from 'common/helpers';
import { setOpenDrawer } from 'store/popus/actions';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { AntTab, BadgeGo, ListItemSkeleton, GetIcon } from 'components';
import { SearchIcon } from 'icons';
import { Dictionary, IAgent, ILibrary } from "@types";
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { FixedSizeList, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import memoize from 'memoize-one';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DialogViewGroups from 'components/inbox/DialogViewGroups';
interface Dimensions {
    height: number;
    width: number;
}

const filterAboutStatusName = (data: IAgent[], page: number, textToSearch: string, filterBy: string): IAgent[] => {
    if (page === 0 && textToSearch === "") {
        return data;
    }
    if (page === 0 && textToSearch !== "") {
        return data.filter(item => (filterBy === "user" ? item.name : (item.groups ?? "")).toLowerCase().includes(textToSearch.toLowerCase()));
    }
    if (page === 1 && textToSearch === "") {
        return data.filter(item => item.status === "ACTIVO");
    }
    if (page === 1 && textToSearch !== "") {
        return data.filter(item => item.status === "ACTIVO" && (filterBy === "user" ? item.name : (item.groups ?? "")).toLowerCase().includes(textToSearch.toLowerCase()));
    }
    if (page === 2 && textToSearch === "") {
        return data.filter(item => item.status !== "ACTIVO");
    }
    if (page === 2 && textToSearch !== "") {
        return data.filter(item => item.status !== "ACTIVO" && (filterBy === "user" ? item.name : (item.groups ?? "")).toLowerCase().includes(textToSearch.toLowerCase()));
    }
    return data;
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        width: '100%'
    },
    containerAgents: {
        flex: '0 0 310px',
        width: '310px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRight: '1px solid #EBEAED'
    },
    containerPanel: {
        flex: '1'
    },
    agentName: {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '22px',
        wordBreak: 'break-word',
        overflow: 'hidden',
        maxWidth: 215,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    agentUp: {
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        marginBottom: theme.spacing(1)
    },
    counterCount: {
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap'
    },
    containerItemAgent: {
        padding: `14px ${theme.spacing(2)}px`,
        borderBottom: '1px solid #EBEAED',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(235, 234, 237, 0.18)'
        },
        height: '129.328px',
        minHeight: '129.328px',
    },
    itemSelected: {
        backgroundColor: 'rgb(235, 234, 237, 0.50)'
    },
    itemDisabled: {
        opacity: .6,
        backgroundColor: '#ededed'
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
    tooManyChannels: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#adadad',
        color: 'white',
        borderRadius: 9,
        height: 16,
        width: 16,
        fontSize: 12,
    }
}));

const CountTicket: FC<{ label: string, count: number | string, color: string }> = ({ label, count, color }) => (
    <div style={{ position: 'relative' }}>
        <div style={{ color: color, padding: '3px 4px', whiteSpace: 'nowrap', fontSize: '12px' }}>{label}: <span style={{ fontWeight: 'bold' }}>{count}</span></div>
        <div style={{ backgroundColor: color, width: '100%', height: '24px', opacity: '0.1', position: 'absolute', top: 0, left: 0 }}></div>
    </div>
)

const TimeTicket: FC<{ label: string, count: number | string, color: string }> = ({ label, count, color }) => (
    <div style={{ position: 'relative' }}>
        <div style={{ color: color, padding: '4px 4px', whiteSpace: 'nowrap', fontSize: '12px' }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#7721AD" }}><AccessTimeIcon fontSize='small' style={{ width: 15, height: 15 }} /> {label}</div>
            <div style={{ fontWeight: 'bold', textAlign: "center", marginTop: 4 }}>{count}</div>
        </div>
        <div style={{ backgroundColor: color, width: '100%', height: 43, opacity: '0.1', position: 'absolute', top: 0, left: 0 }}></div>
    </div>
)

const createItemData = memoize((items) => ({
    items
}));

const ChannelTicket: FC<{ channelName: string, channelType: string, color: string }> = ({ channelName, channelType, color }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title={channelName}>
            <span><GetIcon channelType={channelType} color={`#${color}`} /></span>
        </Tooltip>
    </div>
)

const RenderRow = memo(
    ({ data, index, style }: Dictionary) => {
        const { items } = data;
        const item = items[index]

        return (
            <div style={style}>
                <ItemAgent key={item.userid} agent={item} />
            </div>
        )
    },
    areEqual
)
RenderRow.displayName = "RenderRow";

const ItemAgent: FC<{ agent: IAgent, useridSelected?: number }> = ({ agent, agent: { name, motivetype, userid, image, isConnected, countPaused, countClosed, countNotAnswered, status, userstatustype, countAnswered, channels } }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainAux2 = useSelector(state => state.main.mainAux2);
    const [extraInfo, setextraInfo] = useState({ avgtimewaiting: "00:00:00", maxtimewaiting: "00:00:00", mintimewaiting: "00:00:00" });
    const agentSelected = useSelector(state => state.inbox.agentSelected);

    const handlerSelectAgent = () => {
        if (agent.showinfo) {
            dispatch(selectAgent(agent));
            dispatch(emitEvent({
                event: 'viewAgent',
                data: {
                    userid: agent.userid,
                }
            }));
        } else {
            dispatch(getCollectionAux2(getTimeWaiting(agent?.userid ?? 0)))
        }
    };

    useEffect(() => {
        if (!agent.showinfo) {
            setextraInfo({
                avgtimewaiting: agent.avgtimewaiting ?? "",
                maxtimewaiting: agent.maxtimewaiting ?? "",
                mintimewaiting: agent.mintimewaiting ?? "",
            })
        }
    }, [agent])

    useEffect(() => {
        if (!mainAux2.loading && !mainAux2.error) {
            if (mainAux2.key === `UFN_TIME_WAITING_SEL_${agent?.userid}`) {
                const { avgtimewaiting, mintimewaiting, maxtimewaiting } = mainAux2.data.length > 0 ? mainAux2.data[0] : { avgtimewaiting: "00:00:00", maxtimewaiting: "00:00:00", mintimewaiting: "00:00:00" };
                setextraInfo({
                    avgtimewaiting,
                    maxtimewaiting,
                    mintimewaiting,
                })
            }
        }
    }, [mainAux2])

    return (
        <div
            className={clsx(classes.containerItemAgent,
                {
                    [classes.itemSelected]: (agentSelected?.userid === userid),
                    [classes.itemDisabled]: (!agent.showinfo),
                }
            )}
            onClick={handlerSelectAgent}
        >
            <div className={classes.agentUp}>
                {agent.showinfo && (
                    <BadgeGo
                        overlap="circular"
                        colortmp={(userstatustype === "INBOX" && status === "DESCONECTADO" && motivetype) ? "#e89647" : (isConnected ? "#44b700" : "#b41a1a")}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        variant="dot"
                    >
                        <Tooltip title={motivetype ?? ""}>
                            <Avatar
                                src={image ?? undefined}
                            >
                                {name?.split(" ").reduce((acc, item) => acc + (acc.length < 2 ? item.substring(0, 1).toUpperCase() : ""), "")}
                            </Avatar>
                        </Tooltip>
                    </BadgeGo>
                )}
                <div>
                    <div className={classes.agentName} title={name}>{name}</div>
                    {agent.showinfo && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {channels.slice(0, 10).map((channel, index) => {
                                const [channelType, color, channelName] = channel.split('#');
                                return <ChannelTicket key={index} channelName={channelName} channelType={channelType} color={color} />
                            })}
                            {channels.length > 10 && (
                                <Tooltip title={<div style={{ whiteSpace: 'pre-wrap' }}>{channels.slice(10, channels.length).reduce((acc, channel) => acc + "\n• " + channel.split('#')[2], "")}</div>}>
                                    <div className={classes.tooManyChannels}>
                                        <span>{channels.length - 10 < 10 ? channels.length - 10 : "+9"}</span>
                                    </div>
                                </Tooltip>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className={classes.counterCount}>
                {!agent.showinfo && (
                    <>
                        <TimeTicket
                            label={t(langKeys.function_average)}
                            count={extraInfo.avgtimewaiting ?? "00:00:00"}
                            color="#000"
                        />
                        <TimeTicket
                            label={t(langKeys.function_minimum)}
                            count={extraInfo.mintimewaiting ?? "00:00:00"}
                            color="#000"
                        />
                        <TimeTicket
                            label={t(langKeys.function_maximum)}
                            count={extraInfo.maxtimewaiting ?? "00:00:00"}
                            color="#000"
                        />
                    </>
                )}
                {([2, 3].includes(userid)) &&
                    <CountTicket
                        label={t(langKeys.active) + "s"}
                        count={countAnswered + (countNotAnswered ?? 0)}
                        color="#55BD84"
                    />
                }
                {![2, 3].includes(userid) &&
                    <>
                        <CountTicket
                            label={t(langKeys.attending)}
                            count={countAnswered}
                            color="#55BD84"
                        />
                        <CountTicket
                            label={t(langKeys.pending)}
                            count={countNotAnswered ?? 0}
                            color="#FB5F5F"
                        />
                    </>
                }
                <CountTicket
                    label={t(langKeys.paused)}
                    count={countPaused}
                    color="#FF7700"
                />
                <CountTicket
                    label={t(langKeys.closed)}
                    count={countClosed}
                    color="#FB5F5F"
                />
            </div>
        </div>
    )
}

const HeaderAgentPanel: FC<{
    classes: ClassNameMap,
    onSearch: (pageSelected: number, search: string, filterBy: string) => void,
    countAll: number,
    countConnected: number,
    countDisconnected: number,
}> = ({ classes, onSearch, countAll, countConnected, countDisconnected }) => {

    const [pageSelected, setPageSelected] = useState(0);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [filterBy, setFilterBy] = useState('user')
    const agentList = useSelector(state => state.inbox.agentList);
    const [openViewGroupDialog, setOpenViewGroupDialog] = useState(false);
    const showInfoTicketByGroups = useSelector(state => state.login.validateToken.user?.properties?.show_info_tickets_by_groups);

    const onChangeSearchAgent = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setSearch(e.target.value);

    const handleClose = () => setAnchorEl(null);

    useEffect(() => {
        onSearch(pageSelected, search, filterBy);
    }, [pageSelected, search, filterBy])

    return (
        <>
            <div style={{ paddingRight: 8, paddingLeft: 16 }}>
                {!showSearch ?
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className={classes.title}>
                            Supervisor
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size='small' onClick={() => setShowSearch(true)} edge="end">
                                <SearchIcon />
                            </IconButton>
                            <IconButton
                                size='small'
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem
                                    selected={filterBy === 'user'}
                                    onClick={() => {
                                        setAnchorEl(null);
                                        setFilterBy('user');
                                    }}
                                >
                                    {t(langKeys.filter_by_user)}
                                </MenuItem>
                                <MenuItem
                                    selected={filterBy === 'group'}
                                    onClick={() => {
                                        setAnchorEl(null);
                                        setFilterBy('group');
                                    }}
                                >
                                    {t(langKeys.filter_by_group)}
                                </MenuItem>
                                {showInfoTicketByGroups && 
                                    <MenuItem
                                        onClick={() => {
                                            setAnchorEl(null);
                                            setOpenViewGroupDialog(true)
                                        }}
                                    >{t(langKeys.view_by_groups)}
                                    </MenuItem>
                                }
                            </Menu>
                        </div>
                    </div> :
                    <TextField
                        color="primary"
                        fullWidth
                        autoFocus
                        style={{ marginTop: '8px', marginBottom: '8px' }}
                        onBlur={() => !search && setShowSearch(false)}
                        onChange={onChangeSearchAgent}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton size="small" edge="end">
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>)
                        }}
                    />
                }
            </div>
            <DialogViewGroups
                openModal={openViewGroupDialog}
                setOpenModal={setOpenViewGroupDialog}
            />
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED' }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={`${t(langKeys.all_adivisers)}(${pageSelected === 0 ? countAll : agentList.data.length})`} />
                <AntTab label={`${t(langKeys.conected)}(${pageSelected === 1 ? countConnected : agentList.data.filter(x => x.isConnected).length})`} />
                <AntTab label={`${t(langKeys.disconected)}(${pageSelected === 2 ? countDisconnected : agentList.data.filter(x => !x.isConnected).length})`} />
            </Tabs>
        </>
    )
}

const AgentPanel: FC<{ classes: ClassNameMap }> = ({ classes }) => {
    const agentList = useSelector(state => state.inbox.agentList);
    const [agentsToShow, setAgentsToShow] = useState<IAgent[]>([]);
    const [dataAgents, setDataAgents] = useState<IAgent[]>([]);
    const firstLoad = React.useRef(true);

    const onSearch = (pageSelected: number, search: string, filterBy: string) => {
        setAgentsToShow(filterAboutStatusName(dataAgents, pageSelected, search, filterBy))
    }

    useEffect(() => {
        if (!agentList.loading && !agentList.error) {
            setDataAgents(agentList.data)
            if (firstLoad.current && agentList.data.length > 0) {
                setAgentsToShow(agentList.data)
                firstLoad.current = false
            } else {
                setAgentsToShow(agentList.data.filter(y => agentsToShow.map(x => x.userid).includes(y.userid)))
            }
        }
    }, [agentList])

    return (
        <div className={classes.containerAgents}>
            <HeaderAgentPanel
                classes={classes}
                onSearch={onSearch}
                countAll={agentsToShow.length}
                countConnected={agentsToShow.filter(x => x.isConnected).length}
                countDisconnected={agentsToShow.filter(x => !x.isConnected).length}
            />
            {agentList.loading ? <ListItemSkeleton /> :
                <div className="scroll-style-go" style={{ height: '100%' }}>
                    <AutoSizer>
                        {({ height, width }: Dimensions) => (
                            <FixedSizeList
                                width={width}
                                height={height}
                                itemCount={agentsToShow.length}
                                itemSize={129}
                                itemData={createItemData(agentsToShow)}
                            >
                                {RenderRow}
                            </FixedSizeList>
                        )}
                    </AutoSizer>
                </div>
            }
        </div>
    )
}

const Supervisor: FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const wsConnected = useSelector(state => state.inbox.wsConnected);
    const multiData = useSelector(state => state.main.multiData);
    const [initial, setInitial] = useState(true)
    const firstLoad = React.useRef(true);

    useEffect(() => {
        if (!multiData.loading && !multiData.error) {
            if (multiData?.data[1])
                dispatch(setAgentsToReassign(multiData?.data?.[1].data || []))
            const dataLibrary = multiData.data.find(x => x.key === "QUERY_DOCUMENTLIBRARY_BY_USER")
            dispatch(setLibraryByUser((dataLibrary?.data as ILibrary[]) ?? []))
        }
    }, [multiData])

    useEffect(() => {
        setInitial(false)
        dispatch(setOpenDrawer(false));
        dispatch(getAgents())
        dispatch(getMultiCollection([
            getValuesFromDomainLight("MOTIVOCIERRE"),
            getListUsers(),
            getClassificationLevel1("TIPIFICACION"),
            getDomainByDomainName("GRUPOS", "_GRUPOS"),
            getListQuickReply(),
            getMessageTemplateLst(''),
            getCommChannelLst(),
            getValuesFromDomainLight("OPORTUNIDADPRODUCTOS"),
            getValuesFromDomainLight("MOTIVOSUSPENSION"),
            getValuesFromDomainLight("OPORTUNIDADETIQUETAS"),
            getEmojiAllSel(),
            getInappropriateWordsLst(),
            getPropertySelByName("TIPIFICACION"),
            getUserChannelSel(),
            getPropertySelByName("ASESORDELEGACION", "ASESORDELEGACION"),
            getPropertySelByName("ASESORSUSPENDE", "ASESORSUSPENDE"),
            getDocumentLibraryByUser(),
            getPropertySelByName("GRUPODELEGACION", "GRUPODELEGACION"),
            getPropertySelByName("COPILOTLARAIGO", "COPILOTLARAIGO"),
        ]))
        return () => {
            dispatch(resetAllMain());
            dispatch(cleanAlerts());
            dispatch(cleanInboxSupervisor());
        };
    }, [])

    useEffect(() => {
        if (wsConnected) {
            if (firstLoad.current) {
                firstLoad.current = false;

                dispatch(emitEvent({
                    event: 'connectChat',
                    data: { usertype: 'SUPERVISOR' }
                }));
            } else {
                dispatch(getAgents())
                dispatch(selectAgent(null))
                dispatch(selectTicket(null))
            }
        }
        return () => {
            if (wsConnected) {
                dispatch(emitEvent({
                    event: 'connectChat',
                    data: { usertype: '' }
                }));
            }
        }
    }, [wsConnected])

    return (
        <div className={classes.container}>
            <AgentPanel classes={classes} />
            {(agentSelected && !initial) &&
                <InboxPanel userType="SUPERVISOR" />
            }
        </div>
    )
}

export default Supervisor;