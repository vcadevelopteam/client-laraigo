import { Box, makeStyles, Typography, Paper } from '@material-ui/core';
import { langKeys } from "lang/keys";
import { TemplateBreadcrumbs } from "components";
import { useHistory, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import React, { FC } from "react";
import paths from "common/constants/paths";

import {
    VoiceColor,
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
    MailColor,
    MyBusinessColor,
    PlayStoreColor,
    SmsColor,
    TeamsColor,
    TelegramColor,
    TikTokColor,
    TwitterColor,
    WhatsAppColor,
    WhatsAppOnboardingColor,
    WorkplaceColor,
    WorkplaceWallColor,
    YouTubeColor,
} from "icons";

interface ChannelOption {
    icon: (className: string) => React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
}

interface whatsAppData {
    typeWhatsApp?: string;
    row?: any;
}

const useChannelAddStyles = makeStyles(theme => ({
    root: {
        // maxWidth: 815,
        width: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flexGrow: 1,
        backgroundColor: 'inherit',
        textAlign: 'start',
        padding: '0 34px',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontWeight: 500,
        fontSize: 32,
        margin: '20px 0',
        color: theme.palette.primary.main,
    },
    subtitle: {
        margin: '8px 0 8px 4px',
        fontSize: 20,
        fontWeight: 500,
    },
    optionContainer: {
        margin: 4,
        display: 'flex',
        flexDirection: 'column',
        width: 100,
        height: 90,
        backgroundColor: 'white',
        fontSize: 16,
        fontWeight: 400,
        color: '#A59F9F',
        fill: '#A59F9F',
        boxShadow: '-5px 7px 6px 0px #a5a5a5',
        '&:hover': {
            // color: 'white',
            color: '#A59F9F',
            boxShadow: 'none',
            fill: 'white',
            opacity: .6,
            // backgroundColor: '#ffffffa8',
            cursor: 'pointer',
        },
    },
    centerbutton: {
        marginLeft: "calc(50% - 96px)",
        marginTop: "30px",
        marginBottom: "20px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
    icon: {
        fill: 'inherit',
        height: 40,
    },
}));

export const ChannelAdd: FC = () => {
    const classes = useChannelAddStyles();
    const history = useHistory();
    const location = useLocation<whatsAppData>();
    const { t } = useTranslation();

    const whatsAppData = location.state as whatsAppData | null;
    const arrayBread = [
        { id: "view-0", name: t(langKeys.configuration_plural) },
        { id: "view-1", name: t(langKeys.channel_plural) },
        { id: "view-2", name: t(langKeys.addchannel) },
    ];

    if (typeof whatsAppData === 'undefined' || !whatsAppData) {
        history.push(paths.CHANNELS);
    }

    function redirectFunc(view: string) {
        if (view === "view-0") {
            history.push(paths.CONFIGURATION)
            return;
        }
        if (view === "view-1") {
            history.push(paths.CHANNELS)
            return;
        }
    }

    const socialMediaOptions: ChannelOption[] = [
        {
            icon: c => <FacebookColor className={c} />,
            label: t(langKeys.channel_facebook),
            onClick: () => { history.push(paths.CHANNELS_ADD_FACEBOOK.path, whatsAppData) },
        },
        {
            icon: c => <FacebookMessengerColor className={c} />,
            label: t(langKeys.channel_messenger),
            onClick: () => { history.push(paths.CHANNELS_ADD_MESSENGER.path, whatsAppData) },
        },
        {
            icon: c => <InstagramColor className={c} />,
            label: t(langKeys.channel_instagram),
            onClick: () => { history.push(paths.CHANNELS_ADD_INSTAGRAM.path, whatsAppData) },
        },
        {
            icon: c => <InstagramColor className={c} />,
            label: t(langKeys.channel_instagramdm),
            onClick: () => { history.push(paths.CHANNELS_ADD_INSTAGRAMDM.path, whatsAppData) },
        },
        {
            icon: c => <WhatsAppColor className={c} />,
            label: t(langKeys.channel_whatsapp),
            onClick: () => { history.push(paths.CHANNELS_ADD_WHATSAPP.path, whatsAppData) },
        },
        {
            icon: c => <WhatsAppOnboardingColor className={c} />,
            label: t(langKeys.channel_whatsapponboarding),
            onClick: () => { history.push(paths.CHANNELS_ADD_WHATSAPPONBOARDING.path, whatsAppData) },
        },
        {
            icon: c => <TelegramColor className={c} />,
            label: t(langKeys.channel_telegram),
            onClick: () => { history.push(paths.CHANNELS_ADD_TELEGRAM.path, whatsAppData) },
        },
        {
            icon: c => <TwitterColor className={c} />,
            label: t(langKeys.channel_twitter),
            onClick: () => { history.push(paths.CHANNELS_ADD_TWITTER.path, whatsAppData) },
        },
        {
            icon: c => <TwitterColor className={c} />,
            label: t(langKeys.channel_twitterdm),
            onClick: () => { history.push(paths.CHANNELS_ADD_TWITTERDM.path, whatsAppData) },
        },
        {
            icon: c => <TikTokColor className={c} />,
            label: t(langKeys.channel_tiktok),
            onClick: () => { history.push(paths.CHANNELS_ADD_TIKTOK.path, whatsAppData) },
        },
        {
            icon: c => <YouTubeColor className={c} />,
            label: t(langKeys.channel_youtube),
            onClick: () => { history.push(paths.CHANNELS_ADD_YOUTUBE.path, whatsAppData) },
        },
        {
            icon: c => <MyBusinessColor className={c} />,
            label: t(langKeys.channel_business),
            onClick: () => { history.push(paths.CHANNELS_ADD_BUSINESS.path, whatsAppData) },
        },
        {
            icon: c => <PlayStoreColor className={c} />,
            label: t(langKeys.channel_playstore),
            onClick: () => { history.push(paths.CHANNELS_ADD_PLAYSTORE.path, whatsAppData) },
        },
        {
            icon: c => <AppStoreColor className={c} />,
            label: t(langKeys.channel_appstore),
            onClick: () => history.push(paths.CHANNELS_ADD_APPSTORE.path, whatsAppData),
        },
        {
            icon: c => <LinkedInColor className={c} />,
            label: t(langKeys.channel_linkedin),
            onClick: () => { history.push(paths.CHANNELS_ADD_LINKEDIN.path, whatsAppData) },
        },
    ];

    const businessChannelOptions: ChannelOption[] = [
        {
            icon: c => <ChatWebColor className={c} />,
            label: t(langKeys.channel_chatweb),
            onClick: () => history.push(paths.CHANNELS_ADD_CHATWEB),
        },
        {
            icon: c => <FormColor className={c} />,
            label: t(langKeys.web_form),
            onClick: () => history.push(paths.CHANNELS_ADD_WEBFORM),
        },
        {
            icon: c => <MailColor className={c} />,
            label: t(langKeys.channel_email),
            onClick: () => { history.push(paths.CHANNELS_ADD_EMAIL.path, whatsAppData) },
        },
        {
            icon: c => <VoiceColor className={c} />,
            label: t(langKeys.channel_phone),
            onClick: () => { history.push(paths.CHANNELS_ADD_PHONE.path, whatsAppData) },
        },
        {
            icon: c => <SmsColor className={c} />,
            label: t(langKeys.channel_sms),
            onClick: () => { history.push(paths.CHANNELS_ADD_SMS.path, whatsAppData) },
        },
        {
            icon: c => <IosColor className={c} />,
            label: t(langKeys.channel_ios),
            onClick: () => history.push(paths.CHANNELS_ADD_IOS.path, whatsAppData),
        },
        {
            icon: c => <AndroidColor className={c} />,
            label: t(langKeys.channel_android),
            onClick: () => history.push(paths.CHANNELS_ADD_ANDROID.path, whatsAppData),
        },
        {
            icon: c => <TeamsColor className={c} />,
            label: t(langKeys.channel_teams),
            onClick: () => history.push(paths.CHANNELS_ADD_TEAMS.path, whatsAppData),
        },
        {
            icon: c => <BloggerColor className={c} />,
            label: t(langKeys.channel_blogger),
            onClick: () => history.push(paths.CHANNELS_ADD_BLOGGER.path, whatsAppData),
        },
        {
            icon: c => <WorkplaceColor className={c} />,
            label: t(langKeys.channel_workplacedm),
            onClick: () => { history.push(paths.CHANNELS_ADD_FACEBOOKDM.path, whatsAppData) },
        },
        {
            icon: c => <WorkplaceWallColor className={c} />,
            label: t(langKeys.channel_workplace),
            onClick: () => { history.push(paths.CHANNELS_ADD_FACEBOOKWORKPLACE.path, whatsAppData) },
        },
    ];

    const Option: FC<{ option: ChannelOption }> = ({ option }) => {

        return (
            <Paper
                className={classes.optionContainer}
                elevation={0}
                onClick={option.onClick}
            >
                <div style={{ flexGrow: 2, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    {option.icon(classes.icon)}
                </div>
                <div style={{ flexGrow: 1, fontSize: 14, alignItems: 'start', textAlign: 'center', flexWrap: 'wrap', display: 'flex', justifyContent: 'center', maxHeight: 39 }}>
                    {option.label}
                </div>
            </Paper>
        );
    };
    return (<Box className={classes.root}>
        <TemplateBreadcrumbs
            breadcrumbs={arrayBread}
            handleClick={redirectFunc}
        />
        <div className={classes.content}>
            <h2 className={classes.title}>{t(langKeys.channeladdtitle)}</h2>
            <div style={{ height: 29 }} />
            <Typography className={classes.subtitle}>{t(langKeys.socialmediachannel)}</Typography>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                {socialMediaOptions.map((e, i) =>
                    <Option
                        key={`social_media_option_${i}`}
                        option={e}
                    />
                )}
            </div>
            <Typography className={classes.subtitle}>{t(langKeys.businesschannel)}</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                {businessChannelOptions.map((e, i) => <Option key={`business_channel_option_${i}`} option={e} />)}
            </div>
        </div>
    </Box>)
};

export default ChannelAdd