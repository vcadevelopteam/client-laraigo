import { FC, useContext, useMemo } from "react";
import { Breadcrumbs, Link, makeStyles } from "@material-ui/core";
import { ChannelAddFacebook } from './ChannelAddFacebook'
import { ChannelAddInstagram } from './ChannelAddInstagram'
import { ChannelAddInstagramDM } from './ChannelAddInstagramDM'
import { ChannelAddMessenger } from './ChannelAddMessenger'
import { ChannelAddWhatsapp } from './ChannelAddWhatsapp'
import { ChannelAddTelegram } from './ChannelAddTelegram'
import { ChannelAddTwitter } from './ChannelAddTwitter'
import { ChannelAddTwitterDM } from './ChannelAddTwitterDM'
import { ChannelAddChatWeb } from './ChannelAddChatWeb'
import { ChannelAddAndroid } from './ChannelAddAndroid'
import { ChannelAddIos } from './ChannelAddIos'
import { Trans } from "react-i18next";
import { langKeys } from "lang/keys";
import { ListChannels, SubscriptionContext } from "./context";

const useLeftSideStyles = makeStyles(theme => ({
    root: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 40,
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    title: {
        color: theme.palette.primary.main,
        textAlign: 'center',
    },
    channelList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2em',
    },
}));

interface LeftSideProps {
    setrequestchannels: (param: any) => void;
    setOpenWarning: (param: any) => void;
}

export const LeftSide: FC<LeftSideProps> = ({
    setrequestchannels,
    setOpenWarning,
}) => {
    const classes = useLeftSideStyles();
    const { listchannels } = useContext(SubscriptionContext);

    const channels = useMemo(() => {
        return Object
            .keys(listchannels)
            .filter(x => listchannels[x as keyof ListChannels] === true)
            .map((key, i) => {
                switch (key as keyof ListChannels) {
                    case 'facebook':
                        return (
                            <ChannelAddFacebook
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'instagram':
                        return (
                            <ChannelAddInstagram
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'instagramDM':
                        return (
                            <ChannelAddInstagramDM
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'messenger':
                        return (
                            <ChannelAddMessenger
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'whatsapp':
                        return (
                            <ChannelAddWhatsapp
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'telegram':
                        return (
                            <ChannelAddTelegram
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'twitter':
                        return (
                            <ChannelAddTwitter
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'twitterDM':
                        return (
                            <ChannelAddTwitterDM
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'chatWeb':
                        return (
                            <ChannelAddChatWeb
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'email':
                        return <div key={i}>email</div>;
                    case 'phone':
                        return <div key={i}>phone</div>;
                    case 'sms':
                        return <div key={i}>sms</div>;
                    case 'android':
                        return (
                            <ChannelAddAndroid
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    case 'apple':
                        return (
                            <ChannelAddIos
                                key={i}
                                setOpenWarning={setOpenWarning}
                            />
                        );
                    default: return <div key={i} />;
                }
            });
    }, [listchannels]);

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: '1em' }}>
                <Link
                    color="textSecondary"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        setOpenWarning(true);
                    }}
                >
                    {'<< '}<Trans i18nKey={langKeys.previoustext} />
                </Link>
            </Breadcrumbs>
            <h1 className={classes.title}>Canal seleccionado</h1>
            <div className={classes.channelList}>
                {channels}
            </div>
        </div>
    );
}