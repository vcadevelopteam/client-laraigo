/* eslint-disable react-hooks/exhaustive-deps */
import CircularProgress from '@material-ui/core/CircularProgress';
import CulqiModal from 'components/fields/CulqiModal';
import Container from '@material-ui/core/Container';
import Popus from 'components/layout/Popus';

import { FC, useEffect, useState } from 'react';
import { langKeys } from 'lang/keys';
import { makeStyles } from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { Dictionary } from '@types';
import { getCollectionPaymentOrder } from 'store/main/actions';
import { paymentOrderSel } from 'common/helpers';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { LaraigoLogo } from 'icons';
import { formatNumber } from 'common/helpers';

const useStyles = makeStyles(theme => ({
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
        width: '420px',
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
        overflowWrap: 'break-word'
    },
    textField: {
        border: '1px solid #EBEAED',
        padding: '8px',
        overflowWrap: 'break-word'
    }
}));

export const PaymentOrder: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main.mainData);
    const culqiResult = useSelector(state => state.culqi.request);

    const { corpid, orgid, ordercode }: any = useParams();

    const [paymentData, setPaymentData] = useState<Dictionary | null>(null);
    const [publicKey, setPublicKey] = useState('');
    const [waitData, setWaitData] = useState(false);
    const [waitPay, setWaitPay] = useState(false);

    const fetchData = () => {
        dispatch(getCollectionPaymentOrder(paymentOrderSel({ corpid: corpid, orgid: orgid, conversationid: 0, personid: 0, paymentorderid: 0, ordercode: ordercode })));
        setWaitData(true);
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (waitData) {
            if (!mainResult.loading && !mainResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }))
                dispatch(showBackdrop(false));
                setWaitData(false);

                if (mainResult.data.length) {
                    if (!mainResult.data[0].expired) {
                        setPaymentData(mainResult.data[0]);
                        setPublicKey(mainResult.data[0].publickey);
                    }
                }
            } else if (mainResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(mainResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitData(false);
            }
        }
    }, [mainResult, waitData])

    useEffect(() => {
        if (waitPay) {
            if (!culqiResult.loading && culqiResult.data) {
                dispatch(showSnackbar({ show: true, severity: "success", message: '' + t(culqiResult.message || langKeys.success) }))
                dispatch(showBackdrop(false));
                setWaitPay(false);
            }
            else if (culqiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: '' + t(culqiResult.message || langKeys.error_cos_unexpected) }))
                dispatch(showBackdrop(false));
                setWaitPay(false);
            }
        }
    }, [culqiResult, waitPay]);

    if (mainResult.loading) {
        return (
            <div className={classes.back}>
                <CircularProgress />
            </div>
        )
    }
    else {
        if (paymentData) {
            if (paymentData.paymentstatus === "PENDING") {
                return (
                    <Container component="main" maxWidth="xs" className={classes.containerMain}>
                        <div className={classes.back}>
                            <div className={classes.containerSuccess}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <LaraigoLogo style={{ height: 120, margin: '20px' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: '20px' }}>{t(langKeys.paymentorder_success)}</div>
                                {paymentData.ordercode && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_code)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.ordercode}
                                        </div>
                                    </div>
                                </div>}
                                {paymentData.concept && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_concept)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.concept}
                                        </div>
                                    </div>
                                </div>}
                                {paymentData.userfirstname && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_firstname)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.userfirstname}
                                        </div>
                                    </div>
                                </div>}
                                {paymentData.userlastname && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_lastname)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.userlastname}
                                        </div>
                                    </div>
                                </div>}
                                {paymentData.userphone && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_phone)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.userphone}
                                        </div>
                                    </div>
                                </div>}
                                {paymentData.usermail && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_mail)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.usermail}
                                        </div>
                                    </div>
                                </div>}
                                {paymentData.usercountry && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_country)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.usercountry}
                                        </div>
                                    </div>
                                </div>}
                                {paymentData.usercity && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_city)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.usercity}
                                        </div>
                                    </div>
                                </div>}
                                {paymentData.useraddress && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textTitle}>
                                            {t(langKeys.paymentorder_address)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                        <div className={classes.textField}>
                                            {paymentData?.useraddress}
                                        </div>
                                    </div>
                                </div>}
                                {paymentData.currency && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
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
                                </div>}
                                {paymentData.totalamount && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '20px' }}>
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
                                </div>}
                                {(publicKey && paymentData.totalamount) && <CulqiModal
                                    amount={Math.round(((paymentData.totalamount * 100) + Number.EPSILON) * 100) / 100}
                                    buttontitle={t(langKeys.proceedpayment)}
                                    callbackOnSuccess={fetchData}
                                    corpid={paymentData.corpid}
                                    currency={paymentData.currency}
                                    description={paymentData.concept}
                                    disabled={false}
                                    paymentorderid={paymentData.paymentorderid}
                                    orgid={paymentData.orgid}
                                    publickey={publicKey}
                                    successmessage={t(langKeys.success)}
                                    title={paymentData.description}
                                    type="PAYMENTORDER"
                                >
                                </CulqiModal>}
                            </div>
                        </div>
                        <Popus />
                    </Container>
                )
            }
            else {
                return (
                    <div className={classes.back}>
                        <div className={classes.containerFinish}>
                            <div style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.paymentorder_paid)}</div>
                            <div style={{ marginTop: 16, textAlign: 'center' }} >{t(langKeys.paymentorder_paid_description)}</div>
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

export default PaymentOrder;