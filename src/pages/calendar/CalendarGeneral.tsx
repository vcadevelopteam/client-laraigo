/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldEdit, FieldSelect, ColorInput, FieldView, FieldEditMulti } from 'components';
import { Dictionary } from "@types";
import { withStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { Box, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core';
import { RichText } from 'components/fields/RichText';
import { Descendant } from 'slate';
import { ColorChangeHandler } from 'react-color';
import { ICalendarFormFields } from './ICalendar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import EventPreview from 'images/event_preview.jpg';
const isIncremental = window.location.href.includes("incremental")


const sendEventTypes = [
    { value: "LINKBUTTON", description: "BOTON LINK" },
    { value: "TEXT", description: "TEXTO" },
]

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerDescription: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    containerDescriptionTitle: {
        fontSize: 24
    },
    containerDescriptionSubtitle: {
        fontSize: 14,
        fontWeight: 500
    },
    eventsendtypeContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        '& > div': {
            padding: '1rem'
        }
    },
    calendarInput: {
        '& input': {
            padding: '0.5rem'
        }
    }
}));

const PreviewTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

interface CalendarGeneralProps {
    row: Dictionary | null;

    dataStatus: Dictionary[];

    setValue: UseFormSetValue<ICalendarFormFields>;
    getValues: UseFormGetValues<ICalendarFormFields>;
    errors: FieldErrors<ICalendarFormFields>;

    generalstate: any,
    setgeneralstate: (value: any) => void;
    showError: boolean;
    bodyobject: Descendant[];
    setBodyobject: (value: Descendant[]) => void;
    dataTemplates: Dictionary[];
    showTemplateError: boolean;
}

interface ILangKeys {
    [key: string]: string
}

interface SendEventTemplateButton {
    payload: string;
    title: string;
    type: string;
}

interface SendEventTemplate {
    createdate: string;
    id: number;
    description: string;
    type: string;
    name: string;
    namespace: string;
    status: string;
    category: string;
    language: string;
    templatetype: string;
    headerenabled: boolean;
    headertype?: string;
    header?: string;
    body: string;
    bodyobject?: string;
    footerenabled: boolean;
    footer: string;
    buttonsenabled: boolean;
    buttons?: SendEventTemplateButton[];
    priority?: string;
    attachment?: string;
    fromprovider: boolean;
    externalid: string;
    externalstatus: string;
}

const CalendarGeneral: React.FC<CalendarGeneralProps> = ({
    row,

    dataStatus,

    setValue,
    getValues,
    errors,

    generalstate,
    setgeneralstate,
    showError,
    bodyobject,
    setBodyobject,
    dataTemplates,
    showTemplateError
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const user = useSelector(state => state.login.validateToken.user);

    const [eventURL, setEventUrl] = useState(new URL(`events/${user?.orgid}/${generalstate.eventcode}`, window.location.origin));
    const [color, setColor] = useState(row?.color || "#aa53e0");
    const [sendEventType, setSendEventType] = useState<string>('')
    const [eventsendtemplateid, setEventsendtemplateid] = useState<number | null>(null)
    const [templates, setTemplates] = useState((dataTemplates as SendEventTemplate[]).filter((template: SendEventTemplate) => template.buttons?.length && template.buttons.some((button: SendEventTemplateButton) => button.type === 'url')) || [])
    const [templateSelected, setTemplateSelected] = useState<SendEventTemplate | null>(null)
    // const [sendEventTemplate, setSendEventTemplate] = useState<SendEventTemplate[] | null>(dataTemplates.filter((x: SendEventTemplate) => x.type === 'SMS'));

    useEffect(() => {
        setSendEventType(row?.sendeventtype?.type || "");
        setEventsendtemplateid(row?.sendeventtype?.eventsendtemplateid || null)
        setTemplateSelected((dataTemplates as SendEventTemplate[]).find((x: SendEventTemplate) => x.id === row?.sendeventtype?.eventsendtemplateid) || null)
    }, [row])

    const handleColorChange: ColorChangeHandler = (e) => {
        setColor(e.hex);
        setValue('color', e.hex);
    }

    const handleTemplateSelect = (value: SendEventTemplate) => {
        setTemplateSelected(value)
    }

    return (
        <div className={classes.containerDetail} style={{ marginBottom: '100px' }}>
            <div className="row-zyx">
                <div className={classes.containerDescription}>
                    <Typography className={classes.containerDescriptionTitle} color="primary">
                        {t(langKeys.calendar_general_title)}
                    </Typography>
                    <Typography className={classes.containerDescriptionSubtitle} color="textPrimary">
                        {t(langKeys.calendar_general_subtitle)}
                    </Typography>
                </div>
            </div>
            <div className="row-zyx">
                <div className="col-6">
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.eventcode)}</Box>
                    <TextField
                        color="primary"
                        fullWidth
                        value={generalstate.eventcode}
                        error={!!errors?.eventcode?.message}
                        disabled={isIncremental}
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
                    disabled={isIncremental}
                    className="col-6"
                    valueDefault={getValues('eventname')}
                    onChange={(value) => { let val = value.trim(); setValue('eventname', val) }}
                    error={errors?.eventname?.message}
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.location)}
                    disabled={isIncremental}
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
                <PreviewTooltip
                    title={
                        <React.Fragment>
                            <img
                                src={EventPreview}
                                style={{
                                    height: '150px',
                                    width: 'auto'
                                }} alt="preview" />
                        </React.Fragment>
                    }
                >
                    <a
                        className='col-6'
                        href={eventURL.href}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                        }}
                    >
                        <IconButton
                            color="primary"
                            title={t(langKeys.seeagendapage)}
                        >
                            <VisibilityIcon />
                        </IconButton>
                        <span>{t(langKeys.seeagendapage)}</span>
                    </a>
                </PreviewTooltip>
            </div>
            <div className="row-zyx" >
                <div className="col-6">
                    <React.Fragment>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.color)}</Box>
                        <ColorInput hex={color} onChange={handleColorChange} disabled={isIncremental} />
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
                    disabled={isIncremental}
                    prefixTranslation="status_"
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.eventsendtype)}
                    className="col-6"
                    valueDefault={row?.sendeventtype?.type || ""}
                    onChange={(value) => {
                        setValue('sendeventtype.type', (value ? value.value : ""))
                        setSendEventType(value?.value || "")
                    }}
                    data={sendEventTypes}
                    uset={true}
                    optionDesc="description"
                    optionValue="value"
                />
            </div>
            {sendEventType && (
                <div className={classes.eventsendtypeContainer}>
                    {sendEventType === 'LINKBUTTON' && (
                        <Paper variant='outlined' elevation={0}>
                            <Box style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr',
                                alignItems: 'end',
                                gap: '2.3rem 1rem'
                            }}>
                                <Box className="col-4" fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary" style={{ display: "flex", margin: 0, paddingRight: '1rem' }}>
                                    {t(langKeys.template)}
                                </Box>
                                <FieldSelect
                                    className="col-8"
                                    style={{ margin: 0 }}
                                    valueDefault={row?.sendeventtype?.eventsendtemplateid || ""}
                                    onChange={(value) => {
                                        setValue('sendeventtype.eventsendtemplateid', (value ? value.id : 0))
                                        handleTemplateSelect(value)
                                        setEventsendtemplateid(value?.id || null)
                                    }}
                                    error={showTemplateError ? t(langKeys.field_required) : ''}
                                    data={templates}
                                    uset={true}
                                    optionDesc="name"
                                    optionValue="id"
                                />
                                {eventsendtemplateid && (
                                    <>
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary" style={{ display: "flex", margin: 0 }}>
                                            {t(langKeys.header)}
                                        </Box>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            gap: '1rem'
                                        }}>
                                            <Typography style={{ padding: '0 8px' }}>
                                                {t((langKeys as ILangKeys)[templateSelected?.headertype || ''])}
                                            </Typography>
                                            <div style={{ flex: 1 }}>
                                                <FieldEdit
                                                    label={''}
                                                    valueDefault={templateSelected?.header || ''}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary" style={{ display: "flex", margin: 0, alignSelf: 'center' }}>
                                            {t(langKeys.body)}
                                        </Box>
                                        <FieldEditMulti
                                            disabled={true}
                                            className="col-12"
                                            valueDefault={templateSelected?.body || ''}
                                        />
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary" style={{ display: "flex", margin: 0 }}>
                                            {t(langKeys.footer)}
                                        </Box>
                                        <FieldEdit
                                            label={''}
                                            valueDefault={templateSelected?.footer || ''}
                                            disabled={true}
                                        />
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary" style={{ display: "flex", margin: 0, alignSelf: 'center' }}>
                                            {t(langKeys.buttons)}
                                        </Box>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'auto 1fr',
                                            gap: '1rem',
                                            marginTop: '1rem',
                                        }}>
                                            <Typography>
                                                {t(langKeys.title)}
                                            </Typography>
                                            <FieldEdit
                                                label={''}
                                                valueDefault={templateSelected?.buttons?.[0].title || ''}
                                                disabled={true}
                                            />
                                            <Typography>
                                                {t(langKeys.type)}
                                            </Typography>
                                            <FieldEdit
                                                label={''}
                                                valueDefault={templateSelected?.buttons?.[0].type || ''}
                                                disabled={true}
                                            />
                                            <Typography>
                                                {t(langKeys.payload)}
                                            </Typography>
                                            <FieldEdit
                                                label={''}
                                                valueDefault={templateSelected?.buttons?.[0].payload || ''}
                                                disabled={true}
                                            />
                                        </div>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    )}
                    <Paper variant='outlined' elevation={0}>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary">
                            {t(langKeys.information_message)}
                            <Tooltip title={`${t(langKeys.calendar_informativemessage_tooltip)}`} placement="top-start">
                                <InfoIcon style={{ padding: "5px 0 0 5px", cursor: 'pointer' }} />
                            </Tooltip>
                        </Box>
                        <FieldEditMulti
                            disabled={false}
                            className="col-12"
                            valueDefault={row?.sendeventtype?.information_message || ''}
                            onChange={(value) => setValue('sendeventtype.information_message', value)}
                        />
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr',
                            padding: '0 1rem',
                            gap: '1rem',
                            alignItems: 'center',
                            marginTop: '1rem',
                        }}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary">
                                {t(langKeys.calendar_eventdate_variable)}
                            </Box>
                            <FieldEdit
                                label={''}
                                valueDefault={'event_date'}
                                disabled={true}
                                variant='outlined'
                                className={classes.calendarInput}
                            />

                            <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary">
                                {t(langKeys.calendar_eventtime_variable)}
                            </Box>
                            <FieldEdit
                                label={''}
                                valueDefault={'event_time'}
                                disabled={true}
                                variant='outlined'
                                className={classes.calendarInput}
                            />

                            <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary">
                                {t(langKeys.calendar_eventname_variable)}
                            </Box>
                            <FieldEdit
                                label={''}
                                valueDefault={'event_name'}
                                disabled={true}
                                variant='outlined'
                                className={classes.calendarInput}
                            />

                            <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary">
                                {t(langKeys.calendar_eventcode_variable)}
                            </Box>
                            <FieldEdit
                                label={''}
                                valueDefault={'event_code'}
                                disabled={true}
                                variant='outlined'
                                className={classes.calendarInput}
                            />

                            <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary">
                                {t(langKeys.calendar_eventlinkcode_variable)}
                            </Box>
                            <FieldEdit
                                label={''}
                                valueDefault={'event_linkcode'}
                                disabled={true}
                                variant='outlined'
                                className={classes.calendarInput}
                            />

                            <Box fontWeight={500} lineHeight="18px" fontSize={14} color="textPrimary">
                                {t(langKeys.calendar_eventlink_variable)}
                            </Box>
                            <FieldEdit
                                label={''}
                                valueDefault={'event_link'}
                                disabled={true}
                                variant='outlined'
                                className={classes.calendarInput}
                            />
                        </div>
                        <div>
                            <ul>
                                <li><Typography>{t(langKeys.calendar_informativemessage_info)}</Typography></li>
                                <li><Typography>{t(langKeys.calendar_informativemessage_info2)}</Typography></li>
                            </ul>
                        </div>
                    </Paper>
                </div>
            )}
        </div>
    )
}

export default CalendarGeneral;