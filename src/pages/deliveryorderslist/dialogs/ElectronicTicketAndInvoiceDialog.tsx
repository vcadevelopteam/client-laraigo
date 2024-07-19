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
    fetchProducts: (value: number) => void;
}> = ({ openModal, setOpenModal, config, rows, pdfRender, setPdfRender, setOpenModalInvoiceA4, fetchProducts }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const culqiReportResult = useSelector((state) => state.culqi.requestReportPdf);
    const [waitPdf, setWaitPdf] = useState(false);
    const [openModalInvoiceShare, setOpenModalInvoiceShare] = useState(false);
    const [waitSave3, setWaitSave3] = useState(false);
    const productsData = useSelector(state => state.main.mainAux2);
    
    const generateInvoicePdf = () => {
        dispatch(showBackdrop(true));
        fetchProducts(rows?.[0]?.orderid)
        setWaitSave3(true);
    }
    
    useEffect(() => {
        if (waitSave3) {
            if (!productsData.loading && !productsData.error) {
                const reportBodyInvoice = {
                    dataonparameters: true,
                    key: "period-report",
                    method: "",
                    reportname: `${rows?.[0]?.ordernumber}_${rows?.[0]?.documentnumber}`,
                    template: (rows?.[0]?.payment_document_type === 'Boleta' || !rows?.[0]?.payment_document_type) ? 'delivery-receipt.html' : 'delivery-invoice.html',
                    parameters: {
                        ruc: rows?.[0]?.payment_document_number || 'RUC938942N423N',
                        ordernumber: rows?.[0]?.ordernumber,
                        companyname: rows?.[0]?.storedescription || 'COMPANY TEST',
                        address: rows?.[0]?.address || 'Av Prueba test 2993',
                        date: rows?.[0]?.orderdate?.split(" ")[0],
                        client: rows?.[0]?.name,
                        docnumber: rows?.[0]?.documentnumber,
                        products: productsData.data,
                    },
                };
        
                dispatch(reportPdf(reportBodyInvoice));
                setWaitPdf(true);
                setWaitSave3(false);
            } else if (productsData.error) {
                const errormessage = t(productsData.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave3(false);
            }
        }
    }, [productsData, waitSave3]);

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
            {(config?.shareinvoiced && (config?.wspi || config?.emaili)) && (
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
