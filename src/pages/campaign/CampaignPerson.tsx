/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DialogZyx, TemplateBreadcrumbs, TitleDetail } from 'components';
import { Dictionary, ICampaign, MultiData, SelectedColumns } from "@types";
import TableZyx from '../../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCampaignMemberSel, uploadExcel } from 'common/helpers';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { useSelector } from 'hooks';
import { getCollectionAux } from 'store/main/actions';
import { showSnackbar } from 'store/popus/actions';

interface DetailProps {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetailData: (data: ICampaign) => void;
    setViewSelected: (view: string) => void;
    step: string;
    setStep: (step: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}

const arrayBread = [
    { id: "view-1", name: "Campaign" },
    { id: "view-2", name: "Campaign detail" }
];

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
    flexgrow1: {
        flexGrow: 1
    }
}));

export const CampaignPerson: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetailData, setViewSelected, step, setStep, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    const auxResult = useSelector(state => state.main.mainAux);

    const [valuefile, setvaluefile] = useState('');
    const [openModal, setOpenModal] = useState<boolean | null>(null);
    const [columnList, setColumnList] = useState<string[]>([]);
    const [headers, setHeaders] = useState<any[]>(detaildata.headers || []);
    const [jsonData, setJsonData] = useState<any[]>(detaildata.jsonData || []);
    const [jsonDataTemp, setJsonDataTemp] = useState<any[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>(
        detaildata.selectedColumns
        ? detaildata.selectedColumns
        : (detaildata.fields?.primarykey || '') !== ''
            ? { ...detaildata.fields } as SelectedColumns
            : new SelectedColumns());
    const [selectedColumnsBackup, setSelectedColumnsBackup] = useState<SelectedColumns>(new SelectedColumns());
    const [selectionKey, setSelectionKey] = useState<string| any>(
        detaildata.source === 'EXTERNAL' ? undefined :
        (detaildata.operation === 'INSERT' ? 'personid' : 'campaignmemberid'))
    const [selectedRows, setSelectedRows] = useState<any>(detaildata.selectedRows || {});
    const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false);

    const fetchPersonData = (id: number) => dispatch(getCollectionAux(getCampaignMemberSel(id)));

    useEffect(() => {
        if (detaildata.operation === 'INSERT') {
            if (detaildata.source === 'INTERNAL') {
                // dispatch(getPersonSel());
            }
        }
        else if (detaildata.operation === 'UPDATE') {
            if (detaildata.source === 'INTERNAL') {
                fetchPersonData(row?.id);
            }
            else if (detaildata.source === 'EXTERNAL') {
                if (detaildata.sourcechanged) {
                    setHeaders([]);
                    setJsonData([]);
                    setSelectedRows([]);
                }
            }
        }
    }, [step])
    
    useEffect(() => {
        if (!auxResult.loading && !auxResult.error) {
            if (detaildata.operation === 'UPDATE' && detaildata.source === 'INTERNAL') {
                setJsonData(auxResult.data);
                setHeaders([
                    { Header: t(langKeys.name), accessor: 'displayname' },
                    { Header: 'PCC', accessor: 'personcommunicationchannelowner' },
                    { Header: t(langKeys.type), accessor: 'type' },
                    { Header: t(langKeys.status), accessor: 'status' },
                    { Header: `${t(langKeys.field)} 1`, accessor: 'field1' },
                    { Header: `${t(langKeys.field)} 2`, accessor: 'field2' },
                    { Header: `${t(langKeys.field)} 3`, accessor: 'field3' },
                    { Header: `${t(langKeys.field)} 4`, accessor: 'field4' },
                    { Header: `${t(langKeys.field)} 5`, accessor: 'field5' },
                    { Header: `${t(langKeys.field)} 6`, accessor: 'field6' },
                    { Header: `${t(langKeys.field)} 7`, accessor: 'field7' },
                    { Header: `${t(langKeys.field)} 8`, accessor: 'field8' },
                    { Header: `${t(langKeys.field)} 9`, accessor: 'field9' },
                    { Header: `${t(langKeys.field)} 10`, accessor: 'field10' },
                    { Header: `${t(langKeys.field)} 11`, accessor: 'field11' },
                    { Header: `${t(langKeys.field)} 12`, accessor: 'field12' },
                    { Header: `${t(langKeys.field)} 13`, accessor: 'field13' },
                    { Header: `${t(langKeys.field)} 14`, accessor: 'field14' },
                    { Header: `${t(langKeys.field)} 15`, accessor: 'field15' }
                ]);
                if (detaildata.selectedRows) {
                    setSelectedRows(detaildata.selectedRows)
                }
                else {
                    setSelectedRows(auxResult.data.reduce((ad, d, i) => ({...ad, [d.campaignmemberid]: true }), {}));
                }
            }
        }
    }, [auxResult]);

    const handleUpload = async (files: any) => {
        const file = files[0];
        const data = await uploadExcel(file);
        setvaluefile('')
        if (data) {
            uploadData(data);
        }
    }

    const uploadData = (data: any) => {
        if (data.length === 0) {
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.file_without_data)}));
            return null;
        }
        if (data.length > 100000) {
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.too_many_records)}));
            return null;
        }
        let actualHeaders = jsonData.length > 0 ? Object.keys(jsonData[0]) : null;
        let newHeaders = Object.keys(data[0]);
        if (actualHeaders) {
            if (!actualHeaders.every(h => newHeaders?.includes(h))) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.file_incompatbile_with_previous_one)}));
                return null;
            }
        }
        // Set olny new records
        setJsonDataTemp(data.filter((d: any) => jsonData.findIndex((j: any) => JSON.stringify(j) === JSON.stringify(d)) === -1));
        // Set actual headers or new headers
        let localColumnList = actualHeaders ? actualHeaders : newHeaders;
        setColumnList(localColumnList);
        // Backup of columns if user cancel modal
        setSelectedColumnsBackup({ ...selectedColumns });
        // Initialize primary key
        let localSelectedColumns = { ...selectedColumns };
        if (!localColumnList.includes(localSelectedColumns.primarykey)) {
            localSelectedColumns = {...localSelectedColumns, primarykey: ''};
        }
        // Initialize selected column booleans
        if (selectedColumns.columns.length === 0) {
            localSelectedColumns = {...localSelectedColumns, column: new Array(localColumnList.length).fill(false)};
        }
        // Code for reuse campaign
        else if (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL') {
            // Asign [true, false] if columns has new order
            // Asign columns that exist
            localSelectedColumns = {
                ...localSelectedColumns,
                column: localColumnList.map(c => localSelectedColumns.columns.includes(c)),
                columns: localColumnList.reduce((ac: any, c: any) => {
                    if (localSelectedColumns.columns.includes(c)) {
                        ac.push(c);
                    }
                    return ac;
                }, [])
            };
        }
        setSelectedColumns(localSelectedColumns);
        setOpenModal(true);
    }

    const cleanData = () => {
        setJsonData([]);
        setHeaders([]);
        setJsonData([]);
        setColumnList([]);
        if (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL' && (detaildata.fields?.primarykey || '') !== '') {
            setSelectedColumns({...detaildata.fields} as SelectedColumns);
        }
        else {
            setSelectedColumns(new SelectedColumns());
        }
        setSelectedRows({});
        setDetailData({
            ...detaildata,
            headers: [],
            jsonData: [],
            selectedColumns: (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL' && (detaildata.fields?.primarykey || '') !== '')
            ? {...detaildata.fields} as SelectedColumns
            : new SelectedColumns(),
            selectedRows: [],
            person: [] 
        });
    }

    const handleCancelModal = () => {
        setSelectedColumns({...selectedColumnsBackup} as SelectedColumns);
        setOpenModal(false);
    }

    const handleSaveModal = () => {
        if (selectedColumns.primarykey !== '') {
            let columns = columnList.reduce((h: string[], c: string, i: number) => {
                if (c !== selectedColumns.primarykey && selectedColumns.column[i]) {
                    h.push(c);
                }
                return h
            }, []);
            setSelectedColumns({...selectedColumns, columns: columns})
            setJsonDataTemp(
                JSON.parse(JSON.stringify(jsonDataTemp, [
                    selectedColumns.primarykey,
                    ...columns
                ]))
            )
            setJsonData(
                [
                    ...JSON.parse(JSON.stringify(jsonData,
                    [
                        selectedColumns.primarykey,
                        ...columns
                    ])),
                    ...JSON.parse(JSON.stringify(jsonDataTemp.filter(j => 
                        !jsonData.map(jd => jd[selectedColumns.primarykey])
                        .includes(j[selectedColumns.primarykey])),
                    [
                        selectedColumns.primarykey,
                        ...columns
                    ]))
                ]
            )
            // Changing field(n) with new order
            let message: string = detaildata.message || '';
            if (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL' && (detaildata.fields?.primarykey || '') !== '') {
                detaildata.fields?.columns.forEach((c: string, i: number) => {
                    let newi = selectedColumns.columns.findIndex(cs => cs === c);
                    if (newi === -1) {
                        message = message?.replace(`{{${c}}}`, `{{${i + 1}}}`);
                        message = message?.replace(`{{field${i + 2}}}`, `{{${i + 1}}}`);
                    }
                    else {
                        message = message?.replace(`{{field${i + 2}}}`, `{{${c}}}`);
                    }
                });
                setDetailData({...detaildata, message: message});
            }
            else if (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL') {
                message?.match(/({{)(.*?)(}})/g)?.forEach((c: string, i: number) => {
                    message = message?.replace(`${c}`, `{{${i + 1}}}`);
                });
                setDetailData({...detaildata, message: message});
            }
            setOpenModal(false);
        }
    }

    useEffect(() => {
        if (openModal === false) {
            setHeaderTableData(selectedColumns);
            setAllRowsSelected(true)
        }
    }, [openModal])

    const setHeaderTableData = (localSelectedColumns: SelectedColumns) => {
        if (openModal === false && selectedColumns.primarykey !== '') {
            setSelectionKey(selectedColumns.primarykey);
            let headers = [
                localSelectedColumns.primarykey,
                ...localSelectedColumns.columns
            ].map(c => {
                return {
                    Header: c,
                    accessor: c
                }
            });
            setHeaders(headers);
            return headers;
        }
    }

    const changeStep = (step: string) => {
        if (step === 'step-3') {
            if (Object.keys(selectedRows).length === 0) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.no_record_selected)}));
                return null;
            }
        }
        if (detaildata.operation === 'INSERT' && detaildata.source === 'INTERNAL') {
            setDetailData({
                ...detaildata,
                headers: setHeaderTableData(selectedColumns),
                jsonData: jsonData,
                selectedColumns: selectedColumns,
                selectedRows: selectedRows,
                person: jsonData.filter(j => Object.keys(selectedRows).includes('' + j[selectionKey]))
            });
        }
        else if (detaildata.operation === 'UPDATE' && detaildata.source === 'INTERNAL') {
            setDetailData({
                ...detaildata,
                headers: setHeaderTableData(selectedColumns),
                jsonData: jsonData,
                selectedColumns: selectedColumns,
                selectedRows: selectedRows,
                person: jsonData.map(j => 
                    Object.keys(selectedRows).includes('' + j[selectionKey]) ? j : {...j, status: 'ELIMINADO'}
                )
            });
        }
        else if (detaildata.source === 'EXTERNAL') {
            // Cuando se use el seleccion, se updatea el status de cada person a ELIMINADO
            setDetailData({
                ...detaildata,
                // Update headers only where upload has used
                headers: openModal === false ? setHeaderTableData(selectedColumns) : detaildata.headers,
                jsonData: jsonData,
                selectedColumns: selectedColumns,
                selectedRows: selectedRows,
                person: jsonData.filter(j => Object.keys(selectedRows).includes('' + j[selectionKey]))
            });
        }
        setStep(step);
    }

    const AdditionalButtons = () => {
        if (detaildata.source === 'EXTERNAL') {
            return (
                <React.Fragment>
                    <input
                        id="upload-file"
                        name="file"
                        type="file"
                        accept=".xls,.xlsx"
                        value={valuefile}
                        style={{ display: 'none' }}
                        onChange={(e) => handleUpload(e.target.files)}
                    />
                    <label htmlFor="upload-file">
                        <Button
                            component="span"
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: "#53a6fa" }}
                        ><Trans i18nKey={langKeys.uploadFile} />
                        </Button>
                    </label> 
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={() => cleanData()}
                        style={{ backgroundColor: "#53a6fa" }}
                    ><Trans i18nKey={langKeys.clean} />
                    </Button>
                </React.Fragment>
            )
        }
        else {
            return null
        }
    }
    
    return (
        <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={row ? `${row.title}` : t(langKeys.newcampaign)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}
                    >{t(langKeys.cancel)}</Button>
                    {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="button"
                            style={{ backgroundColor: "#53a6fa" }}
                            onClick={() => changeStep("step-1")}
                        >{t(langKeys.back)}
                        </Button>
                    }
                    {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="button"
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => changeStep("step-3")}
                        >{t(langKeys.next)}
                        </Button>
                    }
                </div>
            </div>
            <div className={classes.containerDetail}>
                <TableZyx
                    titlemodule={t(langKeys.person_plural)}
                    columns={headers}
                    data={jsonData}
                    download={false}
                    loading={detaildata.source === 'INTERNAL' && auxResult.loading}
                    filterGeneral={false}
                    ButtonsElement={AdditionalButtons}
                    useSelection={true}
                    selectionKey={selectionKey}
                    initialSelectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    allRowsSelected={allRowsSelected}
                    setAllRowsSelected={setAllRowsSelected}
                />
            </div>
            <ModalCampaignColumns
                columnList={columnList}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                openModal={openModal}
                handleCancelModal={handleCancelModal}
                handleSaveModal={handleSaveModal}
            />
        </React.Fragment>
    )
}

interface ModalProps {
    columnList: string[];
    selectedColumns: SelectedColumns;
    setSelectedColumns: (data: SelectedColumns) => void;
    openModal: boolean | null;
    handleCancelModal: () => void;
    handleSaveModal: () => void;
}

const ModalCampaignColumns: React.FC<ModalProps> = ({ columnList, selectedColumns, setSelectedColumns, openModal, handleCancelModal, handleSaveModal }) => {
    const { t } = useTranslation();

    const [checkboxEnable, setCheckboxEnable] = useState(true);
    
    const handleMaxColumns = () => {
        setCheckboxEnable(selectedColumns.column.filter(c => c === true).length < 14 ? true : false);
    }

    useEffect(() => {
        handleMaxColumns();
    }, [selectedColumns])

    return (
        <DialogZyx
            open={openModal || false}
            title={t(langKeys.select_column_plural)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.save)}
            handleClickButton2={handleSaveModal}
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t(langKeys.name)}</TableCell>
                            <TableCell>{t(langKeys.key)}</TableCell>
                            <TableCell>{t(langKeys.column)}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {columnList.map((c, i) => 
                            <TableRow key={i}>
                                <TableCell>{c}</TableCell>
                                <TableCell>
                                    <input
                                        type="radio"
                                        value={c}
                                        checked={selectedColumns.primarykey === c || false}
                                        onChange={(e) => {
                                            setSelectedColumns({
                                                ...selectedColumns,
                                                primarykey: c || '',
                                                column: selectedColumns.column.map((sc, sci) => sci === i ? false : sc) || []
                                            });
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedColumns.column[i] || false}
                                        disabled={selectedColumns.primarykey === c || (!checkboxEnable && selectedColumns.column[i] === false)}
                                        onChange={(e) => {
                                            setSelectedColumns({
                                                ...selectedColumns,
                                                column: selectedColumns.column.map((sc, sci) => sci === i ? e.target.checked : sc) || []
                                            });
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogZyx>
    )
}