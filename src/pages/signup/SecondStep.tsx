import { Breadcrumbs, Button, makeStyles, TextField } from "@material-ui/core";
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

import Link from "@material-ui/core/Link";
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
        padding: "18px",
    },
    containerInfoPay: {
        width: "50%",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        },
    },
    centeredElement: {
        alignItems: "center",
        display: "inline-block",
        height: "100%",
        justifyContent: "center",
    },
    containerOther: {
        [theme.breakpoints.down("xs")]: {
            flexWrap: "wrap",
        },
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

const SecondStep: FC<{ setOpenWarning: (param: boolean) => void }> = ({ setOpenWarning }) => {
    const { commonClasses, finishRegister } = useContext(SubscriptionContext);
    const { control, getValues, setValue } = useFormContext<MainData>();
    const { t } = useTranslation();

    const [icon, setIcon] = useState(<></>);
    const [limitNumbers, setLimitNumbers] = useState(24);
    const [phoneCountry, setPhoneCountry] = useState("");

    const classes = useChannelAddStyles();
    const countryResult = useSelector((state) => state.signup.countryList);
    const dispatch = useDispatch();
    const fetchData = () => dispatch(getCollectionPublic(getValuesFromDomain("REASONSSIGNUP")));
    const insertResult = useSelector((state) => state.signup.insertChannel);
    const planData = usePlanData();

    const validateDocumentType = (documentNumber: string, documentType: number) => {
        if (!documentNumber) {
            return t(langKeys.field_required);
        }

        switch (documentType) {
            case 1:
                return documentNumber.length !== 8 ? t(langKeys.doctype_dni_error) : undefined;
            case 2:
                return documentNumber.length <= 12 ? t(langKeys.doctype_foreigners_card) : undefined;
            case 3:
                return documentNumber.length !== 11 ? t(langKeys.doctype_ruc_error) : undefined;
            default:
                return t(langKeys.doctype_unknown_error);
        }
    };

    const dataBilling = useMemo(
        () => [
            { id: 1, desc: t(langKeys.billingfield_billingdni) },
            { id: 2, desc: t(langKeys.billingfield_billingextra) },
            { id: 3, desc: t(langKeys.billingfield_billingruc) },
        ],
        [t]
    );

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
                setValue("contactdocumenttype", countryCode === "PE" ? 1 : 0);
            });

        fetchData();

        return () => {
            dispatch(resetMain());
        };
    }, [dispatch]);

    return (
        <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="textSecondary"
                    href="/"
                    key={"mainview"}
                    onClick={(e) => {
                        e.preventDefault();
                        setOpenWarning(true);
                    }}
                >
                    {"<< "}
                    <Trans i18nKey={langKeys.previoustext} />
                </Link>
            </Breadcrumbs>
            <h1 className={classes.title}>{t(langKeys.addpaymentmethod)}</h1>
            <div style={{ padding: "0px", paddingBottom: "12px" }}>{t(langKeys.addpaymentmethodsub)}</div>
            <div className={classes.containerBorder}>
                <h3 style={{ margin: "0px" }}>{t(langKeys.subscription_billingregister)}</h3>
                <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                    <Controller
                        control={control}
                        name="contactdocumenttype"
                        render={({ field: { onChange }, formState: { errors } }) => (
                            <FieldSelect
                                className="col-3"
                                data={dataBilling}
                                error={errors.contactdocumenttype?.message}
                                label={t(langKeys.docType)}
                                optionDesc="desc"
                                optionValue="id"
                                style={{ marginTop: 16 }}
                                valueDefault={getValues("contactdocumenttype")}
                                variant="outlined"
                                onChange={(data: (typeof dataBilling)[number]) => {
                                    onChange(data?.id || "");
                                }}
                            />
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
                            <TextField
                                {...field}
                                className="col-3"
                                error={Boolean(errors.contactdocumentnumber)}
                                fullWidth
                                helperText={errors.contactdocumentnumber?.message}
                                label={t(langKeys.docNumber)}
                                margin="normal"
                                size="small"
                                type="number"
                                variant="outlined"
                            />
                        )}
                        rules={{
                            validate: (value) => validateDocumentType(value, getValues("contactdocumenttype")),
                        }}
                    />
                    <Controller
                        control={control}
                        name="contactnameorcompany"
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                className="col-6"
                                error={Boolean(errors.contactnameorcompany)}
                                fullWidth
                                helperText={errors.contactnameorcompany?.message}
                                label={t(langKeys.subscription_companyorname)}
                                margin="normal"
                                size="small"
                                variant="outlined"
                            />
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
                <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                    <Controller
                        control={control}
                        name="contactaddress"
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                className="col-9"
                                error={Boolean(errors.contactaddress)}
                                fullWidth
                                helperText={errors.contactaddress?.message}
                                label={t(langKeys.subscription_address)}
                                margin="normal"
                                size="small"
                                variant="outlined"
                            />
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
                            <FieldSelect
                                className="col-3"
                                data={dataCountry}
                                error={errors.contactcountry?.message}
                                label={t(langKeys.country)}
                                optionDesc="description"
                                optionValue="code"
                                style={{ marginTop: 16 }}
                                valueDefault={getValues("contactcountry")}
                                variant="outlined"
                                onChange={(data) => {
                                    onChange(data?.code || "");
                                    setValue("contactdocumenttype", data?.code === "PE" ? 1 : 0);
                                    setPhoneCountry(data?.code || "");
                                }}
                            />
                        )}
                        rules={{
                            validate: (value) => {
                                if (value === null || value === undefined) return `${t(langKeys.field_required)}`;
                            },
                        }}
                    />
                </div>
                <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                    <Controller
                        control={control}
                        name="contactmail"
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                className="col-6"
                                error={Boolean(errors.contactmail)}
                                fullWidth
                                helperText={errors.contactmail?.message}
                                label={t(langKeys.subscription_email)}
                                margin="normal"
                                size="small"
                                variant="outlined"
                            />
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
                            <CssPhonemui
                                {...field}
                                className="col-6"
                                countryCodeEditable={false}
                                defaultCountry={phoneCountry.toLowerCase()}
                                error={Boolean(errors?.contactphone)}
                                fullWidth
                                helperText={errors?.contactphone?.message}
                                label={t(langKeys.phone)}
                                margin="normal"
                                size="small"
                                variant="outlined"
                            />
                        )}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) return `${t(langKeys.field_required)}`;
                                else if (value.length < 10) return `${t(langKeys.validationphone)}`;
                            },
                        }}
                    />
                </div>
            </div>
            <div style={{ display: "flex", gap: 8 }} className={classes.containerOther}>
                <div className={classes.containerBorder} style={{ marginTop: "20px" }}>
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
                                    name="cardnumber"
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            className="col-12"
                                            error={Boolean(errors.cardnumber)}
                                            fullWidth
                                            helperText={errors.cardnumber?.message}
                                            label={t(langKeys.creditcard)}
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
                            <div className="row-zyx" style={{ marginBottom: "-10px" }}>
                                <div style={{ padding: "0px" }}>{t(langKeys.dueDate)}</div>
                                <Controller
                                    control={control}
                                    name="cardmonth"
                                    render={({ field, formState: { errors } }) => (
                                        <TextField
                                            {...field}
                                            className="col-3"
                                            error={Boolean(errors.cardmonth)}
                                            fullWidth
                                            helperText={errors.cardmonth?.message}
                                            label={"MM"}
                                            margin="normal"
                                            size="small"
                                            style={{ marginTop: 8 }}
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
                                            className="col-9"
                                            error={Boolean(errors.cardyear)}
                                            fullWidth
                                            helperText={errors.cardyear?.message}
                                            label={"YYYY"}
                                            margin="normal"
                                            size="small"
                                            style={{ marginTop: 8 }}
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
                            <div className="row-zyx" style={{ marginBottom: "-10px" }}>
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
                                            label={t(langKeys.securitycode)}
                                            margin="normal"
                                            size="small"
                                            type="password"
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
                        <div className={classes.containerInfoPay}>
                            <div className={classes.centeredElement}>
                                <div
                                    style={{
                                        textAlign: "center",
                                        border: "1px solid #7721ad",
                                        borderRadius: "15px",
                                        margin: "10px",
                                        padding: "20px",
                                        paddingTop: "auto",
                                    }}
                                >
                                    {t(langKeys.finishregwarn)}
                                </div>
                                <div
                                    style={{
                                        textAlign: "center",
                                        color: "#7721ad",
                                        margin: "10px",
                                        padding: "20px",
                                        paddingBottom: "auto",
                                    }}
                                >
                                    {t(langKeys.finishregwarn2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.containerBorder} style={{ marginTop: "20px" }}>
                    <div style={{ width: "100%" }}>
                        <div>
                            <h3
                                style={{
                                    margin: "0px",
                                    color: "#7721ad",
                                    textAlign: "center",
                                }}
                            >
                                {t(langKeys.suscription)} {planData?.plan?.plan}
                            </h3>
                            <h3>
                                {" "}
                                <b>
                                    {planData?.plan?.planCost} {t(langKeys.subscription_signup_plandescription_01)}
                                </b>
                            </h3>
                            <p>
                                <b>
                                    {planData?.plan?.limitContact} {t(langKeys.subscription_signup_plandescription_02)}
                                </b>
                            </p>
                            <p>
                                <b>
                                    {planData?.plan?.numberAgentsHired}{" "}
                                    {t(langKeys.subscription_signup_plandescription_03)}
                                </b>
                            </p>
                            <p>
                                <ul>
                                    <li>{t(langKeys.subscription_signup_plandescription_04)}</li>
                                    <li>{t(langKeys.subscription_signup_plandescription_05)}</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Button
                className={commonClasses.button}
                color="primary"
                disabled={insertResult.loading}
                style={{ marginTop: "3em" }}
                variant="contained"
                onClick={(e) => {
                    e.preventDefault();
                    finishRegister();
                }}
            >
                <Trans i18nKey={langKeys.finishreg} />
            </Button>
        </div>
    );
};

export default SecondStep;