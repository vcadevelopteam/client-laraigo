import { FC, useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Box, Button, CircularProgress, IconButton, makeStyles, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { Clear as ClearIcon, SwapHoriz as SwapHorizIcon, MoreVert as MoreVertIcon } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { deleteDashboardTemplate, getDashboard, getDashboardTemplate, resetDeleteDashboardTemplate, resetGetDashboard, resetGetDashboardTemplate, resetSaveDashboardTemplate, saveDashboardTemplate } from "store/dashboard/actions";
import { useSelector } from "hooks";
import { DateRangePicker, DialogZyx, TemplateBreadcrumbs, TitleDetail } from "components";
import { useHistory, useRouteMatch } from "react-router";
import paths from "common/constants/paths";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { showSnackbar } from "store/popus/actions";
import { getDashboardTemplateIns, getDashboardTemplateSel, getReportTemplateSel } from "common/helpers";
import RGL, { WidthProvider } from 'react-grid-layout';
import { XAxis, YAxis, ResponsiveContainer, Tooltip as  ChartTooltip, BarChart, Legend, Bar, PieChart, Pie, Cell, ResponsiveContainerProps } from 'recharts';
import { LayoutItem as NewLayoutItem, ReportTemplate } from './DashboardAdd';
import { useForm } from "react-hook-form";
import { getCollection, getCollectionDynamic, resetMain, resetMainDynamic } from "store/main/actions";
import { Range } from "react-date-range";
import { CalendarIcon } from "icons";
import TableZyx from "components/fields/table-simple";

const ReactGridLayout = WidthProvider(RGL);

interface Item {
    description: string;
    contentType: string;
    kpi: number;
    reporttemplateid: number;
    grouping: string;
    graph: string;
    column: string;
}

interface Items {
    [key: string]: Item;
}

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
}));

const format = (date: Date) => date.toISOString().split('T')[0];

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
    const [canLayoutChange, setCanLayoutChange] = useState(true);
    const mustLoadagain = useRef(false);

    const { register, unregister, formState: { errors }, getValues, setValue, handleSubmit, reset } = useForm<Items>();

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
            offset: -5,
        }));
    }, [dateRange, match.params.id, dispatch]);

    useEffect(() => {
        if (dashboardtemplate.loading) return;
        if (dashboardtemplate.error) {
            const error = t(dashboardtemplate.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                success: false,
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
                success: false,
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
                success: false,
                show: true,
            }));
        } else if (dashboardSave.success === true) {
            dispatch(showSnackbar({
                message: "Se guardó el dashboard",
                success: true,
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
                success: false,
                show: true,
            }));
        } else if (dashboardtemplateDelete.success) {
            dispatch(showSnackbar({
                message: "Se eliminó el dashboard",
                success: true,
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
                success: false,
                show: true,
            }));
        }
    }, [reportTemplates, t, dispatch]);

    const onDelete = useCallback(() => {
        if (!dashboardtemplate.value) return;

        dispatch(deleteDashboardTemplate(getDashboardTemplateIns({
            ...dashboardtemplate.value!,
            id: match.params.id,
            status: 'ELIMINADO',
            operation: 'DELETE',
        })));
    }, [dashboardtemplate, match.params.id, dispatch]);

    const onSave = useCallback(() => {
        if (!dashboardtemplate.value) return;

        handleSubmit(data => {
            const detail = layout.detail;
            for(const key in data) {
                detail[key] = data[key];
            }

            mustLoadagain.current = Object.keys(data).length > 0;

            dispatch(saveDashboardTemplate(getDashboardTemplateIns({
                ...dashboardtemplate.value!,
                id: match.params.id,
                operation: 'UPDATE',
                detailjson: JSON.stringify(detail),
                layoutjson: JSON.stringify(layout.layout),
            })));
        }, e => console.log('errores', e))();
    }, [dashboardtemplate, layout, handleSubmit, match.params.id, dispatch]);

    const onDetailChange = useCallback((detail: Items, type: ChangeType, key: string) => {
        setLayout(prev => {
            const newLayout = type === "DELETE" ? prev.layout.filter(x => x.i !== key) : prev.layout;
            return { layout: newLayout, detail: detail };
        });
    }, []);

    const addItemOnClick = useCallback(() => {
        const newKey = Date.now().toString();
        setLayout(prev => ({
            ...prev,
            layout: [
                ...prev.layout,
                {
                    i: newKey,
                    x: (prev.layout.length * 3) % 12,
                    y: Infinity,
                    w: 3,
                    h: 2,
                    minW: 2,
                    minH: 1,
                    static: false,
                },
            ],
        }));
    }, []);

    const deleteItemOnClick = useCallback((key: string) => {
        setLayout(prev => {
            return {
                ...prev,
                layout: prev.layout.filter(e => e.i !== key),
            };
        });
    }, []);

    if (dashboardtemplate.loading || dashboard.loading) {
        return <CenterLoading />;
    }

    if (dashboardtemplate.error || dashboard.error || !dashboardtemplate.value || !dashboard.value) {
        return (
            <div>ERROR</div>
        );
    }

    const { description } = dashboardtemplate.value!;
    return (
        <Box className={classes.root}>
            <TemplateBreadcrumbs
                breadcrumbs={[
                    { id: "view-1", name: "Dashboards" },
                    { id: "view-2", name: "Detalle de dashboard" }
                ]}
                handleClick={id => id === "view-1" && history.push(paths.DASHBOARD)}
            />
            <div className={classes.header}>
                <TitleDetail title={description} />
                <div style={{ flexGrow: 1 }} />
                <DateRangePicker
                    open={openDatePicker}
                    setOpen={setOpenDatePicker}
                    range={dateRange}
                    onSelect={setDateRange}
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
                    onClick={addItemOnClick}
                    disabled={dashboardSave.loading || dashboardtemplate.loading || !dashboardtemplate.value}
                >
                    <Trans i18nKey={langKeys.add} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onDelete}
                    disabled={dashboardSave.loading ||dashboardtemplate.loading || !dashboardtemplate.value}
                >
                    <Trans i18nKey={langKeys.delete} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSave}
                    disabled={dashboardSave.loading ||dashboardtemplate.loading || !dashboardtemplate.value}
                >
                    <Trans i18nKey={langKeys.save} />
                </Button>
            </div>
            <div style={{ height: '1em' }} />
            <ReactGridLayout
                className={classes.layout}
                layout={layout.layout}
                onLayoutChange={(l) => setLayout(prev => ({ ...prev, layout: l }))}
                cols={12}
                rowHeight={140}
                isDraggable={canLayoutChange && !dashboardtemplate.loading && !dashboard.loading}
                isResizable={canLayoutChange && !dashboardtemplate.loading && !dashboard.loading}
            >
                {layout.layout.map(e => (
                    <div key={e.i}>
                        {e.i in layout.detail ? (
                            <LayoutItem
                                layoutKey={e.i}
                                reportname={dashboard.value?.[e.i]?.reportname || '-'}
                                data={dashboard.value?.[e.i]?.data}
                                columnjson={dashboard.value?.[e.i]?.columnjson}
                                type={layout.detail[e.i]!.graph}
                                detail={layout.detail}
                                onDetailChange={(d, t) => onDetailChange(d, t, e.i)}
                                dateRange={dateRange}
                                onModalOpenhasChanged={v => setCanLayoutChange(!v)}
                            />
                        ) : (
                            <NewLayoutItem
                                layoutKey={e.i}
                                templates={reportTemplates.data as ReportTemplate[]}
                                kpis={[]}
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
                ))}
            </ReactGridLayout>
        </Box>
    );
}

interface ItemsData {
    [label: string]: number;
}

type ChangeType = "DELETE" | "UPDATE" | "INSERT";

interface LayoutItemProps {
    reportname: string;
    data?: ItemsData;
    type: string;
    layoutKey: string;
    detail?: Items;
    columnjson?: string;
    dateRange: Range;
    onDetailChange?: (detail: Items, type: ChangeType) => void;
    onModalOpenhasChanged: (open: boolean) => void;
}

interface Column {
    key: string;
    value: string;
    filter: string;
    hasFilter: boolean;
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
        overflow: 'auto',
        flexGrow: 1,
    },
}));

const LayoutItem: FC<LayoutItemProps> = ({
    reportname,
    data,
    type,
    layoutKey: key,
    detail,
    columnjson,
    dateRange,
    onDetailChange,
    onModalOpenhasChanged,
}) => {
    const classes = useLayoutItemStyles();
    const canChange = detail !== undefined && onDetailChange !== undefined;
    const dataGraph = useMemo(() => {
        if (!data) return [];
        return Object.keys(data).map(e => ({ label: e, quantity: data[e] }));
    }, [data]);
    const [graph, setGraph] = useState(type);
    const [openTableModal, setOpenTableModal] = useState(false);
    const rawColumns = useMemo<Column[]>(() => {
        if (!columnjson) return [];
        return JSON.parse(columnjson);
    }, [columnjson]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onChange = useCallback(() => {
        if (!canChange) return;

        const newType = graph === 'bar' ? 'pie' : 'bar';
        setGraph(newType);
        onDetailChange!({
            ...detail,
            [key]: {
                ...detail![key],
                graph: newType,
            },
        }, "UPDATE");
    }, [graph, canChange, key, detail, onDetailChange]);

    const onDelete = useCallback(() => {
        if (!canChange) return;

        const { [key]: _, ...newDetail } = detail!;
        onDetailChange!({ ...newDetail }, "DELETE");
        handleClose();
    }, [canChange, key, detail, onDetailChange]);

    const renderGraph = useCallback(() => {
        switch(graph) {
            case 'bar': return <LayoutBar data={dataGraph} />;
            case 'pie': return <LayoutPie data={dataGraph} />;
            default: return null;
        }
    }, [dataGraph, graph]);

    if (!data) {
        return (
            <div className={classes.rootLoading}>
                <CenterLoading />
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <span className={classes.label}>{reportname}</span>
                <div style={{ flexGrow: 1 }} />
                <Tooltip title="Intercambiar">
                    <IconButton onClick={onChange} size="small">
                        <SwapHorizIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Más opciones">
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
                    <MenuItem onClick={onDelete}>
                        <Trans i18nKey={langKeys.delete} />
                    </MenuItem>
                </Menu>
            </div>
            <div className={classes.reponsiveContainer}>
                {renderGraph()}
            </div>
            <TableModal
                title={reportname}
                open={openTableModal}
                onClose={() => {
                    setOpenTableModal(false);
                    onModalOpenhasChanged(false);
                }}
                rawColumns={rawColumns}
                dateRange={dateRange}
            />
        </div>
    );
}

interface IData {
    label: string;
    quantity: number;
}

interface LayoutBarProps extends Omit<ResponsiveContainerProps, 'children'> {
    data: IData[];
}

const LayoutBar: FC<LayoutBarProps> = ({ data, ...props }) => {
    return (
        <ResponsiveContainer {...props}>
            <BarChart data={data}>
                <XAxis dataKey="label" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
}

interface LayoutPieProps extends Omit<ResponsiveContainerProps, 'children'> {
    data: IData[];
}

const PIE_COLORS = ['#22b66e', '#b41a1a', '#ffcd56'];

const LayoutPie: FC<LayoutPieProps> = ({ data, ...props }) => {
    return (
        <ResponsiveContainer {...props}>
            <PieChart>
                <ChartTooltip />
                <Pie
                    data={data}
                    dataKey="quantity"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    fill="#8884d8"
                >
                    {data.map((_, i) => (
                        <Cell
                            key={`cell-${i}`}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                    ))}
                </Pie>
                <Legend verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
    );
}

interface TableModalProps {
    title: string;
    open: boolean;
    rawColumns: Column[];
    dateRange: Range;
    onClose: () => void;
}

const TableModal: FC<TableModalProps> = ({ title, open, rawColumns, dateRange, onClose }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainDynamic = useSelector(state => state.main.mainDynamic);
    const columns = useMemo(() => rawColumns.map(x => ({ Header: x.value, accessor: x.key })), [rawColumns]);

    const getBody = useCallback(() => ({
        columns: rawColumns,
        parameters: {
            offset: (new Date().getTimezoneOffset() / 60) * -1,
        },
        summaries: [],
        filters: [
            {
                column: "startdate",
                start: format(dateRange.startDate!),
                end: format(dateRange.endDate!)
            },
        ],
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
                success: false,
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
