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
exports.__esModule = true;
exports.Campaign = void 0;
var react_1 = require("react");
var hooks_1 = require("hooks");
var react_redux_1 = require("react-redux");
var Button_1 = require("@material-ui/core/Button");
var helpers_1 = require("common/helpers");
var table_simple_1 = require("../../components/fields/table-simple");
var styles_1 = require("@material-ui/core/styles");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var actions_1 = require("store/main/actions");
var actions_2 = require("store/popus/actions");
var CampaignDetail_1 = require("./CampaignDetail");
var Blacklist_1 = require("./Blacklist");
var ReportCampaign_1 = require("../staticReports/ReportCampaign");
var core_1 = require("@material-ui/core");
var Menu_1 = require("@material-ui/core/Menu");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var MoreVert_1 = require("@material-ui/icons/MoreVert");
var Delete_1 = require("@material-ui/icons/Delete");
var Stop_1 = require("@material-ui/icons/Stop");
var helpers_2 = require("common/helpers");
var Add_1 = require("@material-ui/icons/Add");
var components_1 = require("components");
var icons_1 = require("icons");
var icons_2 = require("@material-ui/icons");
var Block_1 = require("@material-ui/icons/Block");
var helpers_3 = require("common/helpers");
var Comment_1 = require("@material-ui/icons/Comment");
var icons_3 = require("icons");
var useStyles = styles_1.makeStyles(function (theme) {
    var _a;
    return ({
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
        buttonProgrammed: {
            padding: 12,
            fontWeight: 500,
            fontSize: '14px',
            backgroundColor: '#efe4b0'
        },
        containerHeader: (_a = {
                display: "flex",
                flexWrap: "wrap",
                gap: 16
            },
            _a[theme.breakpoints.up("sm")] = {
                display: "flex"
            },
            _a)
    });
});
var IconOptions = function (_a) {
    var disabled = _a.disabled, onHandlerDelete = _a.onHandlerDelete;
    var _b = react_1["default"].useState(null), anchorEl = _b[0], setAnchorEl = _b[1];
    var t = react_i18next_1.useTranslation().t;
    var handleClose = function (e) {
        e.stopPropagation();
        setAnchorEl(null);
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(Menu_1["default"], { id: "menu-appbar", anchorEl: anchorEl, getContentAnchorEl: null, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
            }, transformOrigin: {
                vertical: 'top',
                horizontal: 'right'
            }, open: Boolean(anchorEl), onClose: handleClose }, onHandlerDelete &&
            react_1["default"].createElement(MenuItem_1["default"], { onClick: function (e) {
                    e.stopPropagation();
                    setAnchorEl(null);
                    onHandlerDelete();
                } },
                react_1["default"].createElement(core_1.ListItemIcon, { color: "inherit" },
                    react_1["default"].createElement(Delete_1["default"], { width: 18, style: { fill: '#7721AD' } })),
                t(keys_1.langKeys["delete"])))));
};
exports.Campaign = function () {
    var dispatch = react_redux_1.useDispatch();
    var classes = useStyles();
    var t = react_i18next_1.useTranslation().t;
    var mainResult = hooks_1.useSelector(function (state) { return state.main; });
    var auxResult = hooks_1.useSelector(function (state) { return state.main.mainAux; });
    var executeResult = hooks_1.useSelector(function (state) { return state.main.execute; });
    var _a = react_1.useState("view-1"), viewSelected = _a[0], setViewSelected = _a[1];
    var _b = react_1.useState({ row: null, edit: false }), rowSelected = _b[0], setRowSelected = _b[1];
    var _c = react_1.useState(false), waitSave = _c[0], setWaitSave = _c[1];
    var _d = react_1.useState(false), waitStart = _d[0], setWaitStart = _d[1];
    var _e = react_1.useState(false), waitStatus = _e[0], setWaitStatus = _e[1];
    var _f = react_1.useState(false), waitStop = _f[0], setWaitStop = _f[1];
    var selectionKey = "id";
    var _g = react_1.useState({}), selectedRows = _g[0], setSelectedRows = _g[1];
    var _h = react_1.useState([]), rowWithDataSelected = _h[0], setRowWithDataSelected = _h[1];
    react_1.useEffect(function () {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected(function (p) {
                return Object.keys(selectedRows).map(function (x) { var _a, _b, _c; return (_c = (_b = (_a = mainResult.mainData) === null || _a === void 0 ? void 0 : _a.data.find(function (y) { return y.id === parseInt(x); })) !== null && _b !== void 0 ? _b : p.find(function (y) { return y.id === parseInt(x); })) !== null && _c !== void 0 ? _c : {}; });
            });
        }
    }, [selectedRows]);
    var handleDeleteSelection = function (dataSelected) { return __awaiter(void 0, void 0, void 0, function () {
        var callback;
        return __generator(this, function (_a) {
            callback = function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    dispatch(actions_2.showBackdrop(true));
                    dataSelected.map(function (row) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            dispatch(actions_1.execute(helpers_1.delCampaign(__assign(__assign({}, row), { operation: 'DELETE', status: 'ELIMINADO', type: "NINGUNO", id: row.id }))));
                            return [2 /*return*/];
                        });
                    }); });
                    setWaitSave(true);
                    return [2 /*return*/];
                });
            }); };
            dispatch(actions_2.manageConfirmation({
                visible: true,
                question: t(keys_1.langKeys.confirmation_delete_all),
                callback: callback
            }));
            return [2 /*return*/];
        });
    }); };
    var columns = react_1["default"].useMemo(function () { return [
        {
            accessor: 'id',
            NoFilter: true,
            isComponent: true,
            minWidth: 60,
            width: '1%',
            Cell: function (props) {
                var row = props.cell.row.original;
                return (react_1["default"].createElement(IconOptions, { onHandlerDelete: function () {
                        handleDelete(row);
                    } }));
            }
        },
        {
            Header: t(keys_1.langKeys.campaign),
            accessor: 'title',
            width: '200px'
        },
        {
            Header: t(keys_1.langKeys.description),
            accessor: 'description',
            width: '200px'
        },
        {
            Header: t(keys_1.langKeys.channel),
            accessor: 'communicationchannel',
            width: '250px'
        },
        {
            Header: t(keys_1.langKeys.startdate),
            accessor: 'startdate',
            width: '200px',
            type: 'date',
            Cell: function (props) {
                var row = props.cell.row.original;
                return (react_1["default"].createElement("div", null, row && row.startdate ? helpers_1.dateToLocalDate(row.startdate) : ''));
            }
        },
        {
            Header: t(keys_1.langKeys.enddate),
            accessor: 'enddate',
            width: '200px',
            type: 'date',
            Cell: function (props) {
                var row = props.cell.row.original;
                return (react_1["default"].createElement("div", null, row && row.enddate ? helpers_1.dateToLocalDate(row.enddate) : ''));
            }
        },
        {
            Header: t(keys_1.langKeys.status),
            accessor: 'status',
            prefixTranslation: 'status_',
            Cell: function (props) {
                var row = props.cell.row;
                var status = row && row.original && row.original.status;
                return (t(("status_" + status).toLowerCase()) || "").toUpperCase();
            }
        },
        {
            Header: 'Fecha de Ejecución',
            accessor: 'datestart',
            width: '200px',
            type: 'date',
            Cell: function (props) {
                var row = props.cell.row.original;
                return (react_1["default"].createElement("div", null, row && row.datestart ? helpers_1.dateToLocalDate(row.datestart) : ''));
            }
        },
        {
            Header: 'Hora de Ejecución',
            accessor: 'hourstart',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.executiontype_campaign),
            accessor: 'executiontype',
            prefixTranslation: 'executiontype',
            Cell: function (props) {
                var row = props.cell.row;
                var executiontype = row && row.original && row.original.executiontype;
                return executiontype ? t("" + executiontype).toUpperCase() : '';
            }
        },
        {
            accessor: 'stop',
            isComponent: true,
            maxWidth: '80px',
            Cell: function (props) {
                var row = props.cell.row.original;
                if ((row === null || row === void 0 ? void 0 : row.status) === 'EJECUTANDO') {
                    return react_1["default"].createElement(Stop_1["default"], { titleAccess: t(keys_1.langKeys.stop), fontSize: 'large', style: { width: 35, height: 35, fill: '#ea2e49' }, onClick: function (e) {
                            e.stopPropagation();
                            handleStop(row);
                        } });
                }
                else {
                    return null;
                }
            }
        },
        {
            Header: t(keys_1.langKeys.action),
            accessor: 'execute',
            isComponent: true,
            width: '150px',
            Cell: function (props) {
                var row = props.cell.row;
                if (!row || !row.original) {
                    return null;
                }
                var _a = row.original, id = _a.id, status = _a.status, startdate = _a.startdate, enddate = _a.enddate, executiontype = _a.executiontype, datestart = _a.datestart, hourstart = _a.hourstart;
                if (helpers_1.dateToLocalDate(startdate, 'date') <= helpers_1.todayDate() &&
                    helpers_1.todayDate() <= helpers_1.dateToLocalDate(enddate, 'date') && executiontype === "MANUAL") {
                    if (status === 'EJECUTANDO') {
                        return (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", onClick: function (e) {
                                e.stopPropagation();
                                handleStatus(id);
                            }, style: { backgroundColor: "#55bd84" } },
                            react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.status })));
                    }
                    else if (status === 'ACTIVO') {
                        return (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", onClick: function (e) {
                                e.stopPropagation();
                                handleStart(id);
                            }, style: { backgroundColor: "#55bd84" } },
                            react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.execute })));
                    }
                    else {
                        return null;
                    }
                }
                else if ((status === "EJECUTANDO")) {
                    return (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", onClick: function (e) {
                            e.stopPropagation();
                            dispatch(actions_2.showSnackbar({ show: true, severity: "success", message: "Campa\u00F1a ya programada el " + datestart + ", a las " + hourstart }));
                        }, style: { backgroundColor: "#EFE4B0" } },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.programmed })));
                }
                else {
                    return null;
                }
            }
        },
    ]; }, []);
    var columnsExcel = [
        { Header: 'Campaña', accessor: 'title' },
        { Header: 'Descripción', accessor: 'description' },
        { Header: 'Canal', accessor: 'communicationchannel' },
        { Header: 'Fecha de Inicio', accessor: 'startdate' },
        { Header: 'Fecha de Fin', accessor: 'enddate' },
        { Header: 'Estado', accessor: 'status' },
        { Header: 'Fecha y hora de ejecución', accessor: 'datetimestart' },
        { Header: 'Tipo de ejecución', accessor: 'executiontype' },
    ];
    var fetchData = function () { return dispatch(actions_1.getCollection(helpers_1.getCampaignLst(dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : "", dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : ""))); };
    var handleStatus = function (id) {
        if (!waitStatus) {
            dispatch(actions_1.getCollectionAux(helpers_1.getCampaignStatus(id)));
            setWaitStatus(true);
        }
    };
    var handleStart = function (id) {
        if (!waitStart) {
            dispatch(actions_1.getCollectionAux(helpers_1.getCampaignStart(id)));
            setWaitStart(true);
        }
    };
    react_1.useEffect(function () {
        fetchData();
        return function () {
            dispatch(actions_1.resetAllMain());
        };
    }, []);
    react_1.useEffect(function () {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(actions_2.showSnackbar({ show: true, severity: "success", message: t(keys_1.langKeys.successful_delete) }));
                fetchData();
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
            }
            else if (executeResult.error) {
                var errormessage = t(executeResult.code || "error_unexpected_error", { module: t(keys_1.langKeys.campaign).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
            }
        }
        if (waitStop) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(actions_2.showSnackbar({ show: true, severity: "success", message: t(keys_1.langKeys.successful_transaction) }));
                fetchData();
                dispatch(actions_2.showBackdrop(false));
                setWaitStop(false);
            }
            else if (executeResult.error) {
                var errormessage = t(executeResult.code || "error_unexpected_error", { module: t(keys_1.langKeys.campaign).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitStop(false);
            }
        }
    }, [executeResult, waitSave, waitStop]);
    react_1.useEffect(function () {
        if (waitStatus) {
            if (!auxResult.loading && !auxResult.error) {
                var _a = auxResult.data[0], status = _a.status, enviado = _a.enviado, total = _a.total;
                if (status === 'EJECUTANDO') {
                    dispatch(actions_2.showSnackbar({ show: true, severity: "success", message: (t(("status_" + status).toLowerCase()) || "").toUpperCase() + ": " + t(keys_1.langKeys.sent) + " " + enviado + "/" + total }));
                    setWaitStatus(false);
                }
                else if (status === 'ACTIVO') {
                    dispatch(actions_2.showSnackbar({ show: true, severity: "success", message: "" + helpers_1.capitalize(t(keys_1.langKeys.sent)) }));
                    fetchData();
                    setWaitStatus(false);
                }
            }
            else if (auxResult.error) {
                var errormessage = t(auxResult.code || "error_unexpected_error", { module: t(keys_1.langKeys.campaign).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitStatus(false);
            }
        }
        if (waitStart) {
            if (!auxResult.loading && !auxResult.error) {
                dispatch(actions_2.showSnackbar({ show: true, severity: "success", message: t(keys_1.langKeys.successful_transaction) }));
                fetchData();
                setWaitStart(false);
            }
            else if (auxResult.error) {
                var errormessage = t(auxResult.code || "error_unexpected_error", { module: t(keys_1.langKeys.campaign).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitStart(false);
            }
        }
    }, [auxResult, waitStatus, waitStart]);
    var handleRegister = function () {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    };
    var handleEdit = function (row) {
        if (row.status === 'EJECUTANDO') {
            dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: t(keys_1.langKeys.campaign_in_execution) }));
        }
        else {
            setViewSelected("view-2");
            setRowSelected({ row: row, edit: true });
        }
    };
    var handleDelete = function (row) {
        if (row.status === 'EJECUTANDO') {
            dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: t(keys_1.langKeys.campaign_in_execution) }));
        }
        else {
            var callback = function () {
                dispatch(actions_1.execute(helpers_1.delCampaign(__assign(__assign({}, row), { operation: 'DELETE', status: 'ELIMINADO', id: row.id }))));
                dispatch(actions_2.showBackdrop(true));
                setWaitSave(true);
            };
            dispatch(actions_2.manageConfirmation({
                visible: true,
                question: t(keys_1.langKeys.confirmation_delete),
                callback: callback
            }));
        }
    };
    var handleStop = function (row) {
        if (row.status === 'EJECUTANDO') {
            var callback = function () {
                dispatch(actions_1.execute(helpers_1.stopCampaign({ campaignid: row.id })));
                dispatch(actions_2.showBackdrop(true));
                setWaitStop(true);
            };
            dispatch(actions_2.manageConfirmation({
                visible: true,
                question: t(keys_1.langKeys.confirmation_stop),
                callback: callback
            }));
        }
    };
    var _j = react_1["default"].useState(null), anchorElSeButtons = _j[0], setAnchorElSeButtons = _j[1];
    var _k = react_1.useState(false), openSeButtons = _k[0], setOpenSeButtons = _k[1];
    var open = Boolean(anchorElSeButtons);
    var handleClickSeButtons = function (event) {
        setAnchorElSeButtons(event.currentTarget);
    };
    var handleCloseSeButtons = function () {
        setAnchorElSeButtons(null);
    };
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            if (anchorElSeButtons && !anchorElSeButtons.contains(event.target)) {
                handleCloseSeButtons();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { document.removeEventListener('mousedown', handleClickOutside); };
    }, [anchorElSeButtons]);
    var _l = react_1.useState(false), openDateRangeModal = _l[0], setOpenDateRangeModal = _l[1];
    var format = function (date) { return date.toISOString().split("T")[0]; };
    var _m = react_1.useState({
        loading: false,
        data: []
    }), detailCustomReport = _m[0], setDetailCustomReport = _m[1];
    var _o = react_1.useState({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection"
    }), dateRange = _o[0], setdateRange = _o[1];
    var handleDownload = function () {
        if (mainResult && mainResult.mainData && mainResult.mainData.data) {
            var csvData = mainResult.mainData.data.map(function (item) {
                var formattedItem = {
                    title: item.title,
                    description: item.description,
                    communicationchannel: item.communicationchannel,
                    startdate: item.startdate ? helpers_1.dateToLocalDate(item.startdate) : '',
                    enddate: item.enddate ? helpers_1.dateToLocalDate(item.enddate) : '',
                    status: item.status,
                    datetimestart: item.datetimestart ? helpers_2.formatDate(item.datetimestart, { withTime: true }) : '',
                    executiontype: item.executiontype
                };
                return formattedItem;
            });
            helpers_1.exportExcelCustom('CampañasReport', csvData, columnsExcel);
        }
    };
    var gotoReport = function () {
        if (viewSelected === "report") {
            return (react_1["default"].createElement(ReportCampaign_1.CampaignReport, { setViewSelected: setViewSelected }));
        }
    };
    var modifiedData = react_1.useMemo(function () {
        return mainResult.mainData.data.map(function (item) { return (__assign(__assign({}, item), { executiontype: item.executiontype === "SCHEDULED" ? "PROGRAMADO" : item.executiontype })); });
    }, [mainResult.mainData.data]);
    var AdditionalButtons = function () {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { display: "flex", backgroundColor: 'white', padding: '0.5rem 0' } },
                react_1["default"].createElement(core_1.Box, { width: 1 },
                    react_1["default"].createElement(core_1.Box, { className: classes.containerHeader, justifyContent: "space-between", alignItems: "center" },
                        react_1["default"].createElement("div", { style: { display: "flex", justifyContent: "space-between", width: '100%' } },
                            react_1["default"].createElement("div", { style: { display: 'flex', gap: '0.5rem' } },
                                react_1["default"].createElement(components_1.DateRangePicker, { open: openDateRangeModal, setOpen: setOpenDateRangeModal, range: dateRange, onSelect: setdateRange },
                                    react_1["default"].createElement(Button_1["default"], { disabled: detailCustomReport.loading, style: { border: "1px solid #bfbfc0", borderRadius: 4, color: "rgb(143, 146, 161)" }, startIcon: react_1["default"].createElement(icons_1.CalendarIcon, null), onClick: function () { return setOpenDateRangeModal(!openDateRangeModal); } }, helpers_3.getDateCleaned(dateRange.startDate) + " - " + helpers_3.getDateCleaned(dateRange.endDate))),
                                react_1["default"].createElement(Button_1["default"], { disabled: mainResult.mainData.loading, variant: "contained", color: "primary", startIcon: react_1["default"].createElement(icons_2.Search, { style: { color: 'white' } }), style: { width: 120, backgroundColor: "#55BD84" }, onClick: fetchData }, t(keys_1.langKeys.search))),
                            react_1["default"].createElement("div", { style: { display: 'flex', gap: '0.5rem' } },
                                react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", type: 'button', disabled: mainResult.mainData.loading || Object.keys(selectedRows).length === 0, startIcon: react_1["default"].createElement(Delete_1["default"], { color: "secondary" }), onClick: function () {
                                        handleDeleteSelection(rowWithDataSelected);
                                    }, style: {
                                        backgroundColor: mainResult.mainData.loading || Object.keys(selectedRows).length === 0 ? undefined : "#FB5F5F"
                                    } },
                                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys["delete"] })),
                                react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: mainResult.mainData.loading, startIcon: react_1["default"].createElement(Add_1["default"], { color: "secondary" }), onClick: function () { return handleRegister(); }, style: { backgroundColor: "#22b66e" } },
                                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.register })),
                                react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: mainResult.mainData.loading, startIcon: react_1["default"].createElement(icons_3.DownloadIcon, null), onClick: handleDownload },
                                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.download })),
                                react_1["default"].createElement(core_1.IconButton, { "aria-label": "more", id: "long-button", onClick: handleClickSeButtons, style: { backgroundColor: openSeButtons ? '#F6E9FF' : undefined, color: openSeButtons ? '#7721AD' : undefined } },
                                    react_1["default"].createElement(MoreVert_1["default"], null)),
                                react_1["default"].createElement(Menu_1["default"], { id: "long-menu", anchorEl: anchorElSeButtons, open: open, onClose: handleCloseSeButtons, PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5,
                                            width: '16ch',
                                            marginTop: '3.5rem'
                                        }
                                    } },
                                    react_1["default"].createElement(MenuItem_1["default"], { disabled: mainResult.mainData.loading, style: { padding: '0.7rem 1rem', fontSize: '0.96rem' }, onClick: function (e) { setViewSelected("blacklist"); e.stopPropagation(); } },
                                        react_1["default"].createElement(core_1.ListItemIcon, null,
                                            react_1["default"].createElement(Block_1["default"], { fontSize: "small", style: { fill: 'grey', height: '23px' } })),
                                        react_1["default"].createElement(core_1.Typography, { variant: "inherit" }, t(keys_1.langKeys.blacklist))),
                                    react_1["default"].createElement(core_1.Divider, null),
                                    react_1["default"].createElement(core_1.Divider, null),
                                    react_1["default"].createElement("a", { style: { textDecoration: 'none', color: 'inherit' }, onClick: function () { return setViewSelected("report"); } },
                                        react_1["default"].createElement(MenuItem_1["default"], { disabled: mainResult.mainData.loading, style: { padding: '0.7rem 1rem', fontSize: '0.96rem' } },
                                            react_1["default"].createElement(core_1.ListItemIcon, null,
                                                react_1["default"].createElement(Comment_1["default"], { fontSize: "small", style: { fill: 'grey', height: '23px' } })),
                                            react_1["default"].createElement(core_1.Typography, { variant: "inherit" }, "Reporte")))))))))));
    };
    if (viewSelected === "view-1") {
        if (mainResult.mainData.error) {
            return react_1["default"].createElement("h1", null, "ERROR");
        }
        return (react_1["default"].createElement("div", { style: { display: 'block', width: '100%' } },
            react_1["default"].createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("h2", null,
                        " ",
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.campaign_plural })))),
            react_1["default"].createElement(table_simple_1["default"], { columns: columns, data: modifiedData, useSelection: true, setSelectedRows: setSelectedRows, selectionKey: selectionKey, heightWithCheck: 51, onClickRow: handleEdit, loading: mainResult.mainData.loading, ButtonsElement: AdditionalButtons, filterGeneral: false })));
    }
    else if (viewSelected === "view-2") {
        return (react_1["default"].createElement(CampaignDetail_1.CampaignDetail, { data: rowSelected, setViewSelected: setViewSelected, fetchData: fetchData, handleStart: handleStart }));
    }
    else if (viewSelected === "blacklist") {
        return (react_1["default"].createElement(Blacklist_1.Blacklist, { setViewSelected: setViewSelected }));
    }
    else if (viewSelected === "report") {
        return (react_1["default"].createElement(ReportCampaign_1.CampaignReport, { setViewSelected: setViewSelected }));
    }
    else {
        return null;
    }
};
exports["default"] = exports.Campaign;
