/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, FC, useEffect, useState, useCallback } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TableZyx from '../components/fields/table-simple';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons, TemplateBreadcrumbs, FieldEdit, FieldSelect, TitleDetail } from 'components';
import { getValuesFromDomain, getProductCatalogSel, productCatalogIns} from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain, setMemoryTable, cleanMemoryTable, uploadFile } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Search as SearchIcon, FileCopy, GetApp, Close } from '@material-ui/icons';
import { IconButton, CircularProgress } from '@material-ui/core';
import { DuplicateIcon } from 'icons';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { formatNumber } from 'common/helpers';

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData?: () => void;
    arrayBread: any;
}

const useStyles = makeStyles((theme) => ({
    fieldsfilter: {
        width: 220,
    },
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    subtitle: {
        fontWeight: "bold",
        fontSize: "20px",
        paddingBottom: "10px",
    },
    subtitle2: {
        fontWeight: "bold",
        fontSize: "15px",
        paddingBottom: "10px",
    },
    button: {
        marginRight: theme.spacing(2),
    }
}));

const PRODUCTCATALOG = 'PRODUCTCATALOG';
const ProductCatalog: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const executeResult = useSelector(state => state.main.execute);
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const user = useSelector(state => state.login.validateToken.user);
    const superadmin = user?.roledesc === "SUPERADMIN" || user?.roledesc === "ADMINISTRADOR";

    const [dataCategory, setdataCategory] = useState<Dictionary[]>([]);
    const [dataMain, setdataMain] = useState({
        category: ""
    });
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitSave, setWaitSave] = useState(false);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.productcatalog) },
    ];

    const fetchData = () => dispatch(getCollection(getProductCatalogSel(0, dataMain.category)));

    useEffect(() => {
        fetchData();

        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("CATALOGOPRODUCTOCATEGORIA"),
        ]));

        dispatch(setMemoryTable({
            id: PRODUCTCATALOG
        }))
        
        return () => {
            dispatch(cleanMemoryTable());
            dispatch(resetAllMain());
        };
    }, []);

    function redirectFunc(view:string) {
        setViewSelected(view)
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        if (mainResult.multiData != null) {
            if (mainResult.multiData.data != null) {
                if (mainResult.multiData.data[1]) {
                    if (mainResult.multiData.data[1].success) {
                        setdataCategory(mainResult.multiData.data[1].data);
                    }
                }
            }
        }
    }, [mainResult])

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

    const handleDuplicate = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(productCatalogIns({ ...row, id: row.productcatalogid, operation: 'DELETE', status: 'ELIMINADO' })));
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
                            extraOption={t(langKeys.duplicate)}
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            extraFunction={() => handleDuplicate(row)}
                            ExtraICon={() => <DuplicateIcon width={28} style={{ fill: '#7721AD' }} />}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.code),
                accessor: 'code',
            },
            {
                Header: t(langKeys.description),
                accessor: 'description'
            },
            {
                Header: t(langKeys.productcatalogcategory),
                accessor: 'descriptiontext'
            },
            {
                Header: t(langKeys.productcatalogunitprice),
                accessor: 'unitprice',
                type: 'number',
                sortType: 'number',
                Cell: (props: any) => {
                    const { unitprice } = props.cell.row.original;
                    return formatNumber(unitprice || 0);
                }
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
        ],
        []
    );

    if (viewSelected === "view-1") {
        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <div style={{width:"100%"}}>
                <Fragment>
                    <TableZyx
                        ButtonsElement={() => (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <FieldSelect
                                    label={t(langKeys.category)}
                                    className={classes.fieldsfilter}
                                    valueDefault={dataMain.category}
                                    variant="outlined"
                                    onChange={(value) => setdataMain(prev => ({ ...prev, category: value?.domainvalue || "" }))}
                                    data={dataCategory}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <Button
                                    disabled={mainResult.mainData.loading}
                                    variant="contained"
                                    color="primary"
                                    style={{ width: 120, backgroundColor: "#55BD84" }}
                                    startIcon={<SearchIcon style={{ color: 'white' }} />}
                                    onClick={() => fetchData()}
                                >{t(langKeys.search)}
                                </Button>
                            </div>
                        )}
                        columns={columns}
                        titlemodule={t(langKeys.productcatalog, { count: 2 })}
                        data={mainResult.mainData.data}
                        download={false}
                        onClickRow={handleEdit}
                        loading={mainResult.mainData.loading}
                        register={superadmin}
                        handleRegister={handleRegister}
                        pageSizeDefault={PRODUCTCATALOG === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                        initialPageIndex={PRODUCTCATALOG === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                        initialStateFilter={PRODUCTCATALOG === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                    />
                </Fragment>
            </div>
        )
    }
    else
        return (
            <DetailProductCatalog
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
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
    const dataDomainCategory = multiData[1] && multiData[1].success ? multiData[1].data: [];
    const uploadResult = useSelector(state => state.main.uploadFile);

    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);

    const { trigger, register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.productcatalogid || 0,
            code: row?.code || '',
            description: row?.description || '',
            descriptiontext: row?.descriptiontext || '',
            category: row?.category || '',
            status: row?.status || 'ACTIVO',
            type: row?.type || '',
            imagereference: row?.imagereference || '',
            notes: row?.notes || '',
            unitprice: row?.unitprice || 0.0,
            operation: (edit && row) ? "EDIT" : "INSERT",
        }
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    React.useEffect(() => {
        register('id');
        register('code', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('descriptiontext');
        register('category', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type');
        register('imagereference');
        register('notes');
        register('unitprice', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) >= 0) || t(langKeys.field_required) });
    }, [edit, register]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(productCatalogIns(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    
    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);
        if (file) {
            setFileAttachment(file);
            let fd = new FormData();
            fd.append('file', file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, []);

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById('attachmentInput');
        input!.click();
    }, []);

    const handleCleanMediaInput = async (f: string) => {
        const input = document.getElementById('attachmentInput') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
        setFileAttachment(null);
        setValue('imagereference', getValues('imagereference').split(',').filter((a: string) => a !== f).join(''));
        await trigger('imagereference');
    }

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('imagereference', [getValues('imagereference'), uploadResult?.url || ''].join(''))
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])

    return (
        <div style={{width: "100%"}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.productcatalogsingle)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={edit ? (row ? `${row.code}` : `${t(langKeys.new)} ${t(langKeys.productcatalogsingle)}`) : `${t(langKeys.new)} ${t(langKeys.productcatalogsingle)}`}
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
                            label={t(langKeys.code)}
                            className="col-6"
                            valueDefault={row?.code || ""}
                            onChange={(value) => setValue('code', value)}
                            error={errors?.code?.message}
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
                            label={t(langKeys.productcatalogunitprice)}
                            className="col-6"
                            valueDefault={row?.unitprice || 0.0}
                            onChange={(value) => setValue('unitprice', value)}
                            error={errors?.unitprice?.message}
                            type="number"
                            inputProps={{ step: "any" }}
                        />
                        <FieldSelect
                            label={t(langKeys.category)}
                            className="col-6"
                            valueDefault={row?.category || ""}
                            onChange={(value) => {
                                setValue('category', value?.domainvalue || '');
                                setValue('descriptiontext', value?.domaindesc || '');
                            }}
                            error={errors?.category?.message}
                            data={dataDomainCategory}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
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
                            label={t(langKeys.productcatalognotes)}
                            className="col-12"
                            valueDefault={row?.notes || ""}
                            onChange={(value) => setValue('notes', value)}
                            error={errors?.notes?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className={classes.subtitle}>{t(langKeys.productcatalogimage)}</div>
                        {
                            getValues("imagereference") ? (
                                <React.Fragment>
                                    <Box sx={{ ...sxImageBox, borderTop: '0px' }}>
                                        <img
                                            src={getValues("imagereference")}
                                            alt={getValues("imagereference")}
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
                                onChange={(e) => onChangeAttachment(e.target.files)}
                            />
                            {<IconButton
                                onClick={onClickAttachment}
                                disabled={(waitUploadFile || (fileAttachment !== null || getValues("imagereference")))}
                            >
                                <AttachFileIcon color="primary" />
                            </IconButton>}
                            {!!getValues("imagereference") && getValues("imagereference").split(',').map((f: string, i: number) => (
                                <FilePreview key={`attachment-${i}`} src={f} onClose={(f) => handleCleanMediaInput(f)} />
                            ))}
                            {waitUploadFile && fileAttachment && <FilePreview key={`attachment-x`} src={fileAttachment} />}
                        </React.Fragment>
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