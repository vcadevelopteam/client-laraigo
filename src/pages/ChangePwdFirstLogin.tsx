import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { langKeys } from 'lang/keys';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { execute, getCollection, resetAllMain, resetExecute } from 'store/main/actions';
import { Copyright, useStyles as useLoginStyles } from './SignIn';
import { useHistory } from 'react-router';
import { changePasswordOnFirstLoginIns, getSecurityRules, validateDomainCharacters, validateDomainCharactersSpecials, validateNumbersEqualsConsecutive } from 'common/helpers';
import { logout, setPwdFirsLogin } from 'store/login/actions';
import paths from 'common/constants/paths';
import { Trans, useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { showSnackbar } from 'store/popus/actions';

const ChangePwdFirstLogin: FC = () => {
    const classes = useLoginStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [repeatPasword, setRepeatPasword] = useState('');
    const [error, setError] = useState(false);
    const [waiLoading, setWaiLoading] = useState(false);

    const resValidateToken = useSelector(state => state.login.validateToken);
    const ignorePwdchangefirstloginValidation = useSelector(state => state.login.ignorePwdchangefirstloginValidation);
    const changePwd = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main.mainData);
    const securityRules = mainResult?.data?.[0]
    const [passwordConditions, setpasswordConditions] = useState({
        samepassword: true,
        mincharacters: ("").length >= (securityRules?.mincharacterspwd||0),
        maxcharacters: ("").length <= (securityRules?.maxcharacterspwd||0),
        consecutivecharacters: validateNumbersEqualsConsecutive("",securityRules?.numequalconsecutivecharacterspwd||0),
        lowercaseletters: validateDomainCharacters("", 'a-z', securityRules?.lowercaseletterspwd||"04"),
        uppercaseletters: validateDomainCharacters("", 'A-Z', securityRules?.uppercaseletterspwd||"04"),
        numbers: validateDomainCharacters("", '1-9', securityRules?.numericalcharacterspwd||"04"),
        specialcharacters: validateDomainCharactersSpecials("", securityRules?.specialcharacterspwd||"04"),
    });

    const dataFieldSelect = [
        {name: "Empieza", value: "01"},
        {name: "Incluye", value: "02"},
        {name: "Más de 1", value: "03"},
        {name: "No Considera", value: "04"},
        {name: "Termina", value: "05"},
    ]    
    const fetchData = () => dispatch(getCollection(getSecurityRules()));

    useEffect(() => {
        setWaiLoading(true)
        fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);
    
    useEffect(() => {
        if (waiLoading) {
            if (!mainResult.loading && !mainResult.error) {
                setpasswordConditions({...passwordConditions,
                    samepassword: true,
                    mincharacters: "".length >= (securityRules?.mincharacterspwd||0),
                    maxcharacters: "".length <= (securityRules?.maxcharacterspwd||0),
                    consecutivecharacters: validateNumbersEqualsConsecutive("",securityRules?.numequalconsecutivecharacterspwd||0),
                    lowercaseletters: validateDomainCharacters("", 'a-z', securityRules?.lowercaseletterspwd||"04"),
                    uppercaseletters: validateDomainCharacters("", 'A-Z', securityRules?.uppercaseletterspwd||"04"),
                    numbers: validateDomainCharacters("", '1-9', securityRules?.numericalcharacterspwd||"04"),
                    specialcharacters: validateDomainCharactersSpecials("", securityRules?.specialcharacterspwd||"04"),
                })
                setWaiLoading(false)
            } 
        }
    }, [mainResult, waiLoading])

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
        
        if(!!Object.values(passwordConditions).reduce((acc,x)=>acc*(+ x),1)){
            if (password !== repeatPasword) {
                setError(true);
                return;
            }

            setError(false);
            dispatch(execute({
                header: changePasswordOnFirstLoginIns(resValidateToken.user?.userid || 0, password),
                detail: [],
            }, true));
        }else{
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.invalid_password) }));
        }
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
                            onChange={e => {
                                setpasswordConditions({...passwordConditions,
                                    samepassword:repeatPasword===e.target.value,
                                    mincharacters: e.target.value.length >= (securityRules?.mincharacterspwd||0),
                                    maxcharacters: e.target.value.length <= (securityRules?.maxcharacterspwd||0),
                                    consecutivecharacters: validateNumbersEqualsConsecutive(e.target.value,securityRules?.numequalconsecutivecharacterspwd||0),
                                    lowercaseletters: validateDomainCharacters(e.target.value, 'a-z', securityRules?.lowercaseletterspwd||"04"),
                                    uppercaseletters: validateDomainCharacters(e.target.value, 'A-Z', securityRules?.uppercaseletterspwd||"04"),
                                    numbers: validateDomainCharacters(e.target.value, '1-9', securityRules?.numericalcharacterspwd||"04"),
                                    specialcharacters: validateDomainCharactersSpecials(e.target.value, securityRules?.specialcharacterspwd||"04"),
                                })
                                setPassword(e.target.value.trim())
                            }}
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
                            onChange={e => {                                
                                setpasswordConditions({...passwordConditions,samepassword:password===e.target.value})
                                setRepeatPasword(e.target.value.trim())
                            }}
                            error={error}
                            InputProps={{
                                readOnly: changePwd.loading,
                            }}
                        />
                        <div>
                            <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond1)}</span><span className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.samepassword,
                                [classes.badgeFailure]: !passwordConditions.samepassword,
                            })}>{passwordConditions.samepassword?t(langKeys.yes):t(langKeys.no)}</span></div>
                            {!!securityRules?.mincharacterspwd && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond2)}</span><span className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.mincharacters,
                                [classes.badgeFailure]: !passwordConditions.mincharacters,
                            })}>{securityRules?.mincharacterspwd}</span></div>}
                            {!!securityRules?.maxcharacterspwd && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond3)}</span><span className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.maxcharacters,
                                [classes.badgeFailure]: !passwordConditions.maxcharacters,
                            })}>{securityRules?.maxcharacterspwd}</span></div>}
                            {!!securityRules?.allowsconsecutivenumbers && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond4)}</span><span className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.consecutivecharacters,
                                [classes.badgeFailure]: !passwordConditions.consecutivecharacters,
                            })}>{securityRules?.numequalconsecutivecharacterspwd}</span></div>}
                            {(securityRules?.lowercaseletterspwd!=="04") && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond7)}</span><span className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.lowercaseletters,
                                [classes.badgeFailure]: !passwordConditions.lowercaseletters,
                            })}>{dataFieldSelect.filter((x:any)=>x.value===(securityRules?.lowercaseletterspwd||"04"))[0].name}</span></div>}
                            {(securityRules?.uppercaseletterspwd!=="04") && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond8)}</span><span className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.uppercaseletters,
                                [classes.badgeFailure]: !passwordConditions.uppercaseletters,
                            })}>{dataFieldSelect.filter((x:any)=>x.value===(securityRules?.uppercaseletterspwd||"04"))[0].name}</span></div>}
                            {(securityRules?.numericalcharacterspwd!=="04") && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond9)}</span><span className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.numbers,
                                [classes.badgeFailure]: !passwordConditions.numbers,
                            })}>{dataFieldSelect.filter((x:any)=>x.value===(securityRules?.numericalcharacterspwd||"04"))[0].name}</span></div>}
                            <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond5)}</span><span className={clsx(classes.badge, {
                                [classes.badgeSuccess]: passwordConditions.specialcharacters,
                                [classes.badgeFailure]: !passwordConditions.specialcharacters,
                            })}>{dataFieldSelect.filter((x:any)=>x.value===(securityRules?.specialcharacterspwd||"04"))[0].name}</span></div>
                            <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond6)}</span></div>
                        </div>
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
