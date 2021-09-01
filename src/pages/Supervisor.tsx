/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState } from 'react'; // we need this to make JSX compile
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Chat from 'components/inbox/Chat'
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab, { TabProps } from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LanguageIcon from '@material-ui/icons/Language';
import { WebMessengerIcon } from 'icons'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        gap: theme.spacing(2),
        // paddingTop: theme.spacing(2),
        width: '100%'
    },
    containerAgents: {
        flex: '0 0 300px'
    },
    containerPanel: {
        flex: '1'
    },
    agentName: {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '22px',
    },
    agentUp: {
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        marginBottom: theme.spacing(2)
    },
    counterCount: {
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap'
    },
    containerTicket: {
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
        borderBottom: '1px solid #EBEAED',

    }
}));
const agentstt = [
    {
        name: "carlos",
        countActive: 2,
        countPaused: 2,
        countClosed: 3,
        coundPending: 2
    },
    {
        name: "david",
        countActive: 2,
        countPaused: 2,
        countClosed: 2,
        coundPending: 2
    }
]
interface AgentProps {
    name: string;
    countActive: number;
    countPaused: number;
    countClosed: number;
    coundPending: number;
}
const AntTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover': {
            color: theme.palette.primary.main,
            opacity: 1,
        },
        '&$selected': {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: theme.palette.primary.main,
        },
    },
    selected: {},
}))((props: TabProps) => <Tab disableRipple {...props} />);

const CountTicket: FC<{ label: string, count: number, color: string }> = ({ label, count, color }) => (
    <div style={{ position: 'relative' }}>
        <div style={{ color: color, padding: '4px 6px', whiteSpace: 'nowrap', fontSize: '14px' }}>{label}: {count}</div>
        <div style={{ backgroundColor: color, width: '100%', height: '28px', opacity: '0.1', position: 'absolute', top: 0, left: 0 }}></div>
    </div>
)

const ChannelTicket: FC<{ channelName: string, channelType: string }> = ({ channelName, channelType }) => (
    <div>
        <Tooltip title="Canal 1">
            <LanguageIcon />
        </Tooltip>
    </div>
)

const ItemAgent: FC<AgentProps> = ({ name, countActive, countPaused, countClosed, coundPending }) => {
    const classes = useStyles();

    return (
        <div className={classes.containerTicket}>
            <div className={classes.agentUp}>
                <Avatar>{name.split(" ").reduce((acc, item) => acc + (acc.length < 3 ? item.substring(0, 1).toUpperCase() : ""), "")}</Avatar>
                <div>
                    <div className={classes.agentName}>{name}</div>
                    <div>
                        <ChannelTicket
                            channelName="Channel 1"
                            channelType="WEBM"
                        />
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

const Supervisor: FC = () => {
    const classes = useStyles();

    const [pageSelected, setPageSelected] = useState(1)

    return (
        <div className={classes.container}>
            <div style={{ backgroundColor: 'white', paddingTop: '16px' }}>
                <TextField
                    color="primary"
                    fullWidth
                    style={{ paddingRight: '16px', paddingLeft: '16px' }}
                    onChange={(e) => {
                        // setvalue(e.target.value);
                        // onChange && onChange(e.target.value);
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    // onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
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
                <div className={classes.containerAgents}>
                    {agentstt.map((agent) => (
                        <ItemAgent {...agent} />
                    ))}
                </div>
            </div>
            <Chat />
        </div>
    )
}

export default Supervisor;