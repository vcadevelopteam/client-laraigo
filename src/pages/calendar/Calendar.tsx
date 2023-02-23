/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, AntTab, AntTabPanel } from 'components';
import { getValuesFromDomain, insCalendar, selCalendar, getMessageTemplateLst, getCommChannelLst } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { IconButton, ListItemIcon, Menu, MenuItem, Tabs } from '@material-ui/core';
import { Range } from 'react-date-range';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { DuplicateIcon } from 'icons';
import { renderToString, toElement } from 'components/fields/RichText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import { Descendant } from 'slate';
import ClearIcon from '@material-ui/icons/Clear';
import { calendarGoogleValidate, resetCalendarGoogle } from 'store/calendar/actions';
import CalendarGeneral from './CalendarGeneral';
import CalendarSchedule from './CalendarSchedule';
import CalendarReminders from './CalendarReminders';
import CalendarConnections from './CalendarConnections';
import CalendarScheduledEvents from './CalendarScheduledEvents';
import { ICalendarFormFields } from './ICalendar';
import EventIcon from '@material-ui/icons/Event';

const dataVariables = [
    { domainvalue: "eventname", domaindesc: "calendar_eventname" },
    { domainvalue: "eventlocation", domaindesc: "calendar_eventlocation" },
    { domainvalue: "eventlink", domaindesc: "calendar_eventlink" },
    { domainvalue: "monthdate", domaindesc: "calendar_monthdate" },
    { domainvalue: "hourstart", domaindesc: "calendar_hourstart" },
    { domainvalue: "hourend", domaindesc: "calendar_hourend" },
    { domainvalue: "personname", domaindesc: "calendar_personname" },
    { domainvalue: "personcontact", domaindesc: "calendar_personcontact" },
    { domainvalue: "personmail", domaindesc: "calendar_personmail" },
];

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
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
}));

interface RowSelected {
    row: Dictionary | null,
    operation: string
}

interface MultiData {
    data: Dictionary[];
    success: boolean;
}

interface DetailCalendarProps {
    dataGrid: any[],
    setDataGrid: (value: any[]) => void;
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: (id?: number) => void;
}

const DetailCalendar: React.FC<DetailCalendarProps> = ({
    dataGrid,
    setDataGrid,
    data: { row, operation },
    setViewSelected,
    multiData,
    fetchData
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();

    const executeRes = useSelector(state => state.main.execute);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.calendar) },
        { id: "view-2", name: t(langKeys.calendar_detail) }
    ];

    const [tabIndex, setTabIndex] = useState(0);

    // Data
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataTemplates = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataChannels = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const initialRange = {
        startDate: row?.startdate ? new Date(row?.startdate + "T00:00:00") : new Date(new Date().setDate(1)),
        endDate: row?.enddate ? new Date(row?.enddate + "T00:00:00") : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: 'selection'
    }
    console.log("row",row?.maximumcapacity)
    const [generalstate, setgeneralstate] = useState({
        eventcode: row?.code || '',
        duration: row?.timeduration || 0,
        maximumcapacity: row?.maximumcapacity,
        timebeforeeventduration: row?.timebeforeeventduration || 0,
        timeaftereventduration: row?.timeaftereventduration || 0,
        daysintothefuture: row?.daysduration || 0,
        calendarview: false,
    });

    // Handle Submit
    const [waitSave, setWaitSave] = useState(false);
    const [showError, setShowError] = useState(false);
    const [bodyobject, setBodyobject] = useState<Descendant[]>(row?.descriptionobject || [{ "type": "paragraph", "children": [{ "text": row?.description || "" }] }])
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [dateinterval, setdateinterval] = useState(row?.daterange || 'DAYS');
    const [templateVariables, setTemplateVariables] = useState<any>({});
    const [emailVariables, setEmailVariables] = useState<any>({});
    const [hsmVariables, setHsmVariables] = useState<any>({});
    const [bodyMessage, setBodyMessage] = useState(dataTemplates.filter(x => x.id === (row?.messagetemplateid || ""))[0]?.body || "");
    const [bodyMessageReminderEmail, setBodyMessageReminderEmail] = useState(dataTemplates.filter(x => x.id === (row?.remindermailtemplateid || ""))[0]?.body || "");
    const [bodyMessageReminderHSM, setBodyMessageReminderHSM] = useState(dataTemplates.filter(x => x.id === (row?.reminderhsmtemplateid || ""))[0]?.body || "");
    const user = useSelector(state => state.login.validateToken.user);

    // Tab Connections
    const [calendarGoogleActive, setCalendarGoogleActive] = useState(row?.credentialsdate);
    const resCalendarGoogleValidate = useSelector(state => state.calendar.requestGoogleValidate);
    const [waitGoogleValidate, setWaitGoogleValidate] = useState(false);

    const { control, register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm<ICalendarFormFields>({
        defaultValues: {
            id: row?.calendareventid || 0,
            eventcode: row?.code || "",
            eventname: row?.name || "",
            location: row?.location || "",
            description: row?.description || "",
            color: row?.color || "#aa53e0",
            status: row?.status || "ACTIVO",
            notificationtype: row?.notificationtype || "",
            daysintothefuture: row?.daysduration || 0,
            operation: operation === "DUPLICATE" ? "INSERT" : operation,
            communicationchannelid: row?.communicationchannelid || 0,
            hsmtemplateid: row?.messagetemplateid || 0,
            hsmtemplatename: row?.hsmtemplatename || "",
            intervals: row?.availability || [],
            durationtype: row?.timeunit || "MINUTE",
            maximumcapacity: row?.maximuncapacity ,
            duration: row?.timeduration || 0,
            timebeforeeventunit: row?.timebeforeeventunit || "MINUTE",
            timebeforeeventduration: row?.timebeforeeventduration || 0,
            timeaftereventunit: row?.timeaftereventunit || "MINUTE",
            timeaftereventduration: row?.timeaftereventduration || 0,
            statusreminder: row?.reminderenable ? "ACTIVO" : "INACTIVO",
            remindertype: row?.remindertype || "",
            email: row?.email || "",
            hsm: row?.hsm || "",
            remindermailtemplateid: row?.remindermailtemplateid || "",
            reminderhsmtemplateid: row?.reminderhsmtemplateid || "",
            reminderperiod: row?.reminderperiod || "",
            reminderfrecuency: row?.reminderfrecuency || 0,
            reminderhsmcommunicationchannelid: row?.reminderhsmcommunicationchannelid || 0,
        }
    });

    React.useEffect(() => {
        register('eventcode', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('eventname', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('location', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('status', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('notificationtype');
        register('hsmtemplateid', { validate: (value) => getValues("notificationtype") !== "EMAIL" ? true : (Boolean(value && value > 0) || String(t(langKeys.field_required))) });
        register('communicationchannelid', { validate: (value) => getValues("notificationtype") !== "HSM" ? true : (Boolean(value && value > 0) || String(t(langKeys.field_required))) });
        register('durationtype', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('duration', { validate: (value) => Boolean(value && value > 0) || String(t(langKeys.field_required)) });
        register('maximumcapacity', { validate: (value) => Boolean(value && value > 0) || String(t(langKeys.greaterthanzero)) });
        register('timebeforeeventunit', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('timebeforeeventduration', { validate: (value) => Boolean(value >= 0) || String(t(langKeys.field_required)) });
        register('timeaftereventunit', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('timeaftereventduration', { validate: (value) => Boolean(value >= 0) || String(t(langKeys.field_required)) });
        register('reminderhsmcommunicationchannelid', { validate: (value) => !getValues("remindertype").includes("HSM") ? true : (Boolean(value && value > 0) || String(t(langKeys.field_required))) });
        register('reminderhsmtemplateid', { validate: (value) => !getValues("remindertype").includes("HSM") ? true : (Boolean(value && value > 0) || String(t(langKeys.field_required))) });
        register('remindermailtemplateid', { validate: (value) => !getValues("remindertype").includes("EMAIL") ? true : (Boolean(value && value > 0) || String(t(langKeys.field_required))) });
        register('remindertype', { validate: (value) => getValues("statusreminder") !== "ACTIVO" ? true : (Boolean(value && value.length) || String(t(langKeys.field_required))) });
        /*register('statusreminder', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });*/
    }, [register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                if (operation === "DUPLICATE") {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_duplicate) }))
                } else {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                }
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.calendar_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const getvariableValues = ((templateid: any, message: string) => {
        let tempbody = dataTemplates.filter(x => x.id === (templateid || ""))[0]?.body || ""
        let temptemplatevariables = (tempbody?.match(/{{/g) || []).reduce((acc: any, x: any, i: number) => { return { ...acc, [`variable#${i}`]: `` } }, {})
        temptemplatevariables = (message?.match(/{{[\w\d]+}}/g) || []).reduce((acc: any, x: any, i: number) => {
            let variablevalue = x.replace("{{", "").replace("}}", "")
            if (!parseInt(variablevalue)) {
                return { ...acc, [`variable#${i}`]: x.replace("{{", "").replace("}}", "") }
            } else {
                return acc
            }
        }, temptemplatevariables)
        return temptemplatevariables
    })

    useEffect(() => {
        if (row) {
            setTemplateVariables(getvariableValues(row?.messagetemplateid, row.notificationmessage))
            setEmailVariables(getvariableValues(row?.remindermailtemplateid, row.remindermailmessage))
            setHsmVariables(getvariableValues(row?.reminderhsmtemplateid, row.reminderhsmmessage))
            if (row?.credentialsdate) {
                dispatch(calendarGoogleValidate({ id: row?.calendareventid }))
                setWaitGoogleValidate(true)
            }
        }
        return () => {
            dispatch(resetCalendarGoogle());
        }
    }, [row])

    const replaceVariables = ((variablesObj: any, messagebody: string) => {
        let replacedVariables = Object.keys(variablesObj).reduce((acc, x, i) => {
            if (!!variablesObj[`${x}`]) {
                return acc.replace(`{{${i + 1}}}`, `{{${variablesObj[`${x}`]}}}`);
            }
            return acc;
        }, messagebody)
        return replacedVariables
    })

    const onSubmit = handleSubmit((data) => {
        data.description = renderToString(toElement(bodyobject));
        if (data.description === `<div data-reactroot=""><p><span></span></p></div>`) {
            setShowError(true);
            return
        }
        setShowError(false);
        const callback = () => {
            if (data.intervals.some(x => (x.overlap || -1) !== -1)) {
                console.log("error overlap")
            } else {
                data.description = renderToString(toElement(bodyobject));
                if (data.description === '<div data-reactroot=""><p><span></span></p></div>')
                    return;
                const date1 = Number(dateRangeCreateDate.startDate);
                const date2 = Number(dateRangeCreateDate.endDate);
                const diffTime = Math.abs(date2 - date1);
                const diffDays = (dateinterval === "DAYS") ? data.daysintothefuture : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const eventURL = new URL(`events/${user?.orgid}/${generalstate.eventcode}`, window.location.origin)
                let datatosend = {
                    ...data,
                    descriptionobject: bodyobject,
                    type: "",
                    code: data.eventcode,
                    name: data.eventname,
                    locationtype: "",
                    eventlink: `${eventURL.host}${eventURL.pathname}`,
                    messagetemplateid: data.hsmtemplateid,
                    availability: data.intervals,
                    timeduration: data.duration,
                    maximumcapacity: data.maximumcapacity,
                    timeunit: data.durationtype,
                    reminderenable: data.statusreminder === "ACTIVO",
                    notificationmessage: replaceVariables(templateVariables, bodyMessage),
                    remindermailmessage: replaceVariables(emailVariables, bodyMessageReminderEmail),
                    reminderhsmmessage: replaceVariables(hsmVariables, bodyMessageReminderHSM),
                    daterange: dateinterval,
                    startdate: (dateinterval === "DAYS") ? new Date(new Date().setHours(10,0,0,0)).toISOString(): dateRangeCreateDate.startDate,
                    enddate: (dateinterval === "DAYS") ? new Date(new Date().setHours(10,0,0,0) + diffDays * 86400000) : dateRangeCreateDate.endDate,
                    daysduration: diffDays,
                    increments: "00:30",
                }
                dispatch(execute(insCalendar(datatosend)));
                dispatch(showBackdrop(true));
                setWaitSave(true)
            }
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    useEffect(() => {
        if (waitGoogleValidate) {
            if (!resCalendarGoogleValidate.loading) {
                setWaitGoogleValidate(false)
                if (!resCalendarGoogleValidate.error) {
                    setCalendarGoogleActive(true)
                }
                else {
                    setCalendarGoogleActive(false)
                }
            }
        }
    }, [resCalendarGoogleValidate])

    return (
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={(view) => {
                            setViewSelected(view);
                        }}
                    />
                    <TitleDetail
                        title={row?.name || t(langKeys.newcalendar)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => {
                            setViewSelected("view-1")
                        }}
                    >{t(langKeys.back)}</Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}>
                        {t(langKeys.save)}
                    </Button>
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
                <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Trans i18nKey={langKeys.sendreminders} count={2} />
                        </div>
                    )}
                />
                {operation === "EDIT" && <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Trans i18nKey={langKeys.connection_to_calendars} count={2} />
                        </div>
                    )}
                />}
            </Tabs>

            <AntTabPanel index={0} currentIndex={tabIndex}>
                <CalendarGeneral
                    row={row}
                    dataStatus={dataStatus}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                    generalstate={generalstate}
                    setgeneralstate={setgeneralstate}
                    showError={showError}
                    bodyobject={bodyobject}
                    setBodyobject={setBodyobject}
                />
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={tabIndex}>
                <CalendarSchedule
                    row={row}
                    control={control}
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                    trigger={trigger}
                    errors={errors}
                    generalstate={generalstate}
                    setgeneralstate={setgeneralstate}
                    dateinterval = {dateinterval}
                    setdateinterval={setdateinterval}
                    dateRangeCreateDate = {dateRangeCreateDate}
                    setDateRangeCreateDate={setDateRangeCreateDate}
                />
            </AntTabPanel>
            <AntTabPanel index={2} currentIndex={tabIndex}>
                <CalendarReminders
                    row={row}
                    dataVariables={dataVariables}
                    dataStatus={dataStatus}
                    dataTemplates={dataTemplates}
                    dataChannels={dataChannels}
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                    trigger={trigger}
                    errors={errors}

                    templateVariables={templateVariables}
                    setTemplateVariables={setTemplateVariables}
                    bodyMessage={bodyMessage}
                    setBodyMessage={setBodyMessage}
                    emailVariables={emailVariables}
                    setEmailVariables={setEmailVariables}
                    bodyMessageReminderEmail={bodyMessageReminderEmail}
                    setBodyMessageReminderEmail={setBodyMessageReminderEmail}
                    hsmVariables={hsmVariables}
                    setHsmVariables={setHsmVariables}
                    bodyMessageReminderHSM={bodyMessageReminderHSM}
                    setBodyMessageReminderHSM={setBodyMessageReminderHSM}
                />
            </AntTabPanel>
            {operation === "EDIT" &&
                <AntTabPanel index={3} currentIndex={tabIndex}>
                    <CalendarConnections
                        row={row}
                        dataGrid={dataGrid}
                        setDataGrid={setDataGrid}
                        calendarGoogleActive={calendarGoogleActive}
                        setCalendarGoogleActive={setCalendarGoogleActive}
                    />
                </AntTabPanel>
            }
        </form>
    );
}

const IconOptions: React.FC<{
    onDelete?: (e?: any) => void;
    onDuplicate?: (e?: any) => void;
    onCopyLink?: (e?: any) => void;
}> = ({ onDelete, onDuplicate, onCopyLink }) => {
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
                {onCopyLink &&
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(null);
                        onCopyLink();
                    }}>
                        <ListItemIcon>
                            <FileCopyIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.copyLink)}
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
            </Menu>
        </>
    )
}

const Calendar: FC = () => {
    const user = useSelector(state => state.login.validateToken.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.calendar) },
        { id: "view-3", name: t(langKeys.scheduled_events) }
    ];

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, operation: "" });
    const [waitSave, setWaitSave] = useState(false);
    const [dataGrid, setDataGrid] = useState<any[]>([]);

    useEffect(() => {
        let data = [...mainResult.mainData.data]
        data = data.map(x => ({ ...x, fullduration: x.timeduration + " " + t((langKeys as any)[`${x.timeunit?.toLowerCase()}${x.timeduration > 1 ? '_plural' : ''}`]) }))
        setDataGrid(data)
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
    const handleScheduledEvents = (row: Dictionary) => {
        setViewSelected("view-3");
        setRowSelected({ row, operation: "VIEW" });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insCalendar({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.calendareventid })));
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
                            onCopyLink={() => {
                                let url = new URL(`events/${user?.orgid}/${row.code}`, window.location.origin)
                                navigator.clipboard.writeText(url.href);
                                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.linkcopysuccesfull) }))
                            }}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.scheduled_events),
                accessor: 'scheduled_events',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <IconButton
                            color="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleScheduledEvents(row);
                            }}
                        >
                            <EventIcon />
                        </IconButton>
                    )
                }
            },
            {
                Header: t(langKeys.eventcode),
                accessor: 'code',
            },
            {
                Header: t(langKeys.eventname),
                accessor: 'name',
            },
            {
                Header: t(langKeys.location),
                accessor: 'location',
            },
            {
                Header: t(langKeys.duration),
                accessor: 'fullduration',
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
            getMessageTemplateLst(''),
            getCommChannelLst(),
            getValuesFromDomain("REPORTEAUTOMATICORANGO"),
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.calendar_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    if (viewSelected === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <TableZyx
                    filterGeneral={false}
                    onClickRow={handleEdit}
                    columns={columns}
                    titlemodule={t(langKeys.calendar_plural, { count: 2 })}
                    data={dataGrid}
                    download={true}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailCalendar
                dataGrid={dataGrid}
                setDataGrid={setDataGrid}
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    }
    else if (viewSelected === "view-3") {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={(view) => {
                                setViewSelected(view);
                            }}
                        />
                        <TitleDetail
                            title={rowSelected?.row?.name}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => {
                                setViewSelected("view-1")
                            }}
                        >{t(langKeys.back)}</Button>
                    </div>
                </div>
                <CalendarScheduledEvents
                    calendarEventID={rowSelected.row?.calendareventid || 0}
                    event={rowSelected.row!!}
                />
            </div>
        )
    }
    else {
        return null;
    }
}

export default Calendar;