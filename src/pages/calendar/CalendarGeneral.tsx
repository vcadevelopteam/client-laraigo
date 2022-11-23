/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldEdit, FieldSelect, ColorInput, FieldView } from 'components';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { Box, TextField, Tooltip } from '@material-ui/core';
import { RichText } from 'components/fields/RichText';
import { Descendant } from 'slate';
import { ColorChangeHandler } from 'react-color';
import InfoIcon from '@material-ui/icons/Info';
import { ICalendarFormFields } from './ICalendar';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
}));

interface CalendarGeneralProps {
    row: Dictionary | null;
    dataVariables: {domainvalue: string, domaindesc: string}[];

    dataStatus: Dictionary[];
    dataTemplates: Dictionary[];
    dataChannels: Dictionary[];

    setValue: UseFormSetValue<ICalendarFormFields>;
    getValues: UseFormGetValues<ICalendarFormFields>;
    trigger: UseFormTrigger<ICalendarFormFields>;
    errors: FieldErrors<ICalendarFormFields>;

    generalstate: any,
    setgeneralstate: (value: any) => void;
    showError: boolean;
    templateVariables: any;
    setTemplateVariables: (value: any) => void;
    bodyobject: Descendant[];
    setBodyobject: (value: Descendant[]) => void;
    bodyMessage: any;
    setBodyMessage: (value: any) => void;
}

const CalendarGeneral: React.FC<CalendarGeneralProps> = ({
    row,
    dataVariables,
    
    dataStatus,
    dataTemplates,
    dataChannels,

    setValue,
    getValues,
    trigger,
    errors,

    generalstate,
    setgeneralstate,
    showError,
    templateVariables,
    setTemplateVariables,
    bodyobject,
    setBodyobject,
    bodyMessage,
    setBodyMessage
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

    const onSelectTemplate = (value: Dictionary) => {
        if (value) {
            setBodyMessage(value.body);
            setTemplateVariables((value.body?.match(/{{/g) || []).reduce((acc: any, x: any, i: number) => { return { ...acc, [`variable#${i}`]: `` } }, {}))
            setValue('hsmtemplateid', value ? value.id : 0);
            setValue('hsmtemplatename', value ? value.name : '');
        }
        else {
            setValue('hsmtemplatename', '');
            setBodyMessage('');
            setTemplateVariables({})
            setValue('hsmtemplateid', 0);
        }
    }
    
    return (
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
                        { desc: "HSM", val: "HSM" },
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
                    onChange={(value) => setValue('communicationchannelid', value?.communicationchannelid || 0)}
                    data={dataChannels.filter(x => x.type.startsWith('WHA'))}
                    optionDesc="communicationchanneldesc"
                    optionValue="communicationchannelid"
                />
            </div>}
            <div className="row-zyx" >
                {/*getValues("notificationtype") === 'HSM' && <FieldView
                    className="col-6"
                    label={t(langKeys.message)}
                    value={bodyMessage}
                    tooltip={`${t(langKeys.calendar_messate_tooltip)}`}
                />*/}
                {getValues("notificationtype") && <React.Fragment>
                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                        {t(langKeys.message)}
                        <Tooltip title={`${t(langKeys.calendar_messate_tooltip)}`} placement="top-start">
                            <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                        </Tooltip>
                    </Box>
                    <div dangerouslySetInnerHTML={{ __html: bodyMessage }} />
                    <div className="col-6" >
                        {Object.keys(templateVariables).map((x, i) => {
                            return (
                                <div key={`templateVariables-${i + 1}`} style={{ paddingTop: 10 }}>
                                    <FieldSelect
                                        label={`Variable #${i + 1}`}
                                        className="col-6"
                                        valueDefault={templateVariables[x]}
                                        onChange={(value) => { setTemplateVariables({ ...templateVariables, [x]: value?.domainvalue || "" }) }}
                                        data={dataVariables}
                                        uset={true}
                                        optionDesc="domaindesc"
                                        optionValue="domainvalue"
                                    />
                                </div>)
                        })}
                    </div>
                </React.Fragment>
                }
            </div>
        </div>
    )
}

export default CalendarGeneral;