import React from 'react';
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
        content: 'url(/laraigo/Laraigo-logo-name.svg)',
        [theme.breakpoints.down('xs')]: {
            content: 'url(/laraigo/Laraigo-logo.svg)',
        },
    },
    statusConnection: {
        display: 'block',
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    }
}));

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
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div className={myClasses.statusConnection}>
                            <StatusConnection />
                        </div>
                        <AccountMenu />
                        <NotificationMenu />
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;