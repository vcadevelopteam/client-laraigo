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

interface DetailProps {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetailData: (data: any) => void;
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
    
    const auxResult = useSelector(state => state.main.multiDataAux);

    const [valuefile, setvaluefile] = useState('');
    const [openModal, setOpenModal] = useState(false);
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
    const [selection, setSelection] = useState<string[]>(detaildata.selection || []);

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
        }
    }, [detaildata]);

    useEffect(() => {
        if (!auxResult.loading && !auxResult.error
            && row !== null && detaildata.source === 'INTERNAL') {
            setJsonData(auxResult.data[0] as any);
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
            alert('Archivo sin data!');
            return null;
        }
        if (data.length > 100000) {
            alert('Archivo con demasiados registros!');
            return null;
        }
        let actualHeaders = jsonData.length > 0 ? Object.keys(jsonData[0]) : null;
        let newHeaders = Object.keys(data[0]);
        if (actualHeaders) {
            if (actualHeaders.length !== newHeaders.length) {
                alert('Archivo incompatible con el anterior!');
                return null;
            }
            if (!newHeaders.every(h => actualHeaders?.includes(h))) {
                alert('Archivo incompatible con el anterior!');
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
        setSelection([]);
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
        setHeaderTableData(selectedColumns);
    }, [openModal])

    const setHeaderTableData = (localSelectedColumns: SelectedColumns) => {
        if (openModal === false && selectedColumns.primarykey !== '') {
            setHeaders([
                localSelectedColumns.primarykey,
                ...localSelectedColumns.columns
            ].map(c => {
                return {
                    Header: c,
                    accessor: c
                }
            }));
        }
    }

    const changeStep = (step: string) => {
        if (detaildata.operation === 'INSERT' && detaildata.source === 'INTERNAL') {
            setDetailData({
                ...detaildata,
                headers: setHeaderTableData(selectedColumns),
                jsonData: jsonData,
                selectedColumns: selectedColumns,
                selection: selection,
                person: jsonData
            });
        }
        else if (detaildata.operation === 'UPDATE' && detaildata.source === 'INTERNAL') {
            // Cuando se use el seleccion, se updatea el status de cada person a ELIMINADO
            setDetailData({
                ...detaildata,
                headers: setHeaderTableData(selectedColumns),
                jsonData: jsonData,
                selectedColumns: selectedColumns,
                selection: selection,
                person: jsonData
            });
        }
        else if (detaildata.source === 'EXTERNAL') {
            // Cuando se use el seleccion, se updatea el status de cada person a ELIMINADO
            setDetailData({
                ...detaildata,
                headers: setHeaderTableData(selectedColumns),
                jsonData: jsonData,
                selectedColumns: selectedColumns,
                selection: selection,
                person: jsonData
            });
        }
        setStep(step);
    }

    const AdditionalButtons = () => {
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
                        style={{ backgroundColor: "#ea2e49" }}
                    ><Trans i18nKey={langKeys.uploadFile} />
                    </Button>
                </label> 
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => cleanData()}
                    style={{ backgroundColor: "#22b66e" }}
                ><Trans i18nKey={langKeys.clean} />
                </Button>
            </React.Fragment>
        )
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
                    filterGeneral={false}
                    ButtonsElement={AdditionalButtons}
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
    openModal: boolean;
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
            open={openModal}
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