import React, { useEffect, useState } from 'react'; 
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DialogZyx, DialogZyx3Opt } from 'components';
import { Dictionary, ICampaign, IFetchData, MultiData, SelectedColumns } from "@types";
import TablePaginated from 'components/fields/table-paginated';
import TableZyx from '../../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCampaignMemberSel, campaignPersonSel, uploadExcel, campaignLeadPersonSel, convertLocalDate } from 'common/helpers';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { useSelector } from 'hooks';
import { getCollectionAux, getCollectionPaginatedAux } from 'store/main/actions';
import { showSnackbar } from 'store/popus/actions';
import { FrameProps } from './CampaignDetail';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

//setTemplateAux(dataMessageTemplate.find(template => template.id === data.id) || {})        


interface DetailProps {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetaildata: (data: ICampaign) => void;
    multiData: MultiData[];
    fetchData: () => void;
    frameProps: FrameProps;
    setFrameProps: (value: FrameProps) => void;
    setPageSelected: (page: number) => void;
    setSave: (value: any) => void;
    idAux: number;
    templateAux: Dictionary;
    setJsonPersons:  (value: Dictionary) => void;
}

interface TemplateAux {
    bodyvariables: { text: string; variable: number }[];
    headertype?: string;
    buttonsgeneric?: { type: string }[];
    templatetype?: string;
    carouseldata?: any[];
    header?: string;
}

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

export const CampaignPerson: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, frameProps, setFrameProps, setPageSelected, setSave, idAux, templateAux, setJsonPersons}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const auxResult = useSelector(state => state.main.mainAux);

    const [valuefile, setvaluefile] = useState('');
    const [openModal, setOpenModal] = useState<boolean | null>(null);
    const [columnList, setColumnList] = useState<string[]>([]);
    const [headers, setHeaders] = useState<any[]>(detaildata.source === 'EXTERNAL' && !detaildata.sourcechanged ? detaildata.headers || [] : []);
    const [jsonData, setJsonData] = useState<any[]>(detaildata.source === 'EXTERNAL' && !detaildata.sourcechanged ? detaildata.jsonData || [] : []);
    const [jsonDataTemp, setJsonDataTemp] = useState<any[]>([]);
    const [jsonDataPerson, setJsonDataPerson] = useState<any[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>(
        detaildata.selectedColumns
            ? detaildata.selectedColumns
            : (detaildata.fields?.primarykey || '') !== ''
                ? { ...detaildata.fields } as SelectedColumns
                : new SelectedColumns());
    const [selectedColumnsBackup, setSelectedColumnsBackup] = useState<SelectedColumns>(new SelectedColumns());
    const [selectionKey, setSelectionKey] = useState<string | any>(
        detaildata.source === 'EXTERNAL' ? selectedColumns.primarykey :
            detaildata.source === 'PERSON' ? 'personid' :
                detaildata.source === 'LEAD' ? 'leadid' :
                    'campaignmemberid')
    const [selectedRows, setSelectedRows] = useState<any>(detaildata.sourcechanged ? {} : detaildata.selectedRows || {});
    const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false);

    const fetchCampaignInternalData = (id: number) => dispatch(getCollectionAux(getCampaignMemberSel(id)));

    const paginatedAuxResult = useSelector(state => state.main.mainPaginatedAux);
    const [paginatedWait, setPaginatedWait] = useState(false);
    const [fetchDataAux, setfetchDataAux] = useState<any>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, setTotalRow] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openCleanDialog, setOpenCleanDialog] = useState(false);

    const deleteSelectedRows = () => {
        const newJsonData = jsonData.filter(row => !selectedRows[row.campaignmemberid]);    
        setJsonData(newJsonData);
        setSelectedRows({});    
        setDetaildata({
            ...detaildata,
            jsonData: newJsonData,
            selectedRows: {},
            person: detaildata.person?.filter(person => !selectedRows[person.campaignmemberid])
        });
    }

    const handleDeleteSelectedRows = () => {
        const updatedJsonData = jsonData.filter(item => !selectedRows[item.Destinatarios]);
        setJsonData(updatedJsonData);
        setSelectedRows({});
        setOpenDeleteDialog(false);
    };
  
    const handleCleanConfirmed = () => {
        deleteSelectedRows();
        setOpenDeleteDialog(false);
    };       
 
    const fetchPaginatedData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setPaginatedWait(true);
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        const requestBody = {
            startdate: daterange?.startDate || new Date(new Date().setUTCDate(1)),
            enddate: daterange?.endDate || new Date(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 0),
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: {
                ...filters,
            }
        };
        switch (detaildata.source) {
            case 'PERSON':
                dispatch(getCollectionPaginatedAux(campaignPersonSel(requestBody)))
                break;
            case 'LEAD':
                dispatch(getCollectionPaginatedAux(campaignLeadPersonSel(requestBody)))
                break;
        }
    };

    const getDownloadLink = () => {
        if (templateAux.headertype === "TEXT" && !templateAux.buttonsgeneric?.some((button: { type: string }) => button.type === "URL")) {
            return "/templates/Template Cabecera Texto y 3 variables.xlsx";
        }
    
        if (templateAux.headertype === "TEXT" && templateAux.buttonsgeneric?.some((button: { type: string }) => button.type === "URL")) {
            return "/templates/Template Cabecera Texto, 3 variables y 1 variable URL dinámica.xlsx";
        }
    
        if (
            templateAux.templatetype === "CAROUSEL" &&
            templateAux.carouseldata &&
            templateAux.carouseldata.length > 0 &&
            templateAux.buttonsgeneric &&
            templateAux.buttonsgeneric.some((button: { type: string }) => button.type === "URL")
        ) {
            return "/templates/Template Carrusel, 2 variables y 1 variable URL dinámica.xlsx";
        }
    
        if (
            templateAux.templatetype === "MULTIMEDIA" &&
            (templateAux.headertype === "VIDEO" || templateAux.headertype === "DOCUMENT") &&
            templateAux.header &&
            templateAux.header.trim() !== "" &&
            templateAux.bodyvariables &&
            templateAux.bodyvariables.length > 0
        ) {
            return "/templates/Template Cabecera Multimedia y 3 variables.xlsx";
        }
    
        return "/templates/Template Cabecera Texto, 3 variables y 1 variable URL dinámica.xlsx";
    };

    const adjustAndDownloadExcel = async (url: string) => {
        const descriptionsMap: { [key: string]: string } = {
            "Destinatarios": "|Obligatorio|Completa la lista con números celulares o e-mails, dependiendo de la plantilla a emplear, se recomienda que se coloque el código de país al número telefónico.",
            "Nombres": "|Opcional|Completa la lista con los nombres del cliente a contactar para una mayor trazabilidad, esto se verá reflejado en el reporte de \"Campañas\".",
            "Apellidos": "|Opcional|Completa la lista con los apellidos del cliente a contactar para una mayor trazabilidad, esto se verá reflejado en el reporte de \"Campañas\".",
            "Variable Adicional": "|Opcional|Puedes añadir una variable adicional que no se enviará en el cuerpo del HSM al cliente, sino que se alojará como parte de las variables que se reciban de la conversación",
            "Variable Cabecera": "|Obligatorio|Completa colocando la variable que se asignará en el template, depediendo del destinatario enviado.",
            "Variable": "|Obligatorio|Completa la lista con la variable {num} por configurar del template usado.",
            "Url dinamico": "|Obligatorio| Completa tu URL dinámico {num} para cada cliente, deberas indicar el código o sección de la url personalizado.",
            "Variable burbuja": "|Obligatorio|Completa colocando una URL que contenga el archivo multimedia (Imagen, Video, Archivo) que se procederá a configurar como cabecera del HSM, depediendo del destinatario enviado.",
            "Card imagen": "|Opcional|Completa colocando una URL que contenga el archivo multimedia (Imagen, Video, Archivo) se procederá a configurar como cabecera del card {num}, depediendo del destinatario enviado.",
            "Cabecera multimedia": "|Obligatorio|Completa colocando una URL que contenga el archivo multimedia (Imagen, Video, Archivo) que se procederá a configurar como cabecera del HSM, depediendo del destinatario enviado."
        };
    
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
    
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
    
            const sheetData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
            const columnNames: string[] = sheetData[1];
    
            const requiredVariableColumns = templateAux.bodyvariables 
                ? templateAux.bodyvariables.map((varObj: { text: string; variable: number }) => `Variable ${varObj.variable}`)
                : [];
            
            const dynamicUrlButtons = templateAux.buttonsgeneric?.filter(btn => btn.type === "URL" && btn.btn.type === "dynamic") || [];
            const dynamicUrlColumns = dynamicUrlButtons.map((btn, index) => `Url dinamico ${index + 1}`);
    
            const newColumnNames = columnNames.slice(0, 3).concat(requiredVariableColumns).concat(dynamicUrlColumns).concat("Variable Adicional 1");
            const newSheetData = [[], newColumnNames, ...sheetData.slice(2)];
    
            newColumnNames.forEach((columnName, index) => {
                let descriptionKey = columnName;
    
                if (descriptionKey.startsWith("Variable Adicional")) {
                    descriptionKey = "Variable Adicional";
                } else if (descriptionKey.startsWith("Variable")) {
                    const variableNum = columnName.split(' ')[1];
                    newSheetData[0][index] = descriptionsMap["Variable"].replace("{num}", variableNum);
                    return;
                } else if (descriptionKey.startsWith("Url dinamico")) {
                    const urlNum = columnName.split(' ')[2];
                    newSheetData[0][index] = descriptionsMap["Url dinamico"].replace("{num}", urlNum);
                    return;
                } else if (descriptionKey.startsWith("Card imagen")) {
                    const cardNum = columnName.split(' ')[2];
                    newSheetData[0][index] = descriptionsMap["Card imagen"].replace("{num}", cardNum);
                    return;
                }
    
                newSheetData[0][index] = descriptionsMap[descriptionKey] || "";
            });
    
            const newWorksheet = XLSX.utils.aoa_to_sheet(newSheetData);
            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, firstSheetName);
    
            const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'Formato de Carga.xlsx');
        } catch (error) {
            console.error("Error al ajustar y descargar el archivo Excel", error);
        }
    };

    const s2ab = (s: string) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    };
        
    console.log('El id Person es:', idAux, 'y su contenido es',templateAux)
    console.log('El json Data es', jsonData)

    
    useEffect(() => {
        if (frameProps.checkPage) {
            const valid = changeStep(frameProps.page);
            setFrameProps({ ...frameProps, executeSave: false, checkPage: false, valid: { ...frameProps.valid, 1: valid } });
            if (frameProps.page < 1 || valid) {
                setPageSelected(frameProps.page);
            }
            if (valid && frameProps.executeSave) {
                setSave('VALIDATION');
            }
        }
    }, [frameProps.checkPage])

    useEffect(() => {
        if (jsonData) {
            if (jsonData.length > 0) {
                const dataPerson = [...jsonDataPerson, ...jsonData];
                setJsonDataPerson((dataPerson || []).filter((v, i, a) => a.findIndex(v2 => (v2.personid === v.personid)) === i));
            }
            else {
                setJsonDataPerson([]);
            }
        }
        else {
            setJsonDataPerson([]);
        }
    }, [jsonData])

    useEffect(() => {
        // Load Headers
        switch (detaildata.source) {
            case 'INTERNAL':
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
                fetchCampaignInternalData(row?.id);
                break;
            case 'EXTERNAL':
                if (detaildata.operation === 'INSERT' && detaildata.sourcechanged) {
                    setHeaders([]);
                }
                break;
            case 'PERSON':
                setHeaders([
                    { Header: t(langKeys.firstname), accessor: 'firstname' },
                    { Header: t(langKeys.lastname), accessor: 'lastname' },
                    { Header: t(langKeys.documenttype), accessor: 'documenttype' },
                    { Header: t(langKeys.documentnumber), accessor: 'documentnumber' },
                    { Header: t(langKeys.personType), accessor: 'persontype' },
                    { Header: t(langKeys.type), accessor: 'type' },
                    { Header: t(langKeys.phone), accessor: 'phone' },
                    { Header: t(langKeys.alternativePhone), accessor: 'alternativephone' },
                    { Header: t(langKeys.email), accessor: 'email' },
                    { Header: t(langKeys.alternativeEmail), accessor: 'alternativeemail' },
                    {
                        Header: t(langKeys.lastContactDate), accessor: 'lastcontact', type: 'date',
                        Cell: (props: any) => {
                            const row = props.cell.row.original;
                            return convertLocalDate(row.lastcontact).toLocaleString()
                        }
                    },
                    { Header: t(langKeys.agent), accessor: 'agent' },
                    { Header: t(langKeys.opportunity), accessor: 'opportunity' },
                    { Header: t(langKeys.birthday), accessor: 'birthday', type: 'date' },
                    { Header: t(langKeys.gender), accessor: 'gender' },
                    { Header: t(langKeys.educationLevel), accessor: 'educationlevel' },
                    { Header: t(langKeys.comments), accessor: 'comments' },
                ]);
                break;
            case 'LEAD':
                setHeaders([
                    { Header: t(langKeys.opportunity), accessor: 'opportunity' },
                    {
                        Header: t(langKeys.lastUpdate), accessor: 'changedate', type: 'date',
                        Cell: (props: any) => {
                            const row = props.cell.row.original;
                            return convertLocalDate(row.changedate).toLocaleString()
                        }
                    },
                    { Header: t(langKeys.name), accessor: 'name' },
                    { Header: t(langKeys.email), accessor: 'email' },
                    { Header: t(langKeys.phone), accessor: 'phone' },
                    { Header: t(langKeys.expected_revenue), accessor: 'expected_revenue' },
                    {
                        Header: t(langKeys.endDate), accessor: 'date_deadline', type: 'date',
                        Cell: (props: any) => {
                            const row = props.cell.row.original;
                            return convertLocalDate(row.date_deadline).toLocaleString()
                        }
                    },
                    { Header: t(langKeys.tags), accessor: 'tags' },
                    { Header: t(langKeys.agent), accessor: 'agent' },
                    { Header: t(langKeys.priority), accessor: 'priority' },
                    { Header: t(langKeys.campaign), accessor: 'campaign' },
                    { Header: t(langKeys.product_plural), accessor: 'products' },
                    { Header: t(langKeys.phase), accessor: 'phase' },
                    { Header: t(langKeys.comments), accessor: 'comments' },
                ]);
                break;
        }
        // Clean selected data on source change
        if (detaildata.sourcechanged) {
            setDetaildata({ ...detaildata, sourcechanged: false, selectedRows: {}, person: [] });
        }
    }, [])

    // Internal data
    useEffect(() => {
        if (!auxResult.loading && !auxResult.error && auxResult.data.length > 0) {
            if (detaildata.source === 'INTERNAL') {
                setJsonData(auxResult.data);
                let selectedRowsTemp = {};
                if (detaildata.selectedRows) {
                    selectedRowsTemp = { ...detaildata.selectedRows };
                }
                else {
                    selectedRowsTemp = { ...auxResult.data.reduce((ad, d, i) => ({ ...ad, [d.campaignmemberid]: true }), {}) };
                }
                setSelectedRows(selectedRowsTemp)
                setDetaildata({
                    ...detaildata,
                    headers: setHeaderTableData(selectedColumns),
                    jsonData: auxResult.data,
                    selectedColumns: selectedColumns,
                    selectedRows: selectedRowsTemp,
                    person: auxResult.data.map(j =>
                        Object.keys(selectedRowsTemp).includes('' + j[selectionKey]) ? j : { ...j, status: 'ELIMINADO' }
                    )
                });
                setFrameProps({ ...frameProps, valid: { ...frameProps.valid, 1: Object.keys(selectedRowsTemp).length > 0 } });
            }
        }
    }, [auxResult]);

    // Person, Lead Data
    useEffect(() => {
        if (paginatedWait) {
            if (!paginatedAuxResult.loading && !paginatedAuxResult.error) {
                setPageCount(Math.ceil(paginatedAuxResult.count / fetchDataAux.pageSize));
                setTotalRow(paginatedAuxResult.count);
                setJsonData(paginatedAuxResult.data);
                setPaginatedWait(false);
            }
        }
    }, [paginatedAuxResult]);


    // External Data Logic //
    const handleUpload = (files: FileList | null) => {
        if (!files || files.length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: "Archivo inválido, solo se permiten archivos Excel" }));
            return;
        }

        const file = files[0];
        if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
            dispatch(showSnackbar({ show: true, severity: "error", message: "Archivo inválido, solo se permiten archivos Excel" }));
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = e.target?.result;
            if (!data) return;

            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

            let headers: string[];
            let rows: string[][];
            if (json[0][0].startsWith('|Obligatorio|') && json[1][0] === 'Destinatarios') {
                headers = json[1] as string[];
                rows = json.slice(2);
            } else if (json[0][0] === 'Destinatarios') {
                headers = json[0] as string[];
                rows = json.slice(1);
            } else {
                dispatch(showSnackbar({ show: true, severity: "error", message: "Formato de archivo incorrecto" }));
                return;
            }

            const filteredRows = rows.filter(row => {
                return headers.every((header, index) => row[index] !== undefined && row[index] !== null && row[index] !== '');
            });

            const uniqueRows: { [key: string]: boolean } = {};
            const deduplicatedRows: string[][] = [];
            let duplicatesFound = false;

            filteredRows.forEach(row => {
                const rowString = JSON.stringify(row);
                if (!uniqueRows[rowString]) {
                    uniqueRows[rowString] = true;
                    deduplicatedRows.push(row);
                } else {
                    duplicatesFound = true;
                }
            });

            if (duplicatesFound) {
                dispatch(showSnackbar({ show: true, severity: "warning", message: "Se encontraron filas duplicadas y se eliminaron." }));
            }

            const processedData = deduplicatedRows.map(row => {
                const obj: { [key: string]: any } = {};
                headers.forEach((header: string, index: number) => {
                    obj[header] = row[index];
                });
                return obj;
            });

            setJsonData(processedData);
            setJsonPersons(processedData); 

            setColumnList(headers);
            setSelectedColumns({
                primarykey: headers[0],
                columns: headers.slice(1),
            } as SelectedColumns);

            setHeaders(headers.map(c => ({
                Header: c,
                accessor: c
            })));
        };

        reader.readAsBinaryString(file);
    };
    

    const uploadData = (data: any) => {
        if (data.length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.file_without_data) }));
            return null;
        }
        if (data.length > 100000) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.too_many_records) }));
            return null;
        }
        let actualHeaders = jsonData.length > 0 ? Object.keys(jsonData[0]) : null;
        let newHeaders = Object.keys(data[0]);
        if (actualHeaders) {
            if (!actualHeaders.every(h => newHeaders?.includes(h))) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.file_incompatbile_with_previous_one) }));
                return null;
            }
        }
        // Set only new records
        setJsonDataTemp(data.filter((d: any) => jsonData.findIndex((j: any) => JSON.stringify(j) === JSON.stringify(d)) === -1));
        // Set actual headers or new headers
        let localColumnList = actualHeaders ? actualHeaders : newHeaders;
        setColumnList(localColumnList);
        // Backup of columns if user cancel modal
        setSelectedColumnsBackup({ ...selectedColumns });
        // Initialize primary key
        let localSelectedColumns = { ...selectedColumns };
        if (!localColumnList.includes(localSelectedColumns.primarykey)) {
            localSelectedColumns = { ...localSelectedColumns, primarykey: '' };
        }
        // Initialize selected column booleans
        if (selectedColumns.columns.length === 0) {
            localSelectedColumns = { ...localSelectedColumns, column: new Array(localColumnList.length).fill(false) };
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
            setSelectedColumns({ ...detaildata.fields } as SelectedColumns);
        }
        else {
            setSelectedColumns(new SelectedColumns());
        }
        setSelectedRows({});
        setDetaildata({
            ...detaildata,
            headers: [],
            jsonData: [],
            selectedColumns: (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL' && (detaildata.fields?.primarykey || '') !== '')
                ? { ...detaildata.fields } as SelectedColumns
                : new SelectedColumns(),
            selectedRows: {},
            person: []
        });
    }

    const handleCancelModal = () => {
        setSelectedColumns({ ...selectedColumnsBackup } as SelectedColumns);
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
            setSelectedColumns({ ...selectedColumns, columns: columns });
            setJsonDataTemp(
                JSON.parse(JSON.stringify(jsonDataTemp, [
                    selectedColumns.primarykey,
                    ...columns
                ]))
            )
            let jsondatadata = [
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
            ];
            setJsonData(jsondatadata);
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
                setDetaildata({ ...detaildata, message: message });
            }
            else if (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL') {
                message?.match(/({{)(.*?)(}})/g)?.forEach((c: string, i: number) => {
                    message = message?.replace(`${c}`, `{{${i + 1}}}`);
                });
                setDetaildata({ ...detaildata, message: message });
            }
            setOpenModal(false);
        }
    }

    useEffect(() => {
        if (openModal === false && selectedColumns.primarykey !== '') {
            setHeaderTableData(selectedColumns);
            setAllRowsSelected(true);
        }
    }, [openModal, selectedColumns]);

    const setHeaderTableData = (localSelectedColumns: SelectedColumns) => {
        if (localSelectedColumns.primarykey !== '') {
            const headers = [
                localSelectedColumns.primarykey,
                ...localSelectedColumns.columns
            ].map(c => ({
                Header: c,
                accessor: c
            }));
            setHeaders(headers);
            return headers;
        }
    };
    // External Data Logic //

    const changeStep = (step) => {
        if (Object.keys(selectedRows).length === 0 && step === 2) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_person_selected) }));
            return false;
        }
        switch (detaildata.source) {
            case 'INTERNAL':
                setDetaildata({
                    ...detaildata,
                    headers: setHeaderTableData(selectedColumns),
                    jsonData,
                    selectedColumns,
                    selectedRows,
                    person: jsonData.map(j => Object.keys(selectedRows).includes('' + j[selectionKey]) ? j : { ...j, status: 'ELIMINADO' })
                });
                break;
            case 'EXTERNAL':
                setDetaildata({
                    ...detaildata,
                    headers: setHeaderTableData(selectedColumns),
                    jsonData,
                    selectedColumns,
                    selectedRows,
                    person: jsonData.filter(j => Object.keys(selectedRows).includes('' + j[selectionKey]))
                });
                break;
            case 'PERSON':
                setDetaildata({
                    ...detaildata,
                    selectedRows,
                    person: Array.from(
                        new Map([
                            ...(detaildata.person || []),
                            ...jsonDataPerson
                        ].map(d => [d['personid'], d])).values()).filter(j => Object.keys(selectedRows).includes('' + j[selectionKey]))
                });
                break;
            case 'LEAD':
                setDetaildata({
                    ...detaildata,
                    selectedRows,
                    person: Array.from(
                        new Map([
                            ...(detaildata.person || []),
                            ...jsonData
                        ].map(d => [d['leadid'], d])).values()).filter(j => Object.keys(selectedRows).includes('' + j[selectionKey]))
                });
                break;
        }
        return true;
    }

    const AdditionalButtons = () => {
        if (detaildata.source === 'EXTERNAL') {
            return (
                <React.Fragment>  
                    {jsonData.length === 0 && (                
                      <>
                        <a 
                            href="#"
                            onClick={() => adjustAndDownloadExcel(getDownloadLink())}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                component="span"
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                style={{ backgroundColor: "#5AB986" }}
                            >
                                <DescriptionIcon style={{ marginRight: '4px' }} />
                                <Trans i18nKey={'Descargar Formato de Carga'} />
                            </Button>
                        </a>

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
                                style={{ backgroundColor: "#5AB986" }}
                            ><CloudUploadIcon style={{marginRight:'4px'}}/><Trans i18nKey={'Importar Base'} />
                            </Button>
                        </label>
                      </>
                        
                    )}

                    {jsonData.length > 0 && (
                        <>
                            <Button        
                                disabled={ Object.keys(selectedColumns).length === 0}        
                                variant="contained"
                                color="primary"
                                startIcon={<DeleteIcon />}
                                style={{ backgroundColor: !Object.keys(selectedRows).length ? "#e0e0e0" : "#7721ad" }}
                                onClick={() => setOpenDeleteDialog(true)}

                            >
                                {t(langKeys.delete)} 
                            </Button>

                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={() => cleanData()}
                                style={{ backgroundColor: "#53a6fa" }}
                                ><Trans i18nKey={langKeys.clean} />
                            </Button>
                        </>
                    )}      

                     <DialogZyx3Opt
                        open={openDeleteDialog}
                        title={t(langKeys.confirmation)}
                        buttonText1={t(langKeys.cancel)}                   
                        buttonText2={t(langKeys.accept)}
                        handleClickButton1={() => setOpenDeleteDialog(false)}                    
                        handleClickButton2={handleDeleteSelectedRows}
                        maxWidth={'xs'}
                    >
                        <div>{' ¿Está seguro que desea eliminar a esta(s) persona(s)?'}</div>
                        <div className="row-zyx">
                        </div>
                    </DialogZyx3Opt>


                    <DialogZyx3Opt
                        open={openCleanDialog}
                        title={t(langKeys.confirmation)}
                        buttonText1={t(langKeys.cancel)}                   
                        buttonText2={t(langKeys.accept)}
                        handleClickButton1={() => setOpenCleanDialog(false)}
                        handleClickButton2={handleCleanConfirmed}
                        maxWidth={'xs'}
                    >
                        <div>{' ¿Está seguro que desea eliminar toda la tabla?'}</div>
                        <div className="row-zyx">
                        </div>
                    </DialogZyx3Opt>                 

                </React.Fragment>
            )
        }
        else {
            return <>
                <span>{t(langKeys.selected_plural)}: </span><b>{Object.keys(selectedRows).length}</b>
            </>
        }
    }

    return (
        <React.Fragment>
            <div className={classes.containerDetail}>
                {
                    ['PERSON', 'LEAD'].includes(detaildata?.source || '') ?
                        <TablePaginated
                            columns={headers}
                            data={jsonData}
                            totalrow={totalrow}
                            pageCount={pageCount}
                            loading={paginatedAuxResult.loading}
                            filterrange={true}
                            FiltersElement={<></>}
                            ButtonsElement={() => <>
                                <span>{t(langKeys.selected_plural)}: </span><b>{Object.keys(selectedRows).length}</b>
                            </>}
                            fetchData={fetchPaginatedData}
                            useSelection={true}
                            selectionKey={selectionKey}
                            initialSelectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                            allRowsSelected={allRowsSelected}
                            setAllRowsSelected={setAllRowsSelected}
                        />
                        :
                        <TableZyx
                            titlemodule=" "
                            columns={headers}
                            data={jsonData}
                            download={false}
                            loading={detaildata.source === 'INTERNAL' && auxResult.loading}
                            filterGeneral={true}
                            ButtonsElement={AdditionalButtons}
                            useSelection={true}
                            selectionKey={selectionKey}
                            initialSelectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                            allRowsSelected={allRowsSelected}
                            setAllRowsSelected={setAllRowsSelected}
                        />
                }

            </div>
          
        </React.Fragment>
    )
}