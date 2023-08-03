/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useContext, useEffect, useState } from "react";
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

    const { getValues, setValue, control, trigger } = useFormContext<MainData>();
    const { setStep } = useContext(SubscriptionContext);

    const mainResult = useSelector(state => state.main.mainData);
    const ressignup = useSelector(state => state.signup.countryList);

    const [phoneCountry, setPhoneCountry] = useState('');

    const fetchData = () => dispatch(getCollectionPublic(getValuesFromDomain("REASONSSIGNUP")));
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

    const { t } = useTranslation();
    const classes = useChannelAddStyles();

    return (
        <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                    {'<< '}<Trans i18nKey={langKeys.previoustext} />
                </Link>
            </Breadcrumbs>
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

        </div>
    )
}

export default SecondStep