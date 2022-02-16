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
import { TwitterColor } from "icons";
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

export const ChannelAddTwitter: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        foreground,
        selectedChannels,
        finishreg,
        setForeground,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors }, trigger } = useFormContext<MainData>();
    const [hasFinished, setHasFinished] = useState(false);
    const [viewSelected, setViewSelected] = useState("view1");
    const [waitSave, setWaitSave] = useState(false);
    const mainResult = useSelector(state => state.channel.channelList)
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useChannelAddStyles();

    useEffect(() => {
        const strRequired = (value: string) => {
            if (!value) {
                return t(langKeys.field_required);
            }
        }
        
        register('channels.twitter.description', { validate: strRequired, value: '' });
        register('channels.twitter.consumerkey', { validate: strRequired, value: '' });
        register('channels.twitter.consumersecret', { validate: strRequired, value: '' });
        register('channels.twitter.accesstoken', { validate: strRequired, value: '' });
        register('channels.twitter.accesssecret', { validate: strRequired, value: '' });
        register('channels.twitter.devenvironment', { validate: strRequired, value: '' });
        register('channels.twitter.communicationchannelowner', { value: '' });
        register('channels.twitter.build', { value: values => ({
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
            },
            "type": "TWITTER",
            "service": {
                "consumerkey": values.consumerkey,
                "consumersecret": values.consumersecret,
                "accesstoken": values.accesstoken,
                "accesssecret": values.accesssecret,
                "devenvironment": values.devenvironment
            }
        })});

        return () => {
            unregister('channels.twitter');
        }
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== 'twitter' && viewSelected !== "view1") {
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
            setForeground('twitter');
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
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.twittertitle)}</div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px 80px" }}>{t(langKeys.twittertitle2)}</div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => setValue('channels.twitter.consumerkey', v)}
                            valueDefault={getValues('channels.twitter.consumerkey')}
                            label={t(langKeys.consumerapikey)}
                            className="col-6"
                            error={errors.channels?.twitter?.consumerkey?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => setValue('channels.twitter.consumersecret', v)}
                            valueDefault={getValues('channels.twitter.consumersecret')}
                            label={t(langKeys.consumerapisecret)}
                            className="col-6"
                            error={errors.channels?.twitter?.consumersecret?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => setValue('channels.twitter.accesstoken', v)}
                            valueDefault={getValues('channels.twitter.accesstoken')}
                            label={t(langKeys.authenticationtoken)}
                            className="col-6"
                            error={errors.channels?.twitter?.accesstoken?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldEdit
                            onChange={v => setValue('channels.twitter.accesssecret', v)}
                            valueDefault={getValues('channels.twitter.accesssecret')}
                            label={t(langKeys.authenticationsecret)}
                            className="col-6"
                            error={errors.channels?.twitter?.accesssecret?.message}
                        />
                    </div>

                    <div style={{ paddingLeft: "80%" }}>
                        <Button
                            onClick={async () => {
                                const v1 = await trigger('channels.twitter.consumerkey');
                                const v2 = await trigger('channels.twitter.consumersecret');
                                const v3 = await trigger('channels.twitter.accesstoken');
                                const v4 = await trigger('channels.twitter.accesssecret');
                                if (v1 && v2 && v3 && v4) {
                                    setView("view1");
                                    setHasFinished(true);
                                }
                            }}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                        >
                            <Trans i18nKey={langKeys.next} />
                        </Button>

                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className={commonClasses.root}>
            {!hasFinished && <TwitterColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('twitter');
                    // setrequestchannels(prev => prev.filter(x => x.type !== "TWITTER"));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.connectface2} />
            </Typography>}
            {hasFinished && <TwitterColor
                style={{ width: 100, height: 100, alignSelf: 'center' }}/>
            }
            {hasFinished && (
                <div style={{ alignSelf: 'center' }}>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.5vw', fontWeight: 'bold', textAlign: 'center' }}>
                        ¡Felicitaciones!
                    </Typography>
                    <Typography
                        color="primary"
                        style={{ fontSize: '1.2vw', fontWeight: 500 }}>
                        Haz conectado Twitter con tu cuenta
                    </Typography>
            </div>
            )}
            <FieldEdit
                onChange={(value) => setValue('channels.twitter.description', value)}
                valueDefault={getValues('channels.twitter.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.twitter?.description?.message}
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
                    setValue('channels.twitter.devenvironment', value);
                    setValue('channels.twitter.communicationchannelowner', "");
                }}
                valueDefault={getValues('channels.twitter.devenvironment')}
                label={t(langKeys.devenvironment)}
                variant="outlined"
                size="small"
                error={errors.channels?.twitter?.devenvironment?.message}
            />
            {/* <div className="row-zyx">
                <div className="col-3"></div>
                <div className="col-6">
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                        {t(langKeys.givechannelcolor)}
                    </Box>
                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <TwitterIcon style={{ fill: `${coloricon}`, width: "100px" }} />
                        <ColorInput
                            hex={fields.parameters.coloricon}
                            onChange={e => {
                                setFields(prev => ({
                                    ...prev,
                                    parameters: { ...prev.parameters, coloricon: e.hex, color: e.hex },
                                }));
                                setcoloricon(e.hex)
                            }}
                        />
                    </div>
                </div>
            </div> */}
            {!hasFinished ? (
                <Button
                    onClick={() => setView("view2")}
                    className={commonClasses.button}
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            ) : selectedChannels === 1 && (
                <Button
                    onClick={finishreg}
                    className={commonClasses.button}
                    variant="contained"
                    color="primary"
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            )}
        </div>
    );
}