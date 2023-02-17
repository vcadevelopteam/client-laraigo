/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldEditArray, DialogZyx } from 'components';
import { insertReportTemplate, getColumnsOrigin } from 'common/helpers';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm, useFieldArray } from 'react-hook-form';
import { cleanViewChange, execute, getCollectionAux, setViewChange } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import VisibilityIcon from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import { SearchIcon } from 'icons';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Done } from '@material-ui/icons';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import Tooltip from '@material-ui/core/Tooltip';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailReportDesignerProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void
}

const dataSummarization = [
    { function: 'total', type: ["double precision", "bigint", "integer", "numeric", "interval"] },
    { function: 'count', type: ["double precision", "boolean", "timestamp without time zone", "character varying", "text", "bigint", "integer", "numeric", "date", "interval", "variable"] },
    { function: 'count_unique', type: ["double precision", "boolean", "timestamp without time zone", "character varying", "text", "bigint", "integer", "numeric", "date", "interval", "variable"] },
    { function: 'average', type: ["double precision", "bigint", "integer", "numeric", "interval"] },
    { function: 'minimum', type: ["double precision", "bigint", "integer", "numeric", "interval", "timestamp without time zone", "date"] },
    { function: 'maximum', type: ["double precision", "bigint", "integer", "numeric", "interval", "timestamp without time zone", "date"] },
    { function: 'median', type: ["double precision", "bigint", "integer", "numeric", "interval"] },
    { function: 'mode', type: ["double precision", "bigint", "integer", "numeric", "interval", "boolean", "character varying", "text", "variable"] },
];

const arrayBread = (view1: string, view2: string) => [
    { id: "view-1", name: view1 },
    { id: "view-2", name: view2 }
];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        // marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    title: {
        fontSize: '22px',
        color: theme.palette.text.primary,
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    variableInfo: {
        flex: '0 0 150px',
        padding: '2px 4px',
        overflowX: 'hidden',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#e1e1e1'
        }
    },
    itemSelected: {
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.5,
        paddingTop: 10.5,
        paddingBottom: 10.5
    },
    nodata: {
        color: '#898989',
        width: '100%',
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    colorVariable: {
        color: '#7721AD'
    }
}));

type IColumnTemplate = {
    columnname: string;
    description: string;
    join_alias: string;
    join_on: string;
    join_table: string;
    tablename: string;
    type: string;
    alias: string;
    id: any;
}

type IFilter = {
    description: string;
    columnname: string;
    type: string;
    id: any;
    filter: string;
    join_alias: string;
    type_filter: string;
    join_on: string;
    join_table: string;
}

type ISummarization = {
    columnname: string;
    type: string;
    description: string;
    function: string;
    id: any;
}

type FormFields = {
    reporttemplateid: number;
    description: string;
    status: string;
    startdate: string;
    finishdate: string;
    usergroup: string;
    channels: string;
    tags: string;
    operation: string;
    dataorigin: string;
    columns: IColumnTemplate[],
    filters: IFilter[],
    summary: ISummarization[],
}

const DialogManageColumns: React.FC<{
    setOpenDialogVariables: (param: any) => void;
    setColumnsSelected: (param: any) => void;
    openDialogVariables: boolean;
    columnsAlreadySelected: IColumnTemplate[];
}> = ({ setOpenDialogVariables, openDialogVariables, setColumnsSelected, columnsAlreadySelected }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const mainAuxRes = useSelector(state => state.main.mainAux);
    const [columnsTable, setColumnsTable] = useState<Dictionary[]>([]);
    const [showcolumnsTable, setShowColumnsTable] = useState<Dictionary[]>([]);
    const [columnsToAdd, setColumnsToAdd] = useState<Dictionary>({});
    const [columnsAdded, setColumnsAdded] = useState<Dictionary[]>([]);
    const timeOut = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!mainAuxRes.error && !mainAuxRes.loading && mainAuxRes.key === "UFN_REPORT_PERSONALIZED_COLUMNS_SEL" && openDialogVariables) {
            const datafiltered = mainAuxRes.data.filter(x => columnsAlreadySelected.findIndex(y => y.columnname === x.columnname) === -1);

            const columnsVariable = datafiltered.filter(x => x.type === "variable");
            const columnsNotVariable = datafiltered.filter(x => x.type !== "variable");

            const dataaux = [...columnsNotVariable, ...columnsVariable].map(x => ({
                ...x,
                descriptionT: x.type === "variable" ? x.description : t(`personalizedreport_${x.description}`),
                checked: false
            }))
            setColumnsTable(dataaux);
            setShowColumnsTable(dataaux);

            setColumnsToAdd({});
            setColumnsAdded([]);
        }
    }, [mainAuxRes, openDialogVariables])

    useEffect(() => {
        const columnsAddedIndexed = columnsAdded.reduce((acc, item) => ({
            ...acc,
            [item.columnname]: item
        }), {})
        setShowColumnsTable(prev => prev.map((x: Dictionary) => columnsAddedIndexed[x.columnname] ? { ...x, disabled: true, checked: true } : { ...x, disabled: false, checked: false }));
        setColumnsTable(prev => prev.map((x: Dictionary) => columnsAddedIndexed[x.columnname] ? { ...x, disabled: true, checked: true } : { ...x, disabled: false, checked: false }));
        setColumnsToAdd({});
    }, [columnsAdded])

    const handleChange = (text: string) => {
        if (text === '')
            setShowColumnsTable(columnsTable);
        else
            setShowColumnsTable(columnsTable.filter(x => x.descriptionT.toLowerCase().includes(text.toLowerCase())));
    }

    const onChange = (text: string) => {
        if (timeOut.current)
            clearTimeout(timeOut.current);

        timeOut.current = setTimeout(() => {
            handleChange(text);
            if (timeOut.current) {
                clearTimeout(timeOut.current);
                timeOut.current = null;
            }
        }, 1000);
    };

    const handlerChecked = React.useCallback((column: Dictionary, checked: boolean) => {
        if (checked)
            setColumnsToAdd(prev => ({
                ...prev,
                [column.columnname]: column
            }));
        else {
            setColumnsToAdd(prev => {
                const tmp = { ...prev };
                delete tmp[column.columnname];
                return tmp
            });
        }
    }, [setColumnsToAdd])

    const RenderRow = React.useCallback(
        ({ index, style }) => {
            const item = showcolumnsTable[index]

            return (
                <div key={item.columnname} style={style}>
                    <div key={item.columnname} style={{ width: '100%' }}>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    size='small'
                                    checked={!!columnsToAdd[item.columnname] || !!item.disabled}
                                    disabled={!!item.disabled}
                                    color="primary"
                                    onChange={(e) => handlerChecked(item, e.target.checked)}
                                    name="checkedA" />
                            )}
                            label={<div className={clsx({
                                [classes.colorVariable]: item.type === "variable"
                            })}>{item.descriptionT}</div>}
                        />
                    </div>
                </div>
            )
        },
        [showcolumnsTable, columnsToAdd]
    )

    if (!openDialogVariables)
        return null;

    return (
        <DialogZyx
            maxWidth="md"
            open={openDialogVariables}
            title=""
            button2Type="submit"
            buttonText1={t(langKeys.cancel)}
            handleClickButton2={(e) => {
                e.preventDefault();
            }}
            handleClickButton1={(e) => setOpenDialogVariables(false)}
        >
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, padding: 16, paddingTop: 16, paddingBottom: 8 }}>
                    <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>
                        {t(langKeys.available_columns)}
                    </div>
                    <div>
                        <FieldEdit
                            variant='standard'
                            fregister={{
                                placeholder: t(langKeys.search)
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                            onChange={onChange}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', height: 320, overflowY: 'auto', marginTop: 4 }}>
                            <AutoSizer>
                                {({ height, width }: any) => (
                                    <FixedSizeList
                                        width={width}
                                        height={height}
                                        itemCount={showcolumnsTable.length}
                                        itemSize={42}
                                    >
                                        {RenderRow}
                                    </FixedSizeList>
                                )}
                            </AutoSizer>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={Object.keys(columnsToAdd).length === 0}
                                startIcon={<AddIcon color="secondary" />}
                                onClick={() => setColumnsAdded(prev => ([...prev, ...Object.values(columnsToAdd)]))}
                            >{t(langKeys.add)}
                            </Button>
                        </div>

                    </div>
                </div>
                <div style={{ flex: 1, backgroundColor: '#f5f5f5', paddingTop: 48 }}>
                    <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                        <div style={{ height: 35, borderBottom: '1px solid rgba(0, 0, 0, 0.42)', color: 'rgb(167 166 170)', display: 'flex', alignItems: 'center' }}>
                            {t(langKeys.selected_plural)} ({columnsAdded.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', marginTop: 4, height: 320, marginBottom: 4 }}>
                            {columnsAdded.length === 0 ? (
                                <div className={classes.nodata}>
                                    {t(langKeys.select_a_field_then_add_it)}
                                </div>
                            ) : columnsAdded.map((item) => (
                                <div key={item.columnname} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className={classes.itemSelected}>
                                        {item.descriptionT}
                                    </div>
                                    <IconButton size='small' onClick={() => {
                                        setColumnsAdded(prev => prev.filter(x => x.columnname !== item.columnname))
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={columnsAdded.length === 0}
                                startIcon={<Done color="secondary" />}
                                onClick={() => {
                                    setColumnsSelected(columnsAdded);
                                    setOpenDialogVariables(false);
                                }}
                            >{t(langKeys.accept)}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DialogZyx>
    )
}

const DetailReportDesigner: React.FC<DetailReportDesignerProps> = ({ data: { row, edit }, setViewSelected, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [openDialogVariables, setOpenDialogVariables] = useState(false);
    const [columnsSelected, setColumnsSelected] = useState<Dictionary[]>([]);
    const [dataColumns, setDataColumns] = useState<Dictionary[]>([]);
    const mainAuxRes = useSelector(state => state.main.mainAux);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();


    const dataStatus = multiDataAux.data?.[0] && multiDataAux.data?.[0].success ? multiDataAux.data?.[0].data : [];
    const dataTables = multiDataAux.data?.[1] && multiDataAux.data?.[1].success ? multiDataAux.data?.[1].data : [];

    useEffect(() => {
        dispatch(setViewChange("create_custom_report"))
        return () => {
            dispatch(cleanViewChange());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!mainAuxRes.error && !mainAuxRes.loading && mainAuxRes.key === "UFN_REPORT_PERSONALIZED_COLUMNS_SEL") {
            setDataColumns(mainAuxRes.data.map(x => ({
                ...x,
                descriptionT: x.type === "variable" ? x.description : t(`personalizedreport_${x.description}`)
            })));
        }
    }, [mainAuxRes])

    const { control, register, trigger, handleSubmit, setValue, getValues, formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            reporttemplateid: row?.reporttemplateid || 0,
            description: row?.description || '',
            status: row?.status || 'ACTIVO',
            dataorigin: row?.dataorigin || '',
            columns: row?.columns || [],
            filters: row?.filters || [],
            summary: row?.summary || [],
            operation: row?.reporttemplateid ? "EDIT" : "INSERT"
        }
    });

    const { fields: fieldsColumns, append: columnsAppend, remove: columnRemove, move } = useFieldArray({
        control,
        name: 'columns',
    });

    const { fields: fieldsFilters, append: filtersAppend, remove: filterRemove } = useFieldArray({
        control,
        name: 'filters',
    });

    const { fields: fieldsSummarization, append: summaryAppend, remove: summarizationRemove } = useFieldArray({
        control,
        name: 'summary',
    });

    useEffect(() => {
        setValue("columns", row?.columns || []);
        trigger("columns");
        setValue("filters", row?.filters || []);
        trigger("filters");
        setValue("summary", row?.summaries || []);
        trigger("summary");
    }, [])


    useEffect(() => {
        if (columnsSelected.length > 0) {
            columnsAppend(columnsSelected.map(x => ({ ...x, alias: x.descriptionT })));
        }
    }, [columnsSelected]);

    React.useEffect(() => {
        register('description', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('dataorigin', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.report_name).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const { reporttemplateid, description, status, columns, filters, summary, dataorigin } = data;
        if (columns.length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.column_at_least_required) }))
            return;
        }
        const callback = () => {
            dispatch(execute(insertReportTemplate({
                id: reporttemplateid,
                description,
                status,
                type: '',
                dataorigin,
                filterjson: JSON.stringify(filters),
                summaryjson: JSON.stringify(summary),
                columnjson: JSON.stringify(columns),
                operation: data.operation
            })));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const selectDataOrigin = (tablename: string) => {
        setValue('dataorigin', tablename);
        if (tablename)
            dispatch(getCollectionAux(getColumnsOrigin(tablename)));
        else
            setDataColumns([]);
    }

    const handleDrag = (data: any) => {
        const { source, destination } = data
        if (destination) {
            move(source.index, destination.index);
        }
    };

    return (
        <>
            <div style={{ width: '100%' }}>
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <TemplateBreadcrumbs
                                breadcrumbs={arrayBread(t(langKeys.report_plural), (row?.reporttemplateid ? t(langKeys.edit) : t(langKeys.new)) + " " + t(langKeys.report).toLocaleLowerCase())}
                                handleClick={setViewSelected}
                            />
                            <TitleDetail
                                title={row ? `${row.description}` : t(langKeys.new_report_designer)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                startIcon={<ClearIcon color="secondary" />}
                                style={{ backgroundColor: "#FB5F5F" }}
                                onClick={() => setViewSelected("view-1")}
                            >{t(langKeys.back)}</Button>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        </div>
                    </div>
                    <div className={`row-zyx ${classes.containerDetail}`} style={{ marginBottom: 0 }}>
                        <FieldEdit
                            label={t(langKeys.title)}
                            className="col-4"
                            onChange={(value) => setValue('description', value)}
                            valueDefault={row ? (row.description || "") : ""}
                            error={errors?.description?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.data_origin)}
                            className="col-4"
                            valueDefault={row?.dataorigin || 'ACTIVO'}
                            onChange={(value) => selectDataOrigin(value ? value.tablename : '')}
                            error={errors?.dataorigin?.message}
                            disabled={!!row?.reporttemplateid}
                            data={dataTables}
                            triggerOnChangeOnFirst={true}
                            optionDesc="tablename"
                            optionValue="tablename"
                        />
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-4"
                            valueDefault={row?.status || 'ACTIVO'}
                            onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                            error={errors?.status?.message}
                            data={dataStatus}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className={classes.containerDetail}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={classes.title}>{t(langKeys.column_plural)}</div>
                        </div>

                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                disabled={mainAuxRes.loading || dataColumns.length === 0}
                                                onClick={async () => setOpenDialogVariables(true)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{t(langKeys.column)}</TableCell>
                                        <TableCell>{t(langKeys.description)}</TableCell>
                                        <TableCell>{t(langKeys.type)}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <DragDropContext onDragEnd={handleDrag}>
                                    <Droppable droppableId="test-items">
                                        {(provided: any, snapshot: any) => (
                                            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                                {fieldsColumns.map((item: IColumnTemplate, index: number) => {
                                                    return (
                                                        <Draggable
                                                            key={`item-${index}`}
                                                            draggableId={`item-${index}`}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <TableRow
                                                                    key={`item-${index}`}
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                >
                                                                    <TableCell width={20} style={{ padding: '0' }}
                                                                        {...provided.dragHandleProps}>
                                                                        <div style={{ display: 'flex' }}>
                                                                            <Tooltip title={`${t(langKeys.move)}`}>
                                                                                <IconButton
                                                                                    size="small"
                                                                                >
                                                                                    <DragIndicatorIcon style={{ color: '#777777', cursor: 'grab' }} />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell width={30}>
                                                                        <div style={{ display: 'flex' }}>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => columnRemove(index)}
                                                                            >
                                                                                <DeleteIcon style={{ color: '#777777' }} />
                                                                            </IconButton>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell width={230}>
                                                                        {item?.type === "variable" ? item?.description : t(`personalizedreport_${item?.description}`)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <FieldEditArray
                                                                            fregister={{
                                                                                ...register(`columns.${index}.alias`, {
                                                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                                                }),
                                                                            }}
                                                                            valueDefault={item?.alias}
                                                                            error={errors?.columns?.[index]?.alias?.message}
                                                                            onChange={(value) => setValue(`columns.${index}.alias`, value)}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {t(`typepg_${item?.type}`)}
                                                                    </TableCell>
                                                                </TableRow>)}
                                                        </Draggable>
                                                    )
                                                }
                                                )}
                                                {provided.placeholder}
                                            </TableBody>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Table>
                        </TableContainer>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ flex: .55 }} className={classes.containerDetail}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className={classes.title}>{t(langKeys.filters)}</div>
                            </div>
                            <div>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={async () => {
                                                            const haveDataOrigin = await trigger('dataorigin');
                                                            if (haveDataOrigin) {
                                                                filtersAppend({ columnname: '', type: '', type_filter: '', description: '', filter: '' });
                                                            }
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>{t(langKeys.column)}</TableCell>
                                                <TableCell>{t(langKeys.typefilter)}</TableCell>
                                                <TableCell>{t(langKeys.filters)}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody style={{ marginTop: 5 }}>
                                            {fieldsFilters.map((item: IFilter, i: number) =>
                                                <TableRow key={item.id}>
                                                    <TableCell width={30}>
                                                        <div style={{ display: 'flex' }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => { filterRemove(i) }}
                                                            >
                                                                <DeleteIcon style={{ color: '#777777' }} />
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell >
                                                        <FieldSelect
                                                            label={t(langKeys.column)}
                                                            valueDefault={getValues(`filters.${i}.columnname`)}
                                                            fregister={{
                                                                ...register(`filters.${i}.columnname`, {
                                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                                })
                                                            }}
                                                            variant='outlined'
                                                            onChange={(value) => {
                                                                setValue(`filters.${i}.columnname`, value?.columnname || '');
                                                                setValue(`filters.${i}.description`, value?.description || '');
                                                                setValue(`filters.${i}.type`, value?.type || '');
                                                                setValue(`filters.${i}.join_alias`, value?.join_alias || '');
                                                                setValue(`filters.${i}.join_on`, value?.join_on || '');
                                                                setValue(`filters.${i}.join_table`, value?.join_table || '');
                                                            }}
                                                            error={errors?.filters?.[i]?.columnname?.message}
                                                            data={dataColumns}
                                                            optionDesc="descriptionT"
                                                            optionValue="columnname"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {!["date", "timestamp without time zone"].includes(getValues(`filters.${i}.type`)) &&
                                                            <FieldSelect
                                                                label={t(langKeys.typefilter)}
                                                                valueDefault={getValues(`filters.${i}.type_filter`)}
                                                                fregister={{
                                                                    ...register(`filters.${i}.type_filter`, {
                                                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                                    })
                                                                }}
                                                                variant='outlined'
                                                                onChange={(value) => {
                                                                    setValue(`filters.${i}.type_filter`, value?.key || '');
                                                                    trigger(`filters.${i}.type_filter`);

                                                                    setValue(`filters.${i}.filter`, '');
                                                                    trigger(`filters.${i}.filter`);
                                                                }}
                                                                error={errors?.filters?.[i]?.type_filter?.message}
                                                                data={[{ key: "text" }, { key: "unique_value" }]}
                                                                optionDesc="key"
                                                                uset={true}
                                                                prefixTranslation="filter_"
                                                                optionValue="key"
                                                            />
                                                        }
                                                    </TableCell>
                                                    <TableCell style={{ width: 200 }}>
                                                        {(getValues(`filters.${i}.type_filter`) === "text" && !["date", "timestamp without time zone"].includes(getValues(`filters.${i}.type`))) &&
                                                            <FieldEditArray
                                                                fregister={{
                                                                    ...register(`filters.${i}.filter`),
                                                                }}
                                                                valueDefault={getValues(`filters.${i}.filter`)}
                                                                error={errors?.filters?.[i]?.filter?.message}
                                                                onChange={(value) => setValue(`filters.${i}.filter`, value)}
                                                            />
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>

                        <div style={{ flex: .45 }} className={classes.containerDetail}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className={classes.title}>{t(langKeys.summarization)}</div>
                            </div>
                            <div>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={async () => {
                                                            const haveDataOrigin = await trigger('dataorigin');
                                                            if (haveDataOrigin) {
                                                                summaryAppend({ columnname: '', function: '' });
                                                            }
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>{t(langKeys.column)}</TableCell>
                                                <TableCell>{t(langKeys.function)}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fieldsSummarization.map((item: ISummarization, i: number) =>
                                                <TableRow key={item.id}>
                                                    <TableCell width={30}>
                                                        <div style={{ display: 'flex' }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => summarizationRemove(i)}
                                                            >
                                                                <DeleteIcon style={{ color: '#777777' }} />
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldSelect
                                                            label={t(langKeys.column)}
                                                            multiline={true}
                                                            valueDefault={getValues(`summary.${i}.columnname`)}
                                                            fregister={{
                                                                ...register(`summary.${i}.columnname`, {
                                                                    validate: {
                                                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required),
                                                                        fieldexists: (value: any) => (value && fieldsColumns.map(f => f.columnname).includes(value)) || t(langKeys.columnnotvalid),
                                                                    }
                                                                })
                                                            }}
                                                            variant='outlined'
                                                            onChange={(value) => {
                                                                setValue(`summary.${i}.type`, value?.type || '');
                                                                setValue(`summary.${i}.columnname`, value?.columnname || '');
                                                                trigger(`summary.${i}.type`)
                                                            }}
                                                            error={errors?.summary?.[i]?.columnname?.message}
                                                            data={fieldsColumns}
                                                            optionDesc="descriptionT"
                                                            optionValue="columnname"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FieldSelect
                                                            label={t(langKeys.function)}
                                                            valueDefault={getValues(`summary.${i}.function`)}
                                                            fregister={{
                                                                ...register(`summary.${i}.function`, {
                                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                                })
                                                            }}
                                                            variant='outlined'
                                                            onChange={(value) => setValue(`summary.${i}.function`, value?.function || '')}
                                                            error={errors?.summary?.[i]?.function?.message}
                                                            data={dataSummarization.filter(x => x.type.includes(getValues(`summary.${i}.type`)))}
                                                            prefixTranslation="function_"
                                                            uset={true}
                                                            optionDesc="function"
                                                            optionValue="function"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <DialogManageColumns
                setOpenDialogVariables={setOpenDialogVariables}
                openDialogVariables={openDialogVariables}
                columnsAlreadySelected={fieldsColumns}
                setColumnsSelected={setColumnsSelected}
            />
        </>
    );
}

export const TemplateIcons: React.FC<{
    viewFunction?: (param: any) => void;
    deleteFunction?: (param: any) => void;
    editFunction?: (param: any) => void;
    reportFunction?: (param: any) => void;
}> = ({ viewFunction, deleteFunction, editFunction, reportFunction }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ whiteSpace: 'nowrap', display: 'flex' }}>

            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={editFunction}
            >
                <VisibilityIcon style={{ color: '#B6B4BA' }} />
            </IconButton>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={reportFunction}
            >
                <PlayArrowIcon style={{ color: '#B6B4BA' }} />
            </IconButton>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                style={{ display: deleteFunction ? 'block' : 'none' }}
            >
                <MoreVertIcon style={{ color: '#B6B4BA' }} />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                    deleteFunction && deleteFunction(e)
                }}><Trans i18nKey={langKeys.delete} /></MenuItem>
            </Menu>
        </div>
    )
}

export default DetailReportDesigner;