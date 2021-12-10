import { Box, Button, IconButton, makeStyles, Modal, Typography, TextField } from "@material-ui/core";
import paths from "common/constants/paths";
import { FieldSelect, TemplateBreadcrumbs, TitleDetail } from "components";
import { FC, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import RGL, { WidthProvider } from 'react-grid-layout';
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { Close as CloseIcon, Clear as ClearIcon } from "@material-ui/icons";
import { FieldErrors, useForm, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormUnregister } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getCollection, resetMain } from "store/main/actions";
import { getDashboardTemplateIns, getReportTemplateSel } from "common/helpers";
import { useSelector } from "hooks";
import { graphTypes, groupingType } from "./constants";
import { showSnackbar } from "store/popus/actions";
import { resetSaveDashboardTemplate, saveDashboardTemplate } from "store/dashboard/actions";

interface ReportTemplate {
    columnjson: string; // array json
    createdate: string;
    description: string;
    filterjson: string; // json
    reporttemplateid: number;
    status: string;
    type: string;
}

interface ColumnTemplate {
    filter: string;
    hasFilter: boolean;
    key: string;
    value: string;
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
        backgroundColor: 'grey',
        width: '100%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
    },
}));

interface Item {
    reporttemplateid: number;
    grouping: string;
    graph: string;
    column: string;
}

interface Items {
    [key: string]: Item;
}

const DashboardAdd: FC = () => {
    const { t } = useTranslation();
    const classes = useDashboardAddStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const now = Date.now().toString();
    const [openModal, setOpenModal] = useState(false);
    const [layout, setLayout] = useState<RGL.Layout[]>([
        {i: now, x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 1, static: false},
    ]);
    const reportTemplates = useSelector(state => state.main.mainData);
    const dashboardSave = useSelector(state => state.dashboard.dashboardtemplateSave);

    useEffect(() => {
        dispatch(getCollection(getReportTemplateSel()));

        return () => {
            dispatch(resetMain());
            dispatch(resetSaveDashboardTemplate());
        };
    }, [dispatch]);

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
            history.push(paths.DASHBOARD);
        }
    }, [dashboardSave, history, t, dispatch]);

    const { register, unregister, formState: { errors }, getValues, setValue, handleSubmit } = useForm<Items>();

    const addItemOnClick = useCallback(() => {
        const newKey = Date.now().toString();
        setLayout(prev => ([
            ...prev,
            {
                i: newKey,
                x: (prev.length * 3) % 12,
                y: Infinity,
                w: 3,
                h: 2,
                minW: 2,
                minH: 1,
                static: false,
            },
        ]));
    }, []);

    const deleteItemOnClick = useCallback((key: string) => {
        setLayout(prev => prev.filter(e => e.i !== key));
    }, []);

    const onContinue = useCallback(() => {
        handleSubmit((data) => {
            console.log(data);
            setOpenModal(true);
        }, e => console.log('errores', e))();
    }, [handleSubmit]);

    const onSubmit = useCallback((description: string) => {
        const data = getValues();
        dispatch(saveDashboardTemplate(getDashboardTemplateIns({
            id: 0,
            description,
            detailjson: JSON.stringify(data),
            layoutjson: JSON.stringify(layout),
            status: 'ACTIVO',
            type: 'NINGUNO',
            operation: 'INSERT',
        })));
    }, [layout, getValues, dispatch]);

    return (
        <Box className={classes.root}>
            <TemplateBreadcrumbs
                breadcrumbs={[
                    { id: "view-1", name: "Dashboards" },
                    { id: "view-2", name: "Crear dashboard" }
                ]}
                handleClick={id => id === "view-1" && history.push(paths.DASHBOARD)}
            />
            <div className={classes.header}>
                <TitleDetail title="Nuevo dashboard" />
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
                    onClick={addItemOnClick}
                >
                    <Trans i18nKey={langKeys.add} />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onContinue}
                >
                    <Trans i18nKey={langKeys.continue} />
                </Button>
            </div>
            <div style={{ height: '1em' }} />
            <ReactGridLayout
                className={classes.layout}
                layout={layout}
                onLayoutChange={setLayout}
                cols={12}
                rowHeight={140}
            >
                {layout.map(e => (
                    <div key={e.i}>
                        <LayoutItem
                            layoutKey={e.i}
                            templates={reportTemplates.data as ReportTemplate[]}
                            loading={reportTemplates.loading}
                            register={register}
                            unregister={unregister}
                            getValues={getValues}
                            setValue={setValue}
                            errors={errors}
                            onDelete={() => deleteItemOnClick(e.i)}
                        />
                    </div>
                ))}
            </ReactGridLayout>
            <SubmitModal
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

const SubmitModal: FC<SubmitModalProps> = ({ open, loading, onClose, onSubmit }) => {
    const classes = useSubmitModalStyles();
    const [description, setDescription] = useState('');

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
                    Descripción
                </Typography>
                <TextField
                    id="dashboard-submit-modal-description"
                    placeholder="Ingrese la descripción"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    InputProps={{ readOnly: loading }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={() => onSubmit(description)}
                >
                    <Trans i18nKey={langKeys.save} />
                </Button>
            </Box>
        </Modal>
    );
}

interface LayoutItemProps {
    layoutKey: string;
    templates: ReportTemplate[];
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
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        justifyContent: 'center',
        overflow: 'auto',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        position: 'relative',
    },
    deleteBtn: {
        position: 'absolute',
        top: 1,
        right: 1,
    },
}));

const LayoutItem: FC<LayoutItemProps> = ({
    layoutKey: key,
    loading = false,
    templates = [],
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
    const [columns, setColumns] = useState<ColumnTemplate[]>([]);

    useEffect(() => {
        const mandatoryStrField = (value: string) => {
            return !value || value.length === 0 ? t(langKeys.field_required) : undefined;
        }

        const mandatoryNumField = (value: number) => {
            return value === 0 ? t(langKeys.field_required) : undefined;
        }

        register(`${key}.reporttemplateid`, { validate: mandatoryNumField, value: 0 });
        register(`${key}.grouping`, { validate: mandatoryStrField, value: '' });
        register(`${key}.graph`, { validate: mandatoryStrField, value: '' });
        register(`${key}.column`, { validate: mandatoryStrField, value: '' });

        return () => {
            unregister(key);
        };
    }, [register, unregister, t, key]);

    useEffect(() => {
        if (selectedIndex === -1) {
            setColumns([]);
            return;
        }
        setColumns(JSON.parse(templates[selectedIndex].columnjson) as ColumnTemplate[]);
    }, [selectedIndex, templates]);

    return (
        <div className={classes.root}>
            <IconButton className={classes.deleteBtn} onClick={onDelete} size="small">
                <CloseIcon style={{ width: 18, height: 18 }} />
            </IconButton>
            <FieldSelect
                label="Reporte"
                data={templates}
                optionDesc="description"
                optionValue="reporttemplateid"
                valueDefault={getValues(`${key}.reporttemplateid`)}
                onChange={(v: ReportTemplate) => {
                    const reporttemplateid = v?.reporttemplateid || 0;
                    setSelectedIndex(!v ? -1 : templates.findIndex(e => e === v));
                    setValue(`${key}.reporttemplateid`, reporttemplateid);
                    if (reporttemplateid === 0) {
                        setValue(`${key}.column`, '');
                    }
                }}
                error={errors[key]?.reporttemplateid?.message}
                disabled={loading}
            />
            <FieldSelect
                label="Agrupamiento"
                data={groupingType}
                optionDesc="key"
                optionValue="key"
                valueDefault={getValues(`${key}.grouping`)}
                onChange={(v: typeof groupingType[number]) => setValue(`${key}.grouping`, v?.key || '')}
                error={errors[key]?.grouping?.message}
                disabled={loading}
            />
            <FieldSelect
                label="Tipo de grafico"
                data={graphTypes}
                optionDesc="key"
                optionValue="key"
                valueDefault={getValues(`${key}.graph`)}
                onChange={(v: typeof graphTypes[number]) => setValue(`${key}.graph`, v?.key || '')}
                error={errors[key]?.graph?.message}
                disabled={loading}
            />
            <FieldSelect
                label="Column"
                data={columns}
                optionDesc="key"
                optionValue="value"
                valueDefault={getValues(`${key}.column`)}
                onChange={(v: ColumnTemplate) => setValue(`${key}.column`, v?.value || '')}
                error={errors[key]?.column?.message}
                disabled={loading || columns.length === 0}
            />
        </div>
    );
}

export default DashboardAdd;
