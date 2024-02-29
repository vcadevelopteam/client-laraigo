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
var hooks_1 = require("hooks");
var react_redux_1 = require("react-redux");
var helpers_1 = require("common/helpers");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var actions_1 = require("store/main/actions");
var actions_2 = require("store/popus/actions");
var table_paginated_1 = require("components/fields/table-paginated");
var templates_1 = require("components/fields/templates");
var core_1 = require("@material-ui/core");
var Category_1 = require("@material-ui/icons/Category");
var styles_1 = require("@material-ui/core/styles");
var useStyles = styles_1.makeStyles(function () { return ({
    filterComponent: {
        minWidth: "220px",
        maxWidth: "260px"
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
}); });
var ReportRequestSD = function () {
    var dispatch = react_redux_1.useDispatch();
    var t = react_i18next_1.useTranslation().t;
    var multiData = hooks_1.useSelector(function (state) { return state.main.multiDataAux; });
    var multiDataFilter = hooks_1.useSelector(function (state) { return state.main.multiData; });
    var mainPaginated = hooks_1.useSelector(function (state) { return state.main.mainPaginated; });
    var resExportData = hooks_1.useSelector(function (state) { return state.main.exportData; });
    var _a = react_1.useState(0), pageCount = _a[0], setPageCount = _a[1];
    var _b = react_1.useState(""), company = _b[0], setCompany = _b[1];
    var _c = react_1.useState(0), totalrow = _c[0], settotalrow = _c[1];
    var _d = react_1.useState(false), waitSave = _d[0], setWaitSave = _d[1];
    var _e = react_1.useState(false), waitExport = _e[0], setWaitExport = _e[1];
    var _f = react_1.useState({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null }), fetchDataAux = _f[0], setfetchDataAux = _f[1];
    var classes = useStyles();
    react_1.useEffect(function () {
        dispatch(actions_1.setViewChange("reportrequestsd"));
        return function () {
            dispatch(actions_1.cleanViewChange());
        };
    }, []);
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.sdrequestcode),
            accessor: 'sd_request',
            helpText: t(keys_1.langKeys.sdrequestcode_help)
        },
        {
            Header: t(keys_1.langKeys.ticket_number),
            accessor: 'ticketnum'
        },
        {
            Header: t(keys_1.langKeys.type),
            accessor: 'type',
            helpText: t(keys_1.langKeys.report_requestsd_type_help)
        },
        {
            Header: t(keys_1.langKeys.channel),
            accessor: 'channel',
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.applicant),
            accessor: 'display_name',
            helpText: t(keys_1.langKeys.report_requestsd_applicant_help)
        },
        {
            Header: t(keys_1.langKeys.business),
            accessor: 'company',
            helpText: t(keys_1.langKeys.report_requestsd_business_help)
        },
        {
            Header: t(keys_1.langKeys.resume),
            accessor: 'description',
            helpText: t(keys_1.langKeys.report_requestsd_resume_help)
        },
        {
            Header: t(keys_1.langKeys.priority),
            accessor: 'priority'
        },
        {
            Header: t(keys_1.langKeys.status),
            accessor: 'phase',
            helpText: t(keys_1.langKeys.report_requestsd_status_help)
        },
        {
            Header: t(keys_1.langKeys.resolution),
            accessor: 'resolution',
            helpText: t(keys_1.langKeys.report_requestsd_resolution_help),
            showColumn: true
        },
        {
            Header: t(keys_1.langKeys.reportdate),
            accessor: 'report_date',
            showColumn: true,
            Cell: function (props) {
                var report_date = props.cell.row.original.report_date;
                return new Date(report_date).toLocaleString();
            }
        },
        {
            Header: t(keys_1.langKeys.dateofresolution),
            accessor: 'resolution_date',
            showColumn: true,
            Cell: function (props) {
                var resolution_date = props.cell.row.original.resolution_date;
                return new Date(resolution_date).toLocaleString();
            }
        },
    ]; }, [t]);
    react_1.useEffect(function () {
        return function () {
            dispatch(actions_1.resetMultiMain());
        };
    }, []);
    react_1.useEffect(function () {
        if (!multiData.loading) {
            dispatch(actions_2.showBackdrop(false));
        }
    }, [multiData]);
    var fetchData = function (_a) {
        var pageSize = _a.pageSize, pageIndex = _a.pageIndex, filters = _a.filters, sorts = _a.sorts, daterange = _a.daterange;
        setfetchDataAux({ pageSize: pageSize, pageIndex: pageIndex, filters: filters, sorts: sorts, daterange: daterange });
        dispatch(actions_1.getCollectionPaginated(helpers_1.getreportrequestSD({
            startdate: daterange.startDate,
            enddate: daterange.endDate,
            take: pageSize,
            channeltype: selectedChannel,
            skip: pageIndex * pageSize,
            sorts: sorts,
            company: company,
            filters: __assign({}, filters)
        })));
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
    react_1.useEffect(function () {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);
    var triggerExportData = function (_a) {
        var filters = _a.filters, sorts = _a.sorts, daterange = _a.daterange;
        var columnsExport = columns.map(function (x) { return ({
            key: x.accessor,
            alias: x.Header
        }); });
        dispatch(actions_1.exportData(helpers_1.getRequestSDExport({
            startdate: daterange.startDate,
            enddate: daterange.endDate,
            sorts: sorts,
            filters: filters,
            company: company
        }), "", "excel", false, columnsExport));
        dispatch(actions_2.showBackdrop(true));
        setWaitExport(true);
    };
    react_1.useEffect(function () {
        var _a;
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
                (_a = resExportData.url) === null || _a === void 0 ? void 0 : _a.split(",").forEach(function (x) { return window.open(x, '_blank'); });
            }
            else if (resExportData.error) {
                var errormessage = t(resExportData.code || "error_unexpected_error", { module: t(keys_1.langKeys.property).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave]);
    var _g = react_1.useState(false), isFilterModalOpen = _g[0], setFilterModalOpen = _g[1];
    var handleOpenFilterModal = function () {
        setFilterModalOpen(true);
    };
    var _h = react_1.useState({}), allParameters = _h[0], setAllParameters = _h[1];
    var setValue = function (parameterName, value) {
        var _a;
        setAllParameters(__assign(__assign({}, allParameters), (_a = {}, _a[parameterName] = value, _a)));
    };
    var filterChannel = hooks_1.useSelector(function (state) { return state.main.mainAux; });
    var channelTypeList = filterChannel.data || [];
    var channelTypeFilteredList = new Set();
    var _j = react_1.useState(""), selectedChannel = _j[0], setSelectedChannel = _j[1];
    var uniqueTypdescList = channelTypeList.filter(function (item) {
        if (channelTypeFilteredList.has(item.type)) {
            return false;
        }
        channelTypeFilteredList.add(item.type);
        return true;
    });
    //const fetchFiltersChannels = () => dispatch(getCollectionAux(getCommChannelLst()))
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { style: { height: 10 } }),
        react_1["default"].createElement(table_paginated_1["default"], { columns: columns, data: mainPaginated.data, totalrow: totalrow, loading: mainPaginated.loading, pageCount: pageCount, filterrange: true, download: true, autotrigger: true, FiltersElement: react_1.useMemo(function () { return (react_1["default"].createElement("div", { style: { width: 200 } },
                react_1["default"].createElement(templates_1.FieldSelect, { label: t(keys_1.langKeys.channel), variant: "outlined", data: uniqueTypdescList || [], valueDefault: uniqueTypdescList, onChange: function (value) { return setSelectedChannel((value === null || value === void 0 ? void 0 : value.type) || ""); }, optionDesc: "typedesc", optionValue: "typedesc" }))); }, [company, multiData, t]), fetchData: fetchData, filterGeneral: false, exportPersonalized: triggerExportData, register: false, showHideColumns: true, ExtraMenuOptions: react_1["default"].createElement(core_1.MenuItem, { style: { padding: "0.7rem 1rem", fontSize: "0.96rem" }, onClick: handleOpenFilterModal },
                react_1["default"].createElement(core_1.ListItemIcon, null,
                    react_1["default"].createElement(Category_1["default"], { fontSize: "small", style: { fill: "grey", height: "25px" } })),
                react_1["default"].createElement(core_1.Typography, { variant: "inherit" }, t(keys_1.langKeys.filters) + " - " + t(keys_1.langKeys.report_reportrequestsd))) }),
        react_1["default"].createElement(templates_1.DialogZyx, { open: isFilterModalOpen, title: t(keys_1.langKeys.filters), buttonText1: t(keys_1.langKeys.close), buttonText2: t(keys_1.langKeys.apply), handleClickButton1: function () { return setFilterModalOpen(false); }, handleClickButton2: function () {
                setFilterModalOpen(false);
                fetchData(fetchDataAux);
            }, maxWidth: "sm", buttonStyle1: { marginBottom: "0.3rem" }, buttonStyle2: { marginRight: "1rem", marginBottom: "0.3rem" } },
            react_1["default"].createElement("div", { className: "row-zyx", style: { marginRight: 10 } },
                react_1["default"].createElement(templates_1.FieldSelect, { label: t(keys_1.langKeys.business), valueDefault: company, variant: "outlined", onChange: function (value) {
                        setCompany((value === null || value === void 0 ? void 0 : value.domainvalue) || "");
                    }, data: multiData.data[2].data, loading: multiData.loading, optionDesc: "domaindesc", optionValue: "domainvalue" })))));
};
exports["default"] = ReportRequestSD;
