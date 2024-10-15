import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { convertLocalDate, getBlacklistExport, getBlacklistPaginated, insarrayBlacklist, insBlacklist, uploadExcelBlacklist } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import { execute, exportData, getCollectionPaginated, resetCollectionPaginated } from 'store/main/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { TemplateBreadcrumbs, TemplateIcons, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import TablePaginated from 'components/fields/table-paginated';
import { Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { CellProps } from 'react-table';
import { DetailProps, UploadData, Row } from 'pages/campaign/model';
import { BlacklistStyles } from 'pages/campaign/styles';
import { BlacklistRegisterModal } from './BlacklistRegisterModal';

export const Blacklist: React.FC<DetailProps> = ({ setViewSelected }) => {
    const classes = BlacklistStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const executeResult = useSelector(state => state.main.execute);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null, distinct: false })
    const [waitExport, setWaitExport] = useState(false);
    const [waitImport, setWaitImport] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Row | null>(null);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.campaign_plural) },
        { id: "view-2", name: t(langKeys.blacklist) }
    ];

    const columns = React.useMemo(
        () => [
            {
                accessor: 'id',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            viewFunction={() => handleDetail(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleDetail(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone',
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
            },
            {
                Header: t(langKeys.creationdate),
                accessor: 'createdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <div>{convertLocalDate(row.createdate).toLocaleDateString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"})}</div>
                    )
                }
            },
        ],
        []
    );

    const fetchData = ({ pageSize, pageIndex, filters, sorts }: IFetchData) => {
        setfetchDataAux({...fetchDataAux, ...{ pageSize, pageIndex, filters, sorts }});
        dispatch(getCollectionPaginated(getBlacklistPaginated(
            {
                sorts: sorts,
                filters: filters,
                take: pageSize,
                skip: pageIndex * pageSize,
            }
        )));
    };

    const triggerExportData = ({ filters, sorts }: IFetchData) => {
        const columnsExport = columns.map(x => ({
            key: x.accessor,
            alias: x.Header,
        }));
        dispatch(exportData(getBlacklistExport(
            {              
                sorts,
                filters: filters,
            }), "", "excel", false, columnsExport));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    const handleUpload = async (files: File[]) => {
        const file = files[0];
        if (file) {
            const data: UploadData[] = await uploadExcelBlacklist(file);
            if (data.length > 0) {
                const validpk = Object.keys(data[0]).includes('phone');
                const keys = Object.keys(data[0]);
                dispatch(showBackdrop(true));
                dispatch(execute(insarrayBlacklist(data.reduce((ad: UploadData[], d: UploadData) => {
                    ad.push({
                        ...d,
                        id: d.id || 0,
                        phone: (validpk ? d.phone : String(d[keys[0]])) || '',
                        description: (validpk ? d.description : String(d[keys[1]])) || '',
                        type: d.type || 'NINGUNO',
                        status: d.status || 'ACTIVO',
                        operation: d.operation || 'INSERT',
                    });
                    return ad;
                }, []))));
                setWaitImport(true);
            }
        }
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insBlacklist({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleDetail = (row?: Dictionary) => {
        if (row) {
            const convertedRow: Row = {
                id: row.id as string,
                name: row.name as string,
                reason: row.reason as string,
                date: row.date as string,
                phone: row.phone as string,
                description: row.description as string,
            };
            setSelectedRow(convertedRow);
        } else {
            setSelectedRow(null);
        }
        setOpenModal(true);
    };

    useEffect(() => {
        dispatch(resetCollectionPaginated());
        fetchData(fetchDataAux);
        return () => {
            dispatch(resetCollectionPaginated());
        };
    }, [])

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    useEffect(() => {
        if (waitImport) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [executeResult, waitImport]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                fetchData(fetchDataAux);
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={t(langKeys.blacklist)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}
                    >{t(langKeys.back)}</Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="button"
                        startIcon={<AddIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                        onClick={() => handleDetail()}
                    >{t(langKeys.register)}
                    </Button>
                </div>
            </div>
            <div>
                <TablePaginated
                    columns={columns}
                    data={mainPaginated.data}
                    totalrow={totalrow}
                    loading={mainPaginated.loading}
                    pageCount={pageCount}
                    download={true}
                    importCSV={handleUpload}
                    fetchData={fetchData}
                    exportPersonalized={triggerExportData}
                    autotrigger={false}
                />
            </div>
            {openModal && <BlacklistRegisterModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchData={() => fetchData(fetchDataAux)}
                row={selectedRow}
            />}
        </div>
    )
}