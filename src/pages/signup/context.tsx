import { executeSubscription, verifyPlan } from 'store/signup/actions';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { IRequestBody } from '@types';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core';
import { resetInsertChannel } from 'store/channel/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { validateChannels } from 'store/subscription/actions';

import paths from 'common/constants/paths';
import React, { FC, useState, createContext, useMemo, CSSProperties, useEffect } from 'react';

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
    addChannel: (option: keyof ListChannels) => void;
    commonClasses: ReturnType<typeof useStyles>;
    confirmations: number;
    deleteChannel: (option: keyof ListChannels) => void;
    FBButtonStyles: CSSProperties;
    finishreg: () => void;
    foreground: keyof ListChannels | undefined;
    form: any;
    listchannels: ListChannels;
    onCheckFunc: (altf: any) => void;
    resetChannels: () => void;
    selectedChannels: number;
    setConfirmations: SetState<number>;
    setForeground: SetState<keyof ListChannels | undefined>;
    setStep: SetState<number>;
    step: number;
    submitObservable: SubmitObservable;
    toggleChannel: (option: keyof ListChannels) => void;
}

export interface RouteParams {
    token: PlanType;
}

export interface ListChannels {
    android: boolean;
    apple: boolean;
    appstore: boolean;
    blogger: boolean;
    business: boolean;
    chatWeb: boolean;
    email: boolean;
    facebook: boolean;
    instagram: boolean;
    instagramDM: boolean;
    linkedin: boolean;
    messenger: boolean;
    playstore: boolean;
    sms: boolean;
    teams: boolean;
    telegram: boolean;
    tiktok: boolean;
    twitter: boolean;
    twitterDM: boolean;
    voximplantphone: boolean;
    webForm: boolean;
    whatsapp: boolean;
    youtube: boolean;
}

export interface FacebookChannel {
    accesstoken: string;
    communicationchannelowner: string;
    communicationchannelsite: string;
    description: string;
    siteid: string;
    build: (v: Omit<FacebookChannel, 'build'>) => IRequestBody;
}

export interface WhatsAppChannel {
    accesstoken: string;
    brandAddress: string;
    brandName: string;
    communicationchannelowner: string;
    customerfacebookid: string;
    description: string;
    email: string;
    firstName: string;
    lastName: string;
    nameassociatednumber: string;
    phone: string;
    phonenumberwhatsappbusiness: string;
    build: (v: Omit<WhatsAppChannel, 'build'>) => IRequestBody;
}

export interface TwitterChannel {
    accesssecret: string;
    accesstoken: string;
    communicationchannelowner: string;
    consumerkey: string;
    consumersecret: string;
    description: string;
    devenvironment: string;
    build: (v: Omit<TwitterChannel, 'build'>) => IRequestBody;
}

export interface TelegramChannel {
    accesstoken: string;
    communicationchannelowner: string;
    description: string;
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
    category: string;
    categoryname: string;
    cost: number;
    costinstallation: number;
    costvca: string;
    country: string;
    countryname: string;
    description: string;
    outbound: boolean,
    recording: boolean,
    recordingquality: string,
    recordingstorage: string,
    region: string;
    regionname: string;
    sms: boolean,
    state: string;
    statename: string;
    voximplantcallsupervision: boolean,
    build: (v: Omit<VoxImplantPhoneChannel, 'build'>) => IRequestBody;
}

export interface TikTokChannel {
    accesstoken: string;
    accountkey: string;
    apikey: string;
    description: string;
    build: (v: Omit<TikTokChannel, 'build'>) => IRequestBody;
}

export interface YouTubeChannel {
    accesstoken: string;
    channel: string;
    description: string;
    idtoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    build: (v: Omit<YouTubeChannel, 'build'>) => IRequestBody;
}

export interface BusinessChannel {
    accesstoken: string;
    channel: string;
    description: string;
    idtoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    build: (v: Omit<BusinessChannel, 'build'>) => IRequestBody;
}

export interface LinkedInChannel {
    accesstoken: string;
    clientid: string;
    clientsecret: string;
    description: string;
    organizationid: string;
    refreshtoken: string;
    build: (v: Omit<LinkedInChannel, 'build'>) => IRequestBody;
}

export interface TeamsChannel {
    account: string;
    description: string;
    url: string;
    build: (v: Omit<TeamsChannel, 'build'>) => IRequestBody;
}

export interface AppStoreChannel {
    description: string;
    issuerid: string;
    keyid: string;
    secretkey: string;
    build: (v: Omit<AppStoreChannel, 'build'>) => IRequestBody;
}

export interface BloggerChannel {
    accesstoken: string;
    channel: string;
    description: string;
    idtoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    build: (v: Omit<BloggerChannel, 'build'>) => IRequestBody;
}

export interface EmailChannel {
    accesstoken: string;
    apikey: string;
    description: string;
    emittername: string;
    idtoken: string;
    imapaccesstoken: string;
    imaphost: string;
    imapincomingendpoint: string;
    imapincomingport: string;
    imappassword: string;
    imapport: string;
    imapssl: string;
    imapusername: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    type: string;
    url: string;
    build: (v: Omit<EmailChannel, 'build'>) => IRequestBody;
}

export interface SmsChannel {
    apikey: string;
    description: string;
    emittername: string;
    url: string;
    build: (v: Omit<SmsChannel, 'build'>) => IRequestBody;
}

export interface PlayStoreChannel {
    appcode: string;
    description: string;
    mail: string;
    build: (v: Omit<PlayStoreChannel, 'build'>) => IRequestBody;
}

export interface Channels {
    android: MobileChannel;
    apple: MobileChannel;
    appstore: AppStoreChannel,
    blogger: BloggerChannel,
    business: BusinessChannel,
    chatWeb: ChatWebChannel;
    email: EmailChannel;
    facebook: FacebookChannel;
    instagram: FacebookChannel;
    instagramDM: FacebookChannel;
    linkedin: LinkedInChannel,
    messenger: FacebookChannel;
    phone: any;
    playstore: PlayStoreChannel,
    sms: SmsChannel;
    teams: TeamsChannel,
    telegram: TelegramChannel;
    tiktok: TikTokChannel,
    twitter: TwitterChannel;
    twitterDM: TwitterChannel;
    voximplantphone: VoxImplantPhoneChannel;
    whatsapp: WhatsAppChannel;
    youtube: YouTubeChannel,
}

export interface MainData {
    activechannels: ListChannels,
    cardmonth: number;
    cardnumber: string;
    cardsecuritycode: string;
    cardyear: string;
    contactaddress: string;
    contactcountry: string;
    contactcountryname: string;
    contactcurrency: string;
    contactdocumentnumber: string;
    contactdocumenttype: number;
    contactmail: string;
    contactnameorcompany: string;
    contactphone: string;
    loginfacebookid: string;
    logingoogleid: string;
    loginpassword: string;
    loginpasswordrepeat: string;
    loginusername: string;
}

const defaultListChannels: ListChannels = {
    android: false,
    apple: false,
    appstore: false,
    blogger: false,
    business: false,
    chatWeb: false,
    email: false,
    facebook: false,
    instagram: false,
    instagramDM: false,
    linkedin: false,
    messenger: false,
    playstore: false,
    sms: false,
    teams: false,
    telegram: false,
    tiktok: false,
    twitter: false,
    twitterDM: false,
    voximplantphone: false,
    webForm: false,
    whatsapp: false,
    youtube: false,
};

export const SubscriptionContext = createContext<Subscription>({
    addChannel: () => { },
    commonClasses: {} as any,
    confirmations: 0,
    deleteChannel: () => { },
    FBButtonStyles: {},
    finishreg: () => { },
    foreground: undefined,
    form: {},
    listchannels: defaultListChannels,
    onCheckFunc: (altf: any) => { },
    resetChannels: () => { },
    selectedChannels: 0,
    setConfirmations: () => { },
    setForeground: () => { },
    setStep: () => { },
    step: 0,
    submitObservable: new SubmitObservable(),
    toggleChannel: () => { },
});

const useStyles = makeStyles(theme => ({
    root: {
        border: '1px solid black',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.56em',
        padding: '3.5em 5%',
        position: 'relative',
    },
    rootError: {
        border: '2px solid red',
    },
    leadingIcon: {
        fill: 'gray',
        height: 32,
        left: 14,
        position: 'absolute',
        top: 10,
        width: 32,
    },
    trailingIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    button: {
        fontSize: '14px',
        fontWeight: 500,
        padding: 12,
        textTransform: 'initial',
        width: "100%",
    },
}));

const FBButtonStyles: CSSProperties = {
    alignItems: "center",
    backgroundColor: "#7721ad",
    borderColor: "#7721ad",
    boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
    display: "flex",
    fontSize: 14,
    height: 40,
    justifyContent: "center",
    marginTop: 8,
    maxHeight: 40,
    textAlign: "center",
    textTransform: "none",
    width: "100%",
};

export const SubscriptionProvider: FC = ({ children }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.signup.insertChannel);
    const executeResultValidation = useSelector(state => state.subscription.requestValidateChannels);
    const match = useRouteMatch<RouteParams>();
    const planData = useSelector(state => state.signup.verifyPlan);

    const [confirmations, setConfirmations] = useState(0);
    const [foreground, setForeground] = useState<keyof ListChannels | undefined>(undefined);
    const [listchannels, setlistchannels] = useState<ListChannels>(defaultListChannels);
    const [step, setStep] = useState(1);
    const [validateBool, setValidateBool] = useState(false);

    const form = useForm<MainData>({
        defaultValues: {
            activechannels: listchannels,
            cardmonth: 0,
            cardnumber: "",
            cardsecuritycode: "",
            cardyear: "",
            contactaddress: "",
            contactcountry: "",
            contactcountryname: "",
            contactcurrency: "",
            contactdocumentnumber: "",
            contactdocumenttype: 1,
            contactmail: "",
            contactnameorcompany: "",
            contactphone: "",
            loginfacebookid: "",
            logingoogleid: "",
            loginpassword: "",
            loginpasswordrepeat: "",
            loginusername: "",
        },
    })

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
            const facebookid = form.getValues('loginfacebookid');
            const googleid = form.getValues('logingoogleid');
            let msg = t(langKeys.successful_sign_up1);
            if (googleid || facebookid) {
                msg = t(langKeys.successful_sign_up2);
            }
            setStep(4);
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({ show: true, severity: "success", message: msg }));
        } else if (executeResult.error) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({ show: true, severity: "error", message: t(executeResult.message || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() }) }))
        }
    }, [executeResult, form.getValues, t, dispatch])

    useEffect(() => {
        if (validateBool) {
            if (executeResultValidation.loading === true) {
                return;
            }
            setValidateBool(false);
            if (executeResultValidation.error) {
                let errormessage = t(executeResultValidation.message || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
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

    const onCheckFunc = (altfunc?: any) => {
        form.handleSubmit(altfunc, onError)();
        submitObs.trigger();
    }

    const onSubmit: SubmitHandler<MainData> = (data) => {
        const { ...mainData } = data;

        const majorfield = {
            method: "UFN_CREATEZYXMEACCOUNT_INS",
            key: "UFN_CREATEZYXMEACCOUNT_INS",
            card: {
                cardmonth: String(mainData.cardmonth),
                cardnumber: (mainData.cardnumber || '').replace(/[^0-9]/g, ''),
                cardsecuritycode: mainData.cardsecuritycode,
                cardyear: mainData.cardyear,
            },
            parameters: {
                ...mainData,
                contactaddress: mainData.contactaddress,
                contactcountry: mainData.contactcountry,
                contactcountryname: mainData.contactcountryname,
                contactcurrency: mainData.contactcurrency,
                contactdocumentnumber: mainData.contactdocumentnumber,
                contactdocumenttype: mainData.contactdocumenttype,
                contactmail: mainData.contactmail,
                contactnameorcompany: mainData.contactnameorcompany,
                contactphone: mainData.contactphone,
                loginfacebookid: mainData.loginfacebookid,
                logingoogleid: mainData.logingoogleid,
                loginpassword: mainData.loginpassword,
                loginpasswordrepeat: mainData.loginpasswordrepeat,
                loginusername: mainData.loginusername,
                paymentplan: planData.data[0].plan,
                paymentplanid: planData.data[0].paymentplanid,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                timezoneoffset: (new Date().getTimezoneOffset() / 60) * -1,
            },
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
            addChannel,
            commonClasses: classes,
            confirmations,
            deleteChannel,
            FBButtonStyles,
            finishreg,
            foreground,
            form,
            listchannels,
            onCheckFunc,
            resetChannels,
            selectedChannels,
            setConfirmations,
            setForeground,
            setStep,
            step,
            submitObservable: submitObs,
            toggleChannel,
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
                limitChannels: planData.data[0]?.channelscontracted || 0,
                phonetax: planData.data[0]?.phonetax || "",
                plan: match.params.token,
                provider: planData.data[0]?.providerwhatsapp || "",
            },
        };
    }, [planData, match.params.token]);
}