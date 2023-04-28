/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { Breadcrumbs, Button, Link, makeStyles, TextField } from "@material-ui/core";
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
import { ChannelAddPhone } from './ChannelAddPhone'
import { ChannelAddBlogger } from './ChannelAddBlogger'
import { ChannelAddEmail } from './ChannelAddEmail'
import { ChannelAddLinkedIn } from './ChannelAddLinkedIn'
import { ChannelAddSMS } from './ChannelAddSMS'
import { ChannelAddTeams } from './ChannelAddTeams'
import { ChannelAddTikTok } from './ChannelAddTikTok'
import { ChannelAddYouTube } from './ChannelAddYouTube'
import { ChannelAddPlayStore } from './ChannelAddPlayStore'
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { ListChannels, SubscriptionContext, MainData } from "./context";
import { useSelector } from "hooks";
import { Controller, useFormContext } from "react-hook-form";
import { FieldSelect } from "components";
import { styled } from '@material-ui/core/styles';

import MuiPhoneNumber from 'material-ui-phone-number';
import { ChannelAddWebForm } from "./ChannelAddWebForm";

const useLeftSideStyles = makeStyles(theme => ({
    root: {
        flex: 1,
        width: '100%',
        height: 'auto',
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
    containerInfoPay: {
        width: '50%',

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

interface LeftSideProps {
    setOpenWarning: (param: any) => void;
}

export const LeftSide: FC<LeftSideProps> = ({ setOpenWarning }) => {
    const { t } = useTranslation();
    const [currentView, setCurrentView] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);
    const [limitnumbers, setlimitnumbers] = useState(16);
    const [icon, setIcon] = useState(<></>);
    const { getValues, control, setValue } = useFormContext<MainData>();
    const executeResultValidation = useSelector(state => state.subscription.requestValidateChannels);
    const classes = useLeftSideStyles();
    const {
        foreground,
        listchannels,
        selectedChannels,
        finishreg,
        valchannels,
        commonClasses
    } = useContext(SubscriptionContext);
    const executeResult = useSelector(state => state.signup.insertChannel);
    const datamonth = useMemo(() => ([
        { id: 1, desc: "01" },
        { id: 2, desc: "02" },
        { id: 3, desc: "03" },
        { id: 4, desc: "04" },
        { id: 5, desc: "05" },
        { id: 6, desc: "06" },
        { id: 7, desc: "07" },
        { id: 8, desc: "08" },
        { id: 9, desc: "09" },
        { id: 10, desc: "10" },
        { id: 11, desc: "11" },
        { id: 12, desc: "12" },
    ]), [t]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResultValidation.loading) {
                if (!executeResultValidation.error) {
                    setWaitSave(false);
                    setCurrentView("view-2");
                } else {
                    setWaitSave(false);
                }
            }
        }
    }, [executeResultValidation])


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
                        key={key}
                        display={display}
                    />
                );
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listchannels, foreground]);

    return (
        <div className={classes.root}>
            <div hidden={currentView !== "view-1"}>
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
                {!foreground && <h1 className={classes.title}>{t(langKeys.subscription_selectedchannel)}</h1>}
                <div className={classes.channelList}>
                    {channels}
                </div>
                {(!foreground && selectedChannels >= 1) && (
                    <>
                        <div style={{ textAlign: "center", padding: "20px" }}>{t(langKeys.finishregmessage)}</div>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                setWaitSave(true)
                                valchannels();
                            }}
                            className={commonClasses.button}
                            style={{ marginTop: '3em' }}
                            variant="contained"
                            color="primary"
                            disabled={executeResult.loading}
                        >
                            <Trans i18nKey={langKeys.addpaymentmethod} />
                        </Button>
                    </>
                )}
                <div />
            </div>
            <div hidden={currentView !== "view-2"}>
                <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: '1em' }}>
                    <Link color="textSecondary" href="/" onClick={(e) => { e.preventDefault(); setCurrentView("view-1"); }}>
                        {'<< '}<Trans i18nKey={langKeys.previoustext} />
                    </Link>
                </Breadcrumbs>
                <h1 className={classes.title}>{t(langKeys.addpaymentmethod)}</h1>
                <div style={{ padding: "20px" }}>
                    {t(langKeys.addpaymentmethodsub)}
                </div>
                <Controller
                    name="firstnamecard"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (currentView === "view-2") {
                                if (value.length === 0) {
                                    return t(langKeys.field_required) as string;
                                }
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            size="small"
                            label={t(langKeys.firstname)}
                            error={!!errors.firstnamecard}
                            helperText={errors.firstnamecard?.message}
                        />
                    )}
                />
                <Controller
                    name="lastnamecard"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (currentView === "view-2") {
                                if (value?.length === 0) {
                                    return t(langKeys.field_required) as string;
                                }
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            size="small"
                            label={t(langKeys.lastname)}
                            error={!!errors.lastnamecard}
                            helperText={errors.lastnamecard?.message}
                        />
                    )}
                />
                <Controller
                    name="pmemail"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (currentView === "view-2") {
                                if (value?.length === 0) {
                                    return t(langKeys.field_required) as string;
                                } else if (!/\S+@\S+\.\S+/.test(value)) {
                                    return t(langKeys.emailverification) as string;
                                }
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            size="small"
                            label={t(langKeys.email)}
                            error={!!errors.pmemail}
                            helperText={errors.pmemail?.message}
                        />
                    )}
                />
                <Controller
                    name="pmphone"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (currentView === "view-2") {
                                if (value.length === 0) {
                                    return t(langKeys.field_required) as string;
                                } else if (value.length < 10) {
                                    return t(langKeys.validationphone) as string;
                                }
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <CssPhonemui
                            {...field}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            size="small"
                            defaultCountry={'pe'}
                            label={t(langKeys.phone)}
                            error={!!errors?.pmphone}
                            helperText={errors?.pmphone?.message}
                        />
                    )}
                />
                <h3>{t(langKeys.creditcard)}</h3>
                <div style={{ display: "flex" }}>
                    <img alt="visa" src="https://static.culqi.com/v2/v2/static/img/visa.svg" width="50px" style={{ padding: 5 }}></img>
                    <img alt="mastercard" src="https://static.culqi.com/v2/v2/static/img/mastercard.svg" width="50px" style={{ padding: 5 }}></img>
                    <img alt="ammex" src="https://static.culqi.com/v2/v2/static/img/amex.svg" width="50px" style={{ padding: 5 }}></img>
                    <img alt="dinners" src="https://static.culqi.com/v2/v2/static/img/diners.svg" width="50px" style={{ padding: 5 }}></img>
                </div>
                <div style={{ display: "flex", width: "100%", flexWrap: 'wrap' }}>
                    <div className={classes.containerInfoPay}>
                        <Controller
                            name="creditcard"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (currentView === "view-2") {
                                        if (value?.length === 0) {
                                            return t(langKeys.field_required) as string;
                                        } else if ((value?.length !== limitnumbers) || (limitnumbers < 12)) {
                                            return t(langKeys.creditcardvalidate) as string;
                                        }
                                    }
                                }
                            }}
                            render={({ field, formState: { errors } }) => (
                                <TextField
                                    {...field}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    size="small"
                                    label={t(langKeys.creditcard)}
                                    error={!!errors.creditcard}
                                    helperText={errors.creditcard?.message}
                                    onPaste={e => {
                                        e.preventDefault()
                                    }}
                                    onChange={(e) => {
                                        let val = e.target.value.replace(/[^0-9]/g, '');
                                        let spaces = Math.floor(val.length / 4)
                                        let partialvalue = val.slice(0, 4)
                                        for (let i = 1; i <= spaces; i++) {
                                            partialvalue += " " + val.slice(i * 4, (i + 1) * 4)
                                        }
                                        setValue("creditcard", partialvalue.trim());
                                    }}
                                    onInput={(e: any) => {
                                        if (e.target.value.slice(0, 1) === "4") {
                                            setIcon(<img alt="visa" src="https://static.culqi.com/v2/v2/static/img/visa.svg" width="50px" style={{ padding: 5 }}></img>)
                                            setlimitnumbers(19)
                                        } else if (e.target.value.slice(0, 2) === "51" || e.target.value.slice(0, 2) === "55") {
                                            setIcon(<img alt="mastercard" src="https://static.culqi.com/v2/v2/static/img/mastercard.svg" width="50px" style={{ padding: 5 }}></img>)
                                            setlimitnumbers(19)
                                        } else if (e.target.value.slice(0, 2) === "37" || e.target.value.slice(0, 2) === "34") {
                                            setIcon(<img alt="ammex" src="https://static.culqi.com/v2/v2/static/img/amex.svg" width="50px" style={{ padding: 5 }}></img>)
                                            setlimitnumbers(18)
                                        } else if (e.target.value.slice(0, 2) === "36" || e.target.value.slice(0, 2) === "38" || e.target.value.slice(0, 3) === "300" || e.target.value.slice(0, 3) === "305") {
                                            setIcon(<img alt="dinners" src="https://static.culqi.com/v2/v2/static/img/diners.svg" width="50px" style={{ padding: 5 }}></img>)
                                            setlimitnumbers(17)
                                        } else {
                                            setIcon(<></>)
                                            setlimitnumbers(10)
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: icon,
                                    }}
                                    inputProps={{
                                        maxLength: limitnumbers
                                    }}
                                />
                            )}
                        />
                        <div style={{ padding: "20px" }}>{t(langKeys.dueDate)}</div>
                        <div style={{ display: "flex" }}>
                            <Controller
                                name="mm"
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (currentView === "view-2") {
                                            if (value === null || value === undefined) {
                                                return t(langKeys.field_required) as string;
                                            }
                                        }
                                    }
                                }}
                                render={({ field: { onChange }, formState: { errors } }) => (
                                    <FieldSelect
                                        onChange={(data: typeof datamonth[number]) => {
                                            onChange(data?.id || "");
                                        }}
                                        variant="outlined"
                                        style={{ marginTop: 8, marginRight: 10 }}
                                        className="col-6"
                                        valueDefault={getValues('mm')}
                                        label={"MM"}
                                        error={errors.mm?.message}
                                        data={datamonth}
                                        optionDesc="desc"
                                        optionValue="id"
                                    />
                                )}
                            />
                            <Controller
                                name="yyyy"
                                control={control}
                                rules={{
                                    validate: (value) => {
                                        if (currentView === "view-2") {
                                            if (value?.length === 0) {
                                                return t(langKeys.field_required) as string;
                                            } else if (value?.length !== 4) {
                                                return t(langKeys.field_required) as string;
                                            }
                                        }
                                    }
                                }}
                                render={({ field, formState: { errors } }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        className="col-6"
                                        style={{ marginTop: 8 }}
                                        type="number"
                                        size="small"
                                        label={"YYYY"}
                                        error={!!errors.yyyy}
                                        helperText={errors.yyyy?.message}
                                        inputProps={{
                                            maxLength: 4
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <Controller
                            name="securitycode"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (currentView === "view-2") {
                                        if (value?.length === 0) {
                                            return t(langKeys.field_required) as string;
                                        }
                                    }
                                }
                            }}
                            render={({ field, formState: { errors } }) => (
                                <TextField
                                    {...field}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    type="password"
                                    size="small"
                                    label={t(langKeys.securitycode)}
                                    error={!!errors.securitycode}
                                    helperText={errors.securitycode?.message}
                                    inputProps={{
                                        maxLength: limitnumbers === 18 ? 4 : 3
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className={classes.containerInfoPay} >
                        <div style={{ textAlign: "center", padding: "20px", border: "1px solid #7721ad", borderRadius: "15px", margin: "10px" }}>{t(langKeys.finishregwarn)}</div>
                        <div style={{ textAlign: "center", padding: "20px", color: "#7721ad", margin: "10px" }}>{t(langKeys.finishregwarn2)}</div>
                    </div>
                </div>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        finishreg();
                    }}
                    className={commonClasses.button}
                    style={{ marginTop: '3em' }}
                    variant="contained"
                    color="primary"
                    disabled={executeResult.loading}
                >
                    <Trans i18nKey={langKeys.finishreg} />
                </Button>
            </div>
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

        case 'messenger':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddMessenger setOpenWarning={setOpenWarning} />
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

        case 'tiktok':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddTikTok setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'youtube':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddYouTube setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'playstore':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddPlayStore setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'linkedin':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddLinkedIn setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'chatWeb':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddChatWeb setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'webForm':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddWebForm setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'email':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddEmail setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'phone':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddPhone setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'sms':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddSMS setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'apple':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddIos setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'android':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddAndroid setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'teams':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddTeams setOpenWarning={setOpenWarning} />
                </div>
            );

        case 'blogger':
            return (
                <div style={{ display: display ? 'block' : 'none' }}>
                    <ChannelAddBlogger setOpenWarning={setOpenWarning} />
                </div>
            );

        default: return <div />;
    }
}
