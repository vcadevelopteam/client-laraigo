import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(2),
        backgroundColor: "#55BD84",
        padding: "0 2rem",
    },
    backbutton: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "end",
    },
    buttonsposition: {
        display: "flex",
        justifyContent: "center",
        margin: "0rem 0rem 1rem 0rem",
    },
}));

const InvoiceA4Dialog: React.FC<{
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
        <DialogZyx open={openModal} title="" maxWidth="sm">
            <div className={classes.backbutton}>
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
            </div>
            <img
                style={{ textAlign: "center" }}
                src="https://www.invoiceowl.com/wp-content/uploads/2023/02/freight-invoice-banner-template.svg"
                alt="Invoice"
            ></img>

            <div className={classes.buttonsposition}>
                <Button className={classes.button} variant="contained" color="primary" type="button">
                    {t(langKeys.download)}
                </Button>
                <Button className={classes.button} variant="contained" color="primary" type="button">
                    {t(langKeys.print)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default InvoiceA4Dialog;
