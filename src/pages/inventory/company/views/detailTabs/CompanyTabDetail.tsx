/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'; // we need this to make JSX compile
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { FieldCheckbox, FieldEdit, FieldSelect } from 'components';
import { useSelector } from 'hooks';

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
    mapContainerStyle: {
        height: "400px",
        width: "100%",
    }
}));

interface CompanyTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors<any>;
}

const CompanyTabDetail: React.FC<CompanyTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const multiData = useSelector(state => state.main.multiDataAux);


    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.company)}
                    valueDefault={getValues('manufacturercode')}
                    className="col-6"
                    error={errors?.manufacturercode?.message}
                    onChange={(value) => setValue('manufacturercode', value)}
                    inputProps={{ maxLength: 20 }}
                />
                <FieldEdit
                    label={t(langKeys.description)}
                    valueDefault={getValues('description')}
                    className="col-6"
                    error={errors?.description?.message}
                    onChange={(value) => setValue('description', value)}
                    inputProps={{ maxLength: 256 }}
                />   
                <FieldEdit
                    label={t(langKeys.completedesc)}
                    valueDefault={getValues('descriptionlarge')}
                    className="col-12"
                    error={errors?.descriptionlarge?.message}
                    onChange={(value) => setValue('descriptionlarge', value)}
                />   
                <FieldSelect
                    label={t(langKeys.type)}
                    className="col-6"
                    valueDefault={getValues('typemanufacterid')}
                    onChange={(value) => {setValue('typemanufacterid', value?.domainid||"");}}
                    error={errors?.typemanufacterid?.message}
                    data={multiData.data[0].data}
                    optionValue="domainid"
                    optionDesc="domaindesc"
                />      
                <FieldSelect
                    label={t(langKeys.currency)}
                    className="col-6"
                    valueDefault={getValues('currencyid')}
                    onChange={(value) => setValue('currencyid', value?.domainid||"")}
                    error={errors?.currencyid?.message}
                    data={multiData.data[1].data}
                    optionValue="domainid"
                    optionDesc="domaindesc"
                />    
                <FieldEdit
                    label={`N° ${t(langKeys.client)}`}
                    valueDefault={getValues('clientenumbers')}
                    className="col-6"
                    error={errors?.clientenumbers?.message}
                    onChange={(value) => setValue('clientenumbers', value)}
                    inputProps={{ maxLength: 136 }}
                />  
                <FieldSelect
                    label={t(langKeys.taxcodes)}
                    className="col-6"
                    valueDefault={getValues('taxeid')}
                    onChange={(value) => setValue('taxeid', value?.domainid||"")}
                    error={errors?.taxeid?.message}
                    data={multiData.data[2].data}
                    optionValue="domainid"
                    optionDesc="domaindesc"
                /> 
                <FieldEdit
                    label={t(langKeys.homepage)}
                    valueDefault={getValues('beginpage')}
                    className="col-6"
                    error={errors?.beginpage?.message}
                    onChange={(value) => setValue('beginpage', value)}
                    inputProps={{ maxLength: 136 }}
                />  
                <FieldCheckbox
                  label={t(langKeys.cod)}
                  className="col-6"
                  valueDefault={getValues("ispaymentdelivery")}
                  onChange={(value) => setValue("ispaymentdelivery", value)}
                />       
            </div>
        </div>
    )
}

export default CompanyTabDetail;