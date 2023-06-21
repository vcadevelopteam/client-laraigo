import { Controller, useFormContext } from "react-hook-form";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { FieldSelect } from "components";
import { getCountryList } from "store/signup/actions";
import { getValuesFromDomain } from "common/helpers/requestBodies";
import { langKeys } from "lang/keys";
import { MainData, SubscriptionContext, usePlanData } from "./context";
import { makeStyles, Button, TextField, Breadcrumbs } from '@material-ui/core';
import { resetMain, getCollectionPublic } from 'store/main/actions';
import { styled } from '@material-ui/core/styles';
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";

import Link from '@material-ui/core/Link';
import MuiPhoneNumber from 'material-ui-phone-number';

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        display: "block",
        fontSize: '40px',
        fontWeight: "bold",
        margin: 'auto',
        padding: 12,
        width: "280px",
    },
    title: {
        color: theme.palette.primary.main,
        marginBottom: '0px',
    },
    containerBorder: {
        border: "1px solid",
        borderRadius: "8px",
        padding: "18px",
    },
    containerInfoPay: {
        width: '50%',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    centeredElement: {
        alignItems: 'center',
        display: 'inline-block',
        height: '100%',
        justifyContent: 'center',
    },
    containerOther:{
        [theme.breakpoints.down('xs')]: {
            flexWrap: "wrap"
        },

    },
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
    const { t } = useTranslation();
    const { finishreg, commonClasses } = useContext(SubscriptionContext);
    const { getValues, setValue, control } = useFormContext<MainData>();

    const dispatch = useDispatch();

    const [icon, setIcon] = useState(<></>);
    const [limitnumbers, setlimitnumbers] = useState(16);
    const [phoneCountry, setPhoneCountry] = useState('');

    const executeResult = useSelector(state => state.signup.insertChannel);
    const mainResult = useSelector(state => state.main.mainData);
    //const planData = usePlanData();
    const countryList = useSelector(state => state.signup.countryList);

    const fetchData = () => dispatch(getCollectionPublic(getValuesFromDomain("REASONSSIGNUP")));

    const docTypeValidate = (docnum: string, docType: number) => {
        if (!docnum) {
            return t(langKeys.field_required);
        }

        switch (docType) {
            case 1:
                return docnum.length !== 8 ? t(langKeys.doctype_dni_error) : undefined;
            case 2:
                return docnum.length <= 12 ? t(langKeys.doctype_foreigners_card) : undefined;
            case 3:
                return docnum.length !== 11 ? t(langKeys.doctype_ruc_error) : undefined;
            default:
                return t(langKeys.doctype_unknown_error);
        }
    }

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

    const databilling = useMemo(() => ([
        { id: 1, desc: t(langKeys.billingfield_billingdni) },
        { id: 2, desc: t(langKeys.billingfield_billingextra) },
        { id: 3, desc: t(langKeys.billingfield_billingruc) },
    ]), [t]);

    const countries = useMemo(() => {
        if (countryList.loading) return [];
        return countryList.data.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });
    }, [countryList]);

    useEffect(() => {
        dispatch(getCountryList())
        try {
            fetch(URL, { method: "get" })
                .then((response) => response.json())
                .then((data) => {
                    // PERU, PE, PEN
                    const countryCode = data.country_code.toUpperCase();

                    setPhoneCountry(countryCode);
                    setValue('contactcountry', countryCode);
                    setValue('contactcountryname', (data?.country_name || '').toUpperCase());
                    setValue('contactcurrency', data?.currency || '');
                    setValue('contactdocumenttype', countryCode === "PE" ? 1 : 0);
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
            <div style={{ padding: "0px", paddingBottom: "12px" }}>
                {t(langKeys.addpaymentmethodsub)}
            </div>
            <div className={classes.containerBorder}>
                <h3 style={{ margin: "0px" }}>{t(langKeys.subscription_billingregister)}</h3>
                <div className="row-zyx" style={{ marginBottom: '-10px' }}>
                    <Controller
                        control={control}
                        name="contactdocumenttype"
                        rules={{
                            validate: (value) => {
                                if (value === null || value === undefined) {
                                    return `${t(langKeys.field_required)}`;
                                }
                            }
                        }}
                        render={({ field: { onChange }, formState: { errors } }) => (
                            <FieldSelect
                                className="col-3"
                                data={databilling}
                                error={errors.contactdocumenttype?.message}
                                label={t(langKeys.docType)}
                                optionDesc="desc"
                                optionValue="id"
                                style={{ marginTop: 16 }}
                                valueDefault={getValues('contactdocumenttype')}
                                variant="outlined"
                                onChange={(data: typeof databilling[number]) => {
                                    onChange(data?.id || "");
                                }}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="contactdocumentnumber"
                        rules={{
                            validate: value => docTypeValidate(
                                value,
                                getValues('contactdocumenttype'),
                            ),
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                className="col-3"
                                error={!!errors.contactdocumentnumber}
                                fullWidth
                                helperText={errors.contactdocumentnumber?.message}
                                label={t(langKeys.docNumber)}
                                margin="normal"
                                size="small"
                                type="number"
                                variant="outlined"
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="contactnameorcompany"
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) {
                                    return `${t(langKeys.field_required)}`;
                                }
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                className="col-6"
                                error={!!errors.contactnameorcompany}
                                fullWidth
                                helperText={errors.contactnameorcompany?.message}
                                label={t(langKeys.subscription_companyorname)}
                                margin="normal"
                                size="small"
                                variant="outlined"
                            />
                        )}
                    />
                </div>
                <div className="row-zyx" style={{ marginBottom: '-10px' }}>
                    <Controller
                        control={control}
                        name="contactaddress"
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) {
                                    return `${t(langKeys.field_required)}`;
                                }
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                className="col-9"
                                error={!!errors.contactaddress}
                                fullWidth
                                helperText={errors.contactaddress?.message}
                                label={t(langKeys.subscription_address)}
                                margin="normal"
                                size="small"
                                variant="outlined"
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="contactcountry"
                        rules={{
                            validate: (value) => {
                                if (value === null || value === undefined)
                                    return `${t(langKeys.field_required)}`;
                            }
                        }}
                        render={({ field: { onChange }, formState: { errors } }) => (
                            <FieldSelect
                                className="col-3"
                                data={countries}
                                error={errors.contactcountry?.message}
                                label={t(langKeys.country)}
                                optionDesc="description"
                                optionValue="code"
                                style={{ marginTop: 16 }}
                                valueDefault={getValues('contactcountry')}
                                variant="outlined"
                                onChange={(data) => {
                                    onChange(data?.code || '');
                                    setValue('contactdocumenttype', data?.code === "PE" ? 1 : 0);
                                    setPhoneCountry(data?.code || '');
                                }}
                            />
                        )}
                    />
                </div>
                <div className="row-zyx" style={{ marginBottom: '-10px' }}>
                    <Controller
                        control={control}
                        name="contactmail"
                        rules={{
                            validate: (value) => {
                                if (value?.length === 0)
                                    return `${t(langKeys.field_required)}`;
                                else if (!/\S+@\S+\.\S+/.test(value))
                                    return `${t(langKeys.emailverification)}`;
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                className="col-6"
                                error={!!errors.contactmail}
                                fullWidth
                                helperText={errors.contactmail?.message}
                                label={t(langKeys.subscription_email)}
                                margin="normal"
                                size="small"
                                variant="outlined"
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="contactphone"
                        rules={{
                            validate: (value) => {
                                if (value.length === 0)
                                    return `${t(langKeys.field_required)}`;
                                else if (value.length < 10)
                                    return `${t(langKeys.validationphone)}`;
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <CssPhonemui
                                {...field}
                                className="col-6"
                                countryCodeEditable={false}
                                defaultCountry={phoneCountry.toLowerCase()}
                                error={!!errors?.contactphone}
                                fullWidth
                                helperText={errors?.contactphone?.message}
                                label={t(langKeys.phone)}
                                margin="normal"
                                size="small"
                                variant="outlined"
                            />
                        )}
                    />
                </div>
            </div>
            <div style={{display: "flex", gap: 8}} className={classes.containerOther}>

                <div className={classes.containerBorder} style={{ marginTop: '20px' }}>
                    <div style={{ display: "flex", width: "100%", flexWrap: 'wrap' }}>
                        <div className={classes.containerInfoPay}>
                            <h3 style={{ margin: "0px" }}>{t(langKeys.creditcard)}</h3>
                            <div style={{ display: "flex" }}>
                                <img alt="visa" src="https://static.culqi.com/v2/v2/static/img/visa.svg" width="50px" style={{ padding: 5 }}></img>
                                <img alt="mastercard" src="https://static.culqi.com/v2/v2/static/img/mastercard.svg" width="50px" style={{ padding: 5 }}></img>
                                <img alt="ammex" src="https://static.culqi.com/v2/v2/static/img/amex.svg" width="50px" style={{ padding: 5 }}></img>
                                <img alt="dinners" src="https://static.culqi.com/v2/v2/static/img/diners.svg" width="50px" style={{ padding: 5 }}></img>
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '-10px' }}>
                                <Controller
                                    control={control}
                                    name="cardnumber"
                                    rules={{
                                        validate: (value) => {
                                            if (value?.length === 0)
                                                return `${t(langKeys.field_required)}`;
                                            else if ((value?.length !== limitnumbers) || (limitnumbers < 12))
                                                return `${t(langKeys.creditcardvalidate)}`;
                                        }
                                    }}
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            className="col-12"
                                            error={!!errors.cardnumber}
                                            fullWidth
                                            helperText={errors.cardnumber?.message}
                                            label={t(langKeys.creditcard)}
                                            margin="normal"
                                            size="small"
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: icon,
                                            }}
                                            inputProps={{
                                                maxLength: limitnumbers,
                                            }}
                                            onPaste={e => {
                                                e.preventDefault()
                                            }}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/[^0-9]/g, '');
                                                let spaces = Math.floor(val.length / 4);
                                                let partialvalue = val.slice(0, 4);
                                                for (let i = 1; i <= spaces; i++) {
                                                    partialvalue += " " + val.slice(i * 4, (i + 1) * 4)
                                                }
                                                setValue("cardnumber", partialvalue.trim());
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
                                        />
                                    )}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '-10px' }}>
                                <div style={{ padding: "0px" }}>{t(langKeys.dueDate)}</div>
                                <Controller
                                    control={control}
                                    name="cardmonth"
                                    rules={{
                                        validate: (value) => {
                                            if (value === null || value === undefined)
                                                return `${t(langKeys.field_required)}`;
                                        }
                                    }}
                                    render={({ field: { onChange }, formState: { errors } }) => (
                                        <FieldSelect
                                            className="col-3"
                                            data={datamonth}
                                            error={errors.cardmonth?.message}
                                            label={"MM"}
                                            optionDesc="desc"
                                            optionValue="id"
                                            style={{ marginTop: 8, marginRight: 10 }}
                                            valueDefault={getValues('cardmonth')}
                                            variant="outlined"
                                            onChange={(data: typeof datamonth[number]) => {
                                                onChange(data?.id || "");
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="cardyear"
                                    rules={{
                                        validate: (value) => {
                                            if (value?.length === 0)
                                                return `${t(langKeys.field_required)}`;
                                            else if (value?.length !== 4)
                                                return `${t(langKeys.field_required)}`;
                                        }
                                    }}
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            className="col-9"
                                            error={!!errors.cardyear}
                                            fullWidth
                                            helperText={errors.cardyear?.message}
                                            label={"YYYY"}
                                            margin="normal"
                                            size="small"
                                            style={{ marginTop: 8 }}
                                            type="number"
                                            variant="outlined"
                                            inputProps={{
                                                maxLength: 4
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '-10px' }}>
                                <Controller
                                    control={control}
                                    name="cardsecuritycode"
                                    rules={{
                                        validate: (value) => {
                                            if (value?.length === 0)
                                                return `${t(langKeys.field_required)}`;
                                        }
                                    }}
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            className="col-12"
                                            error={!!errors.cardsecuritycode}
                                            fullWidth
                                            helperText={errors.cardsecuritycode?.message}
                                            label={t(langKeys.securitycode)}
                                            margin="normal"
                                            size="small"
                                            type="password"
                                            variant="outlined"
                                            inputProps={{
                                                maxLength: limitnumbers === 18 ? 4 : 3
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className={classes.containerInfoPay}>
                            <div className={classes.centeredElement}>
                                <div style={{ textAlign: "center", padding: "20px", border: "1px solid #7721ad", borderRadius: "15px", margin: "10px", paddingTop: 'auto' }}>{t(langKeys.finishregwarn)}</div>
                                <div style={{ textAlign: "center", padding: "20px", color: "#7721ad", margin: "10px", paddingBottom: 'auto' }}>{t(langKeys.finishregwarn2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.containerBorder} style={{ marginTop: '20px' }}>
                    <div style={{ width: "100%" }}>
                        <div>
                            <h3 style={{ margin: "0px",  color: "#7721ad", textAlign: "center"}}>{t(langKeys.suscription)} PRO</h3>
                            <h3> <b>$249</b> dólares mensuales</h3>
                            <p><b>2000 Contactos/mes</b></p>
                            <p><b>5 Usuarios/Agentes</b></p>
                            <p>
                                <ul>
                                    <li>Acceso a las características principales de Laraigo.</li>
                                    <li>Exportación de datos de contacto.</li>
                                    <li>Inteligencia Artificial Hasta 1000 conversaciones (Costo por conversación adicional US$0.10).</li>
                                </ul>

                            </p>
                        </div>
                    </div>
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