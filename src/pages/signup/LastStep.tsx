/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect, useState } from "react";
import { makeStyles, Button, Breadcrumbs, Link } from '@material-ui/core';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";

import { useSelector } from 'hooks';
import { useDispatch } from "react-redux";

import { getMultiCollectionPublic } from "store/main/actions";
import { FieldSelect } from "components";
import { MainData, SubscriptionContext } from "./context";
import { Controller, useFormContext } from "react-hook-form";
import { IDomain } from "@types";

const useChannelAddStyles = makeStyles(theme => ({
    button: {
        padding: 12,
        fontWeight: "bold",
        fontSize: '40px',
        //textTransform: 'initial',
        width: "100%"
    },
    buttonGoogle: {
        '& button': {
            fontSize: '24px!important',
            justifyContent: 'center',
            fontFamily: "Helvetica,sans-serif!important",
            width: "50%",
            marginLeft: "25%",
            marginBottom: '20px'
        }
    },
    separator: {
        borderBottom: "grey solid 1px",
        width: "10vh",
        height: "1.6vh",
        margin: "0 40px"
    },
}));

interface LastStepProps {
    setOpenWarning: (param: any) => void;
}

const Step2Six: FC<LastStepProps> = ({ setOpenWarning }) => {
    const { setStep } = useContext(SubscriptionContext);
    const { control, trigger } = useFormContext<MainData>();
    const { t } = useTranslation();
    const classes = useChannelAddStyles();
    const dispatch = useDispatch();
    const [industryList, setindustryList] = useState<any>([]);
    const [companySizeList, setcompanySizeList] = useState<any>([]);
    const [roleList, setroleList] = useState<any>([]);
    const multiResult = useSelector(state => state.main.multiData.data);
    const executeResult = useSelector(state => state.signup.insertChannel);

    useEffect(() => {
        dispatch(getMultiCollectionPublic(["SignUpIndustry", "SignUpCompanySize", "SignUpRoles"]));
    }, []);

    useEffect(() => {
        if (multiResult.length) {
            setindustryList(multiResult[0].data)
            setcompanySizeList(multiResult[1].data)
            setroleList(multiResult[2].data)
        }
    }, [multiResult]);

    return (
        <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="textSecondary"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        setOpenWarning(true);
                    }}
                >
                    {'<< '}<Trans i18nKey={langKeys.previoustext} />
                </Link>
            </Breadcrumbs>
            <div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "2em", color: "#7721ad", padding: "20px" }}>{t(langKeys.laststepsignup)}</div>
                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1em", padding: "20px" }}>{t(langKeys.laststepsignup2)}</div>
            </div>

            {/*<div style={{ padding: "20px" }}>
                <Controller
                    name="industry"
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
                            uset
                            onChange={(data: IDomain) => {
                                onChange(data?.domainvalue || "");
                            }}
                            variant="outlined"
                            style={{ marginBottom: "20px" }}
                            label={t(langKeys.industry)}
                            error={errors.industry?.message}
                            data={industryList as IDomain[]}
                            prefixTranslation="industry_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    )}
                />
                <Controller
                    name="companysize"
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
                            uset
                            onChange={(data: IDomain) => {
                                onChange(data?.domainvalue || "");
                            }}
                            variant="outlined"
                            style={{ marginBottom: "20px" }}
                            label={t(langKeys.companysize)}
                            error={errors.companysize?.message}
                            data={companySizeList as IDomain[]}
                            prefixTranslation="companysize_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    )}
                />
                <Controller
                    name="rolecompany"
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
                            uset
                            onChange={(data: IDomain) => {
                                onChange(data?.domainvalue || "");
                            }}
                            variant="outlined"
                            style={{ marginBottom: "20px" }}
                            label={t(langKeys.roleincompany)}
                            error={errors.rolecompany?.message}
                            data={roleList as IDomain[]}
                            prefixTranslation="companyrole_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    )}
                />
                <div>
                    <Button
                        onClick={async () => {
                            const valid = await trigger();
                            if (valid) {
                                setStep(3);
                            }
                        }}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={executeResult.loading}
                    >
                        <Trans i18nKey={langKeys.next} />
                    </Button>
                </div>

            </div>*/}
        </div>
    )
}

export default Step2Six