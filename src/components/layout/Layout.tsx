import React, { FC, useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from './Header';
import clsx from 'clsx';
import Aside from './Aside';
import Box from '@material-ui/core/Box';
import { useSelector } from 'hooks';
import { Button, CssBaseline } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Popus from 'components/layout/Popus';
import MakeCall from 'components/inbox/MakeCall';
import { useHistory } from 'react-router-dom'; import CloseTicketVoxi from 'components/inbox/CloseTicketVoxi';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
const drawerWidth = 260;
const drawerWidthCompressed = 73;
const headerHeight = 54;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        position: "relative",
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
        //stroke: theme.palette.primary.main,
    },
    drawerCloseItemActive: {
        color: 'white',
        fill: 'white',
        stroke: 'white',
        opacity: 1,
    },
    drawerItemInactive: {
        //stroke: "#8F92A1",
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
    },
    toolbarClosed: {
        stroke: 'white',
        fill: 'white',
    },
    toolbar2: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(0, 1),
    },
    content: {
        flexGrow: 1,
        overflow: 'overlay',
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
        //padding: theme.spacing(2),
        display: 'flex',
        height: 'calc(100vh - 54px)',
        minHeight: 'calc(100vh - 54px)',
        maxHeight: 'calc(100vh - 54px)',
        //height: '100%'
    },
    ASlistItem: {
        position: 'relative',
    },
    ASlistItemTextOpen: {
        visibility: 'visible',
    },
    ASlistItemTextClosed: {
        visibility: 'hidden',
    },
    AStypographyOpen: {
        position: 'absolute',
        right: 25,
        color: '',
        fontWeight: 'normal',
    },
    AStypographyClosed: {
        position: 'absolute',
        right: 5,
        color: 'white',
        fontWeight: 'bold',
    },
}));

const useStylesDialog = makeStyles(() => ({
    title: {
        fontWeight: 500,
        fontSize: "1.3rem"
    },
    subtitle: {
        display: "flex",
        gap: 4,
        marginBottom: ".5rem"
    },
    close: {
        position: "absolute",
        right: 8,
        top: 8
    },
    alignJustify: {
        textAlign: "justify"
    },
    dialogContentWithBar: {
        position: 'relative',
        //... cualquier otro estilo que necesites
        "&::before": {
            content: '""', //Esto es necesario para crear un pseudo-elemento
            position: 'absolute',
            left: 0,
            top: "10%",
            bottom: "20%",
            width: '6px', //El grosor de la barra
            backgroundColor: '#7721ad', //El color de la barra
        },
    },
}));

interface LayoutProps {
    mainClasses?: string;
}

const WelcomeDialog = React.memo(() => {
    const classes = useStylesDialog();
    const history = useHistory();
    const { t } = useTranslation();

    const newChannels = useSelector(state => state.login.validateToken.user?.newChannels);
    const firstName = useSelector(state => state.login.validateToken.user?.firstname);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (newChannels && localStorage.getItem("firstLoad")) {
            history.push("/metachannels")
        }
    }, [])
    return (<Dialog
        open={openModal}
        fullWidth
        maxWidth={"xs"}>
        <div className={classes.dialogContentWithBar}>
            <DialogTitle style={{ position: "relative" }}>
                <IconButton
                    className={classes.close}
                    size='small'
                    onClick={() => setOpenModal(false)}
                >
                    <HighlightOffIcon

                        color='action'
                    />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div >
                    <div className={classes.title}>{t(langKeys.hello, { name: firstName })}</div>
                    <div className={classes.subtitle}>
                        <div className={classes.title}>{t(langKeys.welcome_onboarding)}</div>
                        <div className={classes.title} style={{ color: "#7721ad" }}>Laraigo</div>
                    </div>
                    <div className={classes.alignJustify}>{t(langKeys.text1_onboarding)}</div>
                    <br></br>
                    <div className={classes.alignJustify}>{t(langKeys.text2_onboarding)}</div>

                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setOpenModal(false)}
                    color='primary'
                    variant='outlined'
                >
                    {t(langKeys.continue)}
                </Button>
            </DialogActions>
        </div>
    </Dialog>)
})
WelcomeDialog.displayName = "WelcomeDialog"

const Layout: FC<LayoutProps> = ({ children, mainClasses }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dataRes = useSelector(state => state.login);
    const openDrawer = useSelector(state => state.popus.openDrawer);

    const wsConnected = useSelector(state => state.inbox.wsConnected);
    const { t } = useTranslation();

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
                            classes={classes}
                            headerHeight={headerHeight}
                        />
                        {!wsConnected &&
                            <div style={{ position: "absolute", left: "calc(50% - 150px)", opacity: .7, top: 0, padding: 10, backgroundColor: '#b41a1a', color: 'white', zIndex: 9999 }}>
                                {t(langKeys.notred)}
                            </div>
                        }
                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            <div className={clsx(classes.mainContent,
                                openDrawer ? classes.contentDrawerOpen : classes.contentDrawerClosed)}>
                                <Box component='div' className={clsx(classes.mainContentBox, mainClasses)}>
                                    {children}
                                </Box>
                            </div>

                        </main>
                        <WelcomeDialog />
                    </>
                }
            </div>
            {/* <ManageCall /> */}
            <MakeCall />
            <CloseTicketVoxi />
            <Popus />
        </>
    );
}

export default Layout;