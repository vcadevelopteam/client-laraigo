import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import DoneIcon from "@material-ui/icons/Done";
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Dictionary } from "@types";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "end",
    },
    icon: {
        marginRight: 10,
    },
}));

const InvoiceShareDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    config: Dictionary;
}> = ({ openModal, setOpenModal, config }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector((state) => state.main.execute);
    const [wspState, setWspState] = useState(config?.wspi);
    const [emailState, setEmailState] = useState(config?.emaili);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_edit),
                    })
                );
                dispatch(showBackdrop(false));
                setOpenModal(false);
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code ?? "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.postcreator_publish_facebookmockup_share) + " " + t(langKeys.electronic_ticket_and_invoice)}
            maxWidth="sm"
        >
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', width: 145, }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <WhatsAppIcon className={classes.icon}/>
                        <span>{t(langKeys.WHATSAPP)}</span>
                        <Checkbox
                            color="primary"
                            style={{ pointerEvents: "auto" }}
                            checked={wspState}
                            onChange={(e) => setWspState(e.target.checked)}
                        />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <MailOutlineIcon className={classes.icon}/>
                        <span>{t(langKeys.email)}</span>
                        <Checkbox
                            color="primary"
                            style={{ pointerEvents: "auto" }}
                            checked={emailState}
                            onChange={(e) => setEmailState(e.target.checked)}                    
                        />
                    </div>
                </div>
            </div>
            <div className={classes.button}>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={() => {
                        setOpenModal(false);
                    }}
                >
                    {t(langKeys.back)}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    startIcon={<DoneIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                >
                    {t(langKeys.send)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default InvoiceShareDialog;
