import { FC, useEffect, useMemo, useState, useCallback } from "react";
import { Box, Button, CircularProgress, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { Clear as ClearIcon, SwapHoriz as SwapHorizIcon } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { deleteDashboardTemplate, getDashboard, getDashboardTemplate, resetDeleteDashboardTemplate, resetGetDashboard, resetGetDashboardTemplate, resetSaveDashboardTemplate } from "store/dashboard/actions";
import { useSelector } from "hooks";
import { TemplateBreadcrumbs, TitleDetail } from "components";
import { useHistory, useRouteMatch } from "react-router";
import paths from "common/constants/paths";
import { langKeys } from "lang/keys";
import { Trans, useTranslation } from "react-i18next";
import { showSnackbar } from "store/popus/actions";
import { getDashboardTemplateIns, getDashboardTemplateSel } from "common/helpers";
import RGL, { WidthProvider } from 'react-grid-layout';
import { XAxis, YAxis, ResponsiveContainer, Tooltip as  ChartTooltip, BarChart, Legend, Bar, PieChart, Pie, Cell, ResponsiveContainerProps } from 'recharts';

const ReactGridLayout = WidthProvider(RGL);

interface Item {
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
    const [dateRange] = useState({ startDate: "2021-11-05", endDate: "2021-11-30" });
    const [layout, setLayout] = useState<{ layout: RGL.Layout[], detail: Items }>({ layout: [], detail: {} });

    useEffect(() => {
        dispatch(getDashboardTemplate(getDashboardTemplateSel(match.params.id)));

        return () => {
            dispatch(resetGetDashboard());
            dispatch(resetGetDashboardTemplate());
            dispatch(resetSaveDashboardTemplate());
            dispatch(resetDeleteDashboardTemplate());
        };
    }, [match.params.id, dispatch]);

    useEffect(() => {
        dispatch(getDashboard({
            dashboardtemplateid: match.params.id,
            startdate: dateRange.startDate,
            enddate: dateRange.endDate,
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
        }
    }, [dashboardSave, t, dispatch]);

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
            history.push(paths.DASHBOARD);
        }
    }, [dashboardtemplateDelete, history, t, dispatch]);

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

        dispatch(deleteDashboardTemplate(getDashboardTemplateIns({
            ...dashboardtemplate.value!,
            id: match.params.id,
            operation: 'UPDATE',
            detailjson: JSON.stringify(layout.detail),
            layoutjson: JSON.stringify(layout.layout),
        })));
    }, [dashboardtemplate, layout, match.params.id, dispatch]);

    if (dashboardtemplate.loading || dashboard.loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <CircularProgress />
            </div>
        );
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
                    onClick={onDelete}
                    disabled={dashboardtemplate.loading || !dashboardtemplate.value}
                >
                    <Trans i18nKey={langKeys.delete} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSave}
                    disabled={dashboardtemplate.loading || !dashboardtemplate.value}
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
            >
                {layout.layout.map(e => (
                    <div key={e.i}>
                        <LayoutItem
                            layoutKey={e.i}
                            reportname={dashboard.value![e.i].reportname}
                            data={dashboard.value![e.i].data}
                            type={layout.detail[e.i]?.graph || ''}
                            detail={layout.detail}
                            onDetailChange={d => setLayout(prev => ({ ...prev, detail: d }))}
                        />
                    </div>
                ))}
            </ReactGridLayout>
        </Box>
    );
}

interface ItemsData {
    [label: string]: number;
}

interface LayoutItemProps {
    reportname: string;
    data: ItemsData;
    type: string;
    layoutKey: string;
    detail?: Items;
    onDetailChange?: (detail: Items) => void;
}

const useLayoutItemStyles = makeStyles(theme => ({
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
        justifyContent: 'space-between',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingBottom: '1em',
    },
    reponsiveContainer: {
        flexGrow: 1,
    },
}));

const LayoutItem: FC<LayoutItemProps> = ({ reportname, data, type, layoutKey: key, detail, onDetailChange }) => {
    const classes = useLayoutItemStyles();
    const canChange = detail !== undefined && onDetailChange !== undefined;
    const dataGraph = useMemo(() => Object.keys(data).map(e => ({ label: e, quantity: data[e] })), [data]);
    const [graph, setGraph] = useState(type);

    const onChange = useCallback(() => {
        if (!canChange) return;

        const newType = graph === 'bar' ? 'pie' : 'bar';
        setGraph(newType);
        onDetailChange!({
            ...detail,
            [key]: {
                ...detail![key],
                graph,
            },
        });
    }, [graph, canChange, detail, onDetailChange]);

    const renderGraph = useCallback(() => {
        switch(graph) {
            case 'bar': return <LayoutBar data={dataGraph} className={classes.reponsiveContainer} />;
            case 'pie': return <LayoutPie data={dataGraph} className={classes.reponsiveContainer} />;
            default: return null;
        }
    }, [dataGraph, graph, classes]);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <span className={classes.label}>{reportname}</span>
                <Tooltip title="Intercambiar">
                    <IconButton onClick={onChange} size="small">
                        <SwapHorizIcon />
                    </IconButton>
                </Tooltip>
            </div>
            {renderGraph()}
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
                <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
        </ResponsiveContainer>
    );
}

export default DashboardLayout;
