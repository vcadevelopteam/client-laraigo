import React, { useState } from 'react';

import clsx from 'clsx';

import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { useSelector } from 'hooks';
import { SearchField, StatusConnection, AccountMenu, NotificationMenu } from 'components';

type IProps = {
    classes: any;
    open: boolean;
    setOpen: any;
    title?: React.ReactNode;
}

const Header = ({ classes, open, setOpen }: IProps) => {
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
                        alt="logo"
                        style={{ height: 37 }}
                        onClick={handleDrawerOpen}
                    />
                </IconButton>

                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    <div className={classes.title} style={{ width: '400px' }}>
                        <SearchField
                            colorPlaceHolder='#F9F9FA'
                        />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <StatusConnection />
                        <div style={{ width: 22 }} />
                        <NotificationMenu />
                        <div style={{ width: 24 }} />
                        <AccountMenu />
                    </div>
                </div>
            </Toolbar>
        </AppBar>

    );
}

export default Header;