import React, { FC, useState, useEffect, Fragment, useRef } from 'react'; // we need this to make JSX compile
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'hooks';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popus from 'components/layout/Popus';
import { useDispatch } from 'react-redux';
import { login } from 'store/login/actions';
import { getAccessToken, loadScripts, saveAuthorizationToken } from 'common/helpers';
import { useHistory, useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import FacebookLogin, { ReactFacebookFailureResponse } from 'react-facebook-login';
import FacebookIcon from '@material-ui/icons/Facebook';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { connectAgentUI } from 'store/inbox/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { apiUrls } from 'common/constants';
import { LaraigoLogo } from 'icons';
import { useForm } from 'react-hook-form';
import { FieldEdit, DialogZyx } from 'components';
import { recoverPassword } from 'store/subscription/actions';
import ReCAPTCHA from 'react-google-recaptcha';
import CloseIcon from '@material-ui/icons/Close';
import ReactFacebookLogin from 'react-facebook-login';
import { Helmet } from 'react-helmet';
import { notCustomUrl } from './dashboard/constants';
import { getCorpDetails } from 'store/corp/actions';
import { Dictionary } from '@types';
import SamlLogin from 'components/fields/SamlLogin';

const isIncremental = apiUrls.LOGIN_URL.includes("historical")
// Declara la nueva propiedad en el objeto `window`
const enableSaml = apiUrls.LOGIN_URL.includes("claroapi")
let isClaroEnviroment = apiUrls.LOGIN_URL.includes("claroapi")
const debugParam = new URLSearchParams(window.location.search).get('debug');
if (debugParam === "true") isClaroEnviroment = !isClaroEnviroment

export const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    containerLogin: {
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 20,
            paddingRight: 20,
            marginLeft: 16,
            marginRight: 16,
        },
        display: 'flex',
        alignItems: 'center',
        borderRadius: "3.75rem",
        backgroundColor: "white",
        paddingLeft: 36,
        paddingRight: 36,
        position: "relative",
        // maxHeight: '94vh',
        height: !isClaroEnviroment ? 653 : 'auto',
        maxWidth: 420
    },
    w100p: {
        width: "100%",
        padding: '0 2rem'
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
    container: {
        background: "linear-gradient(90deg, #0C0931 0%, #1D1856 50%, #C200DB 100%)", height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    progress: {
        margin: theme.spacing(2, 'auto', 3),
        display: 'block'
    },
    alert: {
        display: 'inline-flex',
        width: '100%'
    },
    alertheader: {
        width: '70%',
        marginTop: theme.spacing(1),
        position: "absolute",
        top: 44,
        left: 40,
        zIndex: 3
    },
    childContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    buttonGoogle: {
        '& button': {
            width: '100%',
            justifyContent: 'center',
        }
    },
    paswordCondition: {
        textAlign: 'center'
    },
    badge: {
        paddingRight: "0.6em",
        paddingLeft: "0.6em",
        borderRadius: "10rem",
        display: "inline-block",
        padding: "0.25em 0.4em",
        fontSize: "75%",
        fontWeight: "bold",
        lineHeight: "1",
        textAlign: "center",
        whiteSpace: "nowrap",
        verticalAlign: "baseline",
        marginLeft: "10px"
    },
    badgeSuccess: {
        color: "#fff",
        backgroundColor: "#28a745",
    },
    badgeFailure: {
        color: "#fff",
        backgroundColor: "#fb5f5f",
    },
    borderGoogle: {
        border: '1px solid #757575!important',
    },
    button: {
        borderRadius: '3px!important',
        display: 'flex!important',
        alignItems: 'center!important',
        fontSize: '14px!important',
        fontStyle: 'normal!important',
        fontWeight: 600,
        textTransform: 'none',
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
    image: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "1.8rem",
        marginBottom: "1.8rem",
    },
    chip: {
        '& .MuiChip-deleteIcon': {
            display: 'none',
            marginRight: '1rem',
            cursor:'pointer'
        },
    },
}));

const opentermsofservice = () => {
    window.open("/termsofservice", '_blank');
}

const openprivacypolicies = () => {
    window.open("/privacy", '_blank');
}

export function Copyright() {
    const { t } = useTranslation();
    return (
        <Fragment>
            <Typography variant="body2" color="textPrimary" align="center">
                {'Copyright © '} Laraigo {new Date().getFullYear()}
            </Typography>
            <Typography variant="body2" color="textPrimary" align="center">
                <a
                    rel="noopener noreferrer"
                    style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }}
                    onClick={opentermsofservice}
                >
                    {t(langKeys.termsofservicetitle)}
                </a>
            </Typography>
            <Typography variant="body2" color="textPrimary" align="center">
                <a
                    rel="noopener noreferrer"
                    style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer" }}
                    onClick={openprivacypolicies}
                >
                    {t(langKeys.privacypoliciestitle)}
                </a>
            </Typography>
        </Fragment>
    );
}


type IAuth = {
    username: string,
    password: string
}
interface AuthResponse extends ReactFacebookLogin, ReactFacebookFailureResponse, GoogleLoginResponse, GoogleLoginResponseOffline {
    code: string;
    id: string;
    error: string;
}

type ISamlAuthResponse = {
    code: string;
    error: string;
}



const SignIn = () => {
    const { t } = useTranslation();
    
    const dispatch = useDispatch();
    const isCustomDomain = !notCustomUrl.some(url => window.location.href.includes(url));

    const classes = useStyles();
    const history = useHistory();
    const resLogin = useSelector(state => state.login.login);
    const [showError, setshowError] = useState(false);
    const [dataAuth, setDataAuth] = useState<IAuth>({ username: '', password: '' });
    const [openModal, setOpenModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [customLogoUrl, setCustomLogoURL] = useState<Dictionary | null>(null)
    const [waitingGetDomain, setWaitingGetDomain] = useState(true);
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const customDomainData = useSelector(state => state.corporation.mainData);
    const firstLoad = React.useRef(true);

    const [tab, settab] = useState({
        title: "",
        icon: "favicon-transparent.ico"
    })

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    React.useEffect(() => {
        if (isCustomDomain) {
            const currentUrl = window.location.href
            const customDomain = currentUrl.replace('https://', '').replace('http://', '').split('.')[0]
            // dispatch(showBackdrop(true))
            dispatch(getCorpDetails(customDomain))
            setWaitingGetDomain(true)
        } else {
            setWaitingGetDomain(false);
            settab({
                title: "Laraigo",
                icon: "/favicon.ico"
            })
        }
    }, [])

    React.useEffect(() => {
        if (!firstLoad.current) {
            if (waitingGetDomain) {
                if (!customDomainData.loading && !customDomainData.error) {
                    setCustomLogoURL(customDomainData?.data?.[0] || null)
                    settab({
                        title: customDomainData?.data?.[0]?.corpdesc || "Laraigo",
                        icon: customDomainData?.data?.[0]?.iconurl || "/favicon.ico"
                    })
                    setWaitingGetDomain(false)
                    dispatch(showBackdrop(false))
                } else if (customDomainData.error) {
                    settab({
                        title: "Laraigo",
                        icon: "/favicon.ico"
                    })
                }
            }
        } else {
            firstLoad.current = false
        }
    }, [customDomainData, waitingGetDomain])



    const handleSignUp = () => {
        if (apiUrls.USELARAIGO) {
            window.open("https://laraigo.com/en/#pricetable", "_blank");
        }
        else {
            window.open("sign-up/BASICO", "_blank");
        }
    }

    const handleRecover = () => {
        setOpenModal(true);
    }

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const onSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = await recaptchaRef?.current?.executeAsync();
        setshowError(true);
        dispatch(login(dataAuth.username, dataAuth.password, "", "", token));
    }

    const onAuthWithFacebook = async (r: AuthResponse) => {
        if (r && r.id) {
            setshowError(true);
            const token = await recaptchaRef?.current?.executeAsync();
            dispatch(login(null, null, r.id, null, token));
        }
    }

    const onGoogleLoginSucess = async (r: AuthResponse | GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ((r as AuthResponse)?.googleId) {
            setshowError(true);
            const token = await recaptchaRef?.current?.executeAsync();
            dispatch(login(null, null, null, (r as AuthResponse).googleId, token));
        }
    }

    const onGoogleLoginFailure = (event: AuthResponse) => {
        console.warn('GOOGLE LOGIN FAILURE: ' + JSON.stringify(event));
        if (event?.error) {
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

    const onModalSuccess = () => {
        setOpenModal(false);
    }
    const consultHistoricalData = () => {
        if (isIncremental) {
            if (window.location.hostname === 'incremental-claro.laraigo.com') {
                window.open("https://claro.laraigo.com/sign-in", '_blank');
            } else {
                window.open("https://app.laraigo.com/sign-in", '_blank');
            }
        } else if (window.location.hostname === 'claro.laraigo.com') {
            window.open("https://incremental-claro.laraigo.com/sign-in", '_blank');
        } else {
            window.open("https://incremental-prod.laraigo.com/sign-in", '_blank');
        }
    }

    useEffect(() => {
        if (getAccessToken()) {
            history.push('/');
        } else {
            const externalToken = new URLSearchParams(window.location.search).get('accesstoken')
            if (externalToken && isIncremental) {
                saveAuthorizationToken(externalToken)
                history.push('/');
            } else {
                localStorage.removeItem("firstLoad")
                localStorage.removeItem("firstloadeddialog")
            }
        }
        const scriptsToLoad = ["recaptcha", "google"];
        // if (apiUrls.LOGIN_URL.includes("https://apiprd.laraigo.com")) {
        scriptsToLoad.push("clarity");
        // }
        const { scriptRecaptcha, scriptPlatform, clarityScript } = loadScripts(scriptsToLoad);
        return () => {
            scriptRecaptcha && document.body.removeChild(scriptRecaptcha);
            scriptPlatform && document.body.removeChild(scriptPlatform);
            if (clarityScript?.parentNode) {
                clarityScript.parentNode.removeChild(clarityScript);
            }
        };
    }, [])

    useEffect(() => {
        if (!resLogin.error && resLogin.user && getAccessToken()) {
            dispatch(connectAgentUI(resLogin.user.automaticConnection ?? false))
            localStorage.setItem("firstLoad", "1") //para saber si lanzar el automatic connection cuando el get user haya terminado
            localStorage.setItem("title", "")
            localStorage.setItem("headeicon", "")
            window.open(resLogin.user.redirect ? resLogin.user.redirect : "/supervisor", "_self");
        }
    }, [resLogin]);

    const onSamlLoginSuccess = async (data: ISamlAuthResponse) => {
        if (data && data.code) {
            setshowError(true);
            const token = await recaptchaRef?.current?.executeAsync();
            dispatch(login(null, null, null, null, token, data.code));
        }
    }

    const onSamlLoginError = (data: ISamlAuthResponse) => {
        dispatch(showSnackbar({
            message: data.error,
            show: true,
            severity: "error"
        }));
    }

    return (
        <>
            <Helmet>
                <meta name="google-signin-client_id" content={`${apiUrls.GOOGLECLIENTID_LOGIN}`} />
                <title>{tab.title}</title>
                <link rel="icon" href={tab.icon} />
            </Helmet>
            <main>
                <div className={classes.container}>
                    <Container component="main" className={classes.containerLogin}>
                        <div className={classes.childContainer} style={{ height: '100%' }}>
                            {waitingGetDomain && (
                                <div className={classes.image} style={{ minHeight: 43, height: 43 }}>...</div>
                            )}
                            {(!waitingGetDomain && customLogoUrl?.startlogourl) && (
                                <div className={classes.image}>
                                    <img src={customLogoUrl.startlogourl} height={42.8} alt="Custom Logo" />
                                </div>
                            )}
                            {(!waitingGetDomain && !customLogoUrl?.startlogourl) && (
                                <div className={classes.image}>
                                    <LaraigoLogo height={42.8} />
                                </div>
                            )}

                            <div className={classes.paper} style={{ flex: 1 }}>
                                {(resLogin.error && showError) && (
                                    <Alert className={classes.alertheader} variant="filled" severity="error" >
                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                            {t(resLogin.code || "error_unexpected_error")}
                                            <CloseIcon
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setshowError(false)}
                                            />
                                        </div>
                                    </Alert>
                                )}
                                <div className={isClaroEnviroment ? classes.w100p : ""}>
                                    <form
                                        className={classes.form}
                                        onSubmit={onSubmitLogin}
                                        style={{ margin: 0, maxWidth: "21.125rem" }}
                                    >
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey="6LeOA44nAAAAAMsIQ5QyEg-gx6_4CUP3lekPbT0n"
                                            size="invisible" // Set reCAPTCHA size to invisible
                                        />
                                        {!isClaroEnviroment ? (
                                            <>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                    style={{ margin: 0 }}
                                                    required
                                                    error={showError && resLogin.error}
                                                    value={dataAuth.username}
                                                    onChange={e => setDataAuth(p => ({ ...p, username: e.target.value.trim() }))}
                                                    label={t(langKeys.username)}
                                                    name="usr"
                                                />
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    fullWidth
                                                    required
                                                    style={{ marginBottom: "1.12rem" }}
                                                    error={showError && resLogin.error}
                                                    label={t(langKeys.password)}
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    autoComplete="current-password"
                                                    value={dataAuth.password}
                                                    onChange={e => setDataAuth(p => ({ ...p, password: e.target.value.trim() }))}
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
                                                {!resLogin.loading ?
                                                    <div style={{ alignItems: 'center', display: 'flex', flexDirection: "column", gap: "1rem", width: "100%", marginBottom: "1.02rem" }}>
                                                        <Button
                                                            type="submit"
                                                            fullWidth
                                                            variant="contained"
                                                            color="primary"
                                                            style={{ height: '2.5rem', }}
                                                        >
                                                            <Trans i18nKey={langKeys.logIn} />
                                                        </Button>
                                                        <FacebookLogin
                                                            appId={`${apiUrls.FACEBOOKAPP}`}
                                                            autoLoad={false}
                                                            buttonStyle={{ border: '1px solid #4D6BB7' }}
                                                            callback={onAuthWithFacebook}
                                                            containerStyle={{ width: "100%" }}
                                                            cssClass={classes.button}
                                                            disableMobileRedirect={true}
                                                            fields="name,email,picture"
                                                            icon={<FacebookIcon style={{ color: 'blue', marginRight: '8px' }} />}
                                                            isDisabled={false}
                                                            textButton={t(langKeys.login_with_facebook)}
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
                                                            accessType='online'
                                                            autoLoad={false}
                                                            buttonText={t(langKeys.login_with_google)}
                                                            className={`${classes.button} ${classes.borderGoogle}`}
                                                            clientId={`${apiUrls.GOOGLECLIENTID_LOGIN}`}
                                                            cookiePolicy={'single_host_origin'}
                                                            onFailure={onGoogleLoginFailure}
                                                            onSuccess={onGoogleLoginSucess}
                                                        />
                                                        {enableSaml && (
                                                            <SamlLogin
                                                                buttonText={t(langKeys.login_with_isam)}
                                                                onFailure={onSamlLoginError}
                                                                onSuccess={onSamlLoginSuccess}
                                                            />
                                                        )}
                                                        <Button
                                                            variant="outlined"
                                                            fullWidth
                                                            style={{ height: '2.5rem', }}
                                                            color="primary"
                                                            onClick={consultHistoricalData}
                                                        >
                                                            {t(isIncremental ? langKeys.gotolaraigo : langKeys.consulthistoricaldata)}
                                                        </Button>
                                                    </div> :
                                                    <CircularProgress className={classes.progress} />
                                                }
                                            </>
                                        ) :
                                            <SamlLogin
                                                buttonText={t(langKeys.login_with_isam)}
                                                onFailure={onSamlLoginError}
                                                onSuccess={onSamlLoginSuccess}
                                            />
                                        }
                                        <Grid container style={{ padding: isClaroEnviroment ? '1rem 0' : '' }}>
                                            <Grid item>
                                                {!isClaroEnviroment && (
                                                    <>
                                                        <p style={{ marginTop: 0, marginBottom: 12 }}>
                                                            <Trans i18nKey={langKeys.newRegisterMessage} />
                                                            <span style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={handleSignUp}>{t(langKeys.newRegisterMessage2)}</span>
                                                        </p>
                                                        <p style={{ marginTop: 12, marginBottom: "0.44rem" }}>
                                                            <Trans i18nKey={langKeys.recoverpassword1} />
                                                            <span style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={handleRecover}>{t(langKeys.recoverpassword2)}</span>
                                                        </p>
                                                    </>
                                                )}
                                                <Typography variant="body2" color="textPrimary">
                                                    <a
                                                        rel="noopener noreferrer"
                                                        style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer", textDecoration: "underline" }}
                                                        onClick={opentermsofservice}
                                                    >
                                                        {t(langKeys.termsofservicetitle)}
                                                    </a>
                                                </Typography>
                                                <Typography variant="body2" color="textPrimary" style={{ marginTop: 8, marginBottom: 16 }}>
                                                    <a
                                                        rel="noopener noreferrer"
                                                        style={{ fontWeight: "bold", color: "#6F1FA1", cursor: "pointer", textDecoration: "underline" }}
                                                        onClick={openprivacypolicies}
                                                    >
                                                        {t(langKeys.privacypoliciestitle)}
                                                    </a>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {(!isCustomDomain || customLogoUrl?.ispoweredbylaraigo) && <div className={classes.copyright}>
                            {'Copyright © '} Laraigo {new Date().getFullYear()}
                        </div>}
                    </Container>
                </div>
                <Popus />
                <RecoverModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    onTrigger={onModalSuccess}
                />
            </main>
        </>
    )
}

const RecoverModal: FC<{ openModal: boolean, setOpenModal: (param: boolean) => void, onTrigger: () => void }> = ({ openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const recoverResult = useSelector(state => state.subscription.requestRecoverPassword);
    const [waitSave, setWaitSave] = useState(false);
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            username: ''
        }
    });

    React.useEffect(() => {
        register('username', { validate: (value) => (value && value.length > 0) || t(langKeys.field_required) });
    }, [register]);


    useEffect(() => {
        if (waitSave) {
            if (!recoverResult.loading && !recoverResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(recoverResult.msg || "success") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
                onTrigger();
            }
            else if (recoverResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(recoverResult.msg || "error_unexpected_db_error") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [recoverResult, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(recoverPassword(data));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.recoverpasswordconfirmation),
            callback
        }))
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.recoverpasswordtitle)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.recoverpasswordbutton)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <FieldEdit
                label={t(langKeys.billingusername)}
                valueDefault={getValues('username')}
                error={errors?.username?.message}
                onChange={(value) => setValue('username', value)}
                className="col-12"
            />
        </DialogZyx>
    )
}

export default SignIn;