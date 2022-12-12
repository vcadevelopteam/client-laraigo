/* eslint-disable react-hooks/exhaustive-deps */
import CircularProgress from '@material-ui/core/CircularProgress';
import CulqiModal from 'components/fields/CulqiModal';

import { FC, useEffect, useState } from 'react';
import { langKeys } from 'lang/keys';
import { makeStyles } from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { Dictionary, MultiData } from '@types';
import { getCollectionPaymentOrder, getMultiCollectionAux } from 'store/main/actions';
import { paymentOrderSel, getAppsettingInvoiceSel } from 'common/helpers';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { LaraigoLogo } from 'icons';
import { FieldView } from 'components';

const useStyles = makeStyles(theme => ({
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
        width: '60vw',
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
}));

export const PaymentOrder: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main.mainData);

    const { corpid, orgid, ordercode }: any = useParams();

    const [paymentData, setPaymentData] = useState<Dictionary | null>(null);
    const [publicKey, setPublicKey] = useState('');
    const [waitData, setWaitData] = useState(false);

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
                                <LaraigoLogo style={{ height: 200 }} />
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.paymentorder_success)}</div>
                            {paymentData.ordercode && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_code)}
                                    value={paymentData?.ordercode}
                                />
                            </div>}
                            {paymentData.concept && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_concept)}
                                    value={paymentData?.concept}
                                />
                            </div>}
                            {paymentData.userfirstname && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_firstname)}
                                    value={paymentData?.userfirstname}
                                />
                            </div>}
                            {paymentData.userlastname && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_lastname)}
                                    value={paymentData?.userlastname}
                                />
                            </div>}
                            {paymentData.userphone && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_phone)}
                                    value={paymentData?.userphone}
                                />
                            </div>}
                            {paymentData.usermail && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_mail)}
                                    value={paymentData?.usermail}
                                />
                            </div>}
                            {paymentData.usercountry && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_country)}
                                    value={paymentData?.usercountry}
                                />
                            </div>}
                            {paymentData.usercity && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_city)}
                                    value={paymentData?.usercity}
                                />
                            </div>}
                            {paymentData.useraddress && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_address)}
                                    value={paymentData?.useraddress}
                                />
                            </div>}
                            {paymentData.currency && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_currency)}
                                    value={paymentData?.currency}
                                />
                            </div>}
                            {paymentData.totalamount && <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={t(langKeys.paymentorder_totalamount)}
                                    value={paymentData?.totalamount}
                                />
                            </div>}
                            {(publicKey && paymentData.totalamount) && <CulqiModal
                                type="PAYMENTORDER"
                                invoiceid={paymentData.paymentorderid}
                                title={paymentData.description}
                                description={paymentData.concept}
                                currency={paymentData.currency}
                                amount={Math.round(((paymentData.totalamount * 100) + Number.EPSILON) * 100) / 100}
                                callbackOnSuccess={() => { fetchData() }}
                                buttontitle={t(langKeys.proceedpayment)}
                                purchaseorder={''}
                                comments={''}
                                corpid={paymentData.corpid}
                                orgid={paymentData.orgid}
                                disabled={false}
                                successmessage={t(langKeys.success)}
                                publickey={publicKey}
                                override={false}
                                totalpay={0}
                            >
                            </CulqiModal>}
                        </div>
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