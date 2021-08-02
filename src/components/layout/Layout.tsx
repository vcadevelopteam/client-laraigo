import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from './Header';
import clsx from 'clsx';
import Aside from './Aside';
import { useHistory, Link, useLocation } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { useSelector } from 'hooks';
import { getAccessToken } from 'common/helpers';
import { RouteConfig } from '@types';
import { CssBaseline } from '@material-ui/core';

type ParamsProps = {
    title?: React.ReactNode;
    children: any;
    paragraph: string;
    routes: RouteConfig[];
}

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
    containermainopen: {
        [theme.breakpoints.down('sm')]: {
            maxWidth: `60vw`,
        },
        [theme.breakpoints.up('sm')]: {
            maxWidth: `calc(100vw - ${drawerWidth}px - 49px)`,
        },
    },
    containermainclose: {
        [theme.breakpoints.down('sm')]: {
            maxWidth: `100vw`,
        },
        [theme.breakpoints.up('sm')]: {
            maxWidth: `calc(100vw - 49px)`,
        },
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
        margin: '10px 30px',
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
        fill: theme.palette.primary.main,
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
        padding: theme.spacing(2),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        backgroundColor: '#F9F9FA',
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    title: {
        flexGrow: 1,
        marginTop: theme.spacing(1),
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
const Layout = ({ title, paragraph, children, routes }: ParamsProps) => {
    console.log("sssss");
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
	}, [location]);

    return (
        <div className={classes.root}>
            {dataRes.user !== undefined &&
                <>
                    <CssBaseline />
                    <Header
                        title={title}
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

                        <div className='containercon'>
                            <Box
                                component='div' style={{ flex: 1 }}
                                className={clsx({
                                    [classes.containermainopen]: openDrawer,
                                    [classes.containermainclose]: !openDrawer,
                                })} >
                                {children}
                            </Box>
                            <Box component="footer" px={2} pt={1} bgcolor="white">
                                Todos los derechos reservados, Copyright © 2021
                            </Box>
                        </div>

                    </main>
                </>
            }
        </div>
    );
}

export default Layout;