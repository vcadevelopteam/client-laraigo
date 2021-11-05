/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Typography, Paper } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import { Facebook as FacebookIcon, Instagram as InstagramIcon, WhatsApp as WhatsAppIcon } from "@material-ui/icons";
import { AndroidIcon, AppleIcon, FacebookMessengerIcon, ZyxmeMessengerIcon } from "icons";
import SmsIcon from '@material-ui/icons/Sms';
import { useSelector } from "hooks";

interface ChannelOption {
    icon: React.ReactNode;
    label: React.ReactNode;
    key: string;
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
            marginBottom: '20px'
        }
    },
    separator: {
        borderBottom: "grey solid 1px",
        width: "10vh",
        height: "1.6vh",
        margin: "0 40px"
    },
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
        margin: '20px 0 8px 4px',
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
        fill: '#A59F9F',
        '&:hover': {
            color: 'white',
            backgroundColor: 'lightgrey',
            //backgroundColor: '#7721AD',
            cursor: 'pointer',
            fontWeight: 700,
        },
    },
    optionContainerSelected: {
        margin: 4,
        display: 'flex',
        flexDirection: 'column',
        width: 124,
        height: 110,
        backgroundColor: '#7721AD',
        fontSize: 16,
        fontWeight: 700,
        color: 'white',
        fill: 'white',
    },
    icon: {
        fill: 'inherit',
        height: 25,
    },
}));

export const ThirdStep: FC<{ setlistchannels: (param: any) => void, listchannels: any, setStep: (param: any) => void, setsendchannels: (param: any) => void,setrequestchannels: (param: any) => void ,setOpenWarning:(param:any)=>void
}> = ({ setlistchannels, listchannels, setStep, setsendchannels,setrequestchannels,setOpenWarning }) => {

    const { t } = useTranslation();
    const planData = useSelector(state => state.signup.verifyPlan)
    const limitChannels = planData.data[0].channelscontracted
    const [selectedChannels, setselectedChannels] = useState(0);
    const classes = useChannelAddStyles();
    const socialMediaOptions: ChannelOption[] = [
        {
            icon: <FacebookIcon color="inherit" />,
            label: 'Facebook',
            key: 'facebook',
            onClick: () => {
                
                if(listchannels.facebook){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, facebook: !p.facebook }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.facebook?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, facebook: !p.facebook }))
                }
            },
            selected: listchannels.facebook
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram',
            key: 'instagram',
            onClick: () => {
                if(listchannels.instagram){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, instagram: !p.instagram }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.instagram?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, instagram: !p.instagram }))
                }
            },
            selected: listchannels.instagram
        },
        {
            icon: <InstagramIcon color="inherit" />,
            label: 'Instagram DM',
            key: 'instagramDM',
            onClick: () => {
                if(listchannels.instagramDM){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, instagramDM: !p.instagramDM }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.instagramDM?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, instagramDM: !p.instagramDM }))
                }
            },
            selected: listchannels.instagramDM
        },
        {
            icon: <FacebookMessengerIcon className={classes.icon} />,
            label: 'Messenger',
            key: 'messenger',
            onClick: () => {
                if(listchannels.messenger){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, messenger: !p.messenger }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.messenger?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, messenger: !p.messenger }))
                }
            },
            selected: listchannels.messenger
        },
        {
            icon: <WhatsAppIcon color="inherit" />,
            label: 'Whatsapp',
            key: 'whatsapp',
            onClick: () => {
                if(listchannels.whatsapp){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, whatsapp: !p.whatsapp }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.whatsapp?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, whatsapp: !p.whatsapp }))
                }
            },
            selected: listchannels.whatsapp
        },
        {
            icon: <TelegramIcon color="inherit" />,
            label: 'Telegram',
            key: 'telegram',
            onClick: () => {
                if(listchannels.telegram){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, telegram: !p.telegram }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.telegram?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, telegram: !p.telegram }))
                }
            },
            selected: listchannels.telegram
        },
        {
            icon: <TwitterIcon color="inherit" />,
            label: 'Twitter',
            key: 'twitter',
            onClick: () => {
                if(listchannels.twitter){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, twitter: !p.twitter }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.twitter?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, twitter: !p.twitter }))
                }
            },
            selected: listchannels.twitter
        },
        {
            icon: <TwitterIcon color="inherit" />,
            label: 'Twitter DM',
            key: 'twitterDM',
            onClick: () => {
                if(listchannels.twitterDM){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, twitterDM: !p.twitterDM }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.twitterDM?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, twitterDM: !p.twitterDM }))
                }
            },
            selected: listchannels.twitterDM
        },
    ];
    const businessChannelOptions: ChannelOption[] = [
        {
            icon: <ZyxmeMessengerIcon className={classes.icon} />,
            label: 'Chat Web',
            key: 'chatWeb',
            onClick: () => {
                if(listchannels.chatWeb){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, chatWeb: !p.chatWeb }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.chatWeb?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, chatWeb: !p.chatWeb }))
                }
            },
            selected: listchannels.chatWeb
        },
        {
            icon: <EmailIcon color="inherit" />,
            label: 'Email',
            key: 'email',
            onClick: () => {
                if(listchannels.email){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, email: !p.email }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.email?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, email: !p.email }))
                }
            },
            selected: listchannels.email

        },
        {
            icon: <SmsIcon color="inherit" />,
            label: 'Sms',
            key: 'sms',
            onClick: () => {
                if(listchannels.sms){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, sms: !p.sms }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.sms?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, sms: !p.sms }))
                }
            },
            selected: listchannels.sms
        },
        {
            icon: <AndroidIcon className={classes.icon} />,
            label: 'Android SDK',
            key: 'android',
            onClick: () => {
                if(listchannels.android){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, android: !p.android }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.android?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, android: !p.android }))
                }
            },
            selected: listchannels.android
        },
        {
            icon: <AppleIcon className={classes.icon} />,
            label: 'iOS SDk',
            key: 'apple',
            onClick: () => {
                if(listchannels.apple){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, apple: !p.apple }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.apple?setselectedChannels(selectedChannels-1):setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, apple: !p.apple }))
                }
            },
            selected: listchannels.apple
        },
    ];

    const Option: FC<{ option: ChannelOption, selected: Boolean }> = ({ option, selected }) => {
        const [color, setColor] = useState('#989898');
        return (
            <Paper
                className={
                    clsx({
                        [classes.optionContainerSelected]: selected,
                        [classes.optionContainer]: !selected,
                    })
                }
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
    return (
        <>
            <div>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                            {"<< Previous"}
                        </Link>
                    </Breadcrumbs>
                <div className={classes.title}>{t(langKeys.channeladdtitle)}</div>
                <Typography className={classes.subtitle}>{t(langKeys.socialmediachannel)}</Typography>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.socialmediachannel2)}</div>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {socialMediaOptions.map((e, i) =>
                        <Option
                            key={`social_media_option_${i}`}
                            option={e}
                            selected={listchannels[e.key]}
                        />
                    )}
                </div>
                <Typography className={classes.subtitle}>{t(langKeys.businesschannel)}</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {businessChannelOptions.map((e, i) => <Option key={`business_channel_option_${i}`} option={e} selected={listchannels[e.key]} />)}
                </div>
                <Button
                    onClick={() => { setsendchannels(true); setrequestchannels([])}}
                    className={classes.button}
                    fullWidth
                    style={{ marginTop: 30 }}
                    variant="contained"
                    color="primary"
                //disabled={nextbutton}
                >{t(langKeys.next)}
                </Button>
            </div>
        </>
    )
}
export default ThirdStep