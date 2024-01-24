import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import React, { FC, useEffect, useState } from "react";

import { apiUrls } from "common/constants";
import { balance, charge, paymentOrder, resetBalance, resetCharge, resetPaymentOrder } from "store/culqi/actions";
import { Button } from "@material-ui/core";
import { Culqi, CulqiProvider } from "react-culqi";
import { Dictionary } from "@types";
import { langKeys } from "lang/keys";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

const alternatepublickey = apiUrls.CULQIKEY;

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
    invoiceid?: number;
    metadata?: Dictionary;
    options?: CulqiOptionsProps;
    orgid?: number;
    override?: boolean;
    paymentorderid?: number;
    publickey?: string;
    purchaseorder?: string;
    reference?: string;
    successmessage?: string;
    title: string;
    totalamount?: number;
    totalpay?: number;
    type?: "CHARGE" | "BALANCE" | "PAYMENTORDER";
}

const CulqiModal: FC<CulqiModalProps> = ({
    amount,
    buttontitle,
    buyamount,
    callbackOnSuccess,
    comments,
    corpid = 0,
    currency = "USD",
    description,
    disabled = false,
    invoiceid,
    metadata,
    options = {},
    orgid = 0,
    override,
    paymentorderid,
    publickey,
    purchaseorder,
    reference,
    successmessage,
    title,
    totalamount,
    totalpay,
    type = "CHARGE",
}) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const culqiSelector = useSelector((state) => state.culqi.request);

    const [waitPay, setWaitPay] = useState(false);

    const createCharge = (token: any) => {
        dispatch(
            charge({
                comments,
                corpid,
                invoiceid,
                metadata,
                orgid,
                override,
                purchaseorder,
                settings: { amount, currency, description, title },
                token,
            })
        );
        dispatch(showBackdrop(true));
        setWaitPay(true);
    };

    const createBalance = (token: any) => {
        dispatch(
            balance({
                buyamount,
                comments,
                corpid,
                invoiceid,
                metadata,
                orgid,
                purchaseorder,
                reference,
                settings: { amount, currency, description, title },
                token,
                totalamount,
                totalpay,
            })
        );
        dispatch(showBackdrop(true));
        setWaitPay(true);
    };

    const createPaymentOrder = (token: any) => {
        dispatch(
            paymentOrder({
                corpid,
                metadata,
                orgid,
                paymentorderid,
                settings: { amount, currency, description, title },
                token,
            })
        );
        dispatch(showBackdrop(true));
        setWaitPay(true);
    };

    const onToken = (token: any) => {
        switch (type) {
            case "BALANCE":
                createBalance(token);
                break;

            case "CHARGE":
                createCharge(token);
                break;

            case "PAYMENTORDER":
                createPaymentOrder(token);
                break;
        }
    };

    const onError = () => {
        switch (type) {
            case "BALANCE":
                dispatch(resetBalance());
                break;

            case "CHARGE":
                dispatch(resetCharge());
                break;

            case "PAYMENTORDER":
                dispatch(resetPaymentOrder());
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

            case "PAYMENTORDER":
                dispatch(resetPaymentOrder());
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
        <CulqiProvider
            amount={amount}
            currency={currency}
            description={description}
            onError={onError}
            onToken={onToken}
            publicKey={publickey || alternatepublickey}
            title={title}
            options={{
                style: {
                    buttontext: "#FFFFFF",
                    maincolor: "#7721AD",
                    maintext: "#7721AD",
                    ...options,
                },
            }}
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
                    );
                }}
            </Culqi>
        </CulqiProvider>
    );
};

export default CulqiModal;