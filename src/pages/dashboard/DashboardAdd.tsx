import { Box, Button, IconButton, makeStyles, Modal, Typography, TextField, CircularProgress } from "@material-ui/core";
import paths from "common/constants/paths";
import { FieldEdit, FieldSelect, TemplateBreadcrumbs, TitleDetail } from "components";
import { FC, useCallback, useEffect, useState } from "react";
import { useHistory, useRouteMatch, useLocation } from "react-router";
import RGL, { WidthProvider } from 'react-grid-layout';
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { Close as CloseIcon, Clear as ClearIcon, Add as AddIcon, Save as SaveIcon } from "@material-ui/icons";
import { FieldErrors, useForm, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormUnregister } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getMultiCollection, resetMain, resetMultiMain } from "store/main/actions";
import { getDashboardTemplateIns, getDashboardTemplateSel, getKpiSel, getReportTemplateSel, getTagsChatflow } from "common/helpers";
import { useSelector } from "hooks";
import { contentTypes, graphTypes, groupingType } from "./constants";
import { showSnackbar } from "store/popus/actions";
import { getDashboardTemplate, resetSaveDashboardTemplate, saveDashboardTemplate, setDashboardTemplate } from "store/dashboard/actions";
import { DashboardTemplate } from "@types";

export interface ReportTemplate {
    columnjson: string; // array json
    createdate: string;
    description: string;
    filterjson: string; // json
    reporttemplateid: number;
    status: string;
    type: string;
    summaryjson: string;
}

export interface KpiTemplate {
    description: string;
    id: number;
    kpiname: string;
}

interface ColumnTemplate {
    // filter: string;
    // hasFilter: boolean;
    // key: string;
    // value: string;
    alias: string;
    columnname: string;
    description: string;
    descriptionT: string;
    disabled: boolean;
    join_alias: any;
    join_on: any;
    join_table: any;
    tablename: string;
    type: string;
    function?: string;
}

const ReactGridLayout = WidthProvider(RGL);

const useDashboardAddStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    dragDropContextRow: {
        display: 'flex',
        flexDirection: 'row',
        minHeight: 500,
    },
    droppableColumn: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    droppableContainer: {
        display:'flex',
        backgroundColor: 'red',
        color: 'white',
        flexDirection: 'column',
        height: 'inherit',
        width: 250,
    },
    item: {
        backgroundColor: 'blue',
        color: 'white',
    },
    layout: {
        backgroundColor: 'inherit',
        width: '100%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
    },
}));

interface Item {
    description: string;
    contentType: string;
    kpiid : number;
    reporttemplateid: number;
    interval?: string;
    grouping: string;
    graph: string;
    column: string;
    summarizationfunction?: string;
    funnelType?: string;
    tags?: any[];
}

interface Items {
    [key: string]: Item;
}

const DashboardAdd: FC<{ edit?: boolean }> = ({ edit = false }) => {
    const { t } = useTranslation();
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation<DashboardTemplate | null>();
    const classes = useDashboardAddStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const now = Date.now().toString();
    const [openModal, setOpenModal] = useState(false);
    const [layout, setLayout] = useState<RGL.Layout[]>([
        {i: 'add-btn-layout', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 1, isResizable: false, isDraggable: false, static: false},
        {i: now, x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 1, static: false},
    ]);
    const reportTemplatesAndKpis = useSelector(state => state.main.multiData);
    const dashboardSave = useSelector(state => state.dashboard.dashboardtemplateSave);
    const dashboardtemplate = useSelector(state => state.dashboard.dashboardtemplate);

    useEffect(() => {
        if (edit === true && !location.state) {
            const dashboardId = match.params.id;
            dispatch(getDashboardTemplate(getDashboardTemplateSel(dashboardId)));
        } else if (edit === true && location.state) {
            dispatch(setDashboardTemplate({
                ...location.state,
                description: `${location.state.description}-v1`,
                dashboardtemplateid: 0,
            }));
        } else if (edit === true && !location.state && !Number(match.params.id)) {
            history.push(paths.DASHBOARD);
        }

        dispatch(getMultiCollection([
            getReportTemplateSel(),
            getKpiSel(),
            getTagsChatflow(),
        ]));

        return () => {
            dispatch(resetMain());
            dispatch(resetMultiMain());
            dispatch(resetSaveDashboardTemplate());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit, location.state, match.params.id, dispatch]);

    useEffect(() => {
        if (reportTemplatesAndKpis.loading) return;
        if (reportTemplatesAndKpis.error) {
            const error = t(reportTemplatesAndKpis.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
        }
    }, [reportTemplatesAndKpis, t, dispatch]);

    useEffect(() => {
        if (dashboardSave.loading) return;
        if (dashboardSave.error) {
            const error = t(dashboardSave.code || "error_unexpected_error", { module: t(langKeys.dashboard).toLocaleLowerCase() });
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
            history.push(paths.DASHBOARD);
        }
    }, [dashboardSave, history, t, dispatch]);

    useEffect(() => {
        if (edit === false || dashboardtemplate.loading) return;
        if (dashboardtemplate.error) {
            const error = t(dashboardtemplate.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: error,
                severity: "error",
                show: true,
            }));
        } else if (dashboardtemplate.value) {
            setLayout(prev => ([
                {
                    ...prev[0], // 'add-btn-layout'
                    x: (((prev.length - 1) * 3) % 12) + 3,
                    y: Infinity,
                },
                ...(JSON.parse(dashboardtemplate.value!.layoutjson) as RGL.Layout[]),
            ]));
            reset(JSON.parse(dashboardtemplate.value!.detailjson) as Items);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dashboardtemplate, edit, t, dispatch]);


    const {register,unregister,formState: { errors }, getValues, setValue, handleSubmit,reset,} = useForm<Items>({
        defaultValues: {
            
        }
    });

    const addItemOnClick = () => {
        const newKey = Date.now().toString();
        setLayout(prev => {
            const newlayout = [
                ...prev,
                {
                    i: newKey,
                    x: ((prev.length - 1) * 3) % 12,
                    y: Infinity,
                    w: 3,
                    h: 2,
                    minW: 2,
                    minH: 1,
                    static: false,
                },
            ];
            const addbtn = newlayout[0].i === 'add-btn-layout' && newlayout[0];
            if (addbtn) {
                newlayout[0] = { ...addbtn, x: (((prev.length - 1) * 3) % 12) + 3, y: Infinity };
            }

            return newlayout;
        });
    };

    const deleteItemOnClick = (key: string) => {
        setLayout(prev => prev.filter(e => e.i !== key));
    }

    const onContinue = () => {
        if (layout.length <= 1) {
            dispatch(showSnackbar({
                message: t(langKeys.empty_dashboard_form_error),
                severity: "error",
                show: true,
            }));
        } else {
            handleSubmit((data) => {
                setOpenModal(true);
            }, e => console.warn('errores', e))();
        }
    }

    const onSubmit = useCallback((description: string) => {
        if (edit === true && !dashboardtemplate.value) return;

        const data = getValues();
        const [, ...cleanLayout] = layout; // quitando el boton en el index 0
        dispatch(saveDashboardTemplate(getDashboardTemplateIns({
            id: edit ? dashboardtemplate.value!.dashboardtemplateid : 0,
            description,
            detailjson: JSON.stringify(data),
            layoutjson: JSON.stringify(cleanLayout),
            status: 'ACTIVO',
            type: 'NINGUNO',
            operation: edit && dashboardtemplate.value!.dashboardtemplateid !== 0 ? 'UPDATE' : 'INSERT',
        })));
    }, [edit, dashboardtemplate, layout, getValues, dispatch]);

    const validMultiMainData = () => {
        return (
            !reportTemplatesAndKpis.loading &&
            reportTemplatesAndKpis.data[0]?.key === "UFN_REPORTTEMPLATE_SEL" &&
            reportTemplatesAndKpis.data[1]?.key === "UFN_KPI_LST"
        );
    }

    if (edit === true && (dashboardtemplate.loading || !dashboardtemplate.value)) {
        return <CenterLoading />;
    }

    return (
        <Box className={classes.root}>
            <TemplateBreadcrumbs
                breadcrumbs={[
                    { id: "view-1", name: "Dashboards" },
                    {
                        id: "view-2",
                        name: t(edit ? langKeys.edit_custom_dashboard : langKeys.create_custom_dashboard),
                    }
                ]}
                handleClick={id => id === "view-1" && history.push(paths.DASHBOARD)}
            />
            <div className={classes.header}>
                <TitleDetail title={edit ? dashboardtemplate.value!.description : t(langKeys.newDashboard)} />
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
                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={addItemOnClick}
                >
                    <Trans i18nKey={langKeys.add} />
                </Button> */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onContinue}
                    disabled={dashboardtemplate.loading}
                    style={{ backgroundColor: "#55BD84" }}
                    startIcon={<SaveIcon color="secondary" />}
                >
                    <Trans i18nKey={langKeys.save} />
                </Button>
            </div>
            <div style={{ height: '1em' }} />
            {!validMultiMainData() ? <CenterLoading /> : (
                <ReactGridLayout
                    className={classes.layout}
                    layout={layout}
                    onLayoutChange={setLayout}
                    cols={12}
                    rowHeight={140}
                >
                    {layout.map(e => {
                        if (e.i === 'add-btn-layout') {
                            return (
                                <div key={e.i}>
                                    <NewBtn onClick={addItemOnClick} />
                                </div>
                            );
                        }

                        return (
                            <div key={e.i}>
                                <LayoutItem
                                    edit={edit}
                                    layoutKey={e.i}
                                    templates={reportTemplatesAndKpis.data[0].data as ReportTemplate[]}
                                    kpis={reportTemplatesAndKpis.data[1].data as KpiTemplate[]}
                                    tags={reportTemplatesAndKpis.data[2].data as any[]}
                                    loading={reportTemplatesAndKpis.loading}
                                    register={register}
                                    unregister={unregister}
                                    getValues={getValues}
                                    setValue={setValue}
                                    errors={errors}
                                    onDelete={() => deleteItemOnClick(e.i)}
                                />
                            </div>
                        );
                    })}
                </ReactGridLayout>
            )}
            <SubmitModal
                defaultDescription={edit === false ? '' : dashboardtemplate.value!.description}
                open={openModal}
                loading={dashboardSave.loading}
                onClose={() => setOpenModal(false)}
                onSubmit={onSubmit}
            />
        </Box>
    );
}

interface SubmitModalProps {
    open: boolean;
    loading: boolean;
    defaultDescription?: string;
    onSubmit: (description: string) => void;
    onClose: () => void;
}

const useSubmitModalStyles = makeStyles(theme => ({
    root: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: "80%",
        maxHeight: "80%",
        width: '80%',
        backgroundColor: 'white',
        padding: "16px",
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
    },
}));

const SubmitModal: FC<SubmitModalProps> = ({ open, loading, defaultDescription = '', onClose, onSubmit }) => {
    const classes = useSubmitModalStyles();
    const { t } = useTranslation();
    const [description, setDescription] = useState(defaultDescription);

    return (
        <Modal
            open={open}
            onClose={(_, reason) => {
                if (loading) return;
                onClose();
            }}
            aria-labelledby="dashboard-submit-modal-title"
            aria-describedby="dashboard-submit-modal-description"
        >
            <Box className={classes.root}>
                <Typography id="dashboard-submit-modal-title" variant="h6" component="h2">
                    <Trans i18nKey={langKeys.description} />
                </Typography>
                <TextField
                    id="dashboard-submit-modal-description"
                    placeholder={t(langKeys.enterDashboardDescription)}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    InputProps={{ readOnly: loading }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={loading || description.length === 0}
                    onClick={() => onSubmit(description)}
                >
                    <Trans i18nKey={langKeys.save} />
                </Button>
            </Box>
        </Modal>
    );
}

interface NewBtnProps {
    onClick: () => void;
}

const useNewBtnStyles = makeStyles(the => ({
    root: {
        width: 'inherit',
        height: 'inherit',
        padding: '1em',
        display: 'flex',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',

        minWidth: 'unset',
        minHeight: 'unset',
    },
    addIcon: {
        width: 42,
        height: 42,
    },
}));

const NewBtn: FC<NewBtnProps> = ({ onClick }) => {
    const classes = useNewBtnStyles();

    return (
        <Button className={classes.root} onClick={onClick}>
            <AddIcon color="primary" className={classes.addIcon} />
        </Button>
    );
}

interface LayoutItemProps {
    edit: boolean;
    layoutKey: string;
    templates: ReportTemplate[];
    kpis: KpiTemplate[];
    tags: any[];
    loading?: boolean;
    errors: FieldErrors<Items>;
    getValues: UseFormGetValues<Items>;
    setValue: UseFormSetValue<Items>;
    register: UseFormRegister<Items>;
    unregister: UseFormUnregister<Items>;
    onDelete?: () => void;
}

const useLayoutItemStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'white',
        width: 'inherit',
        height: 'inherit',
        padding: '1em',
        display: 'block',
        overflow: 'auto',
        position: 'relative',
    },
    deleteBtn: {
        position: 'absolute',
        top: 1,
        right: 1,
    },
    funnelLvlTitle: {
        display: "flex",
        justifyContent: "space-between"
    },
    field: {
        marginBottom: '0.65rem',
    },
}));

export const LayoutItem: FC<LayoutItemProps> = ({
    layoutKey: key,
    edit,
    loading = false,
    templates = [],
    kpis = [],
    tags =[],
    errors,
    getValues,
    setValue,
    register,
    unregister,
    onDelete,
}) => {
    const classes = useLayoutItemStyles();
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [contentType, setContentType] = useState('');
    const [showLevel, setShowLevel] = useState(true);
    const [tagsdata, settagsdata] = useState<any>(getValues(`${key}.tags`)||[]);
    const [graphicType, setgraphicType] = useState(getValues(`${key}.graph`));
    const [columns, setColumns] = useState<ColumnTemplate[]>([]);

    useEffect(() => {
        if (edit === false) return;

        const reporttemplateid = getValues(`${key}.reporttemplateid`);
        if (reporttemplateid !== undefined || reporttemplateid !== null) {
            setSelectedIndex(templates.findIndex(e => e.reporttemplateid === reporttemplateid));
        }

        const defaultContentType = getValues(`${key}.contentType`);
        if (defaultContentType !== undefined || defaultContentType !== null) {
            setContentType(defaultContentType);
        }

        const defaultGraphicType = getValues(`${key}.contentType`);
        if (defaultGraphicType !== undefined || defaultGraphicType !== null) {
            setgraphicType(defaultGraphicType);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit, getValues]);

    useEffect(() => {
        register(`${key}.description`, { validate: mandatoryStrField, value: getValues(`${key}.description`) || '' });
        register(`${key}.contentType`, { validate: mandatoryContentType, value: getValues(`${key}.contentType`) || '' });

        return () => {
            unregister(key);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [register, unregister, t, key]);

    useEffect(() => {
        if (contentType === "report") {
            unregister(`${key}.kpiid`);

            register(`${key}.reporttemplateid`, { validate: mandatoryReportTemplate, value: getValues(`${key}.reporttemplateid`) || 0 });
            register(`${key}.grouping`, { validate: mandatoryStrField, value: getValues(`${key}.grouping`) || '' });
            register(`${key}.graph`, { validate: mandatoryStrField, value: getValues(`${key}.graph`) || '' });
            register(`${key}.column`, { validate: mandatoryColumn, value: getValues(`${key}.column`) || '' });
            register(`${key}.summarizationfunction`);
            register(`${key}.interval`, {value: getValues(`${key}.interval`)});
        } else if (contentType === "kpi") {
            unregister(`${key}.reporttemplateid`);
            unregister(`${key}.grouping`);
            unregister(`${key}.graph`);
            unregister(`${key}.column`);

            register(`${key}.kpiid`, { validate: mandatoryNumField, value: getValues(`${key}.kpiid`) || 0 });
        }
        else if (contentType === "funnel") {
            if(!getValues(`${key}.funnelType`)) setValue(`${key}.funnelType`, "byway");
            setShowLevel(getValues(`${key}.funnelType`)!=="bycount")
            unregister(`${key}.kpiid`);
            unregister(`${key}.grouping`);
            unregister(`${key}.graph`);
            
            register(`${key}.reporttemplateid`, { validate: mandatoryReportTemplate, value: getValues(`${key}.reporttemplateid`) || 0 });
            register(`${key}.funnelType`);
            register(`${key}.column`, { validate: mandatoryColumn, value: getValues(`${key}.column`) || '' });
            register(`${key}.tags`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentType, columns, templates]);

    useEffect(() => {
        if (selectedIndex === -1) {
            setColumns([]);
            return;
        }
        let columnas= JSON.parse(templates[selectedIndex].columnjson) as ColumnTemplate[]
        let summary = JSON.parse(templates[selectedIndex].summaryjson).map((x:any)=>{return {
            alias: `${t(langKeys.summarization)} - ${columnas?.find(y => y.columnname === x.columnname)?.alias} (${t("function_" + x.function)})`,
            columnname: `${x.columnname}${x.function}`,
            description: x.columnname,
            descriptionT: x.columnname,
            disabled: false,
            join_alias: null,
            join_on: null,
            join_table: null,
            tablename: "",
            type: x.type,
            function: x.function
        }})
        setColumns(summary.concat(columnas));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex, templates]);

    const mandatoryReportTemplate = (value: number) => {
        if (value === 0 || !templates.some(x => x.reporttemplateid === value)) {
            return t(langKeys.field_required)
        }

        return undefined;
    }

    const mandatoryColumn = (value: string) => {
        if (
            !value ||
            value.length === 0 ||
            !columns.some(x => x.columnname === value)
        ) {
            return t(langKeys.field_required);
        }

        return  undefined;
    }

    const mandatoryContentType = (value: string) => {
        if (!value || value.length === 0) {
            return t(langKeys.field_required);
        } else if (value === "report" || value === "kpi" || value === "funnel") {
            return undefined;
        }

        return t(langKeys.invalidEntry);
    }

    const mandatoryStrField = (value: string) => {
        return !value || value.length === 0 ? t(langKeys.field_required) : undefined;
    }

    const mandatoryNumField = (value: number) => {
        return value === 0 ? t(langKeys.field_required) : undefined;
    }

    function deleteFunnel(index:number){
        let newtagsdata=tagsdata.filter((x:any,i:number)=>i!==index)
        settagsdata(newtagsdata)
        setValue(`${key}.tags`,newtagsdata)
    }

    return (
        <div className={classes.root}>
            <IconButton className={classes.deleteBtn} onClick={onDelete} size="small">
                <CloseIcon style={{ width: 18, height: 18 }} />
            </IconButton>
            <FieldEdit
                className={classes.field}
                valueDefault={getValues(`${key}.description`)}
                label={t(langKeys.title)}
                disabled={loading}
                error={errors[key]?.description?.message}
                onChange={(v: string) => setValue(`${key}.description`, v)}
            />
            <FieldSelect
                className={classes.field}
                label={t(langKeys.contentType)}
                data={contentTypes}
                optionDesc="key"
                optionValue="key"
                valueDefault={getValues(`${key}.contentType`)}
                onChange={(v: typeof contentTypes[number]) => {
                    const value = v?.key || '';
                    setValue(`${key}.contentType`, value);
                    setContentType(value);
                }}
                error={errors[key]?.contentType?.message}
                disabled={loading}
                uset
                prefixTranslation="dashboard_contentType_"
            />
            {contentType === "kpi" && (
                <FieldSelect
                    className={classes.field}
                    label="KPI"
                    data={kpis}
                    optionDesc="kpiname"
                    optionValue="id"
                    valueDefault={getValues(`${key}.kpiid`)}
                    onChange={(v: KpiTemplate) => setValue(`${key}.kpiid`, v?.id || 0)}
                    error={errors[key]?.kpiid?.message}
                    disabled={loading}
                />
            )}
            {contentType === "report" && (
                <>
                    <FieldSelect
                        className={classes.field}
                        label={t(langKeys.report)}
                        data={templates}
                        optionDesc="description"
                        optionValue="reporttemplateid"
                        valueDefault={getValues(`${key}.reporttemplateid`)}
                        onChange={(v: ReportTemplate) => {
                            const reporttemplateid = v?.reporttemplateid || 0;
                            setValue(`${key}.reporttemplateid`, reporttemplateid);
                            if (reporttemplateid === 0) {
                                setValue(`${key}.column`, '');
                            }
                            setSelectedIndex(!v ? -1 : templates.findIndex(e => e === v));
                        }}
                        error={errors[key]?.reporttemplateid?.message}
                        disabled={loading}
                    />
                    <FieldSelect
                        className={classes.field}
                        label={t(langKeys.groupment)}
                        data={groupingType}
                        optionDesc="key"
                        optionValue="key"
                        valueDefault={getValues(`${key}.grouping`)}
                        onChange={(v: typeof groupingType[number]) => {
                            setValue(`${key}.grouping`, v?.key || '')
                            setValue(`${key}.interval`, "")
                        }}
                        error={errors[key]?.grouping?.message}
                        disabled={loading}
                        uset
                        prefixTranslation="dashboard_groupment_"
                    />
                    <FieldSelect
                        className={classes.field}
                        label={t(langKeys.chartType)}
                        data={graphTypes}
                        optionDesc="key"
                        optionValue="key"
                        valueDefault={getValues(`${key}.graph`)}
                        onChange={(v: typeof graphTypes[number]) => {
                            setValue(`${key}.graph`, v?.key || '')
                            setValue(`${key}.interval`, "")
                            setgraphicType(v?.key || '')
                        }}
                        error={errors[key]?.graph?.message}
                        disabled={loading}
                        uset
                        prefixTranslation="dashboard_chartType_"
                    />
                    {(graphicType === "bar" || graphicType ==="line") && <FieldSelect
                        className={classes.field}
                        label={t(langKeys.displayinterval)}
                        data={[
                            {key: "day", desc:t(langKeys.day)},
                            {key: "week", desc:t(langKeys.week)},
                            {key: "month", desc:t(langKeys.month)},
                        ]}
                        optionDesc="desc"
                        optionValue="key"
                        valueDefault={getValues(`${key}.interval`)}
                        onChange={(v)=>setValue(`${key}.interval`, v?.key || "")}
                        disabled={loading}
                    />}
                    <FieldSelect
                        className={classes.field}
                        label={t(langKeys.column)}
                        data={columns}
                        optionDesc="alias"
                        optionValue="columnname"
                        valueDefault={`${getValues(`${key}.column`)}${getValues(`${key}.summarizationfunction`)|| ''}`}
                        onChange={(v: ColumnTemplate) => {
                            if(v?.function){
                                setValue(`${key}.column`, v?.columnname?.slice(0,-(v?.function?.length||0)));
                            }
                            else{
                                setValue(`${key}.column`, v?.columnname||'');
                            }
                            setValue(`${key}.summarizationfunction`, v?.function || '');
                        }}
                        error={errors[key]?.column?.message}
                        disabled={loading || columns.length === 0}
                    />
                </>
            )}
            {contentType === "funnel" && (
                <>
                    <FieldSelect
                        className={classes.field}
                        label={t(langKeys.funnelType)}
                        data={[
                            {value: "byway", description: t(langKeys.byway)},
                            {value: "bycount", description: t(langKeys.bycount)},
                        ]}
                        optionDesc="description"
                        optionValue="value"
                        valueDefault={!!getValues(`${key}.funnelType`)?getValues(`${key}.funnelType`):"bycount"}
                        onChange={(v: any) => {
                            const value = v?.value || "byway";
                            setValue(`${key}.funnelType`, value);
                            if(value==="bycount") setShowLevel(false)
                        }}
                        disabled={loading}
                    />
                    <FieldSelect
                        className={classes.field}
                        label={t(langKeys.report)}
                        data={templates}
                        optionDesc="description"
                        optionValue="reporttemplateid"
                        valueDefault={getValues(`${key}.reporttemplateid`)}
                        onChange={(v: ReportTemplate) => {
                            const reporttemplateid = v?.reporttemplateid || 0;
                            setValue(`${key}.reporttemplateid`, reporttemplateid);
                            if (reporttemplateid === 0) {
                                setValue(`${key}.column`, '');
                            }
                            setSelectedIndex(!v ? -1 : templates.findIndex(e => e === v));
                        }}
                        error={errors[key]?.reporttemplateid?.message}
                        disabled={loading}
                    />
                    <FieldSelect
                        className={classes.field}
                        label={t(langKeys.column)}
                        data={columns.filter(e=>e.columnname.includes("tag"))}
                        optionDesc="alias"
                        optionValue="columnname"
                        valueDefault={`${getValues(`${key}.column`)}${getValues(`${key}.summarizationfunction`)|| ''}`}
                        onChange={(v: ColumnTemplate) => {
                            if(v?.function){
                                setValue(`${key}.column`, v?.columnname?.slice(0,-(v?.function?.length||0)));
                            }
                            else{
                                setValue(`${key}.column`, v?.columnname||'');
                            }
                            setValue(`${key}.summarizationfunction`, v?.function || '');
                        }}
                        error={errors[key]?.column?.message}
                        disabled={loading || columns.length === 0}
                    />
                    
                    <>
                        {tagsdata.map((tag:any, i:number) => {
                            return <div key={`tagdatalevel${i+1}`}>
                                <div className={classes.funnelLvlTitle}>
                                    <p style={{fontSize: 14, fontWeight: 500}}>{showLevel?`${t(langKeys.level)} ${i+1}`:""}</p>
                                    <IconButton onClick={()=>deleteFunnel(i)} size="small" style={{ width: 18, height: 18, margin: 14, marginRight: 0 }} >
                                        <CloseIcon style={{ width: 18, height: 18 }} />
                                    </IconButton>
                                </div>
                                <div    style={{paddingLeft: 40}}>
                                    <FieldSelect
                                        fregister={{
                                            ...register(`${key}.tags[${i}].value`, {
                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        className={classes.field}
                                        label={t(langKeys.value)}
                                        data={tags}
                                        optionDesc="tag"
                                        optionValue="tag"
                                        valueDefault={getValues(`${key}.tags[${i}].value`)}
                                        onChange={(v: any) => {
                                            let initTags=getValues(`${key}.tags`)||[];
                                            initTags[i].value = v?.tag || "";
                                            let newtagdata=tagsdata;
                                            newtagdata[i].value = v?.tag || "";
                                            settagsdata(newtagdata)
                                            setValue(`${key}.tags`,initTags)
                                        }}
                                        error={errors[key]?.tags?.[i]?.value?.message}
                                    />
                                    <FieldEdit
                                        fregister={{
                                            ...register(`${key}.tags[${i}].title`, {
                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        label={showLevel?`${t(langKeys.title)} ${t(langKeys.level)} ${i+1}`:`${t(langKeys.title)} ${t(langKeys.tag)}`}
                                        valueDefault={getValues(`${key}.tags[${i}].title`)}
                                        className={classes.field}
                                        onChange={(value: any) => {
                                            let initTags=getValues(`${key}.tags`)||[];
                                            initTags[i].title = value || "";
                                            let newtagdata=tagsdata;
                                            newtagdata[i].title = value || "";
                                            settagsdata(newtagdata)
                                            setValue(`${key}.tags`,initTags)
                                        }}
                                        error={errors[key]?.tags?.[i]?.title?.message}
                                    />
                                </div>
                            </div>
                        })}
                    </>
                    <Button style={{float:"right"}} onClick={()=>{
                        let initTags=getValues(`${key}.tags`)||[];
                        settagsdata([...initTags,{value:"",title:""}])
                        setValue(`${key}.tags`,[...initTags,{value:"",title:""}])
                    }}><AddIcon/> {t(langKeys.add)} {t(langKeys.level)}</Button> 
                </>
            )}
        </div>
    );
}

const CenterLoading: FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <CircularProgress />
        </div>
    );
}

export default DashboardAdd;
