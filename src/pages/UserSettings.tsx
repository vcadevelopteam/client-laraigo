/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, IconButton, InputAdornment, Radio, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { FieldEdit, FieldView, TemplateBreadcrumbs } from 'components';
import { showSnackbar, manageConfirmation } from 'store/popus/actions';
import { updateUserInformation } from 'store/login/actions';
import { useForm } from 'react-hook-form';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { updateUserSettings } from 'store/setting/actions';
import ClearIcon from '@material-ui/icons/Clear';
import clsx from 'clsx';
import { execute, getCollection, resetAllMain } from 'store/main/actions';
import { cancelSuscription as cancelSuscriptionFunction, changePlan as changePlanFunction, getSecurityRules, validateDomainCharacters, validateDomainCharactersSpecials, validateNumbersEqualsConsecutive } from 'common/helpers';

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
    containerHeader: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    seccionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        paddingBottom: 10
    },
    hyperlinkstyle: {
        color: "-webkit-link",
        cursor: "pointer",
        textDecoration: "underline"
    },
    table: {
        minWidth: 650,
    },
    nameplan: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    planSelected: {
        backgroundColor: '#e1e1e1'
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
    //data: RowSelected;
    setViewSelected: (view: string) => void;
    //multiData: MultiData[];
    //fetchData?: () => void;
}

const PersonalInformation: React.FC<DetailProps> = ({ setViewSelected }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const [waitsave, setwaitsave] = useState(false);
    const resSetting = useSelector(state => state.setting.setting);
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm({
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
        register('firstname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('lastname', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
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
        const callback = () => {
            setwaitsave(true)
            dispatch(updateUserSettings(data))
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    const arrayBread = [
        { id: "view-1", name: t(langKeys.accountsettings) },
        { id: "view-2", name: t(langKeys.changepersonalinformation) }
    ];
    return <div style={{ width: "100%" }}>

        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}>
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        disabled={resSetting.loading}
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}>
                        {t(langKeys.save)}
                    </Button>
                </div>
            </div>
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <div className={classes.seccionTitle}>{t(langKeys.changepersonalinformation)}</div>
                    <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <FieldEdit
                            label={t(langKeys.firstname)}
                            style={{ marginBottom: 8 }}
                            onChange={(value) => setValue('firstname', value)}
                            valueDefault={user?.firstname || ""}
                            error={errors?.firstname?.message}
                        />
                    </div>
                    <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <FieldEdit
                            label={t(langKeys.ticket_lastname)}
                            className="col-6"
                            onChange={(value) => setValue('lastname', value)}
                            valueDefault={user?.lastname || ""}
                            error={errors?.lastname?.message}
                        />
                    </div>
                </div>
            </div>
        </form>
    </div>
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
    const arrayBread = [
        { id: "view-1", name: t(langKeys.accountsettings) },
        { id: "view-3", name: t(langKeys.changePassword) }
    ];
    return <div style={{ width: "100%" }}>

        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}>
                        {t(langKeys.back)}
                    </Button>
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
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <div className={classes.seccionTitle}>{t(langKeys.changePassword)}</div>
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
            </div>
        </form>
    </div>
}

const ChangePlan: React.FC<DetailProps> = ({ setViewSelected }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const user = useSelector(state => state.login.validateToken.user);
    const executeResult = useSelector(state => state.main.execute);

    const [plan, setPlan] = useState(user?.plan || "");

    const arrayBread = [
        { id: "view-1", name: t(langKeys.accountsettings) },
        { id: "view-4", name: t(langKeys.changeplan) }
    ];

    function changePlan(nameplan: "BASICO" | "PROFESIONAL" | "AVANZADO" | "PROFESIONAL") {
        if (nameplan !== user?.plan)
            setPlan(nameplan)
    }

    const handlerSave = () => {
        const callback = () => {
            setWaitSave(true)
            dispatch(execute(changePlanFunction(plan)));
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmchangeplan),
            callback
        }))
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSave(false)
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_change_plan) }));
                setViewSelected("view-1")
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error")
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
            }
        }
    }, [executeResult])

    return (
        <div style={{ width: "100%" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}>
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={plan === user?.plan || executeResult.loading}
                        onClick={handlerSave}
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}>
                        {t(langKeys.changeplan)}
                    </Button>
                </div>
            </div>
            <div className={classes.containerDetail}>
                <div className="row-zyx">
                    <div className={classes.seccionTitle}>{t(langKeys.changeplan)}</div>
                    <TableContainer >
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableBody>
                                <TableRow style={{ cursor: 'pointer' }} onClick={() => changePlan("BASICO")} className={clsx({
                                    [classes.planSelected]: user?.plan === "BASICO"
                                })}>
                                    <TableCell component="th" scope="row">
                                        <Radio
                                            color="primary"
                                            checked={plan === "BASICO"}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" className={classes.nameplan}>BASICO</TableCell>
                                    <TableCell component="th" scope="row">
                                        <b>{t(langKeys.basicdesc1)}</b>
                                        <div>{t(langKeys.basicdesc2)}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">$24</TableCell>
                                </TableRow>
                                <TableRow style={{ cursor: 'pointer' }} onClick={() => changePlan("PROFESIONAL")} className={clsx({
                                    [classes.planSelected]: user?.plan === "PROFESIONAL"
                                })}>
                                    <TableCell component="th" scope="row">
                                        <Radio
                                            color="primary"
                                            checked={plan === "PROFESIONAL"}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" className={classes.nameplan}>PROFESIONAL</TableCell>
                                    <TableCell component="th" scope="row">
                                        <b>{t(langKeys.prodesc1)}</b>
                                        <div>{t(langKeys.prodesc2)}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">$59</TableCell>
                                </TableRow>
                                <TableRow style={{ cursor: 'pointer' }} onClick={() => changePlan("AVANZADO")} className={clsx({
                                    [classes.planSelected]: user?.plan === "AVANZADO"
                                })}>
                                    <TableCell component="th" scope="row">
                                        <Radio
                                            color="primary"
                                            checked={plan === "AVANZADO"}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" className={classes.nameplan}>AVANZADO</TableCell>
                                    <TableCell component="th" scope="row">
                                        <b>{t(langKeys.advanceddesc1)}</b>
                                        <div>{t(langKeys.advanceddesc2)}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">$139</TableCell>
                                </TableRow>
                                <TableRow style={{ cursor: 'pointer' }} onClick={() => changePlan("PROFESIONAL")} className={clsx({
                                    [classes.planSelected]: user?.plan === "PROFESIONAL"
                                })}>
                                    <TableCell component="th" scope="row">
                                        <Radio
                                            color="primary"
                                            checked={plan === "PROFESIONAL"}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" className={classes.nameplan}>PROFESIONAL</TableCell>
                                    <TableCell component="th" scope="row">
                                        <b>{t(langKeys.premiumdesc1)}</b>
                                        <div>{t(langKeys.premiumdesc2)}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">$399</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ textAlign: "center", fontWeight: 500, fontSize: 12, color: "grey", marginLeft: "15px", marginTop: "15px" }}>{t(langKeys.detailchangeplan1)}</div>
                </div>
            </div>
        </div>
    )
}

const UserSettings: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const user = useSelector(state => state.login.validateToken.user);
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector(state => state.main.execute);
    const [view, setView] = useState('view-1');

    const fetchData = () => dispatch(getCollection(getSecurityRules()));

    useEffect(() => {
        fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    function changePlan() {
        if ((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(v))) {
            setView('view-4')
        } else {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.notpermisionforaction) }));
        }
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSave(false)
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_cancel_suscription) }));
                // setViewSelected("view-1")
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error")
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
            }
        }
    }, [executeResult])

    function cancelSuscription() {
        if ((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(v))) {
            const callback = () => {
                setWaitSave(true);
                dispatch(execute(cancelSuscriptionFunction()));
            }
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.cancelsuscriptionconfirmation),
                textCancel: t(langKeys.back),
                callback
            }))
        } else {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.notpermisionforaction) }));
        }
    }

    if (view === "view-1") {

        return (
            <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{
                        fontSize: '22px',
                        fontWeight: 'bold',
                    }}>
                        {t(langKeys.accountsettings)}
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className={classes.seccionTitle}>{t(langKeys.accountinformation)}</div>
                    <div className="row-zyx">
                        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <FieldView
                                label={t(langKeys.corporation)}
                                value={user?.orgdesc}
                            />
                            <FieldView
                                label={t(langKeys.firstname)}
                                value={`${user?.firstname} ${user?.lastname}`}
                            />
                            <FieldView
                                label={t(langKeys.account)}
                                value={user?.usr}
                            />
                        </div>
                        <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="col-6">
                                <Box lineHeight="20px" fontSize={15} color="textPrimary"><div className={classes.hyperlinkstyle} onClick={() => setView('view-2')}>{t(langKeys.changepersonalinformation)}</div></Box>
                            </div>
                            <div className="col-6">
                                <Box lineHeight="20px" fontSize={15} color="textPrimary"><div className={classes.hyperlinkstyle} onClick={() => setView('view-3')}>{t(langKeys.changePassword)}</div></Box>
                            </div>
                        </div>
                    </div>
                </div>
                {((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(v))) &&
                    <>
                        <div className={classes.containerDetail}>
                            <div className={classes.seccionTitle}>{t(langKeys.planinformation)}</div>
                            <div className="row-zyx">
                                <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <FieldView
                                        label={"Plan"}
                                        value={user?.plan}
                                    />
                                </div>
                                <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div className="col-6">
                                        <Box lineHeight="20px" fontSize={15} color="textPrimary"><div className={classes.hyperlinkstyle} onClick={() => changePlan()}>{t(langKeys.changeplan)}</div></Box>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classes.containerDetail}>
                            <div className={classes.seccionTitle}>{t(langKeys.suscription)}</div>
                            <div className="row-zyx">
                                <div className="col-6" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div className="col-6">
                                        <Box lineHeight="20px" fontSize={15} color="textPrimary"><div className={classes.hyperlinkstyle} onClick={() => cancelSuscription()}>{t(langKeys.cancelsuscription)}</div></Box>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        )
    }
    else if (view === "view-2") {
        return <PersonalInformation
            setViewSelected={setView}
        />
    }
    else if (view === "view-3") {
        return <ChangePassword
            setViewSelected={setView}
        />
    }
    else if (view === "view-4") {
        return <ChangePlan
            setViewSelected={setView}
        />
    }
    else {

        return <div>error</div>
    }

}

export default UserSettings;