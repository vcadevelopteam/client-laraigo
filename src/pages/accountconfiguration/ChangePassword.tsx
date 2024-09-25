import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { IconButton, InputAdornment} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { FieldEdit } from 'components';
import { showSnackbar, manageConfirmation } from 'store/popus/actions';
import { updateUserInformation } from 'store/login/actions';
import { useForm } from 'react-hook-form';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { updateUserSettings } from 'store/setting/actions';
import clsx from 'clsx';
import { validateDomainCharacters, validateDomainCharactersSpecials, validateNumbersEqualsConsecutive } from 'common/helpers';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        marginRight: theme.spacing(2),
    },
    seccionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        paddingBottom: 10
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

interface DetailProps {
    setViewSelected: (view: string) => void;  
}

const ChangePassword: React.FC<DetailProps> = ({ setViewSelected }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [showOldPassword, setOldShowPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const user = useSelector(state => state.login.validateToken.user);
    const [waitsave, setwaitsave] = useState(false);
    const [passwordConditions, setpasswordConditions] = useState({
        samepassword: false,
        mincharacters: false,
        maxcharacters: false,
        consecutivecharacters: false,
        lowercaseletters: false,
        uppercaseletters: false,
        numbers: false,
        specialcharacters: false,
    });
    const dataFieldSelect = [
        { name: "Empieza", value: "01" },
        { name: "Incluye", value: "02" },
        { name: "Más de 1", value: "03" },
        { name: "No Considera", value: "04" },
        { name: "Termina", value: "05" },
    ]
    const resSetting = useSelector(state => state.setting.setting);
    const securityRules = useSelector(state => state.main.mainData);

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            oldpassword: '',
            password: '',
            confirmpassword: '',
            image: user?.image || null,
            lastname: user?.lastname,
            firstname: user?.firstname,
            operation: "SAVEINFORMATION" //"CHANGEPASSWORD"
        }
    });
    useEffect(() => {
        register('oldpassword', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('password', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('confirmpassword', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [])

    useEffect(() => {
        if (waitsave) {
            if (!resSetting.loading && !resSetting.error) {
                setwaitsave(false)
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_update) }));
                dispatch(updateUserInformation(getValues('firstname') + "", getValues('lastname') + "", getValues('image') + ""));
                setViewSelected("view-1")
            } else if (resSetting.error) {
                const errormessage = t(resSetting.code || "error_unexpected_error")
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setwaitsave(false);
            }
        }
    }, [resSetting])

    const onSubmit = handleSubmit((data) => {
        if (!!Object.values(passwordConditions).reduce((acc, x) => acc * (+ x), 1)) {
            const callback = () => {
                setwaitsave(true)
                dispatch(updateUserSettings(data))
            }
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_changepassword),
                callback
            }))
        } else {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.invalid_password) }));
        }
    });
   
    return <div style={{ width: "100%" }}>
        <form onSubmit={onSubmit}>         
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom:'2rem' }}>                
                <div className={classes.seccionTitle}>{t(langKeys.changePassword)}</div>
                <div style={{ display: 'flex', gap: '10px'}}>
                    <Button
                        disabled={resSetting.loading}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}>
                        {t(langKeys.save)}
                    </Button>
                </div>
            </div>
            
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.currentpassword)}
                    className="col-6"
                    valueDefault={getValues('oldpassword')}
                    type={showOldPassword ? 'text' : 'password'}
                    onChange={(value) => setValue('oldpassword', value)}
                    error={errors?.oldpassword?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setOldShowPassword(!showOldPassword)}
                                    edge="end"
                                >
                                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.newpassword)}
                    className="col-6"
                    valueDefault={getValues('password')}
                    type={showPassword ? 'text' : 'password'}
                    onChange={(value) => {
                        setpasswordConditions({
                            ...passwordConditions,
                            samepassword: getValues("confirmpassword") === value,
                            mincharacters: value.length >= (securityRules?.data?.[0]?.mincharacterspwd || 0),
                            maxcharacters: value.length <= (securityRules?.data?.[0]?.maxcharacterspwd || 0),
                            consecutivecharacters: validateNumbersEqualsConsecutive(value, securityRules?.data?.[0]?.numequalconsecutivecharacterspwd || securityRules?.data?.[0]?.maxcharacterspwd || 0),
                            lowercaseletters: validateDomainCharacters(value, 'a-z', securityRules?.data?.[0]?.lowercaseletterspwd || "04"),
                            uppercaseletters: validateDomainCharacters(value, 'A-Z', securityRules?.data?.[0]?.uppercaseletterspwd || "04"),
                            numbers: validateDomainCharacters(value, '1-9', securityRules?.data?.[0]?.numericalcharacterspwd || "04"),
                            specialcharacters: validateDomainCharactersSpecials(value, securityRules?.data?.[0]?.specialcharacterspwd || "04"),
                        })
                        setValue('password', value)
                    }}
                    error={errors?.password?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => { setShowPassword(!showPassword) }}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <FieldEdit
                    label={t(langKeys.confirmnewpassword)}
                    className="col-6"
                    valueDefault={getValues('confirmpassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    onChange={(value) => {
                        setpasswordConditions({ ...passwordConditions, samepassword: getValues("password") === value })
                        setValue('confirmpassword', value)
                    }}
                    error={errors?.confirmpassword?.message}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <div>
                <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond1)}</span><span className={clsx(classes.badge, {
                    [classes.badgeSuccess]: passwordConditions.samepassword,
                    [classes.badgeFailure]: !passwordConditions.samepassword,
                })}>{passwordConditions.samepassword ? t(langKeys.yes) : t(langKeys.no)}</span></div>
                {!!securityRules?.data?.[0]?.mincharacterspwd && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond2)}</span><span className={clsx(classes.badge, {
                    [classes.badgeSuccess]: passwordConditions.mincharacters,
                    [classes.badgeFailure]: !passwordConditions.mincharacters,
                })}>{securityRules?.data?.[0]?.mincharacterspwd}</span></div>}
                {!!securityRules?.data?.[0]?.maxcharacterspwd && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond3)}</span><span className={clsx(classes.badge, {
                    [classes.badgeSuccess]: passwordConditions.maxcharacters,
                    [classes.badgeFailure]: !passwordConditions.maxcharacters,
                })}>{securityRules?.data?.[0]?.maxcharacterspwd}</span></div>}
                {!!securityRules?.data?.[0]?.allowsconsecutivenumbers && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond4)}</span><span className={clsx(classes.badge, {
                    [classes.badgeSuccess]: passwordConditions.consecutivecharacters,
                    [classes.badgeFailure]: !passwordConditions.consecutivecharacters,
                })}>{securityRules?.data?.[0]?.numequalconsecutivecharacterspwd}</span></div>}
                {(securityRules?.data?.[0]?.lowercaseletterspwd !== "04") && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond7)}</span><span className={clsx(classes.badge, {
                    [classes.badgeSuccess]: passwordConditions.lowercaseletters,
                    [classes.badgeFailure]: !passwordConditions.lowercaseletters,
                })}>{dataFieldSelect.filter((x: any) => x.value === (securityRules?.data?.[0]?.lowercaseletterspwd || "04"))[0].name}</span></div>}
                {(securityRules?.data?.[0]?.uppercaseletterspwd !== "04") && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond8)}</span><span className={clsx(classes.badge, {
                    [classes.badgeSuccess]: passwordConditions.uppercaseletters,
                    [classes.badgeFailure]: !passwordConditions.uppercaseletters,
                })}>{dataFieldSelect.filter((x: any) => x.value === (securityRules?.data?.[0]?.uppercaseletterspwd || "04"))[0].name}</span></div>}
                {(securityRules?.data?.[0]?.numericalcharacterspwd !== "04") && <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond9)}</span><span className={clsx(classes.badge, {
                    [classes.badgeSuccess]: passwordConditions.numbers,
                    [classes.badgeFailure]: !passwordConditions.numbers,
                })}>{dataFieldSelect.filter((x: any) => x.value === (securityRules?.data?.[0]?.numericalcharacterspwd || "04"))[0].name}</span></div>}
                <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond5)}</span><span className={clsx(classes.badge, {
                    [classes.badgeSuccess]: passwordConditions.specialcharacters,
                    [classes.badgeFailure]: !passwordConditions.specialcharacters,
                })}>{dataFieldSelect.filter((x: any) => x.value === (securityRules?.data?.[0]?.specialcharacterspwd || "04"))[0].name}</span></div>
                <div className={classes.paswordCondition}><span>{t(langKeys.passwordCond6)}</span></div>
            </div>

        </form>
    </div>
}

export default ChangePassword;