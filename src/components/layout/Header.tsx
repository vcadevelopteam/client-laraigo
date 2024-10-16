import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { useSelector } from 'hooks';
import { AccountMenu } from 'components';
import { IconButton, makeStyles } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { manageConfirmation, setOpenDrawer } from 'store/popus/actions';
import NotificationMenu from 'components/session/NotificationMenu';
import { StatusConnection } from 'components';
import LaraigoHelp from 'components/session/LaraigoHelp';
import { ICallGo } from '@types';
import { GetIcon } from 'components'
import { ArrowDropDownIcon } from "icons";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { answerCall, holdCall, setHold } from 'store/voximplant/actions';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { notCustomUrl } from 'pages/dashboard/constants';
import AccountBalance from 'components/session/AccountBalance';

type IProps = {
    classes: any;
    title?: React.ReactNode;
    drawerWidth: number;
}

const useToolbarStyles = makeStyles(theme => ({
    toolbar: {
        borderBottom: '1px solid #EBEAED',
        padding: `0 24px 0 14px`,
        height: 'inherit',
        minHeight: 'inherit',
        [theme.breakpoints.down('xs')]: {
            padding: `0 4px 0 4px`,
        },
    },
    imageLaraigo: {
        content: 'url(/Laraigo-logo-name.svg)',
        [theme.breakpoints.down('xs')]: {
            content: 'url(/Laraigo-logo.svg)',
            width: 40,
            height: 40
        },
    },
    customImageLaraigo: {
        backgroundSize: "100% 100%",
        minWidth: 120
    },
    statusConnection: {
        display: 'block',
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    }
}));

const callStyles = makeStyles(theme => ({
    root: {
        borderRadius: 8,
        padding: "3px 5px",
        backgroundColor: "#ecf8a2",
        cursor: "pointer",
        fontSize: 12,
        gap: 4,
        display: "flex",
        alignItems: "center",
        lineHeight: 1,
        color: "#000",
        width: 245,
        '&:hover': {
            backgroundColor: '#dff552',
        },
    },
    callExtra: {
        borderRadius: 8,
        padding: "3px 5px",
        backgroundColor: "#ecf8a2",
        cursor: "pointer",
        fontSize: 12,
        gap: 4,
        display: "flex",
        alignItems: "center",
        height: 20,
        lineHeight: 1,
        color: "#000",
        width: 100,
        justifyContent: "space-between",
        '&:hover': {
            backgroundColor: '#dff552',
        },
    },
    containerCalls: {
        display: "flex",
        gap: 8,
        height: 20,
        alignItems: "center",
        color: "#000",
        marginLeft: 20,
        marginRight: 20,
        // maxWidth: 400
    }
}));

const CallBlock: React.FC<{ call: ICallGo }> = ({ call }) => {
    const classes = callStyles();
    const dispatch = useDispatch();
    const calls = useSelector(state => state.voximplant.calls);
    const { t } = useTranslation();

    const handlerOnClick = () => {
        const callConnected = calls.find(calltmp => calltmp.statusCall === "CONNECTED")

        if (callConnected) {

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.question_call_busy),
                callback: () => {
                    dispatch(holdCall({ call: callConnected.call, flag: false, number: callConnected.number }));
                    dispatch(setHold({ hold: true, number: callConnected.number }))

                    dispatch(answerCall({
                        call: call.call,
                        number: call.number,
                        callComplete: call,
                        method: "simultaneous"
                    }));
                }
            }))
        } else {
            dispatch(answerCall({
                call: call.call,
                number: call.number,
                callComplete: call,
                method: "simultaneous"
            }));
        }
    }

    return (
        <div
            className={classes.root}
            title="Contestar llamada"
            onClick={handlerOnClick}
        >
            <GetIcon channelType={"VOXI"} width={10} height={10} />
            <div>
                {call.number} - {(!!call.name && call.name !== call.number) ? call.name : "Número desconocido"}
            </div>
        </div>
    )
}

const ContainerCalls: React.FC = () => {
    const classes = callStyles();
    const calls = useSelector(state => state.voximplant.calls);
    const [openCallsExtra, setOpenCallsExtra] = React.useState(false);
    const [callsCleaned, setCallsCleaned] = useState<ICallGo[]>([]);
    const [callsExtra, setCallsExtra] = useState<ICallGo[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const calls1 = calls.filter(call => call.method === "simultaneous" && call.statusCall === "CONNECTING");
        const callsToShow = calls1.slice(0, 2);
        if (calls.length > 2) {
            setCallsExtra(calls1.slice(2, calls1.length))
        }
        setCallsCleaned(callsToShow);
    }, [calls])

    const handleClickAway = () => setOpenCallsExtra(false);

    if (callsCleaned.length === 0)
        return <span></span>;

    return (
        <div className={classes.containerCalls}>
            {callsCleaned.map((call, i) => (
                <CallBlock
                    key={i}
                    call={call}
                />
            ))}
            <ClickAwayListener onClickAway={handleClickAway}>
                <span style={{ position: "relative" }}>
                    {(callsExtra.length > 0) && (
                        <div
                            className={classes.callExtra}
                            onClick={() => setOpenCallsExtra(true)}
                        >
                            {callsExtra.length} {t(langKeys.type_activitylead_call)}{callsExtra.length > 1 ? "s" : ""}
                            <ArrowDropDownIcon />
                        </div>
                    )}
                    {openCallsExtra && (
                        <div style={{
                            position: 'absolute',
                            top: 20,
                            width: 300,
                            maxHeight: 400,
                            zIndex: 1201,
                            backgroundColor: 'white',
                            padding: 8,
                            gap: 4,
                            boxShadow: '0 1px 2px 0 rgb(16 35 47 / 15%)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            {callsExtra.map((call, i) => (
                                <CallBlock
                                    key={i}
                                    call={call}
                                />
                            ))}
                        </div>
                    )}
                </span>
            </ClickAwayListener>


        </div>
    )
}

const TimeConnected: React.FC = () => {
    const { t } = useTranslation();

    const lastConnection = useSelector(state => state.login.validateToken.lastConnection);

    return (
        <div style={{ fontSize: 10, position: 'absolute', bottom: 0, left: 4, color: '#898989' }}>{t(langKeys.connected_since)} {new Date(`${lastConnection}`).toLocaleTimeString()}</div>
    )
}

const Header = ({ classes }: IProps) => {
    const dispatch = useDispatch();
    const myClasses = useToolbarStyles();
    const openDrawer = useSelector(state => state.popus.openDrawer);
    const user = useSelector(state => state.login.validateToken.user);
    // const customDomain = !notCustomUrl.some(url => window.location.href.includes(url));
    
    useEffect(() => {
        // const titlestr = localStorage.getItem("title")
        // const headeiconstr = localStorage.getItem("headeicon")

        // console.log("titlestr", titlestr)
        // console.log("headeiconstr", headeiconstr)

        // const iconLink = document.querySelector('link[rel="icon"]');
        // if(!(titlestr && headeiconstr)){
        //     if(customDomain){
        //         iconLink.href  = user?.iconurl||"/favicon.ico";   
        //         const str = user?.corpdesc || "Laraigo"
        //         const title = str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase()
        //         document.title = title;
        //         localStorage.setItem('title', title);
        //         localStorage.setItem('headeicon', user?.iconurl||"/favicon.ico");
        //     }else{
        //         document.title = "Laraigo";
        //         iconLink.href = '/favicon.ico';
        //         localStorage.setItem('title', 'Laraigo');
        //         localStorage.setItem('headeicon', '/favicon.ico');
        //     }
        // }else{
        //     document.title =  titlestr
        //     iconLink.href = headeiconstr
        // }
    }, [])

    return (
        <AppBar
            elevation={0}
            position="fixed"
            className={clsx(classes.appBar, classes.appBarShift2)}
        >
            <TimeConnected />
            <Toolbar className={myClasses.toolbar}>
                <IconButton onClick={() => dispatch(setOpenDrawer(!openDrawer))}>
                    <Menu />
                </IconButton>
                <img
                    style={{ height: 37, marginLeft: 8 }}
                    src = {Boolean(user?.logourl) ? (user?.logourl||"") : undefined}
                    className={Boolean(user?.logourl) ? myClasses.customImageLaraigo:myClasses.imageLaraigo}
                    alt="logo"
                />
                {/* <div style={{ width: 73, display: openDrawer ? 'none' : 'block' }} /> */}
                <div style={{ width: '100%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, width: "100%", alignItems: "center" }}>
                        <ContainerCalls />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <div className={myClasses.statusConnection}>
                                <StatusConnection />
                            </div>
                            <AccountBalance />
                            <NotificationMenu />
                            <AccountMenu />
                            <LaraigoHelp />
                        </div>
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;