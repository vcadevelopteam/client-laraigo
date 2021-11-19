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
    },
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
                    src="/Laraigo-logo-name.svg"
                    style={{ height: 37 }}
                    alt="logo"
                />
                <div style={{ width: 73, display: openDrawer ? 'none' : 'block' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <NotificationMenu />
                        <AccountMenu />
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;