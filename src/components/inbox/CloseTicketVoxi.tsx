import React, { FC, useState, MouseEventHandler } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { createStyles, Theme } from '@material-ui/core/styles';
import { Avatar, Button, DialogActions, DialogTitle, Fab, InputBase, makeStyles, MenuItem, Paper, Tooltip, Typography } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialpadIcon from '@material-ui/icons/Dialpad';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'hooks';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useDispatch } from 'react-redux';
import { makeCall, setModalCall, getHistory, geAdvisors, rejectCall } from 'store/voximplant/actions';
import TextField from '@material-ui/core/TextField';
import PhoneForwardedIcon from '@material-ui/icons/PhoneForwarded';
import PhoneIcon from '@material-ui/icons/Phone';
import { FieldSelect, AntTab, SearchField } from 'components';
import { IconButton, Tabs } from '@material-ui/core';
import { conversationOutboundIns, convertLocalDate, getSecondsUntelNow, getAdvisorListVoxi } from 'common/helpers';
import { langKeys } from 'lang/keys';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import BackspaceIcon from '@material-ui/icons/Backspace';
import clsx from 'clsx';
import { execute } from 'store/main/actions';
import { ITicket } from '@types';
import { ListItemSkeleton } from 'components';
import { SearchIcon } from 'icons';
import { showSnackbar } from 'store/popus/actions';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles(theme => ({
    grey: {
        backgroundColor: '#bdbdbd'
    },
    red: {
        backgroundColor: 'rgb(180, 26, 26)'
    },
    tabs: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    root: {
        margin: 0,
        padding: theme.spacing(2),
        backgroundColor: "#7721ad",
        color: "white",
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: "white",
    },
    numpadbuttons: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: '#e7e3e3'
    },
    gridlinebuttons: {
        display: "grid",
        width: "100%",
        gridTemplateColumns: 'auto [col1] 50px 50px [col2] 50px 50px [col3] 50px auto',
        paddingBottom: 25
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    rootpaper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        height: 35,
        border: '1px solid #EBEAED',
        //backgroundColor: (props: any) => props.colorPlaceHolder || '#F9F9FA',
    },
    inputPlaceholder: {
        '&::placeholder': {
            fontSize: "1rem",
            fontWeight: 500,
            color: '#84818A',
        },
    },
}));


const CloseTicketVoxi: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const showModalVoxi = useSelector(state => state.inbox.showModalClose);
    const callVoxiTmp = useSelector(state => state.voximplant.call);

    React.useEffect(() => {
        console.log(showModalVoxi)
        if (showModalVoxi > 0) {
            setOpenModal(true)
        }
    }, [showModalVoxi])

    return (
        <>
            <Dialog
                open={openModal}
                fullWidth
                maxWidth={"xs"}>
                <DialogTitle>
                    <div style={{ overflow: 'hidden', wordBreak: 'break-word', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 120 }}>
                        Llamada colgada de {callVoxiTmp.data?.displayname}
                    </div>
                </DialogTitle>
                <DialogContent style={{ padding: 0 }}>
                    hola
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenModal(false)}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default CloseTicketVoxi;