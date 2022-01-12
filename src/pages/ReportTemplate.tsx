/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldEditArray, TemplateSwitchArray, TemplateSwitch } from 'components';
import { insertReportTemplate, getColumnsOrigin } from 'common/helpers';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import SaveIcon from '@material-ui/icons/Save';
import { variablesTemplate } from 'common/constants'
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm, useFieldArray } from 'react-hook-form';
import { execute, getCollectionAux } from 'store/main/actions';
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
import { DialogZyx, AntTab } from 'components'
import VisibilityIcon from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import { SearchIcon } from 'icons';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailReportDesignerProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}

const arrayBread = [
    { id: "view-1", name: "Reports" },
    { id: "view-2", name: "Create a report" }
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
    }
}));

type IColumnTemplate = {
    key: string;
    value: string;
    filter: string;
    hasFilter: boolean;
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
    columns: IColumnTemplate[]
}

const DialogManageColumns: React.FC<{
    setOpenDialogVariables: (param: any) => void;
    handlerNewColumn: (param: any) => void;
    openDialogVariables: boolean;
}> = ({ setOpenDialogVariables, openDialogVariables, handlerNewColumn }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const mainAuxRes = useSelector(state => state.main.mainAux);
    const [columnsTable, setColumnsTable] = useState<Dictionary[]>([]);
    const [showcolumnsTable, setShowColumnsTable] = useState<Dictionary[]>([]);
    const [columnsToAdd, setColumnsToAdd] = useState<Dictionary>({});
    const [columnsAdded, setColumnsAdded] = useState<Dictionary[]>([]);
    const timeOut = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!mainAuxRes.error && !mainAuxRes.loading && mainAuxRes.key === "UFN_REPORT_PERSONALIZED_COLUMNS_SEL") {
            setColumnsTable(mainAuxRes.data);
            setShowColumnsTable(mainAuxRes.data);
        }
    }, [mainAuxRes])

    useEffect(() => {
        if (openDialogVariables) {
            setColumnsToAdd({});
            setColumnsAdded([]);
        }
    }, [openDialogVariables])

    useEffect(() => {
        setShowColumnsTable(prev => prev.map((x: Dictionary) => columnsAdded.find(y => y.columnname === x.columnname) ? { ...x, disabled: true } : x));
        setColumnsTable(prev => prev.map((x: Dictionary) => columnsAdded.find(y => y.columnname === x.columnname) ? { ...x, disabled: true } : x));
        setColumnsToAdd({});
    }, [columnsAdded])

    const handleChange = (text: string) => {
        if (text === '')
            setShowColumnsTable(columnsTable);
        else
            setShowColumnsTable(columnsTable.filter(x => x.description.toLowerCase().includes(text.toLowerCase())));
    }

    const onChange = (text: string) => {
        if (timeOut.current) clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => {
            handleChange(text);
            if (timeOut.current) {
                clearTimeout(timeOut.current);
                timeOut.current = null;
            }
        }, 1000);;
    };

    const handlerChecked = React.useCallback((column: Dictionary, checked: boolean) => {
        if (checked)
            setColumnsToAdd(prev => ({
                ...prev,
                [column.columnname]: column
            }));
        else
            delete columnsToAdd[column.columnname];
    }, [setColumnsToAdd])

    console.log(columnsToAdd);

    return (
        <DialogZyx
            maxWidth="md"
            open={openDialogVariables}
            title=""
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenDialogVariables(false)}
        >
            <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 300, overflowY: 'auto', marginTop: 4 }}>
                        {showcolumnsTable.map((item, index) => (
                            <div key={item.columnname} style={{ width: '100%' }}>
                                <FormControlLabel
                                    control={(
                                        <Checkbox
                                            size='small'
                                            disabled={!!item.disabled}
                                            // checked={filterCheckBox.ASIGNADO}
                                            color="primary"
                                            onChange={(e) => handlerChecked(item, e.target.checked)}
                                            name="checkedA" />
                                    )}
                                    label={item.description}
                                />
                            </div>
                        ))}
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
                <div style={{ flex: 1 }}>
                    <div style={{ height: 35, borderBottom: '1px solid rgba(0, 0, 0, 0.42)', color: 'rgb(167 166 170)', display: 'flex', alignItems: 'center' }}>
                        Seleccionados ({columnsAdded.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 300, overflowY: 'auto', marginTop: 4 }}>
                        {columnsAdded.map((item, index) => (
                            <div key={item.columnname} className={classes.itemSelected}>
                                {item.description}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DialogZyx>
    )
}

const DetailReportDesigner: React.FC<DetailReportDesignerProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [openDialogVariables, setOpenDialogVariables] = useState(false);

    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataTables = multiData[4] && multiData[4].success ? multiData[4].data : [];

    const { control, register, trigger, handleSubmit, setValue, getValues, formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            reporttemplateid: row?.reporttemplateid || 0,
            description: row?.description || '',
            status: row?.status || 'ACTIVO',
            dataorigin: row?.dataorigin || '',
            startdate: row?.startdate || false,
            finishdate: row?.finishdate || false,
            usergroup: row?.usergroup || false,
            channels: row?.channels || false,
            tags: row?.tags || false,
            columns: row?.columns || [],
            operation: row ? "EDIT" : "INSERT"
        }
    });

    const { fields, append: fieldsAppend, remove: fieldRemove } = useFieldArray({
        control,
        name: 'columns',
    });

    React.useEffect(() => {
        register('description', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('dataorigin', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length > 0) || "" + t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const { reporttemplateid, description, status, startdate, finishdate, usergroup, channels, tags, operation, columns } = data;
        const filters = { startdate, finishdate, usergroup, channels, tags, operation }

        if (columns.length === 0) {
            return;
        }
        const callback = () => {
            dispatch(execute(insertReportTemplate({
                id: reporttemplateid,
                description,
                status,
                type: '',
                columnjson: JSON.stringify(columns),
                filterjson: JSON.stringify(filters),
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

    const handlerNewColumn = (item: Dictionary | null | undefined = null) => fieldsAppend({ key: item?.key || '', value: item?.value || '', filter: '', hasFilter: false });

    const handlerDeleteColumn = (index: number) => {
        fieldRemove(index)
    };

    const selectDataOrigin = (tablename: string) => {
        setValue('dataorigin', tablename);
        if (tablename)
            dispatch(getCollectionAux(getColumnsOrigin(tablename)));
    }

    return (
        <>
            <div style={{ width: '100%' }}>
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <TemplateBreadcrumbs
                                breadcrumbs={arrayBread}
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
                            label={t(langKeys.title)} //transformar a multiselect
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
                            data={dataTables}
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
                            {/* <IconButton onClick={() => setOpenDialogVariables(true)}>
                                <InfoIcon />
                            </IconButton> */}
                        </div>
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
                                                        setOpenDialogVariables(true);
                                                    }
                                                }}
                                            >
                                                <AddIcon color="primary" />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{t(langKeys.name)}</TableCell>
                                        <TableCell>{t(langKeys.description)}</TableCell>
                                        <TableCell style={{ maxWidth: 200 }}>{t(langKeys.filters)}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields.map((item: IColumnTemplate, i) =>
                                        <TableRow key={item.id}>
                                            <TableCell width={30}>
                                                <div style={{ display: 'flex' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handlerDeleteColumn(i)}
                                                    >
                                                        <DeleteIcon style={{ color: '#777777' }} />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    fregister={{
                                                        ...register(`columns.${i}.key`, {
                                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                        })
                                                    }}
                                                    valueDefault={item.key}
                                                    error={errors?.columns?.[i]?.key?.message}
                                                    onChange={(value) => setValue(`columns.${i}.key`, "" + value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FieldEditArray
                                                    fregister={{
                                                        ...register(`columns.${i}.value`, {
                                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                        }),
                                                    }}
                                                    valueDefault={item.value}
                                                    error={errors?.columns?.[i]?.value?.message}
                                                    onChange={(value) => setValue(`columns.${i}.value`, value)}
                                                />
                                            </TableCell>
                                            <TableCell style={{ maxWidth: 200 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <TemplateSwitchArray
                                                        error={errors?.columns?.[i]?.hasFilter?.message}
                                                        fregister={{
                                                            ...register(`columns.${i}.hasFilter`)
                                                        }}
                                                        label=""
                                                        onChange={(value) => {
                                                            setValue(`columns.${i}.hasFilter`, value);
                                                            trigger(`columns.${i}.hasFilter`)
                                                            if (!value) {
                                                                setValue(`columns.${i}.filter`, "");
                                                                trigger(`columns.${i}.filter`)
                                                            }
                                                        }}
                                                        defaultValue={item.hasFilter}
                                                    />
                                                    {getValues(`columns.${i}.hasFilter`) &&
                                                        <FieldEditArray
                                                            fregister={{
                                                                ...register(`columns.${i}.filter`, {
                                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                                })
                                                            }}
                                                            style={{ flex: 1 }}
                                                            valueDefault={item.filter}
                                                            error={errors?.columns?.[i]?.filter?.message}
                                                            onChange={(value) => setValue(`columns.${i}.filter`, value)}
                                                        />
                                                    }
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </form>
            </div>
            <DialogManageColumns
                setOpenDialogVariables={setOpenDialogVariables}
                openDialogVariables={openDialogVariables}
                handlerNewColumn={handlerNewColumn}
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