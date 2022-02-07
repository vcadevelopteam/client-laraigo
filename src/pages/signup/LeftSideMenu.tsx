import { FC, useContext, useEffect, useMemo, useState } from "react";
import { Breadcrumbs, Button, Link, makeStyles } from "@material-ui/core";
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
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { ListChannels, SubscriptionContext } from "./context";
import { executeSubscription } from "store/signup/actions";
import { useDispatch } from "react-redux";
import { showBackdrop } from "store/popus/actions";
import { useSelector } from "hooks";
import { useHistory } from "react-router-dom";
import { showSnackbar } from "store/popus/actions";

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
    setOpenWarning: (param: any) => void;
}

export const LeftSide: FC<LeftSideProps> = ({ setOpenWarning }) => {
    const classes = useLeftSideStyles();
    const {
        foreground,
        finishreg,
        listchannels,
        selectedChannels,
        commonClasses,
    } = useContext(SubscriptionContext);
    const executeResult = useSelector(state => state.signup.insertChannel);

    const channels = useMemo(() => {
        // console.log('useMemo:channels', foreground);
        // if (foreground !== undefined) {
        //     const result = Object.
        //         keys(listchannels).
        //         findIndex(x => x === foreground && listchannels[foreground]);
        //     console.log('result', result);
        //     if (result !== -1) {
        //         console.log('result !== -1');
        //         return <GetComponent channel={foreground} />;
        //     }
        // }

        return Object
            .keys(listchannels)
            .filter(x => {
                // if (foreground !== undefined) {
                //     return (
                //         listchannels[x as keyof ListChannels] === true &&
                //         foreground === x
                //     );
                // }

                return listchannels[x as keyof ListChannels] === true;
            })
        // .map((key, i) => (
        //     <GetComponent
        //         channel={key as keyof ListChannels}
        //         key={i}
        //     />
        // ));
    }, [listchannels]);

    const getDisplay = (option: keyof ListChannels): string => {
        if (foreground !== undefined) {
            return option === foreground ? 'block' : 'none';
        }

        return channels.includes(option) ? 'block' : 'none';
    }

    return (
        <div className={classes.root}>
            {!foreground && (
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
            )}
            {!foreground && <h1 className={classes.title}>Canal seleccionado</h1>}
            <div className={classes.channelList}>
                {/* {channels} */}
                <div style={{ display: getDisplay('facebook') }}>
                    <ChannelAddFacebook
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('instagram') }}>
                    <ChannelAddInstagram
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('instagramDM') }}>
                    <ChannelAddInstagramDM
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('messenger') }}>
                    <ChannelAddMessenger
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('whatsapp') }}>
                    <ChannelAddWhatsapp
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('telegram') }}>
                    <ChannelAddTelegram
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('twitter') }}>
                    <ChannelAddTwitter
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('twitterDM') }}>
                    <ChannelAddTwitterDM
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('chatWeb') }}>
                    <ChannelAddChatWeb
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('email') }}>email</div>
                <div style={{ display: getDisplay('phone') }}>phone</div>
                <div style={{ display: getDisplay('sms') }}>sms</div>
                <div style={{ display: getDisplay('android') }}>
                    <ChannelAddAndroid
                        setOpenWarning={setOpenWarning}
                    />
                </div>
                <div style={{ display: getDisplay('apple') }}>
                    <ChannelAddIos
                        setOpenWarning={setOpenWarning}
                    />
                </div>
            </div>
            {(!foreground && selectedChannels > 1) && (
                <Button
                    onClick={finishreg}
                    className={commonClasses.button}
                    style={{ marginTop: '3em' }}
                    variant="contained"
                    color="primary"
                    disabled={executeResult.loading}
                    // disabled={requestchannels.length < selectedChannels}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            )}
        </div>
    );
}

/**
 * const GetComponent: FC<{ channel: keyof ListChannels }> = ({ channel: key }) => {
        switch (key as keyof ListChannels) {
            case 'facebook':
                return (
                    <ChannelAddFacebook
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'instagram':
                return (
                    <ChannelAddInstagram
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'instagramDM':
                return (
                    <ChannelAddInstagramDM
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'messenger':
                return (
                    <ChannelAddMessenger
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'whatsapp':
                return (
                    <ChannelAddWhatsapp
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'telegram':
                return (
                    <ChannelAddTelegram
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'twitter':
                return (
                    <ChannelAddTwitter
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'twitterDM':
                return (
                    <ChannelAddTwitterDM
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'chatWeb':
                return (
                    <ChannelAddChatWeb
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'email':
                return <div>email</div>;
            case 'phone':
                return <div>phone</div>;
            case 'sms':
                return <div>sms</div>;
            case 'android':
                return (
                    <ChannelAddAndroid
                        setOpenWarning={setOpenWarning}
                    />
                );
            case 'apple':
                return (
                    <ChannelAddIos
                        setOpenWarning={setOpenWarning}
                    />
                );
            default: return <div />;
        }
    }
 */