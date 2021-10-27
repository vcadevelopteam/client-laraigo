import React, { FC } from 'react'; // we need this to make JSX compile
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from './Header';
import clsx from 'clsx';
import Aside from './Aside';
import Box from '@material-ui/core/Box';
import { useSelector } from 'hooks';
import { CssBaseline } from '@material-ui/core';
import { routes } from 'routes/routes';
import Popus from 'components/layout/Popus';

const drawerWidth = 240;
const drawerWidthCompressed = 73;
const headerHeight = 54;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        background: theme.palette.secondary.light,
        minHeight: headerHeight,
        height: headerHeight,
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appBarShift2: {
        width: '100%',
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        zIndex: theme.zIndex.drawer + 3,
    },
    menuButton: {
        marginRight: 36,
    },
    
    drawer: {
        display: 'flex',
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        color: theme.palette.text.primary,
        borderColor: 'none',
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.secondary.light,
    },
    drawerLabel: {
        margin: '8px 20px;',
        fontWeight: 400,
        fontSize: 14,
        color: '#8F92A1',

        '-webkit-touch-callout': 'none', /* iOS Safari */
        '-webkit-user-select': 'none', /* Safari */
        '-khtml-user-select': 'none', /* Konqueror HTML */
        '-moz-user-select': 'none', /* Old versions of Firefox */
        '-ms-user-select': 'none', /* Internet Explorer/Edge */
        'user-select': 'none',
    },
    drawerCloseLabel: {
        fontWeight: 400,
        fontSize: 14,
        color: 'white',
        margin: '8px auto',
        opacity: .85,
    },
    hide: {
        display: 'none',
    },
    drawerOpen: {
        backgroundColor: theme.palette.secondary.light,
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        border: 'none',
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(9) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
        border: 'none',
        backgroundColor: "#7721AD",
        zIndex: 1202,
    },
    drawerItemActive: {
        color: theme.palette.primary.main,
        fill: theme.palette.primary.main,
        stroke: theme.palette.primary.main,
    },
    drawerCloseItemActive: {
        color: 'white',
        fill: 'white',
        stroke: 'white',
        opacity: 1,
    },
    drawerItemInactive: {
        stroke: "#8F92A1",
        fill: "#8F92A1",
    },
    drawerCloseItemInactive: {
        fill: 'white',
        stroke: 'white',
        opacity: .65,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1.5),
        stroke: '#8F92A1',
        fill: '#8F92A1',
        backgroundColor: 'white',
        height: headerHeight,
        minHeight: headerHeight,
        // necessary for content to be below app bar
        // ...theme.mixins.toolbar,
    },
    toolbarClosed: {
        // justifyContent: 'center',
        stroke: 'white',
        fill: 'white',
    },
    toolbar2: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
    },
    content: {
        flexGrow: 1,
        overflow: 'overlay',
        // padding: theme.spacing(3),
        // transition: theme.transitions.create('margin', {
        //     easing: theme.transitions.easing.sharp,
        //     duration: theme.transitions.duration.leavingScreen,
        // }),
        // width: `calc(100vw - ${drawerWidth}px)`,
        // marginLeft: -drawerWidth,
        backgroundColor: '#F9F9FA',
    },
    paddingbody: {
        padding: theme.spacing(2, 4),
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    title: {
        color: theme.palette.text.primary,
    },
    containerLogin: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center'
    },
    activelink: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        },
        '& svg': {
            color: `white!important`
        },
        '& span': {
            color: 'white',
            fontWeight: 'bold',
        }
    },
    contentDrawerOpen: {
        maxWidth: `calc(100vw - ${drawerWidth}px)`,
    },
    contentDrawerClosed: {
        maxWidth: `calc(100vw - ${drawerWidthCompressed}px)`,
    },
    mainContent: {
        
    },
    mainContentBox: {
        flex: 1,
        // padding: theme.spacing(2),
        display: 'flex',
        height: 'calc(100vh - 54px)',
        minHeight: 'calc(100vh - 54px)',
        maxHeight: 'calc(100vh - 54px)',
        // height: '100%'
    },
}));

interface LayoutProps {
    mainClasses?: string;
}

const Layout: FC<LayoutProps> = ({ children, mainClasses }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dataRes = useSelector(state => state.login);
    const openDrawer = useSelector(state => state.popus.openDrawer);

    return (
        <>
            <div className={classes.root}>
                {dataRes.login.user !== undefined &&
                    <>
                        <CssBaseline />
                        <Header
                            classes={classes}
                            drawerWidth={drawerWidth}
                        />
                        <Aside
                            routes={routes}
                            classes={classes}
                            theme={theme}
                            headerHeight={headerHeight}
                        />
                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            <div className={clsx(classes.mainContent,
                                openDrawer ? classes.contentDrawerOpen : classes.contentDrawerClosed)}>
                                <Box component='div' className={clsx(classes.mainContentBox, mainClasses)}>
                                    {children}
                                </Box>
                            </div>

                        </main>
                    </>
                }
            </div>
            <Popus />
        </>
    );
}

export default Layout;