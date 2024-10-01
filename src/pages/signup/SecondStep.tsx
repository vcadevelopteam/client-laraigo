import { Box, Button, FormControl, FormControlLabel, makeStyles, Radio, RadioGroup, TextField } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";
import { FieldSelect } from "components";
import { getCollectionPublic, resetMain } from "store/main/actions";
import { getCountryList } from "store/signup/actions";
import { getValuesFromDomain } from "common/helpers/requestBodies";
import { langKeys } from "lang/keys";
import { MainData, SubscriptionContext, usePlanData } from "./context";
import { styled } from "@material-ui/core/styles";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";

import LockIcon from "@material-ui/icons/Lock";
import Tooltip from "@material-ui/core/Tooltip";
import Zoom from "@material-ui/core/Zoom";
import MuiPhoneNumber from "material-ui-phone-number";
import React, { FC, useContext, useEffect, useMemo, useState } from "react";

const useChannelAddStyles = makeStyles((theme) => ({
    button: {
        display: "block",
        fontSize: "40px",
        fontWeight: "bold",
        margin: "auto",
        padding: 12,
        width: "280px",
    },
    title: {
        color: theme.palette.primary.main,
        marginBottom: "0px",
    },
    containerBorder: {
        border: "1px solid",
        borderRadius: "8px",
        padding: "14px",
    },
    containerInfoPay: {
        width: "50%",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        },
    },
    containerOther: {
        [theme.breakpoints.down("xs")]: {
            flexWrap: "wrap",
        },
    },
    noBorder: {
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                border: "none",
            },
        },
    },
    customFontSize: {
        "& .MuiInputBase-input": {
            fontSize: "25px",
        },
        "& .MuiFormHelperText-root": {
            fontSize: "25px",
        },
        color: "#3F3F3F",
    },
    centeredPlaceholder: {
        "&::placeholder": {
            textAlign: "center",
        },
        textAlign: "center",
        color: "#3F3F3F",
    },
    centeredPlaceholderError: {
        "&::placeholder": {
            textAlign: "center",
        },
        textAlign: "center",
        color: "red",
    },
}));

const CssPhonemui = styled(MuiPhoneNumber)({
    "& label.Mui-focused": {
        color: "#7721ad",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#7721ad",
    },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: "#7721ad",
        },
    },
});

const URL = "https://ipapi.co/json/";

function isNumeric(value: string) {
    return /^-?\d+$/.test(value);
}

const SecondStep = () => {
    const { commonClasses, finishRegister } = useContext(SubscriptionContext);
    const { control, getValues, setValue, watch } = useFormContext<MainData>();
    const { t } = useTranslation();

    const [icon, setIcon] = useState(<></>);
    const [limitNumbers, setLimitNumbers] = useState(24);
    const [phoneCountry, setPhoneCountry] = useState("");

    const values = watch();
    const remainingDaysFromSubscription = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1;
    const daysInCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();


    const classes = useChannelAddStyles();
    const countryResult = useSelector((state) => state.signup.countryList);
    const dispatch = useDispatch();
    const fetchData = () => dispatch(getCollectionPublic(getValuesFromDomain("REASONSSIGNUP")));
    const insertResult = useSelector((state) => state.signup.insertChannel);
    const planData = usePlanData();
    const [accounting, setAccounting] = useState({
        total: ((remainingDaysFromSubscription === 0 ? 0 : (((planData?.plan?.planCost || 0) * remainingDaysFromSubscription) / daysInCurrentMonth)) * 1.18).toFixed(2),
        taxes: ((remainingDaysFromSubscription === 0 ? 0 : (((planData?.plan?.planCost || 0) * remainingDaysFromSubscription) / daysInCurrentMonth)) * 0.18).toFixed(2),
        subtotal: (remainingDaysFromSubscription === 0 ? 0 : (((planData?.plan?.planCost || 0) * remainingDaysFromSubscription) / daysInCurrentMonth)).toFixed(2),
    });

    const validateDocumentType = (documentNumber: string, documentType: number) => {
        if (!documentNumber) {
            return t(langKeys.field_required);
        }

        switch (documentType) {
            case 1:
                return (documentNumber.length !== 8 || !isNumeric(documentNumber)) ? t(langKeys.doctype_dni_error) : undefined;

            case 6:
                return (documentNumber.length !== 11 || !isNumeric(documentNumber)) ? t(langKeys.doctype_ruc_error) : undefined;

            case 0:
            case 4:
            case 13:
            case 22:
            case 31:
            case 50:
                return undefined;

            default:
                return t(langKeys.doctype_unknown_error);
        }
    };

    const dataBillingPersonPeru = [
        { id: 1, desc: t(langKeys.subscription_billingdni) },
        { id: 4, desc: t(langKeys.subscription_billingextra) },
    ]

    const dataBillingCompanyPeru = [
        { id: 6, desc: t(langKeys.subscription_billingruc) },
    ]

    const dataBillingPersonColombia = [
        { id: 13, desc: t(langKeys.subscription_colombiacedciud) },
        { id: 22, desc: t(langKeys.subscription_colombiacedext) },
    ]

    const dataBillingCompanyColombia = [
        { id: 31, desc: t(langKeys.subscription_colombianit) },
        { id: 50, desc: t(langKeys.subscription_colombianitother) },
    ]

    const dataBillingOtherPerson = [
        { id: 0, desc: t(langKeys.subscription_billingdocument) },
        { id: 4, desc: t(langKeys.subscription_billingextra) },
    ]

    const dataBillingOtherCompany = [
        { id: 0, desc: t(langKeys.subscription_billingno) },
    ]

    const dataCountry = useMemo(() => {
        if (countryResult.loading) return [];
        return countryResult.data.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });
    }, [countryResult]);

    useEffect(() => {
        dispatch(getCountryList());

        fetch(URL, { method: "get" })
            .then((response) => response.json())
            .then((data) => {
                const countryCode = data.country_code.toUpperCase();

                setPhoneCountry(countryCode);
                setValue("contactcountry", countryCode);
                setValue("contactcountryname", (data?.country_name || "").toUpperCase());
                setValue("contactcurrency", data?.currency || "");
                setValue("contactdocumenttype", countryCode === "PE" ? 6 : 0);
            });

        fetchData();

        return () => {
            dispatch(resetMain());
        };
    }, [dispatch]);

    useEffect(() => {
        const cost = Number(getValues("recharge.rechargeamount")) || 0;
        const subtotal = (remainingDaysFromSubscription === 0 ? 0 : (((planData?.plan?.planCost || 0) * remainingDaysFromSubscription) / daysInCurrentMonth)) + cost;

        if (values.contactcountry === "PE") {
            setAccounting({
                subtotal: subtotal.toFixed(2),
                taxes: (subtotal * 0.18).toFixed(2),
                total: (subtotal * 1.18).toFixed(2),
            })
        } else if (values.contactcountry === "CO") {
            setAccounting({
                subtotal: subtotal.toFixed(2),
                taxes: (subtotal * 0.19).toFixed(2),
                total: (subtotal * 1.19).toFixed(2),
            })
        } else {
            setAccounting({
                subtotal: subtotal.toFixed(2),
                taxes: "0.00",
                total: subtotal.toFixed(2),
            })
        }
    }, [values.contactcountry, values.recharge.rechargeamount]);

    return (
        <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100vh", padding: "30px 4%", overflowY: "auto" }}>
            <div className={classes.containerBorder}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3 style={{ margin: "0px", alignContent: "center" }}>{t(langKeys.billingforinformation)}</h3>
                    <FormControl component="fieldset">
                        <Controller
                            name="iscompany"
                            control={control}
                            defaultValue={true}
                            render={({ field }) => (
                                <RadioGroup {...field} row
                                    onChange={(e) => {
                                        setValue("iscompany", e.target.value === "true")
                                        setValue("companyname", "")
                                        setValue("companydocument", "")
                                        setValue("contactdocumenttype", 0)
                                    }}
                                >
                                    <FormControlLabel value={true} control={<Radio color="primary" />} label={t(langKeys.business)} />
                                    <FormControlLabel value={false} control={<Radio color="primary" />} label={t(langKeys.person)} />
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                </div>
                <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                    <Controller
                        control={control}
                        name="contactnameorcompany"
                        render={({ field, formState: { errors } }) => (
                            <div className="col-6">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.subscription_companyorname)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <TextField
                                    {...field}
                                    style={{ marginTop: 0 }}
                                    error={Boolean(errors.contactnameorcompany)}
                                    fullWidth
                                    helperText={errors.contactnameorcompany?.message}
                                    margin="normal"
                                    size="small"
                                    variant="outlined"
                                    inputProps={{ maxLength: 300 }}
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) {
                                    return `${t(langKeys.field_required)}`;
                                }
                            },
                        }}
                    />
                    <Controller
                        control={control}
                        name="contactdocumenttype"
                        render={({ field: { onChange }, formState: { errors } }) => (
                            <div className="col-3">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.docType)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <FieldSelect
                                    data={getValues("contactcountry") === "PE" ? (getValues("iscompany") ? dataBillingCompanyPeru : dataBillingPersonPeru) : (getValues("contactcountry") === "CO" ? (getValues("iscompany") ? dataBillingCompanyColombia : dataBillingPersonColombia) : (getValues("iscompany") ? dataBillingOtherCompany : dataBillingOtherPerson))}
                                    error={errors.contactdocumenttype?.message}
                                    optionDesc="desc"
                                    optionValue="id"
                                    style={{ marginTop: 0 }}
                                    valueDefault={getValues("contactdocumenttype")}
                                    variant="outlined"
                                    onChange={(data) => {
                                        onChange(data?.id || (data?.id === 0 ? "0" : null));
                                    }}
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => {
                                if (value === null || value === undefined) {
                                    return `${t(langKeys.field_required)}`;
                                }
                            },
                        }}
                    />
                    <Controller
                        control={control}
                        name="contactdocumentnumber"
                        render={({ field, formState: { errors } }) => (
                            <div className="col-3">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.subscription_documentnumber)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <TextField
                                    {...field}
                                    error={Boolean(errors.contactdocumentnumber)}
                                    fullWidth
                                    helperText={errors.contactdocumentnumber?.message}
                                    margin="normal"
                                    style={{ marginTop: 0 }}
                                    size="small"
                                    type="numeric"
                                    variant="outlined"
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => validateDocumentType(value, getValues("contactdocumenttype")),
                        }}
                    />
                </div>
                <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                    <Controller
                        control={control}
                        name="contactmail"
                        render={({ field, formState: { errors } }) => (
                            <div className="col-6">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.subscription_email)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <TextField
                                    {...field}
                                    className="col-6"
                                    error={Boolean(errors.contactmail)}
                                    fullWidth
                                    helperText={errors.contactmail?.message}
                                    margin="normal"
                                    size="small"
                                    variant="outlined"
                                    inputProps={{ maxLength: 300 }}
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => {
                                if (value?.length === 0) return `${t(langKeys.field_required)}`;
                                else if (!/\S+@\S+\.\S+/.test(value)) return `${t(langKeys.emailverification)}`;
                            },
                        }}
                    />
                    <Controller
                        control={control}
                        name="contactphone"
                        render={({ field, formState: { errors } }) => (
                            <div className="col-6">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.phone)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <CssPhonemui
                                    {...field}
                                    countryCodeEditable={false}
                                    defaultCountry={phoneCountry.toLowerCase()}
                                    error={Boolean(errors?.contactphone)}
                                    fullWidth
                                    helperText={errors?.contactphone?.message}
                                    margin="normal"
                                    size="small"
                                    variant="outlined"
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) return `${t(langKeys.field_required)}`;
                                else if (value.length < 10) return `${t(langKeys.validationphone)}`;
                            },
                        }}
                    />
                </div>
                <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                    <Controller
                        control={control}
                        name="contactaddress"
                        render={({ field, formState: { errors } }) => (
                            <div className="col-9">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {getValues("iscompany") ? t(langKeys.subscription_businessaddress) : t(langKeys.subscription_address)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <TextField
                                    {...field}
                                    error={Boolean(errors.contactaddress)}
                                    fullWidth
                                    style={{ marginTop: 0 }}
                                    helperText={errors.contactaddress?.message}
                                    margin="normal"
                                    size="small"
                                    variant="outlined"
                                    inputProps={{ maxLength: 300 }}
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) {
                                    return `${t(langKeys.field_required)}`;
                                }
                            },
                        }}
                    />
                    <Controller
                        control={control}
                        name="contactcountry"
                        render={({ field: { onChange }, formState: { errors } }) => (
                            <div className="col-3">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.country)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <FieldSelect
                                    className="col-3"
                                    data={dataCountry}
                                    error={errors.contactcountry?.message}
                                    optionDesc="description"
                                    optionValue="code"
                                    size="small"
                                    style={{ marginTop: 0 }}
                                    valueDefault={getValues("contactcountry")}
                                    variant="outlined"
                                    onChange={(data) => {
                                        onChange(data?.code || "");
                                        setValue("citybillingid", 0);
                                        setValue("contactdocumenttype", data?.code === "PE" ? (getValues("iscompany") ? 6 : 1) : (data?.code === "CO" ? (getValues("iscompany") ? 31 : 13) : 0));
                                        setPhoneCountry(data?.code || "");
                                    }}
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => {
                                if (value === null || value === undefined) return `${t(langKeys.field_required)}`;
                            },
                        }}
                    />
                </div>
                {getValues("contactcountry") === "CO" && <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                    <Controller
                        control={control}
                        name="citybillingid"
                        render={({ field: { onChange }, formState: { errors } }) => (
                            <div className="col-12" style={{ padding: 0 }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.citybilling)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <FieldSelect
                                    className="col-12"
                                    data={planData?.plan?.cityList}
                                    error={errors.citybillingid?.message}
                                    optionDesc="locationdescription"
                                    optionValue="citybillingid"
                                    size="small"
                                    style={{ marginTop: 0 }}
                                    valueDefault={getValues("citybillingid")}
                                    variant="outlined"
                                    onChange={(data) => {
                                        setValue("citybillingid", data?.citybillingid);
                                    }}
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => {
                                if (getValues("contactcountry") !== "CO") return true
                                if (value === null || value === undefined) return `${t(langKeys.field_required)}`;
                            },
                        }}
                    />
                </div>}
                {getValues("iscompany") && <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                    <Controller
                        control={control}
                        name="companyname"
                        render={({ field, formState: { errors } }) => (
                            <div className="col-9">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.businessname)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <TextField
                                    {...field}
                                    error={Boolean(errors.companyname)}
                                    fullWidth
                                    style={{ marginTop: 0 }}
                                    helperText={errors.companyname?.message}
                                    margin="normal"
                                    size="small"
                                    variant="outlined"
                                    inputProps={{ maxLength: 300 }}
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => {
                                if (getValues("iscompany")) {
                                    if (value.length === 0 || !value) {
                                        return `${t(langKeys.field_required)}`;
                                    }
                                }
                                return true;
                            },
                        }}
                    />
                    <Controller
                        control={control}
                        name="companydocument"
                        render={({ field, formState: { errors } }) => (
                            <div className="col-3">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.taxidentifier)}<div style={{ color: "red" }}>*</div>
                                </Box>
                                <TextField
                                    {...field}
                                    error={Boolean(errors.companydocument)}
                                    fullWidth
                                    style={{ marginTop: 0 }}
                                    helperText={errors.companydocument?.message}
                                    margin="normal"
                                    size="small"
                                    type="numeric"
                                    variant="outlined"
                                />
                            </div>
                        )}
                        rules={{
                            validate: (value) => {
                                if (getValues("iscompany")) {
                                    if (value.length === 0 || !value) {
                                        return `${t(langKeys.field_required)}`;
                                    }
                                }
                                return true;
                            },
                        }}
                    />
                </div>}
            </div>
            <div style={{ display: "flex", gap: 8 }} className={classes.containerOther}>
                <div className={classes.containerBorder} style={{ marginTop: "20px", width: "30%" }}>
                    <div style={{ width: "100%" }}>
                        <div>
                            <h3
                                style={{
                                    margin: "0px",
                                    color: "#7721ad",
                                    textAlign: "center",
                                }}
                            >
                                {t(langKeys.suscription)}
                            </h3>
                            <h3
                                style={{
                                    margin: "0px",
                                    color: "#7721ad",
                                    textAlign: "center",
                                }}
                            >
                                PLAN {planData?.plan?.plan}
                            </h3>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <h3 style={{ textAlign: "center", margin: "0 5px 0 0" }}>
                                    <b>${planData?.plan?.planCost}</b>
                                </h3>
                                <p style={{ textAlign: "center", margin: "0" }}>
                                    <b>USD</b>
                                </p>
                            </div>
                            <p
                                style={{
                                    textAlign: "center",
                                    margin: "0px",
                                }}>
                                {" "}
                                <b>
                                    {t(langKeys.monthlys).toLocaleLowerCase()}
                                </b>
                            </p>
                            <h3
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                {t(langKeys.summaryofplan)}
                            </h3>
                            <div style={{ whiteSpace: "pre-wrap", "textAlign": "center" }}>{t(langKeys.subscription_language) === "english" ? planData?.plan?.descriptionen : planData?.plan?.descriptiones}</div>
                        </div>
                    </div>
                </div>
                <div className={classes.containerBorder} style={{ marginTop: "20px", width: "70%" }}>
                    <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
                        <div className={classes.containerInfoPay}>
                            <h3 style={{ margin: "0px" }}>{t(langKeys.creditcard)}</h3>
                            <div style={{ display: "flex" }}>
                                <img
                                    alt="visa"
                                    src="https://static.culqi.com/v2/v2/static/img/visa.svg"
                                    style={{ padding: 5 }}
                                    width="50px"
                                ></img>
                                <img
                                    alt="mastercard"
                                    src="https://static.culqi.com/v2/v2/static/img/mastercard.svg"
                                    style={{ padding: 5 }}
                                    width="50px"
                                ></img>
                                <img
                                    alt="ammex"
                                    src="https://static.culqi.com/v2/v2/static/img/amex.svg"
                                    style={{ padding: 5 }}
                                    width="50px"
                                ></img>
                                <img
                                    alt="dinners"
                                    src="https://static.culqi.com/v2/v2/static/img/diners.svg"
                                    style={{ padding: 5 }}
                                    width="50px"
                                ></img>
                            </div>
                            <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                                <Controller
                                    control={control}
                                    name="cardname"
                                    render={({ field, formState: { errors } }) => (
                                        <div className="col-12">
                                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                                {t(langKeys.openpay_message02)}
                                            </Box>
                                            <TextField
                                                {...field}
                                                style={{ marginTop: 0 }}
                                                error={Boolean(errors.cardname)}
                                                fullWidth
                                                helperText={errors.cardname?.message}
                                                margin="normal"
                                                size="small"
                                                variant="outlined"
                                                inputProps={{ maxLength: 300 }}
                                            />
                                        </div>
                                    )}
                                    rules={{
                                        validate: (value) => {
                                            if (value.length === 0) {
                                                return `${t(langKeys.field_required)}`;
                                            }
                                        },
                                    }}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginBottom: "-10px" }}><div className="col-12">
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.paymentorder_cardnumber)}
                                </Box>
                                <Controller
                                    control={control}
                                    name="cardnumber"
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            className="col-12"
                                            style={{ marginTop: 0 }}
                                            error={Boolean(errors.cardnumber)}
                                            fullWidth
                                            helperText={errors.cardnumber?.message}
                                            margin="normal"
                                            size="small"
                                            variant="outlined"
                                            inputProps={{
                                                maxLength: limitNumbers,
                                            }}
                                            InputProps={{
                                                endAdornment: icon,
                                            }}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                const spaces = Math.floor(val.length / 4);

                                                let partialvalue = val.slice(0, 4);

                                                for (let i = 1; i <= spaces; i++) {
                                                    partialvalue += " " + val.slice(i * 4, (i + 1) * 4);
                                                }

                                                setValue("cardnumber", partialvalue.trim());
                                            }}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.value.startsWith("4")) {
                                                    setIcon(
                                                        <img
                                                            alt="visa"
                                                            src="https://static.culqi.com/v2/v2/static/img/visa.svg"
                                                            style={{ padding: 5 }}
                                                            width="50px"
                                                        ></img>
                                                    );
                                                    setLimitNumbers(19);
                                                } else if (
                                                    e.target.value.startsWith("51") ||
                                                    e.target.value.startsWith("55")
                                                ) {
                                                    setIcon(
                                                        <img
                                                            alt="mastercard"
                                                            src="https://static.culqi.com/v2/v2/static/img/mastercard.svg"
                                                            style={{ padding: 5 }}
                                                            width="50px"
                                                        ></img>
                                                    );
                                                    setLimitNumbers(19);
                                                } else if (
                                                    e.target.value.startsWith("37") ||
                                                    e.target.value.startsWith("34")
                                                ) {
                                                    setIcon(
                                                        <img
                                                            alt="ammex"
                                                            src="https://static.culqi.com/v2/v2/static/img/amex.svg"
                                                            style={{ padding: 5 }}
                                                            width="50px"
                                                        ></img>
                                                    );
                                                    setLimitNumbers(18);
                                                } else if (
                                                    e.target.value.startsWith("36") ||
                                                    e.target.value.startsWith("38") ||
                                                    e.target.value.startsWith("300") ||
                                                    e.target.value.startsWith("305")
                                                ) {
                                                    setIcon(
                                                        <img
                                                            alt="dinners"
                                                            src="https://static.culqi.com/v2/v2/static/img/diners.svg"
                                                            style={{ padding: 5 }}
                                                            width="50px"
                                                        ></img>
                                                    );
                                                    setLimitNumbers(17);
                                                } else {
                                                    setIcon(<></>);
                                                    setLimitNumbers(24);
                                                }
                                            }}
                                            onPaste={(e) => {
                                                e.preventDefault();
                                            }}
                                        />
                                    )}
                                    rules={{
                                        validate: (value) => {
                                            if (value?.length === 0) return `${t(langKeys.field_required)}`;
                                            else if (value?.length !== limitNumbers || limitNumbers < 12)
                                                return `${t(langKeys.creditcardvalidate)}`;
                                        },
                                    }}
                                />
                            </div>
                            </div>
                            <div className="row-zyx" style={{ marginBottom: 0 }}>
                                <div className="row-zyx col-12" style={{ marginBottom: 0 }} >
                                    <div className="row-zyx col-8" style={{ marginBottom: 0 }}>
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary" style={{ display: "flex", marginBottom: "6px" }}>
                                            {t(langKeys.dueDate)}
                                        </Box>
                                        <Controller
                                            control={control}
                                            name="cardmonth"
                                            render={({ field, formState: { errors } }) => (
                                                <TextField
                                                    {...field}
                                                    className="col-6"
                                                    error={Boolean(errors.cardmonth)}
                                                    fullWidth
                                                    helperText={errors.cardmonth?.message}
                                                    label={"MM"}
                                                    margin="normal"
                                                    size="small"
                                                    style={{ marginTop: 0 }}
                                                    type="number"
                                                    variant="outlined"
                                                    inputProps={{
                                                        maxLength: 2,
                                                    }}
                                                />
                                            )}
                                            rules={{
                                                validate: (value) => {
                                                    if (value?.length !== 2) return `${t(langKeys.field_required)}`;
                                                },
                                            }}
                                        />
                                        <Controller
                                            control={control}
                                            name="cardyear"
                                            render={({ field, formState: { errors } }) => (
                                                <TextField
                                                    {...field}
                                                    className="col-6"
                                                    error={Boolean(errors.cardyear)}
                                                    fullWidth
                                                    helperText={errors.cardyear?.message}
                                                    label={"YYYY"}
                                                    margin="normal"
                                                    size="small"
                                                    style={{ marginTop: 0 }}
                                                    type="number"
                                                    variant="outlined"
                                                    inputProps={{
                                                        maxLength: 4,
                                                    }}
                                                />
                                            )}
                                            rules={{
                                                validate: (value) => {
                                                    if (value?.length !== 4) return `${t(langKeys.field_required)}`;
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="row-zyx col-4" style={{ marginBottom: 0 }}>
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary" style={{ display: "flex", marginBottom: "6px" }}>
                                            CCV
                                        </Box>
                                        <Controller
                                            control={control}
                                            name="cardsecuritycode"
                                            render={({ field, formState: { errors } }) => (
                                                <TextField
                                                    {...field}
                                                    className="col-12"
                                                    error={Boolean(errors.cardsecuritycode)}
                                                    fullWidth
                                                    helperText={errors.cardsecuritycode?.message}
                                                    label="CCV"
                                                    margin="normal"
                                                    size="small"
                                                    type="password"
                                                    style={{ marginTop: 0 }}
                                                    variant="outlined"
                                                    inputProps={{
                                                        maxLength: limitNumbers === 18 ? 4 : 3,
                                                    }}
                                                />
                                            )}
                                            rules={{
                                                validate: (value) => {
                                                    if (value?.length === 0) return `${t(langKeys.field_required)}`;
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={classes.containerInfoPay}>
                            <div style={{ display: "flex", height: "100%" }}> <div
                                style={{
                                    textAlign: "center",
                                    border: "1px solid #50ab54",
                                    borderRadius: "15px",
                                    padding: "20px",
                                    paddingTop: "auto",
                                    color: "#50ab54",
                                    height: "inherit",
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <div style={{ display: "block" }}> <LockIcon style={{ height: 60, width: 60 }} />
                                    <h2 style={{ marginTop: "4px", marginBottom: "4px" }}>{t(langKeys.safepurchase)}</h2>
                                    <p>{t(langKeys.finishregwarn2)}</p></div>
                            </div></div>
                        </div>
                    </div>
                </div>
            </div>
            <Tooltip TransitionComponent={Zoom} title={t(langKeys.signupcond4)}>
                <p><i>{t(langKeys.signupcond1)}</i>*</p>
            </Tooltip>
            <div className={classes.containerBorder}>
                <h3 style={{ fontWeight: "bold", marginTop: 0 }}>{t(langKeys.signupcond2)}</h3>
                <p style={{ margin: 0 }}>{t(langKeys.signupcond3)}</p>
                <div style={{ display: "flex", margin: "15px 20%", gap: "15%", justifyContent: "space-between" }}>
                    <div className={classes.containerBorder} style={{ width: 240, cursor: "pointer", position: "relative", borderColor: ((Number(getValues("recharge.rechargeamount")) || 0) === 100 ? "green" : "#7721ad") }}
                        onClick={() => {
                            const currentval = getValues("recharge.rechargeamount") || 0;
                            setValue("recharge.rechargeamount", parseFloat(`${currentval}`) + 100);
                        }}>
                        <div style={{ position: "absolute", top: "0px", right: "7px", color: ((Number(getValues("recharge.rechargeamount")) || 0) === 100 ? "green" : "#7721ad") }}>+</div>
                        <div style={{ position: "absolute", top: "1px", right: "6px", color: ((Number(getValues("recharge.rechargeamount")) || 0) === 100 ? "green" : "#7721ad") }}>O</div>
                        <h3 style={{ fontWeight: "bold", color: ((Number(getValues("recharge.rechargeamount")) || 0) === 100 ? "green" : "#7721ad"), textAlign: "center", margin: 0, fontSize: 25, paddingTop: 10.5 }}>$100 USD</h3>
                    </div>
                    <div className={classes.containerBorder} style={{ width: 240 }}>
                        <Controller
                            control={control}
                            name="recharge.rechargeamount"
                            render={({ field, formState: { errors } }) => (
                                <div className="col-12">
                                    <span style={{ display: "inline-block", position: "relative", overflow: "hidden" }}>
                                        {getValues("recharge.rechargeamount") && <span style={{ color: errors?.recharge?.rechargeamount?.message ? "red" : "#3F3F3F", position: "absolute", fontSize: "25px", right: (50 - (8 * `${Number(getValues("recharge.rechargeamount")) || 0}`.length)), top: "9px" }}>USD</span>}
                                        {getValues("recharge.rechargeamount") && <span style={{ color: errors?.recharge?.rechargeamount?.message ? "red" : "#3F3F3F", position: "absolute", fontSize: "25px", left: (90 - (8 * `${Number(getValues("recharge.rechargeamount")) || 0}`.length)), top: "9px" }}>$</span>}
                                        <TextField
                                            {...field}
                                            error={Boolean(errors?.recharge?.rechargeamount?.message)}
                                            fullWidth
                                            style={{ marginTop: 0, color: "#3F3F3F" }}
                                            helperText={""}
                                            margin="normal"
                                            size="small"
                                            variant="outlined"
                                            type="numeric"
                                            inputProps={{ className: errors?.recharge?.rechargeamount?.message ? classes.centeredPlaceholderError : classes.centeredPlaceholder }}
                                            placeholder="$20 USD"
                                            className={`${classes.noBorder} ${classes.customFontSize}`}
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            onPaste={(event) => {
                                                event.preventDefault();
                                            }}
                                        />
                                    </span>
                                </div>
                            )}
                            rules={{
                                validate: (value) => {
                                    if (value) {
                                        if (value < 20) {
                                            return `${t(langKeys.errorvaluebiggerthan, { value: 20 })}`;
                                        }
                                    }
                                },
                            }}
                        /></div>
                </div>
                <div style={{ display: "flex", margin: "15px 20%", gap: "15%", justifyContent: "space-between" }}>
                    <div style={{ width: 240, textAlign: "center", margin: 0 }}>
                        <p style={{ margin: 0 }}>{t(langKeys.suggestedamount)}</p>
                    </div>
                    <div style={{ width: 240, textAlign: "center", margin: 0 }}>
                        <p style={{ margin: 0 }}>{t(langKeys.addminimum)} $20</p>
                    </div>
                </div>
            </div>
            <div>
                <div style={{ marginTop: 10, display: "flex", justifyContent: "end" }}>
                    <p style={{ fontWeight: "bold", textAlign: "center", margin: 5 }}>{t(langKeys.subscription_subtotal)}</p>
                    <div className={classes.containerBorder} style={{ width: 150, padding: 5, }}>
                        <p style={{ fontWeight: "bold", textAlign: "center", margin: 0 }}>${accounting.subtotal} USD</p>
                    </div>
                </div>
                <div style={{ marginTop: 10, display: "flex", justifyContent: "end" }}>
                    <p style={{ fontWeight: "bold", textAlign: "center", margin: 5 }}>{t(langKeys.subscription_taxes)}</p>
                    <div className={classes.containerBorder} style={{ width: 150, padding: 5, border: "0px solid" }}>
                        <p style={{ fontWeight: "bold", textAlign: "center", margin: 0 }}>${accounting.taxes} USD</p>
                    </div>
                </div>
                <div style={{ marginTop: 10, display: "flex", justifyContent: "end" }}>
                    <p style={{ fontWeight: "bold", textAlign: "center", margin: 5 }}>{t(langKeys.subscription_total)}</p>
                    <div className={classes.containerBorder} style={{ width: 150, padding: 5, }}>
                        <p style={{ fontWeight: "bold", textAlign: "center", margin: 0 }}>${accounting.total} USD</p>
                    </div>
                </div>
            </div>
            <hr></hr>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                    className={commonClasses.button}
                    color="primary"
                    disabled={insertResult.loading}
                    style={{ marginTop: "10px", maxWidth: "340px", marginLeft: "auto", marginRight: "auto" }}
                    variant="contained"
                    onClick={(e) => {
                        e.preventDefault();
                        finishRegister();
                    }}
                >
                    <Trans i18nKey={langKeys.pay} />
                </Button>
            </div>
        </div>
    );
};

export default SecondStep;