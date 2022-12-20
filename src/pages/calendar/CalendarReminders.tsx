/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'; // we need this to make JSX compile
import { FieldEdit, FieldSelect } from 'components';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { Accordion, AccordionDetails, AccordionSummary, Box, Tooltip, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { ICalendarFormFields } from './ICalendar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    mb2: {
        marginBottom: theme.spacing(4),
    },
}));

interface CalendarRemindersProps {
    row: Dictionary | null;
    dataVariables: {domainvalue: string, domaindesc: string}[];

    dataStatus: Dictionary[];
    dataTemplates: Dictionary[];
    dataChannels: Dictionary[];

    register: UseFormRegister<ICalendarFormFields>;
    setValue: UseFormSetValue<ICalendarFormFields>;
    getValues: UseFormGetValues<ICalendarFormFields>;
    trigger: UseFormTrigger<ICalendarFormFields>;
    errors: FieldErrors<ICalendarFormFields>;

    templateVariables: any;
    setTemplateVariables: (value: any) => void;
    bodyMessage: any;
    setBodyMessage: (value: any) => void;

    emailVariables: any;
    setEmailVariables: (value: any) => void;
    bodyMessageReminderEmail: any;
    setBodyMessageReminderEmail: (value: any) => void;
    
    hsmVariables: any;
    setHsmVariables: (value: any) => void;
    bodyMessageReminderHSM: any;
    setBodyMessageReminderHSM: (value: any) => void;
}

const CalendarReminders: React.FC<CalendarRemindersProps> = ({
    row,
    dataVariables,
    
    dataStatus,
    dataTemplates,
    dataChannels,

    register,
    setValue,
    getValues,
    trigger,
    errors,

    templateVariables,
    setTemplateVariables,
    bodyMessage,
    setBodyMessage,

    emailVariables,
    setEmailVariables,
    bodyMessageReminderEmail,
    setBodyMessageReminderEmail,
    
    hsmVariables,
    setHsmVariables,
    bodyMessageReminderHSM,
    setBodyMessageReminderHSM,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    
    const dataRange = [
        { domainvalue: "hour", domaindesc: "hour" },
        { domainvalue: "day", domaindesc: "day" },
        { domainvalue: "week", domaindesc: "week" },
    ];

    const [accordionIndex, setAccordionIndex] = useState<number | false>(0);

    const handleAccordion = (index: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setAccordionIndex(isExpanded ? index : false);
    };

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
    
    const onSelectTemplateReminderEmail = (value: Dictionary | null) => {
        if (value) {
            setBodyMessageReminderEmail(value.body);
            setEmailVariables((value.body?.match(/{{/g) || []).reduce((acc: any, x: any, i: number) => { return { ...acc, [`variable#${i}`]: `` } }, {}))
            setValue('remindermailtemplateid', value?.id || 0);
            setValue('reminderemailtemplatename', value?.name || '');
        }
        else {
            setValue('reminderemailtemplatename', '');
            setBodyMessageReminderEmail('');
            setEmailVariables({})
            setValue('remindermailtemplateid', 0);
        }
    }
    const onSelectTemplateReminderHSM = (value: Dictionary | null) => {
        if (value) {
            setBodyMessageReminderHSM(value.body);
            setHsmVariables((value.body?.match(/{{/g) || []).reduce((acc: any, x: any, i: number) => { return { ...acc, [`variable#${i}`]: `` } }, {}))
            setValue('reminderhsmtemplateid', value ? value.id : 0);
            setValue('reminderhsmtemplatename', value ? value.name : '');
        }
        else {
            setValue('reminderhsmtemplatename', '');
            setBodyMessageReminderHSM('');
            setHsmVariables({})
            setValue('reminderhsmtemplateid', 0);
            setValue('reminderhsmcommunicationchannelid', 0);
        }
    }
    
    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <div className={classes.containerDescription}>
                    <Typography className={classes.containerDescriptionTitle} color="primary">
                        {t(langKeys.calendar_reminders_title)}
                    </Typography>
                    <Typography className={classes.containerDescriptionSubtitle} color="textPrimary">
                        {t(langKeys.calendar_reminders_subtitle)}
                    </Typography>
                </div>
            </div>

            <Accordion
                style={{ marginBottom: '8px' }}
                defaultExpanded={true}
                expanded={accordionIndex === 0}
                onChange={handleAccordion(0)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel-notification-content'
                    id='panel-notification-header'
                >
                    <Typography
                        style={{fontWeight: 'bold', flexBasis: '100%'}}
                    >
                        {t(langKeys.event_schedule_notification)}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div style={{ width: '100%' }}>

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
                </AccordionDetails>
            </Accordion>

            <Accordion
                style={{ marginBottom: '8px' }}
                defaultExpanded={false}
                expanded={accordionIndex === 1}
                onChange={handleAccordion(1)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel-reminder-content'
                    id='panel-reminder-header'
                >
                    <Typography
                        style={{fontWeight: 'bold', flexBasis: '100%'}}
                    >
                        {t(langKeys.next_event_notification)}
                    </Typography>
                    <Typography>
                        {
                            (getValues("statusreminder") === 'ACTIVO'
                            ? t(langKeys.active)
                            : t(langKeys.inactive)
                            ).toUpperCase()
                        }
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div style={{ width: '100%' }}>
                        <div className="row-zyx" >
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-6"
                                valueDefault={getValues("statusreminder")}
                                onChange={(value) => {
                                    setValue('statusreminder', (value?.domainvalue || ""));
                                    trigger("statusreminder");
                                }}
                                error={errors?.statusreminder?.message}
                                data={dataStatus}
                                uset={true}
                                prefixTranslation="status_"
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </div>

                        {getValues("statusreminder") === "ACTIVO" &&
                            <>
                                <div className="row-zyx" >

                                    <FieldSelect
                                        fregister={{
                                            ...register(`remindertype`, {
                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        label={t(langKeys.notificationtype)}
                                        className="col-6"
                                        valueDefault={getValues("remindertype")}
                                        onChange={(value) => {
                                            setValue('remindertype', (value?.val || ""))
                                            onSelectTemplateReminderEmail(null)
                                            onSelectTemplateReminderHSM(null)
                                            trigger("remindertype")
                                        }}
                                        error={errors?.remindertype?.message}
                                        data={[
                                            { desc: "HSM", val: "HSM" },
                                            { desc: t(langKeys.email), val: "EMAIL" },
                                            { desc: `HSM + ${t(langKeys.email)}`, val: "EMAIL/HSM" },
                                        ]}
                                        optionDesc="desc"
                                        optionValue="val"
                                    />
                                </div>
                                <div className="row-zyx" >
                                    {getValues("remindertype").includes("EMAIL") &&
                                        <div className="col-6" >
                                            <div style={{ paddingBottom: 10, fontWeight: "bold", fontSize: "1.1em" }}>{t(langKeys.email)}</div>
                                            <FieldSelect
                                                fregister={{
                                                    ...register(`remindermailtemplateid`, {
                                                        validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                                    })
                                                }}
                                                label={t(langKeys.notificationtemplate)}
                                                className="col-6"
                                                valueDefault={getValues('remindermailtemplateid')}
                                                error={errors?.remindermailtemplateid?.message || dataTemplates.filter(x => x.type === "MAIL").length===0?t(langKeys.noavailabletemplates):""}
                                                onChange={onSelectTemplateReminderEmail}
                                                data={dataTemplates.filter(x => x.type === "MAIL")}
                                                optionDesc="name"
                                                optionValue="id"
                                            />
                                            <React.Fragment>
                                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                                    {t(langKeys.message)}
                                                    <Tooltip title={`${t(langKeys.calendar_messate_tooltip)}`} placement="top-start">
                                                        <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                                    </Tooltip>
                                                </Box>
                                                <div dangerouslySetInnerHTML={{ __html: bodyMessageReminderEmail }} />
                                            </React.Fragment>
                                        </div>
                                    }
                                    {getValues("remindertype").includes("HSM") &&
                                        <div className="col-6" >
                                            <div style={{ paddingBottom: 10, fontWeight: "bold", fontSize: "1.1em" }}>{t(langKeys.hsm)}</div>
                                            <FieldSelect
                                                fregister={{
                                                    ...register(`reminderhsmtemplateid`, {
                                                        validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                                    })
                                                }}
                                                label={t(langKeys.notificationtemplate)}
                                                className="col-6"
                                                valueDefault={getValues('reminderhsmtemplateid')}
                                                error={errors?.reminderhsmtemplateid?.message || dataTemplates.filter(x => x.type === "MAIL").length===0?t(langKeys.noavailabletemplates):""}
                                                onChange={onSelectTemplateReminderHSM}
                                                data={dataTemplates.filter(x => x.type === "HSM")}
                                                optionDesc="name"
                                                optionValue="id"
                                            />
                                            <div style={{ paddingTop: 10 }}>
                                                <FieldSelect
                                                    label={t(langKeys.communicationchannel)}
                                                    className="col-12"
                                                    valueDefault={getValues('reminderhsmcommunicationchannelid')}
                                                    error={errors?.reminderhsmcommunicationchannelid?.message}
                                                    onChange={(value) => setValue('reminderhsmcommunicationchannelid', value?.communicationchannelid || 0)}
                                                    data={dataChannels.filter(x => x.type.startsWith('WHA'))}
                                                    optionDesc="communicationchanneldesc"
                                                    optionValue="communicationchannelid"
                                                />
                                            </div>
                                            <React.Fragment>
                                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                                    {t(langKeys.message)}
                                                    <Tooltip title={`${t(langKeys.calendar_messate_tooltip)}`} placement="top-start">
                                                        <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                                    </Tooltip>
                                                </Box>
                                                <div dangerouslySetInnerHTML={{ __html: bodyMessageReminderHSM }} />
                                            </React.Fragment>
                                        </div>
                                    }
                                </div>
                                <div className="row-zyx" >
                                    {getValues("remindertype").includes("EMAIL") &&
                                        <div className="col-6" >
                                            {Object.keys(emailVariables).map((x, i) => {
                                                return (
                                                    <div key={`emailvariables-${i + 1}`} style={{ paddingTop: 10 }}>
                                                        <FieldSelect
                                                            label={`Email Variable #${i + 1}`}
                                                            className="col-6"
                                                            valueDefault={emailVariables[x]}
                                                            onChange={(value) => { setEmailVariables({ ...emailVariables, [x]: value?.domainvalue || "" }) }}
                                                            data={dataVariables}
                                                            uset={true}
                                                            optionDesc="domaindesc"
                                                            optionValue="domainvalue"
                                                        />
                                                    </div>)
                                            })}
                                        </div>
                                    }
                                    {getValues("remindertype").includes("HSM") &&
                                        <div className="col-6" >
                                            {Object.keys(hsmVariables).map((x, i) => {
                                                return (
                                                    <div key={`hsmvariables-${i + 1}`} style={{ paddingTop: 10 }}>
                                                        <FieldSelect
                                                            label={`Email Variable #${i + 1}`}
                                                            className="col-6"
                                                            valueDefault={hsmVariables[x]}
                                                            onChange={(value) => { setHsmVariables({ ...hsmVariables, [x]: value?.domainvalue || "" }) }}
                                                            data={dataVariables}
                                                            uset={true}
                                                            optionDesc="domaindesc"
                                                            optionValue="domainvalue"
                                                        />
                                                    </div>)
                                            })}
                                        </div>
                                    }
                                </div>
                                <div className="row-zyx" >
                                    <FieldSelect
                                        fregister={{
                                            ...register(`reminderperiod`, {
                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        label={t(langKeys.reminderperiod)}
                                        className="col-6"
                                        valueDefault={getValues('reminderperiod')}
                                        onChange={(value) => { setValue('reminderperiod', (value?.domainvalue || "")) }}
                                        error={errors?.reminderperiod?.message}
                                        data={dataRange}
                                        uset={true}
                                        prefixTranslation=""
                                        optionDesc="domaindesc"
                                        optionValue="domainvalue"
                                    />
                                    <FieldEdit
                                        fregister={{
                                            ...register(`reminderfrecuency`, {
                                                validate: (value: any) => (value && value >= 0) || t(langKeys.field_required)
                                            })
                                        }}
                                        label={t(langKeys.value)}
                                        className="col-6"
                                        type='number'
                                        InputProps={{ inputProps: { min: 0 } }}
                                        valueDefault={getValues('reminderfrecuency')}
                                        onChange={(value) => { setValue('reminderfrecuency', value) }}
                                        error={errors?.reminderfrecuency?.message}
                                    />
                                </div>
                            </>
                        }
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default CalendarReminders;