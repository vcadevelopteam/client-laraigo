import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { langKeys } from 'lang/keys';
import { Trans } from 'react-i18next';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { execute, resetExecute } from 'store/main/actions';
import { Copyright, useStyles as useLoginStyles } from './SignIn';
import { useHistory } from 'react-router';
import { changePasswordOnFirstLoginIns } from 'common/helpers';
import { logout, setPwdFirsLogin } from 'store/login/actions';
import paths from 'common/constants/paths';

const ChangePwdFirstLogin: FC = () => {
    const classes = useLoginStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [repeatPasword, setRepeatPasword] = useState('');
    const [error, setError] = useState(false);

    const resValidateToken = useSelector(state => state.login.validateToken);
    const ignorePwdchangefirstloginValidation = useSelector(state => state.login.ignorePwdchangefirstloginValidation);
    const changePwd = useSelector(state => state.main.execute);

    useEffect(() => {
        return () => {
            dispatch(resetExecute());
        };
    }, [dispatch]);
    
    useEffect(() => {
        const pwdchangefirstlogin = resValidateToken.user?.pwdchangefirstlogin;
        if (!ignorePwdchangefirstloginValidation && pwdchangefirstlogin === true) {
            return;
        } else if (pwdchangefirstlogin === false) {
            history.push('/');
        } else {
            dispatch(logout());
            history.push(paths.SIGNIN);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resValidateToken.user?.pwdchangefirstlogin, history, dispatch]);

    useEffect(() => {
        if (changePwd.loading || changePwd.error) return;
        if (changePwd.success) {
            dispatch(setPwdFirsLogin(false, true));
        }
    }, [changePwd, dispatch]);

    const onSubmit = useCallback(() => {
        if (password !== repeatPasword) {
            setError(true);
            return;
        }

        setError(false);
        dispatch(execute({
            header: changePasswordOnFirstLoginIns(resValidateToken.user?.userid || 0, password),
            detail: [],
        }, true));
    }, [resValidateToken.user?.userid, password, repeatPasword, dispatch]);

    return (
        <Container component="main" maxWidth="xs" className={classes.containerLogin}>
            <div className={classes.childContainer}>
                <img src="./Laraigo-vertical-logo-name.svg" style={{ height: 200 }} alt="logo" />
                <div className={classes.paper}>
                    {changePwd.error && (
                        <Alert className={classes.alertheader} variant="filled" severity="error">
                            <Trans i18nKey={changePwd.code || langKeys.error_unexpected_error} />
                        </Alert>
                    )}
                    {error && (
                        <Alert className={classes.alertheader} variant="filled" severity="error">
                            <Trans i18nKey={langKeys.passwordsMustBeEqual} />
                        </Alert>
                    )}
                    <form className={classes.form} onSubmit={e => {
                        e.preventDefault();
                        onSubmit();
                    }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label={<Trans i18nKey={langKeys.password} />}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value.trim())}
                            error={error}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                readOnly: changePwd.loading,
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label={<Trans i18nKey={langKeys.repeatPassword} />}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={repeatPasword}
                            onChange={e => setRepeatPasword(e.target.value.trim())}
                            error={error}
                            InputProps={{
                                readOnly: changePwd.loading,
                            }}
                        />
                        {!changePwd.loading ?
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                <Trans i18nKey={langKeys.changePassword} />
                            </Button> :
                            <CircularProgress className={classes.progress} />
                        }
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </div>
        </Container>
    );
}

export default ChangePwdFirstLogin;
