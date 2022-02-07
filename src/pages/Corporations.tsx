/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TemplateSwitch, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { getCorpSel, getPaymentPlanSel, getValuesFromDomain, getValuesFromDomainCorp, insCorp } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, execute, getMultiCollection, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { CommonService } from 'network';
import { getCountryList } from 'store/signup/actions';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
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
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
}));

const Corporations: FC = () => {
    const user = useSelector(state => state.login.validateToken.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'corpid',
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
                Header: t(langKeys.corporation),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'typedesc',
                NoFilter: true,
                // Cell: (props: any) => {
                //     const { type } = props.cell.row.original;
                //     return (t(`type_corp_${type}`.toLowerCase()) || "").toUpperCase()
                // }
            },
            {
                Header: t(langKeys.billingplan),
                accessor: 'paymentplandesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'statusdesc',
                NoFilter: true,
                // prefixTranslation: 'status_',
                // Cell: (props: any) => {
                //     const { status } = props.cell.row.original;
                //     return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                // }
            }
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getCorpSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getCountryList())
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("TIPOCORP"),
            getPaymentPlanSel(),
            getValuesFromDomainCorp('BILLINGDOCUMENTTYPE', '_DOCUMENT', 1, 0),
            getValuesFromDomain("TYPECREDIT"),
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
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
            dispatch(execute(insCorp({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.corpid })));
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
                onClickRow={handleEdit}
                titlemodule={t(langKeys.corporation_plural, { count: 2 })}
                data={mainResult.mainData.data.map(x => ({
                    ...x,
                    typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
                    statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
                }))}
                download={true}
                loading={mainResult.mainData.loading}
                register={['SUPERADMIN'].includes(user?.roledesc || "")}
                handleRegister={handleRegister}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailCorporation
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

interface DetailCorporationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}

const DetailCorporation: React.FC<DetailCorporationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [billbyorg, setbillbyorg] = useState(row?.billbyorg || false);
    const [doctype, setdoctype] = useState( row?.doctype || ((row?.sunatcountry) === "PE" ? "1" : "0"))
    const dataDocType = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataPaymentPlan = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const countryList = useSelector(state => state.signup.countryList);
    const typeofcreditList = multiData[4] && multiData[4].success ? multiData[4].data : [];

    const { register, handleSubmit, setValue, trigger, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.corpid : 0,
            description: row ? (row.description || '') : '',
            type: row ? row.type : 'NINGUNO',
            status: row?.status || 'ACTIVO',
            logo: row ? row.logo : '',
            logotype: row ? row.logotype : '',
            paymentplanid: row?.paymentplanid || 0,
            billbyorg: row?.billbyorg || false,
            doctype: row?.doctype || '',
            docnum: row?.docnum || '',
            businessname: row?.businessname || '',
            fiscaladdress: row?.fiscaladdress || '',
            sunatcountry: row?.sunatcountry || '',
            contactemail: row?.contactemail || '',
            contact: row?.contact || '',
            autosendinvoice: row?.autosendinvoice || false,
            credittype: row?.credittype || "typecredit_alcontado",
            operation: row ? "UPDATE" : "INSERT",
            paymentmethod: row?.paymentmethod || "",
            companysize: null,
        }
    });

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
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('doctype', { validate: (value) => !billbyorg ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('docnum', { validate: (value) => !billbyorg ? docTypeValidate(value) : true });
        register('businessname', { validate: (value) => !billbyorg ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('fiscaladdress', { validate: (value) => !billbyorg ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('contact', { validate: (value) => !billbyorg ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('contactemail', { validate: (value) => !billbyorg ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('sunatcountry', { validate: (value) => !billbyorg ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('credittype', { validate: (value) => !billbyorg ? ((value && value.length) || t(langKeys.field_required)) : true });
        register('paymentmethod', { validate: (value) => user?.roledesc === "SUPERADMIN"? ((value && value.length) || t(langKeys.field_required)) : true });
        register('paymentplanid');
    }, [register, billbyorg, doctype, getValues, t]);

    useEffect(() => {
    }, [executeRes, waitSave])
    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            if (typeof data.logo === 'object' && !!data.logo) {
                const fd = new FormData();
                fd.append('file', data.logo, data.logo.name);
                data.logo = (await CommonService.uploadFile(fd)).data["url"];
            }
            if (typeof data.logotype === 'object' && !!data.logotype) {
                const fd = new FormData();
                fd.append('file', data.logotype, data.logotype.name);
                data.logotype = (await CommonService.uploadFile(fd)).data["url"];
            }
            if (data.billbyorg) {
                data = {
                    ...data,
                    doctype: "",
                    docnum: "",
                    businessname: "",
                    fiscaladdress: "",
                    contact: "",
                    contactemail: "",
                    sunatcountry: "",
                    autosendinvoice: false,
                }
            }
            // console.log(data)
            setWaitSave(true)
            dispatch(execute(insCorp(data)));
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });


    const arrayBread = [
        { id: "view-1", name: t(langKeys.corporation) },
        { id: "view-2", name: t(langKeys.corporationdetail) }
    ];

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
                            title={row ? `${row.description}` : t(langKeys.newcorporation)}
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
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.corporation)}
                                className="col-6"
                                valueDefault={getValues('description')}
                                onChange={(value) => setValue('description', value)}
                                error={errors?.description?.message}
                            />
                            : <FieldView
                                label={t(langKeys.corporation)}
                                value={row?.description}
                                className="col-6"
                            />}
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.type)}
                                className="col-6"
                                valueDefault={getValues('type')}
                                onChange={(value) => setValue('type', value?.domainvalue)}
                                error={errors?.type?.message}
                                data={dataType}
                                uset={true}
                                prefixTranslation="type_corp_"
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.type)}
                                value={row?.type || ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={getValues('status')}
                            onChange={(value) => setValue('status', value?.domainvalue)}
                            error={errors?.status?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                        />
                        <FieldSelect
                            label={t(langKeys.billingplan)}
                            className="col-6"
                            valueDefault={getValues("paymentplanid")}
                            onChange={(value) => setValue('paymentplanid', value?.paymentplanid || 0)}
                            data={dataPaymentPlan}
                            error={errors?.paymentplanid?.message}
                            optionDesc="plan"
                            optionValue="paymentplanid"
                        />
                    </div>
                    <div className="row-zyx">
                        <TemplateSwitch
                            label={t(langKeys.billbyorg)}
                            className="col-6"
                            valueDefault={getValues('billbyorg')}
                            onChange={(value) => {
                                setValue('billbyorg', value);
                                setbillbyorg(value);
                                trigger('billbyorg');
                            }}
                        />
                        {user?.roledesc === "SUPERADMIN" &&
                            
                            <FieldSelect
                                label={t(langKeys.paymentmethod)}
                                className="col-6"
                                valueDefault={getValues("paymentmethod")}
                                onChange={(value) => setValue('paymentmethod', value?.value || "")}
                                data={[{name: t(langKeys.prepaid), value: "PREPAGO"},{name: t(langKeys.postpaid), value: "POSTPAGO"}]}
                                error={errors?.paymentmethod?.message}
                                optionDesc="name"   
                                optionValue="value"                        
                            />
                        }
                    </div>
                    {!getValues('billbyorg') && (
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
                            {user?.roledesc === "SUPERADMIN" &&
                                <div className="row-zyx">
                                    <FieldSelect
                                        label={t(langKeys.typecredit)}
                                        className="col-6"
                                        valueDefault={getValues("credittype")}
                                        onChange={(value) => { setValue("credittype", value?.domainvalue || ""); }}
                                        error={errors?.credittype?.message}
                                        disabled={user?.roledesc !== "SUPERADMIN"}
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
                                        disabled={user?.roledesc !== "SUPERADMIN"}
                                    />
                                </div>
                            }
                        </>
                    )}
                    {/* <div className="row-zyx">
                        {edit ?
                            <FieldUploadImage
                                label={t(langKeys.logo)}
                                className="col-6"
                                valueDefault={row?.logo}
                                onChange={onChangeLogo}
                            />
                            :
                            <img src={row?.logo} alt={row?.logo} />
                        }
                        {edit ?
                            <FieldUploadImage
                                label={t(langKeys.logotype)}
                                className="col-6"
                                valueDefault={row?.logotype}
                                onChange={onChangeLogotype}
                            />
                            :
                            <img src={row?.logotype} alt={row?.logotype} />
                        }
                    </div> */}
                </div>
            </form>
        </div>
    );
}

export default Corporations;