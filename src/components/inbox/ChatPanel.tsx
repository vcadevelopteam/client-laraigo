import React, { useState, useEffect, useRef } from 'react'
// import 'emoji-mart/css/emoji-mart.css'
import { ICloseTicketsParams, Dictionary, IReassignicketParams, ILead } from "@types";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CloseTicketIcon, HSMIcon, TipifyIcon, ReassignIcon, LeadIcon, TackIcon } from 'icons';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import Tooltip from '@material-ui/core/Tooltip';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getTipificationLevel2, resetGetTipificationLevel2, resetGetTipificationLevel3, getTipificationLevel3, showInfoPanel, closeTicket, reassignTicket, emitEvent, sendHSM, updatePerson, hideLogInteractions, updateClassificationPerson, setSearchTerm, setPinnedComments } from 'store/inbox/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { changeStatus, getConversationClassification2, insertClassificationConversation, insLeadPerson, modifyPinnedMessage, updateGroupOnHSM } from 'common/helpers';
import { execute, getCollectionAux2 } from 'store/main/actions';
import { DialogZyx, FieldSelect, FieldEdit, FieldEditArray, FieldEditMulti, FieldView, FieldMultiSelectFreeSolo, FieldMultiSelectVirtualized, PhoneFieldEdit } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Rating from '@material-ui/lab/Rating';
import { Box, InputBase, makeStyles } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import PhoneIcon from '@material-ui/icons/Phone';
import IOSSwitch from "components/fields/IOSSwitch";
import { setModalCall } from 'store/voximplant/actions';
import { useLocation } from 'react-router-dom';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ReplyPanel from './ReplyPanel';
import InteractionsPanel from './InteractionsPanel';
import { getLeadProductsDomain, resetGetLeadProductsDomain } from 'store/lead/actions';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ReplyIcon from '@material-ui/icons/Reply';
import { ExpandLess, ExpandMore, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

const dataPriority = [
    { option: 'HIGH' },
    { option: 'LOW' },
    { option: 'MEDIUM' },
    { option: 'HIGH' },
]

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    tagsWrapper: {
        display: 'flex',
        // whiteSpace: 'nowrap',
        paddingBottom: 0,
        overflowX: 'hidden',
        transition: 'transform 0.3s ease-in-out',
    },
    tag: {
        backgroundColor: '#efefef',
        borderRadius: '4px',
        padding: theme.spacing(0.38, 1),
        flexShrink: 0,
        marginRight: theme.spacing(1),
        display: 'inline-block',
    },
    iconHelpText: {
        marginLeft: theme.spacing(1),
    },
    arrowLeft: {
        left: 0,
    },
    arrowRight: {
        right: 0,
    },
    enablebutton: {
        cursor: "pointer"
    },
    disablebutton: {
        cursor: "not-allowed"
    }
}));

const variables = ['firstname', 'lastname', 'displayname', 'email', 'phone', 'documenttype', 'documentnumber', 'custom'].map(x => ({ key: x }))

const DialogSendHSM: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean }> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const multiData = useSelector(state => state.main.multiData);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const person = useSelector(state => state.inbox.person);
    const sendingRes = useSelector(state => state.inbox.triggerSendHSM);
    const [templatesList, setTemplatesList] = useState<Dictionary[]>([]);
    const [channelsList, setchannelsList] = useState<Dictionary[]>([]);
    const [bodyMessage, setBodyMessage] = useState('');

    const { control, register, handleSubmit, setValue, getValues, reset, trigger, formState: { errors } } = useForm<any>({
        defaultValues: {
            hsmtemplateid: 0,
            hsmtemplatename: '',
            observation: '',
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
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_send_hsm) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));

                setWaitClose(false);
            } else if (sendingRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(sendingRes.code ?? "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitClose(false);
            }
        }
    }, [sendingRes, waitClose])

    useEffect(() => {
        if (!multiData.loading && !multiData.error) {
            setTemplatesList((multiData?.data?.[5]?.data || []).filter(x => (x.type === "HSM" && x.templatetype !== "CAROUSEL")))
            setchannelsList((multiData?.data?.[13]?.data || []).filter(e => e.type.includes("WHA")) || [])
        }
    }, [multiData])

    useEffect(() => {
        if (openModal) {
            setBodyMessage('')
            reset({
                hsmtemplateid: 0,
                hsmtemplatename: '',
                variables: [],
                buttons: [],
                headervariables: []
            })
            register('hsmtemplateid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            register('communicationchannelid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            register('communicationchanneltype', { validate: (value) => ((value?.length > 0) || t(langKeys.field_required)) });
            register('platformtype', { validate: (value) => ((value?.length > 0) || t(langKeys.field_required)) });
            if (ticketSelected?.communicationchanneltype?.includes('WHA') || ticketSelected?.communicationchanneltype?.includes('VOXI')) {
                let value = channelsList[0]
                setValue('communicationchannelid', value?.communicationchannelid || 0);
                setValue('communicationchanneltype', value?.type || "");
                setValue('platformtype', value?.communicationchannelsite || "");
            }
        }
    }, [openModal])

    const onSelectTemplate = (value: Dictionary) => {
        if (ticketSelected?.communicationchanneltype?.includes('WHA')) {
            setValue('communicationchannelid', ticketSelected?.communicationchannelid);
            setValue('communicationchanneltype', ticketSelected?.communicationchanneltype);
            setValue('platformtype', ticketSelected?.communicationchannelsite);
        }
        if (value) {
            setBodyMessage(value.body);
            setValue('hsmtemplateid', value ? value.id : 0);
            setValue('hsmtemplatename', value ? value.name : '');
            const variablesList = value?.body?.match(/({{)(.*?)(}})/g) || [];
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
            setValue('buttons', []);
            setValue('headervariables', []);
            setBodyMessage('');
            setValue('hsmtemplateid', 0);
        }
    }

    const onSubmit = handleSubmit((data) => {
        const hsmData = {
            hsmtemplateid: data.hsmtemplateid,
            hsmtemplatename: data.hsmtemplatename,
            communicationchannelid: data.communicationchannelid,
            communicationchanneltype: data.communicationchanneltype,
            platformtype: data.platformtype,
            type: 'HSM',
            shippingreason: "INBOX",
            listmembers: [{
                personid: person.data?.personid || 0,
                phone: person.data?.phone!! + "",
                firstname: person.data?.firstname + "",
                lastname: person.data?.lastname + "",
                parameters: [...data.variables, ...data.buttons, ...data.headervariables].map((v: any) => ({
                    type: v?.type || "text",
                    text: v.variable !== 'custom' ? (person.data as Dictionary)[v.variable] : v.text,
                    name: v.name
                }))
            }]
        }
        dispatch(execute(updateGroupOnHSM(ticketSelected?.conversationid ?? 0)))
        dispatch(sendHSM(hsmData))
        dispatch(showBackdrop(true));
        setWaitClose(true)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.send_hsm)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.send)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">

                {!ticketSelected?.communicationchanneltype?.includes('WHA') &&
                    <FieldSelect
                        label={t(langKeys.channel)}
                        className="col-12"
                        valueDefault={getValues('communicationchannelid')}
                        onChange={(value) => {
                            setValue('communicationchannelid', value?.communicationchannelid || 0);
                            setValue('communicationchanneltype', value?.type || "");
                            setValue('platformtype', value?.communicationchannelsite || "");
                        }}
                        error={errors?.communicationchannelid?.message}
                        data={channelsList}
                        optionDesc="description"
                        optionValue="communicationchannelid"
                    />
                }
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.hsm_template)}
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

            <FieldView
                label={t(langKeys.message)}
                value={bodyMessage}
            />
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
                                setValue(`variables.${i}.variable`, value?.key)
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

const DialogCloseticket: React.FC<{
    setOpenModal: (param: any) => void;
    openModal: boolean;
    status?: string;
}> = ({ setOpenModal, openModal, status = "CERRADO" }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const [waitOther, setWaitOther] = useState(false);
    const changeStatusRes = useSelector(state => state.main.execute);
    const [motives, setMotives] = useState<{ closed: Dictionary[], suspend: Dictionary[], selected: Dictionary[] }>({ closed: [], suspend: [], selected: [] });
    const multiData = useSelector(state => state.main.multiData);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const userType = useSelector(state => state.inbox.userType);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const closingRes = useSelector(state => state.inbox.triggerCloseTicket);
    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (waitClose) {
            if (!closingRes.loading && !closingRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_close_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                dispatch(emitEvent({
                    event: 'deleteTicket',
                    data: {
                        conversationid: ticketSelected?.conversationid,
                        ticketnum: ticketSelected?.ticketnum,
                        status: ticketSelected?.status,
                        isanswered: ticketSelected?.isAnswered,
                        communicationchannelid: ticketSelected?.communicationchannelid,
                        usergroup: ticketSelected?.usergroup,
                        userid: userType === "AGENT" ? 0 : agentSelected?.userid,
                        getToken: userType === "SUPERVISOR"
                    }
                }));
                setWaitClose(false);
            } else if (closingRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(closingRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitClose(false);
            }
        }
    }, [closingRes, waitClose])

    useEffect(() => {
        if (!multiData.error && !multiData.loading) {
            const indexClosed = multiData.data.findIndex((x => x.key === `UFN_DOMAIN_LST_VALUES_ONLY_DATA_MOTIVOCIERRE`));
            const indexSuspend = multiData.data.findIndex((x => x.key === `UFN_DOMAIN_LST_VALUES_ONLY_DATA_MOTIVOSUSPENSION`));

            if (indexClosed > -1) {
                setMotives({
                    closed: multiData.data[indexClosed]?.data || [],
                    suspend: multiData.data[indexSuspend]?.data || [],
                    selected: []
                })
            }
        }
    }, [multiData])

    useEffect(() => {
        if (waitOther) {
            if (!changeStatusRes.loading && !changeStatusRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: status === "SUSPENDIDO" ? t(langKeys.successful_suspend_ticket) : t(langKeys.successful_reactivate_ticket) }))

                dispatch(emitEvent({
                    event: 'changeStatusTicket',
                    data: {
                        conversationid: ticketSelected?.conversationid,
                        status: status,
                        isanswered: ticketSelected?.isAnswered,
                        userid: userType === "AGENT" ? 0 : agentSelected?.userid,
                    }
                }));

                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitOther(false);
            } else if (changeStatusRes.error) {
                const message = t(changeStatusRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message }))
                dispatch(showBackdrop(false));
                setWaitOther(false);
            }
        }
    }, [changeStatusRes, waitOther])

    useEffect(() => {
        if (openModal) {
            if (status === "CERRADO") {
                setMotives({
                    ...motives,
                    selected: motives.closed
                })
            } else {
                setMotives({
                    ...motives,
                    selected: motives.suspend
                })
            }
            reset({
                motive: '',
                observation: ''
            })
            register('motive', { validate: (value) => ((value?.length) || t(langKeys.field_required)) });
            register('observation');
        }
    }, [openModal])

    const onSubmit = handleSubmit((data) => {
        if (status === "CERRADO") {
            const dd: ICloseTicketsParams = {
                conversationid: ticketSelected?.conversationid!!,
                motive: data.motive,
                observation: data.observation,
                ticketnum: ticketSelected?.ticketnum!!,
                personcommunicationchannel: ticketSelected?.personcommunicationchannel!!,
                communicationchannelsite: ticketSelected?.communicationchannelsite!!,
                communicationchanneltype: ticketSelected?.communicationchanneltype!!,
                status: 'CERRADO',
                isAnswered: false,
            }
            dispatch(showBackdrop(true));
            dispatch(closeTicket(dd));
            setWaitClose(true)
        } else {
            dispatch(showBackdrop(true));
            dispatch(execute(changeStatus({
                conversationid: ticketSelected?.conversationid!!,
                status,
                obs: data.observation,
                motive: data.motive
            })))
            setWaitOther(true)
        }
    });

    return (
        <DialogZyx
            open={openModal}
            title={status === "CERRADO" ? t(langKeys.close_ticket) : (status === 'ASIGNADO' ? t(langKeys.activate_ticket) : t(langKeys.suspend_ticket))}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.ticket_reason)}
                    className="col-12"
                    valueDefault={getValues('motive')}
                    onChange={(value) => setValue('motive', value ? value.domainvalue : '')}
                    error={errors?.motive?.message}
                    data={motives.selected}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                <FieldEditMulti
                    label={t(langKeys.observation)}
                    valueDefault={getValues('observation')}
                    className="col-12"
                    onChange={(value) => setValue('observation', value)}
                    maxLength={1024}
                />
            </div>
        </DialogZyx>)
}

const DialogReassignticket: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean, propertyAsesorReassign: boolean, propertyGrupoDelegacion: boolean }> = (
    { setOpenModal, openModal, propertyAsesorReassign, propertyGrupoDelegacion }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitReassign, setWaitReassign] = useState(false);

    const multiData = useSelector(state => state.main.multiData);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const agentToReassignList = useSelector(state => state.inbox.agentToReassignList);
    const user = useSelector(state => state.login.validateToken.user);
    const groups = user?.groups?.split(",") || [];
    const [userToReassign, setUserToReassign] = useState<Dictionary[]>([])
    const [agentList, setAgentList] = useState<Dictionary[]>([])
    const [usableGroups, setUsableGroups] = useState<Dictionary[]>([])
    const userType = useSelector(state => state.inbox.userType);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const reassigningRes = useSelector(state => state.inbox.triggerReassignTicket);
    const interactionBaseList = useSelector(state => state.inbox.interactionBaseList);

    const { register, handleSubmit, setValue, getValues, trigger, reset, formState: { errors }, watch } = useForm<{
        newUserId: number;
        newUserGroup: string;
        observation: string;
        token: string;
    }>();

    const watchNewUserGroup = watch("newUserGroup")

    useEffect(() => {
        if (waitReassign) {
            if (!reassigningRes.loading && !reassigningRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_reasign_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitReassign(false);

                const isAnsweredNew = interactionBaseList.some((x) => x.userid === (getValues('newUserId') || 3) && x.interactiontype !== "LOG");

                dispatch(emitEvent({
                    event: 'reassignTicket',
                    data: {
                        ...ticketSelected,
                        usergroup: getValues('newUserGroup'),
                        isanswered: ticketSelected?.isAnswered,
                        isAnsweredNew,
                        userid: userType === "AGENT" ? 0 : agentSelected?.userid,
                        newuserid: getValues('newUserId') || 3,
                    }
                }));

            } else if (reassigningRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.error_unexpected_error) }))
                dispatch(showBackdrop(false));
                setWaitReassign(false);
            }
        }
    }, [reassigningRes, waitReassign])

    useEffect(() => {
        if (openModal) {
            reset({
                newUserId: 0,
                newUserGroup: '',
                observation: '',
            })
            register('newUserId');
            register('newUserGroup');
            register('observation');
        }
    }, [openModal])

    const onSubmit = handleSubmit((data) => {
        if (data.newUserId === 0 && !data.newUserGroup) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.least_user_or_group) }))
            return;
        }
        const dd: IReassignicketParams = {
            ...ticketSelected!!,
            ...data,
            newUserId: data.newUserId || 3,
            newConversation: true,
            wasanswered: ticketSelected?.isAnswered || false
        }
        dispatch(reassignTicket(dd));
        dispatch(showBackdrop(true));
        setWaitReassign(true)

    });

    useEffect(() => {
        if (user) {
            const rules = multiDataAux?.data?.find(x => x.key === "UFN_ASSIGNMENTRULE_BY_GROUP_SEL")?.data || []
            const grouprules = rules.map(item => item.assignedgroup)
            let groups = [];
            if (grouprules.length && propertyGrupoDelegacion) {
                groups = grouprules
            }
            setUsableGroups(groups)
            
            setUserToReassign((multiData?.data?.[3]?.data || []).filter(x => groups.length > 0 ? groups.includes(x.domainvalue) : true))
            
            if (propertyAsesorReassign && !propertyGrupoDelegacion) {
                setAgentList(agentToReassignList.filter(agent => {
                    const agentGroups = (agent.groups || "").split(',');
                    return agentGroups.some((group: any) => grouprules.includes(group.trim()));
                }))
            }
        }
    }, [user, multiData, multiDataAux, propertyAsesorReassign])

    useEffect(() => {
        if(propertyGrupoDelegacion){
            if(watchNewUserGroup){
                setAgentList(agentToReassignList.filter(x => x.status === "ACTIVO" && x.userid !== user?.userid && x.groups.includes(watchNewUserGroup)))
            }else{
                setAgentList(agentToReassignList.filter(x => x.status === "ACTIVO" && x.userid !== user?.userid && (x.groups || "").split(",").some(group => !usableGroups.length || usableGroups.includes(group))))
            }
        }else{
            if (propertyAsesorReassign) {
                setAgentList(agentToReassignList.filter(x => x.status === "ACTIVO" && x.userid !== user?.userid && (x.groups || "").split(",").some(group => !usableGroups.length || usableGroups.includes(group))))
            }
            else {
                setAgentList(agentToReassignList.filter(x => x.status === "ACTIVO"))
            }
        }
    }, [propertyAsesorReassign,propertyGrupoDelegacion, userToReassign, watchNewUserGroup, usableGroups])

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.reassign_ticket)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                {propertyGrupoDelegacion && <FieldSelect
                    label={t(langKeys.group_plural)}
                    className="col-12"
                    valueDefault={getValues('newUserGroup')}
                    onChange={(value) => {
                        setValue('newUserGroup', value ? value.domainvalue : '');
                        setValue('newUserId', 0);
                        trigger('newUserId');
                    }}
                    error={errors?.newUserGroup?.message}
                    data={userToReassign}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />}
                {propertyAsesorReassign && <FieldSelect
                    label={t(langKeys.advisor)}
                    className="col-12"
                    valueDefault={getValues('newUserId')}
                    onChange={(value) => {
                        setValue('newUserId', value ? value.userid : 0);
                    }}
                    error={errors?.newUserId?.message}
                    data={agentList}
                    optionDesc="displayname"
                    optionValue="userid"
                />}
                <FieldEditMulti
                    label={t(langKeys.observation)}
                    valueDefault={getValues('observation')}
                    className="col-12"
                    onChange={(value) => setValue('observation', value)}
                    maxLength={1024}
                />
            </div>
        </DialogZyx>)
}

const DialogLead: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean }> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitInsLead, setWaitInsLead] = useState(false);
    const multiData = useSelector(state => state.main.multiData);
    const insLeadRes = useSelector(state => state.main.execute);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const user = useSelector(state => state.login.validateToken.user);
    const personSelected = useSelector(state => state.inbox.person.data);
    const [tagsDomain, setTagsDomain] = useState<Dictionary[]>([]);
    const leadProductsDomain = useSelector(state => state.lead.leadProductsDomain);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<{
        description: string;
        expected_revenue: string;
        priority: number;
        lastname: string;
        firstname: string;
        email: string;
        phone: string;
        products: string;
        tags: string;
    }>();

    useEffect(() => {
        if (!multiData.error && !multiData.loading) {
            setTagsDomain(multiData?.data[7] ? multiData?.data[7]?.data : []);
        }
    }, [multiData])
    useEffect(() => {
        dispatch(getLeadProductsDomain());

        return () => {
            dispatch(resetGetLeadProductsDomain());
        };
    }, [])
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
    }, [leadProductsDomain, t, dispatch]);

    useEffect(() => {
        if (waitInsLead) {
            if (!insLeadRes.loading && !insLeadRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitInsLead(false);
                dispatch(updatePerson({ ...personSelected!!, havelead: true }));
            } else if (insLeadRes.error) {
                const message = t(insLeadRes.code || "error_unexpected_error", { module: t(langKeys.lead).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message }))
                dispatch(showBackdrop(false));
                setWaitInsLead(false);
            }
        }
    }, [insLeadRes, waitInsLead])

    useEffect(() => {
        if (openModal) {
            reset({
                description: '',
                expected_revenue: '',
                priority: 1,
                firstname: personSelected?.firstname,
                lastname: personSelected?.lastname,
                email: personSelected?.email,
                phone: personSelected?.phone,
                products: '',
                tags: ''
            })
            register('description', { validate: (value) => ((value?.length) ? true : t(langKeys.field_required) + "") });
            register('expected_revenue', { validate: (value) => ((value?.length) ? true : t(langKeys.field_required) + "") });
            register('priority', { validate: (value) => ((value && value > 0) ? true : t(langKeys.field_required) + "") });

            register('lastname', { validate: (value) => ((value?.length) ? true : t(langKeys.field_required) + "") });
            register('firstname', { validate: (value) => ((value?.length) ? true : t(langKeys.field_required) + "") });
            register('email', {
                validate: {
                    hasvalue: (value) => ((value?.length) ? true : t(langKeys.field_required) + ""),
                    isemail: (value) => ((!value || (/\S+@\S+\.\S+/.test(value))) || t(langKeys.emailverification) + "")
                }
            });
            register('phone', { validate: (value) => ((value?.length) ? true : t(langKeys.field_required) + "") });
        }
    }, [openModal])

    const onSubmit = handleSubmit((data) => {
        const newLead: ILead = {
            leadid: 0,
            description: data.description,
            type: 'NINGUNO',
            status: 'ACTIVO',
            expected_revenue: parseFloat(data.expected_revenue),
            date_deadline: null,
            personcommunicationchannel: ticketSelected?.personcommunicationchannel!!,
            priority: dataPriority[data.priority].option,
            conversationid: ticketSelected?.conversationid!!,
            columnid: 0,
            index: 0,
            userid: user?.userid || 0,
            products: data.products,
            tags: data.tags
        }

        const { firstname = "", lastname = "", email = "", phone = "" } = data;
        dispatch(showBackdrop(true));
        dispatch(execute(insLeadPerson(newLead, firstname, lastname, email, phone, personSelected?.personid!!, personSelected?.persontype || "")))
        setWaitInsLead(true)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.newlead)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.create)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                    <FieldEdit
                        label={t(langKeys.firstname)}
                        valueDefault={getValues('firstname')}
                        className="flex-1"
                        error={errors?.firstname?.message}
                        onChange={(value) => setValue('firstname', value)}
                    />
                    <FieldEdit
                        label={t(langKeys.lastname)}
                        valueDefault={getValues('lastname')}
                        className="flex-1"
                        error={errors?.lastname?.message}
                        onChange={(value) => setValue('lastname', value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <FieldEdit
                        label={t(langKeys.email)}
                        valueDefault={getValues('email')}
                        className="flex-1"
                        error={errors?.email?.message}
                        onChange={(value) => setValue('email', value)}
                    />
                    <PhoneFieldEdit
                        value={"+" + getValues('phone')}
                        label={t(langKeys.phone)}
                        name="phone"
                        fullWidth
                        defaultCountry={user!.countrycode.toLowerCase()}
                        className="flex-1"
                        onChange={(v: any) => { setValue('phone', v); }}
                        error={errors?.phone?.message}
                    />
                </div>
                <FieldEdit
                    label={t(langKeys.description)}
                    valueDefault={getValues('description')}
                    error={errors?.description?.message}
                    onChange={(value) => setValue('description', value)}
                />
                <FieldMultiSelectFreeSolo
                    label={t(langKeys.tags)}
                    className="col-12"
                    valueDefault={getValues('tags')}
                    onChange={(value: ({ domaindesc: string } | string)[]) => {
                        const tags = value.map((o: any) => o.domaindesc || o).join();
                        setValue('tags', tags);
                    }}
                    error={errors?.tags?.message}
                    loading={false}
                    data={tagsDomain.concat((getValues('tags') || '').split(',').filter((i: any) => i !== '' && (tagsDomain.findIndex(x => x.domaindesc === i)) < 0).map((domaindesc: any) => ({ domaindesc })))}
                    optionDesc="domaindesc"
                    optionValue="domaindesc"
                />
                <FieldMultiSelectVirtualized
                    label={t(langKeys.product_plural)}
                    className="col-12"
                    valueDefault={getValues('products')}
                    onChange={(v) => {
                        const products = v?.map((o: Dictionary) => o['productid']).join(',') || '';
                        setValue('products', products);
                    }}
                    error={errors?.products?.message}
                    data={leadProductsDomain.data}
                    loading={leadProductsDomain.loading}
                    optionDesc="title"
                    optionValue="productid"
                />
                <div style={{ display: 'flex', gap: 16 }}>
                    <FieldEdit
                        label={t(langKeys.expected_revenue)}
                        className="flex-1"
                        valueDefault={getValues('expected_revenue')}
                        error={errors?.expected_revenue?.message}
                        type="number"
                        onChange={(value) => setValue('expected_revenue', value)}

                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {user?.currencysymbol}
                                </InputAdornment>
                            )
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">Prioridad</Box>
                        <Rating
                            name="priority-start"
                            max={3}
                            value={getValues('priority')}
                            onChange={(event, newValue) => setValue('priority', newValue || 0, { shouldValidate: true })}
                        />
                    </div>
                </div>
            </div>
        </DialogZyx>)
}

const DialogTipifications: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean }> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitTipify, setWaitTipify] = useState(false);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const multiData = useSelector(state => state.main.multiData);
    const tipificationLevel2 = useSelector(state => state.inbox.tipificationsLevel2);
    const tipificationLevel3 = useSelector(state => state.inbox.tipificationsLevel3);

    const tipifyRes = useSelector(state => state.main.execute);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (waitTipify) {
            if (!tipifyRes.loading && !tipifyRes.error) {
                dispatch(updateClassificationPerson(true))
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_tipify_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitTipify(false);
            } else if (tipifyRes.error) {
                const message = t(tipifyRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })

                dispatch(showSnackbar({ show: true, severity: "error", message }))
                dispatch(showBackdrop(false));
                setWaitTipify(false);
            }
        }
    }, [tipifyRes, waitTipify])

    useEffect(() => {
        if (openModal) {
            dispatch(resetGetTipificationLevel2())
            dispatch(resetGetTipificationLevel3())
            reset({
                classificationid1: 0,
                path1: '',
                classificationid2: 0,
                path2: '',
                classificationid3: 0,
                path3: '',
            })
            register('path1');
            register('classificationid1', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            register('path2');
            register('classificationid2');
            register('classificationid3');

        }
    }, [openModal])

    const onChangeTipificationLevel1 = (value: Dictionary) => {
        setValue('classificationid1', value ? value.classificationid : '');
        setValue('path1', value ? value.path : '');
        setValue('classificationid2', 0);
        setValue('path2', '');
        setValue('classificationid3', 0);
        setValue('path3', '');

        if (value)
            dispatch(getTipificationLevel2(value.classificationid))
        else
            dispatch(resetGetTipificationLevel2())
    }

    const onChangeTipificationLevel2 = (value: Dictionary) => {
        setValue('classificationid2', value ? value.classificationid : '');
        setValue('path2', value ? value.path : '');
        setValue('classificationid3', 0);
        setValue('path3', '');
        if (value)
            dispatch(getTipificationLevel3(value.classificationid))
        else
            dispatch(resetGetTipificationLevel3())
    }

    const onChangeTipificationLevel3 = (value: Dictionary) => {
        setValue('classificationid2', value ? value.classificationid : '')
        setValue('path2', value ? value.path : '')
    }

    const onSubmit = handleSubmit((data) => {
        dispatch(showBackdrop(true));
        dispatch(execute(insertClassificationConversation(ticketSelected?.conversationid!!, data.classificationid3 || data.classificationid2 || data.classificationid1, '', 'INSERT')))
        setWaitTipify(true)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.tipify_ticket)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={`${t(langKeys.tipification)} ${t(langKeys.level)} 1`}
                    className="col-12"
                    valueDefault={getValues('classificationid1')}
                    onChange={onChangeTipificationLevel1}
                    error={errors?.classificationid1?.message}
                    data={multiData?.data[2] && multiData?.data[2].data.filter(obj => {
                        const channelsobj = obj.communicationchannel.includes("WHA") ? obj.communicationchannel + ",WHAC,WHAD" : obj.communicationchannel
                        const channelsInMultiData = `${channelsobj}`.split(',').map((channel: string) => channel.trim());
                        return channelsInMultiData.includes(`${ticketSelected?.communicationchanneltype}`);
                    })}
                    optionDesc="path"
                    optionValue="classificationid"
                />
                <FieldSelect
                    label={`${t(langKeys.tipification)} ${t(langKeys.level)} 2`}
                    className="col-12"
                    valueDefault={getValues('classificationid2')}
                    onChange={onChangeTipificationLevel2}
                    loading={tipificationLevel2.loading}
                    error={errors?.classificationid2?.message}
                    data={tipificationLevel2.data}
                    optionDesc="path"
                    optionValue="classificationid"
                />
                <FieldSelect
                    label={`${t(langKeys.tipification)} ${t(langKeys.level)} 3`}
                    className="col-12"
                    valueDefault={getValues('classificationid3')}
                    onChange={onChangeTipificationLevel3}
                    loading={tipificationLevel3.loading}
                    error={errors?.classificationid3?.message}
                    data={tipificationLevel3.data}
                    optionDesc="path"
                    optionValue="classificationid"
                />
            </div>
        </DialogZyx>)
}

const ButtonsManageTicket: React.FC<{ classes: any; setShowSearcher: (param: any) => void }> = ({ classes, setShowSearcher }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const hideLogs = useSelector(state => state.inbox.hideLogsOnTicket);
    const [openModalCloseticket, setOpenModalCloseticket] = useState(false);
    const [openModalReassignticket, setOpenModalReassignticket] = useState(false);
    const [openModalTipification, setOpenModalTipification] = useState(false);
    const [typeStatus, setTypeStatus] = useState('');
    const [openModalLead, setOpenModalLead] = useState(false);
    const voxiConnection = useSelector(state => state.voximplant.connection);
    const [openModalHSM, setOpenModalHSM] = useState(false);
    const multiData = useSelector(state => state.main.multiData);
    const person = useSelector(state => state.inbox.person);
    const [checkTipification, setCheckTipification] = useState(false);
    const [propertyAsesorSuspende, setpropertyAsesorSuspende] = useState(true);
    const [propertyAsesorReassign, setPropertyAsesorReassign] = useState(true);
    const [propertyGrupoDelegacion, setPropertyGrupoDelegacion] = useState(true);
    const mainAux2 = useSelector(state => state.main.mainAux2);
    const location = useLocation();
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const user = useSelector(state => state.login.validateToken.user);
    const userConnected = useSelector(state => state.inbox.userConnected);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const closeTicket = (newstatus: string) => {
        if (newstatus === "CERRADO") {
            let tipificationproperty = (multiData?.data?.[12]?.data || [{ propertyvalue: "0" }])[0];
            if (tipificationproperty?.propertyvalue === "1") {
                setCheckTipification(true);
                dispatch(getCollectionAux2(getConversationClassification2(ticketSelected?.conversationid!!)))
            }
            else {
                setOpenModalCloseticket(true);
                setTypeStatus(newstatus);
            }
        } else {
            setOpenModalCloseticket(true);
            setTypeStatus(newstatus);
        }
    };

    const handlerShowLogs = (e: any) => {
        dispatch(hideLogInteractions(e.target.checked))
    }

    useEffect(() => {
        const dataasesorsuspende = multiData?.data?.find(x => x.key === "UFN_PROPERTY_SELBYNAMEASESORSUSPENDE")?.data;
        const reassignAsesor = multiData?.data?.find(x => x.key === "UFN_PROPERTY_SELBYNAMEASESORDELEGACION")?.data;
        setPropertyGrupoDelegacion(user?.roledesc?.includes("ASESOR") ? multiData?.data?.find(x => x.key === "UFN_PROPERTY_SELBYNAMEGRUPODELEGACION")?.data?.[0]?.propertyvalue === "1" : true)
        if (dataasesorsuspende && reassignAsesor && multiData) {
            if (user?.roledesc?.includes("ASESOR")) {
                if (user?.groups) {
                    const usergroups = user?.groups?.split(",") || [];
                    setpropertyAsesorSuspende(usergroups.reduce((acc, x) => acc * dataasesorsuspende?.find(y => y.group === x)?.propertyvalue, 1) === 1);
                }
                setPropertyAsesorReassign(reassignAsesor?.[0]?.propertyvalue === "1")
            } else if (`,${user?.roledesc},`.includes(",SUPERVISOR,") && user?.properties.environment === "CLARO" && [2, 3].includes(agentSelected?.userid ?? 0)) { //2 y 3 son BOT y HOLDING
                setPropertyAsesorReassign(false);
            }
        }
    }, [multiData, agentSelected])
    useEffect(() => {
        if (checkTipification) {
            if (!mainAux2.loading) {
                if (mainAux2.data?.length > 0) {
                    setCheckTipification(true);
                    setOpenModalCloseticket(true);
                    setTypeStatus("CERRADO");
                }
                else {
                    setCheckTipification(false);
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.tipify_ticket) }))
                }
            }
        }
    }, [mainAux2])

    useEffect(() => {
        // console.log(multiDataAux?.data?.find(x=>x.key==="UFN_ASSIGNMENTRULE_BY_GROUP_SEL"))
        // console.log(!!multiDataAux?.data?.find(x=>x.key==="UFN_ASSIGNMENTRULE_BY_GROUP_SEL")?.data?.length)
    }, [multiDataAux])

    return (
        <>
            <div className={classes.containerButtonsChat} style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                {(!voxiConnection.error && userConnected && ticketSelected?.communicationchanneltype !== "VOXI" && location.pathname === "/message_inbox") &&
                    <Tooltip title={t(langKeys.make_call)} arrow placement="top">
                        <IconButton onClick={() => voxiConnection.error ? dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.nochannelvoiceassociated) })) : dispatch(setModalCall(true))}>
                            <PhoneIcon width={24} height={24} fill="#8F92A1" />
                        </IconButton>
                    </Tooltip>
                }
                <Tooltip title={t(hideLogs ? langKeys.hide_logs : langKeys.show_logs) || ""} arrow placement="top">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IOSSwitch checked={hideLogs} onChange={handlerShowLogs} name="checkedB" />
                    </div>
                </Tooltip>
                <Tooltip title={t(langKeys.search_ticket)} arrow placement="top">
                    <IconButton onClick={() => setShowSearcher(true)}>
                        <SearchIcon width={24} height={24} fill="#8F92A1" />
                    </IconButton>
                </Tooltip>
                {(ticketSelected?.status !== 'CERRADO' && ticketSelected?.communicationchanneltype !== "VOXI") &&
                    <Tooltip title={t(langKeys.close_ticket)} arrow placement="top">
                        <IconButton onClick={() => closeTicket("CERRADO")}>
                            <CloseTicketIcon width={24} height={24} fill={person.data?.haveclassification ? "#b41a1a" : "#8F92A1"} />
                        </IconButton>
                    </Tooltip>
                }
                {(propertyAsesorSuspende && (ticketSelected?.status === 'SUSPENDIDO' && ticketSelected?.communicationchanneltype !== "VOXI")) &&
                    <Tooltip title={t(langKeys.activate_ticket)} arrow placement="top">
                        <IconButton onClick={() => closeTicket("ASIGNADO")}>
                            <PlayArrowIcon width={24} height={24} fill="#8F92A1" />
                        </IconButton>
                    </Tooltip>
                }
                {(propertyAsesorSuspende && (ticketSelected?.status === 'ASIGNADO' && ticketSelected?.communicationchanneltype !== "VOXI")) &&
                    <Tooltip title={t(langKeys.suspend_ticket)} arrow placement="top">
                        <IconButton onClick={() => closeTicket("SUSPENDIDO")}>
                            <PauseIcon width={24} height={24} fill="#8F92A1" />
                        </IconButton>
                    </Tooltip>
                }
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size='small' style={{ height: 30 }}>
                    <MoreVertIcon />
                </IconButton>
            </div>
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
                onClose={handleClose}
            >
                {(
                    ticketSelected?.status !== 'CERRADO' &&
                    ticketSelected?.communicationchanneltype !== "VOXI" &&
                    (propertyAsesorReassign || propertyGrupoDelegacion || (!propertyAsesorReassign && !propertyGrupoDelegacion && !!multiDataAux?.data?.find(x => x.key === "UFN_ASSIGNMENTRULE_BY_GROUP_SEL")?.data?.length))
                ) &&
                    <MenuItem onClick={() => {
                        setOpenModalReassignticket(true)
                        setAnchorEl(null)
                    }}>
                        <ListItemIcon color="inherit">
                            <ReassignIcon width={18} style={{ fill: '#2E2C34' }} />
                        </ListItemIcon>
                        {t(langKeys.reassign)}
                    </MenuItem>
                }
                {ticketSelected?.status !== 'CERRADO' &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null)
                        setOpenModalTipification(true)
                    }}>
                        <ListItemIcon>
                            <TipifyIcon width={18} style={{ fill: '#2E2C34' }} />
                        </ListItemIcon>
                        {t(langKeys.typify)}
                    </MenuItem>
                }
                {(ticketSelected?.communicationchanneltype?.includes('WHA') || multiData?.data?.[13]?.data?.filter(e => e.type.includes("WHA")).length > 0) &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null)
                        setOpenModalHSM(true)
                    }}>
                        <ListItemIcon>
                            <HSMIcon width={18} style={{ fill: '#2E2C34' }} />
                        </ListItemIcon>
                        {t(langKeys.send_hsm)}
                    </MenuItem>
                }
                {ticketSelected?.status !== 'CERRADO' &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null)
                        setOpenModalLead(true)
                    }}>
                        <ListItemIcon>
                            <LeadIcon width={18} style={{ fill: '#2E2C34' }} />
                        </ListItemIcon>
                        {t(langKeys.lead)}
                    </MenuItem>
                }
            </Menu>
            <DialogCloseticket
                openModal={openModalCloseticket}
                setOpenModal={setOpenModalCloseticket}
                status={typeStatus}
            />
            <DialogReassignticket
                openModal={openModalReassignticket}
                setOpenModal={setOpenModalReassignticket}
                propertyAsesorReassign={user?.roledesc?.includes("ASESOR") ? propertyAsesorReassign : true}
                propertyGrupoDelegacion={user?.roledesc?.includes("ASESOR") ? ((!propertyAsesorReassign && !propertyGrupoDelegacion) ? true : propertyGrupoDelegacion) : true}
            />
            <DialogSendHSM
                openModal={openModalHSM}
                setOpenModal={setOpenModalHSM}
            />
            <DialogTipifications
                openModal={openModalTipification}
                setOpenModal={setOpenModalTipification}
            />
            <DialogLead
                openModal={openModalLead}
                setOpenModal={setOpenModalLead}
            />
        </>
    )
}

const TicketTags: React.FC<{ classes: any; tags: string }> = ({ classes, tags }) => {
    const { t } = useTranslation();
    const classes2 = useStyles();
    const [scrollPosition, setScrollPosition] = useState(0);
    const tagsWrapperRef = useRef<{ scrollWidth: number; scrollLeft: number; clientWidth: number }>(null);
    const [atEnd, setAtEnd] = useState(false);
    const uniqueTags = !!tags.length ? tags.split(",").filter((word, index, array) => word !== array[index - 1]) : [];

    useEffect(() => {
        const handleResize = () => {
            if (tagsWrapperRef.current) {
                const isOverflowing = tagsWrapperRef?.current?.scrollWidth > tagsWrapperRef?.current?.clientWidth;
                if (!isOverflowing) {
                    setScrollPosition(0);
                    tagsWrapperRef.current.scrollLeft = 0;
                } else {
                    setAtEnd(tagsWrapperRef.current.scrollLeft + tagsWrapperRef.current.clientWidth >= tagsWrapperRef.current.scrollWidth);
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [uniqueTags]);

    const handleScroll = (direction: string) => {
        const scrollAmount = 100; // Ajusta esta cantidad según tus necesidades
        const newPosition = direction === 'left'
            ? scrollPosition - scrollAmount
            : scrollPosition + scrollAmount;
        setScrollPosition(newPosition);
        tagsWrapperRef.current.scrollLeft = newPosition;

        const atEndPosition = newPosition + tagsWrapperRef.current.clientWidth >= tagsWrapperRef.current.scrollWidth;

        setAtEnd(atEndPosition);
    };

    useEffect(() => {
        if (tagsWrapperRef.current) {
            setAtEnd(scrollPosition + tagsWrapperRef.current.clientWidth >= tagsWrapperRef.current.scrollWidth);
        }
    }, [scrollPosition]);


    if (uniqueTags.length) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", maxWidth: "25vw", borderLeft: "1px solid lightgrey", flex: 11 }}>
                <div style={{ zIndex: 99, margin: 0, marginBottom: 0, padding: "4px 0px", width: "100%" }}>
                    <div style={{ zIndex: 999, width: "100%", height: "100%", padding: "0 4px", boxSizing: "border-box" }}>
                        <div style={{ paddingLeft: 4 }}>
                            Tags
                            <Tooltip title={<div style={{ fontSize: 12, zIndex: 9999, }}>{t(langKeys.tagshelper)}</div>} arrow placement="top">
                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                            </Tooltip>
                        </div>
                        <div className={classes2.container} >
                            <IconButton size='small' disabled={!(scrollPosition > 0)} className={`${classes2.arrowLeft}`} onClick={() => handleScroll('left')} style={{ padding: 0 }}>
                                <KeyboardArrowLeft fontSize='small' />
                            </IconButton>
                            <div className={classes2.tagsWrapper} ref={tagsWrapperRef} >
                                {uniqueTags.map((tag, index) => (
                                    <span key={index} className={classes2.tag}>{tag}</span>
                                ))}
                            </div>
                            <IconButton disabled={atEnd} size='small' className={`${classes2.arrowRight}`} onClick={() => handleScroll('right')} style={{ padding: 0 }}>
                                <KeyboardArrowRight />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <div style={{ flex: 0 }}></div>
    }
}


const typeText = ["text", "post-text", "reply-text", "quickreply", "carousel", "email"]

const applySearch = (list: Dictionary[], index: number) => {
    const inthtml = document.getElementById(`interaction-${list[index].interactionid}`)
    if (inthtml) {
        inthtml.scrollIntoView({ block: "center" });
        inthtml.classList.add('item-result-searcher');
        setTimeout(() => {
            inthtml.classList.remove('item-result-searcher');
        }, 500);
    }
}

const SearchOnInteraction: React.FC<{ setShowSearcher: (param: any) => void }> = ({ setShowSearcher }) => {
    const [value, setvalue] = useState('');
    const timeOut = React.useRef<NodeJS.Timeout | null>(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const interactionList = useSelector(state => state.inbox.interactionBaseList);
    const [indexSearch, setIndexSearch] = useState(0);
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [listFound, setListFound] = useState<Dictionary[]>([]);

    const handleChange = (e: any) => {
        const text = e.target.value.toLocaleLowerCase().trim();
        if (text) {
            const inttfound = interactionList.filter(x => x.interactiontext.toLocaleLowerCase().includes(text) && typeText.includes(x.interactiontype))
            setListFound(inttfound);

            if (inttfound.length > 0) {
                setIndexSearch(0);
                setTriggerSearch(!triggerSearch);
            }
        } else {
            setListFound([]);
        }
    }

    useEffect(() => {
        if (listFound.length > 0) {
            applySearch(listFound, indexSearch);
        }
    }, [triggerSearch])
    useEffect(() => {
        setvalue("");
        dispatch(setSearchTerm(""))
        setListFound([])
    }, [interactionList])

    const handlerManageFilter = (type: string) => {
        if (type === "down") {
            const neworden = indexSearch - 1 < 0 ? listFound.length - 1 : indexSearch - 1;
            setIndexSearch(neworden);
        } else {
            const neworden = indexSearch + 1 > listFound.length - 1 ? 0 : indexSearch + 1;
            setIndexSearch(neworden);
        }
        setTriggerSearch(!triggerSearch);
    }

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setvalue(event.target.value);
        dispatch(setSearchTerm(event.target.value))

        if (timeOut.current) clearTimeout(timeOut.current);

        timeOut.current = setTimeout(() => {
            handleChange(event);
            if (timeOut.current) {
                clearTimeout(timeOut.current);
                timeOut.current = null;
            }
        }, 300);
    };

    return (
        <div style={{ backgroundColor: 'white', border: '1px solid #e1e1e1', borderRadius: 16, paddingLeft: 4, paddingRight: 4, display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={() => {
                setShowSearcher(false)
                dispatch(setSearchTerm(""))
            }}>
                <CloseIcon style={{ color: '#8F92A1' }} />
            </IconButton>
            <InputBase
                color="primary"
                fullWidth
                autoFocus
                value={value}
                onChange={onChange}
                placeholder={t(langKeys.search)}
                style={{ marginTop: 2, marginBottom: 2 }}
            />
            <div style={{ display: 'inline', color: '#8F92A1' }}>
                {!!listFound.length ? indexSearch + 1 : 0}/{listFound.length}
            </div>
            <IconButton size="small" onClick={() => handlerManageFilter('up')}>
                <KeyboardArrowDownIcon style={{ color: '#8F92A1' }} />
            </IconButton>
            <IconButton size="small" onClick={() => handlerManageFilter('down')}>
                <KeyboardArrowUpIcon style={{ color: '#8F92A1' }} />
            </IconButton>

        </div>
    )
}

const PinnedMessageMenu: React.FC<{ classes: any }> = ({ classes }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [selectedComment, setSelectedComment] = useState(0);
    const pinnedmessagesSelected = useSelector(state => state.inbox.pinnedmessages);
    const [showFullText, setShowFullText] = useState(false);
    const interactionText = pinnedmessagesSelected[selectedComment].interactiontext;

    const handleTextClick = () => {
        setShowFullText(!showFullText);
    };

    const handlerManagePinnedComment = (type: string) => {
        if (type === "down") {
            setSelectedComment(selectedComment - 1);
        } else {
            setSelectedComment(selectedComment + 1);
        }
    }
    function deleteTack() {
        let meesage = pinnedmessagesSelected[selectedComment]
        dispatch(execute(modifyPinnedMessage({
            interactionid: meesage.interactionid,
            conversationid: ticketSelected?.conversationid || 0,
            interactiontext: meesage.interactiontext,
            operation: "DELETE"
        })))
        const pinncomment = [...pinnedmessagesSelected.slice(0, selectedComment), ...pinnedmessagesSelected.slice(selectedComment + 1)]
        if (selectedComment === pinncomment.length) {
            setSelectedComment(selectedComment - 1)
        }
        dispatch(setPinnedComments(pinncomment))
    }

    function gotomessage() {
        const inthtml = document.getElementById(`interaction-${pinnedmessagesSelected[selectedComment].interactionid}`)
        if (inthtml) {
            inthtml.scrollIntoView({ block: "center" });
            inthtml.classList.add('item-result-searcher');
            setTimeout(() => {
                inthtml.classList.remove('item-result-searcher');
            }, 500);
        }
    }

    return (
        <div style={{ backgroundColor: "white", display: "grid", alignItems: "center", position: "relative", gridTemplateColumns: "40px auto 100px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
                <Tooltip title={t(langKeys.increase)} arrow placement="top">
                    <IconButton size="small" style={{ padding: 0, marginTop: 0 }} onClick={() => handlerManagePinnedComment('up')} disabled={pinnedmessagesSelected.length - 1 === selectedComment}>
                        <ExpandLess />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t(langKeys.decrease)} arrow placement="top">
                    <IconButton size="small" style={{ padding: 0, marginBottom: 0 }} onClick={() => handlerManagePinnedComment('down')} disabled={selectedComment === 0}>
                        <ExpandMore />
                    </IconButton>
                </Tooltip>
            </div>
            <div
                style={{
                    flex: 1, height: "100%", display: "flex", alignItems: "center", gap: 8,
                    fontSize: 16,
                    borderRight: "1px lightgrey solid", cursor: 'pointer', whiteSpace: showFullText ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}
                onClick={handleTextClick}
                title={showFullText ? '' : (interactionText.length > 100 ? interactionText : '')}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: 4, borderRadius: 4 }}>
                    <TackIcon fill="#8F92A1" width={20} height={20} />
                </div>
                <div style={{ width: "100%" }}>
                    {interactionText.length > 100 && !showFullText ? interactionText.substring(0, 100) + '...' : interactionText}
                </div>
            </div>
            <div style={{
                display: "flex",
                gap: 4,
                justifySelf: 'center'
            }}>
                <Tooltip title={t(langKeys.delete)} arrow placement="top">
                    <IconButton size="small" onClick={deleteTack}>
                        <DeleteForeverIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t(langKeys.gotomessage)} arrow placement="top">
                    <IconButton size="small" onClick={gotomessage} >
                        <ReplyIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}
const HeadChat: React.FC<{ classes: any }> = ({ classes }) => {
    const dispatch = useDispatch();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const person = useSelector(state => state.inbox.person);
    const [showSearcher, setShowSearcher] = useState(false);
    const showInfoPanelTrigger = () => dispatch(showInfoPanel())
    const { t } = useTranslation();

    const pinnedmessagesSelected = useSelector(state => state.inbox.pinnedmessages);

    return (
        <div style={{ position: 'relative' }}>
            <div onClick={showInfoPanelTrigger} style={{ cursor: 'pointer', height: '100%', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></div>
            <div className={classes.headChat + " row-zyx"} style={{ justifyContent: "space-between", zIndex: 1, marginBottom: 0, display: "flex", gap: 1, padding: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 0, padding: "0 8px", flex: 10 }}>
                    <Avatar src={ticketSelected!!.imageurldef || ""} />
                    <div className={classes.titleTicketChat}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {person?.havelead && <StarIcon fontSize="small" style={{ color: '#ffb400' }} />}
                            {ticketSelected!!.displayname}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 400 }}>
                            Ticket {ticketSelected!!.ticketnum}
                            <Tooltip style={{ padding: 0, paddingLeft: 5 }} title={t(langKeys.copyticketnum) + ""} arrow placement="top">
                                <IconButton onClick={() => {
                                    navigator.clipboard.writeText(ticketSelected!!.ticketnum)
                                }}>
                                    <FileCopyIcon style={{ width: 15, height: 15 }} fill="#8F92A1" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                {!person.loading &&
                    <TicketTags classes={classes} tags={person?.data?.tags || ""} />
                }
                <div style={{ marginBottom: 0, borderLeft: person?.data?.tags?.length ? "1px solid lightgrey" : 0, padding: "0 12px", flex: 1, alignItems: "center", justifyContent: "center", display: "flex" }}>
                    <ButtonsManageTicket classes={classes} setShowSearcher={setShowSearcher} />
                </div>
            </div>
            {showSearcher &&
                <div style={{ zIndex: 9999, right: 16, padding: 8 }}>
                    <SearchOnInteraction setShowSearcher={setShowSearcher} />
                </div>
            }
            {!!pinnedmessagesSelected.length && <PinnedMessageMenu classes={classes} />}
        </div>
    )
}

const ChatPanel: React.FC<{ classes: any }> = React.memo(({ classes }) => {
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);

    return (
        <div className={classes.containerChat}>
            <HeadChat
                classes={classes}
            />
            <InteractionsPanel
                classes={classes}
            />
            {(ticketSelected?.communicationchanneltype !== "VOXI") && (
                <ReplyPanel
                    classes={classes} />
            )}
        </div>
    )
})

export default ChatPanel;