import React, { useState } from 'react';

import clsx from 'clsx';

import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

import IconButton from '@material-ui/core/IconButton';
import { useSelector } from 'hooks';
import { StatusConnection } from 'components';
import { AccountMenu, NotificationMenu } from 'components';

type IProps = {
    classes: any;
    open: boolean;
    setOpen: any;
    title?: React.ReactNode;
}

const Header = ({ classes, open, setOpen, title }: IProps) => {
    const dataRes = useSelector(state => state.login);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    return (
        <AppBar
            elevation={0}
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, open && classes.hide)}
                >
                    <img 
                        src="./Laraigo-logo.svg"
                        style={{ height: 37 }}
                        onClick={handleDrawerOpen}
                    />
                </IconButton>
                <div className={classes.title} style={{ display: 'block', textAlign: 'center' }}>
                    {title}
                </div>
                <StatusConnection />
                <div style={{ width: 22 }} />
                <NotificationMenu />
                <div style={{ width: 24 }} />
                <AccountMenu />
            </Toolbar>
        </AppBar>

    );
}

export default Header;