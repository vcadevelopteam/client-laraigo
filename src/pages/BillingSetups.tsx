/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateSwitch, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, FieldMultiSelect, IOSSwitch } from 'components';
import { billingSupportIns, getBillingConfigurationSel, getBillingSupportSel, getPlanSel, getPaymentPlanSel, billingConfigurationIns, getBillingConversationSel, billingConversationIns, getOrgSelList, getCorpSel, getAppsettingInvoiceSel, updateAppsettingInvoice, getValuesFromDomainCorp, getBillingMessagingSel, billingMessagingIns, artificialIntelligencePlanSel, artificialIntelligenceServiceSel, billingArtificialIntelligenceSel, billingArtificialIntelligenceIns } from 'common/helpers';
import { cleanMemoryTable, setMemoryTable } from 'store/main/actions';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, getMultiCollectionAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Box, FormControlLabel, Tabs, TextField } from '@material-ui/core';
import { getCountryList } from 'store/signup/actions';
import { dataYears, dataMonths } from 'common/helpers';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { formatNumber, formatNumberFourDecimals, formatNumberNoDecimals } from 'common/helpers';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailSupportPlanProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void,
    dataPlan: any[];
}

interface DetailArtificialIntelligenceProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void,
    providerData: any[];
    planData: any[];
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        width: "100%",
        color: 'rgb(143, 146, 161)'
    },
    fieldsfilter: {
        width: 220,
    },
    transparent: {
        color: "transparent",
    },
    commentary: {
        fontStyle: "italic"
    },
    section: {
        fontWeight: "bold"
    }
}));

const GeneralConfiguration: React.FC<{ dataPlan: any }> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const multiResult = useSelector(state => state.main.multiDataAux);

    const [showCountry, setShowCountry] = useState(false);
    const [blockUbigee, setBlockUbigee] = useState(false);
    const [domainCurrency, setDomainCurrency] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [domainDocument, setDomainDocument] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [domainInvoiceProvider, setDomainInvoiceProvider] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [domainPaymentProvider, setDomainPaymentProvider] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [domainPrinting, setDomainPrinting] = useState<{ loading: boolean; data: Dictionary[] }>({ loading: false, data: [] });
    const [waitSave, setWaitSave] = useState(false);

    const fetchData = () => {
        setShowCountry(false);
        dispatch(getCollection(getAppsettingInvoiceSel()));
    }

    const [fields, setFields] = useState({
        "ruc": "",
        "businessname": "",
        "tradename": "",
        "fiscaladdress": "",
        "ubigeo": "",
        "country": "",
        "emittertype": "",
        "currency": "",
        "invoiceserie": "",
        "invoicecorrelative": 0,
        "annexcode": "",
        "igv": 0.00,
        "printingformat": "",
        "xmlversion": "",
        "ublversion": "",
        "returnpdf": false,
        "returnxmlsunat": false,
        "returnxml": false,
        "invoiceprovider": "",
        "sunaturl": "",
        "token": "",
        "sunatusername": "",
        "paymentprovider": "",
        "publickey": "",
        "privatekey": "",
        "ticketserie": "",
        "ticketcorrelative": 0,
        "invoicecreditserie": "",
        "invoicecreditcorrelative": 0,
        "ticketcreditserie": "",
        "ticketcreditcorrelative": 0,
        "detraction": 0.00,
        "detractioncode": "",
        "detractionaccount": "",
        "detractionminimum": 0.00,
        "operationcodeperu": "",
        "operationcodeother": "",
        "culqiurl": "",
        "culqiurlcardcreate": "",
        "culqiurlclient": "",
        "culqiurltoken": "",
        "culqiurlcharge": "",
        "culqiurlcardget": "",
        "culqiurlcarddelete": "",
    })

    useEffect(() => {
        fetchData();

        setDomainCurrency({ loading: true, data: [] });
        setDomainDocument({ loading: true, data: [] });
        setDomainInvoiceProvider({ loading: true, data: [] });
        setDomainPaymentProvider({ loading: true, data: [] });
        setDomainPrinting({ loading: true, data: [] });

        dispatch(getMultiCollectionAux([
            getValuesFromDomainCorp('BILLINGCURRENCY', '_CURRENCY', 1, 0),
            getValuesFromDomainCorp('BILLINGDOCUMENTTYPE', '_DOCUMENT', 1, 0),
            getValuesFromDomainCorp('BILLINGINVOICEPROVIDER', '_INVOICEPROVIDER', 1, 0),
            getValuesFromDomainCorp('BILLINGPAYMENTPROVIDER', '_PAYMENTPROVIDER', 1, 0),
            getValuesFromDomainCorp('BILLINGPRINTING', '_PRINTING', 1, 0),
        ]));
    }, [])

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false));
            if (mainResult.mainData.data) {
                if (mainResult.mainData.data[0]) {
                    setValue("ruc", mainResult.mainData.data[0].ruc);
                    setValue("businessname", mainResult.mainData.data[0].businessname);
                    setValue("tradename", mainResult.mainData.data[0].tradename);
                    setValue("fiscaladdress", mainResult.mainData.data[0].fiscaladdress);
                    setValue("ubigeo", mainResult.mainData.data[0].ubigeo);
                    setValue("country", mainResult.mainData.data[0].country);
                    setValue("emittertype", mainResult.mainData.data[0].emittertype);
                    setValue("currency", mainResult.mainData.data[0].currency);
                    setValue("invoiceserie", mainResult.mainData.data[0].invoiceserie);
                    setValue("invoicecorrelative", mainResult.mainData.data[0].invoicecorrelative);
                    setValue("annexcode", mainResult.mainData.data[0].annexcode);
                    setValue("igv", mainResult.mainData.data[0].igv);
                    setValue("printingformat", mainResult.mainData.data[0].printingformat);
                    setValue("xmlversion", mainResult.mainData.data[0].xmlversion);
                    setValue("ublversion", mainResult.mainData.data[0].ublversion);
                    setValue("returnpdf", mainResult.mainData.data[0].returnpdf);
                    setValue("returnxmlsunat", mainResult.mainData.data[0].returnxmlsunat);
                    setValue("returnxml", mainResult.mainData.data[0].returnxml);
                    setValue("invoiceprovider", mainResult.mainData.data[0].invoiceprovider);
                    setValue("sunaturl", mainResult.mainData.data[0].sunaturl);
                    setValue("token", mainResult.mainData.data[0].token);
                    setValue("sunatusername", mainResult.mainData.data[0].sunatusername);
                    setValue("paymentprovider", mainResult.mainData.data[0].paymentprovider);
                    setValue("publickey", mainResult.mainData.data[0].publickey);
                    setValue("privatekey", mainResult.mainData.data[0].privatekey);
                    setValue("ticketserie", mainResult.mainData.data[0].ticketserie);
                    setValue("ticketcorrelative", mainResult.mainData.data[0].ticketcorrelative);
                    setValue("invoicecreditserie", mainResult.mainData.data[0].invoicecreditserie);
                    setValue("invoicecreditcorrelative", mainResult.mainData.data[0].invoicecreditcorrelative);
                    setValue("ticketcreditserie", mainResult.mainData.data[0].ticketcreditserie);
                    setValue("ticketcreditcorrelative", mainResult.mainData.data[0].ticketcreditcorrelative);
                    setValue("detraction", mainResult.mainData.data[0].detraction);
                    setValue("detractioncode", mainResult.mainData.data[0].detractioncode);
                    setValue("detractionaccount", mainResult.mainData.data[0].detractionaccount);
                    setValue("detractionminimum", mainResult.mainData.data[0].detractionminimum);
                    setValue("operationcodeperu", mainResult.mainData.data[0].operationcodeperu);
                    setValue("operationcodeother", mainResult.mainData.data[0].operationcodeother);
                    setValue("culqiurl", mainResult.mainData.data[0].culqiurl);
                    setValue("culqiurlcardcreate", mainResult.mainData.data[0].culqiurlcardcreate);
                    setValue("culqiurlclient", mainResult.mainData.data[0].culqiurlclient);
                    setValue("culqiurltoken", mainResult.mainData.data[0].culqiurltoken);
                    setValue("culqiurlcharge", mainResult.mainData.data[0].culqiurlcharge);
                    setValue("culqiurlcardget", mainResult.mainData.data[0].culqiurlcardget);
                    setValue("culqiurlcarddelete", mainResult.mainData.data[0].culqiurlcarddelete);

                    setFields({
                        "ruc": mainResult.mainData.data[0].ruc,
                        "businessname": mainResult.mainData.data[0].businessname,
                        "tradename": mainResult.mainData.data[0].tradename,
                        "fiscaladdress": mainResult.mainData.data[0].fiscaladdress,
                        "ubigeo": mainResult.mainData.data[0].ubigeo,
                        "country": mainResult.mainData.data[0].country,
                        "emittertype": mainResult.mainData.data[0].emittertype,
                        "currency": mainResult.mainData.data[0].currency,
                        "invoiceserie": mainResult.mainData.data[0].invoiceserie,
                        "invoicecorrelative": mainResult.mainData.data[0].invoicecorrelative,
                        "annexcode": mainResult.mainData.data[0].annexcode,
                        "igv": mainResult.mainData.data[0].igv,
                        "printingformat": mainResult.mainData.data[0].printingformat,
                        "xmlversion": mainResult.mainData.data[0].xmlversion,
                        "ublversion": mainResult.mainData.data[0].ublversion,
                        "returnpdf": mainResult.mainData.data[0].returnpdf,
                        "returnxmlsunat": mainResult.mainData.data[0].returnxmlsunat,
                        "returnxml": mainResult.mainData.data[0].returnxml,
                        "invoiceprovider": mainResult.mainData.data[0].invoiceprovider,
                        "sunaturl": mainResult.mainData.data[0].sunaturl,
                        "token": mainResult.mainData.data[0].token,
                        "sunatusername": mainResult.mainData.data[0].sunatusername,
                        "paymentprovider": mainResult.mainData.data[0].paymentprovider,
                        "publickey": mainResult.mainData.data[0].publickey,
                        "privatekey": mainResult.mainData.data[0].privatekey,
                        "ticketserie": mainResult.mainData.data[0].ticketserie,
                        "ticketcorrelative": mainResult.mainData.data[0].ticketcorrelative,
                        "invoicecreditserie": mainResult.mainData.data[0].invoicecreditserie,
                        "invoicecreditcorrelative": mainResult.mainData.data[0].invoicecreditcorrelative,
                        "ticketcreditserie": mainResult.mainData.data[0].ticketcreditserie,
                        "ticketcreditcorrelative": mainResult.mainData.data[0].ticketcreditcorrelative,
                        "detraction": mainResult.mainData.data[0].detraction,
                        "detractioncode": mainResult.mainData.data[0].detractioncode,
                        "detractionaccount": mainResult.mainData.data[0].detractionaccount,
                        "detractionminimum": mainResult.mainData.data[0].detractionminimum,
                        "operationcodeperu": mainResult.mainData.data[0].operationcodeperu,
                        "operationcodeother": mainResult.mainData.data[0].operationcodeother,
                        "culqiurl": mainResult.mainData.data[0].culqiurl,
                        "culqiurlcardcreate": mainResult.mainData.data[0].culqiurlcardcreate,
                        "culqiurlclient": mainResult.mainData.data[0].culqiurlclient,
                        "culqiurltoken": mainResult.mainData.data[0].culqiurltoken,
                        "culqiurlcharge": mainResult.mainData.data[0].culqiurlcharge,
                        "culqiurlcardget": mainResult.mainData.data[0].culqiurlcardget,
                        "culqiurlcarddelete": mainResult.mainData.data[0].culqiurlcarddelete,
                    });

                    setShowCountry(true);
                }
                else {
                    setShowCountry(false);
                }
            }
            else {
                setShowCountry(false);
            }
        }
        else {
            setShowCountry(false);
        }
    }, [mainResult])

    useEffect(() => {
        const indexDomainCurrency = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_CURRENCY'));

        if (indexDomainCurrency > -1) {
            setDomainCurrency({ loading: false, data: multiResult.data[indexDomainCurrency] && multiResult.data[indexDomainCurrency].success ? multiResult.data[indexDomainCurrency].data : [] });
        }

        const indexDomainDocument = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_DOCUMENT'));

        if (indexDomainDocument > -1) {
            setDomainDocument({ loading: false, data: multiResult.data[indexDomainDocument] && multiResult.data[indexDomainDocument].success ? multiResult.data[indexDomainDocument].data : [] });
        }

        const indexDomainInvoiceProvider = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_INVOICEPROVIDER'));

        if (indexDomainInvoiceProvider > -1) {
            setDomainInvoiceProvider({ loading: false, data: multiResult.data[indexDomainInvoiceProvider] && multiResult.data[indexDomainInvoiceProvider].success ? multiResult.data[indexDomainInvoiceProvider].data : [] });
        }

        const indexDomainPaymentProvider = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_PAYMENTPROVIDER'));

        if (indexDomainPaymentProvider > -1) {
            setDomainPaymentProvider({ loading: false, data: multiResult.data[indexDomainPaymentProvider] && multiResult.data[indexDomainPaymentProvider].success ? multiResult.data[indexDomainPaymentProvider].data : [] });
        }

        const indexDomainPrinting = multiResult.data.findIndex((x: MultiData) => x.key === ('UFN_DOMAIN_LST_VALORES_PRINTING'));

        if (indexDomainPrinting > -1) {
            setDomainPrinting({ loading: false, data: multiResult.data[indexDomainPrinting] && multiResult.data[indexDomainPrinting].success ? multiResult.data[indexDomainPrinting].data : [] });
        }
    }, [multiResult]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_edit) }))
                fetchData();
                dispatch(showBackdrop(false));
            }
            else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(executeResult.code || "error_unexpected_db_error") }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeResult, waitSave])

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            ruc: fields.ruc,
            businessname: fields.businessname,
            tradename: fields.tradename,
            fiscaladdress: fields.fiscaladdress,
            ubigeo: fields.ubigeo,
            country: fields.country,
            emittertype: fields.emittertype,
            currency: fields.currency,
            invoiceserie: fields.invoiceserie,
            invoicecorrelative: fields.invoicecorrelative,
            annexcode: fields.annexcode,
            igv: fields.igv,
            printingformat: fields.printingformat,
            xmlversion: fields.xmlversion,
            ublversion: fields.ublversion,
            returnpdf: fields.returnpdf,
            returnxmlsunat: fields.returnxmlsunat,
            returnxml: fields.returnxml,
            invoiceprovider: fields.invoiceprovider,
            sunaturl: fields.sunaturl,
            token: fields.token,
            sunatusername: fields.sunatusername,
            paymentprovider: fields.paymentprovider,
            publickey: fields.publickey,
            privatekey: fields.privatekey,
            ticketserie: fields.ticketserie,
            ticketcorrelative: fields.ticketcorrelative,
            invoicecreditserie: fields.invoicecreditserie,
            invoicecreditcorrelative: fields.invoicecreditcorrelative,
            ticketcreditserie: fields.ticketcreditserie,
            ticketcreditcorrelative: fields.ticketcreditcorrelative,
            detraction: fields.detraction,
            detractioncode: fields.detractioncode,
            detractionaccount: fields.detractionaccount,
            detractionminimum: fields.detractionminimum,
            operationcodeperu: fields.operationcodeperu,
            operationcodeother: fields.operationcodeother,
            culqiurl: fields.culqiurl,
            culqiurlcardcreate: fields.culqiurlcardcreate,
            culqiurlclient: fields.culqiurlclient,
            culqiurltoken: fields.culqiurltoken,
            culqiurlcharge: fields.culqiurlcharge,
            culqiurlcardget: fields.culqiurlcardget,
            culqiurlcarddelete: fields.culqiurlcarddelete,
        }
    });
    React.useEffect(() => {
        register('ruc', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('businessname', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('tradename', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('fiscaladdress', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('ubigeo', { validate: (value) => getValues('country') === 'PE' ? (((value && value.length > 0)) || "" + t(langKeys.field_required)) : true })
        register('country', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('emittertype', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('currency', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('invoiceserie', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('invoicecorrelative');
        register('annexcode', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('igv');
        register('returnpdf');
        register('returnxmlsunat');
        register('returnxml');
        register('printingformat', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('xmlversion', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('ublversion', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('invoiceprovider', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('sunaturl', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('token', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('sunatusername');
        register('paymentprovider', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('publickey', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('privatekey', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('ticketserie', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('ticketcorrelative');
        register('invoicecreditserie', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('invoicecreditcorrelative');
        register('ticketcreditserie', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('ticketcreditcorrelative');
        register('detraction');
        register('detractioncode', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('detractionaccount', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('detractionminimum');
        register('operationcodeperu', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('operationcodeother', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('culqiurl', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('culqiurlcardcreate', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('culqiurlclient', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('culqiurltoken', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('culqiurlcharge', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('culqiurlcardget', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('culqiurlcarddelete', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
    }, [register]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(updateAppsettingInvoice(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">{t(langKeys.billingsetupgeneralinformation)}</Typography>

                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingsetupruc)}
                            className="col-6"
                            valueDefault={getValues('ruc')}
                            onChange={(value) => setValue('ruc', value)}
                            error={errors?.ruc?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.billingcompanyname)}
                            className="col-6"
                            valueDefault={getValues('businessname')}
                            onChange={(value) => setValue('businessname', value)}
                            error={errors?.businessname?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingcommercialname)}
                            className="col-6"
                            valueDefault={getValues('tradename')}
                            onChange={(value) => setValue('tradename', value)}
                            error={errors?.tradename?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.billingfiscaladdress)}
                            className="col-6"
                            valueDefault={getValues('fiscaladdress')}
                            onChange={(value) => setValue('fiscaladdress', value)}
                            error={errors?.fiscaladdress?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingubigeocode)}
                            className="col-6"
                            valueDefault={getValues('ubigeo')}
                            onChange={(value) => setValue('ubigeo', value)}
                            error={errors?.ubigeo?.message}
                            disabled={blockUbigee}
                        />
                        {showCountry ? <FieldSelect
                            label={t(langKeys.billingcountry)}
                            className="col-6"
                            valueDefault={getValues('country')}
                            onChange={(value) => { setValue('country', value?.code); if (value?.code !== 'PE') { setValue('ubigeo', ''); setBlockUbigee(true); } else { setBlockUbigee(false); } }}
                            error={errors?.country?.message}
                            data={dataPlan}
                            optionDesc="description"
                            optionValue="code"
                            orderbylabel={true}
                        /> : <FieldEdit
                            label={t(langKeys.billingcountry)}
                            className="col-6"
                            valueDefault={''}
                            error={errors?.country?.message}
                            disabled={true}
                        />}
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">{t(langKeys.billingsetupbillinginformation)}</Typography>

                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.billingemittertype)}
                            loading={domainDocument.loading}
                            className="col-6"
                            valueDefault={getValues('emittertype')}
                            onChange={(value) => setValue('emittertype', value?.domainvalue)}
                            error={errors?.emittertype?.message}
                            data={domainDocument.data}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            uset={true}
                            prefixTranslation='billingfield_'
                            orderbylabel={true}
                        />
                        <FieldSelect
                            label={t(langKeys.billingcurrency)}
                            loading={domainCurrency.loading}
                            className="col-6"
                            valueDefault={getValues('currency')}
                            onChange={(value) => setValue('currency', value?.domainvalue)}
                            error={errors?.currency?.message}
                            data={domainCurrency.data}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            uset={true}
                            prefixTranslation='billingfield_'
                            orderbylabel={true}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingserial)}
                            className="col-6"
                            valueDefault={getValues('invoiceserie')}
                            onChange={(value) => setValue('invoiceserie', value)}
                            error={errors?.invoiceserie?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.billingcorrelative)}
                            className="col-6"
                            valueDefault={getValues('invoicecorrelative')}
                            onChange={(value) => setValue('invoicecorrelative', value)}
                            error={errors?.invoicecorrelative?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.ticketserial)}
                            className="col-6"
                            valueDefault={getValues('ticketserie')}
                            onChange={(value) => setValue('ticketserie', value)}
                            error={errors?.ticketserie?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.ticketcorrelative)}
                            className="col-6"
                            valueDefault={getValues('ticketcorrelative')}
                            onChange={(value) => setValue('ticketcorrelative', value)}
                            error={errors?.ticketcorrelative?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.invoicecreditserial)}
                            className="col-6"
                            valueDefault={getValues('invoicecreditserie')}
                            onChange={(value) => setValue('invoicecreditserie', value)}
                            error={errors?.invoicecreditserie?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.invoicecreditcorrelative)}
                            className="col-6"
                            valueDefault={getValues('invoicecreditcorrelative')}
                            onChange={(value) => setValue('invoicecreditcorrelative', value)}
                            error={errors?.invoicecreditcorrelative?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.ticketcreditserial)}
                            className="col-6"
                            valueDefault={getValues('ticketcreditserie')}
                            onChange={(value) => setValue('ticketcreditserie', value)}
                            error={errors?.ticketcreditserie?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.ticketcreditcorrelative)}
                            className="col-6"
                            valueDefault={getValues('ticketcreditcorrelative')}
                            onChange={(value) => setValue('ticketcreditcorrelative', value)}
                            error={errors?.ticketcreditcorrelative?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingannexcode)}
                            className="col-6"
                            valueDefault={getValues('annexcode')}
                            onChange={(value) => setValue('annexcode', value)}
                            error={errors?.annexcode?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.billingtax)}
                            className="col-6"
                            valueDefault={getValues('igv')}
                            onChange={(value) => setValue('igv', value)}
                            error={errors?.igv?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.detractioncode)}
                            className="col-6"
                            valueDefault={getValues('detractioncode')}
                            onChange={(value) => setValue('detractioncode', value)}
                            error={errors?.detractioncode?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.detraction)}
                            className="col-6"
                            valueDefault={getValues('detraction')}
                            onChange={(value) => setValue('detraction', value)}
                            error={errors?.detraction?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.detractionaccount)}
                            className="col-6"
                            valueDefault={getValues('detractionaccount')}
                            onChange={(value) => setValue('detractionaccount', value)}
                            error={errors?.detractionaccount?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.detractionminimum)}
                            className="col-6"
                            valueDefault={getValues('detractionminimum')}
                            onChange={(value) => setValue('detractionminimum', value)}
                            error={errors?.detractionminimum?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.operationcodeperu)}
                            className="col-6"
                            valueDefault={getValues('operationcodeperu')}
                            onChange={(value) => setValue('operationcodeperu', value)}
                            error={errors?.operationcodeperu?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.operationcodeother)}
                            className="col-6"
                            valueDefault={getValues('operationcodeother')}
                            onChange={(value) => setValue('operationcodeother', value)}
                            error={errors?.operationcodeother?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.billingprintingformat)}
                            loading={domainPrinting.loading}
                            className="col-6"
                            valueDefault={getValues('printingformat')}
                            onChange={(value) => setValue('printingformat', value?.domainvalue)}
                            error={errors?.printingformat?.message}
                            data={domainPrinting.data}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            uset={true}
                            prefixTranslation='billingfield_'
                            orderbylabel={true}
                        />
                        <FieldEdit
                            label={t(langKeys.billingxmlversion)}
                            className="col-6"
                            valueDefault={getValues('xmlversion')}
                            onChange={(value) => setValue('xmlversion', value)}
                            error={errors?.xmlversion?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingublversion)}
                            className="col-6"
                            valueDefault={getValues('ublversion')}
                            onChange={(value) => setValue('ublversion', value)}
                            error={errors?.ublversion?.message}
                        />
                        <TemplateSwitch
                            label={t(langKeys.billingreturnpdf)}
                            className="col-6"
                            valueDefault={getValues('returnpdf')}
                            onChange={(value) => setValue('returnpdf', value)}
                        />
                    </div>
                    <div className="row-zyx">
                        <TemplateSwitch
                            label={t(langKeys.billingreturncsv)}
                            className="col-6"
                            valueDefault={getValues('returnxmlsunat')}
                            onChange={(value) => setValue('returnxmlsunat', value)}
                        />
                        <TemplateSwitch
                            label={t(langKeys.billingreturnxml)}
                            className="col-6"
                            valueDefault={getValues('returnxml')}
                            onChange={(value) => setValue('returnxml', value)}
                        />
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">{t(langKeys.billingsetupsunatinformation)}</Typography>

                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.billinginvoiceprovider)}
                            loading={domainInvoiceProvider.loading}
                            className="col-6"
                            valueDefault={getValues('invoiceprovider')}
                            onChange={(value) => setValue('invoiceprovider', value?.domainvalue)}
                            error={errors?.invoiceprovider?.message}
                            data={domainInvoiceProvider.data}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            uset={true}
                            prefixTranslation='billingfield_'
                            orderbylabel={true}
                        />
                        <FieldEdit
                            label={t(langKeys.billingapiendpoint)}
                            className="col-6"
                            valueDefault={getValues('sunaturl')}
                            onChange={(value) => setValue('sunaturl', value)}
                            error={errors?.sunaturl?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingtoken)}
                            className="col-6"
                            valueDefault={getValues('token')}
                            onChange={(value) => setValue('token', value)}
                            error={errors?.token?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.billingusername)}
                            className="col-6"
                            valueDefault={getValues('sunatusername')}
                            onChange={(value) => setValue('sunatusername', value)}
                            error={errors?.sunatusername?.message}
                        />
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 20, paddingBottom: "10px" }} color="textPrimary">{t(langKeys.billingsetuppaymentinformation)}</Typography>

                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.billingpaymentprovider)}
                            loading={domainPaymentProvider.loading}
                            className="col-6"
                            valueDefault={getValues('paymentprovider')}
                            onChange={(value) => setValue('paymentprovider', value?.domainvalue)}
                            error={errors?.paymentprovider?.message}
                            data={domainPaymentProvider.data}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            uset={true}
                            prefixTranslation='billingfield_'
                            orderbylabel={true}
                        />
                        <FieldEdit
                            label={t(langKeys.billingpaymentendpoint)}
                            className="col-6"
                            valueDefault={getValues('culqiurl')}
                            onChange={(value) => setValue('culqiurl', value)}
                            error={errors?.culqiurl?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingpublickey)}
                            className="col-6"
                            valueDefault={getValues('publickey')}
                            onChange={(value) => setValue('publickey', value)}
                            error={errors?.publickey?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.billingprivatekey)}
                            className="col-6"
                            valueDefault={getValues('privatekey')}
                            onChange={(value) => setValue('privatekey', value)}
                            error={errors?.privatekey?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.culqiurlcardcreate)}
                            className="col-6"
                            valueDefault={getValues('culqiurlcardcreate')}
                            onChange={(value) => setValue('culqiurlcardcreate', value)}
                            error={errors?.culqiurlcardcreate?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.culqiurlclient)}
                            className="col-6"
                            valueDefault={getValues('culqiurlclient')}
                            onChange={(value) => setValue('culqiurlclient', value)}
                            error={errors?.culqiurlclient?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.culqiurltoken)}
                            className="col-6"
                            valueDefault={getValues('culqiurltoken')}
                            onChange={(value) => setValue('culqiurltoken', value)}
                            error={errors?.culqiurltoken?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.culqiurlcharge)}
                            className="col-6"
                            valueDefault={getValues('culqiurlcharge')}
                            onChange={(value) => setValue('culqiurlcharge', value)}
                            error={errors?.culqiurlcharge?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.culqiurlcardget)}
                            className="col-6"
                            valueDefault={getValues('culqiurlcardget')}
                            onChange={(value) => setValue('culqiurlcardget', value)}
                            error={errors?.culqiurlcardget?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.culqiurlcarddelete)}
                            className="col-6"
                            valueDefault={getValues('culqiurlcarddelete')}
                            onChange={(value) => setValue('culqiurlcarddelete', value)}
                            error={errors?.culqiurlcarddelete?.message}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

const IDCONTRACTEDPLAN = "IDCONTRACTEDPLAN";
const ContractedPlanByPeriod: React.FC<{ dataPlan: any }> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        plan: "",
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingConfigurationSel(dataMain)))
    }

    useEffect(() => {
        setdisableSearch(dataMain.year === "")
    }, [dataMain])

    useEffect(() => {
        search()
        dispatch(setMemoryTable({
            id: IDCONTRACTEDPLAN
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'billingconfigurationid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        //viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                        //extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
            },
            {
                Header: "Plan",
                accessor: 'plan',
            },
            {
                Header: t(langKeys.costbasedonthecontractedplan),
                accessor: 'basicfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { basicfee } = props.cell.row.original;
                    return formatNumber(basicfee || 0);
                }
            },
            {
                Header: t(langKeys.numberofagentshired),
                accessor: 'userfreequantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { userfreequantity } = props.cell.row.original;
                    return formatNumberNoDecimals(userfreequantity || 0);
                }
            },
            {
                Header: t(langKeys.useradditionalfee),
                accessor: 'useradditionalfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { useradditionalfee } = props.cell.row.original;
                    return formatNumberFourDecimals(useradditionalfee || 0);
                }
            },
            {
                Header: t(langKeys.allowuseroverride),
                accessor: 'usercreateoverride',
                NoFilter: false,
                type: 'boolean',
                sortType: 'basic',
                editable: true,
                width: 180,
                maxWidth: 180,
                Cell: (props: any) => {
                    const { usercreateoverride } = props.cell.row.original;
                    return usercreateoverride ? t(langKeys.yes) : "No"
                }
            },
            {
                Header: t(langKeys.channelfreequantity),
                accessor: 'channelfreequantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { channelfreequantity } = props.cell.row.original;
                    return formatNumberNoDecimals(channelfreequantity || 0);
                }
            },
            {
                Header: t(langKeys.contractedplanchannelotherfee),
                accessor: 'channelotherfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { channelotherfee } = props.cell.row.original;
                    return formatNumberFourDecimals(channelotherfee || 0);
                }
            },
            {
                Header: t(langKeys.channelwhatsappfee),
                accessor: 'channelwhatsappfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { channelwhatsappfee } = props.cell.row.original;
                    return formatNumberFourDecimals(channelwhatsappfee || 0);
                }
            },
            {
                Header: t(langKeys.contractedplanfreewhatsappchannel),
                accessor: 'freewhatsappchannel',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { freewhatsappchannel } = props.cell.row.original;
                    return formatNumberNoDecimals(freewhatsappchannel || 0);
                }
            },
            {
                Header: t(langKeys.contractedplanfreewhatsappconversation),
                accessor: 'whatsappconversationfreequantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { whatsappconversationfreequantity } = props.cell.row.original;
                    return formatNumberNoDecimals(whatsappconversationfreequantity || 0);
                }
            },
            {
                Header: t(langKeys.allowchanneloverride),
                accessor: 'channelcreateoverride',
                NoFilter: false,
                type: 'boolean',
                sortType: 'basic',
                editable: true,
                width: 180,
                maxWidth: 180,
                Cell: (props: any) => {
                    const { channelcreateoverride } = props.cell.row.original;
                    return channelcreateoverride ? t(langKeys.yes) : "No"
                }
            },
            {
                Header: t(langKeys.clientfreequantity),
                accessor: 'clientfreequantity',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { clientfreequantity } = props.cell.row.original;
                    return formatNumberNoDecimals(clientfreequantity || 0);
                }
            },
            {
                Header: t(langKeys.clientadditionalfee),
                accessor: 'clientadditionalfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { clientadditionalfee } = props.cell.row.original;
                    return formatNumberFourDecimals(clientadditionalfee || 0);
                }
            },
            {
                Header: t(langKeys.allowhsm),
                accessor: 'allowhsm',
                NoFilter: false,
                type: 'boolean',
                sortType: 'basic',
                editable: true,
                width: 180,
                maxWidth: 180,
                Cell: (props: any) => {
                    const { allowhsm } = props.cell.row.original;
                    return allowhsm ? t(langKeys.yes) : "No"
                }
            },
            {
                Header: t(langKeys.vcacomissionperhsm),
                accessor: 'vcacomissionperhsm',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { vcacomissionperhsm } = props.cell.row.original;
                    return formatNumberFourDecimals(vcacomissionperhsm || 0);
                }
            },
            {
                Header: t(langKeys.vcacomissionpervoicechannel),
                accessor: 'vcacomissionpervoicechannel',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { vcacomissionpervoicechannel } = props.cell.row.original;
                    return formatNumber(vcacomissionpervoicechannel || 0);
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingConfigurationSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (duplicateop) {
                    setduplicateop(false)
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) }))
                } else {

                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingConfigurationIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.billingconfigurationid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    onClickRow={handleEdit}
                    columns={columns}
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, year: value?.value || 0 }))}
                                data={dataYears}
                                optionDesc="value"
                                optionValue="value"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{ width: 300 }}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, month: value.map((o: Dictionary) => o.val).join() }))}
                                data={dataMonths}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <FieldSelect
                                label="Plan"
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.plan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, plan: value?.plan || "" }))}
                                data={dataPlan}
                                optionDesc="plan"
                                optionValue="plan"
                                orderbylabel={true}
                            />
                            <Button
                                disabled={mainResult.mainData.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                onClick={() => search()}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                    pageSizeDefault={IDCONTRACTEDPLAN === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDCONTRACTEDPLAN === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDCONTRACTEDPLAN === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailContractedPlanByPeriod
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan={dataPlan}
            />
        )
    } else
        return null;
}

const DetailContractedPlanByPeriod: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData, dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);

    const [datetoshow, setdatetoshow] = useState(
        row ? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth() + 1).padStart(2, '0')}`
    )
    const [checkedaux, setCheckedaux] = useState(row?.allowhsm || false);
    const [checkeduser, setCheckeduser] = useState(row?.usercreateoverride || false);
    const [checkedchannel, setCheckedchannel] = useState(row?.channelcreateoverride || false);
    const [waitSave, setWaitSave] = useState(false);

    const arrayBreadContractedPlan = [
        { id: "view-1", name: t(langKeys.contractedplan) },
        { id: "view-2", name: t(langKeys.contractedplandetail) }
    ];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.billingconfigurationid || 0,
            year: row?.year || new Date().getFullYear(),
            month: row?.month || new Date().getMonth() + 1,
            plan: row?.plan || "",
            basicfee: row?.basicfee || 0,
            userfreequantity: row?.userfreequantity || 0,
            channelfreequantity: row?.channelfreequantity || 0,
            clientfreequantity: row?.clientfreequantity || 0,
            useradditionalfee: row?.useradditionalfee || 0,
            channelwhatsappfee: row?.channelwhatsappfee || 0,
            clientadditionalfee: row?.clientadditionalfee || 0,
            channelotherfee: row?.channelotherfee || 0,
            hsmfee: row?.hsmfee || 0,
            vcacomissionperhsm: row?.vcacomissionperhsm || 0,
            vcacomissionpervoicechannel: row?.vcacomissionpervoicechannel || 0,
            freewhatsappchannel: row?.freewhatsappchannel || 0,
            whatsappconversationfreequantity: row?.whatsappconversationfreequantity || 0,
            allowhsm: row?.allowhsm || false,
            usercreateoverride: row?.usercreateoverride || false,
            channelcreateoverride: row?.channelcreateoverride || false,
            status: row ? row.status : 'ACTIVO',
            type: row ? row.type : '',
            description: row ? row.description : '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            let datetochange = new Date(e + "-02")
            let mes = datetochange?.getMonth() + 1
            let year = datetochange?.getFullYear()
            setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
            setValue('year', year)
            setValue('month', mes)
        }
    }

    React.useEffect(() => {
        register('id');
        register('type');
        register('status');
        register('year');
        register('month');
        register('operation');
        register('allowhsm');
        register('usercreateoverride');
        register('channelcreateoverride');
        register('channelotherfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('description');
        register('plan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('basicfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('userfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('channelfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('clientfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('useradditionalfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('channelwhatsappfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('clientadditionalfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('hsmfee');
        register('vcacomissionperhsm', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('vcacomissionpervoicechannel', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('whatsappconversationfreequantity', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('freewhatsappchannel', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.billingplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingConfigurationIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBreadContractedPlan}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newcontractedplanbyperiod)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <TextField
                            id="date"
                            className="col-12"
                            type="month"
                            variant="outlined"
                            onChange={(e) => handleDateChange(e.target.value)}
                            value={datetoshow}
                            size="small"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label="Plan"
                            className="col-6"
                            valueDefault={getValues("plan")}
                            onChange={(value) => setValue('plan', value?.plan)}
                            data={dataPlan}
                            optionDesc="plan"
                            optionValue="plan"
                            error={errors?.plan?.message}
                            orderbylabel={true}
                        />
                        <FieldEdit
                            label={t(langKeys.costbasedonthecontractedplan)}
                            onChange={(value) => setValue('basicfee', value)}
                            valueDefault={getValues('basicfee')}
                            error={errors?.basicfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.numberofagentshired)}
                            onChange={(value) => setValue('userfreequantity', value)}
                            valueDefault={getValues('userfreequantity')}
                            error={errors?.userfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.useradditionalfee)}
                            onChange={(value) => setValue('useradditionalfee', value)}
                            valueDefault={getValues('useradditionalfee')}
                            error={errors?.useradditionalfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className={"col-6"} style={{ paddingBottom: '3px' }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.allowuseroverride)}</Box>
                            <FormControlLabel
                                style={{ paddingLeft: 10 }}
                                control={<IOSSwitch checked={checkeduser} onChange={(e) => { setCheckeduser(e.target.checked); setValue('usercreateoverride', e.target.checked) }} />}
                                label={""}
                            />
                        </div>
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.channelfreequantity)}
                            onChange={(value) => setValue('channelfreequantity', value)}
                            valueDefault={getValues('channelfreequantity')}
                            error={errors?.channelfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.contractedplanchannelotherfee)}
                            onChange={(value) => setValue('channelotherfee', value)}
                            valueDefault={getValues('channelotherfee')}
                            error={errors?.channelotherfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.contractedplanfreewhatsappchannel)}
                            onChange={(value) => setValue('freewhatsappchannel', value)}
                            valueDefault={getValues('freewhatsappchannel')}
                            error={errors?.freewhatsappchannel?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.channelwhatsappfee)}
                            onChange={(value) => setValue('channelwhatsappfee', value)}
                            valueDefault={getValues('channelwhatsappfee')}
                            error={errors?.channelwhatsappfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.contractedplanfreewhatsappconversation)}
                            onChange={(value) => setValue('whatsappconversationfreequantity', value)}
                            valueDefault={getValues('whatsappconversationfreequantity')}
                            error={errors?.whatsappconversationfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <div className={"col-6"} style={{ paddingBottom: '3px' }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.allowchanneloverride)}</Box>
                            <FormControlLabel
                                style={{ paddingLeft: 10 }}
                                control={<IOSSwitch checked={checkedchannel} onChange={(e) => { setCheckedchannel(e.target.checked); setValue('channelcreateoverride', e.target.checked) }} />}
                                label={""}
                            />
                        </div>
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.clientfreequantity)}
                            onChange={(value) => setValue('clientfreequantity', value)}
                            valueDefault={getValues('clientfreequantity')}
                            error={errors?.clientfreequantity?.message}
                            type="number"
                            className="col-6"
                        />
                        <FieldEdit
                            label={t(langKeys.clientadditionalfee)}
                            onChange={(value) => setValue('clientadditionalfee', value)}
                            valueDefault={getValues('clientadditionalfee')}
                            error={errors?.clientadditionalfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className={"col-6"} style={{ paddingBottom: '3px' }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.allowhsm)}</Box>
                            <FormControlLabel
                                style={{ paddingLeft: 10 }}
                                control={<IOSSwitch checked={checkedaux} onChange={(e) => { setCheckedaux(e.target.checked); setValue('allowhsm', e.target.checked) }} />}
                                label={""}
                            />
                        </div>
                        <FieldEdit
                            label={t(langKeys.vcacomissionperhsm)}
                            onChange={(value) => setValue('vcacomissionperhsm', value)}
                            valueDefault={getValues('vcacomissionperhsm')}
                            error={errors?.vcacomissionperhsm?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.vcacomissionpervoicechannel)}
                            onChange={(value) => setValue('vcacomissionpervoicechannel', value)}
                            valueDefault={getValues('vcacomissionpervoicechannel')}
                            error={errors?.vcacomissionpervoicechannel?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

const IDCONVERSATIONCOST = 'IDCONVERSATIONCOST';
const ConversationCost: React.FC<{ dataPlan: any }> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        countrycode: "",
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingConversationSel(dataMain)))
    }

    useEffect(() => {
        setdisableSearch(dataMain.year === "")
    }, [dataMain])

    useEffect(() => {
        search()
        dispatch(setMemoryTable({
            id: IDCONVERSATIONCOST
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'billingconversationid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        //viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                        //extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
            },
            {
                Header: t(langKeys.countrycode),
                accessor: 'countrycode',
            },
            {
                Header: t(langKeys.country),
                accessor: 'country',
            },
            {
                Header: t(langKeys.coststartedbycompany),
                accessor: 'companystartfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { companystartfee } = props.cell.row.original;
                    return formatNumberFourDecimals(companystartfee || 0);
                }
            },
            {
                Header: t(langKeys.customerinitiatedcost),
                accessor: 'clientstartfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { clientstartfee } = props.cell.row.original;
                    return formatNumberFourDecimals(clientstartfee || 0);
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingConversationSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (duplicateop) {
                    setduplicateop(false)
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) }))
                } else {

                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.conversationcost).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingConversationIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.billingconversationid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    onClickRow={handleEdit}
                    columns={columns}
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, year: value?.value || 0 }))}
                                data={dataYears}
                                optionDesc="value"
                                optionValue="value"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{ width: 300 }}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, month: value.map((o: Dictionary) => o.val).join() }))}
                                data={dataMonths}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.country)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.countrycode}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, countrycode: value.map((o: Dictionary) => o.code).join() }))}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="code"
                            />
                            <Button
                                disabled={mainResult.mainData.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                onClick={() => search()}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                    pageSizeDefault={IDCONVERSATIONCOST === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDCONVERSATIONCOST === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDCONVERSATIONCOST === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailConversationCost
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan={dataPlan}
            />
        )
    } else
        return null;
}

const DetailConversationCost: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData, dataPlan }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);
    const [datetoshow, setdatetoshow] = useState(
        row ? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth() + 1).padStart(2, '0')}`
    )
    const [waitSave, setWaitSave] = useState(false);

    const arrayBreadConversationCost = [
        { id: "view-1", name: t(langKeys.conversationcost) },
        { id: "view-2", name: t(langKeys.conversationcostdetail) }
    ];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.billingconversationid : 0,
            year: row?.year || new Date().getFullYear(),
            month: row?.month || new Date().getMonth() + 1,
            countrycode: row?.countrycode || 'PE',
            companystartfee: row?.companystartfee || 0.0,
            clientstartfee: row?.clientstartfee || 0.0,
            vcacomission: row?.vcacomission || 0.0,
            freeconversations: row?.freeconversations || 0,
            description: row?.description || "",
            status: row ? row.status : 'ACTIVO',
            type: row ? row.type : '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            let datetochange = new Date(e + "-02")
            let mes = datetochange?.getMonth() + 1
            let year = datetochange?.getFullYear()
            setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
            setValue('year', year)
            setValue('month', mes)
        }
    }

    React.useEffect(() => {
        register('id');
        register('type');
        register('status');
        register('year');
        register('month');
        register('operation');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('countrycode', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('companystartfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('clientstartfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('freeconversations', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('vcacomission');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.conversationcost).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingConversationIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBreadConversationCost}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newconversationplan)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <TextField
                            id="date"
                            className="col-12"
                            type="month"
                            variant="outlined"
                            onChange={(e) => handleDateChange(e.target.value)}
                            value={datetoshow}
                            size="small"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.country)}
                            className="col-12"
                            valueDefault={getValues("countrycode")}
                            variant="outlined"
                            onChange={(value) => setValue("countrycode", value?.code)}
                            error={errors?.countrycode?.message}
                            data={dataPlan}
                            optionDesc="description"
                            optionValue="code"
                            orderbylabel={true}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.coststartedbycompany)}
                            onChange={(value) => setValue('companystartfee', value)}
                            valueDefault={getValues('companystartfee')}
                            error={errors?.companystartfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                        <FieldEdit
                            label={t(langKeys.customerinitiatedcost)}
                            onChange={(value) => setValue('clientstartfee', value)}
                            valueDefault={getValues('clientstartfee')}
                            error={errors?.clientstartfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            onChange={(value) => setValue('description', value)}
                            valueDefault={getValues('description')}
                            error={errors?.description?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            label=''
                            value={t(langKeys.costcommentary)}
                            className={classes.commentary}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

const IDARTIFICIALINTELLIGENCE = 'IDARTIFICIALINTELLIGENCE';
const ArtificialIntelligence: React.FC<{ providerData: any, planData: any }> = ({ providerData, planData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        provider: "",
        type: "",
        plan: "",
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    });

    const [providerCombo, setProviderCombo] = useState([]);
    const [typeCombo, setTypeCombo] = useState([]);
    const [planCombo, setPlanCombo] = useState([]);
    const [disableSearch, setdisableSearch] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true))
        dispatch(getCollection(billingArtificialIntelligenceSel(dataMain)))
    }

    useEffect(() => {
        if (providerData) {
            setProviderCombo(providerData.filter((elem: { provider: any; }, index: any, self: any[]) => self.findIndex((t) => { return (t.provider === elem.provider) }) === index));
            setTypeCombo(providerData.filter((elem: { type: any; }, index: any, self: any[]) => self.findIndex((t) => { return (t.type === elem.type) }) === index));
        }
        if (planData) {
            setPlanCombo(planData.filter((elem: { description: any; }, index: any, self: any[]) => self.findIndex((t) => { return (t.description === elem.description) }) === index));
        }
    }, [providerData, planData])

    useEffect(() => {
        search()
        dispatch(setMemoryTable({
            id: IDARTIFICIALINTELLIGENCE
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false));
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'billingartificialintelligenceid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
            },
            {
                Header: t(langKeys.billingsetup_provider),
                accessor: 'provider',
            },
            {
                Header: t(langKeys.billingsetup_service),
                accessor: 'type',
            },
            {
                Header: t(langKeys.billingsetup_measureunit),
                accessor: 'measureunit',
            },
            {
                Header: t(langKeys.billingsetup_plan),
                accessor: 'plan',
            },
            {
                Header: t(langKeys.billingsetup_minimuminteractions),
                accessor: 'freeinteractions',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { freeinteractions } = props.cell.row.original;
                    return formatNumberNoDecimals(freeinteractions || 0);
                }
            },
            {
                Header: t(langKeys.billingsetup_baseprice),
                accessor: 'basicfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { basicfee } = props.cell.row.original;
                    return formatNumber(basicfee || 0);
                }
            },
            {
                Header: t(langKeys.billingsetup_additionalprice),
                accessor: 'additionalfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { additionalfee } = props.cell.row.original;
                    return formatNumber(additionalfee || 0);
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(billingArtificialIntelligenceSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
                fetchData();
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.supportplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        setdisableSearch(dataMain.year === "")
    }, [dataMain])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingArtificialIntelligenceIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.billingartificialintelligenceid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    onClickRow={handleEdit}
                    columns={columns}
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, year: value?.value || 0 }))}
                                data={dataYears}
                                optionDesc="value"
                                optionValue="value"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{ width: 300 }}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, month: value.map((o: Dictionary) => o.val).join() }))}
                                data={dataMonths}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <FieldSelect
                                label={t(langKeys.billingsetup_provider)}
                                style={{ width: 200 }}
                                valueDefault={dataMain.provider}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, provider: value?.provider || '' }))}
                                data={providerCombo}
                                optionDesc="provider"
                                optionValue="provider"
                            />
                            <FieldSelect
                                label={t(langKeys.billingsetup_service)}
                                style={{ width: 200 }}
                                valueDefault={dataMain.type}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, type: value?.type || '' }))}
                                data={typeCombo}
                                optionDesc="type"
                                optionValue="type"
                            />
                            <FieldSelect
                                label={t(langKeys.billingsetup_plan)}
                                style={{ width: 200 }}
                                valueDefault={dataMain.plan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, plan: value?.description || '' }))}
                                data={planCombo}
                                optionDesc="description"
                                optionValue="description"
                            />
                            <Button
                                disabled={mainResult.mainData.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                onClick={() => search()}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                    pageSizeDefault={IDARTIFICIALINTELLIGENCE === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDARTIFICIALINTELLIGENCE === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDARTIFICIALINTELLIGENCE === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailArtificialIntelligence
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                providerData={providerData}
                planData={planData}
            />
        )
    } else
        return null;
}

const DetailArtificialIntelligence: React.FC<DetailArtificialIntelligenceProps> = ({ data: { row, edit }, setViewSelected, fetchData, providerData, planData }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);

    const [datetoshow, setdatetoshow] = useState(row ? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth() + 1).padStart(2, '0')}`)
    const [waitSave, setWaitSave] = useState(false);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.billingsetup_artificialintelligence) },
        { id: "view-2", name: t(langKeys.billingsetup_artificialintelligencedetail) }
    ];

    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.billingartificialintelligenceid : 0,
            year: row?.year || new Date().getFullYear(),
            month: row?.month || new Date().getMonth() + 1,
            provider: row?.provider || "",
            measureunit: row?.measureunit || "",
            charlimit: row?.charlimit || 0,
            plan: row?.plan || "",
            freeinteractions: row?.freeinteractions || 0,
            basicfee: row?.basicfee || 0.00,
            additionalfee: row?.additionalfee || 0.00,
            status: row ? row.status : 'ACTIVO',
            type: row ? row.type : '',
            description: row ? row.description : '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            let datetochange = new Date(e + "-02");
            let mes = datetochange?.getMonth() + 1;
            let year = datetochange?.getFullYear();
            setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`);
            setValue('year', year);
            setValue('month', mes);
        }
    }

    React.useEffect(() => {
        register('id');
        register('year');
        register('month');
        register('provider', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('measureunit', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('charlimit');
        register('plan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('freeinteractions', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('basicfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('additionalfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('status');
        register('type');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('operation');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.billingsetup_artificialintelligence).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingArtificialIntelligenceIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    function handleServiceChange(data: any) {
        if (data) {
            setValue("provider", data.provider || '');
            setValue("type", data.type || '');
            setValue("charlimit", data.charlimit || 0);
            setValue("measureunit", data.measureunit || '');
        }
        else {
            setValue("provider", '');
            setValue("type", '');
            setValue("charlimit", 0);
            setValue("measureunit", '');
        }

        trigger("provider");
        trigger("type");
        trigger("measureunit");
    }

    function handlePlanChange(data: any) {
        if (data) {
            setValue("plan", data.description || '');
            setValue("freeinteractions", data.freeinteractions || 0);
            setValue("basicfee", data.basicfee || 0.00);
            setValue("additionalfee", data.additionalfee || 0.00);
        }
        else {
            setValue("plan", '');
            setValue("freeinteractions", 0);
            setValue("basicfee", 0.00);
            setValue("additionalfee", 0.00);
        }

        trigger("plan");
        trigger("freeinteractions");
        trigger("basicfee");
        trigger("additionalfee");
    }

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.provider} - ${row.type}` : t(langKeys.billingsetup_artificialintelligencenew)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            onChange={(value) => setValue('description', value)}
                            valueDefault={getValues('description')}
                            error={errors?.description?.message}
                            className="col-6"
                        />
                        <TextField
                            id="date"
                            className="col-6"
                            type="month"
                            variant="outlined"
                            onChange={(e) => handleDateChange(e.target.value)}
                            value={datetoshow}
                            size="small"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.billingsetup_ai)}
                            className="col-6"
                            valueDefault={`${getValues('type')} - ${getValues('provider')}`}
                            onChange={(value) => { handleServiceChange(value) }}
                            error={errors?.type?.message}
                            data={providerData?.filter((v: { type: any; provider: any; }, i: any, a: any[]) => a.findIndex((v2: { type: any; provider: any; }) => (v.type === v2.type && v.provider === v2.provider)) === i)}
                            optionDesc="typeprovider"
                            optionValue="typeprovider"
                            orderbylabel={true}
                        />
                        <FieldEdit
                            label={t(langKeys.billingsetup_provider)}
                            className="col-6"
                            valueDefault={getValues('provider')}
                            error={errors?.provider?.message}
                            disabled={true}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingsetup_service)}
                            className="col-6"
                            valueDefault={getValues('type')}
                            error={errors?.type?.message}
                            disabled={true}
                        />
                        <FieldEdit
                            label={t(langKeys.type)}
                            className="col-6"
                            valueDefault={getValues('type')}
                            error={errors?.type?.message}
                            disabled={true}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingsetup_measureunit)}
                            className="col-6"
                            valueDefault={getValues('measureunit')}
                            error={errors?.measureunit?.message}
                            disabled={true}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.billingsetup_plan)}
                            className="col-6"
                            valueDefault={getValues('plan')}
                            onChange={(value) => { handlePlanChange(value) }}
                            error={errors?.plan?.message}
                            data={planData}
                            optionDesc="description"
                            optionValue="description"
                        />
                        <FieldEdit
                            label={t(langKeys.billingsetup_minimuminteractions)}
                            className="col-6"
                            valueDefault={getValues('freeinteractions')}
                            onChange={(value) => setValue('freeinteractions', value)}
                            error={errors?.freeinteractions?.message}
                            type="number"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.billingsetup_baseprice)}
                            className="col-6"
                            valueDefault={getValues('basicfee')}
                            onChange={(value) => setValue('basicfee', value)}
                            error={errors?.basicfee?.message}
                            type="number"
                        />
                        <FieldEdit
                            label={t(langKeys.billingsetup_additionalprice)}
                            className="col-6"
                            valueDefault={getValues('additionalfee')}
                            onChange={(value) => setValue('additionalfee', value)}
                            error={errors?.additionalfee?.message}
                            type="number"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

const IDSUPPORTPLAN = 'IDSUPPORTPLAN';
const SupportPlan: React.FC<{ dataPlan: any }> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        plan: "",
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingSupportSel(dataMain)))
    }

    useEffect(() => {
        search()
        dispatch(setMemoryTable({
            id: IDSUPPORTPLAN
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'billingsupportid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        //viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                        //extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
            },
            {
                Header: t(langKeys.supportplan),
                accessor: 'plan',
            },
            {
                Header: t(langKeys.supportprice),
                accessor: 'basicfee',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { basicfee } = props.cell.row.original;
                    return formatNumber(basicfee || 0);
                }
            },
            {
                Header: t(langKeys.starttime),
                accessor: 'starttime',
            },
            {
                Header: t(langKeys.finishtime),
                accessor: 'finishtime',
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingSupportSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (duplicateop) {
                    setduplicateop(false)
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) }))
                } else {

                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.supportplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        setdisableSearch(dataMain.year === "")
    }, [dataMain])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingSupportIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.billingsupportid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    onClickRow={handleEdit}
                    columns={columns}
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, year: value?.value || 0 }))}
                                data={dataYears}
                                optionDesc="value"
                                optionValue="value"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{ width: 300 }}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, month: value.map((o: Dictionary) => o.val).join() }))}
                                data={dataMonths}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <FieldSelect
                                label={t(langKeys.supportplan)}
                                className={classes.fieldsfilter}
                                valueDefault={dataMain.plan}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, plan: value?.description || "" }))}
                                data={dataPlan}
                                optionDesc="description"
                                optionValue="description"
                                orderbylabel={true}
                            />

                            <Button
                                disabled={mainResult.mainData.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                onClick={() => search()}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                    pageSizeDefault={IDSUPPORTPLAN === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDSUPPORTPLAN === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDSUPPORTPLAN === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailSupportPlan
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan={dataPlan}
            />
        )
    } else
        return null;
}

const DetailSupportPlan: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData, dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);

    const [datetoshow, setdatetoshow] = useState(
        row ? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth() + 1).padStart(2, '0')}`
    )
    const [waitSave, setWaitSave] = useState(false);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.supportplan) },
        { id: "view-2", name: t(langKeys.supportplandetail) }
    ];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.billingsupportid : 0,
            startdate: row?.startdate || new Date(new Date().setDate(1)),
            enddate: row?.enddate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            year: row?.year || new Date().getFullYear(),
            month: row?.month || new Date().getMonth() + 1,
            plan: row?.plan || "",
            basicfee: row?.basicfee || 0,
            starttime: row?.starttime || new Date().getTime(),
            finishtime: row?.finishtime || new Date().getTime(),
            status: row ? row.status : 'ACTIVO',
            type: row ? row.type : '',
            description: row ? row.description : '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            let datetochange = new Date(e + "-02")
            let mes = datetochange?.getMonth() + 1
            let year = datetochange?.getFullYear()
            let startdate = new Date(year, mes - 1, 1)
            let enddate = new Date(year, mes, 0)
            setValue('startdate', startdate)
            setValue('enddate', enddate)
            setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
            setValue('year', year)
            setValue('month', mes)
        }
    }

    React.useEffect(() => {
        register('id');
        register('type');
        register('status');
        register('year');
        register('month');
        register('operation');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('plan', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('basicfee', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('starttime', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('finishtime', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.supportplan).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingSupportIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newsupportplan)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            onChange={(value) => setValue('description', value)}
                            valueDefault={getValues('description')}
                            error={errors?.description?.message}
                            className="col-6"
                        />
                        <TextField
                            id="date"
                            className="col-6"
                            type="month"
                            variant="outlined"
                            onChange={(e) => handleDateChange(e.target.value)}
                            value={datetoshow}
                            size="small"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label="Plan"
                            className="col-6"
                            valueDefault={getValues("plan")}
                            onChange={(value) => setValue('plan', value?.description)}
                            data={dataPlan}
                            optionDesc="description"
                            optionValue="description"
                            error={errors?.plan?.message}
                            orderbylabel={true}
                        />
                        <FieldEdit
                            label={t(langKeys.supportprice)}
                            onChange={(value) => setValue('basicfee', value)}
                            valueDefault={getValues('basicfee')}
                            error={errors?.basicfee?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            type="time"
                            label={t(langKeys.starttime)}
                            error={errors?.starttime?.message}
                            className="col-6"
                            onChange={(value) => setValue('starttime', value)}
                            valueDefault={getValues("starttime")}
                        />
                        <FieldEdit
                            type="time"
                            label={t(langKeys.finishtime)}
                            error={errors?.finishtime?.message}
                            className="col-6"
                            onChange={(value) => setValue('finishtime', value)}
                            valueDefault={getValues("finishtime")}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

const IDMESSAGINGCOST = 'IDMESSAGINGCOST';
const MessagingCost: React.FC<{ dataPlan: any }> = ({ dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);

    const [dataMain, setdataMain] = useState({
        countrycode: "",
        year: String(new Date().getFullYear()),
        month: (new Date().getMonth() + 1).toString().padStart(2, "0")
    });

    const [disableSearch, setdisableSearch] = useState(false);
    const [duplicateop, setduplicateop] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    function search() {
        dispatch(showBackdrop(true))
        dispatch(getCollection(getBillingMessagingSel(dataMain)))
    }

    useEffect(() => {
        setdisableSearch(dataMain.year === "")
    }, [dataMain])

    useEffect(() => {
        search()
        dispatch(setMemoryTable({
            id: IDMESSAGINGCOST
        }))
        return () => {
            dispatch(cleanMemoryTable());
        }
    }, [])

    useEffect(() => {
        if (!mainResult.mainData.loading) {
            dispatch(showBackdrop(false))
        }
    }, [mainResult])

    const columns = React.useMemo(
        () => [
            {
                accessor: 'billingmessagingid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        //viewFunction={() => handleView(row)} //esta es la funcion de duplicar
                        //extraOption={t(langKeys.duplicate)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.year),
                accessor: 'year',
            },
            {
                Header: t(langKeys.month),
                accessor: 'month',
            },
            {
                Header: t(langKeys.pricepersms),
                accessor: 'pricepersms',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { pricepersms } = props.cell.row.original;
                    return formatNumberFourDecimals(pricepersms || 0);
                }
            },
            {
                Header: t(langKeys.vcacomissionpersms),
                accessor: 'vcacomissionpersms',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { vcacomissionpersms } = props.cell.row.original;
                    return formatNumberFourDecimals(vcacomissionpersms || 0);
                }
            },
            {
                Header: t(langKeys.pricepermail),
                accessor: 'pricepermail',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { pricepermail } = props.cell.row.original;
                    return formatNumberFourDecimals(pricepermail || 0);
                }
            },
            {
                Header: t(langKeys.vcacomissionpermail),
                accessor: 'vcacomissionpermail',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { vcacomissionpermail } = props.cell.row.original;
                    return formatNumberFourDecimals(vcacomissionpermail || 0);
                }
            }
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getBillingMessagingSel(dataMain)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if (duplicateop) {
                    setduplicateop(false)
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) }))
                } else {

                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                }
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.messagingcost).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(billingMessagingIns({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.billingmessagingid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (
            <Fragment>
                <TableZyx
                    onClickRow={handleEdit}
                    columns={columns}
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                label={t(langKeys.year)}
                                style={{ width: 150 }}
                                valueDefault={dataMain.year}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, year: value?.value || 0 }))}
                                data={dataYears}
                                optionDesc="value"
                                optionValue="value"
                            />
                            <FieldMultiSelect
                                label={t(langKeys.month)}
                                style={{ width: 300 }}
                                valueDefault={dataMain.month}
                                variant="outlined"
                                onChange={(value) => setdataMain(prev => ({ ...prev, month: value.map((o: Dictionary) => o.val).join() }))}
                                data={dataMonths}
                                uset={true}
                                prefixTranslation="month_"
                                optionDesc="val"
                                optionValue="val"
                            />
                            <Button
                                disabled={mainResult.mainData.loading || disableSearch}
                                variant="contained"
                                color="primary"
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                onClick={() => search()}
                            >{t(langKeys.search)}
                            </Button>
                        </div>
                    )}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                    pageSizeDefault={IDMESSAGINGCOST === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDMESSAGINGCOST === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDMESSAGINGCOST === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailMessagingCost
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
                dataPlan={dataPlan}
            />
        )
    } else
        return null;
}

const DetailMessagingCost: React.FC<DetailSupportPlanProps> = ({ data: { row, edit }, setViewSelected, fetchData, dataPlan }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);

    const [datetoshow, setdatetoshow] = useState(
        row ? `${row.year}-${String(row.month).padStart(2, '0')}` : `${new Date(new Date().setDate(1)).getFullYear()}-${String(new Date(new Date().setDate(1)).getMonth() + 1).padStart(2, '0')}`
    )
    const [waitSave, setWaitSave] = useState(false);

    const arrayBreadConversationCost = [
        { id: "view-1", name: t(langKeys.messagingcost) },
        { id: "view-2", name: t(langKeys.messagingcostdetail) }
    ];

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.billingmessagingid : 0,
            year: row?.year || new Date().getFullYear(),
            month: row?.month || new Date().getMonth() + 1,
            pricepersms: row?.pricepersms || 0.0,
            vcacomissionpersms: row?.vcacomissionpersms || 0.0,
            pricepermail: row?.pricepermail || 0.0,
            vcacomissionpermail: row?.vcacomissionpermail || 0.0,
            description: row?.description || "",
            status: row ? row.status : 'ACTIVO',
            type: row ? row.type : '',
            operation: row ? "UPDATE" : "INSERT",
        }
    });

    function handleDateChange(e: any) {
        if (e !== "") {
            let datetochange = new Date(e + "-02")
            let mes = datetochange?.getMonth() + 1
            let year = datetochange?.getFullYear()
            setdatetoshow(`${year}-${String(mes).padStart(2, '0')}`)
            setValue('year', year)
            setValue('month', mes)
        }
    }

    React.useEffect(() => {
        register('id');
        register('year');
        register('month');
        register('pricepersms', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('vcacomissionpersms', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('pricepermail', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('vcacomissionpermail', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status');
        register('type');
        register('operation');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.messagingcost).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(billingMessagingIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBreadConversationCost}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newmessagingplan)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <TextField
                            id="date"
                            className="col-6"
                            type="month"
                            variant="outlined"
                            onChange={(e) => handleDateChange(e.target.value)}
                            value={datetoshow}
                            size="small"
                        />
                        <FieldEdit
                            className="col-6"
                            label={t(langKeys.description)}
                            onChange={(value) => setValue('description', value)}
                            valueDefault={getValues('description')}
                            error={errors?.description?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            label=''
                            value={t(langKeys.smssection)}
                            className={classes.section}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.pricepersms)}
                            onChange={(value) => setValue('pricepersms', value)}
                            valueDefault={getValues('pricepersms')}
                            error={errors?.pricepersms?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                        <FieldEdit
                            label={t(langKeys.vcacomissionpersms)}
                            onChange={(value) => setValue('vcacomissionpersms', value)}
                            valueDefault={getValues('vcacomissionpersms')}
                            error={errors?.vcacomissionpersms?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            label=''
                            value={'*' + t(langKeys.messagingcostsmsnote)}
                            className={classes.commentary}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            label=''
                            value={t(langKeys.mailsection)}
                            className={classes.section}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.pricepermail)}
                            onChange={(value) => setValue('pricepermail', value)}
                            valueDefault={getValues('pricepermail')}
                            error={errors?.pricepermail?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                        <FieldEdit
                            label={t(langKeys.vcacomissionpermail)}
                            onChange={(value) => setValue('vcacomissionpermail', value)}
                            valueDefault={getValues('vcacomissionpermail')}
                            error={errors?.vcacomissionpermail?.message}
                            type="number"
                            className="col-6"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

const BillingSetup: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const countryListreq = useSelector(state => state.signup.countryList);
    const multiData = useSelector(state => state.main.multiData);
    const user = useSelector(state => state.login.validateToken.user);

    const [providerList, setProviderList] = useState<any>([]);
    const [planList, setPlanList] = useState<any>([]);
    const [countryList, setcountryList] = useState<any>([]);
    const [dataPaymentPlan, setdataPaymentPlan] = useState<any>([]);
    const [dataPlan, setdataPlan] = useState<any>([]);
    const [pageSelected, setPageSelected] = useState(user?.roledesc?.includes("SUPERADMIN") ? 0 : 6);
    const [sentfirstinfo, setsentfirstinfo] = useState(false);

    useEffect(() => {
        if (!multiData.loading && sentfirstinfo) {
            setsentfirstinfo(false);
            setdataPlan(multiData.data[0] && multiData.data[0].success ? multiData.data[0].data : []);
            setdataPaymentPlan(multiData.data[3] && multiData.data[3].success ? multiData.data[3].data : []);
            setPlanList(multiData.data[4] && multiData.data[4].success ? multiData.data[4].data : []);
            setProviderList(multiData.data[5] && multiData.data[5].success ? multiData.data[5].data : []);
        }
    }, [multiData])

    useEffect(() => {
        if (!countryListreq.loading && countryListreq.data.length) {
            setcountryList(countryListreq.data);
        }
    }, [countryListreq])

    useEffect(() => {
        setsentfirstinfo(true)
        dispatch(getCountryList())
        dispatch(getMultiCollection([
            getPlanSel(),
            getOrgSelList(0),
            getCorpSel(0),
            getPaymentPlanSel(),
            artificialIntelligencePlanSel({ description: '' }),
            artificialIntelligenceServiceSel({ provider: '', service: '' }),
        ]));
    }, [])

    return (
        <div style={{ width: '100%' }}>
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                {user?.roledesc?.includes("SUPERADMIN") &&
                    <AntTab label={t(langKeys.billingsetupgeneralconfiguration)} />
                }
                {user?.roledesc?.includes("SUPERADMIN") &&
                    <AntTab label={t(langKeys.contractedplanbyperiod)} />
                }
                {user?.roledesc?.includes("SUPERADMIN") &&
                    <AntTab label={t(langKeys.conversationcost)} />
                }
                {user?.roledesc?.includes("SUPERADMIN") &&
                    <AntTab label={t(langKeys.billingsetup_artificialintelligence)} />
                }
                {user?.roledesc?.includes("SUPERADMIN") &&
                    <AntTab label={t(langKeys.messagingcost)} />
                }
                {user?.roledesc?.includes("SUPERADMIN") &&
                    <AntTab label={t(langKeys.supportplan)} />
                }
            </Tabs>
            {pageSelected === 0 &&
                <div style={{ marginTop: 16 }}>
                    <GeneralConfiguration dataPlan={countryList} />
                </div>
            }
            {pageSelected === 1 &&
                <div style={{ marginTop: 16 }}>
                    <ContractedPlanByPeriod dataPlan={dataPaymentPlan} />
                </div>
            }
            {pageSelected === 2 &&
                <div style={{ marginTop: 16 }}>
                    <ConversationCost dataPlan={countryList} />
                </div>
            }
            {pageSelected === 3 &&
                <div style={{ marginTop: 16 }}>
                    <ArtificialIntelligence planData={planList} providerData={providerList} />
                </div>
            }
            {pageSelected === 4 &&
                <div style={{ marginTop: 16 }}>
                    <MessagingCost dataPlan={countryList} />
                </div>
            }
            {pageSelected === 5 &&
                <div style={{ marginTop: 16 }}>
                    <SupportPlan dataPlan={dataPlan} />
                </div>
            }
        </div>
    );
}

export default BillingSetup;