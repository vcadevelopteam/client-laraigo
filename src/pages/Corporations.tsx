import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import {
    TemplateIcons,
    TemplateBreadcrumbs,
    TemplateSwitch,
    TitleDetail,
    FieldView,
    FieldEdit,
    FieldSelect,
    AntTab,
} from "components";
import {
    appsettingInvoiceSelCombo,
    getCityBillingList,
    getCorpSel, getCurrencyList,
    getPaymentPlanSel,
    getValuesFromDomain,
    getValuesFromDomainCorp,
    insCorp,
} from "common/helpers";
import { Dictionary } from "@types";
import TableZyx from "../components/fields/table-simple";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useForm } from "react-hook-form";
import {
    cleanMemoryTable,
    getCollection,
    getMultiCollection,
    getMultiCollectionAux,
    resetAllMain,
    resetUploadFile,
    setMemoryTable,
    uploadFile
} from "store/main/actions";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import ClearIcon from "@material-ui/icons/Clear";
import { CommonService } from "network";
import { getCountryList } from "store/signup/actions";
import { IconButton, Tabs } from "@material-ui/core";
import { Close, CloudUpload } from "@material-ui/icons";
import { executeCorp } from "store/corp/actions";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial",
    },
    imgContainer: {
        borderRadius: 20,
        backgroundColor: "white",
        padding: 10,
        width: "100%",
        height: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        "&:hover": {
            cursor: "pointer",
            color: theme.palette.primary.main,
        },
    },
    img: {
        height: "80%",
        width: "auto",
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        color: "#381052",
    },
    containerCompImg: {
        display: "flex",
        width: "100%",
        border: "2px lightgrey dashed",
        marginTop: 5,
        justifyContent: "center",
    },
}));

const IDCORPORATION = "IDCORPORATION";
const Corporations: FC = () => {
    const user = useSelector((state) => state.login.validateToken.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector((state) => state.main);
    const executeResult = useSelector((state) => state.corporation.executecorp);
    const memoryTable = useSelector(state => state.main.memoryTable);

    const arrayBread = [{ id: "view-1", name: t(langKeys.corporation_plural) }];
    const [generalFilter, setGeneralFilter] = useState("");
    const [mainData, setMainData] = useState<any>([]);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: "corpid",
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    );
                },
            },
            {
                Header: t(langKeys.corporation),
                accessor: "description",
                NoFilter: true,
            },
            {
                Header: t(langKeys.type),
                accessor: "typedesc",
                NoFilter: true,
            },
            {
                Header: t(langKeys.billingplan),
                accessor: "paymentplandesc",
                NoFilter: true,
            },
            {
                Header: t(langKeys.status),
                accessor: "statusdesc",
                NoFilter: true,
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getCorpSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getCountryList());
        dispatch(
            getMultiCollection([
                getValuesFromDomain("ESTADOGENERICO"),
                getValuesFromDomain("TIPOCORP"),
                getPaymentPlanSel(),
                getValuesFromDomainCorp("BILLINGDOCUMENTTYPE", "_DOCUMENT", 1, 0),
                getValuesFromDomain("TYPECREDIT"),
                getValuesFromDomain("TYPEPARTNER"),
                appsettingInvoiceSelCombo(),
                getCityBillingList(),
            ])
        );
        dispatch(setMemoryTable({
            id: IDCORPORATION
        }))
        return () => {
            dispatch(cleanMemoryTable());
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.corporation_plural).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    useEffect(() => {
        setMainData(
            mainResult.mainData.data.map((x) => ({
                ...x,
                typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
                statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase(),
            }))
        );
    }, [mainResult.mainData.data]);

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    };

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(executeCorp(insCorp({ ...row, operation: "DELETE", status: "ELIMINADO", id: row.corpid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_delete),
                callback,
            })
        );
    };
    function redirectFunc(view: string) {
        setViewSelected(view);
    }

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.corporation_plural, { count: 2 })}
                    onClickRow={handleEdit}
                    data={mainData}
                    download={true}
                    defaultGlobalFilter={generalFilter}
                    setOutsideGeneralFilter={setGeneralFilter}
                    loading={mainResult.mainData.loading}
                    register={(user?.roledesc ?? "").split(",").some((v) => ["SUPERADMIN"].includes(v))}
                    handleRegister={handleRegister}
                    pageSizeDefault={IDCORPORATION === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDCORPORATION === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDCORPORATION === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </div>
        );
    } else if (viewSelected === "view-2") {
        return (
            <DetailCorporation
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        );
    } else return null;
};

interface DetailCorporationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
    arrayBread: any;
}

const DetailCorporation: React.FC<DetailCorporationProps> = ({
    data: { row, edit },
    setViewSelected,
    multiData,
    fetchData,
    arrayBread,
}) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [billbyorg, setbillbyorg] = useState(row?.billbyorg || false);
    const [pageSelected, setPageSelected] = useState(0);
    const [waitUpload, setWaitUpload] = useState("");
    const [domainname, setDomainName] = useState(row?.domainname||"");
    const [whiteBrand, setWhiteBrand] = useState(row?.domainname || false);
    const dataDocType = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const executeRes = useSelector((state) => state.corporation.executecorp);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector((state) => state.login.validateToken.user);
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataType = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataPaymentPlan = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const countryList = useSelector((state) => state.signup.countryList);
    const typeofcreditList = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const partnerType = multiData[5] && multiData[5].success ? multiData[5].data : [];
    const locationList = multiData[6] && multiData[6].success ? multiData[6].data : [];
    const cityList = multiData[7] && multiData[7].success ? multiData[7].data : [];
    const upload = useSelector((state) => state.main.uploadFile);
    const multiDataAux = useSelector(state => state.main.multiDataAux);

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        getValues,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            id: row ? row.corpid : 0,
            description: row ? row.description || "" : "",
            type: row ? row.type : "NINGUNO",
            status: row?.status || "ACTIVO",
            logo: row ? row.logo : "",
            logotype: row ? row.logotype : "",
            paymentplanid: row?.paymentplanid || 0,
            billbyorg: row?.billbyorg || false,
            doctype: row?.doctype || "",
            docnum: row?.docnum || "",
            businessname: row?.businessname || "",
            fiscaladdress: row?.fiscaladdress || "",
            sunatcountry: row?.sunatcountry || "",
            contactemail: row?.contactemail || "",
            automaticpayment: row?.automaticpayment || false,
            automaticperiod: row ? row?.automaticperiod || false : true,
            automaticinvoice: row ? row?.automaticinvoice || false : true,
            contact: row?.contact || "",
            autosendinvoice: row?.autosendinvoice || false,
            credittype: row?.credittype || "typecredit_alcontado",
            operation: row ? "UPDATE" : "INSERT",
            paymentmethod: row?.paymentmethod || "",
            billingcurrency: row?.billingcurrency || "",
            companysize: null,
            partner: row?.partner || "",
            iconurl: row?.iconurl || "",
            logourl: row?.logourl || "",
            startlogourl: row?.startlogourl || "",
            ispoweredbylaraigo: row?.ispoweredbylaraigo || false,
            domainname: row?.domainname || "",
            appsettingid: row ? row.appsettingid : null,
            citybillingid: row ? row.citybillingid : null,
            olddomainname: row?.domainname || ""
        },
    });
    const sunatCountry = watch("sunatcountry");
    const doctype = watch("doctype");

    const handleIconImgClick = () => {
        const input = document.getElementById("IconImgInput");
        input?.click();
    };
    const onChangeIconInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (file) {
          const image = new Image();
    
          image.onload = () => {
            const maxWidth = 32;
            const maxHeight = 32;
            if (image.width > maxWidth || image.height > maxHeight) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: "El ícono debe ser de 32x32px como máximo",
                    }))
            } else {
                uploadFileField("iconurl", file);
            }
          };
          image.src = URL.createObjectURL(file);
        }
    };

    function uploadFileField(field: string, file: any) {
        const fd = new FormData();
        fd.append("file", file, file.name);
        dispatch(uploadFile(fd));
        dispatch(showBackdrop(true));
        setWaitUpload(field);
    }
    const handleCleanIconInput = () => {
        setValue("iconurl", "");
    };
    const handleLogoImgClick = () => {
        const input = document.getElementById("LogoImgInput");
        input?.click();
    };
    const onChangeLogoInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (file) {
          const image = new Image();
    
          image.onload = () => {
            const maxWidth = 300;
            const maxHeight = 37;
            if (image.width > maxWidth || image.height > maxHeight) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: "El logo debe ser de 300x37px como máximo",
                    }))
            } else {
                uploadFileField("logourl", file);
            }
          };
          image.src = URL.createObjectURL(file);
        }
    };
    const handleCleanLogoInput = () => {
        setValue("logourl", "");
    };
    const handleStartLogoImgClick = () => {
        const input = document.getElementById("StartLogoImgInput");
        input?.click();
    };
    const onChangeStartLogoInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (file) {
          const image = new Image();
    
          image.onload = () => {
            const maxWidth = 150;
            const maxHeight = 42;
            if (image.width > maxWidth || image.height > maxHeight) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: "El logo inicio debe ser de 150x42px como máximo",
                    }))
            } else {
                uploadFileField("startlogourl", file);
            }
          };
          image.src = URL.createObjectURL(file);
        }
    };
    const handleCleanStartLogoInput = () => {
        setValue("startlogourl", "");
    };
    React.useEffect(() => {
        const docTypeValidate = (docnum: string): string | undefined => {
            if (!docnum) {
                return t(langKeys.field_required);
            }

            let msg = "";
            switch (doctype) {
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
                default: // DEFAULT
                    return undefined;
            }
        };
        register("description", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("type", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("status", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("doctype", {
            validate: (value) => (!billbyorg ? (value && value.length) || t(langKeys.field_required) : true),
        });
        register("docnum", { validate: (value) => (!billbyorg ? docTypeValidate(value) : true) });
        register("businessname", {
            validate: (value) => (!billbyorg ? (value && value.length) || t(langKeys.field_required) : true),
        });
        register("fiscaladdress", {
            validate: (value) => (!billbyorg ? (value && value.length) || t(langKeys.field_required) : true),
        });
        register("contact", {
            validate: (value) => (!billbyorg ? (value && value.length) || t(langKeys.field_required) : true),
        });
        register("contactemail", {
            validate: {
                hasvalue: (value) => (!billbyorg ? (value && value.length) || t(langKeys.field_required) : true),
                isemail: (value) =>
                    !billbyorg ? /\S+@\S+\.\S+/.test(value) || String(t(langKeys.emailverification)) : true,
            },
        });
        register("sunatcountry", {
            validate: (value) => (!billbyorg ? (value && value.length) || t(langKeys.field_required) : true),
        });
        register("credittype", {
            validate: (value) => (!billbyorg ? (value && value.length) || t(langKeys.field_required) : true),
        });
        register("paymentmethod", {
            validate: (value) =>
                user?.roledesc?.includes("SUPERADMIN") ? (value && value.length) || t(langKeys.field_required) : true,
        });
        register("paymentplanid", { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register("automaticpayment");
        register("automaticperiod");
        register("automaticinvoice");
        register("partner", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("appsettingid", { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register("citybillingid");
        register("iconurl", {
            validate: (value) => (whiteBrand ? (value && value.length) || t(langKeys.field_required) : true),
        });
        register("logourl", {
            validate: (value) => (whiteBrand ? (value && value.length) || t(langKeys.field_required) : true),
        });
        register("startlogourl", {
            validate: (value) => (whiteBrand ? (value && value.length) || t(langKeys.field_required) : true),
        });
        register("ispoweredbylaraigo");
        register("domainname", {
            validate: {
                validate: (value) => (whiteBrand ? (value && value.length) || t(langKeys.field_required) : true),
                wronginput: (value) => (whiteBrand ? (/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) || t(langKeys.validatedomainname) : true),
            }
        });
    }, [register, billbyorg, doctype, getValues, t, whiteBrand]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(row ? langKeys.successful_edit : langKeys.successful_register),
                    })
                );
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", {
                    module: t(langKeys.corporation_plural).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);

    useEffect(() => {
        if (waitUpload) {
            if (upload.loading) return;
            if (upload.error) {
                const message = t(upload.code || "error_unexpected_error", {
                    module: t(langKeys.user).toLocaleLowerCase(),
                });
                dispatch(
                    showSnackbar({
                        message,
                        show: true,
                        severity: "error",
                    })
                );
                setWaitUpload("");
            } else if (upload.url && upload.url.length > 0) {
                setValue(waitUpload, upload.url);
                dispatch(resetUploadFile());
                setWaitUpload("");
            }
            dispatch(showBackdrop(false));
        }
    }, [waitUpload, upload, dispatch]);

    const onSubmit = handleSubmit((data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            if (typeof data.logo === "object" && Boolean(data.logo)) {
                const fd = new FormData();
                fd.append("file", data.logo, data.logo.name);
                data.logo = (await CommonService.uploadFile(fd)).data["url"];
            }
            if (typeof data.logotype === "object" && Boolean(data.logotype)) {
                const fd = new FormData();
                fd.append("file", data.logotype, data.logotype.name);
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
                    automaticpayment: false,
                    automaticperiod: true,
                    automaticinvoice: true,
                };
            }
            setWaitSave(true);
            dispatch(executeCorp(insCorp(data)));
        };

        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        );
    });

    const countries = useMemo(() => {
        if (countryList.loading) return [];
        return countryList.data.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });
    }, [countryList]);

    const docTypes = useMemo(() => {
        if(sunatCountry==="") return [];
        if (!dataDocType || dataDocType.length === 0) return [];

        const val = dataDocType as Dictionary[];

        return val.sort((a, b) => {
            return a.domaindesc.localeCompare(b.domaindesc);
        });
    }, [dataDocType, sunatCountry]);

    
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        dispatch(getMultiCollectionAux([
            getCurrencyList(),
        ]));
    }, [dispatch]);

    const currencyList = useMemo(() => {
        if (!multiDataAux?.data?.[0]?.data) return [];
        return multiDataAux.data[0].data.sort((a, b) => {
            return a.description.localeCompare(b.description);
        });
    }, [multiDataAux]);


    const handleDropIcon = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const fileInput = document.getElementById("IconImgInput");
            fileInput.files = e.dataTransfer.files;
            const changeEvent = new Event("change", { bubbles: true });
            fileInput.dispatchEvent(changeEvent);
        }
    };
    const handleDropLogo = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const fileInput = document.getElementById("LogoImgInput");
            fileInput.files = e.dataTransfer.files;
            const changeEvent = new Event("change", { bubbles: true });
            fileInput.dispatchEvent(changeEvent);
        }
    };
    const handleDropStartLogo = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const fileInput = document.getElementById("StartLogoImgInput");
            fileInput.files = e.dataTransfer.files;
            const changeEvent = new Event("change", { bubbles: true });
            fileInput.dispatchEvent(changeEvent);
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "view-2", name: t(langKeys.corporationdetail) }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail title={row ? `${row.description}` : t(langKeys.newcorporation)} />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >
                            {t(langKeys.back)}
                        </Button>
                        {edit && (
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >
                                {t(langKeys.save)}
                            </Button>
                        )}
                    </div>
                </div>
                <Tabs
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ borderBottom: "1px solid #EBEAED", backgroundColor: "#FFF", marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.informationcorporation)} />
                    <AntTab label={t(langKeys.configurationblankbrand)} />
                </Tabs>
                {pageSelected === 0 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            {edit ? (
                                <FieldEdit
                                    label={t(langKeys.corporation)}
                                    className="col-6"
                                    valueDefault={getValues("description")}
                                    onChange={(value) => setValue("description", value)}
                                    error={errors?.description?.message}
                                />
                            ) : (
                                <FieldView label={t(langKeys.corporation)} value={row?.description} className="col-6" />
                            )}
                            <FieldSelect
                                label={t(langKeys.corporation_location)}
                                className="col-6"
                                valueDefault={getValues("appsettingid")}
                                onChange={(value) => setValue("appsettingid", value?.appsettingid || null)}
                                data={locationList}
                                error={errors?.appsettingid?.message}
                                optionDesc="tradename"
                                optionValue="appsettingid"
                            />
                        </div>
                        <div className="row-zyx">
                            {edit ? (
                                <FieldSelect
                                    label={t(langKeys.type)}
                                    className="col-6"
                                    valueDefault={getValues("type")}
                                    onChange={(value) => setValue("type", value?.domainvalue)}
                                    error={errors?.type?.message}
                                    data={dataType}
                                    uset={true}
                                    prefixTranslation="type_corp_"
                                    optionDesc="domainvalue"
                                    optionValue="domainvalue"
                                />
                            ) : (
                                <FieldView label={t(langKeys.type)} value={row?.type || ""} className="col-6" />
                            )}
                            <FieldSelect
                                label={t(langKeys.partner)}
                                className="col-6"
                                valueDefault={getValues("partner")}
                                onChange={(value) => setValue("partner", value?.domainvalue || "")}
                                data={partnerType}
                                error={errors?.partner?.message}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={getValues("status")}
                                onChange={(value) => setValue("status", value?.domainvalue)}
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
                                onChange={(value) => setValue("paymentplanid", value?.paymentplanid || 0)}
                                data={dataPaymentPlan}
                                error={errors?.paymentplanid?.message}
                                optionDesc="plan"
                                optionValue="paymentplanid"
                            />
                        </div>
                        {user?.roledesc?.includes("SUPERADMIN") && (
                            <div className="row-zyx">
                                <FieldSelect
                                    label={t(langKeys.paymentmethod)}
                                    className="col-6"
                                    valueDefault={getValues("paymentmethod")}
                                    onChange={(value) => setValue("paymentmethod", value?.value || "")}
                                    data={[
                                        { name: t(langKeys.prepaid), value: "PREPAGO" },
                                        { name: t(langKeys.postpaid), value: "POSTPAGO" },
                                    ]}
                                    error={errors?.paymentmethod?.message}
                                    optionDesc="name"
                                    optionValue="value"
                                />
                                <TemplateSwitch
                                    label={t(langKeys.billbyorg)}
                                    className="col-6"
                                    valueDefault={getValues("billbyorg")}
                                    onChange={(value) => {
                                        setValue("billbyorg", value);
                                        setbillbyorg(value);
                                        trigger("billbyorg");
                                    }}
                                />
                            </div>
                        )}
                        {!getValues("billbyorg") && (
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
                                        valueDefault={getValues("fiscaladdress")}
                                        onChange={(value) => setValue("fiscaladdress", value)}
                                        error={errors?.fiscaladdress?.message}
                                    />
                                </div>
                                <div className="row-zyx">
                                    <FieldSelect
                                        uset={true}
                                        prefixTranslation="billingfield_"
                                        label={t(langKeys.docType)}
                                        className="col-6"
                                        valueDefault={doctype}
                                        onChange={(value) => {
                                            setValue("doctype", value?.domainvalue || "");
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
                                        valueDefault={getValues("docnum")}
                                        onChange={(value) => setValue("docnum", value)}
                                        error={errors?.docnum?.message}
                                    />
                                </div>
                                <div className="row-zyx">
                                    <FieldEdit
                                        label={t(langKeys.businessname)}
                                        className={
                                            !["0", "1", "4", "6", "7", ""].includes(doctype || "") ? "col-6" : "col-12"
                                        }
                                        valueDefault={getValues("businessname")}
                                        onChange={(value) => setValue("businessname", value)}
                                        error={errors?.businessname?.message}
                                    />
                                    {!["0", "1", "4", "6", "7", ""].includes(doctype || "") && (
                                        <FieldSelect
                                            label={t(langKeys.citybilling)}
                                            className="col-6"
                                            valueDefault={getValues("citybillingid")}
                                            onChange={(value) =>
                                                setValue("citybillingid", value?.citybillingid || null)
                                            }
                                            data={cityList}
                                            error={errors?.citybillingid?.message}
                                            optionDesc="locationdescription"
                                            optionValue="citybillingid"
                                        />
                                    )}
                                </div>
                                <div className="row-zyx">
                                    <FieldEdit
                                        label={t(langKeys.contactbilling)}
                                        className="col-6"
                                        valueDefault={getValues("contact")}
                                        onChange={(value) => setValue("contact", value)}
                                        error={errors?.contact?.message}
                                    />
                                    <FieldEdit
                                        label={t(langKeys.billingmail)}
                                        className="col-6"
                                        valueDefault={getValues("contactemail")}
                                        onChange={(value) => setValue("contactemail", value)}
                                        error={errors?.contactemail?.message}
                                    />
                                </div>
                                <div className="row-zyx">
                                    <FieldSelect
                                        label={t(langKeys.typecredit)}
                                        className="col-6"
                                        valueDefault={getValues("credittype")}
                                        onChange={(value) => {
                                            setValue("credittype", value?.domainvalue || "");
                                        }}
                                        error={errors?.credittype?.message}
                                        disabled={!user?.roledesc?.includes("SUPERADMIN")}
                                        data={typeofcreditList}
                                        uset={true}
                                        optionDesc="domainvalue"
                                        optionValue="domainvalue"
                                    />
                                    <FieldSelect
                                        label={t(langKeys.billingperiod_billingcurrency)}
                                        valueDefault={getValues('billingcurrency')}
                                        onChange={(value) => setValue('billingcurrency', value.code)}
                                        className="col-6"
                                        data={currencyList}
                                        error={typeof errors?.billingcurrency?.message === 'string' ? errors?.billingcurrency?.message : ''}
                                        optionValue="code"
                                        optionDesc="description"
                                    />

                                </div>
                                <div className="row-zyx">
                                    <TemplateSwitch
                                        label={t(langKeys.autosendinvoice)}
                                        className="col-6"
                                        valueDefault={getValues("autosendinvoice")}
                                        onChange={(value) => setValue("autosendinvoice", value)}
                                        disabled={!user?.roledesc?.includes("SUPERADMIN")}
                                    />
                                    <TemplateSwitch
                                        label={t(langKeys.automaticpayment)}
                                        className="col-6"
                                        valueDefault={getValues("automaticpayment")}
                                        onChange={(value) => setValue("automaticpayment", value)}
                                        disabled={!user?.roledesc?.includes("SUPERADMIN")}
                                    />
                                </div>
                                <div className="row-zyx">
                                    <TemplateSwitch
                                        label={t(langKeys.automaticperiod)}
                                        className="col-6"
                                        valueDefault={getValues("automaticperiod")}
                                        onChange={(value) => setValue("automaticperiod", value)}
                                        disabled={!user?.roledesc?.includes("SUPERADMIN")}
                                    />
                                    <TemplateSwitch
                                        label={t(langKeys.automaticinvoice)}
                                        className="col-6"
                                        valueDefault={getValues("automaticinvoice")}
                                        onChange={(value) => setValue("automaticinvoice", value)}
                                        disabled={!user?.roledesc?.includes("SUPERADMIN")}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
                {pageSelected === 1 && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx" style={{marginBottom:0}}>
                            <TemplateSwitch
                                label={t(langKeys.usewhitebrand)}
                                className="col-6"
                                valueDefault={whiteBrand}
                                disabled={row?.domainname || Boolean(row  && !user.roledesc.includes("SUPERADMIN"))}
                                onChange={(value) => {
                                    setWhiteBrand(value);
                                    setValue("ispoweredbylaraigo", false);
                                    setValue("domainname", "");
                                    handleCleanIconInput();
                                    handleCleanLogoInput();
                                    handleCleanStartLogoInput();
                                }}
                            />
                        </div>
                        <div className="row-zyx" style={{ display: whiteBrand ? "flex" : "none", fontWeight: "bold", color: "red" }}>
                            *{t(langKeys.warningwhitebrand)}
                        </div>
                        <div className="row-zyx" style={{ display: whiteBrand ? "flex" : "none" }}>
                            <FieldEdit
                                label={t(langKeys.domainname)}
                                className="col-6"
                                disabled={Boolean(row?.domainname)}
                                valueDefault={getValues("domainname")}
                                onChange={(value) => {setValue("domainname", value.toLocaleLowerCase().replace(/\s/g, '')); setDomainName(value.toLocaleLowerCase().replace(/\s/g, ''))}}
                                error={errors?.domainname?.message}
                                inputProps={{ style: { textTransform: 'lowercase' } }}
                            />
                            <FieldEdit
                                label={t(langKeys.bond)}
                                className="col-6"
                                placeholder={"https://"}
                                valueDefault={
                                    domainname? `https://${domainname}.laraigo.com` : ""
                                }
                                disabled={true}
                            />
                        </div>
                        <div className="row-zyx" style={{ display: whiteBrand ? "flex" : "none" }}>
                            <TemplateSwitch
                                label={t(langKeys.logopoweredbylaraigo)}
                                className="col-6"
                                valueDefault={getValues("ispoweredbylaraigo")}
                                onChange={(value) => {
                                    setValue("ispoweredbylaraigo", value);
                                }}
                            />
                        </div>
                        <div className="row-zyx" style={{ display: whiteBrand ? "flex" : "none" }}>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} className="col-4"
                                >
                                <div className={classes.text}>{t(langKeys.uploadicon)} 32 x 32px</div>
                                <div className={classes.containerCompImg} 
                                    onDragOver={handleDragOver}
                                    onDrop={handleDropIcon}>
                                    <div className={classes.imgContainer}>
                                        {getValues("iconurl") && (
                                            <img src={getValues("iconurl")} alt="icon button" className={classes.img} 
                                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}/>
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-around",
                                            marginLeft: 12,
                                        }}
                                    >
                                        <input
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            id="IconImgInput"
                                            type="file"
                                            onChange={onChangeIconInput}
                                        />
                                        <IconButton onClick={handleIconImgClick}>
                                            <CloudUpload className={classes.icon} />
                                        </IconButton>
                                        <IconButton onClick={handleCleanIconInput}>
                                            <Close className={classes.icon} />
                                        </IconButton>
                                    </div>
                                </div>
                                {Boolean(errors?.iconurl?.message) || (
                                    <div style={{ color: "red" }}>{errors?.iconurl?.message || ""}</div>
                                )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} className="col-4">
                                <div className={classes.text}>{t(langKeys.uploadlogo)} 300 x 37px</div>
                                <div className={classes.containerCompImg}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDropLogo}>
                                    <div className={classes.imgContainer}>
                                        {getValues("logourl") && (
                                            <img src={getValues("logourl")} alt="icon button" className={classes.img} 
                                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}/>
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-around",
                                            marginLeft: 12,
                                        }}
                                    >
                                        <input
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            id="LogoImgInput"
                                            type="file"
                                            onChange={onChangeLogoInput}
                                        />
                                        <IconButton onClick={handleLogoImgClick}>
                                            <CloudUpload className={classes.icon} />
                                        </IconButton>
                                        <IconButton onClick={handleCleanLogoInput}>
                                            <Close className={classes.icon} />
                                        </IconButton>
                                    </div>
                                </div>
                                {Boolean(errors?.logourl?.message) || (
                                    <div style={{ color: "red" }}>{errors?.logourl?.message || ""}</div>
                                )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} className="col-4">
                                <div className={classes.text}>{t(langKeys.uploadlogostarticon)} 150 x 42px</div>
                                <div className={classes.containerCompImg}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDropStartLogo}>
                                    <div className={classes.imgContainer}>
                                        {getValues("startlogourl") && (
                                            <img
                                                src={getValues("startlogourl")}
                                                alt="icon button"
                                                className={classes.img}
                                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                            />
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-around",
                                            marginLeft: 12,
                                        }}
                                    >
                                        <input
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            id="StartLogoImgInput"
                                            type="file"
                                            onChange={onChangeStartLogoInput}
                                        />
                                        <IconButton onClick={handleStartLogoImgClick}>
                                            <CloudUpload className={classes.icon} />
                                        </IconButton>
                                        <IconButton onClick={handleCleanStartLogoInput}>
                                            <Close className={classes.icon} />
                                        </IconButton>
                                    </div>
                                </div>
                                {Boolean(errors?.startlogourl?.message) || (
                                    <div style={{ color: "red" }}>{errors?.startlogourl?.message || ""}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Corporations;
