import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from './Header';
import clsx from 'clsx';
import Aside from './Aside';
import Box from '@material-ui/core/Box';
import { useSelector } from 'hooks';
import { CssBaseline } from '@material-ui/core';
import { routes } from 'routes/routes';
import Popus from 'components/layout/Popus';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useDispatch } from 'react-redux';
import { getAccessToken } from 'common/helpers';
import { useHistory, useLocation } from 'react-router-dom';
import { validateToken } from 'store/login/actions';

const drawerWidth = 240;
const drawerWidthCompressed = 73;

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
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        border: '#EBEAED solid 1px',
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
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.secondary.light,
        borderColor: '#EBEAED',
    },
    drawerLabel: {
        margin: '22px 20px;',
        fontWeight: 400,
        fontSize: 14,
    },
    drawerCloseLabel: {
        fontWeight: 400,
        fontSize: 14,
        color: 'white',
        margin: '22px auto',
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
        justifyContent: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
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
        maxWidth: `calc(100vw - 138px)`,
    },
    mainContent: {
        minHeight: 'calc(100vh - 81px)',
    },
    mainContentBox: {
        flex: 1,
        display: 'flex',
        minHeight: 'inherit',
    },
}));

interface LayoutProps {
    mainClasses?: string;
}

/** Authorized layout */
const Layout: FC<LayoutProps> = ({ children, mainClasses }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dataRes = useSelector(state => state.login);
    const dispatch = useDispatch();
    // const location = useLocation();
    const history = useHistory();
    const existToken = getAccessToken();

    const openDrawer = useSelector(state => state.popus.openDrawer);
    const resValidateToken = useSelector(state => state.login.validateToken);

    // React.useEffect(() => {
    //     if (existToken)
    //         dispatch(validateToken());
    // }, [])

    // if (!existToken) {
    //     history.push("sign-in");
    // }
    // if (resValidateToken.loading) {
    //     return (
    //         <Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={true}>
    //             <CircularProgress color="inherit" />
    //         </Backdrop>
    //     )
    // } else if (resValidateToken.error) {
    //     history.push("sign-in");
    // }

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
                        />
                        <main className={clsx(classes.content, mainClasses)}>
                            <div className={classes.toolbar} />
                            <div className={clsx(classes.mainContent,
                                openDrawer ? classes.contentDrawerOpen : classes.contentDrawerClosed)}>
                                <Box component='div' className={classes.mainContentBox}>
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