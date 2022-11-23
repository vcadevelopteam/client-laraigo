/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'; // we need this to make JSX compile
import { FieldEdit, FieldSelect } from 'components';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { Box, Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { ICalendarFormFields } from './ICalendar';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
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
                                    error={errors?.remindermailtemplateid?.message}
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
                                    error={errors?.reminderhsmtemplateid?.message}
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
    )
}

export default CalendarReminders;