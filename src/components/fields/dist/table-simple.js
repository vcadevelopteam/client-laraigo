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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.OptionsMenuComponent = exports.TimeOptionsMenuComponent = exports.DateOptionsMenuComponent = exports.SelectFilterTmp = exports.BooleanOptionsMenuComponent = exports.booleanOptionsMenu = exports.dateOptionsMenu = exports.numberOptionsMenu = exports.stringOptionsMenu = void 0;
var react_1 = require("react");
var Table_1 = require("@material-ui/core/Table");
var Button_1 = require("@material-ui/core/Button");
var TableBody_1 = require("@material-ui/core/TableBody");
var TableCell_1 = require("@material-ui/core/TableCell");
var TableContainer_1 = require("@material-ui/core/TableContainer");
var TableHead_1 = require("@material-ui/core/TableHead");
var TableRow_1 = require("@material-ui/core/TableRow");
var Menu_1 = require("@material-ui/core/Menu");
var helpers_1 = require("common/helpers");
var actions_1 = require("store/main/actions");
var react_redux_1 = require("react-redux");
var icons_1 = require("@material-ui/icons");
var Select_1 = require("@material-ui/core/Select");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var ArrowDownward_1 = require("@material-ui/icons/ArrowDownward");
var ArrowUpward_1 = require("@material-ui/icons/ArrowUpward");
var Box_1 = require("@material-ui/core/Box");
var Input_1 = require("@material-ui/core/Input");
var Tooltip_1 = require("@material-ui/core/Tooltip");
var styles_1 = require("@material-ui/core/styles");
var Fab_1 = require("@material-ui/core/Fab");
var IconButton_1 = require("@material-ui/core/IconButton");
var Backup_1 = require("@material-ui/icons/Backup");
var Delete_1 = require("@material-ui/icons/Delete");
var components_1 = require("components");
var icons_2 = require("icons");
var ListAlt_1 = require("@material-ui/icons/ListAlt");
var Checkbox_1 = require("@material-ui/core/Checkbox");
var react_table_1 = require("react-table");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var lab_1 = require("@material-ui/lab");
var react_window_1 = require("react-window");
var date_fns_1 = require("@date-io/date-fns");
var InfoRounded_1 = require("@material-ui/icons/InfoRounded");
var pickers_1 = require("@material-ui/pickers");
var core_1 = require("@material-ui/core");
var useStyles = styles_1.makeStyles(function (theme) {
    var _a, _b, _c, _d;
    return ({
        footerTable: (_a = {
                display: 'block'
            },
            _a[theme.breakpoints.up('sm')] = {
                display: 'flex',
                justifyContent: "space-between"
            },
            _a['& > div'] = (_b = {
                    display: 'block',
                    textAlign: 'center'
                },
                _b[theme.breakpoints.up('sm')] = {
                    display: 'flex',
                    alignItems: "center"
                },
                _b),
            _a),
        trdynamic: {
            '&:hover': {
                boxShadow: '0 11px 6px -9px rgb(84 84 84 / 78%)',
                "& $containerfloat": {
                    visibility: 'visible'
                }
            }
        },
        containerSearch: (_c = {
                width: '100%'
            },
            _c[theme.breakpoints.up('sm')] = {
                width: '50%'
            },
            _c),
        containerFilterGeneral: {
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#FFF',
            padding: theme.spacing(1) + "px"
        },
        containerfloat: {
            borderBottom: 'none',
            backgroundColor: 'white',
            marginTop: '1px',
            position: 'absolute',
            zIndex: 9999,
            left: 0,
            visibility: 'hidden'
        },
        iconOrder: {
            width: 20,
            height: 20,
            color: theme.palette.text.primary
        },
        button: {
            padding: 12,
            fontWeight: 500,
            fontSize: '14px',
            textTransform: 'initial'
        },
        title: {
            fontSize: '22px',
            fontWeight: 'bold',
            color: theme.palette.text.primary
        },
        containerButtons: {
            gridGap: theme.spacing(1),
            display: 'grid',
            gridAutoFlow: 'column',
            alignItems: 'center'
        },
        containerHeader: (_d = {
                display: 'block',
                flexWrap: 'wrap',
                gap: 8
            },
            _d[theme.breakpoints.up('sm')] = {
                display: 'flex'
            },
            _d),
        containerHeaderColumn: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        iconHelpText: {
            width: 15,
            height: 15,
            cursor: 'pointer'
        }
    });
});
exports.stringOptionsMenu = [
    { key: 'equals', value: 'equals' },
    { key: 'notequals', value: 'notequals' },
    { key: 'contains', value: 'contains' },
    { key: 'notcontains', value: 'notcontains' },
    { key: 'isempty', value: 'isempty' },
    { key: 'isnotempty', value: 'isnotempty' },
];
exports.numberOptionsMenu = [
    { key: 'equals', value: 'equals' },
    { key: 'notequals', value: 'notequals' },
    { key: 'greater', value: 'greater' },
    { key: 'greaterorequals', value: 'greaterorequals' },
    { key: 'less', value: 'less' },
    { key: 'lessorequals', value: 'lessorequals' },
    { key: 'isempty', value: 'isempty' },
    { key: 'isnotempty', value: 'isnotempty' },
];
exports.dateOptionsMenu = [
    { key: 'equals', value: 'equals' },
    { key: 'notequals', value: 'notequals' },
    { key: 'after', value: 'after' },
    { key: 'afterequals', value: 'afterequals' },
    { key: 'before', value: 'before' },
    { key: 'beforeequals', value: 'beforeequals' },
];
exports.booleanOptionsMenu = [
    { key: 'all', value: 'all' },
    { key: 'istrue', value: 'istrue' },
    { key: 'isfalse', value: 'isfalse' },
    { key: 'isnull', value: 'isnull' },
    { key: 'isnotnull', value: 'isnotnull' },
];
exports.BooleanOptionsMenuComponent = function (_a) {
    var value = _a.value, handleClickItemMenu = _a.handleClickItemMenu;
    var t = react_i18next_1.useTranslation().t;
    return (react_1["default"].createElement(Select_1["default"], { value: value || 'all', onChange: function (e) { return handleClickItemMenu(e.target.value); } }, exports.booleanOptionsMenu.map(function (option) { return (react_1["default"].createElement(MenuItem_1["default"], { key: option.key, value: option.key }, t(option.value))); })));
};
exports.SelectFilterTmp = function (_a) {
    var value = _a.value, data = _a.data, handleClickItemMenu = _a.handleClickItemMenu;
    var t = react_i18next_1.useTranslation().t;
    return (react_1["default"].createElement(Select_1["default"], { value: value || '_ALL', onChange: function (e) { return handleClickItemMenu(e.target.value); } },
        react_1["default"].createElement(MenuItem_1["default"], { value: '_ALL' }, t(keys_1.langKeys.all)),
        data.map(function (option) { return (react_1["default"].createElement(MenuItem_1["default"], { key: option.value, value: option.value }, t(option.key))); })));
};
exports.DateOptionsMenuComponent = function (value, handleClickItemMenu) {
    var t = react_i18next_1.useTranslation().t;
    var _a = react_1.useState(null), value2 = _a[0], setvalue2 = _a[1];
    react_1.useEffect(function () {
        if (value === 'isnull' || value === 'isnotnull') {
            setvalue2(null);
        }
    }, [value]);
    return (react_1["default"].createElement(pickers_1.MuiPickersUtilsProvider, { utils: date_fns_1["default"], locale: helpers_1.localesLaraigo()[navigator.language.split('-')[0]] },
        react_1["default"].createElement(pickers_1.KeyboardDatePicker, { invalidDateMessage: t(keys_1.langKeys.invalid_date_format), format: helpers_1.getLocaleDateString(), value: value2, onChange: function (e) {
                handleClickItemMenu(e);
                setvalue2(e);
            }, style: { minWidth: '150px' } })));
};
exports.TimeOptionsMenuComponent = function (value, handleClickItemMenu) {
    return (react_1["default"].createElement(pickers_1.MuiPickersUtilsProvider, { utils: date_fns_1["default"], locale: (helpers_1.localesLaraigo())[navigator.language.split('-')[0]] },
        react_1["default"].createElement(pickers_1.KeyboardTimePicker, { ampm: false, views: ['hours', 'minutes', 'seconds'], format: "HH:mm:ss", error: false, helperText: '', value: value === '' ? null : value, onChange: function (e) { return handleClickItemMenu(e); }, style: { minWidth: '150px' } })));
};
exports.OptionsMenuComponent = function (type, operator, handleClickItemMenu) {
    var t = react_i18next_1.useTranslation().t;
    switch (type) {
        case "number":
        case "number-centered":
            return (exports.numberOptionsMenu.map(function (option) { return (react_1["default"].createElement(MenuItem_1["default"], { key: option.key, selected: option.key === operator, onClick: function () { return handleClickItemMenu(option.key); } }, t(option.value))); }));
        case "date":
        case "datetime-local":
        case "time":
            return (exports.dateOptionsMenu.map(function (option) { return (react_1["default"].createElement(MenuItem_1["default"], { key: option.key, selected: option.key === operator, onClick: function () { return handleClickItemMenu(option.key); } }, t(option.value))); }));
        case "string":
        case "color":
        default:
            return (exports.stringOptionsMenu.map(function (option) { return (react_1["default"].createElement(MenuItem_1["default"], { key: option.key, selected: option.key === operator, onClick: function () { return handleClickItemMenu(option.key); } }, t(option.value))); }));
    }
};
var TableZyx = react_1["default"].memo(function (_a) {
    var titlemodule = _a.titlemodule, columns = _a.columns, data = _a.data, fetchData = _a.fetchData, _b = _a.download, download = _b === void 0 ? false : _b, _c = _a.importData, importData = _c === void 0 ? false : _c, importDataFunction = _a.importDataFunction, _d = _a.deleteData, deleteData = _d === void 0 ? false : _d, deleteDataFunction = _a.deleteDataFunction, register = _a.register, handleRegister = _a.handleRegister, _e = _a.calculate, calculate = _e === void 0 ? false : _e, handleCalculate = _a.handleCalculate, HeadComponent = _a.HeadComponent, ButtonsElement = _a.ButtonsElement, triggerExportPersonalized = _a.triggerExportPersonalized, exportPersonalized = _a.exportPersonalized, _f = _a.pageSizeDefault, pageSizeDefault = _f === void 0 ? 20 : _f, importCSV = _a.importCSV, handleTemplate = _a.handleTemplate, _g = _a.filterGeneral, filterGeneral = _g === void 0 ? true : _g, _h = _a.loading, loading = _h === void 0 ? false : _h, useSelection = _a.useSelection, selectionKey = _a.selectionKey, initialSelectedRows = _a.initialSelectedRows, setSelectedRows = _a.setSelectedRows, allRowsSelected = _a.allRowsSelected, setAllRowsSelected = _a.setAllRowsSelected, onClickRow = _a.onClickRow, _j = _a.toolsFooter, toolsFooter = _j === void 0 ? true : _j, _k = _a.initialPageIndex, initialPageIndex = _k === void 0 ? 0 : _k, _l = _a.helperText, helperText = _l === void 0 ? "" : _l, initialStateFilter = _a.initialStateFilter, registertext = _a.registertext, setDataFiltered = _a.setDataFiltered, _m = _a.useFooter, useFooter = _m === void 0 ? false : _m, _o = _a.heightWithCheck, heightWithCheck = _o === void 0 ? 43 : _o, _p = _a.checkHistoryCenter, checkHistoryCenter = _p === void 0 ? false : _p, _q = _a.acceptTypeLoad, acceptTypeLoad = _q === void 0 ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv" : _q;
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var _r = react_1.useState(true), initial = _r[0], setInitial = _r[1];
    var DefaultColumnFilter = function (_a) {
        var _b = _a.column, header = _b.id, $setFilter = _b.setFilter, _c = _b.listSelectFilter, listSelectFilter = _c === void 0 ? [] : _c, _d = _b.type, type = _d === void 0 ? "string" : _d;
        var iSF = initialStateFilter === null || initialStateFilter === void 0 ? void 0 : initialStateFilter.filter(function (x) { return x.id === header; })[0];
        var _e = react_1.useState((iSF === null || iSF === void 0 ? void 0 : iSF.value.value) || ''), value = _e[0], setValue = _e[1];
        var _f = react_1.useState(null), anchorEl = _f[0], setAnchorEl = _f[1];
        var open = Boolean(anchorEl);
        var _g = react_1.useState((iSF === null || iSF === void 0 ? void 0 : iSF.value.operator) || "contains"), operator = _g[0], setoperator = _g[1];
        var setFilter = function (filter) {
            var _a;
            $setFilter(filter);
            dispatch(actions_1.setMemoryTable({
                filter: (_a = {},
                    _a[header] = {
                        value: filter.value,
                        operator: filter.operator,
                        type: filter.type
                    },
                    _a)
            }));
        };
        var handleCloseMenu = function () {
            setAnchorEl(null);
        };
        var handleClickItemMenu = function (op) {
            setAnchorEl(null);
            if (type === 'boolean') {
                setoperator(op);
                setValue(op);
                setFilter({ value: op, operator: op, type: type });
            }
            else if (type === "select") {
                setValue(op);
                setFilter({ value: op, operator: op, type: type });
            }
            else {
                if (['isempty', 'isnotempty', 'isnull', 'isnotnull'].includes(op) || !!value) {
                    setFilter({ value: value, operator: op, type: type });
                }
                setoperator(op);
            }
        };
        var handleClickMenu = function (event) {
            setAnchorEl(event.currentTarget);
        };
        var keyPress = react_1["default"].useCallback(function (e) {
            if (e.keyCode === 13) {
                setFilter({ value: value, operator: operator, type: type });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value, operator]);
        var handleDate = function (date) {
            if (date === null || (date instanceof Date && !isNaN(date.valueOf()))) {
                setValue((date === null || date === void 0 ? void 0 : date.toISOString()) || '');
                setFilter({
                    value: (date === null || date === void 0 ? void 0 : date.toISOString().split('T')[0]) || '',
                    operator: operator,
                    type: type
                });
            }
        };
        var handleTime = function (date) {
            if (date === null || (date instanceof Date && !isNaN(date.valueOf()))) {
                setValue((date === null || date === void 0 ? void 0 : date.toISOString()) || '');
                setFilter({
                    value: date === null || date === void 0 ? void 0 : date.toLocaleTimeString(),
                    operator: operator,
                    type: type
                });
            }
        };
        react_1.useEffect(function () {
            if (!(initialStateFilter === null || initialStateFilter === void 0 ? void 0 : initialStateFilter.filter(function (x) { return x.id === header; })[0])) {
                switch (type) {
                    case "number":
                    case "number-centered":
                    case "date":
                    case "datetime-local":
                    case "time":
                    case "select":
                        setoperator("equals");
                        break;
                    case "boolean":
                        setoperator("all");
                        break;
                    case "string":
                    case "color":
                    default:
                        setoperator("contains");
                        break;
                }
            }
        }, [type]);
        return (react_1["default"].createElement("div", { style: { display: 'flex', flexDirection: 'row' } }, type === 'boolean' ? (react_1["default"].createElement(exports.BooleanOptionsMenuComponent, { value: value, handleClickItemMenu: handleClickItemMenu }))
            : (type === "select" ?
                react_1["default"].createElement(exports.SelectFilterTmp, { value: value, handleClickItemMenu: handleClickItemMenu, data: listSelectFilter }) :
                react_1["default"].createElement(react_1["default"].Fragment, null,
                    type === 'date' && exports.DateOptionsMenuComponent(value, handleDate),
                    type === 'time' && exports.TimeOptionsMenuComponent(value, handleTime),
                    !['date', 'time'].includes(type) &&
                        react_1["default"].createElement(Input_1["default"]
                        // disabled={loading}
                        , { 
                            // disabled={loading}
                            type: type, style: { fontSize: '15px', minWidth: '100px' }, fullWidth: true, value: value, onKeyDown: keyPress, onChange: function (e) {
                                setValue(e.target.value || '');
                                if (['date'].includes(type)) {
                                    setFilter({ value: e.target.value, operator: operator, type: type });
                                }
                            } }),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: handleClickMenu, size: "small" },
                        react_1["default"].createElement(icons_1.MoreVert, { style: { cursor: 'pointer' }, "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", color: "action", fontSize: "small" })),
                    react_1["default"].createElement(Menu_1["default"], { id: "long-menu", anchorEl: anchorEl, open: open, onClose: handleCloseMenu, PaperProps: {
                            style: {
                                maxHeight: 48 * 4.5,
                                width: '20ch'
                            }
                        } }, exports.OptionsMenuComponent(type, operator, handleClickItemMenu))))));
    };
    var filterCellValue = react_1["default"].useCallback(function (rows, id, filterValue) {
        var value = filterValue.value, operator = filterValue.operator, type = filterValue.type;
        return rows.filter(function (row) {
            var cellvalue = row.values[id] === null || row.values[id] === undefined ? "" : row.values[id];
            if (value === '' && !['isempty', 'isnotempty', 'isnull', 'isnotnull'].includes(operator))
                return true;
            switch (type) {
                case "number":
                case "number-centered":
                    switch (operator) {
                        case 'greater':
                            return cellvalue > Number(value);
                        case 'greaterorequals':
                            return cellvalue >= Number(value);
                        case 'less':
                            return cellvalue < Number(value);
                        case 'lessorequals':
                            return cellvalue <= Number(value);
                        case 'isnull':
                            return cellvalue === "";
                        case 'isnotnull':
                            return cellvalue !== "";
                        case 'notequals':
                            return cellvalue !== Number(value);
                        case 'equals':
                        default:
                            return cellvalue === Number(value);
                    }
                case "date":
                case "datetime-local":
                case "time":
                    switch (operator) {
                        case 'after':
                            return cellvalue > value;
                        case 'afterequals':
                            return cellvalue >= value;
                        case 'before':
                            return cellvalue < value;
                        case 'beforeequals':
                            return cellvalue <= value;
                        case 'isnull':
                            return cellvalue === "";
                        case 'isnotnull':
                            return cellvalue !== "";
                        case 'notequals':
                            return cellvalue !== value;
                        case 'equals':
                        default:
                            return cellvalue === value;
                    }
                case "boolean":
                    switch (operator) {
                        case 'istrue':
                            return typeof (cellvalue) === 'string' ? cellvalue === 'true' : cellvalue === true;
                        case 'isfalse':
                            return typeof (cellvalue) === 'string' ? cellvalue === 'false' : cellvalue === false;
                        case 'isnull':
                            return cellvalue === "";
                        case 'isnotnull':
                            return cellvalue !== "";
                        case 'all':
                        default:
                            return true;
                    }
                case "select":
                    switch (operator) {
                        default:
                            return value === '_ALL' ? true : cellvalue === value;
                    }
                case "string":
                default:
                    switch (operator) {
                        case 'equals':
                            return cellvalue === value;
                        case 'notequals':
                            return cellvalue !== value;
                        case 'isempty':
                            return cellvalue === '';
                        case 'isnotempty':
                            return cellvalue !== '';
                        case 'isnull':
                            return cellvalue === null;
                        case 'isnotnull':
                            return cellvalue !== null;
                        case 'notcontains':
                            return !("" + cellvalue).toLowerCase().includes(value.toLowerCase());
                        case 'contains':
                        default:
                            return ("" + cellvalue).toLowerCase().includes(value.toLowerCase());
                    }
            }
        });
    }, []);
    var defaultColumn = react_1["default"].useMemo(function () { return ({
        // Let's set up our default Filter UI
        Filter: function (props) { return DefaultColumnFilter(__assign(__assign({}, props), { data: data })); },
        filter: filterCellValue
    }); }, []);
    var _s = react_table_1.useTable({
        columns: columns,
        data: data,
        initialState: { pageSize: pageSizeDefault, selectedRowIds: initialSelectedRows || {}, filters: initialStateFilter || [] },
        defaultColumn: defaultColumn,
        getRowId: function (row, relativeIndex, parent) { return selectionKey
            ? (parent ? [row[selectionKey], parent].join('.') : row[selectionKey])
            : (parent ? [parent.id, relativeIndex].join('.') : relativeIndex); }
    }, react_table_1.useFilters, react_table_1.useGlobalFilter, react_table_1.useSortBy, react_table_1.usePagination, react_table_1.useRowSelect, function (hooks) {
        useSelection && hooks.visibleColumns.push(function (columns) { return __spreadArrays([
            {
                id: 'selection',
                width: 80,
                Header: function (_a) {
                    var getToggleAllPageRowsSelectedProps = _a.getToggleAllPageRowsSelectedProps;
                    return (react_1["default"].createElement("div", null,
                        react_1["default"].createElement(Checkbox_1["default"], __assign({ color: "primary", style: { padding: '0 24px 0 16px' } }, getToggleAllPageRowsSelectedProps()))));
                },
                Cell: function (_a) {
                    var row = _a.row;
                    return (react_1["default"].createElement("div", null, checkHistoryCenter === true ? react_1["default"].createElement(Checkbox_1["default"], { color: "primary", style: { padding: '0 24px 0 16px', height: 68 }, checked: row.isSelected, onChange: function (e) { return row.toggleRowSelected(); } }) :
                        react_1["default"].createElement(Checkbox_1["default"], { color: "primary", style: { padding: '0 24px 0 16px' }, checked: row.isSelected, onChange: function (e) { return row.toggleRowSelected(); } })));
                },
                NoFilter: true
            }
        ], columns); });
    }), getTableProps = _s.getTableProps, getTableBodyProps = _s.getTableBodyProps, headerGroups = _s.headerGroups, footerGroups = _s.footerGroups, prepareRow = _s.prepareRow, page = _s.page, // Instead of using 'rows', we'll use page,
    canPreviousPage = _s.canPreviousPage, canNextPage = _s.canNextPage, pageOptions = _s.pageOptions, pageCount = _s.pageCount, gotoPage = _s.gotoPage, nextPage = _s.nextPage, previousPage = _s.previousPage, setPageSize = _s.setPageSize, globalFilteredRows = _s.globalFilteredRows, setGlobalFilter = _s.setGlobalFilter, _t = _s.state, pageIndex = _t.pageIndex, pageSize = _t.pageSize, selectedRowIds = _t.selectedRowIds, toggleAllRowsSelected = _s.toggleAllRowsSelected;
    react_1.useEffect(function () {
        setDataFiltered && setDataFiltered(globalFilteredRows.map(function (x) { return x.original; }));
    }, [globalFilteredRows]);
    react_1.useEffect(function () {
        if (initialStateFilter) {
            if (initial) {
                gotoPage(initialPageIndex);
                setInitial(false);
            }
            else {
                dispatch(actions_1.setMemoryTable({
                    page: 0
                }));
            }
        }
    }, [data]);
    react_1.useEffect(function () {
        if (fetchData) {
            fetchData();
        }
    }, [fetchData]);
    react_1.useEffect(function () {
        setSelectedRows && setSelectedRows(selectedRowIds);
    }, [selectedRowIds]);
    react_1.useEffect(function () {
        if (allRowsSelected) {
            toggleAllRowsSelected(true);
            setAllRowsSelected && setAllRowsSelected(false);
        }
    }, [allRowsSelected]);
    var RenderRow = react_1["default"].useCallback(function (_a) {
        var index = _a.index, style = _a.style;
        style = __assign(__assign({}, style), { display: 'flex', alignItems: 'flex-end', cursor: onClickRow ? 'pointer' : 'default' });
        var row = page[index];
        prepareRow(row);
        return (react_1["default"].createElement(TableRow_1["default"], __assign({}, row.getRowProps({ style: style }), { hover: true }), row.cells.map(function (cell, _) {
            var _a;
            return react_1["default"].createElement(TableCell_1["default"], __assign({}, cell.getCellProps({
                style: __assign(__assign({}, (cell.column.width === 'auto' ? {
                    flex: 1
                } : {
                    minWidth: cell.column.minWidth,
                    width: cell.column.width,
                    maxWidth: cell.column.maxWidth
                })), { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: cell.column.type === "number" ? "right" : (((_a = cell.column.type) === null || _a === void 0 ? void 0 : _a.includes('centered')) ? "center" : "left") })
            }), { onClick: function () { var _a; return cell.column.id !== "selection" ? onClickRow && onClickRow(row.original, (_a = cell === null || cell === void 0 ? void 0 : cell.column) === null || _a === void 0 ? void 0 : _a.id) : null; } }), cell.render('Cell'));
        })));
    }, [headerGroups, prepareRow, page]);
    return (react_1["default"].createElement(Box_1["default"], { width: 1, style: { flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" } },
        react_1["default"].createElement(Box_1["default"], { className: classes.containerHeader, justifyContent: "space-between", alignItems: "center", mb: 1 },
            titlemodule ? react_1["default"].createElement("span", { className: classes.title },
                titlemodule,
                helperText !== "" ? react_1["default"].createElement(Tooltip_1["default"], { title: react_1["default"].createElement("div", { style: { fontSize: 12 } }, helperText), arrow: true, placement: "top" },
                    react_1["default"].createElement(InfoRounded_1["default"], { color: "action", className: classes.iconHelpText })) : "") : (react_1["default"].createElement("div", { style: { flexGrow: 1 } }, typeof ButtonsElement === 'function' ? ((react_1["default"].createElement(ButtonsElement, null))) : (ButtonsElement))),
            react_1["default"].createElement("span", { className: classes.containerButtons },
                fetchData && (react_1["default"].createElement(Tooltip_1["default"], { title: "Refresh" },
                    react_1["default"].createElement(Fab_1["default"], { size: "small", "aria-label": "add", color: "primary", disabled: loading, style: { marginLeft: '1rem' }, onClick: function () { return fetchData && fetchData({}); } },
                        react_1["default"].createElement(icons_1.Refresh, null)))),
                typeof ButtonsElement === 'function' ? ((react_1["default"].createElement(ButtonsElement, null))) : (ButtonsElement),
                importCSV && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("input", { name: "file", accept: acceptTypeLoad, id: "laraigo-upload-csv-file", type: "file", style: { display: 'none' }, onChange: function (e) { return importCSV(e.target.files); } }),
                    react_1["default"].createElement("label", { htmlFor: "laraigo-upload-csv-file" },
                        react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", component: "span", color: "primary", disabled: loading, startIcon: react_1["default"].createElement(Backup_1["default"], { color: "secondary" }), style: { backgroundColor: "#55BD84" } },
                            react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys["import"] }))),
                    handleTemplate &&
                        react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", component: "span", color: "primary", disabled: loading, startIcon: react_1["default"].createElement(ListAlt_1["default"], { color: "secondary" }), onClick: handleTemplate, style: { backgroundColor: "#55BD84" } },
                            react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.template })))),
                register && (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: loading, startIcon: react_1["default"].createElement(icons_1.Add, { color: "secondary" }), onClick: handleRegister, style: { backgroundColor: "#55BD84" } },
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: registertext || keys_1.langKeys.register }))),
                calculate && (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: loading, startIcon: react_1["default"].createElement(icons_1.Refresh, { color: "secondary" }), onClick: handleCalculate, style: { backgroundColor: "#55BD84" } },
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.calculate }))),
                download && (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: loading, onClick: function () { return triggerExportPersonalized ? exportPersonalized && exportPersonalized() : helpers_1.exportExcel(String(titlemodule || '') + "Report", globalFilteredRows.map(function (x) { return x.original; }), columns.filter(function (x) { return (!x.isComponent && !x.activeOnHover); })); }, startIcon: react_1["default"].createElement(icons_2.DownloadIcon, null) },
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.download }))),
                deleteData && (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "outlined", color: "primary", disabled: loading, onClick: deleteDataFunction, startIcon: react_1["default"].createElement(Delete_1["default"], { color: 'secondary' }), style: { backgroundColor: "#FB5F5F", color: "white" } },
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.deletedata }))),
                importData && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("input", { accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv", id: "uploadfile", type: "file", style: { display: "none" }, onChange: function (e) {
                            importDataFunction && importDataFunction(e.target.files);
                        }, onClick: function (event) {
                            // @ts-ignore
                            event.target.value = null;
                        } }),
                    react_1["default"].createElement("label", { htmlFor: "uploadfile" },
                        react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", component: "span", color: "secondary", startIcon: react_1["default"].createElement(Backup_1["default"], { color: "secondary" }), style: {
                                backgroundColor: "#55BD84",
                                color: "white"
                            } },
                            react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys["import"] }))))))),
        filterGeneral && (react_1["default"].createElement(Box_1["default"], { className: classes.containerFilterGeneral },
            react_1["default"].createElement("span", null),
            react_1["default"].createElement("div", { className: classes.containerSearch },
                react_1["default"].createElement(components_1.SearchField, { disabled: loading, colorPlaceHolder: '#FFF', handleChangeOther: setGlobalFilter, lazy: true })))),
        HeadComponent && react_1["default"].createElement(HeadComponent, null),
        react_1["default"].createElement(TableContainer_1["default"], { style: { position: "relative", flex: 1, display: "flex", flexDirection: "column" } },
            react_1["default"].createElement(Box_1["default"], { overflow: "auto", style: { flex: 1 } },
                react_1["default"].createElement(Table_1["default"], __assign({ size: "small" }, getTableProps(), { "aria-label": "enhanced table", "aria-labelledby": "tableTitle" }),
                    react_1["default"].createElement(TableHead_1["default"], { style: { display: 'table-header-group' } }, headerGroups.map(function (headerGroup) { return (react_1["default"].createElement(TableRow_1["default"], __assign({}, headerGroup.getHeaderGroupProps(), { style: useSelection ? { display: 'flex' } : {} }), headerGroup.headers.map(function (column, ii) { return (column.activeOnHover ?
                        react_1["default"].createElement("th", { style: { width: "0px" }, key: "header-floating" }) :
                        react_1["default"].createElement(TableCell_1["default"], { key: ii, style: useSelection ? __assign({}, (column.width === 'auto' ? {
                                flex: 1
                            } : {
                                minWidth: column.minWidth,
                                width: column.width,
                                maxWidth: column.maxWidth
                            })) : {} }, column.isComponent ?
                            column.render('Header') :
                            (react_1["default"].createElement(react_1["default"].Fragment, null,
                                react_1["default"].createElement("div", { className: classes.containerHeaderColumn },
                                    react_1["default"].createElement(Box_1["default"], __assign({}, column.getHeaderProps(column.getSortByToggleProps({ title: 'ordenar' })), { style: {
                                            whiteSpace: 'nowrap',
                                            wordWrap: 'break-word',
                                            display: 'flex',
                                            cursor: 'pointer',
                                            alignItems: 'center'
                                        } }),
                                        column.render('Header'),
                                        column.isSorted && (column.isSortedDesc ?
                                            react_1["default"].createElement(ArrowDownward_1["default"], { className: classes.iconOrder, color: "action" })
                                            :
                                                react_1["default"].createElement(ArrowUpward_1["default"], { className: classes.iconOrder, color: "action" }))),
                                    !!column.helpText && (react_1["default"].createElement(Tooltip_1["default"], { title: react_1["default"].createElement("div", { style: { fontSize: 12 } }, column.helpText), arrow: true, placement: "top" },
                                        react_1["default"].createElement(InfoRounded_1["default"], { color: "action", className: classes.iconHelpText })))),
                                react_1["default"].createElement("div", null, !column.NoFilter && column.render('Filter')))))); }))); })),
                    react_1["default"].createElement(TableBody_1["default"], __assign({}, getTableBodyProps(), { style: { backgroundColor: 'white' } }),
                        loading && react_1["default"].createElement(LoadingSkeleton, { columns: headerGroups[0].headers.length }),
                        (!loading && useSelection) && (react_1["default"].createElement(react_window_1.FixedSizeList, { style: { overflowX: 'hidden' }, direction: "vertical", width: "auto", height: page.length * 43, itemCount: page.length, itemSize: heightWithCheck }, RenderRow)),
                        (!loading && !useSelection) && page.map(function (row) {
                            prepareRow(row);
                            return (react_1["default"].createElement(TableRow_1["default"], __assign({}, row.getRowProps(), { hover: true, style: { cursor: onClickRow ? 'pointer' : 'default' } }), row.cells.map(function (cell, i) {
                                var _a;
                                return react_1["default"].createElement(TableCell_1["default"], __assign({}, cell.getCellProps({
                                    style: __assign(__assign({ minWidth: cell.column.minWidth, width: cell.column.width, maxWidth: cell.column.maxWidth, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, (toolsFooter ? {} : { padding: '0px' })), { textAlign: cell.column.type === "number" ? "right" : (((_a = cell.column.type) === null || _a === void 0 ? void 0 : _a.includes('centered')) ? "center" : "left") })
                                }), { onClick: function () { var _a; return cell.column.id !== "selection" ? onClickRow && onClickRow(row.original, (_a = cell === null || cell === void 0 ? void 0 : cell.column) === null || _a === void 0 ? void 0 : _a.id) : null; } }), cell.render('Cell'));
                            })));
                        })),
                    useFooter && react_1["default"].createElement(core_1.TableFooter, null, footerGroups.map(function (group) { return (react_1["default"].createElement(TableRow_1["default"], __assign({}, group.getFooterGroupProps()), group.headers.map(function (column) {
                        var _a;
                        return (react_1["default"].createElement(TableCell_1["default"], __assign({}, column.getFooterProps({
                            style: {
                                fontWeight: "bold",
                                color: "black",
                                textAlign: column.type === "number" ? "right" : (((_a = column.type) === null || _a === void 0 ? void 0 : _a.includes('centered')) ? "center" : "left")
                            }
                        })), column.render('Footer')));
                    }))); })))),
            toolsFooter && (react_1["default"].createElement(Box_1["default"], { className: classes.footerTable },
                react_1["default"].createElement(Box_1["default"], null,
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () {
                            gotoPage(0);
                            dispatch(actions_1.setMemoryTable({
                                page: 0
                            }));
                        }, disabled: !canPreviousPage || loading },
                        react_1["default"].createElement(icons_1.FirstPage, null)),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () {
                            previousPage();
                            dispatch(actions_1.setMemoryTable({
                                page: pageIndex - 1
                            }));
                        }, disabled: !canPreviousPage || loading },
                        react_1["default"].createElement(icons_1.NavigateBefore, null)),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () {
                            nextPage();
                            dispatch(actions_1.setMemoryTable({
                                page: pageIndex + 1
                            }));
                        }, disabled: !canNextPage || loading },
                        react_1["default"].createElement(icons_1.NavigateNext, null)),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () {
                            gotoPage(pageCount - 1);
                            dispatch(actions_1.setMemoryTable({
                                page: pageCount - 1
                            }));
                        }, disabled: !canNextPage || loading },
                        react_1["default"].createElement(icons_1.LastPage, null)),
                    react_1["default"].createElement(Box_1["default"], { component: "span", fontSize: 14 },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.tablePageOf, values: { currentPage: (pageOptions.length === 0 ? 0 : pageIndex + 1), totalPages: pageOptions.length }, components: [react_1["default"].createElement(Box_1["default"], { fontWeight: "700", component: "span", key: "ke4e1" }), react_1["default"].createElement(Box_1["default"], { fontWeight: "700", component: "span", key: "ke4e2" })] }))),
                react_1["default"].createElement(Box_1["default"], null,
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: (globalFilteredRows || []).length === 100000 ? keys_1.langKeys.tableShowingRecordOfMore : keys_1.langKeys.tableShowingRecordOf, values: { itemCount: page.length, totalItems: globalFilteredRows.length } })),
                react_1["default"].createElement(Box_1["default"], null,
                    react_1["default"].createElement(Select_1["default"], { disableUnderline: true, style: { display: 'inline-flex' }, value: pageSize, disabled: loading, onChange: function (e) {
                            setPageSize(Number(e.target.value));
                            dispatch(actions_1.setMemoryTable({
                                pageSize: Number(e.target.value)
                            }));
                        } }, [5, 10, 20, 50, 100].map(function (pageSize) { return (react_1["default"].createElement(MenuItem_1["default"], { key: pageSize, value: pageSize }, pageSize)); })),
                    react_1["default"].createElement(Box_1["default"], { fontSize: 14, display: "inline", style: { marginRight: '1rem' } },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.recordPerPage, count: pageSize }))))))));
});
TableZyx.displayName = "TableZyx";
exports["default"] = TableZyx;
var LoadingSkeleton = function (_a) {
    var columns = _a.columns;
    var items = [];
    for (var i = 0; i < columns; i++) {
        items.push(react_1["default"].createElement(TableCell_1["default"], { key: "table-simple-skeleton-" + i },
            react_1["default"].createElement(lab_1.Skeleton, null)));
    }
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(TableRow_1["default"], { key: "1aux1" }, items),
        react_1["default"].createElement(TableRow_1["default"], { key: "2aux2" }, items)));
};
