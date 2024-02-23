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
exports.__esModule = true;
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
var icons_1 = require("@material-ui/icons");
var Select_1 = require("@material-ui/core/Select");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var ArrowDownward_1 = require("@material-ui/icons/ArrowDownward");
var ArrowUpward_1 = require("@material-ui/icons/ArrowUpward");
var Box_1 = require("@material-ui/core/Box");
var Input_1 = require("@material-ui/core/Input");
var Tooltip_1 = require("@material-ui/core/Tooltip");
var Zoom_1 = require("@material-ui/core/Zoom");
var styles_1 = require("@material-ui/core/styles");
var Fab_1 = require("@material-ui/core/Fab");
var IconButton_1 = require("@material-ui/core/IconButton");
var components_1 = require("components");
var icons_2 = require("icons");
var react_table_1 = require("react-table");
var react_window_1 = require("react-window");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var lab_1 = require("@material-ui/lab");
var core_1 = require("@material-ui/core");
var table_simple_1 = require("./table-simple");
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
            padding: theme.spacing(2)
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
            lineHeight: '48px',
            fontWeight: 'bold',
            height: '48px',
            color: theme.palette.text.primary
        },
        containerButtons: {
            gridGap: theme.spacing(1),
            display: 'grid',
            gridAutoFlow: 'column'
        },
        containerHeader: (_d = {
                display: 'block'
            },
            _d[theme.breakpoints.up('sm')] = {
                display: 'flex'
            },
            _d)
    });
});
var TableZyxEditable = react_1["default"].memo(function (_a) {
    var columns = _a.columns, titlemodule = _a.titlemodule, fetchData = _a.fetchData, data = _a.data, _b = _a.download, download = _b === void 0 ? true : _b, register = _a.register, handleRegister = _a.handleRegister, HeadComponent = _a.HeadComponent, ButtonsElement = _a.ButtonsElement, _c = _a.pageSizeDefault, pageSizeDefault = _c === void 0 ? 20 : _c, _d = _a.filterGeneral, filterGeneral = _d === void 0 ? true : _d, _e = _a.loading, loading = _e === void 0 ? false : _e, updateCell = _a.updateCell, updateColumn = _a.updateColumn, _f = _a.skipAutoReset, skipAutoReset = _f === void 0 ? false : _f;
    var classes = useStyles();
    var DefaultColumnFilter = function (_a) {
        var _b = _a.column, columnid = _b.id, setFilter = _b.setFilter, _c = _b.type, type = _c === void 0 ? "string" : _c, page = _a.page;
        var _d = react_1.useState(''), value = _d[0], setValue = _d[1];
        var _e = react_1.useState(null), anchorEl = _e[0], setAnchorEl = _e[1];
        var open = Boolean(anchorEl);
        var _f = react_1.useState('contains'), operator = _f[0], setoperator = _f[1];
        var handleCloseMenu = function () {
            setAnchorEl(null);
        };
        var handleClickItemMenu = function (operator) {
            setAnchorEl(null);
            setoperator(operator);
            if (type === 'boolean') {
                setValue(operator);
            }
            setFilter({ value: value, operator: operator, type: type });
        };
        var handleClickMenu = function (event) {
            setAnchorEl(event.currentTarget);
        };
        var keyPress = react_1["default"].useCallback(function (e) {
            if (e.keyCode === 13) {
                setFilter({ value: value, operator: operator, type: type });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value]);
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
            switch (type) {
                case "number":
                case "date":
                case "datetime-local":
                case "time":
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
        var _g = react_1.useState(false), allBoolean = _g[0], setAllBoolean = _g[1];
        var hasFalse = page.map(function (p) { return p.values[columnid]; }).includes(false);
        var effectBoolean = hasFalse && type === 'boolean';
        react_1.useEffect(function () {
            setAllBoolean(!effectBoolean);
        }, [effectBoolean]);
        var setColumnBoolean = function (value, columnid) {
            updateColumn && updateColumn(page.map(function (p) { return p.index; }), columnid, value);
        };
        return (react_1["default"].createElement("div", { style: { display: 'flex', flexDirection: 'row' } }, type === 'boolean' ?
            react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(components_1.OnlyCheckbox, { label: "", valueDefault: allBoolean, disabled: loading, onChange: function (value) {
                        setColumnBoolean(value, columnid);
                    } }),
                table_simple_1.BooleanOptionsMenuComponent(value, handleClickItemMenu))
            :
                react_1["default"].createElement(react_1["default"].Fragment, null,
                    type === 'date' && table_simple_1.DateOptionsMenuComponent(value, handleDate),
                    type === 'time' && table_simple_1.TimeOptionsMenuComponent(value, handleTime),
                    !['date', 'time'].includes(type) &&
                        react_1["default"].createElement(Input_1["default"]
                        // disabled={loading}
                        , { 
                            // disabled={loading}
                            type: type === 'color' ? 'text' : type, style: { fontSize: '15px', minWidth: '100px' }, fullWidth: true, value: value, onKeyDown: keyPress, onChange: function (e) {
                                setValue(e.target.value || '');
                            } }),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: handleClickMenu, size: "small" },
                        react_1["default"].createElement(icons_1.MoreVert, { style: { cursor: 'pointer' }, "aria-label": "more", "aria-controls": "long-menu", "aria-haspopup": "true", color: "action", fontSize: "small" })),
                    react_1["default"].createElement(Menu_1["default"], { id: "long-menu", anchorEl: anchorEl, keepMounted: true, open: open, onClose: handleCloseMenu, PaperProps: {
                            style: {
                                maxHeight: 48 * 4.5,
                                width: '20ch'
                            }
                        } }, table_simple_1.OptionsMenuComponent(type, operator, handleClickItemMenu)))));
    };
    // Create an editable cell renderer
    var EditableCell = function (_a) {
        var initialValue = _a.value, row = _a.row, column = _a.column, updateCell = _a.updateCell;
        // We need to keep and update the state of the cell normally
        // eslint-disable-next-line react-hooks/rules-of-hooks
        var _b = react_1["default"].useState(initialValue), value = _b[0], setValue = _b[1];
        var onChange = function (e) {
            setValue(e.target.value);
        };
        // We'll only update the external data when the input is blurred
        var onBlur = function () {
            updateCell(row.index, column.id, value);
        };
        var onChecked = function (value) {
            updateCell(row.index, column.id, value);
        };
        var onBlurColor = function () {
            var rex = new RegExp(/#[0-9A-Fa-f]{6}/, 'g');
            if (rex.test(value)) {
                setColorValue(value);
                updateCell(row.index, column.id, value);
            }
            else {
                setColorValue('#000000');
                updateCell(row.index, column.id, '#000000');
            }
        };
        var _c = react_1["default"].useState(initialValue), colorValue = _c[0], setColorValue = _c[1];
        // If the initialValue is changed external, sync it up with our state
        // eslint-disable-next-line react-hooks/rules-of-hooks
        react_1["default"].useEffect(function () {
            setValue(initialValue);
        }, [initialValue]);
        if (column.editable) {
            switch (column.type) {
                case 'color':
                    return (react_1["default"].createElement("div", { style: { display: 'flex' } },
                        react_1["default"].createElement(core_1.TextField, { style: { flex: 1 }, value: value, onChange: onChange, onBlur: onBlurColor, inputProps: { style: { fontSize: '14px' } } }),
                        react_1["default"].createElement("div", { style: { flexGrow: 0 }, onBlur: function () { onChecked(colorValue); } },
                            react_1["default"].createElement("input", { type: "color", value: colorValue, style: { border: 'none', background: 'transparent' }, onChange: function (e) { return setColorValue(e.target.value); } }))));
                case 'number':
                    return react_1["default"].createElement(core_1.TextField, { type: "number", style: { fontSize: '14px' }, value: value, onChange: onChange, onBlur: onBlur, inputProps: { style: { fontSize: '14px' }, min: 0, step: 1 } });
                case 'boolean':
                    return react_1["default"].createElement(components_1.OnlyCheckbox, { style: { width: '100%', textAlign: 'center' }, label: "", valueDefault: value, onChange: function (value) { return onChecked(value); } });
                default:
                    return react_1["default"].createElement(core_1.TextField, { fullWidth: true, value: value, onChange: onChange, onBlur: onBlur, inputProps: { style: { fontSize: '14px' } } });
            }
        }
        else {
            return ((value === null || value === void 0 ? void 0 : value.length) > 100 ?
                react_1["default"].createElement(Tooltip_1["default"], { TransitionComponent: Zoom_1["default"], title: value },
                    react_1["default"].createElement(Box_1["default"], { m: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: 200 }, value))
                :
                    react_1["default"].createElement(Box_1["default"], { m: 0, overflow: "hidden", textOverflow: "ellipsis", width: 1 }, value));
        }
    };
    var filterCellValue = react_1["default"].useCallback(function (rows, id, filterValue) {
        var value = filterValue.value, operator = filterValue.operator, type = filterValue.type;
        return rows.filter(function (row) {
            var cellvalue = row.values[id];
            if (cellvalue === null || cellvalue === undefined) {
                return false;
            }
            if (!(['isempty', 'isnotempty', 'isnull', 'isnotnull'].includes(operator) || type === 'boolean')
                && (value || '') === '')
                return true;
            switch (type) {
                case "number":
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
                            return cellvalue == null;
                        case 'isnotnull':
                            return cellvalue != null;
                        case 'notequals':
                            return cellvalue !== Number(value);
                        case 'equals':
                        default:
                            return cellvalue === Number(value);
                    }
                case "date":
                case "datetime-local":
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
                            return cellvalue == null;
                        case 'isnotnull':
                            return cellvalue != null;
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
                            return cellvalue == null;
                        case 'isnotnull':
                            return cellvalue != null;
                        case 'all':
                        default:
                            return true;
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
                            return cellvalue == null;
                        case 'isnotnull':
                            return cellvalue != null;
                        case 'notcontains':
                            return !cellvalue.toLowerCase().includes(value.toLowerCase());
                        case 'contains':
                        default:
                            return cellvalue.toLowerCase().includes(value.toLowerCase());
                    }
            }
        });
    }, []);
    var defaultColumn = react_1["default"].useMemo(function () { return ({
        // Let's set up our default Filter UI
        Filter: function (props) { return DefaultColumnFilter(__assign(__assign({}, props), { data: data })); },
        filter: filterCellValue,
        Cell: EditableCell
    }); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    var _g = react_table_1.useTable({
        columns: columns,
        data: data,
        initialState: { pageIndex: 0, pageSize: pageSizeDefault },
        defaultColumn: defaultColumn,
        autoResetFilters: !skipAutoReset,
        autoResetGlobalFilter: !skipAutoReset,
        autoResetSortBy: !skipAutoReset,
        autoResetPage: !skipAutoReset,
        autoResetRowState: !skipAutoReset,
        updateCell: updateCell,
        updateColumn: updateColumn
    }, react_table_1.useFlexLayout, react_table_1.useFilters, react_table_1.useGlobalFilter, react_table_1.useSortBy, react_table_1.usePagination), getTableProps = _g.getTableProps, getTableBodyProps = _g.getTableBodyProps, headerGroups = _g.headerGroups, prepareRow = _g.prepareRow, page = _g.page, // Instead of using 'rows', we'll use page,
    canPreviousPage = _g.canPreviousPage, canNextPage = _g.canNextPage, pageOptions = _g.pageOptions, pageCount = _g.pageCount, gotoPage = _g.gotoPage, nextPage = _g.nextPage, previousPage = _g.previousPage, setPageSize = _g.setPageSize, preGlobalFilteredRows = _g.preGlobalFilteredRows, setGlobalFilter = _g.setGlobalFilter, _h = _g.state, pageIndex = _h.pageIndex, pageSize = _h.pageSize;
    // const currentPage = React.useRef(pageIndex + 1);
    // const totalPages = React.useRef(pageOptions.length);
    react_1.useEffect(function () {
        var next = true;
        if (fetchData && next) {
            fetchData();
        }
    }, [fetchData]);
    var RenderRow = react_1["default"].useCallback(function (_a) {
        var index = _a.index, style = _a.style;
        var row = page[index];
        prepareRow(row);
        return (react_1["default"].createElement(TableRow_1["default"], __assign({ component: "div" }, row.getRowProps({ style: style }), { hover: true }), row.cells.map(function (cell, i) {
            var _a;
            return react_1["default"].createElement(TableCell_1["default"], __assign({ component: "div" }, cell.getCellProps({
                style: {
                    minWidth: cell.column.minWidth,
                    width: cell.column.width,
                    maxWidth: cell.column.maxWidth
                }
            })), headerGroups[0].headers[i].isComponent ?
                cell.render('Cell')
                :
                    (((_a = cell.value) === null || _a === void 0 ? void 0 : _a.length) > 20 ?
                        react_1["default"].createElement(Tooltip_1["default"], { TransitionComponent: Zoom_1["default"], title: cell.value },
                            react_1["default"].createElement("div", { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, cell.render('Cell')))
                        :
                            react_1["default"].createElement("div", { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, cell.render('Cell'))));
        })));
    }, [headerGroups, prepareRow, page]);
    return (react_1["default"].createElement(Box_1["default"], { width: 1, style: { height: '100%' } },
        react_1["default"].createElement(Box_1["default"], { className: classes.containerHeader, justifyContent: "space-between", alignItems: "center", mb: "30px" },
            titlemodule ? react_1["default"].createElement("span", { className: classes.title }, titlemodule) : react_1["default"].createElement("span", null),
            react_1["default"].createElement("span", { className: classes.containerButtons },
                fetchData && (react_1["default"].createElement(Tooltip_1["default"], { title: "Refrescar" },
                    react_1["default"].createElement(Fab_1["default"], { size: "small", "aria-label": "add", color: "primary", disabled: loading, style: { marginLeft: '1rem' }, onClick: function () { return fetchData && fetchData({}); } },
                        react_1["default"].createElement(icons_1.Refresh, null)))),
                typeof ButtonsElement === 'function' ? ((react_1["default"].createElement(ButtonsElement, null))) : (ButtonsElement),
                register && (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: loading, startIcon: react_1["default"].createElement(icons_1.Add, { color: "secondary" }), onClick: handleRegister, style: { backgroundColor: "#55BD84" } },
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.register }))),
                download && (react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: loading, onClick: function () { return helpers_1.exportExcel(String(titlemodule) + "Report", data, columns.filter(function (x) { return (!x.isComponent && !x.activeOnHover); })); }, startIcon: react_1["default"].createElement(icons_2.DownloadIcon, null) },
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.download }))))),
        filterGeneral && (react_1["default"].createElement(Box_1["default"], { className: classes.containerFilterGeneral },
            react_1["default"].createElement("span", null),
            react_1["default"].createElement("div", { className: classes.containerSearch },
                react_1["default"].createElement(components_1.SearchField, { disabled: loading, colorPlaceHolder: '#FFF', handleChangeOther: setGlobalFilter, lazy: true })))),
        HeadComponent && react_1["default"].createElement(HeadComponent, null),
        react_1["default"].createElement(TableContainer_1["default"], { component: "div", style: { position: "relative" } },
            react_1["default"].createElement(Box_1["default"], { overflow: "auto", style: { height: 'calc(100vh - 365px)', overflowY: 'hidden' } },
                react_1["default"].createElement(Table_1["default"], __assign({ component: "div", stickyHeader: true, size: "small" }, getTableProps(), { "aria-label": "enhanced table", "aria-labelledby": "tableTitle" }),
                    react_1["default"].createElement(TableHead_1["default"], { component: "div" }, headerGroups.map(function (headerGroup) { return (react_1["default"].createElement(TableRow_1["default"], __assign({ component: "div" }, headerGroup.getHeaderGroupProps()), headerGroup.headers.map(function (column, ii) { return (column.activeOnHover ?
                        react_1["default"].createElement("th", { style: { width: "0px" }, key: "header-floating" }) :
                        react_1["default"].createElement(TableCell_1["default"], { component: "div", key: ii, style: { flex: column.width + " 0 auto", minWidth: 0, width: column.width + "px", maxWidth: column.maxWidth + "px" } }, column.isComponent ?
                            column.render('Header') :
                            (react_1["default"].createElement(react_1["default"].Fragment, null,
                                react_1["default"].createElement(Box_1["default"], __assign({ component: "div" }, column.getHeaderProps(column.getSortByToggleProps({ title: 'ordenar' })), { style: {
                                        whiteSpace: 'nowrap',
                                        wordWrap: 'break-word',
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    } }),
                                    column.render('Header'),
                                    column.isSorted ? (column.isSortedDesc ?
                                        react_1["default"].createElement(ArrowDownward_1["default"], { className: classes.iconOrder, color: "action" })
                                        :
                                            react_1["default"].createElement(ArrowUpward_1["default"], { className: classes.iconOrder, color: "action" }))
                                        :
                                            null),
                                react_1["default"].createElement("div", null, !column.NoFilter && column.render('Filter')))))); }))); })),
                    react_1["default"].createElement(TableBody_1["default"], __assign({ component: "div" }, getTableBodyProps(), { style: { backgroundColor: 'white' } }), loading ?
                        react_1["default"].createElement(LoadingSkeleton, { columns: headerGroups[0].headers.length })
                        :
                            react_1["default"].createElement(react_window_1.FixedSizeList, { style: { overflowX: 'hidden' }, direction: "vertical", width: "auto", height: window.innerHeight - 470, itemCount: page.length, itemSize: 43 }, RenderRow)))),
            react_1["default"].createElement(Box_1["default"], { className: classes.footerTable },
                react_1["default"].createElement(Box_1["default"], null,
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return gotoPage(0); }, disabled: !canPreviousPage || loading },
                        react_1["default"].createElement(icons_1.FirstPage, null)),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return previousPage(); }, disabled: !canPreviousPage || loading },
                        react_1["default"].createElement(icons_1.NavigateBefore, null)),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return nextPage(); }, disabled: !canNextPage || loading },
                        react_1["default"].createElement(icons_1.NavigateNext, null)),
                    react_1["default"].createElement(IconButton_1["default"], { onClick: function () { return gotoPage(pageCount - 1); }, disabled: !canNextPage || loading },
                        react_1["default"].createElement(icons_1.LastPage, null)),
                    react_1["default"].createElement(Box_1["default"], { component: "span", fontSize: 14 },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.tablePageOf, values: { currentPage: pageIndex + 1, totalPages: pageOptions.length }, components: [react_1["default"].createElement(Box_1["default"], { fontWeight: "700", component: "span" }), react_1["default"].createElement(Box_1["default"], { fontWeight: "700", component: "span" })] }))),
                react_1["default"].createElement(Box_1["default"], null,
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: (preGlobalFilteredRows || []).length === 100000 ? keys_1.langKeys.tableShowingRecordOfMore : keys_1.langKeys.tableShowingRecordOf, values: { itemCount: page.length, totalItems: preGlobalFilteredRows.length } })),
                react_1["default"].createElement(Box_1["default"], null,
                    react_1["default"].createElement(Select_1["default"], { disableUnderline: true, style: { display: 'inline-flex' }, value: pageSize, disabled: loading, onChange: function (e) {
                            setPageSize(Number(e.target.value));
                        } }, [5, 10, 20, 50, 100].map(function (pageSize) { return (react_1["default"].createElement(MenuItem_1["default"], { key: pageSize, value: pageSize }, pageSize)); })),
                    react_1["default"].createElement(Box_1["default"], { fontSize: 14, display: "inline", style: { marginRight: '1rem' } },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.recordPerPage, count: pageSize })))))));
});
exports["default"] = TableZyxEditable;
var LoadingSkeleton = function (_a) {
    var columns = _a.columns;
    var items = [];
    for (var i = 0; i < columns; i++) {
        items.push(react_1["default"].createElement(TableCell_1["default"], { component: "div", key: "table-simple-skeleton-" + i },
            react_1["default"].createElement(lab_1.Skeleton, null)));
    }
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(TableRow_1["default"], { component: "div", key: "1aux1" }, items),
        react_1["default"].createElement(TableRow_1["default"], { component: "div", key: "2aux2" }, items),
        react_1["default"].createElement(TableRow_1["default"], { component: "div", key: "3aux3" }, items),
        react_1["default"].createElement(TableRow_1["default"], { component: "div", key: "4aux4" }, items),
        react_1["default"].createElement(TableRow_1["default"], { component: "div", key: "5aux5" }, items)));
};
