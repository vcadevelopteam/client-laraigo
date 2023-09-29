/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react'; // we need this to make JSX compile
import { Dictionary, IFile } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControlLabel, Switch } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import Box from '@material-ui/core/Box';
import { ItemFile, UploaderIcon } from '../../components/components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue, useForm } from 'react-hook-form';
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons, FieldSelect, IOSSwitch } from 'components';
import TableZyx from "components/fields/table-simple";
import { useSelector } from 'hooks';
import { getCountryList } from 'store/signup/actions';
import { useDispatch } from 'react-redux';
import { resetMainAux } from 'store/main/actions';

interface MultiData {
    data: Dictionary[];
    success: boolean;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerDescription: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    containerDescriptionTitle: {
        fontSize: 24
    },
    containerDescriptionSubtitle: {
        fontSize: 14,
        fontWeight: 500
    },
    iconResponse: {
        cursor: 'pointer',
        poisition: 'relative',
        color: '#2E2C34',
        '&:hover': {
            // color: theme.palette.primary.main,
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    iconSendDisabled: {
        backgroundColor: "#EBEAED",
        cursor: 'not-allowed',
    },
    button: {
        marginRight: theme.spacing(2),
    },
}));

interface PartnersTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const PartnersTabDetail: React.FC<PartnersTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const user = useSelector(state => state.login.validateToken.user);
    const countryList = useSelector(state => state.signup.countryList);
    const dispatch = useDispatch();
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const [docType, setDocType] = useState(row?.documenttype);
    const [sunatCountry, setSunatCountry] = useState(row?.country);
    const [additionalContactType, setAdditionAlcontactType] = useState(row?.typecalculation);
    const [isEnterprise, setIsEnterprise] = useState(row?.enterprisepartner);
    const [isAutomaticDrafts, setIsAutomaticDrafts] = useState(row?.automaticgenerationdrafts);
    const [isAutomaticPeriod, setIsAutomaticPeriod] = useState(row?.automaticperiodgeneration);

    useEffect(() => {
        dispatch(getCountryList())
    }, []);

    const countries = useMemo(() => {
        if (countryList.loading) return [];
        return countryList.data.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });
    }, [countryList]);

    const handleCountryChange = (value: string) => {
        setValue('country', value);
        console.log(getValues('country'));
    
        if (value === 'PE') {
          setValue('documenttype', 'RUC');
          setDocType('RUC')
        } else {
          setValue('documenttype', 'NO DOMICILIADO');
          setDocType('NO DOMICILIADO')
        }
    };

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.country)}
                    valueDefault={sunatCountry}
                    onChange={(value) => {
                        setSunatCountry(value.description)
                        handleCountryChange(value.code)
                    }}
                    className="col-6"
                    data={countries}
                    error={errors?.country?.message}
                    optionValue="code"
                    optionDesc="description"
                />
                <FieldSelect
                    label={t(langKeys.billingperiod_billingcurrency)}
                    valueDefault={getValues('billingcurrency')}
                    onChange={(value) => setValue('billingcurrency', value.domainvalue)}
                    className="col-6"
                    data={(multiDataAux?.data?.[2]?.data||[])}
                    error={errors?.billingcurrency?.message}
                    optionValue="domainvalue"
                    optionDesc="domaindesc"
                />
                <FieldEdit
                    label={t(langKeys.documenttype)}
                    valueDefault={docType}
                    className="col-6"
                    error={errors?.documenttype?.message}
                    disabled={sunatCountry !== ''}
                />
                <FieldEdit
                    label={t(langKeys.documentnumber)}
                    type='number'
                    valueDefault={getValues('documentnumber')}
                    className="col-6"
                    error={errors?.documentnumber?.message}
                    onChange={(value) => setValue('documentnumber', value)}
                />
                <FieldEdit
                    label={t(langKeys.businessname)}
                    valueDefault={getValues('company')}
                    className="col-6"
                    error={errors?.company?.message}
                    onChange={(value) => setValue('company', value)}
                />
                <FieldEdit
                    label={t(langKeys.fiscaladdress)}
                    valueDefault={getValues('address')}
                    className="col-6"
                    error={errors?.address?.message}
                    onChange={(value) => setValue('address', value)}
                />
                <FieldEdit
                    label={t(langKeys.billingcontact)}
                    valueDefault={getValues('billingcontact')}
                    className="col-6"
                    error={errors?.billingcontact?.message}
                    onChange={(value) => setValue('billingcontact', value)}
                />
                <FieldEdit
                    label={t(langKeys.billingcontactmail)}
                    valueDefault={getValues('email')}
                    className="col-6"
                    error={errors?.email?.message}
                    onChange={(value) => setValue('email', value)}
                />
                <div className='row-zyx'>
                    <FieldEdit
                        label={t(langKeys.contractsigningdate)}
                        type='date'
                        valueDefault={getValues('signaturedate')}
                        className="col-6"
                        error={errors?.signaturedate?.message}
                        onChange={(value) => setValue('signaturedate', value)}
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
                        }}
                        color='primary'
                    />}
                    label={t(langKeys.isenterprise)}
                    className="col-12"
                />
                { getValues('enterprisepartner') && (
                    <>
                        <FieldSelect
                            label={t(langKeys.billingplan)}
                            valueDefault={getValues('billingplan')}
                            onChange={(value) => setValue('billingplan', value.domainvalue)}
                            className="col-6"
                            data={(multiDataAux?.data?.[3]?.data||[])}
                            error={errors?.billingplan?.message}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"
                        />
                        <FieldSelect
                            label={t(langKeys.additionalcontactcalculationtype)}
                            valueDefault={additionalContactType}
                            onChange={(value) => {
                                setAdditionAlcontactType(value.domainvalue)
                                setValue('typecalculation', value.domainvalue)
                            }}
                            className="col-6"
                            data={(multiDataAux?.data?.[4]?.data||[])}
                            error={errors?.typecalculation?.message}
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
                                    error={errors?.numbercontactsbag?.message}
                                    onChange={(value) => {
                                        const sanitizedValue = value.replace(/-/g, '');
                                        setValue('numbercontactsbag', sanitizedValue)
                                    }}
                                />
                                <FieldEdit
                                    label={t(langKeys.priceperbag)}
                                    type='number'
                                    valueDefault={getValues('priceperbag')}
                                    className="col-6"
                                    error={errors?.priceperbag?.message}
                                    onChange={(value) => {
                                        const sanitizedValue = value.replace(/-/g, '');
                                        setValue('priceperbag', sanitizedValue)
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
                                error={errors?.puadditionalcontacts?.message}
                                onChange={(value) => {
                                    const sanitizedValue = value.replace(/-/g, '');
                                    setValue('puadditionalcontacts', sanitizedValue)
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