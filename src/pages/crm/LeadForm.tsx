/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, makeStyles, Breadcrumbs, Grid, Button, CircularProgress, Box, TextField, Modal, IconButton, Checkbox, Tabs, Avatar, Paper, InputAdornment, Tooltip } from '@material-ui/core';
import { EmojiPickerZyx, FieldEdit, FieldMultiSelectFreeSolo, FieldSelect, FieldView, PhoneFieldEdit, RadioGroudFieldEdit, TitleDetail, AntTabPanel, FieldEditArray, FieldMultiSelectVirtualized, DialogZyx, FieldEditMulti } from 'components';
import { RichText } from 'components/fields/RichText';
import { langKeys } from 'lang/keys';
import paths from 'common/constants/paths';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonIcon from '@material-ui/icons/Person';
import { getDomainsByTypename } from 'store/person/actions';
import {
    insLead2, adviserSel, getPaginatedPersonLead as getPersonListPaginated1, leadLogNotesSel, leadActivitySel, leadLogNotesIns, leadActivityIns, getValuesFromDomain, getColumnsSel, insArchiveLead, leadHistorySel,
    getLeadsSel, leadHistoryIns, selCalendar,
    getDomainByDomainNameList
} from 'common/helpers';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import {
    archiveLead, getAdvisers, getLead, getLeadActivities, getLeadHistory, getLeadLogNotes, getLeadPhases, markDoneActivity, resetArchiveLead, resetGetLead, resetGetLeadActivities, resetGetLeadHistory,
    resetGetLeadLogNotes, resetGetLeadPhases, resetMarkDoneActivity, resetSaveLead, resetSaveLeadActivity, resetSaveLeadLogNote, saveLeadActivity, saveLeadLogNote, saveLeadWithFiles, saveLead as saveLeadAction,
    resetGetLeadProductsDomain, getLeadProductsDomain, getLeadTagsDomain, getPersonType, resetGetLeadTagsDomain, getLeadTemplates, getLeadChannels, resetGetLeadChannels, resetGetPersonType, getCalendar, resetGetCalendar
} from 'store/lead/actions';
import { Dictionary, ICrmLead, IcrmLeadActivity, ICrmLeadActivitySave, ICrmLeadHistory, ICrmLeadHistoryIns, ICrmLeadNote, ICrmLeadNoteSave, IDomain, IFetchData, IPerson } from '@types';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { Rating, Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@material-ui/lab';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TableZyx from 'components/fields/table-paginated';
import { Add, AttachFile, Clear, Close, GetApp, Create, Done, FileCopy, Info, Mood } from '@material-ui/icons';
import { getPersonListPaginated, resetGetPersonListPaginated } from 'store/person/actions';
import clsx from 'clsx';
import { AccessTime as AccessTimeIcon, Archive as ArchiveIcon, Flag as FlagIcon, Cancel as CancelIcon, Note as NoteIcon, LocalOffer as LocalOfferIcon, LowPriority as LowPriorityIcon, Star as StarIcon, History as HistoryIcon, TrackChanges as TrackChangesIcon } from '@material-ui/icons';
import { useFieldArray, useForm } from 'react-hook-form';
import { getCollection, getCollectionAux2, resetMain } from 'store/main/actions';
import { AntTab } from 'components';
import { EmailIcon, WhatsappIcon, SmsIcon, CustomVariablesIcon } from 'icons';
import { Descendant } from 'slate';
import { emitEvent } from 'store/inbox/actions';
import { emojis } from "common/constants/emojis";
import { sendHSM } from 'store/inbox/actions';
import { setModalCall, setPhoneNumber } from 'store/voximplant/actions';
import MailIcon from '@material-ui/icons/Mail';
import DialogInteractions from 'components/inbox/DialogInteractions';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import CustomTableZyxEditable from 'components/fields/customtable-editable';

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
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    }
}));

function returnpriority(prio: number) {
    switch (prio) {
        case 3:
            return 'HIGH'
        case 2:
            return 'MEDIUM'
        default:
            return "LOW"
    }
}
function returnNumberprio(prio: string) {
    switch (prio) {
        case 'HIGH':
            return 3
        case 'MEDIUM':
            return 2
        default:
            return 1
    }
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
            variables: [],
            buttons: [],
            headervariables: []
        }
    });

    const { fields } = useFieldArray({
        control,
        name: 'variables',
    });
    const { fields: buttons } = useFieldArray({
        control,
        name: 'buttons',
    });
    const { fields: fieldsheader } = useFieldArray({
        control,
        name: 'headervariables',
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
            setTemplatesList(domains?.value?.templates?.filter(x => (x.templatetype !== "CAROUSEL" && (type !== "MAIL" ? x.type === type : (x.type === type || x.type === "HTML")))) || []);
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
                buttons: [],
                headervariables: [],
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
            setValue('hsmtemplateid', value ? value.id : 0);
            setValue('hsmtemplatename', value ? value.name : '');
            const variablesList = value.body.match(/({{)(.*?)(}})/g) || [];
            const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
            setValue('variables', varaiblesCleaned.map((x: string) => ({ name: x, text: '', type: 'text' })));
            if (value?.header) {
                const variablesListHeader = value?.header?.match(/({{)(.*?)(}})/g) || [];
                const varaiblesCleanedHeader = variablesListHeader.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
                setValue('headervariables', varaiblesCleanedHeader.map((x: string) => ({ name: x, text: '', type: 'header', header: value?.header || "" })));
            } else {
                setValue('headervariables', [])
            }
            if (value?.buttonsgeneric?.length && value?.buttonsgeneric.some(element => element.btn.type === "dynamic")) {
                const buttonsaux = value?.buttonsgeneric
                let buttonsFiltered = []
                buttonsaux.forEach((x, i) => {
                    const variablesListbtn = x?.btn?.url?.match(/({{)(.*?)(}})/g) || [];
                    const varaiblesCleanedbtn = variablesListbtn.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
                    if (varaiblesCleanedbtn.length) {
                        const btns = varaiblesCleanedbtn?.map((y: string) => ({ name: y, text: '', type: 'url', url: x?.btn?.url || "" })) || []
                        buttonsFiltered = [...buttonsFiltered, ...btns]
                    }
                })
                setValue('buttons', buttonsFiltered);
            } else {
                setValue('buttons', []);
            }
        } else {
            setValue('hsmtemplatename', '');
            setValue('variables', []);
            setValue('headervariables', []);
            setValue('buttons', []);
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
                parameters: [...data.variables, ...data.buttons, ...data.headervariables].map((v: any) => ({
                    type: v?.type || "text",
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
            {Boolean(fieldsheader.length) &&
                <FieldView
                    label={t(langKeys.header)}
                    value={fieldsheader?.[0]?.header || ""}
                />
            }
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, marginBottom: 16 }}>
                {fieldsheader.map((item: Dictionary, i) => (
                    <div key={item.id}>
                        <FieldSelect
                            key={"var_" + item.id}
                            fregister={{
                                ...register(`headervariables.${i}.variable`, {
                                    validate: (value: any) => (value?.length) || t(langKeys.field_required)
                                })
                            }}
                            label={item.name}
                            valueDefault={getValues(`headervariables.${i}.variable`)}
                            onChange={(value) => {
                                setValue(`headervariables.${i}.variable`, value?.key)
                                trigger(`headervariables.${i}.variable`)
                            }}
                            error={errors?.headervariables?.[i]?.text?.message}
                            data={variables}
                            uset={true}
                            prefixTranslation=""
                            optionDesc="key"
                            optionValue="key"
                        />
                        {getValues(`headervariables.${i}.variable`) === 'custom' &&
                            <FieldEditArray
                                key={"custom_" + item.id}
                                fregister={{
                                    ...register(`headervariables.${i}.text`, {
                                        validate: (value: any) => (value?.length) || t(langKeys.field_required)
                                    })
                                }}
                                valueDefault={item.value}
                                error={errors?.headervariables?.[i]?.text?.message}
                                onChange={(value) => setValue(`headervariables.${i}.text`, "" + value)}
                            />
                        }
                    </div>
                ))}
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
                                    validate: (value: any) => (value?.length) || t(langKeys.field_required)
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
                                        validate: (value: any) => (value?.length) || t(langKeys.field_required)
                                    })
                                }}
                                valueDefault={item.value}
                                error={errors?.variables?.[i]?.text?.message}
                                onChange={(value) => setValue(`variables.${i}.text`, "" + value)}
                            />
                        }
                    </div>
                ))}

                {Boolean(buttons.length) && <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                    {t(langKeys.buttons)}
                </Box>}
                {buttons.map((item: Dictionary, i) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                        <div key={item.id}>
                            <FieldView
                                label={t(langKeys.button) + ` ${i + 1}`}
                                value={item?.url || ""}
                            />
                            <FieldSelect
                                key={"var_" + item.id}
                                fregister={{
                                    ...register(`buttons.${i}.variable`, {
                                        validate: (value: any) => (value?.length) || t(langKeys.field_required)
                                    })
                                }}
                                label={item.name}
                                valueDefault={getValues(`buttons.${i}.variable`)}
                                onChange={(value) => {
                                    setValue(`buttons.${i}.variable`, value?.key)
                                    trigger(`buttons.${i}.variable`)
                                }}
                                error={errors?.buttons?.[i]?.text?.message}
                                data={variables}
                                uset={true}
                                prefixTranslation=""
                                optionDesc="key"
                                optionValue="key"
                            />
                            {getValues(`buttons.${i}.variable`) === 'custom' &&
                                <FieldEditArray
                                    key={"custom_" + item.id}
                                    fregister={{
                                        ...register(`buttons.${i}.text`, {
                                            validate: (value: any) => (value?.length) || t(langKeys.field_required)
                                        })
                                    }}
                                    valueDefault={item.value}
                                    error={errors?.buttons?.[i]?.text?.message}
                                    onChange={(value) => setValue(`buttons.${i}.text`, "" + value)}
                                />
                            }
                        </div>
                    </div>
                ))}
            </div>
        </DialogZyx>)
}

export const LeadForm: FC<{ edit?: boolean }> = ({ edit = false }) => {
    const classes = useLeadFormStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch<{ id: string, columnid?: string, columnuuid?: string }>();
    const [phasemenu, setphasemenu] = useState<any[]>([])
    const [prioritycontrol, setprioritycontrol] = useState(1)
    const [values, setValues] = useState<ICrmLead>({
        column_uuid: match.params.columnuuid || '',
        columnid: Number(match.params.columnid),
        priority: 'LOW',
    } as ICrmLead
    );
    const [tabIndex, setTabIndex] = useState(0);
    const [openPersonModal, setOpenPersonmodal] = useState(false);
    const lead = useSelector(state => state.lead.lead);
    const advisers = useSelector(state => state.lead.advisers);
    const phases = useSelector(state => state.lead.leadPhases);
    const user = useSelector(state => state.login.validateToken.user);
    const archiveLeadProcess = useSelector(state => state.lead.archiveLead);
    const saveActivity = useSelector(state => state.lead.saveLeadActivity);
    const saveNote = useSelector(state => state.lead.saveLeadNote);
    const leadActivities = useSelector(state => state.lead.leadActivities);
    const leadNotes = useSelector(state => state.lead.leadLogNotes);
    const saveLead = useSelector(state => state.lead.saveLead);
    const leadHistory = useSelector(state => state.lead.leadHistory);
    const updateLeadTagProcess = useSelector(state => state.lead.updateLeadTags);
    const leadProductsDomain = useSelector(state => state.lead.leadProductsDomain);
    const leadTagsDomain = useSelector(state => state.lead.leadTagsDomain);
    const personTypeDomain = useSelector(state => state.lead.personTypeDomain);

    const leadProductsChanges = useRef<ICrmLeadHistoryIns[]>([]);
    const leadTagsChanges = useRef<ICrmLeadHistoryIns[]>([]);
    const [openDialogTemplate, setOpenDialogTemplate] = useState(false)
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const userConnected = useSelector(state => state.inbox.userConnected);
    const [openModal, setOpenModal] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [tableDataVariables, setTableDataVariables] = useState<Dictionary[]>([]);
    const domains = useSelector(state => state.person.editableDomains);

    const [typeTemplate, setTypeTemplate] = useState<"HSM" | "SMS" | "MAIL">('MAIL');
    const [extraTriggers, setExtraTriggers] = useState({
        phone: lead.value?.phone || '',
        email: lead.value?.email || '',
    })

    useEffect(() => {
        dispatch(getDomainsByTypename());
    }, []);

    useEffect(() => {
        if (domains.value?.customVariablesLead && lead) {
            setTableDataVariables(domains.value.customVariablesLead.map(x => ({ ...x, value: lead?.value?.variablecontext?.[x.variablename] || "" })))
        }
    }, [lead, domains]);

    useEffect(() => {
        if (!domains.loading && !domains.error && domains.value?.customVariablesLead) {
            dispatch(getCollectionAux2(getDomainByDomainNameList(domains.value?.customVariablesLead?.filter(item => item.domainname !== "").map(item => item.domainname).join(","))));
        }
    }, [domains]);


    const { register, setValue, getValues, formState: { errors }, reset, trigger } = useForm<any>({
        defaultValues: {
            leadid: 0,
            description: '',
            status: 'ACTIVO',
            type: 'NINGUNO',
            expected_revenue: '',
            date_deadline: '',
            estimatedimplementationdate: null,
            estimatedbillingdate: null,
            tags: '',
            personcommunicationchannel: '',
            priority: 'LOW',
            conversationid: 0,
            columnid: Number(match.params.columnid),
            column_uuid: match.params.columnuuid || '',
            index: 0,
            phone: '',
            email: '',
            operation: "INSERT",
            userid: 0,
            phase: '',

            leadproduct: '',
            persontype: '',
            campaignid: 0,
            personid: 0,

            activities: [] as ICrmLeadActivitySave[],
            notes: [] as ICrmLeadNoteSave[],

            feedback: '',
        }
    });

    const registerFormFieldOptions = useCallback(() => {
        register('description', { validate: (value) => (value?.length) || t(langKeys.field_required) });
        register('expected_revenue', {
            validate: (value): any => {
                if (!value || value.length === 0) {
                    return t(langKeys.field_required);
                } else if (Number(value) < 0) {
                    return t(langKeys.field_nonnegative);
                }

                return undefined;
            }
        });
        register('date_deadline', { validate: (value) => (value?.length) || t(langKeys.field_required) });
        register('estimatedimplementationdate');
        register('estimatedbillingdate');
        register('tags', { validate: (value) => (value?.length) || t(langKeys.field_required) });
        register('personcommunicationchannel');
        register('userid', { validate: (value) => ((value && value > 0) ? true : t(langKeys.field_required) + "") });
        register('columnid', { validate: (value) => ((value !== null && value !== undefined && value !== '') || t(langKeys.field_required) + "") });
        register('leadproduct', { validate: (value) => (value?.length) || t(langKeys.field_required) });
        register('email', {
            validate: {
                hasvalue: (value) => ((value?.length) ? true : t(langKeys.field_required) + ""),
                isemail: (value) => ((!value || (/\S+@\S+\.\S+/.test(value))) || t(langKeys.emailverification) + "")
            }
        });
    }, [register, t]);

    React.useEffect(() => {
        registerFormFieldOptions();
    }, [registerFormFieldOptions]);

    const onSubmit = async () => {
        const allOk = await trigger();
        if (allOk) {
            const data = getValues();
            const callback = () => {
                const lostPhase = phases.data.find(x => x.description.toLowerCase() === 'lost');
                if (lostPhase?.columnid === data.columnid) {
                    data.status = "CERRADO";
                }
                if (edit) {
                    dispatch(saveLeadAction([
                        insLead2({
                            ...data,
                            variablecontext: tableDataVariables.filter(x => x.value).reduce((acc, x) => ({ ...acc, [x.variablename]: x.value }), {})
                        }, data.operation),
                        ...leadProductsChanges.current.map(leadHistoryIns),
                        ...leadTagsChanges.current.map(leadHistoryIns),
                    ], false));
                } else {
                    dispatch(saveLeadWithFiles(async (uploader) => {
                        const notes = (data.notes || []) as ICrmLeadNoteSave[];
                        for (let i = 0; i < notes.length; i++) {
                            // subir los archivos de la nota que se va a agregar
                            if (notes[i].media && Array.isArray(notes[i].media)) {
                                const urls: string[] = [];
                                for (const fileToUpload of notes[i].media as File[]) {
                                    const url = await uploader(fileToUpload);
                                    urls.push(url);
                                }
                                notes[i].media = urls.join(',');
                            }
                        }

                        return {
                            header: insLead2({
                                ...data,
                                variablecontext: tableDataVariables.filter(x => x.value).reduce((acc, x) => ({ ...acc, [x.variablename]: x.value }), {})
                            }, data.operation),
                            detail: [
                                ...notes.map((x: ICrmLeadNoteSave) => leadLogNotesIns(x)),
                                ...(data.activities || []).map((x: ICrmLeadActivitySave) => leadActivityIns(x)),
                            ],
                        };
                    }, true));
                }
            };

            if (edit || values?.displayname) {
                dispatch(manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback
                }))
            } else {
                dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.mustassigncustomer) }))
            }
        }
    };

    useEffect(() => {
        if (edit === true) {
            const leadId = match.params.id;
            dispatch(getLead(getLeadsSel({
                id: Number(leadId),
                campaignid: 0,
                fullname: '',
                leadproduct: '',
                tags: '',
                userid: "",
                supervisorid: user?.userid || 0, // Obligatorio sin ser cero
                ordertype: '',
                orderby: '',
                persontype: "",
                all: false,
            })));
            dispatch(getLeadActivities(leadActivitySel(leadId)));
            dispatch(getLeadLogNotes(leadLogNotesSel(leadId)));
            dispatch(getLeadHistory(leadHistorySel(leadId)));
        }

        dispatch(getAdvisers(adviserSel()));
        // dispatch(getLeadPhases(getValuesFromDomain("ESTADOSOPORTUNIDAD")));
        dispatch(getLeadPhases(getColumnsSel(0, true)));
        dispatch(getLeadProductsDomain());
        dispatch(getLeadTagsDomain(getValuesFromDomain('OPORTUNIDADETIQUETAS')));
        dispatch(getLeadTemplates());
        dispatch(getLeadChannels());
        dispatch(getPersonType(getValuesFromDomain('TIPOPERSONA')));
        dispatch(getCalendar(selCalendar(0)));

        return () => {
            dispatch(resetGetLead());
            dispatch(resetSaveLead());
            dispatch(resetGetPersonListPaginated());
            dispatch(resetGetLeadPhases());
            dispatch(resetArchiveLead());
            dispatch(resetGetLeadActivities());
            dispatch(resetSaveLeadActivity());
            dispatch(resetGetLeadLogNotes());
            dispatch(resetSaveLeadLogNote());
            dispatch(resetGetLeadHistory());
            dispatch(resetGetLeadProductsDomain());
            dispatch(resetGetLeadTagsDomain());
            dispatch(resetGetPersonType());
            dispatch(resetGetLeadChannels());
            dispatch(resetGetCalendar());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit, match.params.id, dispatch]);

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
            setprioritycontrol(returnNumberprio(lead.value?.priority || ""))
            reset({
                description: lead.value?.description,
                status: lead.value?.status,
                type: 'NINGUNO',
                expected_revenue: lead.value?.expected_revenue,
                date_deadline: lead.value?.date_deadline,
                estimatedimplementationdate: lead.value?.estimatedimplementationdate,
                estimatedbillingdate: lead.value?.estimatedbillingdate,
                tags: lead.value?.tags,
                personcommunicationchannel: lead.value?.personcommunicationchannel,
                priority: lead.value?.priority,
                conversationid: lead.value?.conversationid,
                ticketnum: lead.value?.ticketnum,
                index: lead.value?.index,
                phone: lead.value?.phone,
                email: lead.value?.email,
                operation: "UPDATE",
                userid: lead.value?.userid,
                columnid: lead.value?.columnid,
                column_uuid: lead.value?.column_uuid,
                leadid: match.params.id,
                phase: lead.value?.phase,

                leadproduct: lead.value?.leadproduct || '',
                persontype: lead.value?.persontype || '',
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
                message: "Se guardo la oportunidad con éxito",
                show: true,
            }));
            history.push(paths.CRM);
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
            history.push(paths.CRM);
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
            dispatch(showBackdrop(false))
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

    useEffect(() => {
        if (leadProductsDomain.loading) return;
        if (leadProductsDomain.error) {
            const errormessage = t(leadProductsDomain.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        }
    }, [leadProductsDomain, match.params.id, edit, t, dispatch]);

    const handleCloseLead = useCallback(() => {
        if (!lead.value) return;

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_close),
            callback: () => dispatch(archiveLead(insArchiveLead(lead.value!))),
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lead, dispatch]);

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

    const handleUpdateLeadProducts = useCallback((value: any, action: "NEWPRODUCT" | "REMOVEPRODUCT") => {
        if (edit === false || !lead.value) return;

        const desc = String(typeof value === "object" ? value?.domaindesc || '-' : value);
        const productAlreadyHasChange = leadProductsChanges.current.some(x => x.description === desc);
        const previousProductsIncludeDesc = lead.value.leadproduct?.includes(desc);

        if (
            (!previousProductsIncludeDesc && !productAlreadyHasChange) ||
            (action === "REMOVEPRODUCT" && previousProductsIncludeDesc && !productAlreadyHasChange)
        ) {
            leadProductsChanges.current.push({
                description: desc,
                status: "ACTIVO",
                type: action,
                leadid: Number(match.params.id),
                operation: "INSERT",
                historyleadid: 0,
            });
        } else if (action === "NEWPRODUCT" && !previousProductsIncludeDesc && productAlreadyHasChange) {
            const historyBody = leadProductsChanges.current.find(x => x.description === desc);
            if (historyBody) {
                historyBody.type = action;
            }
        } else if (
            (action === "REMOVEPRODUCT" && !previousProductsIncludeDesc && productAlreadyHasChange) ||
            (action === "NEWPRODUCT" && previousProductsIncludeDesc && productAlreadyHasChange)
        ) {
            leadProductsChanges.current = leadProductsChanges.current.filter(x => x.description !== desc)
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
        setValue('persontype', value?.persontype || '')
        setValue('email', value?.email || '')
        setValue('phone', value?.phone || '')
        setExtraTriggers({
            phone: value?.phone || '',
            email: value?.email || '',
        })
        setValues(prev => ({ ...prev, displayname: value.name }))
    }, [setValue]);

    const isStatusClosed = useCallback(() => {
        return lead.value?.status === "CERRADO";
    }, [lead]);

    const canBeSentToHistory = useMemo(() => {
        if (!lead.value || phases.data.length === 0) return false;

        const wonIndex = phases.data.findIndex(x => x.description.toLowerCase() === 'won');
        if (wonIndex !== -1 && phases.data[wonIndex].columnid === lead.value.columnid) {
            return true;
        }

        const lostIndex = phases.data.findIndex(x => x.description.toLowerCase() === 'lost');
        if (wonIndex !== -1 && phases.data[lostIndex].columnid === lead.value.columnid) {
            return true;
        }

        return false;
    }, [lead, phases]);
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

    const openDialogInteractions = (row: any) => {
        setOpenModal(true);
        setRowSelected({ conversationid: getValues('conversationid'), displayname: values?.displayname, ticketnum: getValues('ticketnum') })
    };

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
                            CRM
                        </Link>
                        <Link
                            underline="hover"
                            color="textPrimary"
                            href={history.location.pathname}
                            onClick={(e) => e.preventDefault()}
                        >
                            <Trans i18nKey={langKeys.opportunity} />
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
                                <Trans i18nKey={langKeys.newLead} />
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
                        {!isIncremental &&
                            <>
                                {(edit && !!extraTriggers.phone) &&
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
                                {(edit && !!extraTriggers.email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(extraTriggers.email)) &&
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
                                {(edit && !!extraTriggers.phone) &&
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
                                {(edit && lead.value && !isStatusClosed()) && (
                                    <Button
                                        variant="contained"
                                        type="button"
                                        color="secondary"
                                        startIcon={<ArchiveIcon />}
                                        onClick={handleCloseLead}
                                        disabled={!canBeSentToHistory || iSProcessLoading()}
                                    >
                                        <Trans i18nKey={langKeys.sendToHistory} />
                                    </Button>
                                )}
                                {(!isStatusClosed() && !lead.loading) && <Button
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
                            </>}
                    </div>
                    <div style={{ height: '1em' }} />
                    <Grid container direction="row" style={{ backgroundColor: 'white', padding: '16px' }}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <Grid container direction="column">
                                <FieldEdit
                                    label={t(langKeys.description)}
                                    className={classes.field}
                                    disabled={isIncremental}
                                    onChange={(value) => setValue('description', value)}
                                    valueDefault={getValues('description')}
                                    error={errors?.description?.message}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                {!(lead?.value?.ticketnum) ?
                                    <FieldEdit
                                        label={t(langKeys.ticket)}
                                        className={classes.field}
                                        onChange={(value) => setValue('ticketnum', value)}
                                        valueDefault={getValues('ticketnum')}
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
                                <FieldEdit
                                    label={t(langKeys.email)}
                                    className={classes.field}
                                    onChange={(value) => { setValue('email', value); setExtraTriggers({ ...extraTriggers, email: value || '' }) }}
                                    valueDefault={getValues('email')}
                                    error={errors?.email?.message}
                                    disabled={isIncremental}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <FieldSelect
                                    label={t(langKeys.personType)}
                                    className={classes.field}
                                    valueDefault={getValues('persontype')}
                                    loading={personTypeDomain.loading}
                                    data={personTypeDomain.data}
                                    disabled={isIncremental}
                                    prefixTranslation="type_personlevel_"
                                    optionDesc="domainvalue"
                                    optionValue="domainvalue"
                                    onChange={(value) => setValue('persontype', value ? value.domainvalue : '')}
                                    readOnly={isStatusClosed() || iSProcessLoading()}
                                />
                                <FieldEdit
                                    label={t(langKeys.expected_revenue)}
                                    className={classes.field}
                                    disabled={isIncremental}
                                    valueDefault={getValues('expected_revenue')}
                                    error={errors?.expected_revenue?.message}
                                    type="number"
                                    onChange={(value) => setValue('expected_revenue', value)}
                                    InputProps={{
                                        startAdornment: !user ? null : (
                                            <InputAdornment position="start">
                                                {user!.currencysymbol}
                                            </InputAdornment>
                                        ),
                                        style: { textAlign: 'right' },
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                    inputProps={{
                                        style: { textAlign: 'right' },
                                    }}
                                />
                                <FieldMultiSelectFreeSolo
                                    label={t(langKeys.tags)}
                                    className={classes.field}
                                    disabled={isIncremental}
                                    valueDefault={getValues('tags')}
                                    onChange={(value: ({ domaindesc: string } | string)[], value2: { action: "create-option" | "remove-option" | "select-option", option: { option: string } }) => {
                                        const tags = value.map((o: any) => o.domaindesc || o).join();
                                        setValue('tags', tags);

                                        handleUpdateLeadTags(
                                            value2.option.option,
                                            value2.action === "remove-option" ? "REMOVETAG" : "NEWTAG",
                                        );
                                    }}
                                    error={errors?.tags?.message}
                                    loading={false}
                                    data={leadTagsDomain.data.concat(getValues('tags').split(',').filter((i: any) => i !== '' && (leadTagsDomain.data.findIndex(x => x.domaindesc === i)) < 0).map((domaindesc: any) => ({ domaindesc })))}
                                    optionDesc="domaindesc"
                                    optionValue="domaindesc"
                                    readOnly={isStatusClosed() || iSProcessLoading()}
                                />
                                <FieldSelect
                                    label={t(langKeys.agent)}
                                    className={classes.field}
                                    disabled={isIncremental}
                                    valueDefault={getValues('userid')}
                                    loading={advisers.loading}
                                    data={advisers.data}
                                    optionDesc="fullname"
                                    optionValue="userid"
                                    onChange={(value) => setValue('userid', value ? value.userid : '')}
                                    error={errors?.userid?.message}
                                    readOnly={isStatusClosed() || iSProcessLoading()}
                                />
                                <FieldMultiSelectVirtualized
                                    label={t(langKeys.product, { count: 2 })}
                                    className={classes.field}
                                    disabled={isIncremental}
                                    valueDefault={getValues('leadproduct')}
                                    onChange={(v, value2: { action: "remove-option" | "select-option", option: { option: any } }) => {
                                        const products = v?.map((o: Dictionary) => o['productid']).join(',') || '';
                                        setValue('leadproduct', products);

                                        handleUpdateLeadProducts(
                                            value2.option.option,
                                            value2.action === "remove-option" ? "REMOVEPRODUCT" : "NEWPRODUCT",
                                        );
                                    }}
                                    data={leadProductsDomain.data}
                                    loading={leadProductsDomain.loading}
                                    optionDesc="title"
                                    optionValue="productid"
                                    error={errors?.leadproduct?.message}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <Grid container direction="column">
                                {edit ?
                                    (
                                        <div className={clsx(classes.fakeInputContainer, classes.field)}>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <div style={{ flexGrow: 1 }}>
                                                    <FieldView
                                                        label={t(langKeys.customer)}
                                                        value={values?.displayname}
                                                    />
                                                </div>
                                                {(!!lead?.value?.personid) && <IconButton size="small" disabled={isIncremental} onClick={(e) => {
                                                    e.preventDefault();
                                                    history.push(`/person/${lead?.value?.personid}`)
                                                }}>
                                                    <PersonIcon />
                                                </IconButton>}
                                            </div>
                                        </div>
                                    ) :
                                    (<div style={{ display: 'flex', flexDirection: 'column' }} className={classes.field}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <div style={{ flexGrow: 1 }}>
                                                <FieldView
                                                    label={t(langKeys.customer)}
                                                    value={values?.displayname}
                                                />
                                            </div>
                                            <IconButton
                                                color="primary"
                                                onClick={() => setOpenPersonmodal(true)}
                                                size="small"
                                                disabled={isIncremental || isStatusClosed() || iSProcessLoading()}
                                            >
                                                <Add style={{ height: 22, width: 22 }} />
                                            </IconButton>
                                        </div>
                                        <div style={{ flexGrow: 1, marginTop: (errors?.personcommunicationchannel?.message) ? '29px' : '3px' }} />
                                        <div style={{ borderBottom: `solid ${(errors?.personcommunicationchannel?.message) ? '2px rgba(250,0,0,1)' : '1px rgba(0,0,0,0.42)'} `, marginBottom: '4px' }}></div>
                                        <div style={{ display: (errors?.personcommunicationchannel?.message) ? 'inherit' : 'none', color: 'red', fontSize: '0.75rem' }}>{errors?.personcommunicationchannel?.message}</div>
                                    </div>)
                                }
                                <PhoneFieldEdit
                                    value={"+" + getValues('phone')}
                                    label={t(langKeys.phone)}
                                    name="phone"
                                    fullWidth
                                    disabled={isIncremental}
                                    defaultCountry={user!.countrycode.toLowerCase()}
                                    className={classes.field}
                                    onChange={(v: any) => { setValue('phone', v); setExtraTriggers({ ...extraTriggers, phone: v || '' }) }}
                                    error={errors?.phone?.message}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {(!voxiConnection.error && userConnected) &&
                                                    <IconButton disabled={isIncremental} size="small" onClick={() => {
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
                                <FieldEdit
                                    label={t(langKeys.endDate)}
                                    className={classes.field}
                                    type="datetime-local"
                                    disabled={isIncremental}
                                    onChange={(value) => {
                                        // datetime formaT: yyyy-MM-ddTHH:mm
                                        setValue('date_deadline', value ? `${value}:00` : '');
                                    }}
                                    valueDefault={(getValues('date_deadline') as string)?.replace(' ', 'T')?.substring(0, 16)}
                                    error={errors?.date_deadline?.message}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <FieldEdit
                                    label={t(langKeys.estimatedimplementationdate)}
                                    className={classes.field}
                                    type="date"
                                    disabled={isIncremental}
                                    onChange={(value) => {
                                        // datetime formaT: yyyy-MM-ddTHH:mm
                                        setValue('estimatedimplementationdate', value);
                                    }}
                                    valueDefault={(getValues('estimatedimplementationdate') as string)?.replace(' ', 'T')?.substring(0, 16)}
                                    error={errors?.estimatedimplementationdate?.message}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <FieldEdit
                                    label={t(langKeys.estimatedbillingdate)}
                                    className={classes.field}
                                    type="date"
                                    disabled={isIncremental}
                                    onChange={(value) => {
                                        // datetime formaT: yyyy-MM-ddTHH:mm
                                        setValue('estimatedbillingdate', value);
                                    }}
                                    valueDefault={(getValues('estimatedbillingdate') as string)?.replace(' ', 'T')?.substring(0, 16)}
                                    error={errors?.estimatedbillingdate?.message}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <div className={classes.field} style={{ maxHeight: 55, minHeight: 55 }}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                        <Trans i18nKey={langKeys.priority} />
                                    </Box>
                                    <Rating
                                        name="simple-controlled"
                                        max={3}
                                        disabled={isIncremental}
                                        value={prioritycontrol}
                                        onChange={(event, newValue) => {
                                            setValue('priority', returnpriority(newValue || 0))
                                            setprioritycontrol(newValue || 0)
                                        }}
                                        readOnly={isStatusClosed() || iSProcessLoading()}
                                    />
                                </div>
                                <div className={clsx(classes.fakeInputContainer, classes.field)}>
                                    <FieldView
                                        label={t(langKeys.campaign)}
                                        value={lead.value?.campaign || ''}
                                    />
                                </div>
                                <RadioGroudFieldEdit
                                    aria-label="columnid"
                                    value={Number(getValues('columnid'))}
                                    name="radio-buttons-group-columnid"
                                    className={classes.field}
                                    row
                                    disabled={isIncremental}
                                    optionDesc="description"
                                    optionValue="columnid"
                                    data={phasemenu}
                                    // data={phases.data}
                                    onChange={(e) => {
                                        setValue('column_uuid', e?.column_uuid || "");
                                        setValue('columnid', Number(e?.columnid || "0"));
                                        setValues(prev => ({ ...prev })); // refrescar
                                    }}
                                    label={<Trans i18nKey={langKeys.phase} />}
                                    error={errors?.columnid?.message}
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
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <CustomVariablesIcon style={{ width: 22, height: 22, fill: "#b6b4ba" }} />
                                <Trans i18nKey={langKeys.customvariables} />
                                <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.customvariableslist_helper_lead)}</div>} arrow placement="top" >
                                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                </Tooltip>
                            </div>
                        )}
                        value={3}
                    />
                </Tabs>
                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <TabPanelLogNote
                        readOnly={isIncremental || isStatusClosed()}
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
                        readOnly={isIncremental || isStatusClosed()}
                        getValues={getValues}
                        values={values}
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
                <AntTabPanel index={3} currentIndex={tabIndex}>
                    <TabCustomVariables
                        tableData={tableDataVariables}
                        setTableData={setTableDataVariables}
                    />
                </AntTabPanel>
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
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default LeadForm;

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
                Header: t(langKeys.personType),
                accessor: 'persontype' as keyof IPerson,
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
                                disabled={isIncremental || loading}
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
                                            <span className={classes.logDate}>{formatDate(note.createdate, { withTime: true, modhours: -5 })}</span>
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
    getValues: any;
    values: Dictionary;
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
    getValues,
    leadId,
    userid,
    values,
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
                                                {`${t(langKeys.scheduledfor)} ${formatDate(activity.duedate, { withTime: true, modhours: -5 })}`}
                                            </span>
                                            <div style={{ width: '1em' }} />
                                            <span className={classes.activityName}>
                                                {`"${activity.description}"`}
                                            </span>
                                            <div style={{ width: '1em' }} />
                                            <span className={classes.activityFor}>
                                                {`${t(langKeys.assignedTo)} ${activity.assignto}`}
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
                getValues2={getValues}
                activity={openModal.payload}
                leadid={leadId}
                otherData={values}
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
    otherData: Dictionary;
    getValues2: any;
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

export const SaveActivityModal: FC<SaveActivityModalProps> = ({ open, onClose, activity, leadid, userid, onSubmit, getValues2, otherData }) => {
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
    const [blockEditSummary, setBlockEditSummary] = useState(activity?.type === "appointment");
    // const [bodyCleaned, setBodyCleaned] = useState('');
    const calendarList = useSelector(state => state.lead.calendar);
    const [assigntoinitial, setassigntoinitial] = useState(0)
    const [calendarbookingid, setCalendarbookingid] = useState(0)

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
            variables: [],
            calendar: activity?.calendar || 0,
            linkcalendar: "",
            calendarbookingid: activity?.calendarbookingid || 0,
        },
    });
    useEffect(() => {
        if (open && blockEditSummary) {
            const descripcion = getValues2("description");
            let primeros20Caracteres = descripcion.slice(0, 20);
            if (descripcion.length > 20) primeros20Caracteres = primeros20Caracteres + "..."
            setValue("description", primeros20Caracteres)
            setValue("assigneduser", getValues2("userid"))
        }
    }, [open, blockEditSummary]);

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
            variables: [],
            calendar: 0,
            linkcalendar: "",
            calendarbookingid: 0,
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
            variables: [],
            calendar: activity?.calendar || 0,
            linkcalendar: "",
            calendarbookingid: activity?.calendarbookingid || 0,
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
            if (values.type === "appointment" && values.linkcalendar) {
                let calendarid = 0
                setValue("calendarbookingid", 0)
                const url = "https://" + values.linkcalendar + "/?" +
                    "n=" + encodeURIComponent(otherData.displayname) +
                    "&t=" + encodeURIComponent(otherData.phone) +
                    "&c=" + encodeURIComponent(otherData.email);
                const win = window.open(url, '_blank');
                dispatch(showBackdrop(true))
                window.addEventListener('message', (event) => {
                    if (event.source === win) {
                        calendarid = event.data
                        setValue("calendarbookingid", calendarid)
                        const bb = "";
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
                                calendarbookingid: calendarid,
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
                            calendarbookingid: calendarid,
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
                    }
                });
                const timer = setInterval(function () {
                    if (win.closed) {
                        clearInterval(timer);
                        if (calendarid === 0) {
                            dispatch(showBackdrop(false))
                            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.errorappointmentlead) }))
                        }
                    }
                }, 500);
            } else {
                dispatch(showBackdrop(true))
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
                                                setBlockEditSummary(v?.domainvalue === "appointment")
                                                if (v?.domainvalue === "appointment") {
                                                    console.log(getValues('duedate'))
                                                    setValue('duedate', new Date().toISOString().slice(0, 16).replace('T', ' '))
                                                }
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
                                        {blockEditSummary ? <FieldView
                                            label={t(langKeys.summary)}
                                            className={classes.field}
                                            value={getValues('description')}
                                            tooltipcontent={getValues2("description")}
                                        /> :
                                            <FieldEdit
                                                label={t(langKeys.summary)}
                                                className={classes.field}
                                                valueDefault={getValues('description')}
                                                onChange={v => setValue('description', v)}
                                                error={errors?.description?.message}
                                            />}
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
                                        {getValues('type').includes("appointment") ?
                                            <FieldSelect
                                                label={t(langKeys.calendar)}
                                                className={classes.field}
                                                data={calendarList.data}
                                                optionDesc="code"
                                                optionValue="calendareventid"
                                                loading={calendarList.loading}
                                                valueDefault={getValues('calendar')}
                                                onChange={v => {
                                                    setValue('calendar', v?.calendareventid || 0);
                                                    setValue('linkcalendar', v?.eventlink || "")
                                                }}
                                                error={errors?.assignto?.message}
                                            /> :
                                            <FieldEdit
                                                label={t(langKeys.scheduledfor)}
                                                className={classes.field}
                                                type="datetime-local"
                                                valueDefault={(getValues('duedate') as string)?.replace(' ', 'T')?.substring(0, 16)}
                                                onChange={(value) => setValue('duedate', value)}
                                                error={errors?.duedate?.message}
                                            />}
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <FieldSelect
                                            label={t(langKeys.asignedto)}
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
                                                                validate: (value: any) => (value?.length) || t(langKeys.field_required)
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
                                                                    validate: (value: any) => (value?.length) || t(langKeys.field_required)
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

interface TabCustomVariablesProps {
    setTableData: (x: Dictionary[]) => void;
    tableData: Dictionary[];
}

const TabCustomVariables: FC<TabCustomVariablesProps> = ({ tableData, setTableData }) => {
    const domains = useSelector(state => state.person.editableDomains);
    const { t } = useTranslation();
    const [skipAutoReset, setSkipAutoReset] = useState(false)
    const [updatingDataTable, setUpdatingDataTable] = useState(false);
    const domainsCustomTable = useSelector((state) => state.main.mainAux2);

    const updateCell = (rowIndex: number, columnId: string, value: string) => {
        setSkipAutoReset(true);
        const auxTableData = tableData
        auxTableData[rowIndex][columnId] = value
        setTableData(auxTableData)
        setUpdatingDataTable(!updatingDataTable);
    }

    useEffect(() => {
        setSkipAutoReset(false)
    }, [updatingDataTable])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.variable),
                accessor: 'variablename',
                NoFilter: true,
                sortType: 'string'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
                sortType: 'string',
            },
            {
                Header: t(langKeys.datatype),
                accessor: 'variabletype',
                NoFilter: true,
                sortType: 'string',
                prefixTranslation: 'datatype_',
                Cell: (props: any) => {
                    const { variabletype } = props.cell.row.original || {};
                    return (t(`datatype_${variabletype}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.value),
                accessor: 'value',
                NoFilter: true,
                type: 'string',
                editable: true,
                width: 250,
                maxWidth: 250
            },
        ],
        []
    )
    return (
        <CustomTableZyxEditable
            columns={columns}
            download={false}
            loading={domains.loading || domainsCustomTable.loading}
            register={false}
            data={(tableData).map(x => ({
                ...x,
                domainvalues: (domainsCustomTable?.data || []).filter(y => y.domainname === x?.domainname)
            }))}
            filterGeneral={false}
            updateCell={updateCell}
            skipAutoReset={skipAutoReset}
        />
    );
}
interface Options {
    withTime?: boolean;
    modhours?: number
}

const formatDate = (strDate: string = "", options: Options = { withTime: true, modhours: 0 }) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(typeof strDate === "number" ? strDate : strDate.replace("Z", ""));
    date.setHours(date.getHours() + (options?.modhours || 0));
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });
    const time = date.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
    return `${day}/${month}/${year}${options.withTime! ? time.split(',')[1] : ''}`;
}
