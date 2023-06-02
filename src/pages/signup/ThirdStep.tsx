/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext } from "react";
import { makeStyles, Typography, Paper } from '@material-ui/core';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import clsx from "clsx";
import { ControlPoint as ControlPointIcon } from "@material-ui/icons";
import { ListChannels, SubscriptionContext, usePlanData } from "./context";

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
    LaraigoLogo,
    LinkedInColor,
    MailColor,
    MyBusinessColor,
    PlayStoreColor,
    SmsColor,
    TeamsColor,
    TelegramColor,
    TikTokColor,
    TwitterColor,
    VoiceColor,
    WhatsAppColor,
    YouTubeColor,
} from "icons";

interface ChannelOption {
    icon: React.ReactNode;
    label: React.ReactNode;
    key: keyof ListChannels;
    selected: Boolean;
    onClick: () => void;
}
const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: "bold",
        fontSize: '40px',
        //textTransform: 'initial',
        width: "100%"
    },
    buttonGoogle: {
        '& button': {
            fontSize: '24px!important',
            justifyContent: 'center',
            fontFamily: "Helvetica,sans-serif!important",
            width: "50%",
            marginLeft: "25%",
            marginBottom: '20px',
        }
    },
    separator: {
        borderBottom: "grey solid 1px",
        width: "10vh",
        height: "1.6vh",
        margin: "0 40px"
    },
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    content: {
        flexGrow: 1,
        backgroundColor: 'inherit',
        textAlign: 'start',
        padding: '0 34px',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: "20px"
    },
    title: {
        fontWeight: 500,
        fontSize: 32,
        textAlign: 'center',
        // margin: '20px 0',
        color: theme.palette.primary.main,
    },
    subtitle: {
        margin: '8px 0 8px 4px',
        fontSize: 20,
        fontWeight: 500,
        width: '100%',
        textAlign: 'start',
    },
    icon: {
        // fill: 'inherit',
        fill: 'gray',
        height: 38,
        width: 'auto',
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: 8
    },
}));

const ThirdStep: FC = () => {
    const { listchannels, toggleChannel } = useContext(SubscriptionContext);
    const planData = usePlanData();
    const classes = useChannelAddStyles();
    const { t } = useTranslation();

    const socialMediaOptions: ChannelOption[] = [
        {
            icon: <FacebookColor className={classes.icon} />,
            label: t(langKeys.channel_facebook),
            key: 'facebook',
            onClick: () => {
                toggleChannel('facebook');
            },
            selected: listchannels.facebook,
        },
        {
            icon: <FacebookMessengerColor className={classes.icon} />,
            label: t(langKeys.channel_messenger),
            key: 'messenger',
            onClick: () => {
                toggleChannel('messenger');
            },
            selected: listchannels.messenger,
        },
        {
            icon: <InstagramColor className={classes.icon} />,
            label: t(langKeys.channel_instagram),
            key: 'instagram',
            onClick: () => {
                toggleChannel('instagram');
            },
            selected: listchannels.instagram,
        },
        {
            icon: <InstagramColor className={classes.icon} />,
            label: t(langKeys.channel_instagramdm),
            key: 'instagramDM',
            onClick: () => {
                toggleChannel('instagramDM');
            },
            selected: listchannels.instagramDM,
        },
        {
            icon: <WhatsAppColor className={classes.icon} />,
            label: t(langKeys.channel_whatsapp),
            key: 'whatsapp',
            onClick: () => {
                toggleChannel('whatsapp');
            },
            selected: listchannels.whatsapp,
        },
        {
            icon: <TelegramColor className={classes.icon} />,
            label: t(langKeys.channel_telegram),
            key: 'telegram',
            onClick: () => {
                toggleChannel('telegram');
            },
            selected: listchannels.telegram,
        },
        {
            icon: <TwitterColor className={classes.icon} />,
            label: t(langKeys.channel_twitter),
            key: 'twitter',
            onClick: () => {
                toggleChannel('twitter');
            },
            selected: listchannels.twitter,
        },
        {
            icon: <TwitterColor className={classes.icon} />,
            label: t(langKeys.channel_twitterdm),
            key: 'twitterDM',
            onClick: () => {
                toggleChannel('twitterDM');
            },
            selected: listchannels.twitterDM,
        },
        {
            icon: <TikTokColor className={classes.icon} />,
            label: t(langKeys.channel_tiktok),
            key: 'tiktok',
            onClick: () => {
                toggleChannel('tiktok');
            },
            selected: listchannels.tiktok,
        },
        {
            icon: <YouTubeColor className={classes.icon} />,
            label: t(langKeys.channel_youtube),
            key: 'youtube',
            onClick: () => {
                toggleChannel('youtube');
            },
            selected: listchannels.youtube,
        },
        {
            icon: <MyBusinessColor className={classes.icon} />,
            label: t(langKeys.channel_business),
            key: 'business',
            onClick: () => {
                toggleChannel('business');
            },
            selected: listchannels.business,
        },
        {
            icon: <PlayStoreColor className={classes.icon} />,
            label: t(langKeys.channel_playstore),
            key: 'playstore',
            onClick: () => {
                toggleChannel('playstore');
            },
            selected: listchannels.playstore,
        },
        {
            icon: <AppStoreColor className={classes.icon} />,
            label: t(langKeys.channel_appstore),
            key: 'appstore',
            onClick: () => {
                toggleChannel('appstore');
            },
            selected: listchannels.appstore,
        },
        {
            icon: <LinkedInColor className={classes.icon} />,
            label: t(langKeys.channel_linkedin),
            key: 'linkedin',
            onClick: () => {
                toggleChannel('linkedin');
            },
            selected: listchannels.linkedin,
        },
    ];
    const businessChannelOptions: ChannelOption[] = [
        {
            icon: <ChatWebColor className={classes.icon} />,
            label: t(langKeys.channel_chatweb),
            key: 'chatWeb',
            onClick: () => toggleChannel('chatWeb'),
            selected: listchannels.chatWeb,
        },
        {
            icon: <FormColor className={classes.icon} />,
            label: t(langKeys.web_form),
            key: 'webForm',
            onClick: () => toggleChannel('webForm'),
            selected: listchannels.webForm,
        },
        {
            icon: <MailColor className={classes.icon} />,
            label: t(langKeys.channel_email),
            key: 'email',
            onClick: () => toggleChannel('email'),
            selected: listchannels.email
        },
        {
            icon: <VoiceColor className={classes.icon} />,
            label: t(langKeys.channel_phone),
            key: 'phone',
            onClick: () => toggleChannel('phone'),
            selected: listchannels.voximplantphone
        },
        {
            icon: <SmsColor className={classes.icon} />,
            label: t(langKeys.channel_sms),
            key: 'sms',
            onClick: () => toggleChannel('sms'),
            selected: listchannels.sms
        },
        {
            icon: <IosColor className={classes.icon} />,
            label: t(langKeys.channel_ios),
            key: 'apple',
            onClick: () => {
                toggleChannel('apple');
            },
            selected: listchannels.apple,
        },
        {
            icon: <AndroidColor className={classes.icon} />,
            label: t(langKeys.channel_android),
            key: 'android',
            onClick: () => {
                toggleChannel('android');
            },
            selected: listchannels.android,
        },
        {
            icon: <TeamsColor className={classes.icon} />,
            label: t(langKeys.channel_teams),
            key: 'teams',
            onClick: () => {
                toggleChannel('teams');
            },
            selected: listchannels.teams,
        },
        {
            icon: <BloggerColor className={classes.icon} />,
            label: t(langKeys.channel_blogger),
            key: 'blogger',
            onClick: () => {
                toggleChannel('blogger');
            },
            selected: listchannels.blogger,
        },
    ];

    const description = () => {
        switch (planData.plan!.plan) {
            case "BASIC": return `${t(langKeys.subscription_channellimit)} 1`;
            case "PRO": return `${t(langKeys.subscription_channellimit)} 3`;
            case "ADVANCED":
            case "ENTERPRISE":
            case "PREMIUM":
                return `${t(langKeys.subscription_channellimit)} ${t(langKeys.subscription_nolimit)}`;
            default: return "-";
        }
    }

    return (
        <div className={classes.root}>
            <LaraigoLogo style={{ width: '25%', height: 'auto', marginBottom: 10 }} />
            <div className={classes.title}>
                {planData.plan!.plan}
            </div>
            <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                {description()}
            </Typography>
            <Typography className={classes.subtitle}>
                <Trans i18nKey={langKeys.socialmediachannel} />
            </Typography>
            <div className={classes.optionsContainer}>
                {socialMediaOptions.map((e, i) =>
                    <Option
                        key={`social_media_option_${i}`}
                        option={e}
                        selected={listchannels[e.key as keyof ListChannels]}
                        index={i}
                    />
                )}
            </div>
            <Typography className={classes.subtitle}>
                <Trans i18nKey={langKeys.businesschannel} />
            </Typography>
            <div className={classes.optionsContainer}>
                {businessChannelOptions.map((e, i) => (
                    <Option
                        key={`business_channel_option_${i}`}
                        option={e}
                        selected={listchannels[e.key as keyof ListChannels]}
                        index={i}
                    />
                ))}
            </div>
            {/* <Button
                onClick={() => {
                    setsendchannels(true);
                    setrequestchannels([]);
                }}
                className={classes.button}
                fullWidth
                style={{ marginTop: 30 }}
                variant="contained"
                color="primary"
                //disabled={nextbutton}
            >
                <Trans i18nKey={langKeys.next} />
            </Button> */}
        </div>
    )
}

const useOptionClasses = makeStyles(theme => ({
    optionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    optionContainer: {
        padding: '0 8px',
        display: 'flex',
        flexDirection: 'column',
        width: 120,
        height: 110,
        backgroundColor: 'white',
        fontSize: 15,
        fontWeight: 400,
        color: '#A59F9F',
        fill: '#A59F9F',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 8,
        position: 'relative',

        '-webkit-touch-callout': 'none', /* iOS Safari */
        '-webkit-user-select': 'none', /* Safari */
        '-khtml-user-select': 'none', /* Konqueror HTML */
        '-moz-user-select': 'none', /* Old versions of Firefox */
        '-ms-user-select': 'none', /* Internet Explorer/Edge */
        userSelect: 'none',
        [theme.breakpoints.down('xs')]: {
            width: 110,
        },
    },
    optionContainerHover: {
        '&:hover': {
            backgroundColor: '#ececec',
            cursor: 'pointer',
            fontWeight: 700,
        },
    },
    optionContainerSelected: {
        fontWeight: 700,
    },
    optionContainerActive: {
        opacity: 1,
    },
    optionContainerDisabled: {
        opacity: .5,
    },
    optionPlusDecorator: {
        fill: theme.palette.primary.main,
        color: theme.palette.primary.main,
        position: 'absolute',
        top: 8,
        right: 8,
        width: 22,
        height: 22,
    },
    optionPlusDecoratorDisabled: {
        fill: '#A59F9F',
        color: '#A59F9F',
    },
    indexDecorator: {
        position: 'absolute',
        top: -6,
        left: -8,
        width: 24,
        height: 24,
        color: 'white',
        fontWeight: 500,
        backgroundColor: theme.palette.primary.main,
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionIconContainer: {
        flexGrow: 1,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
}));

interface OptionProps {
    option: ChannelOption;
    selected: Boolean;
    index: number;
}

const Option: FC<OptionProps> = ({ option, selected, index }) => {
    const classes = useOptionClasses();
    const { plan } = usePlanData();
    const { selectedChannels } = useContext(SubscriptionContext);

    const reachedLimit = plan!.limitChannels <= selectedChannels;
    const withOpacity = reachedLimit && !selected;

    return (
        <Paper
            className={
                clsx(classes.optionContainer, {
                    [classes.optionContainerHover]: !withOpacity,
                    [classes.optionContainerSelected]: selected,
                    [classes.optionContainerActive]: !withOpacity,
                    [classes.optionContainerDisabled]: withOpacity,
                })
            }
            elevation={selected ? 4 : 0}
            onClick={() => withOpacity || option.onClick()}
        >
            <div
                className={clsx(classes.optionPlusDecorator, {
                    [classes.optionPlusDecoratorDisabled]: selected || withOpacity,
                })}
            >
                <ControlPointIcon style={{ height: 'inherit', width: 'inherit' }} />
            </div>
            <div className={classes.optionIconContainer}>
                {option.icon}
            </div>
            <div style={{ height: 38 }}>
                <span>{option.label}</span>
            </div>
        </Paper>
    );
};

export default ThirdStep