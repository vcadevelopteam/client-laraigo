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
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
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
    setValue,
    getValues,
    multiData,
    errors,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const user = useSelector(state => state.login.validateToken.user);
    const initialValueAttachments = getValues('attachments');
    const [files, setFiles] = useState<IFile[]>(initialValueAttachments? initialValueAttachments.split(',').map((url:string) => ({ url })):[]);
    const [openModal, setOpenModal] = useState(false);
    const countryList = useSelector(state => state.signup.countryList);
    const dispatch = useDispatch();
    const [isEnterprise, setIsEnterprise] = useState(false);
    const [isAutomaticDrafts, setIsAutomaticDrafts] = useState(false);
    const [isAutomaticPeriod, setIsAutomaticPeriod] = useState(false);
    //const dataDocType = multiData[3] && multiData[3].success ? multiData[3].data : [];

    function handleRegister() {
        setOpenModal(true)
    }

    useEffect(() => {
        dispatch(getCountryList())
    }, []);

    const countries = useMemo(() => {
        if (countryList.loading) return [];
        return countryList.data.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });
    }, [countryList]);

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
                    className="col-6"
                    data={countries}
                    error={errors?.producttype?.message}
                    optionValue="domainvalue"
                    optionDesc="domaindesc"
                />
                <FieldSelect
                    label={t(langKeys.billingperiod_billingcurrency)}
                    className="col-6"
                    error={errors?.producttype?.message}
                    optionValue="domainvalue"
                    optionDesc="domaindesc"direccion fiscal
                />
                <FieldSelect
                    label={t(langKeys.documenttype)}
                    className="col-6"
                    error={errors?.producttype?.message}
                    optionValue="domainvalue"
                    optionDesc="domaindesc"
                />
                <FieldEdit
                    label={t(langKeys.documentnumber)}
                    valueDefault={getValues('name')}
                    className="col-6"
                    error={errors?.name?.message}
                    onChange={(value) => setValue('name', value)}
                />
                <FieldEdit
                    label={t(langKeys.businessname)}
                    valueDefault={getValues('name')}
                    className="col-6"
                    error={errors?.name?.message}
                    onChange={(value) => setValue('name', value)}
                />
                <FieldEdit
                    label={t(langKeys.fiscaladdress)}
                    valueDefault={getValues('name')}
                    className="col-6"
                    error={errors?.name?.message}
                    onChange={(value) => setValue('name', value)}
                />
                <FieldEdit
                    label={t(langKeys.billingcontact)}
                    valueDefault={getValues('name')}
                    className="col-6"
                    error={errors?.name?.message}
                    onChange={(value) => setValue('name', value)}
                />
                <FieldEdit
                    label={t(langKeys.billingcontactmail)}
                    valueDefault={getValues('name')}
                    className="col-6"
                    error={errors?.name?.message}
                    onChange={(value) => setValue('name', value)}
                />
                <div className='row-zyx'>
                    <FieldEdit
                        label={t(langKeys.contractsigningdate)}
                        type='date'
                        valueDefault={getValues('name')}
                        className="col-6"
                        error={errors?.name?.message}
                        onChange={(value) => setValue('name', value)}
                    />
                </div>
                <FormControlLabel
                    control={
                    <Switch
                        checked={isAutomaticDrafts}
                        onChange={(event) => setIsAutomaticDrafts(event.target.checked)}
                        color='primary'
                    />}
                    label={t(langKeys.automaticdrafts)}
                    className="col-6"
                />
                <FormControlLabel
                    control={
                    <Switch
                        checked={isAutomaticPeriod}
                        onChange={(event) => setIsAutomaticPeriod(event.target.checked)}
                        color='primary'
                    />}
                    label={t(langKeys.automaticperiod)}
                    className="col-5"
                />
                <FormControlLabel
                    control={
                    <Switch
                        checked={isEnterprise}
                        onChange={(event) => setIsEnterprise(event.target.checked)}
                        color='primary'
                    />}
                    label={t(langKeys.isenterprise)}
                    className="col-12"
                />
                { isEnterprise && (
                    <>
                        <FieldSelect
                            label={t(langKeys.billingplan)}
                            className="col-6"
                            error={errors?.producttype?.message}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"direccion fiscal
                        />
                        <FieldSelect
                            label={t(langKeys.additionalcontactcalculationtype)}
                            className="col-6"
                            error={errors?.producttype?.message}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"direccion fiscal
                        />
                        <FieldEdit
                            label={t(langKeys.numberofcontactsperbag)}
                            valueDefault={getValues('name')}
                            className="col-6"
                            error={errors?.name?.message}
                            onChange={(value) => setValue('name', value)}
                        />
                        <FieldEdit
                            label={t(langKeys.puadditionalcontacts)}
                            valueDefault={getValues('name')}
                            className="col-6"
                            error={errors?.name?.message}
                            onChange={(value) => setValue('name', value)}
                        />
                        <FieldEdit
                            label={t(langKeys.priceperbag)}
                            valueDefault={getValues('name')}
                            className="col-6"
                            error={errors?.name?.message}
                            onChange={(value) => setValue('name', value)}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default PartnersTabDetail;