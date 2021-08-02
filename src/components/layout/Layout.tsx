import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from './Header';
import clsx from 'clsx';
import Aside from './Aside';
import { useHistory, Link, useLocation } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { useSelector } from 'hooks';
import { getAccessToken } from 'common/helpers';
import { createTheme, ThemeProvider } from '@material-ui/core';

type ParamsProps = {
    title: string;
    children: any;
    paragraph: string;
}

const drawerWidth = 240;

const theme = createTheme({
    overrides: {
        MuiSvgIcon: {
            colorPrimary: {
                color: "white",
            },
            colorSecondary: {
                color: "white",
            },
        }
    }
});

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
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
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
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.secondary.light,
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
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
        marginTop: theme.spacing(1)
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
const Layout = ({ title, paragraph, children }: ParamsProps) => {

    const theme = useTheme();
    const classes = useStyles(theme);
    const dataRes = useSelector(state => state.login);
    const [openDrawer, setOpenDrawer] = useState(true);

    const location = useLocation();
	const history = useHistory();

	useEffect(() => {
		if (!getAccessToken()) {
            console.log("unauthorized");
			// history.replace("/sign-in");
		}
	}, [location]);

    return (
        <ThemeProvider theme={theme}>
        <div className={classes.root}>
            {dataRes.user !== undefined &&
                <>
                    <Header
                        classes={classes}
                        open={openDrawer}
                        setOpen={setOpenDrawer}
                    />

                    <Aside
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
        </ThemeProvider>
    )
}

export default Layout;