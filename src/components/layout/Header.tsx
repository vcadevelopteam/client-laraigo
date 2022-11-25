import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { useSelector } from 'hooks';
import { AccountMenu } from 'components';
import { IconButton, makeStyles } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { setOpenDrawer } from 'store/popus/actions';
import NotificationMenu from 'components/session/NotificationMenu';
import { StatusConnection } from 'components';
import LaraigoHelp from 'components/session/LaraigoHelp';
import { ICallGo } from '@types';

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
        },
    },
    statusConnection: {
        display: 'block',
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    }
}));

const CallBlock: React.FC<{ call: ICallGo }> = ({ call }) => {

    return (
        <div style={{ border: "1px solid #e1e1e1", borderRadius: 4, padding: "2px 6px" }}>
            {call.number}
        </div>
    )
}

const ContainerCalls: React.FC = () => {
    const calls = useSelector(state => state.voximplant.calls);
    const [callsCleaned, setCallsCleaned] = useState<ICallGo[]>([])

    useEffect(() => {
        console.log("callsxx", calls)
        setCallsCleaned(calls.filter(call => call.method === "simultaneous"));
    }, [calls])

    return (
        <div style={{ display: "flex", gap: 8, height: 20, alignItems: "center", color: "#000", marginLeft: 20, marginRight: 20 }}>
            {callsCleaned.map(call => (
                <CallBlock
                    call={call}
                />
            ))}
        </div>
    )
}

const Header = ({ classes }: IProps) => {
    const dispatch = useDispatch();
    const myClasses = useToolbarStyles();
    const openDrawer = useSelector(state => state.popus.openDrawer);

    return (
        <AppBar
            elevation={0}
            position="fixed"
            className={clsx(classes.appBar, classes.appBarShift2)}
        >
            <Toolbar className={myClasses.toolbar}>
                <IconButton onClick={() => dispatch(setOpenDrawer(!openDrawer))}>
                    <Menu />
                </IconButton>
                <img
                    style={{ height: 37, marginLeft: 8 }}
                    className={myClasses.imageLaraigo}
                    alt="logo"
                />
                {/* <div style={{ width: 73, display: openDrawer ? 'none' : 'block' }} /> */}
                <div style={{ width: '100%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <ContainerCalls />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <div className={myClasses.statusConnection}>
                                <StatusConnection />
                            </div>
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