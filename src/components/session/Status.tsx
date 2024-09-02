import React, { FC, useState, useEffect } from "react";
import { createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import IOSSwitch from "components/fields/IOSSwitch";
import { Trans } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from 'hooks';
import { emitEvent, connectAgentUI, connectAgentAPI } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { DialogZyx, FieldSelect, FieldEditMulti } from 'components';
import { manageStatusVox } from "store/voximplant/actions";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#F9F9FA', padding: '10px 12px', display: 'flex', height: 42
        },
        connectionText: {
            fontSize: 14,
        },
    }),
);

const DialogReasonsDisconnection: React.FC<{
    setOpenModal: (param: any) => void;
    openModal: boolean;
}> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userConnected = useSelector(state => state.inbox.userConnected);
    const domains = useSelector(state => state.login.validateToken.user?.domains);
    const voxiConnection = useSelector(state => state.voximplant.connection);    
    const ticketSelected = useSelector((state) => state.inbox.ticketSelected);
    const user = useSelector(state => state.login.validateToken.user);
    const userType = useSelector((state) => state.inbox.userType);
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
    }, [openModal, register, reset, t])

    const onSubmit = handleSubmit((data) => {
        dispatch(connectAgentAPI(!userConnected, data.observation, data.motive));
        dispatch(connectAgentUI(!userConnected));
        if (!voxiConnection.error) {
            dispatch(manageStatusVox(!userConnected));
        }
        dispatch(emitEvent({
            event: 'connectAgent',
            data: {
                isconnected: !userConnected,
                motive: data.motive,
                userid: 0,
                orgid: 0
            }
        }));
        if (ticketSelected && userType === "AGENT") {
            const message =  `${user?.firstname} ${user?.lastname} (${user?.usr}) pasó a estar desconectado por motivo de "${data.motive}"`;
            
            const newInteractionSocket = {
                ...ticketSelected!!,
                interactionid: 0,
                typemessage: "LOG",
                typeinteraction: "LOG",
                uuid: "2222",
                lastmessage: message,
                createdate: new Date().toISOString(),
                userid: 0,
                usertype: "agent",
                ticketWasAnswered: !ticketSelected!!.isAnswered,
            };
            dispatch(
                emitEvent({
                    event: "newMessageFromAgent",
                    data: newInteractionSocket,
                })
            );
        }
        setOpenModal(false);
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.reasons_disconnection)}
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
                    data={domains?.reasons_disconnection || []}
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

const Status: FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const userConnected = useSelector(state => state.inbox.userConnected);
    const [openDialog, setOpenDialog] = useState(false);
    const voxiConnection = useSelector(state => state.voximplant.connection);    
    const ticketSelected = useSelector((state) => state.inbox.ticketSelected);
    const userType = useSelector((state) => state.inbox.userType);
    const user = useSelector(state => state.login.validateToken.user);

    const onChecked = () => {
        if (userConnected) {
            setOpenDialog(true)
        } else {
            if (!voxiConnection.error) {
                dispatch(manageStatusVox(!userConnected));
            }
            dispatch(connectAgentAPI(!userConnected))
            dispatch(connectAgentUI(!userConnected))
            dispatch(emitEvent({
                event: 'connectAgent',
                data: {
                    isconnected: !userConnected,
                    userid: 0,
                    orgid: 0
                }
            }));
            if (ticketSelected && userType === "AGENT") {
                const message =  `${user?.firstname} ${user?.lastname} (${user?.usr}) pasó a estar conectado.`;
                
                const newInteractionSocket = {
                    ...ticketSelected!!,
                    interactionid: 0,
                    typemessage: "LOG",
                    typeinteraction: "LOG",
                    uuid: "2222",
                    lastmessage: message,
                    createdate: new Date().toISOString(),
                    userid: 0,
                    usertype: "agent",
                    ticketWasAnswered: !ticketSelected!!.isAnswered,
                };
                dispatch(
                    emitEvent({
                        event: "newMessageFromAgent",
                        data: newInteractionSocket,
                    })
                );
            }
        }
    }

    return (
        <>
            <DialogReasonsDisconnection
                openModal={openDialog}
                setOpenModal={setOpenDialog}
            />
            <Paper elevation={0} className={classes.root}>
                <label className={classes.connectionText}><Trans>{userConnected ? langKeys.available : langKeys.notavailable}</Trans></label>
                <div style={{ width: 6 }} />
                <IOSSwitch checked={userConnected} onChange={onChecked} name="checkedB" />
            </Paper>
        </>
    );
};

export default Status;
