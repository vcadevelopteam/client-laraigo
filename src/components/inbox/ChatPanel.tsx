/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { ICloseTicketsParams, Dictionary, IReassignicketParams, ILead } from "@types";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CloseTicketIcon, HSMIcon, TipifyIcon, ReassignIcon, LeadIcon } from 'icons';
import Tooltip from '@material-ui/core/Tooltip';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getTipificationLevel2, resetGetTipificationLevel2, resetGetTipificationLevel3, getTipificationLevel3, showInfoPanel, closeTicket, reassignTicket, emitEvent, sendHSM, updatePerson } from 'store/inbox/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { insertClassificationConversation, insLeadPerson } from 'common/helpers';
import { execute } from 'store/main/actions';
import { ReplyPanel, InteractionsPanel, DialogZyx, FieldSelect, FieldEdit, FieldEditArray, FieldEditMulti, FieldView } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Rating from '@material-ui/lab/Rating';
import { Box } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import StarIcon from '@material-ui/icons/Star';

const dataPriority = [
    { option: 'HIGH' },
    { option: 'LOW' },
    { option: 'MEDIUM' },
    { option: 'HIGH' },
]

const DialogSendHSM: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean }> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const multiData = useSelector(state => state.main.multiData);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const person = useSelector(state => state.inbox.person);
    const sendingRes = useSelector(state => state.inbox.triggerSendHSM);
    const [templatesList, setTemplatesList] = useState<Dictionary[]>([]);
    const [bodyMessage, setBodyMessage] = useState('');
    const [bodyCleaned, setBodyCleaned] = useState('');

    const { control, register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<any>({
        defaultValues: {
            hsmtemplateid: 0,
            observation: '',
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
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_send_hsm) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));

                const newInteractionSocket = {
                    ...ticketSelected!!,
                    interactionid: 0,
                    typemessage: "text",
                    typeinteraction: null,
                    lastmessage: bodyCleaned,
                    createdate: new Date().toISOString(),
                    userid: 0,
                    usertype: "agent",
                    ticketWasAnswered: !ticketSelected!!.isAnswered,
                }
                dispatch(emitEvent({
                    event: 'newMessageFromAgent',
                    data: newInteractionSocket
                }));

                setWaitClose(false);
            } else if (sendingRes.error) {

                dispatch(showSnackbar({ show: true, success: false, message: t(sendingRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitClose(false);
            }
        }
    }, [sendingRes, waitClose])

    useEffect(() => {
        setTemplatesList(multiData?.data[5] && multiData?.data[5].data.filter(x => x.type === "HSM"))
    }, [])

    useEffect(() => {
        if (openModal) {
            setBodyMessage('')
            reset({
                hsmtemplateid: 0,
                variables: []
            })
            register('hsmtemplateid', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
        }
    }, [openModal])

    const onSelectTemplate = (value: Dictionary) => {
        if (value) {

            setBodyMessage(value.body);
            setValue('hsmtemplateid', value ? value.id : 0);

            const wordList = value.body?.split(/[\s,.;()!?¡]+/);
            setBodyCleaned(value.body);
            const variablesList = wordList.filter((x: string) => x.substring(0, 2) === "{{" && x.substring(x.length - 2) === "}}")
            const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))

            setValue('variables', varaiblesCleaned.map((x: string) => ({ name: x, text: '', type: 'text' })));
        } else {
            setValue('variables', []);
            setBodyMessage('');
            setValue('hsmtemplateid', 0);
        }
    }

    const onSubmit = handleSubmit((data) => {
        setBodyCleaned(body => {
            data.variables.forEach((x: Dictionary) => {
                body = body.replace(`{{${x.name}}}`, x.text)
            })
            return body
        })
        const bb = {
            hsmtemplateid: data.hsmtemplateid,
            communicationchannelid: ticketSelected?.communicationchannelid!!,
            platformtype: ticketSelected?.communicationchannelsite!!,
            communicationchanneltype: ticketSelected?.communicationchanneltype!!,
            listmembers: [{
                phone: person.data?.phone!! + "",
                firstname: person.data?.firstname + "",
                lastname: person.data?.lastname + "",
                parameters: data.variables
            }]
        }
        dispatch(sendHSM(bb))
        dispatch(showBackdrop(true));
        setWaitClose(true)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.send_hsm)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
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
            <FieldView
                label={t(langKeys.message)}
                value={bodyMessage}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {fields.map((item: Dictionary, i) => (
                    <FieldEditArray
                        key={item.id}
                        label={item.name}
                        fregister={{
                            ...register(`variables.${i}.text`, {
                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                            })
                        }}
                        valueDefault={item.value}
                        error={errors?.variables?.[i]?.text?.message}
                        onChange={(value) => setValue(`variables.${i}.text`, "" + value)}
                    />
                ))}
            </div>
        </DialogZyx>)
}

const DialogCloseticket: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean }> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const multiData = useSelector(state => state.main.multiData);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const userType = useSelector(state => state.inbox.userType);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const closingRes = useSelector(state => state.inbox.triggerCloseTicket);
    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (waitClose) {
            if (!closingRes.loading && !closingRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_close_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                dispatch(emitEvent({
                    event: 'deleteTicket',
                    data: {
                        conversationid: ticketSelected?.conversationid,
                        ticketnum: ticketSelected?.ticketnum,
                        status: ticketSelected?.status,
                        isanswered: ticketSelected?.isAnswered,
                        userid: userType === "AGENT" ? 0 : agentSelected?.userid,
                        getToken: userType === "SUPERVISOR"
                    }
                }));
                setWaitClose(false);
            } else if (closingRes.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(closingRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitClose(false);
            }
        }
    }, [closingRes, waitClose])

    useEffect(() => {
        if (openModal) {
            reset({
                motive: '',
                observation: ''
            })
            register('motive', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
            register('observation');
        }
    }, [openModal])

    const onSubmit = handleSubmit((data) => {
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
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.close_ticket)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.closing_reason)}
                    className="col-12"
                    valueDefault={getValues('motive')}
                    onChange={(value) => setValue('motive', value ? value.domainvalue : '')}
                    error={errors?.motive?.message}
                    data={multiData?.data[0] && multiData?.data[0].data}
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

const DialogReassignticket: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean }> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitReassign, setWaitReassign] = useState(false);

    const [agentsConnected, setAgentsConnected] = useState<Dictionary[]>([]);
    const multiData = useSelector(state => state.main.multiData);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const userType = useSelector(state => state.inbox.userType);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const reassigningRes = useSelector(state => state.inbox.triggerReassignTicket);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<{
        newUserId: number;
        newUserGroup: string;
        observation: string;
        token: string;
    }>();

    useEffect(() => {
        if (waitReassign) {
            if (!reassigningRes.loading && !reassigningRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_reasign_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitReassign(false);

                dispatch(emitEvent({
                    event: 'reassignTicket',
                    data: {
                        ...ticketSelected,
                        userid: userType === "AGENT" ? 0 : agentSelected?.userid,
                        newuserid: getValues('newUserId') || 3,
                    }
                }));

            } else if (reassigningRes.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.error_unexpected_error) }))
                dispatch(showBackdrop(false));
                setWaitReassign(false);
            }
        }
    }, [reassigningRes, waitReassign])

    useEffect(() => {
        if (multiData?.data[1])
            setAgentsConnected(multiData?.data[1].data)
    }, [multiData])

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
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.least_user_or_group) }))
            return;
        }
        const dd: IReassignicketParams = {
            ...ticketSelected!!,
            ...data,
            newUserId: data.newUserId || 3,
            newConversation: true,
            wasanswered: true
        }
        dispatch(reassignTicket(dd));
        dispatch(showBackdrop(true));
        setWaitReassign(true)

    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.reassign_ticket)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.user_plural)}
                    className="col-12"
                    valueDefault={"" + getValues('newUserId')}
                    onChange={(value) => setValue('newUserId', value ? value.userid : 0)}
                    error={errors?.newUserId?.message}
                    data={agentsConnected}
                    optionDesc="displayname"
                    optionValue="userid"
                />
                <FieldSelect
                    label={t(langKeys.group_plural)}
                    className="col-12"
                    valueDefault={getValues('newUserGroup')}
                    onChange={(value) => setValue('newUserGroup', value ? value.domainvalue : '')}
                    error={errors?.newUserGroup?.message}
                    data={multiData?.data[3] && multiData?.data[3].data}
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

const DialogLead: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean }> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitInsLead, setWaitInsLead] = useState(false);

    const insLeadRes = useSelector(state => state.main.execute);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const user = useSelector(state => state.login.validateToken.user);
    const personSelected = useSelector(state => state.inbox.person.data);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<{
        description: string;
        expected_revenue: string;
        priority: number;
        lastname: string;
        firstname: string;
        email: string;
        phone: string;
    }>();

    useEffect(() => {
        if (waitInsLead) {
            if (!insLeadRes.loading && !insLeadRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_register) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitInsLead(false);
                dispatch(updatePerson({ ...personSelected!!, havelead: true }));
            } else if (insLeadRes.error) {
                const message = t(insLeadRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message }))
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
            })
            register('description', { validate: (value) => ((value && value.length) ? true : t(langKeys.field_required) + "") });
            register('expected_revenue', { validate: (value) => ((value && value.length) ? true : t(langKeys.field_required) + "") });
            register('priority', { validate: (value) => ((value && value > 0) ? true : t(langKeys.field_required) + "") });

            register('lastname');
            register('firstname', { validate: (value) => ((value && value.length) ? true : t(langKeys.field_required) + "") });
            register('email', { validate: (value) => ((value && value.length) ? true : t(langKeys.field_required) + "") });
            register('phone', { validate: (value) => ((value && value.length) ? true : t(langKeys.field_required) + "") });
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
            tags: '',
            personcommunicationchannel: ticketSelected?.personcommunicationchannel!!,
            priority: dataPriority[data.priority].option,
            conversationid: ticketSelected?.conversationid!!,
            columnid: 0,
            index: 0,
            userid: user?.userid || 0,
        }

        const { firstname = "", lastname = "", email = "", phone = "" } = data;
        dispatch(showBackdrop(true));
        dispatch(execute(insLeadPerson(newLead, firstname, lastname, email, phone, personSelected?.personid!!)))
        setWaitInsLead(true)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.newlead)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
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
                    <FieldEdit
                        label={t(langKeys.phone)}
                        valueDefault={getValues('phone')}
                        className="flex-1"
                        error={errors?.phone?.message}
                        onChange={(value) => setValue('phone', value)}
                    />
                </div>
                <FieldEdit
                    label={t(langKeys.description)}
                    valueDefault={getValues('description')}
                    error={errors?.description?.message}
                    onChange={(value) => setValue('description', value)}
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
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_tipify_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitTipify(false);
            } else if (tipifyRes.error) {
                const message = t(tipifyRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })

                dispatch(showSnackbar({ show: true, success: false, message }))
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
            register('classificationid2', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            register('path3');
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
        dispatch(execute(insertClassificationConversation(ticketSelected?.conversationid!!, data.classificationid3 || data.classificationid2, '', 'INSERT')))
        setWaitTipify(true)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.tipify_ticket)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
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
                    data={multiData?.data[2] && multiData?.data[2].data}
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

const ButtonsManageTicket: React.FC<{ classes: any }> = ({ classes }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { t } = useTranslation();
    const handleClose = () => setAnchorEl(null);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [openModalCloseticket, setOpenModalCloseticket] = useState(false);
    const [openModalReassignticket, setOpenModalReassignticket] = useState(false);
    const [openModalTipification, setOpenModalTipification] = useState(false);
    const [openModalLead, setOpenModalLead] = useState(false);
    const [openModalHSM, setOpenModalHSM] = useState(false);
    const closeTicket = () => setOpenModalCloseticket(true);

    return (
        <>
            <div className={classes.containerButtonsChat}>
                {ticketSelected?.status !== 'CERRADO' &&
                    <Tooltip title={t(langKeys.close_ticket) + ""} arrow placement="top">
                        <IconButton onClick={closeTicket}>
                            <CloseTicketIcon width={24} height={24} fill="#8F92A1" />
                        </IconButton>
                    </Tooltip>
                }
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
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
                {ticketSelected?.status !== 'CERRADO' &&
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
                {ticketSelected?.communicationchanneltype.includes('WHA') &&
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
            />
            <DialogReassignticket
                openModal={openModalReassignticket}
                setOpenModal={setOpenModalReassignticket}
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

const HeadChat: React.FC<{ classes: any }> = ({ classes }) => {
    const dispatch = useDispatch();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const person = useSelector(state => state.inbox.person.data);

    const showInfoPanelTrigger = () => dispatch(showInfoPanel())

    return (
        <div style={{ position: 'relative' }}>
            <div onClick={showInfoPanelTrigger} style={{ cursor: 'pointer', width: '100%', height: '100%', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></div>
            <div className={classes.headChat}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Avatar src={ticketSelected!!.imageurldef || ""} />
                    <div className={classes.titleTicketChat}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {person?.havelead && <StarIcon fontSize="small" style={{ color: '#ffb400' }} />}
                            {ticketSelected!!.displayname}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 400 }}>
                            Ticket #{ticketSelected!!.ticketnum}
                        </div>
                    </div>
                </div>
                <ButtonsManageTicket classes={classes} />
            </div>
        </div>
    )
}

const ChatPanel: React.FC<{ classes: any }> = React.memo(({ classes }) => (
    <div className={classes.containerChat}>
        <HeadChat
            classes={classes}
        />
        <InteractionsPanel
            classes={classes}
        />
        <ReplyPanel
            classes={classes} />
    </div>
))

export default ChatPanel;