/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from 'react'; // we need this to make JSX compile
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
import { showSnackbar } from 'store/popus/actions';
import { useLocation } from "react-router-dom";
import { apiUrls } from 'common/constants';
import paths from 'common/constants/paths';

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
    },
    buttonGoogle: {
        '& button': {
            width: '100%',
            justifyContent: 'center',
        }
    }
}));

export function Copyright() {
    const { t } = useTranslation();
    return (
        <Fragment>
            <Typography variant="body2" color="textPrimary" align="center">
                {'Copyright © '} Laraigo {new Date().getFullYear()}
            </Typography>
            <Typography variant="body2" color="textPrimary" align="center">
                <a href="https://app.laraigo.com/privacy" target="_blank" rel="noopener noreferrer">{t(langKeys.privacypoliciestitle)}</a>
            </Typography>
        </Fragment>
    );
}

type IAuth = {
    username: string,
    password: string
}

const SignIn = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const location = useLocation();

    const history = useHistory();

    const dispatch = useDispatch();
    const resLogin = useSelector(state => state.login.login);

    const [dataAuth, setDataAuth] = useState<IAuth>({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleSignUp = () => history.push(paths.SIGNUPBASIC);

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

    useEffect(() => {
        const ff = location.state || {} as any;
        if (!!ff?.showSnackbar) {
            dispatch(showSnackbar({ show: true, success: true, message: ff?.message || "" }))
        }
     }, [location]);

    useEffect(() => {
        

        if (getAccessToken()) {
            history.push('/');
        }
    }, [])

    useEffect(() => {
        if (!resLogin.error && resLogin.user && getAccessToken()) {
            dispatch(connectAgentUI(resLogin.user.automaticConnection!!))
            history.push(resLogin.user.redirect ? resLogin.user.redirect : "/supervisor");
        }
    }, [resLogin]);

    return (
        <Container component="main" maxWidth="xs" className={classes.containerLogin}>
            <div className={classes.childContainer}>
                <img src="./Laraigo-vertical-logo-name.svg" style={{ height: 200 }} alt="logo" />
                <div className={classes.paper}>
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
                            value={dataAuth.username}
                            onChange={e => setDataAuth(p => ({ ...p, username: e.target.value.trim() }))}
                            label={t(langKeys.username)}
                            name="usr"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
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
                                />
                                <div className={classes.buttonGoogle}>
                                    <GoogleLogin
                                        clientId="792367159924-f7uvieuu5bq7m7mvnik2a7t5mnepekel.apps.googleusercontent.com"
                                        buttonText={t(langKeys.login_with_google)}
                                        style={{ justifyContent: 'center', width: '100%' }}
                                        onSuccess={onGoogleLoginSucess}
                                        onFailure={onGoogleLoginFailure}
                                        cookiePolicy={'single_host_origin'}
                                    />
                                </div>
                            </div> :
                            <CircularProgress className={classes.progress} />
                        }
                        <Grid container>
                            <Grid item>
                                <p>
                                    <Trans i18nKey={langKeys.newRegisterMessage} />
                                    <a style={{ fontWeight: 'bold', color: '#6F1FA1', cursor: 'pointer' }} onClick={handleSignUp}>{t(langKeys.newRegisterMessage2)}</a>
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
        </Container>)
}

export default SignIn;