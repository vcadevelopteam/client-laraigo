/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@material-ui/icons';
import { FC, useContext, useEffect, useState } from "react";
import { FieldEdit } from "components";
import { langKeys } from "lang/keys";
import { LinkedInColor } from "icons";
import { MainData, SubscriptionContext } from "./context";
import { makeStyles, Breadcrumbs, Button, Link, IconButton, Typography, InputAdornment } from '@material-ui/core';
import { showBackdrop } from 'store/popus/actions';
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useFormContext } from "react-hook-form";
import { useSelector } from "hooks";

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

export const ChannelAddLinkedIn: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const dispatch = useDispatch();

    const { commonClasses, foreground, submitObservable, setForeground, deleteChannel } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors }, trigger } = useFormContext<MainData>();
    const { t } = useTranslation();

    const [hasFinished, setHasFinished] = useState(false);
    const [nextbutton, setNextbutton] = useState(true);
    const [nextbutton2, setNextbutton2] = useState(true);
    const [submitError, setSubmitError] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);

    const classes = useChannelAddStyles();
    const mainResult = useSelector(state => state.channel.channelList)

    useEffect(() => {
        /*const cb = async () => {
            const v1 = await trigger('channels.linkedin.clientid');
            const v2 = await trigger('channels.linkedin.clientsecret');
            const v3 = await trigger('channels.linkedin.accesstoken');
            const v4 = await trigger('channels.linkedin.refreshtoken');
            const v5 = await trigger('channels.linkedin.organizationid');
            setSubmitError(!v1 || !v2 || !v3 || !v4 || !v5);
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

        /*register('channels.linkedin.description', { validate: strRequired, value: '' });
        register('channels.linkedin.clientid', { validate: strRequired, value: '' });
        register('channels.linkedin.clientsecret', { validate: strRequired, value: '' });
        register('channels.linkedin.accesstoken', { validate: strRequired, value: '' });
        register('channels.linkedin.refreshtoken', { validate: strRequired, value: '' });
        register('channels.linkedin.organizationid', { validate: strRequired, value: '' });
        register('channels.linkedin.build', {
            value: values => ({
                "method": "UFN_COMMUNICATIONCHANNEL_INS",
                "parameters": {
                    "apikey": "",
                    "chatflowenabled": true,
                    "color": "",
                    "coloricon": "#0A66C2",
                    "communicationchannelowner": values.description,
                    "communicationchannelsite": "",
                    "description": values.description,
                    "form": "",
                    "icons": "",
                    "id": 0,
                    "integrationid": "",
                    "other": "",
                    "type": "",
                    "voximplantcallsupervision": false,
                },
                "service": {
                    "clientid": values.clientid,
                    "clientsecret": values.clientsecret,
                    "accesstoken": values.accesstoken,
                    "refreshtoken": values.refreshtoken,
                    "organizationid": values.organizationid,
                },
                "type": "LINKEDIN",
            })
        });

        return () => {
            unregister('channels.linkedin');
        }*/
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== 'linkedin' && viewSelected !== "view1") {
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
            setForeground('linkedin');
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
                            setView("view1");
                        }}
                    >
                        {'<< '}<Trans i18nKey={langKeys.previoustext} />
                    </Link>
                </Breadcrumbs>
                {/*<div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.channel_linkedintitle)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.channel_genericalert)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => {
                                setNextbutton(v === "" || getValues('channels.linkedin.clientsecret') === "" || getValues('channels.linkedin.accesstoken') === "" || getValues('channels.linkedin.refreshtoken') === "" || getValues('channels.linkedin.organizationid') === "");
                                setValue('channels.linkedin.clientid', v);
                            }}
                            valueDefault={getValues('channels.linkedin.clientid')}
                            label={t(langKeys.linkedin_clientid)}
                            className="col-6"
                            error={errors.channels?.linkedin?.clientid?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => {
                                setNextbutton(getValues('channels.linkedin.clientid') === "" || v === "" || getValues('channels.linkedin.accesstoken') === "" || getValues('channels.linkedin.refreshtoken') === "" || getValues('channels.linkedin.organizationid') === "");
                                setValue('channels.linkedin.clientsecret', v);
                            }}
                            valueDefault={getValues('channels.linkedin.clientsecret')}
                            label={t(langKeys.linkedin_clientsecret)}
                            className="col-6"
                            error={errors.channels?.linkedin?.clientsecret?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => {
                                setNextbutton(getValues('channels.linkedin.clientid') === "" || getValues('channels.linkedin.clientsecret') === "" || v === "" || getValues('channels.linkedin.refreshtoken') === "" || getValues('channels.linkedin.organizationid') === "");
                                setValue('channels.linkedin.accesstoken', v);
                            }}
                            valueDefault={getValues('channels.linkedin.accesstoken')}
                            label={t(langKeys.linkedin_accesstoken)}
                            className="col-6"
                            error={errors.channels?.linkedin?.accesstoken?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => {
                                setNextbutton(getValues('channels.linkedin.clientid') === "" || getValues('channels.linkedin.clientsecret') === "" || getValues('channels.linkedin.accesstoken') === "" || v === "" || getValues('channels.linkedin.organizationid') === "");
                                setValue('channels.linkedin.refreshtoken', v);
                            }}
                            valueDefault={getValues('channels.linkedin.refreshtoken')}
                            label={t(langKeys.linkedin_refreshtoken)}
                            className="col-6"
                            error={errors.channels?.linkedin?.refreshtoken?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => {
                                setNextbutton(getValues('channels.linkedin.clientid') === "" || getValues('channels.linkedin.clientsecret') === "" || getValues('channels.linkedin.accesstoken') === "" || getValues('channels.linkedin.refreshtoken') === "" || v === "");
                                setValue('channels.linkedin.organizationid', v);
                            }}
                            valueDefault={getValues('channels.linkedin.organizationid')}
                            label={t(langKeys.linkedin_organizationid)}
                            className="col-6"
                            error={errors.channels?.linkedin?.organizationid?.message}
                        />
                    </div>
                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={async () => {
                                const v1 = await trigger('channels.linkedin.clientid');
                                const v2 = await trigger('channels.linkedin.clientsecret');
                                const v3 = await trigger('channels.linkedin.accesstoken');
                                const v4 = await trigger('channels.linkedin.refreshtoken');
                                const v5 = await trigger('channels.linkedin.organizationid');
                                if (v1 && v2 && v3 && v4 && v5) {
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
                </div>*/}
            </div>
        )
    }

    return (
        <div className={clsx(commonClasses.root, submitError && commonClasses.rootError)}>
            {!hasFinished && <LinkedInColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('linkedin');
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.subscription_genericconnect} />
            </Typography>}
            {hasFinished && <LinkedInColor
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
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_linkedin)} {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            {/*<FieldEdit
                onChange={(value) => { setValue('channels.linkedin.description', value); setNextbutton2(!value); }}
                valueDefault={getValues('channels.linkedin.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.linkedin?.description?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {hasFinished ? <LinkIcon color="primary" /> : <LinkOffIcon />}
                        </InputAdornment>
                    )
                }}
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
    );
}