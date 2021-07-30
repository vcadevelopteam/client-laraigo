import React, { useState, useContext, useEffect } from 'react';

import clsx from 'clsx';

import { useHistory } from 'react-router-dom';

// import { useRouter } from 'next/router';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';

// import authContext from 'context/auth/authContext';
// import popupsContext from 'context/pop-ups/pop-upsContext';

type IProps = {
    classes: any;
    open: boolean;
    setOpen: any;
}

const Header = ({ classes, open, setOpen }: IProps) => {

    // const { user, signout, infosys } = useContext(authContext);
    // const { loading, nameHeader } = useContext(popupsContext);

    // const dispatch = useDispatch();
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
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}
        >
            <Toolbar
            >
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
                    <Typography gutterBottom variant="h5" component="h2" >
                        LARAIGO
                    </Typography>
                </div>

                <div style={{ display: 'flex' }}>
                    <Button
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        startIcon={<AccountCircle />}
                    >
                        {dataRes.user ? `${dataRes.user.firstname} ${dataRes.user.lastname}` : ''}
                    </Button>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={openprofile}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={usersetting}>Cambiar contraseña</MenuItem>
                        <MenuItem onClick={handleCloseSesion}>Cerrar Sesión</MenuItem>
                    </Menu>
                </div>

            </Toolbar>
            {/* {loading && (<LinearProgress color="secondary" />)} */}
        </AppBar>

    );
}

export default Header;