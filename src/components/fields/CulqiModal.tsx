import { Button } from '@material-ui/core';
import { langKeys } from 'lang/keys';
import { FC, useEffect } from 'react';
import { CulqiProvider, Culqi } from 'react-culqi';
import { useTranslation } from 'react-i18next';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { apiUrls } from 'common/constants';
import { charge, resetCharge, subscribe, balance, paymentOrder } from 'store/culqi/actions'
import { useDispatch } from 'react-redux';
import { Dictionary } from '@types';
import { useSelector } from 'hooks';
import { showBackdrop, showSnackbar } from 'store/popus/actions';

interface CulqiOptionsProps {
    maincolor?: string;
    buttontext?: string;
    maintext?: string;
    desctext?: string;
    logo?: string;
}

interface CulqiModalProps {
    invoiceid?: number
    type?: "CHARGE" | "SUBSCRIPTION" | "BALANCE" | "PAYMENTORDER",
    title: string;
    description: string;
    currency: string;
    amount: number;
    interval?: string;
    interval_count?: number;
    limit?: number;
    options?: CulqiOptionsProps;
    callbackOnSuccess?: () => void;
    metadata?: Dictionary;
    buttontitle?: string;
    purchaseorder?: string;
    comments?: string;
    disabled?: boolean;
    corpid?: number;
    orgid?: number;
    successmessage?: string;
    publickey?: string;
    override?: boolean;
    reference?: string;
    buyamount?: number;
    totalpay?: number;
    totalamount?: number;
}

const globalpublickey = apiUrls.CULQIKEY;

const CulqiModal: FC<CulqiModalProps> = ({
    invoiceid,
    type = "CHARGE",
    title,
    description,
    currency = "USD",
    amount,
    interval,
    interval_count,
    limit,
    options = {},
    metadata,
    callbackOnSuccess,
    buttontitle,
    purchaseorder,
    comments,
    disabled = false,
    corpid = 0,
    orgid = 0,
    successmessage,
    publickey,
    override,
    reference,
    buyamount,
    totalpay,
    totalamount,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const culqiSelector = useSelector(state => state.culqi.request);

    const createCharge = (token: any) => {
        dispatch(showBackdrop(true));
        dispatch(charge({
            invoiceid,
            settings: { title, description, currency, amount },
            token,
            metadata,
            purchaseorder,
            comments,
            corpid,
            orgid,
            override,
        }));
    }

    const createBalance = (token: any) => {
        dispatch(showBackdrop(true));
        dispatch(balance({
            invoiceid,
            settings: { title, description, currency, amount },
            token,
            metadata,
            corpid,
            orgid,
            reference,
            buyamount,
            comments,
            purchaseorder,
            totalpay,
            totalamount,
        }));
    }

    const payPaymentOrder = (token: any) => {
        dispatch(showBackdrop(true));
        dispatch(paymentOrder({
            paymentorderid: invoiceid,
            settings: { title, description, currency, amount },
            token,
            metadata,
            corpid,
            orgid,
            reference,
            buyamount,
            comments,
            purchaseorder,
            totalpay,
            totalamount,
        }));
    }

    const createSubscription = (token: any) => {
        dispatch(showBackdrop(true));
        dispatch(subscribe({
            settings: { title, description, currency, amount, interval, interval_count, limit },
            token,
            metadata
        }));
    }

    const onToken = (token: any) => {
        switch (type) {
            case 'CHARGE':
                createCharge(token);
                break;
            case 'SUBSCRIPTION':
                createSubscription(token);
                break;
            case 'BALANCE':
                createBalance(token);
                break;
            case 'PAYMENTORDER':
                payPaymentOrder(token);
                break;
            default:
                break;
        }
    }

    const onError = (error: any) => {
        console.warn(error)
        dispatch(resetCharge());
    }

    useEffect(() => {
        if (!culqiSelector.loading && culqiSelector.data) {
            dispatch(showSnackbar({ show: true, severity: "success", message: '' + (successmessage ? successmessage : culqiSelector.message) }))
            dispatch(showBackdrop(false));
            dispatch(resetCharge());
            callbackOnSuccess && callbackOnSuccess()
        }
        else if (culqiSelector.error) {
            dispatch(showSnackbar({ show: true, severity: "error", message: '' + culqiSelector.message }))
            dispatch(showBackdrop(false));
            dispatch(resetCharge());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [culqiSelector]);

    return (
        <CulqiProvider
            publicKey={publickey || globalpublickey}
            title={title}
            description={description}
            currency={currency}
            amount={amount}
            onToken={onToken}
            onError={onError}
            options={{
                style: {
                    maincolor: "#7721AD",
                    buttontext: "#FFFFFF",
                    maintext: "#7721AD",
                    ...options
                }
            }}
        >
            <Culqi>
                {({ openCulqi, setAmount, amount }: any) => {
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            startIcon={<AttachMoneyIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={openCulqi}
                            disabled={disabled}
                        >{buttontitle ? buttontitle : t(langKeys.pay)}</Button>
                    )
                }}
            </Culqi>
        </CulqiProvider>
    );
};

export default CulqiModal;