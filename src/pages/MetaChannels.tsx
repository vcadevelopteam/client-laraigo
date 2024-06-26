import { Button, LinearProgress, Paper, Tooltip, Typography, makeStyles, withStyles } from '@material-ui/core';
import paths from 'common/constants/paths';
import { useSelector } from 'hooks';
import { AndroidColor, AppStoreColor, BloggerColor, ChatWebColor, ClientIcon, DashboardRouteIcon, FacebookColor, FacebookMessengerColor, FormColor, InstagramColor, IosColor, LinkedInColor, MailColor, MessageInboxIcon, MetaColor, MyBusinessColor, PlayStoreColor, SmsColor, TeamsColor, TelegramColor, TikTokColor, TwitterColor, UserGroupIcon, VoiceColor, WhatsAppColor, WorkplaceColor, WorkplaceWallColor, YouTubeColor } from 'icons';
import { langKeys } from 'lang/keys';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { manageConfirmation } from 'store/popus/actions';
import MetaChannelsConfig from './MetaChannelsConfig';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 15,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 8
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
    },
}))(LinearProgress);

const useMetaChannelsStyles = makeStyles(() => ({
    containerBorder: {
        border: "1px solid #A93DBE",
        borderRadius: "8px",
        padding: "18px",
    },
    optionContainer: {
        backgroundColor: "white",
        boxShadow: "-5px 7px 6px 0px #a5a5a5",
        color: "#A59F9F",
        display: "flex",
        fill: "#A59F9F",
        flexDirection: "column",
        fontSize: 16,
        fontWeight: 400,
        height: 90,
        margin: 4,
        width: 100,
        "&:hover": {
            boxShadow: "none",
            color: "#A59F9F",
            cursor: "pointer",
            fill: "white",
            opacity: 0.6,
        },
    },
    icon: {
        fill: "inherit",
        height: 35,
    },
    subtitle: {
        fontSize: 18,
        color: "#A93DBE",
        fontWeight: 500,
        margin: "8px 0 8px 4px",
    },
}));

interface ChannelOption {
    icon: (className: string) => React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
    tooltip?: string;
    clear?: string;
}
interface WhatsAppData {
    row?: unknown;
    typeWhatsApp?: string;
}

const ColorButton = withStyles(() => ({
    root: {
        color: "white",
        backgroundColor: "#40c351",
        '&:hover': {
            backgroundColor: "#40c351",
        },
    },
}))(Button);

const ColorButton2 = withStyles(() => ({
    root: {
        color: "white",
        backgroundColor: "#A93DBE",
        '&:hover': {
            backgroundColor: "#A93DBE",
        },
    },
}))(Button);

const MetaChannels: FC = () => {
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const classes = useMetaChannelsStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation<WhatsAppData>();
    const whatsAppData = location.state as WhatsAppData | null;
    const [view, setView] = useState("view-1");
    const [metatype, setMetaType] = useState("");
    const [channelList, setchannelList] = useState(["Facebook", "Messenger", "Instagram", "Instagram Direct"]);
    const [metachannelsDone, setmetachannelsDone] = useState<any>([]);

    const socialMediaOptions: ChannelOption[] = [
        {
            icon: (c) => <FacebookColor className={c} />,
            label: t(langKeys.channel_facebook),
            clear: "Facebook",
            onClick: () => {
                //history.push(paths.CHANNELS_ADD_FACEBOOK.path, whatsAppData);
                setView("view-2")
                setMetaType("Facebook")
                setchannelList(["Messenger", "Instagram", "Instagram Direct"].filter(channel => !metachannelsDone.includes(channel)))
            },
            tooltip: t(langKeys.tooltipchannel1)
        },
        {
            icon: (c) => <FacebookMessengerColor className={c} />,
            label: t(langKeys.channel_messenger),
            clear: "Messenger",
            onClick: () => {
                //history.push(paths.CHANNELS_ADD_MESSENGER.path, whatsAppData);
                setView("view-2")
                setMetaType("Messenger")
                setchannelList(["Facebook", "Instagram", "Instagram Direct"].filter(channel => !metachannelsDone.includes(channel)))
            },
            tooltip: t(langKeys.tooltipchannel1)
        },
        {
            icon: (c) => <TwitterColor className={c} />,
            label: t(langKeys.channel_twitter),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_TWITTER.path, whatsAppData);
            },
        },
        {
            icon: (c) => <TwitterColor className={c} />,
            label: t(langKeys.channel_twitterdm),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_TWITTERDM.path, whatsAppData);
            },
        },
        {
            icon: (c) => <TikTokColor className={c} />,
            label: t(langKeys.channel_tiktok),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_TIKTOK.path, whatsAppData);
            },
        },
        {
            icon: (c) => <InstagramColor className={c} />,
            label: t(langKeys.channel_instagram),
            clear: "Instagram",
            onClick: () => {
                //history.push(paths.CHANNELS_ADD_INSTAGRAM.path, whatsAppData);
                setView("view-2")
                setMetaType("Instagram")
                setchannelList(["Instagram Direct", "Facebook", "Messenger"].filter(channel => !metachannelsDone.includes(channel)))
            },
            tooltip: t(langKeys.tooltipchannel1)
        },
        {
            icon: (c) => <InstagramColor className={c} />,
            label: t(langKeys.channel_instagramdm),
            clear: "Instagram Direct",
            onClick: () => {
                //history.push(paths.CHANNELS_ADD_INSTAGRAMDM.path, whatsAppData);                
                setView("view-2")
                setMetaType("Instagram Direct")
                setchannelList(["Instagram", "Facebook", "Messenger"].filter(channel => !metachannelsDone.includes(channel)))
            },
            tooltip: t(langKeys.tooltipchannel1)
        },
        {
            icon: (c) => <LinkedInColor className={c} />,
            label: t(langKeys.channel_linkedin),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_LINKEDIN.path, whatsAppData);
            },
        },
        {
            icon: (c) => <TelegramColor className={c} />,
            label: t(langKeys.channel_telegram),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_TELEGRAM.path, whatsAppData);
            },
        },
        {
            icon: (c) => <YouTubeColor className={c} />,
            label: t(langKeys.channel_youtube),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_YOUTUBE.path, whatsAppData);
            },
        },
        /*{
            icon: (c) => <WhatsAppColor className={c} />,
            label: t(langKeys.channel_whatsapp),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_WHATSAPP.path, whatsAppData);
            },
        },
        {
            icon: (c) => <WhatsAppOnboardingColor className={c} />,
            label: t(langKeys.channel_whatsapponboarding),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_WHATSAPPONBOARDING.path, whatsAppData);
            },
        },*/
    ];

    const businessChannelOptions: ChannelOption[] = [
        {
            icon: (c) => <ChatWebColor className={c} />,
            label: t(langKeys.channel_chatweb),
            onClick: () => history.push(paths.CHANNELS_ADD_CHATWEB.path),
        },
        {
            icon: (c) => <SmsColor className={c} />,
            label: t(langKeys.channel_sms),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_SMS.path, whatsAppData);
            },
        },
        {
            icon: (c) => <MailColor className={c} />,
            label: t(langKeys.channel_email),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_EMAIL.path, whatsAppData);
            },
        },
        {
            icon: (c) => <FormColor className={c} />,
            label: t(langKeys.web_form),
            onClick: () => history.push(paths.CHANNELS_ADD_WEBFORM.path),
        },
        {
            icon: (c) => <BloggerColor className={c} />,
            label: t(langKeys.channel_blogger),
            onClick: () => history.push(paths.CHANNELS_ADD_BLOGGER.path, whatsAppData),
        },
        {
            icon: (c) => <MyBusinessColor className={c} />,
            label: t(langKeys.channel_business),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_BUSINESS.path, whatsAppData);
            },
        },
        {
            icon: (c) => <MetaColor className={c} />,
            label: t(langKeys.channel_metalead),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_FACEBOOK_LEAD.path, whatsAppData);
            },
        },
        {
            icon: (c) => <TeamsColor className={c} />,
            label: t(langKeys.channel_teams),
            onClick: () => history.push(paths.CHANNELS_ADD_TEAMS.path, whatsAppData),
        },
        {
            icon: (c) => <PlayStoreColor className={c} />,
            label: t(langKeys.channel_playstore),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_PLAYSTORE.path, whatsAppData);
            },
        },
        {
            icon: (c) => <AppStoreColor className={c} />,
            label: t(langKeys.channel_appstore),
            onClick: () => history.push(paths.CHANNELS_ADD_APPSTORE.path, whatsAppData),
        },
        {
            icon: (c) => <IosColor className={c} />,
            label: t(langKeys.channel_ios),
            onClick: () => history.push(paths.CHANNELS_ADD_IOS.path, whatsAppData),
        },
        {
            icon: (c) => <AndroidColor className={c} />,
            label: t(langKeys.channel_android),
            onClick: () => history.push(paths.CHANNELS_ADD_ANDROID.path, whatsAppData),
        },
        {
            icon: (c) => <WorkplaceColor className={c} />,
            label: t(langKeys.channel_workplacedm),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_FACEBOOKDM.path, whatsAppData);
            },
        },
        /*{
            icon: (c) => <VoiceColor className={c} />,
            label: t(langKeys.channel_phone),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_PHONE.path, whatsAppData);
            },
        },*/
        {
            icon: (c) => <WorkplaceWallColor className={c} />,
            label: t(langKeys.channel_workplace),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_FACEBOOKWORKPLACE.path, whatsAppData);
            },
        },
    ];

    const Option: FC<{ option: ChannelOption }> = ({ option }) => {
        const content = (
            <Paper className={classes.optionContainer} elevation={0} onClick={option.onClick}>
                <div style={{ flexGrow: 2, alignItems: "center", display: "flex", justifyContent: "center" }}>
                    {option.icon(classes.icon)}
                </div>
                <div
                    style={{
                        alignItems: "start",
                        display: "flex",
                        flexGrow: 1,
                        flexWrap: "wrap",
                        fontSize: 14,
                        justifyContent: "center",
                        maxHeight: 39,
                        textAlign: "center",
                    }}
                >
                    {option.label}
                </div>
            </Paper>
        );

        return option.tooltip ? (
            <Tooltip title={option.tooltip}>
                {content}
            </Tooltip>
        ) : (
            content
        );
    };
    if (view === "view-1") {
        return (
            <div style={{ margin: "20px 30px", width: "100%" }}>
                <h1 style={{ margin: 0 }}>{t(langKeys.greetinguser, { username: user?.firstname })}</h1>
                <div style={{ display: 'flex', gap: 8 }}>
                    <h1 style={{ margin: 0 }}>{t(langKeys.welcomemessage)}</h1>
                    <h1 style={{ color: "#A93DBE", margin: 0 }}>Laraigo</h1>
                </div>
                <p style={{ margin: 0, fontSize: 15 }}>{t(langKeys.welcomemessage2)}</p>
                <BorderLinearProgress variant="determinate" value={10} />
                <p style={{ margin: 0, marginBottom: 20 }}>10% {t(langKeys.potentiallaraigo)}</p>
                <div className='row-zyx' style={{ backgroundColor: "#f9f9fa" }}>
                    <div className='col-3'>
                        <div className={classes.containerBorder}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <WhatsAppColor className={classes.icon} style={{ height: 60, width: 60 }} />
                                <h2 style={{ margin: 0 }}>{t(langKeys.whatsapp1)}</h2>
                            </div>
                            <p>{t(langKeys.whatsapp2)}</p>
                            <div style={{ justifyContent: "center", display: "flex" }}>
                                <ColorButton variant="contained" color="primary" onClick={() => {
                                    const callback = () => {
                                        history.push(paths.CHANNELS_ADD_WHATSAPP.path, whatsAppData);
                                    }
                                    const callbackcancel = () => {
                                        history.push(paths.CHANNELS_ADD_WHATSAPPONBOARDING.path, whatsAppData);
                                    }
                                    dispatch(manageConfirmation({
                                        visible: true,
                                        question: t(langKeys.askwhatsapptype),
                                        callback,
                                        textConfirm: t(langKeys.yes),
                                        textCancel: "No",
                                        callbackcancel
                                    }))
                                }}>
                                    {t(langKeys.connect) + " WhatsApp"}
                                </ColorButton>
                            </div>
                        </div>
                        <div style={{ marginTop: 10 }} className={classes.containerBorder}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <VoiceColor className={classes.icon} style={{ height: 60, width: 60 }} />
                                <h2 style={{ margin: 0 }}>{t(langKeys.voicechannelconf1)}</h2>
                            </div>
                            <p>{t(langKeys.voicechannelconf2)}</p>
                            <div style={{ justifyContent: "center", display: "flex" }}>
                                <ColorButton2 variant="contained" color="primary" onClick={(e) => {
                                    e.preventDefault();
                                    history.push(paths.CHANNELS_ADD_PHONE.path, whatsAppData);
                                }}>
                                    {t(langKeys.configure) + " " + t(langKeys.channel)}
                                </ColorButton2>
                            </div></div>
                    </div>
                    <div className='col-9'><div className={classes.containerBorder} style={{ paddingBottom: 0 }}>
                        <div>
                            <h2 style={{ margin: 0 }}>{t(langKeys.configureotherchannels)}</h2>
                            <div className='row-zyx' style={{ margin: 0 }}>
                                <div className='col-6'>
                                    <Typography className={classes.subtitle}>{t(langKeys.socialmedias)}</Typography>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: 8,
                                        }}
                                    >
                                        {socialMediaOptions.filter(channel => !metachannelsDone.includes(channel.clear)).map((e, i) => (
                                            <Option key={`social_media_option_${i}`} option={e} />
                                        ))}
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <Typography className={classes.subtitle}>{t(langKeys.business2)}</Typography>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {businessChannelOptions.map((e, i) => (
                                            <Option key={`business_channel_option_${i}`} option={e} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div className='row-zyx' style={{ marginTop: 20, marginBottom: 0 }}>
                            <div className='col-6'>
                                <Paper elevation={3}>
                                    <div style={{ display: "flex", alignItems: "center", padding: 15 }}>
                                        <div style={{ width: 100, height: 100, marginLeft: 10 }}>
                                            <UserGroupIcon className={classes.icon} style={{ width: 40, height: 40 }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", marginLeft: "8px", width: "100%" }}>
                                            <h2 style={{ margin: 0 }}>{t(langKeys.createusrandpermits1)}</h2>
                                            <p style={{ margin: 0 }}>{t(langKeys.createusrandpermits2)}</p>
                                            <Button variant="outlined" style={{ width: 100, alignSelf: "flex-end", marginTop: 20 }} onClick={() => {
                                                history.push(paths.USERS, whatsAppData);
                                            }}>{t(langKeys.create)}</Button>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                            <div className='col-6'>
                                <Paper elevation={3}>
                                    <div style={{ display: "flex", alignItems: "center", padding: 15 }}>
                                        <div style={{ width: 100, height: 100, marginLeft: 10 }}>
                                            <ClientIcon className={classes.icon} style={{ width: 40, height: 40 }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", marginLeft: "8px", width: "100%" }}>
                                            <h2 style={{ margin: 0 }}>{t(langKeys.importlist1)}</h2>
                                            <p style={{ margin: 0 }}>{t(langKeys.importlist2)}</p>
                                            <Button variant="outlined" style={{ width: 100, alignSelf: "flex-end", marginTop: 20 }} onClick={() => {
                                                history.push(paths.PERSON, whatsAppData);
                                            }}>{t(langKeys.import)}</Button>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                        </div>
                        <div className='row-zyx' style={{ marginTop: 8 }}>
                            <div className='col-6'>
                                <Paper elevation={3}>
                                    <div style={{ display: "flex", alignItems: "center", padding: 15 }}>
                                        <div style={{ width: 100, height: 100, marginLeft: 10 }}>
                                            <DashboardRouteIcon className={classes.icon} style={{ width: 40, height: 40 }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", marginLeft: "8px", width: "100%" }}>
                                            <h2 style={{ margin: 0 }}>{t(langKeys.recharge1)}</h2>
                                            <p style={{ margin: 0 }}>{t(langKeys.recharge2)}</p>
                                            <Button variant="outlined" style={{ width: 100, alignSelf: "flex-end", marginTop: 20 }} onClick={() => {
                                                history.push(paths.INVOICE + "?recharge=true", whatsAppData);
                                            }}>{t(langKeys.messagetemplate_reload)}</Button>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                            <div className='col-6'>
                                <Paper elevation={3}>
                                    <div style={{ display: "flex", alignItems: "center", padding: 15 }}>
                                        <div style={{ width: 100, height: 100, marginLeft: 10 }}>
                                            <MessageInboxIcon className={classes.icon} style={{ width: 40, height: 40 }} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", marginLeft: "8px", width: "100%" }}>
                                            <h2 style={{ margin: 0 }}>{t(langKeys.talkwithadviser1)}</h2>
                                            <p style={{ margin: 0 }}>{t(langKeys.talkwithadviser2)}</p>
                                            <Button variant="outlined" style={{ width: 100, alignSelf: "flex-end", marginTop: 20 }} onClick={() => {
                                                window.open('https://api.whatsapp.com/send?phone=51941865635', '_blank');
                                            }}>{t(langKeys.contact2)}</Button>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    } else {
        return <MetaChannelsConfig setView={setView} metatype={metatype} channelList={channelList} setchannelList={setchannelList} setmetachannelsDone={setmetachannelsDone} metachannelsDone={metachannelsDone} />
    }
}

export default MetaChannels;