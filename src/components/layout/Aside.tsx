import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';

import { RouteConfig } from '@types';
import { IconButton, Tooltip, Typography } from '@material-ui/core';
import { FC } from 'react';
import { setModalCall } from 'store/voximplant/actions';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import { langKeys } from 'lang/keys';
import { WifiCalling } from 'icons';
import { showSnackbar } from 'store/popus/actions';
import paths from "common/constants/paths";
import { viewsClassifications } from 'routes/routes';

type IProps = {
    classes: any;
    theme: any;
    routes: RouteConfig[];
    headerHeight: number;
}

const checkSubRoutes = (pathname: string) => {
    if (pathname.includes(paths.ORGANIZATIONS)) return true;
    if (pathname.includes(paths.CORPORATIONS)) return true;
    if (pathname.includes(paths.DOMAINS)) return true;
    if (pathname.includes(paths.EMOJIS)) return true;
    if (pathname.includes(paths.INAPPROPRIATEWORDS)) return true;
    if (pathname.includes(paths.USERS)) return true;
    if (pathname.includes(paths.INTEGRATIONMANAGER)) return true;
    if (pathname.includes(paths.QUICKREPLIES)) return true;
    if (pathname.includes(paths.SLA)) return true;
    if (pathname.includes(paths.TIPIFICATIONS)) return true;
    if (pathname.includes(paths.INPUTVALIDATION)) return true;
    if (pathname.includes(paths.WHITELIST)) return true;
    if (pathname.includes(paths.EXTRASLOCATION)) return true;
    if (pathname.includes(paths.SECURITYRULES)) return true;
    if (pathname.includes(paths.PROPERTIES)) return true;

    return false;
}

const LinkList: FC<{ config: RouteConfig, classes: any, open: boolean }> = ({ config, classes, open }) => {
    const history = useHistory();

    if (!config.path) {
        return <Typography className={open ? classes.drawerLabel : classes.drawerCloseLabel}>{config.description}</Typography>;
    }

    const isSelected =
        !config.subroute
            ? config.path === history.location.pathname
            : history.location.pathname.includes(config.path) || checkSubRoutes(history.location.pathname);

    let className = "";
    if (isSelected) {

        className = open ? classes.drawerItemActive : classes.drawerCloseItemActive;
    } else {
        className = open ? classes.drawerItemInactive : classes.drawerCloseItemInactive;
    }

    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!config.subroute) {
            history.push(config.path!)
        } else {
            if (config.initialSubroute) {
                history.push(config.initialSubroute);
            } else {
                const message = `initialSubroute debe tener valor para la subruta key:${config.key} path:${config.path}`;
                console.assert(config.initialSubroute != null || config.initialSubroute !== undefined, message);
            }
        }
    }

    return (
        <ListItem
            button
            key={config.path}
            onClick={onClick}
            className={clsx(className)}
            component="a"
            href={config.path}
        >
            <Tooltip title={config.tooltip}>
                <ListItemIcon>{config.icon?.(className)}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={config.description} style={{ visibility: open ? 'visible' : 'hidden' }} />
        </ListItem>
    );
};

const Aside = ({ classes, theme, routes, headerHeight }: IProps) => {
    const { t } = useTranslation();
    const openDrawer = useSelector(state => state.popus.openDrawer);
    const applications = useSelector(state => state.login?.validateToken?.user?.menu);
    const dispatch = useDispatch();
    const showcall = useSelector(state => state.voximplant.showcall);
    const calls = useSelector(state => state.voximplant.calls);
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const location = useLocation();
    const userConnected = useSelector(state => state.inbox.userConnected);
    console.log(applications)
    console.log(viewsClassifications)
    return (
        <Drawer
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: openDrawer,
                [classes.drawerClose]: !openDrawer,
            })}
            variant="permanent"
            anchor="left"
            open={openDrawer}
            style={{}}
            classes={{
                paper: clsx("scroll-style-go", {
                    [classes.drawerOpen]: openDrawer,
                    [classes.drawerClose]: !openDrawer,
                }),
            }}
        >
            <div style={{ overflowX: 'hidden', borderRight: '1px solid #EBEAED', marginTop: headerHeight }}>
                {routes.map((ele) => (applications && applications[ele.key] && applications[ele.key][0]) ? <LinkList classes={classes} config={ele} key={ele.key} open={openDrawer} /> : null)}
                {(!voxiConnection.error && !voxiConnection.loading && !openDrawer && location.pathname === "/message_inbox" && userConnected) && (
                    <ListItem
                        button
                        key={"phone-agent"}
                        onClick={() => {
                            // abrir el modal
                        }}
                        className={clsx(true ? classes.drawerItemActive : classes.drawerItemInactive)}
                        component="div"
                    >
                        <Tooltip title={"Teléfono"}>
                            <ListItemIcon
                                onClick={() => dispatch(setModalCall(true))}
                            >
                                <PhoneInTalkIcon style={{ width: 22, height: 22, stroke: 'none' }} className={false ? classes.drawerCloseItemActive : classes.drawerCloseItemInactive} />
                            </ListItemIcon>
                        </Tooltip>
                    </ListItem>
                )}
            </div>
            {(!voxiConnection.loading && openDrawer && location.pathname === "/message_inbox" && userConnected) && (
                <>
                    <div style={{ display: "flex", width: "100%", borderRight: '1px solid #EBEAED' }}>
                        <IconButton
                            style={{ marginLeft: "auto", marginTop: 40, marginRight: "auto", width: 80, height: 80, borderRadius: "50%", backgroundColor: showcall ? "#7721ad" : "#bdbdbd" }}
                            onClick={() => voxiConnection.error ? dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.nochannelvoiceassociated) })) : dispatch(setModalCall(true))}
                            disabled={calls.some(call => call.statusCall === "CONNECTED")}
                        >
                            <WifiCalling style={{ color: "white", width: "80px", height: "80px" }} />
                            <Typography gutterBottom variant="h6" component="div">
                            </Typography>
                        </IconButton>
                    </div>
                    <div style={{ textAlign: "center", cursor: "pointer", borderRight: '1px solid #EBEAED', marginTop: 16, marginBottom: 10, fontSize: 14 }} onClick={() => { dispatch(setModalCall(true)) }}>
                        {t(langKeys.phone)}
                    </div>
                </>
            )}

            <Divider />
            <div style={{ flexGrow: 1, borderRight: '1px solid #EBEAED' }} />
        </Drawer>
    );
};

export default Aside;