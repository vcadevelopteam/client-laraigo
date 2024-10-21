/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DateRangePicker, FieldEdit, FieldEditMulti, FieldSelect, FieldView, IOSSwitch } from 'components';
import { getDateCleaned, insCommentsBooking, calendarBookingCancel, getDateToday, selBookingCalendar, dayNames, editCalendarBooking, hash256 } from 'common/helpers';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute, getCancelEventBooking, getCollectionAux, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LoopIcon from '@material-ui/icons/Loop';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import CalendarWithInfo from 'components/fields/CalendarWithInfo';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    itemBooking: {
        padding: 24,
        backgroundColor: 'white',
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        cursor: 'pointer',
        display: 'flex',
        '&:hover': {
            backgroundColor: '#f5f8fa',
        }
    },
    colInput: {
        width: '100%'
    },
    cancelEventFields: {
        textAlign: 'center',
        fontSize: '1.1rem',
        padding: '5px',
    },
    integrationInformation: {
        minWidth: '250px',
        '& > p': {
            fontWeight: 'bold'
        },
        '& > p > span': {
            fontWeight: 'normal'
        }
    }
}));

const DialogBooking: React.FC<{
    setOpenModal: (param: any) => void;
    openModal: boolean;
    event: Dictionary;
    booking: Dictionary | null;
    fetchData: () => void
}> = ({ setOpenModal, openModal, event, booking, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const classes = useStyles();
    const saveRes = useSelector(state => state.main.execute);
    const { register, setValue, getValues, reset, trigger, formState: { errors } } = useForm();
    useEffect(() => {
        if (waitSave) {
            if (!saveRes.loading && !saveRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_update) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitSave(false);
                fetchData()
            } else if (saveRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(saveRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [saveRes, waitSave])

    useEffect(() => {
        if (openModal) {
            reset({
                comment: booking?.comment || '',
                personname: booking?.personname || '',
                personmail: booking?.personmail || '',
                notes: booking?.notes || '',
            })
            register('comment', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
            register('personname', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
            register('personmail', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
            register('notes');
        }
    }, [openModal])

    const onSubmit = async () => {
        const allOk = await trigger();
        if (allOk) {
            const data = getValues();
            const datat = {
                ...data,
                calendarbookingid: booking?.calendarbookingid,
                comments: data.comment
            }
            dispatch(execute(editCalendarBooking(datat)));
            setWaitSave(true);
            dispatch(showBackdrop(true));
        }
    }

    return (
        <Dialog
            open={openModal}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {booking?.personname}
            </DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ width: "50%", display: 'flex', gap: 8 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                                <div style={{ backgroundColor: booking?.color, width: 24, height: 24, borderRadius: 12 }}></div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                                <FieldView
                                    label={t(langKeys.schedule)}
                                    value={`${booking?.hourstart.substring(0, 5)} - ${booking?.hourend.substring(0, 5)}`}
                                    className={classes.colInput}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldEdit
                                label={t(langKeys.clientname)}
                                valueDefault={getValues('personname')}
                                onChange={(value) => setValue('personname', value)}
                                className={classes.colInput}
                                error={errors?.personname?.message}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flex: 1, width: '100%' }}>
                        <FieldView
                            label={t(langKeys.event)}
                            value={event?.name}
                            className={classes.colInput}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldEdit
                                label={t(langKeys.email)}
                                valueDefault={getValues('personmail')}
                                onChange={(value) => setValue('personmail', value)}
                                className={classes.colInput}
                                error={errors?.personmail?.message}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={t(langKeys.location)}
                                value={event?.location}
                                className={classes.colInput}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ display: 'flex', gap: 24, flex: 1, flexDirection: 'column' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                                <FieldView
                                    label={t(langKeys.event)}
                                    value={event?.name}
                                    className={classes.colInput}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                                <div className={classes.colInput}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                        {t(langKeys.description)}
                                    </Box>
                                    <Box lineHeight="20 px" fontSize={15} color="textPrimary">
                                        <div dangerouslySetInnerHTML={{ __html: event?.description }} />
                                    </Box>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 24, flex: 1, flexDirection: 'column'}}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                                <FieldView
                                    label={t(langKeys.report_opportunity_fullname)}
                                    value={booking?.created_by}
                                    className={classes.colInput}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                                <FieldView
                                    label={t(langKeys.assigned_agent)}
                                    value={booking?.person_name}
                                    className={classes.colInput}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                                <FieldView
                                    label={`${t(langKeys.agent_email)}`}
                                    value={booking?.email}
                                    className={classes.colInput}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flex: 1, width: '100%' }}>
                        <div className={classes.colInput}>
                            <FieldEdit
                                label={t(langKeys.note)}
                                valueDefault={getValues('notes')}
                                onChange={(value) => setValue('notes', value)}
                                className={classes.colInput}
                            />{/*
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                {t(langKeys.note)}
                            </Box>
                            <Box lineHeight="20px" fontSize={15} color="textPrimary" style={{ overflowWrap: "anywhere" }}>{booking?.notes}</Box>*/}
                        </div>
                    </div>
                    <FieldEditMulti
                        label={t(langKeys.comments)}
                        valueDefault={getValues('comment')}
                        className={classes.colInput}
                        onChange={(value) => setValue('comment', value)}
                        maxLength={1024}
                        error={errors?.comment?.message}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onSubmit}>
                    {t(langKeys.save)}
                </Button>
                <Button onClick={() => setOpenModal(false)}>
                    {t(langKeys.cancel)}
                </Button>
            </DialogActions>
        </Dialog >
    )
}

const DialogCancelBooking: React.FC<{
    setOpenModal: (param: any) => void;
    openModal: boolean;
    event: Dictionary;
    booking: Dictionary | null;
    fetchData: () => void
}> = ({ setOpenModal, openModal, event, booking, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const classes = useStyles();
    const saveRes = useSelector(state => state.main.mainEventBooking);
    const user = useSelector(state => state.login.validateToken.user);
    const { register, setValue, getValues, reset, trigger } = useForm();

    useEffect(() => {
        if (waitSave) {
            if (!saveRes.loading && !saveRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_cancel_event) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitSave(false);
                fetchData()
            } else if (saveRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(saveRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [saveRes, waitSave])

    useEffect(() => {
        if (openModal) {
            reset({
                comment: ''
            })
            register('comment');
            setValue("comment", "");
        }
    }, [])

    const onSubmit = async () => {
        if (new Date(booking?.monthdate + " " + booking?.hourstart).getTime() >= new Date().getTime()) {
            const allOk = await trigger();
            if (allOk) {
                const data = getValues();
                const datat = {
                    calendareventid: event.calendareventid,
                    id: booking?.calendarbookingid,
                    cancelcomment: data.comment || "",
                    phone: booking?.personcontact || "",
                    name: booking?.personname,
                    email: booking?.personmail || "",
                    canceltype: event?.canceltype,
                    corpid: event?.corpid,
                    orgid: event?.orgid,
                    username: user?.usr,
                    userid: user?.userid,
                    otros: [
                        { name: "eventname", "text": event.name },
                        { name: "eventlocation", "text": event.location },
                        { name: "eventlink", "text": event.eventlink },
                        { name: "eventcode", "text": event.code },
                        { name: "monthdate", "text": booking?.monthdate },
                        { name: "hourstart", "text": booking?.hourstart },
                        { name: "hourend", "text": booking?.hourend },
                        { name: "personname", "text": booking?.personname },
                        { name: "personcontact", "text": booking?.personcontact },
                        { name: "personmail", "text": booking?.personmail }
                    ]
                }
                dispatch(getCancelEventBooking(calendarBookingCancel(datat)));
                setValue("comment", "")
                setWaitSave(true);
                dispatch(showBackdrop(true));
            }
        } else {
            setValue("comment", "")
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.cancelenventerror || "error_unexpected_error") }))
        }
    }

    return (
        <Dialog
            open={openModal}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {t(langKeys.cancelevent)}
                </div>
            </DialogTitle>
            <DialogContent>
                <div className={classes.cancelEventFields}>
                    {event?.name}
                </div>
                <div className={classes.cancelEventFields} style={{ fontWeight: 'bold' }}>
                    {booking?.personname}
                </div>
                <div className={classes.cancelEventFields}>
                    {`${booking?.hourstart.substring(0, 5)} - ${booking?.hourend.substring(0, 5)}`}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: '10px' }}>
                    <div style={{ fontSize: '1rem' }}>
                        {t(langKeys.canceleventtext)}
                    </div>
                    <FieldEditMulti
                        label={""}
                        valueDefault={getValues('comment')}
                        className={classes.colInput}
                        onChange={(value) => setValue('comment', value)}
                        maxLength={1024}
                        variant="outlined"
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 16, paddingTop: '10px', width: "100%", padding: "0px 16px 10px" }}>
                    <Button
                        style={{ width: "50%" }}
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}
                    >
                        {t(langKeys.cancelevent)}
                    </Button>
                    <Button
                        style={{ width: "50%" }}
                        variant="contained"
                        color="secondary"
                        onClick={() => { setOpenModal(false); setValue("comment", "") }}>
                        {t(langKeys.discard)}
                    </Button>
                </div>
            </DialogActions>
        </Dialog >
    )
}

interface CalendarScheduledEventsProps {
    calendarEventID: number;
    event: Dictionary;
}

const BookingViewer = ({ item }: { item: Dictionary }) => {
    const [color, setColor] = useState(item?.color || "#e1e1e1")

    useEffect(() => {
        if (item.email) {
            hash256(item.email).then((res) => {
                setColor('#' + res.substring(0, 6))
            })
        }
    }, [item])

    return (
        <div
            style={{
                backgroundColor: color,
                paddingLeft: 4
            }}
            title={`${item.name} - ${item.personname}`}
        >
            {item.personname}
        </div>
    )
}


const CalendarScheduledEvents: React.FC<CalendarScheduledEventsProps> = ({
    calendarEventID,
    event
}) => {
    const dispatch = useDispatch();
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const classes = useStyles();
    const mainAux = useSelector(state => state.main.mainAux);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: getDateToday(),
        endDate: new Date(new Date().setDate(getDateToday().getDate() + 7)),
        key: 'selection',
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogCancel, setOpenDialogCancel] = useState(false);
    const [bookingSelected, setBookingSelected] = useState<Dictionary | null>(null);
    const [dataBooking, setDataBooking] = useState<Dictionary[]>([])
    const [filterAgent, setFilterAgent] = useState<string>("")
    const [view, setView] = useState<"list" | "calendar">("list")
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const user = useSelector(state => state.login.validateToken.user);

    const handleClose = () => setAnchorEl(null);

    const fetchData = () => dispatch(getCollectionAux(selBookingCalendar(
        dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : "",
        dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : "",
        calendarEventID
    )))

    useEffect(() => {
        return () => {
            dispatch(resetMainAux())
        }
    }, [])

    useEffect(() => {
        if (!mainAux.error && !mainAux.loading && mainAux.key === "UFN_CALENDARBOOKING_REPORT") {
            const bookingDates = Object.values(mainAux.data.reduce((acc, item) => ({
                ...acc,
                [item.monthdate]: acc[item.monthdate] ? acc[item.monthdate] : item
            }), {}))
            const processedDataBooking = mainAux.data.map(x => {
                const datessplit = x.monthdate.split("-");
                const date = new Date(parseInt(datessplit[0]), parseInt(datessplit[1]) - 1, parseInt(datessplit[2]));
                const dateString = t(langKeys.invitation_date, { month: t(`month_${((date.getMonth() + 1) + "").padStart(2, "0")}`), year: date.getFullYear(), day: t(dayNames[date.getDay()]), date: date.getDate() })

                return {
                    ...x,
                    dateString,
                    haveDate: bookingDates.find(y => y.calendarbookingid === x.calendarbookingid)
                };
            })
            setDataBooking(processedDataBooking.filter(x => (x?.created_by || "").includes(filterAgent)));
        }
    }, [mainAux, filterAgent])

    return (
        <div style={{ gap: 16, marginTop: 16, overflowY: 'auto' }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center" }}>{view === "list" ? t(langKeys.grid_view) : t(langKeys.calendar)}</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <IOSSwitch checked={view === "list"} onChange={() => setView(view === "list" ? "calendar" : "list")} name="checkedB" />
                </div>
            </div>

            {view === "list" && (
                <>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', backgroundColor: 'white', padding: 16 }}>
                        <DateRangePicker
                            open={openDatePicker}
                            setOpen={setOpenDatePicker}
                            range={dateRange}
                            onSelect={setDateRange}
                        >
                            <Button
                                disabled={mainAux.loading}
                                style={{ border: '1px solid #bfbfc0', borderRadius: 4, color: 'rgb(143, 146, 161)' }}
                                startIcon={<CalendarIcon />}
                                onClick={() => setOpenDatePicker(!openDatePicker)}
                            >
                                {getDateCleaned(dateRange.startDate!) + " - " + getDateCleaned(dateRange.endDate!)}
                            </Button>
                        </DateRangePicker>
                        <FieldSelect
                            label={t(langKeys.asignedto)}
                            data={mainAux?.data?.map(obj => (obj?.created_by||"")).filter(name => name.trim() !== '').filter((value, index, self) => self.indexOf(value) === index)
                                .map(name => ({ agent: name }))||[]} 
                            onChange={(value) => {
                                setFilterAgent(value?.agent || "")
                            }}
                            valueDefault={filterAgent}
                            loading={mainAux.loading}
                            style={{ width: "200px" }}
                            optionValue={'agent'}
                            optionDesc={'agent'}
                            variant="outlined"
                        />
                        <Button
                            disabled={mainAux.loading}
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon style={{ color: 'white' }} />}
                            style={{ backgroundColor: '#55BD84', width: 120 }}
                            onClick={fetchData}
                        >
                            <Trans i18nKey={langKeys.search} />
                        </Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', marginTop: 16 }}>
                        {dataBooking.map(x => (
                            <div key={x.calendarbookingid}>
                                {!!x.haveDate && (
                                    <div style={{ marginBottom: 16 }}>
                                        {x.dateString}
                                    </div>
                                )}
                                <div
                                    className={classes.itemBooking}
                                    onClick={() => {
                                        setBookingSelected(x);
                                        setOpenDialog(true);
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            aria-label="more"
                                            aria-controls="long-menu"
                                            aria-haspopup="true"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBookingSelected(x);
                                                setAnchorEl(e.currentTarget);
                                            }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ backgroundColor: x.color, width: 24, height: 24, borderRadius: 12 }}></div>
                                            <div>{x.hourstart.substring(0, 5)} - {x.hourend.substring(0, 5)}</div>
                                        </div>
                                        <div className={classes.integrationInformation}>
                                            {x.created_by && (
                                                <Typography>
                                                    {t(langKeys.asignedto)}: <span>{x.created_by}</span>
                                                </Typography>
                                            )}
                                            {x.person_name && (
                                                <Typography>
                                                    {t(langKeys.assigned_agent)}: <span>{x.person_name}</span>
                                                </Typography>
                                            )}
                                            {x.email && (
                                                <Typography>
                                                    {t(langKeys.agent_email)}: <span>{x.email}</span>
                                                </Typography>
                                            )}
                                        </div>
                                        <div>
                                            <div>{x?.personname}</div>
                                            <div>Evento: {event?.name}</div>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            // getContentAnchorEl={null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClick={(e) => { e.stopPropagation(); }}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={(e) => {
                                const url = new URL(`events/${user?.orgid}/${event.code}?booking=${bookingSelected?.calendarbookinguuid}`, window.location.origin)
                                window.open(url.href, '_blank');
                            }}>
                                <ListItemIcon color="inherit">
                                    <LoopIcon width={18} style={{ fill: '#7721AD' }} />
                                </ListItemIcon>
                                {t(langKeys.rescheduleappointment)}
                            </MenuItem>
                            <MenuItem onClick={(e) => { setOpenDialogCancel(true); handleClose() }}>
                                <ListItemIcon color="inherit">
                                    <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                                </ListItemIcon>
                                {t(langKeys.cancelappointment)}
                            </MenuItem>
                        </Menu>
                    </div>
                </>
            )}
            {view === "calendar" && (
                <div style={{ width: "100%" }}>
                    <CalendarWithInfo
                        rb={selBookingCalendar(
                            "",
                            "",
                            calendarEventID
                        )}
                        date={dateRange.startDate!!}
                        BookingView={BookingViewer}
                        selectBooking={(item) => {
                            setBookingSelected(item);
                            setOpenDialog(true);
                        }}
                        setDateRange={setDateRange}
                    />
                </div>
            )}
            <DialogBooking
                booking={bookingSelected}
                setOpenModal={setOpenDialog}
                openModal={openDialog}
                event={event}
                fetchData={fetchData}
            />
            <DialogCancelBooking
                booking={bookingSelected}
                setOpenModal={setOpenDialogCancel}
                openModal={openDialogCancel}
                event={event}
                fetchData={fetchData}
            />
        </div>
    )
}

export default CalendarScheduledEvents;