import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { convertLocalDate, getBlacklistExport, getBlacklistPaginated, insarrayBlacklist, insBlacklist, uploadExcel } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import { execute, exportData, getCollectionPaginated, resetCollectionPaginated } from 'store/main/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { DialogZyx, FieldEdit, TemplateBreadcrumbs, TemplateIcons, TitleDetail } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import TablePaginated from 'components/fields/table-paginated';
import { Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { Add as AddIcon } from '@material-ui/icons';
import { CellProps } from 'react-table';

interface DetailProps {
    setViewSelected: (view: string) => void;
}

const arrayBread = [
    { id: "view-1", name: "Campaign" },
    { id: "view-2", name: "Campaign blacklist" }
];

const useStyles = makeStyles(() => ({   
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    flexgrow1: {
        flexGrow: 1
    }
}));

export const Blacklist: React.FC<DetailProps> = ({ setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const executeResult = useSelector(state => state.main.execute);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const [waitExport, setWaitExport] = useState(false);
    const [waitImport, setWaitImport] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Dictionary | undefined>({});
    
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
                accessor: 'phone'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description'
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

    const handleUpload = async (files: any[]) => {
        const file = files[0];
        if (file) {
            const data: any = await uploadExcel(file, undefined);
            if (data.length > 0) {
                const validpk = Object.keys(data[0]).includes('phone');
                const keys = Object.keys(data[0]);
                dispatch(showBackdrop(true));
                dispatch(execute(insarrayBlacklist(data.reduce((ad: any[], d: any) => {
                    ad.push({
                        ...d,
                        id: d.id || 0,
                        phone: (validpk ? d.phone : d[keys[0]]) || '',
                        description: (validpk ? d.description : d[keys[1]]) || '',
                        type: d.type || 'NINGUNO',
                        status: d.status || 'ACTIVO',
                        operation: d.operation || 'INSERT',
                    })
                    return ad;
                }, []))));
                setWaitImport(true)
            }
        }
    }

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
        setSelectedRow(row);
        setOpenModal(true);
    }

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
            {openModal && <ModalBlacklist
                openModal={openModal}
                setOpenModal={setOpenModal}
                fetchData={() => fetchData(fetchDataAux)}
                row={selectedRow}
            />}
        </div>
    )
}

interface ModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => any;
    fetchData: () => any;
    row: any;
}

const ModalBlacklist: React.FC<ModalProps> = ({ openModal, setOpenModal, row, fetchData }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const executeResult = useSelector(state => state.main.execute);

    const [waitSave, setWaitSave] = useState(false);

    const { register, handleSubmit, setValue, getValues, trigger, clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            isnew: row ? false : true,
            id: row ? row.id : 0,
            description: row ? row.description : '',
            type: 'NINGUNO',
            status: 'ACTIVO',
            phone: row ? row.phone : '',
            operation: row ? "UPDATE" : "INSERT"
        }
    });

    const handleCancelModal = () => {
        clearErrors();
        setOpenModal(false);
    }

    const handleSaveModal = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insBlacklist(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
        
    });

    useEffect(() => {
        register('phone', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    useEffect(() => {
        if (row) {
            setValue('id', row.id);
            setValue('phone', row.phone);
            setValue('description', row.description);
            trigger();
        }
    }, [row]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
                setOpenModal(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.detail)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.save)}
            handleClickButton2={handleSaveModal}
        >
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.phone)}
                    className="col-6"
                    valueDefault={getValues('phone')}
                    onChange={(value) => setValue('phone', value)}
                    error={errors?.phone?.message}
                />
                <FieldEdit
                    label={t(langKeys.description)}
                    className="col-6"
                    valueDefault={getValues('description')}
                    onChange={(value) => setValue('description', value)}
                    error={errors?.description?.message}
                />
            </div>
        </DialogZyx>
    )
}