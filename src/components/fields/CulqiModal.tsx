import { Button } from '@material-ui/core';
import { langKeys } from 'lang/keys';
import { FC, useEffect } from 'react';
import { CulqiProvider, Culqi } from 'react-culqi';
import { useTranslation } from 'react-i18next';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { apiUrls } from 'common/constants';
import { charge, resetCharge, subscribe } from 'store/culqi/actions'
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
    type?: "CHARGE" | "SUBSCRIPTION",
    title: string;
    description: string;
    currency: string;
    amount: number;
    interval?: string;
    interval_count?: number;
    limit?: number;
    options?: CulqiOptionsProps;
    metadata?: Dictionary;
}

const publickey = apiUrls.CULQIKEY;

/*
<CulqiModal
    type="CHARGE"
    title="Basic plan"
    description=""
    currency="USD"
    amount={10000}
></CulqiModal>
*/

const CulqiModal: FC<CulqiModalProps> = ({
    type = "CHARGE",
    title,
    description,
    currency = "USD",
    amount,
    interval,
    interval_count,
    limit,
    options = {},
    metadata
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const culqiSelector = useSelector(state => state.culqi.request);

    const createCharge = (token: any) => {
        dispatch(showBackdrop(true));
        dispatch(charge({
            settings: { title, description, currency, amount },
            token,
            metadata
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
        console.log(token);
        switch (type) {
            case 'CHARGE':
                createCharge(token);
                break;
            case 'SUBSCRIPTION':
                createSubscription(token);
                break;
            default:
                break;
        }
    }

    const onError = (error: any) => {
        console.log(error)
        onError && onError(error);
        dispatch(resetCharge());
    }

    useEffect(() => {
        if (!culqiSelector.loading && culqiSelector.data) {
            dispatch(showSnackbar({ show: true, success: true, message: '' + culqiSelector.message }))
            dispatch(showBackdrop(false));
            console.log(culqiSelector.data);
            dispatch(resetCharge());
        }
        else if (culqiSelector.error) {
            dispatch(showSnackbar({ show: true, success: false, message: '' + culqiSelector.message }))
            dispatch(showBackdrop(false));
            console.log(culqiSelector.data);
            dispatch(resetCharge());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [culqiSelector]);

    return (
    <CulqiProvider
        publicKey={publickey}
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
                    >{t(langKeys.pay)}</Button>
                )
            }}
        </Culqi>
    </CulqiProvider>
  );
};

export default CulqiModal;