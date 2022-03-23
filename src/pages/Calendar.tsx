/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, AntTab, FieldEditMulti, RichText, ColorInput, AntTabPanel } from 'components';
import { calcKPIManager, convertLocalDate, dictToArrayKV, getDateCleaned, getDateToday, getFirstDayMonth, getLastDayMonth, getValuesFromDomain, insCalendar, insKPIManager, selCalendar, selKPIManager, selKPIManagerHistory } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain, getCollectionAux, getCollectionAux2, resetMainAux, resetMainAux2 } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { Box, FormControlLabel, IconButton, ListItemIcon, Menu, MenuItem, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@material-ui/core';
import { Range } from 'react-date-range';
import { DateRangePicker } from 'components';
import { CalendarIcon, DuplicateIcon } from 'icons';
import GaugeChart from 'react-gauge-chart'
import {Search as SearchIcon }  from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import { Descendant } from 'slate';
import { renderToString, toElement } from 'components/fields/RichText';
import { ColorChangeHandler } from 'react-color';

interface RowSelected {
    row: Dictionary | null,
    operation: string
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailCalendarProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: (id?: number) => void;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    richTextfield: {
        margin: theme.spacing(1),
        minHeight: 150,
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
}));

const dataPeriod: Dictionary = {
    MINUTE: 'minute',
    HOUR: 'hour',
    DAY: 'day',
    MONTH: 'month'
};
const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const DetailCalendar: React.FC<DetailCalendarProps> = ({ data: { row, operation }, setViewSelected, multiData, fetchData }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [bodyobject, setBodyobject] = useState<Descendant[]>(row?.mailbodyobject || [{ "type": "paragraph", "children": [{ "text": row?.mailbody || "" }] }])
    const [color, setColor] = useState(row?.color||"#aa53e0");
    const [tabIndex, setTabIndex] = useState(0);
    const [dateinterval, setdateinterval] = React.useState('daysintothefuture');
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);

    const handleChange = (event:any) => {
      setdateinterval(event.target.value);
    };

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, reset, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.id || 0,
            eventcode: row?.eventcode||0,
            eventname: row?.eventname||"",
            location: row?.location||"",
            mailbody: row?.mailbody || "",
            color: row?.color || "#aa53e0",
            status: row?.status || "ACTIVO",
            notificationtype: row?.notificationtype || "",
            notificationtemplate: row?.notificationtemplate || "",
            daysintothefuture: row?.daysintothefuture || 0,
            operation: operation==="DUPLICATE"? "INSERT":operation,
        }
    });
    
    React.useEffect(() => {
        register('eventcode', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('eventname', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('location', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('notificationtype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('notificationtemplate', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        if(dateinterval==="daysintothefuture"){
            register('daysintothefuture', { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        }
    }, [register]);

    const handleColorChange: ColorChangeHandler = (e) => {
        setColor(e.hex);
        setValue('color', e.hex);
    }

    const onSubmit = handleSubmit((data) => {
        console.log(data)
        const callback = () => {
            data.mailbody = renderToString(toElement(bodyobject));
            if (data.mailbody === '<div data-reactroot=""><p><span></span></p></div>')
                return;
                
            //dispatch(execute(reportSchedulerIns({ ...data, filterjson: JSON.stringify(filtertosend), mailbodyobject: bodyobject })));
            //dispatch(execute(insKPIManager(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const arrayBread = [
        { id: "view-1", name: t(langKeys.calendar)},
        { id: "view-2", name: t(langKeys.calendar_detail) }
    ];
    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                        <TitleDetail
                            title={row?.id ? `${row.name}` : t(langKeys.newcalendar)}
                        />
                    </div>
                </div>
                <Tabs
                    value={tabIndex}
                    onChange={(_, i) => setTabIndex(i)}
                    className={classes.tabs}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.generalinformation} count={2} />
                            </div>
                        )}
                    />
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.schedule} count={2} />
                            </div>
                        )}
                    />
                </Tabs>
                
                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.eventcode)}
                                className="col-6"
                                type="number"
                                valueDefault={getValues('eventcode')}
                                onChange={(value) => setValue('eventcode', value)}
                                error={errors?.eventcode?.message}
                            />
                            <FieldEdit
                                label={t(langKeys.eventname)}
                                className="col-6"
                                valueDefault={getValues('eventname')}
                                onChange={(value) => setValue('eventname', value)}
                                error={errors?.eventname?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.location)}
                                className="col-6"
                                valueDefault={getValues('location')}
                                onChange={(value) => setValue('location', value)}
                                error={errors?.location?.message}
                            />
                        </div>
                        <div className="row-zyx">
                            <React.Fragment>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.description)}</Box>
                                <RichText
                                    value={bodyobject}
                                    onChange={(value) => {
                                        setBodyobject(value)
                                    }}
                                    spellCheck
                                    image={false}
                                />
                            </React.Fragment>
                        </div>
                        <div className="row-zyx" >
                            <FieldView
                                label={t(langKeys.eventlink)}
                                className="col-6"
                                value={"eventlink"}
                            />
                            <a className='col-6' href="https://example.com">{t(langKeys.seeagendapage)}</a>
                        </div>
                        <div className="row-zyx" >
                            <div className="col-6">
                                <React.Fragment>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.color)}</Box>
                                    <ColorInput hex={color} onChange={handleColorChange} />
                                </React.Fragment>
                            </div>
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={row?.status || "ACTIVO"}
                                onChange={(value) => setValue('status', (value?value.domainvalue:""))}
                                error={errors?.status?.message}
                                data={dataStatus}
                                uset={true}
                                prefixTranslation="status_"
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className="row-zyx" >
                            <FieldSelect
                                label={t(langKeys.notificationtype)}
                                className="col-6"
                                valueDefault={row?.notificationtype || ""}
                                onChange={(value) => setValue('notificationtype', (value?.val||""))}
                                error={errors?.notificationtype?.message}
                                data={[{desc: "HSM",val: "HSM"},{desc: t(langKeys.email),val: "EMAIL"}]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                            <FieldSelect
                                label={t(langKeys.notificationtemplate)}
                                className="col-6"
                                valueDefault={row?.notificationtemplate || ""}
                                onChange={(value) => setValue('notificationtemplate', (value?.val||""))}
                                error={errors?.notificationtemplate?.message}
                                data={[{desc: "HSM",val: "HSM"},{desc: t(langKeys.email),val: "EMAIL"}]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                        </div>
                    </div>
                </AntTabPanel>
                <AntTabPanel index={1} currentIndex={tabIndex}>
                    <div className={classes.containerDetail}>
                        <div className="row-zyx" >
                            <div className="col-6">
                                <React.Fragment>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.dateinterval)}</Box>
                                    <RadioGroup aria-label="dateinterval" name="dateinterval1" value={dateinterval} onChange={handleChange}>
                                        <FormControlLabel value="daysintothefuture" control={<Radio color="primary"/>} label={<div style={{display:"flex", margin: "auto"}}>{dateinterval==="daysintothefuture" && (
                                            <>
                                                <FieldEdit
                                                    width={50}
                                                    valueDefault={getValues('daysintothefuture')}
                                                    type="number"
                                                    size="small"
                                                    onChange={(value) => setValue('daysintothefuture', value)}
                                                    error={errors?.daysintothefuture?.message}
                                                />
                                            </>
                                        )}
                                        <div style={{display:"flex", margin: "auto"}}>{t(langKeys.daysintothefuture)}</div></div>} />
                                        <FormControlLabel value="withinadaterange" control={<Radio color="primary"/>} label={<div style={{display:"flex", margin: "auto"}}>{dateinterval==="withinadaterange" && (
                                            <>
                                                <DateRangePicker
                                                    open={openDateRangeCreateDateModal}
                                                    setOpen={setOpenDateRangeCreateDateModal}
                                                    range={dateRangeCreateDate}
                                                    onSelect={setDateRangeCreateDate}
                                                >
                                                    <Button
                                                        className={classes.itemDate}
                                                        startIcon={<CalendarIcon />}
                                                        onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                                                    >
                                                        {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                                                    </Button>
                                                </DateRangePicker>
                                            </>
                                        )}
                                        <div style={{display:"flex", margin: "auto", paddingLeft:10}}>{t(langKeys.withinadaterange)}</div></div>} />
                                        <FormControlLabel value="indefinetly" control={<Radio color="primary"/>} label={t(langKeys.indefinetly)} />
                                    </RadioGroup>
                                </React.Fragment>
                            </div>
                        </div>
                    </div>
                </AntTabPanel>
            </form>
        </div>
    );
}

const IconOptions: React.FC<{
    onDelete?: (e?: any) => void;
    onDuplicate?: (e?: any) => void;
    onCalc?: (e?: any) => void;
}> = ({ onDelete, onDuplicate, onCalc }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { t } = useTranslation();

    const handleClose = () => setAnchorEl(null);
    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                }}
            >
                <MoreVertIcon />
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
                onClick={(e) => e.stopPropagation()}
                onClose={handleClose}
            >
                {onDelete &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onDelete();
                    }}>
                        <ListItemIcon color="inherit">
                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.delete)}
                    </MenuItem>
                }
                {onDuplicate &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onDuplicate();
                    }}>
                        <ListItemIcon>
                            <DuplicateIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.duplicate)}
                    </MenuItem>
                }
                {onCalc &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onCalc();
                    }}>
                        <ListItemIcon>
                            <UpdateIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.calculate)}
                    </MenuItem>
                }
            </Menu>
        </>
    )
}

const Calendar: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, operation: "" });
    const [waitSave, setWaitSave] = useState(false);
    const [waitDuplicate, setWaitDuplicate] = useState(false);
    const [dataGrid, setDataGrid] = useState<any[]>([]);

    useEffect(() => {
        setDataGrid(mainResult.mainData.data)
    }, [mainResult.mainData.data])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, operation: "INSERT" });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, operation: "EDIT" });
    }
    const handleDuplicate = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, operation: "DUPLICATE" });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insCalendar({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }
    
    const columns = React.useMemo(
        () => [
            {
                accessor: 'id',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <IconOptions
                            onDelete={() => {
                                handleDelete(row);
                            }}
                            onDuplicate={() => {
                                handleDuplicate(row);
                            }}
                            />
                            )
                        }
                    },
            {
                Header: t(langKeys.code),
                accessor: 'code',
            },
            {
                Header: t(langKeys.name),
                accessor: 'name',
            },
            {
                Header: t(langKeys.location),
                accessor: 'location',
            },
            {
                Header: t(langKeys.duration),
                accessor: 'duration',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (<div>{row.timeduration} {t((langKeys as any)[`${row.timeunit?.toLowerCase()}${row.timeduration > 1 ? '_plural' : ''}`])}</div>)
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.notificationtype),
                accessor: 'notificationtype',
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(selCalendar(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
        ]));
        return () => {
            dispatch(resetAllMain());
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.calendar_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    

    useEffect(() => {
        if (waitDuplicate) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_duplicate) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitDuplicate(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.calendar_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitDuplicate(false);
            }
        }
    }, [executeResult, waitDuplicate])

    if (viewSelected === "view-1") {
        return (
            <TableZyx
                onClickRow={handleEdit}
                columns={columns}
                titlemodule={t(langKeys.calendar_plural, { count: 2 })}
                data={dataGrid}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailCalendar
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;
}

export default Calendar;