import React, { FC, useEffect, useState } from "react";
import { Box, makeStyles, Typography, Paper, Breadcrumbs, Button } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { Facebook as FacebookIcon, Instagram as InstagramIcon, WhatsApp as WhatsAppIcon, Message as MessageIcon } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect, TemplateSwitch } from "components";
import { useHistory, useRouteMatch } from "react-router";
import paths from "common/constants/paths";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { insertChannel } from "store/channel/actions";
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import SmsIcon from '@material-ui/icons/Sms';

interface ChannelOption {
    icon: React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
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
        width: 124,
        height: 110,
        backgroundColor: 'white',
        fontSize: 16,
        fontWeight: 400,
        color: '#A59F9F',
        '&:hover': {
            color: 'white',
            backgroundColor: '#7721AD',
            cursor: 'pointer',
            fontWeight: 700,
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
}));

export const ChannelAdd: FC = () => {
    const classes = useChannelAddStyles();
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch<{ id: string }>();


    const socialMediaOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Facebook',
            onClick: () => {history.push(paths.CHANNELS_ADD_FACEBOOK.path)},
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            onClick: () => {history.push(paths.CHANNELS_ADD_INSTAGRAM.path)},
        },
        {
            icon: <MessageIcon color="inherit" />,
            label: 'Messenger',
            onClick: () => {history.push(paths.CHANNELS_ADD_MESSENGER.path)},
        },
        {
            icon: <WhatsAppIcon color="inherit" />,
            label: 'Whatsapp',
            onClick: () => {history.push(paths.CHANNELS_ADD_WHATSAPP.path)},
        },
        {
            icon: <TelegramIcon color="inherit" />,
            label: 'Telegram',
            onClick: () => {history.push(paths.CHANNELS_ADD_TELEGRAM.path)},
        },
        {
            icon: <TwitterIcon color="inherit" />,
            label: 'Twitter',
            onClick: () => {history.push(paths.CHANNELS_ADD_TWITTER.path)},
        },
        {
            icon: <TwitterIcon color="inherit" />,
            label: 'Twitter DM',
            onClick: () => {history.push(paths.CHANNELS_ADD_TWITTERDM.path)},
        },
    ];


    const businessChannelOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Chat Web',
            onClick: () => history.push(paths.CHANNELS_ADD_CHATWEB.resolve(match.params.id)),
        },
        {
            icon: <EmailIcon color="inherit" />,
            label: 'Email',
            onClick: () => { },
        },
        {
            icon: <PhoneIcon color="inherit" />,
            label: 'Phone',
            onClick: () => { },
        },
        {
            icon: <SmsIcon color="inherit" />,
            label: 'Sms',
            onClick: () => { },
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
                    {option.icon}
                </div>
                <div style={{ height: 1, backgroundColor: color }} />
                <div style={{ flexGrow: 1, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    {option.label}
                </div>
            </Paper>
        );
    };
    return (<Box className={classes.root}>
        <div className={classes.content}>
            <h2 className={classes.title}>{t(langKeys.channeladdtitle)}</h2>
            <div style={{ height: 29 }} />
            <Typography className={classes.subtitle}>{t(langKeys.socialmediachannel)}</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {socialMediaOptions.map((e, i) =>
                    <Option
                        key={`social_media_option_${i}`}
                        option={e}
                    />
                )}
            </div>
            <Typography className={classes.subtitle}>{t(langKeys.businesschannel)}</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {businessChannelOptions.map((e, i) => <Option key={`business_channel_option_${i}`} option={e} />)}
            </div>
        </div>
    </Box>)
};

