/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';

import { apiUrls } from 'common/constants';
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Link, IconButton, Typography, InputAdornment } from '@material-ui/core';
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@material-ui/icons';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit, FieldSelect } from "components";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { YouTubeColor } from "icons";
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";
import { listYouTube } from "store/google/actions";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogInFrame from 'pages/channels/GoogleLogInFrame';

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddYouTube: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const mainResult = useSelector(state => state.channel.channelList);
    const classes = useChannelAddStyles();
    const exchangeCodeResult = useSelector(state => state.google.requestExchangeCode);
    const listYouTubeResult = useSelector(state => state.google.requestListYouTube);

    const { commonClasses, deleteChannel, foreground, setForeground, submitObservable, } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors }, trigger } = useFormContext<MainData>();

    const [channellist, setChannellist] = useState([]);
    const [hasFinished, setHasFinished] = useState(false);
    const [nextbutton, setNextbutton] = useState(true);
    const [nextbutton2, setNextbutton2] = useState(true);
    const [showList, setShowList] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitExchange, setWaitExchange] = useState(false);
    const [waitList, setWaitList] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const openprivacypolicies = () => {
        window.open("/privacy", "_blank");
    }

    useEffect(() => {
        const cb = async () => {
            const v1 = await trigger('channels.youtube.accesstoken');
            const v2 = await trigger('channels.youtube.refreshtoken');
            const v3 = await trigger('channels.youtube.scope');
            const v4 = await trigger('channels.youtube.tokentype');
            const v5 = await trigger('channels.youtube.idtoken');
            const v6 = await trigger('channels.youtube.channel');
            setSubmitError(!v1 || !v2 || !v3 || !v4 || !v5 || !v6);
        }

        submitObservable.addListener(cb);
        return () => {
            submitObservable.removeListener(cb);
        }
    }, [submitObservable, trigger]);

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }

        register('channels.youtube.description', { validate: strRequired, value: '' });
        register('channels.youtube.accesstoken', { validate: strRequired, value: '' });
        register('channels.youtube.refreshtoken', { validate: strRequired, value: '' });
        register('channels.youtube.scope', { validate: strRequired, value: '' });
        register('channels.youtube.tokentype', { validate: strRequired, value: '' });
        register('channels.youtube.idtoken', { validate: strRequired, value: '' });
        register('channels.youtube.channel', { validate: strRequired, value: '' });
        register('channels.youtube.build', {
            value: values => ({
                "method": "UFN_COMMUNICATIONCHANNEL_INS",
                "parameters": {
                    "id": 0,
                    "description": values.description,
                    "type": "",
                    "communicationchannelsite": "",
                    "communicationchannelowner": values.description,
                    "chatflowenabled": true,
                    "integrationid": "",
                    "color": "",
                    "icons": "",
                    "other": "",
                    "form": "",
                    "apikey": "",
                    "coloricon": "#FE0000",
                    "voximplantcallsupervision": false
                },
                "type": "YOUTUBE",
                "service": {
                    "accesstoken": values.accesstoken,
                    "refreshtoken": values.refreshtoken,
                    "scope": values.scope,
                    "tokentype": values.tokentype,
                    "idtoken": values.idtoken,
                    "channel": values.channel,
                }
            })
        });

        return () => {
            unregister('channels.youtube');
        }
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== 'youtube' && viewSelected !== "view1") {
            setViewSelected("view1");
        }
    }, [foreground, viewSelected]);

    useEffect(() => {
        if (waitSave) {
            dispatch(showBackdrop(false));
            setWaitSave(false);
        }
    }, [mainResult])

    const setView = (option: "view1" | "view2") => {
        if (option === "view1") {
            setViewSelected(option);
            setForeground(undefined);
        } else {
            setViewSelected(option);
            setForeground('youtube');
        }
    }

    function setchannelField(value: any) {
        setNextbutton(value === null);
        setValue('channels.youtube.channel', value?.id || "");
    }

    useEffect(() => {
        if (waitExchange) {
            if (!exchangeCodeResult.loading) {
                if (!exchangeCodeResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (exchangeCodeResult.data) {
                        setValue('channels.youtube.accesstoken', exchangeCodeResult.data.access_token);
                        setValue('channels.youtube.idtoken', exchangeCodeResult.data.id_token);
                        setValue('channels.youtube.refreshtoken', exchangeCodeResult.data.refresh_token);
                        setValue('channels.youtube.scope', exchangeCodeResult.data.scope);
                        setValue('channels.youtube.tokentype', exchangeCodeResult.data.token_type);

                        setShowList(true);
                        setChannellist([]);

                        dispatch(listYouTube({ accesstoken: exchangeCodeResult.data.access_token }));
                        dispatch(showBackdrop(true));
                        setWaitList(true);
                    }
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((exchangeCodeResult.msg || exchangeCodeResult.message) || exchangeCodeResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitExchange(false);
            }
        }
    }, [exchangeCodeResult, waitExchange])

    useEffect(() => {
        if (waitList) {
            if (!listYouTubeResult.loading) {
                if (!listYouTubeResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (listYouTubeResult.data) {
                        if (listYouTubeResult.data.items) {
                            listYouTubeResult.data.items.forEach((element: any) => {
                                element.channelname = `https://www.youtube.com/channel/${element.id}`;
                            });
                            setChannellist(listYouTubeResult.data.items);
                        }
                    }
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((listYouTubeResult.msg || listYouTubeResult.message) || listYouTubeResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitList(false);
            }
        }
    }, [listYouTubeResult, waitList])

    if (viewSelected === "view2") {
        return (
            <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
                {!showList && <>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setView("view1");
                            }}
                        >
                            {'<< '}<Trans i18nKey={langKeys.previoustext} />
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_youtubetitle)}</div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.channel_youtubealert1)}</div>
                        <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>{t(langKeys.channel_youtubealert2)}</div>
                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                            <GoogleOAuthProvider clientId={apiUrls.GOOGLECLIENTID_CHANNEL}>
                                <GoogleLogInFrame
                                    setWaitExchange={setWaitExchange}
                                />
                            </GoogleOAuthProvider>
                        </div>
                        <div style={{ textAlign: "center", paddingTop: "20px", color: "#969ea5", fontStyle: "italic" }}>{t(langKeys.connectface4)}</div>
                        <div style={{ textAlign: "center", paddingBottom: "80px", color: "#969ea5" }}><a href="#" style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }} onClick={openprivacypolicies} rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>
                    </div>
                </>}
                {showList && <>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowList(false);
                            }}
                        >
                            {'<< '}<Trans i18nKey={langKeys.previoustext} />
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_youtubetitle)}</div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldSelect
                                onChange={(value) => setchannelField(value)}
                                label={t(langKeys.selectchannellink)}
                                className="col-6"
                                valueDefault={getValues('channels.youtube.channel')}
                                data={channellist}
                                optionDesc="channelname"
                                optionValue="id"
                            />
                        </div>
                        <div style={{ paddingLeft: "80%" }}>
                            <Button
                                onClick={async () => {
                                    const v1 = await trigger('channels.youtube.accesstoken');
                                    const v2 = await trigger('channels.youtube.refreshtoken');
                                    const v3 = await trigger('channels.youtube.scope');
                                    const v4 = await trigger('channels.youtube.tokentype');
                                    const v5 = await trigger('channels.youtube.idtoken');
                                    const v6 = await trigger('channels.youtube.channel');
                                    if (v1 && v2 && v3 && v4 && v5 && v6) {
                                        setView("view1");
                                        setHasFinished(true);
                                    }
                                }}
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={nextbutton}
                            >
                                <Trans i18nKey={langKeys.next} />
                            </Button>
                        </div>
                    </div>
                </>}
            </div>
        )
    }

    return (
        <div className={clsx(commonClasses.root, submitError && commonClasses.rootError)}>
            {!hasFinished && <YouTubeColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('youtube');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "YOUTUBE"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.subscription_genericconnect} />
            </Typography>}
            {hasFinished && <YouTubeColor
                style={{ width: 100, height: 100, alignSelf: 'center' }} />
            }
            {hasFinished && (
                <div style={{ alignSelf: 'center' }}>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.5vw', fontWeight: 'bold', textAlign: 'center' }}>
                        {t(langKeys.subscription_congratulations)}
                    </Typography>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.2vw', fontWeight: 500 }}>
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_youtube)} {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            <FieldEdit
                onChange={(value) => { setValue('channels.youtube.description', value); setNextbutton2(!value); }}
                valueDefault={getValues('channels.youtube.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.youtube?.description?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {hasFinished ? <LinkIcon color="primary" /> : <LinkOffIcon />}
                        </InputAdornment>
                    )
                }}
            />
            {!hasFinished && (
                <Button
                    onClick={() => setView("view2")}
                    className={commonClasses.button}
                    variant="contained"
                    color="primary"
                    disabled={nextbutton2}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            )}
        </div>
    );
}