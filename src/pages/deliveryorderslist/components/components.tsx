import React from 'react'
import { Trans, useTranslation } from "react-i18next";
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
    schedulesth?: (param: boolean) => void;
    prepare?: (param: boolean) => void;
    dispatch?: (param: boolean) => void;
    reschedule?: (param: boolean) => void;
    deliver?: (param: boolean) => void;
    undelivered?: (param: boolean) => void;
    cancel?: (param: boolean) => void;
    cancelundelivered?: (param: boolean) => void;

}

export const ExtrasMenu: React.FC<TemplateIconsProps> = ({ schedulesth, prepare, dispatch, reschedule, deliver, undelivered, cancel, cancelundelivered }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
                onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    e.stopPropagation();
                }}
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
                {schedulesth &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        schedulesth?.(true)
                    }}>
                        <Trans i18nKey={langKeys.schedulesth} />
                    </MenuItem>
                }
                {prepare &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        prepare?.(true)
                    }}>
                        <Trans i18nKey={langKeys.prepare} />
                    </MenuItem>
                }
                {dispatch &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        dispatch?.(true)
                    }}>
                        <Trans i18nKey={langKeys.dispatch} />
                    </MenuItem>
                }
                {reschedule &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        reschedule?.(true)
                    }}>
                        <Trans i18nKey={langKeys.reschedule} />
                    </MenuItem>
                }
                {deliver &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        deliver?.(true)
                    }}>
                        <Trans i18nKey={langKeys.deliver} />
                    </MenuItem>
                }
                {undelivered &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        undelivered?.(true)
                    }}>
                        <Trans i18nKey={langKeys.undelivered} />
                    </MenuItem>
                }
                {cancel &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        cancel?.(true)
                    }}>
                        <Trans i18nKey={langKeys.cancel} />
                    </MenuItem>
                }
                {cancelundelivered &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        cancelundelivered?.(true)
                    }}>
                        <Trans i18nKey={t(langKeys.cancel) + " - " + t(langKeys.undelivered)} /> 
                    </MenuItem>
                }
            </Menu>
        </div>
    )
}