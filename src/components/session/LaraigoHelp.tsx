import { Box, BoxProps, createStyles, Dialog, DialogActions, DialogTitle, IconButton, makeStyles, Menu, Theme, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { FC, useState } from "react";
import { langKeys } from "lang/keys";
import HelpIcon from '@material-ui/icons/Help';
import { Trans } from "react-i18next";
import DialogContent from '@material-ui/core/DialogContent';
import { version } from 'common/constants';
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { getVersion } from "store/getversion/actions";
import { LaraigoOnlyLogo } from "icons";
import { useLocation } from 'react-router-dom';
import { viewDocumentation } from "pages/dashboard/constants";

const useNotificationMenuStyles = makeStyles((theme: Theme) =>
    createStyles({
        rootIcon: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
        },
        menu: {
            padding: theme.spacing(1),
            maxHeight: 410,
            fontSize: 12,
        },
        noNotificationContainer: {
            height: 90,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        containerPopover: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(2),
            flexDirection: 'column',
            gap: theme.spacing(1.5),
            width: 270
        },
        root: {
            margin: 0,
            // padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    }),
);

const LaraigoHelp: FC<BoxProps> = (boxProps) => {
    const classes = useNotificationMenuStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState(false);
    const [showDocButton, setshowDocButton] = useState(false);
    const [redirection, setredirection] = useState<any>(null);
    const getVersionData = useSelector(state => state.getversion);
    const dispatch = useDispatch();
    const location = useLocation();
    const viewChange = useSelector(state => state.main.viewChange);

    useEffect(() => {
        if (!!viewChange) {
            const finddocumentation = viewDocumentation.find(x => x.name === viewChange)
            setshowDocButton(!!finddocumentation)
            setredirection(finddocumentation || null)
        } else {
            const lengthsplitpath = location.pathname.split('/')
            const finddocumentation = viewDocumentation.find(x => x.name === lengthsplitpath[lengthsplitpath.length > 3 ? 2 : lengthsplitpath.length - 1])
            setshowDocButton(!!finddocumentation)
            setredirection(finddocumentation || null)
        }
    }, [location, viewChange]);

    useEffect(() => {
        if (openDialog) {
            dispatch(getVersion())
        }
    }, [dispatch, openDialog]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false)
    };

    function formattime(cc: any) {
        if (!cc)
            return "";
        let date = cc.split(' ')[0].split('-')
        return `${date[2]}/${date[1]}/${date[0]} ${cc.split(' ')[1]}`
    }

    return (
        <Box {...boxProps}>
            <Dialog fullWidth onClose={handleCloseDialog} aria-labelledby="simple-dialog-title" open={openDialog} maxWidth="xs">
                <DialogTitle >
                    <Trans i18nKey={langKeys.systeminformation} />
                </DialogTitle>
                <DialogContent>
                    <div style={{ display: "flex", gap: 16, width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <LaraigoOnlyLogo style={{ width: 60, height: 60 }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                                <Typography><Trans i18nKey={langKeys.laraigoappversion} /></Typography>
                                <Typography >{version.build}</Typography>
                            </div>
                            <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                                <Typography  ><Trans i18nKey={langKeys.laraigoengineversion} /></Typography>
                                <Typography >{getVersionData?.getVersion?.data?.version}</Typography>
                            </div>
                            <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                                <Typography ><Trans i18nKey={langKeys.deploymentdate} /></Typography>
                                <Typography >{formattime(getVersionData?.getVersion?.data?.date)}</Typography>
                            </div>
                            <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                                <Typography ><Trans i18nKey={langKeys.android_version} /></Typography>
                                <Typography >{getVersionData?.getVersion?.data?.version_android}</Typography>
                            </div>
                            <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                                <Typography ><Trans i18nKey={langKeys.ios_version} /></Typography>
                                <Typography >{getVersionData?.getVersion?.data?.version_ios}</Typography>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20, textAlign: 'center' }}>
                        <Typography>Copyright © Laraigo {new Date().getFullYear()}</Typography>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        <Trans i18nKey={langKeys.close} />
                    </Button>
                </DialogActions>
            </Dialog>
            <IconButton
                aria-label="bell-notification"
                aria-controls="notification-list-menu-popover"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <div className={classes.rootIcon}>
                    <HelpIcon />
                </div>
            </IconButton>
            <Menu
                id="notification-list-menu-popover"
                anchorEl={anchorEl}
                open={open}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={handleClose}
                className={classes.menu}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
            >

                <div className={classes.containerPopover}>
                    <Button
                        onClick={() => { window?.open('https://docs-laraigo.gitbook.io/laraigo/', '_blank')?.focus(); }}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        style={{ fontWeight: "normal" }}
                    >
                        <Trans i18nKey={langKeys.generalhelp} />
                    </Button>
                    {showDocButton &&
                        <Button
                            onClick={() => { window?.open(redirection?.path || "", '_blank')?.focus(); }}
                            variant="outlined"
                            color="primary"
                            fullWidth
                            style={{ fontWeight: "normal" }}
                        >
                            <Trans i18nKey={redirection.altname} />
                        </Button>
                    }
                    <Button
                        variant="outlined"
                        onClick={() => setOpenDialog(true)}
                        fullWidth
                        color="primary"
                    >
                        <Trans i18nKey={langKeys.aboutlaraigo} />
                    </Button>
                </div>
            </Menu>
        </Box>
    );
};

export default LaraigoHelp;