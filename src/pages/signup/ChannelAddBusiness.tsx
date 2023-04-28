/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { apiUrls } from 'common/constants';
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@material-ui/icons';
import { FC, useContext, useEffect, useState } from "react";
import { FieldEdit } from "components";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { langKeys } from "lang/keys";
import { MainData, SubscriptionContext } from "./context";
import { Breadcrumbs, Button, Link, IconButton, Typography, InputAdornment } from '@material-ui/core';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useFormContext } from "react-hook-form";
import { useSelector } from "hooks";
import { ZyxmeMessengerIcon } from 'icons';

import clsx from 'clsx';
import GoogleLogInFrame from 'pages/channels/GoogleLogInFrame';

export const ChannelAddBusiness: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const mainResult = useSelector(state => state.channel.channelList);
    const exchangeCodeResult = useSelector(state => state.google.requestExchangeCode);

    const { commonClasses, deleteChannel, foreground, setForeground, submitObservable, } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors }, trigger } = useFormContext<MainData>();

    const [hasFinished, setHasFinished] = useState(false);
    const [nextbutton2, setNextbutton2] = useState(true);
    const [submitError, setSubmitError] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitExchange, setWaitExchange] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const openprivacypolicies = () => {
        window.open("/privacy", "_blank");
    }

    useEffect(() => {
        const cb = async () => {
            const v1 = await trigger('channels.business.accesstoken');
            const v2 = await trigger('channels.business.refreshtoken');
            const v3 = await trigger('channels.business.scope');
            const v4 = await trigger('channels.business.tokentype');
            const v5 = await trigger('channels.business.idtoken');
            const v6 = await trigger('channels.business.channel');
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

        register('channels.business.description', { validate: strRequired, value: '' });
        register('channels.business.accesstoken', { validate: strRequired, value: '' });
        register('channels.business.refreshtoken', { validate: strRequired, value: '' });
        register('channels.business.scope', { validate: strRequired, value: '' });
        register('channels.business.tokentype', { validate: strRequired, value: '' });
        register('channels.business.idtoken', { validate: strRequired, value: '' });
        register('channels.business.channel', { validate: strRequired, value: '' });
        register('channels.business.build', {
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
                "type": "BUSINESS",
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
            unregister('channels.business');
        }
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== 'business' && viewSelected !== "view1") {
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
            setForeground('business');
        }
    }

    useEffect(() => {
        if (waitExchange) {
            if (!exchangeCodeResult.loading) {
                if (!exchangeCodeResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (exchangeCodeResult.data) {
                        setValue('channels.business.accesstoken', exchangeCodeResult.data.access_token);
                        setValue('channels.business.idtoken', exchangeCodeResult.data.id_token);
                        setValue('channels.business.refreshtoken', exchangeCodeResult.data.refresh_token);
                        setValue('channels.business.scope', exchangeCodeResult.data.scope);
                        setValue('channels.business.tokentype', exchangeCodeResult.data.token_type);

                        setView("view1");
                        setHasFinished(true);
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

    if (viewSelected === "view2") {
        return (
            <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
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
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_businesstitle)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.channel_businessalert1)}</div>
                    <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>{t(langKeys.channel_businessalert2)}</div>
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
            </div>
        )
    }

    return (
        <div className={clsx(commonClasses.root, submitError && commonClasses.rootError)}>
            {!hasFinished && <ZyxmeMessengerIcon className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('business');
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.subscription_genericconnect} />
            </Typography>}
            {hasFinished && <ZyxmeMessengerIcon
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
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_business)} {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            <FieldEdit
                onChange={(value) => { setValue('channels.business.description', value); setNextbutton2(!value); }}
                valueDefault={getValues('channels.business.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.business?.description?.message}
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