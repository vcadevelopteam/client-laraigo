import React, { FC, useState } from "react";
import { Button, Menu, MenuItem, Paper } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

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
                startIcon={<AccountCircle />}
            >
                FF
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
