import { apiUrls } from "common/constants";
import { Button, CircularProgress, InputAdornment, IconButton, makeStyles, TextField } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";
import { executeCheckNewUser } from "store/signup/actions";
import { Facebook, Visibility, VisibilityOff } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { MainData, SubscriptionContext } from "./context";
import { showSnackbar } from "store/popus/actions";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";

import FacebookLogin from "react-facebook-login";
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import React, { CSSProperties, FC, MouseEvent, useContext, useEffect, useState } from "react";

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
        borderBottom: "2px solid #D1CBCB",
        height: "0",
        marginLeft: 32,
        marginRight: 32,
        width: 82,
    },
    orSeparator: {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        marginBottom: 18,
        marginTop: 28,
    },
}));

const FacebookCustomButtonStyle: CSSProperties = {
    alignItems: "center",
    borderRadius: "3px",
    display: "flex",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 400,
    height: 50,
    justifyContent: "center",
    marginBottom: 16,
    textTransform: "none",
    width: "100%",
};

const FirstStep: FC = () => {
    const { control, getValues, setValue, trigger } = useFormContext<MainData>();
    const { selectedChannels, setStep } = useContext(SubscriptionContext);
    const { t } = useTranslation();

    const [disableButton, setDisableButton] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const classes = useChannelAddStyles();
    const dispatch = useDispatch();
    const signUpState = useSelector((state) => state.signup);

    useEffect(() => {
        if (waitSave) {
            if (!signUpState.loading) {
                if (signUpState.isvalid) {
                    setStep(2);
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
        setDisableButton(selectedChannels < 1);
    }, [selectedChannels]);

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
        <>
            <meta name="google-signin-client_id" content={`${apiUrls.GOOGLECLIENTID_LOGIN}`} />
            <script src="https://apis.google.com/js/platform.js" async defer></script>
            <div>
                <div
                    style={{
                        textAlign: "center",
                        color: "#7721ad",
                        fontSize: 32,
                        fontWeight: 500,
                        marginBottom: 32,
                        marginTop: 15,
                    }}
                >
                    {t(langKeys.signupstep1title)}
                </div>
                {showLogin ? (
                    <div>
                        <div className={classes.buttonfacebook}>
                            <FacebookLogin
                                appId={`${apiUrls.FACEBOOKAPP}`}
                                autoLoad={false}
                                buttonStyle={FacebookCustomButtonStyle}
                                callback={onAuthWithFacebook}
                                disableMobileRedirect={true}
                                fields="name,email,picture"
                                icon={<Facebook style={{ color: "white", marginRight: "8px" }} />}
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
                        </div>
                        <div className={classes.buttonGoogle}>
                            <GoogleLogin
                                accessType="online"
                                autoLoad={false}
                                buttonText={t(langKeys.signupgooglebutton)}
                                clientId={`${apiUrls.GOOGLECLIENTID_LOGIN}`}
                                cookiePolicy={"single_host_origin"}
                                onFailure={onGoogleLoginFailure}
                                onSuccess={onGoogleLoginSucess}
                                style={{
                                    borderRadius: "3px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <CircularProgress />
                )}
                <div className={classes.orSeparator}>
                    <div className={classes.separator} />
                    <div style={{ fontSize: 24, fontWeight: 500, color: "#989898" }}>
                        <Trans i18nKey={langKeys.signupor} />
                    </div>
                    <div className={classes.separator} />
                </div>
                <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                    <Controller
                        control={control}
                        name="loginusername"
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                error={Boolean(errors.loginusername)}
                                fullWidth
                                helperText={errors.loginusername?.message}
                                label={t(langKeys.email)}
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
                                label={t(langKeys.password)}
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
                                label={t(langKeys.confirmpassword)}
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
                    <div style={{ textAlign: "center", padding: "20px" }}>
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
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        {t(langKeys.tossub1)}{" "}
                        <a
                            href="#"
                            rel="noopener noreferrer"
                            style={{
                                fontWeight: "bold",
                                color: "#6F1FA1",
                                cursor: "default",
                                textDecorationLine: "none",
                            }}
                        >
                            {`${t(langKeys.creditcard)}`.toUpperCase()}
                        </a>{" "}
                        {t(langKeys.tossub2)}
                    </div>
                    <Button
                        className={classes.button}
                        color="primary"
                        disabled={disableButton}
                        variant="contained"
                        onClick={async () => {
                            const valid = await trigger();
                            if (valid) {
                                handleSubmit();
                            }
                        }}
                    >
                        <Trans i18nKey={langKeys.next} />
                    </Button>
                </div>
            </div>
        </>
    );
};

export default FirstStep;