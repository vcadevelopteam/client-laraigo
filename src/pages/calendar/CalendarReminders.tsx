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
const isIncremental = window.location.href.includes("incremental")

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
    templateVariablesEmail: any;
    setTemplateVariablesEmail: (value: any) => void;
    bodyMessage: any;
    setBodyMessage: (value: any) => void;
    bodyMessageEmail: any;
    setBodyMessageEmail: (value: any) => void;

    emailVariables: any;
    setEmailVariables: (value: any) => void;
    bodyMessageReminderEmail: any;
    setBodyMessageReminderEmail: (value: any) => void;
    
    hsmVariables: any;
    setHsmVariables: (value: any) => void;
    bodyMessageReminderHSM: any;
    setBodyMessageReminderHSM: (value: any) => void;
    
    emailCancelVariables: any;
    setEmailCancelVariables: (value: any) => void;
    bodyMessageCancelEmail: any;
    setBodyMessageCancelEmail: (value: any) => void;
    
    hsmCancelVariables: any;
    setHsmCancelVariables: (value: any) => void;
    bodyMessageCancelHSM: any;
    setBodyMessageCancelHSM: (value: any) => void;
    
    
    hsmRescheduleVariables: any;
    setHsmRescheduleVariables: (value: any) => void;
    bodyMessageRescheduleHSM: any;
    setBodyMessageRescheduleHSM: (value: any) => void;
    emailRescheduleVariables: any;
    setEmailRescheduleVariables: (value: any) => void;
    bodyMessageRescheduleEmail: any;
    setBodyMessageRescheduleEmail: (value: any) => void;
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

    templateVariablesEmail,
    setTemplateVariablesEmail,
    bodyMessage,
    setBodyMessage,
    bodyMessageEmail,
    setBodyMessageEmail,

    emailVariables,
    setEmailVariables,
    bodyMessageReminderEmail,
    setBodyMessageReminderEmail,
    
    hsmVariables,
    setHsmVariables,
    bodyMessageReminderHSM,
    setBodyMessageReminderHSM,
    
    emailCancelVariables,
    setEmailCancelVariables,
    bodyMessageCancelEmail,
    setBodyMessageCancelEmail,
    
    hsmCancelVariables,
    setHsmCancelVariables,
    bodyMessageCancelHSM,
    setBodyMessageCancelHSM,
    
    hsmRescheduleVariables,
    setHsmRescheduleVariables,
    bodyMessageRescheduleHSM,
    setBodyMessageRescheduleHSM,
    emailRescheduleVariables,
    setEmailRescheduleVariables,
    bodyMessageRescheduleEmail,
    setBodyMessageRescheduleEmail,
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
    const onSelectTemplateEmail = (value: Dictionary) => {
        if (value) {
            setBodyMessageEmail(value.body);
            setTemplateVariablesEmail((value.body?.match(/{{/g) || []).reduce((acc: any, x: any, i: number) => { return { ...acc, [`variable#${i}`]: `` } }, {}))
            setValue('emailtemplateid', value ? value.id : 0);
            setValue('emailtemplatename', value ? value.name : '');
        }
        else {
            setValue('emailtemplatename', '');
            setBodyMessageEmail('');
            setTemplateVariablesEmail({})
            setValue('emailtemplateid', 0);
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
    const onSelectTemplateCancelEmail = (value: Dictionary | null) => {
        if (value) {
            setBodyMessageCancelEmail(value.body);
            setEmailCancelVariables((value.body?.match(/{{/g) || []).reduce((acc: any, x: any, i: number) => { return { ...acc, [`variable#${i}`]: `` } }, {}))
            setValue('canceltemplateidemail', value?.id || 0);
            setValue('cancelemailtemplatename', value?.name || '');
        }
        else {
            setValue('cancelemailtemplatename', '');
            setBodyMessageCancelEmail('');
            setEmailCancelVariables({})
            setValue('canceltemplateidemail', 0);
        }
    }
    const onSelectTemplateCancelHSM = (value: Dictionary | null) => {
        if (value) {
            setBodyMessageCancelHSM(value.body);
            setHsmCancelVariables((value.body?.match(/{{/g) || []).reduce((acc: any, x: any, i: number) => { return { ...acc, [`variable#${i}`]: `` } }, {}))
            setValue('canceltemplateidhsm', value ? value.id : 0);
            setValue('cancelhsmtemplatename', value ? value.name : '');
        }
        else {
            setValue('cancelhsmtemplatename', '');
            setBodyMessageCancelHSM('');
            setHsmCancelVariables({})
            setValue('canceltemplateidhsm', 0);
            setValue('cancelcommunicationchannelid', 0);
        }
    }
    const onSelectTemplateRescheduleEmail = (value: Dictionary | null) => {
        if (value) {
            setBodyMessageRescheduleEmail(value.body);
            setEmailRescheduleVariables((value.body?.match(/{{/g) || []).reduce((acc: any, x: any, i: number) => { return { ...acc, [`variable#${i}`]: `` } }, {}))
            setValue('rescheduletemplateidemail', value?.id || 0);
            setValue('rescheduleemailtemplatename', value?.name || '');
        }
        else {
            setValue('rescheduleemailtemplatename', '');
            setBodyMessageRescheduleEmail('');
            setEmailRescheduleVariables({})
            setValue('rescheduletemplateidemail', 0);
        }
    }
    const onSelectTemplateRescheduleHSM = (value: Dictionary | null) => {
        if (value) {
            setBodyMessageRescheduleHSM(value.body);
            setHsmRescheduleVariables((value.body?.match(/{{/g) || []).reduce((acc: any, x: any, i: number) => { return { ...acc, [`variable#${i}`]: `` } }, {}))
            setValue('rescheduletemplateidhsm', value ? value.id : 0);
            setValue('reschedulehsmtemplatename', value ? value.name : '');
        }
        else {
            setValue('reschedulehsmtemplatename', '');
            setBodyMessageRescheduleHSM('');
            setHsmRescheduleVariables({})
            setValue('rescheduletemplateidhsm', 0);
            setValue('reschedulecommunicationchannelid', 0);
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
                                disabled={isIncremental}
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
                                    { desc: t(langKeys.email), val: "EMAIL" },
                                    { desc: "HSM + " + t(langKeys.email), val: "HSMEMAIL" }
                                ]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                            {(!!getValues("notificationtype") && getValues("notificationtype")!=="HSMEMAIL") && <FieldSelect
                                label={t(langKeys.notificationtemplate)}
                                disabled={isIncremental}
                                className="col-6"
                                valueDefault={getValues('hsmtemplateid')}
                                error={errors?.hsmtemplateid?.message}
                                onChange={onSelectTemplate}
                                data={dataTemplates.filter(x => x.type === (getValues("notificationtype") === "EMAIL" ? "MAIL" : getValues("notificationtype")))}
                                optionDesc="name"
                                optionValue="id"
                            />}
                        </div>
                        {getValues("notificationtype") === "HSMEMAIL" && <div style={{width:"100%"}}>
                            <div className='row-zyx'>
                                <div className='col-6'>
                                    <Typography style={{fontWeight: 'bold', flexBasis: '100%', marginBottom:8}}>{t(langKeys.email)}</Typography>
                                    <FieldSelect
                                        disabled={isIncremental}
                                        label={t(langKeys.notificationtemplate)}
                                        className="col-12"
                                        valueDefault={getValues('emailtemplateid')}
                                        error={errors?.emailtemplateid?.message}
                                        onChange={onSelectTemplateEmail}
                                        data={dataTemplates.filter(x => x.type === "MAIL")}
                                        optionDesc="name"
                                        optionValue="id"
                                    />
                                </div>
                                <div className='col-6'>
                                    <Typography style={{fontWeight: 'bold', flexBasis: '100%', marginBottom:8}}>HSM</Typography>
                                    <FieldSelect
                                        disabled={isIncremental}
                                        label={t(langKeys.notificationtemplate)}
                                        className="col-12"
                                        valueDefault={getValues('hsmtemplateid')}
                                        error={errors?.hsmtemplateid?.message}
                                        onChange={onSelectTemplate}
                                        data={dataTemplates.filter(x => x.type === "HSM")}
                                        optionDesc="name"
                                        optionValue="id"
                                        style={{marginBottom:8}}
                                    />
                                    <FieldSelect
                                        disabled={isIncremental}
                                        label={t(langKeys.communicationchannel)}
                                        className="col-12"
                                        valueDefault={getValues('communicationchannelid')}
                                        error={errors?.communicationchannelid?.message}
                                        onChange={(value) => setValue('communicationchannelid', value?.communicationchannelid || 0)}
                                        data={dataChannels.filter(x => x.type.startsWith('WHA'))}
                                        optionDesc="communicationchanneldesc"
                                        optionValue="communicationchannelid"
                                        style={{marginBottom:8}}
                                    />
                                </div>
                                <div  className='row-zyx'>
                                    <div className='col-6'>
                                        <React.Fragment>
                                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                                {t(langKeys.message)}
                                                <Tooltip title={`${t(langKeys.calendar_messate_tooltip)}`} placement="top-start">
                                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                                </Tooltip>
                                            </Box>
                                            <div dangerouslySetInnerHTML={{ __html: bodyMessageEmail }} />
                                            <div className="col-12" >
                                                {Object.keys(templateVariablesEmail).map((x, i) => {
                                                    return (
                                                        <div key={`templateVariablesEmail-${i + 1}`} style={{ paddingTop: 10 }}>
                                                            <FieldSelect
                                                                disabled={isIncremental}
                                                                label={`Email Variable #${i + 1}`}
                                                                className="col-6"
                                                                valueDefault={templateVariablesEmail[x]}
                                                                onChange={(value) => { setTemplateVariablesEmail({ ...templateVariablesEmail, [x]: value?.domainvalue || "" }) }}
                                                                data={dataVariables}
                                                                uset={true}
                                                                optionDesc="domaindesc"
                                                                optionValue="domainvalue"
                                                            />
                                                        </div>)
                                                })}
                                            </div>
                                        </React.Fragment>
                                    </div>
                                    <div className='col-6'>
                                        <React.Fragment>
                                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                                {t(langKeys.message)}
                                                <Tooltip title={`${t(langKeys.calendar_messate_tooltip)}`} placement="top-start">
                                                    <InfoIcon style={{ padding: "5px 0 0 5px" }} />
                                                </Tooltip>
                                            </Box>
                                            <div dangerouslySetInnerHTML={{ __html: bodyMessage }} />
                                            <div className="col-12" >
                                                {Object.keys(templateVariables).map((x, i) => {
                                                    return (
                                                        <div key={`templateVariables-${i + 1}`} style={{ paddingTop: 10 }}>
                                                            <FieldSelect
                                                                label={`Email Variable #${i + 1}`}
                                                                disabled={isIncremental}
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
                                    </div>
                                </div>
                            </div>
                        </div>}
                        {getValues("notificationtype") === 'HSM' && <div className="row-zyx" >
                            <FieldSelect
                                label={t(langKeys.communicationchannel)}
                                className="col-12"
                                disabled={isIncremental}
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
                            {(!!getValues("notificationtype") && getValues("notificationtype")!=="HSMEMAIL") && <React.Fragment>
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
                                                    label={`Email Variable #${i + 1}`}
                                                    disabled={isIncremental}
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
                                disabled={isIncremental}
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
                                        disabled={isIncremental}
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
                                            { desc: `HSM + ${t(langKeys.email)}`, val: "HSMEMAIL" },
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
                                                disabled={isIncremental}
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
                                                disabled={isIncremental}
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
                                                    disabled={isIncremental}
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
                                                            disabled={isIncremental}
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
                                                            disabled={isIncremental}
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
                                        disabled={isIncremental}
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
                                        disabled={isIncremental}
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
            <Accordion
                style={{ marginBottom: '8px' }}
                defaultExpanded={false}
                expanded={accordionIndex === 2}
                onChange={handleAccordion(2)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel-reminder-content'
                    id='panel-reminder-header'
                >
                    <Typography
                        style={{fontWeight: 'bold', flexBasis: '100%'}}
                    >
                        {t(langKeys.reschedule_appointment)}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div style={{ width: '100%' }}>
                        <div className="row-zyx" >

                            <FieldSelect
                                label={t(langKeys.notificationtype)}
                                className="col-6"
                                valueDefault={getValues("rescheduletype")}
                                disabled={isIncremental}
                                onChange={(value) => {
                                    setValue('rescheduletype', (value?.val || ""))
                                    onSelectTemplateRescheduleEmail(null)
                                    onSelectTemplateRescheduleHSM(null)
                                    trigger("rescheduletype")
                                }}
                                error={errors?.rescheduletype?.message}
                                data={[
                                    { desc: "HSM", val: "HSM" },
                                    { desc: t(langKeys.email), val: "EMAIL" },
                                    { desc: `HSM + ${t(langKeys.email)}`, val: "HSMEMAIL" },
                                ]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                        </div>
                        <div className="row-zyx" >
                            {getValues("rescheduletype").includes("EMAIL") &&
                                <div className="col-6" >
                                    <div style={{ paddingBottom: 10, fontWeight: "bold", fontSize: "1.1em" }}>{t(langKeys.email)}</div>
                                    <FieldSelect
                                        disabled={isIncremental}
                                        fregister={{
                                            ...register(`rescheduletemplateidemail`, {
                                                validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                            })
                                        }}
                                        label={t(langKeys.notificationtemplate)}
                                        className="col-6"
                                        valueDefault={getValues('rescheduletemplateidemail')}
                                        error={errors?.rescheduletemplateidemail?.message || dataTemplates.filter(x => x.type === "MAIL").length===0?t(langKeys.noavailabletemplates):""}
                                        onChange={onSelectTemplateRescheduleEmail}
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
                                        <div dangerouslySetInnerHTML={{ __html: bodyMessageRescheduleEmail }} />
                                    </React.Fragment>
                                </div>
                            }
                            {getValues("rescheduletype").includes("HSM") &&
                                <div className="col-6" >
                                    <div style={{ paddingBottom: 10, fontWeight: "bold", fontSize: "1.1em" }}>{t(langKeys.hsm)}</div>
                                    <FieldSelect
                                        fregister={{
                                            ...register(`rescheduletemplateidhsm`, {
                                                validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                            })
                                        }}
                                        disabled={isIncremental}
                                        label={t(langKeys.notificationtemplate)}
                                        className="col-6"
                                        valueDefault={getValues('rescheduletemplateidhsm')}
                                        error={errors?.rescheduletemplateidhsm?.message || dataTemplates.filter(x => x.type === "MAIL").length===0?t(langKeys.noavailabletemplates):""}
                                        onChange={onSelectTemplateRescheduleHSM}
                                        data={dataTemplates.filter(x => x.type === "HSM")}
                                        optionDesc="name"
                                        optionValue="id"
                                    />
                                    <div style={{ paddingTop: 10 }}>
                                        <FieldSelect
                                            label={t(langKeys.communicationchannel)}
                                            className="col-12"
                                            disabled={isIncremental}
                                            valueDefault={getValues('reschedulecommunicationchannelid')}
                                            error={errors?.reschedulecommunicationchannelid?.message}
                                            onChange={(value) => setValue('reschedulecommunicationchannelid', value?.communicationchannelid || 0)}
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
                                        <div dangerouslySetInnerHTML={{ __html: bodyMessageRescheduleHSM }} />
                                    </React.Fragment>
                                </div>
                            }
                        </div>
                        <div className="row-zyx" >
                            {getValues("rescheduletype").includes("EMAIL") &&
                                <div className="col-6" >
                                    {Object.keys(emailRescheduleVariables).map((x, i) => {
                                        return (
                                            <div key={`emailRescheduleVariables-${i + 1}`} style={{ paddingTop: 10 }}>
                                                <FieldSelect
                                                    label={`Email Variable #${i + 1}`}
                                                    className="col-6"
                                                    disabled={isIncremental}
                                                    valueDefault={emailRescheduleVariables[x]}
                                                    onChange={(value) => { setEmailRescheduleVariables({ ...emailRescheduleVariables, [x]: value?.domainvalue || "" }) }}
                                                    data={dataVariables}
                                                    uset={true}
                                                    optionDesc="domaindesc"
                                                    optionValue="domainvalue"
                                                />
                                            </div>)
                                    })}
                                </div>
                            }
                            {getValues("rescheduletype").includes("HSM") &&
                                <div className="col-6" >
                                    {Object.keys(hsmRescheduleVariables).map((x, i) => {
                                        return (
                                            <div key={`hsmRescheduleVariables-${i + 1}`} style={{ paddingTop: 10 }}>
                                                <FieldSelect
                                                    label={`Email Variable #${i + 1}`}
                                                    className="col-6"
                                                    disabled={isIncremental}
                                                    valueDefault={hsmRescheduleVariables[x]}
                                                    onChange={(value) => { setHsmRescheduleVariables({ ...hsmRescheduleVariables, [x]: value?.domainvalue || "" }) }}
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
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion
                style={{ marginBottom: '8px' }}
                defaultExpanded={false}
                expanded={accordionIndex === 3}
                onChange={handleAccordion(3)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel-reminder-content'
                    id='panel-reminder-header'
                >
                    <Typography
                        style={{fontWeight: 'bold', flexBasis: '100%'}}
                    >
                        {t(langKeys.appointment_cancellation)}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div style={{ width: '100%' }}>
                        <div className="row-zyx" >

                            <FieldSelect
                                label={t(langKeys.notificationtype)}
                                className="col-6"
                                valueDefault={getValues("canceltype")}
                                disabled={isIncremental}
                                onChange={(value) => {
                                    setValue('canceltype', (value?.val || ""))
                                    onSelectTemplateCancelEmail(null)
                                    onSelectTemplateCancelHSM(null)
                                    trigger("canceltype")
                                }}
                                error={errors?.canceltype?.message}
                                data={[
                                    { desc: "HSM", val: "HSM" },
                                    { desc: t(langKeys.email), val: "EMAIL" },
                                    { desc: `HSM + ${t(langKeys.email)}`, val: "HSMEMAIL" },
                                ]}
                                optionDesc="desc"
                                optionValue="val"
                            />
                        </div>
                        <div className="row-zyx" >
                            {getValues("canceltype").includes("EMAIL") &&
                                <div className="col-6" >
                                    <div style={{ paddingBottom: 10, fontWeight: "bold", fontSize: "1.1em" }}>{t(langKeys.email)}</div>
                                    <FieldSelect
                                        fregister={{
                                            ...register(`canceltemplateidemail`, {
                                                validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                            })
                                        }}
                                        disabled={isIncremental}
                                        label={t(langKeys.notificationtemplate)}
                                        className="col-6"
                                        valueDefault={getValues('canceltemplateidemail')}
                                        error={errors?.canceltemplateidemail?.message || dataTemplates.filter(x => x.type === "MAIL").length===0?t(langKeys.noavailabletemplates):""}
                                        onChange={onSelectTemplateCancelEmail}
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
                                        <div dangerouslySetInnerHTML={{ __html: bodyMessageCancelEmail }} />
                                    </React.Fragment>
                                </div>
                            }
                            {getValues("canceltype").includes("HSM") &&
                                <div className="col-6" >
                                    <div style={{ paddingBottom: 10, fontWeight: "bold", fontSize: "1.1em" }}>{t(langKeys.hsm)}</div>
                                    <FieldSelect
                                        fregister={{
                                            ...register(`canceltemplateidhsm`, {
                                                validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                            })
                                        }}
                                        label={t(langKeys.notificationtemplate)}
                                        className="col-6"
                                        disabled={isIncremental}
                                        valueDefault={getValues('canceltemplateidhsm')}
                                        error={errors?.canceltemplateidhsm?.message || dataTemplates.filter(x => x.type === "MAIL").length===0?t(langKeys.noavailabletemplates):""}
                                        onChange={onSelectTemplateCancelHSM}
                                        data={dataTemplates.filter(x => x.type === "HSM")}
                                        optionDesc="name"
                                        optionValue="id"
                                    />
                                    <div style={{ paddingTop: 10 }}>
                                        <FieldSelect
                                            label={t(langKeys.communicationchannel)}
                                            className="col-12"
                                            disabled={isIncremental}
                                            valueDefault={getValues('cancelcommunicationchannelid')}
                                            error={errors?.cancelcommunicationchannelid?.message}
                                            onChange={(value) => setValue('cancelcommunicationchannelid', value?.communicationchannelid || 0)}
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
                                        <div dangerouslySetInnerHTML={{ __html: bodyMessageCancelHSM }} />
                                    </React.Fragment>
                                </div>
                            }
                        </div>
                        <div className="row-zyx" >
                            {getValues("canceltype").includes("EMAIL") &&
                                <div className="col-6" >
                                    {Object.keys(emailCancelVariables).map((x, i) => {
                                        return (
                                            <div key={`emailCancelVariables-${i + 1}`} style={{ paddingTop: 10 }}>
                                                <FieldSelect
                                                    label={`Email Variable #${i + 1}`}
                                                    className="col-6"
                                                    disabled={isIncremental}
                                                    valueDefault={emailCancelVariables[x]}
                                                    onChange={(value) => { setEmailCancelVariables({ ...emailCancelVariables, [x]: value?.domainvalue || "" }) }}
                                                    data={dataVariables}
                                                    uset={true}
                                                    optionDesc="domaindesc"
                                                    optionValue="domainvalue"
                                                />
                                            </div>)
                                    })}
                                </div>
                            }
                            {getValues("canceltype").includes("HSM") &&
                                <div className="col-6" >
                                    {Object.keys(hsmCancelVariables).map((x, i) => {
                                        return (
                                            <div key={`hsmCancelVariables-${i + 1}`} style={{ paddingTop: 10 }}>
                                                <FieldSelect
                                                    label={`Email Variable #${i + 1}`}
                                                    className="col-6"
                                                    disabled={isIncremental}
                                                    valueDefault={hsmCancelVariables[x]}
                                                    onChange={(value) => { setHsmCancelVariables({ ...hsmCancelVariables, [x]: value?.domainvalue || "" }) }}
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
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default CalendarReminders;