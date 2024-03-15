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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.RenderCustomizedLabel = void 0;
var react_1 = require("react");
var hooks_1 = require("hooks");
var react_redux_1 = require("react-redux");
var components_1 = require("components");
var helpers_1 = require("common/helpers");
var table_simple_1 = require("../components/fields/table-simple");
var styles_1 = require("@material-ui/core/styles");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var actions_1 = require("store/main/actions");
var recharts_1 = require("recharts");
var actions_2 = require("store/popus/actions");
var helpers_2 = require("common/helpers");
var List_1 = require("@material-ui/icons/List");
var Assessment_1 = require("@material-ui/icons/Assessment");
var Clear_1 = require("@material-ui/icons/Clear");
var Tooltip_1 = require("@material-ui/core/Tooltip");
var icons_1 = require("@material-ui/icons");
var core_1 = require("@material-ui/core");
var react_hook_form_1 = require("react-hook-form");
var Zoom_1 = require("@material-ui/core/Zoom");
var table_paginated_1 = require("components/fields/table-paginated");
var DialogInteractions_1 = require("components/inbox/DialogInteractions");
var core_2 = require("@material-ui/core");
var UNIQUECONTACTS = 'UNIQUECONTACTS';
var useStyles = styles_1.makeStyles(function (theme) {
    var _a;
    return ({
        containerHeader: {
            padding: theme.spacing(1)
        },
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
        itemDate: {
            minHeight: 40,
            height: 40,
            border: '1px solid #bfbfc0',
            borderRadius: 4,
            color: 'rgb(143, 146, 161)'
        },
        filterComponent: {
            minWidth: '220px',
            maxWidth: '260px'
        },
        numericCell: {
            textAlign: 'end',
            paddingRight: '40px'
        },
        containerHeaderItem: (_a = {
                backgroundColor: '#FFF',
                padding: 8,
                display: 'block',
                flexWrap: 'wrap',
                gap: 8
            },
            _a[theme.breakpoints.up('sm')] = {
                display: 'flex'
            },
            _a),
        labellink: {
            color: '#7721ad',
            textDecoration: 'underline',
            cursor: 'pointer'
        },
        fieldElipsis: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: 230
        }
    });
});
var TableResume = function (_a) {
    var data = _a.data;
    var t = react_i18next_1.useTranslation().t;
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.month),
            accessor: 'name',
            NoFilter: true,
            Cell: function (props) {
                var row = props.cell.row.original;
                return (react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 4 } },
                    react_1["default"].createElement("div", { style: { width: 15, height: 15, backgroundColor: row.color } }), row === null || row === void 0 ? void 0 :
                    row.name));
            }
        },
        {
            Header: t(keys_1.langKeys.quantity),
            accessor: 'value',
            NoFilter: true,
            type: 'number'
        },
        {
            Header: t(keys_1.langKeys.percentage),
            accessor: 'percentage',
            NoFilter: true,
            type: 'number',
            Cell: function (props) {
                var row = props.cell.row.original || {};
                return row.percentage.toFixed(2) + "%";
            }
        },
    ]; }, []);
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(table_simple_1["default"], { columns: columns, data: data, download: false, filterGeneral: false, toolsFooter: false })));
};
var SummaryGraphic = function (_a) {
    var _b, _c;
    var openModal = _a.openModal, setView = _a.setView, setOpenModal = _a.setOpenModal, columns = _a.columns, setGraphicType = _a.setGraphicType;
    var t = react_i18next_1.useTranslation().t;
    var _d = react_hook_form_1.useForm({
        defaultValues: {
            graphictype: 'BAR',
            column: 'month'
        }
    }), register = _d.register, handleSubmit = _d.handleSubmit, setValue = _d.setValue, getValues = _d.getValues, errors = _d.formState.errors;
    react_1.useEffect(function () {
        register('graphictype', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        register('column', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
    }, [register]);
    var handleCancelModal = function () {
        setOpenModal(false);
    };
    var handleAcceptModal = handleSubmit(function (data) {
        setOpenModal(false);
        setGraphicType(data.graphictype);
        setView(data.graphictype);
    });
    return (react_1["default"].createElement(components_1.DialogZyx, { open: openModal, title: t(keys_1.langKeys.graphic_configuration), button1Type: "button", buttonText1: t(keys_1.langKeys.cancel), handleClickButton1: handleCancelModal, button2Type: "button", buttonText2: t(keys_1.langKeys.accept), handleClickButton2: handleAcceptModal },
        react_1["default"].createElement("div", { className: "row-zyx" },
            react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.graphic_type), className: "col-12", valueDefault: getValues('graphictype'), error: (_b = errors === null || errors === void 0 ? void 0 : errors.graphictype) === null || _b === void 0 ? void 0 : _b.message, onChange: function (value) { return setValue('graphictype', value === null || value === void 0 ? void 0 : value.key); }, data: [{ key: 'BAR', value: 'BAR' }, { key: 'PIE', value: 'PIE' }, { key: 'LINE', value: 'LINEA' },], uset: true, prefixTranslation: "graphic_", optionDesc: "value", optionValue: "key" })),
        react_1["default"].createElement("div", { className: "row-zyx" },
            react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.graphic_view_by), className: "col-12", valueDefault: getValues('column'), error: (_c = errors === null || errors === void 0 ? void 0 : errors.column) === null || _c === void 0 ? void 0 : _c.message, onChange: function (value) { return setValue('column', value === null || value === void 0 ? void 0 : value.key); }, data: columns, optionDesc: "value", optionValue: "key", uset: true, prefixTranslation: "" }))));
};
var RADIAN = Math.PI / 180;
exports.RenderCustomizedLabel = function (_a) {
    var cx = _a.cx, cy = _a.cy, midAngle = _a.midAngle, innerRadius = _a.innerRadius, outerRadius = _a.outerRadius, value = _a.value, rest = __rest(_a, ["cx", "cy", "midAngle", "innerRadius", "outerRadius", "value"]);
    var radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    var x = cx + radius * Math.cos(-midAngle * RADIAN);
    var y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (react_1["default"].createElement("text", { x: x, y: y, fill: "white", textAnchor: x > cx ? 'start' : 'end', dominantBaseline: "central" }, value || ""));
};
var DetailUniqueContact = function (_a) {
    var row = _a.row, setViewSelected = _a.setViewSelected;
    var _b = react_1.useState({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, distinct: {}, daterange: null }), fetchDataAux = _b[0], setfetchDataAux = _b[1];
    // const [allParameters, setAllParameters] = useState<Dictionary>({});
    var mainPaginated = hooks_1.useSelector(function (state) { return state.main.mainPaginated; });
    var _c = react_1.useState(0), totalrow = _c[0], settotalrow = _c[1];
    var _d = react_1.useState(0), pageCount = _d[0], setPageCount = _d[1];
    var _e = react_1.useState(false), waitExport = _e[0], setWaitExport = _e[1];
    var resExportData = hooks_1.useSelector(function (state) { return state.main.exportData; });
    var dispatch = react_redux_1.useDispatch();
    var classes = useStyles();
    var t = react_i18next_1.useTranslation().t;
    var fetchData = function (_a) {
        var pageSize = _a.pageSize, pageIndex = _a.pageIndex, filters = _a.filters, sorts = _a.sorts, distinct = _a.distinct, daterange = _a.daterange;
        setfetchDataAux({ pageSize: pageSize, pageIndex: pageIndex, filters: filters, sorts: sorts, distinct: distinct, daterange: daterange });
        dispatch(actions_1.getCollectionPaginated(helpers_1.selUniqueContactsPcc({
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            orgid: row.row.orgid,
            corpid: row.row.corpid,
            month: row.month,
            year: row.year,
            channeltype: row.channeltype,
            filters: __assign({}, filters)
        })));
    };
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.name),
            accessor: 'name',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.communicationchannel),
            accessor: 'channels',
            Cell: function (props) {
                var row = props.cell.row.original;
                react_1["default"].createElement("div", { className: classes.fieldElipsis }, row === null || row === void 0 ? void 0 : row.channels);
                return react_1["default"].createElement(Tooltip_1["default"], { TransitionComponent: Zoom_1["default"], title: row === null || row === void 0 ? void 0 : row.channels },
                    react_1["default"].createElement("div", { className: classes.fieldElipsis }, row === null || row === void 0 ? void 0 : row.channels));
            }
        },
        {
            Header: t(keys_1.langKeys.firstContactDate),
            accessor: 'firstcontact',
            width: 'auto',
            type: 'date',
            sortType: 'datetime',
            Cell: function (props) {
                var row = props.cell.row.original || {};
                return row.firstcontact ? helpers_1.convertLocalDate(row.firstcontact).toLocaleString() : "";
            }
        },
        {
            Header: t(keys_1.langKeys.lastContactDate),
            accessor: 'lastcontact',
            width: 'auto',
            type: 'date',
            sortType: 'datetime',
            Cell: function (props) {
                var row = props.cell.row.original || {};
                return row.lastcontact ? helpers_1.convertLocalDate(row.lastcontact).toLocaleString() : "";
            }
        },
        {
            Header: t(keys_1.langKeys.phone),
            accessor: 'phone',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.email),
            accessor: 'email',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.status),
            accessor: 'status',
            width: 'auto'
        },
    ]; }, [t]);
    react_1.useEffect(function () {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);
    var triggerExportData = function (_a) {
        var filters = _a.filters, sorts = _a.sorts;
        var columnsExport = columns.map(function (x) { return ({
            key: x.accessor,
            alias: x.Header
        }); });
        dispatch(actions_1.exportData(helpers_1.getUniqueContactsExport({
            filters: __assign({}, filters),
            sorts: sorts,
            year: row.year,
            corpid: row.row.corpid,
            orgid: row.row.orgid,
            month: row.month,
            channeltype: row.channeltype
        }), "", "excel", false, columnsExport));
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
                var errormessage = t(resExportData.code || "error_unexpected_error", { module: t(keys_1.langKeys.person).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);
    return (react_1["default"].createElement(table_paginated_1["default"], { columns: columns, data: mainPaginated.data, totalrow: totalrow, loading: mainPaginated.loading, pageCount: pageCount, autotrigger: true, download: true, ButtonsElement: function () { return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(core_2.Button, { variant: "contained", type: "button", color: "primary", startIcon: react_1["default"].createElement(Clear_1["default"], { color: "secondary" }), style: { backgroundColor: "#FB5F5F" }, onClick: function () { return setViewSelected("view-1"); } }, t(keys_1.langKeys.back)))); }, fetchData: fetchData, exportPersonalized: triggerExportData }));
};
var UniqueContactsReportDetail = function (_a) {
    var year = _a.year, channelType = _a.channelType;
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var multiData = hooks_1.useSelector(function (state) { return state.main.multiDataAux; });
    var mainResult = hooks_1.useSelector(function (state) { return state.main.mainAux; });
    var _b = react_1.useState("view-1"), viewSelected = _b[0], setViewSelected = _b[1];
    var _c = react_1.useState('GRID'), view = _c[0], setView = _c[1];
    var classes = useStyles();
    var _d = react_1.useState([]), gridData = _d[0], setGridData = _d[1];
    var _e = react_1.useState([]), dataGraph = _e[0], setdataGraph = _e[1];
    var _f = react_1.useState(null), rowSelected = _f[0], setRowSelected = _f[1];
    var _g = react_1.useState(false), openModal = _g[0], setOpenModal = _g[1];
    var _h = react_1.useState('BAR'), graphicType = _h[0], setGraphicType = _h[1];
    var memoryTable = hooks_1.useSelector(function (state) { return state.main.memoryTable; });
    var cell = function (props) {
        var column = props.cell.column;
        var row = props.cell.row.original;
        if (row && row.client === "Total") {
            return react_1["default"].createElement("div", null,
                react_1["default"].createElement("b", null, row[column.id]));
        }
        else if (row && column.id.includes('_')) {
            return react_1["default"].createElement("div", { onClick: function () { return handleView(row, column.id.split('_')[1]); } }, row[column.id]);
        }
        else if (row) {
            return react_1["default"].createElement("div", null, row[column.id]);
        }
        return "";
    };
    var handleView = function (row, month) {
        setRowSelected({
            row: row,
            month: month,
            year: year,
            channeltype: channelType
        });
        setViewSelected("view-2");
    };
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.client),
            accessor: 'client',
            width: 'auto',
            Cell: function (props) {
                var column = props.cell.column;
                var row = props.cell.row.original;
                if (row && 'client' in row) {
                    if (row.client === "Total") {
                        return react_1["default"].createElement("div", null,
                            react_1["default"].createElement("b", null, row[column.id]));
                    }
                    else {
                        return react_1["default"].createElement("div", null, row[column.id]);
                    }
                }
                return "";
            }
        },
        {
            Header: t(keys_1.langKeys.month_01),
            accessor: 'month_1',
            width: 'auto',
            showColumn: true,
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_02),
            accessor: 'month_2',
            width: 'auto',
            showColumn: true,
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_03),
            accessor: 'month_3',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_04),
            accessor: 'month_4',
            width: 'auto',
            showColumn: true,
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_05),
            accessor: 'month_5',
            width: 'auto',
            showColumn: true,
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_06),
            accessor: 'month_6',
            width: 'auto',
            showColumn: true,
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_07),
            accessor: 'month_7',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_08),
            accessor: 'month_8',
            width: 'auto',
            showColumn: true,
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_09),
            accessor: 'month_9',
            showColumn: true,
            width: 'auto',
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_10),
            accessor: 'month_10',
            width: 'auto',
            showColumn: true,
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_11),
            accessor: 'month_11',
            width: 'auto',
            showColumn: true,
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_12),
            accessor: 'month_12',
            width: 'auto',
            showColumn: true,
            type: 'number',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.total),
            accessor: 'total',
            width: 'auto',
            type: 'number',
            Cell: function (props) {
                var row = props.cell.row.original;
                var totalValue = row ? row.total : undefined;
                return react_1["default"].createElement("b", null, totalValue);
            }
        },
    ]; }, [t]);
    react_1.useEffect(function () {
        var _a;
        if (!mainResult.loading && ((_a = mainResult === null || mainResult === void 0 ? void 0 : mainResult.key) === null || _a === void 0 ? void 0 : _a.includes("UFN_REPORT_UNIQUECONTACTS_SEL"))) {
            var mainTotal_1 = {
                client: "Total",
                month_1: 0, month_2: 0, month_3: 0, month_4: 0, month_5: 0, month_6: 0, month_7: 0, month_8: 0, month_9: 0, month_10: 0, month_11: 0, month_12: 0, total: 0
            };
            var rawdata_1 = [];
            multiData.data[1].data.forEach(function (x) {
                rawdata_1.push({
                    client: x.corpdesc + " - " + x.orgdesc,
                    corpid: x.corpid,
                    orgid: x.orgid,
                    month_1: 0,
                    month_2: 0,
                    month_3: 0,
                    month_4: 0,
                    month_5: 0,
                    month_6: 0,
                    month_7: 0,
                    month_8: 0,
                    month_9: 0,
                    month_10: 0,
                    month_11: 0,
                    month_12: 0,
                    total: 0
                });
            });
            mainResult.data.forEach(function (x) {
                var clientdata = multiData.data[1].data.filter(function (y) { return (x.corpid === y.corpid && x.orgid === y.orgid); })[0];
                var indexField = rawdata_1 === null || rawdata_1 === void 0 ? void 0 : rawdata_1.findIndex(function (y) { return (y).client === (clientdata === null || clientdata === void 0 ? void 0 : clientdata.corpdesc) + " - " + (clientdata === null || clientdata === void 0 ? void 0 : clientdata.orgdesc); });
                if (!(indexField < 0)) {
                    mainTotal_1["month_" + x.month] += x.pcc;
                    mainTotal_1.total += x.pcc;
                    rawdata_1[indexField]["month_" + x.month] = x.pcc;
                    rawdata_1[indexField].total += x.pcc;
                }
            });
            setGridData(__spreadArrays(rawdata_1, [mainTotal_1]) || []);
            setdataGraph(Object.keys(mainTotal_1).filter(function (x) { return x.includes('_'); }).reduce(function (acc, x) { return __spreadArrays(acc, [{ name: t(x), value: mainTotal_1[x], percentage: mainTotal_1[x] * 100 / mainTotal_1.total, color: randomColorGenerator() }]); }, []));
            dispatch(actions_2.showBackdrop(false));
        }
    }, [mainResult]);
    var generateRandomColor = function () { return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); };
    var getNextColorGenerator = function () {
        var predefinedColors = ["#7721AD", "#B41A1A", "#9DABBD", "#FFA000", "#50AE54", "#001AFF", "#2BD37B", "#FFA34F", "#FC0D1B", "#FFBF00", "#0F7F13", "#00CFE5", "#1D1856", "#FB5F5F", "#B061E1"];
        var currentIndex = 0;
        var usedColors = __spreadArrays(predefinedColors);
        return function () {
            if (currentIndex < predefinedColors.length) {
                var color = predefinedColors[currentIndex];
                currentIndex++;
                return color;
            }
            else {
                var randomColor = generateRandomColor();
                if (!usedColors.includes(randomColor)) {
                    usedColors.push(randomColor);
                    return randomColor;
                }
                else {
                    return getNextColorGenerator()();
                }
            }
        };
    };
    var randomColorGenerator = getNextColorGenerator();
    if (viewSelected === "view-1") {
        return (react_1["default"].createElement("div", null,
            view === "GRID" ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { style: { height: 10 } }),
                react_1["default"].createElement(table_simple_1["default"], { columns: columns, data: gridData, ButtonsElement: function () { return (react_1["default"].createElement(core_1.Box, { width: 1, style: { display: "flex", justifyContent: "flex-end", gap: 8 } },
                        react_1["default"].createElement(core_2.Button, { className: classes.button, variant: "contained", color: "primary", disabled: mainResult.loading || !(gridData.length > 0), onClick: function () { return setOpenModal(true); }, startIcon: react_1["default"].createElement(Assessment_1["default"], null) }, t(keys_1.langKeys.graphic_view)))); }, download: true, showHideColumns: true, filterGeneral: false, loading: mainResult.loading, register: false, pageSizeDefault: UNIQUECONTACTS === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20, initialPageIndex: UNIQUECONTACTS === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0, initialStateFilter: UNIQUECONTACTS === memoryTable.id ? Object.entries(memoryTable.filters).map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return ({ id: key, value: value });
                    }) : undefined }))) :
                (react_1["default"].createElement("div", null,
                    react_1["default"].createElement(core_1.Box, { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, className: classes.containerHeaderItem },
                        react_1["default"].createElement("div", { style: { display: 'flex', gap: 8, width: '100%', justifyContent: 'right', marginTop: 6 } },
                            react_1["default"].createElement(core_2.Button, { className: classes.button, variant: "contained", color: "primary", disabled: mainResult.loading || !(gridData.length > 0), onClick: function () { return setOpenModal(true); }, startIcon: react_1["default"].createElement(icons_1.Settings, null) }, t(keys_1.langKeys.configuration)),
                            react_1["default"].createElement(core_2.Button, { className: classes.button, variant: "contained", color: "primary", onClick: function () { return setView('GRID'); }, startIcon: react_1["default"].createElement(List_1["default"], null) }, t(keys_1.langKeys.grid_view))),
                        react_1["default"].createElement("div", { style: { fontWeight: 500, padding: 16, display: 'flex', justifyContent: 'left', width: '100%' } }, t(keys_1.langKeys.graphic_report_of, { report: t('uniquecontacts'), column: t('month') })),
                        react_1["default"].createElement(react_1["default"].Fragment, null, (mainResult.loading) ? (react_1["default"].createElement("div", { style: { flex: 1, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                            react_1["default"].createElement(core_1.CircularProgress, null))) : (graphicType === "BAR" ? (react_1["default"].createElement("div", { style: { display: 'flex' } },
                            react_1["default"].createElement("div", { style: { flex: '0 0 70%', height: 500 } },
                                react_1["default"].createElement(recharts_1.ResponsiveContainer, { aspect: 4.0 / 2 },
                                    react_1["default"].createElement(recharts_1.BarChart, { data: dataGraph, margin: { top: 20, right: 30, left: 20, bottom: 5 } },
                                        react_1["default"].createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                                        react_1["default"].createElement(recharts_1.XAxis, { dataKey: "name", style: { fontSize: "0.8em" }, angle: 315, interval: 0, textAnchor: "end", height: 160, dy: 5, dx: -5 }),
                                        react_1["default"].createElement(recharts_1.YAxis, null),
                                        react_1["default"].createElement(recharts_1.Tooltip, { formatter: function (value, name) { return [value, t(name)]; } }),
                                        react_1["default"].createElement(recharts_1.Bar, { dataKey: "value", fill: "#7721AD", textAnchor: "end", stackId: "a", type: "monotone" },
                                            react_1["default"].createElement(recharts_1.LabelList, { dataKey: "summary", position: "top" }),
                                            dataGraph.map(function (entry, index) { return (react_1["default"].createElement(recharts_1.Cell, { key: "cell-" + index, fill: randomColorGenerator() })); }))))),
                            react_1["default"].createElement("div", { style: { overflowX: 'auto' } },
                                react_1["default"].createElement(TableResume, { graphicType: graphicType, data: dataGraph })))) : (graphicType === "LINE" ? (react_1["default"].createElement("div", { style: { display: 'flex' } },
                            react_1["default"].createElement("div", { style: { flex: '0 0 70%', height: 500 } },
                                react_1["default"].createElement(recharts_1.ResponsiveContainer, { aspect: 4.0 / 2 },
                                    react_1["default"].createElement(recharts_1.LineChart, { data: dataGraph, margin: { top: 20, right: 30, left: 20, bottom: 5 } },
                                        react_1["default"].createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                                        react_1["default"].createElement(recharts_1.XAxis, { dataKey: "name", style: { fontSize: "0.8em" }, angle: 315, interval: 0, textAnchor: "end", height: 160, dy: 5, dx: -5 }),
                                        react_1["default"].createElement(recharts_1.YAxis, null),
                                        react_1["default"].createElement(recharts_1.Tooltip, { formatter: function (value, name) { return [value, t(name)]; } }),
                                        react_1["default"].createElement(recharts_1.Line, { type: "linear", dataKey: "value", stroke: "#7721AD" })))),
                            react_1["default"].createElement("div", { style: { overflowX: 'auto' } },
                                react_1["default"].createElement(TableResume, { graphicType: graphicType, data: dataGraph })))) : (react_1["default"].createElement("div", { style: { display: 'flex' } },
                            react_1["default"].createElement("div", { style: { flex: '0 0 65%', height: 500 } },
                                react_1["default"].createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                                    react_1["default"].createElement(recharts_1.PieChart, null,
                                        react_1["default"].createElement(recharts_1.Tooltip, null),
                                        react_1["default"].createElement(recharts_1.Pie, { data: dataGraph, dataKey: "value", labelLine: false, label: exports.RenderCustomizedLabel, nameKey: "name", cx: "50%", cy: "50%", innerRadius: 40, fill: "#7721AD" }, dataGraph.map(function (item) { return (react_1["default"].createElement(recharts_1.Cell, { key: item.name, fill: item.color })); }))))),
                            react_1["default"].createElement("div", { style: { overflowX: 'auto' } },
                                react_1["default"].createElement(TableResume, { graphicType: graphicType, data: dataGraph })))))))))),
            react_1["default"].createElement(SummaryGraphic, { openModal: openModal, setOpenModal: setOpenModal, setGraphicType: setGraphicType, setView: setView, columns: [{
                        value: t(keys_1.langKeys.month),
                        key: 'month'
                    }] })));
    }
    else if (viewSelected === "view-2") {
        return react_1["default"].createElement(DetailUniqueContact, { row: rowSelected, setViewSelected: setViewSelected });
    }
    else
        return null;
};
var DetailConversationQuantity = function (_a) {
    var row = _a.row, setViewSelected = _a.setViewSelected;
    var _b = react_1.useState({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, distinct: {}, daterange: null }), fetchDataAux = _b[0], setfetchDataAux = _b[1];
    // const [allParameters, setAllParameters] = useState<Dictionary>({});
    var mainPaginated = hooks_1.useSelector(function (state) { return state.main.mainPaginated; });
    var mainResult = hooks_1.useSelector(function (state) { return state.main.mainAux2; });
    var _c = react_1.useState(0), totalrow = _c[0], settotalrow = _c[1];
    var _d = react_1.useState(null), rowSelected = _d[0], setRowSelected = _d[1];
    var _e = react_1.useState(0), pageCount = _e[0], setPageCount = _e[1];
    var _f = react_1.useState(false), waitExport = _f[0], setWaitExport = _f[1];
    var resExportData = hooks_1.useSelector(function (state) { return state.main.exportData; });
    var _g = react_1.useState(false), openModal = _g[0], setOpenModal = _g[1];
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var openDialogInteractions = react_1.useCallback(function (row) {
        setOpenModal(true);
        setRowSelected(__assign(__assign({}, row), { displayname: (row === null || row === void 0 ? void 0 : row.name) || "" }));
    }, [mainResult]);
    var fetchData = function (_a) {
        var pageSize = _a.pageSize, pageIndex = _a.pageIndex, filters = _a.filters, sorts = _a.sorts, distinct = _a.distinct, daterange = _a.daterange;
        setfetchDataAux({ pageSize: pageSize, pageIndex: pageIndex, filters: filters, sorts: sorts, distinct: distinct, daterange: daterange });
        dispatch(actions_1.getCollectionPaginated(helpers_1.selUniqueContactsConversation({
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            orgid: row.row.orgid,
            corpid: row.row.corpid,
            month: row.month,
            year: row.year,
            channeltype: row.channeltype,
            filters: __assign({}, filters)
        })));
    };
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.ticket_number),
            accessor: 'ticketnum',
            width: 'auto',
            Cell: function (props) {
                var row = props.cell.row.original;
                return (react_1["default"].createElement("label", { className: classes.labellink, onClick: function () { return openDialogInteractions(row); } }, row.ticketnum));
            }
        },
        {
            Header: t(keys_1.langKeys.startdate),
            accessor: 'startdate',
            width: 'auto',
            type: 'date',
            sortType: 'date',
            Cell: function (props) {
                var row = props.cell.row.original;
                return row.startdate ? helpers_1.dateToLocalDate(row.startdate) : "";
            }
        },
        {
            Header: t(keys_1.langKeys.starttime),
            accessor: 'starttime',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.enddate),
            accessor: 'finishdate',
            width: 'auto',
            type: 'date',
            sortType: 'date',
            Cell: function (props) {
                var row = props.cell.row.original;
                return row.finishdate ? helpers_1.dateToLocalDate(row.finishdate) : "";
            }
        },
        {
            Header: t(keys_1.langKeys.finishtime),
            accessor: 'finishtime',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.communicationchannel),
            accessor: 'channel',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.origin),
            accessor: 'origin',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.person),
            accessor: 'name',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.email),
            accessor: 'email',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.phone),
            accessor: 'phone',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.closedby),
            accessor: 'usertype',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.advisor),
            accessor: 'asesor',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.group),
            accessor: 'usergroup',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.closetype),
            accessor: 'closetype',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.ticket_fechahandoff),
            accessor: 'handoffdate',
            width: 'auto',
            type: 'date',
            sortType: 'date',
            Cell: function (props) {
                var row = props.cell.row.original;
                return row.handoffdate ? helpers_1.dateToLocalDate(row.handoffdate) : "";
            }
        },
        {
            Header: t(keys_1.langKeys.report_productivity_derivationtime),
            accessor: 'handofftime',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.tmo),
            accessor: 'tmo',
            width: 'auto',
            helpText: t(keys_1.langKeys.tmotooltip)
        },
        {
            Header: t(keys_1.langKeys.advisor) + " " + t(keys_1.langKeys.tmo),
            accessor: 'tmoasesor',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.tmeAgent),
            accessor: 'tmeasesor',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.report_productivity_holdingholdtime),
            accessor: 'tdatime',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.report_productivity_suspensiontime),
            accessor: 'pauseduration',
            width: 'auto'
        },
        {
            Header: t(keys_1.langKeys.tmr),
            accessor: 'tmrasesor',
            width: 'auto',
            helpText: t(keys_1.langKeys.tmrtooltip)
        },
        {
            Header: t(keys_1.langKeys.ticket_balancetimes),
            accessor: 'balancetimes',
            type: 'number',
            width: 'auto'
        },
    ]; }, [t]);
    var triggerExportData = function (_a) {
        var filters = _a.filters, sorts = _a.sorts;
        var columnsExport = columns.map(function (x) { return ({
            key: x.accessor,
            alias: x.Header
        }); });
        dispatch(actions_1.exportData(helpers_1.getUniqueContactsConversationExport({
            filters: __assign({}, filters),
            sorts: sorts,
            corpid: row.row.corpid,
            orgid: row.row.orgid,
            year: row.year,
            month: row.month,
            channeltype: row.channeltype
        }), "", "excel", false, columnsExport));
        dispatch(actions_2.showBackdrop(true));
        setWaitExport(true);
    };
    react_1.useEffect(function () {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);
    react_1.useEffect(function () {
        var _a;
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(actions_2.showBackdrop(false));
                setWaitExport(false);
                (_a = resExportData.url) === null || _a === void 0 ? void 0 : _a.split(",").forEach(function (x) { return window.open(x, '_blank'); });
            }
            else if (resExportData.error) {
                var errormessage = t(resExportData.code || "error_unexpected_error", { module: t(keys_1.langKeys.person).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(table_paginated_1["default"], { columns: columns, data: mainPaginated.data, totalrow: totalrow, loading: mainPaginated.loading, pageCount: pageCount, autotrigger: true, download: true, ButtonsElement: function () { return (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(core_2.Button, { variant: "contained", type: "button", color: "primary", startIcon: react_1["default"].createElement(Clear_1["default"], { color: "secondary" }), style: { backgroundColor: "#FB5F5F" }, onClick: function () { return setViewSelected("view-1"); } }, t(keys_1.langKeys.back)))); }, fetchData: fetchData, exportPersonalized: triggerExportData }),
        react_1["default"].createElement(DialogInteractions_1["default"], { openModal: openModal, setOpenModal: setOpenModal, ticket: rowSelected })));
};
var ConversationQuantityReportDetail = function (_a) {
    var year = _a.year, channelType = _a.channelType;
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var multiData = hooks_1.useSelector(function (state) { return state.main.multiDataAux; });
    var mainResult = hooks_1.useSelector(function (state) { return state.main.mainAux; });
    var _b = react_1.useState("view-1"), viewSelected = _b[0], setViewSelected = _b[1];
    var _c = react_1.useState('GRID'), view = _c[0], setView = _c[1];
    var classes = useStyles();
    var _d = react_1.useState([]), gridData = _d[0], setGridData = _d[1];
    var _e = react_1.useState([]), dataGraph = _e[0], setdataGraph = _e[1];
    var _f = react_1.useState(null), rowSelected = _f[0], setRowSelected = _f[1];
    var _g = react_1.useState(false), openModal = _g[0], setOpenModal = _g[1];
    var _h = react_1.useState('BAR'), graphicType = _h[0], setGraphicType = _h[1];
    var memoryTable = hooks_1.useSelector(function (state) { return state.main.memoryTable; });
    var cell = function (props) {
        var column = props.cell.column;
        var row = props.cell.row.original;
        if (row && row.client === "Total") {
            return react_1["default"].createElement("div", null,
                react_1["default"].createElement("b", null, row[column.id]));
        }
        else if (row && column.id.includes('_')) {
            return react_1["default"].createElement("div", { onClick: function () { return handleView(row, column.id.split('_')[1]); } }, row[column.id]);
        }
        else if (row) {
            return react_1["default"].createElement("div", null, row[column.id]);
        }
        return "";
    };
    var handleView = function (row, month) {
        setRowSelected({
            row: row,
            month: month,
            year: year,
            channeltype: channelType
        });
        setViewSelected("view-2");
    };
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.client),
            accessor: 'client',
            width: 'auto',
            Cell: function (props) {
                var column = props.cell.column;
                var row = props.cell.row.original || {};
                if (row.client === "Total") {
                    return react_1["default"].createElement("div", null,
                        react_1["default"].createElement("b", null, row[column.id]));
                }
                else {
                    return react_1["default"].createElement("div", null, row[column.id] !== undefined ? row[column.id] : '');
                }
            }
        },
        {
            Header: t(keys_1.langKeys.month_01),
            accessor: 'month_1',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_02),
            accessor: 'month_2',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_03),
            accessor: 'month_3',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_04),
            accessor: 'month_4',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_05),
            accessor: 'month_5',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_06),
            accessor: 'month_6',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_07),
            accessor: 'month_7',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_08),
            accessor: 'month_8',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_09),
            accessor: 'month_9',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_10),
            accessor: 'month_10',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_11),
            accessor: 'month_11',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.month_12),
            accessor: 'month_12',
            width: 'auto',
            type: 'number',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.total),
            accessor: 'total',
            width: 'auto',
            type: 'number',
            Cell: function (props) {
                var row = props.cell.row.original;
                var totalValue = row ? row.total : undefined;
                return react_1["default"].createElement("b", null, totalValue);
            }
        },
    ]; }, [t]);
    var generateRandomColor = function () { return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); };
    var getNextColorGenerator = function () {
        var predefinedColors = ["#7721AD", "#B41A1A", "#9DABBD", "#FFA000", "#50AE54", "#001AFF", "#2BD37B", "#FFA34F", "#FC0D1B", "#FFBF00", "#0F7F13", "#00CFE5", "#1D1856", "#FB5F5F", "#B061E1"];
        var currentIndex = 0;
        var usedColors = __spreadArrays(predefinedColors);
        return function () {
            if (currentIndex < predefinedColors.length) {
                var color = predefinedColors[currentIndex];
                currentIndex++;
                return color;
            }
            else {
                var randomColor = generateRandomColor();
                if (!usedColors.includes(randomColor)) {
                    usedColors.push(randomColor);
                    return randomColor;
                }
                else {
                    return getNextColorGenerator()();
                }
            }
        };
    };
    var randomColorGenerator = getNextColorGenerator();
    react_1.useEffect(function () {
        var _a;
        if (!mainResult.loading && ((_a = mainResult === null || mainResult === void 0 ? void 0 : mainResult.key) === null || _a === void 0 ? void 0 : _a.includes("UFN_REPORT_UNIQUECONTACTS_SEL"))) {
            var mainTotal_2 = {
                client: "Total",
                month_1: 0, month_2: 0, month_3: 0, month_4: 0, month_5: 0, month_6: 0, month_7: 0, month_8: 0, month_9: 0, month_10: 0, month_11: 0, month_12: 0, total: 0
            };
            var rawdata_2 = [];
            multiData.data[1].data.forEach(function (x) {
                rawdata_2.push({
                    client: x.corpdesc + " - " + x.orgdesc,
                    corpid: x.corpid,
                    orgid: x.orgid,
                    month_1: 0,
                    month_2: 0,
                    month_3: 0,
                    month_4: 0,
                    month_5: 0,
                    month_6: 0,
                    month_7: 0,
                    month_8: 0,
                    month_9: 0,
                    month_10: 0,
                    month_11: 0,
                    month_12: 0,
                    total: 0
                });
            });
            mainResult.data.forEach(function (x) {
                var clientdata = multiData.data[1].data.filter(function (y) { return (x.corpid === y.corpid && x.orgid === y.orgid); })[0];
                var indexField = rawdata_2 === null || rawdata_2 === void 0 ? void 0 : rawdata_2.findIndex(function (y) { return (y).client === (clientdata === null || clientdata === void 0 ? void 0 : clientdata.corpdesc) + " - " + (clientdata === null || clientdata === void 0 ? void 0 : clientdata.orgdesc); });
                if (!(indexField < 0)) {
                    mainTotal_2["month_" + x.month] += x.conversation;
                    mainTotal_2.total += x.conversation;
                    rawdata_2[indexField]["month_" + x.month] = x.conversation;
                    rawdata_2[indexField].total += x.conversation;
                }
            });
            setGridData(__spreadArrays(rawdata_2, [mainTotal_2]) || []);
            setdataGraph(Object.keys(mainTotal_2).filter(function (x) { return x.includes('_'); }).reduce(function (acc, x) { return __spreadArrays(acc, [{ name: t(x), value: mainTotal_2[x], percentage: mainTotal_2[x] * 100 / mainTotal_2.total, color: randomColorGenerator() }]); }, []));
            dispatch(actions_2.showBackdrop(false));
        }
    }, [mainResult]);
    if (viewSelected === "view-1") {
        return (react_1["default"].createElement("div", null,
            view === "GRID" ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { style: { height: 10 } }),
                react_1["default"].createElement(table_simple_1["default"], { columns: columns, data: gridData, ButtonsElement: function () { return (react_1["default"].createElement(core_1.Box, { width: 1, style: { display: "flex", justifyContent: "flex-end", gap: 8 } },
                        react_1["default"].createElement(core_2.Button, { className: classes.button, variant: "contained", color: "primary", disabled: mainResult.loading || !(gridData.length > 0), onClick: function () { return setOpenModal(true); }, startIcon: react_1["default"].createElement(Assessment_1["default"], null) }, t(keys_1.langKeys.graphic_view)))); }, download: true, showHideColumns: true, filterGeneral: false, loading: mainResult.loading, register: false, pageSizeDefault: UNIQUECONTACTS === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20, initialPageIndex: UNIQUECONTACTS === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0, initialStateFilter: UNIQUECONTACTS === memoryTable.id ? Object.entries(memoryTable.filters).map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return ({ id: key, value: value });
                    }) : undefined }))) :
                (react_1["default"].createElement("div", null,
                    react_1["default"].createElement(core_1.Box, { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, className: classes.containerHeaderItem },
                        react_1["default"].createElement("div", { style: { display: 'flex', gap: 8, width: '100%', justifyContent: 'right', marginTop: 6 } },
                            react_1["default"].createElement(core_2.Button, { className: classes.button, variant: "contained", color: "primary", disabled: mainResult.loading || !(gridData.length > 0), onClick: function () { return setOpenModal(true); }, startIcon: react_1["default"].createElement(icons_1.Settings, null) }, t(keys_1.langKeys.configuration)),
                            react_1["default"].createElement(core_2.Button, { className: classes.button, variant: "contained", color: "primary", onClick: function () { return setView('GRID'); }, startIcon: react_1["default"].createElement(List_1["default"], null) }, t(keys_1.langKeys.grid_view))),
                        react_1["default"].createElement("div", { style: { fontWeight: 500, padding: 16, display: 'flex', justifyContent: 'left', width: '100%' } }, t(keys_1.langKeys.graphic_report_of, { report: t('conversationquantity'), column: t('month') })),
                        react_1["default"].createElement(react_1["default"].Fragment, null, (mainResult.loading) ? (react_1["default"].createElement("div", { style: { flex: 1, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                            react_1["default"].createElement(core_1.CircularProgress, null))) : (graphicType === "BAR" ? (react_1["default"].createElement("div", { style: { display: 'flex' } },
                            react_1["default"].createElement("div", { style: { flex: '0 0 70%', height: 500 } },
                                react_1["default"].createElement(recharts_1.ResponsiveContainer, { aspect: 4.0 / 2 },
                                    react_1["default"].createElement(recharts_1.BarChart, { data: dataGraph, margin: { top: 20, right: 30, left: 20, bottom: 5 } },
                                        react_1["default"].createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                                        react_1["default"].createElement(recharts_1.XAxis, { dataKey: "name", style: { fontSize: "0.8em" }, angle: 315, interval: 0, textAnchor: "end", height: 160, dy: 5, dx: -5 }),
                                        react_1["default"].createElement(recharts_1.YAxis, null),
                                        react_1["default"].createElement(recharts_1.Tooltip, { formatter: function (value, name) { return [value, t(name)]; } }),
                                        react_1["default"].createElement(recharts_1.Bar, { dataKey: "value", fill: "#7721AD", textAnchor: "end", stackId: "a", type: "monotone" },
                                            react_1["default"].createElement(recharts_1.LabelList, { dataKey: "summary", position: "top" }),
                                            dataGraph.map(function (entry, index) { return (react_1["default"].createElement(recharts_1.Cell, { key: "cell-" + index, fill: randomColorGenerator() })); }))))),
                            react_1["default"].createElement("div", { style: { overflowX: 'auto' } },
                                react_1["default"].createElement(TableResume, { graphicType: graphicType, data: dataGraph })))) : (graphicType === "PIE" ? (react_1["default"].createElement("div", { style: { display: 'flex' } },
                            react_1["default"].createElement("div", { style: { flex: '0 0 65%', height: 500 } },
                                react_1["default"].createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                                    react_1["default"].createElement(recharts_1.PieChart, null,
                                        react_1["default"].createElement(recharts_1.Tooltip, null),
                                        react_1["default"].createElement(recharts_1.Pie, { data: dataGraph, dataKey: "value", labelLine: false, label: exports.RenderCustomizedLabel, nameKey: "name", cx: "50%", cy: "50%", innerRadius: 40, fill: "#8884d8" }, dataGraph.map(function (item) { return (react_1["default"].createElement(recharts_1.Cell, { key: item.name, fill: item.color })); }))))),
                            react_1["default"].createElement("div", { style: { overflowX: 'auto' } },
                                react_1["default"].createElement(TableResume, { graphicType: graphicType, data: dataGraph })))) : (graphicType === "LINE" ? (react_1["default"].createElement("div", { style: { display: 'flex' } },
                            react_1["default"].createElement("div", { style: { flex: '0 0 70%', height: 500 } },
                                react_1["default"].createElement(recharts_1.ResponsiveContainer, { aspect: 4.0 / 2 },
                                    react_1["default"].createElement(recharts_1.LineChart, { data: dataGraph, margin: { top: 20, right: 30, left: 20, bottom: 5 } },
                                        react_1["default"].createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                                        react_1["default"].createElement(recharts_1.XAxis, { dataKey: "name", style: { fontSize: "0.8em" }, angle: 315, interval: 0, textAnchor: "end", height: 160, dy: 5, dx: -5 }),
                                        react_1["default"].createElement(recharts_1.YAxis, null),
                                        react_1["default"].createElement(recharts_1.Tooltip, { formatter: function (value, name) { return [value, t(name)]; } }),
                                        react_1["default"].createElement(recharts_1.Line, { type: "linear", dataKey: "value", stroke: randomColorGenerator() })))),
                            react_1["default"].createElement("div", { style: { overflowX: 'auto' } },
                                react_1["default"].createElement(TableResume, { graphicType: graphicType, data: dataGraph })))) : null))))))),
            react_1["default"].createElement(SummaryGraphic, { openModal: openModal, setOpenModal: setOpenModal, setGraphicType: setGraphicType, setView: setView, columns: [{
                        value: t(keys_1.langKeys.month),
                        key: 'month'
                    }] })));
    }
    else if (viewSelected === "view-2") {
        return react_1["default"].createElement(DetailConversationQuantity, { row: rowSelected, setViewSelected: setViewSelected });
    }
    else
        return null;
};
var UniqueContactsReport = function () {
    var _a, _b;
    var _c = react_1.useState(0), pageSelected = _c[0], setPageSelected = _c[1];
    var dispatch = react_redux_1.useDispatch();
    var classes = useStyles();
    var t = react_i18next_1.useTranslation().t;
    var _d = react_1.useState(""), channelType = _d[0], setChannelType = _d[1];
    var _e = react_1.useState("" + new Date().getFullYear()), year = _e[0], setYear = _e[1];
    var multiData = hooks_1.useSelector(function (state) { return state.main.multiDataAux; });
    react_1.useEffect(function () {
        dispatch(actions_1.getMultiCollectionAux([
            helpers_1.getValuesFromDomain("TIPOCANAL"),
            helpers_1.selOrgSimpleList(),
            helpers_1.getDomainChannelTypeList()
        ]));
        dispatch(actions_1.setMemoryTable({
            id: UNIQUECONTACTS
        }));
        return function () {
            dispatch(actions_1.resetMainAux());
            dispatch(actions_1.resetMultiMain());
            dispatch(actions_1.resetMultiMainAux());
            dispatch(actions_1.resetMultiMainAux2());
        };
    }, []);
    function search() {
        dispatch(actions_2.showBackdrop(true));
        dispatch(actions_1.getCollectionAux(helpers_1.getUniqueContactsSel({
            year: year,
            channeltype: channelType
        })));
    }
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(react_1.Fragment, null,
            react_1["default"].createElement("div", { className: classes.containerHeader, style: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' } },
                react_1["default"].createElement("div", { style: { display: 'flex', gap: 8 } },
                    react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.year), style: { width: 140 }, variant: "outlined", valueDefault: year, onChange: function (value) { return setYear(value === null || value === void 0 ? void 0 : value.value); }, data: helpers_2.dataYears, optionDesc: "value", optionValue: "value" }),
                    react_1["default"].createElement(components_1.FieldMultiSelect, { label: t(keys_1.langKeys.channeltype), className: classes.filterComponent, onChange: function (value) { setChannelType(value.map(function (o) { return o.domainvalue; }).join()); }, valueDefault: channelType, variant: "outlined", data: ((_b = (_a = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _a === void 0 ? void 0 : _a[2]) === null || _b === void 0 ? void 0 : _b.data) || [], loading: multiData.loading, optionDesc: "domaindesc", optionValue: "domainvalue" }),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement(core_2.Button, { disabled: multiData.loading, variant: "contained", color: "primary", startIcon: react_1["default"].createElement(icons_1.Search, { style: { color: 'white' } }), style: { width: 120, backgroundColor: "#55BD84" }, onClick: function () { return search(); } }, t(keys_1.langKeys.search))))),
            react_1["default"].createElement(core_1.Tabs, { value: pageSelected, indicatorColor: "primary", variant: "fullWidth", style: { borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }, textColor: "primary", onChange: function (_, value) { return setPageSelected(value); } },
                react_1["default"].createElement(components_1.AntTab, { label: t(keys_1.langKeys.uniquecontacts).toLocaleUpperCase(), style: { fontWeight: 'bold' } }),
                react_1["default"].createElement(components_1.AntTab, { label: t(keys_1.langKeys.conversationquantity).toLocaleUpperCase(), style: { fontWeight: 'bold' } })),
            pageSelected === 0 && react_1["default"].createElement(UniqueContactsReportDetail, { year: year, channelType: channelType }),
            pageSelected === 1 && react_1["default"].createElement(ConversationQuantityReportDetail, { year: year, channelType: channelType }))));
};
exports["default"] = UniqueContactsReport;
