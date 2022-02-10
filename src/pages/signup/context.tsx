import { makeStyles } from '@material-ui/core';
import { IRequestBody } from '@types';
import { useSelector } from 'hooks';
import { langKeys } from 'lang/keys';
import React, { FC, useState, createContext, useMemo, CSSProperties, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { executeSubscription, verifyPlan } from 'store/signup/actions';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import paths from 'common/constants/paths';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type PlanType = "BASIC" | "PRO" | "PREMIUM" | "ENTERPRISE" | "ADVANCED";
interface Subscription {
    commonClasses: ReturnType<typeof useStyles>;
    FBButtonStyles: CSSProperties;
    foreground: keyof ListChannels | undefined;
    step: number;
    confirmations: number;
    setConfirmations: SetState<number>;
    setStep: SetState<number>;
    finishreg: () => void;
    setForeground: SetState<keyof ListChannels | undefined>;
    resetChannels: () => void;
    addChannel: (option: keyof ListChannels) => void;
    deleteChannel: (option: keyof ListChannels) => void;
    toggleChannel: (option: keyof ListChannels) => void;
}

export interface RouteParams {
    token: PlanType;
}
export interface ListChannels2 {
    facebook: boolean;
    instagram: boolean;
    instagramDM: boolean;
    messenger: boolean;
    whatsapp: boolean;
    telegram: boolean;
    twitter: boolean;
    twitterDM: boolean;
    chatWeb: boolean;
    email: boolean;
    phone: boolean;
    sms: boolean;
    android: boolean;
    apple: boolean;
}

export interface ListChannels {
    facebook?: IRequestBody;
    instagram?: IRequestBody;
    instagramDM?: IRequestBody;
    messenger?: IRequestBody;
    whatsapp?: IRequestBody;
    telegram?: IRequestBody;
    twitter?: IRequestBody;
    twitterDM?: IRequestBody;
    chatWeb?: IRequestBody;
    email?: IRequestBody;
    phone?: IRequestBody;
    sms?: IRequestBody;
    android?: IRequestBody;
    apple?: IRequestBody;
}

export interface MainData {
    email: string;
    password: string;
    confirmpassword: string;
    firstandlastname: string;
    companybusinessname: string;
    mobilephone: string;
    join_reason: string;
    country: string;
    countryname: string;
    currency: string;
    doctype: number;
    docnumber: string;
    businessname: string;
    fiscaladdress: string;
    billingcontact: string;
    billingcontactmail: string;
    autosendinvoice: boolean;

    facebookid: string;
    googleid: string;

    industry: string;
    companysize: string;
    rolecompany: string;

    channels: ListChannels;
}

const defaultListChannels: ListChannels = {
    facebook: undefined,
    instagram: undefined,
    instagramDM: undefined,
    messenger: undefined,
    whatsapp: undefined,
    telegram: undefined,
    twitter: undefined,
    twitterDM: undefined,
    chatWeb: undefined,
    email: undefined,
    phone: undefined,
    sms: undefined,
    android: undefined,
    apple: undefined,
};

export const SubscriptionContext = createContext<Subscription>({
    FBButtonStyles: {},
    commonClasses: {} as any,
    foreground: undefined,
    step: 0,
    confirmations: 0,
    setConfirmations: () => {},
    setStep: () => {},
    finishreg: () => {},
    setForeground: () => {},
    addChannel: () => {},
    deleteChannel: () => {},
    resetChannels: () => {},
    toggleChannel: () => {},
});

const useStyles = makeStyles(theme => ({
    root: {
        padding: '2em 15%',
        border: '1px solid black',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.56em',
        position: 'relative',
    },
    leadingIcon: {
        position: 'absolute',
        top: 10,
        left: 14,
        width: 32,
        height: 32,
        fill: 'gray',
        // stroke: 'red',
    },
    trailingIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "100%"
    },
}));

const FBButtonStyles: CSSProperties = {
    fontSize: 14,
    marginTop: 8,
    maxHeight: 40,
    height: 40,
    backgroundColor: "#7721ad",
    borderColor: "#7721ad",
    boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    textTransform: "none",
    display: "flex",
    textAlign: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
};

export const SubscriptionProvider: FC = ({ children }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const match = useRouteMatch<RouteParams>();
    const [waitSave, setWaitSave] = useState(false);
    const [confirmations, setConfirmations] = useState(0);
    const planData = useSelector(state => state.signup.verifyPlan);
    const [foreground, setForeground] = useState<keyof ListChannels | undefined>(undefined);
    const form = useForm<MainData>({
        defaultValues: {
            email: "",
            password: "",
            confirmpassword: "",
            firstandlastname: "",
            companybusinessname: "",
            mobilephone: "",
            facebookid: "",
            googleid: "",
            join_reason: "",
            country: "PE",
            countryname: "PERU",
            currency: "PEN",
            doctype: 0,
            docnumber: "",
            businessname: "",
            fiscaladdress: "",
            billingcontact: "",
            billingcontactmail: "",
            autosendinvoice: true,
    
            companysize: "",
            industry: "",
            rolecompany: "",

            channels: {},
        },
    })
    const [step, setStep] = useState(1);
    const executeResult = useSelector(state => state.signup.insertChannel);

    useEffect(() => {
        if (!planData.loading) {
            if (planData.error) {
                window.open(paths.SIGNIN, "_self");
            }
        }
    }, [planData]);

    useEffect(() => {
        dispatch(verifyPlan(match.params.token));
    }, [dispatch, match.params.token]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showBackdrop(false));
                setStep(4); // rating
                let msg = t(langKeys.successful_sign_up);
                const googleid = form.getValues('googleid');
                const facebookid = form.getValues('facebookid');
                if (googleid || facebookid) {
                    msg = t(langKeys.successful_sign_up);
                }
                dispatch(showSnackbar({
                    show: true,
                    success: true,
                    message: msg,
                }));
                setWaitSave(false);
            } else if (executeResult.error) {
                dispatch(showBackdrop(false));
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({
                    show: true,
                    success: false,
                    message: errormessage,
                }))
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave, form.getValues, dispatch])

    const deleteChannel = (option: keyof ListChannels) => {
        if (foreground === option) setForeground(undefined);
        form.unregister(`channels.${option}`);
    }

    const addChannel = (option: keyof ListChannels) => {
        form.register(`channels.${option}`, {
            value: { method: "", parameters: {} },
        });
    }

    const toggleChannel = (option: keyof ListChannels) => {
        const v = form.getValues(`channels.${option}`);
        if (v === undefined) {
            addChannel(option);
        } else {
            deleteChannel(option);
        }
    }

    const resetChannels = () => form.setValue('channels', {});

    /*const selectedChannels = useMemo(() => {
        console.log('selectedChannels useMemo');
        const channels = form.getValues('channels');
        return Object.
            keys(channels).
            filter(key => channels[key as keyof ListChannels] !== undefined).
            length;
    }, [form.getValues('channels')]);*/

    const finishreg = () => form.handleSubmit(onSubmit, onError)

    const onSubmit: SubmitHandler<MainData> = (data) => {
        const { channels, ...mainData } = data;
        const majorfield = {
            method: "UFN_CREATEZYXMEACCOUNT_INS",
            parameters: {
                ...mainData,
                paymentplanid: planData.data[0].paymentplanid,
                paymentplan: planData.data[0].plan,
                sunatcountry: "",
            },
            channellist: Object.values(channels),
        }
        dispatch(showBackdrop(true));
        setWaitSave(true);
        dispatch(executeSubscription(majorfield));
    }

    const onError: SubmitErrorHandler<MainData> = (err) => {
        dispatch(showSnackbar({
            message: "Debe completar el/los canal/es",
            show: true,
            success: false,
        }))
    }

    return (
        <SubscriptionContext.Provider value={{
            commonClasses: classes,
            foreground,
            step,
            confirmations,
            setConfirmations,
            setStep,
            finishreg,
            setForeground,
            addChannel,
            deleteChannel,
            resetChannels,
            toggleChannel,
            FBButtonStyles,
        }}>
            <FormProvider {...form}>
                {children}
            </FormProvider>
        </SubscriptionContext.Provider>
    )
}

export function useChannelsCount() {
    const channels = useWatch<MainData>({
        name: 'channels',
        defaultValue: {},
    }) as ListChannels;
    return useMemo(() => {
        console.log('useChannelsCount useMemo')
        return Object.keys(channels).length;
    }, [channels]);
}

interface PlanData {
    loading: boolean;
    plan: {
        limitChannels: number,
        plan: PlanType,
        provider: string,
    } | null
}

export function usePlanData(): PlanData {
    const match = useRouteMatch<RouteParams>();
    const planData = useSelector(state => state.signup.verifyPlan);
    return useMemo(() => {
        if (planData.loading) {
            return {
                loading: true,
                plan: null,
            };
        }

        return {
            loading: false,
            plan: {
                // ...planData.data[0],
                limitChannels: planData.data[0]?.channelscontracted || 0,
                plan: match.params.token as PlanType,
                provider: planData.data[0]?.providerwhatsapp || "",
            },
        };
    }, [planData, match.params.token]);
}
