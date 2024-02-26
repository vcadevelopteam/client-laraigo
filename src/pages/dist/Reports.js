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
var Card_1 = require("@material-ui/core/Card");
var CardActionArea_1 = require("@material-ui/core/CardActionArea");
var CardContent_1 = require("@material-ui/core/CardContent");
var CardMedia_1 = require("@material-ui/core/CardMedia");
var Grid_1 = require("@material-ui/core/Grid");
var Typography_1 = require("@material-ui/core/Typography");
var Box_1 = require("@material-ui/core/Box");
var table_paginated_1 = require("components/fields/table-paginated");
var table_simple_1 = require("components/fields/table-simple");
var Graphic_1 = require("components/fields/Graphic");
var styles_1 = require("@material-ui/core/styles");
var react_i18next_1 = require("react-i18next");
var keys_1 = require("lang/keys");
var components_1 = require("components");
var hooks_1 = require("hooks");
var helpers_1 = require("common/helpers");
var actions_1 = require("store/main/actions");
var actions_2 = require("store/popus/actions");
var react_redux_1 = require("react-redux");
var index_1 = require("../icons/index");
var ReportAssesorProductivity_1 = require("pages/staticReports/ReportAssesorProductivity");
var ReportTemplate_1 = require("pages/ReportTemplate");
var Add_1 = require("@material-ui/icons/Add");
var Button_1 = require("@material-ui/core/Button");
var IconButton_1 = require("@material-ui/core/IconButton");
var MoreVert_1 = require("@material-ui/icons/MoreVert");
var Menu_1 = require("@material-ui/core/Menu");
var MenuItem_1 = require("@material-ui/core/MenuItem");
var ReportPersonalized_1 = require("components/personalizedreport/ReportPersonalized");
var Heatmap_1 = require("./Heatmap");
var RecordHSMReport_1 = require("./RecordHSMReport");
var react_hook_form_1 = require("react-hook-form");
var Assessment_1 = require("@material-ui/icons/Assessment");
var icons_1 = require("icons");
var icons_2 = require("@material-ui/icons");
var ReportInvoice_1 = require("components/report/ReportInvoice");
var TicketvsAdviser_1 = require("components/report/TicketvsAdviser");
var HSMHistoryReport_1 = require("./HSMHistoryReport");
var UniqueContactsReport_1 = require("./UniqueContactsReport");
var ReportCampaign_1 = require("pages/staticReports/ReportCampaign");
var ReportKpiOperativo_1 = require("components/report/ReportKpiOperativo");
var VoiceChannelReport_1 = require("./VoiceChannelReport");
var ReportComplianceSLA_1 = require("components/report/ReportComplianceSLA");
var ReportRequestSD_1 = require("pages/staticReports/ReportRequestSD");
var ReportLeadGridTracking_1 = require("components/report/ReportLeadGridTracking");
var isIncremental = window.location.href.includes("incremental");
var columnsReport_1 = require("common/helpers/columnsReport");
var ReportTipification_1 = require("./staticReports/ReportTipification");
var ReportProductivityHours_1 = require("./staticReports/ReportProductivityHours");
var getArrayBread = function (nametmp, nameView1) { return ([
    { id: "view-1", name: nameView1 || "Reports" },
    { id: "view-2", name: nametmp }
]); };
var useStyles = styles_1.makeStyles(function (theme) {
    var _a, _b;
    return ({
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        },
        containerDetails: {
            marginTop: theme.spacing(3)
        },
        media: {
            objectFit: "contain"
        },
        containerSearch: (_a = {
                width: '100%',
                display: 'flex',
                gap: theme.spacing(1),
                alignItems: 'center'
            },
            _a[theme.breakpoints.up('sm')] = {
                width: '50%'
            },
            _a),
        containerFilter: {
            width: '100%',
            marginBottom: theme.spacing(2),
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap'
        },
        filterComponent: {
            minWidth: '220px',
            maxWidth: '260px'
        },
        containerFilterGeneral: {
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#FFF',
            padding: theme.spacing(1)
        },
        title: {
            fontSize: '22px',
            fontWeight: 'bold',
            color: theme.palette.text.primary
        },
        containerHeader: (_b = {
                display: 'block',
                marginBottom: 0
            },
            _b[theme.breakpoints.up('sm')] = {
                display: 'flex'
            },
            _b),
        mb2: {
            marginBottom: theme.spacing(4)
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
        }
    });
});
var ReportItem = function (_a) {
    var _b, _c;
    var setViewSelected = _a.setViewSelected, setSearchValue = _a.setSearchValue, row = _a.row, multiData = _a.multiData, allFilters = _a.allFilters, customReport = _a.customReport;
    var t = react_i18next_1.useTranslation().t;
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var reportColumns = multiData[0] && multiData[0].success ? multiData[0].data : [];
    var mainPaginated = hooks_1.useSelector(function (state) { return state.main.mainPaginated; });
    var resExportData = hooks_1.useSelector(function (state) { return state.main.exportData; });
    var _d = react_1.useState(0), pageCount = _d[0], setPageCount = _d[1];
    var _e = react_1.useState(false), waitSave = _e[0], setWaitSave = _e[1];
    var _f = react_1.useState(0), totalrow = _f[0], settotalrow = _f[1];
    var _g = react_1.useState({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null }), fetchDataAux = _g[0], setfetchDataAux = _g[1];
    var _h = react_1.useState({}), allParameters = _h[0], setAllParameters = _h[1];
    var _j = react_1.useState(false), openModal = _j[0], setOpenModal = _j[1];
    var _k = react_1.useState('GRID'), view = _k[0], setView = _k[1];
    react_1.useEffect(function () {
        dispatch(actions_1.setViewChange("report_" + (row === null || row === void 0 ? void 0 : row.origin)));
        return function () {
            dispatch(actions_1.cleanViewChange());
        };
    }, []);
    var columns = react_1["default"].useMemo(function () { return reportColumns.map(function (x) {
        var _a, _b;
        var showColumn = (_b = (_a = columnsReport_1.columnsHideShow[row === null || row === void 0 ? void 0 : row.origin]) === null || _a === void 0 ? void 0 : _a[x.proargnames]) !== null && _b !== void 0 ? _b : false;
        switch (x.proargtype) {
            case "bigint":
                if (x.proargnames.includes('year') || x.proargnames.includes('month') || x.proargnames.includes('week') || x.proargnames.includes('day') || x.proargnames.includes('hour')) {
                    return {
                        Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                        accessor: x.proargnames,
                        showColumn: showColumn,
                        type: "number-centered"
                    };
                }
                else {
                    return {
                        Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                        accessor: x.proargnames,
                        showColumn: showColumn,
                        helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                        type: "number"
                    };
                }
            case "boolean":
                return {
                    Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                    accessor: x.proargnames,
                    helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                    type: "boolean",
                    showColumn: showColumn,
                    Cell: function (props) {
                        var column = props.cell.column;
                        var row = props.cell.row.original;
                        return (t(("" + row[column.id]).toLowerCase()) || "").toUpperCase();
                    }
                };
            case "timestamp without time zone":
                return {
                    Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                    accessor: x.proargnames,
                    helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                    type: "date",
                    showColumn: showColumn,
                    Cell: function (props) {
                        var column = props.cell.column;
                        var row = props.cell.row.original;
                        return (react_1["default"].createElement("div", null, helpers_1.convertLocalDate(row[column.id]).toLocaleString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: false
                        })));
                    }
                };
            case "date":
                return {
                    Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                    accessor: x.proargnames,
                    helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                    type: "date",
                    showColumn: showColumn,
                    Cell: function (props) {
                        var column = props.cell.column;
                        var row = props.cell.row.original;
                        return (react_1["default"].createElement("div", null, new Date(row[column.id].split('-')[0], row[column.id].split('-')[1] - 1, row[column.id].split('-')[2]).toLocaleString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        })));
                    }
                };
            default:
                switch (row === null || row === void 0 ? void 0 : row.origin) {
                    case "loginhistory":
                        switch (x.proargnames) {
                            case "status":
                                return {
                                    Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                                    accessor: x.proargnames,
                                    helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                                    type: "string",
                                    showColumn: showColumn,
                                    Cell: function (props) {
                                        var status = props.cell.row.original.status;
                                        return (t(("status_" + status).toLowerCase()) || "").toUpperCase();
                                    }
                                };
                            default:
                                return {
                                    Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                                    accessor: x.proargnames,
                                    showColumn: showColumn,
                                    helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                                    type: "string"
                                };
                        }
                    case "interaction":
                    case "inputretry":
                        switch (x.proargnames) {
                            case "interactiontext":
                                return {
                                    Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                                    accessor: x.proargnames,
                                    helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                                    type: "string",
                                    showColumn: showColumn,
                                    Cell: function (props) {
                                        var interactiontext = props.cell.row.original.interactiontext;
                                        var texttoshow = interactiontext.length < 40 ? interactiontext : interactiontext.substring(0, 40) + "... ";
                                        return texttoshow;
                                    }
                                };
                            case "question":
                                return {
                                    Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                                    accessor: x.proargnames,
                                    helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                                    type: "string",
                                    showColumn: showColumn,
                                    Cell: function (props) {
                                        var question = props.cell.row.original.question;
                                        var texttoshow = question.length < 40 ? question : question.substring(0, 40) + "... ";
                                        return texttoshow;
                                    }
                                };
                            default:
                                return {
                                    Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                                    accessor: x.proargnames,
                                    showColumn: showColumn,
                                    helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                                    type: "string"
                                };
                        }
                    default:
                        return {
                            Header: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames || ''),
                            accessor: x.proargnames,
                            showColumn: showColumn,
                            helpText: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") === ('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help") ? "" : t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_' + x.proargnames + "_help"),
                            type: "string"
                        };
                }
        }
    }); }, [reportColumns]);
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
                (_a = resExportData.url) === null || _a === void 0 ? void 0 : _a.split(",").forEach(function (x) { return window.open(x, '_blank'); });
            }
            else if (resExportData.error) {
                var errormessage = t((_b = resExportData.code) !== null && _b !== void 0 ? _b : "error_unexpected_error", { module: t(keys_1.langKeys.property).toLocaleLowerCase() });
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
        dispatch(actions_1.exportData(helpers_1.getReportExport((row === null || row === void 0 ? void 0 : row.methodexport) || '', (row === null || row === void 0 ? void 0 : row.origin) || '', __assign({ filters: filters,
            sorts: sorts, startdate: daterange.startDate, enddate: daterange.endDate }, allParameters)), "", "excel", false, columnsExport));
        dispatch(actions_2.showBackdrop(true));
        setWaitSave(true);
    };
    var fetchData = function (_a) {
        var pageSize = _a.pageSize, pageIndex = _a.pageIndex, filters = _a.filters, sorts = _a.sorts, daterange = _a.daterange;
        setfetchDataAux({ pageSize: pageSize, pageIndex: pageIndex, filters: filters, sorts: sorts, daterange: daterange });
        dispatch(actions_1.getCollectionPaginated(helpers_1.getPaginatedForReports((row === null || row === void 0 ? void 0 : row.methodcollection) || '', (row === null || row === void 0 ? void 0 : row.methodcount) || '', (row === null || row === void 0 ? void 0 : row.origin) || '', __assign({ startdate: daterange.startDate, enddate: daterange.endDate, take: pageSize, skip: pageIndex * pageSize, sorts: sorts, filters: filters }, allParameters))));
    };
    var handlerSearchGraphic = function (daterange, column) {
        setfetchDataAux(function (prev) { return (__assign(__assign({}, prev), { daterange: daterange })); });
        dispatch(actions_1.getMainGraphic(helpers_1.getReportGraphic((row === null || row === void 0 ? void 0 : row.methodgraphic) || '', (row === null || row === void 0 ? void 0 : row.origin) || '', __assign({ filters: {}, sorts: {}, startdate: daterange === null || daterange === void 0 ? void 0 : daterange.startDate, enddate: daterange === null || daterange === void 0 ? void 0 : daterange.endDate, column: column, summarization: 'COUNT' }, allParameters))));
    };
    var handleSelected = function () {
        dispatch(actions_1.resetCollectionPaginated());
        dispatch(actions_1.resetMultiMain());
        setSearchValue('');
        setViewSelected("view-1");
    };
    var setValue = function (parameterName, value) {
        var _a;
        setAllParameters(__assign(__assign({}, allParameters), (_a = {}, _a[parameterName] = value, _a)));
    };
    //filter channel
    var filterChannel = hooks_1.useSelector(function (state) { return state.main.mainAux; });
    var _l = react_1.useState(false), waitExport = _l[0], setWaitExport = _l[1];
    var channelTypeList = filterChannel.data || [];
    var channelTypeFilteredList = new Set();
    var _m = react_1.useState(""), selectedChannel = _m[0], setSelectedChannel = _m[1];
    var uniqueTypdescList = channelTypeList.filter(function (item) {
        if (channelTypeFilteredList.has(item.type)) {
            return false;
        }
        channelTypeFilteredList.add(item.type);
        return true;
    });
    // const fetchFiltersChannels = () => dispatch(getCollectionAux(getCommChannelLst()))
    // useEffect(() => {
    //     dispatch(resetCollectionPaginated());
    //     fetchData(fetchDataAux);
    //     fetchFiltersChannels();
    //     return () => {
    //         dispatch(resetCollectionPaginated());
    //     };
    // }, []);
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
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
            dispatch(actions_2.showBackdrop(false));
        }
    }, [mainPaginated]);
    return (react_1["default"].createElement("div", { style: { width: '100%', display: "flex", flex: 1, flexDirection: "column" } },
        react_1["default"].createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_' + (row === null || row === void 0 ? void 0 : row.origin)), t(keys_1.langKeys.report_plural)), handleClick: handleSelected })),
        customReport ?
            react_1["default"].createElement(ReportAssesorProductivity_1["default"], { row: row, allFilters: allFilters }) :
            react_1["default"].createElement(react_1["default"].Fragment, null, multiData.length > 0 ?
                react_1["default"].createElement(react_1["default"].Fragment, null, view === "GRID" ? (react_1["default"].createElement(table_paginated_1["default"], { columns: columns, data: mainPaginated.data, totalrow: totalrow, loading: mainPaginated.loading, pageCount: pageCount, filterrange: true, showHideColumns: true, FiltersElement: (react_1["default"].createElement(react_1["default"].Fragment, null, !allFilters ? null : allFilters.map(function (filtro) { return ((filtro.values[0].multiselect ?
                        react_1["default"].createElement(components_1.FieldMultiSelect, { valueDefault: allParameters[filtro.values[0].parameterName], limitTags: 1, label: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_filter_' + filtro.values[0].label || ''), className: classes.filterComponent, key: filtro.values[0].filter, onChange: function (value) { return setValue(filtro.values[0].parameterName, value ? value.map(function (o) { return o[filtro.values[0].optionValue]; }).join() : ''); }, variant: "outlined", data: multiData[multiData.findIndex(function (x) { return x.key === filtro.values[0].filter; })].data, optionDesc: filtro.values[0].optionDesc, optionValue: filtro.values[0].optionValue })
                        :
                            react_1["default"].createElement(components_1.FieldSelect, { valueDefault: allParameters[filtro.values[0].parameterName], label: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_filter_' + filtro.values[0].label || ''), className: classes.filterComponent, key: filtro.values[0].filter, variant: "outlined", onChange: function (value) { return setValue(filtro.values[0].parameterName, value ? value[filtro.values[0].optionValue] : ''); }, data: multiData[multiData.findIndex(function (x) { return x.key === filtro.values[0].filter; })].data, optionDesc: filtro.values[0].optionDesc, optionValue: filtro.values[0].optionValue }))); }))), ButtonsElement: react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(Button_1["default"], { className: classes.button, variant: "contained", color: "primary", disabled: mainPaginated.loading || mainPaginated.data.length <= 0, onClick: function () { return setOpenModal(true); }, startIcon: react_1["default"].createElement(Assessment_1["default"], null) }, t(keys_1.langKeys.graphic_view))), download: true, fetchData: fetchData, exportPersonalized: triggerExportData })) : (react_1["default"].createElement("div", { className: classes.container },
                    react_1["default"].createElement(Graphic_1["default"], { graphicType: ((_b = view.split("-")) === null || _b === void 0 ? void 0 : _b[1]) || "BAR", column: ((_c = view.split("-")) === null || _c === void 0 ? void 0 : _c[2]) || "summary", openModal: openModal, setOpenModal: setOpenModal, daterange: fetchDataAux.daterange, setView: setView, row: row, handlerSearchGraphic: handlerSearchGraphic, FiltersElement: (react_1["default"].createElement(react_1["default"].Fragment, null, !allFilters ? null : allFilters.map(function (filtro) { return ((filtro.values[0].multiselect ?
                            react_1["default"].createElement(components_1.FieldMultiSelect, { valueDefault: allParameters[filtro.values[0].parameterName], limitTags: 1, label: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_filter_' + filtro.values[0].label || ''), className: classes.filterComponent, key: filtro.values[0].filter, onChange: function (value) { return setValue(filtro.values[0].parameterName, value ? value.map(function (o) { return o[filtro.values[0].optionValue]; }).join() : ''); }, variant: "outlined", data: multiData[multiData.findIndex(function (x) { return x.key === filtro.values[0].filter; })].data, optionDesc: filtro.values[0].optionDesc, optionValue: filtro.values[0].optionValue })
                            :
                                react_1["default"].createElement(components_1.FieldSelect, { valueDefault: allParameters[filtro.values[0].parameterName], label: t('report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_filter_' + filtro.values[0].label || ''), className: classes.filterComponent, key: filtro.values[0].filter, variant: "outlined", onChange: function (value) { return setValue(filtro.values[0].parameterName, value ? value[filtro.values[0].optionValue] : ''); }, data: multiData[multiData.findIndex(function (x) { return x.key === filtro.values[0].filter; })].data, optionDesc: filtro.values[0].optionDesc, optionValue: filtro.values[0].optionValue }))); }))) }))))
                :
                    react_1["default"].createElement(components_1.SkeletonReport, null)),
        react_1["default"].createElement(SummaryGraphic, { openModal: openModal, setOpenModal: setOpenModal, setView: setView, row: row, daterange: fetchDataAux.daterange, filters: fetchDataAux.filters, columns: reportColumns.map(function (x) { return x.proargnames; }), columnsprefix: 'report_' + (row === null || row === void 0 ? void 0 : row.origin) + '_', allParameters: allParameters })));
};
var SummaryGraphic = function (_a) {
    var _b, _c, _d, _e;
    var openModal = _a.openModal, setOpenModal = _a.setOpenModal, setView = _a.setView, row = _a.row, daterange = _a.daterange, filters = _a.filters, columns = _a.columns, columnsprefix = _a.columnsprefix, _f = _a.allParameters, allParameters = _f === void 0 ? {} : _f;
    var t = react_i18next_1.useTranslation().t;
    var dispatch = react_redux_1.useDispatch();
    var _g = react_hook_form_1.useForm({
        defaultValues: {
            graphictype: 'BAR',
            column: ''
        }
    }), register = _g.register, handleSubmit = _g.handleSubmit, setValue = _g.setValue, getValues = _g.getValues, errors = _g.formState.errors;
    react_1.useEffect(function () {
        register('graphictype', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
        register('column', { validate: function (value) { return (value && value.length) || t(keys_1.langKeys.field_required); } });
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
        dispatch(actions_1.getMainGraphic(helpers_1.getReportGraphic((row === null || row === void 0 ? void 0 : row.methodgraphic) || '', (row === null || row === void 0 ? void 0 : row.origin) || '', __assign({ filters: filters, sorts: {}, startdate: daterange === null || daterange === void 0 ? void 0 : daterange.startDate, enddate: daterange === null || daterange === void 0 ? void 0 : daterange.endDate, column: data.column, summarization: 'COUNT' }, allParameters))));
    };
    var excludeConversation = [
        "email",
        "starttime",
        "endtime",
        "derivationdate",
        "derivationtime",
        "firstinteractiondate",
        "firstinteractiontime",
        "tmo",
        "tmoagent",
        "tmeagent",
        "holdingholdtime",
        "suspensiontime",
        "avgagentresponse",
        "swingingtimes",
        "tags",
        "firstinteractiondateagent",
    ];
    var excludeInteractions = [
        "ticketdatehour",
        "interactionid",
        "interactiondatehour",
        "originalname",
        "interactiontext",
        "email",
    ];
    var filteredColumns = columns;
    if ((row === null || row === void 0 ? void 0 : row.reportname) === "CONVERSATION")
        filteredColumns = columns.filter(function (column) { return !excludeConversation.includes(column); });
    if ((row === null || row === void 0 ? void 0 : row.reportname) === "INTERACTION")
        filteredColumns = columns.filter(function (column) { return !excludeInteractions.includes(column); });
    return (react_1["default"].createElement(components_1.DialogZyx, { open: openModal, title: t(keys_1.langKeys.graphic_configuration), button1Type: "button", buttonText1: t(keys_1.langKeys.cancel), handleClickButton1: handleCancelModal, button2Type: "button", buttonText2: t(keys_1.langKeys.accept), handleClickButton2: handleAcceptModal },
        react_1["default"].createElement("div", { className: "row-zyx" },
            react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.graphic_type), className: "col-12", valueDefault: getValues('graphictype'), error: (_c = (_b = errors === null || errors === void 0 ? void 0 : errors.graphictype) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : "", onChange: function (value) { return setValue('graphictype', value === null || value === void 0 ? void 0 : value.key); }, data: [{ key: 'BAR', value: 'BAR' }, { key: 'PIE', value: 'PIE' }, { key: 'LINE', value: 'LINEA' },], uset: true, prefixTranslation: "graphic_", optionDesc: "value", optionValue: "key" })),
        react_1["default"].createElement("div", { className: "row-zyx" },
            react_1["default"].createElement(components_1.FieldSelect, { label: t(keys_1.langKeys.graphic_view_by), className: "col-12", valueDefault: getValues('column'), error: (_e = (_d = errors === null || errors === void 0 ? void 0 : errors.column) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : "", onChange: function (value) { return setValue('column', value === null || value === void 0 ? void 0 : value.key); }, data: filteredColumns.map(function (x) { return ({ key: x, value: x }); }), optionDesc: "value", optionValue: "key", uset: true, prefixTranslation: columnsprefix }))));
};
var initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
};
var ReportConversationWhatsapp = function () {
    var t = react_i18next_1.useTranslation().t;
    var dispatch = react_redux_1.useDispatch();
    var multiData = hooks_1.useSelector(function (state) { return state.main.multiData; });
    var _a = react_1.useState([]), gridData = _a[0], setGridData = _a[1];
    var classes = useStyles();
    var _b = react_1.useState(false), openDateRangeCreateDateModal = _b[0], setOpenDateRangeCreateDateModal = _b[1];
    var _c = react_1.useState(initialRange), dateRangeCreateDate = _c[0], setDateRangeCreateDate = _c[1];
    var search = function () {
        dispatch(actions_2.showBackdrop(true));
        dispatch(actions_1.getMultiCollection([
            helpers_1.getConversationsWhatsapp({
                startdate: dateRangeCreateDate.startDate,
                enddate: dateRangeCreateDate.endDate
            })
        ]));
    };
    react_1.useEffect(function () {
        dispatch(actions_1.setViewChange("report_conversationwhatsapp"));
        return function () {
            dispatch(actions_1.cleanViewChange());
        };
    }, []);
    react_1.useEffect(function () {
        return function () {
            dispatch(actions_1.resetMultiMain());
        };
    }, []);
    react_1.useEffect(function () {
        var _a;
        if (!multiData.loading) {
            dispatch(actions_2.showBackdrop(false));
            setGridData((((_a = multiData.data[0]) === null || _a === void 0 ? void 0 : _a.data) || []).map(function (d) { return (__assign(__assign({}, d), { conversationstart: d.conversationstart ? new Date(d.conversationstart).toLocaleString() : '', conversationend: d.conversationend ? new Date(d.conversationend).toLocaleString() : '' })); }));
        }
    }, [multiData]);
    var columns = react_1["default"].useMemo(function () { return [
        {
            Header: t(keys_1.langKeys.personIdentifier),
            accessor: 'personcommunicationchannel'
        },
        {
            Header: t(keys_1.langKeys.phone),
            accessor: 'personcommunicationchannelowner'
        },
        {
            Header: t(keys_1.langKeys.ticket_number),
            accessor: 'ticketnum'
        },
        {
            Header: "Iniciado por",
            accessor: 'initiatedby'
        },
        {
            Header: "Fecha de inicio",
            accessor: 'conversationstart'
        },
        {
            Header: "Fecha de fin",
            accessor: 'conversationend'
        },
        {
            Header: t(keys_1.langKeys.countrycode),
            accessor: 'country'
        },
        {
            Header: t(keys_1.langKeys.amount),
            accessor: 'cost',
            type: 'number'
        },
        {
            Header: t(keys_1.langKeys.paymentmethod),
            accessor: 'paymenttype',
            Cell: function (props) {
                var paymenttype = props.cell.row.original.paymenttype;
                return (t(("" + paymenttype).toLowerCase()) || "").toUpperCase();
            }
        },
    ]; }, []);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { style: { height: 10 } }),
        react_1["default"].createElement(table_simple_1["default"], { columns: columns, data: gridData, ButtonsElement: function () { return (react_1["default"].createElement("div", { className: classes.containerHeader, style: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' } },
                react_1["default"].createElement("div", { style: { display: 'flex', gap: 8 } },
                    react_1["default"].createElement(components_1.DateRangePicker, { open: openDateRangeCreateDateModal, setOpen: setOpenDateRangeCreateDateModal, range: dateRangeCreateDate, onSelect: setDateRangeCreateDate },
                        react_1["default"].createElement(Button_1["default"], { className: classes.itemDate, startIcon: react_1["default"].createElement(icons_1.CalendarIcon, null), onClick: function () { return setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal); } }, helpers_1.getDateCleaned(dateRangeCreateDate.startDate) + " - " + helpers_1.getDateCleaned(dateRangeCreateDate.endDate))),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement(Button_1["default"], { disabled: multiData.loading, variant: "contained", color: "primary", startIcon: react_1["default"].createElement(icons_2.Search, { style: { color: 'white' } }), style: { width: 120, backgroundColor: "#55BD84" }, onClick: function () { return search(); } }, t(keys_1.langKeys.search)))))); }, download: true, filterGeneral: false, loading: multiData.loading, register: false })));
};
var Reports = function () {
    var _a, _b, _c;
    var t = react_i18next_1.useTranslation().t;
    var classes = useStyles();
    var dispatch = react_redux_1.useDispatch();
    var reportsResult = hooks_1.useSelector(function (state) { return state.main; });
    var _d = react_1.useState([]), rowSelected = _d[0], setRowSelected = _d[1];
    var _e = react_1.useState(''), searchValue = _e[0], setSearchValue = _e[1];
    var _f = react_1.useState("view-1"), viewSelected = _f[0], setViewSelected = _f[1];
    var _g = react_1.useState(false), customReport = _g[0], setCustomReport = _g[1];
    var _h = react_1.useState({ row: null, edit: false }), rowReportSelected = _h[0], setRowReportSelected = _h[1];
    var _j = react_1["default"].useState(null), anchorEl = _j[0], setAnchorEl = _j[1];
    var _k = react_1.useState(false), waitSave = _k[0], setWaitSave = _k[1];
    var executeRes = hooks_1.useSelector(function (state) { return state.main.execute; });
    var _l = react_1.useState([]), allReports = _l[0], setAllReports = _l[1];
    var _m = react_1.useState([]), allReportsToShow = _m[0], setallReportsToShow = _m[1];
    var user = hooks_1.useSelector(function (state) { return state.login.validateToken.user; });
    var superadmin = (_a = user === null || user === void 0 ? void 0 : user.roledesc) === null || _a === void 0 ? void 0 : _a.includes("SUPERADMIN");
    var fetchData = function () {
        dispatch(actions_1.getCollection(helpers_1.getReportSel('')));
        dispatch(actions_1.getCollectionAux(helpers_1.getReportTemplateSel()));
    };
    react_1.useEffect(function () {
        if (!reportsResult.mainData.loading && !reportsResult.mainData.error && !reportsResult.mainAux.loading && !reportsResult.mainAux.error && reportsResult.mainAux.key === "UFN_REPORTTEMPLATE_SEL") {
            if (searchValue === null || searchValue.trim().length === 0) {
                if (allReports.length === 0 || !waitSave) {
                    var rr = __spreadArrays(reportsResult.mainData.data.map(function (x) { return (__assign(__assign({}, x), { reporttype: "default" })); }), reportsResult.mainAux.data.map(function (x) { return (__assign(__assign({}, x), { columns: x.columnjson ? JSON.parse(x.columnjson) : [], filters: x.filterjson ? JSON.parse(x.filterjson) : [], summaries: x.summaryjson ? JSON.parse(x.summaryjson) : [], reporttype: "custom" })); })).filter(function (y) { return superadmin ? true : !['invoice'].includes(y === null || y === void 0 ? void 0 : y.origin); });
                    setAllReports(rr);
                    setallReportsToShow(rr);
                }
            }
        }
    }, [reportsResult.mainAux, reportsResult.mainData, waitSave]);
    react_1.useEffect(function () {
        if (searchValue.length >= 3 || searchValue.length === 0) {
            var temparray = allReports.filter(function (el) {
                if (el.reporttype === "default")
                    return (t(keys_1.langKeys["report_" + el.origin]) + "").toLowerCase().includes(searchValue.toLowerCase());
                return el.description.toLowerCase().includes(searchValue.toLowerCase());
            });
            setallReportsToShow(temparray);
        }
    }, [searchValue]);
    react_1.useEffect(function () {
        setallReportsToShow(allReports);
    }, [viewSelected]);
    react_1.useEffect(function () {
        fetchData();
        dispatch(actions_1.getMultiCollectionAux([
            helpers_1.getValuesFromDomain("ESTADOGENERICO"),
            helpers_1.getTableOrigin(),
            helpers_1.getValuesFromDomain('EMPRESA'),
        ]));
        return function () {
            dispatch(actions_1.resetMainAux());
            dispatch(actions_1.resetCollectionPaginated());
            dispatch(actions_1.resetMultiMain());
            dispatch(actions_1.resetMain());
        };
    }, []);
    var handleFiend = function (valor) {
        setSearchValue(valor);
    };
    var handleSelected = function (row, allFilters) {
        dispatch(actions_1.resetCollectionPaginated());
        dispatch(actions_1.resetMultiMain());
        setRowSelected(row);
        if (row.reportname !== 'PRODUCTIVITY') {
            var allRequestBody_1 = [];
            allRequestBody_1.push(helpers_1.getReportColumnSel((row === null || row === void 0 ? void 0 : row.methodcollection) || ""));
            if (allFilters) {
                allFilters.sort(function (a, b) { return a.order - b.order; });
                allFilters.forEach(function (x) {
                    allRequestBody_1.push(helpers_1.getReportFilterSel(String(x.values[0].filter), x.values[0].isListDomains ? String(x.values[0].filter) + "_" + x.values[0].domainname : String(x.values[0].filter), x.values[0].isListDomains ? x.values[0].domainname : ""));
                });
            }
            dispatch(actions_1.getMultiCollection(allRequestBody_1));
        }
        setViewSelected("view-2");
        setCustomReport(row.reportname === 'PRODUCTIVITY');
    };
    react_1.useEffect(function () {
        var _a;
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(actions_2.showSnackbar({ show: true, severity: "success", message: t(keys_1.langKeys.successful_delete) }));
                fetchData();
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
            }
            else if (executeRes.error) {
                var errormessage = t((_a = executeRes.code) !== null && _a !== void 0 ? _a : "error_unexpected_error", { module: t(keys_1.langKeys.organization_plural).toLocaleLowerCase() });
                dispatch(actions_2.showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(actions_2.showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave]);
    var handleDelete = function (row) {
        setAnchorEl(null);
        if (!row)
            return null;
        var callback = function () {
            dispatch(actions_1.execute(helpers_1.insertReportTemplate(__assign(__assign({}, row), { operation: 'DELETE', status: 'ELIMINADO', id: row.reporttemplateid }))));
            dispatch(actions_2.showBackdrop(true));
            setWaitSave(true);
        };
        dispatch(actions_2.manageConfirmation({
            visible: true,
            question: t(keys_1.langKeys.confirmation_delete),
            callback: callback
        }));
    };
    var handleSelectedString = function (key) {
        setViewSelected(key);
    };
    var reportSwitch = function (report, index) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        switch (report.reportname) {
            case 'HEATMAP':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "heatmap", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("heatmap"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/01mapadecalor.png', title: t(keys_1.langKeys.heatmap) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.heatmap)))))));
            case 'RECORDHSMREPORT':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "recordhsmreport", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("recordhsmreport"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: "https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/02reportehsm.png", title: t(keys_1.langKeys.recordhsmreport) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.recordhsmreport)))))));
            case 'HYSTORYHSM':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "hsmhistory", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("hsmhistory"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: "https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/5740f300-9107-4c2f-b7eb-eee27652acab/Historial%20HSM.png", title: t(keys_1.langKeys.hsmhistory) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.hsmhistory)))))));
            case 'CONVERSATIONWHATSAPP':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "reportconversationwhatsapp", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("reportconversationwhatsapp"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/whatsapp_PNG95151.png', title: t(keys_1.langKeys.conversation_plural) + " Whatsapp" }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.conversation_plural) + " Whatsapp"))))));
            case 'INVOICE':
                return (superadmin && react_1["default"].createElement(Grid_1["default"], { item: true, key: "invoice", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("reportinvoice"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/03reportepersonalizado.png', title: t(keys_1.langKeys.invoice) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.invoice)))))));
            case 'KPIOPERATIVO':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "kpioperativo", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("kpioperativo"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/CLARO/72fd542f-719c-4226-89f9-b29c6a46a4d7/reporteKPI.svg', title: t(keys_1.langKeys.kpimanager) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.kpimanager)))))));
            case 'TICKETVSADVISER':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "report_ticketvsasesor", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("report_ticketvsasesor"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/ad0b89eb-6ed6-409d-b2e7-ddc9ea6c6f28/asesorvstickets.png', title: t(keys_1.langKeys.report_ticketvsasesor) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.report_ticketvsasesor)))))));
            case 'CAMPAIGN':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "campaign", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("campaign"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: "https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/8f5f232b-4fe6-414d-883b-e90f402becf5/campa%C3%B1as.png", title: t(keys_1.langKeys.campaign) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.campaign)))))));
            case 'COMPLIANCESLA':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "reportcompliancesla", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("reportcompliancesla"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: "https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/8f5f232b-4fe6-414d-883b-e90f402becf5/campa%C3%B1as.png", title: t(keys_1.langKeys.report_reportcompliancesla) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.report_reportcompliancesla)))))));
            case 'REQUESTSD':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "reportrequestsd", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("reportrequestsd"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: "https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/PROCESOSYCONSULTORIA/8f5f232b-4fe6-414d-883b-e90f402becf5/campa%C3%B1as.png", title: t(keys_1.langKeys.report_reportrequestsd) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.report_reportrequestsd)))))));
            case 'LEADGRIDTRACKING':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "leadgridtracking", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("leadgridtracking"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: "https://publico-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/36231e3d-cf33-4d5e-a676-88a9ce3aac64/image_720.png", title: t(keys_1.langKeys.report_leadgridtracking) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.report_leadgridtracking)))))));
            case 'UNIQUECONTACTS':
                if (((_a = user === null || user === void 0 ? void 0 : user.roledesc) === null || _a === void 0 ? void 0 : _a.includes("SUPERADMIN")) || ((_b = user === null || user === void 0 ? void 0 : user.roledesc) === null || _b === void 0 ? void 0 : _b.includes("SUPERVISOR")) || ((_c = user === null || user === void 0 ? void 0 : user.roledesc) === null || _c === void 0 ? void 0 : _c.includes("ADMINISTRADOR"))) {
                    return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "uniquecontactsreport", xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                        react_1["default"].createElement(Card_1["default"], null,
                            react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("uniquecontactsreport"); } },
                                react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: (_e = (_d = index_1.reportsImage.find(function (x) { return x.name === report.image; })) === null || _d === void 0 ? void 0 : _d.image) !== null && _e !== void 0 ? _e : 'no_data.png', title: t(keys_1.langKeys.uniquecontactsreport) }),
                                react_1["default"].createElement(CardContent_1["default"], null,
                                    react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t(keys_1.langKeys.uniquecontactsreport)))))));
                }
                else {
                    return (react_1["default"].createElement(react_1["default"].Fragment, null));
                }
            case 'VOICECALL':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "report_" + report.reportid + "_" + index, xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelectedString("voicecallreport"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: (_g = (_f = index_1.reportsImage.find(function (x) { return x.name === report.image; })) === null || _f === void 0 ? void 0 : _f.image) !== null && _g !== void 0 ? _g : 'no_data.png', title: t('report_' + (report === null || report === void 0 ? void 0 : report.origin)) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t('report_' + (report === null || report === void 0 ? void 0 : report.origin))))))));
            case 'TIPIFICATION':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "report_" + report.reportid + "_" + index, xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { setRowSelected(report); handleSelectedString("tipificationreport"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: (_j = (_h = index_1.reportsImage.find(function (x) { return x.name === report.image; })) === null || _h === void 0 ? void 0 : _h.image) !== null && _j !== void 0 ? _j : 'no_data.png', title: t('report_' + (report === null || report === void 0 ? void 0 : report.origin)) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t('report_' + (report === null || report === void 0 ? void 0 : report.origin))))))));
            case 'PRODUCTIVITYHOURS':
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "report_" + report.reportid + "_" + index, xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { setRowSelected(report); handleSelectedString("productivityhoursreport"); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: (_l = (_k = index_1.reportsImage.find(function (x) { return x.name === report.image; })) === null || _k === void 0 ? void 0 : _k.image) !== null && _l !== void 0 ? _l : 'no_data.png', title: t('report_' + (report === null || report === void 0 ? void 0 : report.origin)) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t('report_' + (report === null || report === void 0 ? void 0 : report.origin))))))));
            default:
                return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "report_" + report.reportid + "_" + index, xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                    react_1["default"].createElement(Card_1["default"], null,
                        react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () { return handleSelected(report, report.filters); } },
                            react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: (_o = (_m = index_1.reportsImage.find(function (x) { return x.name === report.image; })) === null || _m === void 0 ? void 0 : _m.image) !== null && _o !== void 0 ? _o : 'no_data.png', title: t('report_' + (report === null || report === void 0 ? void 0 : report.origin)) }),
                            react_1["default"].createElement(CardContent_1["default"], null,
                                react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, t('report_' + (report === null || report === void 0 ? void 0 : report.origin))))))));
        }
    };
    if (viewSelected === "view-1") {
        return (react_1["default"].createElement("div", { className: classes.container },
            (!reportsResult.mainData.loading && !reportsResult.mainAux.loading) &&
                react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(Box_1["default"], { className: classes.containerFilterGeneral },
                        react_1["default"].createElement("span", null),
                        react_1["default"].createElement("div", { className: classes.containerSearch },
                            react_1["default"].createElement("div", { style: { flex: 1 } },
                                react_1["default"].createElement(components_1.SearchField, { colorPlaceHolder: '#FFF', handleChangeOther: handleFiend, lazy: true })),
                            !isIncremental &&
                                react_1["default"].createElement(Button_1["default"]
                                // className={classes.button}
                                , { 
                                    // className={classes.button}
                                    variant: "contained", color: "primary", 
                                    // disabled={loading}
                                    startIcon: react_1["default"].createElement(Add_1["default"], { color: "secondary" }), onClick: function () {
                                        setViewSelected("view-3");
                                        setRowReportSelected({ row: null, edit: true });
                                    }, style: { backgroundColor: "#55BD84" }, disabled: !((_b = user === null || user === void 0 ? void 0 : user.roledesc) !== null && _b !== void 0 ? _b : "")
                                        .split(",")
                                        .some(function (v) { return ["ADMINISTRADOR", "SUPERADMIN", "SUPERADMINISTRADOR SOCIOS"].includes(v); })
                                        && (user === null || user === void 0 ? void 0 : user.properties.environment) === "CLARO" }, t(keys_1.langKeys.create_custom_report))))),
            react_1["default"].createElement(Box_1["default"], { className: classes.containerHeader, justifyContent: "space-between", alignItems: "center", style: { marginBottom: 8 } },
                react_1["default"].createElement("span", { className: classes.title },
                    t(keys_1.langKeys.defaultreports),
                    " (",
                    allReportsToShow.filter(function (x) { return x.reporttype === "default"; }).length,
                    ")")),
            (reportsResult.mainData.loading || reportsResult.mainAux.loading) ? (react_1["default"].createElement(components_1.SkeletonReportCard, null)) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { className: classes.containerDetails },
                    react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 3 },
                        allReportsToShow.filter(function (x) { return x.reporttype === "default"; }).filter(function (x) { return !!x.image; }).map(function (report, index) { return (reportSwitch(report, index)); }),
                        allReportsToShow.filter(function (x) { return x.reporttype === "default"; }).filter(function (x) { return !x.image; }).map(function (report, index) { return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "report_" + report.reporttemplateid + "_" + index, xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                            react_1["default"].createElement(Card_1["default"], { style: { position: 'relative' } },
                                react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () {
                                        setViewSelected("view-4");
                                        setRowReportSelected({ row: report, edit: true });
                                    } },
                                    react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/03reportepersonalizado.png', title: report.description }),
                                    react_1["default"].createElement(CardContent_1["default"], null,
                                        react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, report.description))),
                                react_1["default"].createElement(IconButton_1["default"], { "aria-label": "settings", "aria-describedby": (report === null || report === void 0 ? void 0 : report.reporttemplateid) + "reporttemplate", "aria-haspopup": "true", style: { position: 'absolute', right: 0, top: 0 }, onClick: function (e) {
                                        setRowReportSelected({ row: report, edit: true });
                                        setAnchorEl(e.currentTarget);
                                    } },
                                    react_1["default"].createElement(MoreVert_1["default"], null))))); }),
                        react_1["default"].createElement(Menu_1["default"], { anchorEl: anchorEl, getContentAnchorEl: null, anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            }, transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }, open: Boolean(anchorEl), onClose: function () { return setAnchorEl(null); } },
                            react_1["default"].createElement(MenuItem_1["default"], { onClick: function () {
                                    setAnchorEl(null);
                                    setViewSelected("view-3");
                                } }, t(keys_1.langKeys.edit)),
                            react_1["default"].createElement(MenuItem_1["default"], { onClick: function () {
                                    setAnchorEl(null);
                                    setViewSelected("view-5");
                                } }, t(keys_1.langKeys.duplicate)),
                            react_1["default"].createElement(MenuItem_1["default"], { onClick: function () { return handleDelete(rowReportSelected === null || rowReportSelected === void 0 ? void 0 : rowReportSelected.row); } }, t(keys_1.langKeys["delete"]))))))),
            react_1["default"].createElement(Box_1["default"], { className: classes.containerHeader, justifyContent: "space-between", alignItems: "center", style: { marginBottom: 8, marginTop: 16 } },
                react_1["default"].createElement("span", { className: classes.title },
                    t(keys_1.langKeys.customreports),
                    " (",
                    allReportsToShow.filter(function (x) { return x.reporttype !== "default"; }).length,
                    ")")),
            (reportsResult.mainData.loading || reportsResult.mainAux.loading) ? (react_1["default"].createElement(components_1.SkeletonReportCard, null)) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { className: classes.containerDetails },
                    react_1["default"].createElement(Grid_1["default"], { container: true, spacing: 3 },
                        allReportsToShow.filter(function (x) { return x.reporttype !== "default"; }).filter(function (x) { return !!x.image; }).map(function (report, index) { return (reportSwitch(report, index)); }),
                        allReportsToShow.filter(function (x) { return x.reporttype !== "default"; }).filter(function (x) { return !x.image; }).map(function (report, index) {
                            var _a;
                            return (react_1["default"].createElement(Grid_1["default"], { item: true, key: "report_" + report.reporttemplateid + "_" + index, xs: 12, md: 4, lg: 2, style: { minWidth: 330 } },
                                react_1["default"].createElement(Card_1["default"], { style: { position: 'relative' } },
                                    react_1["default"].createElement(CardActionArea_1["default"], { onClick: function () {
                                            setViewSelected("view-4");
                                            setRowReportSelected({ row: report, edit: true });
                                        } },
                                        react_1["default"].createElement(CardMedia_1["default"], { component: "img", height: "140", className: classes.media, image: 'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/03reportepersonalizado.png', title: report.description }),
                                        react_1["default"].createElement(CardContent_1["default"], null,
                                            react_1["default"].createElement(Typography_1["default"], { gutterBottom: true, variant: "h6", component: "div", style: { fontSize: "130%" } }, report.description))),
                                    !isIncremental &&
                                        react_1["default"].createElement(IconButton_1["default"], { "aria-label": "settings", "aria-describedby": (report === null || report === void 0 ? void 0 : report.reporttemplateid) + "reporttemplate", "aria-haspopup": "true", style: { position: 'absolute', right: 0, top: 0 }, onClick: function (e) {
                                                setRowReportSelected({ row: report, edit: true });
                                                setAnchorEl(e.currentTarget);
                                            }, disabled: !((_a = user === null || user === void 0 ? void 0 : user.roledesc) !== null && _a !== void 0 ? _a : "")
                                                .split(",")
                                                .some(function (v) { return ["ADMINISTRADOR", "SUPERADMIN", "SUPERADMINISTRADOR SOCIOS"].includes(v); })
                                                && (user === null || user === void 0 ? void 0 : user.properties.environment) === "CLARO" },
                                            react_1["default"].createElement(MoreVert_1["default"], null)))));
                        }),
                        react_1["default"].createElement(Menu_1["default"], { anchorEl: anchorEl, getContentAnchorEl: null, anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            }, transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }, open: Boolean(anchorEl), onClose: function () { return setAnchorEl(null); } },
                            react_1["default"].createElement(MenuItem_1["default"], { onClick: function () {
                                    setAnchorEl(null);
                                    setViewSelected("view-3");
                                } }, t(keys_1.langKeys.edit)),
                            react_1["default"].createElement(MenuItem_1["default"], { onClick: function () {
                                    setAnchorEl(null);
                                    setViewSelected("view-5");
                                } }, t(keys_1.langKeys.duplicate)),
                            react_1["default"].createElement(MenuItem_1["default"], { onClick: function () { return handleDelete(rowReportSelected === null || rowReportSelected === void 0 ? void 0 : rowReportSelected.row); } }, t(keys_1.langKeys["delete"])))))))));
    }
    else if (viewSelected === "view-3") {
        return (react_1["default"].createElement(ReportTemplate_1["default"], { data: rowReportSelected, setViewSelected: setViewSelected, fetchData: fetchData }));
    }
    else if (viewSelected === "view-5") { //duplicate
        return (react_1["default"].createElement(ReportTemplate_1["default"], { data: __assign(__assign({}, rowReportSelected), { row: __assign(__assign({}, rowReportSelected === null || rowReportSelected === void 0 ? void 0 : rowReportSelected.row), { reporttemplateid: 0, description: ((_c = rowReportSelected === null || rowReportSelected === void 0 ? void 0 : rowReportSelected.row) === null || _c === void 0 ? void 0 : _c.description) + "-v1" }) }), setViewSelected: setViewSelected, fetchData: fetchData }));
    }
    else if (viewSelected === "view-4") {
        return (react_1["default"].createElement(ReportPersonalized_1["default"], { item: rowReportSelected.row, setViewSelected: setViewSelected }));
    }
    else if (viewSelected === "heatmap") {
        return (react_1["default"].createElement(react_1.Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_heatmap'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(Heatmap_1["default"], null))));
    }
    else if (viewSelected === "recordhsmreport") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_recordhsmreport'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(RecordHSMReport_1["default"], null))));
    }
    else if (viewSelected === "uniquecontactsreport") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_uniquecontactsreport'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(UniqueContactsReport_1["default"], null))));
    }
    else if (viewSelected === "voicecallreport") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_voicecall'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(VoiceChannelReport_1["default"], null))));
    }
    else if (viewSelected === "hsmhistory") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('hsmhistory'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(HSMHistoryReport_1["default"], null))));
    }
    else if (viewSelected === "reportconversationwhatsapp") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t(keys_1.langKeys.conversation_plural) + " Whatsapp", t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(ReportConversationWhatsapp, null))));
    }
    else if (viewSelected === "reportinvoice") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_invoice'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(ReportInvoice_1["default"], null))));
    }
    else if (viewSelected === "kpioperativo") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_kpioperativo'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(ReportKpiOperativo_1["default"], null))));
    }
    else if (viewSelected === "report_ticketvsasesor") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_ticketvsasesor'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(TicketvsAdviser_1["default"], null))));
    }
    else if (viewSelected === "campaign") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_campaign'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(ReportCampaign_1.CampaignReport, { externalUse: true }))));
    }
    else if (viewSelected === "reportcompliancesla") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_reportcompliancesla'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(ReportComplianceSLA_1["default"], null))));
    }
    else if (viewSelected === "reportrequestsd") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_reportrequestsd'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(ReportRequestSD_1["default"], null))));
    }
    else if (viewSelected === "leadgridtracking") {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { style: { width: '100%', display: 'flex', flexDirection: 'column', flex: 1 } },
                react_1["default"].createElement(components_1.TemplateBreadcrumbs, { breadcrumbs: getArrayBread(t('report_leadgridtracking'), t(keys_1.langKeys.report_plural)), handleClick: handleSelectedString }),
                react_1["default"].createElement(ReportLeadGridTracking_1["default"], null))));
    }
    else if (viewSelected === "tipificationreport") {
        return (react_1["default"].createElement(ReportTipification_1["default"], { setViewSelected: setViewSelected, row: rowSelected, setSearchValue: setSearchValue }));
    }
    else if (viewSelected === "productivityhoursreport") {
        return (react_1["default"].createElement(ReportProductivityHours_1["default"], { setViewSelected: setViewSelected, row: rowSelected, setSearchValue: setSearchValue }));
    }
    else {
        return (react_1["default"].createElement(ReportItem, { setViewSelected: setViewSelected, row: rowSelected, multiData: reportsResult.multiData.data, allFilters: rowSelected.filters, customReport: customReport, setSearchValue: setSearchValue }));
    }
};
exports["default"] = Reports;
