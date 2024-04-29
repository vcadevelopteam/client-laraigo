import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { Button, Menu, MenuItem, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(() => ({
	main : {
		whiteSpace: "nowrap",
		display: "flex"
	}
}));

interface TemplateIconsProps {
    fastAnswer: () => void;
    urlWeb: () => void;
    callNumber: () => void;
}

export const AddButtonMenu: React.FC<TemplateIconsProps> = ({
    fastAnswer,
    urlWeb,
    callNumber,
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleClickTyping = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget as HTMLElement);
        e.stopPropagation();
    };
    const handleMenuFastAnswer= () => {
        setAnchorEl(null);
        fastAnswer();
    };
    const handleMenuUrlWeb = () => {
        setAnchorEl(null);
        urlWeb();
    };
    const handleMenuCallNumber = () => {
        setAnchorEl(null);
        callNumber();
    };
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <div className={classes.main}>
            <Button
                color="primary"
                onClick={handleClickTyping}
                startIcon={<AddIcon color="primary" />}
                style={{ margin: "10px" }}
                type="button"
                variant="outlined"
            >
                {t(langKeys.addbutton)}
            </Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleMenuFastAnswer}>
                    <Trans i18nKey={langKeys.fastanswer} />
                </MenuItem>
                <MenuItem onClick={handleMenuUrlWeb}>
                    <Trans i18nKey={langKeys.gotothewebsite} />
                </MenuItem>
                <MenuItem onClick={handleMenuCallNumber}>
                    <Trans i18nKey={langKeys.callnumber} />
                </MenuItem>
            </Menu>
        </div>
    );
};
