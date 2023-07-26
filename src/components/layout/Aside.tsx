import clsx from 'clsx';
import { FC, useState } from 'react';
import {
    // useHistory, 
    useLocation
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { IconButton, Paper, Tooltip, Typography, Box } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { usePopupState, bindHover, bindPopover } from 'material-ui-popup-state/hooks'

import { RouteConfig, ViewsClassificationConfig } from '@types';
import { setModalCall } from 'store/voximplant/actions';
import { langKeys } from 'lang/keys';
import { WifiCalling } from 'icons';
import { showSnackbar } from 'store/popus/actions';
import { viewsClassifications, routes, subroutes } from 'routes/routes';

type IProps = {
    classes: any;
    theme: any;
    routes: RouteConfig[];
    headerHeight: number;
}

const ListViewItem: React.FC<{ navRoute: any, clickToNavigate: any, classes: any }> =
    ({ navRoute, clickToNavigate, classes }) => {

        const [classname, setClassname] = useState<String>(classes.drawerItemInactive);
        return <ListItem
            button
            key={navRoute?.key}
            onClick={() => clickToNavigate(navRoute?.path || navRoute?.key)}
            component="a"
            onMouseOver={() => { setClassname(classes.drawerItemActive) }}
            onMouseOut={() => { setClassname(classes.drawerItemInactive) }}
            href={navRoute?.path}
        >
            <Tooltip title={navRoute?.tooltip}>
                <ListItemIcon>{navRoute?.icon?.(classname)}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={navRoute?.description} />
        </ListItem>
    }
const PopperContent: React.FC<{ classes: any, config: ViewsClassificationConfig }> =
    ({ classes, config }) => {
        const applications = useSelector(state => state.login?.validateToken?.user?.menu);



        const clickToNavigate = (path: string) => {
            // if (!config.subroute) {
            //     history.push(config.path!)
            // } else {
            //     if (config.initialSubroute) {
            //         history.push(config.initialSubroute);
            //     } else {
            //         const message = `initialSubroute debe tener valor para la subruta key:${config.key} path:${config.path}`;
            //         console.assert(config.initialSubroute != null || config.initialSubroute !== undefined, message);
            //     }
            // }
            console.log(path);
        }
        const navigationRoutes = config.options.map(
            (option: string) =>
                routes.find(route => route?.path === option)
                || subroutes.find(route => route?.path === option));
        // console.log(navigationRoutes);
        const filteredNavigationRoutes = navigationRoutes.filter((route: any) => (route !== undefined && applications?.[route.key]?.[0]));
        const numElements = filteredNavigationRoutes.length;

        // const getColumnCount = () => {
        //     return Math.min(4, Math.max(2, numElements));
        // };
        const getColumnCount = () => {
            if (numElements === 1) {
              return 1; // 1 column for 1 element
            } else if (numElements === 2) {
              return 2; // 2 columns for 2 elements
            } else if (numElements <= 6) {
              return 3; // 3 columns for 3, 4, 5, or 6 elements
            } else {
              return 4; // 4 columns for 7 or more elements
            }
          };
        const columnCount = getColumnCount();
        const gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
        // console.log(filteredNavigationRoutes);
        return (
            <div title={config.key}>
                <Typography variant="h6" className={classes.drawerItemActive} style={{ paddingTop: 10, textAlign: 'start', paddingLeft: 23, backgroundColor: '#F9F9FA' }}>
                    {config.description}
                </Typography>
                <Box display="grid" gridTemplateColumns={gridTemplateColumns} bgcolor={'#F9F9FA'} paddingBottom={1} >
                    {
                        filteredNavigationRoutes.map((navRoute: RouteConfig) =>
                            <ListViewItem
                                key={navRoute.key + '_lower'}
                                navRoute={navRoute}
                                clickToNavigate={clickToNavigate}
                                classes={classes}
                            />)
                    }
                </Box>
            </div>

        );
    };

const LinkList: FC<{ config: ViewsClassificationConfig, classes: any, open: boolean }> = ({ config, classes, open }) => {
    // const history = useHistory();
    const popupState = usePopupState({ variant: 'popover', popupId: 'demoPopper' });
    // if (!config.path) {
    //     return <Typography className={open ? classes.drawerLabel : classes.drawerCloseLabel}>{config.description}</Typography>;
    // }
    console.log(popupState);
    // const isSelected = config.options?.some((option: string) => option === history.location.pathname);

    let className = "";
    if (popupState.isOpen) {

        className = open ? classes.drawerItemActive : classes.drawerCloseItemActive;
    } else {
        className = open ? classes.drawerItemInactive : classes.drawerCloseItemInactive;
    }


    return (
        <div {...bindHover(popupState)}>
            <ListItem
                button
                key={config.key}
                // onClick={onClick}

                className={clsx(className)}
                component="a"
                style={{ position: 'relative' }}
            // href={config.path}
            >
                <Tooltip title={config.tooltip}>
                    <ListItemIcon>{config.icon?.(className)}</ListItemIcon>
                </Tooltip>
                <ListItemText primary={config.description} style={{ visibility: open ? 'visible' : 'hidden' }} />
                <Typography variant='h5' style={{ position: 'absolute', right: open ? 25 : 5, backgroundColor: '', fontWeight: open ? 'normal' : 'bold' }}>{">"}</Typography>
            </ListItem>
            <HoverPopover
                {...bindPopover(popupState)}
                className={classes.drawerItemActive}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <PopperContent
                    classes={classes}
                    config={config} />
            </HoverPopover>

        </div >
    );
};

const Aside = ({ classes, theme, routes, headerHeight }: IProps) => {
    const { t } = useTranslation();
    const openDrawer = useSelector(state => state.popus.openDrawer);
    const applications = useSelector(state => state.login?.validateToken?.user?.menu);
    console.log(applications)
    const dispatch = useDispatch();
    const showcall = useSelector(state => state.voximplant.showcall);
    const calls = useSelector(state => state.voximplant.calls);
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const location = useLocation();
    const userConnected = useSelector(state => state.inbox.userConnected);
    const showableViews = viewsClassifications.reduce((acc: any, x: any) => {
        let findPermit = x.options.find((key: any) => applications?.[key] && (applications?.[key]?.[0]))
        if (findPermit) {
            return [...acc, x]
        } else {
            return acc;
        }
    }, [])
    // console.log(applications);
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
                {/* {routes.map((ele) => (applications && applications[ele.key] && applications[ele.key][0]) ? <LinkList classes={classes} config={ele} key={ele.key} open={openDrawer} /> : null)} */}
                {showableViews.map((route: any) => (applications) ? <LinkList classes={classes} config={route} key={route.key + '_upper'} open={openDrawer} /> : null)}
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