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
import { validateChannels } from 'store/subscription/actions';
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
        for (const runnable of this.listeners) {
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
    valchannels: () => void;
    onCheckFunc: (altf: any) => void;
    setForeground: SetState<keyof ListChannels | undefined>;
    resetChannels: () => void;
    addChannel: (option: keyof ListChannels) => void;
    deleteChannel: (option: keyof ListChannels) => void;
    toggleChannel: (option: keyof ListChannels) => void;
    submitObservable: SubmitObservable;
    form: any;
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
    voximplantphone: boolean;
    tiktok: boolean;
    youtube: boolean;
    business: boolean;
    linkedin: boolean;
    teams: boolean;
    blogger: boolean;
    webForm: boolean;
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
export interface VoxImplantPhoneChannel {
    description: string;
    country: string;
    category: string;
    region: string;
    state: string;
    countryname: string;
    categoryname: string;
    regionname: string;
    statename: string;
    cost: number;
    costvca: string;
    costinstallation: number;
    recording: boolean,
    sms: boolean,
    outbound: boolean,
    recordingstorage: string,
    recordingquality: string,
    voximplantcallsupervision: boolean,
    build: (v: Omit<VoxImplantPhoneChannel, 'build'>) => IRequestBody;
}

export interface TikTokChannel {
    description: string;
    account: string;
    url: string;
    build: (v: Omit<TikTokChannel, 'build'>) => IRequestBody;
}

export interface YouTubeChannel {
    description: string;
    accesstoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    idtoken: string;
    channel: string;
    build: (v: Omit<YouTubeChannel, 'build'>) => IRequestBody;
}

export interface BusinessChannel {
    description: string;
    accesstoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    idtoken: string;
    channel: string;
    build: (v: Omit<BusinessChannel, 'build'>) => IRequestBody;
}

export interface LinkedInChannel {
    description: string;
    account: string;
    url: string;
    build: (v: Omit<LinkedInChannel, 'build'>) => IRequestBody;
}

export interface TeamsChannel {
    description: string;
    account: string;
    url: string;
    build: (v: Omit<TeamsChannel, 'build'>) => IRequestBody;
}

export interface BloggerChannel {
    description: string;
    accesstoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    idtoken: string;
    channel: string;
    build: (v: Omit<BloggerChannel, 'build'>) => IRequestBody;
}

export interface EmailChannel {
    description: string;
    apikey: string;
    url: string;
    emittername: string;
    accesstoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    idtoken: string;
    type: string;
    build: (v: Omit<EmailChannel, 'build'>) => IRequestBody;
}

export interface SmsChannel {
    description: string;
    apikey: string;
    url: string;
    emittername: string;
    build: (v: Omit<SmsChannel, 'build'>) => IRequestBody;
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
    email: EmailChannel;
    sms: SmsChannel;
    tiktok: TikTokChannel,
    youtube: YouTubeChannel,
    linkedin: LinkedInChannel,
    teams: TeamsChannel,
    blogger: BloggerChannel,
    business: BusinessChannel,
    android: MobileChannel;
    apple: MobileChannel;
    voximplantphone: VoxImplantPhoneChannel;
    phone: any;
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
    firstname: string;
    lastname: string;
    pmemail: string;
    pmphone: string;
    firstnamecard: string;
    lastnamecard: string;
    creditcard: string;
    mm: number;
    yyyy: string;
    securitycode: string;
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
    voximplantphone: false,
    tiktok: false,
    youtube: false,
    business: false,
    linkedin: false,
    teams: false,
    blogger: false,
    webForm: false,
};

export const SubscriptionContext = createContext<Subscription>({
    selectedChannels: 0,
    FBButtonStyles: {},
    commonClasses: {} as any,
    foreground: undefined,
    step: 0,
    confirmations: 0,
    listchannels: defaultListChannels,
    setConfirmations: () => { },
    setStep: () => { },
    finishreg: () => { },
    valchannels: () => { },
    onCheckFunc: (altf: any) => { },
    setForeground: () => { },
    addChannel: () => { },
    deleteChannel: () => { },
    resetChannels: () => { },
    toggleChannel: () => { },
    submitObservable: new SubmitObservable(),
    form: {},
});

const useStyles = makeStyles(theme => ({
    root: {
        padding: '3.5em 5%',
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
    const [validateBool, setValidateBool] = useState(false);
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
            pmemail: "",
            pmphone: "",
            firstnamecard: "",
            lastnamecard: "",
            creditcard: "",
            mm: 0,
            yyyy: "",
            securitycode: "",
            channels: {},
        },
    })
    const [step, setStep] = useState(1);
    const executeResultValidation = useSelector(state => state.subscription.requestValidateChannels);
    const executeResult = useSelector(state => state.signup.insertChannel);

    useEffect(() => {
        if (!planData.loading && planData.error) {
            window.open(paths.SIGNIN, "_self");
        }

        return () => {
            dispatch(resetInsertChannel());
        }
    }, [planData, dispatch]);

    useEffect(() => {
        dispatch(verifyPlan(match.params.token));
    }, [dispatch, match.params.token]);

    useEffect(() => {
        if (executeResult.loading === true) return;
        if (executeResult.value && !executeResult.error) {
            dispatch(showBackdrop(false));
            setStep(4);
            let msg = t(langKeys.successful_sign_up);
            const googleid = form.getValues('googleid');
            const facebookid = form.getValues('facebookid');
            if (googleid || facebookid) {
                msg = t(langKeys.successful_sign_up);
            }
            dispatch(showSnackbar({
                show: true,
                severity: "success",
                message: msg,
            }));
        } else if (executeResult.error) {
            var errormessage = t(executeResult.message || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })

            dispatch(showBackdrop(false));

            dispatch(showSnackbar({
                show: true,
                severity: "error",
                message: errormessage,
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executeResult, form.getValues, t, dispatch])

    useEffect(() => {
        if (validateBool) {
            if (executeResultValidation.loading === true) {
                return;
            }

            setValidateBool(false);

            if (executeResultValidation.error) {
                var errormessage = t(executeResultValidation.message || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })

                if (executeResultValidation.code) {
                    errormessage = `${t(langKeys.suscriptionlinkerror)}${t(executeResultValidation.code)}`
                }

                dispatch(showBackdrop(false));
                dispatch(showSnackbar({
                    message: errormessage,
                    show: true,
                    severity: "error",
                }));
            } else {
                dispatch(showBackdrop(false));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executeResultValidation, validateBool])

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
    const valchannels = () => {
        form.handleSubmit(onVal, onError)();
    }
    const onCheckFunc = (altfunc?: any) => {
        form.handleSubmit(altfunc, onError)();
        submitObs.trigger();
    }

    const onVal: SubmitHandler<MainData> = (data) => {
        const { channels, ...mainData } = data;

        let partialchannels = Object.values(channels);

        const majorfield = {
            method: "UFN_CREATEZYXMEACCOUNT_INS",
            key: "UFN_CREATEZYXMEACCOUNT_INS",
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
            channellist: partialchannels.map(
                function <T extends { build: (v: any) => IRequestBody }>(x: T) {
                    return x.build(x);
                }
            ),
        };
        dispatch(showBackdrop(true));
        dispatch(validateChannels(majorfield));
        setValidateBool(true);
    }

    const onSubmit: SubmitHandler<MainData> = (data) => {
        const { channels, ...mainData } = data;
        const majorfield = {
            method: "UFN_CREATEZYXMEACCOUNT_INS",
            key: "UFN_CREATEZYXMEACCOUNT_INS",
            card: {
                firstname: mainData.firstnamecard,
                lastname: mainData.lastnamecard,
                mail: mainData.pmemail,
                phone: mainData.pmphone,
                cardnumber: mainData.creditcard.replace(/[^0-9]/g, ''),
                expirationmonth: String(mainData.mm),
                expirationyear: mainData.yyyy,
                securitycode: mainData.securitycode,
            },
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
                function <T extends { build: (v: any) => IRequestBody }>(x: T) {
                    return x.build(x);
                }
            ),
        };
        dispatch(showBackdrop(true));
        dispatch(executeSubscription(majorfield));
    }

    const onError: SubmitErrorHandler<MainData> = (err) => {
        dispatch(showSnackbar({
            message: t(langKeys.subscription_missinginfo),
            show: true,
            severity: "error",
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
            valchannels,
            onCheckFunc,
            setForeground,
            addChannel,
            deleteChannel,
            resetChannels,
            toggleChannel,
            FBButtonStyles,
            submitObservable: submitObs,
            form
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
        phonetax: number,
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
                phonetax: planData.data[0]?.phonetax || "",
            },
        };
    }, [planData, match.params.token]);
}
