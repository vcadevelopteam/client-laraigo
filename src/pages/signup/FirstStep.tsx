import { apiUrls } from "common/constants";
import { Button, CircularProgress, InputAdornment, IconButton, makeStyles, TextField, Container } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";
import { executeCheckNewUser } from "store/signup/actions";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { MainData, SubscriptionContext } from "./context";
import { showSnackbar } from "store/popus/actions";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import FacebookIcon from '@material-ui/icons/Facebook';
import FacebookLogin from "react-facebook-login";
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import React, { FC, MouseEvent, useContext, useEffect, useState } from "react";
import { LaraigoLogo } from "icons";
import { OnlyCheckbox } from "components";

function validatePassword(password: string) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;

    if (password) {
        return strongRegex.exec(password);
    } else {
        return null;
    }
}

const useChannelAddStyles = makeStyles((theme) => ({
    button: {
        display: "block",
        fontSize: "40px",
        fontWeight: "bold",
        margin: "auto",
        padding: 12,
        width: "280px",
    },
    buttonFace: {
        borderRadius: '3px!important',
        display: 'flex!important',
        alignItems: 'center!important',
        fontSize: '14px!important',
        fontStyle: 'normal!important',
        fontWeight: 600, textTransform: 'none',
        justifyContent: 'center!important',
        width: '100%!important',
        cursor: 'pointer!important',
        boxShadow: "none",
        height: '2.5rem!important',
        background: '#FFF', color: "#6d6d6d",
        '& span': {
            fontWeight: 'bold!important',
            color: "#6d6d6d"
        },
        '& div': {
            background: "none!important"
        },
    },
    buttonfacebook: {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        marginLeft: "auto",
        marginRight: "auto",
        width: 400,
        "& span": {
            width: "100%",
        },
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            "& span": {
                width: "100%",
            },
        },
    },
    buttonGoogle: {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        marginLeft: "auto",
        marginRight: "auto",
        width: 400,
        "& button": {
            alignItems: "center",
            color: "#FFF",
            fontSize: "20px!important",
            height: 50,
            justifyContent: "center",
            width: "100%",
        },
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        },
    },
    separator: {
        borderBottom: "2px solid #7721ad",
        height: "0",
        marginLeft: 32,
        marginRight: 32,
        width: "100%",
    },
    orSeparator: {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        marginBottom: 18,
        marginTop: 28,
    },
    container: {
        background: "linear-gradient(90deg, #0C0931 0%, #1D1856 50%, #C200DB 100%)", height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    containerSignUp: {
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 20,
            paddingRight: 20,
            marginLeft: 16,
            marginRight: 16,
            paddingBottom: 35,
        },
        display: 'flex',
        alignItems: 'center',
        borderRadius: "3.75rem",
        backgroundColor: "white",
        paddingLeft: 36,
        paddingRight: 36,
        position: "relative",
        paddingBottom: 35,
        maxWidth: 420
    },
    copyright: {
        fontFamily: "Inter",
        fontSize: "0.875rem",
        color: "white",
        fontStyle: "normal",
        fontWeight: 400,
        position: "absolute",
        bottom: "calc(-1.62rem - 16px)",
        width: "82%",
        textAlign: "center",
    },
    childContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    image: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "1.8rem",
        marginBottom: "1.8rem",
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    borderGoogle: {
        border: '1px solid #757575!important',
    },
}));

const FirstStep: FC = () => {
    const { control, getValues, setValue, trigger } = useFormContext<MainData>();
    const { setStep } = useContext(SubscriptionContext);
    const { t } = useTranslation();

    const [disableButton, setDisableButton] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [acceptTOS, setAcceptTOS] = useState(false);

    const classes = useChannelAddStyles();
    const dispatch = useDispatch();
    const signUpState = useSelector((state) => state.signup);

    useEffect(() => {
        if (waitSave) {
            if (!signUpState.loading) {
                if (signUpState.isvalid) {
                    if (disableButton) {
                        showSnackbar({ message: t(langKeys.mustaccepttermsandconditions), severity: "error", show: true })
                    } else {
                        setStep(2);
                    }
                    setWaitSave(false);
                } else {
                    dispatch(
                        showSnackbar({ message: t(langKeys.useralreadyregistered), severity: "error", show: true })
                    );
                    setWaitSave(false);
                }
            }
        }
    }, [signUpState]);

    useEffect(() => {
        if (!showLogin) {
            const time = setTimeout(() => {
                setShowLogin(true);
            }, 1000);

            return () => {
                clearTimeout(time);
            };
        }
    }, [showLogin]);

    useEffect(() => {
        setDisableButton(!acceptTOS);
    }, [acceptTOS]);

    const openTermsOfService = () => {
        window.open("/termsofservice", "_blank");
    };

    const openPrivacyPolicy = () => {
        window.open("/privacy", "_blank");
    };

    const onGoogleLoginSucess = (event: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log("GOOGLE SUCCESS: " + JSON.stringify(event));
        if ((event as GoogleLoginResponse)?.googleId) {
            if (disableButton) {
                dispatch(
                    showSnackbar({ message: t(langKeys.subscription_noselectedchannel), severity: "error", show: true })
                );
            } else {
                const content = {
                    method: "UFN_USERIDBYUSER",
                    parameters: {
                        facebookid: null,
                        googleid: String((event as GoogleLoginResponse).googleId),
                        usr: null,
                    },
                };
                setWaitSave(true);
                setValue("loginfacebookid", "");
                setValue("logingoogleid", (event as GoogleLoginResponse).googleId);
                setValue("loginpassword", "");
                setValue("loginpasswordrepeat", "");
                setValue("loginusername", "");
                dispatch(executeCheckNewUser(content));
            }
        }
    };

    const onGoogleLoginFailure = (event: Record<string, unknown>) => {
        console.log("GOOGLE FAILURE: " + JSON.stringify(event));
        if (event?.error) {
            switch (event.error) {
                case "idpiframe_initialization_failed":
                case "popup_closed_by_user":
                    break;
                default:
                    alert(event.error);
                    break;
            }
        }
    };

    const onAuthWithFacebook = (event: Record<string, unknown>) => {
        console.log("FACEBOOK EVENT: " + JSON.stringify(event));
        if (event?.id && event?.email) {
            if (disableButton) {
                dispatch(
                    showSnackbar({ message: t(langKeys.subscription_noselectedchannel), severity: "error", show: true })
                );
            } else {
                const content = {
                    method: "UFN_USERIDBYUSER",
                    parameters: {
                        facebookid: String(event.id),
                        googleid: null,
                        usr: event.email,
                    },
                };
                setWaitSave(true);
                setValue("loginfacebookid", String(event.id));
                setValue("logingoogleid", "");
                setValue("loginpassword", "");
                setValue("loginpasswordrepeat", "");
                setValue("loginusername", "");
                dispatch(executeCheckNewUser(content));
            }
        }
    };

    function handleSubmit() {
        const content = {
            method: "UFN_USERIDBYUSER",
            parameters: {
                facebookid: null,
                googleid: null,
                usr: getValues("loginusername"),
            },
        };
        setWaitSave(true);
        dispatch(executeCheckNewUser(content));
    }

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();

    return (
        <main>
            <meta name="google-signin-client_id" content={`${apiUrls.GOOGLECLIENTID_LOGIN}`} />
            <script src="https://apis.google.com/js/platform.js" async defer></script>
            <div className={classes.container}>
                <Container component="main" className={classes.containerSignUp}>
                    <div className={classes.childContainer} style={{ height: '100%' }}>
                        <div className={classes.image}>
                            <LaraigoLogo height={42.8} />
                        </div>

                        <div className={classes.paper} style={{ flex: 1 }}>
                            {showLogin ? (<div style={{ alignItems: 'center', display: 'flex', flexDirection: "column", gap: "1rem", width: "100%", marginBottom: "1.02rem" }}>
                                <FacebookLogin
                                    appId={`${apiUrls.FACEBOOKAPP}`}
                                    autoLoad={false}
                                    buttonStyle={{ border: '1px solid #4D6BB7' }}
                                    containerStyle={{ width: "100%" }}
                                    cssClass={classes.buttonFace}
                                    callback={onAuthWithFacebook}
                                    disableMobileRedirect={true}
                                    fields="name,email,picture"
                                    icon={<FacebookIcon style={{ color: 'blue', marginRight: '8px' }} />}
                                    isDisabled={false}
                                    textButton={t(langKeys.signup_with_facebook)}
                                    onClick={(e: any) => {
                                        e.view.window.FB.init({
                                            appId: apiUrls.FACEBOOKAPP,
                                            cookie: true,
                                            xfbml: true,
                                            version: apiUrls.FACEBOOKVERSION,
                                        });
                                    }}
                                />
                                <GoogleLogin
                                    accessType="online"
                                    autoLoad={false}
                                    buttonText={t(langKeys.signupgooglebutton)}
                                    className={`${classes.buttonFace} ${classes.borderGoogle}`}
                                    clientId={`${apiUrls.GOOGLECLIENTID_LOGIN}`}
                                    cookiePolicy={"single_host_origin"}
                                    onFailure={onGoogleLoginFailure}
                                    onSuccess={onGoogleLoginSucess}
                                />

                            </div>) : (
                                <CircularProgress />
                            )}
                            <div className={classes.separator} />
                            <div>
                                <Controller
                                    control={control}
                                    name="loginusername"
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            error={Boolean(errors.loginusername)}
                                            fullWidth
                                            helperText={errors.loginusername?.message}
                                            label={t(langKeys.email) + " *"}
                                            margin="normal"
                                            size="small"
                                            type="email"
                                            variant="outlined"
                                        />
                                    )}
                                    rules={{
                                        validate: (value) => {
                                            if (value.length === 0) {
                                                return `${t(langKeys.field_required)}`;
                                            } else if (!/\S+@\S+\.\S+/.test(value)) {
                                                return `${t(langKeys.emailverification)}`;
                                            }
                                        },
                                    }}
                                />
                                <Controller
                                    control={control}
                                    name="loginpassword"
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            autoComplete="current-password"
                                            error={Boolean(errors.loginpassword)}
                                            fullWidth
                                            helperText={errors.loginpassword?.message}
                                            label={t(langKeys.password) + " *"}
                                            margin="normal"
                                            size="small"
                                            type={showPassword ? "text" : "password"}
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
                                    rules={{
                                        validate: (value) => {
                                            if (value.length === 0) {
                                                return `${t(langKeys.field_required)}`;
                                            } else {
                                                if (validatePassword(value) === null) {
                                                    return `${t(langKeys.password_strongvalidation)}`;
                                                }
                                                if (value !== getValues("loginpasswordrepeat")) {
                                                    return `${t(langKeys.passwordsmustbeequal)}`;
                                                }
                                            }
                                        },
                                    }}
                                />
                                <Controller
                                    control={control}
                                    name="loginpasswordrepeat"
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            autoComplete="current-password"
                                            error={Boolean(errors.loginpasswordrepeat)}
                                            fullWidth
                                            helperText={errors.loginpasswordrepeat?.message}
                                            label={t(langKeys.confirmpassword) + " *"}
                                            margin="normal"
                                            size="small"
                                            type={showPassword ? "text" : "password"}
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
                                    rules={{
                                        validate: (value) => {
                                            if (value.length === 0) {
                                                return `${t(langKeys.field_required)}`;
                                            } else if (value !== getValues("loginpassword")) {
                                                return `${t(langKeys.passwordsmustbeequal)}`;
                                            }
                                        },
                                    }}
                                />
                                <div style={{ fontSize: "11px", color: "#b6b4ba" }}>
                                    {t(langKeys.signupfirststepasscond)}
                                </div>
                                <div style={{ display: "flex" }}>
                                    <OnlyCheckbox
                                        label=""
                                        valueDefault={acceptTOS}
                                        onChange={(value) => {
                                            setAcceptTOS(value);
                                        }}
                                    />
                                    <div style={{ padding: "10px 5px", fontWeight: "bold", fontSize: "14px" }}>
                                        {t(langKeys.tos1)}
                                        <a
                                            style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }}
                                            onMouseDown={openTermsOfService}
                                            rel="noopener noreferrer"
                                        >
                                            {t(langKeys.termsofservicetitle)}
                                        </a>
                                        {t(langKeys.tos2)}
                                        <a
                                            style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }}
                                            onMouseDown={openPrivacyPolicy}
                                            rel="noopener noreferrer"
                                        >
                                            {t(langKeys.privacypoliciestitle)}
                                        </a>
                                    </div>
                                </div>
                                <Button
                                    color="primary"
                                    disabled={disableButton}
                                    fullWidth
                                    style={{ height: '2.5rem', }}
                                    variant="contained"
                                    type="submit"
                                    onClick={async () => {
                                        const valid = await trigger();
                                        if (valid) {
                                            handleSubmit();
                                        }
                                    }}
                                >
                                    <Trans i18nKey={langKeys.continue} />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={classes.copyright}>
                        {'Copyright © '} Laraigo {new Date().getFullYear()}
                    </div>
                </Container>
            </div>
        </main>
    );
};

export default FirstStep;