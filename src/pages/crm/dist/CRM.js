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
var helpers_1 = require("common/helpers");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var hooks_1 = require("hooks");
var react_beautiful_dnd_1 = require("react-beautiful-dnd");
var components_1 = require("./components");
var actions_1 = require("store/main/actions");
var prueba_1 = require("./prueba");
var paths_1 = require("common/constants/paths");
var react_router_1 = require("react-router");
var actions_2 = require("store/popus/actions");
var keys_1 = require("lang/keys");
var react_i18next_1 = require("react-i18next");
var components_2 = require("components");
var icons_1 = require("@material-ui/icons");
var Tune_1 = require("@material-ui/icons/Tune");
var core_1 = require("@material-ui/core");
var Phone_1 = require("@material-ui/icons/Phone");
var table_paginated_1 = require("components/fields/table-paginated");
var styles_1 = require("@material-ui/core/styles");
var lab_1 = require("@material-ui/lab");
var Modals_1 = require("./Modals");
var icons_2 = require("icons");
var actions_3 = require("store/voximplant/actions");
var isIncremental = window.location.href.includes("incremental");
var MoreVert_1 = require("@material-ui/icons/MoreVert");
var useStyles = styles_1.makeStyles(function (theme) { return ({
    containerDetail: {
        marginTop: theme.spacing(3),
        background: '#fff'
    },
    tag: {
        backgroundColor: '#7721AD',
        color: '#fff',
        borderRadius: '20px',
        padding: '2px 5px',
        margin: '2px'
    },
    containerFilter: {
        width: '100%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    filterComponent: {
        width: '220px'
    },
    canvasFiltersHeader: {
        margin: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    button: {
        backgroundColor: '#ffff',
        color: '#7721AD',
        '&:hover': {
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    errorModalContent: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
    },
    text: {
        alignSelf: "center",
        marginLeft: '25px',
        fontSize: 16
    },
    addBtn: {
        width: 35,
        height: 35,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    addBtnContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "inherit",
        position: "relative",
        height: 35,
        width: "fit-content"
    },
    newTitle: {
        height: 70,
        backgroundColor: "#F9F9FA",
        padding: "14px 0 1px 0",
        marginLeft: "5px",
        display: "flex",
        overflow: "hidden",
        maxHeight: "100%",
        textAlign: "center",
        flexDirection: "column",
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px'
    },
    otherTitles: {
        height: 70,
        backgroundColor: "#F9F9FA",
        padding: "14px 0 1px 0",
        marginLeft: "21px",
        display: "flex",
        overflow: "hidden",
        maxHeight: "100%",
        textAlign: "center",
        flexDirection: "column",
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px'
    },
    columnsTitles: {
        display: "flex",
        color: "white",
        paddingTop: 10,
        fontSize: "20px",
        fontWeight: "bold"
    },
    greyPart: {
        height: 45,
        backgroundColor: "#AFAFAF",
        padding: "5px 0",
        margin: "2px 15px",
        display: "flex",
        overflow: "hidden",
        maxHeight: "100%",
        textAlign: "center",
        flexDirection: "column",
        borderRadius: '20px'
    },
    otherGreyPart: {
        height: 45,
        backgroundColor: "#AFAFAF",
        padding: "5px 0",
        margin: "2px 15px 0 15px",
        display: "flex",
        overflow: "hidden",
        maxHeight: "100%",
        textAlign: "center",
        flexDirection: "column",
        borderRadius: '20px'
    },
    oportunityList: {
        background: '#F9F9FA',
        marginRight: '1rem',
        marginLeft: '0.3rem',
        padding: '0 0.6rem 0.5rem 0.6rem',
        borderTopLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
    },
    titleDialogZyx: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    titleSection: {
        width: "inherit"
    }
}); });
var selectionKey = 'leadid';
var DraggablesCategories = function (_a) {
    var column = _a.column, index = _a.index, hanldeDeleteColumn = _a.hanldeDeleteColumn, handleDelete = _a.handleDelete, handleCloseLead = _a.handleCloseLead, deletable = _a.deletable, isIncremental = _a.isIncremental, sortParams = _a.sortParams, configuration = _a.configuration;
    var t = react_i18next_1.useTranslation().t;
    return (react_1["default"].createElement(react_beautiful_dnd_1.Draggable, { draggableId: column.column_uuid, index: index + 1, key: column.column_uuid, isDragDisabled: isIncremental }, function (provided) { return (react_1["default"].createElement("div", __assign({}, provided.draggableProps, { ref: provided.innerRef }),
        react_1["default"].createElement(components_1.DraggableLeadColumn, { title: t(column.description.toLowerCase()), key: index + 1, snapshot: null, provided: provided, columnid: column.column_uuid, deletable: deletable, onDelete: hanldeDeleteColumn, total_revenue: column.total_revenue, total_cards: column.items.length },
            react_1["default"].createElement(react_beautiful_dnd_1.Droppable, { droppableId: column.column_uuid, type: "task" }, function (provided, snapshot) {
                var _a, _b;
                return (react_1["default"].createElement("div", __assign({}, provided.droppableProps, { ref: provided.innerRef, style: { width: '100%', overflowY: 'scroll', maxHeight: '65vh', overflowX: 'clip' } }),
                    react_1["default"].createElement(components_1.DroppableLeadColumnList, { snapshot: snapshot, itemCount: ((_a = column.items) === null || _a === void 0 ? void 0 : _a.length) || 0 }, (_b = column.items) === null || _b === void 0 ? void 0 : _b.map(function (item, index) {
                        return (react_1["default"].createElement(react_beautiful_dnd_1.Draggable, { isDragDisabled: isIncremental, key: item.leadid, draggableId: item.leadid.toString(), index: index }, function (provided, snapshot) {
                            return (react_1["default"].createElement(prueba_1["default"], { style: provided.draggableProps.style, snapshot: snapshot }, function (style) { return (react_1["default"].createElement("div", __assign({ ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps, { style: __assign({ width: '100%' }, style) }),
                                react_1["default"].createElement(components_1.DraggableLeadCardContent, { lead: item, snapshot: snapshot, onDelete: handleDelete, onCloseLead: handleCloseLead, configuration: configuration }))); }));
                        }));
                    })),
                    provided.placeholder));
            })))); }));
};
var CRM = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var user = hooks_1.useSelector(function (state) { return state.login.validateToken.user; });
    var history = react_router_1.useHistory();
    var location = react_router_1.useLocation();
    var dispatch = react_redux_1.useDispatch();
    var _o = react_1.useState([]), dataColumn = _o[0], setDataColumn = _o[1];
    var _p = react_1.useState(false), openDialog = _p[0], setOpenDialog = _p[1];
    var _q = react_1.useState(''), deleteColumn = _q[0], setDeleteColumn = _q[1];
    var mainMulti = hooks_1.useSelector(function (state) { return state.main.multiData; });
    var t = react_i18next_1.useTranslation().t;
    var classes = useStyles();
    var query = react_1.useMemo(function () { return new URLSearchParams(location.search); }, [location]);
    var params = table_paginated_1.useQueryParams(query, {
        ignore: [
            'asesorid', 'channels', 'contact', 'display', 'products', 'tags', 'campaign', 'persontype'
        ]
    });
    var otherParams = react_1.useMemo(function () { return ({
        asesorid: Number(query.get('asesorid')),
        channels: query.get('channels') || '',
        contact: query.get('contact') || '',
        products: query.get('products') || '',
        persontype: query.get('persontype') || '',
        tags: query.get('tags') || '',
        campaign: Number(query.get('campaign'))
    }); }, [query]);
    var _r = react_1.useState(query.get('display') || 'BOARD'), display = _r[0], setDisplay = _r[1];
    var _s = react_1.useState({
        campaign: otherParams.campaign,
        customer: otherParams.contact,
        products: otherParams.products,
        tags: otherParams.tags,
        asesorid: otherParams.asesorid,
        persontype: otherParams.persontype
    }), boardFilter = _s[0], setBoardFilterPrivate = _s[1];
    var setBoardFilter = react_1.useCallback(function (prop) {
        var _a;
        if (!user)
            return;
        if ((_a = user.roledesc) === null || _a === void 0 ? void 0 : _a.includes("ASESOR")) {
            setBoardFilterPrivate(__assign(__assign({}, (typeof prop === "function" ? prop(boardFilter) : prop)), { asesorid: user.userid }));
        }
        else {
            setBoardFilterPrivate(prop);
        }
    }, [user, boardFilter]);
    var _t = react_1.useState({
        type: '',
        order: ''
    }), sortParams = _t[0], setSortParams = _t[1];
    var updateSortParams = function (value) {
        setSortParams(value);
    };
    react_1.useEffect(function () {
        dispatch(actions_1.getMultiCollection([
            helpers_1.getColumnsSel(1),
            helpers_1.getLeadsSel({
                id: 0,
                campaignid: boardFilter.campaign,
                fullname: boardFilter.customer,
                leadproduct: boardFilter.products,
                persontype: boardFilter.persontype,
                tags: boardFilter.tags,
                userid: String(boardFilter.asesorid || ""),
                supervisorid: (user === null || user === void 0 ? void 0 : user.userid) || 0,
                ordertype: sortParams.type,
                orderby: sortParams.order
            }),
            helpers_1.getAdviserFilteredUserRol(),
            helpers_1.getCommChannelLst(),
            helpers_1.getCampaignLst(),
            helpers_1.getValuesFromDomain('OPORTUNIDADPRODUCTOS'),
            helpers_1.getLeadTasgsSel(),
            helpers_1.getValuesFromDomain('TIPOPERSONA'),
            helpers_1.getValuesFromDomain('ORDERTYPE'),
            helpers_1.getValuesFromDomain('ORDERBY'),
        ]));
        return function () {
            //dispatch(resetAllMain());
        };
    }, [dispatch, sortParams]);
    react_1.useEffect(function () {
        if (!mainMulti.error && !mainMulti.loading) {
            if (mainMulti.data.length && mainMulti.data[0].key && mainMulti.data[0].key === "UFN_COLUMN_SEL") {
                var columns_1 = (mainMulti.data[0] && mainMulti.data[0].success ? mainMulti.data[0].data : []);
                var leads_1 = (mainMulti.data[1] && mainMulti.data[1].success ? mainMulti.data[1].data : []);
                var unordeneddatacolumns = columns_1.map(function (column) {
                    column.items = leads_1.filter(function (x) { return x.column_uuid === column.column_uuid; });
                    return __assign(__assign({}, column), { total_revenue: (column.items.reduce(function (a, b) { return a + parseFloat(b.expected_revenue); }, 0)) });
                });
                var ordereddata = __spreadArrays(unordeneddatacolumns.filter(function (x) { return x.type === "NEW"; }), unordeneddatacolumns.filter(function (x) { return x.type === "QUALIFIED"; }), unordeneddatacolumns.filter(function (x) { return x.type === "PROPOSITION"; }), unordeneddatacolumns.filter(function (x) { return x.type === "WON"; }));
                setDataColumn(ordereddata);
            }
        }
    }, [mainMulti]);
    var _u = react_1.useState(false), isModalOpenBOARD = _u[0], setModalOpenBOARD = _u[1];
    var _v = react_1.useState(false), isModalOpenGRID = _v[0], setModalOpenGRID = _v[1];
    var fetchBoardLeadsWithFilter = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var newParams, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    newParams = new URLSearchParams(location.search);
                    newParams.set('campaign', String(boardFilter.campaign));
                    newParams.set('products', String(boardFilter.products));
                    newParams.set('persontype', String(boardFilter.persontype));
                    newParams.set('tags', String(boardFilter.tags));
                    newParams.set('contact', String(boardFilter.customer));
                    newParams.set('asesorid', String(boardFilter.asesorid));
                    history.push({ search: newParams.toString() });
                    return [4 /*yield*/, dispatch(actions_1.getMultiCollection([
                            helpers_1.getColumnsSel(1),
                            helpers_1.getLeadsSel({
                                id: 0,
                                campaignid: boardFilter.campaign,
                                fullname: boardFilter.customer,
                                leadproduct: boardFilter.products,
                                persontype: boardFilter.persontype,
                                tags: boardFilter.tags,
                                userid: String(boardFilter.asesorid || ""),
                                supervisorid: (user === null || user === void 0 ? void 0 : user.userid) || 0,
                                ordertype: sortParams.type,
                                orderby: sortParams.order
                            }),
                            helpers_1.getAdviserFilteredUserRol(),
                            helpers_1.getCommChannelLst(),
                            helpers_1.getCampaignLst(),
                            helpers_1.getValuesFromDomain('OPORTUNIDADPRODUCTOS'),
                            helpers_1.getLeadTasgsSel(),
                            helpers_1.getValuesFromDomain('TIPOPERSONA'),
                            helpers_1.getValuesFromDomain('ORDERTYPE'),
                            helpers_1.getValuesFromDomain('ORDERBY'),
                        ]))];
                case 1:
                    _a.sent();
                    setModalOpenBOARD(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error al aplicar filtros:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [boardFilter, dispatch, location.search, history, setModalOpenBOARD, sortParams, user]);
    var onDragEnd = function (result, columns, setDataColumn) {
        var _a, _b;
        if (!result.destination)
            return;
        var source = result.source, destination = result.destination, type = result.type;
        if (type === 'column') {
            var newColumnOrder = __spreadArrays(columns);
            if (newColumnOrder[destination.index - 1].type !== newColumnOrder[source.index - 1].type)
                return;
            var removed = newColumnOrder.splice((source.index - 1), 1)[0];
            newColumnOrder.splice(destination.index - 1, 0, removed);
            setDataColumn(newColumnOrder);
            var columns_uuid = newColumnOrder.slice(1).map(function (x) { return x.column_uuid; }).join(',');
            dispatch(actions_1.execute(helpers_1.updateColumnsOrder({ columns_uuid: columns_uuid })));
            return;
        }
        if (source.droppableId === destination.droppableId) {
            var index = columns.findIndex(function (c) { return c.column_uuid === source.droppableId; });
            if (index >= 0) {
                var column = columns[index];
                var copiedItems = __spreadArrays(column.items);
                var removed = copiedItems.splice(source.index, 1)[0];
                copiedItems.splice(destination.index, 0, removed);
                setDataColumn(Object.values(__assign(__assign({}, columns), (_a = {}, _a[index] = __assign(__assign({}, column), { items: copiedItems }), _a))));
                var cards_startingcolumn = copiedItems.map(function (x) { return x.leadid; }).join(',');
                var startingcolumn_uuid = column.column_uuid;
                dispatch(actions_1.execute(helpers_1.updateColumnsLeads({ cards_startingcolumn: cards_startingcolumn, cards_finalcolumn: '', startingcolumn_uuid: startingcolumn_uuid, finalcolumn_uuid: startingcolumn_uuid })));
            }
        }
        else {
            var sourceIndex = columns.findIndex(function (c) { return c.column_uuid === source.droppableId; });
            var destIndex = columns.findIndex(function (c) { return c.column_uuid === destination.droppableId; });
            if (sourceIndex >= 0 && destIndex >= 0) {
                var sourceColumn = columns[sourceIndex];
                var destColumn = columns[destIndex];
                var sourceItems = (sourceColumn.items) ? __spreadArrays(sourceColumn.items) : null;
                var destItems = (destColumn.items) ? __spreadArrays(destColumn.items) : null;
                var removed = sourceItems.splice(source.index, 1)[0];
                var date = new Date().toISOString().replace('T', ' ').replace('Z', '');
                removed.lastchangestatusdate = date;
                removed.column_uuid = destination.droppableId;
                destItems.splice(destination.index, 0, removed);
                var sourceTotalRevenue = sourceItems.reduce(function (a, b) { return a + parseFloat(b.expected_revenue); }, 0);
                var destTotalRevenue = destItems.reduce(function (a, b) { return a + parseFloat(b.expected_revenue); }, 0);
                setDataColumn(Object.values(__assign(__assign({}, columns), (_b = {}, _b[sourceIndex] = __assign(__assign({}, sourceColumn), { total_revenue: sourceTotalRevenue, items: sourceItems }), _b[destIndex] = __assign(__assign({}, destColumn), { total_revenue: destTotalRevenue, items: destItems }), _b))));
                var cards_startingcolumn = sourceItems.map(function (x) { return x.leadid; }).join(',');
                var cards_finalcolumn = destItems.map(function (x) { return x.leadid; }).join(',');
                var startingcolumn_uuid = sourceColumn.column_uuid;
                var finalcolumn_uuid = destColumn.column_uuid;
                dispatch(actions_1.execute(helpers_1.updateColumnsLeads({ cards_startingcolumn: cards_startingcolumn, cards_finalcolumn: cards_finalcolumn, startingcolumn_uuid: startingcolumn_uuid, finalcolumn_uuid: finalcolumn_uuid, leadid: removed.leadid })));
            }
        }
    };
    var handleCloseLead = function (lead) {
        var callback = function () {
            var _a;
            var index = dataColumn.findIndex(function (c) { return c.column_uuid === lead.column_uuid; });
            var column = dataColumn[index];
            var copiedItems = __spreadArrays(column.items);
            var leadIndex = copiedItems.findIndex(function (l) { return l.leadid === lead.leadid; });
            copiedItems.splice(leadIndex, 1);
            var totalRevenue = copiedItems.reduce(function (a, b) { return a + parseFloat(b.expected_revenue); }, 0);
            var newData = Object.values(__assign(__assign({}, dataColumn), (_a = {}, _a[index] = __assign(__assign({}, column), { total_revenue: totalRevenue, items: copiedItems }), _a)));
            setDataColumn(newData);
            dispatch(actions_1.execute(helpers_1.insArchiveLead(lead)));
        };
        dispatch(actions_2.manageConfirmation({
            visible: true,
            question: t(keys_1.langKeys.confirmation_close),
            callback: callback
        }));
    };
    var handleDelete = function (lead) {
        var callback = function () {
            var _a;
            var index = dataColumn.findIndex(function (c) { return c.column_uuid === lead.column_uuid; });
            var column = dataColumn[index];
            var copiedItems = __spreadArrays(column.items);
            var leadIndex = copiedItems.findIndex(function (l) { return l.leadid === lead.leadid; });
            copiedItems.splice(leadIndex, 1);
            var totalRevenue = copiedItems.reduce(function (a, b) { return a + parseFloat(b.expected_revenue); }, 0);
            var newData = Object.values(__assign(__assign({}, dataColumn), (_a = {}, _a[index] = __assign(__assign({}, column), { total_revenue: totalRevenue, items: copiedItems }), _a)));
            setDataColumn(newData);
            dispatch(actions_1.execute(helpers_1.insLead2(__assign(__assign({}, lead), { status: 'ELIMINADO' }), "DELETE")));
        };
        dispatch(actions_2.manageConfirmation({
            visible: true,
            question: t(keys_1.langKeys.confirmation_delete),
            callback: callback
        }));
    };
    var handleInsert = function (infa, columns, setDataColumn) {
        var newIndex = columns.length;
        var uuid = helpers_1.uuidv4(); // from common/helpers
        var data = {
            id: uuid,
            description: infa.title,
            type: infa.type,
            status: 'ACTIVO',
            edit: true,
            index: newIndex,
            operation: 'INSERT'
        };
        var newColumn = {
            columnid: null,
            column_uuid: uuid,
            description: infa.title,
            status: 'ACTIVO',
            type: infa.type,
            globalid: '',
            index: newIndex,
            items: []
        };
        var unordeneddatacolumns = Object.values(__assign(__assign({}, columns), { newColumn: newColumn }));
        var ordereddata = __spreadArrays(unordeneddatacolumns.filter(function (x) { return x.type === "NEW"; }), unordeneddatacolumns.filter(function (x) { return x.type === "QUALIFIED"; }), unordeneddatacolumns.filter(function (x) { return x.type === "PROPOSITION"; }), unordeneddatacolumns.filter(function (x) { return x.type === "WON"; }));
        dispatch(actions_1.execute(helpers_1.insColumns(data)));
        setDataColumn(Object.values(ordereddata));
    };
    var hanldeDeleteColumn = function (column_uuid, delete_all) {
        var _a;
        if (delete_all === void 0) { delete_all = true; }
        if (column_uuid === '00000000-0000-0000-0000-000000000000')
            return;
        if (openDialog) {
            var columns_2 = __spreadArrays(dataColumn);
            var sourceIndex = columns_2.findIndex(function (c) { return c.column_uuid === column_uuid; });
            var sourceColumn = columns_2[sourceIndex];
            var newColumn = [];
            if (delete_all) {
                newColumn = columns_2;
            }
            else {
                var destColumn_1 = columns_2[0];
                var sourceItems = __spreadArrays(sourceColumn.items);
                var removed = sourceItems.splice(0);
                var newDestItems = __spreadArrays(destColumn_1.items).concat(removed);
                newDestItems.map(function (item) { return item.column_uuid = destColumn_1.column_uuid; });
                var destTotalRevenue = newDestItems.reduce(function (a, b) { return a + parseFloat(b.expected_revenue); }, 0);
                newColumn = Object.values(__assign(__assign({}, columns_2), (_a = {}, _a[sourceIndex] = __assign(__assign({}, sourceColumn), { items: sourceItems }), _a[0] = __assign(__assign({}, destColumn_1), { total_revenue: destTotalRevenue, items: newDestItems }), _a)));
            }
            setDataColumn(newColumn.filter(function (c) { return c.column_uuid !== column_uuid; }));
            dispatch(actions_1.execute(helpers_1.insColumns(__assign(__assign({}, sourceColumn), { status: 'ELIMINADO', delete_all: delete_all, id: sourceColumn.column_uuid, operation: 'DELETE' }))));
            setOpenDialog(false);
            return;
        }
        else {
            setDeleteColumn(column_uuid);
            setOpenDialog(true);
        }
    };
    var initialAsesorId = react_1.useMemo(function () {
        var _a, _b, _c;
        if (!user)
            return "";
        if ((_a = user.roledesc) === null || _a === void 0 ? void 0 : _a.includes("ASESOR"))
            return user.userid;
        else
            return otherParams.asesorid || ((_c = (_b = mainMulti.data[2]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.map(function (d) { return d.userid; }).includes(user === null || user === void 0 ? void 0 : user.userid)) ? ((user === null || user === void 0 ? void 0 : user.userid) || "") : "";
    }, [otherParams, user]);
    var mainPaginated = hooks_1.useSelector(function (state) { return state.main.mainPaginated; });
    var resExportData = hooks_1.useSelector(function (state) { return state.main.exportData; });
    var _w = react_1.useState(0), pageCount = _w[0], setPageCount = _w[1];
    var _x = react_1.useState(0), totalrow = _x[0], settotalrow = _x[1];
    var _y = react_1.useState({ pageSize: 20, pageIndex: 0, filters: {}, sorts: {}, daterange: null }), fetchDataAux = _y[0], setfetchDataAux = _y[1];
    var _z = react_1.useState(false), autoRefresh = _z[0], setAutoRefresh = _z[1];
    var _0 = react_1.useState(false), waitExport = _0[0], setWaitExport = _0[1];
    var voxiConnection = hooks_1.useSelector(function (state) { return state.voximplant.connection; });
    var callOnLine = hooks_1.useSelector(function (state) { return state.voximplant.callOnLine; });
    var userConnected = hooks_1.useSelector(function (state) { return state.inbox.userConnected; });
    var _1 = react_1.useState({
        asesorid: String(initialAsesorId),
        channel: otherParams.channels,
        contact: otherParams.contact,
        persontype: otherParams.persontype
    }), allParameters = _1[0], setAllParametersPrivate = _1[1];
    var _2 = react_1.useState({}), selectedRows = _2[0], setSelectedRows = _2[1];
    var _3 = react_1.useState([]), personsSelected = _3[0], setPersonsSelected = _3[1];
    var _4 = react_1.useState({ name: '', open: false, payload: null }), gridModal = _4[0], setGridModal = _4[1];
    var _5 = react_1.useState(), configuration = _5[0], setConfiguration = _5[1];
    var passConfiguration = function (value) {
        setConfiguration(value);
    };
    var setAllParameters = react_1.useCallback(function (prop) {
        var _a;
        if (!user)
            return;
        if (((_a = user.roledesc) === null || _a === void 0 ? void 0 : _a.includes("ASESOR")) && prop.asesorid !== String(user.userid || "")) {
            setAllParametersPrivate(__assign(__assign({}, prop), { asesorid: String(user.userid || "") }));
        }
        else {
            setAllParametersPrivate(prop);
        }
    }, [user]);
    var CustomCellRender = function (_a) {
        var column = _a.column, row = _a.row;
        switch (column.id) {
            case 'status':
                return (react_1["default"].createElement("div", { style: { cursor: 'pointer' } }, (t(("status_" + row[column.id]).toLowerCase()) || "").toUpperCase()));
            case 'contact_name':
                return (react_1["default"].createElement("div", { style: { cursor: 'pointer' } },
                    react_1["default"].createElement("div", null,
                        t(keys_1.langKeys.name),
                        ": ",
                        row['contact_name']),
                    Boolean(row['persontype']) && react_1["default"].createElement("div", null,
                        t(keys_1.langKeys.personType),
                        ": ",
                        row['persontype']),
                    react_1["default"].createElement("div", null,
                        t(keys_1.langKeys.email),
                        ": ",
                        row['email']),
                    react_1["default"].createElement("div", null,
                        t(keys_1.langKeys.phone),
                        ": ",
                        row['phone']),
                    react_1["default"].createElement(lab_1.Rating, { name: "simple-controlled", max: 3, value: row['priority'] === 'LOW' ? 1 : row['priority'] === 'MEDIUM' ? 2 : row['priority'] === 'HIGH' ? 3 : 1, readOnly: true }),
                    react_1["default"].createElement("div", null,
                        t(keys_1.langKeys.assignedTo),
                        ": ",
                        row['asesorname'])));
            case 'tags':
                return (react_1["default"].createElement("div", { style: { cursor: 'pointer' } }, row[column.id] !== '' && row[column.id].split(',').map(function (t, i) { return (react_1["default"].createElement("span", { key: "lead" + row['leadid'] + row[column.id] + i, className: classes.tag }, t)); })));
            case 'comments':
                return (react_1["default"].createElement("div", { style: { cursor: 'pointer' } },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("b", null,
                            t(keys_1.langKeys.lastnote),
                            " (",
                            helpers_1.convertLocalDate(row['notedate']).toLocaleString(undefined, {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                            }),
                            "):"),
                        " ",
                        row['notedescription']),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("b", null,
                            t(keys_1.langKeys.nextprogramedactivity),
                            " (",
                            helpers_1.convertLocalDate(row['activitydate']).toLocaleString(undefined, {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                            }),
                            "):"),
                        " ",
                        row['activitydescription'])));
            default:
                return (react_1["default"].createElement("div", { style: { cursor: 'pointer' } }, column.sortType === "datetime" && Boolean(row[column.id])
                    ? helpers_1.convertLocalDate(row[column.id]).toLocaleString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric"
                    })
                    : row[column.id]));
        }
    };
    var cell = function (props) {
        var column = props.cell.column;
        var row = props.cell.row.original;
        return (react_1["default"].createElement(CustomCellRender, { column: column, row: row }));
    };
    var onClickRow = function (row) {
        if (row.leadid) {
            history.push({ pathname: paths_1["default"].CRM_EDIT_LEAD.resolve(row.leadid) });
        }
    };
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.opportunity),
            accessor: 'opportunity',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.lastUpdate),
            accessor: 'changedate',
            type: 'date',
            sortType: 'datetime',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.customer),
            accessor: 'contact_name',
            NoFilter: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.phase),
            accessor: 'phase',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.status),
            accessor: 'status',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.tags),
            accessor: 'tags',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.comments),
            accessor: 'comments',
            NoFilter: true,
            NoSort: true,
            Cell: cell
        },
        {
            accessor: 'actions',
            NoFilter: true,
            isComponent: true,
            Cell: function (props) {
                var row = props.cell.row.original;
                if (row.status === 'ACTIVO') {
                    return (react_1["default"].createElement(react_1["default"].Fragment, null, !isIncremental &&
                        react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("div", { style: { display: 'flex' } },
                                react_1["default"].createElement(core_1.IconButton, { "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", size: "small", onClick: function (e) {
                                        e.stopPropagation();
                                        setGridModal({ name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'HSM' } });
                                    } },
                                    react_1["default"].createElement(icons_2.WhatsappIcon, { width: 24, style: { fill: 'rgba(0, 0, 0, 0.54)' } })),
                                react_1["default"].createElement(core_1.IconButton, { "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", size: "small", onClick: function (e) {
                                        e.stopPropagation();
                                        setGridModal({ name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'MAIL' } });
                                    } },
                                    react_1["default"].createElement(icons_1.Mail, { color: "action" })),
                                react_1["default"].createElement(core_1.IconButton, { "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", size: "small", onClick: function (e) {
                                        e.stopPropagation();
                                        setGridModal({ name: 'MESSAGE', open: true, payload: { persons: [row], messagetype: 'SMS' } });
                                    } },
                                    react_1["default"].createElement(icons_1.Sms, { color: "action" }))),
                            react_1["default"].createElement("div", { style: { display: 'flex' } },
                                react_1["default"].createElement(core_1.IconButton, { "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", size: "small", onClick: function (e) {
                                        e.stopPropagation();
                                        setGridModal({ name: 'ACTIVITY', open: true, payload: { leadid: row['leadid'] } });
                                    } },
                                    react_1["default"].createElement(icons_1.AccessTime, { titleAccess: t(keys_1.langKeys.activities), color: "action" })),
                                react_1["default"].createElement(core_1.IconButton, { "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", size: "small", onClick: function (e) {
                                        e.stopPropagation();
                                        setGridModal({ name: 'NOTE', open: true, payload: { leadid: row['leadid'] } });
                                    } },
                                    react_1["default"].createElement(icons_1.Note, { titleAccess: t(keys_1.langKeys.logNote), color: "action" })),
                                (!voxiConnection.error && !voxiConnection.loading && userConnected && !callOnLine && Boolean(row.phone)) &&
                                    react_1["default"].createElement(core_1.IconButton, { "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", size: "small", onClick: function (e) {
                                            e.stopPropagation();
                                            dispatch(actions_3.setPhoneNumber(row.phone));
                                            dispatch(actions_3.setModalCall(true));
                                        } },
                                        react_1["default"].createElement(Phone_1["default"], { color: "action", titleAccess: t(keys_1.langKeys.make_call) }))))));
                }
                else {
                    return null;
                }
            }
        },
    ]; }, [voxiConnection, callOnLine]);
    var fetchGridData = function (_a) {
        var pageSize = _a.pageSize, pageIndex = _a.pageIndex, filters = _a.filters, sorts = _a.sorts, daterange = _a.daterange;
        setfetchDataAux(__assign(__assign(__assign({}, fetchDataAux), { daterange: daterange }), { pageSize: pageSize, pageIndex: pageIndex, filters: filters, sorts: sorts }));
        dispatch(actions_1.getCollectionPaginated(helpers_1.getPaginatedLead(__assign({ startdate: daterange.startDate, enddate: daterange.endDate, sorts: sorts, filters: filters, take: pageSize, skip: pageIndex * pageSize }, allParameters))));
    };
    var fetchBoardLeadsWithFilterGRID = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var newParams, key, value, colFilters, key;
        return __generator(this, function (_a) {
            try {
                newParams = new URLSearchParams(location.search);
                for (key in fetchDataAux) {
                    value = fetchDataAux[key];
                    if (key === 'filters' || value === undefined || value === null || key === 'sorts' || key === 'daterange')
                        continue;
                    newParams.set(key, String(value));
                }
                colFilters = fetchDataAux.filters;
                for (key in colFilters) {
                    if (typeof colFilters[key] === 'object' && 'value' in colFilters[key] && 'operator' in colFilters[key]) {
                        newParams.set(key, String(colFilters[key].value));
                        newParams.set(key + "-operator", String(colFilters[key].operator));
                    }
                }
                newParams.set('asesorid', String(allParameters.asesorid));
                newParams.set('channels', String(allParameters.channel));
                newParams.set('contact', String(allParameters.contact));
                history.push({ search: newParams.toString() });
                setModalOpenGRID(false);
                fetchGridData(__assign({}, fetchDataAux));
            }
            catch (error) {
                console.error("Error al aplicar filtros:", error);
            }
            return [2 /*return*/];
        });
    }); }, [boardFilter, dispatch, history, location.search, setModalOpenGRID, sortParams, user, fetchGridData]);
    react_1.useEffect(function () {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);
    var triggerExportData = function (_a) {
        var filters = _a.filters, sorts = _a.sorts, daterange = _a.daterange;
        var columnsExport = __spreadArrays(columns.filter(function (x) { return !x.isComponent && x.accessor !== 'comments'; }).map(function (x) { return ({
            key: x.accessor,
            alias: x.Header
        }); }), [
            { key: 'notedescription', alias: t(keys_1.langKeys.notedescription) },
            { key: 'activitydescription', alias: t(keys_1.langKeys.activitydescription) },
            { key: 'estimatedimplementationdate', alias: t(keys_1.langKeys.estimatedimplementationdate) },
            { key: 'estimatedbillingdate', alias: t(keys_1.langKeys.estimatedbillingdate) },
        ]);
        dispatch(actions_1.exportData(helpers_1.getLeadExport(__assign({ startdate: daterange.startDate, enddate: daterange.endDate, sorts: sorts, filters: filters }, allParameters)), "", "excel", false, columnsExport));
        dispatch(actions_2.showBackdrop(true));
        setWaitExport(true);
    };
    react_1.useEffect(function () {
        var _a;
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(actions_2.showBackdrop(false));
                setWaitExport(false);
                (_a = resExportData.url) === null || _a === void 0 ? void 0 : _a.split(",").forEach(function (x) { return window.open(x, '_blank'); });
            }
            else if (resExportData.error) {
                var errormessage = t(resExportData.code || "error_unexpected_error", { module: t(keys_1.langKeys.blacklist).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);
    react_1.useEffect(function () {
        if (!(Object.keys(selectedRows).length === 0 && personsSelected.length === 0)) {
            setPersonsSelected(function (p) { return Object.keys(selectedRows).map(function (x) { return mainPaginated.data.find(function (y) { return y.leadid === parseInt(x); }) || p.find(function (y) { return y.leadid === parseInt(x); }) || {}; }); });
        }
    }, [selectedRows]);
    react_1.useEffect(function () {
        var p = new URLSearchParams(location.search);
        p.set('display', display);
        history.push({ search: p.toString() });
    }, [display, history]);
    var campaigns = react_1.useMemo(function () {
        var _a, _b;
        if (!((_a = mainMulti.data[4]) === null || _a === void 0 ? void 0 : _a.data) || ((_b = mainMulti.data[4]) === null || _b === void 0 ? void 0 : _b.key) !== "UFN_CAMPAIGN_LST")
            return [];
        return mainMulti.data[4].data.sort(function (a, b) {
            return a.description.localeCompare(b.description);
        });
    }, [mainMulti.data[4]]);
    var tags = react_1.useMemo(function () {
        var _a, _b;
        if (!((_a = mainMulti.data[6]) === null || _a === void 0 ? void 0 : _a.data) || ((_b = mainMulti.data[6]) === null || _b === void 0 ? void 0 : _b.key) !== "UFN_LEAD_TAGSDISTINCT_SEL")
            return [];
        return mainMulti.data[6].data.sort(function (a, b) {
            var _a;
            return ((_a = a.tags) === null || _a === void 0 ? void 0 : _a.localeCompare(b.tags || '')) || 0;
        });
    }, [mainMulti.data[6]]);
    var channels = react_1.useMemo(function () {
        var _a, _b;
        if (!((_a = mainMulti.data[3]) === null || _a === void 0 ? void 0 : _a.data) || ((_b = mainMulti.data[3]) === null || _b === void 0 ? void 0 : _b.key) !== "UFN_COMMUNICATIONCHANNEL_LST")
            return [];
        return mainMulti.data[3].data.sort(function (a, b) {
            return a.communicationchanneldesc.localeCompare(b.communicationchanneldesc);
        });
    }, [mainMulti.data[3]]);
    var userType = react_1.useMemo(function () {
        var _a, _b;
        if (!((_a = mainMulti.data[7]) === null || _a === void 0 ? void 0 : _a.data) || ((_b = mainMulti.data[7]) === null || _b === void 0 ? void 0 : _b.key) !== "UFN_DOMAIN_LST_VALORES")
            return [];
        return (mainMulti.data[7].data);
    }, [mainMulti.data[7]]);
    var _6 = react_1["default"].useState(null), anchorElSeButtons = _6[0], setAnchorElSeButtons = _6[1];
    var _7 = react_1.useState(false), openSeButtons = _7[0], setOpenSeButtons = _7[1];
    var handleClickSeButtons = function (event) {
        setAnchorElSeButtons(anchorElSeButtons ? null : event.currentTarget);
        setOpenSeButtons(function (prevOpen) { return !prevOpen; });
    };
    return (react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column' } },
        react_1["default"].createElement("div", { style: { marginBottom: '10px' } },
            react_1["default"].createElement("div", { style: { position: 'fixed', right: '25px', display: "flex", paddingBottom: '20px' } },
                react_1["default"].createElement(core_1.Tooltip, { title: t(keys_1.langKeys.filters) + " ", arrow: true, placement: "top" },
                    react_1["default"].createElement(core_1.IconButton, { color: "default", onClick: function () {
                            if (display === 'BOARD') {
                                setModalOpenBOARD(true);
                            }
                            else if (display === 'GRID') {
                                setModalOpenGRID(true);
                            }
                        }, style: { padding: '5px' } },
                        react_1["default"].createElement(Tune_1["default"], null))),
                react_1["default"].createElement("div", { style: { height: '20px', borderRight: '1px solid #ccc', margin: '6px 7px' } }),
                react_1["default"].createElement(core_1.Tooltip, { title: t(keys_1.langKeys.kanbanview) + " ", arrow: true, placement: "top" },
                    react_1["default"].createElement(core_1.IconButton, { color: "default", disabled: display === 'BOARD', onClick: function () { return setDisplay('BOARD'); }, style: { padding: '5px' } },
                        react_1["default"].createElement(icons_1.ViewColumn, null))),
                react_1["default"].createElement(core_1.Tooltip, { title: t(keys_1.langKeys.listview) + " ", arrow: true, placement: "top" },
                    react_1["default"].createElement(core_1.IconButton, { color: "default", disabled: display === 'GRID', onClick: function () { return setDisplay('GRID'); }, style: { padding: '5px' } },
                        react_1["default"].createElement(icons_1.ViewList, null))))),
        display === 'BOARD' &&
            react_1["default"].createElement("div", { style: { display: "flex", flexDirection: 'column', height: "100%" } },
                react_1["default"].createElement("div", { className: classes.canvasFiltersHeader },
                    react_1["default"].createElement("div", { style: { flexGrow: 1 } }),
                    react_1["default"].createElement(components_2.DialogZyx, { open: isModalOpenBOARD, title: t(keys_1.langKeys.filters), buttonText1: t(keys_1.langKeys.close), buttonText2: t(keys_1.langKeys.apply) + " " + t(keys_1.langKeys.filters), handleClickButton1: function () { return setModalOpenBOARD(false); }, handleClickButton2: fetchBoardLeadsWithFilter, maxWidth: "sm", buttonStyle1: { marginBottom: '0.3rem' }, buttonStyle2: { marginRight: '1rem', marginBottom: '0.3rem' } },
                        react_1["default"].createElement("div", { className: "row-zyx" },
                            (user && !((_a = user.roledesc) === null || _a === void 0 ? void 0 : _a.includes("ASESOR"))) &&
                                react_1["default"].createElement(components_2.FieldMultiSelect, { variant: "outlined", label: t(keys_1.langKeys.agent), className: "col-6", valueDefault: boardFilter.asesorid, onChange: function (value) { return setBoardFilter(function (prev) { return (__assign(__assign({}, prev), { asesorid: value === null || value === void 0 ? void 0 : value.map(function (o) { return o['userid']; }).join(',') })); }); }, data: ((_c = (_b = mainMulti.data[2]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.sort(function (a, b) { var _a, _b; return ((_a = a === null || a === void 0 ? void 0 : a.fullname) === null || _a === void 0 ? void 0 : _a.toLowerCase()) > ((_b = b === null || b === void 0 ? void 0 : b.fullname) === null || _b === void 0 ? void 0 : _b.toLowerCase()) ? 1 : -1; })) || [], optionDesc: 'fullname', optionValue: 'userid', disabled: Boolean((_d = user === null || user === void 0 ? void 0 : user.roledesc) === null || _d === void 0 ? void 0 : _d.includes("ASESOR")) || false }),
                            react_1["default"].createElement(components_2.FieldSelect, { variant: "outlined", label: t(keys_1.langKeys.campaign), className: "col-6", valueDefault: boardFilter.campaign, onChange: function (v) { return setBoardFilter(function (prev) { return (__assign(__assign({}, prev), { campaign: (v === null || v === void 0 ? void 0 : v.id) || 0 })); }); }, data: campaigns, loading: mainMulti.loading, optionDesc: "description", optionValue: "id" })),
                        react_1["default"].createElement("div", { className: "row-zyx" },
                            react_1["default"].createElement(components_2.FieldMultiSelect, { variant: "outlined", label: t(keys_1.langKeys.product, { count: 2 }), className: "col-6", valueDefault: boardFilter.products, onChange: function (v) {
                                    var products = (v === null || v === void 0 ? void 0 : v.map(function (o) { return o.domainvalue; }).join(',')) || '';
                                    setBoardFilter(function (prev) { return (__assign(__assign({}, prev), { products: products })); });
                                }, data: ((_e = mainMulti.data[5]) === null || _e === void 0 ? void 0 : _e.data) || [], loading: mainMulti.loading, optionDesc: "domaindesc", optionValue: "domainvalue" }),
                            react_1["default"].createElement(components_2.FieldMultiSelect, { variant: "outlined", label: t(keys_1.langKeys.tag, { count: 2 }), className: "col-6", valueDefault: boardFilter.tags, onChange: function (v) {
                                    var tags = (v === null || v === void 0 ? void 0 : v.map(function (o) { return o.tags; }).join(',')) || '';
                                    setBoardFilter(function (prev) { return (__assign(__assign({}, prev), { tags: tags })); });
                                }, data: tags, loading: mainMulti.loading, optionDesc: "tags", optionValue: "tags" })),
                        react_1["default"].createElement("div", { className: "row-zyx", style: { marginBottom: '0' } },
                            react_1["default"].createElement(components_2.FieldEdit, { size: "small", variant: "outlined", valueDefault: boardFilter.customer, label: t(keys_1.langKeys.customer), className: "col-6", disabled: mainMulti.loading, onChange: function (v) { return setBoardFilter(function (prev) { return (__assign(__assign({}, prev), { customer: v })); }); } }),
                            react_1["default"].createElement(components_2.FieldMultiSelect, { variant: "outlined", label: t(keys_1.langKeys.personType, { count: 2 }), className: "col-6", valueDefault: boardFilter.persontype, onChange: function (v) {
                                    var persontype = (v === null || v === void 0 ? void 0 : v.map(function (o) { return o.domainvalue; }).join(',')) || '';
                                    setBoardFilter(function (prev) { return (__assign(__assign({}, prev), { persontype: persontype })); });
                                }, data: ((_f = mainMulti.data[7]) === null || _f === void 0 ? void 0 : _f.data) || [], loading: mainMulti.loading, optionDesc: "domainvalue", optionValue: "domainvalue" })))),
                !isIncremental &&
                    react_1["default"].createElement(components_1.AddColumnTemplate, { onSubmit: function (data) {
                            handleInsert(data, dataColumn, setDataColumn);
                        }, updateSortParams: updateSortParams, passConfiguration: passConfiguration, ordertype: (_g = mainMulti === null || mainMulti === void 0 ? void 0 : mainMulti.data[8]) === null || _g === void 0 ? void 0 : _g.data, orderby: (_h = mainMulti === null || mainMulti === void 0 ? void 0 : mainMulti.data[9]) === null || _h === void 0 ? void 0 : _h.data }),
                react_1["default"].createElement("div", { style: { borderRadius: '2rem' } },
                    react_1["default"].createElement("div", { className: classes.columnsTitles },
                        react_1["default"].createElement("div", { className: classes.newTitle, style: { minWidth: 310, maxWidth: 400 } },
                            react_1["default"].createElement("div", { className: classes.greyPart },
                                react_1["default"].createElement("div", { style: { display: 'flex', alignContent: 'center', justifyContent: 'center' } },
                                    react_1["default"].createElement("div", { style: { paddingTop: '4px' } }, t(keys_1.langKeys["new"]))))),
                        react_1["default"].createElement("div", { className: classes.otherTitles, style: { minWidth: 310 * dataColumn.filter(function (x) { return x.type === "QUALIFIED"; }).length + 21 * (dataColumn.filter(function (x) { return x.type === "QUALIFIED"; }).length - 1), maxWidth: 400 * dataColumn.filter(function (x) { return x.type === "QUALIFIED"; }).length + 21 * (dataColumn.filter(function (x) { return x.type === "QUALIFIED"; }).length - 1) } },
                            react_1["default"].createElement("div", { className: classes.otherGreyPart },
                                react_1["default"].createElement("div", { style: { display: 'flex', alignContent: 'center', justifyContent: 'center' } },
                                    react_1["default"].createElement("div", { style: { paddingTop: '4px' } },
                                        " ",
                                        t(keys_1.langKeys.qualified),
                                        " ")))),
                        react_1["default"].createElement("div", { className: classes.otherTitles, style: { minWidth: 310 * dataColumn.filter(function (x) { return x.type === "PROPOSITION"; }).length + 21 * (dataColumn.filter(function (x) { return x.type === "PROPOSITION"; }).length - 1), maxWidth: 400 * dataColumn.filter(function (x) { return x.type === "PROPOSITION"; }).length + 21 * (dataColumn.filter(function (x) { return x.type === "PROPOSITION"; }).length - 1) } },
                            react_1["default"].createElement("div", { className: classes.otherGreyPart },
                                react_1["default"].createElement("div", { style: { display: 'flex', alignContent: 'center', justifyContent: 'center' } },
                                    react_1["default"].createElement("div", { style: { paddingTop: '4px' } },
                                        " ",
                                        t(keys_1.langKeys.proposition),
                                        " ")))),
                        react_1["default"].createElement("div", { className: classes.otherTitles, style: { minWidth: 310 * dataColumn.filter(function (x) { return x.type === "WON"; }).length + 21 * (dataColumn.filter(function (x) { return x.type === "WON"; }).length - 1), maxWidth: 400 * dataColumn.filter(function (x) { return x.type === "WON"; }).length + 21 * (dataColumn.filter(function (x) { return x.type === "WON"; }).length - 1) } },
                            react_1["default"].createElement("div", { className: classes.otherGreyPart },
                                react_1["default"].createElement("div", { style: { display: 'flex', alignContent: 'center', justifyContent: 'center' } },
                                    react_1["default"].createElement("div", { style: { paddingTop: '4px' } },
                                        " ",
                                        t(keys_1.langKeys.won),
                                        " "))))),
                    react_1["default"].createElement(react_beautiful_dnd_1.DragDropContext, { onDragEnd: function (result) { return onDragEnd(result, dataColumn, setDataColumn); } },
                        react_1["default"].createElement(react_beautiful_dnd_1.Droppable, { droppableId: "all-columns", direction: "horizontal", type: "column" }, function (provided) { return (react_1["default"].createElement("div", __assign({ style: { display: 'flex' } }, provided.droppableProps, { ref: provided.innerRef }), dataColumn.map(function (column, index) { return (react_1["default"].createElement("div", { key: index, className: classes.oportunityList },
                            react_1["default"].createElement(DraggablesCategories, { isIncremental: isIncremental, deletable: dataColumn.filter(function (x) { return x.type === column.type; }).length > 1, column: column, index: index, hanldeDeleteColumn: hanldeDeleteColumn, handleDelete: handleDelete, handleCloseLead: handleCloseLead, sortParams: sortParams, configuration: configuration }))); }))); }))),
                react_1["default"].createElement(components_2.DialogZyx3Opt, { open: openDialog, title: t(keys_1.langKeys.confirmation), buttonText1: t(keys_1.langKeys.cancel), buttonText2: t(keys_1.langKeys.negative), buttonText3: t(keys_1.langKeys.affirmative), handleClickButton1: function () { return setOpenDialog(false); }, handleClickButton2: function () { return hanldeDeleteColumn(deleteColumn, false); }, handleClickButton3: function () { return hanldeDeleteColumn(deleteColumn, true); }, maxWidth: 'xs' },
                    react_1["default"].createElement("div", null, t(keys_1.langKeys.question_delete_all_items)),
                    react_1["default"].createElement("div", { className: "row-zyx" }))),
        display === 'GRID' &&
            react_1["default"].createElement("div", { style: { width: 'inherit', marginTop: '1.3rem' } },
                react_1["default"].createElement("div", { className: classes.canvasFiltersHeader },
                    react_1["default"].createElement("div", { style: { flexGrow: 1 } }),
                    react_1["default"].createElement(components_2.DialogZyx, { open: isModalOpenGRID, title: t(keys_1.langKeys.filters) + " ", buttonText1: t(keys_1.langKeys.close), buttonText2: t(keys_1.langKeys.apply) + " " + t(keys_1.langKeys.filters), handleClickButton1: function () { return setModalOpenGRID(false); }, handleClickButton2: fetchBoardLeadsWithFilterGRID, maxWidth: "sm", buttonStyle1: { marginBottom: '0.3rem' }, buttonStyle2: { marginRight: '1rem', marginBottom: '0.3rem' } },
                        react_1["default"].createElement("div", { className: "row-zyx" },
                            (user && !((_j = user.roledesc) === null || _j === void 0 ? void 0 : _j.includes("ASESOR"))) &&
                                react_1["default"].createElement(components_2.FieldMultiSelect, { variant: "outlined", label: t(keys_1.langKeys.agent), className: "col-6", valueDefault: allParameters.asesorid, onChange: function (value) { setAllParameters(__assign(__assign({}, allParameters), { asesorid: value === null || value === void 0 ? void 0 : value.map(function (o) { return o['userid']; }).join(',') })); }, data: ((_l = (_k = mainMulti.data[2]) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.sort(function (a, b) { var _a, _b; return ((_a = a === null || a === void 0 ? void 0 : a.fullname) === null || _a === void 0 ? void 0 : _a.toLowerCase()) > ((_b = b === null || b === void 0 ? void 0 : b.fullname) === null || _b === void 0 ? void 0 : _b.toLowerCase()) ? 1 : -1; })) || [], optionDesc: 'fullname', optionValue: 'userid', disabled: Boolean((_m = user === null || user === void 0 ? void 0 : user.roledesc) === null || _m === void 0 ? void 0 : _m.includes("ASESOR")) || false }),
                            react_1["default"].createElement(components_2.FieldMultiSelect, { variant: "outlined", label: t(keys_1.langKeys.channel), className: "col-6", valueDefault: allParameters.channel, onChange: function (value) { return setAllParameters(__assign(__assign({}, allParameters), { channel: value === null || value === void 0 ? void 0 : value.map(function (o) { return o['communicationchannelid']; }).join(',') })); }, data: channels, optionDesc: 'communicationchanneldesc', optionValue: 'communicationchannelid' })),
                        react_1["default"].createElement("div", { className: "row-zyx", style: { marginBottom: '0' } },
                            react_1["default"].createElement(components_2.FieldEdit, { size: "small", variant: "outlined", label: t(keys_1.langKeys.customer), className: "col-6", valueDefault: allParameters.contact, onChange: function (value) { return setAllParameters(__assign(__assign({}, allParameters), { contact: value })); } }),
                            react_1["default"].createElement(components_2.FieldMultiSelect, { variant: "outlined", label: t(keys_1.langKeys.personType, { count: 2 }), className: "col-6", valueDefault: allParameters.persontype, onChange: function (v) {
                                    var persontype = (v === null || v === void 0 ? void 0 : v.map(function (o) { return o.domainvalue; }).join(',')) || '';
                                    setAllParameters(__assign(__assign({}, allParameters), { persontype: persontype }));
                                }, data: userType, optionDesc: "domainvalue", optionValue: "domainvalue" })))),
                react_1["default"].createElement(table_paginated_1["default"], { columns: columns, data: mainPaginated.data, totalrow: totalrow, loading: mainPaginated.loading, pageCount: pageCount, filterrange: true, download: true, FiltersElement: react_1["default"].createElement(react_1["default"].Fragment, null), fetchData: fetchGridData, autotrigger: true, autoRefresh: { value: autoRefresh, callback: function (value) { return setAutoRefresh(value); } }, exportPersonalized: triggerExportData, useSelection: true, selectionFilter: { key: 'status', value: 'ACTIVO' }, selectionKey: selectionKey, onFilterChange: function (f) {
                        var params = table_paginated_1.buildQueryFilters(f, location.search);
                        params.set('asesorid', String(allParameters.asesorid));
                        params.set('channels', String(allParameters.channel));
                        params.set('contact', String(allParameters.contact));
                        history.push({ search: params.toString() });
                    }, setSelectedRows: setSelectedRows, onClickRow: onClickRow, initialEndDate: params.endDate, initialStartDate: params.startDate, initialPageIndex: params.page, ButtonsElement: react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement("div", { style: { display: 'flex', gap: 8 } }),
                        !isIncremental &&
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement(core_1.IconButton, { "aria-label": "more", id: "long-button", onClick: handleClickSeButtons, style: { backgroundColor: openSeButtons ? '#F6E9FF' : undefined, color: openSeButtons ? '#7721AD' : undefined } },
                                    react_1["default"].createElement(MoreVert_1["default"], null)),
                                !isIncremental &&
                                    react_1["default"].createElement("div", { style: { display: 'flex', gap: 8 } },
                                        react_1["default"].createElement(core_1.Popper, { open: openSeButtons, anchorEl: anchorElSeButtons, placement: "bottom", transition: true, style: { marginRight: '1rem' } }, function (_a) {
                                            var TransitionProps = _a.TransitionProps;
                                            return (react_1["default"].createElement(core_1.Paper, __assign({}, TransitionProps, { elevation: 5 }),
                                                react_1["default"].createElement(core_1.MenuItem, { disabled: mainPaginated.loading || Object.keys(selectedRows).length === 0, style: { padding: '0.7rem 1rem', fontSize: '0.96rem' }, onClick: function () { return setGridModal({ name: 'MESSAGE', open: true, payload: { persons: personsSelected, messagetype: 'HSM' } }); } },
                                                    react_1["default"].createElement(core_1.ListItemIcon, null,
                                                        react_1["default"].createElement(icons_2.WhatsappIcon, { fontSize: "small", style: { fill: 'grey', height: '23px' } })),
                                                    react_1["default"].createElement(core_1.Typography, { variant: "inherit" }, t(keys_1.langKeys.send_hsm))),
                                                react_1["default"].createElement(core_1.Divider, null),
                                                react_1["default"].createElement(core_1.MenuItem, { disabled: mainPaginated.loading || Object.keys(selectedRows).length === 0, style: { padding: '0.7rem 1rem', fontSize: '0.96rem' }, onClick: function () { return setGridModal({ name: 'MESSAGE', open: true, payload: { persons: personsSelected, messagetype: 'MAIL' } }); } },
                                                    react_1["default"].createElement(core_1.ListItemIcon, null,
                                                        react_1["default"].createElement(icons_1.Mail, { fontSize: "small", style: { fill: 'grey', height: '25px' } })),
                                                    react_1["default"].createElement(core_1.Typography, { variant: "inherit" }, t(keys_1.langKeys.send_mail))),
                                                react_1["default"].createElement(core_1.Divider, null),
                                                react_1["default"].createElement(core_1.MenuItem, { disabled: mainPaginated.loading || Object.keys(selectedRows).length === 0, style: { padding: '0.7rem 1rem', fontSize: '0.96rem' }, onClick: function () { return setGridModal({ name: 'MESSAGE', open: true, payload: { persons: personsSelected, messagetype: 'SMS' } }); } },
                                                    react_1["default"].createElement(core_1.ListItemIcon, null,
                                                        react_1["default"].createElement(icons_1.Sms, { fontSize: "small", style: { fill: 'grey', height: '25px' } })),
                                                    react_1["default"].createElement(core_1.Typography, { variant: "inherit", noWrap: true }, t(keys_1.langKeys.send_sms)))));
                                        })))) }),
                gridModal.name === 'ACTIVITY' && react_1["default"].createElement(Modals_1.NewActivityModal, { gridModalProps: gridModal, setGridModal: setGridModal, setAutoRefresh: setAutoRefresh }),
                gridModal.name === 'NOTE' && react_1["default"].createElement(Modals_1.NewNoteModal, { gridModalProps: gridModal, setGridModal: setGridModal, setAutoRefresh: setAutoRefresh }),
                gridModal.name === 'MESSAGE' && react_1["default"].createElement(Modals_1.DialogSendTemplate, { gridModalProps: gridModal, setGridModal: setGridModal }))));
};
exports["default"] = CRM;
