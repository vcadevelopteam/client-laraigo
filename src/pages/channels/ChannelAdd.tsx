import React, { FC, useState } from "react";
import { Box, makeStyles, Typography, Breadcrumbs, Paper } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import paths from "common/constants/paths";
import { AndroidIcon, AppleIcon, CallIcon, EmailIcon, FacebookMessengerIcon, FacebookWallIcon, InstagramIcon, SmsIcon, TelegramIcon, TwitterIcon, WhatsappIcon, ZyxmeMessengerIcon,
    AndroidColor, EmailColor, FacebookColor, FacebookMessengerColor, InstagramColor, IosColor, SmsColor, TelegramColor, TwitterColor, WebMessengerColor, WhatsappColor
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

    const whatsAppData = location.state as whatsAppData | null;

    const { t } = useTranslation();

    if (typeof whatsAppData === 'undefined' || !whatsAppData) {
        console.log(whatsAppData);
        history.push(paths.CHANNELS);
    }

    const socialMediaOptions: ChannelOption[] = [
        {
            icon: c => <FacebookColor className={c} />,
            label: 'Facebook',
            onClick: () => {history.push(paths.CHANNELS_ADD_FACEBOOK.path, whatsAppData)},
        },
        {
            icon: c => <FacebookMessengerColor className={c} />,
            label: 'Messenger',
            onClick: () => {history.push(paths.CHANNELS_ADD_MESSENGER.path, whatsAppData)},
        },
        {
            icon: c => <InstagramColor className={c} />,
            label: 'Instagram',
            onClick: () => {history.push(paths.CHANNELS_ADD_INSTAGRAM.path, whatsAppData)},
        },
        {
            icon: c => <InstagramColor className={c} />,
            label: 'Instagram DM',
            onClick: () => {history.push(paths.CHANNELS_ADD_INSTAGRAMDM.path, whatsAppData)},
        },
        {
            icon: c => <WhatsappColor className={c}/>,
            label: 'Whatsapp',
            onClick: () => {history.push(paths.CHANNELS_ADD_WHATSAPP.path, whatsAppData)},
        },
        {
            icon: c => <TelegramColor className={c} />,
            label: 'Telegram',
            onClick: () => {history.push(paths.CHANNELS_ADD_TELEGRAM.path, whatsAppData)},
        },
        {
            icon: c => <TwitterColor className={c} />,
            label: 'Twitter',
            onClick: () => {history.push(paths.CHANNELS_ADD_TWITTER.path, whatsAppData)},
        },
        {
            icon: c => <TwitterColor className={c} />,
            label: 'Twitter DM',
            onClick: () => {history.push(paths.CHANNELS_ADD_TWITTERDM.path, whatsAppData)},
        },
    ];


    const businessChannelOptions: ChannelOption[] = [
        {
            icon: c => <WebMessengerColor className={c} />,
            label: 'Chat Web',
            onClick: () => history.push(paths.CHANNELS_ADD_CHATWEB),
        },
        {
            icon: c => <EmailColor className={c} />,
            label: 'Email',
            onClick: () => { },
        },
        {
            icon: c => <CallIcon className={c} />,
            label: 'Phone',
            onClick: () => { },
        },
        {
            icon: c => <SmsColor className={c} />,
            label: 'Sms',
            onClick: () => { },
        },
        {
            icon: c => <IosColor className={c} />,
            label: 'iOS SDk',
            onClick: () => history.push(paths.CHANNELS_ADD_IOS.path, whatsAppData),
        },
        {
            icon: c => <AndroidColor className={c} />,
            label: 'Android SDK',
            onClick: () => history.push(paths.CHANNELS_ADD_ANDROID.path, whatsAppData),
        },
    ];

    const Option: FC<{ option: ChannelOption }> = ({ option }) => {
        const [color, setColor] = useState('#989898');

        return (
            <Paper
                className={classes.optionContainer}
                elevation={0}
                onClick={option.onClick}
                onMouseOver={() => setColor('white')}
                onMouseLeave={() => setColor('#989898')}
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
        <Breadcrumbs aria-label="breadcrumb">
            <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); history.push(paths.CHANNELS)}}>
                {t(langKeys.previoustext)}
            </Link>
        </Breadcrumbs>
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