/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';

import { apiUrls } from 'common/constants';
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Link, IconButton, Typography, InputAdornment } from '@material-ui/core';
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@material-ui/icons';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit } from "components";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { EmailColor } from "icons";
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";
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
    button2: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "100%",
    },
}));

export const ChannelAddEmail: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const mainResult = useSelector(state => state.channel.channelList);
    const classes = useChannelAddStyles();
    const exchangeCodeResult = useSelector(state => state.google.requestExchangeCode);

    const { commonClasses, deleteChannel, foreground, setForeground, submitObservable, } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors }, trigger } = useFormContext<MainData>();

    const [hasFinished, setHasFinished] = useState(false);
    const [nextbutton, setNextbutton] = useState(true);
    const [nextbutton2, setNextbutton2] = useState(true);
    const [registerInfobip, setRegisterInfobip] = useState(false);
    const [registerGmail, setRegisterGmail] = useState(false);
    const [registerImap, setRegisterImap] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitExchange, setWaitExchange] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const openprivacypolicies = () => {
        window.open("/privacy", "_blank");
    }

    useEffect(() => {
        const cb = async () => {
            await changeSubmitError();
        }

        submitObservable.addListener(cb);
        return () => {
            submitObservable.removeListener(cb);
        }
    }, [submitObservable, trigger]);

    const changeSubmitError = async () => {
        if (registerInfobip) {
            const v1 = await trigger('channels.email.url');
            const v2 = await trigger('channels.email.apikey');
            const v3 = await trigger('channels.email.emittername');
            setSubmitError(!v1 || !v2 || !v3);
        }
        else if (registerGmail) {
            const v1 = await trigger('channels.email.accesstoken');
            const v2 = await trigger('channels.email.refreshtoken');
            const v3 = await trigger('channels.email.scope');
            const v4 = await trigger('channels.email.tokentype');
            const v5 = await trigger('channels.email.idtoken');
            setSubmitError(!v1 || !v2 || !v3 || !v4 || !v5);
        }
        else if (registerImap) {
            const v1 = await trigger('channels.email.imapusername');
            const v2 = await trigger('channels.email.imappassword');
            const v3 = await trigger('channels.email.imapincomingendpoint');
            const v4 = await trigger('channels.email.imaphost');
            const v5 = await trigger('channels.email.imapincomingport');
            const v6 = await trigger('channels.email.imapport');
            const v7 = await trigger('channels.email.imapssl');
            setSubmitError(!v1 || !v2 || !v3 || !v4 || !v5 || !v6 || !v7);
        }
    }

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }

        register('channels.email.description', { validate: strRequired, value: '' });
        register('channels.email.url', { validate: strRequired, value: '' });
        register('channels.email.apikey', { validate: strRequired, value: '' });
        register('channels.email.emittername', { validate: strRequired, value: '' });
        register('channels.email.accesstoken', { validate: strRequired, value: '' });
        register('channels.email.refreshtoken', { validate: strRequired, value: '' });
        register('channels.email.scope', { validate: strRequired, value: '' });
        register('channels.email.tokentype', { validate: strRequired, value: '' });
        register('channels.email.idtoken', { validate: strRequired, value: '' });
        register('channels.email.type', { validate: strRequired, value: '' });
        register('channels.email.build', {
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
                    "coloricon": "#1D9BF0",
                    "voximplantcallsupervision": false
                },
                "type": "INFOBIPEMAIL",
                "service": {
                    "url": values.url,
                    "apikey": values.apikey,
                    "emittername": values.emittername,
                    "accesstoken": values.accesstoken,
                    "refreshtoken": values.refreshtoken,
                    "scope": values.scope,
                    "tokentype": values.tokentype,
                    "idtoken": values.idtoken,
                    "type": values.type,
                }
            })
        });

        return () => {
            unregister('channels.email');
        }
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== 'email' && viewSelected !== "view1") {
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
            setForeground('email');
        }
    }

    useEffect(() => {
        if (waitExchange) {
            if (!exchangeCodeResult.loading) {
                if (!exchangeCodeResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (exchangeCodeResult.data) {
                        setValue('channels.email.accesstoken', exchangeCodeResult.data.access_token);
                        setValue('channels.email.idtoken', exchangeCodeResult.data.id_token);
                        setValue('channels.email.refreshtoken', exchangeCodeResult.data.refresh_token);
                        setValue('channels.email.scope', exchangeCodeResult.data.scope);
                        setValue('channels.email.tokentype', exchangeCodeResult.data.token_type);
                        setValue('channels.email.url', 'NOUSE');
                        setValue('channels.email.apikey', 'NOUSE');
                        setValue('channels.email.emittername', 'NOUSE');

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
        if (registerInfobip) {
            return (
                <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setRegisterGmail(false);
                                setRegisterInfobip(false);
                                setRegisterImap(false);
                            }}
                        >
                            {'<< '}<Trans i18nKey={langKeys.previoustext} />
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.emailtitle)}</div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.emailtitle2)}</div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(v === "" || getValues('channels.email.emittername') === "" || getValues('channels.email.url') === "" || !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(getValues('channels.email.url')) || !/\S+@\S+\.\S+/.test(getValues('channels.email.emittername')));
                                    setValue('channels.email.apikey', v);
                                }}
                                valueDefault={getValues('channels.email.apikey')}
                                label={t(langKeys.apikey)}
                                className="col-6"
                                error={errors.channels?.email?.apikey?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(v === "" || getValues('channels.email.emittername') === "" || getValues('channels.email.apikey') === "" || !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(v) || !/\S+@\S+\.\S+/.test(getValues('channels.email.emittername')));
                                    setValue('channels.email.url', v);
                                }}
                                valueDefault={getValues('channels.email.url')}
                                label={t(langKeys.url)}
                                className="col-6"
                                error={errors.channels?.email?.url?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(v === "" || getValues('channels.email.apikey') === "" || getValues('channels.email.url') === "" || !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(getValues('channels.email.url')) || !/\S+@\S+\.\S+/.test(v));
                                    setValue('channels.email.emittername', v);
                                }}
                                valueDefault={getValues('channels.email.emittername')}
                                label={t(langKeys.emitteremail)}
                                className="col-6"
                                error={errors.channels?.email?.emittername?.message}
                            />
                        </div>
                        <div style={{ paddingLeft: "80%" }}>
                            <Button
                                onClick={async () => {
                                    const v1 = await trigger('channels.email.url');
                                    const v2 = await trigger('channels.email.apikey');
                                    const v3 = await trigger('channels.email.emittername');
                                    if (v1 && v2 && v3) {
                                        setValue('channels.email.accesstoken', 'NOUSE');
                                        setValue('channels.email.idtoken', 'NOUSE');
                                        setValue('channels.email.refreshtoken', 'NOUSE');
                                        setValue('channels.email.scope', 'NOUSE');
                                        setValue('channels.email.tokentype', 'NOUSE');

                                        setValue('channels.email.imapusername', 'NOUSE');
                                        setValue('channels.email.imappassword', 'NOUSE');
                                        setValue('channels.email.imapincomingendpoint', 'NOUSE');
                                        setValue('channels.email.imaphost', 'NOUSE');
                                        setValue('channels.email.imapincomingport', 'NOUSE');
                                        setValue('channels.email.imapport', 'NOUSE');
                                        setValue('channels.email.imapssl', 'NOUSE');

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
                </div>
            )
        }
        else if (registerGmail) {
            return (
                <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setRegisterGmail(false);
                                setRegisterInfobip(false);
                                setRegisterImap(false);
                            }}
                        >
                            {'<< '}<Trans i18nKey={langKeys.previoustext} />
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_gmailtitle)}</div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.channel_gmailalert1)}</div>
                        <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>{t(langKeys.channel_gmailalert2)}</div>
                        <div style={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                            <GoogleOAuthProvider clientId={apiUrls.GOOGLECLIENTID_CHANNEL}>
                                <GoogleLogInFrame
                                    setWaitExchange={setWaitExchange}
                                />
                            </GoogleOAuthProvider>
                        </div>
                        <div style={{ textAlign: "center", paddingTop: "20px", color: "#969ea5", fontStyle: "italic" }}>{t(langKeys.connectface4)}</div>
                        <div style={{ textAlign: "center", paddingBottom: "80px", color: "#969ea5" }}><a style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }} onClick={openprivacypolicies} rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>
                    </div>
                </div>
            )
        }
        else if (registerImap) {
            return (
                <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            color="textSecondary"
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setRegisterGmail(false);
                                setRegisterInfobip(false);
                                setRegisterImap(false);
                            }}
                        >
                            {'<< '}<Trans i18nKey={langKeys.previoustext} />
                        </Link>
                    </Breadcrumbs>
                    <div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.imaptitle)}</div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.imaptitle2)}</div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(v === "" || getValues('channels.email.imappassword') === "" || getValues('channels.email.imapincomingendpoint') === "" || getValues('channels.email.imaphost') === "" || getValues('channels.email.imapincomingport') === "" || getValues('channels.email.imapport') === "" || getValues('channels.email.imapssl') === "");
                                    setValue('channels.email.imapusername', v);
                                }}
                                valueDefault={getValues('channels.email.imapusername')}
                                label={t(langKeys.imapusername)}
                                className="col-6"
                                error={errors.channels?.email?.imapusername?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(getValues('channels.email.imapusername') === "" || v === "" || getValues('channels.email.imapincomingendpoint') === "" || getValues('channels.email.imaphost') === "" || getValues('channels.email.imapincomingport') === "" || getValues('channels.email.imapport') === "" || getValues('channels.email.imapssl') === "");
                                    setValue('channels.email.imappassword', v);
                                }}
                                valueDefault={getValues('channels.email.imappassword')}
                                label={t(langKeys.imappassword)}
                                className="col-6"
                                error={errors.channels?.email?.imappassword?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(getValues('channels.email.imapusername') === "" || getValues('channels.email.imappassword') === "" || getValues('channels.email.imapincomingendpoint') === "" || getValues('channels.email.imaphost') === "" || getValues('channels.email.imapincomingport') === "" || getValues('channels.email.imapport') === "" || getValues('channels.email.imapssl') === "");
                                    setValue('channels.email.imapaccesstoken', v);
                                }}
                                valueDefault={getValues('channels.email.imapaccesstoken')}
                                label={t(langKeys.imapaccesstoken)}
                                className="col-6"
                                error={errors.channels?.email?.imapaccesstoken?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(getValues('channels.email.imapusername') === "" || getValues('channels.email.imappassword') === "" || v === "" || getValues('channels.email.imaphost') === "" || getValues('channels.email.imapincomingport') === "" || getValues('channels.email.imapport') === "" || getValues('channels.email.imapssl') === "");
                                    setValue('channels.email.imapincomingendpoint', v);
                                }}
                                valueDefault={getValues('channels.email.imapincomingendpoint')}
                                label={t(langKeys.imapincomingendpoint)}
                                className="col-6"
                                error={errors.channels?.email?.imapincomingendpoint?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(getValues('channels.email.imapusername') === "" || getValues('channels.email.imappassword') === "" || getValues('channels.email.imapincomingendpoint') === "" || getValues('channels.email.imaphost') === "" || v === "" || getValues('channels.email.imapport') === "" || getValues('channels.email.imapssl') === "");
                                    setValue('channels.email.imapincomingport', v);
                                }}
                                valueDefault={getValues('channels.email.imapincomingport')}
                                label={t(langKeys.imapincomingport)}
                                className="col-6"
                                error={errors.channels?.email?.imapincomingport?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(getValues('channels.email.imapusername') === "" || getValues('channels.email.imappassword') === "" || getValues('channels.email.imapincomingendpoint') === "" || v === "" || getValues('channels.email.imapincomingport') === "" || getValues('channels.email.imapport') === "" || getValues('channels.email.imapssl') === "");
                                    setValue('channels.email.imaphost', v);
                                }}
                                valueDefault={getValues('channels.email.imaphost')}
                                label={t(langKeys.imaphost)}
                                className="col-6"
                                error={errors.channels?.email?.imaphost?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(getValues('channels.email.imapusername') === "" || getValues('channels.email.imappassword') === "" || getValues('channels.email.imapincomingendpoint') === "" || getValues('channels.email.imaphost') === "" || getValues('channels.email.imapincomingport') === "" || v === "" || getValues('channels.email.imapssl') === "");
                                    setValue('channels.email.imapport', v);
                                }}
                                valueDefault={getValues('channels.email.imapport')}
                                label={t(langKeys.imapport)}
                                className="col-6"
                                error={errors.channels?.email?.imapport?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldEdit
                                onChange={v => {
                                    setNextbutton(getValues('channels.email.imapusername') === "" || getValues('channels.email.imappassword') === "" || getValues('channels.email.imapincomingendpoint') === "" || getValues('channels.email.imaphost') === "" || getValues('channels.email.imapincomingport') === "" || getValues('channels.email.imapport') === "" || v === "");
                                    setValue('channels.email.imapssl', v);
                                }}
                                valueDefault={getValues('channels.email.imapssl')}
                                label={t(langKeys.imapssl)}
                                className="col-6"
                                error={errors.channels?.email?.imapssl?.message}
                            />
                        </div>
                        <div style={{ paddingLeft: "80%" }}>
                            <Button
                                onClick={async () => {
                                    const v1 = await trigger('channels.email.imapusername');
                                    const v2 = await trigger('channels.email.imappassword');
                                    const v3 = await trigger('channels.email.imapincomingendpoint');
                                    const v4 = await trigger('channels.email.imaphost');
                                    const v5 = await trigger('channels.email.imapincomingport');
                                    const v6 = await trigger('channels.email.imapport');
                                    const v7 = await trigger('channels.email.imapssl');

                                    if (v1 && v2 && v3 && v4 && v5 && v6 && v7) {
                                        setValue('channels.email.accesstoken', 'NOUSE');
                                        setValue('channels.email.idtoken', 'NOUSE');
                                        setValue('channels.email.refreshtoken', 'NOUSE');
                                        setValue('channels.email.scope', 'NOUSE');
                                        setValue('channels.email.tokentype', 'NOUSE');

                                        setValue('channels.email.url', 'NOUSE');
                                        setValue('channels.email.apikey', 'NOUSE');
                                        setValue('channels.email.emittername', 'NOUSE');

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
                </div>
            )
        }
        else {
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
                    <div style={{ width: "100%", marginTop: "20px", alignItems: "center", display: "flex" }}>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                onClick={() => {
                                    setValue('channels.email.type', "INFOBIPEMAIL");
                                    setRegisterInfobip(true);
                                }}
                                className={classes.button2}
                                disabled={false}
                                variant="contained"
                                color="primary"
                            >{t(langKeys.registerinfobip)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                onClick={() => {
                                    setValue('channels.email.type', "GMAIL");
                                    setRegisterGmail(true);
                                }}
                                className={classes.button2}
                                disabled={false}
                                variant="contained"
                                color="primary"
                            >{t(langKeys.registergmail)}
                            </Button>
                        </div>
                        <div style={{ flex: "1", margin: "0px 15px" }}>
                            <Button
                                onClick={() => {
                                    setValue('channels.email.type', "IMAP");
                                    setRegisterImap(true);
                                }}
                                className={classes.button2}
                                disabled={false}
                                variant="contained"
                                color="primary"
                            >{t(langKeys.registerimap)}
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={clsx(commonClasses.root, submitError && commonClasses.rootError)}>
            {!hasFinished && <EmailColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('email');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "INFOBIPEMAIL"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.subscription_genericconnect} />
            </Typography>}
            {hasFinished && <EmailColor
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
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_email)} {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            <FieldEdit
                onChange={(value) => { setValue('channels.email.description', value); setNextbutton2(!value); }}
                valueDefault={getValues('channels.email.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.email?.description?.message}
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