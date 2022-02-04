import { makeStyles } from '@material-ui/core';
import { IRequestBody } from '@types';
import { useSelector } from 'hooks';
import { langKeys } from 'lang/keys';
import React, { FC, useState, createContext, useMemo, CSSProperties, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { executeSubscription } from 'store/signup/actions';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type PlanType = "BASIC" | "PRO" | "PREMIUM" | "ENTERPRISE" | "ADVANCED";
interface Subscription {
    selectedChannels: number;
    listchannels: ListChannels;
    commonClasses: ReturnType<typeof useStyles>;
    FBButtonStyles: CSSProperties;
    limitChannels: number;
    mainData: MainData;
    requestchannels: IRequestBody[];
    foreground: keyof ListChannels | undefined;
    plan: PlanType;
    step: number;
    setStep: SetState<number>;
    finishreg: () => void;
    setForeground: SetState<keyof ListChannels | undefined>;
    setrequestchannels: SetState<IRequestBody[]>;
    setMainData: SetState<MainData>;
    resetChannels: () => void;
    addChannel: (option: keyof ListChannels) => void;
    deleteChannel: (option: keyof ListChannels) => void;
    toggleChannel: (option: keyof ListChannels) => void;
    
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

interface MainData {
    email: string;
    password: string;
    confirmpassword: string;
    firstandlastname: string;
    companybusinessname: string;
    mobilephone: string;
    facebookid: string;
    googleid: string;
    join_reason: string;
    country: string;
    currency: string;
    doctype: number;
    docnumber: string;
    businessname: string;
    fiscaladdress: string;
    billingcontact: string;
    billingcontactmail: string;
    autosendinvoice: boolean;

    industry: string;
    companysize: string;
    rolecompany: string;
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
    FBButtonStyles: {},
    limitChannels: 0,
    commonClasses: {} as any,
    selectedChannels: 0,
    listchannels: defaultListChannels,
    mainData: {} as any,
    requestchannels: [],
    foreground: undefined,
    plan: "BASIC",
    step: 0,
    setStep: () => {},
    finishreg: () => {},
    setForeground: () => {},
    setrequestchannels: () => {},
    setMainData: () => {},
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
    const history = useHistory();
    const { t } = useTranslation();
    const match = useRouteMatch<{ token :string }>();
    const [waitSave, setWaitSave] = useState(false);
    const [listchannels, setlistchannels] = useState<ListChannels>(defaultListChannels);
    const planData = useSelector(state => state.signup.verifyPlan);
    const [requestchannels, setrequestchannels] = useState<IRequestBody[]>([]);
    const [foreground, setForeground] = useState<keyof ListChannels | undefined>(undefined);
    const [mainData, setMainData] = useState<MainData>({
        email: "",
        password: "",
        confirmpassword: "",
        firstandlastname: "",
        companybusinessname: "",
        mobilephone: "",
        facebookid: "",
        googleid: "",
        join_reason: "",
        country: "",
        currency: "",
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
    });
    const [step, setStep] = useState(1);
    const executeResult = useSelector(state => state.signup.insertChannel);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showBackdrop(false));
                setStep(4); // rating
                // history.push({
                //     pathname: '/sign-in',
                //     state: { 
                //         showSnackbar: true,
                //         message: t(langKeys.successful_sign_up)
                //     }
                // })
                dispatch(showSnackbar({
                    show: true,
                    success: true,
                    message: t(langKeys.successful_sign_up),
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
                // setBackdrop(false)
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave, dispatch])

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
        return Object.
            keys(listchannels).
            filter(key => listchannels[key as keyof ListChannels] === true).
            length;
    }, [listchannels]);

    function finishreg(){
        let majorfield = {
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
                sunatcountry: "",
            },
            channellist: requestchannels,
        }
        dispatch(showBackdrop(true));
        setWaitSave(true);
        dispatch(executeSubscription(majorfield))
    }

    return (
        <SubscriptionContext.Provider value={{
            commonClasses: classes,
            limitChannels: planData.data[0]?.channelscontracted || 0,
            selectedChannels,
            listchannels,
            mainData,
            requestchannels,
            foreground,
            plan: match.params.token as PlanType,
            step,
            setStep,
            finishreg,
            setForeground,
            setrequestchannels,
            setMainData,
            addChannel,
            deleteChannel,
            resetChannels,
            toggleChannel,
            FBButtonStyles,
        }}>
            {children}
        </SubscriptionContext.Provider>
    )
}
