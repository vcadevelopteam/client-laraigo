import Container from "@material-ui/core/Container";
import React, { FC, useEffect, useState } from "react";

import { apiUrls } from "common/constants";
import { balance, charge, resetBalance, resetCharge } from "store/culqi/actions";
import { Dictionary } from "@types";
import { langKeys } from "lang/keys";
import { makeStyles } from "@material-ui/core";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => ({
    alertDiv: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
        color: "white",
        borderRadius: "6px",
        padding: "10px",
        fontSize: "14px",
        fontWeight: "bold",
    },
    containerMainPayment: {
        display: "flex",
    },
    "main-container": {
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
    },
    "method-card": {
        borderRadius: "16px",
        border: "1px solid #989898",
        display: "flex",
        flexDirection: "column",
        padding: "40px 32px 40px",
    },
    "method-card__images": {
        width: "100%",
        maxWidth: "998px",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        "& img": {
            margin: "16px",
        },
    },
    "method-card__description": {
        color: "#004080",
        margin: "24px auto",
        "& span": {
            fontWeight: "bold",
        },
    },
    "method-card__inputs": {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridGap: "16px",
        "& input": {
            height: "64px",
            borderRadius: "8px",
            border: "0.816px solid #989898",
            padding: "0 16px",
            fontSize: "16px",
        },
        "& input::placeholder": {
            color: "#B1B1B1",
            fontSize: "16px",
            textAlign: "center",
        },
        "& select": {
            height: "64px",
            borderRadius: "8px",
            border: "0.816px solid #989898",
            padding: "0 16px",
            fontSize: "16px",
        },
    },
    "method-card__button": {
        marginLeft: "8px",
        cursor: "pointer",
        backgroundColor: "#004481",
        fontWeight: "bold",
        color: "#FFF",
        border: "none",
        padding: "8px 24px",
        borderRadius: "8px",
        fontSize: "18px",
    },
    hidden: {
        display: "none",
    },
}));

const sandbox = apiUrls.OPENPAYSANDBOX;

interface OpenpayModalProps {
    amount: number;
    buttontitle?: string;
    buyamount?: number;
    callbackOnClose?: () => void;
    callbackOnSuccess?: () => void;
    comments?: string;
    corpid?: number;
    currency: string;
    description: string;
    disabled?: boolean;
    invoiceid?: number;
    merchantid: string;
    metadata?: Dictionary;
    orgid?: number;
    override?: boolean;
    publickey?: string;
    purchaseorder?: string;
    reference?: string;
    successmessage?: string;
    title: string;
    totalamount?: number;
    totalpay?: number;
    type?: "CHARGE" | "BALANCE";
}

const OpenpayModal: FC<OpenpayModalProps> = ({
    amount,
    buttontitle,
    buyamount,
    callbackOnClose,
    callbackOnSuccess,
    comments,
    corpid = 0,
    currency = "USD",
    description,
    disabled = false,
    invoiceid,
    merchantid,
    metadata,
    orgid = 0,
    override,
    publickey,
    purchaseorder,
    reference,
    successmessage,
    title,
    totalamount,
    totalpay,
    type = "CHARGE",
}) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const culqiSelector = useSelector((state) => state.culqi.request);

    const [initializeScript, setInitializeScript] = useState(true);
    const [initializePayment, setInitializePayment] = useState(false);
    const [waitPay, setWaitPay] = useState(false);

    const importUrlScript = (url: string) => {
        const script = document.createElement("script");

        script.async = true;
        script.src = url;
        script.type = "text/javascript";

        document.body.appendChild(script);
    };

    useEffect(() => {
        if (initializePayment) {
            setInitializePayment(false);

            const script = document.createElement("script");

            script.setAttribute("type", "module");

            script.async = true;
            script.text = `
            OpenPay.setId('${merchantid}');
            OpenPay.setApiKey('${publickey}');
            OpenPay.setSandboxMode(${sandbox});

            $('#pay-button').on('click', function(event) {
                event.preventDefault();
                $("#pay-button").prop("disabled", true);
                OpenPay.token.extractFormAndCreate($("#payment-form"), sucess_callbak, error_callbak);                
            });

            var sucess_callbak = function(response) {
                let formdata = Object.fromEntries(new FormData(document.getElementById("payment-form")).entries());

                let transactiondata = {
                    transactionresponse: response,
                    formdata: formdata,
                    corpid: ${corpid},
                    orgid: ${orgid},
                    paymentorderid: ${invoiceid},
                    colombia: true,
                }
                document.getElementById('send-form-data').innerHTML = JSON.stringify(transactiondata);
                document.getElementById("send-form").click();
                $("#pay-button").prop("disabled", false);
            };

            var error_callbak = function(response) {
                document.getElementById('paymentalert').style.display = 'block';
                document.getElementById('paymentalert').innerHTML = response.data.description != undefined ? response.data.description : response.message;
                $("#pay-button").prop("disabled", false);
            };
        `;

            document.body.appendChild(script);
        }
    }, [initializePayment]);

    useEffect(() => {
        if (initializeScript) {
            importUrlScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js");
            importUrlScript("https://resources.openpay.co/openpay.v1.min.js");
            setInitializeScript(false);
            setInitializePayment(true);
        }
    }, [initializeScript]);

    const createCharge = () => {
        dispatch(
            charge({
                comments,
                corpid,
                form: JSON.parse(document.getElementById("send-form-data")?.innerHTML || "{}"),
                invoiceid,
                metadata,
                openpay: true,
                orgid,
                override,
                purchaseorder,
                settings: { amount, currency, description, title },
            })
        );
        dispatch(showBackdrop(true));
        setWaitPay(true);
    };

    const createBalance = () => {
        dispatch(
            balance({
                buyamount,
                comments,
                corpid,
                form: JSON.parse(document.getElementById("send-form-data")?.innerHTML || "{}"),
                invoiceid,
                metadata,
                openpay: true,
                orgid,
                purchaseorder,
                reference,
                settings: { amount, currency, description, title },
                totalamount,
                totalpay,
            })
        );
        dispatch(showBackdrop(true));
        setWaitPay(true);
    };

    const processTransaction = () => {
        switch (type) {
            case "BALANCE":
                createBalance();
                break;

            case "CHARGE":
                createCharge();
                break;
        }
    };

    const resetRequest = () => {
        switch (type) {
            case "BALANCE":
                dispatch(resetBalance());
                break;

            case "CHARGE":
                dispatch(resetCharge());
                break;
        }
    };

    useEffect(() => {
        if (waitPay) {
            if (!culqiSelector.loading && !culqiSelector.error) {
                dispatch(
                    showSnackbar({
                        message: `${successmessage ? successmessage : culqiSelector.message}`,
                        severity: "success",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setWaitPay(false);

                resetRequest && resetRequest();
                callbackOnSuccess && callbackOnSuccess();
            } else if (culqiSelector.error) {
                dispatch(
                    showSnackbar({
                        message: `${culqiSelector.message ? culqiSelector.message : t("error_unexpected_error")}`,
                        severity: "error",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
                setWaitPay(false);

                resetRequest && resetRequest();
            }
        }
    }, [culqiSelector, waitPay]);

    return (
        <Container component="main" maxWidth="xs" className={classes.containerMainPayment}>
            <div className={classes["main-container"]}>
                <form
                    onSubmit={(e: any) => {
                        e.preventDefault();
                    }}
                    id="payment-form"
                >
                    <div className={classes["method-card"]} id="method-card">
                        <div className={classes["method-card__images"]}>
                            <img
                                src="https://publico-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/611f7c74-1c05-483c-b34c-fc30aef59c88/visa.png"
                                alt="visa"
                                style={{ maxHeight: "60px" }}
                            ></img>
                            <img
                                src="https://publico-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/8d013c95-fd0d-48a8-82dc-1101d1dbd6b0/masterCard.png"
                                alt="mastercard"
                                style={{ maxHeight: "60px" }}
                            ></img>
                            <img
                                src="https://publico-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/bc097df4-2a25-40a3-a5d8-bdbc12707ebd/americanExpress.png"
                                alt="american-express"
                                style={{ maxHeight: "60px" }}
                            ></img>
                            <img
                                src="https://publico-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/daf82ef6-13c7-4cc9-8134-ff61ad1cc09a/carnet.png"
                                alt="diners"
                                style={{ maxHeight: "60px" }}
                            ></img>
                        </div>
                        <p className={classes["method-card__description"]}>{t(langKeys.openpay_message01)}</p>
                        <div className={classes["method-card__inputs"]}>
                            <input type="hidden" name="token_id" id="token_id"></input>
                            <input
                                type="text"
                                placeholder={t(langKeys.openpay_message02)}
                                autoComplete="off"
                                data-openpay-card="holder_name"
                                name="holder_name"
                                id="holder_name"
                            ></input>
                            <input
                                type="text"
                                placeholder={t(langKeys.openpay_message04)}
                                autoComplete="off"
                                data-openpay-card="card_number"
                                name="card_number"
                                id="card_number"
                            ></input>
                            <input
                                type="text"
                                placeholder={t(langKeys.openpay_message03)}
                                autoComplete="off"
                                data-openpay-card="expiration_month"
                                name="expiration_month"
                                id="expiration_month"
                            ></input>
                            <input
                                type="text"
                                placeholder={t(langKeys.openpay_message08)}
                                autoComplete="off"
                                data-openpay-card="expiration_year"
                                name="expiration_year"
                                id="expiration_year"
                            ></input>
                            <input
                                type="text"
                                placeholder={t(langKeys.openpay_message05)}
                                autoComplete="off"
                                data-openpay-card="cvv2"
                                name="cvv2"
                                id="cvv2"
                            ></input>
                        </div>
                        <div style={{ marginTop: "12px" }}>
                            <b>{t(langKeys.openpay_message09)}</b>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={{ flex: "50%", marginTop: "12px" }}>
                                <img
                                    src="https://publico-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/404c8823-6754-4622-9ea6-4dc2ddf980ef/LogotipoOpenpay-01.jpg"
                                    alt="diners"
                                    style={{ maxHeight: "60px" }}
                                ></img>
                            </div>
                            <div
                                style={{ flex: "50%", display: "flex", justifyContent: "flex-end", marginTop: "12px" }}
                            >
                                <button
                                    className={classes["method-card__button"]}
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        callbackOnClose && callbackOnClose();
                                    }}
                                >
                                    {t(langKeys.openpay_message07)}
                                </button>
                                <button className={classes["method-card__button"]} id="pay-button" disabled={disabled || waitPay}>
                                    {buttontitle ? buttontitle : t(langKeys.openpay_message06)}
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className={classes.hidden} id="send-form-data"></div>
                            <button
                                className={classes.hidden}
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    processTransaction();
                                }}
                                id="send-form"
                            ></button>
                        </div>
                        <div
                            className={classes.alertDiv}
                            style={{ marginTop: "20px", display: "none" }}
                            id="paymentalert"
                        ></div>
                    </div>
                </form>
            </div>
        </Container>
    );
};

export default OpenpayModal;