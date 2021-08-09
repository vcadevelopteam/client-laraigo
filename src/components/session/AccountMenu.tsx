import React, { FC } from "react";
import { Button, createStyles, makeStyles, Menu, MenuItem, Theme } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { ArrowDropDownIcon } from "icons";
import { Trans } from "react-i18next";
import { langKeys } from "lang/keys";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
        root: {
            display: 'flex',
        },
        icon: {
            height: 32,
            width: 32,
        },
        infoContainer: {
            display: 'flex',
            flexDirection: 'column',
        },
        infoUserName: {
            fontSize: 16,
            textAlign: 'start',
            lineHeight: 'normal',
        },
        infoUserRol: {
            color: '#8F92A1',
            fontSize: 12,
            textAlign: 'start',
            fontWeight: 'normal',
            lineHeight: 'normal',
        },
    }),
);

const AccountMenu: FC = () => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={<AccountCircle className={classes.icon} />}
                endIcon={<ArrowDropDownIcon />}
            >
                <div className={classes.infoContainer}>
                    <label className={classes.infoUserName}>Victor Virrueta</label>
                    <label className={classes.infoUserRol}>Admin</label>
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
                <MenuItem onClick={(e) => {}}><Trans i18nKey={langKeys.changePassword} /></MenuItem>
                <MenuItem onClick={(e) => {}}><Trans i18nKey={langKeys.signoff} /></MenuItem>
            </Menu>
        </div>
    );
};

export default AccountMenu;
