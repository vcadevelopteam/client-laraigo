/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, Link, IconButton, Typography, InputAdornment } from '@material-ui/core';
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@material-ui/icons';
import { showBackdrop } from 'store/popus/actions';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit } from "components";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { EmailColor } from "icons";
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

export const ChannelAddEmail: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        foreground,
        selectedChannels,
        submitObservable,
        finishreg,
        setForeground,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors }, trigger } = useFormContext<MainData>();
    const [hasFinished, setHasFinished] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const mainResult = useSelector(state => state.channel.channelList)
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const [nextbutton, setNextbutton] = useState(true);

    useEffect(() => {
        const cb = async () => {

            const v1 = await trigger('channels.email.url');
            const v2 = await trigger('channels.email.apikey');
            const v3 = await trigger('channels.email.emittername');
            setSubmitError(!v1 || !v2 || !v3);
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

        register('channels.email.description', { validate: strRequired, value: '' });
        register('channels.email.url', { validate: strRequired, value: '' });
        register('channels.email.apikey', { validate: strRequired, value: '' });
        register('channels.email.emittername', { validate: strRequired, value: '' });
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
                },
                "type": "INFOBIPEMAIL",
                "service": {
                    "url": values.url,
                    "apikey": values.apikey,
                    "emittername": values.emittername,
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
                onChange={(value) => setValue('channels.email.description', value)}
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
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            )}
        </div>
    );
}