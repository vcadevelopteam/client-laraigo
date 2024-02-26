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
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_redux_1 = require("react-redux");
var hooks_1 = require("hooks");
var actions_1 = require("store/main/actions");
var requestBodies_1 = require("common/helpers/requestBodies");
var components_1 = require("components");
var styles_1 = require("@material-ui/core/styles");
var FormControlLabel_1 = require("@material-ui/core/FormControlLabel/FormControlLabel");
var core_1 = require("@material-ui/core");
var icons_1 = require("icons");
var Category_1 = require("@material-ui/icons/Category");
var table_simple_1 = require("components/fields/table-simple");
var helpers_1 = require("common/helpers");
var keys_1 = require("lang/keys");
var react_hook_form_1 = require("react-hook-form");
var Graphic_1 = require("components/fields/Graphic");
var Assessment_1 = require("@material-ui/icons/Assessment");
var List_1 = require("@material-ui/icons/List");
var icons_2 = require("@material-ui/icons");
var useStyles = styles_1.makeStyles(function (theme) {
    var _a, _b;
    return ({
        containerFilter: {
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            backgroundColor: "white",
            justifyContent: "space-between"
        },
        filterComponent: {
            minWidth: "220px",
            maxWidth: "260px"
        },
        containerHeader: (_a = {
                display: "flex",
                flexWrap: "wrap",
                gap: 16
            },
            _a[theme.breakpoints.up("sm")] = {
                display: "flex"
            },
            _a),
        containerDetails: {
            paddingBottom: theme.spacing(2)
        },
        button: {
            padding: 12,
            fontWeight: 500,
            fontSize: "14px",
            textTransform: "initial"
        },
        BackGrRed: {
            backgroundColor: "#fb5f5f"
        },
        BackGrGreen: {
            backgroundColor: "#55bd84"
        },
        iconHelpText: {
            width: 15,
            height: 15,
            cursor: "pointer"
        },
        containerHeaderItem: (_b = {
                backgroundColor: "#FFF",
                padding: 8,
                display: "block",
                flexWrap: "wrap",
                gap: 8
            },
            _b[theme.breakpoints.up("sm")] = {
                display: "flex"
            },
            _b)
    });
});
var columnsTemp = [
    "usr",
    "fullname",
    "hourfirstlogin",
    "totaltickets",
    "closedtickets",
    "asignedtickets",
    "suspendedtickets",
    "avgfirstreplytime",
    "maxfirstreplytime",
    "minfirstreplytime",
    "maxtotalduration",
    "mintotalduration",
    "avgtotalasesorduration",
    "maxtotalasesorduration",
    "mintotalasesorduration",
    "userconnectedduration",
    "userstatus",
    "groups",
];
var AssesorProductivityReport = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var allFilters = _a.allFilters;
    var t = react_i18next_1.useTranslation().t;
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var multiData = hooks_1.useSelector(function (state) { return state.main.multiData; });
    var user = hooks_1.useSelector(function (state) { return state.login.validateToken.user; });
    var groups = ((_b = user === null || user === void 0 ? void 0 : user.groups) === null || _b === void 0 ? void 0 : _b.split(",").filter(function (x) { return !!x; })) || [];
    var mainAux = hooks_1.useSelector(function (state) { return state.main.mainAux; });
    var _l = react_1.useState([]), groupsdata = _l[0], setgroupsdata = _l[1];
    var _m = react_1.useState({}), allParameters = _m[0], setAllParameters = _m[1];
    var _o = react_1.useState({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: "selection"
    }), dateRange = _o[0], setdateRange = _o[1];
    var _p = react_1.useState(false), openDateRangeModal = _p[0], setOpenDateRangeModal = _p[1];
    var _q = react_1.useState({ checkedA: false, checkedB: false }), state = _q[0], setState = _q[1];
    var _r = react_1.useState(false), checkedA = _r[0], setcheckedA = _r[1];
    var _s = react_1.useState(false), isday = _s[0], setisday = _s[1];
    var _t = react_1.useState(""), columnGraphic = _t[0], setColumnGraphic = _t[1];
    var _u = react_1["default"].useState(null), anchorElSeButtons = _u[0], setAnchorElSeButtons = _u[1];
    var _v = react_1.useState(false), openSeButtons = _v[0], setOpenSeButtons = _v[1];
    var _w = react_1.useState(false), openFilterModal = _w[0], setOpenFilterModal = _w[1];
    var _x = react_1.useState({
        maxticketsclosed: 0,
        maxticketsclosedasesor: "",
        minticketsclosed: 0,
        minticketsclosedasesor: "",
        maxtimeconnected: "0",
        maxtimeconnectedasesor: "",
        mintimeconnected: "0",
        mintimeconnectedasesor: ""
    }), maxmin = _x[0], setmaxmin = _x[1];
    var _y = react_1.useState([]), desconectedmotives = _y[0], setDesconectedmotives = _y[1];
    var _z = react_1.useState(false), openModal = _z[0], setOpenModal = _z[1];
    var _0 = react_1.useState("GRID"), view = _0[0], setView = _0[1];
    var _1 = react_1.useState([]), dataGrid = _1[0], setdataGrid = _1[1];
    var _2 = react_1.useState({
        loading: false,
        data: []
    }), detailCustomReport = _2[0], setDetailCustomReport = _2[1];
    react_1.useEffect(function () {
        dispatch(actions_1.setViewChange("report_userproductivity"));
        dispatch(actions_1.getMultiCollection([
            requestBodies_1.getReportColumnSel("UFN_REPORT_USERPRODUCTIVITY_SEL"),
            requestBodies_1.getReportFilterSel("UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC", "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC", ""),
            requestBodies_1.getReportFilterSel("UFN_DOMAIN_LST_VALORES", "UFN_DOMAIN_LST_VALORES_GRUPOS", "GRUPOS"),
            requestBodies_1.getReportFilterSel("UFN_DOMAIN_LST_VALORES", "UFN_DOMAIN_LST_VALORES_ESTADOORGUSER", "ESTADOORGUSER"),
        ]));
        return function () {
            dispatch(actions_1.cleanViewChange());
        };
    }, []);
    var columns = react_1["default"].useMemo(function () { return __spreadArrays([
        {
            Header: t(keys_1.langKeys.report_userproductivity_user),
            accessor: "usr",
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_fullname),
            accessor: "fullname",
            showColumn: true,
            fixed: true
        }
    ], (isday
        ? [
            {
                Header: t(keys_1.langKeys.report_userproductivity_hourfirstlogin),
                accessor: "hourfirstlogin",
                showColumn: true
            },
        ]
        : []), [
        {
            Header: t(keys_1.langKeys.report_userproductivity_totaltickets),
            accessor: "totaltickets",
            type: "number",
            sortType: "number",
            helpText: t(keys_1.langKeys.report_userproductivity_totaltickets_help),
            showColumn: true,
            fixed: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_closedtickets),
            accessor: "closedtickets",
            type: "number",
            sortType: "number",
            helpText: t(keys_1.langKeys.report_userproductivity_closedtickets_help),
            showColumn: true,
            fixed: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_asignedtickets),
            accessor: "asignedtickets",
            type: "number",
            sortType: "number",
            helpText: t(keys_1.langKeys.report_userproductivity_asignedtickets_help),
            showColumn: true,
            fixed: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_suspendedtickets),
            accessor: "suspendedtickets",
            type: "number",
            sortType: "number",
            helpText: t(keys_1.langKeys.report_userproductivity_suspendedtickets_help),
            showColumn: true,
            fixed: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_avgfirstreplytime),
            accessor: "avgfirstreplytime",
            helpText: t(keys_1.langKeys.report_userproductivity_avgfirstreplytime_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_maxfirstreplytime),
            accessor: "maxfirstreplytime",
            helpText: t(keys_1.langKeys.report_userproductivity_maxfirstreplytime_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_minfirstreplytime),
            accessor: "minfirstreplytime",
            helpText: t(keys_1.langKeys.report_userproductivity_minfirstreplytime_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_avgtotalduration),
            accessor: "avgtotalduration",
            NoFilter: false,
            helpText: t(keys_1.langKeys.report_userproductivity_avgtotalduration_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_maxtotalduration),
            accessor: "maxtotalduration",
            helpText: t(keys_1.langKeys.report_userproductivity_maxtotalduration_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_mintotalduration),
            accessor: "mintotalduration",
            helpText: t(keys_1.langKeys.report_userproductivity_mintotalduration_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_avgtotalasesorduration),
            accessor: "avgtotalasesorduration",
            helpText: t(keys_1.langKeys.report_userproductivity_avgtotalasesorduration_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_maxtotalasesorduration),
            accessor: "maxtotalasesorduration",
            helpText: t(keys_1.langKeys.report_userproductivity_maxtotalasesorduration_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_mintotalasesorduration),
            accessor: "mintotalasesorduration",
            helpText: t(keys_1.langKeys.report_userproductivity_mintotalasesorduration_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_tmravg),
            accessor: "tmravg",
            helpText: t(keys_1.langKeys.report_userproductivity_tmravg_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_tmradviseravg),
            accessor: "tmradviseravg",
            helpText: t(keys_1.langKeys.report_userproductivity_tmradviseravg_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_userconnectedduration),
            accessor: "userconnectedduration",
            type: "number",
            sortType: "number",
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_userstatus),
            accessor: "userstatus",
            showColumn: true,
            fixed: true
        },
        {
            Header: t(keys_1.langKeys.report_userproductivity_groups),
            accessor: "groups",
            showColumn: true
        }
    ], (mainAux.data.length > 0
        ? __spreadArrays(desconectedmotives.map(function (d) { return ({
            Header: d,
            accessor: d,
            showColumn: true
        }); })) : [])); }, [isday, mainAux, desconectedmotives]);
    react_1.useEffect(function () {
        var _a;
        if (allFilters) {
            if (!multiData.loading && !multiData.error && multiData.data.length) {
                var groupitem_1 = allFilters.find(function (e) { return e.values[0].label === "group"; });
                if (groupitem_1) {
                    var arraygroups = multiData === null || multiData === void 0 ? void 0 : multiData.data[(_a = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _a === void 0 ? void 0 : _a.findIndex(function (x) {
                        return x.key ===
                            ((groupitem_1 === null || groupitem_1 === void 0 ? void 0 : groupitem_1.values[0].isListDomains) ? (groupitem_1 === null || groupitem_1 === void 0 ? void 0 : groupitem_1.values[0].filter) + "_" + (groupitem_1 === null || groupitem_1 === void 0 ? void 0 : groupitem_1.values[0].domainname)
                                : groupitem_1 === null || groupitem_1 === void 0 ? void 0 : groupitem_1.values[0].filter);
                    })];
                    setgroupsdata(groups.length > 0
                        ? arraygroups.data.filter(function (x) { return groups.includes(x.domainvalue); })
                        : arraygroups.data);
                }
            }
        }
    }, [multiData, allFilters]);
    react_1.useEffect(function () {
        if (!mainAux.error && !mainAux.loading && mainAux.key === "UFN_REPORT_USERPRODUCTIVITY_SEL") {
            setDetailCustomReport(mainAux);
            setdataGrid(mainAux.data.map(function (x) { return (__assign(__assign({}, x), JSON.parse(x.desconectedtimejson))); }));
            var maxminaux_1 = {
                maxticketsclosed: 0,
                maxticketsclosedasesor: "",
                minticketsclosed: 0,
                minticketsclosedasesor: "",
                maxtimeconnected: "0",
                maxtimeconnectedasesor: "",
                mintimeconnected: "0",
                mintimeconnectedasesor: ""
            };
            if (mainAux.data.length > 0) {
                var desconedtedmotives = Array.from(new Set(mainAux.data.reduce(function (ac, x) {
                    return x.desconectedtimejson ? __spreadArrays(ac, Object.keys(JSON.parse(x.desconectedtimejson))) : ac;
                }, [])));
                setDesconectedmotives(__spreadArrays(desconedtedmotives));
                mainAux.data
                    .filter(function (x) { return x.usertype !== "HOLDING"; })
                    .forEach(function (x, i) {
                    if (i === 0) {
                        maxminaux_1 = {
                            maxticketsclosed: x.closedtickets,
                            maxticketsclosedasesor: x.fullname,
                            minticketsclosed: x.closedtickets,
                            minticketsclosedasesor: x.fullname,
                            maxtimeconnected: x.userconnectedduration,
                            maxtimeconnectedasesor: x.fullname,
                            mintimeconnected: x.userconnectedduration,
                            mintimeconnectedasesor: x.fullname
                        };
                    }
                    else {
                        if (maxminaux_1.maxticketsclosed < x.closedtickets) {
                            maxminaux_1.maxticketsclosed = x.closedtickets;
                            maxminaux_1.maxticketsclosedasesor = x.fullname;
                        }
                        if (maxminaux_1.minticketsclosed > x.closedtickets) {
                            maxminaux_1.minticketsclosed = x.closedtickets;
                            maxminaux_1.minticketsclosedasesor = x.fullname;
                        }
                        if (parseInt(maxminaux_1.maxtimeconnected) < parseInt(x.userconnectedduration)) {
                            maxminaux_1.maxtimeconnected = x.userconnectedduration;
                            maxminaux_1.maxtimeconnectedasesor = x.fullname;
                        }
                        if (parseInt(maxminaux_1.mintimeconnected) > parseInt(x.userconnectedduration)) {
                            maxminaux_1.mintimeconnected = x.userconnectedduration;
                            maxminaux_1.mintimeconnectedasesor = x.fullname;
                        }
                    }
                });
            }
            setmaxmin(maxminaux_1);
        }
    }, [mainAux]);
    react_1.useEffect(function () {
        setAllParameters(__assign(__assign({}, allParameters), { startdate: dateRange.startDate
                ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10)
                : null, enddate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null }));
    }, [dateRange]);
    var fetchData = function () {
        var stardate = dateRange.startDate
            ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10)
            : null;
        var enddate = dateRange.endDate
            ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10)
            : null;
        setisday(stardate === enddate);
        dispatch(actions_1.resetMainAux());
        dispatch(actions_1.getCollectionAux(requestBodies_1.getUserProductivitySel(__assign({}, allParameters))));
        if (view !== "GRID") {
            dispatch(actions_1.getMainGraphic(requestBodies_1.getUserProductivityGraphic(__assign(__assign({}, allParameters), { 
                // startdate: daterange?.startDate!,
                // enddate: daterange?.endDate!,
                column: columnGraphic, summarization: "COUNT" }))));
        }
    };
    var setValue = function (parameterName, value) {
        var _a;
        setAllParameters(__assign(__assign({}, allParameters), (_a = {}, _a[parameterName] = value, _a)));
    };
    var handleChange = function (event) {
        var _a;
        setState(__assign(__assign({}, state), (_a = {}, _a[event.target.name] = event.target.checked, _a)));
        setValue("bot", event.target.checked);
        setcheckedA(event.target.checked);
    };
    var format = function (date) { return date.toISOString().split("T")[0]; };
    var handlerSearchGraphic = function (daterange, column) {
        dispatch(actions_1.getMainGraphic(requestBodies_1.getUserProductivityGraphic(__assign(__assign({}, allParameters), { startdate: daterange === null || daterange === void 0 ? void 0 : daterange.startDate, enddate: daterange === null || daterange === void 0 ? void 0 : daterange.endDate, column: column, summarization: "COUNT" }))));
    };
    react_1.useEffect(function () {
        var handleClickOutside = function (event) {
            var target = event.target;
            if (anchorElSeButtons && !anchorElSeButtons.contains(target)) {
                setAnchorElSeButtons(null);
                setOpenSeButtons(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return function () {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [anchorElSeButtons, setOpenSeButtons]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        view === "GRID" ? (react_1["default"].createElement(table_simple_1["default"], { columns: columns, filterGeneral: false, data: dataGrid, download: false, showHideColumns: true, loading: detailCustomReport.loading, register: false, ButtonsElement: react_1["default"].createElement("div", { className: classes.containerFilter },
                react_1["default"].createElement("div", { style: { display: "flex", gap: 8 } },
                    react_1["default"].createElement("div", { style: { display: "flex" } },
                        react_1["default"].createElement(core_1.Box, { width: 1 },
                            react_1["default"].createElement(core_1.Box, { className: classes.containerHeader, justifyContent: "space-between", alignItems: "center" },
                                react_1["default"].createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
                                    react_1["default"].createElement(components_1.DateRangePicker, { open: openDateRangeModal, setOpen: setOpenDateRangeModal, range: dateRange, onSelect: setdateRange },
                                        react_1["default"].createElement(core_1.Button, { disabled: detailCustomReport.loading, style: {
                                                border: "1px solid #bfbfc0",
                                                borderRadius: 4,
                                                color: "rgb(143, 146, 161)"
                                            }, startIcon: react_1["default"].createElement(icons_1.CalendarIcon, null), onClick: function () { return setOpenDateRangeModal(!openDateRangeModal); } }, format(dateRange.startDate) +
                                            " - " +
                                            format(dateRange.endDate))))))),
                    react_1["default"].createElement("div", { style: { display: "flex" } },
                        react_1["default"].createElement(core_1.Box, { width: 1 },
                            react_1["default"].createElement(core_1.Box, { className: classes.containerHeader, justifyContent: "space-between", alignItems: "center" },
                                react_1["default"].createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
                                    react_1["default"].createElement(components_1.FieldSelect, { label: t("report_userproductivity_filter_channels"), className: classes.filterComponent, key: "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC", valueDefault: (allParameters === null || allParameters === void 0 ? void 0 : allParameters.channel) || "", onChange: function (value) {
                                            return setValue("channel", (value === null || value === void 0 ? void 0 : value.type) || "");
                                        }, variant: "outlined", data: ((_d = (_c = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _c === void 0 ? void 0 : _c.find(function (x) { return x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"; })) === null || _d === void 0 ? void 0 : _d.data) || [], loading: multiData.loading, optionDesc: "type", optionValue: "typedesc" }))))),
                    react_1["default"].createElement("div", { style: { display: "flex" } },
                        react_1["default"].createElement(core_1.Box, { width: 1 },
                            react_1["default"].createElement(core_1.Box, { className: classes.containerHeader, justifyContent: "space-between", alignItems: "center" },
                                react_1["default"].createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
                                    react_1["default"].createElement(core_1.Button, { disabled: detailCustomReport.loading, variant: "contained", color: "primary", style: { backgroundColor: "#55BD84", width: 120 }, onClick: function () {
                                            setDetailCustomReport({
                                                loading: true,
                                                data: []
                                            });
                                            fetchData();
                                        } }, t(keys_1.langKeys.search))))))),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement(core_1.Box, { width: 1, style: { display: "flex", justifyContent: "flex-end", gap: 8 } }, view === "GRID" && (react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(core_1.Button, { className: classes.button, variant: "contained", color: "primary", disabled: detailCustomReport.loading || !(detailCustomReport.data.length > 0), onClick: function () { return setOpenModal(true); }, startIcon: react_1["default"].createElement(Assessment_1["default"], null) }, t(keys_1.langKeys.graphic_view)),
                        react_1["default"].createElement(core_1.Button, { className: classes.button, variant: "contained", color: "primary", disabled: detailCustomReport.loading, onClick: function () {
                                return helpers_1.exportExcel("report" + new Date().toISOString(), dataGrid, columns.filter(function (x) { return !x.isComponent && !x.activeOnHover; }));
                            }, startIcon: react_1["default"].createElement(icons_1.DownloadIcon, null) }, t(keys_1.langKeys.download))))))), ExtraMenuOptions: react_1["default"].createElement(core_1.MenuItem, { style: { padding: "0.7rem 1rem", fontSize: "0.96rem" }, onClick: function () { return setOpenFilterModal(true); } },
                react_1["default"].createElement(core_1.ListItemIcon, null,
                    react_1["default"].createElement(Category_1["default"], { fontSize: "small", style: { fill: "grey", height: "25px" } })),
                react_1["default"].createElement(core_1.Typography, { variant: "inherit" }, t(keys_1.langKeys.filters) + " - " + t(keys_1.langKeys.report_userproductivity))) })) : (react_1["default"].createElement("div", null,
            react_1["default"].createElement(core_1.Box, { style: { display: "flex", justifyContent: "flex-end", gap: 8 }, className: classes.containerHeaderItem },
                react_1["default"].createElement(core_1.Button, { className: classes.button, variant: "contained", color: "primary", disabled: detailCustomReport.loading || !(detailCustomReport.data.length > 0), onClick: function () { return setOpenModal(true); }, startIcon: react_1["default"].createElement(icons_2.Settings, null) }, t(keys_1.langKeys.configuration)),
                react_1["default"].createElement(core_1.Button, { className: classes.button, variant: "contained", color: "primary", onClick: function () { return setView("GRID"); }, startIcon: react_1["default"].createElement(List_1["default"], null) }, t(keys_1.langKeys.grid_view))),
            react_1["default"].createElement(Graphic_1["default"], { graphicType: ((_e = view.split("-")) === null || _e === void 0 ? void 0 : _e[1]) || "BAR", column: ((_f = view.split("-")) === null || _f === void 0 ? void 0 : _f[2]) || "summary", openModal: openModal, setOpenModal: setOpenModal, daterange: {
                    startDate: (_g = dateRange.startDate) === null || _g === void 0 ? void 0 : _g.toISOString().substring(0, 10),
                    endDate: (_h = dateRange.endDate) === null || _h === void 0 ? void 0 : _h.toISOString().substring(0, 10)
                }, withFilters: false, setView: setView, withButtons: false, row: { origin: "userproductivity" }, handlerSearchGraphic: handlerSearchGraphic }))),
        react_1["default"].createElement(SummaryGraphic, { openModal: openModal, setOpenModal: setOpenModal, setColumnGraphic: setColumnGraphic, setView: setView, daterange: dateRange, filters: allParameters, columns: __spreadArrays(columnsTemp.map(function (c) { return ({
                key: c,
                value: "report_userproductivity_" + c
            }); }), desconectedmotives.map(function (d) { return ({
                key: "desconectedtimejson::json->>'" + d + "'",
                value: d
            }); })) }),
        react_1["default"].createElement(components_1.DialogZyx, { open: openFilterModal, title: t(keys_1.langKeys.filters), buttonText1: t(keys_1.langKeys.close), buttonText2: t(keys_1.langKeys.apply), handleClickButton1: function () { return setOpenFilterModal(false); }, handleClickButton2: function () {
                setOpenFilterModal(false);
                fetchData();
            }, maxWidth: "sm", buttonStyle1: { marginBottom: "0.3rem" }, buttonStyle2: { marginRight: "1rem", marginBottom: "0.3rem" } },
            react_1["default"].createElement("div", { className: "row-zyx", style: { marginBottom: 0, paddingBottom: 0 } },
                react_1["default"].createElement(components_1.FieldMultiSelect, { limitTags: 1, label: t("report_userproductivity_filter_group"), className: classes.filterComponent + " col-6", valueDefault: (allParameters === null || allParameters === void 0 ? void 0 : allParameters.usergroup) || "", key: "UFN_DOMAIN_LST_VALORES_GRUPOS", onChange: function (value) {
                        return setValue("usergroup", value ? value.map(function (o) { return o["domainvalue"]; }).join() : "");
                    }, variant: "outlined", data: groupsdata, optionDesc: "domaindesc", optionValue: "domainvalue" }),
                react_1["default"].createElement(components_1.FieldMultiSelect, { limitTags: 1, label: t("report_userproductivity_filter_status"), className: classes.filterComponent + " col-6", key: "UFN_DOMAIN_LST_VALORES_ESTADOORGUSER", valueDefault: (allParameters === null || allParameters === void 0 ? void 0 : allParameters.userstatus) || "", onChange: function (value) {
                        return setValue("userstatus", value ? value.map(function (o) { return o["domainvalue"]; }).join() : "");
                    }, variant: "outlined", data: ((_k = (_j = multiData === null || multiData === void 0 ? void 0 : multiData.data) === null || _j === void 0 ? void 0 : _j.find(function (x) { return x.key === "UFN_DOMAIN_LST_VALORES_ESTADOORGUSER"; })) === null || _k === void 0 ? void 0 : _k.data) || [], loading: multiData.loading, optionDesc: "domaindesc", optionValue: "domainvalue" }),
                react_1["default"].createElement("div", { style: { alignItems: "center" }, className: "col-6" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement(core_1.Box, { fontWeight: 500, lineHeight: "18px", fontSize: 16, color: "textPrimary", padding: "10px 0 8px 2px" }, t(keys_1.langKeys.report_userproductivity_filter_includebot)),
                        react_1["default"].createElement(FormControlLabel_1["default"], { style: { paddingLeft: 10, paddingBottom: 0 }, control: react_1["default"].createElement(components_1.IOSSwitch, { checked: checkedA, onChange: handleChange }), label: checkedA ? t(keys_1.langKeys.yes) : "No" })))))));
};
var SummaryGraphic = function (_a) {
    var _b, _c;
    var openModal = _a.openModal, setOpenModal = _a.setOpenModal, setView = _a.setView, filters = _a.filters, columns = _a.columns, setColumnGraphic = _a.setColumnGraphic;
    var t = react_i18next_1.useTranslation().t;
    var dispatch = react_redux_1.useDispatch();
    var _d = react_hook_form_1.useForm({
        defaultValues: {
            graphictype: "BAR",
            column: ""
        }
    }), register = _d.register, handleSubmit = _d.handleSubmit, setValue = _d.setValue, getValues = _d.getValues, errors = _d.formState.errors;
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
        var _a;
        setView("CHART-" + data.graphictype + "-" + ((_a = data.column) === null || _a === void 0 ? void 0 : _a.split("::")[0]));
        setOpenModal(false);
        setColumnGraphic(data.column);
        dispatch(actions_1.getMainGraphic(requestBodies_1.getUserProductivityGraphic(__assign(__assign({}, filters), { column: data.column, summarization: "COUNT" }))));
    };
    var excludeUserProductivity = [
        "hourfirstlogin",
        "avgfirstreplytime",
        "maxfirstreplytime",
        "minfirstreplytime",
        "avgtotalasesorduration",
        "groups",
    ];
    var filteredColumns = columns.filter(function (column) { return !excludeUserProductivity.includes(column.key); });
    return (react_1["default"].createElement(components_1.DialogZyx, { open: openModal, title: t(keys_1.langKeys.graphic_configuration), button1Type: "button", buttonText1: t(keys_1.langKeys.cancel), handleClickButton1: handleCancelModal, button2Type: "button", buttonText2: t(keys_1.langKeys.accept), handleClickButton2: handleAcceptModal },
        react_1["default"].createElement("div", { className: "row-zyx" },
            react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.graphic_type), className: "col-12", valueDefault: getValues("graphictype"), error: (_b = errors === null || errors === void 0 ? void 0 : errors.graphictype) === null || _b === void 0 ? void 0 : _b.message, onChange: function (value) { return setValue("graphictype", value === null || value === void 0 ? void 0 : value.key); }, data: [
                    { key: "BAR", value: "BAR" },
                    { key: "PIE", value: "PIE" },
                    { key: "LINE", value: "LINEA" },
                ], uset: true, prefixTranslation: "graphic_", optionDesc: "value", optionValue: "key" })),
        react_1["default"].createElement("div", { className: "row-zyx" },
            react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.graphic_view_by), className: "col-12", valueDefault: getValues("column"), error: (_c = errors === null || errors === void 0 ? void 0 : errors.column) === null || _c === void 0 ? void 0 : _c.message, onChange: function (value) { return setValue("column", value === null || value === void 0 ? void 0 : value.key); }, data: filteredColumns, optionDesc: "value", optionValue: "key", uset: true, prefixTranslation: "" }))));
};
exports["default"] = AssesorProductivityReport;
