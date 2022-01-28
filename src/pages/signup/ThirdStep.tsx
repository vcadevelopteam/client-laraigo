/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState } from "react";
import { makeStyles, Button, Typography, Paper } from '@material-ui/core';
import { langKeys } from "lang/keys";
import { Trans } from "react-i18next";
import clsx from "clsx";
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import { Facebook as FacebookIcon, Instagram as InstagramIcon, WhatsApp as WhatsAppIcon, ControlPoint as ControlPointIcon } from "@material-ui/icons";
import { AndroidIcon, AppleIcon, FacebookMessengerIcon, LaraigoLogo, ZyxmeMessengerIcon } from "icons";
import SmsIcon from '@material-ui/icons/Sms';
import { useSelector } from "hooks";
import { ListChannels, SubscriptionContext } from "./context";

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
        // justifyContent: 'center', // altera el scroll vertical
        // transform: 'translateY(-20px)',
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
        margin: '1em 0 8px 4px',
        fontSize: 20,
        fontWeight: 500,
        width: '100%',
        textAlign: 'start',
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    optionContainer: {
        margin: theme.spacing(1),
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
    icon: {
        fill: 'inherit',
        height: 38,
        width: 'auto',
    },
}));

interface ThirdStepProps {
    setStep: (param: any) => void;
    setsendchannels: (param: any) => void;
    setrequestchannels: (param: any) => void;
    setOpenWarning:(param:any) => void;
}

export const ThirdStep: FC<ThirdStepProps> = ({
    setStep,
    setsendchannels,
    setrequestchannels,
    setOpenWarning,
}) => {
    const {
        selectedChannels,
        setselectedChannels,
        listchannels,
        setlistchannels,
    } = useContext(SubscriptionContext);
    const planData = useSelector(state => state.signup.verifyPlan)
    const limitChannels = planData.data[0].channelscontracted
    const classes = useChannelAddStyles();
    const socialMediaOptions: ChannelOption[] = [
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
                    listchannels.messenger?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, messenger: !p.messenger }))
                }
            },
            selected: listchannels.messenger
        },
        {
            icon: <WhatsAppIcon className={classes.icon} />,
            label: 'Whatsapp',
            key: 'whatsapp',
            onClick: () => {
                if(listchannels.whatsapp){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, whatsapp: !p.whatsapp }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.whatsapp?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, whatsapp: !p.whatsapp }))
                }
            },
            selected: listchannels.whatsapp
        },
        {
            icon: <FacebookIcon className={classes.icon} />,
            label: 'Facebook',
            key: 'facebook',
            onClick: () => {
                
                if(listchannels.facebook){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, facebook: !p.facebook }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.facebook?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, facebook: !p.facebook }))
                }
            },
            selected: listchannels.facebook
        },
        {
            icon: <InstagramIcon className={classes.icon} />,
            label: 'Instagram',
            key: 'instagram',
            onClick: () => {
                if(listchannels.instagram){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, instagram: !p.instagram }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.instagram?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, instagram: !p.instagram }))
                }
            },
            selected: listchannels.instagram
        },
        {
            icon: <InstagramIcon className={classes.icon} />,
            label: 'Instagram DM',
            key: 'instagramDM',
            onClick: () => {
                if(listchannels.instagramDM){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, instagramDM: !p.instagramDM }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.instagramDM?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, instagramDM: !p.instagramDM }))
                }
            },
            selected: listchannels.instagramDM
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
                    listchannels.chatWeb?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, chatWeb: !p.chatWeb }))
                }
            },
            selected: listchannels.chatWeb
        },
        {
            icon: <TelegramIcon className={classes.icon} />,
            label: 'Telegram',
            key: 'telegram',
            onClick: () => {
                if(listchannels.telegram){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, telegram: !p.telegram }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.telegram?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, telegram: !p.telegram }))
                }
            },
            selected: listchannels.telegram
        },
        {
            icon: <TwitterIcon className={classes.icon} />,
            label: 'Twitter',
            key: 'twitter',
            onClick: () => {
                if(listchannels.twitter){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, twitter: !p.twitter }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.twitter?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, twitter: !p.twitter }))
                }
            },
            selected: listchannels.twitter
        },
        {
            icon: <TwitterIcon className={classes.icon} />,
            label: 'Twitter DM',
            key: 'twitterDM',
            onClick: () => {
                if(listchannels.twitterDM){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, twitterDM: !p.twitterDM }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.twitterDM?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, twitterDM: !p.twitterDM }))
                }
            },
            selected: listchannels.twitterDM
        },
        {
            icon: <EmailIcon className={classes.icon} />,
            label: 'Email',
            key: 'email',
            onClick: () => {
                if(listchannels.email){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, email: !p.email }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.email?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, email: !p.email }))
                }
            },
            selected: listchannels.email

        },
        {
            icon: <SmsIcon className={classes.icon} />,
            label: 'Sms',
            key: 'sms',
            onClick: () => {
                if(listchannels.sms){
                    setselectedChannels(selectedChannels-1)
                    setlistchannels((p: any) => ({ ...p, sms: !p.sms }))
                }
                else if(limitChannels>selectedChannels){
                    listchannels.sms?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, sms: !p.sms }))
                }
            },
            selected: listchannels.sms
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
                    listchannels.apple?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, apple: !p.apple }))
                }
            },
            selected: listchannels.apple
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
                    listchannels.android?setselectedChannels(selectedChannels-1):
                    setselectedChannels(selectedChannels+1);
                    setlistchannels((p: any) => ({ ...p, android: !p.android }))
                }
            },
            selected: listchannels.android
        },
    ];

    const Option: FC<{ option: ChannelOption, selected: Boolean, index: number }> = ({
        option,
        selected,
        index,
    }) => {// limitChannels
        const reachedLimit = limitChannels <= selectedChannels;
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
                {selected && <div className={classes.indexDecorator}>
                    {index + 1}
                </div>}
                <div className={classes.optionIconContainer}>
                    {option.icon}
                </div>
                <div style={{ height: 38 }}>
                    <span>{option.label}</span>
                </div>
            </Paper>
        );
    };
    return (
        <div className={classes.root}>
            <LaraigoLogo style={{ width: '25%', height: 'auto', marginBottom: '1.58em' }} />
            <div className={classes.title}>
                Basic
            </div>
            <Typography style={{ fontSize: 20, fontWeight: 400 }}>
                Solo se podrá seleccionar un canal
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
export default ThirdStep