import { apiUrls } from 'common/constants';
import { Controller, useFormContext } from "react-hook-form";
import { CSSProperties, FC, useContext, useEffect, useState } from "react";
import { executeCheckNewUser } from "store/signup/actions";
import { langKeys } from "lang/keys";
import { MainData, SubscriptionContext } from "./context";
import { makeStyles, Button, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { showSnackbar } from "store/popus/actions";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { Visibility, VisibilityOff, Facebook as FacebookIcon } from "@material-ui/icons";

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

function validatePassword(password: string) {
    let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (password) {
        return strongRegex.exec(password);
    }
    else {
        return null;
    }
}

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        display: "block",
        fontSize: '40px',
        fontWeight: "bold",
        margin: 'auto',
        padding: 12,
        width: "280px",
    },
    buttonfacebook: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 400,
        '& span': {
            width: '100%'
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            '& span': {
                width: '100%'
            }
        },
    },
    buttonGoogle: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 400,
        '& button': {
            alignItems: 'center',
            color: '#FFF',
            fontSize: '20px!important',
            height: 50,
            justifyContent: 'center',
            width: '100%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        },
    },
    separator: {
        borderBottom: "2px solid #D1CBCB",
        height: "0",
        marginLeft: 32,
        marginRight: 32,
        width: 82,
    },
    orSeparator: {
        alignItems: 'center',
        display: "flex",
        justifyContent: 'center',
        marginBottom: 18,
        marginTop: 28,
    },
}));

const FBButtonStyle2: CSSProperties = {
    alignItems: 'center',
    borderRadius: '3px',
    display: 'flex',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 400,
    height: 50,
    justifyContent: 'center',
    marginBottom: 16,
    textTransform: 'none',
    width: "100%",
}

const FirstStep: FC = () => {
    const { control, setValue, getValues, trigger } = useFormContext<MainData>();
    const { selectedChannels, setStep } = useContext(SubscriptionContext);
    const { t } = useTranslation();

    const [disableButton, setDisableButton] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [waitSave, setwaitSave] = useState(false);

    const classes = useChannelAddStyles();
    const dispatch = useDispatch();
    const rescheckuser = useSelector(state => state.signup);

    useEffect(() => {
        if (waitSave) {
            if (!rescheckuser.loading) {
                if (rescheckuser.isvalid) {
                    setStep(2);
                    setwaitSave(false);
                } else {
                    dispatch(showSnackbar({ message: t(langKeys.useralreadyregistered), severity: "error", show: true }))
                    setwaitSave(false);
                }
            }
        }
    }, [rescheckuser])

    useEffect(() => {
        setDisableButton(selectedChannels < 1);
    }, [selectedChannels])

    const opentermsofservice = () => {
        window.open("/termsofservice", '_blank');
    }

    const openprivacypolicies = () => {
        window.open("/privacy", '_blank');
    }

    const onGoogleLoginSucess = (r: any) => {
        if (r && r.googleId) {
            const content = {
                "method": "UFN_USERIDBYUSER",
                "parameters": {
                    "facebookid": null,
                    "googleid": String(r.googleId),
                    "usr": null,
                }
            }
            setwaitSave(true);
            setValue('loginfacebookid', '');
            setValue('logingoogleid', r.googleId);
            setValue('loginpassword', '');
            setValue('loginpasswordrepeat', '');
            setValue('loginusername', '');
            dispatch(executeCheckNewUser(content))
        }
    }

    const onGoogleLoginFailure = (event: any) => {
        console.log('GOOGLE LOGIN FAILURE: ' + JSON.stringify(event));
        if (event && event.error) {
            switch (event.error) {
                case 'idpiframe_initialization_failed':
                case 'popup_closed_by_user':
                    break;
                default:
                    alert(event.error);
                    break;
            }
        }
    }

    const onAuthWithFacebook = (r: any) => {
        if (r && r.id) {
            const content = {
                "method": "UFN_USERIDBYUSER",
                "parameters": {
                    "facebookid": String(r.id),
                    "googleid": null,
                    "usr": r.email,
                }
            }
            setwaitSave(true);
            setValue('loginfacebookid', r.id);
            setValue('logingoogleid', '');
            setValue('loginpassword', '');
            setValue('loginpasswordrepeat', '');
            setValue('loginusername', '');
            dispatch(executeCheckNewUser(content))
        }
    }

    function handlesubmit() {
        const content = {
            "method": "UFN_USERIDBYUSER",
            "parameters": {
                "facebookid": null,
                "googleid": null,
                "usr": getValues('loginusername'),
            }
        }
        setwaitSave(true)
        dispatch(executeCheckNewUser(content))
    }

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleMouseDownPassword = (event: any) => event.preventDefault();

    return (
        <>
            <meta name="google-signin-client_id" content={apiUrls.GOOGLECLIENTID_LOGIN} />
            <script src="https://apis.google.com/js/platform.js" async defer></script>
            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", marginBottom: 32, marginTop: 15 }}>{t(langKeys.signupstep1title)}</div>
            <div className={classes.buttonfacebook}>
                <FacebookLogin
                    appId={apiUrls.FACEBOOKAPP}
                    buttonStyle={FBButtonStyle2}
                    callback={onAuthWithFacebook}
                    disableMobileRedirect={true}
                    fields="name,email,picture"
                    icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                    isDisabled={false}
                    textButton={t(langKeys.signup_with_facebook)}
                />
            </div>
            <div className={classes.buttonGoogle}>
                <GoogleLogin
                    accessType='online'
                    autoLoad={false}
                    buttonText={t(langKeys.signupgooglebutton)}
                    clientId={apiUrls.GOOGLECLIENTID_LOGIN}
                    cookiePolicy={'single_host_origin'}
                    onFailure={onGoogleLoginFailure}
                    onSuccess={onGoogleLoginSucess}
                    style={{ borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
            </div>
            <div className={classes.orSeparator}>
                <div className={classes.separator} />
                <div style={{ fontSize: 24, fontWeight: 500, color: "#989898" }}>
                    <Trans i18nKey={langKeys.signupor} />
                </div>
                <div className={classes.separator} />
            </div>
            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                <Controller
                    control={control}
                    name="loginusername"
                    rules={{
                        validate: (value) => {
                            if (value.length === 0) {
                                return t(langKeys.field_required) as string;
                            } else if (!/\S+@\S+\.\S+/.test(value)) {
                                return t(langKeys.emailverification) as string;
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            error={!!errors.loginusername}
                            fullWidth
                            helperText={errors.loginusername?.message}
                            label={t(langKeys.email)}
                            margin="normal"
                            size="small"
                            type="email"
                            variant="outlined"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="loginpassword"
                    rules={{
                        validate: (value) => {
                            if (value.length === 0) {
                                return `${t(langKeys.field_required)}`;
                            } else {
                                if (validatePassword(value) === null) {
                                    return `${t(langKeys.password_strongvalidation)}`;
                                }
                                if (value !== getValues('loginpasswordrepeat')) {
                                    return `${t(langKeys.passwordsmustbeequal)}`;
                                }
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            autoComplete="current-password"
                            error={!!errors.loginpassword}
                            fullWidth
                            helperText={errors.loginpassword?.message}
                            label={t(langKeys.password)}
                            margin="normal"
                            size="small"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            edge="end"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="loginpasswordrepeat"
                    rules={{
                        validate: (value) => {
                            if (value.length === 0) {
                                return `${t(langKeys.field_required)}`;
                            } else if (value !== getValues('loginpassword')) {
                                return `${t(langKeys.passwordsmustbeequal)}`;
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            autoComplete="current-password"
                            error={!!errors.loginpasswordrepeat}
                            fullWidth
                            helperText={errors.loginpasswordrepeat?.message}
                            label={t(langKeys.confirmpassword)}
                            margin="normal"
                            size="small"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            edge="end"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
                <div style={{ textAlign: "center", padding: "20px" }}>{t(langKeys.tos1)}<a style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={opentermsofservice} rel="noopener noreferrer">{t(langKeys.termsofservicetitle)}</a>{t(langKeys.tos2)}<a style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={openprivacypolicies} rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>
                <div style={{ textAlign: "center", padding: "20px" }}>{t(langKeys.tossub1)} <a href="#" style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'default', textDecorationLine: 'none' }} rel="noopener noreferrer">{`${t(langKeys.creditcard)}`.toUpperCase()}</a> {t(langKeys.tossub2)}</div>
                <Button
                    className={classes.button}
                    color="primary"
                    disabled={disableButton}
                    variant="contained"
                    onClick={async () => {
                        const valid = await trigger();
                        if (valid) {
                            handlesubmit();
                        }
                    }}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            </div>
        </>
    )
}

export default FirstStep