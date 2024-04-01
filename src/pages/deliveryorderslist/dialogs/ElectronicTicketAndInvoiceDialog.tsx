import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { Trans, useTranslation } from "react-i18next";
import ShareIcon from "@material-ui/icons/Share";
import ReceiptIcon from "@material-ui/icons/Receipt";
import InvoiceShareDialog from "./InvoiceShareDialog";
import { Dictionary } from "@types";
import { useSelector } from "hooks";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { reportPdf } from "store/culqi/actions";
import { useDispatch } from "react-redux";

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
    rows: Dictionary[];
    pdfRender: string;
    setPdfRender: (pdf: string) => void;
    setOpenModalInvoiceA4: (value: boolean) => void;
}> = ({ openModal, setOpenModal, config, rows, pdfRender, setPdfRender, setOpenModalInvoiceA4 }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const culqiReportResult = useSelector((state) => state.culqi.requestReportPdf);
    const [waitPdf, setWaitPdf] = useState(false);
    const [openModalInvoiceShare, setOpenModalInvoiceShare] = useState(false);

    const generateInvoicePdf = () => {
        const reportBodyInvoice = {
            dataonparameters: true,
            key: "period-report",
            method: "",
            reportname: "electronic-invoice",
            template: 'delivery-invoice.html',
            parameters: {
                ruc: rows?.[0]?.documentnumber,
                ordernumber: rows?.[0]?.ordernumber,
                companyname: rows?.[0]?.payment_businessname || 'COMPANY TEST',
                address: rows?.[0]?.payment_fiscal_address || 'Av Prueba test 2993',
                date: rows?.[0]?.orderdate,
                client: rows?.[0]?.name,
                docnumber: rows?.[0]?.documentnumber,
                products: [
                    {
                        quantity: 2,
                        unit: 'unidad',
                        code: '28b',
                        description: 'product 1',
                        unitprice: 10,
                    },
                    {
                        quantity: 3,
                        unit: 'unidad',
                        code: '29b',
                        description: 'product 2',
                        unitprice: 15,
                    },
                ]
            },
        };

        dispatch(reportPdf(reportBodyInvoice));
        dispatch(showBackdrop(true));
        setWaitPdf(true);
    }

    useEffect(() => {
        if (waitPdf) {
            if (!culqiReportResult.loading && !culqiReportResult.error) {
                dispatch(showBackdrop(false));
                setWaitPdf(false);
                if (culqiReportResult.datacard) {
                    setPdfRender(culqiReportResult.datacard);
                    setOpenModalInvoiceA4(true)
                }
            } else if (culqiReportResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(culqiReportResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.person).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitPdf(false);
            }
        }
    }, [culqiReportResult, waitPdf]);

    return (
        <DialogZyx open={openModal} title={t(langKeys.electronic_ticket_and_invoice)} maxWidth="sm">
            <div className={classes.buttonspace}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ReceiptIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84", width: 220 }}
                    onClick={generateInvoicePdf}
                >
                    <Trans i18nKey={t(langKeys.receipt) + " - " + t(langKeys.billingfield_billinga4)} />
                </Button>
            </div>
            {config?.shareinvoiced && (
                <div className={classes.buttonspace}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShareIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84", width: 220 }}
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
            <InvoiceShareDialog openModal={openModalInvoiceShare} setOpenModal={setOpenModalInvoiceShare} config={config} />
        </DialogZyx>
    );
};

export default ElectronicTicketAndInvoiceDialog;
