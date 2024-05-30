import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { executeSubscription, verifyPlan } from "store/signup/actions";
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { IRequestBody } from "@types";
import { langKeys } from "lang/keys";
import { makeStyles } from "@material-ui/core";
import { resetInsertChannel } from "store/channel/actions";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import paths from "common/constants/paths";
import React, { createContext, CSSProperties, FC, useEffect, useMemo, useState } from "react";

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

const submitObservable = new SubmitObservable();

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
interface Subscription {
    addChannel: (option: keyof ListChannels) => void;
    commonClasses: ReturnType<typeof useStyles>;
    confirmations: number;
    deleteChannel: (option: keyof ListChannels) => void;
    FacebookCustomButtonStyle: CSSProperties;
    finishRegister: () => void;
    foreground: keyof ListChannels | undefined;
    form: Record<string, unknown>;
    listchannels: ListChannels;
    onCheckFunc: (altf: SubmitHandler<MainData>) => void;
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
    token: string;
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
    metalead: boolean;
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
    workplace: boolean;
    workplaceDM: boolean;
    youtube: boolean;
}

export interface FacebookChannel {
    accesstoken: string;
    communicationchannelowner: string;
    communicationchannelsite: string;
    description: string;
    siteid: string;
    build: (v: Omit<FacebookChannel, "build">) => IRequestBody;
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
    build: (v: Omit<WhatsAppChannel, "build">) => IRequestBody;
}

export interface TwitterChannel {
    accesssecret: string;
    accesstoken: string;
    communicationchannelowner: string;
    consumerkey: string;
    consumersecret: string;
    description: string;
    devenvironment: string;
    build: (v: Omit<TwitterChannel, "build">) => IRequestBody;
}

export interface TelegramChannel {
    accesstoken: string;
    communicationchannelowner: string;
    description: string;
    build: (v: Omit<TelegramChannel, "build">) => IRequestBody;
}

export interface MobileChannel {
    description: string;
    build: (v: Omit<MobileChannel, "build">) => IRequestBody;
}

export interface ChatWebChannel {
    description: string;
    build: (v: Omit<ChatWebChannel, "build">) => IRequestBody;
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
    outbound: boolean;
    recording: boolean;
    recordingquality: string;
    recordingstorage: string;
    region: string;
    regionname: string;
    sms: boolean;
    state: string;
    statename: string;
    voximplantcallsupervision: boolean;
    build: (v: Omit<VoxImplantPhoneChannel, "build">) => IRequestBody;
}

export interface TikTokChannel {
    accesstoken: string;
    accountkey: string;
    apikey: string;
    description: string;
    build: (v: Omit<TikTokChannel, "build">) => IRequestBody;
}

export interface YouTubeChannel {
    accesstoken: string;
    channel: string;
    description: string;
    idtoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    build: (v: Omit<YouTubeChannel, "build">) => IRequestBody;
}

export interface BusinessChannel {
    accesstoken: string;
    channel: string;
    description: string;
    idtoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    build: (v: Omit<BusinessChannel, "build">) => IRequestBody;
}

export interface LinkedInChannel {
    accesstoken: string;
    clientid: string;
    clientsecret: string;
    description: string;
    organizationid: string;
    refreshtoken: string;
    build: (v: Omit<LinkedInChannel, "build">) => IRequestBody;
}

export interface TeamsChannel {
    account: string;
    description: string;
    url: string;
    build: (v: Omit<TeamsChannel, "build">) => IRequestBody;
}

export interface AppStoreChannel {
    description: string;
    issuerid: string;
    keyid: string;
    secretkey: string;
    build: (v: Omit<AppStoreChannel, "build">) => IRequestBody;
}

export interface BloggerChannel {
    accesstoken: string;
    channel: string;
    description: string;
    idtoken: string;
    refreshtoken: string;
    scope: string;
    tokentype: string;
    build: (v: Omit<BloggerChannel, "build">) => IRequestBody;
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
    build: (v: Omit<EmailChannel, "build">) => IRequestBody;
}

export interface SmsChannel {
    apikey: string;
    description: string;
    emittername: string;
    url: string;
    build: (v: Omit<SmsChannel, "build">) => IRequestBody;
}

export interface PlayStoreChannel {
    appcode: string;
    description: string;
    mail: string;
    build: (v: Omit<PlayStoreChannel, "build">) => IRequestBody;
}

export interface PhoneChannel {
    description: string;
    build: (v: Omit<PhoneChannel, "build">) => IRequestBody;
}

export interface MetaLeadChannel {
    description: string;
    build: (v: Omit<MetaLeadChannel, "build">) => IRequestBody;
}

export interface WorkplaceChannel {
    description: string;
    build: (v: Omit<WorkplaceChannel, "build">) => IRequestBody;
}

export interface Channels {
    android: MobileChannel;
    apple: MobileChannel;
    appstore: AppStoreChannel;
    blogger: BloggerChannel;
    business: BusinessChannel;
    chatWeb: ChatWebChannel;
    email: EmailChannel;
    facebook: FacebookChannel;
    instagram: FacebookChannel;
    instagramDM: FacebookChannel;
    linkedin: LinkedInChannel;
    messenger: FacebookChannel;
    metalead: MetaLeadChannel;
    phone: PhoneChannel;
    playstore: PlayStoreChannel;
    sms: SmsChannel;
    teams: TeamsChannel;
    telegram: TelegramChannel;
    tiktok: TikTokChannel;
    twitter: TwitterChannel;
    twitterDM: TwitterChannel;
    voximplantphone: VoxImplantPhoneChannel;
    whatsapp: WhatsAppChannel;
    workplace: WorkplaceChannel;
    workplaceDM: WorkplaceChannel;
    youtube: YouTubeChannel;
}

export interface MainData {
    activechannels: ListChannels|null;
    cardmonth: string;
    cardname: string;
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
    metalead: false,
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
    workplace: false,
    workplaceDM: false,
    youtube: false,
};

export const SubscriptionContext = createContext<Subscription>({
    addChannel: () => void 0,
    commonClasses: {} as ClassNameMap,
    confirmations: 0,
    deleteChannel: () => void 0,
    FacebookCustomButtonStyle: {},
    finishRegister: () => void 0,
    foreground: undefined,
    form: {},
    listchannels: defaultListChannels,
    onCheckFunc: () => void 0,
    resetChannels: () => void 0,
    selectedChannels: 0,
    setConfirmations: () => void 0,
    setForeground: () => void 0,
    setStep: () => void 0,
    step: 0,
    submitObservable: new SubmitObservable(),
    toggleChannel: () => void 0,
});

const useStyles = makeStyles(() => ({
    root: {
        border: "1px solid black",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        gap: "1.56em",
        padding: "3.5em 5%",
        position: "relative",
    },
    rootError: {
        border: "2px solid red",
    },
    leadingIcon: {
        fill: "gray",
        height: 32,
        left: 14,
        position: "absolute",
        top: 10,
        width: 32,
    },
    trailingIcon: {
        position: "absolute",
        right: 0,
        top: 0,
    },
    button: {
        fontSize: "14px",
        fontWeight: 500,
        padding: 12,
        textTransform: "initial",
        width: "100%",
    },
}));

const FacebookCustomButtonStyle: CSSProperties = {
    alignItems: "center",
    backgroundColor: "#7721ad",
    borderColor: "#7721ad",
    boxShadow: "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
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
    const { t } = useTranslation();

    const [confirmations, setConfirmations] = useState(0);
    const [foreground, setForeground] = useState<keyof ListChannels | undefined>(undefined);
    const [listChannels, setListChannels] = useState<ListChannels>(defaultListChannels);
    const [step, setStep] = useState(1);
    const [validateBool, setValidateBool] = useState(false);

    const classes = useStyles();
    const dispatch = useDispatch();
    const executeResult = useSelector((state) => state.signup.insertChannel);
    const executeResultValidation = useSelector((state) => state.subscription.requestValidateChannels);
    const match = useRouteMatch<RouteParams>();
    const planData = useSelector((state) => state.signup.verifyPlan);

    const form = useForm<MainData>({
        defaultValues: {
            activechannels: null,
            cardmonth: "",
            cardname: "",
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
    });

    useEffect(() => {
        if (!planData.loading && planData.error) {
            window.open(paths.SIGNIN, "_self");
        }

        return () => {
            dispatch(resetInsertChannel());
        };
    }, [planData, dispatch]);

    useEffect(() => {
        dispatch(verifyPlan(match.params.token));
    }, [dispatch, match.params.token]);

    useEffect(() => {
        if (executeResult.loading === true) return;

        if (executeResult.value && !executeResult.error) {
            const facebookid = form.getValues("loginfacebookid");
            const googleid = form.getValues("logingoogleid");

            let msg = t(langKeys.successful_sign_up1);

            if (googleid || facebookid) {
                msg = t(langKeys.successful_sign_up2);
            }

            dispatch(showSnackbar({ show: true, severity: "success", message: msg }));
            dispatch(showBackdrop(false));
            setStep(4);
        } else if (executeResult.error) {
            dispatch(
                showSnackbar({
                    severity: "error",
                    show: true,
                    message: t(executeResult.message ?? "error_unexpected_error", {
                        module: t(langKeys.property).toLocaleLowerCase(),
                    }),
                })
            );
            dispatch(showBackdrop(false));
        }
    }, [executeResult, form.getValues, t, dispatch]);

    useEffect(() => {
        if (validateBool) {
            if (executeResultValidation.loading === true) {
                return;
            }

            setValidateBool(false);

            if (executeResultValidation.error) {
                let errormessage = t(executeResultValidation.message ?? "error_unexpected_error", {
                    module: t(langKeys.property).toLocaleLowerCase(),
                });

                if (executeResultValidation.code) {
                    errormessage = `${t(langKeys.suscriptionlinkerror)}${t(executeResultValidation.code)}`;
                }

                dispatch(
                    showSnackbar({
                        message: errormessage,
                        severity: "error",
                        show: true,
                    })
                );
                dispatch(showBackdrop(false));
            } else {
                dispatch(showBackdrop(false));
            }
        }
    }, [executeResultValidation, validateBool]);

    const deleteChannel = (option: keyof ListChannels) => {
        setListChannels((prev) => {
            const v = prev[option];

            if (foreground === option) setForeground(undefined);
            if (v === false) return prev;

            return {
                ...prev,
                [option]: false,
            };
        });
    };

    const addChannel = (option: keyof ListChannels) => {
        setListChannels((prev) => {
            const v = prev[option];

            if (v === true) return prev;

            return {
                ...prev,
                [option]: true,
            };
        });
    };

    const toggleChannel = (option: keyof ListChannels) => {
        setListChannels((prev) => {
            const value = !prev[option];

            if (!value && foreground === option) {
                setForeground(undefined);
            }

            return {
                ...prev,
                [option]: value,
            };
        });
    };

    const resetChannels = () => setListChannels(defaultListChannels);

    const selectedChannels = useMemo(() => {
        return Object.keys(listChannels).filter((key) => listChannels[key as keyof ListChannels] === true).length;
    }, [listChannels]);

    const finishRegister = () => {
        form.handleSubmit(onSubmit, onError)();
        submitObservable.trigger();
    };

    const onCheckFunc = (altfunc: SubmitHandler<MainData>) => {
        form.handleSubmit(altfunc, onError)();
        submitObservable.trigger();
    };

    const onSubmit: SubmitHandler<MainData> = (data) => {
        const { ...mainData } = data;

        const submitInformation = {
            channel: listChannels,
            key: "UFN_CREATEZYXMEACCOUNT_INS",
            method: "UFN_CREATEZYXMEACCOUNT_INS",
            card: {
                cardmonth: String(mainData.cardmonth),
                cardnumber: (mainData.cardnumber || "").replace(/\D/g, ""),
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
        dispatch(executeSubscription(submitInformation));
    };

    const onError: SubmitErrorHandler<MainData> = () => {
        dispatch(
            showSnackbar({
                message: t(langKeys.subscription_missinginfo),
                severity: "error",
                show: true,
            })
        );
    };

    const formProviderValue = useMemo(
        () => ({
            addChannel,
            commonClasses: classes,
            confirmations,
            deleteChannel,
            FacebookCustomButtonStyle,
            finishRegister,
            foreground,
            form,
            listchannels: listChannels,
            onCheckFunc,
            resetChannels,
            selectedChannels,
            setConfirmations,
            setForeground,
            setStep,
            step,
            submitObservable,
            toggleChannel,
        }),
        [
            addChannel,
            classes,
            confirmations,
            deleteChannel,
            FacebookCustomButtonStyle,
            finishRegister,
            foreground,
            form,
            listChannels,
            onCheckFunc,
            resetChannels,
            selectedChannels,
            setConfirmations,
            setForeground,
            setStep,
            step,
            submitObservable,
            toggleChannel,
        ]
    );

    return (
        <SubscriptionContext.Provider value={formProviderValue}>
            <FormProvider {...form}>{children}</FormProvider>
        </SubscriptionContext.Provider>
    );
};

interface PlanData {
    loading: boolean;
    plan: {
        limitChannels: number;
        limitContact: number;
        numberAgentsHired: number;
        phoneTax: number;
        plan: string;
        planCost: number;
        provider: string;
    } | null;
}

export function usePlanData(): PlanData {
    const match = useRouteMatch<RouteParams>();
    const planData = useSelector((state) => state.signup.verifyPlan);

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
                limitContact: planData.data[0]?.limitcontact || 0,
                numberAgentsHired: planData.data[0]?.numberagentshired || 0,
                phoneTax: planData.data[0]?.phonetax || "",
                plan: match.params.token,
                planCost: planData.data[0]?.plancost || 0,
                provider: planData.data[0]?.providerwhatsapp || "",
            },
        };
    }, [planData, match.params.token]);
}