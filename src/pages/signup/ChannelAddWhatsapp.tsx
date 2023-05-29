/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Breadcrumbs, Button, TextField, IconButton, Typography, InputAdornment } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { DeleteOutline as DeleteOutlineIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from '@material-ui/icons';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldEdit } from "components";
import MuiPhoneNumber from 'material-ui-phone-number';
import { styled } from '@material-ui/core/styles';
import { WhatsAppColor } from "icons";
import { MainData, SubscriptionContext } from "./context";
import { useFormContext } from "react-hook-form";
import clsx from 'clsx';

const useChannelAddStyles = makeStyles(theme => ({
    centerbutton: {
        marginLeft: "calc(50% - 96px)",
        marginTop: "30px",
        marginBottom: "20px",
    },
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
    fields1: {
        flex: 1,
        margin: "15px"
    },
    fields2: {
        flex: 1,
    },
    fields3: {
        flex: 1,
        // marginLeft: "15px"
    },
    fieldG: {
        margin: 0,
        width: '48%',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    }
}));

const CssPhonemui = styled(MuiPhoneNumber)({
    '& label.Mui-focused': {
        color: '#7721ad',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#7721ad',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#7721ad',
        },
    },
});

const phoneRegExp = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;

export const ChannelAddWhatsapp: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const {
        commonClasses,
        foreground,
        submitObservable,
        setForeground,
        deleteChannel,
    } = useContext(SubscriptionContext);
    const { getValues, setValue, register, unregister, formState: { errors }, trigger } = useFormContext<MainData>();
    const [viewSelected, setViewSelected] = useState("view1");
    const [hasFinished, setHasFinished] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const { t } = useTranslation();
    const [nextbutton2, setNextbutton2] = useState(true);
    const classes = useChannelAddStyles();

    useEffect(() => {
        const cb = async () => {
            const v1 = await trigger('channels.whatsapp.description');
            const v2 = await trigger('channels.whatsapp.accesstoken');
            const v3 = await trigger('channels.whatsapp.brandName');
            const v4 = await trigger('channels.whatsapp.brandAddress');
            const v5 = await trigger('channels.whatsapp.firstName');
            const v6 = await trigger('channels.whatsapp.lastName');
            const v7 = await trigger('channels.whatsapp.email');
            const v8 = await trigger('channels.whatsapp.phone');
            const v9 = await trigger('channels.whatsapp.customerfacebookid');
            const v10 = await trigger('channels.whatsapp.phonenumberwhatsappbusiness');
            const v11 = await trigger('channels.whatsapp.nameassociatednumber');
            setSubmitError(!v1 || !v2 || !v3 || !v4 || !v5 || !v6 || !v7 || !v8 || !v9 || !v10 || !v11);
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

        const emailRequired = (value: string) => {
            if (value.length === 0) {
                return t(langKeys.field_required) as string;
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                return t(langKeys.emailverification) as string;
            }
        }

        const phoneRequired = (value: string) => {
            if (!phoneRegExp.test(value) || value.length < 10) {
                return "Ingrese un número de telefono válido"
            }
        }

        register('channels.whatsapp.description', { validate: strRequired, value: '' });
        register('channels.whatsapp.accesstoken', { value: '' });
        register('channels.whatsapp.brandName', { value: '' });
        register('channels.whatsapp.brandAddress', { value: '' });
        register('channels.whatsapp.firstName', { validate: strRequired, value: '' });
        register('channels.whatsapp.lastName', { validate: strRequired, value: '' });
        register('channels.whatsapp.email', { validate: emailRequired, value: '' });
        register('channels.whatsapp.phone', { validate: phoneRequired, value: '' });
        register('channels.whatsapp.customerfacebookid', { value: '' });
        register('channels.whatsapp.phonenumberwhatsappbusiness', { validate: strRequired, value: '' });
        register('channels.whatsapp.nameassociatednumber', { validate: strRequired, value: '' });
        register('channels.whatsapp.communicationchannelowner', { value: '' });
        register('channels.whatsapp.build', {
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
                    "coloricon": "#4AC959",
                    "voximplantcallsupervision": false
                },
                "type": "WHATSAPPSMOOCH",
                "service": {
                    "accesstoken": values.accesstoken,
                    "brandname": values.brandName,
                    "brandaddress": values.brandAddress,
                    "firstname": values.firstName,
                    "lastname": values.lastName,
                    "email": values.email,
                    "phone": values.phone,
                    "customerfacebookid": values.customerfacebookid,
                    "phonenumberwhatsappbusiness": values.phonenumberwhatsappbusiness,
                    "nameassociatednumber": values.nameassociatednumber,
                }
            })
        });

        return () => {
            unregister('channels.whatsapp')
        }
    }, [register, unregister]);

    useEffect(() => {
        if (foreground !== 'whatsapp' && viewSelected !== "view1") {
            setViewSelected("view1");
        }
    }, [foreground, viewSelected]);

    const setView = (option: "view1" | "view2" | "view3") => {
        if (option === "view1") {
            setViewSelected(option);
            setForeground(undefined);
        } else {
            setViewSelected(option);
            setForeground('whatsapp');
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
                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", marginBottom: 10 }}>{t(langKeys.brandpointcontact)}</div>
                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 16, color: "grey" }}>{t(langKeys.brandpointcontact2)}</div>
                <div style={{ textAlign: "center", marginBottom: 16, marginTop: 16, fontWeight: 500, fontSize: 32, color: "#7721ad", display: "flex", flexWrap: 'wrap', gap: 16, width: '100%' }}>
                    <TextField
                        className={classes.fieldG}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        size="small"
                        defaultValue={getValues('channels.whatsapp.firstName')}
                        label={t(langKeys.firstname)}
                        name="firstname"
                        error={!!errors.channels?.whatsapp?.firstName}
                        helperText={errors.channels?.whatsapp?.firstName?.message}
                        onChange={(e) => setValue('channels.whatsapp.firstName', e.target.value)}
                    />
                    <TextField
                        className={classes.fieldG}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        size="small"
                        defaultValue={getValues('channels.whatsapp.lastName')}
                        label={t(langKeys.lastname)}
                        name="lastname"
                        error={!!errors.channels?.whatsapp?.lastName}
                        helperText={errors.channels?.whatsapp?.lastName?.message}
                        onChange={(e) => setValue('channels.whatsapp.lastName', e.target.value)}
                    />
                    <TextField
                        className={classes.fieldG}
                        style={{ marginBottom: 0 }}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        size="small"
                        label={t(langKeys.email)}
                        name="email"
                        defaultValue={getValues('channels.whatsapp.email')}
                        error={!!errors.channels?.whatsapp?.email}
                        helperText={errors.channels?.whatsapp?.email?.message}
                        onChange={(e) => setValue('channels.whatsapp.email', e.target.value)}
                    />
                    <CssPhonemui
                        className={classes.fieldG}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        disableAreaCodes={true}
                        value={getValues('channels.whatsapp.phone')}
                        error={!!errors.channels?.whatsapp?.phone}
                        helperText={errors.channels?.whatsapp?.phone?.message}
                        label={t(langKeys.phone)}
                        name="phone"
                        fullWidth
                        defaultCountry={'pe'}
                        onChange={(e: string) => setValue('channels.whatsapp.phone', e)}
                    />
                </div>
                <div style={{ textAlign: "left", fontWeight: 500, fontSize: 12, color: "grey", marginBottom: "15px" }}>{t(langKeys.emailcondition)}</div>
                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", marginBottom: 10 }}>{t(langKeys.whatsappinformation)}</div>
                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display: "flex" }}>
                    <TextField
                        className={classes.fields3}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        size="small"
                        defaultValue={getValues('channels.whatsapp.phonenumberwhatsappbusiness')}
                        label={t(langKeys.desiredphonenumberwhatsappbusiness)}
                        name="phonenumberwhatsappbusiness"
                        error={!!errors.channels?.whatsapp?.phonenumberwhatsappbusiness}
                        helperText={errors.channels?.whatsapp?.phonenumberwhatsappbusiness?.message}
                        onChange={e => setValue('channels.whatsapp.phonenumberwhatsappbusiness', e.target.value)}
                    />
                </div>
                <div style={{ textAlign: "left", fontWeight: 500, fontSize: 12, color: "grey", marginBottom: "15px" }}>
                    {t(langKeys.whatsappinformation3) + " "}
                    <Link href="http://africau.edu/images/default/sample.pdf">
                        {t(langKeys.whatsappguidedownload)}
                    </Link>
                </div>
                <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", display: "flex" }}>
                    <TextField
                        className={classes.fields3}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        size="small"
                        defaultValue={getValues('channels.whatsapp.nameassociatednumber')}
                        label={t(langKeys.nameassociatednumber)}
                        name="nameassociatednumber"
                        error={!!errors.channels?.whatsapp?.nameassociatednumber}
                        helperText={errors.channels?.whatsapp?.nameassociatednumber?.message}
                        onChange={e => setValue('channels.whatsapp.nameassociatednumber', e.target.value)}
                    />
                </div>
                <div style={{ textAlign: "left", fontWeight: 500, fontSize: 12, color: "grey", marginBottom: "20px" }}>{t(langKeys.whatsappinformation4)}</div>
                <div style={{ textAlign: "left", fontWeight: 500, fontSize: 12, color: "grey", marginBottom: "15px" }}><b>*{t(langKeys.whatsappsubtitle1)}</b></div>
                <div style={{ width: "100%", margin: "0px 15px", marginLeft: 0 }}>
                    <Button
                        onClick={async () => {
                            const v1 = await trigger('channels.whatsapp.description');
                            const v2 = await trigger('channels.whatsapp.accesstoken');
                            const v3 = await trigger('channels.whatsapp.brandName');
                            const v4 = await trigger('channels.whatsapp.brandAddress');
                            const v5 = await trigger('channels.whatsapp.firstName');
                            const v6 = await trigger('channels.whatsapp.lastName');
                            const v7 = await trigger('channels.whatsapp.email');
                            const v8 = await trigger('channels.whatsapp.phone');
                            const v9 = await trigger('channels.whatsapp.customerfacebookid');
                            const v10 = await trigger('channels.whatsapp.phonenumberwhatsappbusiness');
                            const v11 = await trigger('channels.whatsapp.nameassociatednumber');
                            if (v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8 && v9 && v10 && v11) {
                                setView("view1");
                                setHasFinished(true);
                            }
                        }}
                        className={classes.button2}
                        variant="contained"
                        color="primary"
                    >
                        <Trans i18nKey={langKeys.next} />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={clsx(commonClasses.root, submitError && commonClasses.rootError)}>
            {!hasFinished && <WhatsAppColor className={commonClasses.leadingIcon} />}
            {!hasFinished && <IconButton
                color="primary"
                className={commonClasses.trailingIcon}
                onClick={() => {
                    deleteChannel('whatsapp');
                    // setrequestchannels(prev => prev.filter(x => x.type !== type));
                }}
            >
                <DeleteOutlineIcon />
            </IconButton>}
            {!hasFinished && <Typography>
                <Trans i18nKey={langKeys.subscription_genericconnect} />
            </Typography>}
            {hasFinished && <WhatsAppColor
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
                        {t(langKeys.subscription_message1)} {t(langKeys.channel_whatsapp)} {t(langKeys.subscription_message2)}
                    </Typography>
                </div>
            )}
            <FieldEdit
                onChange={(value) => { setValue('channels.whatsapp.description', value); setNextbutton2(!value); }}
                valueDefault={getValues('channels.whatsapp.description')}
                label={t(langKeys.givechannelname)}
                variant="outlined"
                size="small"
                error={errors.channels?.whatsapp?.description?.message}
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