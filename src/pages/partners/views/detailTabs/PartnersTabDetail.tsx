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
import { FieldEdit, FieldCheckbox, TitleDetail, TemplateIcons, FieldSelect } from 'components';
import TableZyx from "components/fields/table-simple";
import { useSelector } from 'hooks';
import { getCountryList } from 'store/signup/actions';
import { useDispatch } from 'react-redux';

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
    multiData: MultiData[];
    errors: FieldErrors<any>;
}

const PartnersTabDetail: React.FC<PartnersTabDetailProps> = ({
    row,
    multiData,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const user = useSelector(state => state.login.validateToken.user);
    const countryList = useSelector(state => state.signup.countryList);
    const dispatch = useDispatch();
    const [isEnterprise, setIsEnterprise] = useState(false);
    const [isAutomaticDrafts, setIsAutomaticDrafts] = useState(false);
    const [isAutomaticPeriod, setIsAutomaticPeriod] = useState(false);
    const multiDataAux = useSelector(state => state.main.multiDataAux);

    const { register, handleSubmit, setValue, trigger, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.corpid : 0,
            sunatcountry: row?.sunatcountry || '',
            billingcurrency: row?.billingcurrency || '',
            doctype: row?.doctype || '',
            docnum: row?.docnum || '',
            businessname: row?.businessname || '',
            fiscaladdress: row?.fiscaladdress || '',
            contact: row?.contact || '',
            contactemail: row?.contactemail || '',
            signdate: row?.signdate || '',
            automaticdrafts: row?.automaticdrafts || false,
            automaticperiod: row?.automaticperiod || false,
            isEnterprise: row?.isEnterprise || false,
            billingplan: row?.billingplan || '',
            additionalcontacttype: row?.additionalcontacttype || '',
            bagcontactsquantity: row?.bagcontactsquantity || '',
            pucontacts: row?.pucontacts || '',
            bagprice: row?.bagprice || '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    const [docType, setDocType] = useState(getValues('doctype'));
    const [sunatCountry, setSunatCountry] = useState(getValues('sunatcountry'));

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
        setValue('sunatcountry', value);
        console.log(getValues('sunatcountry'));
    
        if (value === 'PE') {
          setValue('doctype', 'RUC');
          setDocType('RUC')
        } else {
          setValue('doctype', 'NO DOMICILIADO');
          setDocType('NO DOMICILIADO')
        }
        console.log(getValues('doctype'))
    };

    /*const docTypes = useMemo(() => {
        if (!dataDocType || dataDocType.length === 0) return [];

        let val: { domaindesc: string }[];
        if (getValues("sunatcountry") === "PE") {
            // FILTRAR NO DOMICILIARIO // OTROS
            val = dataDocType.filter(x => x.domainvalue !== "0") as any[];
        } else {
            val = dataDocType as any[];
        }

        return val.sort((a, b) => {
            return a.domaindesc.localeCompare(b.domaindesc);
        });
    }, [dataDocType, getValues("sunatcountry")]);*/


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
                    error={errors?.sunatcountry?.message}
                    optionValue="code"
                    optionDesc="description"
                />
                <FieldSelect
                    label={t(langKeys.billingperiod_billingcurrency)}
                    valueDefault={getValues('billingcurrency')}
                    onChange={(value) => setValue('billingcurrency', value)}
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
                    error={errors?.doctype?.message}
                    disabled={sunatCountry !== ''}
                />
                <FieldEdit
                    label={t(langKeys.documentnumber)}
                    valueDefault={getValues('docnum')}
                    className="col-6"
                    error={errors?.docnum?.message}
                    onChange={(value) => setValue('docnum', value)}
                />
                <FieldEdit
                    label={t(langKeys.businessname)}
                    valueDefault={getValues('businessname')}
                    className="col-6"
                    error={errors?.businessname?.message}
                    onChange={(value) => setValue('businessname', value)}
                />
                <FieldEdit
                    label={t(langKeys.fiscaladdress)}
                    valueDefault={getValues('fiscaladdress')}
                    className="col-6"
                    error={errors?.fiscaladdress?.message}
                    onChange={(value) => setValue('fiscaladdress', value)}
                />
                <FieldEdit
                    label={t(langKeys.billingcontact)}
                    valueDefault={getValues('contact')}
                    className="col-6"
                    error={errors?.contact?.message}
                    onChange={(value) => setValue('contact', value)}
                />
                <FieldEdit
                    label={t(langKeys.billingcontactmail)}
                    valueDefault={getValues('contactemail')}
                    className="col-6"
                    error={errors?.contactemail?.message}
                    onChange={(value) => setValue('contactemail', value)}
                />
                <div className='row-zyx'>
                    <FieldEdit
                        label={t(langKeys.contractsigningdate)}
                        type='date'
                        valueDefault={getValues('signdate')}
                        className="col-6"
                        error={errors?.signdate?.message}
                        onChange={(value) => setValue('signdate', value)}
                    />
                </div>
                <FormControlLabel
                    control={
                    <Switch
                        checked={isAutomaticDrafts}
                        onChange={(event) => {
                            setValue('automaticdrafts', event.target.checked)
                            setIsAutomaticDrafts(event.target.checked)
                        }}
                        color='primary'
                    />}
                    label={t(langKeys.automaticdrafts)}
                    className="col-6"
                />
                <FormControlLabel
                    control={
                    <Switch
                        checked={isAutomaticPeriod}
                        onChange={(event) => {
                            setIsAutomaticPeriod(event.target.checked)
                            setValue('automaticperiod', event.target.checked)
                        }}
                        color='primary'
                    />}
                    label={t(langKeys.automaticperiod)}
                    className="col-5"
                />
                <FormControlLabel
                    control={
                    <Switch
                        checked={isEnterprise}
                        onChange={(event) => {
                            setIsEnterprise(event.target.checked)
                            setValue('isEnterprise', event.target.checked)
                        }}
                        color='primary'
                    />}
                    label={t(langKeys.isenterprise)}
                    className="col-12"
                />
                { getValues('isEnterprise') && (
                    <>
                        <FieldSelect
                            label={t(langKeys.billingplan)}
                            valueDefault={getValues('billingplan')}
                            onChange={(value) => setValue('billingplan', value)}
                            className="col-6"
                            error={errors?.billingplan?.message}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"direccion fiscal
                        />
                        <FieldSelect
                            label={t(langKeys.additionalcontactcalculationtype)}
                            valueDefault={getValues('additionalcontacttype')}
                            onChange={(value) => setValue('additionalcontacttype', value)}
                            className="col-6"
                            error={errors?.additionalcontacttype?.message}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"
                        />
                        <FieldEdit
                            label={t(langKeys.numberofcontactsperbag)}
                            valueDefault={getValues('bagcontactsquantity')}
                            className="col-6"
                            error={errors?.bagcontactsquantity?.message}
                            onChange={(value) => setValue('bagcontactsquantity', value)}
                        />
                        <FieldEdit
                            label={t(langKeys.puadditionalcontacts)}
                            valueDefault={getValues('pucontacts')}
                            className="col-6"
                            error={errors?.pucontacts?.message}
                            onChange={(value) => setValue('pucontacts', value)}
                        />
                        <FieldEdit
                            label={t(langKeys.priceperbag)}
                            valueDefault={getValues('bagprice')}
                            className="col-6"
                            error={errors?.bagprice?.message}
                            onChange={(value) => setValue('bagprice', value)}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default PartnersTabDetail;