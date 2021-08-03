import React, { FC, useState } from "react";
import { Button, Menu, MenuItem, Paper } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { ArrowDropDown } from "@material-ui/icons";

const AccountMenu: FC = () => {
    const [open, setopen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ display: 'flex' }}>
            <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={<AccountCircle style={{ height: 32, width: 32 }} />}
                endIcon={<ArrowDropDown style={{ height: 24 }} />}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: 16, textAlign: 'start', fontWeight: 'normal' }}>Victor Virrueta</label>
                    <label style={{ color: '#8F92A1', fontSize: 12, textAlign: 'start', fontWeight: 'normal' }}>Admin</label>
                </div>
            </Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={(e) => {}}>Cambiar contraseña</MenuItem>
                <MenuItem onClick={(e) => {}}>Cerrar Sesión</MenuItem>
            </Menu>
        </div>
    );
};

export default AccountMenu;
