/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { CSSProperties, FC, useContext, useEffect, useState } from "react";
import { makeStyles, Button, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import FacebookLogin from 'react-facebook-login';
import { useDispatch } from "react-redux";
import GoogleLogin from 'react-google-login';
import { Facebook as FacebookIcon } from "@material-ui/icons";
import { useSelector } from 'hooks';
import { apiUrls } from 'common/constants';

import { executeCheckNewUser } from "store/signup/actions";
import { MainData, SubscriptionContext } from "./context";
import { showSnackbar } from "store/popus/actions";
import { Controller, useFormContext } from "react-hook-form";

function validatePassword(password: string) {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

    if (password) {
        return strongRegex.exec(password);
    }

    return null
}

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: "bold",
        fontSize: '40px',
        //textTransform: 'initial',
        width: "100%"
    },
    buttonfacebook: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        '& button': {
            fontSize: '20px!important',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 50,
            color: '#FFF',
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        },
    },
    separator: {
        width: 82,
        borderBottom: "2px solid #D1CBCB",
        marginLeft: 32,
        marginRight: 32,
        height: "0",
    },
    orSeparator: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        marginBottom: 18,
    },
}));

const FBButtonStyle2: CSSProperties = {
    borderRadius: '3px',
    width: "100%",
    height: 50,
    display: 'flex',
    alignItems: 'center',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 400,
    textTransform: 'none',
    justifyContent: 'center',
    marginBottom: 16,
    
}

const FirstStep: FC = () => {
    const { setStep,selectedChannels } = useContext(SubscriptionContext);
    const { control, setValue, getValues, trigger } = useFormContext<MainData>();
    const rescheckuser = useSelector(state => state.signup);
    const [waitSave, setwaitSave] = useState(false);

    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [disableButton, setDisableButton] = useState(true);
    const { t } = useTranslation();
    const classes = useChannelAddStyles();

    useEffect(() => {
        if (waitSave) {
            if (!rescheckuser.loading) {
                if (rescheckuser.isvalid) {
                    setStep(2)
                    setwaitSave(false)
                } else {
                    dispatch(showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(langKeys.useralreadyregistered),
                    }))
                    setwaitSave(false)
                }
            }
        }
    }, [rescheckuser])
    useEffect(() => {
        setDisableButton(selectedChannels<1);
    }, [selectedChannels])
    
    const openprivacypolicies = () => {
        window.open("/privacy", '_blank');
    }

    const onGoogleLoginSucess = (r: any) => {
        if (r && r.googleId) {
            const content = {
                "method": "UFN_USERIDBYUSER",
                "parameters": {
                    "usr": null,
                    "facebookid": null,
                    "googleid": String(r.googleId)
                }
            }
            setwaitSave(true)
            setValue('password', '');
            setValue('confirmpassword', '');
            setValue('email', '');
            setValue('googleid', r.googleId);
            setValue('facebookid', '');
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
                    "usr": r.email,
                    "facebookid": String(r.id),
                    "googleid": null
                }
            }
            setwaitSave(true)
            setValue('password', '');
            setValue('confirmpassword', '');
            setValue('email', '');
            setValue('googleid', '');
            setValue('facebookid', r.id);
            dispatch(executeCheckNewUser(content))
        }
    }

    function handlesubmit() {
        const content = {
            "method": "UFN_USERIDBYUSER",
            "parameters": {
                "usr": getValues('email'),
                "facebookid": null,
                "googleid": null
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
                    callback={onAuthWithFacebook}
                    fields="name,email,picture"
                    buttonStyle={FBButtonStyle2}
                    textButton={t(langKeys.signup_with_facebook)}
                    icon={<FacebookIcon style={{ color: 'white', marginRight: '8px'}} />}
                    isDisabled={false}
                    disableMobileRedirect={true}
                />
            </div>
            <div className={classes.buttonGoogle}>
                <GoogleLogin
                    clientId={apiUrls.GOOGLECLIENTID_LOGIN}
                    buttonText={t(langKeys.signupgooglebutton)}
                    style={{ borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onSuccess={onGoogleLoginSucess}
                    onFailure={onGoogleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                    accessType='online'
                    
                    autoLoad={false}
                />
            </div>

            <div className={classes.orSeparator}>
                <div className={classes.separator} />
                <div style={{ fontSize: 24, fontWeight: 500, color: "#989898" }}>
                    <Trans i18nKey={langKeys.signupor} />
                </div>
                <div className={classes.separator} />
            </div>

            <div>
                <Controller
                    name="email"
                    control={control}
                    rules={{ validate: (value) => {
                        if (value.length === 0) {
                            return t(langKeys.field_required) as string;
                        } else if (!/\S+@\S+\.\S+/.test(value)) {
                            return t(langKeys.emailverification) as string;
                        }
                    }}}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            size="small"
                            margin="normal"
                            fullWidth
                            type="email"
                            label={t(langKeys.email)}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    rules={{ validate: (value) => {
                        if (value.length === 0) {
                            return t(langKeys.field_required) as string;
                        } else {
                            if (validatePassword(value) === null) {
                                return t(langKeys.password_strongvalidation) as string;
                            }

                            if (value !== getValues('confirmpassword')) {
                                return t(langKeys.passwordsmustbeequal) as string;
                            }
                        }
                    }}}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            size="small"
                            margin="normal"
                            fullWidth
                            label={t(langKeys.password)}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
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
                    name="confirmpassword"
                    control={control}
                    rules={{ validate: (value) => {
                        if (value.length === 0) {
                            return t(langKeys.field_required) as string;
                        } else if (value !== getValues('confirmpassword')) {
                            return t(langKeys.passwordsmustbeequal) as string;
                        }
                    }}}
                    render={({ field, formState: { errors }}) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            size="small"
                            margin="normal"
                            fullWidth
                            label={t(langKeys.confirmpassword)}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                <div style={{ textAlign: "center", padding: "20px" }}>{t(langKeys.tos)}<a style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={openprivacypolicies} rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>
                <div style={{ textAlign: "center", padding: "20px" }}>{t(langKeys.tossub1)} <a href="#" style={{ fontWeight: 'bold', color: '#6F1FA1'}} rel="noopener noreferrer">{t(langKeys.creditcard)}</a> {t(langKeys.tossub2)}</div>
                <Button
                    onClick={async () => {
                        const valid = await trigger();
                        if (valid) {
                            handlesubmit();
                        }
                    }}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={disableButton}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>

            </div>
        </>
    )
}

export default FirstStep