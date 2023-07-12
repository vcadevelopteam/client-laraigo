/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useMemo,  } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldView, FieldEdit, FieldSelect, TemplateSwitch } from 'components';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import clsx from 'clsx';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface TabInformationOrganizationProps {
    data: RowSelected;
    multiData: MultiData[];
    getValues: any;
    setValue: any;
    trigger: any;
    errors: any;
    dataCurrency: Dictionary[];
    doctype: string;
    setdoctype:(data:any)=>void;
}
const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    notdisplay: {
        display: 'none',
    },
}));

const TabInformationOrganization: React.FC<TabInformationOrganizationProps> = ({ data: { row, edit }, multiData, getValues, setValue, trigger, errors, dataCurrency, doctype, setdoctype}) => {
    
    const countryList = useSelector(state => state.signup.countryList);
    const user = useSelector(state => state.login.validateToken.user);
    const roledesc = user?.roledesc || "";
    const classes = useStyles();
    const { t } = useTranslation();
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataCorp = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const typeofcreditList = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const timezoneList = multiData[5] && multiData[5].success ? multiData[5]?.data : [];

    const countries = useMemo(() => {
        if (countryList.loading) return [];
        return countryList.data.sort((a: Dictionary, b: Dictionary) => {
            return a.description.localeCompare(b.description);
        });
    }, [countryList]);
    
    const docTypes = useMemo(() => {
        const dataDocType = multiData[3] && multiData[3].success ? multiData[3].data : [];

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
    }, [multiData, getValues("sunatcountry")]);

    return <div className={classes.containerDetail}>
        <div className="row-zyx">
            {edit ?
                (
                    !row && ['SUPERADMIN'].includes(roledesc || "") ?
                        <FieldSelect
                            label={t(langKeys.corporation)}
                            className="col-6"
                            valueDefault={getValues('corpid')}
                            onChange={(value) => {
                                setValue('corpid', value?.corpid);
                                setValue('billbyorg', value?.billbyorg || false);
                                trigger('billbyorg')
                            }}
                            triggerOnChangeOnFirst={true}
                            error={errors?.corpid?.message}
                            data={dataCorp}
                            disabled={!['SUPERADMIN'].includes(roledesc || "")}
                            optionDesc="description"
                            optionValue="corpid"
                        />
                        :
                        <FieldEdit
                            label={t(langKeys.corporation)}
                            className="col-6"
                            valueDefault={row ? (row.corpdesc || "") : user?.corpdesc}
                            disabled={true}
                        />
                )
                : <FieldView
                    label={t(langKeys.corporation)}
                    value={user?.corpdesc}
                    className="col-6"
                />}
            <FieldEdit
                label={t(langKeys.organization)}
                className="col-6"
                onChange={(value) => setValue('description', value)}
                valueDefault={getValues("description")}
                error={errors?.description?.message}
            />
        </div>
        <div className="row-zyx">
            {edit ?
                <FieldSelect
                    uset={true}
                    label={t(langKeys.type)}
                    className="col-6"
                    valueDefault={getValues('type')}
                    onChange={(value) => setValue('type', value.domainvalue)}
                    error={errors?.type?.message}
                    data={dataType}
                    prefixTranslation="type_org_"
                    optionDesc="domainvalue"
                    optionValue="domainvalue"
                />
                : <FieldView
                    label={t(langKeys.type)}
                    value={row ? (row.type || "") : ""}
                    className="col-6"
                />}
            {edit ?
                <FieldSelect
                    label={t(langKeys.status)}
                    className="col-6"
                    valueDefault={getValues('status')}
                    onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                    error={errors?.status?.message}
                    data={dataStatus}
                    uset={true}
                    prefixTranslation="status_"
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                : <FieldView
                    label={t(langKeys.status)}
                    value={row ? (row.status || "") : ""}
                    className="col-6"
                />}
        </div>
        <div className="row-zyx">
            {edit ?
                <FieldSelect
                    label={t(langKeys.currency)}
                    className="col-6"
                    valueDefault={getValues('currency')}
                    onChange={(value) => setValue('currency', value ? value.code : '')}
                    error={errors?.currency?.message}
                    data={dataCurrency}
                    //uset={true}
                    //prefixTranslation="status_"
                    optionDesc="description"
                    optionValue="code"
                />
                : <FieldView
                    label={t(langKeys.currency)}
                    value={row ? (row.currency || "") : ""}
                    className="col-6"
                />}
            <FieldSelect
                label={t(langKeys.timezone)}
                className="col-6"
                valueDefault={getValues('timezone')}
                onChange={(value) => { setValue('timezone', value?.description || ''); setValue('timezoneoffset', value?.houroffset || '') }}
                error={errors?.timezone?.message}
                data={timezoneList.map(x => { return { ...x, textimezone: `(${x.houroffsettext}) ${x.description}` } })}
                //uset={true}
                //prefixTranslation="status_"
                optionDesc="textimezone"
                optionValue="description"
            />
        </div>
        {getValues('billbyorg') && (
            <>
                <div className="row-zyx">
                    <FieldSelect
                        label={t(langKeys.country)}
                        className="col-6"
                        valueDefault={getValues("sunatcountry")}
                        onChange={(value) => {
                            setValue("sunatcountry", value?.code || "");

                            setValue("doctype", value?.code === "PE" ? "1" : "0");
                            setdoctype(value?.code === "PE" ? "1" : "0");
                        }}
                        error={errors?.sunatcountry?.message}
                        data={countries}
                        optionDesc="description"
                        optionValue="code"
                    />
                    <FieldEdit
                        label={t(langKeys.fiscaladdress)}
                        className="col-6"
                        valueDefault={getValues('fiscaladdress')}
                        onChange={(value) => setValue('fiscaladdress', value)}
                        error={errors?.fiscaladdress?.message}
                    />
                </div>
                <div className="row-zyx">
                    <FieldSelect
                        uset={true}
                        prefixTranslation='billingfield_'
                        label={t(langKeys.docType)}
                        className="col-6"
                        valueDefault={doctype}
                        disabled={getValues("sunatcountry") !== "PE"}
                        onChange={(value) => {
                            setValue("doctype", value?.domainvalue || "");
                            setdoctype(value?.domainvalue || "");
                        }}
                        error={errors?.doctype?.message}
                        data={docTypes}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                    <FieldEdit
                        label={t(langKeys.documentnumber)}
                        className={clsx("col-6", {
                            // [classes.notdisplay]: doctype === "0",
                        })}
                        valueDefault={getValues('docnum')}
                        onChange={(value: any) => setValue('docnum', value)}
                        error={errors?.docnum?.message}
                    />
                    <FieldEdit
                        label={t(langKeys.businessname)}
                        className="col-6"
                        valueDefault={getValues('businessname')}
                        onChange={(value) => setValue('businessname', value)}
                        error={errors?.businessname?.message}
                    />
                </div>
                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.contactbilling)}
                        className="col-6"
                        valueDefault={getValues('contact')}
                        onChange={(value) => setValue('contact', value)}
                        error={errors?.contact?.message}
                    />
                    <FieldEdit
                        label={t(langKeys.billingmail)}
                        className="col-6"
                        valueDefault={getValues('contactemail')}
                        onChange={(value) => setValue('contactemail', value)}
                        error={errors?.contactemail?.message}
                    />
                </div>
                {roledesc === "SUPERADMIN" &&
                    <>
                        <div className="row-zyx">
                            <FieldSelect
                                label={t(langKeys.typecredit)}
                                className="col-6"
                                valueDefault={getValues("credittype")}
                                onChange={(value) => { setValue("credittype", value?.domainvalue || ""); }}
                                error={errors?.credittype?.message}
                                data={typeofcreditList}
                                uset={true}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                            <TemplateSwitch
                                label={t(langKeys.autosendinvoice)}
                                className="col-6"
                                valueDefault={getValues('autosendinvoice')}
                                onChange={(value) => setValue('autosendinvoice', value)}
                            />
                        </div>
                        <div className="row-zyx">
                            <TemplateSwitch
                                label={t(langKeys.automaticpayment)}
                                className="col-6"
                                valueDefault={getValues('automaticpayment')}
                                onChange={(value) => setValue('automaticpayment', value)}
                            />
                            <TemplateSwitch
                                label={t(langKeys.automaticperiod)}
                                className="col-6"
                                valueDefault={getValues('automaticperiod')}
                                onChange={(value) => setValue('automaticperiod', value)}
                            />
                        </div>
                        <div className="row-zyx">
                            <TemplateSwitch
                                label={t(langKeys.automaticinvoice)}
                                className="col-6"
                                valueDefault={getValues('automaticinvoice')}
                                onChange={(value) => setValue('automaticinvoice', value)}
                            />
                        </div>
                    </>
                }
            </>
        )}
    </div>
}


export default TabInformationOrganization;