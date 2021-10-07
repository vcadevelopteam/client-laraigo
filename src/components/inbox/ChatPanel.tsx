/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { ITicket, ICloseTicketsParams, Dictionary, IReassignicketParams } from "@types";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CloseTicketIcon } from 'icons';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getTipificationLevel2, resetGetTipificationLevel2, resetGetTipificationLevel3, getTipificationLevel3, showInfoPanel, closeTicket, reassignTicket, emitEvent } from 'store/inbox/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { insertClassificationConversation } from 'common/helpers';
import { execute } from 'store/main/actions';
import { ReplyPanel, InteractionsPanel, DialogZyx, FieldSelect, FieldEditMulti } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

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
                    }
                }));
                setWaitClose(false);
            } else if (closingRes.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.error_unexpected_error) }))
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
                observation: ''
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
    const [openModalCloseticket, setOpenModalCloseticket] = useState(false);
    const [openModalReassignticket, setOpenModalReassignticket] = useState(false);
    const [openModalTipification, setOpenModalTipification] = useState(false);
    const [openModalHSM, setOpenModalHSM] = useState(false);
    const closeTicket = () => setOpenModalCloseticket(true);

    return (
        <>
            <div className={classes.containerButtonsChat}>
                <IconButton onClick={closeTicket}>
                    <CloseTicketIcon width={24} height={24} fill="#8F92A1" />
                </IconButton>
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
                <MenuItem onClick={() => {
                    setOpenModalReassignticket(true)
                    setAnchorEl(null)
                }}>{t(langKeys.reassign)}</MenuItem>
                <MenuItem onClick={() => {
                    setAnchorEl(null)
                    setOpenModalTipification(true)
                }}>{t(langKeys.typify)}</MenuItem>
                <MenuItem onClick={() => {
                    setAnchorEl(null)
                    setOpenModalHSM(true)
                }}>{t(langKeys.send_hsm)}</MenuItem>
            </Menu>
            <DialogCloseticket
                openModal={openModalCloseticket}
                setOpenModal={setOpenModalCloseticket}
            />
            <DialogReassignticket
                openModal={openModalReassignticket}
                setOpenModal={setOpenModalReassignticket}
            />
            <DialogTipifications openModal={openModalTipification} setOpenModal={setOpenModalTipification} />
        </>
    )
}


const HeadChat: React.FC<{ classes: any, ticket: ITicket }> = ({ classes, ticket, ticket: { ticketnum, displayname, imageurldef } }) => {
    const dispatch = useDispatch();

    const showInfoPanelTrigger = () => dispatch(showInfoPanel())

    return (
        <div  style={{ position: 'relative' }}>
            <div onClick={showInfoPanelTrigger} style={{ cursor: 'pointer', width: '100%', height: '100%', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></div>
            <div className={classes.headChat}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Avatar src={imageurldef || ""} />
                    <div className={classes.titleTicketChat}>
                        <div>
                            {displayname}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 400 }}>
                            Ticket #{ticketnum}
                        </div>
                    </div>
                </div>
                <ButtonsManageTicket classes={classes} />
            </div>
        </div>
    )
}

const ChatPanel: React.FC<{ classes: any, ticket: ITicket }> = React.memo(({ classes, ticket }) => (
    <div className={classes.containerChat}>
        <HeadChat
            classes={classes}
            ticket={ticket} />
        <InteractionsPanel
            classes={classes}
            ticket={ticket} />
        <ReplyPanel
            classes={classes} />
    </div>
))

export default ChatPanel;