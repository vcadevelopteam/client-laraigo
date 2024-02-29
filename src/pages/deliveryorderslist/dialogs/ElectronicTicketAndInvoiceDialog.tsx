import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { Trans, useTranslation } from "react-i18next";
import ShareIcon from "@material-ui/icons/Share";
import ReceiptIcon from "@material-ui/icons/Receipt";
import InvoiceA4Dialog from "./InvoiceA4Dialog";
import InvoiceTicketDialog from "./InvoiceTicketDialog";
import InvoiceShareDialog from "./InvoiceShareDialog";
import { Dictionary } from "@types";

const useStyles = makeStyles(() => ({
    buttonspace: {
        justifyContent: "center",
        display: "flex",
        padding: "0.5rem 0 1rem 0",
        gap: "2rem",
    },
    buttonback: {
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
    },
}));

const ElectronicTicketAndInvoiceDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    config: Dictionary;
}> = ({ openModal, setOpenModal, config }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [openModalInvoiceA4, setOpenModalInvoiceA4] = useState(false);
    const [openModalInvoiceTicket, setOpenModalInvoiceTicket] = useState(false);
    const [openModalInvoiceShare, setOpenModalInvoiceShare] = useState(false);

    return (
        <DialogZyx open={openModal} title={t(langKeys.electronic_ticket_and_invoice)} maxWidth="sm">
            <div className={classes.buttonspace}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ReceiptIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                    onClick={() => {
                        setOpenModalInvoiceA4(true);
                    }}
                >
                    <Trans i18nKey={t(langKeys.receipt) + " - " + t(langKeys.billingfield_billinga4)} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ReceiptIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                    onClick={() => {
                        setOpenModalInvoiceTicket(true);
                    }}
                >
                    <Trans i18nKey={t(langKeys.receipt) + " - " + t(langKeys.ticket)} />
                </Button>
            </div>
            {config?.shareinvoiced && (
                <div className={classes.buttonspace}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShareIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                        onClick={() => {
                            setOpenModalInvoiceShare(true);
                        }}
                    >
                        <Trans i18nKey={t(langKeys.postcreator_publish_facebookmockup_share) + " " + t(langKeys.receipt)} />
                    </Button>
                </div>
            )}
            <div className={classes.buttonback}>
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
            <InvoiceA4Dialog openModal={openModalInvoiceA4} setOpenModal={setOpenModalInvoiceA4} />
            <InvoiceTicketDialog openModal={openModalInvoiceTicket} setOpenModal={setOpenModalInvoiceTicket} />
            <InvoiceShareDialog openModal={openModalInvoiceShare} setOpenModal={setOpenModalInvoiceShare} config={config} />
        </DialogZyx>
    );
};

export default ElectronicTicketAndInvoiceDialog;
