import { Box, BoxProps, createStyles, Dialog, IconButton, makeStyles, Menu, Theme, Typography } from "@material-ui/core";
import React,{useEffect} from "react";
import { Button } from "@material-ui/core";
import { FC, useState } from "react";
import { langKeys } from "lang/keys";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import { Trans } from "react-i18next";
import DialogContent from '@material-ui/core/DialogContent';
import { version } from 'common/constants';
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { getVersion } from "store/getversion/actions";
import { convertLocalDate } from "common/helpers";

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
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    }),
);

const styles = () => ({
    root: {
      margin: 0,
    },
    closeButton: {
      position: 'absolute',
    },
  });

const LaraigoHelp: FC<BoxProps> = (boxProps) => {
    const classes = useNotificationMenuStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState(false);
    const getVersionData = useSelector(state => state.getversion);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getVersion())
    }, []);
    useEffect(() => {
        console.log(getVersionData)
    }, [getVersionData]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false)
    };
  

    return (
        <Box {...boxProps}>
            <Dialog fullWidth onClose={handleCloseDialog} aria-labelledby="simple-dialog-title" open={openDialog}>
                
                <MuiDialogTitle disableTypography className={classes.root}>
                    <Typography variant="h6" style={{textAlign: 'center'}}><Trans i18nKey={langKeys.systeminformation} /></Typography>
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseDialog}>
                        <CloseIcon />
                    </IconButton>
                </MuiDialogTitle>
                <DialogContent>
                    <div style={{justifyContent: 'space-between', display: 'flex'}}>
                        <Typography variant="subtitle1" ><b><Trans i18nKey={langKeys.laraigoappversion} /></b></Typography>
                        <Typography variant="subtitle2">{version.build}</Typography>
                    </div>
                    <div style={{justifyContent: 'space-between', display: 'flex',paddingTop: '15px'}}>
                        <Typography variant="subtitle1" ><b><Trans i18nKey={langKeys.laraigoengineversion} /></b></Typography>
                        <Typography variant="subtitle2">{getVersionData?.getVersion?.data?.version}</Typography>
                    </div>
                    <div style={{justifyContent: 'space-between', display: 'flex',paddingTop: '15px', paddingBottom: '15px'}}>
                        <Typography variant="subtitle1" ><b><Trans i18nKey={langKeys.deploymentdate} /></b></Typography>
                        <Typography variant="subtitle2">{getVersionData?.getVersion?.data?.date}</Typography>
                    </div>
                </DialogContent>
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
                        onClick={()=>{window?.open('https://docs-laraigo.gitbook.io/laraigo/', '_blank')?.focus();}}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        style={{ fontWeight: "normal" }}
                    >
                        <Trans i18nKey={langKeys.generalhelp} />
                    </Button>
                    <Button
                        onClick={()=>{window?.open('https://docs-laraigo.gitbook.io/laraigo/contenido/configuracion', '_blank')?.focus();}}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        style={{ fontWeight: "normal" }}
                    >
                        <Trans i18nKey={langKeys.configuration_plural} />
                    </Button>
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

const formatDate = (strDate: string) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(strDate);
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });

    return `${day}/${month}/${year}`;
}
