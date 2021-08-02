import React, { useState } from 'react';

import clsx from 'clsx';

import { useHistory } from 'react-router-dom';

import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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


    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();
    const openprofile = Boolean(anchorEl);

    const handleMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleCloseSesion = () => {
        setAnchorEl(null);
        // signout()
    };
    const usersetting = () => {
        history.push(`/usersettings/`)
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
                    <MenuIcon color="secondary" />
                </IconButton>
                <div className={classes.title} style={{ display: 'block', textAlign: 'center' }}>
                    {title}
                </div>
                <StatusConnection />
                <NotificationMenu />
                <AccountMenu />
            </Toolbar>
        </AppBar>

    );
}

export default Header;