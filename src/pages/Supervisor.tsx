/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect } from 'react'; // we need this to make JSX compile
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import InboxPanel from 'components/inbox/InboxPanel'
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { GetIcon } from 'components'
import { getAgents, selectAgent, emitEvent, cleanAlerts, cleanInboxSupervisor } from 'store/inbox/actions';
import { getMultiCollection, resetAllMain } from 'store/main/actions';
import { getValuesFromDomainLight, getCommChannelLst, getListUsers, getClassificationLevel1, getListQuickReply, getMessageTemplateLst } from 'common/helpers';
import { setOpenDrawer } from 'store/popus/actions';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { AntTab, BadgeGo, ListItemSkeleton } from 'components';
import { SearchIcon } from 'icons';
import { IAgent } from "@types";
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const filterAboutStatusName = (data: IAgent[], page: number, textToSearch: string, filterBy: string): IAgent[] => {
    if (page === 0 && textToSearch === "") {
        return data;
    }
    if (page === 0 && textToSearch !== "") {
        return data.filter(item => (filterBy === "user" ? item.name : (item.groups || "")).toLowerCase().includes(textToSearch.toLowerCase()));
    }
    if (page === 1 && textToSearch === "") {
        return data.filter(item => item.status === "ACTIVO");
    }
    if (page === 1 && textToSearch !== "") {
        return data.filter(item => item.status === "ACTIVO" && (filterBy === "user" ? item.name : (item.groups || "")).toLowerCase().includes(textToSearch.toLowerCase()));
    }
    if (page === 2 && textToSearch === "") {
        return data.filter(item => item.status !== "ACTIVO");
    }
    if (page === 2 && textToSearch !== "") {
        return data.filter(item => item.status !== "ACTIVO" && (filterBy === "user" ? item.name : (item.groups || "")).toLowerCase().includes(textToSearch.toLowerCase()));
    }
    return data;
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        width: '100%'
    },
    containerAgents: {
        flex: '0 0 300px',
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
        wordBreak: 'break-word'
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
        }
    },
    itemSelected: {
        backgroundColor: 'rgb(235, 234, 237, 0.50)'
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    }
}));

const CountTicket: FC<{ label: string, count: number, color: string }> = ({ label, count, color }) => (
    <div style={{ position: 'relative' }}>
        <div style={{ color: color, padding: '3px 4px', whiteSpace: 'nowrap', fontSize: '12px' }}>{label}: <span style={{ fontWeight: 'bold' }}>{count}</span></div>
        <div style={{ backgroundColor: color, width: '100%', height: '24px', opacity: '0.1', position: 'absolute', top: 0, left: 0 }}></div>
    </div>
)

const ChannelTicket: FC<{ channelName: string, channelType: string, color: string }> = ({ channelName, channelType, color }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title={channelName}>
            <span><GetIcon channelType={channelType} color={`#${color}`} /></span>
        </Tooltip>
    </div>
)

const ItemAgent: FC<{ agent: IAgent, useridSelected?: number }> = ({ agent, agent: { name, userid, image, isConnected, countPaused, countClosed, countNotAnwsered, countPending, countAnwsered, channels } }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const handlerSelectAgent = () => dispatch(selectAgent(agent));

    return (
        <div className={clsx(classes.containerItemAgent, { [classes.itemSelected]: (agentSelected?.userid === userid) })} onClick={handlerSelectAgent}>
            <div className={classes.agentUp}>
                <BadgeGo
                    overlap="circular"
                    colortmp={isConnected ? "#44b700" : "#b41a1a"}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    variant="dot"
                >
                    <Avatar src={image || undefined} >{name?.split(" ").reduce((acc, item) => acc + (acc.length < 2 ? item.substring(0, 1).toUpperCase() : ""), "")}</Avatar>
                </BadgeGo>
                <div>
                    <div className={classes.agentName}>{name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {channels.map((channel, index) => {
                            const [channelType, color, channelName] = channel.split('#');
                            return <ChannelTicket key={index} channelName={channelName} channelType={channelType} color={color} />
                        })}
                    </div>
                </div>
            </div>
            <div className={classes.counterCount}>
                {(userid === 2 || userid === 3) &&
                    <CountTicket
                        label={t(langKeys.active) + "s"}
                        count={countAnwsered + (countNotAnwsered || 0)}
                        color="#55BD84"
                    />
                }
                {userid !== 2 && userid !== 3 &&
                    <>
                        <CountTicket
                            label={t(langKeys.attending)}
                            count={countAnwsered}
                            color="#55BD84"
                        />
                        <CountTicket
                            label={t(langKeys.pending)}
                            count={countNotAnwsered || 0}
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
    classes: any,
    onSearch: (pageSelected: number, search: string, filterBy: string) => void
}> = ({ classes, onSearch }) => {

    const [pageSelected, setPageSelected] = useState(0);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [filterBy, setFilterBy] = useState('user')

    const onChangeSearchAgent = (e: any) => setSearch(e.target.value);

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
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED' }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={t(langKeys.all_adivisers)} />
                <AntTab label={t(langKeys.conected)} />
                <AntTab label={t(langKeys.disconected)} />
            </Tabs>
        </>
    )
}

const AgentPanel: FC<{ classes: any }> = ({ classes }) => {
    const agentList = useSelector(state => state.inbox.agentList);

    const onSearch = (pageSelected: number, search: string, filterBy: string) => {
        setAgentsToShow(filterAboutStatusName(dataAgents, pageSelected, search, filterBy));
    }

    const [agentsToShow, setAgentsToShow] = useState<IAgent[]>([]);
    const [dataAgents, setDataAgents] = useState<IAgent[]>([]);

    useEffect(() => {
        if (!agentList.loading && !agentList.error) {
            setDataAgents(agentList.data as IAgent[])
            setAgentsToShow(agentList.data as IAgent[])
        }
    }, [agentList])

    return (
        <div className={classes.containerAgents}>
            <HeaderAgentPanel classes={classes} onSearch={onSearch} />
            {agentList.loading ? <ListItemSkeleton /> :
                <div className="scroll-style-go">
                    {agentsToShow.map((agent) => (<ItemAgent key={agent.userid} agent={agent} />))}
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

    useEffect(() => {
        dispatch(setOpenDrawer(false));
        dispatch(getAgents())
        dispatch(getMultiCollection([
            getValuesFromDomainLight("MOTIVOCIERRE"),
            getListUsers(),
            getClassificationLevel1("TIPIFICACION"),
            getValuesFromDomainLight("GRUPOS"),
            getListQuickReply(),
            getMessageTemplateLst(),
            getCommChannelLst(),
            getValuesFromDomainLight("OPORTUNIDADPRODUCTOS"),
            getValuesFromDomainLight("MOTIVOSUSPENSION"),
            getValuesFromDomainLight("OPORTUNIDADETIQUETAS"),
        ]))
        return () => {
            dispatch(resetAllMain());
            dispatch(cleanAlerts());
            dispatch(cleanInboxSupervisor());
        };
    }, [])

    useEffect(() => {
        if (wsConnected) {
            dispatch(emitEvent({
                event: 'connectChat',
                data: { usertype: 'SUPERVISOR' }
            }));
        }
    }, [wsConnected])

    return (
        <div className={classes.container}>
            <AgentPanel classes={classes} />
            {agentSelected &&
                <InboxPanel userType="SUPERVISOR" />
            }
        </div>
    )
}

export default Supervisor;