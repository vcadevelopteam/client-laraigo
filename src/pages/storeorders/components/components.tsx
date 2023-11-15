import React from 'react'
import { Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, Menu, MenuItem, makeStyles } from '@material-ui/core';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

const useStyles = makeStyles(() => ({
    button: {
        display: 'flex', 
        gap: '10px', 
        alignItems: 'center', 
    },
}));

interface TemplateIconsProps {
    delivered?: (param: boolean) => void;
    undelivered?: (param: boolean) => void;
}

export const ExtrasMenu: React.FC<TemplateIconsProps> = ({ delivered, undelivered }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClickTyping = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget as HTMLElement);
        e.stopPropagation();
    };
    const handleMenuItemDelivered = () => {
        setAnchorEl(null);
        delivered?.(true);
    };
    const handleMenuItemUndelivered = () => {
        setAnchorEl(null);
        undelivered?.(true)
    };    
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAnchorEl(null);
    }

    return (
        <div style={{ whiteSpace: 'nowrap', display: 'flex' }}>
            <Button
                className={classes.button}
                variant='contained'
                color='primary'
                type='submit'
                startIcon={<LocalShippingIcon color="secondary" />}           

                style={{ backgroundColor: "#55BD84" }}
                onClick={handleClickTyping}
            >
                <Trans i18nKey={langKeys.typing} />
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
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {delivered &&
                    <MenuItem onClick={() => {handleMenuItemDelivered()}}>
                        <Trans i18nKey={langKeys.delivered} />
                    </MenuItem>
                }
                {undelivered &&
                    <MenuItem onClick={() => {handleMenuItemUndelivered()}}>
                        <Trans i18nKey={langKeys.undelivered} />
                    </MenuItem>
                }
            </Menu>
        </div>
    )
}