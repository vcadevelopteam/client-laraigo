import { Button, Typography, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch } from "react-redux";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end", 
    },
}));

const DeliveredDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector((state) => state.main.execute);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
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
        <DialogZyx open={openModal} title={t(langKeys.delivered)} maxWidth="sm">
            <div className="row-zyx" style={{ justifyContent: "center" }}>
                <Button
                    variant="contained"
                    className="col-6"
                    type="button"
                    color="primary"
                    startIcon={<AttachMoneyIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                >
                    {t(langKeys.chargeorder)}
                </Button>
                <Typography />
                {t(langKeys.chargeamount) + "0.00"}
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
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="button"
                    startIcon={<SaveIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default DeliveredDialog;
