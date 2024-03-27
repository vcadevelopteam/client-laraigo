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
var table_paginated_1 = require("components/fields/table-paginated");
var styles_1 = require("@material-ui/core/styles");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var hooks_1 = require("hooks");
var helpers_1 = require("common/helpers");
var actions_1 = require("store/main/actions");
var actions_2 = require("store/popus/actions");
var react_redux_1 = require("react-redux");
var core_1 = require("@material-ui/core");
var components_1 = require("components");
var Traffic_1 = require("@material-ui/icons/Traffic");
var core_2 = require("@material-ui/core");
var table_simple_1 = require("components/fields/table-simple");
var getArrayBread = function (nametmp, nameView1) { return [
    { id: "view-1", name: nameView1 || "Reports" },
    { id: "view-2", name: nametmp },
]; };
var useStyles = styles_1.makeStyles(function (theme) { return ({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%"
    },
    title: {
        fontSize: "22px",
        fontWeight: "bold",
        color: theme.palette.text.primary
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "initial"
    },
    textFieldCursor: {
        cursor: 'pointer',
        '&:hover': {
            cursor: 'pointer'
        }
    }
}); });
var InputRetryReport = function (_a) {
    var setViewSelected = _a.setViewSelected, setSearchValue = _a.setSearchValue;
    var t = react_i18next_1.useTranslation().t;
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var mainPaginated = hooks_1.useSelector(function (state) { return state.main.mainPaginated; });
    var mainAux = hooks_1.useSelector(function (state) { return state.main.mainAux; });
    var resExportData = hooks_1.useSelector(function (state) { return state.main.exportData; });
    var _b = react_1.useState(0), pageCount = _b[0], setPageCount = _b[1];
    var _c = react_1.useState(false), waitSave = _c[0], setWaitSave = _c[1];
    var _d = react_1.useState(0), totalrow = _d[0], settotalrow = _d[1];
    var _e = react_1.useState({
        pageSize: 0,
        pageIndex: 0,
        filters: {},
        sorts: {},
        distinct: {},
        daterange: null
    }), fetchDataAux = _e[0], setfetchDataAux = _e[1];
    var allParameters = react_1.useState({})[0];
    var view = react_1.useState("GRID")[0];
    var _f = react_1.useState({}), setSelectedRow = _f[1];
    var _g = react_1.useState(false), openRowDialog = _g[0], setOpenRowDialog = _g[1];
    var _h = react_1.useState(false), openConfiDialog = _h[0], setOpenConfigDialog = _h[1];
    var _j = react_1.useState(''), selectedQuestion = _j[0], setSelectedQuestion = _j[1];
    var _k = react_1.useState(2), maxX = _k[0], setMaxX = _k[1];
    var _l = react_1.useState(3), maxY = _l[0], setMaxY = _l[1];
    var _m = react_1.useState(false), isButtonDisabled = _m[0], setIsButtonDisabled = _m[1];
    var cell = function (props) {
        var column = props.cell.column; // eslint-disable-next-line react/prop-types
        var row = props.cell.row.original;
        return (react_1["default"].createElement("div", { onClick: function () {
                setSelectedRow(row);
            } }, column.sortType === "datetime" && !!row[column.id]
            ? helpers_1.convertLocalDate(row[column.id]).toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            }) // eslint-disable-next-line react/prop-types
            : row[column.id]));
    };
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.flow),
            accessor: 'flow',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_inputretry_question),
            accessor: 'question',
            helpText: t(keys_1.langKeys.report_inputretry_question_help),
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_inputretry_maxX_additional, { maxX: maxX }),
            accessor: 'maxxattempts',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_inputretry_maxY_additional, { mayY: maxY }),
            accessor: 'maxyattempts',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_inputretry_moreX_additional, { mayY: maxY }),
            accessor: 'moreyattempts',
            showGroupedBy: true,
            Cell: cell
        },
    ]; }, [maxX, maxY]);
    var dialogColumns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.ticket),
            accessor: 'ticketnum',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.channel),
            accessor: 'channel',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.person),
            accessor: 'name',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_inputretry_datehour),
            accessor: 'createdate',
            Cell: function (props) {
                var createdate = (props.cell.row.original || {}).createdate;
                return new Date(createdate).toLocaleString();
            }
        },
        {
            Header: t(keys_1.langKeys.report_inputretry_answer),
            accessor: 'interactiontext',
            helpText: t(keys_1.langKeys.report_inputretry_answer_help),
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_inputretry_validAnswer),
            accessor: 'validinput',
            Cell: function (_a) {
                var value = _a.value;
                return value ? t(keys_1.langKeys.yes) : t(keys_1.langKeys.no);
            }
        },
    ]; }, []);
    react_1.useEffect(function () {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);
    react_1.useEffect(function () {
        var _a, _b;
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
                (_a = resExportData.url) === null || _a === void 0 ? void 0 : _a.split(",").forEach(function (x) { return window.open(x, "_blank"); });
            }
            else if (resExportData.error) {
                var errormessage = t((_b = resExportData.code) !== null && _b !== void 0 ? _b : "error_unexpected_error", {
                    module: t(keys_1.langKeys.property).toLocaleLowerCase()
                });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave]);
    var triggerExportData = function (_a) {
        var filters = _a.filters, sorts = _a.sorts, daterange = _a.daterange;
        var columnsExport = columns.map(function (x) { return ({
            key: x.accessor,
            alias: x.Header
        }); });
        dispatch(actions_1.exportData(helpers_1.getReportExport("UFN_REPORT_INPUTRETRY_EXPORT", "inputretry", __assign({ filters: filters,
            sorts: sorts, startdate: daterange.startDate, enddate: daterange.endDate }, allParameters)), "", "excel", false, columnsExport));
        dispatch(actions_2.showBackdrop(true));
        setWaitSave(true);
    };
    var _o = react_1.useState(''), startdate = _o[0], setStartDate = _o[1];
    var _p = react_1.useState(''), enddate = _p[0], setEndDate = _p[1];
    var fetchDataAuxRow = function (id) {
        dispatch(actions_1.getCollectionAux(helpers_1.getChatFlowCardId({
            startdate: startdate,
            enddate: enddate,
            chatflowcardid: id
        })));
    };
    var fetchData = function (_a) {
        var pageSize = _a.pageSize, pageIndex = _a.pageIndex, filters = _a.filters, sorts = _a.sorts, distinct = _a.distinct, daterange = _a.daterange;
        if (daterange && daterange.startDate && daterange.endDate) {
            setStartDate(daterange.startDate);
            setEndDate(daterange.endDate);
        }
        setfetchDataAux({ pageSize: pageSize, pageIndex: pageIndex, filters: filters, sorts: sorts, distinct: distinct, daterange: daterange });
        dispatch(actions_1.getCollectionPaginated(helpers_1.getPaginatedForReports("UFN_REPORT_INPUTRETRY_SEL", "UFN_REPORT_INPUTRETRY_TOTALRECORDS", "inputretry", __assign({ startdate: daterange.startDate, enddate: daterange.endDate, take: pageSize, skip: pageIndex * pageSize, sorts: sorts, filters: {}, maxx: maxX, maxy: maxY }, allParameters))));
    };
    var handleSelected = function () {
        dispatch(actions_1.resetCollectionPaginated());
        dispatch(actions_1.resetMultiMain());
        setSearchValue("");
        setViewSelected("view-1");
    };
    var _q = react_1.useState(false), waitExport = _q[0], setWaitExport = _q[1];
    react_1.useEffect(function () {
        var _a;
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(actions_2.showBackdrop(false));
                setWaitExport(false);
                (_a = resExportData.url) === null || _a === void 0 ? void 0 : _a.split(",").forEach(function (x) { return window.open(x, "_blank"); });
            }
            else if (resExportData.error) {
                var errormessage = t(resExportData.code || "error_unexpected_error", {
                    module: t(keys_1.langKeys.blacklist).toLocaleLowerCase()
                });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);
    react_1.useEffect(function () {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
            dispatch(actions_2.showBackdrop(false));
        }
    }, [mainPaginated]);
    var handleOpenRowDialog = function (question) {
        setSelectedQuestion(question.question);
        setOpenRowDialog(true);
        fetchDataAuxRow(question.chatflowcardid);
    };
    var handleCloseRowDialog = function () {
        setOpenRowDialog(false);
    };
    var handleOpenConfigDialog = function () {
        setOpenConfigDialog(true);
    };
    var handleCloseConfigDialog = function () {
        setOpenConfigDialog(false);
    };
    var handleMaxXChange = function (event) {
        var value = event.target.value.trim();
        if (value === '' || (Number.isInteger(parseInt(value)) && parseInt(value) >= 1)) {
            setMaxX(parseInt(value));
            setIsButtonDisabled(false); // Asegúrate de habilitar el botón si el valor es válido
        }
        else {
            setIsButtonDisabled(true);
        }
    };
    var handleMaxYChange = function (event) {
        var value = event.target.value.trim();
        if (value === '' || (Number.isInteger(parseInt(value)) && parseInt(value) >= 1)) {
            setMaxY(parseInt(value));
            setIsButtonDisabled(false); // Asegúrate de habilitar el botón si el valor es válido
        }
        else {
            setIsButtonDisabled(true);
        }
    };
    var handleFocus = function (event) {
        event.target.blur();
    };
    var handleApplyButtonClick = function () {
        // Guardar en localStorage
        localStorage.setItem('maxX', String(maxX));
        localStorage.setItem('maxY', String(maxY));
        // Llamar a fetchData
        fetchData(fetchDataAux);
        setOpenConfigDialog(false);
    };
    react_1.useEffect(function () {
        var savedMaxX = localStorage.getItem('maxX');
        var savedMaxY = localStorage.getItem('maxY');
        if (savedMaxX) {
            setMaxX(parseInt(savedMaxX));
        }
        if (savedMaxY) {
            setMaxY(parseInt(savedMaxY));
        }
    }, []);
    return (react_1["default"].createElement("div", { style: { width: "100%", display: "flex", flex: 1, flexDirection: "column" } },
        react_1["default"].createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
            react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t("report_" + "inputretry"), t(keys_1.langKeys.report_plural)), handleClick: handleSelected })),
        react_1["default"].createElement(react_1["default"].Fragment, null,
            view === "GRID" && (react_1["default"].createElement(table_paginated_1["default"], { columns: columns, data: mainPaginated.data, totalrow: totalrow, onClickRow: handleOpenRowDialog, loading: mainPaginated.loading, pageCount: pageCount, filterrange: true, FiltersElement: react_1["default"].createElement(react_1["default"].Fragment, null), ExtraMenuOptions: react_1["default"].createElement(core_1.MenuItem, { style: { padding: "0.7rem 1rem", fontSize: "0.96rem" }, onClick: handleOpenConfigDialog },
                    react_1["default"].createElement(core_1.ListItemIcon, null,
                        react_1["default"].createElement(Traffic_1["default"], { fontSize: "small", style: { fill: "grey", height: "25px" } })),
                    react_1["default"].createElement(core_1.Typography, { variant: "inherit" }, t(keys_1.langKeys.configuration))), ButtonsElement: react_1["default"].createElement(react_1["default"].Fragment, null), download: true, fetchData: fetchData, exportPersonalized: triggerExportData })),
            react_1["default"].createElement(core_2.Dialog, { open: openRowDialog, onClose: handleCloseRowDialog, maxWidth: "xl" },
                react_1["default"].createElement(core_2.DialogTitle, null,
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.report_inputretry_question }),
                    ": ",
                    selectedQuestion),
                react_1["default"].createElement(core_2.DialogContent, null,
                    react_1["default"].createElement(table_simple_1["default"], { columns: dialogColumns, filterGeneral: false, download: true, data: mainAux.data, totalrow: totalrow, loading: mainAux.loading })),
                react_1["default"].createElement(core_2.DialogActions, null,
                    react_1["default"].createElement(core_2.Button, { onClick: handleCloseRowDialog, color: "primary" },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys["return"] })))),
            react_1["default"].createElement(core_2.Dialog, { open: openConfiDialog, onClose: handleCloseConfigDialog, fullWidth: true, maxWidth: "sm", style: { cursor: 'default' }, disableBackdropClick: true },
                react_1["default"].createElement(core_2.DialogTitle, null,
                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.trafficlightconfig })),
                react_1["default"].createElement(core_2.DialogContent, null,
                    react_1["default"].createElement(core_1.Grid, { container: true, spacing: 2 },
                        react_1["default"].createElement(core_1.Grid, { item: true, xs: 6 },
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement(core_1.Typography, { variant: "subtitle1" },
                                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.report_inputretry_maxX })),
                                react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                                    react_1["default"].createElement(core_1.Typography, { variant: "body1" }, "X = "),
                                    react_1["default"].createElement(core_2.TextField, { type: "number", value: maxX, onChange: handleMaxXChange, onFocus: handleFocus, inputProps: { inputMode: 'numeric', pattern: '[0-9]*' }, style: { cursor: 'default' } })))),
                        react_1["default"].createElement(core_1.Grid, { item: true, xs: 6 },
                            react_1["default"].createElement(core_1.Divider, { orientation: "vertical", flexItem: true }),
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement(core_1.Typography, { variant: "subtitle1" },
                                    react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.report_inputretry_maxMoreY })),
                                react_1["default"].createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                                    react_1["default"].createElement(core_1.Typography, { variant: "body1" }, "Y = "),
                                    react_1["default"].createElement(core_2.TextField, { type: "number", value: maxY, onChange: handleMaxYChange, onFocus: handleFocus, inputProps: { inputMode: 'numeric', pattern: '[0-9]*' }, style: { cursor: 'default' } })))))),
                react_1["default"].createElement(core_2.DialogActions, null,
                    react_1["default"].createElement(core_2.Button, { onClick: handleApplyButtonClick, color: "primary" },
                        react_1["default"].createElement(react_i18next_1.Trans, { i18nKey: keys_1.langKeys.refresh })))))));
};
exports["default"] = InputRetryReport;
