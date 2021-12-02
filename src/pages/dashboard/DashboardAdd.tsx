import { Box, Button, IconButton, makeStyles } from "@material-ui/core";
import paths from "common/constants/paths";
import { FieldSelect, TemplateBreadcrumbs, TitleDetail } from "components";
import { FC, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import RGL, { WidthProvider } from 'react-grid-layout';
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { Close as CloseIcon } from "@material-ui/icons";
import { FieldErrors, useForm, UseFormRegister, UseFormSetValue, UseFormUnregister } from "react-hook-form";

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
        // margin: 6,
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
    },
}));

interface Item {
    report: string;
    grouping: string;
    graph: string;
    column: string;
}

interface Items {
    [key: string]: Item;
}

const DashboardAdd: FC = () => {
    const classes = useDashboardAddStyles();
    const history = useHistory();
    const now = Date.now().toString();
    const [layout, setLayout] = useState<RGL.Layout[]>([
        {i: now, x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 1, static: false},
        // {i: '1', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 1, static: false},
        // {i: '2', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 1, static: false},
    ]);

    const { register, unregister, formState: { errors }, setValue, handleSubmit } = useForm<Items>({
        defaultValues: {
            [now]: { report: '', grouping: '', column: '', graph: '' },
        },
    });

    const addItemOnClick = useCallback(() => {
        const newKey = Date.now().toString();
        setLayout(prevLayout => {
            setValue(newKey, { report: '', grouping: '', column: '', graph: '' });
            return [
                ...prevLayout,
                {
                    i: newKey,
                    x: (prevLayout.length * 3) % 12,
                    y: Infinity,
                    w: 3,
                    h: 2,
                    minW: 2,
                    minH: 1,
                    static: false,
                },
            ];
        });
    }, [setValue]);

    const deleteItemOnClick = useCallback((key: string) => {
        setLayout(prevLayout => {
            // unregister
            // form.setValue(key, undefined);
            return prevLayout.filter(e => e.i !== key);
        });
    }, []);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    }, e => console.log('errores', e));

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
                    color="primary"
                    onClick={addItemOnClick}
                >
                    <Trans i18nKey={langKeys.add} />
                </Button>
                <div style={{ width: '1em' }} />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                >
                    <Trans i18nKey={langKeys.save} />
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
                            register={register}
                            unregister={unregister}
                            setValue={setValue}
                            errors={errors}
                            onDelete={() => deleteItemOnClick(e.i)}
                        />
                    </div>
                ))}
            </ReactGridLayout>
        </Box>
    );
}

interface LayoutItemProps {
    layoutKey: string;
    errors: FieldErrors<Items>;
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

const LayoutItem: FC<LayoutItemProps> = ({ layoutKey: key, errors, setValue, register, unregister, onDelete }) => {
    const classes = useLayoutItemStyles();
    const { t } = useTranslation();

    useEffect(() => {
        const mandatoryStrField = (value: string) => {
            return !value || value.length === 0 ? t(langKeys.field_required) : undefined;
        }

        register(`${key}.report`, { validate: mandatoryStrField/*, value: {}*/ });
        register(`${key}.grouping`, { validate: mandatoryStrField });
        register(`${key}.graph`, { validate: mandatoryStrField });
        register(`${key}.column`, { validate: mandatoryStrField });

        return () => {
            unregister(`${key}.report`);
            unregister(`${key}.grouping`);
            unregister(`${key}.graph`);
            unregister(`${key}.column`);
        };
    }, [register, unregister, t, key]);

    return (
        <div className={classes.root}>
            <IconButton className={classes.deleteBtn} onClick={onDelete} size="small">
                <CloseIcon style={{ width: 18, height: 18 }} />
            </IconButton>
            <FieldSelect
                label="Reporte"
                data={[{key: '1'}]}
                optionDesc="key"
                optionValue="key"
                onChange={v => setValue(`${key}.report`, v)}
                error={errors[key]?.report?.message}
            />
            <FieldSelect
                label="Agrupamiento"
                data={[]}
                optionDesc=""
                optionValue=""
                error={errors[key]?.grouping?.message}
            />
            <FieldSelect
                label="Tipo de grafico"
                data={[]}
                optionDesc=""
                optionValue=""
                error={errors[key]?.graph?.message}
            />
            <FieldSelect
                label="Column"
                data={[]}
                optionDesc=""
                optionValue=""
                error={errors[key]?.column?.message}
            />
        </div>
    );
}

export default DashboardAdd;
