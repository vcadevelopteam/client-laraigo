import { Button, LinearProgress, Paper, Tooltip, Typography, makeStyles, withStyles } from '@material-ui/core';
import paths from 'common/constants/paths';
import { useSelector } from 'hooks';
import { AndroidColor, AppStoreColor, BloggerColor, ChatWebColor, ClientIcon, DashboardRouteIcon, FacebookColor, FacebookMessengerColor, FormColor, InstagramColor, IosColor, LinkedInColor, MailColor, MessageInboxIcon, MetaColor, MyBusinessColor, PlayStoreColor, SmsColor, TeamsColor, TelegramColor, TikTokColor, TwitterColor, UserGroupIcon, VoiceColor, WhatsAppColor, WorkplaceColor, WorkplaceWallColor, YouTubeColor } from 'icons';
import { langKeys } from 'lang/keys';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
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
        height: 84,
        margin: 4,
        width: 84,
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
    id: number;
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
    const [view, setView] = useState("view-1");
    const [metatype, setMetaType] = useState("");
    const [channelList, setchannelList] = useState(["Facebook", "Messenger", "Instagram", "Instagram Direct"]);
    const [metachannelsDone, setmetachannelsDone] = useState<any>([]);
    const doneChannels = JSON.parse(localStorage.getItem('metachannels') || '[]');

    const socialMediaOptions: ChannelOption[] = [
        {
            icon: (c) => <FacebookColor className={c} />,
            label: t(langKeys.channel_facebook),
            id: 1,
            clear: "Facebook",
            onClick: () => {
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
            id: 2,
            onClick: () => {
                setView("view-2")
                setMetaType("Messenger")
                setchannelList(["Facebook", "Instagram", "Instagram Direct"].filter(channel => !metachannelsDone.includes(channel)))
            },
            tooltip: t(langKeys.tooltipchannel1)
        },
        {
            icon: (c) => <TwitterColor className={c} />,
            label: t(langKeys.channel_twitter),
            id: 3,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_TWITTER.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <TwitterColor className={c} />,
            label: t(langKeys.channel_twitterdm),
            id: 4,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_TWITTERDM.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <TikTokColor className={c} />,
            label: t(langKeys.channel_tiktok),
            id: 5,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_TIKTOK.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <InstagramColor className={c} />,
            label: t(langKeys.channel_instagram),
            clear: "Instagram",
            id: 6,
            onClick: () => {
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
            id: 7,
            onClick: () => {
                setView("view-2")
                setMetaType("Instagram Direct")
                setchannelList(["Instagram", "Facebook", "Messenger"].filter(channel => !metachannelsDone.includes(channel)))
            },
            tooltip: t(langKeys.tooltipchannel1)
        },
        {
            icon: (c) => <LinkedInColor className={c} />,
            label: t(langKeys.channel_linkedin),
            id: 8,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_LINKEDIN.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <TelegramColor className={c} />,
            label: t(langKeys.channel_telegram),
            id: 9,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_TELEGRAM.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <YouTubeColor className={c} />,
            label: t(langKeys.channel_youtube),
            id: 10,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_YOUTUBE.path, {
                    onboarding: true,
                });
            },
        },
    ];

    const businessChannelOptions: ChannelOption[] = [
        {
            icon: (c) => <ChatWebColor className={c} />,
            label: t(langKeys.channel_chatweb),
            id: 11,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_CHATWEB.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <SmsColor className={c} />,
            id: 12,
            label: t(langKeys.channel_sms),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_SMS.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <MailColor className={c} />,
            label: t(langKeys.channel_email),
            id: 13,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_EMAIL.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <FormColor className={c} />,
            id: 14,
            label: t(langKeys.web_form),
            onClick: () => {
                history.push(paths.CHANNELS_ADD_WEBFORM.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <BloggerColor className={c} />,
            label: t(langKeys.channel_blogger),
            id: 15,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_BLOGGER.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <MyBusinessColor className={c} />,
            label: t(langKeys.channel_business),
            id: 16,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_BUSINESS.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <MetaColor className={c} />,
            label: t(langKeys.channel_metalead),
            id: 17,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_FACEBOOK_LEAD.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <TeamsColor className={c} />,
            label: t(langKeys.channel_teams),
            id: 18,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_TEAMS.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <PlayStoreColor className={c} />,
            label: t(langKeys.channel_playstore),
            id: 19,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_PLAYSTORE.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <AppStoreColor className={c} />,
            label: t(langKeys.channel_appstore),
            id: 20,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_APPSTORE.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <IosColor className={c} />,
            label: t(langKeys.channel_ios),
            id: 21,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_IOS.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <AndroidColor className={c} />,
            label: t(langKeys.channel_android),
            id: 22,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_ANDROID.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <WorkplaceColor className={c} />,
            label: t(langKeys.channel_workplacedm),
            id: 23,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_FACEBOOKDM.path, {
                    onboarding: true,
                });
            },
        },
        {
            icon: (c) => <WorkplaceWallColor className={c} />,
            label: t(langKeys.channel_workplace),
            id: 24,
            onClick: () => {
                history.push(paths.CHANNELS_ADD_FACEBOOKWORKPLACE.path, {
                    onboarding: true,
                });
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
                    <div className='row-zyx'>
                        <div className='col-3' style={{ display: "flex" }}>
                            <div className={classes.containerBorder} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <WhatsAppColor className={classes.icon} style={{ height: 60, width: 60 }} />
                                        <h2 style={{ margin: 0 }}>{t(langKeys.whatsapp1)}</h2>
                                    </div>
                                    <p>{t(langKeys.whatsapp2)}</p>
                                </div>
                                <div style={{ justifyContent: "center", display: "flex", marginTop: 'auto' }}>
                                    <ColorButton variant="contained" color="primary" onClick={() => {
                                        const callback = () => {
                                            history.push(paths.CHANNELS_ADD_WHATSAPP.path, {
                                                row: null,
                                                typeWhatsApp: "NONE",
                                                onboarding: true,
                                            });
                                        }

                                        const callbackcancel = () => {
                                            history.push(paths.CHANNELS_ADD_WHATSAPPONBOARDING.path, {
                                                row: null,
                                                typeWhatsApp: "NONE",
                                                onboarding: true,
                                            });
                                        }

                                        dispatch(manageConfirmation({
                                            callback,
                                            callbackcancel,
                                            question: t(langKeys.askwhatsapptype),
                                            textCancel: "No",
                                            textConfirm: t(langKeys.yes),
                                            visible: true,
                                        }))
                                    }}>
                                        {t(langKeys.connect) + " WhatsApp"}
                                    </ColorButton>
                                </div>
                            </div>
                        </div>

                        <div className='col-9' style={{ display: "flex" }}>
                            <div className={classes.containerBorder} style={{ paddingBottom: 0 }}>
                                <div>
                                    <h2 style={{ margin: 0 }}>{t(langKeys.configureotherchannels)}</h2>
                                    <div className='row-zyx' style={{ margin: 0 }}>
                                        <div className='col-5'>
                                            <Typography className={classes.subtitle}>{t(langKeys.socialmedias)}</Typography>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    flexWrap: "wrap",
                                                    gap: 4,
                                                }}
                                            >
                                                {socialMediaOptions.filter(channel => !doneChannels.includes(channel.id)).map((e, i) => (
                                                    <Option key={`social_media_option_${i}`} option={e} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className='col-7'>
                                            <Typography className={classes.subtitle}>{t(langKeys.business2)}</Typography>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    flexWrap: "wrap",
                                                    gap: 4,
                                                }}
                                            >
                                                {businessChannelOptions.filter(channel => !doneChannels.includes(channel.id)).map((e, i) => (
                                                    <Option key={`business_channel_option_${i}`} option={e} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row-zyx'>
                        <div className='col-3' style={{ display: "flex" }}>
                            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className={classes.containerBorder}>
                                <div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <VoiceColor className={classes.icon} style={{ height: 60, width: 60 }} />
                                        <h2 style={{ margin: 0 }}>{t(langKeys.voicechannelconf1)}</h2>
                                    </div>
                                    <p>{t(langKeys.voicechannelconf2)}</p>
                                </div>
                                <div style={{ justifyContent: "center", display: "flex", marginTop: 'auto' }}>
                                    <ColorButton2 variant="contained" color="primary" onClick={(e) => {
                                        e.preventDefault();
                                        history.push(paths.CHANNELS_ADD_PHONE.path, {
                                            onboarding: true,
                                        });
                                    }}>
                                        {t(langKeys.configure) + " " + t(langKeys.channel)}
                                    </ColorButton2>
                                </div>
                            </div>
                        </div>

                        <div className='col-9'>
                            <div className='row-zyx' style={{ marginTop: 20, marginBottom: 0, display: 'flex' }}>
                                <div className='col-6' style={{ flex: 1 }}>
                                    <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div style={{ display: "flex", alignItems: "center", padding: 15 }} className='col-12'>
                                            <div style={{ width: 100, height: 100, marginLeft: 10 }}>
                                                <UserGroupIcon className={classes.icon} style={{ width: 40, height: 40 }} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", marginLeft: "8px", width: "100%" }}>
                                                <h2 style={{ margin: 0 }}>{t(langKeys.createusrandpermits1)}</h2>
                                                <p style={{ margin: 0 }}>{t(langKeys.createusrandpermits2)}</p>
                                            </div>
                                        </div>
                                        <Button variant="outlined" style={{ width: 100, alignSelf: "flex-end", margin: "0 15px 15px 0" }} onClick={() => {
                                            history.push(paths.USERS, {
                                                onboarding: true,
                                            });
                                        }}>{t(langKeys.create)}</Button>
                                    </Paper>
                                </div>
                                <div className='col-6' style={{ flex: 1 }}>
                                    <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div style={{ display: "flex", alignItems: "center", padding: 15 }} className='col-12'>
                                            <div style={{ width: 100, height: 100, marginLeft: 10 }}>
                                                <ClientIcon className={classes.icon} style={{ width: 40, height: 40 }} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", marginLeft: "8px", width: "100%" }}>
                                                <h2 style={{ margin: 0 }}>{t(langKeys.importlist1)}</h2>
                                                <p style={{ margin: 0 }}>{t(langKeys.importlist2)}</p>
                                            </div>
                                        </div>
                                        <Button variant="outlined" style={{ width: 100, alignSelf: "flex-end", margin: "0 15px 15px 0" }} onClick={() => {
                                            history.push(paths.PERSON, {
                                                onboarding: true,
                                            });
                                        }}>{t(langKeys.import)}</Button>
                                    </Paper>
                                </div>
                            </div>
                            <div className='row-zyx' style={{ marginBottom: 0, display: 'flex' }}>
                                <div className='col-6' style={{ flex: 1 }}>
                                    <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div style={{ display: "flex", alignItems: "center", padding: 15 }} className='col-12'>
                                            <div style={{ width: 100, height: 100, marginLeft: 10 }}>
                                                <DashboardRouteIcon className={classes.icon} style={{ width: 40, height: 40 }} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", marginLeft: "8px", width: "100%" }}>
                                                <h2 style={{ margin: 0 }}>{t(langKeys.recharge1)}</h2>
                                                <p style={{ margin: 0 }}>{t(langKeys.recharge2)}</p>
                                            </div>
                                        </div>
                                        <Button variant="outlined" style={{ width: 100, alignSelf: "flex-end", margin: "0 15px 15px 0" }} onClick={() => {
                                            history.push(paths.INVOICE + "?recharge=true", {
                                                onboarding: true,
                                            });
                                        }}>{t(langKeys.messagetemplate_reload)}</Button>
                                    </Paper>
                                </div>
                                <div className='col-6' style={{ flex: 1 }}>
                                    <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div style={{ display: "flex", alignItems: "center", padding: 15 }} className='col-12'>
                                            <div style={{ width: 100, height: 100, marginLeft: 10 }}>
                                                <MessageInboxIcon className={classes.icon} style={{ width: 40, height: 40 }} />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", marginLeft: "8px", width: "100%" }}>
                                                <h2 style={{ margin: 0 }}>{t(langKeys.talkwithadviser1)}</h2>
                                                <p style={{ margin: 0 }}>{t(langKeys.talkwithadviser2)}</p>
                                            </div>
                                        </div>
                                        <Button variant="outlined" style={{ width: 100, alignSelf: "flex-end", margin: "0 15px 15px 0" }} onClick={() => {
                                            window.open('https://api.whatsapp.com/send?phone=51941865635', '_blank');
                                        }}>{t(langKeys.contact2)}</Button>
                                    </Paper>
                                </div>
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