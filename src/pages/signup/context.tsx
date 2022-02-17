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
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import paths from 'common/constants/paths';
import { resetInsertChannel } from 'store/channel/actions';

class SubmitObservable {
    private listeners: (() => void)[];

    constructor() {
        this.listeners = [];
    }

    addListener(run: () => void) {
        this.listeners.push(run);
    }

    removeListener(run: () => void) {
        const i = this.listeners.indexOf(run);
        if (i === -1) return;

        this.listeners.splice(i, 1);
    }

    trigger() {
        for(const runnable of this.listeners) {
            runnable();
        }
    }
}

const submitObs = new SubmitObservable();

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type PlanType = "BASIC" | "PRO" | "PREMIUM" | "ENTERPRISE" | "ADVANCED";
interface Subscription {
    selectedChannels: number;
    commonClasses: ReturnType<typeof useStyles>;
    FBButtonStyles: CSSProperties;
    foreground: keyof ListChannels | undefined;
    step: number;
    confirmations: number;
    listchannels: ListChannels;
    setConfirmations: SetState<number>;
    setStep: SetState<number>;
    finishreg: () => void;
    setForeground: SetState<keyof ListChannels | undefined>;
    resetChannels: () => void;
    addChannel: (option: keyof ListChannels) => void;
    deleteChannel: (option: keyof ListChannels) => void;
    toggleChannel: (option: keyof ListChannels) => void;
    submitObservable: SubmitObservable;
}

export interface RouteParams {
    token: PlanType;
}
export interface ListChannels {
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

export interface FacebookChannel {
    description: string;
    communicationchannelsite: string;
    communicationchannelowner: string;
    siteid: string;
    accesstoken: string;
    build: (v: Omit<FacebookChannel, 'build'>) => IRequestBody;
}

export interface WhatsAppChannel {
    description: string;
    accesstoken: string;
    brandName: string;
    brandAddress: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    customerfacebookid: string;
    phonenumberwhatsappbusiness: string;
    nameassociatednumber: string;
    communicationchannelowner: string;
    build: (v: Omit<WhatsAppChannel, 'build'>) => IRequestBody;
}

export interface TwitterChannel {
    description: string;
    consumerkey: string;
    consumersecret: string;
    accesstoken: string;
    accesssecret: string;
    devenvironment: string;
    communicationchannelowner: string;
    build: (v: Omit<TwitterChannel, 'build'>) => IRequestBody;
}

export interface TelegramChannel {
    description: string;
    accesstoken: string;
    communicationchannelowner: string;
    build: (v: Omit<TelegramChannel, 'build'>) => IRequestBody;
}

export interface MobileChannel {
    description: string;
    build: (v: Omit<MobileChannel, 'build'>) => IRequestBody;
}

export interface ChatWebChannel {
    description: string;
    build: (v: Omit<ChatWebChannel, 'build'>) => IRequestBody;
}

export interface Channels {
    facebook: FacebookChannel;
    instagram: FacebookChannel;
    instagramDM: FacebookChannel;
    messenger: FacebookChannel;
    whatsapp: WhatsAppChannel;
    telegram: TelegramChannel;
    twitter: TwitterChannel;
    twitterDM: TwitterChannel;
    chatWeb: ChatWebChannel;
    email: any;
    phone: any;
    sms: any;
    android: MobileChannel;
    apple: MobileChannel;
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

    channels: Channels;
}

const defaultListChannels: ListChannels = {
    facebook: false,
    instagram: false,
    instagramDM: false,
    messenger: false,
    whatsapp: false,
    telegram: false,
    twitter: false,
    twitterDM: false,
    chatWeb: false,
    email: false,
    phone: false,
    sms: false,
    android: false,
    apple: false,
};

export const SubscriptionContext = createContext<Subscription>({
    selectedChannels: 0,
    FBButtonStyles: {},
    commonClasses: {} as any,
    foreground: undefined,
    step: 0,
    confirmations: 0,
    listchannels: defaultListChannels,
    setConfirmations: () => {},
    setStep: () => {},
    finishreg: () => {},
    setForeground: () => {},
    addChannel: () => {},
    deleteChannel: () => {},
    resetChannels: () => {},
    toggleChannel: () => {},
    submitObservable: new SubmitObservable(),
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
    rootError: {
        border: '2px solid red',
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
    const [confirmations, setConfirmations] = useState(0);
    const planData = useSelector(state => state.signup.verifyPlan);
    const [listchannels, setlistchannels] = useState<ListChannels>(defaultListChannels);
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
            doctype: 1,
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
        if (!planData.loading && planData.error) {
            window.open(paths.SIGNIN, "_self");
        }

        return () => {
            dispatch(resetInsertChannel());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [planData]);

    useEffect(() => {
        dispatch(verifyPlan(match.params.token));
    }, [dispatch, match.params.token]);

    // useEffect(() => {
    //     if (waitSave) {
    //         if (!executeResult.loading && !executeResult.error) {
    //             console.log('success', executeResult);
    //             dispatch(showBackdrop(false));
    //             setStep(4); // rating
    //             let msg = t(langKeys.successful_sign_up);
    //             const googleid = form.getValues('googleid');
    //             const facebookid = form.getValues('facebookid');
    //             if (googleid || facebookid) {
    //                 msg = t(langKeys.successful_sign_up);
    //             }
    //             dispatch(showSnackbar({
    //                 show: true,
    //                 success: true,
    //                 message: msg,
    //             }));
    //             setWaitSave(false);
    //         } else if (executeResult.error) {
    //             console.log('error', executeResult);
    //             dispatch(showBackdrop(false));
    //             const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
    //             dispatch(showSnackbar({
    //                 show: true,
    //                 success: false,
    //                 message: errormessage,
    //             }))
    //             setWaitSave(false);
    //         }
    //     }

    //     return () => {
    //         dispatch(resetInsertChannel());
    //     }
    // }, [executeResult, waitSave, form.getValues, dispatch])

    useEffect(() => {
        if (executeResult.loading === true) return;
        if (executeResult.value && !executeResult.error) {
            console.log('success', executeResult);
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
        } else if (executeResult.error) {
            console.log('error', executeResult);
            dispatch(showBackdrop(false));
            const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
            dispatch(showSnackbar({
                show: true,
                success: false,
                message: errormessage,
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executeResult, form.getValues, dispatch])

    const deleteChannel = (option: keyof ListChannels) => {
        setlistchannels(prev => {
            const v = prev[option];
            if (foreground === option) setForeground(undefined);
            
            if (v === false) return prev;
            return {
                ...prev,
                [option]: false,
            };
        });
    }

    const addChannel = (option: keyof ListChannels) => {
        setlistchannels(prev => {
            const v = prev[option];
            if (v === true) return prev;
            return {
                ...prev,
                [option]: true,
            };
        });
    }

    const toggleChannel = (option: keyof ListChannels) => {
        setlistchannels(prev => {
            const value = !prev[option];
            if (!value && foreground === option) {
                setForeground(undefined);
            }
            return {
                ...prev,
                [option]: value,
            };
        });
    }

    const resetChannels = () => setlistchannels(defaultListChannels);

    const selectedChannels = useMemo(() => {
        return Object.keys(listchannels)
            .filter(key => listchannels[key as keyof ListChannels] === true)
            .length;
    }, [listchannels]);

    const finishreg = () => {
        form.handleSubmit(onSubmit, onError)();
        submitObs.trigger();
    }

    const onSubmit: SubmitHandler<MainData> = (data) => {
        const { channels, ...mainData } = data;
        const majorfield = {
            method: "UFN_CREATEZYXMEACCOUNT_INS",
            parameters: {
                ...mainData,
                firstname: mainData.firstandlastname,
                lastname: "",
                username: mainData.email,
                contactemail: mainData.billingcontactmail,
                contact: mainData.billingcontact,
                organizationname: mainData.companybusinessname,
                phone: mainData.mobilephone,
                industry: mainData.industry,
                companysize: mainData.companysize,
                rolecompany: mainData.rolecompany,
                paymentplanid: planData.data[0].paymentplanid,
                paymentplan: planData.data[0].plan,
                sunatcountry: mainData.country,
                timezoneoffset: (new Date().getTimezoneOffset() / 60) * -1,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            channellist: Object.values(channels).map(
                function<T extends {build: (v: any) => IRequestBody}>(x: T) {
                    return x.build(x);
                }
            ),
        };
        dispatch(showBackdrop(true));
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
            selectedChannels,
            commonClasses: classes,
            foreground,
            step,
            confirmations,
            listchannels,
            setConfirmations,
            setStep,
            finishreg,
            setForeground,
            addChannel,
            deleteChannel,
            resetChannels,
            toggleChannel,
            FBButtonStyles,
            submitObservable: submitObs,
        }}>
            <FormProvider {...form}>
                {children}
            </FormProvider>
        </SubscriptionContext.Provider>
    )
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
