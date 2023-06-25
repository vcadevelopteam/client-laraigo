import React, { FC } from "react";
import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import Popover from '@material-ui/core/Popover';
import { ArrowDropDownIcon } from "icons";
import { Trans } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from 'hooks';
import { logout } from 'store/login/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { ManageOrganization, BadgeGo, StatusConnection } from 'components';
import { connectAgentUI, disconnectSocket, emitEvent } from "store/inbox/actions";
import { disconnectVoxi } from "store/voximplant/actions";
import { apiUrls } from 'common/constants';
const isIncremental = apiUrls.LOGIN_URL.includes("historical")

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        icon: {
            height: 32,
            width: 32,
        },
        containerPopover: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(2),
            flexDirection: 'column',
            gap: theme.spacing(1.5),
            width: 270
        },
        infoContainer: {
            display: 'flex',
            flexDirection: 'column',
        },
        textNotPass: {
            whiteSpace: 'normal',
            textAlign: 'center',
            wordBreak: 'break-word'
        },
        nameTextNotPass: {
            whiteSpace: 'normal',
            textAlign: 'center',
            wordBreak: 'break-word',
            color: theme.palette.primary.main
        },
        infoUserName: {
            maxWidth: 120,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontSize: 16,
            textAlign: 'start',
            lineHeight: 'normal',
        },
        infoUserRol: {
            color: '#8F92A1',
            fontSize: 12,
            textAlign: 'start',
            fontWeight: 'normal',
            lineHeight: 'normal',
        },
        statusConnection: {
            display: 'none',
            [theme.breakpoints.down('xs')]: {
                display: 'block',
            },
        }
    }),
);

const AccountMenu: FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const voxiConnection = useSelector(state => state.voximplant.connection);

    const user = useSelector(state => state.login.validateToken.user);
    const userConnected = useSelector(state => state.inbox.userConnected);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const signOut = () => {
        dispatch(connectAgentUI(false))
        if (!voxiConnection.error) {
            dispatch(disconnectVoxi())
        }
        dispatch(emitEvent({
            event: 'connectAgent',
            data: {
                isconnected: false,
                userid: 0,
                orgid: 0
            }
        }));
        dispatch(logout());
        dispatch(disconnectSocket());
        history.push('/sign-in');
    }
    const gotoSettings = () => {
        setAnchorEl(null);
        history.push('/usersettings');
    }
    const openprivacypolicies = () => {
        window.open("/privacy", '_blank');
    }

    const consultHistoricalData = () => {
        if (isIncremental) {
            if (window.location.hostname === 'incremental-prod.laraigo.com') {
                window.open("https://app.laraigo.com/sign-in", '_blank');
            } else if (window.location.hostname === 'incremental-claro.laraigo') {
                window.open("https://claro.laraigo.com/sign-in", '_blank');
            }
        } else {
            if (window.location.hostname === 'claro.laraigo.com') {
                window.open("https://incremental-claro.laraigo.com/sign-in", '_blank');
            } else {
                window.open("https://incremental-prod.laraigo.com/sign-in", '_blank');
            }
        }
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popoverxx' : undefined;

    return (
        <div className={classes.root}>
            <Button
                aria-describedby={id}
                aria-haspopup="true"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={

                    <BadgeGo
                        overlap="circular"
                        colortmp={userConnected ? "#44b700" : "#b41a1a"}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        variant="dot"
                    >
                        <Avatar className={classes.icon} src={user?.image + "" || undefined} />
                    </BadgeGo>
                }
                endIcon={<ArrowDropDownIcon />}
            >
                <div className={classes.infoContainer}>
                    <label className={classes.infoUserName}>{user?.firstname} {user?.lastname}</label>
                    <label className={classes.infoUserRol}>{user?.roledesc}</label>
                </div>
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes.containerPopover}>
                    <Avatar style={{ width: 120, height: 120 }} src={user?.image + "" || undefined} />
                    <div className={classes.nameTextNotPass} style={{ fontWeight: 500, }}>
                        {user?.firstname} {user?.lastname}
                    </div>
                    <div className={classes.textNotPass}>
                        {user?.email}
                    </div>
                    <div className={classes.statusConnection}>
                        <StatusConnection />
                    </div>
                    <ManageOrganization />
                    <Button
                        onClick={gotoSettings}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        style={{ fontWeight: "normal" }}
                    >
                        <Trans i18nKey={langKeys.accountsettings} />
                    </Button>
                    <Button
                        onClick={openprivacypolicies}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        style={{ fontWeight: "normal" }}
                    >
                        <Trans i18nKey={langKeys.privacypoliciestitle} />
                    </Button>
                    <Button
                        onClick={consultHistoricalData}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        style={{ fontWeight: "normal" }}
                    >
                        <Trans i18nKey={isIncremental ? langKeys.gotolaraigo : langKeys.consulthistoricaldata} />
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={signOut}
                        fullWidth
                        startIcon={<PowerSettingsNewIcon color="primary" />}
                        color="primary"
                    >
                        <Trans i18nKey={langKeys.signoff} />
                    </Button>
                </div>
            </Popover>
        </div >
    );
};

export default AccountMenu;
