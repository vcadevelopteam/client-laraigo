/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { Button, IconButton, makeStyles, styled, Typography } from "@material-ui/core";
import { useParams } from 'react-router';
import { FieldEdit, FieldEditMulti } from "components";
import { getCollEventBooking, resetMain } from 'store/main/actions';
import { getEventByCode, validateCalendaryBooking, dayNames, calculateDateFromMonth, insBookingCalendar } from 'common/helpers';
import { Dictionary } from '@types';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Backdrop from '@material-ui/core/Backdrop';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import clsx from 'clsx';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { Controller, useForm } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useLocation } from "react-router";
import CalendarZyx from 'components/fields/Calendar';
import MuiPhoneNumber from 'material-ui-phone-number';
import { getCountryList } from "store/signup/actions";
import { manageConfirmation } from 'store/popus/actions';
import Popus from 'components/layout/Popus';

interface IDay {
    date: Date;
    dateString: string;
    dom: number;
    dow: number;
}

interface ITime {
    localyeardate: string;
    localstarthour: string;
    localendhour: string;
    localddow: number;
    localdday: number;
}

const CssPhonemui = styled(MuiPhoneNumber)({
    minHeight: 'unset',
    '& .MuiInput-underline:after': {
        borderBottomColor: '#7721ad',
    },
});

const useStyles = makeStyles(theme => ({
    back: {
        backgroundColor: '#fbfcfd',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        // minWidth: 800,
        maxHeight: 800,
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        flexWrap: 'wrap',
        maxWidth: '80vw',
        [theme.breakpoints.down('xs')]: {
            maxWidth: '100vw',
            maxHeight: '100vh',
        },
    },
    panel: {
        minWidth: 300,
        padding: theme.spacing(3)
    },
    vertical: {
        width: 1,
        flex: '0 0 1px',
        backgroundColor: '#e1e1e1',
        height: '100%',
    },
    panelCalendar: {
        display: 'flex',
        justifyContent: 'center',
    },
    panelDays: {
        minWidth: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
    containerTimes: {
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        height: '100%',
    },
    itemTime: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        border: '1px solid rgb(119, 33, 173, 0.4)',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        color: "#7721AD",
        borderRadius: 5,
        fontWeight: 'bold',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#fbfcfd',
            border: '2px solid rgb(119, 33, 173, 0.9)',
            paddingTop: theme.spacing(1.5) - 1,
            paddingBottom: theme.spacing(1.5) - 1,
        }
    },
    itemTimeSelected: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        color: "white",
        backgroundColor: 'rgba(0,0,0,.6)',
        borderRadius: 5,
        fontWeight: 'bold',
    },
    itemTimeConfirm: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        backgroundColor: '#7721AD',
        color: "white",
        borderRadius: 5,
        fontWeight: 'bold',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(119, 33, 173, 0.7)',
        }
    },
    colInput: {
        width: '100%',
    },
    containerSuccess: {
        minHeight: 600,
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: 8,
        boxShadow: '0 1px 8px 0 rgb(0 0 0 / 8%)',
        width: '80vw',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            width: '100vw',
        },
        flexDirection: 'column',
    }
}));

const TimeDate: FC<{ time: ITime, isSelected: boolean, setTimeSelected: (p: any) => void }> = ({ time, setTimeSelected, isSelected }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div style={{ display: 'flex', gap: 8, marginRight: 10 }}>
            <div
                className={clsx({
                    [classes.itemTime]: !isSelected,
                    [classes.itemTimeSelected]: isSelected
                })}
                onClick={() => setTimeSelected({ ...time, selected: true })}
            >
                {time.localstarthour}
            </div>
            {isSelected && (
                <div
                    className={classes.itemTimeConfirm}
                    onClick={() => setTimeSelected({ ...time, selected: true, confirm: true })}
                >
                    {t(langKeys.confirm)}
                </div>
            )}
        </div>
    )
}
const URL = "https://ipapi.co/json/";
const FormToSend: FC<{
    event: Dictionary,
    handlerOnSubmit: (p: any) => void,
    disabledSubmit: boolean, parameters: Dictionary,
    time?: ITime
}> = ({ event, handlerOnSubmit, disabledSubmit, time = null }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [phoneCountry, setPhoneCountry] = useState('');
    const dispatch = useDispatch();
    const url = new URLSearchParams(window.location.search);

    const { register, handleSubmit, setValue, getValues, control, formState: { errors, isValid }, trigger } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            name: url.get("n") || event?.personname,
            email: url.get("c") || event?.email,
            phone: url.get("t") || event?.phone,
            notes: '',
        }
    });

    useEffect(() => {
        dispatch(getCountryList());
        try {
            fetch(URL, { method: "get" })
                .then((response) => response.json())
                .then((data) => {
                    const countryCode = data.country_code.toUpperCase();
                    setPhoneCountry(countryCode);
                });
        } catch (error) {
            console.error("error");
        }
        return () => {
            dispatch(resetMain());
        };
    }, [dispatch]);

    useEffect(() => {
        register('notes');
        register('name', { validate: (value) => (!!value && value.length > 0) || (t(langKeys.field_required) + "") });
        register('email', {
            validate: {
                required: (value) => (!!value && value.length > 0) || (t(langKeys.field_required) + ""),
                validEmail: (value) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value) || (t(langKeys.emailverification) + "");
                }
            }
        });
        register('phone', { validate: (value) => (!!value && value.length >= 10) || (t(langKeys.field_required) + "") });
    }, [register, t]);

    const onSubmit = handleSubmit(async (data) => {
        const isPhoneValid = await trigger("phone");

        if (!isPhoneValid) {
            return;
        }

        if (event.calendarbookingid) {
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_reschedule, {
                    current_event: new Date(event.bookingdate).toLocaleString(),
                    new_event: new Date(`${time?.localyeardate} ${time?.localstarthour}`).toLocaleString()
                }),
                callback: () => handlerOnSubmit({ ...data, phone: data.phone?.replace("+", "") })
            }));
        } else {
            handlerOnSubmit({ ...data, phone: data.phone?.replace("+", "") });
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>{t(langKeys.name)}</div>
                    <FieldEdit
                        className={classes.colInput}
                        size="small"
                        variant={'outlined'}
                        valueDefault={getValues('name')}
                        onChange={(value: any) => setValue('name', value)}
                        error={errors?.name?.message}
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>{t(langKeys.phone)}</div>
                    <Controller
                        name="phone"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if ((value?.length || "") === 0) {
                                    return t(langKeys.field_required) as string;
                                } else if ((value?.length || "") < 10) {
                                    return t(langKeys.validationphone) as string;
                                }
                                return true;
                            }
                        }}
                        render={({ field, formState: { errors } }) => (
                            <CssPhonemui
                                {...field}
                                variant="outlined"
                                fullWidth
                                countryCodeEditable={false}
                                size="small"
                                defaultCountry={getValues('phone') ? undefined : phoneCountry.toLowerCase()}
                                error={!!errors?.phone}
                                helperText={errors?.phone?.message}
                                onChange={(e) => {
                                    field.onChange(e);
                                    trigger("phone");
                                }}
                            />
                        )}
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>{t(langKeys.email)}</div>
                    <FieldEdit
                        size="small"
                        className={classes.colInput}
                        variant={'outlined'}
                        valueDefault={getValues('email')}
                        onChange={(value: any) => setValue('email', value)}
                        error={errors?.email?.message}
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}> {t(langKeys.prepare_meeting)} </div>
                    <FieldEditMulti
                        size="small"
                        className={classes.colInput}
                        variant={'outlined'}
                        valueDefault={getValues('notes')}
                        onChange={(value: any) => setValue('notes', value)}
                        error={errors?.notes?.message}
                    />
                </div>
                <div style={{ marginTop: 16 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon color="secondary" />}
                        color="primary"
                        disabled={!isValid || disabledSubmit}
                    >
                        {t((event.calendarbookingid ? langKeys.reschedule_event : langKeys.schedule_event))}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export const CalendarEvent: FC = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();
    const { orgid, eventcode }: any = useParams();
    /**
            name: event?.personname,
            email: event?.email,
            phone: event?.phone, */
    const [event, setEvent] = useState<Dictionary | null>(null);
    const resMain = useSelector(state => state.main.mainEventBooking);
    const [daySelected, setDaySelected] = useState<IDay | null>(null);
    const [timeSelected, setTimeSelected] = useState<ITime & { selected?: boolean, confirm?: boolean } | null>(null);
    const [times, setTimes] = useState<ITime[]>([]);
    const [timesDateSelected, setTimesDateSelected] = useState<ITime[]>([]);
    const [daysAvailable, setDaysAvailable] = useState<string[]>([]);
    const [error, setError] = useState('');
    const refContainerHours = React.useRef<null | HTMLDivElement>(null);
    const [ticket, setTicket] = useState({
        conversationid: 0,
        personid: 0
    })
    const [openDialogError, setOpenDialogError] = useState(false);
    const [dateCurrent, setDateCurrent] = useState<{ month: number, year: number }>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });
    const location = useLocation();

    const onChangeMonth = (month: number, year: number) => {
        setDateCurrent({ month, year });
    }

    useEffect(() => {
        let personid = 0;
        const query = new URLSearchParams(location.search);
        const posibleConversationID = query.get('cid');
        const posiblePersonID = query.get('pid');
        const posiblecalendarbookinguuid = query.get('booking');

        if (posibleConversationID && Number.isInteger(Number(posibleConversationID)) && posiblePersonID && Number.isInteger(Number(posiblePersonID))) {
            personid = Number(posiblePersonID);
            setTicket({
                conversationid: Number(posibleConversationID),
                personid: Number(posiblePersonID)
            })
        }
        dispatch(getCollEventBooking(getEventByCode(orgid, eventcode, personid, posiblecalendarbookinguuid)))
    }, [])

    const triggerCalculateDate = () => {
        const { year, month } = dateCurrent;
        const { corpid, orgid, calendareventid } = event!!;
        const listDates = calculateDateFromMonth(year, month)
        dispatch(getCollEventBooking(validateCalendaryBooking({
            corpid,
            orgid,
            calendareventid,
            startdate: listDates[0].dateString,
            enddate: listDates[listDates.length - 1].dateString
        })))
    }

    useEffect(() => {
        if (!!event) {
            triggerCalculateDate()
        }
    }, [dateCurrent, dispatch, event])

    useEffect(() => {
        if (!resMain.loading) {
            
           if (!resMain.error) {
                if (resMain.key === "QUERY_EVENT_BY_COsDE") {
                    if (resMain.data.length > 0) {
                        setEvent(resMain.data[0]);
                    } else {
                        setEvent(null)
                    }
                } else if (resMain.key === "UFN_CALENDARYBOOKING_SEL_DATETIME") {
                    setDaysAvailable(Array.from(new Set(resMain.data.map(x => x.localyeardate))));
                    setTimes((resMain.data as ITime[]).map(x => ({
                        ...x,
                        localstarthour: x.localstarthour.substring(0, 5),
                        localendhour: x.localendhour.substring(0, 5)
                    })));
                }
            } else {
                if (resMain.key === "UFN_CALENDARYBOOKING_INS") {
                    const errormessage = t(resMain.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() });
                    setError(errormessage);
                    setOpenDialogError(true)
                }
            }
        }
    }, [resMain])

    const handlerSelectDate = (p: IDay[]) => {
        setDaySelected(p[0]);
        setTimeSelected(null);
        setTimesDateSelected(times.filter(x => x.localyeardate === p[0].dateString));

        setTimeout(() => {
            refContainerHours?.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100);
    }

    const handlerOnSubmit = (data: Dictionary) => {
        const month = t(`month_${((daySelected!!.date.getMonth() + 1) + "").padStart(2, "0")}`)
        const { corpid, orgid, calendareventid, calendarbookingid } = event!!;
        const dataToSend = {
            corpid,
            orgid,
            calendareventid,
            id: 0,
            description: '',
            calendarbookingid,
            type: 'NINGUNO',
            status: 'ACTIVO',
            monthdate: timeSelected?.localyeardate,
            hourstart: timeSelected?.localstarthour,
            notes: data.notes,
            conversationid: ticket.conversationid,
            personid: ticket.personid,
            personname: data.name,
            personcontact: data.phone,
            personmail: data.email,
            persontimezone: (new Date().getTimezoneOffset() / 60) * -1,
            operation: 'INSERT',
            username: 'admin',
            email: data.email,
            phone: data.phone,
            name: data.name,
            parameters: [
                // { name: "timeevent", text: `${t(dayNames[daySelected!!.dow])}, ${daySelected?.date.getDate()} ${month}, ${daySelected?.date.getFullYear()}` },
                { name: "eventname", text: event?.name },
                { name: "eventlocation", text: event?.location },
                { name: "eventlink", text: event?.eventlink },
                { name: "eventcode", text: eventcode },
                { name: "monthdate", text: t(langKeys.invitation_date, { month, year: daySelected?.date.getFullYear(), day: t(dayNames[daySelected!!.dow]), date: daySelected?.date.getDate() }) },
                { name: "eventformatdate", text: daySelected?.dateString },
                { name: "hourstart", text: timeSelected?.localstarthour },
                { name: "hourend", text: timeSelected?.localendhour },
                { name: "personname", text: data.name },
                { name: "personcontact", text: data.phone },
                { name: "personmail", text: data.email },
            ]
        }
        dispatch(getCollEventBooking(insBookingCalendar(dataToSend)))
    }

    if (resMain.loading && !event) {
        return (
            <div className={classes.back}>
                <CircularProgress />
            </div>
        )
    }

    if (!event) {
        return (
            <div className={classes.back}>
                <Typography variant="h5">{t(langKeys.no_event_found)}</Typography>
            </div>
        )
    }

    if (!resMain.error && !resMain.loading && resMain.key === "UFN_CALENDARYBOOKING_INS") {
        window.opener && window.opener.postMessage(resMain.data[0].calendarbookingid, '*')      
        return (
            <div className={classes.back}>
                <div className={classes.containerSuccess}>
                    <div style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.confirmed)}</div>
                    <div style={{ marginTop: 16, textAlign: 'center' }} >{t(langKeys.successfully_scheduled)}</div>
                    <div style={{ width: '70%', height: 1, backgroundColor: '#e1e1e1', marginTop: 24, marginBottom: 24 }}></div>
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ backgroundColor: event.color, width: 24, height: 24, borderRadius: 12 }}></span>
                            <div style={{ fontWeight: 'bold', fontSize: 20 }}>{event?.name}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'bold' }}>
                            <CalendarTodayIcon />
                            {timeSelected?.localstarthour} - {timeSelected?.localendhour}, {t(langKeys.invitation_date, { month: t(`month_${((daySelected!!.date.getMonth() + 1) + "").padStart(2, "0")}`), year: daySelected?.date.getFullYear(), day: t(dayNames[daySelected!!.dow]), date: daySelected?.date.getDate() })}
                        </div>
                    </div>
                    <div style={{ width: '70%', height: 1, backgroundColor: '#e1e1e1', marginTop: 24, marginBottom: 24 }}></div>
                </div>
            </div>
        )
    }

    return (
        <div className={classes.back}>
            <div className={classes.container}>
                <div className={classes.panel} style={{ maxWidth: 300 }}>
                    {timeSelected?.confirm && (
                        <IconButton
                            style={{ border: '1px solid #e1e1e1' }}
                            onClick={() => setTimeSelected({ ...timeSelected, confirm: false })}
                            disabled={resMain.loading && !!event}
                        >
                            <ArrowBackIcon color="primary" />
                        </IconButton>
                    )}
                    <div style={{ fontWeight: 'bold', fontSize: 28, marginTop: 12, marginBottom: 16 }}>
                        {event?.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ScheduleIcon color="action" />
                        {event?.timeduration} {t(event?.timeunit?.toLocaleLowerCase())}{event?.timeduration > 1?"s":""}
                    </div>
                    {timeSelected?.confirm && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                            <CalendarTodayIcon color="action" />
                            {timeSelected?.localstarthour} - {timeSelected?.localendhour}, {t(langKeys.invitation_date, { month: t(`month_${((daySelected!!.date.getMonth() + 1) + "").padStart(2, "0")}`), year: daySelected?.date.getFullYear(), day: t(dayNames[daySelected!!.dow]), date: daySelected?.date.getDate() })}
                        </div>
                    )}
                </div>
                <div className={classes.vertical}></div>
                <div className={classes.panel} style={{ position: 'relative', display: 'flex', gap: 20, flexDirection: 'column', height: '600px', borderLeft: '1px solid #e1e1e1' }}>
                    {timeSelected?.confirm && (
                        <div style={{ flex: '0 0 590px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
                                {t(langKeys.enter_details)}
                            </div>
                            <FormToSend
                                event={event!!}
                                time={timeSelected}
                                handlerOnSubmit={handlerOnSubmit}
                                disabledSubmit={resMain.loading && !!event}
                                parameters={{
                                    corpid: event?.corpid,
                                    orgid: event?.orgid,
                                    personid: ticket?.personid,
                                }}
                            />
                        </div>
                    )}
                    {!timeSelected?.confirm && (
                        <>
                            <div style={{ fontWeight: 'bold', fontSize: 18 }}>
                                {t(langKeys.select_date_time)}
                            </div>
                            <div style={{ display: 'flex', gap: 20, overflowY: 'auto' }}>
                                <div className={classes.panelCalendar}>
                                    <CalendarZyx
                                        onChangeMonth={onChangeMonth}
                                        selectedDays={daySelected ? [daySelected.dateString] : undefined}
                                        daysAvailable={daysAvailable}
                                        onChange={handlerSelectDate}
                                    />
                                    <Backdrop style={{ zIndex: 999999999, position: 'absolute' }} open={resMain.loading}>
                                        <CircularProgress />
                                    </Backdrop>
                                </div>
                                {!!daySelected && (
                                    <div className={classes.panelDays} ref={refContainerHours}>
                                        <div>
                                            {t(langKeys.invitation_date, { month: t(`month_${((daySelected?.date.getMonth() + 1) + "").padStart(2, "0")}`), year: daySelected?.date.getFullYear(), day: t(dayNames[daySelected!!.dow]), date: daySelected?.date.getDate() })}
                                        </div>
                                        <div className={classes.containerTimes}>
                                            {timesDateSelected.map((x, index) => (
                                                <TimeDate
                                                    isSelected={!!timeSelected && timeSelected?.localstarthour === x.localstarthour}
                                                    key={index}
                                                    time={x}
                                                    setTimeSelected={setTimeSelected}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>
            <Dialog
                open={openDialogError}
                fullWidth
                maxWidth={"xs"}
                style={{ zIndex: 99999999 }}>
                <DialogTitle>{error}</DialogTitle>
                <DialogContent>
                    <div style={{ textAlign: 'center' }}>
                        {t(langKeys.select_differente_time)}
                    </div>

                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', marginBottom: 12 }}>
                    <Button
                        onClick={() => {
                            setOpenDialogError(false);
                            setTimeSelected(null);
                            setDaySelected(null);
                            triggerCalculateDate();
                        }}
                        color="primary"
                        variant="contained"
                    >
                        {t(langKeys.view_times)}
                    </Button>
                </DialogActions>
            </Dialog >
            <Popus />
        </div >
    )
}

export default CalendarEvent;