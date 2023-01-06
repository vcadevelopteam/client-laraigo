/* eslint-disable react-hooks/exhaustive-deps */
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Paper from '@material-ui/core/Paper';
import React, { Fragment, FC, useEffect, useState, useCallback } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import TablePaginated from 'components/fields/table-paginated';

import { Dictionary, MultiData, IFetchData } from "@types";
import { DownloadIcon } from 'icons';
import { formatNumber } from 'common/helpers';
import { getCollectionPaginated, getMultiCollection, execute, resetAllMain, setMemoryTable, cleanMemoryTable, uploadFile, resetCollectionPaginated } from 'store/main/actions';
import { getValuesFromDomain, getPaginatedProductCatalog } from 'common/helpers';
import { IconButton, CircularProgress, FormControlLabel } from '@material-ui/core';
import { importXml } from 'store/product/actions';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core/styles';
import { Search as SearchIcon, AddCircle, FileCopy, GetApp, Close, Delete } from '@material-ui/icons';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { TemplateIcons, TemplateBreadcrumbs, FieldEdit, FieldSelect, TitleDetail, FieldMultiSelectFreeSolo, DialogZyx, IOSSwitch } from 'components';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';

interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}

interface DetailProps {
    arrayBread: any;
    data: RowSelected;
    fetchData?: () => void;
    multiData: MultiData[];
    setViewSelected: (view: string) => void;
}

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(2),
    },
    containerDetail: {
        background: '#fff',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    fieldsfilter: {
        width: 220,
    },
    labellink: {
        color: '#7721ad',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    subtitle: {
        fontSize: "20px",
        fontWeight: "bold",
        paddingBottom: "10px",
    },
    subtitle2: {
        fontSize: "15px",
        fontWeight: "bold",
        paddingBottom: "10px",
    },
}));

const PRODUCTCATALOG = 'PRODUCTCATALOG';
const ProductCatalog: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const user = useSelector(state => state.login.validateToken.user);
    const superadmin = ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(user?.roledesc || '');

    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null });
    const [openModal, setOpenModal] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [totalrow, settotalrow] = useState(0);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    const arrayBread = [{ id: "view-1", name: t(langKeys.productcatalog) }];
    const selectionKey = 'productcatalogid';

    useEffect(() => {
        dispatch(resetCollectionPaginated());
        fetchData(fetchDataAux);

        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
        ]));

        dispatch(setMemoryTable({
            id: PRODUCTCATALOG
        }))

        return () => {
            dispatch(resetCollectionPaginated());
            dispatch(cleanMemoryTable());
            dispatch(resetAllMain());
        };
    }, []);

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ ...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts } });
        dispatch(getCollectionPaginated(getPaginatedProductCatalog({
            enddate: daterange?.endDate!,
            filters: filters,
            skip: pageIndex * pageSize,
            sorts: sorts,
            startdate: daterange?.startDate!,
            take: pageSize,
        })));
    };

    const onModalSuccess = () => {
        setOpenModal(false);
        fetchData(fetchDataAux);
        setViewSelected("view-1");
    }

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected(p => Object.keys(selectedRows).map(x => mainPaginated?.data.find(y => y.productcatalogid === parseInt(x)) || p.find((y) => y.productcatalogid === parseInt(x)) || {}))
        }
    }, [selectedRows])

    function redirectFunc(view: string) {
        setViewSelected(view)
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
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

    const handleBulkDelete = (dataSelected: Dictionary[]) => {
        const callback = () => {
            /*dispatch(execute(productCatalogUpdArray((dataSelected.reduce((ad: any[], d: any) => {
                ad.push({
                    ...d,
                    status: 'ELIMINADO',
                })
                return ad;
            }, [])), user?.usr || '')));*/
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            //dispatch(execute(productCatalogIns({ ...row, id: row.productcatalogid, operation: 'DELETE', status: 'ELIMINADO' })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'productcatalogid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            viewFunction={() => handleView(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.title),
                accessor: 'title'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                Cell: (props: any) => {
                    const { description } = props.cell.row.original;
                    return description?.substring(0, 50) + "... "
                }
            },
            {
                Header: t(langKeys.brand),
                accessor: 'brand'
            },
            {
                Header: t(langKeys.availability),
                accessor: 'availability'
            },
            {
                Header: t(langKeys.condition),
                accessor: 'condition'
            },
            {
                Header: t(langKeys.website),
                accessor: 'link',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={(e) => { e.stopPropagation(); window.open(`${row.link}`, '_blank')?.focus() }}
                        >
                            {row.link ? t(langKeys.website) : ""}
                        </label>
                    )
                }
            },
            {
                Header: t(langKeys.image),
                accessor: 'imagelink',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={(e) => { e.stopPropagation(); window.open(`${row.imagelink}`, '_blank')?.focus() }}
                        >
                            {row.imagelink ? t(langKeys.imagelink) : ""}
                        </label>
                    )
                }
            },
            {
                Header: t(langKeys.currency),
                accessor: 'currency'
            },
            {
                Header: t(langKeys.productcatalogunitprice),
                accessor: 'price',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { price } = props.cell.row.original;
                    return formatNumber(price || 0);
                }
            },
            {
                Header: t(langKeys.saleprice),
                accessor: 'saleprice',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { saleprice } = props.cell.row.original;
                    return formatNumber(saleprice || 0);
                }
            },
            {
                Header: t(langKeys.catalogname),
                accessor: 'catalogname'
            },
            {
                Header: t(langKeys.catalogid),
                accessor: 'catalogid'
            },
            {
                Header: t(langKeys.productid),
                accessor: 'productid'
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: `${t(langKeys.customlabel)} 1`,
                accessor: 'customlabel1'
            },
            {
                Header: `${t(langKeys.customlabel)} 2`,
                accessor: 'customlabel2'
            },
            {
                Header: `${t(langKeys.customlabel)} 3`,
                accessor: 'customlabel3'
            },
            {
                Header: `${t(langKeys.customlabel)} 4`,
                accessor: 'customlabel4'
            },
            {
                Header: `${t(langKeys.customlabel)} 5`,
                accessor: 'customlabel5'
            },
        ],
        []
    );

    if (viewSelected === "view-1") {
        if (mainPaginated.error) {
            return <h1>ERROR</h1>;
        }
        return (
            <div style={{ width: "100%" }}>
                <ImportXmlModal
                    onTrigger={onModalSuccess}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />
                <TablePaginated
                    ButtonsElement={() => (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <Button
                                color="primary"
                                disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                                onClick={() => {
                                    handleBulkDelete(rowWithDataSelected);
                                }}
                                startIcon={<Delete style={{ color: 'white' }} />}
                                variant="contained"
                            >
                                {t(langKeys.delete)}
                            </Button>
                            <Button
                                color="primary"
                                disabled={mainPaginated.loading}
                                onClick={() => { fetchData(fetchDataAux) }}
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >{t(langKeys.search)}
                            </Button>
                            <Button
                                color="primary"
                                disabled={mainPaginated.loading}
                                onClick={() => { setOpenModal(true) }}
                                startIcon={<AddCircle style={{ color: 'white' }} />}
                                style={{ width: 120, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >{t(langKeys.import)}
                            </Button>
                        </div>
                    )}
                    autotrigger={false}
                    columns={columns}
                    data={mainPaginated.data}
                    download={false}
                    fetchData={fetchData}
                    handleRegister={handleRegister}
                    loading={mainPaginated.loading}
                    onClickRow={handleEdit}
                    pageCount={pageCount}
                    register={superadmin}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
                    titlemodule={t(langKeys.productcatalog)}
                    totalrow={totalrow}
                    useSelection={true}
                    pageSizeDefault={PRODUCTCATALOG === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={PRODUCTCATALOG === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={PRODUCTCATALOG === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </div>
        )
    }
    else
        return (
            <DetailProductCatalog
                arrayBread={arrayBread}
                data={rowSelected}
                fetchData={() => fetchData(fetchDataAux)}
                multiData={mainResult.multiData.data}
                setViewSelected={redirectFunc}
            />
        )
}

const ImportXmlModal: FC<{ openModal: boolean, setOpenModal: (param: any) => void, onTrigger: () => void }> = ({ openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const importResult = useSelector(state => state.product.requestImportXml);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const user = useSelector(state => state.login.validateToken.user);

    const [checkedUrl, setCheckedUrl] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);

    const { register, trigger, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            corpid: user?.corpid,
            orgid: user?.orgid,
            url: '',
            catalogname: '',
            catalogid: '',
            isxml: true,
        }
    });

    React.useEffect(() => {
        register('url', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('catalogname', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('catalogid', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('isxml');
    }, [register]);

    useEffect(() => {
        if (waitSave) {
            if (!importResult.loading && !importResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(importResult.code || "success") }))
                dispatch(showBackdrop(false));

                setValue('url', '');
                setValue('catalogname', '');
                setValue('catalogid', '');
                setValue('isxml', false);
                setFileAttachment(null);

                setWaitSave(false);
                onTrigger();
            }
            else if (importResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(importResult.code || "error_unexpected_db_error") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [importResult, waitSave])

    const onSubmit = handleSubmit((data) => {
        if (data?.url) {
            var extension = data?.url.slice((data?.url.lastIndexOf(".") - 1 >>> 0) + 2);

            if (extension?.toUpperCase() !== "XML" && extension?.toUpperCase() !== "XLSX") {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.productimportalert) }));
            }
            else {
                if (extension?.toUpperCase() === "XML") {
                    setValue('isxml', true);
                    data.isxml = true;
                }
                else {
                    setValue('isxml', false);
                    data.isxml = false;
                }
            }
        }

        const callback = () => {
            dispatch(importXml(data));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById('attachmentInput');
        input!.click();
    }, []);

    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);
        if (file) {
            setFileAttachment(file);
            let fd = new FormData();
            fd.append('file', file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, [])

    const handleCleanMediaInput = async (f: string) => {
        const input = document.getElementById('attachmentInput') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
        setFileAttachment(null);
        setValue('url', getValues('url').split(',').filter((a: string) => a !== f).join(''));
        await trigger('url');
    }

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('url', [getValues('url'), uploadResult?.url || ''].join(''))
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.importxml)}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => {
                setValue('url', '');
                setValue('catalogname', '');
                setValue('catalogid', '');
                setValue('isxml', false);
                setFileAttachment(null);
                setOpenModal(false);
            }}
            buttonText2={t(langKeys.save)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                {t(langKeys.productimportdescription)}
            </div>
            <div className="row-zyx">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                    <Button
                        disabled={false}
                        variant="contained"
                        color="primary"
                        style={{ width: 150, backgroundColor: "#55BD84" }}
                        startIcon={<DownloadIcon style={{ color: 'white' }} />}
                        onClick={() => { window.open("https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/LARAIGO%20-%20ACME/4a2b6056-a8ee-4382-8fec-ee76a6348614/Template%20XML.xml", '_blank'); }}
                    >{t(langKeys.templatexml)}
                    </Button>
                    <Button
                        disabled={false}
                        variant="contained"
                        color="primary"
                        style={{ width: 160, backgroundColor: "#55BD84" }}
                        startIcon={<DownloadIcon style={{ color: 'white' }} />}
                        onClick={() => { window.open("https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/LARAIGO%20-%20ACME/20258d45-e033-44c7-bbae-160c5901bc16/Template%20Excel.xlsx", '_blank'); }}
                    >{t(langKeys.templateexcel)}
                    </Button>
                </div>
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.catalogname)}
                    valueDefault={getValues('catalogname')}
                    error={errors?.catalogname?.message}
                    onChange={(value) => setValue('catalogname', value)}
                    className="col-6"
                />
                <FieldEdit
                    label={t(langKeys.catalogid)}
                    valueDefault={getValues('catalogid')}
                    error={errors?.catalogid?.message}
                    onChange={(value) => setValue('catalogid', value)}
                    className="col-6"
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.url)}
                    valueDefault={getValues('url')}
                    error={errors?.url?.message}
                    disabled={checkedUrl}
                    className="col-9"
                    onChange={(value) => setValue('url', value)}
                />
                <div className={"col-3"} style={{ paddingBottom: '3px' }}>
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={2} color="textPrimary">{t(langKeys.uploadFile)}</Box>
                    <FormControlLabel
                        style={{ paddingLeft: 10 }}
                        control={<IOSSwitch checked={checkedUrl} onChange={(e) => { setCheckedUrl(e.target.checked); }} />}
                        label={""}
                    />
                </div>
                {checkedUrl && <React.Fragment>
                    <input
                        accept="text/xml, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        style={{ display: 'none' }}
                        id="attachmentInput"
                        type="file"
                        onChange={(e) => onChangeAttachment(e.target.files)}
                    />
                    {<IconButton
                        onClick={onClickAttachment}
                        disabled={(waitUploadFile || fileAttachment !== null)}
                    >
                        <AttachFileIcon color="primary" />
                    </IconButton>}
                    {!!getValues("url") && getValues("url").split(',').map((f: string, i: number) => (
                        <FilePreview key={`attachment-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f)} />
                    ))}
                    {waitUploadFile && fileAttachment && <FilePreview key={`attachment-x`} src={fileAttachment} />}
                </React.Fragment>}
            </div>
        </DialogZyx>
    )
}

const sxImageBox = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    border: '1px dashed grey',
    textAlign: 'center',
}

const DetailProductCatalog: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, arrayBread }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeRes = useSelector(state => state.main.execute);
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDomainCategory = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const uploadResult = useSelector(state => state.main.uploadFile);

    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [fileAttachmentAditional, setFileAttachmentAditional] = useState<File | null>(null);
    const [waitSave, setWaitSave] = useState(false);
    const [fieldupload, setfieldupload] = useState<"imagelink" | "additionalimagelink">("imagelink");
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [labels, setlabels] = useState(row?.labels?.split(',') || []);

    const dataCurrency = [{ value: "PEN", description: "PEN" }, { value: "USD", description: "USD" }]

    const { trigger, register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.productcatalogid || 0,
            productid: row?.productid || "",
            title: row?.title || '',
            link: row?.link || '',
            imagelink: row?.imagelink || '',
            additionalimagelink: row?.additionalimagelink || '',
            brand: row?.brand || "",
            condition: row?.condition || '',
            availability: row?.availability || "",
            category: row?.category || '',
            material: row?.material || "",
            color: row?.color || "",
            pattern: row?.pattern || "",
            currency: row?.currency || '',
            price: row?.price || 0.00,
            saleprice: row?.saleprice || 0.00,
            customlabel1: row?.customlabel1 || "",
            customlabel2: row?.customlabel2 || "",
            customlabel3: row?.customlabel3 || "",
            customlabel4: row?.customlabel4 || "",
            customlabel5: row?.customlabel5 || "",
            labels: row?.labels || "",
            catalogid: row?.catalogid || "",
            catalogname: row?.catalogname || "",
            description: row?.description || '',
            status: row?.status || 'ACTIVO',
            type: row?.type || '',
            operation: (edit && row) ? "EDIT" : "INSERT",
        }
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('id');
        register('productid', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('title', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('link', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('imagelink', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('additionalimagelink');
        register('brand', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('condition', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('availability', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('category');
        register('material');
        register('color');
        register('pattern');
        register('currency', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('price', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
        register('saleprice');
        register('customlabel1');
        register('customlabel2');
        register('customlabel3');
        register('customlabel4');
        register('customlabel5');
        register('labels');
        register('catalogid', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('catalogname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type');
        register('operation');
    }, [edit, register]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            //dispatch(execute(productCatalogIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const onChangeAttachment = useCallback((files: any, type: "imagelink" | "additionalimagelink") => {
        const file = files?.item(0);
        if (file) {
            if (type === "imagelink") {
                setFileAttachment(file);
            } else {
                setFileAttachmentAditional(file)
            }
            let fd = new FormData();
            fd.append('file', file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, []);

    const onClickAttachment = useCallback((attachment: string) => {
        const input = document.getElementById(attachment);
        input!.click();
    }, []);

    const handleCleanMediaInput = async (f: string, field: "imagelink" | "additionalimagelink") => {
        const input = document.getElementById(field === "imagelink" ? 'attachmentInput' : 'attachmentInput2') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
        if (field === "imagelink") {
            setFileAttachment(null);
        } else {
            setFileAttachmentAditional(null)
        }
        setValue(field, getValues(field).split(',').filter((a: string) => a !== f).join(''));
        await trigger(field);
    }

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue(fieldupload, [getValues(fieldupload), uploadResult?.url || ''].join(''))
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])

    return (
        <div style={{ width: "100%" }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.productcatalogsingle)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={edit ? (row ? `${row.productid}` : `${t(langKeys.new)} ${t(langKeys.productcatalogsingle)}`) : `${t(langKeys.new)} ${t(langKeys.productcatalogsingle)}`}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}>
                            {t(langKeys.back)}
                        </Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}>
                                {t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.title)}
                            className="col-12"
                            valueDefault={row?.title || ""}
                            onChange={(value) => setValue('title', value)}
                            error={errors?.title?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            className="col-12"
                            valueDefault={row?.description || ""}
                            onChange={(value) => setValue('description', value)}
                            error={errors?.description?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.website)}
                            className="col-6"
                            valueDefault={row?.link || ""}
                            onChange={(value) => setValue('link', value)}
                            error={errors?.link?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.brand)}
                            className="col-6"
                            valueDefault={row?.brand || ""}
                            onChange={(value) => setValue('brand', value)}
                            error={errors?.brand?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.category)}
                            className="col-6"
                            valueDefault={row?.category || ""}
                            onChange={(value) => {
                                setValue('category', value?.domainvalue || '');
                            }}
                            error={errors?.category?.message}
                            data={dataDomainCategory}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={row?.status || "ACTIVO"}
                            onChange={(value) => setValue('status', value?.domainvalue || '')}
                            error={errors?.status?.message}
                            data={dataDomainStatus}
                            optionDesc="domaindesc"
                            uset={true}
                            prefixTranslation="status_"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.condition)}
                            className="col-6"
                            valueDefault={row?.condition || ""}
                            onChange={(value) => setValue('condition', value)}
                            error={errors?.condition?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.availability)}
                            className="col-6"
                            valueDefault={row?.availability || ""}
                            onChange={(value) => setValue('availability', value)}
                            error={errors?.availability?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.material)}
                            className="col-6"
                            valueDefault={row?.material || ""}
                            onChange={(value) => setValue('material', value)}
                            error={errors?.material?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.color)}
                            className="col-6"
                            valueDefault={row?.color || ""}
                            onChange={(value) => setValue('color', value)}
                            error={errors?.color?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.pattern)}
                            className="col-6"
                            valueDefault={row?.pattern || ""}
                            onChange={(value) => setValue('pattern', value)}
                            error={errors?.pattern?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.currency)}
                            className="col-6"
                            valueDefault={row?.currency}
                            onChange={(value) => setValue('currency', value?.value || '')}
                            error={errors?.currency?.message}
                            data={dataCurrency}
                            optionDesc="description"
                            optionValue="value"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.productcatalogunitprice)}
                            className="col-6"
                            valueDefault={row?.price || 0.0}
                            onChange={(value) => setValue('price', value)}
                            error={errors?.price?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                        <FieldEdit
                            label={t(langKeys.saleprice)}
                            className="col-6"
                            valueDefault={row?.saleprice || 0.0}
                            onChange={(value) => setValue('saleprice', value)}
                            error={errors?.saleprice?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldMultiSelectFreeSolo
                            label={t(langKeys.labels)}
                            valueDefault={labels.join(",") || ""}
                            className="col-12"
                            onChange={(value) => {
                                setlabels(value.reduce((acc: any, x: any) => [...acc, typeof x === "object" ? x.value : x], []))
                                setValue("labels", value.reduce((acc: any, x: any) => [...acc, typeof x === "object" ? x.value : x], []).join(","))
                            }}
                            loading={false}
                            data={labels.map((x: any) => ({ value: x }))}
                            optionDesc="value"
                            optionValue="value"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={`${t(langKeys.customlabel)} 1`}
                            className="col-6"
                            valueDefault={row?.customlabel1 || ""}
                            onChange={(value) => setValue('customlabel1', value)}
                            error={errors?.customlabel1?.message}
                        />
                        <FieldEdit
                            label={`${t(langKeys.customlabel)} 2`}
                            className="col-6"
                            valueDefault={row?.customlabel2 || ""}
                            onChange={(value) => setValue('customlabel2', value)}
                            error={errors?.customlabel2?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={`${t(langKeys.customlabel)} 3`}
                            className="col-6"
                            valueDefault={row?.customlabel3 || ""}
                            onChange={(value) => setValue('customlabel3', value)}
                            error={errors?.customlabel3?.message}
                        />
                        <FieldEdit
                            label={`${t(langKeys.customlabel)} 4`}
                            className="col-6"
                            valueDefault={row?.customlabel4 || ""}
                            onChange={(value) => setValue('customlabel4', value)}
                            error={errors?.customlabel4?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={`${t(langKeys.customlabel)} 5`}
                            className="col-6"
                            valueDefault={row?.customlabel5 || ""}
                            onChange={(value) => setValue('customlabel5', value)}
                            error={errors?.customlabel5?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.productid)}
                            className="col-6"
                            valueDefault={row?.productid || ""}
                            onChange={(value) => setValue('productid', value)}
                            error={errors?.productid?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.catalogname)}
                            className="col-6"
                            valueDefault={row?.catalogname || ""}
                            onChange={(value) => setValue('catalogname', value)}
                            error={errors?.catalogname?.message}
                        />
                        <FieldEdit
                            label={"Catalog ID"}
                            className="col-6"
                            valueDefault={row?.catalogid || ""}
                            onChange={(value) => setValue('catalogid', value)}
                            error={errors?.catalogid?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className={classes.subtitle}>{t(langKeys.productcatalogimage)}</div>
                        {
                            getValues("imagelink") ? (
                                <React.Fragment>
                                    <Box sx={{ ...sxImageBox, borderTop: '0px' }}>
                                        <img
                                            src={getValues("imagelink")}
                                            alt={getValues("imagelink")}
                                            style={{ maxWidth: '300px' }}
                                        />
                                    </Box>
                                </React.Fragment>)
                                : null
                        }
                        <React.Fragment>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="attachmentInput"
                                type="file"
                                onChange={(e) => onChangeAttachment(e.target.files, "imagelink")}
                            />
                            {<IconButton
                                onClick={() => { setfieldupload("imagelink"); onClickAttachment("attachmentInput") }}
                                disabled={(waitUploadFile || (fileAttachment !== null || getValues("imagelink")))}
                            >
                                <AttachFileIcon color="primary" />
                            </IconButton>}
                            {!!getValues("imagelink") && getValues("imagelink").split(',').map((f: string, i: number) => (
                                <FilePreview key={`attachment-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f, "imagelink")} />
                            ))}
                            {waitUploadFile && fieldupload === "imagelink" && fileAttachment && <FilePreview key={`attachment-x`} src={fileAttachment} />}
                        </React.Fragment>
                        <FieldEdit
                            label={''}
                            className="col-12"
                            valueDefault={''}
                            onChange={() => { }}
                            disabled={true}
                            error={errors?.imagelink?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className={classes.subtitle}>{t(langKeys.additionalimage)}</div>
                        {
                            getValues("additionalimagelink") ? (
                                <React.Fragment>
                                    <Box sx={{ ...sxImageBox, borderTop: '0px' }}>
                                        <img
                                            src={getValues("additionalimagelink")}
                                            alt={getValues("additionalimagelink")}
                                            style={{ maxWidth: '300px' }}
                                        />
                                    </Box>
                                </React.Fragment>)
                                : null
                        }
                        <React.Fragment>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="attachmentInput2"
                                type="file"
                                onChange={(e) => onChangeAttachment(e.target.files, "additionalimagelink")}
                            />
                            {<IconButton
                                onClick={() => { setfieldupload("additionalimagelink"); onClickAttachment("attachmentInput2") }}
                                disabled={(waitUploadFile || (fileAttachmentAditional !== null || getValues("additionalimagelink")))}
                            >
                                <AttachFileIcon color="primary" />
                            </IconButton>}
                            {!!getValues("additionalimagelink") && getValues("additionalimagelink").split(',').map((f: string, i: number) => (
                                <FilePreview key={`attachment-x${i}`} src={f} onClose={(f) => handleCleanMediaInput(f, "additionalimagelink")} />
                            ))}
                            {waitUploadFile && fieldupload === "additionalimagelink" && fileAttachmentAditional && <FilePreview key={`attachment-x2`} src={fileAttachmentAditional} />}
                        </React.Fragment>
                        <FieldEdit
                            label={''}
                            className="col-12"
                            valueDefault={''}
                            onChange={() => { }}
                            disabled={true}
                            error={errors?.additionalimagelink?.message}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

interface FilePreviewProps {
    src: File | string;
    onClose?: (f: string) => void;
}

const useFilePreviewStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'white',
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        maxWidth: 300,
        maxHeight: 80,
        alignItems: 'center',
        width: 'fit-content',
        overflow: 'hidden'
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'lightgrey',
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes('http'), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = (src as string).match(/.*\/(.+?)\./);
            return m && m.length > 1 ? m[1] : "";
        };
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split('.').pop()?.toUpperCase() || "-";
        }
        return (src as File).name?.split('.').pop()?.toUpperCase() || "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: '0.5em' }} />
            <div className={classes.infoContainer}>
                <div>
                    <div style={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 190, whiteSpace: 'nowrap' }}>{getFileName()}</div>{getFileExt()}
                </div>
            </div>
            <div style={{ width: '0.5em' }} />
            {!isUrl() && !onClose && <CircularProgress color="primary" />}
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={() => onClose(src as string)}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: '10%' }} />}
                {isUrl() && (
                    <a href={src as string} target="_blank" rel="noreferrer" download={`${getFileName()}.${getFileExt()}`}>
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
}

export default ProductCatalog;