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
import { ListChannels, MainData, SubscriptionContext } from "./context";
import { executeSubscription } from "store/signup/actions";
import { useDispatch } from "react-redux";
import { showBackdrop } from "store/popus/actions";
import { useSelector } from "hooks";
import { useHistory } from "react-router-dom";
import { showSnackbar } from "store/popus/actions";
import { useFormContext, useWatch } from "react-hook-form";

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
        listchannels,
        selectedChannels,
        finishreg,
        commonClasses,
    } = useContext(SubscriptionContext);  
    const executeResult = useSelector(state => state.signup.insertChannel);

    const channels = useMemo(() => {
        if (listchannels === undefined) {
            return null;
        }

        return Object
            .keys(listchannels)
            .filter(x => {
                /*if (foreground !== undefined) {
                    return (
                        listchannels[x as keyof ListChannels] === true &&
                        foreground === x
                    );
                }*/

                return listchannels[x as keyof ListChannels] === true;
            })
            .map((key, i) => {
                let display = true;
                if (foreground !== undefined) {
                    display = foreground === key;
                }

                return (
                    <GetComponent
                        channel={key as keyof ListChannels}
                        setOpenWarning={setOpenWarning}
                        key={i}
                        display={display}
                    />
                );
            });
    }, [listchannels, foreground]);

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
                {channels}
            </div>
            {(!foreground && selectedChannels > 1) && (
                <Button
                    onClick={finishreg}
                    className={commonClasses.button}
                    style={{ marginTop: '3em' }}
                    variant="contained"
                    color="primary"
                    disabled={executeResult.loading}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            )}
        </div>
    );
}

interface GetComponentProps {
    channel: keyof ListChannels;
    display: boolean;
    setOpenWarning: (param: any) => void;
}

const GetComponent: FC<GetComponentProps> = ({ channel: key, display, setOpenWarning }) => {
    switch (key as keyof ListChannels) {
        case 'facebook':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddFacebook setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'instagram':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddInstagram setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'instagramDM':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddInstagramDM setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'messenger':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddMessenger setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'whatsapp':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddWhatsapp setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'telegram':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddTelegram setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'twitter':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddTwitter setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'twitterDM':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddTwitterDM setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'chatWeb':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddChatWeb setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'email':
            return <div>email</div>;
        case 'phone':
            return <div>phone</div>;
        case 'sms':
            return <div>sms</div>;
        case 'android':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddAndroid setOpenWarning={setOpenWarning} />
                </div>
            );
        case 'apple':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                <ChannelAddIos setOpenWarning={setOpenWarning} />
                </div>
            );
        default: return <div />;
    }
}
