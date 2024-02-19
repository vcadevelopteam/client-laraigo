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
exports.buildQueryFilters = exports.useQueryParams = void 0;
var react_1 = require("react");
var Table_1 = require("@material-ui/core/Table");
var TableBody_1 = require("@material-ui/core/TableBody");
var TableCell_1 = require("@material-ui/core/TableCell");
var TableContainer_1 = require("@material-ui/core/TableContainer");
var TableHead_1 = require("@material-ui/core/TableHead");
var TableRow_1 = require("@material-ui/core/TableRow");
var IconButton_1 = require("@material-ui/core/IconButton");
var Select_1 = require("@material-ui/core/Select");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var Box_1 = require("@material-ui/core/Box");
var Input_1 = require("@material-ui/core/Input");
var styles_1 = require("@material-ui/core/styles");
var react_i18next_1 = require("react-i18next");
var Tooltip_1 = require("@material-ui/core/Tooltip");
var react_i18next_2 = require("react-i18next");
var Button_1 = require("@material-ui/core/Button");
var keys_1 = require("lang/keys");
var icons_1 = require("icons");
var Backup_1 = require("@material-ui/icons/Backup");
var AllInbox_1 = require("@material-ui/icons/AllInbox");
var ViewWeek_1 = require("@material-ui/icons/ViewWeek");
var clsx_1 = require("clsx");
var lab_1 = require("@material-ui/lab");
var icons_2 = require("@material-ui/icons");
var InfoRounded_1 = require("@material-ui/icons/InfoRounded");
var Menu_1 = require("@material-ui/core/Menu");
var react_table_1 = require("react-table");
var components_1 = require("components");
var core_1 = require("@material-ui/core");
var table_simple_1 = require("./table-simple");
var helpers_1 = require("common/helpers");
var useStyles = styles_1.makeStyles(function (theme) {
    var _a, _b, _c;
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
        containerfloat: {
            borderBottom: 'none',
            padding: '4px 24px 4px 16px',
            backgroundColor: 'white',
            marginTop: '1px',
            position: 'absolute',
            zIndex: 9999,
            left: 0,
            visibility: 'hidden'
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
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8
        },
        containerButtonsNoFilters: {
            display: 'flex',
            width: '100%',
            justifyContent: 'end',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8
        },
        iconOrder: {
            width: 20,
            height: 20,
            color: theme.palette.text.primary
        },
        containerHeader: (_c = {
                display: 'block',
                backgroundColor: '#FFF',
                padding: theme.spacing(1)
            },
            _c[theme.breakpoints.up('sm')] = {
                display: 'flex'
            },
            _c),
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
var DefaultColumnFilter = function (_a) {
    var header = _a.header, type = _a.type, setFilters = _a.setFilters, filters = _a.filters, listSelectFilter = _a.listSelectFilter;
    var _b = react_1.useState(''), value = _b[0], setValue = _b[1];
    var _c = react_1["default"].useState(null), anchorEl = _c[0], setAnchorEl = _c[1];
    var open = Boolean(anchorEl);
    var _d = react_1.useState("contains"), operator = _d[0], setoperator = _d[1];
    react_1.useEffect(function () {
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
    }, [type]);
    react_1.useEffect(function () {
        if (['number', 'number-centered'].includes(type))
            setoperator("equals");
    }, [type]);
    var keyPress = function (e) {
        var _a, _b;
        if (e.keyCode === 13) {
            if (value || operator === "noempty" || operator === "empty")
                setFilters(__assign(__assign({}, filters), (_a = {}, _a[header] = {
                    value: value,
                    operator: operator
                }, _a)), 0);
            else
                setFilters(__assign(__assign({}, filters), (_b = {}, _b[header] = undefined, _b)), 0);
        }
    };
    var handleCloseMenu = function () {
        setAnchorEl(null);
    };
    var handleClickItemMenu = function (op) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        setAnchorEl(null);
        setoperator(op);
        if (type === 'boolean') {
            setValue(op);
            setFilters(__assign(__assign({}, filters), (_a = {}, _a[header] = {
                value: op,
                operator: op
            }, _a)), 0);
        }
        else if (type === "select") {
            setValue(op);
            setFilters(__assign(__assign({}, filters), (_b = {}, _b[header] = op === "_ALL" ? undefined : {
                value: op,
                operator: "equals"
            }, _b)), 0);
        }
        else if (type === "text" || !type) {
            if (op === 'isempty' ||
                op === 'isnotempty' ||
                op === 'isnull' ||
                op === 'isnotnull') {
                setFilters(__assign(__assign({}, filters), (_c = {}, _c[header] = {
                    value: '',
                    operator: op
                }, _c)), 0);
            }
            else if (value) {
                setFilters(__assign(__assign({}, filters), (_d = {}, _d[header] = {
                    value: value,
                    operator: op
                }, _d)), 0);
            }
        }
        else if (['number', 'number-centered'].includes(type)) {
            if (op === 'isempty' ||
                op === 'isnotempty' ||
                op === 'isnull' ||
                op === 'isnotnull') {
                setFilters(__assign(__assign({}, filters), (_e = {}, _e[header] = {
                    value: '',
                    operator: op
                }, _e)), 0);
            }
            else if (value) {
                setFilters(__assign(__assign({}, filters), (_f = {}, _f[header] = {
                    value: value,
                    operator: op
                }, _f)), 0);
            }
        }
        else {
            if (op === 'isempty' ||
                op === 'isnotempty' ||
                op === 'isnull' ||
                op === 'isnotnull') {
                setFilters(__assign(__assign({}, filters), (_g = {}, _g[header] = {
                    value: '',
                    operator: op
                }, _g)), 0);
            }
            else if (value !== '') {
                setFilters(__assign(__assign({}, filters), (_h = {}, _h[header] = {
                    value: value,
                    operator: op
                }, _h)), 0);
            }
        }
    };
    var handleClickMenu = function (event) {
        setAnchorEl(event.currentTarget);
    };
    var handleDate = function (date) {
        var _a, _b;
        if (date === null || (date instanceof Date && !isNaN(date.valueOf()))) {
            setValue((date === null || date === void 0 ? void 0 : date.toISOString()) || '');
            if (!!date || ['isnull', 'isnotnull'].includes(operator)) {
                setFilters(__assign(__assign({}, filters), (_a = {}, _a[header] = {
                    value: (date === null || date === void 0 ? void 0 : date.toISOString().split('T')[0]) || '',
                    operator: operator
                }, _a)), 0);
            }
            else {
                setFilters(__assign(__assign({}, filters), (_b = {}, _b[header] = undefined, _b)), 0);
            }
        }
    };
    var handleTime = function (date) {
        var _a, _b;
        if (date === null || (date instanceof Date && !isNaN(date.valueOf()))) {
            setValue((date === null || date === void 0 ? void 0 : date.toISOString()) || '');
            if (!!date || ['isnull', 'isnotnull'].includes(operator)) {
                setFilters(__assign(__assign({}, filters), (_a = {}, _a[header] = {
                    value: date === null || date === void 0 ? void 0 : date.toLocaleTimeString(),
                    operator: operator
                }, _a)), 0);
            }
            else {
                setFilters(__assign(__assign({}, filters), (_b = {}, _b[header] = undefined, _b)), 0);
            }
        }
    };
    react_1.useEffect(function () {
        var _a;
        if (Object.keys(filters).length === 0)
            setValue('');
        else if (header in filters) {
            setValue(((_a = filters === null || filters === void 0 ? void 0 : filters[header]) === null || _a === void 0 ? void 0 : _a.value) || '');
            if (filters === null || filters === void 0 ? void 0 : filters[header])
                setoperator(filters[header].operator);
        }
    }, [filters]);
    return (react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center' } }, type === 'boolean' ?
        react_1["default"].createElement(table_simple_1.BooleanOptionsMenuComponent, { value: value, handleClickItemMenu: handleClickItemMenu })
        :
            (type === "select" ?
                react_1["default"].createElement(table_simple_1.SelectFilterTmp, { value: value, handleClickItemMenu: handleClickItemMenu, data: listSelectFilter || [] }) :
                react_1["default"].createElement(react_1["default"].Fragment, null,
                    type === 'date' && table_simple_1.DateOptionsMenuComponent(value, handleDate),
                    type === 'time' && table_simple_1.TimeOptionsMenuComponent(value, handleTime),
                    !['date', 'time'].includes(type) &&
                        react_1["default"].createElement(Input_1["default"], { style: { fontSize: '15px', minWidth: '100px' }, type: ['number', 'number-centered'].includes(type) ? "number" : "text", fullWidth: true, value: value, onKeyDown: keyPress, onChange: function (e) { return setValue(e.target.value); } }),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: handleClickMenu, size: "small" },
                        react_1["default"].createElement(icons_2.MoreVert, { style: { cursor: 'pointer' }, "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", color: "action", fontSize: "small" })),
                    react_1["default"].createElement(Menu_1["default"], { id: "long-menu", anchorEl: anchorEl, open: open, onClose: handleCloseMenu, PaperProps: {
                            style: {
                                maxHeight: 48 * 4.5,
                                width: '20ch'
                            }
                        } }, table_simple_1.OptionsMenuComponent(type || 'string', operator, handleClickItemMenu))))));
};
var TableZyx = react_1["default"].memo(function (_a) {
    var _b;
    var titlemodule = _a.titlemodule, columns = _a.columns, data = _a.data, fetchData = _a.fetchData, filterrange = _a.filterrange, totalrow = _a.totalrow, controlledPageCount = _a.pageCount, download = _a.download, register = _a.register, handleRegister = _a.handleRegister, HeadComponent = _a.HeadComponent, ButtonsElement = _a.ButtonsElement, exportPersonalized = _a.exportPersonalized, loading = _a.loading, importCSV = _a.importCSV, _c = _a.autotrigger, autotrigger = _c === void 0 ? false : _c, autoRefresh = _a.autoRefresh, useSelection = _a.useSelection, selectionKey = _a.selectionKey, selectionFilter = _a.selectionFilter, initialSelectedRows = _a.initialSelectedRows, cleanSelection = _a.cleanSelection, setCleanSelection = _a.setCleanSelection, setSelectedRows = _a.setSelectedRows, onClickRow = _a.onClickRow, FiltersElement = _a.FiltersElement, _d = _a.filterRangeDate, filterRangeDate = _d === void 0 ? "month" : _d, onFilterChange = _a.onFilterChange, _e = _a.initialEndDate, initialEndDate = _e === void 0 ? null : _e, _f = _a.initialStartDate, initialStartDate = _f === void 0 ? null : _f, _g = _a.initialFilters, initialFilters = _g === void 0 ? {} : _g, _h = _a.initialPageIndex, initialPageIndex = _h === void 0 ? 0 : _h, groupedBy = _a.groupedBy, showHideColumns = _a.showHideColumns;
    var classes = useStyles();
    var _j = react_1.useState({ sorts: {}, filters: initialFilters, pageIndex: initialPageIndex }), pagination = _j[0], setPagination = _j[1];
    var _k = react_1.useState(false), openDateRangeModal = _k[0], setOpenDateRangeModal = _k[1];
    var _l = react_1.useState(autotrigger), triggerSearch = _l[0], setTriggerSearch = _l[1];
    var _m = react_1.useState({
        startDate: initialStartDate,
        endDate: initialEndDate,
        page: initialPageIndex,
        filters: initialFilters
    }), tFilters = _m[0], setTFilters = _m[1];
    var _o = react_table_1.useTable({
        columns: columns,
        data: data,
        initialState: { pageIndex: initialPageIndex, pageSize: 20, selectedRowIds: initialSelectedRows || {} },
        manualPagination: true,
        pageCount: controlledPageCount,
        useControlledState: function (state) {
            return react_1.useMemo(function () { return (__assign(__assign({}, state), { pageIndex: pagination.pageIndex })); }, [state, pagination.pageIndex]);
        },
        autoResetSelectedRows: false,
        getRowId: function (row, relativeIndex, parent) { return selectionKey
            ? (parent ? [row[selectionKey], parent].join('.') : row[selectionKey])
            : (parent ? [parent.id, relativeIndex].join('.') : relativeIndex); },
        stateReducer: function (newState, action) {
            switch (action.type) {
                case 'toggleAllRowsSelected':
                    return __assign(__assign({}, newState), { selectedRowIds: {} });
                default:
                    return newState;
            }
        }
    }, react_table_1.useFilters, react_table_1.useGlobalFilter, react_table_1.usePagination, react_table_1.useRowSelect, function (hooks) {
        useSelection && hooks.visibleColumns.push(function (columns) { return __spreadArrays([
            {
                id: 'selection',
                width: 80,
                Header: function (_a) {
                    var getToggleAllPageRowsSelectedProps = _a.getToggleAllPageRowsSelectedProps, filteredRows = _a.filteredRows;
                    return (!selectionFilter
                        ?
                            react_1["default"].createElement("div", { style: { textAlign: 'right' } },
                                react_1["default"].createElement(core_1.Checkbox, __assign({ color: "primary", style: { padding: 0 } }, getToggleAllPageRowsSelectedProps())))
                        :
                            react_1["default"].createElement("div", { style: { textAlign: 'right' } },
                                react_1["default"].createElement(core_1.Checkbox, { color: "primary", style: { padding: 0 }, checked: filteredRows
                                        .filter(function (p) { return p.original[selectionFilter === null || selectionFilter === void 0 ? void 0 : selectionFilter.key] === (selectionFilter === null || selectionFilter === void 0 ? void 0 : selectionFilter.value); })
                                        .every(function (p) { return p.isSelected; }), onChange: function () {
                                        filteredRows
                                            .filter(function (p) { return p.original[selectionFilter === null || selectionFilter === void 0 ? void 0 : selectionFilter.key] === (selectionFilter === null || selectionFilter === void 0 ? void 0 : selectionFilter.value); })
                                            .forEach(function (p) {
                                            p.toggleRowSelected();
                                        });
                                    } })));
                },
                Cell: function (_a) {
                    var row = _a.row;
                    return (!selectionFilter || row.original[selectionFilter === null || selectionFilter === void 0 ? void 0 : selectionFilter.key] === (selectionFilter === null || selectionFilter === void 0 ? void 0 : selectionFilter.value)
                        ? react_1["default"].createElement("div", { style: { textAlign: 'right' } },
                            react_1["default"].createElement(core_1.Checkbox, { color: "primary", style: { padding: 0 }, checked: row.isSelected, onChange: function (e) { return row.toggleRowSelected(); } }))
                        : null);
                },
                NoFilter: true,
                isComponent: true
            }
        ], columns); });
    }), getTableProps = _o.getTableProps, getTableBodyProps = _o.getTableBodyProps, headerGroups = _o.headerGroups, prepareRow = _o.prepareRow, page = _o.page, // Instead of using 'rows', we'll use page,
    canPreviousPage = _o.canPreviousPage, canNextPage = _o.canNextPage, pageOptions = _o.pageOptions, pageCount = _o.pageCount, setPageSize = _o.setPageSize, toggleAllRowsSelected = _o.toggleAllRowsSelected, allColumns = _o.allColumns, _p = _o.state, pageIndex = _p.pageIndex, pageSize = _p.pageSize, selectedRowIds = _p.selectedRowIds;
    var setFilters = function (filters, page) {
        setPagination(function (prev) {
            // const pageIndex = !page ? prev.pageIndex : page;
            return __assign(__assign({}, prev), { filters: filters, pageIndex: 0, trigger: true });
        });
    };
    var setPageIndex = function (page) {
        setPagination(function (prev) { return (__assign(__assign({}, prev), { pageIndex: page, trigger: true })); });
        setTFilters(function (prev) { return (__assign(__assign({}, prev), { page: page })); });
    };
    var handleClickSort = function (column) {
        var newsorts = {};
        if (Object.keys(pagination.sorts).includes(column)) {
            newsorts = __assign({}, pagination.sorts);
        }
        if (newsorts[column] === "desc") {
            delete newsorts[column];
        }
        else {
            if (newsorts[column] === "asc") {
                newsorts[column] = "desc";
            }
            else {
                newsorts[column] = "asc";
            }
        }
        setPagination(function (prev) { return (__assign(__assign({}, prev), { sorts: newsorts, trigger: true })); });
    };
    var _q = react_1.useState({
        startDate: initialStartDate ? new Date(initialStartDate) : filterRangeDate === "month" ? helpers_1.getFirstDayMonth() : helpers_1.getDateToday(),
        endDate: initialEndDate ? new Date(initialEndDate) : filterRangeDate === "month" ? helpers_1.getLastDayMonth() : helpers_1.getDateToday(),
        key: 'selection'
    }), dateRange = _q[0], setdateRange = _q[1];
    var triggertmp = function (fromButton) {
        if (fromButton === void 0) { fromButton = false; }
        if (fromButton)
            setPagination(function (prev) { return (__assign(__assign({}, prev), { pageIndex: initialPageIndex, trigger: false })); });
        if (!fetchData)
            return;
        fetchData(__assign(__assign({}, pagination), { pageSize: pageSize, pageIndex: fromButton ? initialPageIndex : pagination.pageIndex, daterange: {
                startDate: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
                endDate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null
            } }));
        setTFilters(function (prev) { return (__assign(__assign({}, prev), { page: fromButton ? initialPageIndex : pagination.pageIndex, startDate: dateRange.startDate ? (new Date(dateRange.startDate.setHours(10))).getTime() : null, endDate: dateRange.endDate ? (new Date(dateRange.endDate.setHours(10))).getTime() : null })); });
    };
    react_1.useEffect(function () {
        if (cleanSelection) {
            toggleAllRowsSelected(false);
            setSelectedRows && setSelectedRows({});
            setCleanSelection && setCleanSelection(false);
        }
    }, [cleanSelection]);
    react_1.useEffect(function () {
        if (pagination === null || pagination === void 0 ? void 0 : pagination.trigger) {
            triggertmp();
        }
    }, [pagination, triggerSearch]);
    react_1.useEffect(function () {
        if (triggerSearch) {
            triggertmp();
        }
    }, [pageSize]);
    react_1.useEffect(function () {
        if (triggerSearch) {
            triggerSearch && triggertmp(true);
        }
    }, [triggerSearch]);
    react_1.useEffect(function () {
        if (autoRefresh === null || autoRefresh === void 0 ? void 0 : autoRefresh.value) {
            triggertmp();
            autoRefresh === null || autoRefresh === void 0 ? void 0 : autoRefresh.callback(false);
        }
    }, [autoRefresh]);
    react_1.useEffect(function () {
        setSelectedRows && setSelectedRows(selectedRowIds);
    }, [selectedRowIds]);
    react_1.useEffect(function () {
        onFilterChange === null || onFilterChange === void 0 ? void 0 : onFilterChange(tFilters);
    }, [tFilters]);
    var exportData = function () {
        exportPersonalized && exportPersonalized(__assign(__assign({}, pagination), { daterange: {
                startDate: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
                endDate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null
            } }));
    };
    var t = react_i18next_2.useTranslation().t;
    var showExtraButtonIcon = showHideColumns || groupedBy;
    var _r = react_1["default"].useState(null), anchorElSeButtons = _r[0], setAnchorElSeButtons = _r[1];
    var _s = react_1.useState(false), openSeButtons = _s[0], setOpenSeButtons = _s[1];
    var _t = react_1.useState(false), isGroupedByModalOpen = _t[0], setGroupedByModalOpen = _t[1];
    var _u = react_1.useState(false), isShowColumnsModalOpen = _u[0], setShowColumnsModalOpen = _u[1];
    var _v = react_1.useState({}), columnVisibility = _v[0], setColumnVisibility = _v[1];
    var handleClickSeButtons = function (event) {
        setAnchorElSeButtons(anchorElSeButtons ? null : event.currentTarget);
        setOpenSeButtons(function (prevOpen) { return !prevOpen; });
    };
    var handleOpenGroupedByModal = function () {
        setGroupedByModalOpen(true);
    };
    var handleOpenShowColumnsModal = function () {
        setShowColumnsModalOpen(true);
        if (openSeButtons) {
            setAnchorElSeButtons(null);
            setOpenSeButtons(false);
        }
    };
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            var target = event.target;
            if (!isGroupedByModalOpen && !isShowColumnsModalOpen && anchorElSeButtons && !anchorElSeButtons.contains(target)) {
                setAnchorElSeButtons(null);
                setOpenSeButtons(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return function () {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isGroupedByModalOpen, isShowColumnsModalOpen, anchorElSeButtons, setOpenSeButtons]);
    return (react_1["default"].createElement(Box_1["default"], { width: 1, style: { flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" } },
        titlemodule && react_1["default"].createElement("div", { className: classes.title }, titlemodule),
        react_1["default"].createElement(Box_1["default"], { className: classes.containerHeader, justifyContent: "space-between", alignItems: "center" },
            react_1["default"].createElement("div", { className: clsx_1["default"]((_b = {},
                    _b[classes.containerButtons] = Boolean(FiltersElement),
                    _b[classes.containerButtonsNoFilters] = !FiltersElement,
                    _b)) },
                filterrange && (react_1["default"].createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
                    react_1["default"].createElement(components_1.DateRangePicker, { open: openDateRangeModal, setOpen: setOpenDateRangeModal, range: dateRange, onSelect: setdateRange },
                        react_1["default"].createElement(Button_1["default"], { disabled: loading, style: { border: '1px solid #bfbfc0', borderRadius: 4, color: 'rgb(143, 146, 161)' }, startIcon: react_1["default"].createElement(icons_1.CalendarIcon, null), onClick: function () { return setOpenDateRangeModal(!openDateRangeModal); } }, helpers_1.getDateCleaned(dateRange.startDate) + " - " + helpers_1.getDateCleaned(dateRange.endDate))),
                    FiltersElement,
                    react_1["default"].createElement(Button_1["default"], { disabled: loading, variant: "contained", color: "primary", startIcon: react_1["default"].createElement(icons_2.Search, { style: { color: 'white' } }), style: { backgroundColor: '#55BD84', width: 120 }, onClick: function () {
                            if (triggerSearch)
                                triggertmp(true);
                            setTriggerSearch(true);
                        } },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.search })))),
                (!filterrange && Boolean(FiltersElement)) && (react_1["default"].createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
                    FiltersElement,
                    react_1["default"].createElement(Button_1["default"], { disabled: loading, variant: "contained", color: "primary", startIcon: react_1["default"].createElement(icons_2.Search, { style: { color: 'white' } }), style: { backgroundColor: '#55BD84', width: 120 }, onClick: function () {
                            if (triggerSearch)
                                triggertmp(true);
                            setTriggerSearch(true);
                        } },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.search })))),
                react_1["default"].createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
                    typeof ButtonsElement === 'function' ? ((react_1["default"].createElement(ButtonsElement, null))) : (ButtonsElement),
                    importCSV && (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement("input", { name: "file", accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", id: "laraigo-upload-csv-file", type: "file", style: { display: 'none' }, onChange: function (e) { return importCSV(e.target.files); } }),
                        react_1["default"].createElement("label", { htmlFor: "laraigo-upload-csv-file" },
                            react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", component: "span", color: "primary", disabled: loading, startIcon: react_1["default"].createElement(Backup_1["default"], { color: "secondary" }), style: { backgroundColor: "#55BD84" } },
                                react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys["import"] }))))),
                    register && (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: loading, startIcon: react_1["default"].createElement(icons_2.Add, { color: "secondary" }), onClick: handleRegister, style: { backgroundColor: "#55BD84" } },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.register }))),
                    download && (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: loading, onClick: exportData, 
                        // exportPersonalized
                        startIcon: react_1["default"].createElement(icons_1.DownloadIcon, null) },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.download }))),
                    showExtraButtonIcon && (react_1["default"].createElement("div", null,
                        react_1["default"].createElement(IconButton_1["default"], { "aria-label": "more", id: "long-button", onClick: function (event) { return handleClickSeButtons(event); }, style: { backgroundColor: openSeButtons ? '#F6E9FF' : undefined, color: openSeButtons ? '#7721AD' : undefined } },
                            react_1["default"].createElement(icons_2.MoreVert, null)),
                        react_1["default"].createElement("div", { style: { display: 'flex', gap: 8 } },
                            react_1["default"].createElement(core_1.Popper, { open: openSeButtons, anchorEl: anchorElSeButtons, placement: "bottom", transition: true, style: { marginRight: '1rem' } }, function (_a) {
                                var TransitionProps = _a.TransitionProps;
                                return (react_1["default"].createElement(core_1.Paper, __assign({}, TransitionProps, { elevation: 5 }),
                                    groupedBy && (react_1["default"].createElement("div", null,
                                        react_1["default"].createElement(MenuItem_1["default"], { style: { padding: '0.7rem 1rem', fontSize: '0.96rem' }, onClick: handleOpenGroupedByModal },
                                            react_1["default"].createElement(core_1.ListItemIcon, null,
                                                react_1["default"].createElement(AllInbox_1["default"], { fontSize: "small", style: { fill: 'grey', height: '23px' } })),
                                            react_1["default"].createElement(core_1.Typography, { variant: "inherit" }, t(keys_1.langKeys.groupedBy))),
                                        react_1["default"].createElement(core_1.Divider, null))),
                                    showHideColumns && (react_1["default"].createElement(MenuItem_1["default"], { style: { padding: '0.7rem 1rem', fontSize: '0.96rem' }, onClick: handleOpenShowColumnsModal },
                                        react_1["default"].createElement(core_1.ListItemIcon, null,
                                            react_1["default"].createElement(ViewWeek_1["default"], { fontSize: "small", style: { fill: 'grey', height: '25px' } })),
                                        react_1["default"].createElement(core_1.Typography, { variant: "inherit" }, t(keys_1.langKeys.showHideColumns))))));
                            })))),
                    isShowColumnsModalOpen && (react_1["default"].createElement(components_1.DialogZyx, { open: isShowColumnsModalOpen, title: t(keys_1.langKeys.showHideColumns), buttonText2: t(keys_1.langKeys.close), handleClickButton2: function () { return setShowColumnsModalOpen(false); }, maxWidth: "sm", buttonStyle1: { marginBottom: '0.3rem' }, buttonStyle2: { marginRight: '1rem', marginBottom: '0.3rem' } },
                        react_1["default"].createElement(core_1.Grid, { container: true, spacing: 1, style: { marginTop: '0.5rem' } }, allColumns.filter(function (column) {
                            var isColumnInstance = 'accessor' in column && 'Header' in column;
                            return isColumnInstance && 'showColumn' in column && column.showColumn === true;
                        })
                            .map(function (column) { return (react_1["default"].createElement(core_1.Grid, { item: true, xs: 4, key: column.id },
                            react_1["default"].createElement(core_1.FormControlLabel, { control: react_1["default"].createElement(core_1.Checkbox, { color: "primary", checked: !columnVisibility[column.id], onChange: function () {
                                        column.toggleHidden();
                                        setColumnVisibility(function (prevVisibility) {
                                            var _a;
                                            return (__assign(__assign({}, prevVisibility), (_a = {}, _a[column.id] = !prevVisibility[column.id], _a)));
                                        });
                                    } }), label: t(column.Header) }))); })))),
                    isGroupedByModalOpen && (react_1["default"].createElement(components_1.DialogZyx, { open: isGroupedByModalOpen, title: t(keys_1.langKeys.groupedBy), buttonText1: t(keys_1.langKeys.close), buttonText2: t(keys_1.langKeys.apply), handleClickButton1: function () { return setGroupedByModalOpen(false); }, handleClickButton2: function () { return setGroupedByModalOpen(false); }, maxWidth: "sm", buttonStyle1: { marginBottom: '0.3rem' }, buttonStyle2: { marginRight: '1rem', marginBottom: '0.3rem' } }))))),
        HeadComponent && react_1["default"].createElement(HeadComponent, null),
        react_1["default"].createElement(TableContainer_1["default"], { style: { position: "relative", flex: 1, display: "flex", flexDirection: "column" } },
            react_1["default"].createElement(Box_1["default"], { overflow: "auto", style: { flex: 1 } },
                react_1["default"].createElement(Table_1["default"], __assign({}, getTableProps(), { "aria-label": "enhanced table", size: "small", "aria-labelledby": "tableTitle" }),
                    react_1["default"].createElement(TableHead_1["default"], null, headerGroups.map(function (headerGroup, index) { return (react_1["default"].createElement(TableRow_1["default"], __assign({}, headerGroup.getHeaderGroupProps(), { key: index }), headerGroup.headers.map(function (column, ii) { return (column.activeOnHover ?
                        react_1["default"].createElement("th", { style: { width: "0px" }, key: "header-floating" }) :
                        react_1["default"].createElement(TableCell_1["default"], { key: ii }, column.isComponent ?
                            column.render('Header')
                            :
                                (react_1["default"].createElement(react_1["default"].Fragment, null,
                                    react_1["default"].createElement("div", { className: classes.containerHeaderColumn },
                                        react_1["default"].createElement(Box_1["default"], __assign({ component: "div" }, column.getHeaderProps(), { onClick: function () { return !column.NoSort && handleClickSort(column.id); }, style: {
                                                whiteSpace: 'nowrap',
                                                wordWrap: 'break-word',
                                                display: 'flex',
                                                cursor: 'pointer',
                                                alignItems: 'center'
                                            } }),
                                            column.render('Header'),
                                            pagination.sorts[column.id] && (pagination.sorts[column.id] === "asc" ?
                                                react_1["default"].createElement(icons_2.ArrowUpward, { className: classes.iconOrder, color: "action" })
                                                : react_1["default"].createElement(icons_2.ArrowDownward, { className: classes.iconOrder, color: "action" }))),
                                        !!column.helpText && (react_1["default"].createElement(Tooltip_1["default"], { title: react_1["default"].createElement("div", { style: { fontSize: 12, whiteSpace: 'break-spaces' } }, column.helpText), arrow: true, placement: "top" },
                                            react_1["default"].createElement(InfoRounded_1["default"], { color: "action", className: classes.iconHelpText })))),
                                    !column.NoFilter &&
                                        react_1["default"].createElement(DefaultColumnFilter, { header: column.id, listSelectFilter: column.listSelectFilter || [], type: column.type, filters: pagination.filters, setFilters: function (filters, page) {
                                                setFilters(filters, page);
                                                setTFilters(function (prev) { return (__assign(__assign({}, prev), { filters: filters,
                                                    page: page })); });
                                            } }))))); }))); })),
                    react_1["default"].createElement(TableBody_1["default"], __assign({}, getTableBodyProps(), { style: { backgroundColor: 'white' } }), loading ?
                        react_1["default"].createElement(LoadingSkeleton, { columns: headerGroups[0].headers.length }) :
                        page.map(function (row) {
                            prepareRow(row);
                            return (react_1["default"].createElement(TableRow_1["default"], __assign({}, row.getRowProps(), { hover: true, style: { cursor: onClickRow ? 'pointer' : 'default' } }), row.cells.map(function (cell, i) {
                                var _a;
                                return react_1["default"].createElement(TableCell_1["default"], __assign({}, cell.getCellProps({
                                    style: {
                                        minWidth: cell.column.minWidth,
                                        width: cell.column.width,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        textAlign: cell.column.type === "number" ? "right" : (((_a = cell.column.type) === null || _a === void 0 ? void 0 : _a.includes('centered')) ? "center" : "left")
                                    }
                                }), { onClick: function () { return cell.column.id !== "selection" ? onClickRow && onClickRow(row.original) : null; } }), cell.render('Cell'));
                            })));
                        })))),
            react_1["default"].createElement(Box_1["default"], { className: classes.footerTable },
                react_1["default"].createElement(Box_1["default"], null,
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return setPageIndex(0); }, disabled: !canPreviousPage },
                        react_1["default"].createElement(icons_2.FirstPage, null)),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return setPageIndex(pagination.pageIndex - 1); }, disabled: !canPreviousPage },
                        react_1["default"].createElement(icons_2.NavigateBefore, null)),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return setPageIndex(pagination.pageIndex + 1); }, disabled: !canNextPage },
                        react_1["default"].createElement(icons_2.NavigateNext, null)),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return setPageIndex(pageCount - 1); }, disabled: !canNextPage },
                        react_1["default"].createElement(icons_2.LastPage, null)),
                    react_1["default"].createElement(Box_1["default"], { component: "span", fontSize: 14 },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.tablePageOf, values: { currentPage: pageOptions.length === 0 ? 0 : pageIndex + 1, totalPages: pageOptions.length }, components: [react_1["default"].createElement(Box_1["default"], { fontWeight: "700", component: "span" }), react_1["default"].createElement(Box_1["default"], { fontWeight: "700", component: "span" })] }))),
                react_1["default"].createElement(Box_1["default"], null,
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: (totalrow || 0) === 100000 ? keys_1.langKeys.tableShowingRecordOfMore : keys_1.langKeys.tableShowingRecordOf, values: { itemCount: page.length, totalItems: totalrow } })),
                react_1["default"].createElement(Box_1["default"], null,
                    react_1["default"].createElement(Select_1["default"], { disableUnderline: true, style: { display: 'inline-flex' }, value: pageSize, onChange: function (e) {
                            setPageSize(Number(e.target.value));
                        } }, [5, 10, 20, 50, 100].map(function (pageSize) { return (react_1["default"].createElement(MenuItem_1["default"], { key: pageSize, value: pageSize }, pageSize)); })),
                    react_1["default"].createElement(Box_1["default"], { fontSize: 14, display: "inline", style: { marginRight: '1rem' } },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.recordPerPage, count: pageSize })))))));
});
TableZyx.displayName = 'TableZyx';
exports["default"] = TableZyx;
TableZyx.displayName = "TableZyx";
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
function useQueryParams(query, options) {
    if (options === void 0) { options = { ignore: [] }; }
    return react_1.useMemo(function () {
        var map = {
            endDate: Number(query.get('endDate')),
            startDate: Number(query.get('startDate')),
            page: Number(query.get('page')),
            filters: {}
        };
        var ignore = options.ignore;
        query.forEach(function (value, key) {
            if (key === "endDate" ||
                key === "startDate" ||
                key === "page" ||
                key.includes('-operator') ||
                (ignore || []).includes(key)) {
                return;
            }
            var name = key + "-operator";
            map.filters[key] = { value: value, operator: query.get(name) };
        });
        return map;
    }, [options, query]);
}
exports.useQueryParams = useQueryParams;
function buildQueryFilters(filters, init) {
    var params = new URLSearchParams(init);
    for (var key in filters) {
        var value = filters[key];
        if (key === 'filters' || value === undefined || value === null)
            continue;
        params.set(key, String(value));
    }
    var colFilters = filters.filters;
    for (var key in colFilters) {
        if (typeof colFilters[key] === 'object' && 'value' in colFilters[key] && 'operator' in colFilters[key]) {
            params.set(key, String(colFilters[key].value));
            params.set(key + "-operator", String(colFilters[key].operator));
        }
    }
    return params;
}
exports.buildQueryFilters = buildQueryFilters;
