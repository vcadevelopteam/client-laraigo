/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useMemo, useState } from "react";
import { makeStyles, Button, TextField, Breadcrumbs } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { FieldSelect, FieldView } from "components";
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
    fieldview: {
        paddingTop: 10,
    }
}));

const Step2five: FC<{ setOpenWarning: (param: any) => void }> = ({ setOpenWarning }) => {
    const { setStep } = useContext(SubscriptionContext);
    const { getValues, control, trigger } = useFormContext<MainData>();
    const { t } = useTranslation();

    //const [docType, setDocType] = useState(getValues('doctype') || 0);

    const databilling = useMemo(() => ([
        { id: 1, desc: t(langKeys.billingfield_billingdni) },
        { id: 2, desc: t(langKeys.billingfield_billingextra) },
        { id: 3, desc: t(langKeys.billingfield_billingruc) },
    ]), [t]);

    const docTypeValidate = (docnum: string, docType: number) => {
        if (!docnum) {
            return t(langKeys.field_required);
        }

        let msg = "";
        switch (docType) {
            case 1: // DNI
                msg = t(langKeys.doctype_dni_error);
                return docnum.length !== 8 ? msg : undefined;
            case 2: // CARNET DE EXTRANJERIA
                msg = t(langKeys.doctype_foreigners_card);
                return docnum.length <= 12 ? msg : undefined;
            case 3: // REG. UNICO DE CONTRIBUYENTES
                msg = t(langKeys.doctype_ruc_error);
                return docnum.length !== 11 ? msg : undefined;
            default: return t(langKeys.doctype_unknown_error);
        }
    }

    const classes = useChannelAddStyles();
    return (
        <div style={{ marginTop: "auto", marginBottom: "auto", maxHeight: "100%" }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key={"mainview"} href="/" onClick={(e) => { e.preventDefault(); setOpenWarning(true) }}>
                    {'<< '}<Trans i18nKey={langKeys.previoustext} />
                </Link>
            </Breadcrumbs>
            <div style={{ textAlign: "center", fontWeight: 500, fontSize: 32, color: "#7721ad", marginTop: 15 }}>{t(langKeys.signupstep1title25)}</div>
            {/*<>
                {getValues('doctype') === 0 ?
                    <FieldView
                        className={classes.fieldview}
                        label={t(langKeys.docType)}
                        value={t(langKeys.billingfield_billingno)}
                    /> :
                    <Controller
                        name="doctype"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value === null || value === undefined) {
                                    return t(langKeys.field_required) as string;
                                }
                            }
                        }}
                        render={({ field: { onChange }, formState: { errors } }) => (
                            <FieldSelect
                                onChange={(data: typeof databilling[number]) => {
                                    onChange(data?.id || "");
                                    setDocType(data?.id || 0);
                                }}
                                variant="outlined"
                                style={{ marginTop: 8 }}
                                valueDefault={getValues('doctype')}
                                label={t(langKeys.docType)}
                                error={errors.doctype?.message}
                                data={databilling}
                                optionDesc="desc"
                                optionValue="id"
                            />
                        )}
                    />
                }

                {getValues('doctype') !== 0 &&
                    <Controller
                        name="docnumber"
                        control={control}
                        rules={{
                            validate: value => docTypeValidate(
                                value,
                                getValues('doctype'),
                            ),
                        }}
                        render={({ field, formState: { errors } }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                size="small"
                                label={t(langKeys.docNumber)}
                                error={!!errors.docnumber}
                                helperText={errors.docnumber?.message}
                                type="number"
                            />
                        )}
                    />
                }
                <Controller
                    name="businessname"
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
                            label={(docType === 1 || docType === 2) ? t(langKeys.name) : t(langKeys.businessname)}
                            error={!!errors.businessname}
                            helperText={errors.businessname?.message}
                        />
                    )}
                />
                <Controller
                    name="fiscaladdress"
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
                            label={t(langKeys.fiscaladdress)}
                            error={!!errors.fiscaladdress}
                            helperText={errors.fiscaladdress?.message}
                        />
                    )}
                />
                <Controller
                    name="billingcontact"
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
                            label={t(langKeys.billingcontact)}
                            error={!!errors.billingcontact}
                            helperText={errors.billingcontact?.message}
                        />
                    )}
                />
                <Controller
                    name="billingcontactmail"
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (value.length === 0) {
                                return t(langKeys.field_required) as string;
                            } else if (!/\S+@\S+\.\S+/.test(value)) {
                                return t(langKeys.emailverification) as string;
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
                            label={t(langKeys.billingcontactmail)}
                            error={!!errors.billingcontactmail}
                            helperText={errors.billingcontactmail?.message}
                        />
                    )}
                />
            </>*/}
            <Button
                onClick={async () => {
                    const valid = await trigger();
                    if (valid) {
                        setStep(2.6);
                    }
                }}
                className={classes.button}
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: 8 }}
            >
                <Trans i18nKey={langKeys.next} />
            </Button>
        </div>
    )
}

export default Step2five