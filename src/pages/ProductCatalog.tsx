/* eslint-disable react-hooks/exhaustive-deps */
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Paper from '@material-ui/core/Paper';
import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import TablePaginated, { useQueryParams } from 'components/fields/table-paginated';

import { Dictionary, MultiData, IFetchData } from "@types";
import { DownloadIcon } from 'icons';
import { formatNumber } from 'common/helpers';
import { getCollectionPaginated, getMultiCollection, resetAllMain, uploadFile, resetCollectionPaginated } from 'store/main/actions';
import { getValuesFromDomain, getPaginatedProductCatalog, metaCatalogSel } from 'common/helpers';
import { googleCategory } from 'common/constants/googleCategory';
import { IconButton, CircularProgress, FormControlLabel } from '@material-ui/core';
import { langKeys } from 'lang/keys';
import { makeStyles } from '@material-ui/core/styles';
import { Search as SearchIcon, AddCircle, FileCopy, GetApp, Close, Delete } from '@material-ui/icons';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { TemplateIcons, TemplateBreadcrumbs, FieldEdit, FieldSelect, TitleDetail, FieldMultiSelectFreeSolo, DialogZyx, IOSSwitch, FieldView } from 'components';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { useTranslation } from 'react-i18next';
import { catalogManageProduct, catalogDeleteProduct, catalogSynchroProduct, catalogImportProduct, catalogDownloadProduct } from "store/catalog/actions";
import { useLocation } from 'react-router';

interface RowSelected {
    edit: boolean;
    row: Dictionary | null;
}

interface DetailProps {
    arrayBread: any;
    data: RowSelected;
    fetchData?: () => void;
    metaCatalogList: Dictionary[];
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
    const location = useLocation();

    const classes = useStyles();
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const mainResult = useSelector(state => state.main);
    const resultDeleteProduct = useSelector(state => state.catalog.requestCatalogDeleteProduct);
    const resultDownloadProduct = useSelector(state => state.catalog.requestCatalogDownloadProduct);
    const resultManageProduct = useSelector(state => state.catalog.requestCatalogManageProduct);
    const resultSynchroProduct = useSelector(state => state.catalog.requestCatalogSynchroProduct);
    const user = useSelector(state => state.login.validateToken.user);
    const superadmin = ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(user?.roledesc || '');

    const [availabilityTemplate] = useState<Dictionary[]>([{ "key": t(langKeys.productcatalog_domain_availability_available_for_order), "value": "available for order" }, { "key": t(langKeys.productcatalog_domain_availability_discontinued), "value": "discontinued" }, { "key": t(langKeys.productcatalog_domain_availability_in_stock), "value": "in stock" }, { "key": t(langKeys.productcatalog_domain_availability_out_of_stock), "value": "out of stock" }, { "key": t(langKeys.productcatalog_domain_availability_pending), "value": "pending" }, { "key": t(langKeys.productcatalog_domain_availability_preorder), "value": "preorder" }]);
    const [currencyTemplate] = useState<Dictionary[]>([{ "key": t(langKeys.productcatalog_domain_currency_pen), "value": "PEN" }, { "key": t(langKeys.productcatalog_domain_currency_usd), "value": "USD" }]);
    const [genderTemplate] = useState<Dictionary[]>([{ "key": t(langKeys.productcatalog_domain_gender_female), "value": "female" }, { "key": t(langKeys.productcatalog_domain_gender_male), "value": "male" }, { "key": t(langKeys.productcatalog_domain_gender_unisex), "value": "unisex" }]);
    const [statusTemplate] = useState<Dictionary[]>([{ "key": t(langKeys.status_activo), "value": "ACTIVO" }, { "key": t(langKeys.status_inactivo), "value": "INACTIVO" }]);
    const [reviewStatusTemplate] = useState<Dictionary[]>([{ "key": t(langKeys.productcatalog_reviewstatus_approved), "value": "approved" }, { "key": t(langKeys.productcatalog_reviewstatus_rejected), "value": "rejected" }]);
    const [catalogId, setCatalogId] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null });
    const [metaCatalogList, setMetaCatalogList] = useState<Dictionary[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [totalrow, settotalrow] = useState(0);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [waitDelete, setWaitDelete] = useState(false);
    const [waitManage, setWaitManage] = useState(false);
    const [waitDownload, setWaitDownload] = useState(false);
    const [waitSynchronize, setWaitSynchronize] = useState(false);

    const arrayBread = [{ id: "view-1", name: t(langKeys.productcatalog) }];
    const selectionKey = 'productcatalogid';
    const query = useMemo(() => new URLSearchParams(location.search), [location]);
    const params = useQueryParams(query, { ignore: ['channelTypes'] });
    console.log(params)

    const { trigger, register, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            availabilityList: availabilityTemplate,
            currencyList: currencyTemplate,
            genderList: genderTemplate,
            statusList: statusTemplate,
            reviewStatusList: reviewStatusTemplate,
        }
    });

    React.useEffect(() => {
        register('availabilityList');
        register('currencyList');
        register('genderList');
        register('statusList');
        register('reviewStatusList');
    }, [register]);

    useEffect(() => {
        dispatch(resetCollectionPaginated());
        fetchData(fetchDataAux);

        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("PRODUCTODISPONIBILIDAD"),
            getValuesFromDomain("PRODUCTOMONEDA"),
            getValuesFromDomain("PRODUCTOGENERO"),
            getValuesFromDomain("PRODUCTOCONDICION"),
            getValuesFromDomain("PRODUCTOESTADOREVISION"),
            metaCatalogSel({ metabusinessid: 0, id: 0 }),
        ]));

        return () => {
            dispatch(resetCollectionPaginated());
            dispatch(resetAllMain());
        };
    }, []);

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ ...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts } });
        dispatch(getCollectionPaginated(getPaginatedProductCatalog({
            metacatalogid: catalogId || 0,
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
        if (waitManage) {
            if (!resultManageProduct.loading && !resultManageProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                dispatch(showBackdrop(false));
                setWaitManage(false);
                fetchData(fetchDataAux);
            } else if (resultManageProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultManageProduct.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitManage(false);
            }
        }
    }, [resultManageProduct, waitManage])

    useEffect(() => {
        if (waitDelete) {
            if (!resultDeleteProduct.loading && !resultDeleteProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
                fetchData(fetchDataAux);
            } else if (resultDeleteProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultDeleteProduct.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [resultDeleteProduct, waitDelete])

    useEffect(() => {
        if (waitSynchronize) {
            if (!resultSynchroProduct.loading && !resultSynchroProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }))
                dispatch(showBackdrop(false));
                setWaitSynchronize(false);
                fetchData(fetchDataAux);
            } else if (resultSynchroProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultSynchroProduct.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitSynchronize(false);
            }
        }
    }, [resultSynchroProduct, waitSynchronize])

    useEffect(() => {
        if (waitDownload) {
            if (!resultDownloadProduct.loading && !resultDownloadProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }))
                dispatch(showBackdrop(false));
                setWaitDownload(false);

                if (resultDownloadProduct.data?.url) {
                    window.open(resultDownloadProduct.data?.url, '_blank');
                }
            } else if (resultDownloadProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultDownloadProduct.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitDownload(false);
            }
        }
    }, [resultDownloadProduct, waitDownload])

    useEffect(() => {
        if (mainResult.multiData.data.length > 0) {
            if (mainResult.multiData.data[0] && mainResult.multiData.data[0].success) {
                setValue('statusList', mainResult.multiData.data[0].data?.map(x => ({ key: t('status_' + x.domaindesc?.toLowerCase()), value: x.domainvalue })) || []);
                trigger('statusList');
            }

            if (mainResult.multiData.data[1] && mainResult.multiData.data[1].success) {
                setValue('availabilityList', mainResult.multiData.data[1].data?.map(x => ({ key: t('productcatalog_domain_availability_' + x.domaindesc?.toLowerCase()), value: x.domainvalue })) || []);
                trigger('availabilityList');
            }

            if (mainResult.multiData.data[2] && mainResult.multiData.data[2].success) {
                setValue('currencyList', mainResult.multiData.data[2].data?.map(x => ({ key: t('productcatalog_domain_currency_' + x.domaindesc?.toLowerCase()), value: x.domainvalue })) || []);
                trigger('currencyList');
            }

            if (mainResult.multiData.data[3] && mainResult.multiData.data[3].success) {
                setValue('genderList', mainResult.multiData.data[3].data?.map(x => ({ key: t('productcatalog_domain_gender_' + x.domaindesc?.toLowerCase()), value: x.domainvalue })) || []);
                trigger('genderList');
            }

            if (mainResult.multiData.data[5] && mainResult.multiData.data[5].success) {
                setValue('reviewStatusList', mainResult.multiData.data[5].data?.map(x => ({ key: t('productcatalog_reviewstatus_' + x.domaindesc?.toLowerCase()), value: x.domainvalue })) || []);
                trigger('reviewStatusList');
            }

            if (mainResult.multiData.data[6] && mainResult.multiData.data[6].success) {
                setMetaCatalogList(mainResult.multiData.data[6].data || []);
            }
        }
    }, [mainResult.multiData.data])

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
            dispatch(catalogDeleteProduct({ product: dataSelected.reduce((ad: any[], d: any) => { ad.push({ ...d, status: 'ELIMINADO' }); return ad; }, []) }));
            dispatch(showBackdrop(true));
            setWaitDelete(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(catalogManageProduct({ ...row, id: row.productcatalogid, operation: 'DELETE', status: 'ELIMINADO' }));
            dispatch(showBackdrop(true));
            setWaitManage(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleSynchronize = (metacatalogid: any) => {
        const callback = () => {
            dispatch(catalogSynchroProduct({ metacatalogid: metacatalogid }));
            dispatch(showBackdrop(true));
            setWaitSynchronize(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.productcatalog_synchroalert),
            callback
        }))
    }

    const handleDownload = () => {
        dispatch(catalogDownloadProduct({ metacatalogid: (catalogId || 0) }));
        dispatch(showBackdrop(true));
        setWaitDownload(true);
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'productcatalogid',
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
                accessor: 'productid',
                Header: t(langKeys.productid),
            },
            {
                accessor: 'catalogid',
                Header: t(langKeys.catalogid),
            },
            {
                accessor: 'catalogname',
                Header: t(langKeys.catalogname),
            },
            {
                accessor: 'title',
                Header: t(langKeys.title),
            },
            {
                accessor: 'description',
                Header: t(langKeys.description),
                Cell: (props: any) => {
                    const { description } = props.cell.row.original;
                    return description?.substring(0, 50) + "... ";
                }
            },
            {
                accessor: 'availability',
                Header: t(langKeys.availability),
                type: 'select',
                listSelectFilter: getValues('availabilityList') || [],
                Cell: (props: any) => {
                    const { availability } = props.cell.row.original;
                    return (t(`productcatalog_domain_availability_${availability?.replaceAll(' ', '_')}`.toLowerCase()) || '').toUpperCase()
                }
            },
            {
                accessor: 'link',
                Header: t(langKeys.website),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (<label
                        className={classes.labellink}
                        onClick={(e) => { e.stopPropagation(); window.open(`${row.link}`, '_blank')?.focus() }}
                    >{row.link ? t(langKeys.website) : ''}
                    </label>)
                }
            },
            {
                accessor: 'currency',
                Header: t(langKeys.currency),
                type: 'select',
                listSelectFilter: getValues('currencyList') || [],
                Cell: (props: any) => {
                    const { currency } = props.cell.row.original;
                    return (t(`productcatalog_domain_currency_${currency}`.toLowerCase()) || '').toUpperCase()
                }
            },
            {
                accessor: 'price',
                Header: t(langKeys.productcatalogunitprice),
                sortType: 'number',
                type: 'number',
                Cell: (props: any) => {
                    const { price } = props.cell.row.original;
                    return formatNumber(price || 0);
                }
            },
            {
                accessor: 'saleprice',
                Header: t(langKeys.saleprice),
                sortType: 'number',
                type: 'number',
                Cell: (props: any) => {
                    const { saleprice } = props.cell.row.original;
                    return formatNumber(saleprice || 0);
                }
            },
            {
                accessor: 'imagelink',
                Header: t(langKeys.image),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (<label
                        className={classes.labellink}
                        onClick={(e) => { e.stopPropagation(); window.open(`${row.imagelink}`, '_blank')?.focus() }}
                    >{row.imagelink ? t(langKeys.imagelink) : ''}
                    </label>)
                }
            },
            {
                accessor: 'additionalimagelink',
                Header: t(langKeys.additionalimage),
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (<label
                        className={classes.labellink}
                        onClick={(e) => { e.stopPropagation(); window.open(`${row.additionalimagelink}`, '_blank')?.focus() }}
                    >{row.additionalimagelink ? t(langKeys.additionalimagelink) : ''}
                    </label>)
                }
            },
            {
                accessor: 'pattern',
                Header: t(langKeys.pattern),
            },
            {
                accessor: 'category',
                Header: t(langKeys.category),
            },
            {
                accessor: 'brand',
                Header: t(langKeys.brand),
            },
            {
                accessor: 'color',
                Header: t(langKeys.color),
            },
            {
                accessor: 'gender',
                Header: t(langKeys.gender),
                type: 'select',
                listSelectFilter: getValues('genderList') || [],
                Cell: (props: any) => {
                    const { gender } = props.cell.row.original;
                    return (t(`productcatalog_domain_gender_${gender}`.toLowerCase()) || '').toUpperCase()
                }
            },
            {
                accessor: 'material',
                Header: t(langKeys.material),
            },
            {
                accessor: 'size',
                Header: t(langKeys.size),
            },
            {
                accessor: 'customlabel0',
                Header: `${t(langKeys.customlabel)}${user?.properties?.environment === "CLARO" ? ' 0' : ''}`,
            },
            ...(user?.properties?.environment === "CLARO" ? [{
                accessor: 'customlabel1',
                Header: `${t(langKeys.customlabel)} 1`,
            }] : []),
            ...(user?.properties?.environment === "CLARO" ? [{
                accessor: 'customlabel2',
                Header: `${t(langKeys.customlabel)} 2`,
            }] : []),
            ...(user?.properties?.environment === "CLARO" ? [{
                accessor: 'customlabel3',
                Header: `${t(langKeys.customlabel)} 3`,
            }] : []),
            ...(user?.properties?.environment === "CLARO" ? [{
                accessor: 'customlabel4',
                Header: `${t(langKeys.customlabel)} 4`,
            }] : []),
            {
                accessor: 'customnumber0',
                Header: `${t(langKeys.customnumber)} 0`,
            },
            {
                accessor: 'customnumber1',
                Header: `${t(langKeys.customnumber)} 1`,
            },
            {
                accessor: 'customnumber2',
                Header: `${t(langKeys.customnumber)} 2`,
            },
            {
                accessor: 'customnumber3',
                Header: `${t(langKeys.customnumber)} 3`,
            },
            {
                accessor: 'customnumber4',
                Header: `${t(langKeys.customnumber)} 4`,
            },
            {
                accessor: 'status',
                Header: t(langKeys.status),
                type: 'select',
                listSelectFilter: getValues('statusList') || [],
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || '').toUpperCase();
                }
            },
            {
                accessor: 'reviewstatus',
                Header: t(langKeys.productcatalog_reviewstatus),
                type: 'select',
                listSelectFilter: getValues('reviewStatusList') || [],
                Cell: (props: any) => {
                    const { reviewstatus } = props.cell.row.original;
                    return (t(`productcatalog_reviewstatus_${reviewstatus}`.toLowerCase()) || '').toUpperCase()
                }
            },
            {
                accessor: 'reviewdescription',
                Header: t(langKeys.productcatalog_reviewdescription),
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
                    metaCatalogList={metaCatalogList}
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
                            >{t(langKeys.delete)}
                            </Button>
                            <Button
                                color="primary"
                                disabled={mainPaginated.loading}
                                onClick={() => { handleDownload() }}
                                startIcon={<DownloadIcon style={{ color: 'white' }} />}
                                variant="contained"
                            >{t(langKeys.download)}
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
                            <FieldSelect
                                label={t(langKeys.catalogname)}
                                style={{ width: 300 }}
                                valueDefault={catalogId}
                                variant="outlined"
                                optionDesc="catalogname"
                                optionValue="metacatalogid"
                                data={metaCatalogList}
                                onChange={(value) => { setCatalogId(value?.metacatalogid || 0) }}
                            />
                            <Button
                                color="primary"
                                disabled={!catalogId}
                                onClick={() => { handleSynchronize(catalogId) }}
                                startIcon={<RefreshIcon style={{ color: 'white' }} />}
                                style={{ width: 140, backgroundColor: "#55BD84" }}
                                variant="contained"
                            >{t(langKeys.messagetemplate_synchronize)}
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
                    autotrigger={true}
                    columns={columns}
                    data={mainPaginated.data}
                    download={false}
                    fetchData={fetchData}
                    filterGeneral={true}
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
                    initialPageIndex={params.page}
                    initialFilters={params.filters}
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
                metaCatalogList={metaCatalogList}
                multiData={mainResult.multiData.data}
                setViewSelected={redirectFunc}
            />
        )
}

const ImportXmlModal: FC<{ openModal: boolean, metaCatalogList: Dictionary[], setOpenModal: (param: any) => void, onTrigger: () => void }> = ({ openModal, metaCatalogList, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const resultImportProduct = useSelector(state => state.catalog.requestCatalogImportProduct);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const user = useSelector(state => state.login.validateToken.user);

    const [checkedUrl, setCheckedUrl] = useState(false);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [waitImport, setWaitImport] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);

    const { register, trigger, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            corpid: user?.corpid,
            isxml: true,
            metacatalogid: 0,
            orgid: user?.orgid,
            url: '',
        }
    });

    React.useEffect(() => {
        register('isxml');
        register('metacatalogid', { validate: (value) => (value && value > 0) || '' + t(langKeys.field_required) });
        register('url', { validate: (value) => (value && value.length > 0) || '' + t(langKeys.field_required) });
    }, [register]);

    useEffect(() => {
        if (waitImport) {
            if (!resultImportProduct.loading && !resultImportProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }))
                dispatch(showBackdrop(false));

                setValue('isxml', false);
                setValue('metacatalogid', 0);
                setValue('url', '');
                setFileAttachment(null);

                setWaitImport(false);
                onTrigger();
            } else if (resultImportProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultImportProduct.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [resultImportProduct, waitImport])

    const onSubmit = handleSubmit((data) => {
        if (data?.url) {
            var extension = data?.url.slice((data?.url.lastIndexOf(".") - 1 >>> 0) + 2);

            if (extension?.toUpperCase() !== "XML" && extension?.toUpperCase() !== "CSV") {
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
            dispatch(catalogImportProduct(data));
            dispatch(showBackdrop(true));
            setWaitImport(true);
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
            input.value = '';
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
                setValue('isxml', false);
                setValue('metacatalogid', 0);
                setValue('url', '');
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
                        onClick={() => { window.open("https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/b29c7819-bfc3-4934-93de-a796c7a0de11/product-catalog-template.csv", '_blank'); }}
                    >{t(langKeys.templateexcel)}
                    </Button>
                    <Button
                        disabled={false}
                        variant="contained"
                        color="primary"
                        style={{ width: 150, backgroundColor: "#55BD84" }}
                        startIcon={<DownloadIcon style={{ color: 'white' }} />}
                        onClick={() => { window.open("https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/d4f29279-27e9-4f9d-b4a0-095967d1394b/product-catalog-template.xml", '_blank'); }}
                    >{t(langKeys.templatexml)}
                    </Button>
                </div>
            </div>
            <div className="row-zyx" style={{ marginTop: '36px' }}>
                <FieldSelect
                    className="col-12"
                    data={metaCatalogList}
                    error={errors?.metacatalogid?.message}
                    label={t(langKeys.catalogname)}
                    onChange={(value) => { setValue('metacatalogid', value?.metacatalogid || 0) }}
                    optionDesc="catalogname"
                    optionValue="metacatalogid"
                    valueDefault={getValues('metacatalogid') || 0}
                    variant="outlined"
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
                        label={''}
                    />
                </div>
                {checkedUrl && <React.Fragment>
                    <input
                        accept="text/xml, text/csv"
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

const DetailProductCatalog: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, metaCatalogList, fetchData, arrayBread }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataDomainAvailability = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataDomainCurrency = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataDomainGender = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const dataDomainCondition = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const resultManageProduct = useSelector(state => state.catalog.requestCatalogManageProduct);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const user = useSelector(state => state.login.validateToken.user);
    const isClaro = user?.properties?.environment === "CLARO";

    const [fieldupload, setfieldupload] = useState<"imagelink" | "additionalimagelink">("imagelink");
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [fileAttachmentAditional, setFileAttachmentAditional] = useState<File | null>(null);
    const [labels, setlabels] = useState(row?.labels?.split(',') || []);
    const [waitSave, setWaitSave] = useState(false);
    const [waitUploadFile, setWaitUploadFile] = useState(false);

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

    useEffect(() => {
        if (waitSave) {
            if (!resultManageProduct.loading && !resultManageProduct.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1");
            } else if (resultManageProduct.error) {
                const errormessage = t(resultManageProduct.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [resultManageProduct, waitSave])

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

    const { trigger, register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            metacatalogid: row?.metacatalogid || 0,
            id: row?.productcatalogid || 0,
            productid: row?.productid || '',
            retailerid: row?.retailerid || '',
            title: row?.title || '',
            description: row?.description || '',
            descriptionshort: row?.descriptionshort || '',
            availability: row?.availability || '',
            category: row?.category || '',
            condition: row?.condition || '',
            currency: row?.currency || '',
            price: row?.price || 0.00,
            saleprice: row?.saleprice || 0.00,
            link: row?.link || '',
            imagelink: row?.imagelink || '',
            additionalimagelink: row?.additionalimagelink || '',
            brand: row?.brand || '',
            color: row?.color || '',
            gender: row?.gender || '',
            material: row?.material || '',
            pattern: row?.pattern || '',
            size: row?.size || '',
            datestart: row?.datestart || null,
            datelaunch: row?.datelaunch || null,
            dateexpiration: row?.dateexpiration || null,
            labels: row?.labels || '',
            customlabel0: row?.customlabel0 || '',
            customlabel1: row?.customlabel1 || '',
            customlabel2: row?.customlabel2 || '',
            customlabel3: row?.customlabel3 || '',
            customlabel4: row?.customlabel4 || '',
            customnumber0: row?.customnumber0 || '',
            customnumber1: row?.customnumber1 || '',
            customnumber2: row?.customnumber2 || '',
            customnumber3: row?.customnumber3 || '',
            customnumber4: row?.customnumber4 || '',
            reviewstatus: row?.reviewstatus || '',
            reviewdescription: row?.reviewdescription || '',
            status: row?.status || '',
            type: row?.type || '',
            operation: (edit && row) ? "EDIT" : "INSERT",
        }
    });

    React.useEffect(() => {
        register('metacatalogid', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('id');
        register('productid', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('retailerid');
        register('title', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('descriptionshort');
        register('availability', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('category', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('condition', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('currency', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('price', { validate: (value) => ((value || String(value)) && parseFloat(String(value)) > 0) || t(langKeys.field_required) });
        register('saleprice');
        register('link', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('imagelink', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('additionalimagelink');
        register('brand', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('color');
        register('gender');
        register('material');
        register('pattern');
        register('size');
        register('datestart');
        register('datelaunch');
        register('dateexpiration');
        register('labels');
        register('customlabel0');
        register('customlabel1');
        register('customlabel2');
        register('customlabel3');
        register('customlabel4');
        register('customnumber0');
        register('customnumber1');
        register('customnumber2');
        register('customnumber3');
        register('customnumber4');
        register('reviewstatus');
        register('reviewdescription');
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type');
        register('operation');
    }, [edit, register]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(catalogManageProduct(data));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const handleCleanMediaInput = async (f: string, field: "imagelink" | "additionalimagelink") => {
        const input = document.getElementById(field === "imagelink" ? 'attachmentInput' : 'attachmentInput2') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
        if (field === "imagelink") {
            setFileAttachment(null);
        } else {
            setFileAttachmentAditional(null)
        }
        setValue(field, getValues(field).split(',').filter((a: string) => a !== f).join(''));
        await trigger(field);
    }

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
                        <FieldSelect
                            className="col-6"
                            data={metaCatalogList || []}
                            disabled={row ? true : false}
                            error={errors?.metacatalogid?.message}
                            label={t(langKeys.catalogname)}
                            onChange={(value) => { setValue('metacatalogid', value?.metacatalogid || 0); }}
                            optionDesc="catalogname"
                            optionValue="metacatalogid"
                            valueDefault={row?.metacatalogid || 0}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={row ? true : false}
                            error={errors?.productid?.message}
                            label={t(langKeys.productid)}
                            onChange={(value) => { setValue('productid', value); }}
                            valueDefault={row?.productid || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.title?.message}
                            label={t(langKeys.title)}
                            onChange={(value) => setValue('title', value)}
                            valueDefault={row?.title || ''}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.descriptionshort?.message}
                            label={t(langKeys.productcatalog_descriptionshort)}
                            onChange={(value) => setValue('descriptionshort', value)}
                            valueDefault={row?.descriptionshort || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-12"
                            disabled={!edit}
                            error={errors?.description?.message}
                            label={t(langKeys.description)}
                            onChange={(value) => setValue('description', value)}
                            valueDefault={row?.description || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={dataDomainAvailability || []}
                            disabled={!edit}
                            error={errors?.availability?.message}
                            label={t(langKeys.availability)}
                            onChange={(value) => setValue('availability', value?.domainvalue || '')}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            prefixTranslation="productcatalog_domain_availability_"
                            uset={true}
                            valueDefault={row?.availability || ''}
                        />
                        <FieldSelect
                            className="col-6"
                            data={googleCategory || []}
                            disabled={!edit}
                            error={errors?.category?.message}
                            label={t(langKeys.category)}
                            onChange={(value) => setValue('category', value?.categoryname || '')}
                            optionDesc="categoryname"
                            optionValue="categoryname"
                            valueDefault={row?.category || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            className="col-6"
                            data={dataDomainCondition || []}
                            disabled={!edit}
                            error={errors?.condition?.message}
                            label={t(langKeys.condition)}
                            onChange={(value) => setValue('condition', value?.domainvalue || '')}
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                            prefixTranslation="productcatalog_domain_condition_"
                            uset={true}
                            valueDefault={row?.condition || ''}
                        />
                        <FieldSelect
                            className="col-6"
                            data={dataDomainCurrency || []}
                            disabled={!edit}
                            error={errors?.currency?.message}
                            label={t(langKeys.currency)}
                            onChange={(value) => setValue('currency', value?.domainvalue || '')}
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                            prefixTranslation="productcatalog_domain_currency_"
                            uset={true}
                            valueDefault={row?.currency || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.price?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.productcatalogunitprice)}
                            onChange={(value) => setValue('price', value)}
                            type="number"
                            valueDefault={row?.price || 0.0}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.saleprice?.message}
                            inputProps={{ step: "any" }}
                            label={t(langKeys.saleprice)}
                            onChange={(value) => setValue('saleprice', value)}
                            type="number"
                            valueDefault={row?.saleprice || 0.0}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.link?.message}
                            label={t(langKeys.website)}
                            onChange={(value) => setValue('link', value)}
                            valueDefault={row?.link || ''}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.brand?.message}
                            label={t(langKeys.brand)}
                            onChange={(value) => setValue('brand', value)}
                            valueDefault={row?.brand || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.color?.message}
                            label={t(langKeys.color)}
                            onChange={(value) => setValue('color', value)}
                            valueDefault={row?.color || ''}
                        />
                        <FieldSelect
                            className="col-6"
                            data={dataDomainGender || []}
                            disabled={!edit}
                            error={errors?.gender?.message}
                            label={t(langKeys.gender)}
                            onChange={(value) => setValue('gender', value?.domainvalue || '')}
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                            prefixTranslation="productcatalog_domain_gender_"
                            uset={true}
                            valueDefault={row?.gender || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.material?.message}
                            label={t(langKeys.material)}
                            onChange={(value) => setValue('material', value)}
                            valueDefault={row?.material || ''}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.pattern?.message}
                            label={t(langKeys.pattern)}
                            onChange={(value) => setValue('pattern', value)}
                            valueDefault={row?.pattern || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.size?.message}
                            label={t(langKeys.size)}
                            onChange={(value) => setValue('size', value)}
                            valueDefault={row?.size || ''}
                        />
                        <FieldSelect
                            className="col-6"
                            data={dataDomainStatus || []}
                            disabled={!edit}
                            error={errors?.status?.message}
                            label={t(langKeys.status)}
                            onChange={(value) => setValue('status', value?.domainvalue || '')}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            prefixTranslation="status_"
                            uset={true}
                            valueDefault={row?.status || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldMultiSelectFreeSolo
                            className="col-6"
                            data={labels.map((x: any) => ({ value: x }))}
                            disabled={!edit}
                            label={t(langKeys.labels)}
                            loading={false}
                            onChange={(value) => {
                                setlabels(value.reduce((acc: any, x: any) => [...acc, typeof x === "object" ? x.value : x], []))
                                setValue("labels", value.reduce((acc: any, x: any) => [...acc, typeof x === "object" ? x.value : x], []).join(","))
                            }}
                            optionDesc="value"
                            optionValue="value"
                            valueDefault={labels.join(",") || ''}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.customlabel0?.message}
                            label={`${t(langKeys.customlabel)}${isClaro ? ' 0' : ''}`}
                            onChange={(value) => setValue('customlabel0', value)}
                            valueDefault={row?.customlabel0 || ''}
                        />
                    </div>
                    <div className="row-zyx" style={{ display: isClaro ? "flex" : "none" }}>
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.customlabel1?.message}
                            label={`${t(langKeys.customlabel)} 1`}
                            onChange={(value) => setValue('customlabel1', value)}
                            valueDefault={row?.customlabel1 || ''}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.customlabel2?.message}
                            label={`${t(langKeys.customlabel)} 2`}
                            onChange={(value) => setValue('customlabel2', value)}
                            valueDefault={row?.customlabel2 || ''}
                        />
                    </div>
                    <div className="row-zyx" style={{ display: isClaro ? "flex" : "none" }}>
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.customlabel3?.message}
                            label={`${t(langKeys.customlabel)} 3`}
                            onChange={(value) => setValue('customlabel3', value)}
                            valueDefault={row?.customlabel3 || ''}
                        />
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.customlabel4?.message}
                            label={`${t(langKeys.customlabel)} 4`}
                            onChange={(value) => setValue('customlabel4', value)}
                            valueDefault={row?.customlabel4 || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.customnumber0?.message}
                            label={`${t(langKeys.customnumber)} 0`}
                            onChange={(value) => setValue('customnumber0', value)}
                            type="number"
                            valueDefault={row?.customnumber0 || ''}
                        />
                         <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.customnumber1?.message}
                            label={`${t(langKeys.customnumber)} 1`}
                            onChange={(value) => setValue('customnumber1', value)}
                            type="number"
                            valueDefault={row?.customnumber1 || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.customnumber2?.message}
                            label={`${t(langKeys.customnumber)} 2`}
                            onChange={(value) => setValue('customnumber2', value)}
                            type="number"
                            valueDefault={row?.customnumber2 || ''}
                        />
                         <FieldEdit
                            className="col-6"
                            disabled={!edit}
                            error={errors?.customnumber3?.message}
                            label={`${t(langKeys.customnumber)} 3`}
                            onChange={(value) => setValue('customnumber3', value)}
                            type="number"
                            valueDefault={row?.customnumber3 || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-12"
                            disabled={!edit}
                            error={errors?.customnumber4?.message}
                            label={`${t(langKeys.customnumber)} 4`}
                            onChange={(value) => setValue('customnumber4', value)}
                            type="number"
                            valueDefault={row?.customnumber4 || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldView
                            className="col-6"
                            label={t(langKeys.productcatalog_reviewstatus)}
                            value={t(`productcatalog_reviewstatus_${row?.reviewstatus || ''}`)}
                        />
                        <FieldView
                            className="col-6"
                            label={t(langKeys.productcatalog_reviewdescription)}
                            value={row?.reviewdescription || ''}
                        />
                    </div>
                    <div className="row-zyx">
                        <div className={classes.subtitle}>{t(langKeys.productcatalogimage)}</div>
                        {getValues("imagelink") ? (
                            <React.Fragment>
                                <Box sx={{ ...sxImageBox, borderTop: '0px' }}>
                                    <img
                                        src={getValues("imagelink")}
                                        alt={getValues("imagelink")}
                                        style={{ maxWidth: '300px' }}
                                    />
                                </Box>
                            </React.Fragment>)
                            : null}
                        <React.Fragment>
                            <input
                                disabled={!edit}
                                accept="image/png"
                                style={{ display: 'none' }}
                                id="attachmentInput"
                                type="file"
                                onChange={(e) => onChangeAttachment(e.target.files, "imagelink")}
                            />
                            {<IconButton
                                onClick={() => { setfieldupload("imagelink"); onClickAttachment("attachmentInput") }}
                                disabled={(!edit || waitUploadFile || (fileAttachment !== null || getValues("imagelink")))}
                            ><AttachFileIcon color="primary" />
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
                        {getValues("additionalimagelink") ? (
                            <React.Fragment>
                                <Box sx={{ ...sxImageBox, borderTop: '0px' }}>
                                    <img
                                        src={getValues("additionalimagelink")}
                                        alt={getValues("additionalimagelink")}
                                        style={{ maxWidth: '300px' }}
                                    />
                                </Box>
                            </React.Fragment>)
                            : null}
                        <React.Fragment>
                            <input
                                disabled={!edit}
                                accept="image/png"
                                style={{ display: 'none' }}
                                id="attachmentInput2"
                                type="file"
                                onChange={(e) => onChangeAttachment(e.target.files, "additionalimagelink")}
                            />
                            {<IconButton
                                onClick={() => { setfieldupload("additionalimagelink"); onClickAttachment("attachmentInput2") }}
                                disabled={(!edit || waitUploadFile || (fileAttachmentAditional !== null || getValues("additionalimagelink")))}
                            ><AttachFileIcon color="primary" />
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
            return m && m.length > 1 ? m[1] : '';
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