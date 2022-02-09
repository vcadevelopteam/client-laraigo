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
import { Dictionary } from "@types";
import { useSelector } from 'hooks';
import { apiUrls } from 'common/constants';

import { executeCheckNewUser } from "store/signup/actions";
import { MainData, SubscriptionContext } from "./context";
import { showSnackbar } from "store/popus/actions";
import { useFormContext } from "react-hook-form";
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
    },
    buttonGoogle: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
            fontSize: '24px!important',
            justifyContent: 'center',
            width: 400,
            height: 50,
            color: '#FFF',
        }
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
    width: "400px",
    height: 50,
    display: 'flex',
    alignItems: 'center',
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: 400,
    textTransform: 'none',
    justifyContent: 'center',
    marginBottom: 16,
}

const FirstStep: FC = () => {
    const { setStep } = useContext(SubscriptionContext);
    const { register, setValue, getValues, formState: { errors } } = useFormContext<MainData>();
    const rescheckuser = useSelector(state => state.signup);
    const [waitSave, setwaitSave] = useState(false);
    const [disablebutton, setdisablebutton] = useState(true);

    useEffect(() => {
        register('password')
        register('email')
        register('confirmpassword')
        /*setdisablebutton(!
            (mainData.email !== "" &&
            mainData.email.includes('@') &&
            mainData.email.includes('.') &&
            mainData.password !== "" &&
            mainData.confirmpassword !== "" &&
            mainData.confirmpassword === mainData.password)
        )*/
    }, [register])

    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();
    const classes = useChannelAddStyles();

    useEffect(() => {
        if(waitSave){
            if (!rescheckuser.loading) {
                if (rescheckuser.isvalid) {
                    setStep(2)
                    setwaitSave(false)
                } else {
                    dispatch(showSnackbar({
                        show: true,
                        success: false,
                        message: t(langKeys.useralreadyregistered),
                    }))
                    setwaitSave(false)
                }
            }    
        }
    }, [rescheckuser])

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
            dispatch(executeCheckNewUser(content))
        }
    }

    const onGoogleLoginFailure = (r: any) => {
        if (r && r.error) {
            switch (r.error) {
                case 'idpiframe_initialization_failed':
                case 'popup_closed_by_user':
                    break;
                default:
                    alert(r.error);
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
            setValue('googleid', r.id);
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
            <meta name="google-signin-client_id" content="792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com" />
            <script src="https://apis.google.com/js/platform.js" async defer></script>
            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", marginBottom: 32 , marginTop: 15}}>{t(langKeys.signupstep1title)}</div>
            <div className={classes.buttonfacebook}>
                <FacebookLogin
                    appId={apiUrls.FACEBOOKAPP}
                    callback={onAuthWithFacebook}
                    fields="name,email,picture"
                    buttonStyle={FBButtonStyle2}
                    textButton={t(langKeys.signup_with_facebook)}
                    icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                    isDisabled={false}
                />
            </div>
            <div className={classes.buttonGoogle}>
                <GoogleLogin
                    clientId="792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com"
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
                <TextField
                    variant="outlined"
                    size="small"
                    margin="normal"
                    fullWidth
                    type="email"
                    label={t(langKeys.email)}
                    name="email"
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={(e) => {
                        setMainData((p: any) => ({ ...p, email: e.target.value }))
                        setErrors(p => ({ ...p, email: !e.target.value ? t(langKeys.field_required) : "" }))
                        setErrors(p => ({ ...p, email: e.target.value.includes('@') && e.target.value.includes('.') ? "" : t(langKeys.emailverification) }))
                    }}
                />
                <TextField
                    variant="outlined"
                    size="small"
                    margin="normal"
                    fullWidth
                    label={t(langKeys.password)}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password}
                    onChange={(e) => {
                        setMainData((p: any) => ({ ...p, password: e.target.value }))
                        setErrors(p => ({ ...p, password: !e.target.value ? t(langKeys.field_required) : "" }))
                        setErrors(p => ({ ...p, confirmpassword: !mainData.confirmpassword ? t(langKeys.field_required) : "" }))
                        setErrors(p => ({ ...p, confirmpassword: mainData.confirmpassword === e.target.value ? p.confirmpassword : t(langKeys.passwordsmustbeequal) }))
                    }}
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
                <TextField
                    variant="outlined"
                    size="small"
                    margin="normal"
                    fullWidth
                    label={t(langKeys.confirmpassword)}
                    name="confirmpassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={!!errors.confirmpassword}
                    helperText={errors.confirmpassword}
                    onChange={(e) => {
                        setMainData((p: any) => ({ ...p, confirmpassword: e.target.value }))
                        setErrors(p => ({ ...p, confirmpassword: !e.target.value ? t(langKeys.field_required) : "" }))
                        setErrors(p => ({ ...p, confirmpassword: mainData.password === e.target.value ? p.confirmpassword : t(langKeys.passwordsmustbeequal) }))
                    }}
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
                <div style={{ textAlign: "center", padding: "20px" }}>{t(langKeys.tos)}<a style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={openprivacypolicies} rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a></div>
                <Button
                    onClick={handlesubmit}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={disablebutton}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>

            </div>
        </>
    )
}

export default FirstStep