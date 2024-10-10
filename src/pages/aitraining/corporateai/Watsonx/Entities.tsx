
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { TemplateBreadcrumbs } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, Button, makeStyles } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary, IRequestBody } from '@types';
import { useDispatch } from 'react-redux';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { array_trimmer, convertLocalDate, exportExcel, normalizeKeys, uploadExcel } from 'common/helpers';
import {  getMultiCollection, resetAllMain } from 'store/main/actions';
import { rasaSynonimIns, watsonExportEntities } from 'common/helpers/requestBodies';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { ModelTestDrawer } from './ModelTestDrawer';
import { getExportItemsWatson, getItemsWatson, importItems, resetItemsWatson } from 'store/watsonx/actions';
import { DetailEntities } from './Details/DetailEntities';
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
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
    data?: any;
}

export const Entities: React.FC<IntentionProps> = ({ setExternalViewSelected, arrayBread, data }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const classes = useStyles();
    const mainResultWatson = useSelector(state => state.watson.items);
    const selectedRow = useSelector(state => state.watson.selectedRow);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [waitSave, setWaitSave] = useState(false);
    const exportResult = useSelector(state => state.watson.exportItems);
    const [waitExportData, setWaitExportData] = useState(false);
    const operationRes = useSelector(state => state.watson.bulkload);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [intentionSelected, setIntentionSelected] = useState<RowSelected>({ row: null, edit: false });
    const [openTest, setOpenTest] = useState(false);
    const [tableData, setTableData] = useState<any>([]);
    const deleteItemResult = useSelector(state => state.watson.deleteitems);

    const [viewSelected, setViewSelected] = useState("mainview");
    const [waitImport, setWaitImport] = useState(false);

    const selectionKey = 'watsonitemid';
    const fetchData = () => { dispatch(getItemsWatson(selectedRow?.watsonid)) };
    
    useEffect(() => {
        if(!mainResultWatson.loading && !mainResultWatson.error){
            setTableData((mainResultWatson?.data||[]).filter(x=>x.type === "entity"))
        }
    }, [mainResultWatson]);
    
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
        if (waitImport) {
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.sinonims).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [operationRes, waitImport]);

    function triggerExportData(){
        setWaitExportData(true)
        dispatch(showBackdrop(true));
        dispatch(getExportItemsWatson(watsonExportEntities(selectedRow?.watsonid)))
    }
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.entities),
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
                Header: t(langKeys.value_plural),
                accessor: 'values',
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
                allRequestBody.push(rasaSynonimIns({...mainResultWatson.data.find(y=>y.rasasynonymid === parseInt(x)), operation:"DELETE", id: x}));
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

    useEffect(() => {
        if (waitExportData) {
            if (!exportResult.loading && !exportResult.error) {
                const transformedData = exportResult.data.map(item => ({
                    ...item,
                    synonyms: JSON.parse(item.synonyms).join(",")
                }));
                const columnsexport = [
                    { Header: t(langKeys.entity), accessor: 'item_name' },
                    { Header: t(langKeys.value), accessor: 'value' },
                    { Header: t(langKeys.sinonim), accessor: 'synonyms' },
                ];
                exportExcel(`${t(langKeys.data)} ${t(langKeys.entities)}`, transformedData, columnsexport);
                dispatch(showBackdrop(false));
            } else if (exportResult.error) {
                const errormessage = t(exportResult.code || "error_unexpected_error", { module: t(langKeys.intentions).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitExportData(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [exportResult, waitExportData])

    

    const handleUpload = async (files: any[]) => {
        let file = files[0];
        if (file) {
            let excel: any = await uploadExcel(file, undefined);
            let data: Dictionary[] = array_trimmer(excel);
            const normalizedArray = data.map(normalizeKeys);
            const filteredArray = normalizedArray.filter((obj: any) => !!obj.entidad && obj.entidad.length < 128 && obj.valor?.length <= 1024);
            if (filteredArray.length > 0) {
                const callback = () => {
                    dispatch(showBackdrop(true));
                    setWaitImport(true)
                    dispatch(importItems({
                        watsonid: selectedRow?.watsonid,
                        type: "entity",
                        data: filteredArray.map((x:any)=> ({value: x.valor, entity: x.entidad, synonyms: x.sinonimos.split(",")}))
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
    
    if (viewSelected==="mainview"){
        return (
            <React.Fragment>
                <div style={{ height: 10 }}></div>
                <div style={{ width: "100%" }}>
                    {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8  }}>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "mainview", name: t(langKeys.entities) }]}
                            handleClick={setExternalViewSelected}
                        />
                        {!openTest && <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            endIcon={<DoubleArrowIcon color="secondary" />}
                            onClick={()=>{setOpenTest(true)}}
                        >{t(langKeys.testmodel)}</Button>}
                    </div>}
                    <TableZyx
                        columns={columns}
                        data={tableData}
                        filterGeneral={false}
                        useSelection={true}
                        titlemodule={!!arrayBread?t(langKeys.entities):""}
                        selectionKey={selectionKey}
                        setSelectedRows={setSelectedRows}
                        ButtonsElement={() => (     
                            <div style={{display: "flex", justifyContent: "end", width: "100%"}}>                       
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <Button
                                        disabled={Object.keys(selectedRows).length===0}
                                        variant="contained"
                                        type="button"
                                        color="primary"
                                        startIcon={<ClearIcon color="secondary" />}
                                        style={{ backgroundColor: Object.keys(selectedRows).length===0?"#dbdbdc":"#FB5F5F" }}
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
                        pageSizeDefault={20}
                        acceptTypeLoad={"application/x-yaml, text/yaml"}
                        initialPageIndex={0}
                    />
                </div>
                {openTest && <ModelTestDrawer data={data} setOpenDrawer={setOpenTest}/>}
            </React.Fragment>
            );
    }else if (viewSelected==="view-2"){
        return (
            <div style={{ width: '100%' }}>
                <DetailEntities
                    data={rowSelected}
                    fetchData={fetchData}
                    setViewSelected={setViewSelected}
                    setExternalViewSelected={setExternalViewSelected}
                    setIntentionSelected={setIntentionSelected}
                    arrayBread={arrayBread}
                />
            </div>
        );
    }else if (viewSelected==="view-3"){
        return (
            <div style={{ width: '100%' }}>
                <DetailIntentions
                    data={intentionSelected}
                    fetchData={fetchData}
                    setViewSelected={setViewSelected}
                    setExternalViewSelected={setExternalViewSelected}
                    arrayBread={arrayBread}
                />
            </div>
        );
    }else
        return null;
}