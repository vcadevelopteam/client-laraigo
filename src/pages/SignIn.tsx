/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect, Fragment } from 'react'; // we need this to make JSX compile
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
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
import { getAccessToken } from 'common/helpers';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import FacebookLogin from 'react-facebook-login';
import FacebookIcon from '@material-ui/icons/Facebook';
import GoogleLogin from 'react-google-login';
import { connectAgentUI } from 'store/inbox/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { useLocation } from "react-router-dom";
import { apiUrls } from 'common/constants';
import { LaraigoLogo } from 'icons';
import { useForm } from 'react-hook-form';
import { FieldEdit, DialogZyx } from 'components';
import { recoverPassword } from 'store/subscription/actions';
const isIncremental = apiUrls.LOGIN_URL.includes("historical")

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
        height: '100vh',
        display: 'flex',
        alignItems: 'center'
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
        display: 'inline-flex',
        width: '100%',
        marginTop: theme.spacing(1),
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

const SignIn = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const resLogin = useSelector(state => state.login.login);

    const [dataAuth, setDataAuth] = useState<IAuth>({ username: '', password: '' });
    const [openModal, setOpenModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleSignUp = () => {
        if (apiUrls.USELARAIGO) {
            window.open("https://laraigo.com/en/#pricetable", "_blank");
        }
        else {
            window.open("sign-up/BASIC", "_blank");
        }
    }

    const handleRecover = () => {
        setOpenModal(true);
    }

    const handleMouseDownPassword = (event: any) => event.preventDefault();

    const onSubmitLogin = (e: any) => {
        e.preventDefault();
        dispatch(login(dataAuth.username, dataAuth.password));
    }

    const onAuthWithFacebook = (r: any) => {
        if (r && r.id) {
            dispatch(login(null, null, r.id));
        }
    }

    const onGoogleLoginSucess = (r: any) => {
        if (r && r.googleId) {
            dispatch(login(null, null, null, r.googleId));
        }
    }

    const onGoogleLoginFailure = (event: any) => {
        console.warn('GOOGLE LOGIN FAILURE: ' + JSON.stringify(event));
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

    const onModalSuccess = () => {
        setOpenModal(false);
    }
    const consultHistoricalData = () => {
        if (isIncremental) {
            if (window.location.hostname === 'incremental-claro.laraigo') {
                window.open("https://claro.laraigo.com/sign-in", '_blank');
            } else {
                window.open("https://app.laraigo.com/sign-in", '_blank');
            }
        } else {
            if (window.location.hostname === 'claro.laraigo.com') {
                window.open("https://incremental-claro.laraigo.com/sign-in", '_blank');
            } else {
                window.open("https://incremental-prod.laraigo.com/sign-in", '_blank');
            }
        }
    }

    useEffect(() => {
        const ff = location.state || {} as any;
        if (!!ff?.showSnackbar) {
            dispatch(showSnackbar({ show: true, severity: "success", message: ff?.message || "" }))
        }
    }, [location]);

    useEffect(() => {
        if (getAccessToken()) {
            history.push('/');
        } else {
            localStorage.removeItem("firstLoad")
        }
    }, [])

    useEffect(() => {
        if (!resLogin.error && resLogin.user && getAccessToken()) {
            dispatch(connectAgentUI(resLogin.user.automaticConnection!!))
            localStorage.setItem("firstLoad", "1") //para saber si lanzar el automatic connection cuando el get user haya terminado
            window.open(resLogin.user.redirect ? resLogin.user.redirect : "/supervisor", "_self");
        }
    }, [resLogin]);

    return (
        <>
            <meta name="google-signin-client_id" content={apiUrls.GOOGLECLIENTID_LOGIN} />
            <script src="https://apis.google.com/js/platform.js" async defer></script>
            <Container component="main" maxWidth="xs" className={classes.containerLogin}>
                <div className={classes.childContainer}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <LaraigoLogo style={{ height: 200 }} />
                    </div>
                    <div className={classes.paper}>
                        <RecoverModal
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            onTrigger={onModalSuccess}
                        />
                        {resLogin.error && (
                            <Alert className={classes.alertheader} variant="filled" severity="error">
                                {t(resLogin.code || "error_unexpected_error")}
                            </Alert>
                        )}
                        <form
                            className={classes.form}
                            onSubmit={onSubmitLogin}
                        >
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
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
                                <div style={{ alignItems: 'center' }}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}>
                                        <Trans i18nKey={langKeys.logIn} />
                                    </Button>
                                    <FacebookLogin
                                        appId={apiUrls.FACEBOOKAPP}
                                        callback={onAuthWithFacebook}
                                        buttonStyle={{ borderRadius: '3px', height: '48px', display: 'flex', alignItems: 'center', 'fontSize': '14px', fontStyle: 'normal', fontWeight: 600, textTransform: 'none', justifyContent: 'center', width: '100%', marginBottom: '16px' }}
                                        textButton={t(langKeys.login_with_facebook)}
                                        icon={<FacebookIcon style={{ color: 'white', marginRight: '8px' }} />}
                                        disableMobileRedirect={true}
                                    />
                                    <div className={classes.buttonGoogle}>
                                        <GoogleLogin
                                            clientId={apiUrls.GOOGLECLIENTID_LOGIN}
                                            buttonText={t(langKeys.login_with_google)}
                                            style={{ justifyContent: 'center', width: '100%' }}
                                            onSuccess={onGoogleLoginSucess}
                                            onFailure={onGoogleLoginFailure}
                                            cookiePolicy={'single_host_origin'}
                                            accessType='online'
                                            autoLoad={false}
                                        />
                                    </div>
                                    <div className={classes.buttonGoogle} style={{ marginTop: 16 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={consultHistoricalData}
                                        >
                                            {t(isIncremental ? langKeys.gotolaraigo : langKeys.consulthistoricaldata)}
                                        </Button>
                                    </div>
                                </div> :
                                <CircularProgress className={classes.progress} />
                            }
                            <Grid container>
                                <Grid item>
                                    <p>
                                        <Trans i18nKey={langKeys.newRegisterMessage} />
                                        <span style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={handleSignUp}>{t(langKeys.newRegisterMessage2)}</span>
                                    </p>
                                    <p>
                                        <Trans i18nKey={langKeys.recoverpassword1} />
                                        <span style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={handleRecover}>{t(langKeys.recoverpassword2)}</span>
                                    </p>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                </div>
                <Popus />
            </Container>
        </>
    )
}

const RecoverModal: FC<{ openModal: boolean, setOpenModal: (param: any) => void, onTrigger: () => void }> = ({ openModal, setOpenModal, onTrigger }) => {
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
        register('username', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
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