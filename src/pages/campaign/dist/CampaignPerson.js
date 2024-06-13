"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.CampaignPerson = void 0;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var Button_1 = require("@material-ui/core/Button");
var components_1 = require("components");
var _types_1 = require("@types");
var table_paginated_1 = require("components/fields/table-paginated");
var table_simple_1 = require("../../components/fields/table-simple");
var styles_1 = require("@material-ui/core/styles");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var helpers_1 = require("common/helpers");
var hooks_1 = require("hooks");
var actions_1 = require("store/main/actions");
var actions_2 = require("store/popus/actions");
var CloudUpload_1 = require("@material-ui/icons/CloudUpload");
var Description_1 = require("@material-ui/icons/Description");
var Delete_1 = require("@material-ui/icons/Delete");
var XLSX = require("xlsx");
var file_saver_1 = require("file-saver");
var useStyles = styles_1.makeStyles(function (theme) { return ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff'
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
}); });
exports.CampaignPerson = function (_a) {
    var _b;
    var row = _a.row, edit = _a.edit, auxdata = _a.auxdata, detaildata = _a.detaildata, setDetaildata = _a.setDetaildata, multiData = _a.multiData, fetchData = _a.fetchData, frameProps = _a.frameProps, setFrameProps = _a.setFrameProps, setPageSelected = _a.setPageSelected, setSave = _a.setSave, idAux = _a.idAux, templateAux = _a.templateAux, setJsonPersons = _a.setJsonPersons;
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var auxResult = hooks_1.useSelector(function (state) { return state.main.mainAux; });
    var _c = react_1.useState(''), valuefile = _c[0], setvaluefile = _c[1];
    var _d = react_1.useState(null), openModal = _d[0], setOpenModal = _d[1];
    var _e = react_1.useState([]), columnList = _e[0], setColumnList = _e[1];
    var _f = react_1.useState(detaildata.source === 'EXTERNAL' && !detaildata.sourcechanged ? detaildata.headers || [] : []), headers = _f[0], setHeaders = _f[1];
    var _g = react_1.useState(detaildata.source === 'EXTERNAL' && !detaildata.sourcechanged ? detaildata.jsonData || [] : []), jsonData = _g[0], setJsonData = _g[1];
    var _h = react_1.useState([]), jsonDataTemp = _h[0], setJsonDataTemp = _h[1];
    var _j = react_1.useState([]), jsonDataPerson = _j[0], setJsonDataPerson = _j[1];
    var _k = react_1.useState(detaildata.selectedColumns
        ? detaildata.selectedColumns
        : (((_b = detaildata.fields) === null || _b === void 0 ? void 0 : _b.primarykey) || '') !== ''
            ? __assign({}, detaildata.fields)
            : new _types_1.SelectedColumns()), selectedColumns = _k[0], setSelectedColumns = _k[1];
    var _l = react_1.useState(new _types_1.SelectedColumns()), selectedColumnsBackup = _l[0], setSelectedColumnsBackup = _l[1];
    var _m = react_1.useState(detaildata.source === 'EXTERNAL' ? selectedColumns.primarykey :
        detaildata.source === 'PERSON' ? 'personid' :
            detaildata.source === 'LEAD' ? 'leadid' :
                'campaignmemberid'), selectionKey = _m[0], setSelectionKey = _m[1];
    var _o = react_1.useState(detaildata.sourcechanged ? {} : detaildata.selectedRows || {}), selectedRows = _o[0], setSelectedRows = _o[1];
    var _p = react_1.useState(false), allRowsSelected = _p[0], setAllRowsSelected = _p[1];
    var fetchCampaignInternalData = function (id) { return dispatch(actions_1.getCollectionAux(helpers_1.getCampaignMemberSel(id))); };
    var paginatedAuxResult = hooks_1.useSelector(function (state) { return state.main.mainPaginatedAux; });
    var _q = react_1.useState(false), paginatedWait = _q[0], setPaginatedWait = _q[1];
    var _r = react_1.useState({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null }), fetchDataAux = _r[0], setfetchDataAux = _r[1];
    var _s = react_1.useState(0), pageCount = _s[0], setPageCount = _s[1];
    var _t = react_1.useState(0), totalrow = _t[0], setTotalRow = _t[1];
    var _u = react_1.useState(false), openDeleteDialog = _u[0], setOpenDeleteDialog = _u[1];
    var _v = react_1.useState(false), openCleanDialog = _v[0], setOpenCleanDialog = _v[1];
    var handleDeleteSelectedRows = function () {
        var _a;
        var updatedJsonData = jsonData.filter(function (item) { return !selectedRows[item[selectionKey]]; });
        setJsonData(updatedJsonData);
        setSelectedRows({});
        setOpenDeleteDialog(false);
        setDetaildata(__assign(__assign({}, detaildata), { jsonData: updatedJsonData, selectedRows: {}, person: (_a = detaildata.person) === null || _a === void 0 ? void 0 : _a.filter(function (person) { return !selectedRows[person[selectionKey]]; }) }));
        setTimeout(function () {
            setJsonData(__spreadArrays(updatedJsonData));
        }, 0);
    };
    var deleteSelectedRows = function () {
        var _a;
        var updatedJsonData = jsonData.filter(function (row) { return !selectedRows[row[selectionKey]]; });
        setJsonData(__spreadArrays(updatedJsonData));
        setSelectedRows({});
        setDetaildata(__assign(__assign({}, detaildata), { jsonData: updatedJsonData, selectedRows: {}, person: (_a = detaildata.person) === null || _a === void 0 ? void 0 : _a.filter(function (person) { return !selectedRows[person[selectionKey]]; }) }));
    };
    var handleCleanConfirmed = function () {
        deleteSelectedRows();
        setOpenDeleteDialog(false);
    };
    var fetchPaginatedData = function (_a) {
        var pageSize = _a.pageSize, pageIndex = _a.pageIndex, filters = _a.filters, sorts = _a.sorts, daterange = _a.daterange;
        setPaginatedWait(true);
        setfetchDataAux({ pageSize: pageSize, pageIndex: pageIndex, filters: filters, sorts: sorts, daterange: daterange });
        var requestBody = {
            startdate: (daterange === null || daterange === void 0 ? void 0 : daterange.startDate) || new Date(new Date().setUTCDate(1)),
            enddate: (daterange === null || daterange === void 0 ? void 0 : daterange.endDate) || new Date(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 0),
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: __assign({}, filters)
        };
        switch (detaildata.source) {
            case 'PERSON':
                dispatch(actions_1.getCollectionPaginatedAux(helpers_1.campaignPersonSel(requestBody)));
                break;
            case 'LEAD':
                dispatch(actions_1.getCollectionPaginatedAux(helpers_1.campaignLeadPersonSel(requestBody)));
                break;
        }
    };
    var getDownloadLink = function () {
        var _a, _b;
        if (templateAux.headertype === "TEXT" && !((_a = templateAux.buttonsgeneric) === null || _a === void 0 ? void 0 : _a.some(function (button) { return button.type === "URL"; }))) {
            return "/templates/Template Cabecera Texto y 3 variables.xlsx";
        }
        if (templateAux.headertype === "TEXT" && ((_b = templateAux.buttonsgeneric) === null || _b === void 0 ? void 0 : _b.some(function (button) { return button.type === "URL"; }))) {
            return "/templates/Template Cabecera Texto, 3 variables y 1 variable URL dinámica.xlsx";
        }
        if (templateAux.templatetype === "CAROUSEL" &&
            templateAux.carouseldata &&
            templateAux.carouseldata.length > 0 &&
            templateAux.buttonsgeneric &&
            templateAux.buttonsgeneric.some(function (button) { return button.type === "URL"; })) {
            return "/templates/Template Carrusel, 2 variables y 1 variable URL dinámica.xlsx";
        }
        if (templateAux.templatetype === "MULTIMEDIA" &&
            (templateAux.headertype === "VIDEO" || templateAux.headertype === "DOCUMENT") &&
            templateAux.header &&
            templateAux.header.trim() !== "" &&
            templateAux.bodyvariables &&
            templateAux.bodyvariables.length > 0) {
            return "/templates/Template Cabecera Multimedia y 3 variables.xlsx";
        }
        return "/templates/Template Cabecera Texto, 3 variables y 1 variable URL dinámica.xlsx";
    };
    console.log('Nuestro jsonData', jsonData);
    var adjustAndDownloadExcel = function (url) { return __awaiter(void 0, void 0, void 0, function () {
        var descriptionsMap, response, arrayBuffer, data, workbook, firstSheetName, worksheet, sheetData, columnNames, variableCounter_1, bodyVariables, requiredVariableColumns, headerVariableColumns, headerMultimediaColumns, dynamicUrlButtons, dynamicUrlColumns, imageCards, carouselVariableColumns, imageCardColumns, carouselDynamicUrlColumns, newColumnNames, newSheetData_1, newWorksheet, newWorkbook, wbout, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    descriptionsMap = {
                        "Destinatarios": "|Obligatorio|Completa la lista con números celulares o e-mails, dependiendo de la plantilla a emplear, se recomienda que se coloque el código de país al número telefónico. Ejemplo: Celular: 51999999999 o también E-mail: laraigo@vcaperu.com",
                        "Nombres": "|Opcional|Completa la lista con los nombres del cliente a contactar para una mayor trazabilidad, esto se verá reflejado en el reporte de \"Campañas\". Nota: No alteres el valor del titulo de la columna, ya que se asigna automáticamente.",
                        "Apellidos": "|Opcional|Completa la lista con los apellidos del cliente a contactar para una mayor trazabilidad, esto se verá reflejado en el reporte de \"Campañas\". Nota: No alteres el valor del titulo de la columna, ya que se asigna automáticamente.",
                        "Variable Adicional": "|Opcional|Puedes añadir una variable adicional que no se enviará en el cuerpo del HSM al cliente, sino que se alojará como parte de las variables que se reciban de la conversación. Nota: También puedes cambiar el nombre de la columna o eliminar dicha columna, para usar esta variable dentro de un flujo o reporte usa la variable \"variable_hidden_{num}\"",
                        "Variable Cabecera": "|Obligatorio|Completa colocando la variable que se asignará en el template, depediendo del destinatario enviado. Ejemplo: Marcos",
                        "Variable": "|Obligatorio|Completa la lista con la variable {num} por configurar del template usado. Nota: Se puede cambiar el nombre del titulo de la columna para un mejor entendimiento según el caso.",
                        "Url Dinamico": "|Obligatorio| Completa tu URL dinámico {num} para cada cliente, deberas indicar el código o sección de la url personalizado. Ejemplo: JK589kl",
                        "Variable burbuja": "|Obligatorio|Completa colocando una URL que contenga el archivo multimedia (Imagen, Video, Archivo) que se procederá a configurar como cabecera del HSM, depediendo del destinatario enviado.",
                        "Card Imagen": "|Opcional|Completa colocando una URL que contenga el archivo multimedia (Imagen, Video, Archivo) se procederá a configurar como cabecera del card {num}, depediendo del destinatario enviado. Nota: Por defecto traerá la imagen que se mandó a aprobar con la plantilla si no se configura esta columna.",
                        "Cabecera Multimedia": "|Obligatorio|Completa colocando una URL que contenga el archivo multimedia (Imagen, Video, Archivo) que se procederá a configurar como cabecera del HSM, depediendo del destinatario enviado."
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.arrayBuffer()];
                case 3:
                    arrayBuffer = _b.sent();
                    data = new Uint8Array(arrayBuffer);
                    workbook = XLSX.read(data, { type: 'array' });
                    firstSheetName = workbook.SheetNames[0];
                    worksheet = workbook.Sheets[firstSheetName];
                    sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    columnNames = sheetData[1];
                    variableCounter_1 = 1;
                    bodyVariables = templateAux.body.match(/{{\d+}}/g) || [];
                    requiredVariableColumns = bodyVariables.map(function (_, index) { return "Variable " + (index + 1); });
                    variableCounter_1 += bodyVariables.length;
                    headerVariableColumns = templateAux.headertype === "TEXT" && templateAux.headervariables
                        ? templateAux.headervariables.map(function (_, index) { return "Variable Cabecera " + (index + 1); })
                        : [];
                    headerMultimediaColumns = templateAux.headertype === "DOCUMENT" || templateAux.headertype === "VIDEO" || templateAux.headertype === "IMAGE"
                        ? ["Cabecera Multimedia"]
                        : [];
                    dynamicUrlButtons = ((_a = templateAux.buttonsgeneric) === null || _a === void 0 ? void 0 : _a.filter(function (btn) { return btn.type === "URL" && btn.btn.type === "dynamic"; })) || [];
                    dynamicUrlColumns = dynamicUrlButtons.map(function (btn, index) { return "Url Dinamico " + (index + 1); });
                    imageCards = templateAux.carouseldata || [];
                    carouselVariableColumns = imageCards.reduce(function (acc, card) {
                        var cardVariables = card.body.match(/{{\d+}}/g) || [];
                        return acc.concat(cardVariables.map(function () { return "Variable " + variableCounter_1++; }));
                    }, []);
                    imageCardColumns = imageCards.map(function (card, index) { return card.header ? "Card Imagen " + (index + 1) : ''; }).filter(Boolean);
                    carouselDynamicUrlColumns = imageCards.reduce(function (acc, card) {
                        var _a;
                        var dynamicButtons = ((_a = card.buttons) === null || _a === void 0 ? void 0 : _a.filter(function (button) { return button.btn.type === 'dynamic'; })) || [];
                        return acc.concat(dynamicButtons.map(function (btn, index) { return "Url Dinamico " + (index + 1); }));
                    }, []);
                    newColumnNames = columnNames.slice(0, 3)
                        .concat(headerVariableColumns)
                        .concat(headerMultimediaColumns)
                        .concat(requiredVariableColumns)
                        .concat(carouselVariableColumns)
                        .concat(dynamicUrlColumns)
                        .concat(carouselDynamicUrlColumns)
                        .concat(imageCardColumns)
                        .concat("Variable Adicional 1");
                    newSheetData_1 = __spreadArrays([[], newColumnNames], sheetData.slice(2));
                    newColumnNames.forEach(function (columnName, index) {
                        var descriptionKey = columnName;
                        if (descriptionKey.startsWith("Variable Adicional")) {
                            descriptionKey = "Variable Adicional";
                        }
                        else if (descriptionKey.startsWith("Variable")) {
                            var variableNum = descriptionKey.split(' ')[1];
                            newSheetData_1[0][index] = descriptionsMap["Variable"].replace("{num}", variableNum);
                            return;
                        }
                        else if (descriptionKey.startsWith("Url Dinamico")) {
                            var urlNum = columnName.split(' ')[2];
                            newSheetData_1[0][index] = descriptionsMap["Url Dinamico"].replace("{num}", urlNum);
                            return;
                        }
                        else if (descriptionKey.startsWith("Card Imagen")) {
                            var cardNum = columnName.split(' ')[2];
                            newSheetData_1[0][index] = descriptionsMap["Card Imagen"].replace("{num}", cardNum);
                            return;
                        }
                        newSheetData_1[0][index] = descriptionsMap[descriptionKey] || "";
                    });
                    newWorksheet = XLSX.utils.aoa_to_sheet(newSheetData_1);
                    newWorkbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, firstSheetName);
                    wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'binary' });
                    file_saver_1.saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'Formato de Carga.xlsx');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.error("Error al ajustar y descargar el archivo Excel", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var s2ab = function (s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    };
    react_1.useEffect(function () {
        if (frameProps.checkPage) {
            var valid = changeStep(frameProps.page);
            setFrameProps(__assign(__assign({}, frameProps), { executeSave: false, checkPage: false, valid: __assign(__assign({}, frameProps.valid), { 1: valid }) }));
            if (frameProps.page < 1 || valid) {
                setPageSelected(frameProps.page);
            }
            if (valid && frameProps.executeSave) {
                setSave('VALIDATION');
            }
        }
    }, [frameProps.checkPage]);
    react_1.useEffect(function () {
        if (jsonData) {
            if (jsonData.length > 0) {
                var dataPerson = __spreadArrays(jsonDataPerson, jsonData);
                setJsonDataPerson((dataPerson || []).filter(function (v, i, a) { return a.findIndex(function (v2) { return (v2.personid === v.personid); }) === i; }));
            }
            else {
                setJsonDataPerson([]);
            }
        }
        else {
            setJsonDataPerson([]);
        }
    }, [jsonData]);
    react_1.useEffect(function () {
        // Load Headers
        switch (detaildata.source) {
            case 'INTERNAL':
                setHeaders([
                    { Header: t(keys_1.langKeys.name), accessor: 'displayname' },
                    { Header: 'PCC', accessor: 'personcommunicationchannelowner' },
                    { Header: t(keys_1.langKeys.type), accessor: 'type' },
                    { Header: t(keys_1.langKeys.status), accessor: 'status' },
                    { Header: t(keys_1.langKeys.field) + " 1", accessor: 'field1' },
                    { Header: t(keys_1.langKeys.field) + " 2", accessor: 'field2' },
                    { Header: t(keys_1.langKeys.field) + " 3", accessor: 'field3' },
                    { Header: t(keys_1.langKeys.field) + " 4", accessor: 'field4' },
                    { Header: t(keys_1.langKeys.field) + " 5", accessor: 'field5' },
                    { Header: t(keys_1.langKeys.field) + " 6", accessor: 'field6' },
                    { Header: t(keys_1.langKeys.field) + " 7", accessor: 'field7' },
                    { Header: t(keys_1.langKeys.field) + " 8", accessor: 'field8' },
                    { Header: t(keys_1.langKeys.field) + " 9", accessor: 'field9' },
                    { Header: t(keys_1.langKeys.field) + " 10", accessor: 'field10' },
                    { Header: t(keys_1.langKeys.field) + " 11", accessor: 'field11' },
                    { Header: t(keys_1.langKeys.field) + " 12", accessor: 'field12' },
                    { Header: t(keys_1.langKeys.field) + " 13", accessor: 'field13' },
                    { Header: t(keys_1.langKeys.field) + " 14", accessor: 'field14' },
                    { Header: t(keys_1.langKeys.field) + " 15", accessor: 'field15' }
                ]);
                fetchCampaignInternalData(row === null || row === void 0 ? void 0 : row.id);
                break;
            case 'EXTERNAL':
                if (detaildata.operation === 'INSERT' && detaildata.sourcechanged) {
                    setHeaders([]);
                }
                break;
            case 'PERSON':
                setHeaders([
                    { Header: t(keys_1.langKeys.firstname), accessor: 'firstname' },
                    { Header: t(keys_1.langKeys.lastname), accessor: 'lastname' },
                    { Header: t(keys_1.langKeys.documenttype), accessor: 'documenttype' },
                    { Header: t(keys_1.langKeys.documentnumber), accessor: 'documentnumber' },
                    { Header: t(keys_1.langKeys.personType), accessor: 'persontype' },
                    { Header: t(keys_1.langKeys.type), accessor: 'type' },
                    { Header: t(keys_1.langKeys.phone), accessor: 'phone' },
                    { Header: t(keys_1.langKeys.alternativePhone), accessor: 'alternativephone' },
                    { Header: t(keys_1.langKeys.email), accessor: 'email' },
                    { Header: t(keys_1.langKeys.alternativeEmail), accessor: 'alternativeemail' },
                    {
                        Header: t(keys_1.langKeys.lastContactDate), accessor: 'lastcontact', type: 'date',
                        Cell: function (props) {
                            var row = props.cell.row.original;
                            return helpers_1.convertLocalDate(row.lastcontact).toLocaleString();
                        }
                    },
                    { Header: t(keys_1.langKeys.agent), accessor: 'agent' },
                    { Header: t(keys_1.langKeys.opportunity), accessor: 'opportunity' },
                    { Header: t(keys_1.langKeys.birthday), accessor: 'birthday', type: 'date' },
                    { Header: t(keys_1.langKeys.gender), accessor: 'gender' },
                    { Header: t(keys_1.langKeys.educationLevel), accessor: 'educationlevel' },
                    { Header: t(keys_1.langKeys.comments), accessor: 'comments' },
                ]);
                break;
            case 'LEAD':
                setHeaders([
                    { Header: t(keys_1.langKeys.opportunity), accessor: 'opportunity' },
                    {
                        Header: t(keys_1.langKeys.lastUpdate), accessor: 'changedate', type: 'date',
                        Cell: function (props) {
                            var row = props.cell.row.original;
                            return helpers_1.convertLocalDate(row.changedate).toLocaleString();
                        }
                    },
                    { Header: t(keys_1.langKeys.name), accessor: 'name' },
                    { Header: t(keys_1.langKeys.email), accessor: 'email' },
                    { Header: t(keys_1.langKeys.phone), accessor: 'phone' },
                    { Header: t(keys_1.langKeys.expected_revenue), accessor: 'expected_revenue' },
                    {
                        Header: t(keys_1.langKeys.endDate), accessor: 'date_deadline', type: 'date',
                        Cell: function (props) {
                            var row = props.cell.row.original;
                            return helpers_1.convertLocalDate(row.date_deadline).toLocaleString();
                        }
                    },
                    { Header: t(keys_1.langKeys.tags), accessor: 'tags' },
                    { Header: t(keys_1.langKeys.agent), accessor: 'agent' },
                    { Header: t(keys_1.langKeys.priority), accessor: 'priority' },
                    { Header: t(keys_1.langKeys.campaign), accessor: 'campaign' },
                    { Header: t(keys_1.langKeys.product_plural), accessor: 'products' },
                    { Header: t(keys_1.langKeys.phase), accessor: 'phase' },
                    { Header: t(keys_1.langKeys.comments), accessor: 'comments' },
                ]);
                break;
        }
        // Clean selected data on source change
        if (detaildata.sourcechanged) {
            setDetaildata(__assign(__assign({}, detaildata), { sourcechanged: false, selectedRows: {}, person: [] }));
        }
    }, []);
    // Internal data
    react_1.useEffect(function () {
        if (!auxResult.loading && !auxResult.error && auxResult.data.length > 0) {
            if (detaildata.source === 'INTERNAL') {
                setJsonData(auxResult.data);
                var selectedRowsTemp_1 = {};
                if (detaildata.selectedRows) {
                    selectedRowsTemp_1 = __assign({}, detaildata.selectedRows);
                }
                else {
                    selectedRowsTemp_1 = __assign({}, auxResult.data.reduce(function (ad, d, i) {
                        var _a;
                        return (__assign(__assign({}, ad), (_a = {}, _a[d.campaignmemberid] = true, _a)));
                    }, {}));
                }
                setSelectedRows(selectedRowsTemp_1);
                setDetaildata(__assign(__assign({}, detaildata), { headers: setHeaderTableData(selectedColumns), jsonData: auxResult.data, selectedColumns: selectedColumns, selectedRows: selectedRowsTemp_1, person: auxResult.data.map(function (j) {
                        return Object.keys(selectedRowsTemp_1).includes('' + j[selectionKey]) ? j : __assign(__assign({}, j), { status: 'ELIMINADO' });
                    }) }));
                setFrameProps(__assign(__assign({}, frameProps), { valid: __assign(__assign({}, frameProps.valid), { 1: Object.keys(selectedRowsTemp_1).length > 0 }) }));
            }
        }
    }, [auxResult]);
    // Person, Lead Data
    react_1.useEffect(function () {
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
    var handleUpload = function (files) {
        if (!files || files.length === 0) {
            dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: "Archivo inválido, solo se permiten archivos Excel" }));
            return;
        }
        var file = files[0];
        if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
            dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: "Archivo inválido, solo se permiten archivos Excel" }));
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            var data = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            if (!data)
                return;
            var workbook = XLSX.read(data, { type: 'binary' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];
            var json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            var headers;
            var rows;
            if (json[0][0].startsWith('|Obligatorio|') && json[1][0] === 'Destinatarios') {
                headers = json[1];
                rows = json.slice(2);
            }
            else if (json[0][0] === 'Destinatarios') {
                headers = json[0];
                rows = json.slice(1);
            }
            else {
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: "Formato de archivo incorrecto" }));
                return;
            }
            var filteredRows = rows.filter(function (row) {
                return headers.every(function (header, index) { return row[index] !== undefined && row[index] !== null && row[index] !== ''; });
            });
            var uniqueRows = {};
            var deduplicatedRows = [];
            var duplicatesFound = false;
            filteredRows.forEach(function (row) {
                var rowString = JSON.stringify(row);
                if (!uniqueRows[rowString]) {
                    uniqueRows[rowString] = true;
                    deduplicatedRows.push(row);
                }
                else {
                    duplicatesFound = true;
                }
            });
            if (duplicatesFound) {
                dispatch(actions_2.showSnackbar({ show: true, severity: "warning", message: "Se encontraron filas duplicadas y se eliminaron." }));
            }
            var processedData = deduplicatedRows.map(function (row) {
                var obj = {};
                headers.forEach(function (header, index) {
                    obj[header] = row[index];
                });
                return obj;
            });
            setJsonData(processedData);
            setJsonPersons(processedData);
            setColumnList(headers);
            setSelectedColumns({
                primarykey: headers[0],
                columns: headers.slice(1)
            });
            setHeaders(headers.map(function (c) { return ({
                Header: c,
                accessor: c
            }); }));
        };
        reader.readAsBinaryString(file);
    };
    var uploadData = function (data) {
        if (data.length === 0) {
            dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: t(keys_1.langKeys.file_without_data) }));
            return null;
        }
        if (data.length > 100000) {
            dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: t(keys_1.langKeys.too_many_records) }));
            return null;
        }
        var actualHeaders = jsonData.length > 0 ? Object.keys(jsonData[0]) : null;
        var newHeaders = Object.keys(data[0]);
        if (actualHeaders) {
            if (!actualHeaders.every(function (h) { return newHeaders === null || newHeaders === void 0 ? void 0 : newHeaders.includes(h); })) {
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: t(keys_1.langKeys.file_incompatbile_with_previous_one) }));
                return null;
            }
        }
        // Set only new records
        setJsonDataTemp(data.filter(function (d) { return jsonData.findIndex(function (j) { return JSON.stringify(j) === JSON.stringify(d); }) === -1; }));
        // Set actual headers or new headers
        var localColumnList = actualHeaders ? actualHeaders : newHeaders;
        setColumnList(localColumnList);
        // Backup of columns if user cancel modal
        setSelectedColumnsBackup(__assign({}, selectedColumns));
        // Initialize primary key
        var localSelectedColumns = __assign({}, selectedColumns);
        if (!localColumnList.includes(localSelectedColumns.primarykey)) {
            localSelectedColumns = __assign(__assign({}, localSelectedColumns), { primarykey: '' });
        }
        // Initialize selected column booleans
        if (selectedColumns.columns.length === 0) {
            localSelectedColumns = __assign(__assign({}, localSelectedColumns), { column: new Array(localColumnList.length).fill(false) });
        }
        // Code for reuse campaign
        else if (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL') {
            // Asign [true, false] if columns has new order
            // Asign columns that exist
            localSelectedColumns = __assign(__assign({}, localSelectedColumns), { column: localColumnList.map(function (c) { return localSelectedColumns.columns.includes(c); }), columns: localColumnList.reduce(function (ac, c) {
                    if (localSelectedColumns.columns.includes(c)) {
                        ac.push(c);
                    }
                    return ac;
                }, []) });
        }
        setSelectedColumns(localSelectedColumns);
        setOpenModal(true);
    };
    var cleanData = function () {
        var _a, _b;
        setJsonData([]);
        setHeaders([]);
        setJsonData([]);
        setColumnList([]);
        if (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL' && (((_a = detaildata.fields) === null || _a === void 0 ? void 0 : _a.primarykey) || '') !== '') {
            setSelectedColumns(__assign({}, detaildata.fields));
        }
        else {
            setSelectedColumns(new _types_1.SelectedColumns());
        }
        setSelectedRows({});
        setDetaildata(__assign(__assign({}, detaildata), { headers: [], jsonData: [], selectedColumns: (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL' && (((_b = detaildata.fields) === null || _b === void 0 ? void 0 : _b.primarykey) || '') !== '')
                ? __assign({}, detaildata.fields)
                : new _types_1.SelectedColumns(), selectedRows: {}, person: [] }));
    };
    var handleCancelModal = function () {
        setSelectedColumns(__assign({}, selectedColumnsBackup));
        setOpenModal(false);
    };
    var handleSaveModal = function () {
        var _a, _b, _c;
        if (selectedColumns.primarykey !== '') {
            var columns = columnList.reduce(function (h, c, i) {
                if (c !== selectedColumns.primarykey && selectedColumns.column[i]) {
                    h.push(c);
                }
                return h;
            }, []);
            setSelectedColumns(__assign(__assign({}, selectedColumns), { columns: columns }));
            setJsonDataTemp(JSON.parse(JSON.stringify(jsonDataTemp, __spreadArrays([
                selectedColumns.primarykey
            ], columns))));
            var jsondatadata = __spreadArrays(JSON.parse(JSON.stringify(jsonData, __spreadArrays([
                selectedColumns.primarykey
            ], columns))), JSON.parse(JSON.stringify(jsonDataTemp.filter(function (j) {
                return !jsonData.map(function (jd) { return jd[selectedColumns.primarykey]; })
                    .includes(j[selectedColumns.primarykey]);
            }), __spreadArrays([
                selectedColumns.primarykey
            ], columns))));
            setJsonData(jsondatadata);
            // Changing field(n) with new order
            var message_1 = detaildata.message || '';
            if (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL' && (((_a = detaildata.fields) === null || _a === void 0 ? void 0 : _a.primarykey) || '') !== '') {
                (_b = detaildata.fields) === null || _b === void 0 ? void 0 : _b.columns.forEach(function (c, i) {
                    var newi = selectedColumns.columns.findIndex(function (cs) { return cs === c; });
                    if (newi === -1) {
                        message_1 = message_1 === null || message_1 === void 0 ? void 0 : message_1.replace("{{" + c + "}}", "{{" + (i + 1) + "}}");
                        message_1 = message_1 === null || message_1 === void 0 ? void 0 : message_1.replace("{{field" + (i + 2) + "}}", "{{" + (i + 1) + "}}");
                    }
                    else {
                        message_1 = message_1 === null || message_1 === void 0 ? void 0 : message_1.replace("{{field" + (i + 2) + "}}", "{{" + c + "}}");
                    }
                });
                setDetaildata(__assign(__assign({}, detaildata), { message: message_1 }));
            }
            else if (detaildata.operation === 'UPDATE' && detaildata.source === 'EXTERNAL') {
                (_c = message_1 === null || message_1 === void 0 ? void 0 : message_1.match(/({{)(.*?)(}})/g)) === null || _c === void 0 ? void 0 : _c.forEach(function (c, i) {
                    message_1 = message_1 === null || message_1 === void 0 ? void 0 : message_1.replace("" + c, "{{" + (i + 1) + "}}");
                });
                setDetaildata(__assign(__assign({}, detaildata), { message: message_1 }));
            }
            setOpenModal(false);
        }
    };
    react_1.useEffect(function () {
        if (openModal === false && selectedColumns.primarykey !== '') {
            setHeaderTableData(selectedColumns);
            setAllRowsSelected(true);
        }
    }, [openModal, selectedColumns]);
    var setHeaderTableData = function (localSelectedColumns) {
        if (localSelectedColumns.primarykey !== '') {
            var headers_1 = __spreadArrays([
                localSelectedColumns.primarykey
            ], localSelectedColumns.columns).map(function (c) { return ({
                Header: c,
                accessor: c
            }); });
            setHeaders(headers_1);
            return headers_1;
        }
    };
    // External Data Logic //
    var changeStep = function (step) {
        switch (detaildata.source) {
            case 'INTERNAL':
                setDetaildata(__assign(__assign({}, detaildata), { headers: setHeaderTableData(selectedColumns), jsonData: jsonData,
                    selectedColumns: selectedColumns,
                    selectedRows: selectedRows, person: jsonData.map(function (j) { return Object.keys(selectedRows).includes('' + j[selectionKey]) ? j : __assign(__assign({}, j), { status: 'ELIMINADO' }); }) }));
                break;
            case 'EXTERNAL':
                setDetaildata(__assign(__assign({}, detaildata), { headers: setHeaderTableData(selectedColumns), jsonData: jsonData,
                    selectedColumns: selectedColumns,
                    selectedRows: selectedRows, person: jsonData.filter(function (j) { return Object.keys(selectedRows).includes('' + j[selectionKey]); }) }));
                break;
            case 'PERSON':
                setDetaildata(__assign(__assign({}, detaildata), { selectedRows: selectedRows, person: Array.from(new Map(__spreadArrays((detaildata.person || []), jsonDataPerson).map(function (d) { return [d['personid'], d]; })).values()).filter(function (j) { return Object.keys(selectedRows).includes('' + j[selectionKey]); }) }));
                break;
            case 'LEAD':
                setDetaildata(__assign(__assign({}, detaildata), { selectedRows: selectedRows, person: Array.from(new Map(__spreadArrays((detaildata.person || []), jsonData).map(function (d) { return [d['leadid'], d]; })).values()).filter(function (j) { return Object.keys(selectedRows).includes('' + j[selectionKey]); }) }));
                break;
        }
        return true;
    };
    var AdditionalButtons = function () {
        if (detaildata.source === 'EXTERNAL') {
            return (react_1["default"].createElement(react_1["default"].Fragment, null,
                jsonData.length === 0 && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("a", { href: "#", onClick: function () { return adjustAndDownloadExcel(getDownloadLink()); }, style: { textDecoration: 'none' } },
                        react_1["default"].createElement(Button_1["default"], { component: "span", className: classes.button, variant: "contained", color: "primary", style: { backgroundColor: "#5AB986" } },
                            react_1["default"].createElement(Description_1["default"], { style: { marginRight: '4px' } }),
                            react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: 'Descargar Formato de Carga' }))),
                    react_1["default"].createElement("input", { id: "upload-file", name: "file", type: "file", accept: ".xls,.xlsx", value: valuefile, style: { display: 'none' }, onChange: function (e) { return handleUpload(e.target.files); } }),
                    react_1["default"].createElement("label", { htmlFor: "upload-file" },
                        react_1["default"].createElement(Button_1["default"], { component: "span", className: classes.button, variant: "contained", color: "primary", style: { backgroundColor: "#5AB986" } },
                            react_1["default"].createElement(CloudUpload_1["default"], { style: { marginRight: '4px' } }),
                            react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: 'Importar Base' }))))),
                jsonData.length > 0 && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(Button_1["default"], { disabled: Object.keys(selectedColumns).length === 0, variant: "contained", color: "primary", startIcon: react_1["default"].createElement(Delete_1["default"], null), style: { backgroundColor: !Object.keys(selectedRows).length ? "#e0e0e0" : "#7721ad" }, onClick: function () { return setOpenDeleteDialog(true); } }, t(keys_1.langKeys["delete"])),
                    react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", onClick: function () { return cleanData(); }, style: { backgroundColor: "#53a6fa" } },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.clean })))),
                react_1["default"].createElement(components_1.DialogZyx3Opt, { open: openDeleteDialog, title: t(keys_1.langKeys.confirmation), buttonText1: t(keys_1.langKeys.cancel), buttonText2: t(keys_1.langKeys.accept), handleClickButton1: function () { return setOpenDeleteDialog(false); }, handleClickButton2: handleDeleteSelectedRows, maxWidth: 'xs' },
                    react_1["default"].createElement("div", null, ' ¿Está seguro que desea eliminar a esta(s) persona(s)?'),
                    react_1["default"].createElement("div", { className: "row-zyx" })),
                react_1["default"].createElement(components_1.DialogZyx3Opt, { open: openCleanDialog, title: t(keys_1.langKeys.confirmation), buttonText1: t(keys_1.langKeys.cancel), buttonText2: t(keys_1.langKeys.accept), handleClickButton1: function () { return setOpenCleanDialog(false); }, handleClickButton2: handleCleanConfirmed, maxWidth: 'xs' },
                    react_1["default"].createElement("div", null, ' ¿Está seguro que desea eliminar toda la tabla?'),
                    react_1["default"].createElement("div", { className: "row-zyx" }))));
        }
        else {
            return react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("span", null,
                    t(keys_1.langKeys.selected_plural),
                    ": "),
                react_1["default"].createElement("b", null, Object.keys(selectedRows).length));
        }
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: classes.containerDetail }, ['PERSON', 'LEAD'].includes((detaildata === null || detaildata === void 0 ? void 0 : detaildata.source) || '') ?
            react_1["default"].createElement(table_paginated_1["default"], { columns: headers, data: jsonData, totalrow: totalrow, pageCount: pageCount, loading: paginatedAuxResult.loading, filterrange: true, FiltersElement: react_1["default"].createElement(react_1["default"].Fragment, null), ButtonsElement: function () { return react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("span", null,
                        t(keys_1.langKeys.selected_plural),
                        ": "),
                    react_1["default"].createElement("b", null, Object.keys(selectedRows).length)); }, fetchData: fetchPaginatedData, useSelection: true, selectionKey: selectionKey, initialSelectedRows: selectedRows, setSelectedRows: setSelectedRows, allRowsSelected: allRowsSelected, setAllRowsSelected: setAllRowsSelected })
            :
                react_1["default"].createElement(table_simple_1["default"], { titlemodule: " ", columns: headers, data: jsonData, download: false, loading: detaildata.source === 'INTERNAL' && auxResult.loading, filterGeneral: true, ButtonsElement: AdditionalButtons, useSelection: true, selectionKey: selectionKey, initialSelectedRows: selectedRows, setSelectedRows: setSelectedRows, allRowsSelected: allRowsSelected, setAllRowsSelected: setAllRowsSelected }))));
};
