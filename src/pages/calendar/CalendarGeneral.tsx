/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldEdit, FieldSelect, ColorInput, FieldView } from 'components';
import { Dictionary } from "@types";
import { withStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { Box, IconButton, TextField, Typography } from '@material-ui/core';
import { RichText } from 'components/fields/RichText';
import { Descendant } from 'slate';
import { ColorChangeHandler } from 'react-color';
import { ICalendarFormFields } from './ICalendar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import EventPreview from 'images/event_preview.jpg';

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
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    
    const user = useSelector(state => state.login.validateToken.user);
    
    const [eventURL, setEventUrl] = useState(new URL(`events/${user?.orgid}/${generalstate.eventcode}`, window.location.origin));
    const [color, setColor] = useState(row?.color || "#aa53e0");

    const handleColorChange: ColorChangeHandler = (e) => {
        setColor(e.hex);
        setValue('color', e.hex);
    }

    return (
        <div className={classes.containerDetail}>
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
        </div>
    )
}

export default CalendarGeneral;