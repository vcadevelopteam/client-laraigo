/* eslint-disable react-hooks/exhaustive-deps */
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Popus from 'components/layout/Popus';

import { Dictionary } from '@types';
import { FC, useEffect, useState } from 'react';
import { formatNumber } from 'common/helpers';
import { langKeys } from 'lang/keys';
import { LaraigoLogo } from 'icons';
import { makeStyles } from "@material-ui/core";
import { niubizCreateSessionToken } from 'store/payment/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    alertDiv: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '6px',
        padding: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '16px',
    },
    containerMain: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center'
    },
    back: {
        backgroundColor: '#fbfcfd',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerSuccess: {
        minHeight: 600,
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        width: '480px',
        minWidth: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            width: '100vw',
        },
        flexDirection: 'column',
    },
    containerFinish: {
        minHeight: 600,
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        width: '80vw',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            width: '100vw',
        },
        flexDirection: 'column',
    },
    textTitle: {
        border: '1px solid #7721AD',
        background: '#7721AD',
        padding: '8px',
        fontWeight: 'bold',
        color: 'white',
        overflowWrap: 'break-word',
        height: '100%',
        lineBreak: 'anywhere',
    },
    textField: {
        border: '1px solid #EBEAED',
        padding: '8px',
        overflowWrap: 'break-word',
        height: '100%',
        lineBreak: 'anywhere',
    }
}));

export const PaymentOrderNiubizStatus: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const resultSessionToken = useSelector(state => state.payment.requestNiubizCreateSessionToken);

    const { corpid, orgid, ordercode }: any = useParams();

    const [paymentData, setPaymentData] = useState<Dictionary | null>(null);
    const [resultData, setResultData] = useState<Dictionary | null>(null);
    const [commerceData, setCommerceData] = useState<Dictionary | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [waitData, setWaitData] = useState(false);

    const fetchData = () => {
        dispatch(niubizCreateSessionToken({ corpid: corpid, orgid: orgid, ordercode: ordercode, onlydata: true }));
        setWaitData(true);
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (waitData) {
            if (!resultSessionToken.loading && !resultSessionToken.error) {
                dispatch(showBackdrop(false));
                setWaitData(false);

                if (resultSessionToken.data) {
                    setPaymentData(resultSessionToken.data);

                    if (resultSessionToken.data.chargejson) {
                        setResultData(resultSessionToken.data.chargejson);
                        setShowSuccess(true);
                    }
                    else {
                        if (resultSessionToken.data.lastdata) {
                            setResultData(JSON.parse(resultSessionToken.data.lastdata));
                        }
                    }

                    if (resultSessionToken.data.authcredentials) {
                        setCommerceData(JSON.parse(resultSessionToken.data.authcredentials));
                    }
                }
            } else if (resultSessionToken.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultSessionToken.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitData(false);
            }
        }
    }, [resultSessionToken, waitData])

    if (resultSessionToken.loading) {
        return (<>
            <div className={classes.back}>
                <CircularProgress />
            </div>
        </>)
    }
    else {
        if (paymentData) {
            if (paymentData.paymentstatus === "PAID" || paymentData.laststatus) {
                return (<>
                    <Container component="main" maxWidth="xs" className={classes.containerMain}>
                        <div className={classes.back}>
                            <div className={classes.containerSuccess}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <LaraigoLogo style={{ height: 120, margin: '20px' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: '20px' }}>{t(langKeys.paymentorder_payconstancy)}</div>
                                {showSuccess && <>
                                    <div className={classes.alertDiv} style={{ backgroundColor: 'green' }}>
                                        {t(langKeys.paymentorder_paysuccess)}
                                    </div>
                                </>}
                                {!showSuccess && <>
                                    <div className={classes.alertDiv}>
                                        {t(langKeys.paymentorder_payfailure)}
                                    </div>
                                </>}
                                {!showSuccess && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_payfailuremotive)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData.laststatus === 'Accept' ? t(langKeys.paymentorder_cardnotvalid) : paymentData.laststatus}
                                        </div>
                                    </div>
                                </div>}
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_currency)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.currency}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_totalamount)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {formatNumber(paymentData?.totalamount || 0)}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_paymentcount)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {resultData?.order?.installment}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_externalid)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.ordercode}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_transaction)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {resultData?.order?.transactionId}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_datetime)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {(new Date(paymentData?.changedate.toString())).toLocaleDateString() + ' ' + (new Date(paymentData?.changedate.toString())).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_cardnumber)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {resultData?.dataMap?.CARD}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_commercecode)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {commerceData?.merchantId}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_payname)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.userfirstname + ' ' + paymentData?.userlastname}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_paymail)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.paymentby || paymentData?.changeby}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_orderid)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.paymentorderid}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Popus />
                    </Container>
                </>)
            }
            else {
                return (
                    <div className={classes.back}>
                        <div className={classes.containerFinish}>
                            <div style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.paymentorder_notfound)}</div>
                            <div style={{ marginTop: 16, textAlign: 'center' }} >{t(langKeys.paymentorder_notfound_description)}</div>
                        </div>
                    </div>
                )
            }
        }
        else {
            return (
                <div className={classes.back}>
                    <div className={classes.containerFinish}>
                        <div style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.paymentorder_notfound)}</div>
                        <div style={{ marginTop: 16, textAlign: 'center' }} >{t(langKeys.paymentorder_notfound_description)}</div>
                    </div>
                </div>
            )
        }
    }
}

export default PaymentOrderNiubizStatus;