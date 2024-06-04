import CircularProgress from '@material-ui/core/CircularProgress';
import CulqiModal from 'components/fields/CulqiModal';
import Popus from 'components/layout/Popus'; import React, { FC, useEffect, useState } from 'react';

import { apiUrls } from 'common/constants';
import { langKeys } from 'lang/keys';
import { makeStyles } from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { Dictionary } from '@types';
import { getCollectionPaymentOrder } from 'store/main/actions';
import { paymentOrderSel, formatNumber } from 'common/helpers';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { LaraigoLogo } from 'icons';

const useStyles = makeStyles(theme => ({
    containerMain: {
        display: 'flex',
        alignItems: 'center'
    },
    back: {
        display: 'flex',
        justifyContent: 'center',
    },
    containerSuccess: {
        minHeight: "90vh",
        marginTop: 20,
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        width: '440px',
        minWidth: '380px',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            width: '70vw',
        },
        flexDirection: 'column',
        flexWrap: 'wrap',
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
        border: apiUrls.BODEGAACME ? '1px solid #6127B1' : '1px solid #7721AD',
        background: apiUrls.BODEGAACME ? '#6127B1' : '#7721AD',
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
                    if (apiUrls.BODEGAACME) {
                        if (mainResult.data[0].paymentstatus === "ACME") {
                            window.open("https://wa.me/51994204479", '_blank');
                            window.open("about:blank", "_self");
                            window.close();
                        }
                        else {
                            setPaymentData(mainResult.data[0]);

                            const authCredentials = JSON.parse(mainResult.data[0].authcredentials || {});

                            if (authCredentials) {
                                setPublicKey(authCredentials.publicKey);
                            }
                        }
                    }
                    else {
                        setPaymentData(mainResult.data[0]);

                        const authCredentials = JSON.parse(mainResult.data[0].authcredentials || {});

                        if (authCredentials) {
                            setPublicKey(authCredentials.publicKey);
                        }
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
                dispatch(showSnackbar({ show: true, severity: "success", message: String(t(culqiResult.message || langKeys.success)) }))
                dispatch(showBackdrop(false));
                setWaitPay(false);
            }
            else if (culqiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: String(t(culqiResult.message || langKeys.error_cos_unexpected)) }))
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
                    <div className={classes.back}>
                        <div className={classes.containerSuccess}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {!apiUrls.BODEGAACME && <LaraigoLogo style={{ height: 120, margin: '20px', width: "auto" }} />}
                                {apiUrls.BODEGAACME && <img src={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/BODEGA%20ACME/40016109-be7d-4aa7-9287-743d35fcc05d/470e9a59-bbaa-4742-ba5b-e4aa1c21d865_waifu2x_art_noise3_scale.png'} style={{ height: 120, margin: '20px' }} />}
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
                                        {apiUrls.BODEGAACME ? paymentData?.paymentorderid : paymentData?.ordercode}
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
                            {paymentData.userdocument && <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginBottom: '2px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                    <div className={classes.textTitle}>
                                        {t(langKeys.paymentorder_document)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '100%', flex: 1 }}>
                                    <div className={classes.textField}>
                                        {paymentData?.userdocument}
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
                        <Popus />
                    </div>
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