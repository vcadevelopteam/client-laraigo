import { ControlPoint } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { ListChannels, SubscriptionContext, usePlanData } from "./context";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { Trans, useTranslation } from "react-i18next";

import {
    AndroidColor,
    AppStoreColor,
    BloggerColor,
    ChatWebColor,
    FacebookColor,
    FacebookMessengerColor,
    FormColor,
    InstagramColor,
    IosColor,
    LinkedInColor,
    LogoSuscription,
    MailColor,
    MetaColor,
    MyBusinessColor,
    PlayStoreColor,
    SmsColor,
    TeamsColor,
    TelegramColor,
    TikTokColor,
    TwitterColor,
    VoiceColor,
    WhatsAppColor,
    WorkplaceColor,
    WorkplaceWallColor,
    YouTubeColor,
} from "icons";

import clsx from "clsx";
import React, { FC, useContext } from "react";

interface ChannelOption {
    icon: React.ReactNode;
    key: keyof ListChannels;
    label: React.ReactNode;
    onClick: () => void;
    selected: boolean;
}

const useChannelAddStyles = makeStyles((theme) => ({
    button: {
        fontSize: "40px",
        fontWeight: "bold",
        padding: 12,
        width: "100%",
    },
    buttonGoogle: {
        "& button": {
            fontFamily: "Helvetica,sans-serif!important",
            fontSize: "24px!important",
            justifyContent: "center",
            marginBottom: "20px",
            marginLeft: "25%",
            width: "50%",
        },
    },
    separator: {
        borderBottom: "grey solid 1px",
        height: "1.6vh",
        margin: "0 40px",
        width: "10vh",
    },
    root: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    content: {
        backgroundColor: "inherit",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: "0 34px",
        paddingBottom: "20px",
        textAlign: "start",
    },
    title: {
        color: theme.palette.primary.main,
        fontSize: 32,
        fontWeight: 500,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 500,
        margin: "8px 0 8px 4px",
        textAlign: "start",
        width: "100%",
    },
    icon: {
        fill: "gray",
        height: 38,
        width: "auto",
    },
    optionsContainer: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        width: "100%",
    },
}));

const ThirdStep: FC = () => {
    const { listchannels, toggleChannel } = useContext(SubscriptionContext);
    const { t } = useTranslation();

    const classes = useChannelAddStyles();
    const planData = usePlanData();

    const socialMediaOptions: ChannelOption[] = [
        {
            icon: <FacebookColor className={classes.icon} />,
            key: "facebook",
            label: t(langKeys.channel_facebook),
            onClick: () => toggleChannel("facebook"),
            selected: listchannels.facebook,
        },
        {
            icon: <FacebookMessengerColor className={classes.icon} />,
            key: "messenger",
            label: t(langKeys.channel_messenger),
            onClick: () => toggleChannel("messenger"),
            selected: listchannels.messenger,
        },
        {
            icon: <InstagramColor className={classes.icon} />,
            key: "instagram",
            label: t(langKeys.channel_instagram),
            onClick: () => toggleChannel("instagram"),
            selected: listchannels.instagram,
        },
        {
            icon: <InstagramColor className={classes.icon} />,
            key: "instagramDM",
            label: t(langKeys.channel_instagramdm),
            onClick: () => toggleChannel("instagramDM"),
            selected: listchannels.instagramDM,
        },
        {
            icon: <WhatsAppColor className={classes.icon} />,
            key: "whatsapp",
            label: t(langKeys.channel_whatsapp),
            onClick: () => toggleChannel("whatsapp"),
            selected: listchannels.whatsapp,
        },
        {
            icon: <TelegramColor className={classes.icon} />,
            key: "telegram",
            label: t(langKeys.channel_telegram),
            onClick: () => toggleChannel("telegram"),
            selected: listchannels.telegram,
        },
        {
            icon: <TwitterColor className={classes.icon} />,
            key: "twitter",
            label: t(langKeys.channel_twitter),
            onClick: () => toggleChannel("twitter"),
            selected: listchannels.twitter,
        },
        {
            icon: <TwitterColor className={classes.icon} />,
            key: "twitterDM",
            label: t(langKeys.channel_twitterdm),
            onClick: () => toggleChannel("twitterDM"),
            selected: listchannels.twitterDM,
        },
        {
            icon: <TikTokColor className={classes.icon} />,
            key: "tiktok",
            label: t(langKeys.channel_tiktok),
            onClick: () => toggleChannel("tiktok"),
            selected: listchannels.tiktok,
        },
        {
            icon: <YouTubeColor className={classes.icon} />,
            key: "youtube",
            label: t(langKeys.channel_youtube),
            onClick: () => toggleChannel("youtube"),
            selected: listchannels.youtube,
        },
        {
            icon: <MyBusinessColor className={classes.icon} />,
            key: "business",
            label: t(langKeys.channel_business),
            onClick: () => toggleChannel("business"),
            selected: listchannels.business,
        },
        {
            icon: <PlayStoreColor className={classes.icon} />,
            key: "playstore",
            label: t(langKeys.channel_playstore),
            onClick: () => toggleChannel("playstore"),
            selected: listchannels.playstore,
        },
        {
            icon: <AppStoreColor className={classes.icon} />,
            key: "appstore",
            label: t(langKeys.channel_appstore),
            onClick: () => toggleChannel("appstore"),
            selected: listchannels.appstore,
        },
        {
            icon: <LinkedInColor className={classes.icon} />,
            key: "linkedin",
            label: t(langKeys.channel_linkedin),
            onClick: () => toggleChannel("linkedin"),
            selected: listchannels.linkedin,
        },
    ];

    const businessChannelOptions: ChannelOption[] = [
        {
            icon: <MetaColor className={classes.icon} />,
            key: "metalead",
            label: t(langKeys.channel_metalead),
            onClick: () => toggleChannel("metalead"),
            selected: listchannels.metalead,
        },
        {
            icon: <ChatWebColor className={classes.icon} />,
            key: "chatWeb",
            label: t(langKeys.channel_chatweb),
            onClick: () => toggleChannel("chatWeb"),
            selected: listchannels.chatWeb,
        },
        {
            icon: <FormColor className={classes.icon} />,
            key: "webForm",
            label: t(langKeys.web_form),
            onClick: () => toggleChannel("webForm"),
            selected: listchannels.webForm,
        },
        {
            icon: <MailColor className={classes.icon} />,
            key: "email",
            label: t(langKeys.channel_email),
            onClick: () => toggleChannel("email"),
            selected: listchannels.email,
        },
        {
            icon: <VoiceColor className={classes.icon} />,
            key: "voximplantphone",
            label: t(langKeys.channel_phone),
            onClick: () => toggleChannel("voximplantphone"),
            selected: listchannels.voximplantphone,
        },
        {
            icon: <SmsColor className={classes.icon} />,
            key: "sms",
            label: t(langKeys.channel_sms),
            onClick: () => toggleChannel("sms"),
            selected: listchannels.sms,
        },
        {
            icon: <IosColor className={classes.icon} />,
            key: "apple",
            label: t(langKeys.channel_ios),
            onClick: () => toggleChannel("apple"),
            selected: listchannels.apple,
        },
        {
            icon: <AndroidColor className={classes.icon} />,
            key: "android",
            label: t(langKeys.channel_android),
            onClick: () => toggleChannel("android"),
            selected: listchannels.android,
        },
        {
            icon: <TeamsColor className={classes.icon} />,
            key: "teams",
            label: t(langKeys.channel_teams),
            onClick: () => toggleChannel("teams"),
            selected: listchannels.teams,
        },
        {
            icon: <BloggerColor className={classes.icon} />,
            key: "blogger",
            label: t(langKeys.channel_blogger),
            onClick: () => toggleChannel("blogger"),
            selected: listchannels.blogger,
        },
        {
            icon: <WorkplaceWallColor className={classes.icon} />,
            key: "workplace",
            label: t(langKeys.channel_workplace),
            onClick: () => toggleChannel("workplace"),
            selected: listchannels.workplace,
        },
        {
            icon: <WorkplaceColor className={classes.icon} />,
            key: "workplaceDM",
            label: t(langKeys.channel_workplacedm),
            onClick: () => toggleChannel("workplaceDM"),
            selected: listchannels.workplaceDM,
        },
    ];

    const channelLimitDescription = () => {
        return `${t(langKeys.subscription_channellimit)} ${t(langKeys.subscription_nolimit)}`;
    };

    return (
        <div className={classes.root}>
            <LogoSuscription style={{ width: "25%", height: "auto", marginBottom: 10 }} />
            <div className={classes.title}>{planData?.plan?.plan}</div>
            <Typography style={{ fontSize: 20, fontWeight: 400 }}>{channelLimitDescription()}</Typography>
            <Typography className={classes.subtitle}>
                <Trans i18nKey={langKeys.socialmediachannel} />
            </Typography>
            <div className={classes.optionsContainer}>
                {socialMediaOptions.map((e, i) => (
                    <Option key={`social_media_option_${i}`} option={e} selected={listchannels[e.key]} />
                ))}
            </div>
            <Typography className={classes.subtitle}>
                <Trans i18nKey={langKeys.businesschannel} />
            </Typography>
            <div className={classes.optionsContainer}>
                {businessChannelOptions.map((e, i) => (
                    <Option key={`business_channel_option_${i}`} option={e} selected={listchannels[e.key]} />
                ))}
            </div>
        </div>
    );
};

const useOptionClasses = makeStyles((theme) => ({
    optionsContainer: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
    },
    optionContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        color: "#A59F9F",
        display: "flex",
        fill: "#A59F9F",
        flexDirection: "column",
        fontSize: 14,
        fontWeight: 400,
        height: 110,
        justifyContent: "center",
        padding: "0 8px",
        position: "relative",
        textAlign: "center",
        userSelect: "none",
        width: 120,
        "-khtml-user-select": "none",
        "-moz-user-select": "none",
        "-ms-user-select": "none",
        "-webkit-touch-callout": "none",
        "-webkit-user-select": "none",
        [theme.breakpoints.down("xs")]: {
            width: 110,
        },
    },
    optionContainerHover: {
        "&:hover": {
            backgroundColor: "#ececec",
            cursor: "pointer",
            fontWeight: 700,
        },
    },
    optionContainerSelected: {
        border: "2px solid #6F1FA1",
        fontWeight: 700,
    },
    optionContainerActive: {
        opacity: 1,
    },
    optionContainerDisabled: {
        opacity: 0.5,
    },
    optionPlusDecorator: {
        color: theme.palette.primary.main,
        fill: theme.palette.primary.main,
        height: 22,
        position: "absolute",
        right: 8,
        top: 8,
        width: 22,
    },
    optionPlusDecoratorDisabled: {
        color: "#A59F9F",
        fill: "#A59F9F",
    },
    indexDecorator: {
        alignItems: "center",
        backgroundColor: theme.palette.primary.main,
        borderRadius: 12,
        color: "white",
        display: "flex",
        fontWeight: 500,
        height: 24,
        justifyContent: "center",
        left: -8,
        position: "absolute",
        top: -6,
        width: 24,
    },
    optionIconContainer: {
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
    },
}));

interface OptionProps {
    option: ChannelOption;
    selected: boolean;
}

const Option: FC<OptionProps> = ({ option, selected }) => {
    const { selectedChannels } = useContext(SubscriptionContext);

    const classes = useOptionClasses();
    const planData = usePlanData();
    const reachedLimit = (planData?.plan?.limitChannels ?? 0) <= selectedChannels;
    const withOpacity = reachedLimit && !selected;

    return (
        <Paper
            elevation={selected ? 4 : 0}
            onClick={() => withOpacity || option.onClick()}
            className={clsx(classes.optionContainer, {
                [classes.optionContainerActive]: !withOpacity,
                [classes.optionContainerDisabled]: withOpacity,
                [classes.optionContainerHover]: !withOpacity,
                [classes.optionContainerSelected]: selected,
            })}
        >
            <div
                className={clsx(classes.optionPlusDecorator, {
                    [classes.optionPlusDecoratorDisabled]: selected || withOpacity,
                })}
            >
                <ControlPoint style={{ height: "inherit", width: "inherit" }} />
            </div>
            <div className={classes.optionIconContainer}>{option.icon}</div>
            <div style={{ height: 38 }}>
                <span>{option.label}</span>
            </div>
        </Paper>
    );
};

export default ThirdStep;