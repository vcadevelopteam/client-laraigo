/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, AntTab } from 'components';
import {  insOrg } from 'common/helpers';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import {  execute, resetUploadFile } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Tabs } from '@material-ui/core';
import TabInformationOrganization from './tabs/TabInformationOrganization';
import TabEmailConfiguration from './tabs/TabEmailConfiguration';
import TabVoxChannel from './tabs/TabVoxChannel';
import TabEvaluation from './tabs/TabEvaluation';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailOrganizationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void,
    dataCurrency: Dictionary[];
    arrayBread: any;
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
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: '#381052',
    },
    icon: {
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main,
        }
    },
}));

const DetailOrganization: React.FC<DetailOrganizationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, dataCurrency, arrayBread }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const roledesc = user?.roledesc || "";
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [waitSaveUpload, setWaitSaveUpload] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);
    const uploadResult = useSelector(state => state.main.uploadFile);
    // const [valuefile, setvaluefile] = useState('')
    const [doctype, setdoctype] = useState(row?.doctype || ((row?.sunatcountry) === "PE" ? "1" : "0"))
    const [iconupload, seticonupload] = useState('');
    const [iconsurl, seticonsurl] = useState({
        iconbot: row?.iconbot || "",
        iconadvisor: row?.iconadvisor || "",
        iconclient: row?.iconclient || "",
    });
    const [apiconsumption, setApiConsumption] = useState({
        sentinel: false,
        reniec: false,
        sunarp: false,
    });
    const [ownCredentials, setOwnCredentials] = useState({
        sentinel: false,
        reniec: false,
        sunarp: false,
    });

    const defaultRange = multiData[7] && multiData[7].success ? multiData[7]?.data : [];
    const defaultPercentage = multiData[8] && multiData[8].success ? multiData[8]?.data : [];
    const defaultChannel = multiData[9] && multiData[9].success ? multiData[9]?.data : [];
    const defaultRecharge = multiData[6] && multiData[6].success ? multiData[6]?.data : [];

    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({
        defaultValues: {
            corpid: row ? row.corpid : user?.corpid,
            description: row ? (row.orgdesc || '') : '',
            status: row ? row.status : 'ACTIVO',
            type: row ? row.type : '',
            id: row ? row.orgid : 0,
            operation: row ? "EDIT" : "INSERT",
            currency: row?.currency || "",
            email: row?.email || "",
            port: row?.port || 0,
            password: row?.pass || "",
            host: row?.host || "",
            ssl: row?.ssl || false,
            private_mail: row?.private_mail || false,
            default_credentials: row?.default_credentials || false,
            billbyorg: row?.billbyorg || false,

            doctype: row?.doctype || '',
            docnum: row?.docnum || '',
            businessname: row?.businessname || '',
            fiscaladdress: row?.fiscaladdress || '',
            sunatcountry: row?.sunatcountry || '',
            contactemail: row?.contactemail || '',
            contact: row?.contact || '',
            autosendinvoice: row?.autosendinvoice || false,
            automaticpayment: row?.automaticpayment || false,
            automaticperiod: row?.billbyorg ? (row?.automaticperiod || false) : true,
            automaticinvoice: row?.billbyorg ? (row?.automaticinvoice || false) : true,
            //automaticperiod: row?.automaticperiod || false,
            //automaticinvoice: row?.automaticinvoice || false,
            iconbot: row?.iconbot || "",
            iconadvisor: row?.iconadvisor || "",
            iconclient: row?.iconclient || "",
            credittype: row?.credittype || "typecredit_alcontado",
            timezone: row?.timezone || "",
            timezoneoffset: row?.timezoneoffset || "",
            voximplantautomaticrecharge: row ? (row?.voximplantautomaticrecharge || false) : (defaultRecharge[0]?.propertyvalue === '1' ? true : false),
            voximplantrechargerange: row ? (row?.voximplantrechargerange || 0) : (parseFloat(defaultRange[0]?.propertyvalue) || 0),
            voximplantrechargepercentage: row ? (row?.voximplantrechargepercentage || 0.00) : (parseFloat(defaultPercentage[0]?.propertyvalue) || 0),
            voximplantrechargefixed: row?.voximplantrechargefixed || 0.00,
            voximplantadditionalperchannel: row ? (row?.voximplantadditionalperchannel || 0.00) : (parseFloat(defaultChannel[0]?.propertyvalue) || 0),
            days_api_equifax: row?.days_api_equifax||0,
            type_credencials_equifax: row?.type_credencials_equifax||false,
            status_api_equifax: row?.status_api_equifax||false,
            user_own_equifax: row?.user_own_equifax||"",
            pass_own_equifax: row?.pass_own_equifax||"",
            url_own_equifax: row?.url_own_equifax||"",
            evaluationData: row?.evaluationData||{
                infocorp: {
                    evaluationtime: "DÍA",
                },
                sentinel: {
                    evaluationtime: "DÍA",
                    timevalue: 0,
                    username: "",
                    password: "",
                    urlapi1: "",
                    urlapi2: "",
                    publickey: "",
                },
                reniec: {
                    evaluationtime: "DÍA",
                    timevalue: 0,
                    username: "",
                    password: "",
                    urlapi: "",
                },
                sunarp: {
                    evaluationtime: "DÍA",
                    timevalue: 0,
                    username: "",
                    password: "",
                    urlapi: "",
                },
            }
        }
    });

    React.useEffect(() => {
        register('corpid', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('currency', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('timezone', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('doctype', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('docnum', {
            validate: {
                needsvalidation: (value: any) => (doctype !== "0") ? ((value && value.length) || t(langKeys.field_required)) : true,
                dnivalidation: (value: any) => (doctype === "1") ? ((value && value.length === 8) || t(langKeys.doctype_dni_error)) : true,
                cevalidation: (value: any) => (doctype === "4") ? ((value && value.length === 12) || t(langKeys.doctype_foreigners_card)) : true,
                rucvalidation: (value: any) => (doctype === "6") ? ((value && value.length === 11) || t(langKeys.doctype_ruc_error)) : true,
                passportvalidation: (value: any) => (doctype === "7") ? ((value && value.length === 12) || t(langKeys.doctype_passport_error)) : true,
            }
        });
        register('businessname', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('fiscaladdress', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('contact', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('contactemail', {
            validate: {
                hasvalue: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true,
                isemail: (value) => getValues('billbyorg') ? ((/\S+@\S+\.\S+/.test(value)) || t(langKeys.emailverification) + "") : true
            }
        });
        register('sunatcountry', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('credittype', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('host');
        register('ssl');
        register('private_mail');
        register('automaticpayment');
        register('automaticperiod');
        register('automaticinvoice');
        register('voximplantautomaticrecharge');
        register('voximplantrechargerange', { validate: (value) => roledesc === "SUPERADMIN" ? (((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required)) : true });
        register('voximplantrechargepercentage', { validate: (value) => roledesc === "SUPERADMIN" ? (((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required)) : true });
        register('voximplantrechargefixed', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('voximplantadditionalperchannel', { validate: (value) => roledesc === "SUPERADMIN" ? (((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required)) : true });
        register('voximplantadditionalperchannel', { validate: (value) => roledesc === "SUPERADMIN" ? (((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required)) : true });
        
        register('evaluationData.infocorp.evaluationtime', { validate: (value) => getValues("status_api_equifax") ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('days_api_equifax', { validate: {
            hasvalue: (value) => getValues("status_api_equifax") ? ((value && value>0)|| t(langKeys.field_required)) : true,
            limitdays: (value) => getValues("status_api_equifax") ? ((value && value<32)|| t(langKeys.fieldlessthan31)) : true,
        } });
        register('user_own_equifax', { validate: (value) => (getValues("status_api_equifax") && getValues("type_credencials_equifax")) ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('pass_own_equifax', { validate: (value) => (getValues("status_api_equifax") && getValues("type_credencials_equifax")) ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('url_own_equifax', { validate: (value) => (getValues("status_api_equifax") && getValues("type_credencials_equifax")) ? ((value && value.length)|| t(langKeys.field_required)) : true });

        register('evaluationData.sentinel.evaluationtime', { validate: (value) => apiconsumption.sentinel ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.sentinel.timevalue', { validate: {
            hasvalue: (value) => apiconsumption.sentinel ? ((value && value>0)|| t(langKeys.field_required)) : true,
            limitdays: (value) => apiconsumption.sentinel ? ((value && value<32)|| t(langKeys.fieldlessthan31)) : true,
        } });
        register('evaluationData.sentinel.username', { validate: (value) => apiconsumption.sentinel ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.sentinel.password', { validate: (value) => apiconsumption.sentinel ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.sentinel.urlapi1', { validate: (value) => apiconsumption.sentinel ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.sentinel.urlapi2', { validate: (value) => apiconsumption.sentinel ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.sentinel.publickey', { validate: (value) => apiconsumption.sentinel ? ((value && value.length)|| t(langKeys.field_required)) : true });

        register('evaluationData.reniec.evaluationtime', { validate: (value) => apiconsumption.reniec ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.reniec.timevalue', { validate: {
            hasvalue: (value) => apiconsumption.reniec ? ((value && value>0)|| t(langKeys.field_required)) : true,
            limitdays: (value) => apiconsumption.reniec ? ((value && value<32)|| t(langKeys.fieldlessthan31)) : true,
        } });
        register('evaluationData.reniec.username', { validate: (value) => apiconsumption.reniec ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.reniec.password', { validate: (value) => apiconsumption.reniec ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.reniec.urlapi', { validate: (value) => apiconsumption.reniec ? ((value && value.length)|| t(langKeys.field_required)) : true });

        register('evaluationData.sunarp.evaluationtime', { validate: (value) => apiconsumption.sunarp ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.sunarp.timevalue', { validate: {
            hasvalue: (value) => apiconsumption.sunarp ? ((value && value>0)|| t(langKeys.field_required)) : true,
            limitdays: (value) => apiconsumption.sunarp ? ((value && value<32)|| t(langKeys.fieldlessthan31)) : true,
        } });
        register('evaluationData.sunarp.username', { validate: (value) => apiconsumption.sunarp ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.sunarp.password', { validate: (value) => apiconsumption.sunarp ? ((value && value.length)|| t(langKeys.field_required)) : true });
        register('evaluationData.sunarp.urlapi', { validate: (value) => apiconsumption.sunarp ? ((value && value.length)|| t(langKeys.field_required)) : true });

    }, [edit, register, doctype, getValues, t, apiconsumption, ownCredentials]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (waitSaveUpload) {
            if (!uploadResult.loading && !uploadResult.error) {
                seticonsurl((prev) => ({ ...prev, [iconupload]: uploadResult.url }))
                dispatch(showBackdrop(false));
                seticonupload("")
                setWaitSaveUpload(false);
                dispatch(resetUploadFile());
            } else if (uploadResult.error) {
                setWaitSaveUpload(false);
            }
        }
    }, [waitSaveUpload, uploadResult, dispatch])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insOrg({ ...data, iconbot: iconsurl.iconbot, iconadvisor: iconsurl.iconadvisor, iconclient: iconsurl.iconclient })));
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
                            breadcrumbs={[...arrayBread, { id: "view-2", name: t(langKeys.organizationdetail) }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.orgdesc}` : t(langKeys.neworganization)}
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
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.informationorganization)} />
                    <AntTab label={t(langKeys.emailconfiguration)} />
                    {roledesc === "SUPERADMIN" && <AntTab label={t(langKeys.voximplant_organizationchanneltab)} />}
                    <AntTab label={t(langKeys.customer_evaluation)} />
                </Tabs>
                {pageSelected === 0 && <TabInformationOrganization 
                    data={{ row, edit }}
                    multiData={multiData}
                    getValues={getValues}
                    setValue={setValue}
                    trigger={trigger}
                    errors={errors}
                    dataCurrency={dataCurrency}
                    doctype={doctype}
                    setdoctype={setdoctype}
                />}
                {pageSelected === 1 && <TabEmailConfiguration
                    data={{ row, edit }}
                    getValues={getValues}
                    setValue={setValue}
                    errors={errors}
                    register={register}
                />}
                {(pageSelected === 2 )&& <TabVoxChannel
                    row={row}
                    getValues={getValues}
                    setValue={setValue}
                    errors={errors}
                    multiData={multiData}
                />}
                {pageSelected === 3 && 
                <TabEvaluation
                    getValues={getValues}
                    setValue={setValue}
                    errors={errors}
                    row={row}
                    apiconsumption ={apiconsumption}
                    setApiConsumption={setApiConsumption}
                    ownCredentials ={ownCredentials}
                    setOwnCredentials={setOwnCredentials}
                />
                }
            </form>
        </div>
    );
}


export default DetailOrganization;