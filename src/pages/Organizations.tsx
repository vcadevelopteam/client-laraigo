import React, { FC, Fragment, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch, IOSSwitch } from 'components';
import { appsettingInvoiceSelCombo, getCityBillingList, getCorpSel, getCustomVariableSelByTableName, getDomainByDomainNameList, getOrgSel, getPaymentPlanSel, getPropertySelByNameOrg, getTimeZoneSel, getValuesFromDomain, getValuesFromDomainCorp, insOrg } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain, uploadFile, resetUploadFile, getCollectionAux2, setMemoryTable, cleanMemoryTable } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { getCurrencyList } from "store/signup/actions";
import ClearIcon from '@material-ui/icons/Clear';
import { Box, Grid, IconButton, InputAdornment, Tabs, FormControlLabel, Tooltip } from '@material-ui/core';
import { Close, CloudUpload, Visibility, VisibilityOff, Refresh as RefreshIcon, CompareArrows } from '@material-ui/icons';
import { getCountryList } from 'store/signup/actions';
import { formatNumber } from 'common/helpers';
import { getMaximumConsumption, transferAccountBalance, getAccountBalance, updateScenario } from "store/voximplant/actions";
import { CellProps } from 'react-table';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import CustomTableZyxEditable from 'components/fields/customtable-editable';

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
const getImgUrl = (file: File | null): string | null => {
    if (!file) return null;

    try {
        const url = URL.createObjectURL(file);
        return url;
    } catch (ex) {
        console.error(ex);
        return null;
    }
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
    imgContainer: {
        borderRadius: 20,
        backgroundColor: 'white',
        width: 157,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
    img: {
        height: '80%',
        width: 'auto',
    },
    notdisplay: {
        display: 'none',
    },
    section: {
        fontWeight: "bold"
    }
}));

const DetailOrganization: React.FC<DetailOrganizationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, dataCurrency, arrayBread }) => {
    const countryList = useSelector(state => state.signup.countryList);
    const user = useSelector(state => state.login.validateToken.user);
    const roledesc = user?.roledesc || "";
    const domainsCustomTable = useSelector((state) => state.main.mainAux2);
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [waitSaveUpload, setWaitSaveUpload] = useState(false);
    const [waitTransferBalance, setWaitTransferBalance] = useState(false);
    const [waitGetBalance, setWaitGetBalance] = useState(false);
    const [waitUpdateScenario, setWaitUpdateScenario] = useState(false);
    const [waitGetConsumption, setWaitGetConsumption] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showCredential, setShowCredential] = useState(row?.private_mail || false);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const getBalanceResult = useSelector(state => state.voximplant.requestGetAccountBalance);
    const updateScenarioResult = useSelector(state => state.voximplant.requestUpdateScenario);
    const getConsumptionResult = useSelector(state => state.voximplant.requestGetMaximumConsumption);
    const transferBalanceResult = useSelector(state => state.voximplant.requestTransferAccountBalance);
    const [idUpload, setIdUpload] = useState('');
    const [skipAutoReset, setSkipAutoReset] = useState(false)
    const [updatingDataTable, setUpdatingDataTable] = useState(false);
    const [tableDataVariables, setTableDataVariables] = useState<Dictionary[]>([]);
    const [iconupload, seticonupload] = useState('');
    const [iconsurl, seticonsurl] = useState({
        iconbot: row?.iconbot || "",
        iconadvisor: row?.iconadvisor || "",
        iconclient: row?.iconclient || "",
    });

    const dataPaymentPlan = multiData[13] && multiData[13].success ? multiData[13].data : [];
    const defaultRecharge = multiData[6] && multiData[6].success ? multiData[6]?.data : [];
    const defaultRange = multiData[7] && multiData[7].success ? multiData[7]?.data : [];
    const defaultPercentage = multiData[8] && multiData[8].success ? multiData[8]?.data : [];
    const defaultChannel = multiData[9] && multiData[9].success ? multiData[9]?.data : [];

    const { register, handleSubmit, setValue, getValues, trigger, watch, formState: { errors } } = useForm({
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
            automaticperiod: row?.billbyorg ? (row ? row?.automaticperiod || false : true) : true,
            automaticinvoice: row?.billbyorg ? (row ? row?.automaticinvoice || false : true) : true,
            iconbot: row?.iconbot || "",
            iconadvisor: row?.iconadvisor || "",
            iconclient: row?.iconclient || "",
            credittype: row?.credittype || "typecredit_alcontado",
            timezone: row?.timezone || "",
            paymentplanid: row?.paymentplanid || 0,
            timezoneoffset: row?.timezoneoffset || "",
            voximplantautomaticrecharge: row ? (row?.voximplantautomaticrecharge || false) : (defaultRecharge[0]?.propertyvalue === '1' ? true : false),
            voximplantrechargerange: row ? (row?.voximplantrechargerange || 0) : (parseFloat(defaultRange[0]?.propertyvalue) || 0),
            voximplantrechargepercentage: row ? (row?.voximplantrechargepercentage || 0.00) : (parseFloat(defaultPercentage[0]?.propertyvalue) || 0),
            voximplantrechargefixed: row?.voximplantrechargefixed || 0.00,
            voximplantadditionalperchannel: row ? (row?.voximplantadditionalperchannel || 0.00) : (parseFloat(defaultChannel[0]?.propertyvalue) || 0),
            appsettingid: row ? row.appsettingid : null,
            citybillingid: row ? row.citybillingid : null,
            paymentmethod: row?.paymentmethod || "",
        }
    });

    const sunatcountry = watch("sunatcountry");
    const doctype = watch("doctype");
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataCorp = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataDocType = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const typeofcreditList = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const timezoneList = multiData[5] && multiData[5].success ? multiData[5]?.data : [];
    const locationList = multiData[10] && multiData[10].success ? multiData[10].data : [];
    const cityList = multiData[11] && multiData[11].success ? multiData[11].data : [];

    const [chargeAmount, setChargeAmount] = useState(0.00);
    const [rangeAmount, setRangeAmount] = useState(row?.voximplantrechargerange || 0.00);
    const [percentageAmount, setPercentageAmount] = useState(row?.voximplantrechargepercentage || 0.00);
    const [fixedAmount, setFixedAmount] = useState(row?.voximplantrechargefixed || 0.00);
    const [costMaximum, setCostMaximum] = useState(0.00);
    const [costLimit, setCostLimit] = useState(0.00);
    const [firstLoadBalance, setFirstLoadBalance] = useState(true);
    const [firstLoadConsumption, setFirstLoadConsumption] = useState(true);
    const [balanceChild, setBalanceChild] = useState(0.00);
    const [balanceParent, setBalanceParent] = useState(0.00);
    const [checkedAutomaticRecharge, setCheckedAutomaticRecharge] = useState(row ? (row?.voximplantautomaticrecharge || false) : (defaultRecharge[0]?.propertyvalue === '1' ? true : false));
    const [chatBtn, setChatBtn] = useState<File | null>(getValues("iconbot") as File);
    const [headerBtn, setHeaderBtn] = useState<File | null>(getValues("iconadvisor") as File);
    const [botBtn, setBotBtn] = useState<File | null>(getValues("iconclient") as File);

    const updateCell = (rowIndex: number, columnId: string, value: string) => {
        setSkipAutoReset(true);
        const auxTableData = tableDataVariables
        auxTableData[rowIndex][columnId] = value
        setTableDataVariables(auxTableData)
        setUpdatingDataTable(!updatingDataTable);
    }

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
                dnivalidation: (value: any) => getValues('billbyorg') ? ((doctype === "1") ? ((value && value.length === 8) || t(langKeys.doctype_dni_error)) : true) : true,
                cevalidation: (value: any) => getValues('billbyorg') ? ((doctype === "4") ? ((value && value.length === 12) || t(langKeys.doctype_foreigners_card)) : true) : true,
                rucvalidation: (value: any) => getValues('billbyorg') ? ((doctype === "6") ? ((value && value.length === 11) || t(langKeys.doctype_ruc_error)) : true) : true,
                passportvalidation: (value: any) => getValues('billbyorg') ? ((doctype === "7") ? ((value && value.length === 12) || t(langKeys.doctype_passport_error)) : true) : true,
                needsvalidation: (value: any) => getValues('billbyorg') ? ((doctype !== "1" && doctype !== "4" && doctype !== "6" && doctype !== "7") ? ((value) || t(langKeys.field_required)) : true) : true,
            }
        });
        register('businessname', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('fiscaladdress', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('contact', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('contactemail', {
            validate: {
                hasvalue: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true,
                isemail: (value) => getValues('billbyorg') ? ((/\S+@\S+\.\S+/.test(value)) || String(t(langKeys.emailverification))) : true
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
        register('voximplantrechargerange', { validate: (value) => roledesc?.includes("SUPERADMIN") ? (((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required)) : true });
        register('voximplantrechargepercentage', { validate: (value) => roledesc?.includes("SUPERADMIN") ? (((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required)) : true });
        register('voximplantrechargefixed', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('voximplantadditionalperchannel', { validate: (value) => roledesc?.includes("SUPERADMIN") ? (((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required)) : true });
        register('appsettingid', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('citybillingid');
        register("paymentplanid", { validate: (value) => getValues('billbyorg') ? ((value && value > 0) || t(langKeys.field_required)) : true });
    }, [edit, register, doctype, getValues, t]);

    useEffect(() => {
        if (row) {
            if (row?.orgid && row?.voximplantrechargerange) {
                handleGetConsumption(row?.orgid, row?.voximplantrechargerange, row?.timezoneoffset);
                handleGetBalance(row?.orgid);
            }
        }
    }, [row])

    useEffect(() => {
        if (multiData[12]) {
            const variableDataList = multiData[12].data || []
            setTableDataVariables(variableDataList.map(x => ({ ...x, value: row?.variablecontext[x.variablename] || "" })))
        }
    }, [multiData]);

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
    }, [waitSaveUpload, uploadResult, dispatch, idUpload])

    useEffect(() => {
        if (waitGetConsumption) {
            if (!getConsumptionResult.loading) {
                if (!getConsumptionResult.error) {
                    !firstLoadConsumption && dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }))
                    if (getConsumptionResult.data) {
                        setCostMaximum(getConsumptionResult.data.maximumconsumption || 0);
                        setCostLimit((parseFloat(fixedAmount) || 0) + ((parseFloat(getConsumptionResult.data.maximumconsumption) || 0) * ((parseFloat(percentageAmount) || 0) + 1)));
                    }
                    setFirstLoadConsumption(false)
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((getConsumptionResult.msg || getConsumptionResult.message) || getConsumptionResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitGetConsumption(false);
            }
        }
    }, [getConsumptionResult, waitGetConsumption])

    useEffect(() => {
        if (waitTransferBalance) {
            if (!transferBalanceResult.loading) {
                if (!transferBalanceResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((transferBalanceResult.msg || transferBalanceResult.message) || transferBalanceResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitTransferBalance(false);
            }
        }
    }, [transferBalanceResult, waitTransferBalance])

    useEffect(() => {
        if (waitGetBalance) {
            if (!getBalanceResult.loading) {
                if (!getBalanceResult.error) {
                    !firstLoadBalance && dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                    if (getBalanceResult.data) {
                        setBalanceChild(getBalanceResult.data.balancechild || 0);
                        setBalanceParent(getBalanceResult.data.balanceparent || 0);
                    }
                    setFirstLoadBalance(false)
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((getBalanceResult.msg || getBalanceResult.message) || getBalanceResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitGetBalance(false);
            }
        }
    }, [getBalanceResult, waitGetBalance])

    useEffect(() => {
        if (waitUpdateScenario) {
            if (!updateScenarioResult.loading) {
                if (!updateScenarioResult.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(((updateScenarioResult.msg || updateScenarioResult.message) || updateScenarioResult.code) || 'error_unexpected_error') }));
                }
                dispatch(showBackdrop(false));
                setWaitUpdateScenario(false);
            }
        }
    }, [updateScenarioResult, waitUpdateScenario])

    const handleUpdateScenario = () => {
        dispatch(updateScenario({}));
        setWaitUpdateScenario(true);
        dispatch(showBackdrop(true));
    }

    const handleGetBalance = (orgid: any) => {
        dispatch(getAccountBalance({ orgid: orgid }));
        setWaitGetBalance(true);
        dispatch(showBackdrop(true));
    }

    const handleGetConsumption = (orgid: any, daterange: any, timezoneoffset: any) => {
        dispatch(getMaximumConsumption({ orgid: orgid, daterange: daterange, timezoneoffset: timezoneoffset }));
        setWaitGetConsumption(true);
        dispatch(showBackdrop(true));
    }

    const handleTransferBalance = (orgid: any, transferamount: any, toparent: boolean) => {
        dispatch(transferAccountBalance({ orgid: orgid, transferamount: (toparent ? transferamount * -1 : transferamount) }));
        setWaitTransferBalance(true);
        dispatch(showBackdrop(true));
        setChargeAmount(0.00);
    }

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insOrg({
                ...data, iconbot: iconsurl.iconbot, iconadvisor: iconsurl.iconadvisor, iconclient: iconsurl.iconclient,
                variablecontext: tableDataVariables.filter(x => x.value).reduce((acc, x) => ({ ...acc, [x.variablename]: x.value }), {})
            })));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const onSelectImage = (files: any, id: string) => {

        dispatch(showBackdrop(true));
        seticonupload(id)
        const idd = new Date().toISOString()
        const fd = new FormData();
        fd.append('file', files, files.name);
        setIdUpload(idd);
        dispatch(uploadFile(fd));
        setWaitSaveUpload(true)
    }

    const onChangeChatInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setChatBtn(e.target.files[0]);
        setValue("iconbot", e.target.files[0]);
        onSelectImage(e.target.files[0], "iconbot")
    }

    const onChangeHeaderInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setHeaderBtn(e.target.files[0]);
        setValue('iconadvisor', e.target.files[0]);
        onSelectImage(e.target.files[0], "iconadvisor")
    }

    const onChangeBotInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        setBotBtn(e.target.files[0]);
        setValue('iconclient', e.target.files[0]);
        onSelectImage(e.target.files[0], "iconclient")
    }

    const handleChatBtnClick = () => {

        const input = document.getElementById('chatBtnInput');
        input?.click();
    }

    const handleHeaderBtnClick = () => {
        const input = document.getElementById('headerBtnInput');
        input?.click();
    }

    const handleBotBtnClick = () => {
        const input = document.getElementById('botBtnInput');
        input?.click();
    }

    const handleCleanChatInput = () => {
        if (!chatBtn) return;

        seticonsurl((prev) => ({ ...prev, iconbot: "" }))
        const input = document.getElementById('chatBtnInput') as HTMLInputElement;
        input.value = "";
        setChatBtn(null);
        setValue('iconbot', null);
    }

    const handleCleanHeaderInput = () => {
        if (!headerBtn) return;
        seticonsurl((prev) => ({ ...prev, iconadvisor: "" }))
        const input = document.getElementById('headerBtnInput') as HTMLInputElement;
        input.value = "";
        setHeaderBtn(null);
        setValue('iconadvisor', null);
    }

    const handleCleanBotInput = () => {
        if (!botBtn) return;
        seticonsurl((prev) => ({ ...prev, iconclient: "" }))
        const input = document.getElementById('botBtnInput') as HTMLInputElement;
        input.value = "";
        setBotBtn(null);
        setValue('iconclient', null);
    }

    const chatImgUrl = getImgUrl(chatBtn);
    const headerImgUrl = getImgUrl(headerBtn);
    const botImgUrl = getImgUrl(botBtn);

    const countries = useMemo(() => {
        if (countryList.loading) return [];
        return countryList.data.sort((a: Dictionary, b: Dictionary) => {
            return a.description.localeCompare(b.description);
        });
    }, [countryList]);

    const docTypes = useMemo(() => {
        if (!dataDocType || dataDocType.length === 0 || !sunatcountry) return [];
        const val = dataDocType as any[];

        return val.sort((a, b) => {
            return a.domaindesc.localeCompare(b.domaindesc);
        });
    }, [dataDocType, sunatcountry]);

    const emailRequired = (value: string) => {
        if (value.length === 0) {
            return t(langKeys.field_required) as string;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            return t(langKeys.emailverification) as string;
        }
    }
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.variable),
                accessor: 'variablename',
                NoFilter: true,
                sortType: 'string'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
                sortType: 'string',
            },
            {
                Header: t(langKeys.datatype),
                accessor: 'variabletype',
                NoFilter: true,
                sortType: 'string',
                prefixTranslation: 'datatype_',
                Cell: (props: any) => {
                    const { variabletype } = props.cell.row.original || {};
                    return (t(`datatype_${variabletype}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.value),
                accessor: 'value',
                NoFilter: true,
                type: 'string',
                editable: true,
                width: 250,
                maxWidth: 250
            },
        ],
        []
    )

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
                                onClick={() => {
                                    console.log(errors)
                                }}
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
                    {roledesc?.includes("SUPERADMIN") && <AntTab label={t(langKeys.voximplant_organizationchanneltab)} />}
                    {false && <AntTab label={t(langKeys.chatimages)} />}
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.customvariables} />
                                <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.customvariableslist_helper_lead)}</div>} arrow placement="top" >
                                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                </Tooltip>
                            </div>
                        )} value={4} />
                </Tabs>
                {pageSelected === 0 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            (
                                !row && ((roledesc ?? "").split(",").some(v => ['SUPERADMIN'].includes(v))) ?
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
                                        disabled={!((roledesc ?? "").split(",").some(v => ['SUPERADMIN'].includes(v)))}
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
                        <FieldSelect
                            label={t(langKeys.corporation_location)}
                            className="col-6"
                            valueDefault={getValues("appsettingid")}
                            onChange={(value) => setValue('appsettingid', value?.appsettingid || null)}
                            data={locationList}
                            error={errors?.appsettingid?.message}
                            optionDesc="tradename"
                            optionValue="appsettingid"
                        />
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
                            disabled={!edit}
                        />
                    </div>
                    <div className="row-zyx">
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
                            disabled={!edit}
                        />
                        <FieldSelect
                            label={t(langKeys.currency)}
                            className="col-6"
                            valueDefault={getValues('currency')}
                            onChange={(value) => setValue('currency', value ? value.code : '')}
                            error={errors?.currency?.message}
                            data={dataCurrency}
                            disabled={!edit}
                            optionDesc="description"
                            optionValue="code"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.timezone)}
                            className="col-6"
                            valueDefault={getValues('timezone')}
                            onChange={(value) => { setValue('timezone', value?.description || ''); setValue('timezoneoffset', value?.houroffset || '') }}
                            error={errors?.timezone?.message}
                            data={timezoneList.map(x => { return { ...x, textimezone: `(${x.houroffsettext}) ${x.description}` } })}
                            optionDesc="textimezone"
                            optionValue="description"
                        />
                        {getValues('billbyorg') && <FieldSelect
                                label={t(langKeys.billingplan)}
                                className="col-6"
                                valueDefault={getValues("paymentplanid")}
                                onChange={(value) => setValue("paymentplanid", value?.paymentplanid || 0)}
                                data={dataPaymentPlan}
                                error={errors?.paymentplanid?.message}
                                optionDesc="plan"
                                optionValue="paymentplanid"
                            />}
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
                                    onChange={(value) => {
                                        setValue("doctype", value?.domainvalue || "");
                                        setValue("docnum","")
                                    }}
                                    error={errors?.doctype?.message}
                                    data={docTypes}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <FieldEdit
                                    label={t(langKeys.documentnumber)}
                                    className="col-6"
                                    type={(doctype !== "0")?'number':"text"}
                                    valueDefault={getValues('docnum')}
                                    onChange={(value: any) => setValue('docnum', value)}
                                    error={errors?.docnum?.message}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldEdit
                                    label={t(langKeys.businessname)}
                                    className={!(['0', '1', '4', '6', '7', ''].includes(doctype || '')) ? "col-6" : "col-12"}
                                    valueDefault={getValues('businessname')}
                                    onChange={(value) => setValue('businessname', value)}
                                    error={errors?.businessname?.message}
                                />
                                {!(['0', '1', '4', '6', '7', ''].includes(doctype || '')) && <FieldSelect
                                    label={t(langKeys.citybilling)}
                                    className="col-6"
                                    valueDefault={getValues("citybillingid")}
                                    onChange={(value) => setValue('citybillingid', value?.citybillingid || null)}
                                    data={cityList}
                                    error={errors?.citybillingid?.message}
                                    optionDesc="locationdescription"
                                    optionValue="citybillingid"
                                />}
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
                            {roledesc?.includes("SUPERADMIN") &&
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
                </div>}
                {pageSelected === 1 && <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <TemplateSwitch
                                label={t(langKeys.private_mail)}
                                className="col-6"
                                valueDefault={getValues("private_mail")}
                                onChange={(value) => { setValue('private_mail', value); setShowCredential(value) }}
                            /> :
                            <FieldView
                                label={"private_mail"}
                                value={row ? (row.private_mail ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                className="col-6"
                            />
                        }
                    </div>
                    {
                        showCredential &&

                        <Fragment>
                            <div className="row-zyx">
                                {edit ?
                                    <FieldEdit
                                        label={t(langKeys.email)}
                                        className="col-6"
                                        fregister={{
                                            ...register("email", { validate: emailRequired, value: '' })
                                        }}
                                        error={errors?.email?.message}
                                        onChange={(value) => setValue('email', value)}
                                        valueDefault={getValues("email")}
                                    />
                                    : <FieldView
                                        label={t(langKeys.email)}
                                        value={row ? (row.email || "") : ""}
                                        className="col-6"
                                    />}
                                {edit ?
                                    <FieldEdit
                                        label={t(langKeys.port)}
                                        className="col-6"
                                        type="number"
                                        fregister={{
                                            ...register("port", {
                                                validate: (value) => (value && value > 0) || t(langKeys.validnumber)
                                            })
                                        }}
                                        error={errors?.port?.message}
                                        onChange={(value) => setValue('port', value)}
                                        valueDefault={getValues("port")}
                                    />
                                    : <FieldView
                                        label={t(langKeys.port)}
                                        value={row ? (row.port || 0) : 0}
                                        className="col-6"
                                    />}
                            </div>
                            <div className="row-zyx">
                                {edit ?
                                    <FieldEdit
                                        label={t(langKeys.password)}
                                        className="col-6"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(value) => setValue('password', value)}
                                        valueDefault={getValues("password")}
                                        fregister={{
                                            ...register("password")
                                        }}
                                        error={errors?.password?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    : ""}
                            </div>
                            <div className="row-zyx">
                                {edit ?
                                    <FieldEdit
                                        label={t(langKeys.host)}
                                        className="col-6"
                                        fregister={{
                                            ...register("host", {
                                                validate: (value) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        error={errors?.host?.message}
                                        onChange={(value: any) => setValue('host', value)}
                                        valueDefault={getValues("host")}
                                    />
                                    : <FieldView
                                        label={t(langKeys.host)}
                                        value={row ? (row.host || "") : ""}
                                        className="col-6"
                                    />
                                }
                                {edit ?
                                    <TemplateSwitch
                                        label={"SSL"}
                                        className="col-3"
                                        valueDefault={getValues("ssl")}
                                        onChange={(value) => setValue('ssl', value)}
                                    /> :
                                    <FieldView
                                        label={"SSL"}
                                        value={row ? (row.ssl ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                        className="col-6"
                                    />
                                }
                                {edit ?
                                    <TemplateSwitch
                                        label={t(langKeys.default_credentials)}
                                        className="col-3"
                                        valueDefault={getValues("default_credentials")}
                                        onChange={(value) => setValue('default_credentials', value)}
                                    /> :
                                    <FieldView
                                        label={t(langKeys.default_credentials)}
                                        value={row ? (row.default_credentials ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                        className="col-6"
                                    />
                                }
                            </div>
                        </Fragment>

                    }
                </div>}
                {pageSelected === 2 && <>
                    <div className={classes.containerDetail}>
                        {row?.orgid && <div>
                            <div style={{ marginLeft: "auto", marginRight: "0px", float: "right" }}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<RefreshIcon color="secondary" />}
                                    style={{ backgroundColor: "#55BD84" }}
                                    onClick={() => handleGetConsumption(row?.orgid, (getValues('voximplantrechargerange') || 0), (getValues('timezoneoffset') || 0))}
                                    disabled={((rangeAmount || 0) <= 0)}
                                >{t(langKeys.calculate)}</Button>
                            </div>
                        </div>}
                        <div className="row-zyx">
                            <FieldView
                                className={classes.section}
                                label={''}
                                value={t(langKeys.voximplant_organizationchannelrecharge)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.voximplant_organizationchanneladditional)}
                                className="col-6"
                                valueDefault={getValues('voximplantadditionalperchannel')}
                                onChange={(value) => setValue('voximplantadditionalperchannel', value)}
                                error={errors?.voximplantadditionalperchannel?.message}
                                type="number"
                                inputProps={{ step: "any" }}
                            />
                            <div className={"col-6"} style={{ paddingBottom: '3px' }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.voximplant_organizationenabledrecharge)}</Box>
                                <FormControlLabel
                                    style={{ paddingLeft: 10 }}
                                    control={<IOSSwitch checked={checkedAutomaticRecharge} onChange={(e) => { setCheckedAutomaticRecharge(e.target.checked); setValue('voximplantautomaticrecharge', e.target.checked) }} />}
                                    label={""}
                                />
                            </div>
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.voximplant_organizationchannelrange)}
                                className="col-6"
                                valueDefault={getValues('voximplantrechargerange')}
                                onChange={(value) => { setValue('voximplantrechargerange', value); setRangeAmount(value || 0); }}
                                error={errors?.voximplantrechargerange?.message}
                                type="number"
                            />
                            <FieldEdit
                                label={t(langKeys.voximplant_organizationchannelpercentage)}
                                className="col-6"
                                valueDefault={getValues('voximplantrechargepercentage')}
                                onChange={(value) => { setValue('voximplantrechargepercentage', value); setPercentageAmount(value || 0); }}
                                error={errors?.voximplantrechargepercentage?.message}
                                type="number"
                                inputProps={{ step: "any" }}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.voximplant_organizationchannelfixed)}
                                className="col-6"
                                valueDefault={getValues('voximplantrechargefixed')}
                                onChange={(value) => { setValue('voximplantrechargefixed', value); setFixedAmount(value || 0); }}
                                error={errors?.voximplantrechargefixed?.message}
                                type="number"
                                inputProps={{ step: "any" }}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.voximplant_organizationcostmaximum)}
                                value={formatNumber(row?.orgid ? costMaximum : 0)}
                                className="col-6"
                            />
                            <FieldView
                                label={t(langKeys.voximplant_organizationcostlimit)}
                                value={formatNumber(row?.orgid ? costLimit : 0)}
                                className="col-6"
                            />
                        </div>
                    </div>
                    <div className={classes.containerDetail}>
                        {row?.orgid && <div>
                            <div style={{ marginLeft: "auto", marginRight: "0px", float: "right" }}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<CompareArrows color="secondary" />}
                                    style={{ backgroundColor: "#55BD84", marginRight: "10px" }}
                                    onClick={() => handleTransferBalance(row?.orgid, (chargeAmount || 0), false)}
                                    disabled={((chargeAmount || 0) <= 0)}
                                >{t(langKeys.voximplant_organizationchannelcharge)}</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<CompareArrows color="secondary" />}
                                    style={{ backgroundColor: "#FB5F5F" }}
                                    onClick={() => handleTransferBalance(row?.orgid, (chargeAmount || 0), true)}
                                    disabled={((chargeAmount || 0) <= 0)}
                                >{t(langKeys.voximplant_organizationchannelreturn)}</Button>
                            </div>
                        </div>}
                        {row?.orgid && <>
                            <div className="row-zyx">
                                <FieldView
                                    className={classes.section}
                                    label={''}
                                    value={t(langKeys.voximplant_organizationmanualrecharge)}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldEdit
                                    label={t(langKeys.voximplant_organizationchannelamount)}
                                    className="col-12"
                                    valueDefault={chargeAmount}
                                    onChange={(value) => setChargeAmount(value || 0)}
                                    type="number"
                                    inputProps={{ step: "any" }}
                                />
                            </div>
                        </>}
                    </div>
                    <div className={classes.containerDetail}>
                        {row?.orgid && <div>
                            <div style={{ marginLeft: "auto", marginRight: "0px", float: "right" }}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<RefreshIcon color="secondary" />}
                                    style={{ backgroundColor: "#55BD84" }}
                                    onClick={() => handleGetBalance(row?.orgid)}
                                >{t(langKeys.voximplant_organizationgetcredit)}</Button>
                            </div>
                        </div>}
                        {row?.orgid && <div className="row-zyx">
                            <FieldView
                                className={classes.section}
                                label={''}
                                value={t(langKeys.voximplant_organizationchannelcredit)}
                            />
                        </div>}
                        {row?.orgid && <div className="row-zyx">
                            <FieldView
                                label={t(langKeys.voximplant_organizationchildcredit)}
                                value={formatNumber(balanceChild || 0)}
                                className="col-6"
                            />
                            <FieldView
                                label={t(langKeys.voximplant_organizationfathercredit)}
                                value={formatNumber(balanceParent || 0)}
                                className="col-6"
                            />
                        </div>}
                    </div>
                    <div className={classes.containerDetail}>
                        {row?.orgid && <div>
                            <div style={{ marginLeft: "auto", marginRight: "0px", float: "right" }}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<RefreshIcon color="secondary" />}
                                    style={{ backgroundColor: "#55BD84" }}
                                    onClick={() => handleUpdateScenario()}
                                >{t(langKeys.voximplant_organizationupdatescenario)}</Button>
                            </div>
                        </div>}
                        {row?.orgid && <div className="row-zyx">
                            <FieldView
                                className={classes.section}
                                label={''}
                                value={t(langKeys.scenario)}
                            />
                        </div>}
                        {row?.orgid && <div className="row-zyx">
                            <FieldView
                                label={''}
                                value={t(langKeys.voximplant_organizationupdatescenarioalert)}
                                className="col-12"
                            />
                        </div>}
                    </div>
                </>}
                {pageSelected === 3 && <div className={classes.containerDetail}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.boticon} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <div className={classes.imgContainer}>
                                            {(chatImgUrl || iconsurl?.iconbot) && <img alt="chatweb" src={chatImgUrl || iconsurl?.iconbot} className={classes.img} />}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="chatBtnInput"
                                                type="file"
                                                onChange={onChangeChatInput}
                                            />
                                            <IconButton onClick={handleChatBtnClick}>
                                                <CloudUpload className={classes.icon} />
                                            </IconButton>
                                            <IconButton onClick={handleCleanChatInput}>
                                                <Close className={classes.icon} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.advisoricon} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <div className={classes.imgContainer}>
                                            {(headerImgUrl || iconsurl?.iconadvisor) && <img alt="chatweb" src={headerImgUrl || iconsurl?.iconadvisor} className={classes.img} />}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="headerBtnInput"
                                                type="file"
                                                onChange={onChangeHeaderInput}
                                            />
                                            <IconButton onClick={handleHeaderBtnClick}>
                                                <CloudUpload className={classes.icon} />
                                            </IconButton>
                                            <IconButton onClick={handleCleanHeaderInput}>
                                                <Close className={classes.icon} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                    <label className={classes.text}>
                                        <Trans i18nKey={langKeys.clienticon} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <div className={classes.imgContainer}>
                                            {(botImgUrl || iconsurl?.iconclient) && <img alt="chatweb" src={botImgUrl || iconsurl.iconclient} className={classes.img} />}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginLeft: 12 }}>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="botBtnInput"
                                                type="file"
                                                onChange={onChangeBotInput}
                                            />
                                            <IconButton onClick={handleBotBtnClick}>
                                                <CloudUpload className={classes.icon} />
                                            </IconButton>
                                            <IconButton onClick={handleCleanBotInput}>
                                                <Close className={classes.icon} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </div>}
                {pageSelected === 4 && <div className={classes.containerDetail}>
                    <CustomTableZyxEditable
                        columns={columns}
                        data={(tableDataVariables).map(x => ({
                            ...x,
                            domainvalues: (domainsCustomTable?.data || []).filter(y => y.domainname === x?.domainname)
                        }))}
                        download={false}
                        //loading={multiData.loading}
                        register={false}
                        filterGeneral={false}
                        updateCell={updateCell}
                        skipAutoReset={skipAutoReset}
                    />
                </div>}
            </form>
        </div>
    );
}

const IDORGANIZATION = 'IDORGANIZATION';
const Organizations: FC = () => {
    const dispatch = useDispatch();
    const ressignup = useSelector(state => state.signup.currencyList);
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const memoryTable = useSelector(state => state.main.memoryTable);

    const [generalFilter, setGeneralFilter] = useState("");
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [data, setData] = useState<any[]>([]);


    const arrayBread = [
        { id: "view-1", name: t(langKeys.organization_plural) },
    ];
    function redirectFunc(view: string) {
        setViewSelected(view)
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'orgid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'typeTranslated',
                NoFilter: true,
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { status } = props.cell.row.original || {};
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                NoFilter: true,
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getOrgSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getCurrencyList())
        dispatch(getCountryList())
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("TIPOORG"),
            getCorpSel(0),
            getValuesFromDomainCorp('BILLINGDOCUMENTTYPE', '_DOCUMENT', 1, 0),
            getValuesFromDomain("TYPECREDIT"),
            getTimeZoneSel(),
            getPropertySelByNameOrg("VOXIMPLANTAUTOMATICRECHARGE", 0, "_RECHARGE"),
            getPropertySelByNameOrg("VOXIMPLANTRECHARGERANGE", 0, "_RANGE"),
            getPropertySelByNameOrg("VOXIMPLANTRECHARGEPERCENTAGE", 0, "_PERCENTAGE"),
            getPropertySelByNameOrg("VOXIMPLANTADDITIONALPERCHANNEL", 0, "_CHANNEL"),
            appsettingInvoiceSelCombo(),
            getCityBillingList(),
            getCustomVariableSelByTableName("org"),
            getPaymentPlanSel(),
        ]));
        dispatch(setMemoryTable({
            id: IDORGANIZATION
        }))
        return () => {
            dispatch(cleanMemoryTable());
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.loading && !mainResult.mainData.error) {
            setData(mainResult.mainData.data.map(x => {
                return { ...x, typeTranslated: (t(`type_org_${x.type}`.toLowerCase()) || "").toUpperCase() }
            }))
        }
    }, [mainResult.mainData]);
    useEffect(() => {
        if (!mainResult.multiData.loading && !mainResult.multiData.error && mainResult.multiData.data?.[12]) {
            dispatch(getCollectionAux2(getDomainByDomainNameList(mainResult.multiData?.data?.[12]?.data.filter(item => item.domainname !== "").map(item => item.domainname).join(","))));
        }
    }, [mainResult.multiData]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insOrg({ ...row, description: row.orgdesc, type: row.type, operation: 'DELETE', status: 'ELIMINADO', id: row.orgid, currency: row.currency })));
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
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.organization_plural, { count: 2 })}
                    data={data}
                    download={true}
                    onClickRow={handleEdit}
                    loading={mainResult.mainData.loading}
                    register={true}
                    defaultGlobalFilter={generalFilter}
                    setOutsideGeneralFilter={setGeneralFilter}
                    handleRegister={handleRegister}
                    pageSizeDefault={IDORGANIZATION === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDORGANIZATION === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDORGANIZATION === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailOrganization
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                dataCurrency={ressignup.data}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

export default Organizations;