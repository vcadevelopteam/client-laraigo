import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
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
import { IApplicationsRecord, RouteConfig, ViewsClassificationConfig } from '@types';
import { setModalCall } from 'store/voximplant/actions';
import { langKeys } from 'lang/keys';
import { WifiCalling } from 'icons';
import { showSnackbar } from 'store/popus/actions';
import { viewsClassifications, routes } from 'routes/routes';
import { History } from 'history';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

type IProps = {
    classes: ClassNameMap;
    headerHeight: number;
}

type ILinkList = {
    config: ViewsClassificationConfig,
    classes: ClassNameMap,
    open: boolean,
    history: History
}

const MOBILE_BREAKPOINT = 600;
const TABLET_BREAKPOINT = 900;

const getColumnCount = (numElements: number, screenWidth: number): number => {
    if (screenWidth < MOBILE_BREAKPOINT) return 2;
    if (screenWidth < TABLET_BREAKPOINT) return numElements <= 3 || numElements === 6 ? numElements : 2;
    return numElements === 1 ? 1 : numElements <= 6 ? 3 : 4;
};
const useScreenSize = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize(); // Establecer el ancho inicial

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenWidth;
};

const ListViewItem: React.FC<{ navRoute: RouteConfig, classes: ClassNameMap, history: History }> = ({ navRoute, classes, history }) => {
    const [classname, setClassname] = useState<string>(classes.drawerItemInactive);
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!navRoute.subroute) {
            history.push(`${navRoute.path}`)
        } else {
            if (navRoute.initialSubroute) {
                history.push(navRoute.initialSubroute);
            } else {
                const message = `initialSubroute debe tener valor para la subruta key:${navRoute.key} path:${navRoute.path}`;
                console.assert(navRoute.initialSubroute !== null || navRoute.initialSubroute !== undefined, message);
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

const PopperContent: React.FC<{ classes: ClassNameMap, config: ViewsClassificationConfig, history: History }> = ({ classes, config, history }) => {
    const screenWidth = useScreenSize();

    const navigationRoutes = useMemo(() => config.options.map((option: string) => routes.find(route => route?.key === option || route?.path === option)).filter((x: RouteConfig) => x), [config.options]);

    const columnCount = useMemo(() => getColumnCount(navigationRoutes.length, screenWidth), [navigationRoutes.length, screenWidth]);

    return (
        <div>
            <Typography variant="h6" className={classes.drawerItemActive} style={{ paddingTop: 10, textAlign: 'start', paddingLeft: 23, backgroundColor: '#F9F9FA' }}>
                {config.description}
            </Typography>
            <Box display="grid" style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }} bgcolor={'#F9F9FA'} paddingBottom={1}>
                {navigationRoutes.map((navRoute: RouteConfig, index: number) =>
                    <ListViewItem
                        key={navRoute?.key ?? `item-${index}`}
                        navRoute={navRoute}
                        history={history}
                        classes={classes}
                    />
                )}
            </Box>
        </div>
    );
};

const getActiveClass = (classes: ClassNameMap, isOpen: boolean, open: boolean) => isOpen
    ? open ? classes.drawerItemActive : classes.drawerCloseItemActive
    : open ? classes.drawerItemInactive : classes.drawerCloseItemInactive;

const LinkList = React.memo(({ config, classes, open, history }: ILinkList) => {
    const popupState = usePopupState({ variant: 'popover', popupId: 'demoPopper' });

    const activeClass = getActiveClass(classes, popupState.isOpen, open);
    const listItemClasses = clsx(classes.ASlistItem, activeClass);
    const listItemTextClasses = clsx({
        [classes.ASlistItemTextOpen]: open,
        [classes.ASlistItemTextClosed]: !open,
    });
    const typographyClasses = clsx({
        [classes.AStypographyOpen]: open,
        [classes.AStypographyClosed]: !open,
    });

    return (
        <div {...bindHover(popupState)} >
            <ListItem
                button
                key={config.key}
                className={listItemClasses}
            >
                <ListItemIcon>{config.icon?.(activeClass)}</ListItemIcon>
                <ListItemText
                    primary={config.description}
                    className={listItemTextClasses}
                />
                <Typography
                    variant='h5'
                    className={typographyClasses}
                >
                    {">"}
                </Typography>
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
    );
});

LinkList.displayName = "LinkList"

const Aside = ({ classes, headerHeight }: IProps) => {
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
    const userData = useSelector(state => state.login.validateToken.user);
    const [showViews, setShowViews] = useState<ViewsClassificationConfig[]>([])

    useEffect(() => {
        setShowViews(
            viewsClassifications.reduce((acc: ViewsClassificationConfig[], view) => {
                const subroutes = Object.entries(applications as IApplicationsRecord)
                    .filter(([_, values]) => values[5] === view.key.toUpperCase())
                    .map(([route, values]) => ({ route, menuorder: values[6] }))
                    .sort((a, b) => a.menuorder - b.menuorder)
                    .map(entry => entry.route);
                const roles = userData?.roledesc?.split(",") ?? [];
                if (subroutes.length > 0) {
                    if (subroutes.includes('/invoice')) {
                        if (roles.includes('SUPERADMIN')  || roles?.includes('ADMINISTRADOR')) {
                            const filteredSubroutes = ['/invoice', '/billing_setups', '/timesheet'];
                            acc.push({ ...view, options: filteredSubroutes });
                        }
                        if ( roles.includes("ADMINISTRADOR SOCIO")) {
                            const filteredSubroutes = ['/invoice'];
                            acc.push({ ...view, options: filteredSubroutes });
                        }
                        //  else if (roles.includes('ADMINISTRADOR') || roles.includes('SUPERVISOR')) {
                        //     const filteredSubroutes = ['/invoice']
                        //     acc.push({ ...view, options: filteredSubroutes });
                        // }
                    } else {
                        acc.push({ ...view, options: subroutes });
                    }
                }
                return acc;
            }, [])
        )
    }, [])

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
                {showViews.map((route: ViewsClassificationConfig) =>
                    <LinkList
                        classes={classes}
                        config={route}
                        history={history}
                        key={route.key + '_upper'}
                        open={openDrawer}
                    />
                )}
                {(!voxiConnection.error && !voxiConnection.loading && !openDrawer && location.pathname === "/message_inbox" && userConnected) && (
                    <ListItem
                        button
                        key={"phone-agent"}
                        className={clsx(classes.drawerItemActive)}
                        component="div"
                    >
                        <Tooltip title={t(langKeys.phone)}>
                            <ListItemIcon
                                onClick={() => dispatch(setModalCall(true))}
                            >
                                <PhoneInTalkIcon style={{ width: 22, height: 22, stroke: 'none' }} className={classes.drawerCloseItemInactive} />
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