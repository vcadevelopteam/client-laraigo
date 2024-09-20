
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { TemplateBreadcrumbs } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, makeStyles } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary } from '@types';
import { useDispatch } from 'react-redux';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { array_trimmer, convertLocalDate, exportExcel, normalizeKeys, templateMaker, uploadExcel, watsonExportIntents } from 'common/helpers';
import { resetAllMain } from 'store/main/actions';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { ModelTestDrawer } from './ModelTestDrawer';
import { deleteitemswatson, getExportItemsWatson, getItemsWatson, importItems, resetItemsWatson } from 'store/watsonx/actions';
import { DetailIntentions } from './details/DetailIntentions';


interface RowSelected {
    row: Dictionary | null,
    edit: Boolean
}

const useStyles = makeStyles((theme) => ({
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerFields: {
        paddingRight: "16px"
    },
}));

interface IntentionProps {
    setExternalViewSelected: (view: string) => void;
    arrayBread?: any;
    data?: any;
}

export const Intentions: React.FC<IntentionProps> = ({ setExternalViewSelected, arrayBread, data }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const classes = useStyles();
    const mainResultWatson = useSelector(state => state.watson.items);
    const exportResult = useSelector(state => state.watson.exportItems);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [waitSave, setWaitSave] = useState(false);
    const [openTest, setOpenTest] = useState(false);
    const [waitExportData, setWaitExportData] = useState(false);
    const [tableData, setTableData] = useState<any>([]);
    const operationRes = useSelector(state => state.watson.bulkload);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const selectedRow = useSelector(state => state.watson.selectedRow);

    const [viewSelected, setViewSelected] = useState("mainview");
    const [waitImport, setWaitImport] = useState(false);
    const deleteItemResult = useSelector(state => state.watson.deleteitems);

    const selectionKey = 'watsonitemid';
    const newArrayBread = [...arrayBread, { id: "mainview", name: t(langKeys.intentions) }];
    const fetchData = () => { dispatch(getItemsWatson(selectedRow?.watsonid)) };

    useEffect(() => {
        if (!mainResultWatson.loading && !mainResultWatson.error) {
            setTableData((mainResultWatson?.data || []).filter(x => x.type === "intention"))
        }
    }, [mainResultWatson]);

    const functionChange = (change: string) => {
        if (change === "mainview") {
            setViewSelected("mainview")
            fetchData()
        } else {
            setExternalViewSelected(change);
        }
    }

    useEffect(() => {
        fetchData();
        return () => {
            dispatch(resetItemsWatson());
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!deleteItemResult.loading && !deleteItemResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("mainview")
            } else if (deleteItemResult.error) {
                const errormessage = t(deleteItemResult.code || "error_unexpected_error", { module: t(langKeys.intentions).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [deleteItemResult, waitSave])

    useEffect(() => {
        if (waitExportData) {
            if (!exportResult.loading && !exportResult.error) {
                const columnsexport = [
                    { Header: t(langKeys.intention), accessor: 'item_name' },
                    { Header: t(langKeys.user_example), accessor: 'value' }
                ];
                exportExcel(`${t(langKeys.data)} ${t(langKeys.intention)}`, exportResult.data, columnsexport);
                dispatch(showBackdrop(false));
            } else if (exportResult.error) {
                const errormessage = t(exportResult.code || "error_unexpected_error", { module: t(langKeys.intentions).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitExportData(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [exportResult, waitExportData])

    useEffect(() => {
        if (waitImport) {
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.intentions).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [operationRes, waitImport]);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.intentions),
                accessor: 'item_name',
                width: "auto",
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => {
                                setViewSelected("view-2");
                                setRowSelected({ row: row, edit: true })
                            }}
                        >
                            #{row.item_name}
                        </label>
                    )
                }

            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: "auto",
            },
            {
                Header: t(langKeys.examples),
                accessor: 'count',
                width: "auto",
            },
            {
                Header: `${t(langKeys.conflicts)}`,
                accessor: 'conflicts',
                width: "auto",
            },
            {
                Header: t(langKeys.lastUpdate),
                accessor: 'changedate',
                width: "auto",
                type: 'date',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.changedate).toLocaleString()
                }
            },
        ],
        []
    );
    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true })
    }
    const handleDelete = () => {
        const callback = () => {
            dispatch(deleteitemswatson({
                watsonid: selectedRow.watsonid,
                ids: Object.keys(selectedRows).join(),
                type: "intention"
            }))
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleUpload = async (files: any[]) => {
        let file = files[0];
        if (file) {
            let excel: any = await uploadExcel(file, undefined);
            let data: Dictionary[] = array_trimmer(excel);
            const normalizedArray = data.map(normalizeKeys);
            const filteredArray = normalizedArray.filter((obj: any) => !!obj.intencion && obj.intencion.length < 128 && obj.ejemplo_usuario?.length <= 1024);
            if (filteredArray.length > 0) {
                const callback = () => {
                    dispatch(showBackdrop(true));
                    setWaitImport(true)
                    dispatch(importItems({
                        watsonid: selectedRow?.watsonid,
                        type: "intention",
                        data: filteredArray.map((x:any)=> ({example: x.ejemplo_usuario, intent: x.intencion}))
                    }))
                }
                dispatch(manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback
                }))
            }else{
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) }));
            }
        }
    }
    function triggerExportData(){
        setWaitExportData(true)
        dispatch(showBackdrop(true));
        dispatch(getExportItemsWatson(watsonExportIntents(selectedRow?.watsonid)))
    }
    if (viewSelected === "mainview") {
        return (
            <React.Fragment>
                <div style={{ height: 10 }}></div>
                <div style={{ width: "100%" }}>
                    {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <TemplateBreadcrumbs
                            breadcrumbs={newArrayBread}
                            handleClick={functionChange}
                        />
                        {!openTest && <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            endIcon={<DoubleArrowIcon color="secondary" />}
                            onClick={() => { setOpenTest(true) }}
                        >{t(langKeys.testmodel)}</Button>}
                    </div>}
                    <TableZyx
                        columns={columns}
                        data={tableData}
                        filterGeneral={false}
                        useSelection={true}
                        titlemodule={!!arrayBread ? t(langKeys.intentions) : ""}
                        selectionKey={selectionKey}
                        setSelectedRows={setSelectedRows}
                        ButtonsElement={() => (
                            <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <Button
                                        disabled={Object.keys(selectedRows).length === 0}
                                        variant="contained"
                                        type="button"
                                        color="primary"
                                        startIcon={<ClearIcon color="secondary" />}
                                        style={{ backgroundColor: Object.keys(selectedRows).length === 0 ? "#dbdbdc" : "#FB5F5F" }}
                                        onClick={handleDelete}
                                    >{t(langKeys.delete)}</Button>
                                </div>
                            </div>
                        )}
                        triggerExportPersonalized={true}
                        exportPersonalized={triggerExportData}
                        loading={mainResultWatson.loading}
                        register={true}
                        download={true}
                        handleRegister={handleRegister}
                        importCSV={handleUpload}
                        acceptTypeLoad={"application/x-yaml, text/yaml"}
                        pageSizeDefault={20}
                        initialPageIndex={0}
                    />
                </div>
                {openTest && <ModelTestDrawer data={data} setOpenDrawer={setOpenTest} />}
            </React.Fragment>
        );
    } else if (viewSelected === "view-2") {
        return (
            <div style={{ width: '100%' }}>
                <DetailIntentions
                    data={rowSelected}
                    fetchData={fetchData}
                    setViewSelected={setViewSelected}
                    setExternalViewSelected={functionChange}
                    arrayBread={newArrayBread}
                />
            </div>
        );
    } else
        return null;
}