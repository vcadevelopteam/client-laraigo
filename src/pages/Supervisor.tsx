/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect } from 'react'; // we need this to make JSX compile
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import InboxPanel from 'components/inbox/InboxPanel'
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { GetIcon } from 'components'
import { getAgents, selectAgent } from 'store/inbox/actions';
import { AntTab } from 'components';
import { SearchIcon } from 'icons';
import Badge, { BadgeProps } from '@material-ui/core/Badge';
import { IAgent } from "@types";
import clsx from 'clsx';
import { ListItemSkeleton } from 'components'

const filterAboutStatusName = (data: IAgent[], page: number, searchName: string): IAgent[] => {
    if (page === 0 && searchName === "") {
        return data;
    }
    if (page === 0 && searchName !== "") {
        return data.filter(item => item.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (page === 1 && searchName === "") {
        return data.filter(item => item.status === "ACTIVO");
    }
    if (page === 1 && searchName !== "") {
        return data.filter(item => item.status === "ACTIVO" && item.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (page === 2 && searchName === "") {
        return data.filter(item => item.status !== "ACTIVO");
    }
    if (page === 2 && searchName !== "") {
        return data.filter(item => item.status !== "ACTIVO" && item.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    return data;
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        gap: theme.spacing(2),
        // paddingTop: theme.spacing(2),
        width: '100%'
    },
    containerAgents: {
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white'
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
        padding: `14px ${theme.spacing(3)}px`,
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

interface BadgePropsTmp extends BadgeProps {
    colortmp: any;
}

const StyledBadge = withStyles((theme) => ({
    badge: (props: any) => ({
        backgroundColor: props.colortmp,
        color: props.colortmp,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    }),
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(({ ...props }: BadgePropsTmp) => <Badge {...props} />);

const CountTicket: FC<{ label: string, count: number, color: string }> = ({ label, count, color }) => (
    <div style={{ position: 'relative' }}>
        <div style={{ color: color, padding: '4px 6px', whiteSpace: 'nowrap', fontSize: '14px' }}>{label}: {count}</div>
        <div style={{ backgroundColor: color, width: '100%', height: '28px', opacity: '0.1', position: 'absolute', top: 0, left: 0 }}></div>
    </div>
)

const ChannelTicket: FC<{ channelName: string, channelType: string, color: string }> = ({ channelName, channelType, color }) => (
    <div>
        <Tooltip title={channelName}>
            <span>
                <GetIcon channelType={channelType} color={`#${color}`} />
            </span>
        </Tooltip>
    </div>
)

const ItemAgent: FC<{ agent: IAgent, useridSelected?: number }> = ({ agent, useridSelected, agent: { name, status, countActive, countPaused, countClosed, coundPending, channels } }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const handlerSelectAgent = () => dispatch(selectAgent(agent));

    return (
        <div className={clsx(classes.containerItemAgent, { [classes.itemSelected]: (agentSelected?.userid === agent.userid) })} onClick={handlerSelectAgent}>
            <div className={classes.agentUp}>
                <StyledBadge
                    overlap="circular"
                    colortmp={status === "ACTIVO" ? "#44b700" : "#b41a1a"}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    variant="dot"
                >
                    <Avatar>{name.split(" ").reduce((acc, item) => acc + (acc.length < 2 ? item.substring(0, 1).toUpperCase() : ""), "")}</Avatar>
                </StyledBadge>
                <div>
                    <div className={classes.agentName}>{name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {channels && channels.split(',').map((channel, index) => {
                            const [channelType, color, channelName] = channel.split('#');
                            return <ChannelTicket key={index} channelName={channelName} channelType={channelType} color={color} />
                        })}
                    </div>
                </div>
            </div>
            <div className={classes.counterCount}>
                <CountTicket
                    label="Active"
                    count={countActive}
                    color="#55BD84"
                />
                <CountTicket
                    label="Paused"
                    count={countPaused}
                    color="#FF7700"
                />
                <CountTicket
                    label="Closed"
                    count={countClosed}
                    color="#FB5F5F"
                />
                <CountTicket
                    label="Pending"
                    count={coundPending}
                    color="#FB5F5F"
                />
            </div>
        </div>
    )
}

const AgentPanel: FC<{ classes: any }> = ({ classes }) => {
    const dispatch = useDispatch();
    const agentList = useSelector(state => state.inbox.agentList); // amarrado con getCollection

    useEffect(() => {
        dispatch(getAgents())
    }, [])

    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [pageSelected, setPageSelected] = useState(0);
    const [agentsToShow, setAgentsToShow] = useState<IAgent[]>([]);
    const [dataAgents, setDataAgents] = useState<IAgent[]>([]);

    useEffect(() => {
        if (!agentList.loading && !agentList.error) {
            setDataAgents(agentList.data as IAgent[])
            setAgentsToShow(agentList.data as IAgent[])
        }
    }, [agentList])

    const onChangeSearchAgent = (e: any) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        setAgentsToShow(filterAboutStatusName(dataAgents, pageSelected, search));
        return () => setAgentsToShow(dataAgents)
    }, [pageSelected, search])

    return (
        <div className={classes.containerAgents}>
            <div style={{ paddingRight: '16px', paddingLeft: '16px' }}>
                {!showSearch ?
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className={classes.title}>
                            Supervisor
                        </div>
                        <IconButton onClick={() => setShowSearch(true)} edge="end">
                            <SearchIcon />
                        </IconButton>
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
                                    <IconButton edge="end">
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
                <AntTab label="All advisor" />
                <AntTab label="Active" />
                <AntTab label="Inactive" />
            </Tabs>
            {agentList.loading ? <ListItemSkeleton /> :
                <div style={{ overflowY: 'auto' }}>
                    {agentsToShow.map((agent) => (<ItemAgent key={agent.userid} agent={agent} />))}
                </div>
            }
        </div>
    )
}

const Supervisor: FC = () => {
    const classes = useStyles();
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    return (
        <div className={classes.container}>
            <AgentPanel classes={classes} />
            {agentSelected &&
                <InboxPanel userid={agentSelected.userid} />
            }
        </div>
    )
}

export default Supervisor;