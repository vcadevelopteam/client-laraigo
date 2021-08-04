import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from './Header';
import clsx from 'clsx';
import Aside from './Aside';
import { useHistory, useLocation } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { useSelector } from 'hooks';
import { getAccessToken } from 'common/helpers';
import { RouteConfig } from '@types';
import { CssBaseline } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        // zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        background: theme.palette.secondary.light,
        minHeight: 73,
        height: 73,
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
        color: theme.palette.text.primary,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.secondary.light,
        borderColor: '#EBEAED',
    },
    drawerLabel: {
        margin: '22px 21px;',
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
        backgroundColor: theme.palette.secondary.light,
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    drawerItemActive: {
        color: theme.palette.primary.main,
        // fill: theme.palette.primary.main,
        stroke: theme.palette.primary.main,
    },
    drawerItemInactive: {
        color: "#8F92A1",
        stroke: "#8F92A1",
        // fill: "#8F92A1",
    },
    toolbar: {
        minHeight: 73,
        height: 73,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        // ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: `calc(100vw - ${drawerWidth}px)`,
        marginLeft: -drawerWidth,
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
    }
}));

/** Authorized layout */
const Layout: FC<{ routes: RouteConfig[] }> = ({ children, routes }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dataRes = useSelector(state => state.login);
    const [openDrawer, setOpenDrawer] = useState(true);

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
                        open={openDrawer}
                        setOpen={setOpenDrawer}
                    />

                    <Aside
                        routes={routes}
                        open={openDrawer}
                        setOpen={setOpenDrawer}
                        classes={classes}
                        theme={theme}
                    />

                    <main className={clsx(classes.content, {
                        [classes.contentShift]: openDrawer,
                    })}>
                        <div className={classes.toolbar} />

                        <div className={`containercon ${classes.paddingbody}`}>
                            <Box
                                component='div' style={{ flex: 1 }}
                                // className={clsx({
                                //     [classes.containermainopen]: openDrawer,
                                //     [classes.containermainclose]: !openDrawer,
                                // })} 
                                >
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