/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, AntTab, ColorInput, AntTabPanel, DateRangePicker, FieldEditMulti, FieldView } from 'components';
import { getDateCleaned, insCommentsBooking, getValuesFromDomain, insCalendar, hours, selCalendar, getMessageTemplateLst, getCommChannelLst, getDateToday, selBookingCalendar, dayNames } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { getCollection, getMultiCollection, execute, resetAllMain, getCollectionAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, ListItemIcon, Menu, MenuItem, Radio, RadioGroup, Switch, Tabs, TextField, Tooltip } from '@material-ui/core';
import { Range } from 'react-date-range';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { CalendarIcon, DuplicateIcon } from 'icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RichText, renderToString, toElement } from 'components/fields/RichText';
import {
    Search as SearchIcon,
} from '@material-ui/icons';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import { Descendant } from 'slate';
import { ColorChangeHandler } from 'react-color';
import Schedule from 'components/fields/Schedule';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import ClearIcon from '@material-ui/icons/Clear';


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

type ISchedule = {
    start: string,
    end: string,
    dow: number,
    status: string,
    overlap?: number,
}

type FormFields = {
    id: number,
    eventcode: string,
    eventname: string,
    location: string,
    description: string,
    color: string,
    status: string,
    notificationtype: string,
    hsmtemplatename: string,
    daysintothefuture: number,
    communicationchannelid: number,
    hsmtemplateid: number,
    operation: string,
    intervals: ISchedule[],
    variables: any[],
    durationtype: string,
    duration: number,
    timebeforeeventunit: string,
    timebeforeeventduration: number,
    timeaftereventunit: string,
    timeaftereventduration: number,
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    root: {
        width: "100%",
    },
    field: {
        margin: theme.spacing(1),
        minHeight: 58,
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
    formControl: {
        margin: theme.spacing(3),
    },
    icon: {
        borderRadius: 3,
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    },
    errorclass: {
        color: "#f44336",
        margin: 0,
        marginTop: "4px",
        fontSize: "0.75rem",
        textAlign: "left",
        fontFamily: "dm-sans",
        fontWeight: 400,
        lineHeight: 1.66,
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
    }
}));

interface LabelDaysProps {
    flag: Boolean;
    fieldsIntervals?: any;
    errors?: any;
    intervalsAppend: (interval: ISchedule) => void;
    intervalsRemove: (index: number) => void;
    register: any;
    setValue: (value: any, value2: any) => void;
    getValues: (value: any) => any;
    trigger: (name: any) => any;
    dow: number;
    labelName: string;
}

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
                comment: booking?.comment || ''
            })
            register('comment', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
        }
    }, [openModal])

    const onSubmit = async () => {
        const allOk = await trigger();
        if (allOk) {
            const data = getValues();
            const datat = {
                calendareventid: event.calendareventid,
                id: booking?.calendarbookingid,
                comment: data.comment,
            }
            dispatch(execute(insCommentsBooking(datat)));
            setWaitSave(true);
            dispatch(showBackdrop(true));
        }
    }

    return (
        <Dialog
            open={openModal}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>
                {booking?.personname}
            </DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <div style={{ backgroundColor: booking?.color, width: 24, height: 24, borderRadius: 12 }}></div>
                            <FieldView
                                label={t(langKeys.event)}
                                value={event?.name}
                                className={classes.colInput}
                            />
                            <FieldView
                                label={t(langKeys.location)}
                                value={event?.location}
                                className={classes.colInput}
                            />
                            <div className={classes.colInput}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    {t(langKeys.description)}
                                </Box>
                                <Box lineHeight="20px" fontSize={15} color="textPrimary">
                                    <div dangerouslySetInnerHTML={{ __html: event?.description }} />
                                </Box>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                            <FieldView
                                label={t(langKeys.schedule)}
                                value={`${booking?.hourstart.substring(0, 5)} - ${booking?.hourend.substring(0, 5)}`}
                                className={classes.colInput}
                            />
                            <FieldView
                                label={t(langKeys.person)}
                                value={booking?.personname}
                                className={classes.colInput}
                            />
                            <div className={classes.colInput}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    {t(langKeys.note)}
                                </Box>
                                <Box lineHeight="20px" fontSize={15} color="textPrimary" style={{ overflowWrap: "anywhere" }}>{booking?.notes}</Box>
                            </div>
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

const BookingEvents: React.FC<{ calendarEventID: number, event: Dictionary }> = ({ calendarEventID, event }) => {
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
    const [bookingSelected, setBookingSelected] = useState<Dictionary | null>(null);
    const [dataBooking, setDataBooking] = useState<Dictionary[]>([])
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClose = () => setAnchorEl(null);

    const fetchData = () => dispatch(getCollectionAux(selBookingCalendar(
        dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : "",
        dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : "",
        calendarEventID
    )))

    useEffect(() => {
        if (!mainAux.error && !mainAux.loading && mainAux.key === "UFN_CALENDARBOOKING_REPORT") {
            const bookingDates = Object.values(mainAux.data.reduce((acc, item) => ({
                ...acc,
                [item.monthdate]: acc[item.monthdate] ? acc[item.monthdate] : item
            }), {}))

            setDataBooking(mainAux.data.map(x => {
                const datessplit = x.monthdate.split("-");
                const date = new Date(parseInt(datessplit[0]), parseInt(datessplit[1]) - 1, parseInt(datessplit[2]));
                const dateString = t(langKeys.invitation_date, { month: t(`month_${((date.getMonth() + 1) + "").padStart(2, "0")}`), year: date.getFullYear(), day: t(dayNames[date.getDay()]), date: date.getDate() })

                return {
                    ...x,
                    dateString,
                    haveDate: bookingDates.find(y => y.calendarbookingid === x.calendarbookingid)
                };
            }));
        }
    }, [mainAux])

    return (
        <div style={{ gap: 16, marginTop: 16, overflowY: 'auto' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', height: '100%', marginTop: 16 }}>
                {dataBooking.map(x => (
                    <div
                        key={x.calendarbookingid}
                    >   
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
                                    <MenuItem onClick={(e) => { }}>
                                        <ListItemIcon color="inherit">
                                            <DeleteIcon width={18} style={{ fill: '#7721AD' }} />
                                        </ListItemIcon>
                                        {t(langKeys.cancelappointment)}
                                    </MenuItem>
                                </Menu>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', width: "100%"}}>                                    
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ backgroundColor: x.color, width: 24, height: 24, borderRadius: 12 }}></div>
                                    <div>{x.hourstart.substring(0, 5)} - {x.hourend.substring(0, 5)}</div>
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
            </div>
            <DialogBooking
                booking={bookingSelected}
                setOpenModal={setOpenDialog}
                openModal={openDialog}
                event={event}
                fetchData={fetchData}
            />
        </div>
    )
}

const LabelDays: React.FC<LabelDaysProps> = ({ flag, fieldsIntervals, errors, intervalsAppend, intervalsRemove, register, setValue, dow, labelName, getValues, trigger }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    let hoursvalue = hours.map((x: any) => (x.value))
    let dowfields = fieldsIntervals?.filter((x: any) => ((x.dow === dow) && (!x.date)))


    return (
        <>
            <div style={{ display: "grid", gridTemplateColumns: "[first] 100px [line2] 20px [col2] 450px [line3] 20px [col3] 100px [lol] auto [end]", width: "100%", minHeight: 50, marginRight: 10 }}>
                <div style={{ gridColumnStart: "first", margin: "auto", marginLeft: 0, fontWeight: "bold", }}>{labelName}</div>
                {flag &&
                    <>
                        {(fieldsIntervals?.filter((x: any) => ((x.dow === dow) && (!x.date))).length) ?
                            (<div style={{ gridColumnStart: "col2", marginLeft: 50, marginTop: 5, marginBottom: 5, width: "100%" }}>
                                {fieldsIntervals.map((x: any, i: number) => {
                                    if (x.dow !== dow) return null
                                    return (
                                        <div style={{ display: "grid", gridTemplateColumns: "[first] 150px [line1] 20px [col2] 150px [other] 20px [line2] 100px [land] auto [end]", margin: 0, marginTop: 5 }} key={`sun${i}`}>
                                            <>
                                                <div style={{ gridColumnStart: "first" }}>
                                                    <FieldSelect
                                                        fregister={{
                                                            ...register(`intervals.${i}.start`, {
                                                                validate: {
                                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required),
                                                                    timescross: (value: any) => (getValues(`intervals.${i}.end`) > (value)) || t(langKeys.errorhoursdontmatch),
                                                                }

                                                            }),
                                                        }}
                                                        variant="outlined"
                                                        className="col-5nomargin"
                                                        valueDefault={x?.start}
                                                        error={errors?.intervals?.[i]?.start?.message}
                                                        style={{ pointerEvents: "auto" }}
                                                        onChange={(value) => {
                                                            let overlap = getValues(`intervals.${i}.overlap`)
                                                            let fieldEnd = getValues(`intervals.${i}.end`)
                                                            let fieldStart = value?.value
                                                            if ((overlap + 1)) {
                                                                setValue(`intervals.${i}.overlap`, -1)
                                                                setValue(`intervals.${overlap}.overlap`, -1)
                                                            }
                                                            const exists = fieldsIntervals.findIndex((y: any, cont: number) => (y.dow === dow) && (cont !== i)
                                                                && (
                                                                    ((y.start < fieldEnd) && (y.start > fieldStart)) ||
                                                                    ((y.end < fieldEnd) && (y.end > fieldStart)) ||
                                                                    ((fieldEnd < y.end) && (fieldEnd > y.start)) ||
                                                                    ((fieldStart < y.end) && (fieldStart > y.start)) ||
                                                                    (y.start === fieldStart) || (y.end === fieldEnd)
                                                                ));
                                                            if ((exists + 1)) {
                                                                setValue(`intervals.${i}.overlap`, exists)
                                                                setValue(`intervals.${exists}.overlap`, i)
                                                            }
                                                            setValue(`intervals.${i}.start`, value?.value)
                                                            trigger(`intervals.${i}.start`)
                                                        }}
                                                        data={hours}
                                                        optionDesc="desc"
                                                        optionValue="value"
                                                    />
                                                </div>
                                                <div style={{ gridColumnStart: "col2" }}>
                                                    <FieldSelect
                                                        fregister={{
                                                            ...register(`intervals.${i}.end`, {
                                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                            }),
                                                        }}
                                                        variant="outlined"
                                                        className="col-5nomargin"
                                                        valueDefault={x?.end}
                                                        error={errors?.intervals?.[i]?.end?.message}
                                                        style={{ pointerEvents: "auto" }}
                                                        onChange={(value) => {
                                                            let overlap = getValues(`intervals.${i}.overlap`)
                                                            let fieldEnd = value?.value
                                                            let fieldStart = getValues(`intervals.${i}.start`)
                                                            if ((overlap + 1)) {
                                                                setValue(`intervals.${i}.overlap`, -1)
                                                                setValue(`intervals.${overlap}.overlap`, -1)
                                                            }
                                                            const exists = fieldsIntervals.findIndex((y: any, cont: number) => (y.dow === dow) && (cont !== i)
                                                                && (
                                                                    ((y.start < fieldEnd) && (y.start > fieldStart)) ||
                                                                    ((y.end < fieldEnd) && (y.end > fieldStart)) ||
                                                                    ((fieldEnd < y.end) && (fieldEnd > y.start)) ||
                                                                    ((fieldStart < y.end) && (fieldStart > y.start)) ||
                                                                    (y.start === fieldStart) || (y.end === fieldEnd)
                                                                ));
                                                            if ((exists + 1)) {
                                                                setValue(`intervals.${exists}.overlap`, i)
                                                                setValue(`intervals.${i}.overlap`, exists)
                                                                trigger(`intervals.${exists}.start`)
                                                            }
                                                            setValue(`intervals.${i}.end`, value?.value)
                                                            trigger(`intervals.${i}.start`)
                                                        }}
                                                        data={hours}
                                                        optionDesc="desc"
                                                        optionValue="value"
                                                    />
                                                </div>
                                                <div style={{ gridColumnStart: "line2", width: "16.6%" }}>
                                                    <IconButton style={{ pointerEvents: "auto" }} aria-label="delete" onClick={(e) => {

                                                        let overlap = getValues(`intervals.${i}.overlap`)
                                                        if (overlap !== -1) {
                                                            setValue(`intervals.${overlap}.overlap`, -1)
                                                        }
                                                        e.preventDefault();
                                                        intervalsRemove(i)
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </>
                                            {!!((getValues(`intervals.${i}.overlap`)) + 1) &&
                                                <div style={{ gridColumnStart: "first", gridColumn: "span 3", marginBottom: 5 }}>

                                                    <p className={classes.errorclass} >{t(langKeys.errorhours)}</p>
                                                </div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>) :
                            <div style={{ gridColumnStart: "col2", display: 'flex', margin: 'auto' }}>
                                {t(langKeys.notavailable)}
                            </div>
                        }
                        <div style={{ gridColumnStart: "col3", justifyContent: 'space-between' }}>
                            <div>
                                <IconButton
                                    style={{ pointerEvents: "auto", cursor: "pointer" }}
                                    onClick={() => {
                                        if (dowfields?.length) {
                                            let indexofnexthour = hoursvalue.indexOf(dowfields[dowfields?.length - 1].end)
                                            let startindex = (indexofnexthour + 2) < 48 ? indexofnexthour + 2 : indexofnexthour - 46
                                            let endindex = (indexofnexthour + 4) < 48 ? indexofnexthour + 4 : indexofnexthour - 44
                                            const exists = fieldsIntervals.findIndex((y: any, cont: number) => (y.dow === dow) && (
                                                ((y.start < hoursvalue[endindex]) && (y.start > hoursvalue[startindex])) ||
                                                ((y.end < hoursvalue[endindex]) && (y.end > hoursvalue[startindex])) ||
                                                ((hoursvalue[endindex] < y.end) && (hoursvalue[endindex] > y.start)) ||
                                                ((hoursvalue[startindex] < y.end) && (hoursvalue[startindex] > y.start)) ||
                                                (y.start === hoursvalue[startindex]) || (y.end === hoursvalue[endindex])
                                            ));
                                            intervalsAppend({ start: hoursvalue[startindex], end: hoursvalue[endindex], dow: dow, status: "available", overlap: exists })
                                            trigger(`intervals.${dowfields?.length - 1}.start`)
                                        } else {
                                            intervalsAppend({ start: "09:00:00", end: "17:00:00", dow: dow, status: "available", overlap: -1 })
                                        }
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </div>
                    </>
                }
            </div>
            <div style={{ width: "650px", border: "lightgrey 1px solid" }}></div>
        </>
    )
}

const DetailCalendar: React.FC<DetailCalendarProps> = ({ data: { row, operation }, setViewSelected, multiData, fetchData }) => {
    const initialRange = {
        startDate: row?.startdate ? new Date(row?.startdate + "T00:00:00") : new Date(new Date().setDate(1)),
        endDate: row?.enddate ? new Date(row?.enddate + "T00:00:00") : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: 'selection'
    }
    const executeRes = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const [bodyobject, setBodyobject] = useState<Descendant[]>(row?.descriptionobject || [{ "type": "paragraph", "children": [{ "text": row?.description || "" }] }])
    const [color, setColor] = useState(row?.color || "#aa53e0");
    const [tabIndex, setTabIndex] = useState(0);
    const [dateinterval, setdateinterval] = useState(row?.daterange || 'DAYS');
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const dataTemplates = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataChannels = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const [bodyMessage, setBodyMessage] = useState(row?.messagetemplateid ? (dataTemplates.filter(x => x.id === row.messagetemplateid)[0]?.body || "") : "");
    const [showError, setShowError] = useState(false);
    const [generalstate, setgeneralstate] = useState({
        eventcode: row?.code || '',
        duration: row?.timeduration || 0,
        timebeforeeventduration: row?.timebeforeeventduration || 0,
        timeaftereventduration: row?.timeaftereventduration || 0,
        daysintothefuture: row?.daysduration || 0,
        calendarview: false,
    });
    const [state, setState] = React.useState({
        sun: false,
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: false,
    });
    const [eventURL, setEventUrl] = useState(new URL(`events/${user?.orgid}/${generalstate.eventcode}`, window.location.origin));

    const handleChange = (event: any) => {
        setdateinterval(event.target.value);
    };

    const handleChangeAvailability = (event: any) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { control, register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm<FormFields>({
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
            variables: row?.variables || [],
            durationtype: row?.timeunit || "MINUTE",
            duration: row?.timeduration || 0,
            timebeforeeventunit: row?.timebeforeeventunit || "MINUTE",
            timebeforeeventduration: row?.timebeforeeventduration || 0,
            timeaftereventunit: row?.timeaftereventunit || "MINUTE",
            timeaftereventduration: row?.timeaftereventduration || 0,
        }
    });


    const handlerCalendar = (data: ISchedule[]) => {
        setValue('intervals', data);
        trigger('intervals')
    }

    const { fields: fieldsIntervals, append: intervalsAppend, remove: intervalsRemove } = useFieldArray({
        control,
        name: 'intervals',
    });


    React.useEffect(() => {
        register('eventcode', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('eventname', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('location', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('status', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('notificationtype');

        register('hsmtemplateid', { validate: (value) => getValues("notificationtype") !== "EMAIL" ? true : (Boolean(value && value > 0) || String(t(langKeys.field_required))) });
        register('communicationchannelid');
        register('durationtype', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('duration', { validate: (value) => Boolean(value && value > 0) || String(t(langKeys.field_required)) });
        register('timebeforeeventunit', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('timebeforeeventduration', { validate: (value) => Boolean(value >= 0) || String(t(langKeys.field_required)) });
        register('timeaftereventunit', { validate: (value) => Boolean(value && value.length) || String(t(langKeys.field_required)) });
        register('timeaftereventduration', { validate: (value) => Boolean(value >= 0) || String(t(langKeys.field_required)) });
    }, [register]);

    const handleColorChange: ColorChangeHandler = (e) => {
        setColor(e.hex);
        setValue('color', e.hex);
    }
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

    const onSelectTemplate = (value: Dictionary) => {
        if (value) {
            setBodyMessage(value.body);
            setValue('hsmtemplateid', value ? value.id : 0);
            setValue('hsmtemplatename', value ? value.name : '');
            const variablesList = value.body.match(/({{)(.*?)(}})/g) || [];
            const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
            setValue('variables', varaiblesCleaned.map((x: string) => ({ name: x, text: '', type: 'text' })));
        } else {
            setValue('hsmtemplatename', '');
            setValue('variables', []);
            setBodyMessage('');
            setValue('hsmtemplateid', 0);
        }
    }

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
                let datatosend = {
                    ...data,
                    descriptionobject: bodyobject,
                    type: "",
                    code: data.eventcode,
                    name: data.eventname,
                    locationtype: "",
                    eventlink: "",
                    messagetemplateid: data.hsmtemplateid,
                    availability: data.intervals,
                    timeduration: data.duration,
                    timeunit: data.durationtype,
                    daterange: dateinterval,
                    startdate: (dateinterval === "DAYS") ? new Date() : dateRangeCreateDate.startDate,
                    enddate: (dateinterval === "DAYS") ? new Date(Number(new Date()) + diffDays * 86400000) : dateRangeCreateDate.endDate,
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

    const arrayBread = [
        { id: "view-1", name: t(langKeys.calendar) },
        { id: "view-2", name: t(langKeys.calendar_detail) }
    ];
    const { sun, mon, tue, wed, thu, fri, sat } = state;
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
                {operation === "EDIT" && <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Trans i18nKey={langKeys.scheduled_events} count={2} />
                        </div>
                    )}
                />}
            </Tabs>

            <AntTabPanel index={0} currentIndex={tabIndex}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <div className="col-6">
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.eventcode)}</Box>
                            <TextField
                                color="primary"
                                fullWidth
                                value={generalstate.eventcode}
                                error={!!errors?.eventcode?.message}
                                helperText={errors?.eventcode?.message || null}
                                onInput={(e: any) => {
                                    let val = e.target.value.replace(/[^0-9a-zA-Z ]/g, "").replace(/\s+/g, '')
                                    e.target.value = String(val)
                                }}
                                onChange={(e) => {
                                    setgeneralstate({ ...generalstate, eventcode: e.target.value });
                                    setValue('eventcode', e.target.value)
                                }}
                                onBlur={(e) => {
                                    setEventUrl(new URL(`events/${user?.orgid}/${generalstate.eventcode}`, window.location.origin))
                                }}
                            />
                        </div>
                        <FieldEdit
                            label={t(langKeys.eventname)}
                            className="col-6"
                            valueDefault={getValues('eventname')}
                            onChange={(value) => { let val = value.trim(); setValue('eventname', val) }}
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
                    <FieldEdit
                        label={''}
                        className="col-12"
                        valueDefault={''}
                        error={showError ? t(langKeys.field_required) : ''}
                        disabled={true}
                    />
                    <div className="row-zyx" >
                        <FieldView
                            label={t(langKeys.eventlink)}
                            className="col-6"
                            value={`${eventURL.host}${eventURL.pathname}`}
                        />
                        <a className='col-6' href={eventURL.href} target="_blank" rel="noreferrer">{t(langKeys.seeagendapage)}</a>
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
                            onChange={(value) => setValue('status', (value ? value.domainvalue : ""))}
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
                            valueDefault={getValues("notificationtype")}
                            onChange={(value) => {
                                setValue('notificationtype', (value?.val || ""))
                                setValue('hsmtemplateid', 0)
                                setValue('communicationchannelid', 0)
                                trigger('notificationtype')
                                onSelectTemplate({ id: 0, name: '', body: '' })
                            }}
                            error={errors?.notificationtype?.message}
                            data={[
                                //{ desc: "HSM", val: "HSM" }, 
                                { desc: t(langKeys.email), val: "EMAIL" }
                            ]}
                            optionDesc="desc"
                            optionValue="val"
                        />
                        {!!getValues("notificationtype") && <FieldSelect
                            label={t(langKeys.notificationtemplate)}
                            className="col-6"
                            valueDefault={getValues('hsmtemplateid')}
                            error={errors?.hsmtemplateid?.message}
                            onChange={onSelectTemplate}
                            data={dataTemplates.filter(x => x.type === (getValues("notificationtype") === "EMAIL" ? "MAIL" : getValues("notificationtype")))}
                            optionDesc="name"
                            optionValue="id"
                        />}
                    </div>
                    {getValues("notificationtype") === 'HSM' && <div className="row-zyx" >
                        <FieldSelect
                            label={t(langKeys.communicationchannel)}
                            className="col-12"
                            valueDefault={getValues('communicationchannelid')}
                            error={errors?.communicationchannelid?.message}
                            onChange={(value) => setValue('communicationchannelid', value.communicationchannelid)}
                            data={dataChannels.filter(x => x.type.startsWith('WHA'))}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                        />
                    </div>}
                    <div className="row-zyx" >
                        {getValues("notificationtype") === 'HSM' && <FieldView
                            className="col-6"
                            label={t(langKeys.message)}
                            value={bodyMessage}
                            tooltip={`${t(langKeys.calendar_messate_tooltip)}`}
                        />}
                        {getValues("notificationtype") === 'EMAIL' && <React.Fragment>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                {t(langKeys.message)}
                                <Tooltip title={`${t(langKeys.calendar_messate_tooltip)}`} placement="top-start">
                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                </Tooltip>
                            </Box>
                            <div dangerouslySetInnerHTML={{ __html: bodyMessage }} />
                        </React.Fragment>
                        }
                    </div>
                </div>
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={tabIndex}>
                <div className={classes.containerDetail}>
                    <div style={{ display: 'flex', flexWrap: "wrap", gap: 16 }} >
                        <div style={{ flex: 1, minWidth: 250 }}>
                            <div className="col-12" style={{ padding: 5 }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={16} mb={1} color="textPrimary">{t(langKeys.duration)}</Box>
                                <div className="row-zyx" >
                                    <div className="col-6">
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.quantity)}</Box>
                                        <TextField
                                            color="primary"
                                            type="number"
                                            fullWidth
                                            value={generalstate.duration}
                                            error={!!errors?.duration?.message}
                                            helperText={errors?.duration?.message || null}
                                            onInput={(e: any) => {
                                                let val = Number(e.target.value.replace(/[^0-9 ]/g, ""))
                                                e.target.value = String(val)
                                            }}
                                            onChange={(e) => {
                                                setgeneralstate({ ...generalstate, duration: Number(e.target.value) });
                                                setValue('duration', Number(e.target.value))
                                            }}
                                        />
                                    </div>
                                    <FieldSelect
                                        label={t(langKeys.unitofmeasure)}
                                        className="col-6"
                                        valueDefault={row?.durationtype || "MINUTE"}
                                        onChange={(value) => setValue('durationtype', (value?.val || ""))}
                                        error={errors?.durationtype?.message}
                                        data={[{ desc: t(langKeys.minute_plural), val: "MINUTE" }, { desc: t(langKeys.hour_plural), val: "HOUR" }]}
                                        optionDesc="desc"
                                        optionValue="val"
                                    />
                                </div>
                            </div>
                            <div className="col-12" style={{ padding: 5 }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={16} mb={1} color="textPrimary">{t(langKeys.settimebeforetheevent)}</Box>
                                <div className="row-zyx" >
                                    <div className="col-6">
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.quantity)}</Box>
                                        <TextField
                                            color="primary"
                                            type="number"
                                            fullWidth
                                            value={generalstate.timebeforeeventduration}
                                            error={!!errors?.timebeforeeventduration?.message}
                                            helperText={errors?.timebeforeeventduration?.message || null}
                                            onInput={(e: any) => {
                                                let val = Number(e.target.value.replace(/[^0-9 ]/g, ""))
                                                e.target.value = String(val)
                                            }}
                                            onChange={(e) => {
                                                setgeneralstate({ ...generalstate, timebeforeeventduration: Number(e.target.value) });
                                                setValue('timebeforeeventduration', Number(e.target.value))
                                            }}
                                        />
                                    </div>
                                    <FieldSelect
                                        label={t(langKeys.unitofmeasure)}
                                        className="col-6"
                                        valueDefault={row?.timebeforeeventunit || "MINUTE"}
                                        onChange={(value) => setValue('timebeforeeventunit', (value?.val || ""))}
                                        error={errors?.timebeforeeventunit?.message}
                                        data={[{ desc: t(langKeys.minute_plural), val: "MINUTE" }, { desc: t(langKeys.hour_plural), val: "HOUR" }]}
                                        optionDesc="desc"
                                        optionValue="val"
                                    />
                                </div>
                            </div>
                            <div className="col-12" style={{ padding: 5 }}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={16} mb={1} color="textPrimary">{t(langKeys.settimeaftertheevent)}</Box>
                                <div className="row-zyx" >
                                    <div className="col-6">
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.quantity)}</Box>
                                        <TextField
                                            color="primary"
                                            type="number"
                                            fullWidth
                                            value={generalstate.timeaftereventduration}
                                            error={!!errors?.timeaftereventduration?.message}
                                            helperText={errors?.timeaftereventduration?.message || null}
                                            onInput={(e: any) => {
                                                let val = Number(e.target.value.replace(/[^0-9 ]/g, ""))
                                                e.target.value = String(val)
                                            }}
                                            onChange={(e) => {
                                                setgeneralstate({ ...generalstate, timeaftereventduration: Number(e.target.value) });
                                                setValue('timeaftereventduration', Number(e.target.value))
                                            }}
                                        />
                                    </div>
                                    <FieldSelect
                                        label={t(langKeys.unitofmeasure)}
                                        className="col-6"
                                        valueDefault={row?.timeaftereventunit || "MINUTE"}
                                        onChange={(value) => setValue('timeaftereventunit', (value?.val || ""))}
                                        error={errors?.timeaftereventunit?.message}
                                        data={[{ desc: t(langKeys.minute_plural), val: "MINUTE" }, { desc: t(langKeys.hour_plural), val: "HOUR" }]}
                                        optionDesc="desc"
                                        optionValue="val"
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: 250 }}>
                            <React.Fragment>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.dateinterval)}</Box>
                                <RadioGroup aria-label="dateinterval" name="dateinterval1" value={dateinterval} onChange={handleChange}>
                                    <FormControlLabel value="DAYS" control={<Radio color="primary" />} label={<div style={{ display: "flex", margin: "auto" }}>{dateinterval === "DAYS" && (
                                        <>
                                            <TextField
                                                color="primary"
                                                type="number"
                                                fullWidth
                                                size="small"
                                                value={generalstate.daysintothefuture}
                                                error={!!errors?.daysintothefuture?.message}
                                                helperText={errors?.daysintothefuture?.message || null}
                                                onInput={(e: any) => {
                                                    let val = Number(e.target.value.replace(/[^0-9 ]/g, ""))
                                                    e.target.value = String(val)
                                                }}
                                                style={{ width: 50 }}
                                                onChange={(e) => {
                                                    setgeneralstate({ ...generalstate, daysintothefuture: Number(e.target.value) });
                                                    setValue('daysintothefuture', Number(e.target.value))
                                                }}
                                            />
                                        </>
                                    )}
                                        <div style={{ display: "flex", margin: "auto" }}>{t(langKeys.daysintothefuture)}</div></div>} />
                                    <FormControlLabel value="RANGE" control={<Radio color="primary" />} label={
                                        <div style={{ display: "flex", margin: "auto" }}>
                                            <div style={{ display: "flex", margin: "auto", paddingRight: 8 }}>{t(langKeys.withinadaterange)}  </div>
                                            {dateinterval === "RANGE" && (
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
                                        </div>} />
                                    <FormControlLabel value="UNDEFINED" control={<Radio color="primary" />} label={t(langKeys.indefinetly)} />
                                </RadioGroup>
                            </React.Fragment>
                        </div>

                    </div>

                    <div className="row-zyx">
                        <div style={{ display: "grid", gridTemplateColumns: "[first] 200px [line2] auto [col2] 200px [end]" }} >
                            <Box style={{ gridColumnStart: "first" }} fontWeight={500} lineHeight="18px" fontSize={20} mb={1} color="textPrimary">{t(langKeys.availability)}</Box>
                            <div style={{ gridColumnStart: "col2" }}>
                                <FormControlLabel
                                    disabled={getValues("intervals").some(x => (x.overlap || -1) !== -1)}
                                    control={<Switch
                                        color="primary" checked={generalstate.calendarview} onChange={(e) => {
                                            setgeneralstate({ ...generalstate, calendarview: e.target.checked });
                                        }} />}
                                    label={t(langKeys.calendarview)}
                                />
                            </div>
                        </div>
                        {!generalstate.calendarview ? (
                            <div>
                                <FormControl component="fieldset" className={classes.formControl} style={{ width: "100%" }}>
                                    <FormGroup>
                                        <FormControlLabel
                                            style={{ pointerEvents: "none" }}
                                            classes={{ label: classes.root }}
                                            control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sun} onChange={handleChangeAvailability} name="sun" />}
                                            label={<LabelDays
                                                flag={sun}
                                                fieldsIntervals={fieldsIntervals}
                                                errors={errors}
                                                intervalsAppend={intervalsAppend}
                                                intervalsRemove={intervalsRemove}
                                                register={register}
                                                setValue={setValue}
                                                dow={0}
                                                labelName={t(langKeys.sunday)}
                                                getValues={getValues}
                                                trigger={trigger}
                                            />} />
                                        <FormControlLabel
                                            style={{ pointerEvents: "none" }}
                                            classes={{ label: classes.root }}
                                            control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={mon} onChange={handleChangeAvailability} name="mon" />}
                                            label={<LabelDays
                                                flag={mon}
                                                fieldsIntervals={fieldsIntervals}
                                                errors={errors}
                                                intervalsAppend={intervalsAppend}
                                                intervalsRemove={intervalsRemove}
                                                register={register}
                                                setValue={setValue}
                                                dow={1}
                                                labelName={t(langKeys.monday)}
                                                getValues={getValues}
                                                trigger={trigger}
                                            />}
                                        />
                                        <FormControlLabel
                                            style={{ pointerEvents: "none" }}
                                            classes={{ label: classes.root }}
                                            control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={tue} onChange={handleChangeAvailability} name="tue" />}
                                            label={<LabelDays
                                                flag={tue}
                                                fieldsIntervals={fieldsIntervals}
                                                errors={errors}
                                                intervalsAppend={intervalsAppend}
                                                intervalsRemove={intervalsRemove}
                                                register={register}
                                                setValue={setValue}
                                                dow={2}
                                                labelName={t(langKeys.tuesday)}
                                                getValues={getValues}
                                                trigger={trigger}
                                            />}
                                        />
                                        <FormControlLabel
                                            style={{ pointerEvents: "none" }}
                                            classes={{ label: classes.root }}
                                            control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={wed} onChange={handleChangeAvailability} name="wed" />}
                                            label={<LabelDays
                                                flag={wed}
                                                fieldsIntervals={fieldsIntervals}
                                                errors={errors}
                                                intervalsAppend={intervalsAppend}
                                                intervalsRemove={intervalsRemove}
                                                register={register}
                                                setValue={setValue}
                                                dow={3}
                                                labelName={t(langKeys.wednesday)}
                                                getValues={getValues}
                                                trigger={trigger}
                                            />}
                                        />
                                        <FormControlLabel
                                            style={{ pointerEvents: "none" }}
                                            classes={{ label: classes.root }}
                                            control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={thu} onChange={handleChangeAvailability} name="thu" />}
                                            label={<LabelDays
                                                flag={thu}
                                                fieldsIntervals={fieldsIntervals}
                                                errors={errors}
                                                intervalsAppend={intervalsAppend}
                                                intervalsRemove={intervalsRemove}
                                                register={register}
                                                setValue={setValue}
                                                dow={4}
                                                labelName={t(langKeys.thursday)}
                                                getValues={getValues}
                                                trigger={trigger}
                                            />}
                                        />
                                        <FormControlLabel
                                            style={{ pointerEvents: "none" }}
                                            classes={{ label: classes.root }}
                                            control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={fri} onChange={handleChangeAvailability} name="fri" />}
                                            label={<LabelDays
                                                flag={fri}
                                                fieldsIntervals={fieldsIntervals}
                                                errors={errors}
                                                intervalsAppend={intervalsAppend}
                                                intervalsRemove={intervalsRemove}
                                                register={register}
                                                setValue={setValue}
                                                dow={5}
                                                labelName={t(langKeys.friday)}
                                                getValues={getValues}
                                                trigger={trigger}
                                            />}
                                        />
                                        <FormControlLabel
                                            style={{ pointerEvents: "none" }}
                                            classes={{ label: classes.root }}
                                            control={<Checkbox color="primary" style={{ pointerEvents: "auto" }} checked={sat} onChange={handleChangeAvailability} name="sat" />}
                                            label={<LabelDays
                                                flag={sat}
                                                fieldsIntervals={fieldsIntervals}
                                                errors={errors}
                                                intervalsAppend={intervalsAppend}
                                                intervalsRemove={intervalsRemove}
                                                register={register}
                                                setValue={setValue}
                                                dow={6}
                                                labelName={t(langKeys.saturday)}
                                                getValues={getValues}
                                                trigger={trigger}
                                            />}
                                        />
                                    </FormGroup>
                                </FormControl>
                            </div>
                        ) :
                            <Schedule
                                data={fieldsIntervals}
                                setData={handlerCalendar}
                            />
                        }
                    </div>
                </div>
            </AntTabPanel>
            <div style={{ overflowY: 'auto' }}>
                <AntTabPanel index={2} currentIndex={tabIndex} >
                    <BookingEvents
                        calendarEventID={row?.calendareventid || 0}
                        event={row!!}
                    />
                </AntTabPanel>
            </div>
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

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, operation: "" });
    const [waitSave, setWaitSave] = useState(false);
    const [dataGrid, setDataGrid] = useState<any[]>([]);

    useEffect(() => {
        let data = mainResult.mainData.data
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
            getCommChannelLst()
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