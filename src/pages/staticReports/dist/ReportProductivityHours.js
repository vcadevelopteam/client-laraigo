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
var Typography_1 = require("@material-ui/core/Typography");
var table_paginated_1 = require("components/fields/table-paginated");
var Graphic_1 = require("components/fields/Graphic");
var styles_1 = require("@material-ui/core/styles");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var Category_1 = require("@material-ui/icons/Category");
var components_1 = require("components");
var hooks_1 = require("hooks");
var helpers_1 = require("common/helpers");
var actions_1 = require("store/main/actions");
var actions_2 = require("store/popus/actions");
var react_redux_1 = require("react-redux");
var Button_1 = require("@material-ui/core/Button");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var react_hook_form_1 = require("react-hook-form");
var Assessment_1 = require("@material-ui/icons/Assessment");
var core_1 = require("@material-ui/core");
var getArrayBread = function (nametmp, nameView1) { return [
    { id: "view-1", name: nameView1 || "Reports" },
    { id: "view-2", name: nametmp },
]; };
var useStyles = styles_1.makeStyles(function (theme) {
    var _a, _b;
    return ({
        container: {
            display: "flex",
            flexDirection: "column",
            width: "100%"
        },
        containerDetails: {
            marginTop: theme.spacing(3)
        },
        media: {
            objectFit: "contain"
        },
        containerSearch: (_a = {
                width: "100%",
                display: "flex",
                gap: theme.spacing(1),
                alignItems: "center"
            },
            _a[theme.breakpoints.up("sm")] = {
                width: "50%"
            },
            _a),
        containerFilter: {
            width: "100%",
            marginBottom: theme.spacing(2),
            display: "flex",
            gap: 16,
            flexWrap: "wrap"
        },
        filterComponent: {
            minWidth: "220px",
            maxWidth: "260px"
        },
        containerFilterGeneral: {
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#FFF",
            padding: theme.spacing(1)
        },
        title: {
            fontSize: "22px",
            fontWeight: "bold",
            color: theme.palette.text.primary
        },
        containerHeader: (_b = {
                display: "block",
                marginBottom: 0
            },
            _b[theme.breakpoints.up("sm")] = {
                display: "flex"
            },
            _b),
        mb2: {
            marginBottom: theme.spacing(4)
        },
        button: {
            padding: 12,
            fontWeight: 500,
            fontSize: "14px",
            textTransform: "initial"
        },
        itemDate: {
            minHeight: 40,
            height: 40,
            border: "1px solid #bfbfc0",
            borderRadius: 4,
            color: "rgb(143, 146, 161)"
        }
    });
});
var ProductivityHoursReport = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var setViewSelected = _a.setViewSelected, setSearchValue = _a.setSearchValue, row = _a.row;
    var t = react_i18next_1.useTranslation().t;
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var multiData = hooks_1.useSelector(function (state) { return state.main.multiData; });
    var mainPaginated = hooks_1.useSelector(function (state) { return state.main.mainPaginated; });
    var resExportData = hooks_1.useSelector(function (state) { return state.main.exportData; });
    var _m = react_1.useState(0), pageCount = _m[0], setPageCount = _m[1];
    var _o = react_1.useState(false), waitSave = _o[0], setWaitSave = _o[1];
    var _p = react_1.useState({}), selectedRow = _p[0], setSelectedRow = _p[1];
    var _q = react_1.useState(0), totalrow = _q[0], settotalrow = _q[1];
    var _r = react_1.useState(false), isTypificationFilterModalOpen = _r[0], setTypificationFilterModalOpen = _r[1];
    var _s = react_1.useState({
        pageSize: 0,
        pageIndex: 0,
        filters: {},
        sorts: {},
        daterange: null
    }), fetchDataAux = _s[0], setfetchDataAux = _s[1];
    var _t = react_1.useState({}), allParameters = _t[0], setAllParameters = _t[1];
    var _u = react_1.useState(false), openModal = _u[0], setOpenModal = _u[1];
    var _v = react_1.useState("GRID"), view = _v[0], setView = _v[1];
    react_1.useEffect(function () {
        dispatch(actions_1.getMultiCollection([helpers_1.getReportFilterSel("UFN_REPORT_HOURS_SEL", "UFN_REPORT_HOURS_SEL", ""), helpers_1.getUserAsesorByOrgID(), helpers_1.getCommChannelLstTypeDesc()]));
        dispatch(actions_1.setViewChange("report_" + "userproductivityhours"));
        return function () {
            dispatch(actions_1.cleanViewChange());
        };
    }, []);
    var reportColumns = [
        {
            "proargnames": "datehour",
            "proargmodes": "t",
            "proargtype": "date"
        },
        {
            "proargnames": "agent",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "hoursrange",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "worktime",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "busytimewithinwork",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "freetimewithinwork",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "busytimeoutsidework",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "onlinetime",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "availabletime",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "idletime",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "idletimewithoutattention",
            "proargmodes": "t",
            "proargtype": "text"
        },
        {
            "proargnames": "qtytickets",
            "proargmodes": "t",
            "proargtype": "bigint"
        },
        {
            "proargnames": "qtyconnection",
            "proargmodes": "t",
            "proargtype": "bigint"
        },
        {
            "proargnames": "qtydisconnection",
            "proargmodes": "t",
            "proargtype": "bigint"
        }
    ];
    var cell = function (props) {
        var column = props.cell.column; // eslint-disable-next-line react/prop-types
        var row = props.cell.row.original;
        return (react_1["default"].createElement("div", { onClick: function () {
                setSelectedRow(row);
                setOpenModal(true);
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
            Header: t(keys_1.langKeys.report_userproductivityhours_datehour),
            accessor: 'datehour',
            groupedBy: false,
            type: 'date',
            sortType: 'datetime',
            Cell: function (props) {
                var datehour = props.cell.row.original.datehour;
                return new Date(datehour).toLocaleDateString();
            }
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_agent),
            accessor: 'agent',
            groupedBy: false,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_hoursrange),
            accessor: 'hoursrange',
            groupedBy: false,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_worktime),
            helpText: t(keys_1.langKeys.report_userproductivityhours_worktime_help),
            accessor: 'worktime',
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_busytimewithinwork),
            accessor: 'busytimewithinwork',
            helpText: t(keys_1.langKeys.report_userproductivityhours_busytimewithinwork_help),
            groupedBy: false,
            showColumn: true,
            showHide: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_freetimewithinwork),
            accessor: 'freetimewithinwork',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_onlinetime),
            accessor: 'onlinetime',
            groupedBy: false,
            helpText: t(keys_1.langKeys.report_userproductivityhours_onlinetime_help),
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_availabletime),
            accessor: 'availabletime',
            helpText: t(keys_1.langKeys.report_userproductivityhours_availabletime_help),
            groupedBy: false,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_idletime),
            accessor: 'idletime',
            groupedBy: false,
            helpText: t(keys_1.langKeys.report_userproductivityhours_idletime_help),
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_idletimewithoutattention),
            accessor: 'idletimewithoutattention',
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_qtytickets),
            accessor: 'qtytickets',
            helpText: t(keys_1.langKeys.report_userproductivityhours_qtytickets_help),
            groupedBy: false,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_qtyconnection),
            accessor: 'qtyconnection',
            helpText: t(keys_1.langKeys.report_userproductivityhours_qtyconnection_help),
            showColumn: true,
            Cell: cell
        },
        {
            Header: t(keys_1.langKeys.report_userproductivityhours_qtydisconnection),
            helpText: t(keys_1.langKeys.report_userproductivityhours_qtydisconnection_help),
            accessor: 'qtydisconnection',
            showColumn: true,
            groupedBy: false,
            Cell: cell
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
        dispatch(actions_1.exportData(helpers_1.getReportExport("UFN_REPORT_USERPRODUCTIVITYHOURS_EXPORT", "userproductivityhours", __assign({ filters: filters,
            sorts: sorts, startdate: daterange.startDate, enddate: daterange.endDate }, allParameters)), "", "excel", false, columnsExport));
        dispatch(actions_2.showBackdrop(true));
        setWaitSave(true);
    };
    var fetchData = function (_a) {
        var pageSize = _a.pageSize, pageIndex = _a.pageIndex, filters = _a.filters, sorts = _a.sorts, daterange = _a.daterange;
        setfetchDataAux({ pageSize: pageSize, pageIndex: pageIndex, filters: filters, sorts: sorts, daterange: daterange });
        dispatch(actions_1.getCollectionPaginated(helpers_1.getPaginatedForReports("UFN_REPORT_USERPRODUCTIVITYHOURS_SEL", "UFN_REPORT_USERPRODUCTIVITYHOURS_TOTALRECORDS", "userproductivityhours", __assign({ startdate: daterange.startDate, enddate: daterange.endDate, take: pageSize, skip: pageIndex * pageSize, sorts: sorts, filters: __assign({}, filters) }, allParameters))));
    };
    var handlerSearchGraphic = function (daterange, column) {
        setfetchDataAux(function (prev) { return (__assign(__assign({}, prev), { daterange: daterange })); });
        dispatch(actions_1.getMainGraphic(helpers_1.getReportGraphic("UFN_REPORT_USERPRODUCTIVITYHOURS_GRAPHIC", "userproductivityhours", __assign({ filters: {}, sorts: {}, startdate: daterange === null || daterange === void 0 ? void 0 : daterange.startDate, enddate: daterange === null || daterange === void 0 ? void 0 : daterange.endDate, column: column, summarization: "COUNT" }, allParameters))));
    };
    var handleSelected = function () {
        dispatch(actions_1.resetCollectionPaginated());
        dispatch(actions_1.resetMultiMain());
        setSearchValue("");
        setViewSelected("view-1");
    };
    var setValue = function (parameterName, value) {
        var _a;
        setAllParameters(__assign(__assign({}, allParameters), (_a = {}, _a[parameterName] = value, _a)));
    };
    var _w = react_1.useState(false), waitExport = _w[0], setWaitExport = _w[1];
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
    var handleOpeTypificationFilterModal = function () {
        setTypificationFilterModalOpen(true);
    };
    return (react_1["default"].createElement("div", { style: { width: "100%", display: "flex", flex: 1, flexDirection: "column" } },
        react_1["default"].createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
            react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t("report_" + "userproductivityhours"), t(keys_1.langKeys.report_plural)), handleClick: handleSelected })),
        react_1["default"].createElement(react_1["default"].Fragment, null, view === "GRID" ? (react_1["default"].createElement(table_paginated_1["default"], { columns: columns, data: mainPaginated.data, totalrow: totalrow, loading: mainPaginated.loading, pageCount: pageCount, filterrange: true, showHideColumns: true, ExtraMenuOptions: react_1["default"].createElement(MenuItem_1["default"], { style: { padding: "0.7rem 1rem", fontSize: "0.96rem" }, onClick: handleOpeTypificationFilterModal },
                react_1["default"].createElement(core_1.ListItemIcon, null,
                    react_1["default"].createElement(Category_1["default"], { fontSize: "small", style: { fill: "grey", height: "25px" } })),
                react_1["default"].createElement(Typography_1["default"], { variant: "inherit" }, t(keys_1.langKeys.filters) + " - " + t(keys_1.langKeys.report_userproductivityhours))), FiltersElement: react_1["default"].createElement(components_1.FieldSelect, { valueDefault: allParameters["channel"], label: t("report_userproductivityhours_filter_channels"), className: classes.filterComponent, key: "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC", variant: "outlined", loading: multiData.loading, onChange: function (value) { return setValue("channel", value ? value["typedesc"] : ""); }, data: (_c = multiData === null || multiData === void 0 ? void 0 : multiData.data[(_b = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _b === void 0 ? void 0 : _b.findIndex(function (x) { return x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"; })]) === null || _c === void 0 ? void 0 : _c.data, optionDesc: "type", optionValue: "typedesc" }), ButtonsElement: react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: mainPaginated.loading || mainPaginated.data.length <= 0, onClick: function () { return setOpenModal(true); }, startIcon: react_1["default"].createElement(Assessment_1["default"], null) }, t(keys_1.langKeys.graphic_view))), download: true, fetchData: fetchData, exportPersonalized: triggerExportData })) : (react_1["default"].createElement("div", { className: classes.container },
            react_1["default"].createElement(Graphic_1["default"], { graphicType: ((_d = view.split("-")) === null || _d === void 0 ? void 0 : _d[1]) || "BAR", column: ((_e = view.split("-")) === null || _e === void 0 ? void 0 : _e[2]) || "summary", openModal: openModal, setOpenModal: setOpenModal, daterange: fetchDataAux.daterange, setView: setView, row: row, handlerSearchGraphic: handlerSearchGraphic, FiltersElement: react_1["default"].createElement(components_1.FieldSelect, { valueDefault: allParameters["channel"], label: t("report_userproductivityhours_filter_channels"), className: classes.filterComponent, key: "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC", variant: "outlined", onChange: function (value) { return setValue("channel", value ? value["typedesc"] : ""); }, data: (_g = (_f = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _f === void 0 ? void 0 : _f[multiData === null || multiData === void 0 ? void 0 : multiData.data.findIndex(function (x) { return x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"; })]) === null || _g === void 0 ? void 0 : _g.data, optionDesc: "type", optionValue: "typedesc" }) })))),
        react_1["default"].createElement(SummaryGraphic, { openModal: openModal, setOpenModal: setOpenModal, setView: setView, row: row, daterange: fetchDataAux.daterange, filters: fetchDataAux.filters, columns: reportColumns.map(function (x) { return x.proargnames; }), columnsprefix: "report_" + "userproductivityhours" + "_", allParameters: allParameters }),
        react_1["default"].createElement(components_1.DialogZyx, { open: isTypificationFilterModalOpen, title: t(keys_1.langKeys.filters), buttonText1: t(keys_1.langKeys.close), buttonText2: t(keys_1.langKeys.apply), handleClickButton1: function () { return setTypificationFilterModalOpen(false); }, handleClickButton2: function () {
                setTypificationFilterModalOpen(false);
                fetchData(fetchDataAux);
            }, maxWidth: "sm", buttonStyle1: { marginBottom: "0.3rem" }, buttonStyle2: { marginRight: "1rem", marginBottom: "0.3rem" } },
            react_1["default"].createElement("div", { className: "row-zyx" },
                react_1["default"].createElement(components_1.FieldMultiSelect, { limitTags: 1, label: t(keys_1.langKeys.hours), className: classes.filterComponent + " col-6", valueDefault: (allParameters === null || allParameters === void 0 ? void 0 : allParameters.hours) || "", key: "UFN_REPORT_HOURS_SEL", onChange: function (value) {
                        return setValue("hours", value ? value.map(function (o) { return o["hours"]; }).join() : "");
                    }, variant: "outlined", data: ((_j = (_h = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _h === void 0 ? void 0 : _h.find(function (x) { return x.key === "UFN_REPORT_HOURS_SEL"; })) === null || _j === void 0 ? void 0 : _j.data) || [], optionDesc: "hourdescription", optionValue: "hours" }),
                react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.agent), className: classes.filterComponent + " col-6", valueDefault: (allParameters === null || allParameters === void 0 ? void 0 : allParameters.asesorid) || "", key: "UFN_USER_ASESORBYORGID_LST", onChange: function (value) { return setValue("asesorid", (value === null || value === void 0 ? void 0 : value.userid) || 0); }, variant: "outlined", data: ((_l = (_k = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _k === void 0 ? void 0 : _k.find(function (x) { return x.key === "UFN_USER_ASESORBYORGID_LST"; })) === null || _l === void 0 ? void 0 : _l.data) || [], optionDesc: "userdesc", optionValue: "userid" })))));
};
var SummaryGraphic = function (_a) {
    var _b, _c, _d, _e;
    var openModal = _a.openModal, setOpenModal = _a.setOpenModal, setView = _a.setView, row = _a.row, daterange = _a.daterange, filters = _a.filters, columns = _a.columns, columnsprefix = _a.columnsprefix, _f = _a.allParameters, allParameters = _f === void 0 ? {} : _f;
    var t = react_i18next_1.useTranslation().t;
    var dispatch = react_redux_1.useDispatch();
    var _g = react_hook_form_1.useForm({
        defaultValues: {
            graphictype: "BAR",
            column: ""
        }
    }), register = _g.register, handleSubmit = _g.handleSubmit, setValue = _g.setValue, getValues = _g.getValues, errors = _g.formState.errors;
    react_1.useEffect(function () {
        register("graphictype", { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        register("column", { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
    }, [register]);
    var handleCancelModal = function () {
        setOpenModal(false);
    };
    var handleAcceptModal = handleSubmit(function (data) {
        triggerGraphic(data);
    });
    var triggerGraphic = function (data) {
        setView("CHART-" + data.graphictype + "-" + data.column);
        setOpenModal(false);
        dispatch(actions_1.getMainGraphic(helpers_1.getReportGraphic("UFN_REPORT_USERPRODUCTIVITYHOURS_GRAPHIC" || "", "userproductivityhours" || "", __assign({ filters: filters, sorts: {}, startdate: daterange === null || daterange === void 0 ? void 0 : daterange.startDate, enddate: daterange === null || daterange === void 0 ? void 0 : daterange.endDate, column: data.column, summarization: "COUNT" }, allParameters))));
    };
    var excludeProductivityHours = [
        "busytimewithinwork",
        "freetimewithinwork",
        "busytimeoutsidework",
        "availabletime",
        "idletime",
        "idletimewithoutattention",
        "qtydisconnection",
    ];
    var filteredColumns = columns.filter(function (column) { return !excludeProductivityHours.includes(column); });
    return (react_1["default"].createElement(components_1.DialogZyx, { open: openModal, title: t(keys_1.langKeys.graphic_configuration), button1Type: "button", buttonText1: t(keys_1.langKeys.cancel), handleClickButton1: handleCancelModal, button2Type: "button", buttonText2: t(keys_1.langKeys.accept), handleClickButton2: handleAcceptModal },
        react_1["default"].createElement("div", { className: "row-zyx" },
            react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.graphic_type), className: "col-12", valueDefault: getValues("graphictype"), error: (_c = (_b = errors === null || errors === void 0 ? void 0 : errors.graphictype) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : "", onChange: function (value) { return setValue("graphictype", value === null || value === void 0 ? void 0 : value.key); }, data: [
                    { key: "BAR", value: "BAR" },
                    { key: "PIE", value: "PIE" },
                    { key: "LINE", value: "LINEA" },
                ], uset: true, prefixTranslation: "graphic_", optionDesc: "value", optionValue: "key" })),
        react_1["default"].createElement("div", { className: "row-zyx" },
            react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.graphic_view_by), className: "col-12", valueDefault: getValues("column"), error: (_e = (_d = errors === null || errors === void 0 ? void 0 : errors.column) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : "", onChange: function (value) { return setValue("column", value === null || value === void 0 ? void 0 : value.key); }, data: filteredColumns.map(function (x) { return ({ key: x, value: x }); }), optionDesc: "value", optionValue: "key", uset: true, prefixTranslation: columnsprefix }))));
};
exports["default"] = ProductivityHoursReport;
