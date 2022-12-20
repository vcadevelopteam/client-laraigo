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
import { FieldEdit, FieldSelect } from "components";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { BloggerColor } from "icons";
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";
import { listBlogger } from "store/google/actions";
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

export const ChannelAddBlogger: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const mainResult = useSelector(state => state.channel.channelList);
    const classes = useChannelAddStyles();
    const exchangeCodeResult = useSelector(state => state.google.requestExchangeCode);
    const listBloggerResult = useSelector(state => state.google.requestListBlogger);

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
            const v1 = await trigger('channels.blogger.accesstoken');
            const v2 = await trigger('channels.blogger.refreshtoken');
            const v3 = await trigger('channels.blogger.scope');
            const v4 = await trigger('channels.blogger.tokentype');
            const v5 = await trigger('channels.blogger.idtoken');
            const v6 = await trigger('channels.blogger.channel');
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

        register('channels.blogger.description', { validate: strRequired, value: '' });
        register('channels.blogger.accesstoken', { validate: strRequired, value: '' });
        register('channels.blogger.refreshtoken', { validate: strRequired, value: '' });
        register('channels.blogger.scope', { validate: strRequired, value: '' });
        register('channels.blogger.tokentype', { validate: strRequired, value: '' });
        register('channels.blogger.idtoken', { validate: strRequired, value: '' });
        register('channels.blogger.channel', { validate: strRequired, value: '' });
        register('channels.blogger.build', {
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
                    "coloricon": "#F06A35",
                    "voximplantcallsupervision": false
                },
                "type": "BLOGGER",
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
            unregister('channels.blogger');
        }
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== 'blogger' && viewSelected !== "view1") {
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
            setForeground('blogger');
        }
    }

    function setchannelField(value: any) {
        setNextbutton(value === null);
        setValue('channels.blogger.channel', value?.id || "");
    }

    useEffect(() => {
        if (waitExchange) {
            if (!exchangeCodeResult.loading) {
                if (!exchangeCodeResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (exchangeCodeResult.data) {
                        setValue('channels.blogger.accesstoken', exchangeCodeResult.data.access_token);
                        setValue('channels.blogger.idtoken', exchangeCodeResult.data.id_token);
                        setValue('channels.blogger.refreshtoken', exchangeCodeResult.data.refresh_token);
                        setValue('channels.blogger.scope', exchangeCodeResult.data.scope);
                        setValue('channels.blogger.tokentype', exchangeCodeResult.data.token_type);

                        setShowList(true);
                        setChannellist([]);

                        dispatch(listBlogger({ accesstoken: exchangeCodeResult.data.access_token }));
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
            if (!listBloggerResult.loading) {
                if (!listBloggerResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (listBloggerResult.data) {
                        if (listBloggerResult.data.items) {
                            setChannellist(listBloggerResult.data.items);
                        }
                    }
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((listBloggerResult.msg || listBloggerResult.message) || listBloggerResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitList(false);
            }
        }
    }, [listBloggerResult, waitList])

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
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_bloggertitle)}</div>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.channel_bloggeralert1)}</div>
                        <div style={{ textAlign: "center", padding: "20px", color: "#969ea5" }}>{t(langKeys.channel_bloggeralert2)}</div>
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
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_bloggertitle)}</div>
                        <div className="row-zyx">
                            <div className="col-3"></div>
                            <FieldSelect
                                onChange={(value) => setchannelField(value)}
                                label={t(langKeys.selectchannellink)}
                                className="col-6"
                                valueDefault={getValues('channels.blogger.channel')}
                                data={channellist}
                                optionDesc="name"
                                optionValue="id"
                            />
                        </div>
                        <div style={{ paddingLeft: "80%" }}>
                            <Button
                                onClick={async () => {
                                    const v1 = await trigger('channels.blogger.accesstoken');
                                    const v2 = await trigger('channels.blogger.refreshtoken');
                                    const v3 = await trigger('channels.blogger.scope');
                                    const v4 = await trigger('channels.blogger.tokentype');
                                    const v5 = await trigger('channels.blogger.idtoken');
                                    const v6 = await trigger('channels.blogger.channel');
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
            {!hasFinished && <BloggerColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('blogger');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "BLOGGER"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.subscription_genericconnect} />
            </Typography>}
            {hasFinished && <BloggerColor
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
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_blogger)} {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            <FieldEdit
                onChange={(value) => { setValue('channels.blogger.description', value); setNextbutton2(!value); }}
                valueDefault={getValues('channels.blogger.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.blogger?.description?.message}
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