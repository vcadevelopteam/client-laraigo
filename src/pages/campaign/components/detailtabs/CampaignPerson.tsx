import React, { useEffect, useState } from 'react'; 
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DialogZyx3Opt } from 'components';
import { Dictionary, IFetchData, SelectedColumns } from "@types";
import TablePaginated from 'components/fields/table-paginated';
import TableZyx from '../../../../components/fields/table-simple';
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCampaignMemberSel, campaignPersonSel, campaignLeadPersonSel, convertLocalDate, uploadExcelCampaign } from 'common/helpers';
import { useSelector } from 'hooks';
import { getCollectionAux, getCollectionPaginatedAux } from 'store/main/actions';
import { showSnackbar } from 'store/popus/actions';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DetailPropsTabPerson } from 'pages/campaign/model';
import { campaignPersonStyles } from 'pages/campaign/styles';

export const CampaignPerson: React.FC<DetailPropsTabPerson> = ({ row, detaildata, setDetaildata, multiData, frameProps, setFrameProps, setPageSelected, setSave, templateAux, setJsonPersons }) => {
    const classes = campaignPersonStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const auxResult = useSelector(state => state.main.mainAux);
    const [openModal, setOpenModal] = useState<boolean | null>(null);
    const [columnList, setColumnList] = useState<string[]>([]);
    const [headers, setHeaders] = useState<any[]>(detaildata.source === 'EXTERNAL' && !detaildata.sourcechanged ? detaildata.headers || [] : []);
    const [jsonData, setJsonData] = useState<any[]>(detaildata.source === 'EXTERNAL' && !detaildata.sourcechanged ? detaildata.jsonData || [] : []);
    const [jsonDataPerson, setJsonDataPerson] = useState<any[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>(
        detaildata.selectedColumns
            ? detaildata.selectedColumns
            : (detaildata.fields?.primarykey || '') !== ''
                ? { ...detaildata.fields } as SelectedColumns
                : new SelectedColumns());
    const [selectionKey, setSelectionKey] = useState<string | any>('')
    const [selectedRows, setSelectedRows] = useState<any>(detaildata.sourcechanged ? {} : detaildata.selectedRows || {});
    const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false);
    const fetchCampaignInternalData = (id: number) => dispatch(getCollectionAux(getCampaignMemberSel(id)));
    const [fileKey, setFileKey] = useState(Date.now());
    const paginatedAuxResult = useSelector(state => state.main.mainPaginatedAux);
    const [paginatedWait, setPaginatedWait] = useState(false);
    const [fetchDataAux, setfetchDataAux] = useState<any>({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, setTotalRow] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openCleanDialog, setOpenCleanDialog] = useState(false);
    const messagetemplateName = multiData?.[4]?.data?.[0]?.messagetemplatename;
    const matchedTemplate = multiData[3].data.find(item => item.name === messagetemplateName); 
    const [currentTemplateAux, setCurrentTemplateAux] = useState<Dictionary>({});

    useEffect(() => {
      if (Object.keys(templateAux).length === 0 && matchedTemplate) {
        setCurrentTemplateAux(matchedTemplate);
      } else {
        setCurrentTemplateAux(templateAux);
      }
    }, [templateAux, matchedTemplate]);     

    const handleDeleteSelectedRows = () => {
        const updatedJsonData = jsonData.filter((item, index) => !selectedRows[index]) || [];
        setJsonData(updatedJsonData); 
        setSelectedRows({});
        setOpenDeleteDialog(false);
    
        setDetaildata({
            ...detaildata,
            jsonData: updatedJsonData,
            selectedRows: {},
            person: detaildata.person?.filter(person => !selectedRows[person[selectionKey]])
        });

        setTimeout(() => {
            setJsonData([...updatedJsonData]);
        }, 0);
    };

    const deleteSelectedRows = () => {
        const updatedJsonData = jsonData.filter(row => !selectedRows[row[selectionKey]]);    
        setJsonData([...updatedJsonData]);
        setSelectedRows({});  
    
        setDetaildata({
            ...detaildata,
            jsonData: updatedJsonData,
            selectedRows: {},
            person: detaildata.person?.filter(person => !selectedRows[person[selectionKey]])
        });
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
        if (currentTemplateAux.headertype === "TEXT" && !currentTemplateAux.buttonsgeneric?.some((button: { type: string }) => button.type === "URL")) {
            return "/templates/Template Cabecera Texto y 3 variables.xlsx";
        }    
        if (currentTemplateAux.headertype === "TEXT" && currentTemplateAux.buttonsgeneric?.some((button: { type: string }) => button.type === "URL")) {
            return "/templates/Template Cabecera Texto, 3 variables y 1 variable URL dinámica.xlsx";
        }
    
        if (
            currentTemplateAux.templatetype === "CAROUSEL" &&
            currentTemplateAux.carouseldata &&
            currentTemplateAux.carouseldata.length > 0 &&
            currentTemplateAux.buttonsgeneric &&
            currentTemplateAux.buttonsgeneric.some((button: { type: string }) => button.type === "URL")
        ) {
            return "/templates/Template Carrusel, 2 variables y 1 variable URL dinámica.xlsx";
        }    
        if (
            currentTemplateAux.templatetype === "MULTIMEDIA" &&
            (currentTemplateAux.headertype === "VIDEO" || currentTemplateAux.headertype === "DOCUMENT") &&
            currentTemplateAux.header &&
            currentTemplateAux.header.trim() !== "" &&
            currentTemplateAux.bodyvariables &&
            currentTemplateAux.bodyvariables.length > 0
        ) {
            return "/templates/Template Cabecera Multimedia y 3 variables.xlsx";
        }
    
        return "/templates/Template Cabecera Texto, 3 variables y 1 variable URL dinámica.xlsx";
    };

    const adjustAndDownloadExcel = async (url: string) => {
        const descriptionsMap: { [key: string]: string } = {
            "Destinatarios": "|Obligatorio|Completa la lista con números celulares o e-mails, dependiendo de la plantilla a emplear, se recomienda que se coloque el código de país al número telefónico. Ejemplo: Celular: 51999999999 o también E-mail: laraigo@vcaperu.com",
            "Nombres": "|Opcional|Completa la lista con los nombres del cliente a contactar para una mayor trazabilidad, esto se verá reflejado en el reporte de \"Campañas\". Nota: No alteres el valor del titulo de la columna, ya que se asigna automáticamente.",
            "Apellidos": "|Opcional|Completa la lista con los apellidos del cliente a contactar para una mayor trazabilidad, esto se verá reflejado en el reporte de \"Campañas\". Nota: No alteres el valor del titulo de la columna, ya que se asigna automáticamente.",
            "Variable Adicional": "|Opcional|Puedes añadir una variable adicional que no se enviará en el cuerpo del HSM al cliente, sino que se alojará como parte de las variables que se reciban de la conversación. Nota: También puedes cambiar el nombre de la columna o eliminar dicha columna, para usar esta variable dentro de un flujo o reporte usa la variable \"variable_hidden_{num}\"",
            "Variable": "|Obligatorio|Completa la lista con la variable {num} por configurar del template usado. Nota: Se puede cambiar el nombre del titulo de la columna para un mejor entendimiento según el caso.",
            "Url Dinamico": "|Obligatorio| Completa tu URL dinámico {num} para cada cliente, deberas indicar el código o sección de la url personalizado. Ejemplo: JK589kl",
            "Card Imagen": "|Opcional|Completa colocando una URL que contenga el archivo multimedia (Imagen, Video, Archivo) se procederá a configurar como cabecera del card {num}, depediendo del destinatario enviado. Nota: Por defecto traerá la imagen que se mandó a aprobar con la plantilla si no se configura esta columna.",
            "Cabecera Multimedia": "|Obligatorio|Completa colocando una URL que contenga el archivo multimedia (Imagen, Video, Archivo) que se procederá a configurar como cabecera del HSM, depediendo del destinatario enviado."
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
            const bodyVariables = currentTemplateAux.body ? currentTemplateAux.body.match(/{{\d+}}/g) || [] : [];
            const requiredVariableColumns = bodyVariables.map((_, index) => `Variable ${index + 1}`);
            
            const headerVariableColumns = currentTemplateAux.headertype === "TEXT" && currentTemplateAux.headervariables
                ? currentTemplateAux.headervariables.map((_, index) => `Variable Cabecera ${index + 1}`)
                : [];
            
            const headerMultimediaColumns = currentTemplateAux.headertype === "DOCUMENT" || currentTemplateAux.headertype === "VIDEO" || currentTemplateAux.headertype === "IMAGE"
                ? ["Cabecera Multimedia"]
                : [];
            
            const dynamicUrlButtons = currentTemplateAux.buttonsgeneric?.filter(btn => btn.type === "URL" && btn.btn.type === "dynamic") || [];
            const dynamicUrlColumns = dynamicUrlButtons.map((btn, index) => `Url Dinamico ${index + 1}`);
            
            const imageCards = currentTemplateAux.carouseldata || [];
            const carouselVariableColumns = imageCards.reduce((acc, card, cardIndex) => {
                const cardVariables = card.body.match(/{{\d+}}/g) || [];
                return acc.concat(cardVariables.map((_, varIndex) => `Card ${cardIndex + 1} - Variable ${varIndex + 1}`));
            }, [] as string[]);
            
            const imageCardColumns = imageCards.map((card, index) => card.header ? `Card ${index + 1} - Imagen` : '').filter(Boolean);
            
            const carouselDynamicUrlColumns = imageCards.reduce((acc, card, cardIndex) => {
                const dynamicButtons = card.buttons?.filter(button => button.btn.type === 'dynamic') || [];
                return acc.concat(dynamicButtons.map((_, btnIndex) => `Card ${cardIndex + 1} - Url Dinamico ${btnIndex + 1}`));
            }, [] as string[]);
            
            let newColumnNames = columnNames.slice(0, 3)
                .concat(headerVariableColumns)
                .concat(headerMultimediaColumns)
                .concat(requiredVariableColumns)
                .concat(carouselVariableColumns)
                .concat(dynamicUrlColumns)
                .concat(carouselDynamicUrlColumns)
                .concat(imageCardColumns);
            
            if (currentTemplateAux.category === "AUTHENTICATION") {
                newColumnNames.push("Variable 1");
            }
            
            newColumnNames = newColumnNames.concat("Variable Adicional 1");                    
            const newSheetData = [[], newColumnNames, ...sheetData.slice(2)];    
            newColumnNames.forEach((columnName, index) => {
                let descriptionKey = columnName;
                if (descriptionKey.startsWith("Variable Adicional")) {
                    descriptionKey = "Variable Adicional";
                } else if (descriptionKey.startsWith("Variable")) {
                    const variableNum = descriptionKey.split(' ')[1];
                    newSheetData[0][index] = descriptionsMap["Variable"].replace("{num}", variableNum);
                    return;
                } else if (descriptionKey.startsWith("Url Dinamico")) {
                    const urlNum = columnName.split(' ')[2];
                    newSheetData[0][index] = descriptionsMap["Url Dinamico"].replace("{num}", urlNum);
                    return;
                } else if (descriptionKey.startsWith("Card")) {
                    if (descriptionKey.includes("Imagen")) {
                        const cardNum = columnName.split(' ')[1];
                        newSheetData[0][index] = descriptionsMap["Card Imagen"].replace("{num}", cardNum);
                    } else {
                        const cardNum = columnName.split(' ')[1];
                        const varNum = columnName.split(' ')[4];
                        newSheetData[0][index] = descriptionsMap["Variable"].replace("{num}", `${varNum} (card ${cardNum})`);
                    }
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
                    { Header: 'Destinatario', accessor: 'personcommunicationchannelowner' },
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
            setSelectionKey(
                detaildata.source === 'EXTERNAL' ? selectedColumns.primarykey :
                    detaildata.source === 'PERSON' ? 'personid' :
                        detaildata.source === 'LEAD' ? 'leadid' :
                            'campaignmemberid')
            setJsonData([])
            setJsonDataPerson([])
            setDetaildata({ ...detaildata, sourcechanged: false, selectedRows: {}, person: [] });
        }
    }, [detaildata.source])

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
                setJsonPersons(paginatedAuxResult.data)
                setPaginatedWait(false);
            }
        }
    }, [paginatedAuxResult]);

    // External Data Logic //
    const handleUpload = async (files: any) => {
        const file = files[0];
        setFileKey(Date.now());

        const data = await uploadExcelCampaign(file, dispatch, showSnackbar);
        if (data) {
            uploadData(data);
        }
    };

    const detectPrimaryKeyIndex = (data: any[]): number => {
        if (data.length === 0) return 0;
    
        const firstRow = data[0];
        const keys = Object.keys(firstRow);
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d+$/;
    
        for (let i = 0; i < keys.length; i++) {
            const value = firstRow[keys[i]];
            if (emailRegex.test(value) || phoneRegex.test(value)) {
                return i;
            }
        }
    
        return 0;
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
    
        const actualHeaders = jsonData.length > 0 ? Object.keys(jsonData[0]) : null;
        const newHeaders = Object.keys(data[0]);
        if (actualHeaders) {
            if (!actualHeaders.every(h => newHeaders?.includes(h))) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.file_incompatbile_with_previous_one) }));
                return null;
            }
        }    
    
        const localColumnList = actualHeaders ? actualHeaders : newHeaders;
        setColumnList(localColumnList);    
        
        const primarykeyIndex = detectPrimaryKeyIndex(data);         
        const primarykey = localColumnList[primarykeyIndex];
        const columns = localColumnList.filter((_, index) => index !== primarykeyIndex);

        const localSelectedColumns = {
            primarykey,
            column: columns.map(() => true),
            columns: columns
        };
        
        setSelectedColumns(localSelectedColumns);
        setJsonData(data);
        setJsonPersons(data);

    
        setHeaders(localColumnList.map(c => ({
            Header: c,
            accessor: c
        })));
    
        setDetaildata({
            ...detaildata,
            headers: localColumnList.map(c => ({
                Header: c,
                accessor: c
            })),
            jsonData: data,
            selectedColumns: localSelectedColumns,
        });
    };   

    const transformData = (data: Dictionary, headers: Dictionary): Dictionary[] => {
        return data.map(item => {
            const transformedItem = { ...item }; 
    
            headers.forEach((header: Dictionary, index: number) => {
                const accessor = header.accessor;
                if (accessor === "Destinatarios") {
                    transformedItem[accessor] = item.personcommunicationchannelowner || '';
                } else if (accessor === "Nombres") {
                    transformedItem[accessor] = item.field2 || '';
                } else if (accessor === "Apellidos") {
                    transformedItem[accessor] = item.field3 || '';
                } else {
                    const fieldNumber = `field${index + 1}`;
                    transformedItem[accessor] = item[fieldNumber] || '';
                }
            });
    
            return transformedItem;
        });
    };    
    
    const transformHeadersToColumns = (headers: any[]): any[] => {
        return headers.map(header => ({
            Header: header.Header,
            accessor: header.accessor,           
            width: "auto"
        }));
    };

    const transformedData = transformData(jsonData, headers);
    const columns = React.useMemo(() => transformHeadersToColumns(headers), [headers]);
    const isEmptyData = (data: any[]) => {
        return data.every(item => Object.values(item).every(value => value === ''));
    };
    const personsToUse = isEmptyData(transformedData) ? jsonData : transformedData;
    
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

    useEffect(() => {
        const updatedFields = {
            ...selectedColumns,
            campaignvariables: detaildata.fields?.campaignvariables || {},
            allVariables: detaildata.fields?.allVariables || {} 
        };
        setSelectedColumns(updatedFields);
    }, [detaildata.fields]);

    // External Data Logic //
    const changeStep = (step: number) => {    
        
        if (jsonData.length === 0 || (Object.keys(selectedRows).length === 0 && (detaildata.source === 'LEAD' || detaildata.source === 'PERSON' ) ) ) {
            if (step === 2) {
                dispatch(showSnackbar({ show: true, severity: "error", message: 'Debe seleccionar Personas' }));
            }
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
                    person: jsonData.map(j => Object.keys(selectedRows).includes('' + j[selectionKey]) ? j : j)
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

    return (
            <div className={classes.containerDetail}>
                {
                    ['PERSON', 'LEAD'].includes(detaildata?.source || '') ?
                        <TablePaginated
                            columns={headers}
                            data={jsonData}
                            totalrow={totalrow}
                            pageCount={pageCount}
                            filterGeneral={false}                            
                            loading={paginatedAuxResult.loading}
                            FiltersElement={<></>}
                            ButtonsElement={() => 
                                <> <span>{t(langKeys.selected_plural)}: </span><b>{Object.keys(selectedRows).length}</b> </>
                            }
                            fetchData={fetchPaginatedData}
                            useSelection={true}
                            selectionKey={selectionKey}
                            initialSelectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                            allRowsSelected={allRowsSelected}
                            setAllRowsSelected={setAllRowsSelected}
                        />
                        :

                        <>
                            {(detaildata.source === 'EXTERNAL' || detaildata.source === 'INTERNAL') && (
                                <React.Fragment>
                                    {jsonData.length === 0 && (
                                        <div style={{display:'flex', gap:'1rem', justifyContent:'right'}}>
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
                                                key={fileKey}
                                                name="file"
                                                type="file"
                                                accept=".xls,.xlsx"
                                                // value={valuefile}
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
                                                ><CloudUploadIcon style={{ marginRight: '4px' }} /><Trans i18nKey={'Importar Base'} />
                                                </Button>
                                            </label>
                                        </div>
                                    )}
                        
                                    {jsonData.length > 0 && (
                                        <div style={{display:'flex', gap:'1rem', justifyContent:'right'}}>
                                            <Button
                                                disabled={Object.keys(selectedColumns).length === 0}
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
                                        </div>
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
                            )}
                        
                            <TableZyx
                                titlemodule=" "
                                columns={columns}
                                data={jsonData.some(item => item.type === "EXTERNAL") ? personsToUse : jsonData}
                                download={false}
                                loading={detaildata.source === 'INTERNAL' && auxResult.loading}
                                filterGeneral={false}
                                useSelection={true}
                                selectionKey={selectionKey}
                                initialSelectedRows={selectedRows}
                                setSelectedRows={setSelectedRows}
                                allRowsSelected={allRowsSelected}
                                setAllRowsSelected={setAllRowsSelected}
                            />
                        </>                 
                }
            </div>          
    )
}