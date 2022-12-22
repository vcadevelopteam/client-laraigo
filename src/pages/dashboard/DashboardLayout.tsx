import { FC, useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Box, Button, Card, CircularProgress, IconButton, makeStyles, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { Clear as ClearIcon, MoreVert as MoreVertIcon, Search as SearchIcon } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { deleteDashboardTemplate, getDashboard, getDashboardTemplate, resetDeleteDashboardTemplate, resetGetDashboard, resetGetDashboardTemplate, resetSaveDashboardTemplate } from "store/dashboard/actions";
import { useSelector } from "hooks";
import { DateRangePicker, DialogZyx, TemplateBreadcrumbs } from "components";
import { useHistory, useRouteMatch } from "react-router";
import paths from "common/constants/paths";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { manageConfirmation, showSnackbar } from "store/popus/actions";
import { getDashboardTemplateIns, getDashboardTemplateSel, getReportTemplateSel } from "common/helpers";
import RGL, { WidthProvider } from 'react-grid-layout';
import { XAxis, YAxis, ResponsiveContainer, Tooltip as ChartTooltip, BarChart, Legend, Bar, PieChart, Pie, Cell, ResponsiveContainerProps, LineChart, Line, CartesianGrid, LabelList, FunnelChart, Funnel } from 'recharts';
import { LayoutItem as NewLayoutItem, ReportTemplate } from './DashboardAdd';
import { useForm } from "react-hook-form";
import { getCollection, getCollectionDynamic, resetMain, resetMainDynamic } from "store/main/actions";
import { Range } from "react-date-range";
import { CalendarIcon } from "icons";
import TableZyx from "components/fields/table-simple";
import GaugeChart from "react-gauge-chart";
import clsx from 'clsx';
import { RenderCustomizedLabel } from "components/fields/Graphic";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';

const ReactGridLayout = WidthProvider(RGL);

interface Item {
    description: string;
    contentType: string;
    kpiid: number;
    reporttemplateid: number;
    grouping: string;
    graph: string;
    column: string;
}

interface Items {
    [key: string]: Item;
}

const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"]
const monthColor = ["#0000ff", "#ff0000", "#ffff00", "#ff0080", "#00aae4", "#00ffff", "#76bd17", "#ff00ff", "#4c2882", "#804000", "#008f39", "#ff8000"]

const colors = ["#8884d8", "#82ca9d", "#d32248", "#1dc1fa", "#2b5ef4", "#7be2aa", "#c58725", "#692f32", "#8f97b8", "#57be99"]

const useDashboardLayoutStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
    },
    layout: {
        backgroundColor: 'inherit',
        width: '100%',
    },
    filtersContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: theme.spacing(1),
        gap: theme.spacing(1),
    },
    styleicon: {
        width: "22px",
        height: "22px",
        '&:hover': {
            cursor: 'pointer',
        }
    },
    downloadiconcontainer: {
        width: "100%", display: "flex", justifyContent: "end"
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
    },
}));

const format = (date: Date) => new Date(date.setHours(10)).toISOString().split('T')[0];

const DashboardLayout: FC = () => {
    const classes = useDashboardLayoutStyles();
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch<{ id: string }>();
    const dispatch = useDispatch();
    const dashboard = useSelector(state => state.dashboard.dashboard);
    const dashboardtemplate = useSelector(state => state.dashboard.dashboardtemplate);
    const dashboardSave = useSelector(state => state.dashboard.dashboardtemplateSave);
    const dashboardtemplateDelete = useSelector(state => state.dashboard.dashboardtemplateDelete);
    const reportTemplates = useSelector(state => state.main.mainData);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [layout, setLayout] = useState<{ layout: RGL.Layout[], detail: Items }>({ layout: [], detail: {} });
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: 'selection',
    });
    const tempDaterange = useRef<Range | null>(null);
    const mustLoadagain = useRef(false);

    const { register, unregister, formState: { errors }, getValues, setValue, reset } = useForm<Items>();

    useEffect(() => {
        dispatch(getDashboardTemplate(getDashboardTemplateSel(match.params.id)));
        dispatch(getCollection(getReportTemplateSel()));

        return () => {
            dispatch(resetMain());
            dispatch(resetMainDynamic()); // TableModal
            dispatch(resetGetDashboard());
            dispatch(resetGetDashboardTemplate());
            dispatch(resetSaveDashboardTemplate());
            dispatch(resetDeleteDashboardTemplate());
        };
    }, [match.params.id, dispatch]);

    useEffect(() => {
        dispatch(getDashboard({
            dashboardtemplateid: match.params.id,
            startdate: format(dateRange.startDate!),
            enddate: format(dateRange.endDate!),
            offset: (new Date().getTimezoneOffset() / 60) * -1,
        }));
    }, [dateRange, match.params.id, dispatch]);

    useEffect(() => {
        if (dashboardtemplate.loading) return;
        if (dashboardtemplate.error) {
            const error = t(dashboardtemplate.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
        } else if (dashboardtemplate.value) {
            setLayout({
                layout: JSON.parse(dashboardtemplate.value.layoutjson),
                detail: JSON.parse(dashboardtemplate.value.detailjson),
            });
        }
    }, [dashboardtemplate, t, dispatch]);

    useEffect(() => {
        if (dashboard.loading) return;
        if (dashboard.error) {
            const error = t(dashboard.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
        }
    }, [dashboard, t, dispatch]);

    useEffect(() => {
        if (dashboardSave.loading) return;
        if (dashboardSave.error) {
            const error = t(dashboardSave.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
        } else if (dashboardSave.success === true) {
            dispatch(showSnackbar({
                message: "Se guardó el dashboard",
                severity: "success",
                show: true,
            }));
            if (mustLoadagain.current) {
                mustLoadagain.current = false;

                dispatch(getDashboardTemplate(getDashboardTemplateSel(match.params.id)));
                setDateRange(prev => ({ ...prev })); // run getDashboard effect again
                reset();
            }
        }
    }, [dashboardSave, match.params.id, reset, t, dispatch]);

    useEffect(() => {
        if (dashboardtemplateDelete.loading) return;
        if (dashboardtemplateDelete.error) {
            const error = t(dashboardtemplateDelete.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
        } else if (dashboardtemplateDelete.success) {
            dispatch(showSnackbar({
                message: "Se eliminó el dashboard",
                severity: "success",
                show: true,
            }));
            history.push(paths.DASHBOARD);
        }
    }, [dashboardtemplateDelete, history, t, dispatch]);

    useEffect(() => {
        if (reportTemplates.loading) return;
        if (reportTemplates.error) {
            const error = t(reportTemplates.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
        }
    }, [reportTemplates, t, dispatch]);

    const onDelete = useCallback(() => {
        if (!dashboardtemplate.value) return;

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback: () => {
                dispatch(deleteDashboardTemplate(getDashboardTemplateIns({
                    ...dashboardtemplate.value!,
                    id: match.params.id,
                    status: 'ELIMINADO',
                    operation: 'DELETE',
                })));
            },
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dashboardtemplate, match.params.id, dispatch]);

    // const onSave = useCallback(() => {
    //     if (!dashboardtemplate.value) return;

    //     handleSubmit(data => {
    //         const detail = layout.detail;
    //         for(const key in data) {
    //             detail[key] = data[key];
    //         }

    //         mustLoadagain.current = Object.keys(data).length > 0;

    //         dispatch(saveDashboardTemplate(getDashboardTemplateIns({
    //             ...dashboardtemplate.value!,
    //             id: match.params.id,
    //             operation: 'UPDATE',
    //             detailjson: JSON.stringify(detail),
    //             layoutjson: JSON.stringify(layout.layout),
    //         })));
    //     }, e => {})();
    // }, [dashboardtemplate, layout, handleSubmit, match.params.id, dispatch]);

    const onDetailChange = useCallback((detail: Items, type: ChangeType, key: string) => {
        setLayout(prev => {
            const newLayout = type === "DELETE" ? prev.layout.filter(x => x.i !== key) : prev.layout;
            return { layout: newLayout, detail: detail };
        });
    }, []);

    // const addItemOnClick = useCallback(() => {
    //     const newKey = Date.now().toString();
    //     setLayout(prev => ({
    //         ...prev,
    //         layout: [
    //             ...prev.layout,
    //             {
    //                 i: newKey,
    //                 x: (prev.layout.length * 3) % 12,
    //                 y: Infinity,
    //                 w: 3,
    //                 h: 2,
    //                 minW: 2,
    //                 minH: 1,
    //                 static: false,
    //             },
    //         ],
    //     }));
    // }, []);

    const deleteItemOnClick = useCallback((key: string) => {
        setLayout(prev => {
            return {
                ...prev,
                layout: prev.layout.filter(e => e.i !== key),
            };
        });
    }, []);

    const getChartTitle = (key: string) => {
        return layout.detail?.[key]?.description || dashboard.value?.[key]?.reportname || '-';
    }

    if (dashboardtemplate.loading || dashboard.loading) {
        return <CenterLoading />;
    }

    if (dashboardtemplate.error || dashboard.error || !dashboardtemplate.value || !dashboard.value) {
        return (
            <Box className={classes.root}>
                <TemplateBreadcrumbs
                    breadcrumbs={[
                        { id: "view-1", name: "Dashboards" },
                        { id: "view-2", name: t(langKeys.detail_custom_dashboard) }
                    ]}
                    handleClick={id => id === "view-1" && history.push(paths.DASHBOARD)}
                />
                <div>ERROR</div>
            </Box>
        );
    }

    const { description } = dashboardtemplate.value!;
    return (
        <Box className={classes.root}>
            <TemplateBreadcrumbs
                breadcrumbs={[
                    { id: "view-1", name: "Dashboards" },
                    { id: "view-2", name: description }
                ]}
                handleClick={id => id === "view-1" && history.push(paths.DASHBOARD)}
            />
            <div style={{ height: '1em' }} />
            <div className={classes.filtersContainer}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <DateRangePicker
                        open={openDatePicker}
                        setOpen={setOpenDatePicker}
                        range={dateRange}
                        onSelect={v => tempDaterange.current = v}
                        disabled={dashboardSave.loading || dashboardtemplate.loading || !dashboardtemplate.value}
                    >
                        <Button
                            style={{ border: '1px solid #bfbfc0', borderRadius: 4, color: 'rgb(143, 146, 161)' }}
                            startIcon={<CalendarIcon />}
                            onClick={() => setOpenDatePicker(prev => !prev)}
                        >
                            {format(dateRange.startDate!) + " - " + format(dateRange.endDate!)}
                        </Button>
                    </DateRangePicker>
                    <Button
                        disabled={dashboardSave.loading || dashboardtemplate.loading || !dashboardtemplate.value}
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                        style={{ backgroundColor: '#55BD84', width: 120 }}
                        onClick={() => {
                            if (tempDaterange.current) {
                                setDateRange({ ...tempDaterange.current });
                            }
                        }}
                    >
                        <Trans i18nKey={langKeys.search} />
                    </Button>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => history.push(paths.DASHBOARD)}
                    >
                        <Trans i18nKey={langKeys.back} />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon color="secondary" />}
                        onClick={() => {
                            if (!dashboardtemplate.value) return;
                            const id = dashboardtemplate.value!.dashboardtemplateid;
                            history.push(paths.DASHBOARD_EDIT.resolve(id));
                        }}
                        disabled={dashboardSave.loading || dashboardtemplate.loading || !dashboardtemplate.value}
                    >
                        <Trans i18nKey={langKeys.edit} />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DeleteIcon color="secondary" />}
                        onClick={onDelete}
                        disabled={dashboardSave.loading || dashboardtemplate.loading || !dashboardtemplate.value}
                    >
                        <Trans i18nKey={langKeys.delete} />
                    </Button>
                </div>
            </div>
            <div style={{ height: '0.5em' }} />
            <ReactGridLayout
                className={classes.layout}
                layout={layout.layout}
                onLayoutChange={(l) => setLayout(prev => ({ ...prev, layout: l }))}
                cols={12}
                rowHeight={140}
                isDraggable={false}
                isResizable={false}
            // isDraggable={canLayoutChange && !dashboardtemplate.loading && !dashboard.loading}
            // isResizable={canLayoutChange && !dashboardtemplate.loading && !dashboard.loading}
            >
                {layout.layout.map(e => {
                    return (
                        <div key={e.i}>
                            {e.i in layout.detail ? (
                                <LayoutItem
                                    layoutKey={e.i}
                                    title={getChartTitle(e.i)}
                                    data={dashboard.value?.[e.i]?.data}
                                    alldata={dashboard.value?.[e.i]}
                                    columns={dashboard.value?.[e.i]?.columns}
                                    dataorigin={dashboard.value?.[e.i]?.dataorigin}
                                    type={dashboard.value?.[e.i]?.contentType === 'report' ? layout.detail[e.i]!.graph : (dashboard.value?.[e.i]?.contentType === 'funnel' ? "funnel" : 'kpi')}
                                    groupment={layout.detail[e.i]?.grouping}
                                    detail={layout.detail}
                                    onDetailChange={(d, t) => onDetailChange(d, t, e.i)}
                                    dateRange={dateRange}
                                    onModalOpenhasChanged={v => { }}
                                    error={dashboard.value?.[e.i]?.error}
                                    errorcode={dashboard.value?.[e.i]?.errorcode}
                                />
                            ) : (
                                <NewLayoutItem
                                    layoutKey={e.i}
                                    edit={false}
                                    templates={reportTemplates.data as ReportTemplate[]}
                                    kpis={[]}
                                    tags={[]}
                                    loading={reportTemplates.loading}
                                    register={register}
                                    unregister={unregister}
                                    getValues={getValues}
                                    setValue={setValue}
                                    errors={errors}
                                    onDelete={() => deleteItemOnClick(e.i)}
                                />
                            )}
                        </div>
                    )
                })}
            </ReactGridLayout>
        </Box>
    );
}

interface ItemsData {
    [label: string]: number;
}

interface KpiData {
    target: number;
    cautionat: number;
    alertat: number;
    currentvalue: number;
}

interface ChartData {
    label: string;
    quantity: number;
}

type ChangeType = "DELETE" | "UPDATE" | "INSERT";

interface LayoutItemProps {
    title: string;
    data?: ItemsData | KpiData;
    type: string;
    layoutKey: string;
    detail?: Items;
    columns?: Column[];
    dateRange: Range;
    dataorigin?: string;
    groupment?: string;
    error?: boolean;
    alldata?: any;
    errorcode?: string; // REPORT_NOT_FOUND | COLUMN_NOT_FOUND
    onDetailChange?: (detail: Items, type: ChangeType) => void;
    onModalOpenhasChanged: (open: boolean) => void;
}

interface Column {
    tablename: string;
    /**accessor */
    columnname: string;
    description: string;
    type: string;
    join_table: any;
    join_alias: any;
    join_on: any;
    disabled: boolean;
    /**Header */
    alias: string;
}

const useLayoutItemStyles = makeStyles(theme => ({
    rootLoading: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'inherit',
        width: 'inherit',
        backgroundColor: 'white',
        padding: theme.spacing(1),
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(1),
        alignItems: 'center',
        paddingBottom: '1em',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    reponsiveContainer: {
        width: '100%',
        overflow: 'hidden',
        flexGrow: 1,
    },
    errorText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        padding: '1em',
    },
}));

const LayoutItem: FC<LayoutItemProps> = ({
    title,
    data,
    type,
    layoutKey: key,
    detail,
    columns,
    dateRange,
    dataorigin,
    groupment,
    error,
    errorcode,
    alldata,
    onDetailChange,
    onModalOpenhasChanged,
}) => {
    const classes = useLayoutItemStyles();
    const { t } = useTranslation();
    const dataGraph = useMemo<any>(() => {
        if (error === true || !data) return [];
        if (type === "funnel") {
            return data;
        }
        if (type !== 'kpi') {
            return Object.keys(data as ItemsData).map(e => ({
                label: e,
                quantity: (data as ItemsData)[e],
            }));
        } else {
            return data as KpiData;
        }
    }, [data, type, error]);
    // const [graph, setGraph] = useState(type);
    const [openTableModal, setOpenTableModal] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // const onChange = useCallback(() => {
    //     if (!canChange) return;

    //     const newType = graph === 'bar' ? 'pie' : 'bar';
    //     setGraph(newType);
    //     onDetailChange!({
    //         ...detail,
    //         [key]: {
    //             ...detail![key],
    //             graph: newType,
    //         },
    //     }, "UPDATE");
    // }, [graph, canChange, key, detail, onDetailChange]);

    const formatTooltip = (v: any, tot?: any) => {
        if (groupment === "percentage") {
            return `${t(langKeys.percentage)}: ${v.toFixed(2)}%`;
        }

        return `${t(langKeys.quantity)}: ${v}\n${t(langKeys.percentage)}: ${(v * 100 / tot).toFixed(2)}%`;
    }

    const renderGraph = useCallback(() => {
        switch (type) {
            case 'bar':
                return (
                    <LayoutBar
                        data={dataGraph as ChartData[]}
                        tickFormatter={groupment === "percentage" ? v => `${Number(v).toFixed(2)}%` : undefined}
                        tooltipFormatter={formatTooltip}
                        alldata={alldata}
                        grouping={groupment}
                    />
                );
            case 'pie':
                return (
                    <LayoutPie
                        data={dataGraph as ChartData[]}
                        tooltipFormatter={formatTooltip}
                        tickFormatter={groupment === "percentage" ? v => `${Number(v).toFixed(2)}%` : undefined}
                        alldata={alldata}
                    />
                );
            case 'line':
                return (
                    <LayoutLine
                        data={dataGraph as ChartData[]}
                        tickFormatter={groupment === "percentage" ? v => `${Number(v).toFixed(2)}%` : undefined}
                        tooltipFormatter={formatTooltip}
                        alldata={alldata}
                        grouping={groupment}
                    />
                );
            case 'kpi': return <LayoutKpi data={dataGraph as KpiData} />;
            case 'funnel': return <LayoutFunnel
                data={dataGraph}
                title={title}
            />
            default: return null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataGraph, groupment, type]);

    if (error === true && errorcode === "REPORT_NOT_FOUND") {
        return (
            <div className={clsx(classes.rootLoading, classes.errorText)}>
                <Trans i18nKey={langKeys.chart_dashboard_report_error} />
            </div>
        );
    } else if (error === true && errorcode === "COLUMN_NOT_FOUND") {
        return (
            <div className={clsx(classes.rootLoading, classes.errorText)}>
                <Trans i18nKey={langKeys.chart_dashboard_column_error} />
            </div>
        );
    } else if (error === true) {
        return (
            <div className={clsx(classes.rootLoading, classes.errorText)}>
                <Trans i18nKey={langKeys.chart_dashboard_unexpected_error} />
            </div>
        );
    }

    if (!data) {
        return (
            <div className={classes.rootLoading}>
                <CenterLoading />
            </div>
        );
    }

    return (
        <div className={classes.root}>
            {type !== 'funnel' &&

                <div className={classes.header}>
                    <span className={classes.label}>{title}</span>
                    <div style={{ flexGrow: 1 }} />
                    {/* <Tooltip title="Intercambiar">
                    <IconButton onClick={onChange} size="small">
                        <SwapHorizIcon />
                    </IconButton>
                </Tooltip> */}
                    {(type !== 'kpi' && columns && dataorigin) && (
                        <>
                            <Tooltip title={<Trans i18nKey={langKeys.moreOptions} />}>
                                <IconButton
                                    id={`more-btn-${key}`}
                                    onClick={handleClick}
                                    size="small"
                                    aria-controls={`more-menu-${key}`}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id={`more-menu-${key}`}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': `more-btn-${key}`,
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        setOpenTableModal(true);
                                        onModalOpenhasChanged(true);
                                        handleClose();
                                    }}
                                >
                                    <Trans i18nKey={langKeys.seeMore} />
                                </MenuItem>
                                {/* <MenuItem onClick={onDelete}>
                                <Trans i18nKey={langKeys.delete} />
                            </MenuItem> */}
                            </Menu>
                        </>
                    )}
                </div>}
            <div className={classes.reponsiveContainer}>
                {renderGraph()}
            </div>
            {(type !== 'kpi' && type !== "funnel") && (
                <TableModal
                    title={title}
                    open={openTableModal}
                    onClose={() => {
                        setOpenTableModal(false);
                        onModalOpenhasChanged(false);
                    }}
                    rawColumns={columns!}
                    dataorigin={dataorigin!}
                    dateRange={dateRange}
                />
            )}
        </div>
    );
}

interface IData {
    label: string;
    quantity: number | Object;
}

interface LayoutBarProps extends Omit<ResponsiveContainerProps, 'children'> {
    data: IData[];
    tickFormatter?: (value: string, index: number) => string;
    tooltipFormatter?: (value: any, tot?: any) => string;
    alldata?: any;
    grouping?: string;
}

const LayoutBar: FC<LayoutBarProps> = ({ data, alldata, tickFormatter, tooltipFormatter, grouping, ...props }) => {
    const { t } = useTranslation();
    let total = alldata?.total;
    let modifieddata = data;
    let keys: any[] = []
    let reversed = false
    if (alldata?.interval) {
        reversed = true
        modifieddata = data.map(x => {
            const localkeys = Object.keys(x.quantity)
            localkeys.forEach((y) => {
                if (!keys.includes(y)) {
                    keys.push(y)
                }
            })
            if (alldata?.interval === "month") {
                return ({ ...Object(x.quantity), label: t("full" + months[Number(x.label.split("-")[1]) - 1]) + " " + x.label.split("-")[0].replace("month", ``) })
            } else {
                return ({ ...Object(x.quantity), label: `${t(alldata?.interval)} ${x.label.replace(alldata?.interval, "")}` })
            }
        })
    } else {
        let listlabels = data.map(x => x.label)[0]
        if (!!listlabels) {
            if (listlabels.includes("-")) {
                reversed = true
                modifieddata = data.map(x => {
                    let newlabel = x.label.replace("day", "")
                    let month = newlabel.slice(0, newlabel.indexOf("-"))
                    newlabel = newlabel.replace(`${month}-`, `${t(months[Number(month) - 1])} `)
                    return ({ ...x, label: newlabel, color: monthColor[Number(month) - 1] })
                })
            }
            if (listlabels.includes("week")) {
                reversed = true
                modifieddata = data.map(x => ({ ...x, label: x.label.replace("month", `${t("month")} `).replace("week", `${t("week")} `) }))
            }
            if (listlabels.includes("month")) {
                reversed = true
                modifieddata = data.map(x => ({ ...x, label: t("full" + months[Number(x.label.split("-")[1]) - 1]) + " " + x.label.split("-")[0].replace("month", ``) }))
            }

        }

    }

    return (
        <ResponsiveContainer width={"100%"} {...props}>
            <BarChart data={modifieddata} margin={{ top: 20, right: 10, bottom: 5, left: 10 }}>
                <XAxis
                    reversed={reversed}
                    dataKey="label"
                    style={{ fontSize: '0.8em' }}
                    angle={-45}
                    interval={0}
                    textAnchor="end"
                    height={160}
                    dy={5}
                    dx={-5}
                    domain={["", ""]}
                />
                <YAxis tickFormatter={tickFormatter} padding={{ top: 10 }} />
                {alldata?.interval ? (
                    <>

                        <ChartTooltip content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                let partialtotal = payload.reduce((acc, x) => acc + Number(x.value), 0);
                                return (
                                    <Card key={`${label}-${payload[0].value}`} style={{ padding: '0.85em' }}>
                                        {label && <label>{label}</label>}
                                        {label && <br />}
                                        {payload.map((x: any) => {
                                            let value = x.payload[x?.dataKey]
                                            if (grouping === "percentage") {
                                                if (value) {
                                                    return (
                                                        <>
                                                            <span key={`${label}-${x.dataKey}-${value}`} style={{ color: x.color, whiteSpace: "break-spaces" }}>
                                                                {`${x.dataKey}: ${value}%`}
                                                            </span>
                                                            <br />
                                                        </>
                                                    )
                                                }
                                            } else {
                                                if (value) {
                                                    return (
                                                        <>
                                                            <span key={`${label}-${x.dataKey}-${value}`} style={{ color: x.color, whiteSpace: "break-spaces" }}>
                                                                {`${x.dataKey}: ${value} / ${(value * 100 / partialtotal).toFixed(2)}%`}
                                                            </span>
                                                            <br />
                                                        </>
                                                    )
                                                }
                                            }
                                            return null
                                        })}
                                        {grouping !== "percentage" &&
                                            <>
                                                <span style={{ whiteSpace: "break-spaces" }}>
                                                    {`${t(langKeys.percentage)}: ${(partialtotal * 100 / total).toFixed(2)}%`}
                                                </span>
                                                <br />
                                            </>
                                        }
                                    </Card>
                                );
                            }

                            return null;
                        }}
                        />
                        {keys.map((x, i) => (
                            <Bar
                                isAnimationActive={false}
                                dataKey={x}
                                fill={colors[i]}
                                textAnchor="end"
                                key={x}
                                type="monotone"
                            >
                                <LabelList dataKey={x} position="top" fill="#000" />
                            </Bar>
                        ))}
                    </>
                ) :

                    (
                        <>
                            <ChartTooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const { value } = payload[0];
                                        return (
                                            <Card key={`${label}-${value}`} style={{ padding: '0.85em' }}>
                                                {label && <label>{label}</label>}
                                                {label && <br />}
                                                <span style={{ color: "#8884d8", whiteSpace: "break-spaces" }}>
                                                    {
                                                        tooltipFormatter?.(value, total) ||
                                                        `quantity: ${value}`
                                                    }
                                                </span>
                                            </Card>
                                        );
                                    }

                                    return null;
                                }}
                            />
                            <Bar
                                isAnimationActive={false}
                                dataKey="quantity"
                                fill="#8884d8"
                                textAnchor="end"
                                type="monotone"
                            >
                                {modifieddata.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry?.color || "#8884d8"} />
                                ))}
                                <LabelList dataKey="quantity" position="top" fill="#000" />
                            </Bar>
                        </>
                    )
                }
            </BarChart>
        </ResponsiveContainer>
    );
}

interface LayoutLineProps extends Omit<ResponsiveContainerProps, 'children'> {
    data: IData[];
    tickFormatter?: (value: string, index: number) => string;
    tooltipFormatter?: (value: any, total?: any) => string;
    alldata?: any;
    grouping?: string
}

const LayoutLine: FC<LayoutLineProps> = ({ data, alldata, tickFormatter, tooltipFormatter, grouping, ...props }) => {
    const { t } = useTranslation();
    let total = alldata?.total;
    let modifieddata = data;
    let keys: any[] = []
    let reversed = false
    if (alldata?.interval) {
        reversed = true
        data.forEach(x => {
            const localkeys = Object.keys(x.quantity)
            localkeys.forEach((y: string) => {
                if (!keys.includes(y)) {
                    keys.push(y)
                }
            })
        })
        let itemmodel = keys.reduce((acc, x) => { return { ...acc, [x]: 0 } }, {})
        if (alldata?.interval === "month") {

            modifieddata = data.map(x => {

                return ({ ...itemmodel, ...Object(x.quantity), label: t("full" + months[Number(x.label.split("-")[1]) - 1]) + " " + x.label.split("-")[0].replace("month", ``) })
            })
        } else {
            modifieddata = data.map(x => {

                return ({ ...itemmodel, ...Object(x.quantity), label: `${t(alldata?.interval)} ${x.label.replace(alldata?.interval, "")}` })
            })
        }
    } else {
        let listlabels = data.map(x => x.label)[0]
        if (!!listlabels) {
            if (listlabels.includes("-")) {
                reversed = true
                modifieddata = data.map(x => {
                    let newlabel = x.label.replace("day", "")
                    let month = newlabel.slice(0, newlabel.indexOf("-"))
                    newlabel = newlabel.replace(`${month}-`, `${t(months[Number(month) - 1])} `)
                    return ({ ...x, label: newlabel, color: monthColor[Number(month) - 1] })
                })
            }
            if (listlabels.includes("week")) {
                reversed = true
                modifieddata = data.map(x => ({ ...x, label: x.label.replace("week", `${t("week")} `) }))
            }
            if (listlabels.includes("month")) {
                reversed = true
                modifieddata = data.map(x => ({ ...x, label: t("full" + months[Number(x.label.split("-")[1]) - 1]) + " " + x.label.split("-")[0].replace("month", ``) }))
            }
        }
    }
    return (
        <ResponsiveContainer {...props}>
            <LineChart data={modifieddata} margin={{ top: 20, right: 10, bottom: 5, left: 10 }}>
                <CartesianGrid stroke="#ccc" />
                <XAxis
                    domain={["", ""]}
                    reversed={reversed}
                    dataKey="label"
                    style={{ fontSize: '0.8em' }}
                    angle={-45}
                    interval={0}
                    textAnchor="end"
                    height={160}
                    dy={5}
                    dx={-5}
                />
                <YAxis tickFormatter={tickFormatter} />

                {alldata?.interval ? (
                    <>
                        <ChartTooltip content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                let partialtotal = payload.reduce((acc, x) => acc + Number(x.value), 0);
                                return (
                                    <Card key={`${label}-${payload[0].value}`} style={{ padding: '0.85em' }}>
                                        {label && <label>{label}</label>}
                                        {label && <br />}
                                        {payload.map((x: any) => {
                                            let value = x.payload[x?.dataKey]
                                            if (grouping === "percentage") {
                                                if (value) {
                                                    return (
                                                        <>
                                                            <span key={`${label}-${x.dataKey}-${value}`} style={{ color: x.color, whiteSpace: "break-spaces" }}>
                                                                {`${x.dataKey}: ${value}%`}
                                                            </span>
                                                            <br />
                                                        </>
                                                    )
                                                }
                                            } else {
                                                if (value) {
                                                    return (
                                                        <>
                                                            <span key={`${label}-${x.dataKey}-${value}`} style={{ color: x.color, whiteSpace: "break-spaces" }}>
                                                                {`${x.dataKey}: ${value} / ${(value * 100 / partialtotal).toFixed(2)}%`}
                                                            </span>
                                                            <br />
                                                        </>
                                                    )
                                                }
                                            }
                                            return null
                                        })}
                                        {grouping !== "percentage" &&
                                            <>
                                                <span style={{ whiteSpace: "break-spaces" }}>
                                                    {`${t(langKeys.percentage)}: ${(partialtotal * 100 / total).toFixed(2)}%`}
                                                </span>
                                                <br />
                                            </>
                                        }
                                    </Card>
                                );
                            }

                            return null;
                        }}
                        />
                        {keys.map((x, i) => (
                            <Line type="monotone" dataKey={x} key={x} stroke={colors[i]} >
                                <LabelList dataKey={x} position="top" fill="#000" />
                            </Line>
                        ))}
                    </>
                ) :

                    (
                        <>
                            <ChartTooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const { value } = payload[0];
                                        return (
                                            <Card key={`${label}-${value}`} style={{ padding: '0.85em' }}>
                                                {label && <label>{label}</label>}
                                                {label && <br />}
                                                <span style={{ color: "#8884d8", whiteSpace: "break-spaces" }}>
                                                    {
                                                        tooltipFormatter?.(value, total) ||
                                                        `quantity: ${value}`
                                                    }
                                                </span>
                                            </Card>
                                        );
                                    }

                                    return null;
                                }}
                            />
                            <Line isAnimationActive={false} type="monotone" dataKey="quantity" stroke="#8884d8">

                                {modifieddata.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} stroke={entry?.color || "#8884d8"} />
                                ))}
                                <LabelList dataKey="quantity" position="top" fill="#000" />
                            </Line>
                        </>
                    )
                }
            </LineChart>
        </ResponsiveContainer>
    );
}

interface LayoutPieProps extends Omit<ResponsiveContainerProps, 'children'> {
    data: IData[];
    tickFormatter?: (value: string, index: number) => string;
    tooltipFormatter?: (value: any, total?: any) => string;
    alldata?: any;
}

const PIE_COLORS = ['#22b66e', '#b41a1a', '#ffcd56', '#D32F2F', '#FBC02D', '#757575', '#00BCD4', '#AFB42B', '#8BC34A', '#5D4037', '#607D8B', '#03A9F4', '#303F9F', '#009688', '#388E3C', '#E64A19', '#212121'];

interface LayoutFunnelProps {
    data: any;
    title: string;
}

const LayoutFunnel: FC<LayoutFunnelProps> = ({ data, title, ...props }) => {
    let truedata = data.map((e: any, i: number) => ({ name: e.title, value: e.quantity, fill: PIE_COLORS[i] }))
    let dataFunnel = data.map((e: any, i: number) => ({ name: e.title, value: data.length - i, fill: PIE_COLORS[i] }))
    let total = truedata[0].value
    const classes = useDashboardLayoutStyles();
    function exportexcel() {
        import('xlsx').then(XLSX => {
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const fileExtension = '.xlsx';
            let dataexport = truedata.map((e: any, i: number) => ({ Nombre: e.name, Cantidad: e.value, "% Representativo": ((e.value / total) * 100).toFixed(0) }))
            const ws = XLSX.utils.json_to_sheet(dataexport);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, title + fileExtension);
        });
    }
    return (
        <>
            <div className={classes.header}>
                <span className={classes.label}>{title}</span>
                <div style={{ flexGrow: 1 }} />

                {total !== 0 && <CloudDownloadIcon onClick={exportexcel} className={classes.styleicon} />}
            </div>
            <ResponsiveContainer {...props}>
                <FunnelChart margin={{ top: 10, right: (6 + Math.max(...truedata.map((x: any) => x.value))?.toString().length) * 5, bottom: 5, left: 10 }}>
                    <ChartTooltip
                        formatter={(value: any, name: any, props: any) => {
                            return [`${truedata[truedata.length - parseInt(String(props?.value))]?.value} - ${total !== 0 ? ((Number(truedata[truedata.length - parseInt(String(props?.value))]?.value) / total) * 100).toFixed(1) : 100}%`, name]
                        }}
                    />
                    <Funnel
                        isAnimationActive={false}
                        dataKey="value"
                        data={dataFunnel}
                    >
                        <LabelList position="right" fill="#000" stroke="none" dataKey="name"
                            content={(props2: any) => {
                                const { y, height } = props2;
                                const { x, width } = props2.parentViewBox;
                                if (Number(dataFunnel[props2.index].value) !== 0) {
                                    return <g>
                                        <text x={x + width - (6 + truedata[props2.index].value?.toString().length) * 5} y={y + height / 2}>
                                            {truedata[props2.index].value} - {total !== 0 ? ((Number(truedata[props2.index].value) / total) * 100).toFixed(1) : 100}%
                                        </text>
                                    </g>
                                } else {
                                    return <g></g>
                                }
                            }}
                        />
                        <LabelList position="right" fill="#000" stroke="none" dataKey="name"
                            content={(props2: any) => {
                                const { value, y, height } = props2;
                                const { x, width } = props2.parentViewBox;
                                if (Number(dataFunnel[props2.index].value) !== 0) {
                                    return <g>
                                        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle">
                                            {value}
                                        </text>
                                    </g>
                                } else {
                                    return <g></g>
                                }
                            }}
                        />
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>
        </>
    );
}
const LayoutPie: FC<LayoutPieProps> = ({ data, alldata, tooltipFormatter, tickFormatter, ...props }) => {
    let total = alldata?.total;
    return (
        <ResponsiveContainer {...props}>
            <PieChart>
                <ChartTooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const { name: label, value } = payload[0];
                            return (
                                <Card key={`${label}-${value}`} style={{ padding: '0.85em' }}>
                                    {label && <label>{label}</label>}
                                    {label && <br />}
                                    <span style={{ color: "#8884d8", whiteSpace: "break-spaces" }}>
                                        {
                                            tooltipFormatter?.(value, total) ||
                                            `quantity: ${value}`
                                        }
                                    </span>
                                </Card>
                            );
                        }

                        return null;
                    }}
                />
                <Pie
                    data={data}
                    dataKey="quantity"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    fill="#8884d8"
                    labelLine={false}
                    label={RenderCustomizedLabel}
                >
                    {data.map((_, i) => (
                        <Cell
                            key={`cell-${i}`}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                    ))}
                </Pie>
                {/* <Legend layout="vertical" verticalAlign="top" align="right" /> */}
                <Legend verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
    );
}
interface LayoutKpiProps {
    data: KpiData;
}

const LayoutKpi: FC<LayoutKpiProps> = ({ data }) => {
    const gaugeArcs = useMemo(() => {
        if (data.target <= data.alertat) {
            return [
                data.cautionat / (Math.max(data?.currentvalue, Math.ceil(data.alertat * 1.2 / 10) * 10)),
                (data.alertat - data.cautionat) / (Math.max(data?.currentvalue, Math.ceil(data.alertat * 1.2 / 10) * 10)),
                ((Math.max(data?.currentvalue, Math.ceil(data.alertat * 1.2 / 10) * 10)) - data.alertat) / (Math.max(data?.currentvalue, Math.ceil(data.alertat * 1.2 / 10) * 10))
            ]
        } else {
            return [
                data.alertat / (Math.max(data?.currentvalue, Math.ceil(data.target * 1.2 / 10) * 10)),
                (data.cautionat - data.alertat) / (Math.max(data?.currentvalue, Math.ceil(data.target * 1.2 / 10) * 10)),
                ((Math.max(data?.currentvalue, Math.ceil(data.target * 1.2 / 10) * 10)) - data.cautionat) / (Math.max(data?.currentvalue, Math.ceil(data.target * 1.2 / 10) * 10))
            ];
        }
    }, [data]);

    const percent = useMemo(() => {
        return data.target < data.alertat
            ? data?.currentvalue / (Math.max(data?.currentvalue, Math.ceil(data.alertat * 1.2 / 10) * 10))
            : data?.currentvalue / (Math.max(data?.currentvalue, Math.ceil(data.target * 1.2 / 10) * 10));
    }, [data]);

    const colors = useMemo(() => {
        return data.target < data.alertat
            ? ['#5BE12C', '#F5CD19', '#EA4228']
            : ['#EA4228', '#F5CD19', '#5BE12C'];
    }, [data]);

    const inverted = data.target < data.alertat;
    return (
        <ResponsiveContainer>
            <div style={{ height: 'inherit', width: 'inherit' }}>
                <GaugeChart
                    arcsLength={gaugeArcs}
                    colors={colors}
                    textColor="black"
                    animate={false}
                    percent={percent}
                    needleColor="grey"
                    formatTextValue={() => `${data?.currentvalue}`}
                />
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 10, backgroundColor: colors[0], marginRight: 4 }} />
                        <span>{inverted ? data.target : data.alertat}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 10, backgroundColor: colors[1], marginRight: 4 }} />
                        <span>{data.cautionat}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 10, backgroundColor: colors[2], marginRight: 4 }} />
                        <span>{inverted ? data.alertat : data.target}</span>
                    </div>
                </div>
            </div>
        </ResponsiveContainer>
    );
}

interface TableModalProps {
    title: string;
    open: boolean;
    rawColumns: Column[];
    dateRange: Range;
    dataorigin: string;
    onClose: () => void;
}

const TableModal: FC<TableModalProps> = ({ title, open, rawColumns, dateRange, dataorigin, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainDynamic = useSelector(state => state.main.mainDynamic);
    const columns = useMemo(() => rawColumns.map(x => ({
        Header: x.alias,
        accessor: x.columnname.replace(".", ""),
        type: "string",
        ...(x.type === "timestamp without time zone" ? {
            Cell: (props: any) => {
                const row = props.cell.row.original;
                return row[x.columnname.replace(".", "")] ? new Date(row[x.columnname.replace(".", "")]).toLocaleString() : "";
            }
        } : {})
    })), [rawColumns]);

    const getBody = useCallback(() => ({
        columns: rawColumns,
        parameters: {
            offset: (new Date().getTimezoneOffset() / 60) * -1,
        },
        summaries: [],
        filters: [
            {
                columnname: `${dataorigin}.createdate`,
                type: "timestamp without time zone",
                description: "",
                join_alias: "",
                join_on: "",
                join_table: "",
                start: format(dateRange.startDate!),
                end: format(dateRange.endDate!),
            },

        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [dateRange, rawColumns]);

    useEffect(() => {
        if (!open) return;

        dispatch(getCollectionDynamic(getBody()));
    }, [open, getBody, dispatch]);

    useEffect(() => {
        if (!open || mainDynamic.loading) return;
        if (mainDynamic.error) {
            const error = t(mainDynamic.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
        }
    }, [mainDynamic, open, t, dispatch]);

    return (
        <DialogZyx
            open={open}
            title={title}
            buttonText2={t(langKeys.cancel)}
            handleClickButton2={onClose}
            maxWidth="md"
        >
            <TableZyx
                columns={columns}
                filterGeneral={false}
                data={mainDynamic.data}
                download={false}
                loading={mainDynamic.loading}
            />
        </DialogZyx>
    );
}

const CenterLoading: FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <CircularProgress />
        </div>
    );
}

export default DashboardLayout;
