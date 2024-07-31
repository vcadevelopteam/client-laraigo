/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, makeStyles, Breadcrumbs, Grid, Button, CircularProgress, Box, TextField, Modal, IconButton, Checkbox, Tabs, Avatar, Paper, InputAdornment } from '@material-ui/core';
import { EmojiPickerZyx, FieldEdit, FieldMultiSelectFreeSolo, FieldSelect, FieldView, PhoneFieldEdit, TitleDetail, AntTabPanel, FieldEditArray, DialogZyx, FieldEditMulti } from 'components';
import { RichText } from 'components/fields/RichText';
import { langKeys } from 'lang/keys';
import paths from 'common/constants/paths';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';
import PhoneIcon from '@material-ui/icons/Phone';
import {
    userSDSel, getPaginatedPersonLead as getPersonListPaginated1, leadLogNotesSel, leadActivitySel, leadLogNotesIns, leadActivityIns, getValuesFromDomain, getColumnsSDSel, leadHistorySel,
    leadHistoryIns, getLeadsSDSel, insSDLead, getSLASel
} from 'common/helpers';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import {
    getAdvisers, getLead, getLeadActivities, getLeadHistory, getLeadLogNotes, getLeadPhases, markDoneActivity, resetArchiveLead, resetGetLead, resetGetLeadActivities, resetGetLeadHistory,
    resetGetLeadLogNotes, resetGetLeadPhases, resetMarkDoneActivity, resetSaveLead, resetSaveLeadActivity, resetSaveLeadLogNote, saveLeadActivity, saveLeadLogNote, saveLeadWithFiles, saveLead as saveLeadAction,
    getLeadTagsDomain, resetGetLeadTagsDomain, getLeadTemplates, getLeadChannels, resetGetLeadChannels
} from 'store/lead/actions';
import { Dictionary, IcrmLeadActivity, ICrmLeadActivitySave, ICrmLeadHistory, ICrmLeadHistoryIns, ICrmLeadNote, ICrmLeadNoteSave, IDomain, IFetchData, IPerson, IServiceDeskLead } from '@types';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@material-ui/lab';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TableZyx from 'components/fields/table-paginated';
import { AttachFile, Clear, Close, GetApp, Create, Done, FileCopy, Info, Mood, Add } from '@material-ui/icons';
import { getDomainsByTypename, getPersonListPaginated, resetGetPersonListPaginated } from 'store/person/actions';
import clsx from 'clsx';
import { AccessTime as AccessTimeIcon, Flag as FlagIcon, Cancel as CancelIcon, Note as NoteIcon, LocalOffer as LocalOfferIcon, LowPriority as LowPriorityIcon, Star as StarIcon, History as HistoryIcon, TrackChanges as TrackChangesIcon } from '@material-ui/icons';
import { useFieldArray, useForm } from 'react-hook-form';
import { getCollection, resetMain } from 'store/main/actions';
import { AntTab } from 'components';
import { EmailIcon, WhatsappIcon, SmsIcon } from 'icons';
import { Descendant } from 'slate';
import { emitEvent } from 'store/inbox/actions';
import { emojis } from "common/constants/emojis";
import { sendHSM } from 'store/inbox/actions';
import { setModalCall, setPhoneNumber } from 'store/voximplant/actions';
import MailIcon from '@material-ui/icons/Mail';
import DialogInteractions from 'components/inbox/DialogInteractions';
import { getCompany, getGroups, getImpact, getPriority, getSlaRules, getUrgency, resetGetCompany, resetGetGroups, resetGetImpact, resetGetPriority, resetGetSlaRules, resetGetUrgency } from 'store/servicedesk/actions';
const isIncremental = window.location.href.includes("incremental")

const EMOJISINDEXED = emojis.reduce((acc: any, item: any) => ({ ...acc, [item.emojihex]: item }), {});

const variables = ['firstname', 'lastname', 'displayname', 'email', 'phone', 'documenttype', 'documentnumber', 'custom'].map(x => ({ key: x }))

const useLeadFormStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: theme.palette.text.primary,
    },
    subtitle: {
        padding: '0 8px',
        fontSize: 22,
        fontWeight: 500,
    },
    currency: {
        '&::before': {
            content: '"S/ "',
        },
    },
    field: {
        margin: theme.spacing(1),
        minHeight: 58,
        width: "98%"
    },
    titleInput: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        // width: 130,
        height: 45,
        maxWidth: 'unset',
        border: '#A59F9F 1px solid',
        borderRadius: 6,
        backgroundColor: 'white',
        flexGrow: 1,
        color: 'black',
        fontWeight: 'bold',
    },
    activetab: {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    badge: {
        borderRadius: 12,
        color: 'white',
        backgroundColor: '#FFA000',
        padding: '4px 6px',
        fontWeight: 'bold',
        fontSize: 14,
    },
    fakeInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',

        borderBottom: `2px solid ${theme.palette.text.secondary}`,
        '&:hover': {
            borderBottom: `2px solid ${theme.palette.text.primary}`,
        },
    },
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));
const convertLocalDate = (date: string | null | undefined, validateWithToday: boolean = false, subtractHours: boolean = true): String => {
    if (!date) return ""
    const dateCleaned = new Date(date)
    // const dateCleaned = new Date(nn.getTime() + (subtractHours ? (nn.getTimezoneOffset() * 60 * 1000 * -1) : 0));
    return validateWithToday ? (dateCleaned > new Date() ? new Date() : dateCleaned).toLocaleString() : dateCleaned.toLocaleString();
}
interface DialogSendTemplateProps {
    setOpenModal: (param: any) => void;
    openModal: boolean;
    persons: any[];
    type: "HSM" | "MAIL" | "SMS";
}

const DialogSendTemplate: React.FC<DialogSendTemplateProps> = ({ setOpenModal, openModal, persons, type }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const sendingRes = useSelector(state => state.inbox.triggerSendHSM);
    const [templatesList, setTemplatesList] = useState<Dictionary[]>([]);
    const [channelList, setChannelList] = useState<Dictionary[]>([]);
    const [bodyMessage, setBodyMessage] = useState('');
    const [personWithData, setPersonWithData] = useState<IPerson[]>([])
    const domains = useSelector(state => state.person.editableDomains);

    const title = useMemo(() => {
        switch (type) {
            case "HSM": return t(langKeys.send_hsm);
            case "SMS": return t(langKeys.send_sms);
            case "MAIL": return t(langKeys.send_mail);
            default: return '-';
        }
    }, [type]);
    const { control, register, handleSubmit, setValue, getValues, trigger, reset, formState: { errors } } = useForm<any>({
        defaultValues: {
            hsmtemplateid: 0,
            observation: '',
            communicationchannelid: type === "HSM" ? (channelList?.length === 1 ? channelList[0].communicationchannelid : 0) : 0,
            communicationchanneltype: type === "HSM" ? (channelList?.length === 1 ? channelList[0].type : "") : '',
            variables: []
        }
    });

    const { fields } = useFieldArray({
        control,
        name: 'variables',
    });

    useEffect(() => {
        if (waitClose) {
            if (!sendingRes.loading && !sendingRes.error) {
                const message = type === "HSM" ? t(langKeys.successful_send_hsm) : (type === "SMS" ? t(langKeys.successful_send_sms) : t(langKeys.successful_send_mail));
                dispatch(showSnackbar({ show: true, severity: "success", message }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitClose(false);
            } else if (sendingRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(sendingRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitClose(false);
            }
        }
    }, [sendingRes, waitClose])
    useEffect(() => {
    }, [channelList])

    useEffect(() => {
        if (!domains.error && !domains.loading) {
            setTemplatesList(domains?.value?.templates?.filter(x => (type !== "MAIL" ? x.type === type : (x.type === type || x.type === "HTML"))) || []);
            setChannelList(domains?.value?.channels?.filter(x => x.type.includes(type === "HSM" ? "WHA" : type)) || []);
        }
    }, [domains, type])

    useEffect(() => {
        if (openModal) {
            setBodyMessage('')
            reset({
                hsmtemplateid: 0,
                hsmtemplatename: '',
                variables: [],
                communicationchannelid: type === "HSM" ? (channelList?.length === 1 ? channelList[0].communicationchannelid : 0) : 0,
                communicationchanneltype: type === "HSM" ? (channelList?.length === 1 ? channelList[0].type : "") : ''
            })
            register('hsmtemplateid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });

            if (type === "HSM") {
                register('communicationchannelid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            } else {
                register('communicationchannelid');
            }

            if (type === "MAIL") {
                setPersonWithData(persons.filter(x => x.email && x.email.length > 0))
            } else if (type === "HSM") {
                setPersonWithData(persons.filter(x => !!x.phone))
            } else {
                setPersonWithData(persons.filter(x => x.phone && x.phone.length > 0))
            }
        } else {
            setWaitClose(false);
        }
    }, [openModal])

    const onSelectTemplate = (value: Dictionary) => {
        if (value) {
            setBodyMessage(value.body);
            setValue('hsmtemplateid', value?.id || 0);
            setValue('hsmtemplatename', value?.name || '');
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
        if (personWithData.length === 0) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.no_people_to_send) }))
            return
        }
        const messagedata = {
            hsmtemplateid: data.hsmtemplateid,
            hsmtemplatename: data.hsmtemplatename,
            communicationchannelid: data.communicationchannelid,
            communicationchanneltype: data.communicationchanneltype,
            platformtype: data.communicationchanneltype,
            type,
            shippingreason: "PERSON",
            listmembers: personWithData.map(person => ({
                personid: person.personid,
                phone: person.phone?.replace("+", '') || "",
                firstname: person.firstname || "",
                email: person.email || "",
                lastname: person.lastname,
                parameters: data.variables.map((v: any) => ({
                    type: "text",
                    text: v.variable !== 'custom' ? (person as Dictionary)[v.variable] : v.text,
                    name: v.name
                }))
            }))
        }
        dispatch(sendHSM(messagedata))
        dispatch(showBackdrop(true));
        setWaitClose(true)
    });

    useEffect(() => {
        if (channelList.length === 1 && type === "HSM") {
            setValue("communicationchannelid", channelList[0].communicationchannelid || 0)
            setValue('communicationchanneltype', channelList[0].type || "");
            trigger("communicationchannelid")
        }
    }, [channelList])

    return (
        <DialogZyx
            open={openModal}
            title={title}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            {type === "HSM" && (
                <div className="row-zyx">
                    <FieldSelect
                        label={t(langKeys.channel)}
                        className="col-12"
                        valueDefault={getValues('communicationchannelid')}
                        onChange={value => {
                            setValue('communicationchannelid', value?.communicationchannelid || 0);
                            setValue('communicationchanneltype', value?.type || "");
                        }}
                        error={errors?.communicationchannelid?.message}
                        data={channelList}
                        optionDesc="communicationchanneldesc"
                        optionValue="communicationchannelid"
                    />
                </div>
            )}
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.template)}
                    className="col-12"
                    valueDefault={getValues('hsmtemplateid')}
                    onChange={onSelectTemplate}
                    error={errors?.hsmtemplateid?.message}
                    data={templatesList}
                    optionDesc="name"
                    optionValue="id"
                />
            </div>
            {type === 'MAIL' &&
                <div style={{ overflow: 'scroll' }}>
                    <React.Fragment>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.message)}</Box>
                        <div dangerouslySetInnerHTML={{ __html: bodyMessage }} />
                    </React.Fragment>
                </div>
            }
            {type !== 'MAIL' &&
                <FieldEditMulti
                    label={t(langKeys.message)}
                    valueDefault={bodyMessage}
                    disabled={true}
                    rows={1}
                />
            }
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {fields.map((item: Dictionary, i) => (
                    <div key={item.id}>
                        <FieldSelect
                            key={"var_" + item.id}
                            fregister={{
                                ...register(`variables.${i}.variable`, {
                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                })
                            }}
                            label={item.name}
                            valueDefault={getValues(`variables.${i}.variable`)}
                            onChange={(value) => {
                                setValue(`variables.${i}.variable`, value.key)
                                trigger(`variables.${i}.variable`)
                            }}
                            error={errors?.variables?.[i]?.text?.message}
                            data={variables}
                            uset={true}
                            prefixTranslation=""
                            optionDesc="key"
                            optionValue="key"
                        />
                        {getValues(`variables.${i}.variable`) === 'custom' &&
                            <FieldEditArray
                                key={"custom_" + item.id}
                                fregister={{
                                    ...register(`variables.${i}.text`, {
                                        validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                    })
                                }}
                                valueDefault={item.value}
                                error={errors?.variables?.[i]?.text?.message}
                                onChange={(value) => setValue(`variables.${i}.text`, "" + value)}
                            />
                        }
                    </div>
                ))}
            </div>
        </DialogZyx>)
}

export const ServiceDeskLeadForm: FC<{ edit?: boolean }> = ({ edit = false }) => {
    const classes = useLeadFormStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch<{ id: string, columnid?: string, columnuuid?: string }>();
    const [phasemenu, setphasemenu] = useState<any[]>([])
    const [values, setValues] = useState<IServiceDeskLead>({
        column_uuid: match.params.columnuuid || '',
        columnid: Number(match.params.columnid),
        priority: 'LOW',
    } as IServiceDeskLead
    );
    const [tabIndex, setTabIndex] = useState(0);
    const [openPersonModal, setOpenPersonmodal] = useState(false);
    const lead = useSelector(state => state.servicedesk.lead);
    const advisers = useSelector(state => state.servicedesk.advisers);
    const phases = useSelector(state => state.servicedesk.leadPhases);
    const user = useSelector(state => state.login.validateToken.user);
    const archiveLeadProcess = useSelector(state => state.servicedesk.archiveLead);
    const saveActivity = useSelector(state => state.servicedesk.saveLeadActivity);
    const saveNote = useSelector(state => state.servicedesk.saveLeadNote);
    const leadActivities = useSelector(state => state.servicedesk.leadActivities);
    const leadNotes = useSelector(state => state.servicedesk.leadLogNotes);
    const saveLead = useSelector(state => state.servicedesk.saveLead);
    const leadHistory = useSelector(state => state.servicedesk.leadHistory);
    const updateLeadTagProcess = useSelector(state => state.servicedesk.updateLeadTags);
    const leadTagsDomain = useSelector(state => state.servicedesk.leadTagsDomain);
    const slarules = useSelector(state => state.servicedesk.slarules);
    const dataUrgency = useSelector(state => state.servicedesk.urgency);
    const dataImpact = useSelector(state => state.servicedesk.impact);
    const dataCompany = useSelector(state => state.servicedesk.company);
    const dataPriority = useSelector(state => state.servicedesk.priority);
    const dataGroups = useSelector(state => state.servicedesk.groups);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);

    const leadTagsChanges = useRef<ICrmLeadHistoryIns[]>([]);
    const [openDialogTemplate, setOpenDialogTemplate] = useState(false)
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const userConnected = useSelector(state => state.inbox.userConnected);
    const [openModal, setOpenModal] = useState(false);
    const [visorSD, setVisorSD] = useState(false);
    const [openModalChangePhase, setOpenModalChangePhase] = useState(false);

    const [typeTemplate, setTypeTemplate] = useState<"HSM" | "SMS" | "MAIL">('MAIL');
    const [extraTriggers, setExtraTriggers] = useState({
        phone: lead.value?.phone || '',
        email: lead.value?.email || '',
    })

    const openDialogInteractions = (row: any) => {
        setOpenModal(true);
        setRowSelected({ conversationid: getValues('conversationid'), displayname: values?.displayname, ticketnum: getValues('ticketnum') })
    };

    useEffect(() => {
        setVisorSD(!!user?.roledesc?.includes("VISOR") || isIncremental)
    }, [user]);

    const { register, setValue, getValues, formState: { errors }, reset, trigger } = useForm<any>({
        defaultValues: {
            leadid: 0,
            description: '',
            sd_request: '',
            ticketnum: '',
            createdate: null,
            company: '',
            phone: '',
            impact: '',
            sla_date: null,
            resolution_date: null,
            leadgroups: '',
            type: '',
            email: '',
            columnid: Number(match.params.columnid),
            column_uuid: match.params.columnuuid || '',
            priority: '',
            urgency: '',
            first_contact_date: null,
            first_contact_deadline: null,
            tags: '',
            userid: 0,
            status: 'ACTIVO',
            date_deadline: '',
            personcommunicationchannel: '',
            conversationid: 0,
            index: 0,
            operation: "INSERT",
            phase: '',

            persontype: '',
            campaignid: 0,
            personid: 0,

            activities: [] as ICrmLeadActivitySave[],
            notes: [] as ICrmLeadNoteSave[],

            feedback: '',
        }
    });

    const registerFormFieldOptions = useCallback(() => {
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('sd_request');
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('createdate');
        register('company', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('phone');
        register('impact', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('urgency', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('personid', { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register('leadgroups')//, { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('ticketnum', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('priority');
        register('email', {
            validate: {
                isemail: (value) => ((!value || (/\S+@\S+\.\S+/.test(value))) || t(langKeys.emailverification) + "")
            }
        });
        register('first_contact_date');
        register('first_contact_deadline');
        register('tags');
        register('userid');
        register('date_deadline');
        register('personcommunicationchannel');
        register('columnid', { validate: (value) => ((value !== null && value !== undefined && value !== '') || t(langKeys.field_required) + "") });
    }, [register, t]);

    React.useEffect(() => {
        registerFormFieldOptions();
    }, [registerFormFieldOptions]);

    const onSubmit = async () => {
        const allOk = await trigger();
        if (allOk) {
            const data = getValues();
            if (!data.priority) {
                dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.needslaconfig) }))
            }
            else {

                const callback = () => {
                    const cancelPhase = phases.data.find((x: any) => x.description.toLowerCase() === 'cancelado');
                    if (cancelPhase?.columnid === data.columnid) {
                        data.status = "CERRADO";
                    }
                    if (edit) {
                        dispatch(saveLeadAction([
                            insSDLead(data, data.operation),
                            ...leadTagsChanges.current.map(leadHistoryIns),
                        ], false));
                    } else {
                        dispatch(saveLeadWithFiles(async (uploader) => {
                            const notes = (data.notes || []) as ICrmLeadNoteSave[];
                            for (let i = 0; i < notes.length; i++) {
                                // subir los archivos de la nota que se va a agregar
                                if (notes[i].media && Array.isArray(notes[i].media)) {
                                    const urls: String[] = [];
                                    for (const fileToUpload of notes[i].media as File[]) {
                                        const url = await uploader(fileToUpload);
                                        urls.push(url);
                                    }
                                    notes[i].media = urls.join(',');
                                }
                            }

                            return {
                                header: insSDLead(data, data.operation),
                                detail: [
                                    ...notes.map((x: ICrmLeadNoteSave) => leadLogNotesIns(x)),
                                    ...(data.activities || []).map((x: ICrmLeadActivitySave) => leadActivityIns(x)),
                                ],
                            };
                        }, true));
                    }
                };

                dispatch(manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback
                }))
            }
        }
    };

    useEffect(() => {
        if (edit === true) {
            const leadId = match.params.id;
            dispatch(getLead(getLeadsSDSel({
                id: Number(leadId),
                fullname: '',
                tags: '',
                leadproduct: '',
                supervisorid: user?.userid || 0,
                all: false,
                company: '',
                groups: '',
                startdate: "",
                enddate: "",
                offset: -5,
            })));
            dispatch(getLeadActivities(leadActivitySel(leadId)));
            dispatch(getLeadLogNotes(leadLogNotesSel(leadId)));
            dispatch(getLeadHistory(leadHistorySel(leadId)));
        }
        dispatch(getDomainsByTypename());
        dispatch(getAdvisers(userSDSel()));
        dispatch(getSlaRules(getSLASel(0)));
        dispatch(getLeadPhases(getColumnsSDSel(0, true)));
        dispatch(getLeadTagsDomain(getValuesFromDomain('OPORTUNIDADETIQUETAS')));
        dispatch(getLeadTemplates());
        dispatch(getLeadChannels());
        dispatch(getGroups(getValuesFromDomain('GRUPOSSERVICEDESK')));
        dispatch(getUrgency(getValuesFromDomain('URGENCIA')));
        dispatch(getImpact(getValuesFromDomain('IMPACTO')));
        dispatch(getPriority(getValuesFromDomain('PRIORIDAD')));
        dispatch(getCompany(getValuesFromDomain('EMPRESA')));

        return () => {
            dispatch(resetGetLead());
            dispatch(resetSaveLead());
            dispatch(resetGetPersonListPaginated());
            dispatch(resetGetLeadPhases());
            dispatch(resetGetSlaRules());
            dispatch(resetArchiveLead());
            dispatch(resetGetLeadActivities());
            dispatch(resetSaveLeadActivity());
            dispatch(resetGetLeadLogNotes());
            dispatch(resetSaveLeadLogNote());
            dispatch(resetGetLeadHistory());
            dispatch(resetGetLeadTagsDomain());
            dispatch(resetGetLeadChannels());
            dispatch(resetGetGroups());
            dispatch(resetGetUrgency());
            dispatch(resetGetImpact());
            dispatch(resetGetPriority());
            dispatch(resetGetCompany());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit, match.params.id, dispatch]);

    function setcriticallity(impact: string, urgency: string, company: string) {
        if (!!impact && !!urgency && !!slarules) {
            let filtereddata = slarules.data.filter(x => x.type === "SD" && x.company === company)
            if (filtereddata.length > 0) {
                let calcCriticallity = filtereddata?.[0].criticality.filter((x: any) => x.impact === impact && x.urgency === urgency)
                let priority = calcCriticallity[0]?.priority
                setValue('priority', priority || '')
                if (priority) {
                    let createdate = getValues("createdate")
                    let servicetimes = filtereddata[0].service_times.filter((x: any) => x.priority === priority)
                    if (!!createdate && servicetimes.length > 0) {
                        let first_contact_deadline = new Date(createdate)
                        let resolution_deadline = new Date(createdate)
                        let umfirstreply = servicetimes[0].umfirstreply === "MINUTES" ? 60000 : 3600000
                        let umsolutiontime = servicetimes[0].umsolutiontime === "MINUTES" ? 60000 : 3600000
                        first_contact_deadline.setTime(first_contact_deadline.getTime() + Number(servicetimes[0].firstreply) * umfirstreply)
                        resolution_deadline.setTime(resolution_deadline.getTime() + Number(servicetimes[0].solutiontime) * umsolutiontime)
                        setValue('first_contact_deadline', first_contact_deadline.toISOString().replace("T", " "))
                        setValue('resolution_deadline', resolution_deadline.toISOString().replace("T", " "))
                        trigger('first_contact_deadline')
                        trigger('resolution_deadline')
                    }
                }
            } else {
                setValue('priority', '')
            }
        } else {
            setValue('priority', '')
        }
        trigger('priority')
    }

    useEffect(() => {
        if (phases.loading) return;
        if (phases.error) {
            const errormessage = t(phases.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                severity: "error",
                message: errormessage,
                show: true,
            }));
        } else if (!edit && (!values.column_uuid || !values.columnid) && phases.data.length > 0) {
            setValues(prev => ({
                ...prev,
                column_uuid: phases.data[0].column_uuid,
                columnid: phases.data[0].columnid,
            }));
            setValue('columnid', phases.data[0].columnid);
            setValue('column_uuid', phases.data[0].column_uuid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phases, edit]);

    useEffect(() => {
        if (!edit) return;
        if (lead.loading) return;
        if (lead.error) {
            const errormessage = t(lead.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                severity: "error",
                message: errormessage,
                show: true,
            }));
        } else if (lead.value && edit) {
            setValues(lead.value!);
            reset({
                description: lead.value?.description,
                sd_request: lead.value?.sd_request,
                type: lead.value?.type,
                ticketnum: lead.value?.ticketnum,
                createdate: lead.value?.createdate,
                company: lead.value?.company || "",
                phone: lead.value?.phone,
                impact: lead.value?.impact,
                priority: lead.value?.priority,
                urgency: lead.value?.urgency,
                sla_date: lead.value?.sla_date,
                resolution_deadline: lead.value?.resolution_deadline,
                resolution_date: lead.value?.resolution_date,
                leadgroups: lead.value?.leadgroups,
                columnid: lead.value?.columnid,
                column_uuid: lead.value?.column_uuid,
                email: lead.value?.email,
                first_contact_date: lead.value?.first_contact_date,
                first_contact_deadline: lead.value?.first_contact_deadline,
                tags: lead.value?.tags,
                userid: lead.value?.userid,
                status: lead.value?.status,
                date_deadline: lead.value?.date_deadline,
                personcommunicationchannel: lead.value?.personcommunicationchannel,
                conversationid: lead.value?.conversationid,
                index: lead.value?.index,
                operation: "UPDATE",
                leadid: match.params.id,
                phase: lead.value?.phase,
                campaignid: lead.value?.campaignid,
                personid: lead.value?.personid || 0,

                activities: [] as ICrmLeadActivitySave[],
                notes: [] as ICrmLeadNoteSave[],

                feedback: '',
            });
            registerFormFieldOptions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lead, edit, t, dispatch]);

    useEffect(() => {
        if (advisers.loading) return;
        if (advisers.error) {
            const errormessage = t(advisers.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                severity: "error",
                message: errormessage,
                show: true,
            }));
        }
    }, [advisers, t, dispatch]);

    useEffect(() => {
        setExtraTriggers({
            email: values?.email || "",
            phone: values?.phone || ""
        })
    }, [values]);

    useEffect(() => {
        if (saveLead.loading) return;
        if (saveLead.error) {
            const errormessage = t(saveLead.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                severity: "error",
                message: errormessage,
                show: true,
            }));
        } else if (saveLead.success === true) {
            dispatch(showSnackbar({
                severity: "success",
                message: "Se guardo la solicitud SD con éxito",
                show: true,
            }));
            history.push(paths.SERVICE_DESK);
        }
    }, [saveLead, history, t, dispatch]);

    useEffect(() => {
        if (archiveLeadProcess.loading) return;
        if (archiveLeadProcess.error) {
            const errormessage = t(archiveLeadProcess.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                severity: "error",
                message: errormessage,
                show: true,
            }));
        } else if (archiveLeadProcess.success) {
            dispatch(showSnackbar({
                severity: "success",
                message: "Se cerró la oportunidad con éxito",
                show: true,
            }));
            history.push(paths.SERVICE_DESK);
        }
    }, [archiveLeadProcess, history, t, dispatch]);

    useEffect(() => {
        if (leadActivities.loading) return;
        if (leadActivities.error) {
            const errormessage = t(leadActivities.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        }
    }, [leadActivities, t, dispatch]);

    useEffect(() => {
        if (saveActivity.loading) return;
        if (saveActivity.error) {
            const errormessage = t(saveActivity.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        } else if (saveActivity.success) {
            dispatch(showSnackbar({
                message: "Se guardó la actividad",
                severity: "success",
                show: true,
            }));
            dispatch(getLeadActivities(leadActivitySel(match.params.id)));
            dispatch(getLeadHistory(leadHistorySel(match.params.id)));
            dispatch(resetSaveLeadActivity());
        }
    }, [saveActivity, match.params.id, t, dispatch]);

    useEffect(() => {
        if (leadNotes.loading) return;
        if (leadNotes.error) {
            const errormessage = t(leadNotes.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        }
    }, [leadNotes, t, dispatch]);

    useEffect(() => {
        if (saveNote.loading) return;
        if (saveNote.error) {
            const errormessage = t(saveNote.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        } else if (saveNote.success) {
            dispatch(showSnackbar({
                message: "Se registró la nota",
                severity: "success",
                show: true,
            }));
            dispatch(getLeadLogNotes(leadLogNotesSel(match.params.id)));
            dispatch(getLeadHistory(leadHistorySel(match.params.id)));
        }
    }, [saveNote, match.params.id, t, dispatch]);

    useEffect(() => {
        if (leadHistory.loading) return;
        if (leadHistory.error) {
            const errormessage = t(leadHistory.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        }
    }, [leadHistory, t, dispatch]);

    useEffect(() => {
        if (updateLeadTagProcess.loading) return;
        if (updateLeadTagProcess.error) {
            const errormessage = t(updateLeadTagProcess.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        } else if (updateLeadTagProcess.success && edit === true) {
            dispatch(getLeadHistory(leadHistorySel(match.params.id)));
        }
    }, [updateLeadTagProcess, match.params.id, edit, t, dispatch]);

    const handleUpdateLeadTags = useCallback((value: any, action: "NEWTAG" | "REMOVETAG") => {
        if (edit === false || !lead.value) return;

        const desc = String(typeof value === "object" ? value?.domaindesc || '-' : value);
        const tagsAlreadyHasChange = leadTagsChanges.current.some(x => x.description === desc);
        const previousTagsIncludeDesc = lead.value.tags.includes(desc);

        if (
            (!previousTagsIncludeDesc && !tagsAlreadyHasChange) ||
            (action === "REMOVETAG" && previousTagsIncludeDesc && !tagsAlreadyHasChange)
        ) {
            leadTagsChanges.current.push({
                description: desc,
                status: "ACTIVO",
                type: action,
                leadid: Number(match.params.id),
                operation: "INSERT",
                historyleadid: 0,
            });
        } else if (action === "NEWTAG" && !previousTagsIncludeDesc && tagsAlreadyHasChange) {
            const historyBody = leadTagsChanges.current.find(x => x.description === desc);
            if (historyBody) {
                historyBody.type = action;
            }
        } else if (
            (action === "REMOVETAG" && !previousTagsIncludeDesc && tagsAlreadyHasChange) ||
            (action === "NEWTAG" && previousTagsIncludeDesc && tagsAlreadyHasChange)
        ) {
            leadTagsChanges.current = leadTagsChanges.current.filter(x => x.description !== desc)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lead, edit, match.params.id, dispatch]);

    const iSProcessLoading = useCallback(() => {
        return (
            saveLead.loading ||
            archiveLeadProcess.loading ||
            saveActivity.loading ||
            saveNote.loading
        );
    }, [saveLead, archiveLeadProcess, saveActivity, saveNote]);

    const onCloseSelectPersonModal = useCallback(() => {
        setOpenPersonmodal(false);
    }, []);

    const onClickSelectPersonModal = useCallback((value: IPerson) => {
        setValue('personcommunicationchannel', "")
        setValue('personid', value?.personid)
        setValue('email', value?.email || '')
        setValue('phone', value?.phone || '')
        setExtraTriggers({
            phone: value?.phone || '',
            email: value?.email || '',
        })
        setValues(prev => ({ ...prev, displayname: value.name }))
        trigger('personid')
    }, [setValue]);

    const isStatusClosed = useCallback(() => {
        return lead.value?.status === "RESUELTO";
    }, [lead]);

    function getOrderindex(type: string) {
        switch (type) {
            case "NEW":
                return 0;
            case "QUALIFIED":
                return 1;
            case "PROPOSITION":
                return 2;
            case "WON":
                return 3;
            default:
                return 4;
        }
    }

    const translatedPhases = useMemo(() => phases.data.map(x => ({
        columnid: x.columnid,
        column_uuid: x.column_uuid,
        description: t(x.description.toLowerCase()),
        type: x.type,
        index: getOrderindex(x.type),
        // eslint-disable-next-line react-hooks/exhaustive-deps
    })), [phases]);
    React.useEffect(() => {
        setphasemenu(translatedPhases.sort((a, b) => (a.index > b.index) ? 1 : -1));
    }, [translatedPhases]);

    if (edit === true && lead.loading && advisers.loading) {
        return <Loading />;
    } else if (edit === true && (lead.error)) {
        return <div>ERROR</div>;
    }
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={classes.root}>
                <form>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                if (iSProcessLoading()) return;
                                history.goBack();
                            }}
                        >
                            {t(langKeys.servicedesk)}
                        </Link>
                        <Link
                            underline="hover"
                            color="textPrimary"
                            href={history.location.pathname}
                            onClick={(e) => e.preventDefault()}
                        >
                            <Trans i18nKey={langKeys.request} /> SD
                        </Link>
                    </Breadcrumbs>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
                        <TitleDetail
                            variant="h1"
                            title={edit ?
                                (
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <span>{getValues('description')}</span>
                                        {isStatusClosed() && <div style={{ width: '0.63em' }} />}
                                        {isStatusClosed() && (
                                            <div className={classes.badge}>
                                                <Trans i18nKey={langKeys.closed2} />
                                            </div>
                                        )}
                                    </div>
                                ) :
                                <><Trans i18nKey={langKeys.newrequest} /> SD</>
                            }
                        />
                        <div style={{ flexGrow: 1 }} />
                        {(!lead.loading) && <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => history.goBack()}
                            disabled={iSProcessLoading()}
                        >
                            <Trans i18nKey={langKeys.back} />
                        </Button>}
                        {(edit && !!extraTriggers.phone && !visorSD) &&
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<WhatsappIcon width={24} style={{ fill: '#FFF' }} />}
                                onClick={() => {
                                    setOpenDialogTemplate(true);
                                    setTypeTemplate("HSM");
                                }}
                            >
                                <Trans i18nKey={langKeys.send_hsm} />
                            </Button>
                        }
                        {(edit && !!extraTriggers.email && !visorSD && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(extraTriggers.email)) &&
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<MailIcon width={24} style={{ fill: '#FFF' }} />}
                                onClick={() => {
                                    setOpenDialogTemplate(true);
                                    setTypeTemplate("MAIL");
                                }}
                            >
                                <Trans i18nKey={langKeys.send_mail} />
                            </Button>
                        }
                        {(edit && !!extraTriggers.phone && !visorSD) &&
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SmsIcon width={24} style={{ fill: '#FFF' }} />}
                                onClick={() => {
                                    setOpenDialogTemplate(true);
                                    setTypeTemplate("SMS");
                                }}
                            >
                                <Trans i18nKey={langKeys.send_sms} />
                            </Button>
                        }
                        {(!lead.loading && !visorSD) &&
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                    const allOk = await trigger();
                                    if (allOk) {
                                        setOpenModalChangePhase(true);
                                    }
                                }}
                            >
                                <Trans i18nKey={langKeys.phasechange} />
                            </Button>
                        }
                        {(!isStatusClosed() && !lead.loading && !visorSD) && <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="button"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            disabled={iSProcessLoading()}
                            onClick={onSubmit}
                        >
                            <Trans i18nKey={langKeys.save} />
                        </Button>}
                    </div>
                    <div style={{ height: '1em' }} />
                    <Grid container direction="row" style={{ backgroundColor: 'white', padding: '16px' }}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <Grid container direction="column">
                                <FieldEdit
                                    label={t(langKeys.request)}
                                    className={classes.field}
                                    onChange={(value) => setValue('sd_request', value)}
                                    valueDefault={getValues('sd_request')}
                                    disabled={true}
                                />
                                {!(lead?.value?.ticketnum) ?
                                    <FieldEdit
                                        label={t(langKeys.ticket)}
                                        className={classes.field}
                                        onChange={(value) => setValue('ticketnum', value)}
                                        valueDefault={getValues('ticketnum')}
                                        disabled={visorSD}
                                        error={errors?.ticketnum?.message}
                                    />
                                    :
                                    <div className={classes.field}>
                                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">
                                            {t(langKeys.ticket)}
                                        </Box>
                                        <label
                                            className={classes.labellink}
                                            onClick={() => openDialogInteractions(lead)}
                                        >
                                            {getValues('ticketnum')}
                                        </label>
                                    </div>
                                }
                                {edit ?
                                    (
                                        <FieldEdit
                                            label={t(langKeys.userwhoreported)}
                                            className={classes.field}
                                            valueDefault={values?.displayname}
                                            disabled={true}
                                        />
                                    ) :
                                    (<div style={{ display: 'flex', flexDirection: 'column' }} className={classes.field}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <div style={{ flexGrow: 1 }}>
                                                <FieldView
                                                    label={t(langKeys.userwhoreported)}
                                                    value={values?.displayname}
                                                />
                                            </div>
                                            <IconButton
                                                color="primary"
                                                onClick={() => setOpenPersonmodal(true)}
                                                size="small"
                                                disabled={isStatusClosed() || iSProcessLoading()}
                                            >
                                                <Add style={{ height: 22, width: 22 }} />
                                            </IconButton>
                                        </div>
                                        <div style={{ flexGrow: 1, marginTop: (errors?.personid?.message) ? '29px' : '3px' }} />
                                        <div style={{ borderBottom: `solid ${(errors?.personid?.message) ? '2px rgba(250,0,0,1)' : '1px rgba(0,0,0,0.42)'} `, marginBottom: '4px' }}></div>
                                        <div style={{ display: (errors?.personid?.message) ? 'inherit' : 'none', color: 'red', fontSize: '0.75rem' }}>{errors?.personid?.message}</div>
                                    </div>)
                                }
                                <FieldSelect
                                    label={t(langKeys.business)}
                                    className={classes.field}
                                    valueDefault={getValues('company')}
                                    onChange={(value) => {
                                        setValue('company', value.domainvalue || "");
                                        setcriticallity(getValues("impact"), getValues('urgency'), value.domainvalue || "")
                                    }}
                                    error={errors?.company?.message}
                                    data={dataCompany.data}
                                    disabled={(edit && !!lead?.value?.company) || visorSD}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <PhoneFieldEdit
                                    value={"+" + getValues('phone')}
                                    label={t(langKeys.phone)}
                                    name="phone"
                                    fullWidth
                                    defaultCountry={user!.countrycode.toLowerCase()}
                                    className={classes.field}
                                    onChange={(v: any) => { setValue('phone', v); setExtraTriggers({ ...extraTriggers, phone: v || '' }) }}
                                    error={errors?.phone?.message}
                                    disabled={visorSD}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {(!voxiConnection.error && userConnected) &&
                                                    <IconButton size="small" onClick={() => {
                                                        if (voxiConnection.error) {
                                                            dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.nochannelvoiceassociated) }))
                                                        } else {
                                                            dispatch(setModalCall(true))
                                                            dispatch(setPhoneNumber(getValues("phone")))
                                                        }
                                                    }}>
                                                        <PhoneIcon />
                                                    </IconButton>
                                                }
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <FieldSelect
                                    label={t(langKeys.impact)}
                                    className={classes.field}
                                    valueDefault={getValues('impact')}
                                    onChange={(value) => {
                                        setcriticallity(value?.domainvalue || '', getValues('urgency'), getValues('company'))
                                        setValue('impact', value?.domainvalue || '')
                                    }}
                                    disabled={visorSD}
                                    error={errors?.impact?.message}
                                    data={dataImpact.data}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <FieldEdit
                                    label={t(langKeys.firstContactDate)}
                                    className={classes.field}
                                    onChange={(value) => {
                                        // datetime formaT: yyyy-MM-ddTHH:mm
                                        setValue('first_contact_date', value);
                                    }}
                                    valueDefault={(convertLocalDate(lead.value?.first_contact_date || "").toLocaleString())}
                                    disabled={true}
                                />
                                <FieldEdit
                                    label={t(langKeys.dateofresolution)}
                                    className={classes.field}
                                    onChange={(value) => {
                                        // datetime formaT: yyyy-MM-ddTHH:mm
                                        setValue('resolution_date', value);
                                    }}
                                    valueDefault={(convertLocalDate(lead.value?.resolution_date || "").toLocaleString())}
                                    disabled={true}
                                />
                                <FieldSelect
                                    label={t(langKeys.group)}
                                    className={classes.field}
                                    valueDefault={getValues('leadgroups')}
                                    onChange={(value) => setValue('leadgroups', value?.domainvalue || '')}
                                    error={errors?.leadgroups?.message}
                                    data={dataGroups.data}
                                    disabled={visorSD}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <FieldSelect
                                    label={t(langKeys.assigneduser)}
                                    className={classes.field}
                                    valueDefault={getValues('userid')}
                                    loading={advisers.loading}
                                    data={advisers.data}
                                    optionDesc="fullname"
                                    optionValue="userid"
                                    disabled={visorSD}
                                    onChange={(value) => setValue('userid', value?.userid || '')}
                                    error={errors?.userid?.message}
                                    readOnly={isStatusClosed() || iSProcessLoading()}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <Grid container direction="column">
                                <FieldEdit
                                    label={t(langKeys.description)}
                                    className={classes.field}
                                    onChange={(value) => setValue('description', value)}
                                    valueDefault={getValues('description')}
                                    error={errors?.description?.message}
                                    disabled={visorSD}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <FieldSelect
                                    label={t(langKeys.type)}
                                    className={classes.field}
                                    valueDefault={getValues('type')}
                                    data={
                                        [{ domainvalue: "SS" }, { domainvalue: "INC" }]
                                    }
                                    disabled={visorSD}
                                    error={errors?.type?.message}
                                    optionDesc="domainvalue"
                                    optionValue="domainvalue"
                                    onChange={(value) => setValue('type', value?.domainvalue || '')}
                                />
                                <FieldEdit
                                    label={t(langKeys.reportdate)}
                                    className={classes.field}
                                    onChange={(value) => {
                                        setValue('createdate', value);
                                    }}
                                    valueDefault={(convertLocalDate(lead.value?.createdate || "").toLocaleString())}
                                    disabled={true}
                                />
                                <FieldEdit
                                    label={t(langKeys.email)}
                                    className={classes.field}
                                    onChange={(value) => { setValue('email', value); setExtraTriggers({ ...extraTriggers, email: value || '' }) }}
                                    valueDefault={getValues('email')}
                                    error={errors?.email?.message}
                                    disabled
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <FieldSelect
                                    label={t(langKeys.urgency)}
                                    className={classes.field}
                                    valueDefault={getValues('urgency')}
                                    onChange={(value) => {
                                        setcriticallity(getValues('impact'), value?.domainvalue || '', getValues('company'))
                                        setValue('urgency', value?.domainvalue || '')
                                    }}
                                    disabled={visorSD}
                                    error={errors?.urgency?.message}
                                    data={dataUrgency.data}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <FieldSelect
                                    label={t(langKeys.priority)}
                                    className={classes.field}
                                    valueDefault={getValues('priority')}
                                    onChange={(value) => setValue('priority', value?.domainvalue || '')}
                                    data={dataPriority.data}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <FieldEdit
                                    label={t(langKeys.firstContactDatedeadline)}
                                    className={classes.field}
                                    onChange={(value) => {
                                        setValue('first_contact_deadline', value);
                                    }}
                                    valueDefault={(convertLocalDate(getValues("first_contact_deadline") || "").toLocaleString())}
                                    disabled={true}
                                />
                                <FieldEdit
                                    label={t(langKeys.dateofresolutiondeadline)}
                                    className={classes.field}
                                    onChange={(value) => {
                                        setValue('resolution_deadline', value);
                                    }}
                                    valueDefault={(convertLocalDate(getValues("resolution_deadline") || "").toLocaleString())}
                                    disabled={true}
                                />
                                <FieldMultiSelectFreeSolo
                                    label={t(langKeys.tags)}
                                    className={classes.field}
                                    valueDefault={getValues('tags')}
                                    onChange={(value: ({ domaindesc: string } | string)[], value2: { action: "create-option" | "remove-option" | "select-option", option: { option: string } }) => {
                                        const tags = value.map((o: any) => o.domaindesc || o).join();
                                        setValue('tags', tags);

                                        handleUpdateLeadTags(
                                            value2.option.option,
                                            value2.action === "remove-option" ? "REMOVETAG" : "NEWTAG",
                                        );
                                    }}
                                    disabled={visorSD}
                                    error={errors?.tags?.message}
                                    loading={false}
                                    data={leadTagsDomain.data.concat(getValues('tags').split(',').filter((i: any) => i !== '' && (leadTagsDomain.data.findIndex(x => x.domaindesc === i)) < 0).map((domaindesc: any) => ({ domaindesc })))}
                                    optionDesc="domaindesc"
                                    optionValue="domaindesc"
                                    readOnly={isStatusClosed() || iSProcessLoading()}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
                <div style={{ height: '1em' }} />
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
                                <NoteIcon style={{ width: 22, height: 22 }} />
                                <Trans i18nKey={langKeys.logNote} count={2} />
                            </div>
                        )}
                    />
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <AccessTimeIcon style={{ width: 22, height: 22 }} />
                                <Trans i18nKey={langKeys.scheduleActivity} count={2} />
                            </div>
                        )}
                    />
                    {edit && (
                        <AntTab
                            label={(
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <AccessTimeIcon style={{ width: 22, height: 22 }} />
                                    <Trans i18nKey={langKeys.history} />
                                </div>
                            )}
                        />
                    )}
                </Tabs>
                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <TabPanelLogNote
                        readOnly={isStatusClosed() || visorSD}
                        loading={saveNote.loading || leadNotes.loading}
                        notes={edit ? leadNotes.data : getValues('notes')}
                        leadId={edit ? Number(match.params.id) : 0}
                        onSubmit={(newNote) => {
                            if (edit) {
                                const body = leadLogNotesIns(newNote);
                                dispatch(saveLeadLogNote(body));
                            } else {
                                newNote.createby = user?.firstname;
                                newNote.createdate = Date.now();
                                setValue('notes', [newNote, ...getValues('notes')]);
                                setValues(prev => ({ ...prev })); // refresh
                            }
                        }}
                    />
                </AntTabPanel>
                <AntTabPanel index={1} currentIndex={tabIndex}>
                    <TabPanelScheduleActivity
                        readOnly={isStatusClosed() || visorSD}
                        leadId={edit ? Number(match.params.id) : 0}
                        loading={saveActivity.loading || leadActivities.loading}
                        activities={edit ? leadActivities.data : getValues('activities')}
                        onSubmit={(newActivity) => {
                            if (edit) {
                                const body = leadActivityIns(newActivity);
                                dispatch(saveLeadActivity(body));
                            } else {
                                setValue('activities', [...getValues('activities'), newActivity]);
                                setValues(prev => ({ ...prev })); // refresh
                            }
                        }}
                        userid={getValues('userid')}
                    />
                </AntTabPanel>
                <AntTabPanel index={2} currentIndex={tabIndex}>
                    <TabPanelLeadHistory
                        history={leadHistory.data}
                        loading={leadHistory.loading}
                    />
                </AntTabPanel>
                {edit === false && (
                    <SelectPersonModal
                        open={openPersonModal}
                        onClose={onCloseSelectPersonModal}
                        onClick={onClickSelectPersonModal}
                    />
                )}
                <DialogSendTemplate
                    openModal={openDialogTemplate}
                    setOpenModal={setOpenDialogTemplate}
                    persons={[{ ...lead?.value, ...extraTriggers }]}
                    type={typeTemplate}
                />
                <DialogInteractions
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    ticket={rowSelected}
                />
                <DialogChangePhase
                    openModal={openModalChangePhase}
                    data={phasemenu}
                    columnid={Number(getValues('columnid'))}
                    column_uuid={getValues('column_uuid')}
                    setOpenModal={setOpenModalChangePhase}
                    leadId={edit ? Number(match.params.id) : 0}
                    loading={saveNote.loading || leadNotes.loading}
                    onSubmit={(columndata) => {
                        setValue('column_uuid', columndata?.column_uuid || "");
                        setValue('columnid', Number(columndata?.columnid || "0"));
                        setValues(prev => ({ ...prev })); // refrescar
                        setOpenModalChangePhase(false);
                        onSubmit()
                    }}
                />
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default ServiceDeskLeadForm;

interface SelectPersonModalProps {
    open: boolean;
    onClose: () => void;
    onClick: (person: IPerson) => void;
}

const useSelectPersonModalStyles = makeStyles(theme => ({
    root: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: "80%",
        maxHeight: "80%",
        width: '80%',
        backgroundColor: 'white',
        padding: "16px",
        overflowY: 'auto',
    },
}));

const SelectPersonModal: FC<SelectPersonModalProps> = ({ open, onClose, onClick }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useSelectPersonModalStyles();
    const [pageIndex] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [pageSize] = useState(10);
    const personList = useSelector(state => state.person.personList);

    const columns = useMemo(
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
                        <Checkbox
                            color="primary"
                            onClick={() => {
                                onClick(row);
                                onClose();
                            }}
                        />
                    );
                }
            },
            {
                Header: t(langKeys.name),
                accessor: 'name' as keyof IPerson,
            },
            {
                Header: t(langKeys.email),
                accessor: 'email' as keyof IPerson,
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone' as keyof IPerson,
            },
        ],
        [onClick, onClose, t],
    );

    const fetchData = useCallback(({ pageSize, pageIndex, filters, sorts }: IFetchData) => {
        dispatch(getPersonListPaginated(getPersonListPaginated1({
            skip: pageSize * pageIndex,
            startdate: '2021-01-01',
            enddate: '2025-01-01',
            take: pageSize,
            sorts: sorts,
            filters: filters,
        })));
    }, [dispatch]);

    useEffect(() => {
        fetchData({ pageSize, pageIndex, filters: {}, sorts: {}, daterange: null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData, dispatch]);

    useEffect(() => {
        if (personList.loading) return;
        if (personList.error) {
            const errormessage = t(personList.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        } else {
            setPageCount(Math.ceil(personList.count / pageSize));
            settotalrow(personList.count);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personList, t, dispatch]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.root}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.person, { count: 2 })}
                    data={personList.data}
                    loading={personList.loading}
                    fetchData={fetchData}
                    totalrow={totalrow}
                    pageCount={pageCount}
                    // pageSizeDefault={10}
                    hoverShadow
                    autotrigger
                />
            </Box>
        </Modal>
    );
}

const useTabPanelLogNoteStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(1)
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
    },
    paper: {
        backgroundColor: 'white',
        padding: theme.spacing(2),
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    logTextContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    logOwnerName: {
        fontWeight: 'bold',
    },
    avatar: {
        height: 28,
        width: 28,
    },
    centerRow: {
        alignItems: 'center',
    },
    logDate: {
        color: 'grey',
        fontSize: 12,
    },
}));

interface TabPanelLogNoteProps {
    readOnly: boolean;
    loading?: boolean;
    notes: ICrmLeadNote[];
    leadId: number;
    onSubmit?: (newNote: ICrmLeadNoteSave) => void;
    AdditionalButtons?: () => JSX.Element | null;
}

const DialogChangePhase: FC<{ openModal: any, setOpenModal: (a: any) => void, loading?: boolean, leadId: number, data: any, columnid: any, column_uuid: string, onSubmit?: (columndata: any) => void }> =
    ({ openModal, loading, leadId, onSubmit, setOpenModal, data, columnid, column_uuid }) => {
        const { t } = useTranslation();
        const classes = useTabPanelLogNoteStyles();
        const classes2 = useLeadFormStyles();
        const [noteDescription, setNoteDescription] = useState("");
        const [media, setMedia] = useState<File[] | null>(null);
        const saveNote = useSelector(state => state.servicedesk.saveLeadNote);
        const [datamanager, setDatamanager] = useState({
            columnid: 0,
            column_uuid: ''
        });

        useEffect(() => {
            setDatamanager({
                columnid: columnid,
                column_uuid: column_uuid
            })
        }, [columnid]);

        const dispatch = useDispatch();

        useEffect(() => {
            if (saveNote.loading) return;
            if (saveNote.error) {
                const errormessage = t(saveNote.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
                dispatch(showSnackbar({
                    message: errormessage,
                    severity: "error",
                    show: true,
                }));
            } else if (saveNote.success) {
                setOpenModal(false);
                dispatch(showSnackbar({
                    message: "Se registró la nota",
                    severity: "success",
                    show: true,
                }));
                onSubmit?.(datamanager);
            }
        }, [saveNote, dispatch]);

        const deleteMediaFile = useCallback((fileToRemove: File) => {
            setMedia(prev => prev?.filter(x => x !== fileToRemove) || null);
        }, []);

        const onChangeMediaInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files) return;

            const newFiles: File[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                newFiles.push(e.target.files[i]);
            }

            setMedia(prev => [...(prev || []), ...newFiles]);
        }, []);

        const handleInputMedia = useCallback(() => {
            const input = document.getElementById('noteMediaInput2') as HTMLInputElement;
            input.value = "";
            input!.click();
        }, []);

        const handleSubmit = useCallback(() => {
            if (!(datamanager.column_uuid !== "")) {
                dispatch(showSnackbar({
                    message: t(langKeys.mustselectphase),
                    severity: "warning",
                    show: true,
                }));
                return null;
            }
            if (!(datamanager.column_uuid !== column_uuid)) {
                dispatch(showSnackbar({
                    message: t(langKeys.haventchangedphase),
                    severity: "warning",
                    show: true,
                }));
                return null;
            }
            if (!noteDescription) {
                dispatch(showSnackbar({
                    message: t(langKeys.youmustfilldesc),
                    severity: "warning",
                    show: true,
                }));
                return null;
            }
            const newNote: ICrmLeadNoteSave = {
                leadid: leadId,
                leadnotesid: 0,
                description: noteDescription,
                type: "NINGUNO",
                status: "ACTIVO",
                media,
                username: null,
                operation: "INSERT",
            };
            const body = leadLogNotesIns(newNote);
            dispatch(saveLeadLogNote(body));

            handleCleanMediaInput();
            setNoteDescription("");
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [noteDescription, media, dispatch, datamanager]);

        const handleCleanMediaInput = () => {
            if (media === null) return;
            const input = document.getElementById('noteMediaInput2') as HTMLInputElement;
            input.value = "";
            setMedia(null);
        }

        return <DialogZyx
            open={openModal}
            title={t(langKeys.phasechange)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={handleSubmit}
            maxWidth="md"
        >
            <div className="row-zyx">
                <div className={classes.row} style={{ paddingBottom: 10 }}>
                    <FieldSelect
                        label={t(langKeys.phase)}
                        className={classes2.field}
                        valueDefault={datamanager.column_uuid}
                        onChange={(e) => {
                            setDatamanager({ columnid: Number(e?.columnid || "0"), column_uuid: e?.column_uuid || "" });
                        }}
                        data={data}
                        optionDesc="description"
                        optionValue="column_uuid"
                    />
                </div>
                <div className={classes.row}>
                    <Avatar className={classes.avatar} />
                    <div style={{ width: '1em' }} />
                    <div className={classes.column}>
                        <TextField
                            placeholder={t(langKeys.logAnInternalNote)}
                            minRows={4}
                            fullWidth
                            value={noteDescription}
                            onChange={e => setNoteDescription(e.target.value)}
                            disabled={loading}
                        />
                        <div style={{ height: 4 }} />
                        {media && <FileCollectionPreview files={media} onCloseFile={deleteMediaFile} />}
                        {media && <div style={{ height: 4 }} />}
                        <input
                            accept="file/*"
                            style={{ display: 'none' }}
                            id="noteMediaInput2"
                            type="file"
                            onChange={onChangeMediaInput}
                            multiple
                        />
                        <div className={classes.row}>
                            <EmojiPickerZyx
                                emojisIndexed={EMOJISINDEXED}
                                style={{ zIndex: 10 }}
                                onSelect={e => setNoteDescription(prev => prev.concat(e.native))}
                                icon={onClick => (
                                    <IconButton color="primary" onClick={onClick} disabled={loading}>
                                        <Mood />
                                    </IconButton>
                                )}
                            />
                            <div style={{ width: '0.5em' }} />
                            <IconButton onClick={handleInputMedia} color="primary" disabled={loading}>
                                <AttachFile />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </DialogZyx>
    }

export const TabPanelLogNote: FC<TabPanelLogNoteProps> = ({ notes, loading, readOnly, leadId, onSubmit, AdditionalButtons }) => {
    const classes = useTabPanelLogNoteStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [noteDescription, setNoteDescription] = useState("");
    const [media, setMedia] = useState<File[] | null>(null);

    const handleSubmit = useCallback(() => {
        const newNote: ICrmLeadNoteSave = {
            leadid: leadId,
            leadnotesid: 0,
            description: noteDescription,
            type: "NINGUNO",
            status: "ACTIVO",
            media,
            username: null,
            operation: "INSERT",
        };
        onSubmit?.(newNote);
        handleCleanMediaInput();
        setNoteDescription("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteDescription, media, dispatch]);

    const handleInputMedia = useCallback(() => {
        const input = document.getElementById('noteMediaInput') as HTMLInputElement;
        input.value = "";
        input!.click();
    }, []);

    const onChangeMediaInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles: File[] = [];
        for (let i = 0; i < e.target.files.length; i++) {
            newFiles.push(e.target.files[i]);
        }

        setMedia(prev => [...(prev || []), ...newFiles]);
    }, []);

    const handleCleanMediaInput = () => {
        if (media === null) return;
        const input = document.getElementById('noteMediaInput') as HTMLInputElement;
        input.value = "";
        setMedia(null);
    }

    const deleteMediaFile = useCallback((fileToRemove: File) => {
        setMedia(prev => prev?.filter(x => x !== fileToRemove) || null);
    }, []);

    return (
        <div className={clsx(classes.root, classes.column)}>
            {!readOnly && (
                <div className={clsx(classes.paper, classes.column)}>
                    <div className={classes.row}>
                        <Avatar className={classes.avatar} />
                        <div style={{ width: '1em' }} />
                        <div className={classes.column}>
                            <TextField
                                placeholder={t(langKeys.logAnInternalNote)}
                                minRows={4}
                                fullWidth
                                value={noteDescription}
                                onChange={e => setNoteDescription(e.target.value)}
                                disabled={loading}
                            />
                            <div style={{ height: 4 }} />
                            {media && <FileCollectionPreview files={media} onCloseFile={deleteMediaFile} />}
                            {media && <div style={{ height: 4 }} />}
                            <input
                                accept="file/*"
                                style={{ display: 'none' }}
                                id="noteMediaInput"
                                type="file"
                                onChange={onChangeMediaInput}
                                multiple
                            />
                            <div className={classes.row}>
                                <EmojiPickerZyx
                                    emojisIndexed={EMOJISINDEXED}
                                    style={{ zIndex: 10 }}
                                    onSelect={e => setNoteDescription(prev => prev.concat(e.native))}
                                    icon={onClick => (
                                        <IconButton color="primary" onClick={onClick} disabled={loading}>
                                            <Mood />
                                        </IconButton>
                                    )}
                                />
                                <div style={{ width: '0.5em' }} />
                                <IconButton onClick={handleInputMedia} color="primary" disabled={loading}>
                                    <AttachFile />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: 12 }} />
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading || (noteDescription.length === 0 && media === null)}
                        >
                            {loading && <CircularProgress style={{ height: 28, width: 28, marginRight: '0.75em' }} />}
                            Log
                        </Button>
                        {AdditionalButtons && <AdditionalButtons />}
                    </div>
                </div>
            )}
            {!readOnly && <div style={{ height: '1.3em' }} />}
            {loading ? <Loading /> :
                (notes.length === 0 && readOnly) ? <NoData /> :
                    notes.map((note, index) => (
                        <div key={`lead_note_${index}`}>
                            <div className={classes.paper}>
                                <div className={classes.row}>
                                    <Avatar className={classes.avatar} />
                                    <div style={{ width: '1em' }} />
                                    <div className={classes.logTextContainer}>
                                        <div className={clsx(classes.row, classes.centerRow)}>
                                            <span className={classes.logOwnerName}>{note.createby}</span>
                                            <div style={{ width: '1em' }} />
                                            <span className={classes.logDate}>{formatDate(note.createdate)}</span>
                                        </div>
                                        <div style={{ height: 4 }} />
                                        <span>{note.description}</span>
                                        {note.media && <div style={{ height: 4 }} />}
                                        {note.media && <FileCollectionPreview files={note.media} />}
                                    </div>
                                </div>
                            </div>
                            {index !== notes.length - 1 && <div style={{ backgroundColor: 'grey', height: 1 }} />}
                        </div>
                    ))}
        </div>
    );
}

const useTabPanelScheduleActivityStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    paper: {
        backgroundColor: 'white',
        padding: theme.spacing(2),
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    avatar: {
        height: 28,
        width: 28,
    },
    centerRow: {
        alignItems: 'center',
    },
    activityFor: {
        color: 'grey',
        fontSize: 12,
    },
    activityName: {
        fontWeight: 'bold',
    },
    activityDate: {
        fontWeight: 'bold',
        color: 'green',
    },
    unselect: {
        '-webkit-touch-callout': 'none', /* iOS Safari */
        '-webkit-user-select': 'none', /* Safari */
        '-khtml-user-select': 'none', /* Konqueror HTML */
        '-moz-user-select': 'none', /* Old versions of Firefox */
        '-ms-user-select': 'none', /* Internet Explorer/Edge */
        userSelect: 'none',
    },
    hoverCursor: {
        '&:hover': {
            cursor: 'pointer',
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

interface TabPanelScheduleActivityProps {
    readOnly: boolean;
    loading?: boolean;
    activities: IcrmLeadActivity[];
    leadId: number;
    userid: number;
    onSubmit?: (newActivity: ICrmLeadActivitySave) => void;
}

interface OpenModal {
    value: boolean;
    payload: IcrmLeadActivity | null;
}

export const TabPanelScheduleActivity: FC<TabPanelScheduleActivityProps> = ({
    readOnly,
    activities,
    loading,
    leadId,
    userid,
    onSubmit,
}) => {
    const classes = useTabPanelScheduleActivityStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState<OpenModal>({ value: false, payload: null });
    const [openDoneModal, setOpenDoneModal] = useState<OpenModal>({ value: false, payload: null });

    return (
        <div className={clsx(classes.root, classes.column)}>
            {!readOnly && (
                <div className={classes.header}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={() => setOpenModal({ value: true, payload: null })}
                    >
                        <Trans i18nKey={langKeys.newActivity} />
                    </Button>
                </div>
            )}
            {!readOnly && <div style={{ height: 12 }} />}
            {loading ? <Loading /> :
                activities.length === 0 ? <NoData /> :
                    activities.map((activity, index) => (
                        <div key={`lead_activity${index}`}>
                            <div className={classes.paper}>
                                <div className={classes.row}>
                                    <Avatar className={classes.avatar} />
                                    <div style={{ width: '1em' }} />
                                    <div className={classes.column}>
                                        <div className={clsx(classes.row, classes.centerRow)}>
                                            <span className={classes.activityDate}>
                                                {`${t(langKeys.duein)} ${formatDate(activity.duedate, { withTime: true })}`}
                                            </span>
                                            <div style={{ width: '1em' }} />
                                            <span className={classes.activityName}>
                                                {`"${activity.description}"`}
                                            </span>
                                            <div style={{ width: '1em' }} />
                                            <span className={classes.activityFor}>
                                                {`${t(langKeys.duein)} ${activity.assignto}`}
                                            </span>
                                            <div style={{ width: '0.5em' }} />
                                            <Info style={{ height: 18, width: 18, fill: 'grey' }} />
                                        </div>
                                        {!readOnly && <div style={{ height: 4 }} />}
                                        {(!readOnly && leadId !== 0) && (
                                            <div className={clsx(classes.row, classes.unselect)}>
                                                <div style={{ width: '1em' }} />
                                                {activity.status === "PROGRAMADO" && (
                                                    <div
                                                        className={clsx(classes.activityFor, classes.row, classes.centerRow, classes.hoverCursor)}
                                                        onClick={() => {
                                                            setOpenDoneModal({ value: true, payload: activity });
                                                        }}
                                                        style={{ marginRight: '1em' }}
                                                    >
                                                        <Done style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                                        <span><Trans i18nKey={langKeys.markDone} /></span>
                                                    </div>
                                                )}
                                                {activity.status === "PROGRAMADO" && (
                                                    <div
                                                        className={clsx(classes.activityFor, classes.row, classes.centerRow, classes.hoverCursor)}
                                                        onClick={() => setOpenModal({ value: true, payload: activity })}
                                                        style={{ marginRight: '1em' }}
                                                    >
                                                        <Create style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                                        <span><Trans i18nKey={langKeys.edit} /></span>
                                                    </div>
                                                )}
                                                {activity.status === "PROGRAMADO" && <div
                                                    className={clsx(classes.activityFor, classes.row, classes.centerRow, classes.hoverCursor)}
                                                    onClick={() => {
                                                        const body = leadActivityIns({
                                                            ...activity,
                                                            sendhsm: '{}',
                                                            username: null,
                                                            status: "ELIMINADO",
                                                            operation: "UPDATE",
                                                            feedback: '',
                                                        });
                                                        dispatch(saveLeadActivity(body));
                                                    }}
                                                >
                                                    <Clear style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                                    <span><Trans i18nKey={langKeys.cancel} /></span>
                                                </div>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {index !== activities.length - 1 && <div style={{ backgroundColor: 'grey', height: 1 }} />}
                        </div>
                    ))}
            <SaveActivityModal
                onClose={() => setOpenModal({ value: false, payload: null })}
                open={openModal.value}
                activity={openModal.payload}
                leadid={leadId}
                onSubmit={onSubmit}
                userid={userid}
            />
            <MarkDoneModal
                open={openDoneModal.value}
                onClose={() => setOpenDoneModal({ value: false, payload: null })}
                onNext={() => setOpenModal({ value: true, payload: null })}
                onSuccess={() => {
                    if (leadId !== 0) {
                        dispatch(getLeadActivities(leadActivitySel(leadId)));
                        dispatch(getLeadHistory(leadHistorySel(leadId)));
                    }
                }}
                onSubmit={(feedback, action) => {
                    if (action === "DISCARD" || !openDoneModal.payload) return;
                    const body = leadActivityIns({
                        ...openDoneModal.payload,
                        sendhsm: '{}',
                        username: null,
                        status: "REALIZADO",
                        operation: "UPDATE",
                        feedback,
                    });
                    dispatch(markDoneActivity(body));
                }}
            />
        </div>
    );
}

interface SaveActivityModalProps {
    open: boolean;
    activity: IcrmLeadActivity | null;
    leadid: number;
    userid?: number;
    onClose: () => void;
    onSubmit?: (newActivity: ICrmLeadActivitySave) => void;
}

const useSaveActivityModalStyles = makeStyles(theme => ({
    field: {
        margin: theme.spacing(1),
        minHeight: 58,
    },
    richTextfield: {
        margin: theme.spacing(1),
        minHeight: 150,
    },
    footer: {
        marginTop: '1em',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    footerBtn: {
        marginRight: '0.6em',
    },
}));

const initialValue: Descendant[] = [{ type: "paragraph", children: [{ text: "" }], align: "left" }];

export const SaveActivityModal: FC<SaveActivityModalProps> = ({ open, onClose, activity, leadid, userid, onSubmit }) => {
    const modalClasses = useSelectPersonModalStyles();
    const classes = useSaveActivityModalStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mustCloseOnSubmit = useRef<boolean>(true);
    const saveActivity = useSelector(state => state.lead.saveLeadActivity);
    const advisers = useSelector(state => state.lead.advisers);
    const lead = useSelector(state => state.lead.lead);

    const templates = useSelector(state => state.lead.leadTemplates);
    const channels = useSelector(state => state.lead.leadChannels);
    const domains = useSelector(state => state.main.mainData);
    const [detail, setDetail] = useState<Descendant[]>(initialValue);
    const [, refresh] = useState(false);
    const [domainsTotal, setDomainsTotal] = useState<Dictionary[]>([])
    const [bodyMessage, setBodyMessage] = useState('');
    // const [bodyCleaned, setBodyCleaned] = useState('');
    const [assigntoinitial, setassigntoinitial] = useState(0)

    useEffect(() => {
        if (!domains.loading && !domains.error) {
            setDomainsTotal([
                ...domains.data, {
                    domaindesc: 'automatedmail',
                    domainvalue: 'automatedmail'
                },
                {
                    domaindesc: 'automatedhsm',
                    domainvalue: 'automatedhsm'
                },
                {
                    domaindesc: 'automatedsms',
                    domainvalue: 'automatedsms'
                },
            ]
            )
        }
    }, [domains])


    useEffect(() => {
        dispatch(getCollection(getValuesFromDomain("TIPOACTIVIDADLEAD")));
        return () => {
            dispatch(resetMain());
        };
    }, [dispatch]);

    useEffect(() => {
        if (open !== true) return;

        if (saveActivity.loading || saveActivity.error) return;
        if (saveActivity.success) {
            dispatch(showSnackbar({
                message: "Se registró la actividad",
                severity: "success",
                show: true,
            }));
            dispatch(getLeadActivities(leadActivitySel(leadid)));
            if (mustCloseOnSubmit.current) {
                onClose();
            } else {
                resetValues();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveActivity, leadid, open, dispatch]);

    const { getValues, trigger, setValue, control, formState: { errors }, reset, handleSubmit, register } = useForm<ICrmLeadActivitySave>({
        defaultValues: {
            leadid: leadid,
            leadactivityid: activity?.leadactivityid || 0,
            description: activity?.description || "",
            duedate: activity?.duedate || "",
            assignto: activity?.assignto || "",
            assigneduser: activity?.assigneduser || 0,
            type: activity?.type || "",
            status: activity?.status || "PROGRAMADO",
            username: null,
            operation: activity ? "UPDATE" : "INSERT",
            feedback: '',
            detailjson: JSON.stringify(initialValue),

            hsmtemplatename: '',
            hsmtemplateid: activity?.hsmtemplateid || 0,
            communicationchannelid: activity?.communicationchannelid || 0,
            hsmtemplatetype: activity?.hsmtemplatetype || "",
            variables: []
        },
    });

    const { fields } = useFieldArray({
        control,
        name: 'variables',
    });

    const registerFormFieldOptions = useCallback(() => {
        const mandatoryStrField = (value: string) => {
            return value.length === 0 ? t(langKeys.field_required) : undefined;
        }

        const validateDateFormat = (value: string) => {
            if (value.length === 0) return t(langKeys.field_required);
            if (value.split('-')[0].length > 4) return t(langKeys.date_format_error);

            return undefined;
        }

        register('description', { validate: mandatoryStrField });
        register('duedate', { validate: validateDateFormat });
        register('assignto', { validate: mandatoryStrField });

        register('type', { validate: mandatoryStrField });
        register('communicationchanneltype');


    }, [register, t]);

    useEffect(() => {
        registerFormFieldOptions();
    }, [registerFormFieldOptions]);

    const resetValues = useCallback(() => {
        setDetail(initialValue);
        reset({
            leadid: leadid,
            leadactivityid: 0,
            description: "",
            duedate: "",
            assigneduser: 0,
            assignto: "",
            type: "NINGUNO",
            status: "PROGRAMADO",
            username: null,
            operation: "INSERT",
            feedback: '',
            detailjson: JSON.stringify(initialValue),

            hsmtemplateid: 0,
            hsmtemplatename: '',
            variables: []
        });
        registerFormFieldOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset]);

    useEffect(() => {
        setDetail(activity?.detailjson ? JSON.parse(activity?.detailjson) : initialValue);

        const template = templates.data.find(x => x.id === (activity?.hsmtemplateid || 0));

        reset({
            leadid: leadid,
            leadactivityid: activity?.leadactivityid || 0,
            description: activity?.description || "",
            duedate: activity?.duedate || "",
            assignto: activity?.assignto || "",
            assigneduser: activity?.assigneduser || 0,
            type: activity?.type || "",
            status: activity?.status || "PROGRAMADO",
            username: null,
            operation: activity ? "UPDATE" : "INSERT",
            feedback: '',
            detailjson: activity?.detailjson || JSON.stringify(initialValue),

            hsmtemplatename: template?.name || "",
            hsmtemplateid: activity?.hsmtemplateid || 0,
            communicationchannelid: activity?.communicationchannelid || 0,
            hsmtemplatetype: template?.type || "",
            variables: []
        });

        setBodyMessage(template?.body || "")

        registerFormFieldOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps

        if (activity?.assignto) {
            setassigntoinitial(activity?.assigneduser || 0)
        }

        if (activity?.type.includes("automated")) {
            register('hsmtemplateid', { validate: (value) => Boolean(value && value > 0) || String(t(langKeys.field_required)) });
            register('communicationchannelid', { validate: (value) => (template?.hsmtemplatetype !== "HSM") || (value && value > 0 ? undefined : t(langKeys.field_required) + "") })
        } else {
            register('communicationchannelid', { validate: (v) => true })
            register('hsmtemplateid', { validate: () => true })
            register('communicationchannelid', { validate: (value) => true })
            register('communicationchannelid', { validate: (value) => true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activity, reset, register]);

    useEffect(() => {
        if (open === true && userid !== undefined && leadid !== 0 && !activity?.assigneduser) {
            const posibleuser = advisers.data.find(e => e.userid === userid);
            setassigntoinitial(posibleuser?.userid || 0);
            setValue('assignto', posibleuser?.firstname || '');

            setValue('assigneduser', userid);
            refresh(prev => !prev);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, userid, leadid, advisers, setValue]);

    const handleSave = useCallback((status: "PROGRAMADO" | "REALIZADO" | "ELIMINADO") => {
        handleSubmit((values) => {
            // const dueate = new Date(values.duedate);
            // dueate.setHours(dueate.getHours() - 5);
            // const day = dueate.toLocaleDateString("en-US", { day: '2-digit' });
            // const month = dueate.toLocaleDateString("en-US", { month: '2-digit' });
            // const year = dueate.toLocaleDateString("en-US", { year: 'numeric' });
            // const time = dueate.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
            if (values.type.includes("automated")) {
                setBodyMessage(body => {
                    values?.variables?.forEach((x: Dictionary) => {
                        body = body.replace(`{{${x.name}}}`, x.variable !== 'custom' ? (lead.value as Dictionary)[x.variable] : x.text)
                    })
                    return body
                })
            }
            const bb = values.type.includes("automated") ? {
                hsmtemplatename: values.hsmtemplatename,
                hsmtemplateid: values.hsmtemplateid,
                communicationchannelid: values?.communicationchannelid || "",
                communicationchanneltype: values?.communicationchanneltype || "",
                platformtype: values?.communicationchanneltype || "",
                type: values?.hsmtemplatetype || "",
                shippingreason: "LEAD",
                listmembers: [{
                    personid: lead.value?.personid || 0,
                    phone: lead.value?.phone + "",
                    firstname: lead.value?.firstname + "",
                    lastname: lead.value?.lastname + "",
                    parameters: values.variables?.map((v: any) => ({
                        type: "text",
                        text: v.variable !== 'custom' ? (lead.value as Dictionary)[v.variable] : v.text,
                        name: v.name
                    })) || []
                }]
            } : "";



            if (values.leadactivityid === 0 || values.assigneduser !== assigntoinitial) {
                const supervisorid = advisers.data.find(x => x.userid === values.assigneduser)?.supervisorid || 0;
                const data = {
                    leadid: lead.value?.leadid || 0,
                    leadname: lead.value?.description,
                    description: values.description,
                    duedate: values.duedate,
                    assigneduser: values.assigneduser,
                    userid: values.assigneduser, //quien va a recibir la notificacion
                    supervisorid,
                    assignto: values.assignto,
                    status: "PROGRAMADO",
                    type: "automated",
                    feedback: "",
                    notificationtype: "LEADACTIVITY"
                }
                dispatch(emitEvent({
                    event: 'newNotification',
                    data
                }))
            }

            onSubmit?.({
                ...values,
                status,
                detailjson: JSON.stringify(detail),
                hsmtemplateid: values.hsmtemplateid,
                communicationchannelid: values?.communicationchannelid || 0,
                sendhsm: values.type.includes("automated") ? JSON.stringify(bb) : "",
                // duedate: dueate.toUTCString()
                // duedate: `${year}-${month}-${day}T${time.split(",")[1]}`,
            });
            if (leadid === 0 && mustCloseOnSubmit.current) {
                onClose();
            } else {
                resetValues();
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail, handleSubmit, dispatch]);

    const onSelectTemplate = (value: Dictionary) => {
        if (value) {
            register('communicationchannelid', { validate: (v) => (value?.type !== "HSM") || (v && v > 0 ? undefined : t(langKeys.field_required) + "") })

            setBodyMessage(value.body);
            setValue('hsmtemplateid', value?.id || 0);
            setValue('hsmtemplatename', value?.name || '');
            setValue('hsmtemplatetype', value?.type || '');
            // setBodyCleaned(value.body);
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

    return (
        <Modal
            open={open}
            onClose={saveActivity.loading ? undefined : onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={modalClasses.root}>
                <TitleDetail title={t(langKeys.scheduleActivity)} />
                <div style={{ height: '1em' }} />
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="column">
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <FieldSelect
                                            uset
                                            label={t(langKeys.activityType)}
                                            className={classes.field}
                                            data={domainsTotal}
                                            prefixTranslation="type_activitylead_"
                                            optionDesc="domainvalue"
                                            optionValue="domainvalue"
                                            loading={domains.loading}
                                            valueDefault={getValues('type')}
                                            onChange={(v: IDomain) => {
                                                setValue('type', v?.domainvalue || "");
                                                setValue('hsmtemplatename', '');
                                                setValue('variables', []);
                                                setBodyMessage('');
                                                setValue('hsmtemplateid', 0);
                                                trigger('type');
                                                if ((v?.domainvalue || "") === "automated") {
                                                    register('hsmtemplateid', { validate: (value) => Boolean(value && value > 0) || String(t(langKeys.field_required)) })
                                                } else {
                                                    register('hsmtemplateid', { validate: () => true })
                                                    register('communicationchannelid', { validate: (v) => true })
                                                }
                                            }}
                                            error={errors?.type?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <FieldEdit
                                            label={t(langKeys.summary)}
                                            className={classes.field}
                                            valueDefault={getValues('description')}
                                            onChange={v => setValue('description', v)}
                                            error={errors?.description?.message}
                                        />
                                    </Grid>
                                    {(getValues('type').includes("automated") && getValues("hsmtemplatetype") === "HSM") &&
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ paddingTop: 8, marginTop: 8 }}>
                                            <FieldSelect
                                                label={t(langKeys.channel)}
                                                className={classes.field}
                                                valueDefault={getValues('communicationchannelid')}
                                                onChange={value => {
                                                    setValue('communicationchannelid', value?.communicationchannelid || 0);
                                                    setValue('communicationchanneltype', value?.type || "");
                                                    // trigger("communicationchanneltype")
                                                }}
                                                error={errors?.communicationchannelid?.message}
                                                data={channels.data}
                                                optionDesc="communicationchanneldesc"
                                                optionValue="communicationchannelid"
                                            />
                                        </Grid>
                                    }
                                    {getValues('type').includes("automated") &&
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <FieldSelect
                                                label={t(langKeys.communicationtemplate)}
                                                className={classes.field}
                                                valueDefault={getValues('hsmtemplateid')}
                                                onChange={onSelectTemplate}
                                                error={errors?.hsmtemplateid?.message}
                                                data={templates.data.filter(x => x.type === getValues("type").replace("automated", "").toUpperCase())}
                                                optionDesc="name"
                                                optionValue="id"
                                            />
                                        </Grid>
                                    }
                                    {getValues('type').includes("automated") &&
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <FieldView
                                                className={classes.field}
                                                label={t(langKeys.message)}
                                                value={bodyMessage}
                                            />
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Grid container direction="column">
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <FieldEdit
                                            label={t(langKeys.dueDate)}
                                            className={classes.field}
                                            type="datetime-local"
                                            valueDefault={(getValues('duedate') as string)?.replace(' ', 'T')?.substring(0, 16)}
                                            onChange={(value) => setValue('duedate', value)}
                                            error={errors?.duedate?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <FieldSelect
                                            label={t(langKeys.assignedTo)}
                                            className={classes.field}
                                            data={advisers.data}
                                            optionDesc="fullname"
                                            optionValue="userid"
                                            loading={advisers.loading}
                                            valueDefault={getValues('assigneduser')}
                                            onChange={v => {
                                                setValue('assignto', v?.firstname || "");
                                                setValue('assigneduser', v?.userid || 0);
                                            }}
                                            error={errors?.assignto?.message}
                                        />
                                    </Grid>

                                    {getValues('type').includes("automated") &&
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ paddingTop: 8, marginTop: 8 }}>
                                            {fields.map((item: Dictionary, i) => (
                                                <div key={item.id}>
                                                    <FieldSelect
                                                        key={"var_" + item.id}
                                                        fregister={{
                                                            ...register(`variables.${i}.variable`, {
                                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        className={classes.field}
                                                        label={item.name}
                                                        valueDefault={getValues(`variables.${i}.variable`)}
                                                        onChange={(value) => {
                                                            setValue(`variables.${i}.variable`, value.key)
                                                            trigger(`variables.${i}.variable`)
                                                        }}
                                                        error={errors?.variables?.[i]?.text?.message}
                                                        data={variables}
                                                        uset={true}
                                                        prefixTranslation=""
                                                        optionDesc="key"
                                                        optionValue="key"
                                                    />
                                                    {getValues(`variables.${i}.variable`) === 'custom' &&
                                                        <FieldEditArray
                                                            key={"custom_" + item.id}
                                                            fregister={{
                                                                ...register(`variables.${i}.text`, {
                                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                                })
                                                            }}
                                                            className={classes.field}
                                                            valueDefault={item.value}
                                                            error={errors?.variables?.[i]?.text?.message}
                                                            onChange={(value) => setValue(`variables.${i}.text`, "" + value)}
                                                        />
                                                    }
                                                </div>
                                            ))}
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <RichText
                            value={detail}
                            onChange={setDetail}
                            placeholder="Escribe algo"
                            className={classes.richTextfield}
                            spellCheck
                        />
                    </Grid>
                </Grid>
                <div className={classes.footer}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.footerBtn}
                        disabled={saveActivity.loading}
                        onClick={() => {
                            mustCloseOnSubmit.current = true;
                            handleSave("PROGRAMADO");
                        }}
                    >
                        <Trans i18nKey={!activity ? langKeys.schedule2 : langKeys.save} />
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        disabled={saveActivity.loading}
                        onClick={() => {
                            mustCloseOnSubmit.current = true;
                            handleSave("REALIZADO");
                        }}
                    >
                        <Trans i18nKey={langKeys.markAsDone} />
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        disabled={saveActivity.loading}
                        onClick={() => {
                            mustCloseOnSubmit.current = false;
                            handleSave("REALIZADO");
                        }}
                    >
                        <Trans i18nKey={langKeys.doneAndScheduleNext} />
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        disabled={saveActivity.loading}
                        onClick={() => {
                            onClose();
                            resetValues();
                        }}
                    >
                        <Trans i18nKey={langKeys.discard} />
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

const Loading: FC = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <CircularProgress />
        </div>
    );
}

const NoData: FC = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 100 }}>
            <span style={{ color: 'grey' }}><Trans i18nKey={langKeys.noData} /></span>
        </div>
    );
}

interface FilePreviewProps {
    src: File | string;
    onClose?: () => void;
}

const useFilePreviewStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'white',
        padding: theme.spacing(1),
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        maxWidth: 300,
        maxHeight: 80,
        alignItems: 'center',
        width: 'fit-content',
        overflow: 'hidden'
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'lightgrey',
    },
    filename: {
        fontWeight: 'bold',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: 190,
        whiteSpace: 'nowrap',
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes('http'), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = (src as string).match(/.*\/(.+?)\./);
            return m && m.length > 1 ? m[1].substring(18) : ""; // antes era de 13
        };
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split('.').pop() || "-";
        }
        return (src as File).name.split('.').pop() || "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: '0.5em' }} />
            <div className={classes.infoContainer}>
                <div>
                    <div className={classes.filename}>
                        {getFileName()}
                    </div>
                    {getFileExt().toUpperCase()}
                </div>
            </div>
            <div style={{ width: '0.5em' }} />
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={onClose}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: '10%' }} />}
                {isUrl() && (
                    <a
                        href={src as string}
                        target="_blank"
                        rel="noreferrer"
                        download={`${getFileName()}.${getFileExt()}`}
                    >
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
}

interface FileCollectionPreviewProps {
    files: File[] | string;
    onCloseFile?: (file: File) => void;
}

const FileCollectionPreview: FC<FileCollectionPreviewProps> = ({ files, onCloseFile }) => {
    const buildFileChildren = useCallback((files: File[]) => {
        const children: React.ReactElement[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            children.push(<FilePreview key={i} src={file} onClose={() => onCloseFile?.(file)} />);
        }

        return children;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const buildStringChildren = useCallback((files: string) => {
        return files.split(',').map((file, i) => {
            return <FilePreview key={i} src={file} />;
        });
    }, []);

    const children = useMemo(() => {
        return typeof files === "string" ? buildStringChildren(files) : buildFileChildren(files);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
            {children}
        </div>
    )
}

interface MarkDoneModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (feedback: string, action: "DONE & NEXT" | "DONE" | "DISCARD") => void;
    onSuccess?: () => void;
    onNext: () => void;
}

const useMarkDoneModalStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        flexDirection: 'row',
    },
    footerBtn: {
        marginRight: '0.6em',
    },
}));

const MarkDoneModal: FC<MarkDoneModalProps> = ({ open, onClose, onSubmit, onNext, onSuccess }) => {
    const classes = useMarkDoneModalStyles();
    const modalClasses = useSelectPersonModalStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mustNext = useRef(false);
    const [feedback, setFeedBack] = useState("");
    const markDoneProcess = useSelector(state => state.lead.markDoneActivity);

    useEffect(() => {
        return () => {
            dispatch(resetMarkDoneActivity());
        };
    }, [dispatch]);

    useEffect(() => {
        if (open !== true) return;

        if (markDoneProcess.loading) return;
        if (markDoneProcess.error) {
            const errormessage = t(markDoneProcess.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        } else if (markDoneProcess.success) {
            dispatch(showSnackbar({
                message: "Se marcó como hecho la actividad",
                severity: "success",
                show: true,
            }));
            onClose();
            if (mustNext.current) onNext();
            onSuccess?.();
            setFeedBack("");
            mustNext.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markDoneProcess, t, dispatch]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={modalClasses.root}>
                <TitleDetail title={<Trans i18nKey={langKeys.markDone} />} />
                <div style={{ height: '1.34em' }} />
                <FieldEdit
                    label={t(langKeys.writeFeedback)}
                    valueDefault={feedback}
                    onChange={setFeedBack}
                    InputProps={{
                        readOnly: markDoneProcess.loading,
                    }}
                />
                <div style={{ height: '2em' }} />
                <div className={classes.footer}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.footerBtn}
                        disabled={markDoneProcess.loading}
                        onClick={() => {
                            mustNext.current = true;
                            onSubmit(feedback, "DONE & NEXT");
                        }}
                    >
                        <Trans i18nKey={langKeys.doneAndScheduleNext} />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.footerBtn}
                        disabled={markDoneProcess.loading}
                        onClick={() => {
                            mustNext.current = false;
                            onSubmit(feedback, "DONE");
                        }}
                    >
                        <Trans i18nKey={langKeys.done} />
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        disabled={markDoneProcess.loading}
                        onClick={() => {
                            mustNext.current = false;
                            setFeedBack("");
                            onClose();
                        }}
                    >
                        <Trans i18nKey={langKeys.discard} />
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

interface TabPanelLeadHistoryProps {
    history: ICrmLeadHistory[];
    loading: boolean;
}

const useTabPanelLeadHistoryStyles = makeStyles(theme => ({
    itemRoot: {
        borderRadius: 12,
        backgroundColor: '#e9e8e8',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',

        fontSize: 14,
        fontWeight: 400,
    },
    timelineItemBefore: {
        '&::before': {
            content: '""',
            flex: 0,
            display: 'none',
        }
    },
    timelineDot: {
        backgroundColor: 'blue',
    },
    itemHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    name: {
        color: 'blue',
        fontWeight: 'bold',
    },
    dateTime: {
        fontSize: 11,
        color: 'darkslategrey',
    },
}));

const TabPanelLeadHistory: FC<TabPanelLeadHistoryProps> = ({ history, loading }) => {
    const classes = useTabPanelLeadHistoryStyles();

    const Icon = useCallback(({ type }: { type: string }) => {
        switch (type) {
            case "NEWLEAD": return <StarIcon width={24} style={{ fill: 'white' }} />;
            case "NEWNOTE": return <NoteIcon width={24} style={{ fill: 'white' }} />;
            case "NEWACTIVITY": return <HistoryIcon width={24} style={{ fill: 'white' }} />;
            case "CHANGESTATUS": return <LowPriorityIcon width={24} style={{ fill: 'white' }} />;
            case "SENDHSM": return <WhatsappIcon width={24} style={{ fill: 'white' }} />;
            case "SENDMAIL": return <EmailIcon width={24} style={{ fill: 'white' }} />;
            case "SENDSMS": return <SmsIcon width={24} style={{ fill: 'white' }} />;
            case "NEWTAG": return <LocalOfferIcon width={24} style={{ fill: 'white' }} />;
            case "REMOVETAG": return <LocalOfferIcon width={24} style={{ fill: 'white' }} />;
            case "CLOSEDLEAD": return <CancelIcon width={24} style={{ fill: 'white' }} />;
            case "CHANGEAGENT": return <TrackChangesIcon width={24} style={{ fill: 'white' }} />;
            case "NEWPRODUCT":
            case "REMOVEPRODUCT":
            case "ACTIVITYDONE":
            case "ACTIVITYDISCARD":
            case "ACTIVITYCHANGESTATUS":
            case "ACTIVITYUPDATE":
            default: return <FlagIcon width={24} style={{ fill: 'white' }} />;
        }
    }, []);

    const ItemDescription = useCallback(({ item }: { item: ICrmLeadHistory }): JSX.Element => {
        switch (item.type) {
            case "CHANGESTATUS": // cambio de fase/columna
                const lastIndex = item.description.lastIndexOf('(');
                const desc = item.description.slice(0, lastIndex);
                const owner = item.description.slice(lastIndex);
                return (
                    <span>
                        <Trans i18nKey={desc.trim().toLowerCase()} />
                        {` ${owner}`}
                    </span>
                );
            default: return <span>{item.description}</span>;
        }
    }, []);

    if (loading) {
        return <Loading />;
    }
    return (
        <Box>
            <Timeline align="left">
                {history.map((item, i) => (
                    <TimelineItem key={i} className={classes.timelineItemBefore}>
                        <TimelineSeparator>
                            <TimelineDot className={classes.timelineDot}>
                                <Icon type={item.type} />
                            </TimelineDot>
                            <TimelineConnector className={classes.timelineDot} />
                        </TimelineSeparator>
                        <TimelineContent>
                            <div className={classes.itemRoot}>
                                <div className={classes.itemHeader}>
                                    <span className={classes.name}>
                                        <Trans i18nKey={item.type} />
                                    </span>
                                    <div style={{ width: '1em' }} />
                                    <span className={classes.dateTime}>
                                        {formatDate(item.createdate)}
                                    </span>
                                </div>
                                {item.description && <ItemDescription item={item} />}
                            </div>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    );
}

interface Options {
    withTime?: boolean;
}

const formatDate = (strDate: string = "", options: Options = { withTime: true }) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(typeof strDate === "number" ? strDate : strDate.replace("Z", ""));
    // date.setHours(date.getHours() + 5);
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });
    const time = date.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
    return `${day}/${month}/${year}${options.withTime! ? time.split(',')[1] : ''}`;
}
