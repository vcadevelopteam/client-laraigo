/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, IconButton, Link, Typography, InputAdornment } from '@material-ui/core';
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@material-ui/icons';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit } from "components";
import { TwitterColor } from "icons";
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";
import clsx from 'clsx';

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddTwitterDM: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        foreground,
        submitObservable,
        setForeground,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors }, trigger } = useFormContext<MainData>();
    const [hasFinished, setHasFinished] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const [nextbutton2, setNextbutton2] = useState(true);

    useEffect(() => {
        /*const cb = async () => {
            const v1 = await trigger('channels.twitterDM.consumerkey');
            const v2 = await trigger('channels.twitterDM.consumersecret');
            const v3 = await trigger('channels.twitterDM.accesstoken');
            const v4 = await trigger('channels.twitterDM.accesssecret');
            setSubmitError(!v1 || !v2 || !v3 || !v4);
        }

        submitObservable.addListener(cb);
        return () => {
            submitObservable.removeListener(cb);
        }*/
    }, [submitObservable, trigger]);

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }

        /*register('channels.twitterDM.description', { validate: strRequired, value: '' });
        register('channels.twitterDM.consumerkey', { validate: strRequired, value: '' });
        register('channels.twitterDM.consumersecret', { validate: strRequired, value: '' });
        register('channels.twitterDM.accesstoken', { validate: strRequired, value: '' });
        register('channels.twitterDM.accesssecret', { validate: strRequired, value: '' });
        register('channels.twitterDM.devenvironment', { validate: strRequired, value: '' });
        register('channels.twitterDM.communicationchannelowner', { value: '' });
        register('channels.twitterDM.build', {
            value: values => ({
                "method": "UFN_COMMUNICATIONCHANNEL_INS",
                "parameters": {
                    "id": 0,
                    "description": values.description,
                    "type": "",
                    "communicationchannelsite": "",
                    "communicationchannelowner": values.communicationchannelowner,
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
                "type": "TWITTERDM",
                "service": {
                    "consumerkey": values.consumerkey,
                    "consumersecret": values.consumersecret,
                    "accesstoken": values.accesstoken,
                    "accesssecret": values.accesssecret,
                    "devenvironment": values.devenvironment
                }
            })
        });

        return () => {
            unregister('channels.twitterDM');
        }*/
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== 'twitterDM' && viewSelected !== "view1") {
            setViewSelected("view1");
        }
    }, [foreground, viewSelected]);

    const setView = (option: "view1" | "view2") => {
        if (option === "view1") {
            setViewSelected(option);
            setForeground(undefined);
        } else {
            setViewSelected(option);
            setForeground('twitterDM');
        }
    }

    if (viewSelected === "view2") {
        return (
            <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        color="textSecondary"
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            setView("view1")
                        }}
                    >
                        {'<< '}<Trans i18nKey={langKeys.previoustext} />
                    </Link>
                </Breadcrumbs>
                {/*<div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.twittertitle)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.twittertitle2)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => setValue('channels.twitterDM.consumerkey', v)}
                            valueDefault={getValues('channels.twitterDM.consumerkey')}
                            label={t(langKeys.consumerapikey)}
                            className="col-6"
                            error={errors.channels?.twitterDM?.consumerkey?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => setValue('channels.twitterDM.consumersecret', v)}
                            valueDefault={getValues('channels.twitterDM.consumersecret')}
                            label={t(langKeys.consumerapisecret)}
                            className="col-6"
                            error={errors.channels?.twitterDM?.consumersecret?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => setValue('channels.twitterDM.accesstoken', v)}
                            valueDefault={getValues('channels.twitterDM.accesstoken')}
                            label={t(langKeys.authenticationtoken)}
                            className="col-6"
                            error={errors.channels?.twitterDM?.accesstoken?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => setValue('channels.twitterDM.accesssecret', v)}
                            valueDefault={getValues('channels.twitterDM.accesssecret')}
                            label={t(langKeys.authenticationsecret)}
                            className="col-6"
                            error={errors.channels?.twitterDM?.accesssecret?.message}
                        />
                    </div>

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={async () => {
                                const v1 = await trigger('channels.twitterDM.consumerkey');
                                const v2 = await trigger('channels.twitterDM.consumersecret');
                                const v3 = await trigger('channels.twitterDM.accesstoken');
                                const v4 = await trigger('channels.twitterDM.accesssecret');
                                if (v1 && v2 && v3 && v4) {
                                    setView("view1");
                                    setHasFinished(true);
                                }
                            }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >{t(langKeys.next)}
                        </Button>

                    </div>

                </div>*/}
            </div>
        )
    }

    return (
        <div className={clsx(commonClasses.root, submitError && commonClasses.rootError)}>
            {!hasFinished && <TwitterColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('twitterDM');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "TWITTERDM"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.subscription_genericconnect} />
            </Typography>}
            {hasFinished && <TwitterColor
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
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_twitterdm)} {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            {/*<FieldEdit
                onChange={(value) => { setValue('channels.twitterDM.description', value); setNextbutton2(!value); }}
                valueDefault={getValues('channels.twitterDM.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.twitterDM?.description?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {hasFinished ? <LinkIcon color="primary" /> : <LinkOffIcon />}
                        </InputAdornment>
                    )
                }}
            />
            <FieldEdit
                onChange={(value) => {
                    setValue('channels.twitterDM.devenvironment', value);
                    setValue('channels.twitterDM.communicationchannelowner', "");
                }}
                valueDefault={getValues('channels.twitterDM.devenvironment')}
                label={t(langKeys.devenvironment)}
                variant="outlined"
                size="small"
                error={errors.channels?.twitterDM?.devenvironment?.message}
            />*/}
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
    )
}

export default ChannelAddTwitterDM