import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React, { FC, useEffect, useState } from "react";
import Popus from "components/layout/Popus";

import { apiUrls } from "../common/constants/apiUrls";
import { Dictionary } from "@types";
import { formatNumber } from "common/helpers";
import { langKeys } from "lang/keys";
import { LaraigoLogo } from "icons";
import { makeStyles } from "@material-ui/core";
import { epaycoGetPaymentOrder } from "store/payment/actions";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
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
    containerMain: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
    },
    containerMainPayment: {
        display: "flex",
    },
    back: {
        backgroundColor: "#fbfcfd",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    containerSuccess: {
        minHeight: 600,
        backgroundColor: "white",
        display: "flex",
        borderRadius: 8,
        boxShadow: "0 1px 8px 0 rgb(0 0 0 / 8%)",
        width: "440px",
        minWidth: "40px",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(3),
        [theme.breakpoints.down("xs")]: {
            width: "100vw",
        },
        flexDirection: "column",
    },
    containerFinish: {
        minHeight: 600,
        backgroundColor: "white",
        display: "flex",
        borderRadius: 8,
        boxShadow: "0 1px 8px 0 rgb(0 0 0 / 8%)",
        width: "80vw",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(3),
        [theme.breakpoints.down("xs")]: {
            width: "100vw",
        },
        flexDirection: "column",
    },
    textTitle: {
        border: apiUrls.BODEGAACME ? '1px solid #6127B1' : '1px solid #7721AD',
        background: apiUrls.BODEGAACME ? '#6127B1' : '#7721AD',
        padding: "8px",
        fontWeight: "bold",
        color: "white",
        overflowWrap: "break-word",
        height: "100%",
        lineBreak: "anywhere",
    },
    textField: {
        border: "1px solid #EBEAED",
        padding: "8px",
        overflowWrap: "break-word",
        height: "100%",
        lineBreak: "anywhere",
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
        padding: "80px 32px 40px",
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
        marginLeft: "auto",
        marginTop: "12px",
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

export const PaymentOrderEpayco: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const resultGetPaymentOrder = useSelector((state) => state.payment.requestEpaycoGetPaymentOrder);

    const { corpid, orgid, ordercode }: any = useParams();

    const [showPayment, setShowPayment] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [paymentData, setPaymentData] = useState<Dictionary | null>(null);
    const [waitData, setWaitData] = useState(false);
    const [waitProcess, setWaitProcess] = useState(false);

    const openprivacypolicies = () => {
        window.open("/privacy", "_blank");
    };

    const fetchData = () => {
        dispatch(epaycoGetPaymentOrder({ corpid: corpid, orgid: orgid, ordercode: ordercode }));
        setWaitData(true);
    };

    const importUrlScript = (url: string) => {
        const script = document.createElement("script");

        script.async = true;
        script.src = url;
        script.type = "text/javascript";

        document.body.appendChild(script);
    };

    const importManualScript = (data: any) => {
        const authCredentials = JSON.parse(data.authcredentials || {});

        const script = document.createElement("script");

        script.setAttribute("type", "module");

        script.async = true;
        script.text = `
            var handler = ePayco.checkout.configure({
                key: '${authCredentials.publicKey}',
                test: ${authCredentials.sandbox ? 'true' : 'false'}
            });

            var data={
                address_billing: "${data.useraddress || "NONE"}",
                amount: "${(Math.round((data.totalamount || 0) * 100) / 100).toFixed(2)}",
                confirmation: "${apiUrls.PAYMENTORDER_EPAYCO_PROCESSTRANSACTION}",
                country: "${data.usercountry}",
                currency: "${data.currency?.toLocaleLowerCase()}",
                description: "${data.description}",
                external: "false",
                extra1: "${data.corpid}",
                extra2: "${data.orgid}",
                extra3: "${data.paymentorderid}",
                lang: "${t(langKeys.current_language)}",
                methodsDisable: [],
                name: "${data.description}",
                name_billing: "${(data.userfirstname || "LARAIGO").replace(/[^a-zA-Z ]/g, "")} ${(data.userlastname || "LARAIGO").replace(/[^a-zA-Z ]/g, "")}",
            }

            handler.open(data);
        `;

        document.body.appendChild(script);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (waitData) {
            if (!resultGetPaymentOrder.loading && !resultGetPaymentOrder.error) {
                dispatch(showBackdrop(false));
                setWaitData(false);

                if (resultGetPaymentOrder.data) {
                    setPaymentData(resultGetPaymentOrder.data);

                    if (resultGetPaymentOrder.data.script) {
                        importUrlScript(resultGetPaymentOrder.data.script);
                    }
                }
            } else if (resultGetPaymentOrder.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(resultGetPaymentOrder.code ?? "error_unexpected_error", {
                            module: t(langKeys.organization_plural).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitData(false);
            }
        }
    }, [resultGetPaymentOrder, waitData]);

    if (resultGetPaymentOrder.loading) {
        return (
            <div className={classes.back}>
                <CircularProgress />
            </div>
        );
    } else if (paymentData) {
        if (paymentData.paymentstatus === "PENDING") {
            return (
                <div style={{ width: "100%" }}>
                    <div className={showPayment ? classes.hidden : undefined}>
                        <Container component="main" maxWidth="xs" className={classes.containerMain}>
                            <div className={classes.back}>
                                <div className={classes.containerSuccess}>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                    <img src={'https://publico-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/dfbffeb9-5a11-4020-852d-a600264d8fb4/epayco-logo-fondo-oscuro.png'} style={{ height: 120, margin: '20px' }} />
                                    </div>
                                    <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: "20px" }}>
                                        {t(langKeys.paymentorder_success)}
                                    </div>
                                    {paymentData.ordercode && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>{t(langKeys.paymentorder_code)}</div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{apiUrls.BODEGAACME ? paymentData?.paymentorderid : paymentData?.ordercode}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.concept && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>
                                                    {t(langKeys.paymentorder_concept)}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{paymentData?.concept}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.userfirstname && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>
                                                    {t(langKeys.paymentorder_firstname)}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{paymentData?.userfirstname}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.userlastname && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>
                                                    {t(langKeys.paymentorder_lastname)}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{paymentData?.userlastname}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.userphone && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>
                                                    {t(langKeys.paymentorder_phone)}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{paymentData?.userphone}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.usermail && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>{t(langKeys.paymentorder_mail)}</div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{paymentData?.usermail}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.usercountry && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>
                                                    {t(langKeys.paymentorder_country)}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{paymentData?.usercountry}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.usercity && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>{t(langKeys.paymentorder_city)}</div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{paymentData?.usercity}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.useraddress && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>
                                                    {t(langKeys.paymentorder_address)}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{paymentData?.useraddress}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.currency && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>
                                                    {t(langKeys.paymentorder_currency)}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>{paymentData?.currency}</div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.totalamount && (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                                width: "100%",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textTitle}>
                                                    {t(langKeys.paymentorder_totalamount)}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexBasis: "100%",
                                                    flex: 1,
                                                }}
                                            >
                                                <div className={classes.textField}>
                                                    {formatNumber(paymentData?.totalamount || 0)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {paymentData.totalamount && paymentData.authcredentials && (
                                        <div style={{ width: "100%" }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={termsAccepted}
                                                        color="primary"
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setTermsAccepted(true);
                                                            } else {
                                                                setTermsAccepted(false);
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <div style={{ display: "inline-flex", alignItems: "center" }}>
                                                        <span>
                                                            {t(langKeys.paymentorder_termandconditions)}
                                                            <b
                                                                style={{ color: "#7721AD" }}
                                                                onMouseDown={(e: any) => {
                                                                    e.preventDefault();
                                                                    openprivacypolicies();
                                                                }}
                                                            >
                                                                {t(langKeys.paymentorder_termandconditionsnext)}
                                                            </b>
                                                        </span>
                                                    </div>
                                                }
                                            />
                                        </div>
                                    )}
                                    {(paymentData.totalamount && paymentData.authcredentials) && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="button"
                                                startIcon={<AttachMoneyIcon color="secondary" />}
                                                style={{ backgroundColor: "#55BD84", marginTop: 10 }}
                                                disabled={resultGetPaymentOrder.loading || !termsAccepted}
                                                onClick={(e: any) => {
                                                    e.preventDefault();
                                                    importManualScript(resultGetPaymentOrder.data);
                                                }}
                                            >
                                                {t(langKeys.proceedpayment)}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Container>
                    </div>
                    <Popus />
                </div>
            );
        } else {
            return (
                <div className={classes.back}>
                    <div className={classes.containerFinish}>
                        <div style={{ fontWeight: "bold", fontSize: 20 }}>{t(langKeys.paymentorder_paid)}</div>
                        <div style={{ marginTop: 16, textAlign: "center" }}>
                            {t(langKeys.paymentorder_paid_description)}
                        </div>
                    </div>
                </div>
            );
        }
    } else {
        return (
            <div className={classes.back}>
                <div className={classes.containerFinish}>
                    <div style={{ fontWeight: "bold", fontSize: 20 }}>{t(langKeys.paymentorder_notfound)}</div>
                    <div style={{ marginTop: 16, textAlign: "center" }}>
                        {t(langKeys.paymentorder_notfound_description)}
                    </div>
                </div>
            </div>
        );
    }
};

export default PaymentOrderEpayco;