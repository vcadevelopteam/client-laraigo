import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from './Header';
import clsx from 'clsx';
import Aside from './Aside';
import { useHistory, useLocation } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { useSelector } from 'hooks';
import { getAccessToken } from 'common/helpers';
import { CssBaseline } from '@material-ui/core';
import { routes } from 'routes/routes';
import { setOpenDrawer } from 'store/popus/actions';
import { useDispatch } from 'react-redux';

const drawerWidth = 240;

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
        width: theme.spacing(7) + 1,
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

    const location = useLocation();
	const history = useHistory();

	useEffect(() => {
		if (!getAccessToken()) {
            console.log("unauthorized");
			history.replace("/sign-in");
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

    return (
        <div className={classes.root}>
            {dataRes.user !== undefined &&
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

                        <div className={classes.mainContent}>
                            <Box component='div' className={classes.mainContentBox}>
                                {children}
                            </Box>
                        </div>

                    </main>
                </>
            }
        </div>
    );
}

export default Layout;