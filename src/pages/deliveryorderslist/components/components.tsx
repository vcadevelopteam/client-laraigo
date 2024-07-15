import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { Button, Menu, MenuItem, makeStyles } from "@material-ui/core";
import { TipificationIcon } from "icons";

const useStyles = makeStyles(() => ({
    button: {
        backgroundColor: "#55BD84",
        "&:hover": {
            backgroundColor: "#55BD84",
        },
    },
	main : {
		whiteSpace: "nowrap",
		display: "flex"
	}
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

export const ExtrasMenu: React.FC<TemplateIconsProps> = ({
    schedulesth,
    prepare,
    dispatch,
    reschedule,
    deliver,
    undelivered,
    cancel,
    cancelundelivered,
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleClickTyping = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget as HTMLElement);
        e.stopPropagation();
    };
    const handleMenuItemSchedulesth = () => {
        setAnchorEl(null);
        schedulesth?.(true);
    };
    const handleMenuItemPrepare = () => {
        setAnchorEl(null);
        prepare?.(true);
    };
    const handleMenuItemDispatch = () => {
        setAnchorEl(null);
        dispatch?.(true);
    };
    const handleMenuItemReschedule = () => {
        setAnchorEl(null);
        reschedule?.(true);
    };
    const handleMenuItemDeliver = () => {
        setAnchorEl(null);
        deliver?.(true);
    };
    const handleMenuItemUndelivered = () => {
        setAnchorEl(null);
        undelivered?.(true);
    };
    const handleMenuItemCancel = () => {
        setAnchorEl(null);
        cancel?.(true);
    };
    const handleMenuItemCancelUndelivered = () => {
        setAnchorEl(null);
        cancelundelivered?.(true);
    };
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <div className={classes.main}>
            <Button
                className={classes.button}
                variant="contained"
                color="primary"
                startIcon={<TipificationIcon color="secondary" />}
                onClick={handleClickTyping}
                style={{backgroundColor: '#55BD84'}}
            >
                <Trans i18nKey={langKeys.typing} />
            </Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {schedulesth && (
                    <MenuItem onClick={handleMenuItemSchedulesth}>
                        <Trans i18nKey={langKeys.schedulesth} />
                    </MenuItem>
                )}
                {dispatch && (
                    <MenuItem onClick={handleMenuItemDispatch}>
                        <Trans i18nKey={langKeys.dispatch} />
                    </MenuItem>
                )}
                {reschedule && (
                    <MenuItem onClick={handleMenuItemReschedule}>
                        <Trans i18nKey={langKeys.reschedule} />
                    </MenuItem>
                )}
                {deliver && (
                    <MenuItem onClick={handleMenuItemDeliver}>
                        <Trans i18nKey={langKeys.deliver} />
                    </MenuItem>
                )}
                {undelivered && (
                    <MenuItem onClick={handleMenuItemUndelivered}>
                        <Trans i18nKey={langKeys.undelivered} />
                    </MenuItem>
                )}
                {cancel && (
                    <MenuItem onClick={handleMenuItemCancel}>
                        <Trans i18nKey={langKeys.cancel} />
                    </MenuItem>
                )}
                {cancelundelivered && (
                    <MenuItem onClick={handleMenuItemCancelUndelivered}>
                        <Trans i18nKey={t(langKeys.cancel) + " - " + t(langKeys.undelivered)} />
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};
