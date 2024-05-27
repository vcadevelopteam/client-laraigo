import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Popus from 'components/layout/Popus';
import React, { FC, useEffect, useState } from 'react';

import { apiUrls } from '../common/constants/apiUrls';
import { Dictionary } from '@types';
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
        width: '440px',
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

export const PaymentOrderNiubiz: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const resultSessionToken = useSelector(state => state.payment.requestNiubizCreateSessionToken);

    const { corpid, orgid, ordercode }: any = useParams();

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [paymentData, setPaymentData] = useState<Dictionary | null>(null);
    const [waitData, setWaitData] = useState(false);

    const openprivacypolicies = () => {
        window.open("/privacy", "_blank");
    }

    const fetchData = () => {
        dispatch(niubizCreateSessionToken({ corpid: corpid, orgid: orgid, ordercode: ordercode }));
        setWaitData(true);
    }

    const importUrlScript = (url: string) => {
        const script = document.createElement('script');

        script.async = true;
        script.src = url;
        script.type = "text/javascript";

        document.body.appendChild(script);
    };

    const importManualScript = (data: any) => {
        const script = document.createElement('script');

        script.setAttribute('type', 'module');

        script.async = true;
        script.text = `document.getElementById('paymentButton').addEventListener('click', () => {
            VisanetCheckout.configure({
                sessiontoken:'${data.sessiontoken}',
                channel:'web',
                merchantid:'${data.merchantid}',
                purchasenumber:'${data.paymentorderid}',
                amount:'${formatNumber(data?.totalamount || 0).split(',').join('')}',
                expirationminutes:'20',
                timeouturl:'${window.location.href}',
                merchantlogo:'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/1f93f067-12aa-46d6-9247-77ae40058c7d/Logo%20Laraigo-removebg-preview%20%281%29_waifu2x_art_noise3.png',
                action:'${apiUrls.PAYMENTORDER_NIUBIZ_AUTHORIZETRANSACTION}?corpid=${corpid}&orgid=${orgid}&ordercode=${ordercode}&totalamount=${data?.totalamount || 0}',
                complete: function(params) {
                  location.reload();
                }
              });
              VisanetCheckout.open();
        });`;

        document.body.appendChild(script);
    };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (waitData) {
            if (!resultSessionToken.loading && !resultSessionToken.error) {
                dispatch(showBackdrop(false));
                setWaitData(false);

                if (resultSessionToken.data) {
                    if (apiUrls.BODEGAACME) {
                        if (resultSessionToken.data.paymentstatus === "ACME") {
                            window.open("https://wa.me/51994204479", '_blank');
                            window.open("about:blank", "_self");
                            window.close();
                        }
                        else {
                            setPaymentData(resultSessionToken.data);
                            importUrlScript(`${resultSessionToken.data.sessionscript}`);
                            importManualScript(resultSessionToken.data);
                        }
                    }
                    else {
                        setPaymentData(resultSessionToken.data);
                        importUrlScript(`${resultSessionToken.data.sessionscript}`);
                        importManualScript(resultSessionToken.data);
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
            if (paymentData.paymentstatus === "PENDING") {
                return (<>
                    <Container component="main" maxWidth="xs" className={classes.containerMain}>
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
                                {(paymentData.totalamount && paymentData.sessiontoken) && <div style={{ width: '100%' }}>
                                    <FormControlLabel
                                        control={(
                                            <Checkbox
                                                checked={termsAccepted}
                                                color="primary"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setTermsAccepted(true);
                                                    }
                                                    else {
                                                        setTermsAccepted(false);
                                                    }
                                                }}
                                            />
                                        )}
                                        label={<div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                            <span>{t(langKeys.paymentorder_termandconditions)}<b style={{ color: apiUrls.BODEGAACME ? '#6127B1' : '#7721AD' }} onClick={(e: any) => { e.preventDefault(); openprivacypolicies() }}>{t(langKeys.paymentorder_termandconditionsnext)}</b></span>
                                        </div>}
                                    />
                                </div>}
                                {(paymentData.totalamount && paymentData.sessiontoken) && <>
                                    <Button
                                        id='paymentButton'
                                        variant="contained"
                                        color="primary"
                                        type="button"
                                        startIcon={<AttachMoneyIcon color="secondary" />}
                                        style={{ backgroundColor: "#55BD84", marginTop: 10 }}
                                        disabled={resultSessionToken.loading || !termsAccepted}
                                    >{t(langKeys.proceedpayment)}
                                    </Button>
                                </>}
                                {paymentData.laststatus && <>
                                    <div className={classes.alertDiv} style={{ marginTop: paymentData.sessiontoken ? '20px' : '0px' }}>
                                        {paymentData.laststatus === 'Accept' ? t(langKeys.paymentorder_cardnotvalid) : paymentData.laststatus}
                                    </div>
                                </>}
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

export default PaymentOrderNiubiz;