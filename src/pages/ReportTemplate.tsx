/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldEditArray, TemplateSwitchArray, TemplateSwitch } from 'components';
import {insertReportTemplate} from 'common/helpers';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import SaveIcon from '@material-ui/icons/Save';
import { variablesTemplate } from 'common/constants'
import { useTranslation, Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm, useFieldArray } from 'react-hook-form';
import { execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { DialogZyx, AntTab } from 'components'
import VisibilityIcon from '@material-ui/icons/Visibility';

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
    columns: IColumnTemplate[]
}

const DialogVariables: React.FC<{
    setOpenDialogVariables: (param: any) => void;
    handlerNewColumn: (param: any) => void;
    openDialogVariables: boolean;
}> = ({ setOpenDialogVariables, openDialogVariables, handlerNewColumn }) => {
    const classes = useStyles();
    const [pageSelected, setPageSelected] = useState(0);
    const { t } = useTranslation();
    const [variablesToShow, setVariablesToShow] = useState<Dictionary[]>([])

    useEffect(() => {
        if (pageSelected === 0) {
            setVariablesToShow(variablesTemplate.filter(x => x.group === "personinformation"))
        } else if (pageSelected === 1) {
            setVariablesToShow(variablesTemplate.filter(x => x.group === "ticketinformation"))
        } else if (pageSelected === 2) {
            setVariablesToShow(variablesTemplate.filter(x => x.group === "AIservices"))
        } else if (pageSelected === 3) {
            setVariablesToShow(variablesTemplate.filter(x => x.group === "systemvariables"))
        } else if (pageSelected === 4) {
            setVariablesToShow(variablesTemplate.filter(x => x.group === "odoovariables"))
        }
    }, [pageSelected])

    return (
        <DialogZyx
            open={openDialogVariables}
            title=""
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenDialogVariables(false)}
        >
            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED' }}
                textColor="primary"
                onChange={(_, value) => setPageSelected(value)}
            >
                <AntTab label={t(langKeys.personinformation)} />
                <AntTab label={t(langKeys.ticketinformation)} />
                <AntTab label={t(langKeys.AIservices)} />
                <AntTab label={t(langKeys.systemvariables)} />
                <AntTab label={t(langKeys.odoovariables)} />
            </Tabs>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingTop: 16, justifyContent: 'center' }}>
                {variablesToShow.map((x, index) => (
                    <div
                        key={index}
                        className={classes.variableInfo}
                        onClick={() => handlerNewColumn({ key: x.variable, value: x.variable })}
                    >
                        {x.variable}
                    </div>
                ))}
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

    const { control, register, trigger, handleSubmit, setValue, getValues, formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            reporttemplateid: row?.reporttemplateid || 0,
            description: row?.description || '',
            status: row?.status || 'ACTIVO',
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

    return (
        <>
            <div style={{ width: '100%' }}>
                {/* <div className="col-12" style={{ overflowWrap: 'break-word' }}>{JSON.stringify(getValues())}</div> */}
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
                    <div style={{ marginBottom: 0, display: 'flex', gap: 8 }} >
                        <div className={`row-zyx ${classes.containerDetail}`} style={{ width: '50%', marginBottom: 0 }}>
                            <FieldEdit
                                label={t(langKeys.description)} //transformar a multiselect
                                className="col-12"
                                onChange={(value) => setValue('description', value)}
                                valueDefault={row ? (row.description || "") : ""}
                                error={errors?.description?.message}
                            />
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-12"
                                valueDefault={row?.status || 'ACTIVO'}
                                onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                                error={errors?.status?.message}
                                data={dataStatus}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className={`row-zyx ${classes.containerDetail}`} style={{ width: '50%', marginBottom: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 500 }}>{t(langKeys.filters)}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TemplateSwitch
                                    label={t(langKeys.startDate)}
                                    style={{ flex: '0 0 150px' }}
                                    valueDefault={row?.startdate || false}
                                    onChange={(value) => setValue('startdate', value)}
                                />
                                <TemplateSwitch
                                    label={t(langKeys.endDate)}
                                    style={{ flex: '0 0 150px' }}
                                    valueDefault={row?.finishdate || false}
                                    onChange={(value) => setValue('finishdate', value)}
                                />
                                <TemplateSwitch
                                    label={t(langKeys.usergroup)}
                                    style={{ flex: '0 0 150px' }}
                                    valueDefault={row?.usergroup || false}
                                    onChange={(value) => setValue('usergroup', value)}
                                />
                                <TemplateSwitch
                                    label={t(langKeys.channel_plural)}
                                    style={{ flex: '0 0 150px' }}
                                    valueDefault={row?.channels || false}
                                    onChange={(value) => setValue('channels', value)}
                                />
                                <TemplateSwitch
                                    label={t(langKeys.tag)}
                                    style={{ flex: '0 0 150px' }}
                                    valueDefault={row?.tags || false}
                                    onChange={(value) => setValue('tags', value)}
                                />

                            </div>
                        </div>
                    </div>
                    <div className={classes.containerDetail}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={classes.title}>{t(langKeys.column_plural)}</div>
                            <IconButton onClick={() => setOpenDialogVariables(true)}>
                                <InfoIcon />
                            </IconButton>
                        </div>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => handlerNewColumn()}
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
            <DialogVariables
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

/*const ReportsTemplate: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [dataReports, setDataReports] = useState<Dictionary[]>([]);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'orgid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            reportFunction={() => handlePlayReport(row)}
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.creationDate),
                accessor: 'createdate',
                NoFilter: true,
                Cell: (props: any) => {
                    const { createdate } = props.cell.row.original;
                    return new Date(createdate).toLocaleString()
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getReportTemplate(0, true)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("GRUPOS"),
            getTagsChatflow(),
            getCommChannelLst()
        ]));
        return () => {
            dispatch(resetMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        if (!mainResult.mainData.loading && !mainResult.mainData.error) {
            setDataReports(mainResult.mainData.data.map(x => ({
                    ...x,
                    columns: x.columnjson ? JSON.parse(x.columnjson) : [],
                    ...(x.filterjson ? JSON.parse(x.filterjson) : {})
            })))
        }

    }, [mainResult.mainData])

    const handlePlayReport = (row: Dictionary) => {
        setViewSelected("view-3");
        setRowSelected({ row, edit: true });
    }

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insertReportTemplate({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.reporttemplateid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {
        return (
            <TableZyx
                columns={columns}
                titlemodule={'Report designer'}
                data={dataReports}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailReportDesigner
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else if (viewSelected === "view-3") {
        return (
            <ReportPersonalized
                item={rowSelected.row!!}
                multiData={mainResult.multiData.data}
                setViewSelected={setViewSelected}
            />
        )
    } else
        return null;

}*/

export default DetailReportDesigner;