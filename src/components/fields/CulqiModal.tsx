import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import React, { FC, useEffect, useState } from 'react';

import { apiUrls } from 'common/constants';
import { Button } from '@material-ui/core';
import { charge, resetCharge, subscribe, resetSubscribe, balance, resetBalance, paymentOrder, resetPaymentOrder } from 'store/culqi/actions'
import { CulqiProvider, Culqi } from 'react-culqi';
import { Dictionary } from '@types';
import { langKeys } from 'lang/keys';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';

const globalpublickey = apiUrls.CULQIKEY;

interface CulqiOptionsProps {
    buttontext?: string;
    desctext?: string;
    logo?: string;
    maincolor?: string;
    maintext?: string;
}

interface CulqiModalProps {
    amount: number;
    buttontitle?: string;
    buyamount?: number;
    callbackOnSuccess?: () => void;
    comments?: string;
    corpid?: number;
    currency: string;
    description: string;
    disabled?: boolean;
    interval?: string;
    interval_count?: number;
    invoiceid?: number;
    paymentorderid?: number;
    limit?: number;
    metadata?: Dictionary;
    options?: CulqiOptionsProps;
    orgid?: number;
    override?: boolean;
    publickey?: string;
    purchaseorder?: string;
    reference?: string;
    successmessage?: string;
    title: string;
    totalamount?: number;
    totalpay?: number;
    type?: "CHARGE" | "SUBSCRIPTION" | "BALANCE" | "PAYMENTORDER",
}

const CulqiModal: FC<CulqiModalProps> = ({ amount, buttontitle, buyamount, callbackOnSuccess, comments, corpid = 0, currency = "USD", description, disabled = false, interval, interval_count, invoiceid, paymentorderid, limit, metadata, options = {}, orgid = 0, override, publickey, purchaseorder, reference, successmessage, title, totalamount, totalpay, type = "CHARGE" }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const culqiSelector = useSelector(state => state.culqi.request);

    const [waitPay, setWaitPay] = useState(false);

    const createCharge = (token: any) => {
        dispatch(showBackdrop(true));
        dispatch(charge({
            comments,
            corpid,
            invoiceid,
            metadata,
            orgid,
            override,
            purchaseorder,
            settings: { title, description, currency, amount },
            token,
        }));
        setWaitPay(true);
    }

    const createBalance = (token: any) => {
        dispatch(showBackdrop(true));
        dispatch(balance({
            buyamount,
            comments,
            corpid,
            invoiceid,
            metadata,
            orgid,
            purchaseorder,
            reference,
            settings: { title, description, currency, amount },
            token,
            totalamount,
            totalpay,
        }));
        setWaitPay(true);
    }

    const createPaymentOrder = (token: any) => {
        dispatch(showBackdrop(true));
        dispatch(paymentOrder({
            corpid,
            metadata,
            orgid,
            paymentorderid,
            settings: { title, description, currency, amount },
            token,
        }));
        setWaitPay(true);
    }

    const createSubscription = (token: any) => {
        dispatch(showBackdrop(true));
        dispatch(subscribe({
            metadata,
            settings: { title, description, currency, amount, interval, interval_count, limit },
            token,
        }));
        setWaitPay(true);
    }

    const onToken = (token: any) => {
        switch (type) {
            case 'BALANCE':
                createBalance(token);
                break;

            case 'CHARGE':
                createCharge(token);
                break;

            case 'PAYMENTORDER':
                createPaymentOrder(token);
                break;

            case 'SUBSCRIPTION':
                createSubscription(token);
                break;

            default:
                break;
        }
    }

    const onError = () => {
        switch (type) {
            case 'BALANCE':
                dispatch(resetBalance());
                break;

            case 'CHARGE':
                dispatch(resetCharge());
                break;

            case 'PAYMENTORDER':
                dispatch(resetPaymentOrder());
                break;

            case 'SUBSCRIPTION':
                dispatch(resetSubscribe());
                break;
        }
    }

    const resetRequest = () => {
        switch (type) {
            case 'BALANCE':
                dispatch(resetBalance());
                break;

            case 'CHARGE':
                dispatch(resetCharge());
                break;

            case 'PAYMENTORDER':
                dispatch(resetPaymentOrder());
                break;

            case 'SUBSCRIPTION':
                dispatch(resetSubscribe());
                break;
        }
    }

    useEffect(() => {
        if (waitPay) {
            if (!culqiSelector.loading && !culqiSelector.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: `${successmessage ? successmessage : culqiSelector.message}` }))
                dispatch(showBackdrop(false));
                setWaitPay(false);

                resetRequest && resetRequest();
                callbackOnSuccess && callbackOnSuccess();
            }
            else if (culqiSelector.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: `${culqiSelector.message ? culqiSelector.message : t("error_unexpected_error")}` }))
                dispatch(showBackdrop(false));
                setWaitPay(false);

                resetRequest && resetRequest();
            }
        }
    }, [culqiSelector, waitPay]);

    return (
        <CulqiProvider
            amount={amount}
            currency={currency}
            description={description}
            onError={onError}
            onToken={onToken}
            options={{
                style: {
                    maincolor: "#7721AD",
                    buttontext: "#FFFFFF",
                    maintext: "#7721AD",
                    ...options
                }
            }}
            publicKey={publickey || globalpublickey}
            title={title}
        >
            <Culqi>
                {({ openCulqi }: any) => {
                    return (
                        <Button
                            color="primary"
                            disabled={disabled || waitPay}
                            onClick={openCulqi}
                            startIcon={<AttachMoneyIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            type="button"
                            variant="contained"
                        >
                            {buttontitle ? buttontitle : t(langKeys.pay)}
                        </Button>
                    )
                }}
            </Culqi>
        </CulqiProvider>
    );
};

export default CulqiModal;