import React, { useState } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { ITicket } from "@types";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CheckIcon } from 'icons';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { showInfoPanel } from 'store/inbox/actions';
import { ReplyPanel, InteractionsPanel, DialogZyx, FieldSelect, FieldEditMulti } from 'components'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';

const DialogCloseticket: React.FC<{ classes: any }> = ({ classes }) => {
    const { t } = useTranslation();
    const [openModalCloseticket, setopenModalCloseticket] = useState(false);
    const multiData = useSelector(state => state.main.multiData);

    return (
        <DialogZyx
            open={openModalCloseticket}
            title={t(langKeys.close_ticket)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setopenModalCloseticket(false)}
            // handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.closing_reason)}
                    className="col-12"
                    // onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                    // error={errors?.status?.message}
                    data={multiData.data[0] && multiData.data[0].data}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                <FieldEditMulti
                    label={t(langKeys.detail)}
                    className="col-12"
                    // onChange={(value) => setQuickreply(value)}
                    // error={errors?.quickreply?.message}
                    maxLength={1024}
                />
            </div>
        </DialogZyx>)
}

const ButtonsManageTicket: React.FC<{ classes: any }> = ({ classes }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);
    const { t } = useTranslation();
    const [openModalCloseticket, setopenModalCloseticket] = useState(false);

    const multiData = useSelector(state => state.main.multiData);

    const closeTicket = () => {
        setopenModalCloseticket(true);
        // handleClose();
    }

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
                    setAnchorEl(null)
                }}>Reasignar</MenuItem>
                <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                }}>Clasificar</MenuItem>
            </Menu>
            <DialogZyx
                open={openModalCloseticket}
                title={t(langKeys.close_ticket)}
                buttonText1={t(langKeys.cancel)}
                buttonText2={t(langKeys.continue)}
                handleClickButton1={() => setopenModalCloseticket(false)}
                // handleClickButton2={onSubmit}
                button2Type="submit"
            >
                <div className="row-zyx">
                    <FieldSelect
                        label={t(langKeys.closing_reason)}
                        className="col-12"
                        // onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                        // error={errors?.status?.message}
                        data={multiData.data[0] && multiData.data[0].data}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                    />
                    <FieldEditMulti
                        label={t(langKeys.detail)}
                        className="col-12"
                        // onChange={(value) => setQuickreply(value)}
                        // error={errors?.quickreply?.message}
                        maxLength={1024}
                    />
                </div>
            </DialogZyx>
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