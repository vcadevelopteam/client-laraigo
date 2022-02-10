/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useMemo, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, TemplateSwitch } from 'components';
import { getCorpSel, getOrgSel, getTimeZoneSel, getValuesFromDomain, getValuesFromDomainCorp, insOrg } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain, uploadFile, resetUploadFile } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { getCurrencyList } from "store/signup/actions";
import ClearIcon from '@material-ui/icons/Clear';
import { Box, Grid, IconButton, InputAdornment, Tabs } from '@material-ui/core';
import { Close, CloudUpload, Visibility, VisibilityOff } from '@material-ui/icons';
import { getCountryList } from 'store/signup/actions';

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
}));

const DetailOrganization: React.FC<DetailOrganizationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, dataCurrency }) => {
    const countryList = useSelector(state => state.signup.countryList);
    const user = useSelector(state => state.login.validateToken.user);
    const roledesc = user?.roledesc || "";
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [waitSaveUpload, setWaitSaveUpload] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [pageSelected, setPageSelected] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showCredential, setShowCredential] = useState(row?.private_mail || false);
    const uploadResult = useSelector(state => state.main.uploadFile);
    // const [valuefile, setvaluefile] = useState('')
    const [doctype, setdoctype] = useState(row?.doctype || ((row?.sunatcountry) === "PE" ? "1" : "0"))
    const [idUpload, setIdUpload] = useState('');
    const [iconupload, seticonupload] = useState('');
    const [iconsurl, seticonsurl] = useState({
        iconbot: row?.iconbot || "",
        iconadvisor: row?.iconadvisor || "",
        iconclient: row?.iconclient || "",
    });
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
            password: row?.password || "",
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
            iconbot: row?.iconbot || "",
            iconadvisor: row?.iconadvisor || "",
            iconclient: row?.iconclient || "",
            credittype: row?.credittype || "typecredit_alcontado",
            timezone: row?.timezone || "",
            timezoneoffset: row?.timezoneoffset || "",
        }
    });
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataCorp = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataDocType = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const typeofcreditList = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const timezoneList = multiData[5] && multiData[5].success ? multiData[5]?.data : [];

    const [chatBtn, setChatBtn] = useState<File | null>(getValues("iconbot") as File);
    const [headerBtn, setHeaderBtn] = useState<File | null>(getValues("iconadvisor") as File);
    const [botBtn, setBotBtn] = useState<File | null>(getValues("iconclient") as File);
    React.useEffect(() => {
        const docTypeValidate = (docnum: string): string | undefined => {
            if (!docnum) {
                return t(langKeys.field_required);
            }

            let msg = "";
            switch (doctype) {
                case "0": // OTROS o NO DOMICILIARIO
                    msg = t(langKeys.doctype_others_non_home_error);
                    return docnum.length > 15 ? msg : undefined;
                case "1": // DNI
                    msg = t(langKeys.doctype_dni_error);
                    return docnum.length !== 8 ? msg : undefined;
                case "4": // CARNET DE EXTRANJERIA
                    msg = t(langKeys.doctype_foreigners_card);
                    return docnum.length > 12 ? msg : undefined;
                case "6": // REG. UNICO DE CONTRIBUYENTES
                    msg = t(langKeys.doctype_ruc_error);
                    return docnum.length !== 11 ? msg : undefined;
                case "7": // PASAPORTE
                    msg = t(langKeys.doctype_passport_error);
                    return docnum.length > 12 ? msg : undefined;
                case "11": // PART. DE NACIMIENTO-IDENTIDAD
                default: return t(langKeys.doctype_unknown_error);
            }
        }

        register('corpid', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('currency', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('timezone', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('doctype', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('docnum', { validate: (value) => getValues('billbyorg') ? docTypeValidate(value) : true });
        register('businessname', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('fiscaladdress', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('contact', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('contactemail', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('sunatcountry', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('credittype', { validate: (value) => getValues('billbyorg') ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('host');
        register('ssl');
        register('private_mail');
    }, [edit, register, doctype, getValues, t]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
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
    const onSelectImage = (files: any, id: string) => {

        dispatch(showBackdrop(true));
        seticonupload(id)
        const idd = new Date().toISOString()
        var fd = new FormData();
        fd.append('file', files, files.name);
        // setvaluefile('')
        setIdUpload(idd);
        dispatch(uploadFile(fd));
        setWaitSaveUpload(true)
    }

    const arrayBread = [
        { id: "view-1", name: t(langKeys.organization) },
        { id: "view-2", name: t(langKeys.organizationdetail) }
    ];
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
        input!.click();
    }

    const handleHeaderBtnClick = () => {
        const input = document.getElementById('headerBtnInput');
        input!.click();
    }

    const handleBotBtnClick = () => {
        const input = document.getElementById('botBtnInput');
        input!.click();
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
        return countryList.data.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });
    }, [countryList]);

    const docTypes = useMemo(() => {
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
    }, [dataDocType, getValues("sunatcountry")]);

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
                    {false && <AntTab label={t(langKeys.chatimages)} />}
                </Tabs>
                {pageSelected === 0 && <div className={classes.containerDetail}>
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
                            onChange={(value) => {setValue('timezone', value ? value.code : ''); setValue('timezoneoffset', value ? value.houroffset : '')}}
                            error={errors?.timezone?.message}
                            data={timezoneList}
                            //uset={true}
                            //prefixTranslation="status_"
                            optionDesc="description"
                            optionValue="code"
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
                                    className="col-6"
                                    valueDefault={getValues('docnum')}
                                    onChange={(value) => setValue('docnum', value)}
                                    error={errors?.docnum?.message}
                                />
                            </div>
                            <div className="row-zyx">
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
                            {roledesc === "SUPERADMIN" && <div className="row-zyx">
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
                            </div>}
                        </>
                    )}
                </div>}
                {pageSelected === 1 &&
                    <div className={classes.containerDetail}>
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
                                            label={t(langKeys.email)} //transformar a multiselect
                                            className="col-6"
                                            fregister={{
                                                ...register("email", {
                                                    validate: (value) => (((value && value.length) && (value.includes("@") && value.includes("."))) || t(langKeys.emailverification)) || t(langKeys.field_required)
                                                })
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
                                            label={t(langKeys.port)} //transformar a multiselect
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
                                                ...register("password"
                                                    //,{ validate: (value) => (value && value.length) || t(langKeys.field_required)}
                                                )
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
                    </div>
                }
                {pageSelected === 2 &&
                    <div className={classes.containerDetail}>
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
                    </div>
                }
            </form>
        </div>
    );
}

const Organizations: FC = () => {
    const dispatch = useDispatch();
    const ressignup = useSelector(state => state.signup.currencyList);
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

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
                accessor: 'type',
                prefixTranslation: 'type_org_',
                NoFilter: true,
                Cell: (props: any) => {
                    const { type } = props.cell.row.original;
                    return (t(`type_org_${type}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency',
                NoFilter: true,
                /*prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }*/
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
            getTimeZoneSel()
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
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
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.organization_plural, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                onClickRow={handleEdit}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailOrganization
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                dataCurrency={ressignup.data}
            />
        )
    } else
        return null;

}

export default Organizations;