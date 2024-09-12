import React, { useEffect, useMemo, useState } from 'react'; // we need this to make JSX compile
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { FormControlLabel } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldEdit, FieldSelect, IOSSwitch } from 'components';
import { useSelector } from 'hooks';
import { getCountryList } from 'store/signup/actions';
import { useDispatch } from 'react-redux';
import { format, parse } from 'date-fns';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    }
}));

interface PartnersTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors;
}

const PartnersTabDetail: React.FC<PartnersTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const countryList = useSelector(state => state.signup.countryList);
    const dispatch = useDispatch();
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const [docType, setDocType] = useState(row?.documenttype);
    const [priceBag, setPriceBag] = useState(row?.priceperbag || '');
    const [puContacts, setPuContacts] = useState(row?.puadditionalcontacts || '');
    const [docNumber, setDocNumber] = useState(row?.documentnumber);
    const [sunatCountry, setSunatCountry] = useState(row?.country);
    const [additionalContactType, setAdditionAlcontactType] = useState(row?.typecalculation);
    const [isEnterprise, setIsEnterprise] = useState(row?.enterprisepartner);
    const [isAutomaticDrafts, setIsAutomaticDrafts] = useState(row?.automaticgenerationdrafts);
    const [isAutomaticPeriod, setIsAutomaticPeriod] = useState(row?.automaticperiodgeneration);
    const [montlyplancost, setMontlyPlancost] = useState(row?.montlyplancost || 0);
    const [contactsperplan, setContactsPerPlan] = useState(row?.numberplancontacts || 0);

    const signatureDateDefault = row?.signaturedate
    ? format(parse(row.signaturedate, 'dd/MM/yyyy HH:mm:ss', new Date()), 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        dispatch(getCountryList())
    }, []);

    const countries = useMemo(() => {
        if (countryList.loading) return [];
        return countryList.data.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });
    }, [countryList]);

    const handleCountryChange = (value: any) => {
        const selectedCountry = value ? value.code : '';
        setSunatCountry(selectedCountry);
        setValue('country', selectedCountry);

        if (!selectedCountry) {
            setValue('documenttype', '');
            setDocType('');
            setValue('documentnumber', '');
            setDocNumber('');
        } else if (selectedCountry === 'PE') {
          setValue('documenttype', 'RUC');
          setDocType('RUC')
          setDocNumber(0)
          setValue('documentnumber', 0)
        } else {
          setValue('documenttype', 'NO DOMICILIADO');
          setDocType('NO DOMICILIADO')
          setValue('documentnumber', 0)
          setDocNumber(0)
        }
    };

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.country)}
                    valueDefault={sunatCountry}
                    onChange={(value) => {
                        handleCountryChange(value);
                    }}
                    className="col-6"
                    data={countries}
                    error={typeof errors?.country?.message === 'string' ? errors?.country?.message : ''}
                    optionValue="code"
                    optionDesc="description"
                />
                <FieldSelect
                    label={t(langKeys.billingperiod_billingcurrency)}
                    valueDefault={getValues('billingcurrency')}
                    onChange={(value) => setValue('billingcurrency', value.code)}
                    className="col-6"
                    data={(multiDataAux?.data?.[2]?.data||[])}
                    error={typeof errors?.billingcurrency?.message === 'string' ? errors?.billingcurrency?.message : ''}
                    optionValue="code"
                    optionDesc="description"
                />
                <FieldEdit
                    label={t(langKeys.documenttype)}
                    valueDefault={docType}
                    className="col-6"
                    error={typeof errors?.documenttype?.message === 'string' ? errors?.documenttype?.message : ''}
                    disabled={sunatCountry !== ''}
                />
                <FieldEdit
                    label={t(langKeys.documentnumber)}
                    type='number'
                    valueDefault={docNumber}
                    className="col-6"
                    error={
                        docType === 'RUC' && docNumber.length < 11
                            ? t(langKeys.rucvalidation)
                            : typeof errors?.documentnumber?.message === 'string'
                                ? errors?.documentnumber?.message
                                : ''
                    }
                    maxLength={docType === 'RUC' ? 11 : undefined}
                    onChange={(value) => {
                        if (docType === 'RUC') {
                            if (value.length > 11) {
                                setValue('documentnumber', value.slice(0, 11));
                                setDocNumber(value.slice(0, 11));
                            } else if (value.length < 11) {
                                setDocNumber(value);
                            } else {
                                setValue('documentnumber', value);
                                setDocNumber(value);
                            }
                        } else {
                            setValue('documentnumber', value);
                            setDocNumber(value);
                        }
                    }}
                />
                <FieldEdit
                    label={t(langKeys.businessname)}
                    valueDefault={getValues('company')}
                    className="col-6"
                    error={typeof errors?.company?.message === 'string' ? errors?.company?.message : ''}
                    onChange={(value) => setValue('company', value)}
                />
                <FieldEdit
                    label={t(langKeys.fiscaladdress)}
                    valueDefault={getValues('address')}
                    className="col-6"
                    error={typeof errors?.address?.message === 'string' ? errors?.address?.message : ''}
                    onChange={(value) => setValue('address', value)}
                />
                <FieldEdit
                    label={t(langKeys.billingcontact)}
                    valueDefault={getValues('billingcontact')}
                    className="col-6"
                    error={typeof errors?.billingcontact?.message === 'string' ? errors?.billingcontact?.message : ''}
                    onChange={(value) => setValue('billingcontact', value)}
                />
                <FieldEdit
                    label={t(langKeys.billingcontactmail)}
                    valueDefault={getValues('email')}
                    className="col-6"
                    error={typeof errors?.email?.message === 'string' ? errors?.email?.message : ''}
                    onChange={(value) => setValue('email', value)}
                />
                <div className='row-zyx'>
                    <FieldEdit
                        label={t(langKeys.contractsigningdate)}
                        type='date'
                        valueDefault={signatureDateDefault}
                        className="col-6"
                        error={typeof errors?.signaturedate?.message === 'string' ? errors?.signaturedate?.message : ''}
                        onChange={(value) => setValue('signaturedate', value + ' 19:00:00')}
                    />
                </div>
                <FormControlLabel
                    control={
                    <IOSSwitch
                        checked={isAutomaticDrafts}
                        onChange={(event) => {
                            setIsAutomaticDrafts(event.target.checked)
                            setValue('automaticgenerationdrafts', event.target.checked)
                        }}
                        color='primary'
                    />}
                    label={t(langKeys.automaticdrafts)}
                    className="col-6"
                />
                <FormControlLabel
                    control={
                    <IOSSwitch
                        checked={isAutomaticPeriod}
                        onChange={(event) => {
                            setIsAutomaticPeriod(event.target.checked)
                            setValue('automaticperiodgeneration', event.target.checked)
                        }}
                        color='primary'
                    />}
                    label={t(langKeys.automaticperiod)}
                    className="col-5"
                />
                <FormControlLabel
                    control={
                    <IOSSwitch
                        checked={isEnterprise}
                        onChange={(event) => {
                            setIsEnterprise(event.target.checked)
                            setValue('enterprisepartner', event.target.checked)
                            setValue('priceperbag', '0')
                            setValue('numbercontactsbag', 0)
                            setValue('puadditionalcontacts', 0)
                        }}
                        color='primary'
                    />}
                    label={t(langKeys.isenterprise)}
                    className="col-12"
                />
                { isEnterprise && (
                    <>
                        <FieldEdit
                            label={t(langKeys.monthlyplancost)}
                            type='number'
                            valueDefault={montlyplancost}
                            onChange={(value) => {
                                if(value < 0) {
                                    setMontlyPlancost(value * -1)
                                    setValue('montlyplancost', value * -1)
                                } else {
                                    setMontlyPlancost(value)
                                    setValue('montlyplancost', value)
                                }
                            }}
                            className="col-6"
                            error={typeof errors?.montlyplancost?.message === 'string' ? errors?.montlyplancost?.message : ''}
                        />
                        <FieldEdit
                            label={t(langKeys.contactsincludedinplan)}
                            type='number'
                            valueDefault={contactsperplan}
                            onChange={(value) => {
                                if(value < 0) {
                                    setContactsPerPlan(value * -1)
                                    setValue('numberplancontacts', value * -1)
                                } else {
                                    setContactsPerPlan(value)
                                    setValue('numberplancontacts', value)
                                }
                            }}
                            className="col-6"
                            error={typeof errors?.numberplancontacts?.message === 'string' ? errors?.numberplancontacts?.message : ''}
                        />
                        <FieldSelect
                            label={t(langKeys.additionalcontactcalculationtype)}
                            valueDefault={additionalContactType}
                            onChange={(value) => {
                                setAdditionAlcontactType(value.domainvalue)
                                setValue('typecalculation', value.domainvalue)
                                setValue('priceperbag', '0')
                                setValue('numbercontactsbag', 0)
                                setValue('puadditionalcontacts', 0)
                            }}
                            className="col-6"
                            data={(multiDataAux?.data?.[4]?.data||[])}
                            error={typeof errors?.typecalculation?.message === 'string' ? errors?.typecalculation?.message : ''}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"
                        />
                        { getValues('typecalculation') === 'Por bolsa' && (
                            <>
                                <FieldEdit
                                    label={t(langKeys.numberofcontactsperbag)}
                                    type='number'
                                    valueDefault={getValues('numbercontactsbag')}
                                    className="col-6"
                                    error={typeof errors?.numbercontactsbag?.message === 'string' ? errors?.numbercontactsbag.message : ''}
                                    onChange={(value) => {
                                        setValue('numbercontactsbag', value)
                                    }}
                                />
                                <FieldEdit
                                    label={t(langKeys.priceperbag)}
                                    type='number'
                                    valueDefault={getValues('priceperbag')}
                                    className="col-6"
                                    maxLength={ priceBag.split('.').length > 1 ? priceBag.split('.')[0].length + 3 : undefined}
                                    error={typeof errors?.priceperbag?.message === 'string' ? errors?.priceperbag?.message : ''}
                                    onChange={(value) => {
                                        setValue('priceperbag', value);
                                        setPriceBag(value)
                                    }}
                                />
                            </>
                        )}
                        { getValues('typecalculation') === 'Por contacto' && (
                            <FieldEdit
                                label={t(langKeys.puadditionalcontacts)}
                                type='number'
                                valueDefault={getValues('puadditionalcontacts')}
                                className="col-6"
                                maxLength={ puContacts.split('.').length > 1 ? puContacts.split('.')[0].length + 3 : undefined}
                                error={typeof errors?.puadditionalcontacts?.message === 'string' ? errors?.puadditionalcontacts?.message : ''}
                                onChange={(value) => {;
                                    setValue('puadditionalcontacts', value)
                                    setPuContacts(value)
                                }}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default PartnersTabDetail;