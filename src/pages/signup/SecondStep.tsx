/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { makeStyles, Button, TextField, Breadcrumbs } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { IDomain } from "@types"
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { resetMain, getCollectionPublic } from 'store/main/actions';
import MuiPhoneNumber from 'material-ui-phone-number';
import { styled } from '@material-ui/core/styles';
import { FieldMultiSelect, FieldSelect } from "components";
import { getValuesFromDomain } from "common/helpers/requestBodies";
import { getCountryList } from "store/signup/actions";
import { MainData, SubscriptionContext } from "./context";
import { Controller, useFormContext } from "react-hook-form";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: "bold",
        fontSize: '40px',
        //textTransform: 'initial',
        width: "100%"
    },
    title: {
        color: theme.palette.primary.main,
        textAlign: 'center',
    },
    containerInfoPay: {
        width: '50%',

        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    }
}));

const CssPhonemui = styled(MuiPhoneNumber)({
    '& label.Mui-focused': {
        color: '#7721ad',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#7721ad',
    },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#7721ad',
        },
    },
});

const URL = "https://ipapi.co/json/";
const SecondStep: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const dispatch = useDispatch();
    const [limitnumbers, setlimitnumbers] = useState(16);
    const [icon, setIcon] = useState(<></>);
    const { t } = useTranslation();

    const { getValues, setValue, control, trigger } = useFormContext<MainData>();
    const executeResult = useSelector(state => state.signup.insertChannel);
    const { setStep, finishreg, commonClasses } = useContext(SubscriptionContext);

    const mainResult = useSelector(state => state.main.mainData);
    const ressignup = useSelector(state => state.signup.countryList);

    const [phoneCountry, setPhoneCountry] = useState('');

    const fetchData = () => dispatch(getCollectionPublic(getValuesFromDomain("REASONSSIGNUP")));
    
    const datamonth = useMemo(() => ([
        { id: 1, desc: "01" },
        { id: 2, desc: "02" },
        { id: 3, desc: "03" },
        { id: 4, desc: "04" },
        { id: 5, desc: "05" },
        { id: 6, desc: "06" },
        { id: 7, desc: "07" },
        { id: 8, desc: "08" },
        { id: 9, desc: "09" },
        { id: 10, desc: "10" },
        { id: 11, desc: "11" },
        { id: 12, desc: "12" },
    ]), [t]);

    useEffect(() => {
        dispatch(getCountryList())
        try {
            fetch(URL, { method: "get" })
                .then((response) => response.json())
                .then((data) => {
                    // PERU, PE, PEN
                    const countryCode = data.country_code.toUpperCase();

                    setPhoneCountry(countryCode);
                    setValue('country', countryCode);
                    setValue('doctype', countryCode === "PE" ? 1 : 0);
                    setValue('countryname', data.country_name.toUpperCase());
                    setValue('currency', data.currency);
                })
        }
        catch (error) {
            console.error("error");
        }
        fetchData();
        return () => {
            dispatch(resetMain());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
    const classes = useChannelAddStyles();

    return (
        <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                    {'<< '}<Trans i18nKey={langKeys.previoustext} />
                </Link>
            </Breadcrumbs>
            <h1 className={classes.title}>{t(langKeys.addpaymentmethod)}</h1>
            <div style={{ padding: "20px" }}>
                {t(langKeys.addpaymentmethodsub)}
            </div>
            <Controller
                name="firstnamecard"
                control={control}
                rules={{
                    validate: (value) => {
                        if (value.length === 0) 
                            return t(langKeys.field_required) as string;
                    }
                }}
                render={({ field, formState: { errors } }) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        size="small"
                        label={t(langKeys.firstname)}
                        error={!!errors.firstnamecard}
                        helperText={errors.firstnamecard?.message}
                    />
                )}
            />
            <Controller
                name="lastnamecard"
                control={control}
                rules={{
                    validate: (value) => {
                        if (value?.length === 0) 
                            return t(langKeys.field_required) as string;
                    }
                }}
                render={({ field, formState: { errors } }) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        size="small"
                        label={t(langKeys.lastname)}
                        error={!!errors.lastnamecard}
                        helperText={errors.lastnamecard?.message}
                    />
                )}
            />
            <Controller
                name="pmemail"
                control={control}
                rules={{
                    validate: (value) => {
                        if (value?.length === 0) 
                            return t(langKeys.field_required) as string;
                        else if (!/\S+@\S+\.\S+/.test(value)) 
                            return t(langKeys.emailverification) as string;
                    }
                }}
                render={({ field, formState: { errors } }) => (
                    <TextField
                        {...field}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        size="small"
                        label={t(langKeys.email)}
                        error={!!errors.pmemail}
                        helperText={errors.pmemail?.message}
                    />
                )}
            />
            <Controller
                name="pmphone"
                control={control}
                rules={{
                    validate: (value) => {
                        if (value.length === 0) 
                            return t(langKeys.field_required) as string;
                        else if (value.length < 10) 
                            return t(langKeys.validationphone) as string;
                    }
                }}
                render={({ field, formState: { errors } }) => (
                    <CssPhonemui
                        {...field}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        countryCodeEditable={false}
                        size="small"
                        defaultCountry={'pe'}
                        label={t(langKeys.phone)}
                        error={!!errors?.pmphone}
                        helperText={errors?.pmphone?.message}
                    />
                )}
            />
            <h3>{t(langKeys.creditcard)}</h3>
            <div style={{ display: "flex" }}>
                <img alt="visa" src="https://static.culqi.com/v2/v2/static/img/visa.svg" width="50px" style={{ padding: 5 }}></img>
                <img alt="mastercard" src="https://static.culqi.com/v2/v2/static/img/mastercard.svg" width="50px" style={{ padding: 5 }}></img>
                <img alt="ammex" src="https://static.culqi.com/v2/v2/static/img/amex.svg" width="50px" style={{ padding: 5 }}></img>
                <img alt="dinners" src="https://static.culqi.com/v2/v2/static/img/diners.svg" width="50px" style={{ padding: 5 }}></img>
            </div>
            <div style={{ display: "flex", width: "100%", flexWrap: 'wrap' }}>
                <div className={classes.containerInfoPay}>
                    <Controller
                        name="creditcard"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value?.length === 0)
                                    return t(langKeys.field_required) as string;
                                else if ((value?.length !== limitnumbers) || (limitnumbers < 12))
                                    return t(langKeys.creditcardvalidate) as string;
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                size="small"
                                label={t(langKeys.creditcard)}
                                error={!!errors.creditcard}
                                helperText={errors.creditcard?.message}
                                onPaste={e => {
                                    e.preventDefault()
                                }}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/[^0-9]/g, '');
                                    let spaces = Math.floor(val.length / 4)
                                    let partialvalue = val.slice(0, 4)
                                    for (let i = 1; i <= spaces; i++) {
                                        partialvalue += " " + val.slice(i * 4, (i + 1) * 4)
                                    }
                                    setValue("creditcard", partialvalue.trim());
                                }}
                                onInput={(e: any) => {
                                    if (e.target.value.slice(0, 1) === "4") {
                                        setIcon(<img alt="visa" src="https://static.culqi.com/v2/v2/static/img/visa.svg" width="50px" style={{ padding: 5 }}></img>)
                                        setlimitnumbers(19)
                                    } else if (e.target.value.slice(0, 2) === "51" || e.target.value.slice(0, 2) === "55") {
                                        setIcon(<img alt="mastercard" src="https://static.culqi.com/v2/v2/static/img/mastercard.svg" width="50px" style={{ padding: 5 }}></img>)
                                        setlimitnumbers(19)
                                    } else if (e.target.value.slice(0, 2) === "37" || e.target.value.slice(0, 2) === "34") {
                                        setIcon(<img alt="ammex" src="https://static.culqi.com/v2/v2/static/img/amex.svg" width="50px" style={{ padding: 5 }}></img>)
                                        setlimitnumbers(18)
                                    } else if (e.target.value.slice(0, 2) === "36" || e.target.value.slice(0, 2) === "38" || e.target.value.slice(0, 3) === "300" || e.target.value.slice(0, 3) === "305") {
                                        setIcon(<img alt="dinners" src="https://static.culqi.com/v2/v2/static/img/diners.svg" width="50px" style={{ padding: 5 }}></img>)
                                        setlimitnumbers(17)
                                    } else {
                                        setIcon(<></>)
                                        setlimitnumbers(10)
                                    }
                                }}
                                InputProps={{
                                    endAdornment: icon,
                                }}
                                inputProps={{
                                    maxLength: limitnumbers
                                }}
                            />
                        )}
                    />
                    <div style={{ padding: "20px" }}>{t(langKeys.dueDate)}</div>
                    <div style={{ display: "flex" }}>
                        <Controller
                            name="mm"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (value === null || value === undefined)
                                        return t(langKeys.field_required) as string;
                                }
                            }}
                            render={({ field: { onChange }, formState: { errors } }) => (
                                <FieldSelect
                                    onChange={(data: typeof datamonth[number]) => {
                                        onChange(data?.id || "");
                                    }}
                                    variant="outlined"
                                    style={{ marginTop: 8, marginRight: 10 }}
                                    className="col-6"
                                    valueDefault={getValues('mm')}
                                    label={"MM"}
                                    error={errors.mm?.message}
                                    data={datamonth}
                                    optionDesc="desc"
                                    optionValue="id"
                                />
                            )}
                        />
                        <Controller
                            name="yyyy"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (value?.length === 0)
                                        return t(langKeys.field_required) as string;
                                    else if (value?.length !== 4)
                                        return t(langKeys.field_required) as string;
                                }
                            }}
                            render={({ field, formState: { errors } }) => (
                                <TextField
                                    {...field}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    className="col-6"
                                    style={{ marginTop: 8 }}
                                    type="number"
                                    size="small"
                                    label={"YYYY"}
                                    error={!!errors.yyyy}
                                    helperText={errors.yyyy?.message}
                                    inputProps={{
                                        maxLength: 4
                                    }}
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name="securitycode"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value?.length === 0) 
                                    return t(langKeys.field_required) as string;
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                type="password"
                                size="small"
                                label={t(langKeys.securitycode)}
                                error={!!errors.securitycode}
                                helperText={errors.securitycode?.message}
                                inputProps={{
                                    maxLength: limitnumbers === 18 ? 4 : 3
                                }}
                            />
                        )}
                    />
                </div>
                <div className={classes.containerInfoPay} >
                    <div style={{ textAlign: "center", padding: "20px", border: "1px solid #7721ad", borderRadius: "15px", margin: "10px" }}>{t(langKeys.finishregwarn)}</div>
                    <div style={{ textAlign: "center", padding: "20px", color: "#7721ad", margin: "10px" }}>{t(langKeys.finishregwarn2)}</div>
                </div>
            </div>
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    finishreg();
                }}
                className={commonClasses.button}
                style={{ marginTop: '3em' }}
                variant="contained"
                color="primary"
                disabled={executeResult.loading}
            >
                <Trans i18nKey={langKeys.finishreg} />
            </Button>
        
            {/*<>
            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", marginTop: 15 }}>{t(langKeys.signupstep1title2)}</div>
            <div >
                <Controller
                    name="firstandlastname"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value.length === 0) {
                                return t(langKeys.field_required) as string;
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            size="small"
                            label={t(langKeys.firstandlastname)}
                            error={!!errors.firstandlastname}
                            helperText={errors.firstandlastname?.message}
                        />
                    )}
                />
                <Controller
                    name="companybusinessname"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value.length === 0) {
                                return t(langKeys.field_required) as string;
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <TextField
                            {...field}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            size="small"
                            label={t(langKeys.companybusinessname)}
                            error={!!errors.companybusinessname}
                            helperText={errors.companybusinessname?.message}
                        />
                    )}
                />
                <Controller
                    name="country"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value.length === 0) {
                                return t(langKeys.field_required) as string;
                            }
                        }
                    }}
                    render={({ field: { onChange }, formState: { errors } }) => (
                        <FieldSelect
                            onChange={(data) => {
                                onChange(data?.code || '');
                                setValue('doctype', data?.code === "PE" ? 1 : 0);
                                setPhoneCountry(data?.code || '');
                            }}
                            variant="outlined"
                            style={{ marginTop: 8 }}
                            label={t(langKeys.country)}
                            valueDefault={getValues('country')}
                            error={errors.country?.message}
                            data={ressignup.data}
                            optionDesc="description"
                            optionValue="code"
                        />
                    )}
                />
                <Controller
                    name="mobilephone"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value.length === 0) {
                                return t(langKeys.field_required) as string;
                            }else if(value.length<10){
                                return t(langKeys.validationphone) as string;
                            }
                        }
                    }}
                    render={({ field, formState: { errors } }) => (
                        <CssPhonemui
                            {...field}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            size="small"
                            countryCodeEditable={false}
                            defaultCountry={phoneCountry.toLowerCase()}
                            label={t(langKeys.mobilephoneoptional)}
                            error={!!errors.mobilephone}
                            helperText={errors.mobilephone?.message}
                        />
                    )}
                />
                <div style={{ paddingTop: 20, fontWeight: "bold", color: "#381052" }}>
                    <Trans i18nKey={langKeys.laraigouse} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>
                        {` (${t(langKeys.optional).toLowerCase()})`}
                    </span>
                </div>
                <Controller
                    name="join_reason"
                    control={control}
                    render={({ field: { onChange }, formState: { errors } }) => (
                        <FieldMultiSelect
                            onChange={(data: IDomain[]) => {
                                onChange(data?.map(x => x.domainvalue)?.join() || '');
                            }}
                            variant="outlined"
                            error={errors.join_reason?.message}
                            data={mainResult.data as IDomain[]}
                            prefixTranslation="reason_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    )}
                />
                <Button
                    onClick={async () => {
                        const valid = await trigger();
                        if (valid) {
                            setStep(2.5);
                        }
                    }}
                    className={classes.button}
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '0.43em' }}
                    disabled={mainResult.loading || ressignup.loading}
                >
                    <Trans i18nKey={langKeys.next} />
                </Button>
            </div>
            </>*/}

        </div>
    )
}

export default SecondStep