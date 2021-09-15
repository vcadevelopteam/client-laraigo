/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { ITicket, ICloseTicketsParams } from "@types";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CheckIcon } from 'icons';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { showInfoPanel, closeTicket } from 'store/inbox/actions';
import { ReplyPanel, InteractionsPanel, DialogZyx, FieldSelect, FieldEditMulti } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

const DialogCloseticket: React.FC<{ setOpenModal: (param: any) => void, openModal: boolean }> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const multiData = useSelector(state => state.main.multiData);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

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
        dispatch(closeTicket(dd));
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
                    data={multiData.data[0] && multiData.data[0].data}
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

    const multiData = useSelector(state => state.main.multiData);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

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
        dispatch(closeTicket(dd));
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
                    valueDefault={getValues('motive')}
                    onChange={(value) => setValue('motive', value ? value.userid : '')}
                    error={errors?.motive?.message}
                    data={multiData.data[1] && multiData.data[1].data}
                    optionDesc="displayname"
                    optionValue="userid"
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

const ButtonsManageTicket: React.FC<{ classes: any }> = ({ classes }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { t } = useTranslation();
    const handleClose = () => setAnchorEl(null);
    const [openModalCloseticket, setopenModalCloseticket] = useState(false);
    const [openModalReassignticket, setopenModalReassignticket] = useState(false);
    const closeTicket = () => setopenModalCloseticket(true);

    return (
        <>
            <div className={classes.containerButtonsChat}>
                <div className={classes.buttonCloseticket} onClick={closeTicket}>
                    <CheckIcon /> <span style={{ marginLeft: 8 }} >Close ticket</span>
                </div>
                <div className={classes.buttonIcon} onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVertIcon style={{ color: '#000' }} />
                </div>
                <div className={classes.buttonIcon}>
                    <VideocamIcon style={{ color: '#000' }} />
                </div>
                <div className={classes.buttonIcon}>
                    <CallIcon style={{ color: '#000' }} />
                </div>
            </div>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
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
                <MenuItem onClick={(e) => {
                    setopenModalReassignticket(true)
                    setAnchorEl(null)
                }}>{t(langKeys.reassign)}</MenuItem>
                <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                }}>{t(langKeys.typify)}</MenuItem>
            </Menu>
            <DialogCloseticket openModal={openModalCloseticket} setOpenModal={setopenModalCloseticket} />
            <DialogReassignticket openModal={openModalReassignticket} setOpenModal={setopenModalReassignticket} />
        </>
    )
}

const ChatPanel: React.FC<{ classes: any, ticket: ITicket }> = React.memo(({ classes, ticket, ticket: { ticketnum } }) => {
    const dispatch = useDispatch();
    const showInfoPanelTrigger = () => dispatch(showInfoPanel())

    return (
        <div className={classes.containerChat}>
            <div className={classes.headChat}>
                <div>
                    <span
                        className={classes.titleTicketChat}
                        onClick={showInfoPanelTrigger}
                    >Ticket #{ticketnum}</span>
                </div>
                <ButtonsManageTicket classes={classes} />
            </div>
            <InteractionsPanel
                classes={classes}
                ticket={ticket} />
            <ReplyPanel
                classes={classes} />
        </div>
    )
})

export default ChatPanel;