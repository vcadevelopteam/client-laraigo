
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { TemplateBreadcrumbs } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, makeStyles } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary, IRequestBody } from '@types';
import { useDispatch } from 'react-redux';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { convertLocalDate } from 'common/helpers';
import { getMultiCollection, resetAllMain } from 'store/main/actions';
import { rasaIntentIns } from 'common/helpers/requestBodies';
import { downloadrasaia, uploadrasaia } from 'store/rasaia/actions';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { ModelTestDrawer } from './ModelTestDrawer';
import { getItemsWatson } from 'store/watsonx/actions';
import { DetailIntentions } from './Details/DetailIntentions';


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
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [waitSave, setWaitSave] = useState(false);
    const [openTest, setOpenTest] = useState(false);
    const [tableData, setTableData] = useState<any>([]);
    const [sendTrainCall, setSendTrainCall] = useState(false);
    const operationRes = useSelector(state => state.rasaia.rasaiauploadresult);
    const [waitExport, setWaitExport] = useState(false);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const selectedRow = useSelector(state => state.watson.selectedRow);

    const [viewSelected, setViewSelected] = useState("intentview");
    const [waitImport, setWaitImport] = useState(false);
    const trainResult = useSelector(state => state.rasaia.rasaiatrainresult);
    const exportResult = useSelector(state => state.rasaia.rasaiadownloadresult);
    const multiResult = useSelector(state => state.main.multiData);

    const selectionKey = 'watsonitemid';
    const dataModelAi = useSelector(state => state.main.mainAux);
    const newArrayBread = [...arrayBread, { id: "intentview", name: t(langKeys.intentions) }];
    const fetchData = () => { dispatch(getItemsWatson(selectedRow?.watsonid)) };

    useEffect(() => {
        if (!mainResultWatson.loading && !mainResultWatson.error) {
            setTableData((mainResultWatson?.data || []).filter(x => x.type === "intention"))
        }
    }, [mainResultWatson]);

    const functionChange = (change: string) => {
        if (change === "intentview") {
            setViewSelected("intentview")
            fetchData()
        } else {
            setExternalViewSelected(change);
        }
    }
    useEffect(() => {
        if (sendTrainCall) {
            if (!trainResult.loading && !trainResult.error) {
                let message = t(langKeys.bot_training_scheduled)
                dispatch(showSnackbar({ show: true, severity: "success", message: message }))
                setSendTrainCall(false);
                fetchData();
                dispatch(showBackdrop(false));
            } else if (trainResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: trainResult.message + "" }))
                setSendTrainCall(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [trainResult, sendTrainCall]);

    useEffect(() => {
        fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!multiResult.loading && !multiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (multiResult.error) {
                const errormessage = t(multiResult.code || "error_unexpected_error", { module: t(langKeys.intentions).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [multiResult, waitSave])

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
    }, [operationRes, operationRes]);
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
            let allRequestBody: IRequestBody[] = [];
            Object.keys(selectedRows).forEach(x => {
                allRequestBody.push(rasaIntentIns({ ...mainResultWatson.data.find(y => y.rasaintentid === parseInt(x)), operation: "DELETE", id: x }));
            });
            dispatch(getMultiCollection(allRequestBody))
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }



    const triggerExportData = () => {
        dispatch(downloadrasaia({ model_uuid: dataModelAi?.data?.[0]?.model_uuid || "", origin: "intent" }))
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (waitExport) {
            if (!exportResult.loading && !exportResult.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                window.open(exportResult?.url || "", '_blank');
            } else if (exportResult.error) {
                const errormessage = t(exportResult.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [exportResult, waitExport]);

    const handleUpload = async (files: any[]) => {
        let file = files[0];
        if (file) {
            const fd = new FormData();
            //file.type = "application/x-yaml";
            fd.append('file', file, file.name);
            fd.append('model_uuid', dataModelAi?.data?.[0]?.model_uuid || "");
            fd.append('origin', "intent");
            fd.append('Content-Type', 'text/yaml');
            dispatch(showBackdrop(true));
            setWaitImport(true)
            dispatch(uploadrasaia(fd))
        }
    }

    if (viewSelected === "intentview") {
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
                        loading={mainResultWatson.loading}
                        register={true}
                        download={true}
                        triggerExportPersonalized={true}
                        exportPersonalized={triggerExportData}
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