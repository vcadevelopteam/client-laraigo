import clsx from 'clsx';
import { FC, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { IconButton, Tooltip, Typography, Box } from '@material-ui/core';
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
import { InvoiceIcon, WifiCalling } from 'icons';
import { showSnackbar } from 'store/popus/actions';
import { viewsClassifications, routes } from 'routes/routes';
import { History } from 'history';

type IProps = {
    classes: any;
    theme: any;
    routes: RouteConfig[];
    headerHeight: number;
}

const ListViewItem: React.FC<{ navRoute: RouteConfig, classes: any, history: History }> = ({ navRoute, classes, history }) => {
    const [classname, setClassname] = useState<string>(classes.drawerItemInactive);
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!navRoute.subroute) {
            history.push(navRoute.path!)
        } else {
            if (navRoute.initialSubroute) {
                history.push(navRoute.initialSubroute);
            } else {
                const message = `initialSubroute debe tener valor para la subruta key:${navRoute.key} path:${navRoute.path}`;
                console.assert(navRoute.initialSubroute != null || navRoute.initialSubroute !== undefined, message);
            }
        }
    }

    return <ListItem
        button
        key={navRoute?.key}
        onClick={onClick}
        component="a"
        onMouseOver={() => { setClassname(classes.drawerItemActive) }}
        onMouseOut={() => { setClassname(classes.drawerItemInactive) }}
        href={navRoute?.path}
    >
        <ListItemIcon>{navRoute?.icon?.(classname)}</ListItemIcon>
        <ListItemText className={classname} primary={navRoute?.description} />
    </ListItem>
}

const PopperContent: React.FC<{ classes: any, config: ViewsClassificationConfig, history: History }> = ({ classes, config, history }) => {
    const navigationRoutes = config.options.map(
        (option: string) => {
            if (option === '/channels') return routes.find(route => route?.key === option);
            return routes.find(route => route?.path === option);
        });

    const numElements = navigationRoutes.length;

    const getColumnCount = () => {
        const screenWidth = window.innerWidth;
        let numColumns = 4; // Default number of columns for larger screens

        if (screenWidth < 600) {
            // For screens smaller than 600px (mobile devices), show 2 columns
            numColumns = 2;
        } else if (screenWidth < 900) {
            if (numElements === 1) { return numColumns = 1 };
            if (numElements === 3) { return numColumns = 3 };
            if (numElements <= 6 || numElements === 2) { return numColumns = 2 };
            numColumns = 3;
        } else if (numElements === 1) {
            numColumns = 1;
        } else if (numElements === 2) {
            numColumns = 2;
        }
        else if (numElements <= 6) {
            // For screens larger than 900px, show 3 columns for 1-6 elements
            numColumns = 3;
        } else {
            // For screens larger than 900px and more than 6 elements, show 4 columns
            numColumns = 4;
        }

        return numColumns;
    };
    const columnCount = getColumnCount();
    const gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
    return (
        <div>
            <Typography variant="h6" className={classes.drawerItemActive} style={{ paddingTop: 10, textAlign: 'start', paddingLeft: 23, backgroundColor: '#F9F9FA' }}>
                {config.description}
            </Typography>
            <Box display="grid" gridTemplateColumns={gridTemplateColumns} bgcolor={'#F9F9FA'} paddingBottom={1} >
                {navigationRoutes.map((navRoute: RouteConfig) =>
                    <ListViewItem
                        key={navRoute?.key + '_lower'}
                        navRoute={navRoute}
                        history={history}
                        classes={classes}
                    />)
                }
            </Box>
        </div>
    );
};

const LinkList: FC<{ config: ViewsClassificationConfig, classes: any, open: boolean, history: History }> = ({ config, classes, open, history }) => {
    const [linkListStyle, setlinkListStyle] = useState<string>(classes.drawerItemInactive);
    const popupState = usePopupState({ variant: 'popover', popupId: 'demoPopper' });
    const userRole = useSelector(state => state.login?.validateToken?.user)?.roledesc;
    let className = "";
    useEffect(() => {
        if (open) {
            setlinkListStyle(classes.drawerItemInactive)
        } else {
            setlinkListStyle(classes.drawerCloseItemInactive)
        }
    }, [classes.drawerCloseItemInactive, classes.drawerItemInactive, open])

    const onClick = (e: React.MouseEvent<HTMLAnchorElement>, invoiceRoute: string) => {
        e.preventDefault();
        const navRoute = routes.find(route => route?.path === invoiceRoute) as RouteConfig;
        if (!navRoute.subroute) {
            history.push(navRoute.path!)
        } else {
            if (navRoute.initialSubroute) {
                history.push(navRoute.initialSubroute);
            } else {
                const message = `initialSubroute debe tener valor para la subruta key:${navRoute.key} path:${navRoute.path}`;
                console.assert(navRoute.initialSubroute != null || navRoute.initialSubroute !== undefined, message);
            }
        }
    }
    if (popupState.isOpen) {
        className = open ? classes.drawerItemActive : classes.drawerCloseItemActive;
    } else {
        className = open ? classes.drawerItemInactive : classes.drawerCloseItemInactive;
    }

    return (
        <>
            {
                (userRole?.includes('ADMINISTRADOR') || userRole?.includes('SUPERVISOR')) && config.key === 'invoice'
                    ?
                    <ListItem
                        button
                        key={config.key}
                        className={clsx(linkListStyle)}
                        component="a"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => onClick(e, config.options[0])}
                        style={{ position: 'relative' }}
                        onMouseEnter={() => { setlinkListStyle(open ? classes.drawerItemActive : classes.drawerCloseItemActive) }}
                        onMouseLeave={() => { setlinkListStyle(open ? classes.drawerItemInactive : classes.drawerCloseItemInactive) }}
                    >
                        <ListItemIcon>{config.icon?.(linkListStyle)}</ListItemIcon>
                        <ListItemText primary={config.description} style={{ visibility: open ? 'visible' : 'hidden' }} />
                    </ListItem>
                    :
                    <div {...bindHover(popupState)} >
                        <ListItem
                            button
                            key={config.key}
                            className={clsx(className)}
                            style={{ position: 'relative' }}
                        >
                            <ListItemIcon>{config.icon?.(className)}</ListItemIcon>
                            <ListItemText primary={config.description} style={{ visibility: open ? 'visible' : 'hidden' }} />
                            <Typography variant='h5' style={{ position: 'absolute', right: open ? 25 : 5, color: open ? '' : 'white', fontWeight: open ? 'normal' : 'bold' }}>{">"}</Typography>
                        </ListItem>
                        <HoverPopover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transitionDuration={0.0}

                        >
                            <PopperContent
                                classes={classes}
                                history={history}
                                config={config} />
                        </HoverPopover>
                    </div>
            }
        </ >
    );
};

const Aside = ({ classes, theme, routes, headerHeight }: IProps) => {
    const { t } = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();
    const openDrawer = useSelector(state => state.popus.openDrawer);
    const applications = useSelector(state => state.login?.validateToken?.user?.menu);
    const showcall = useSelector(state => state.voximplant.showcall);
    const calls = useSelector(state => state.voximplant.calls);
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const userConnected = useSelector(state => state.inbox.userConnected);
    const userData = useSelector(state => state.login?.validateToken?.user);
    //Conseguir todas las subrutas y asignarlas a los modulos padres
    const showableViews = viewsClassifications.reduce((acc: any[], view) => {
        const subroutes = Object.entries(applications as Object)
            .filter(([_, values]) => values[4] === view.id) //  
            .map(([route, values]) => ({ route, menuorder: values[6] }))
            .sort((a, b) => a.menuorder - b.menuorder)
            .map(entry => entry.route);
        if (subroutes.length > 0) {
            acc.push({ ...view, options: subroutes });
            if (subroutes.includes('/invoice')) {
                if (userData?.roledesc.includes('SUPERADMIN')) {
                    const filteredSubroutes = ['/invoice', '/billing_setups', '/timesheet'];
                    acc.push({ ...view, id: 8, key: 'invoice', options: filteredSubroutes, description: t(langKeys.invoice), icon: (className: string) => <InvoiceIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />, });

                    acc[acc.length - 2].options.splice(acc[acc.length - 2].options.indexOf('/invoice'), 1);
                    acc[acc.length - 2].options.splice(acc[acc.length - 2].options.indexOf('/billing_setups'), 1);
                    acc[acc.length - 2].options.splice(acc[acc.length - 2].options.indexOf('/timesheet'), 1);
                } else if (userData?.roledesc.includes('ADMINISTRADOR') || userData?.roledesc.includes('SUPERVISOR')) {
                    const filteredSubroutes = ['/invoice']
                    acc.push({ ...view, id: 8, key: 'invoice', options: filteredSubroutes, description: t(langKeys.invoice), icon: (className: string) => <InvoiceIcon style={{ width: 22, height: 22, stroke: 'none' }} className={className} />, });
                    acc[acc.length - 2].options.splice(acc[acc.length - 2].options.indexOf('/invoice'), 1);
                }
            }
        }
        return acc;
    }, []);
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
                {showableViews.map((route: any) =>
                    (applications) ?
                        <LinkList
                            classes={classes}
                            config={route}
                            history={history}
                            key={route.key + '_upper'}
                            open={openDrawer}
                        /> : null)}
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