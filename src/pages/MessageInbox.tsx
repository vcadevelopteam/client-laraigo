/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'hooks';
import { setUserType, emitEvent, cleanAlerts, setAgentsToReassign, selectAgent, resetSelectTicket } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import InboxPanel from 'components/inbox/InboxPanel'
import { getMultiCollection, resetAllMain } from 'store/main/actions';
import { getMessageTemplateLst, getValuesFromDomainLight, getCommChannelLst, getListUsers, getClassificationLevel1, getListQuickReply, getEmojiAllSel, getInappropriateWordsLst, getPropertySelByName, getUserChannelSel, getPropertiesIncludingName } from 'common/helpers';

const MessageInbox: React.FC = () => {
    const dispatch = useDispatch();

    const wsConnected = useSelector(state => state.inbox.wsConnected);
    const user = useSelector(state => state.login.validateToken.user);
    const aNewTicket = useSelector(state => state.inbox.aNewTicket);
    const aNewMessage = useSelector(state => state.inbox.aNewMessage);
    const multiData = useSelector(state => state.main.multiData);

    const [initial, setinitial] = React.useState(true);
    const audioNewTicket = useRef<HTMLAudioElement>(null);
    const audioNewMessage = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (aNewTicket !== null && !initial) {
            if (!!user?.properties.alertTicketNew) {
                audioNewTicket.current?.pause();
                if (audioNewTicket.current) {
                    audioNewTicket.current.currentTime = 0;
                }
                audioNewTicket.current?.play();
            } else {
                audioNewMessage.current?.pause();
                if (audioNewMessage.current) {
                    audioNewMessage.current.currentTime = 0;
                }
                audioNewMessage.current?.play();
            }
        }
    }, [aNewTicket])

    useEffect(() => {
        if (aNewMessage !== null && !initial) {
            if (!!user?.properties.alertMessageIn) {
                audioNewMessage.current?.pause();
                if (audioNewMessage.current) {
                    audioNewMessage.current.currentTime = 0;
                }
                audioNewMessage.current?.play();
            }
        }
        setinitial(false)
    }, [aNewMessage])

    useEffect(() => {
        if (multiData?.data[1])
            dispatch(setAgentsToReassign(multiData?.data?.[1].data || []))
    }, [multiData])

    useEffect(() => {
        dispatch(resetSelectTicket());
        dispatch(setUserType("AGENT"));
        dispatch(selectAgent({
            userid: user?.userid!!,
            name: '',
            countActive: 0,
            countPaused: 0,
            countClosed: 0,
            countAnswered: 0,
            countPending: 0,
            status: '',
            groups: '',
            image: '',
            channels: [],
        }))
        dispatch(getMultiCollection([
            getValuesFromDomainLight("MOTIVOCIERRE"),
            getListUsers(),
            getClassificationLevel1("TIPIFICACION"),
            getValuesFromDomainLight("GRUPOS"),
            getListQuickReply(),
            getMessageTemplateLst(),
            getCommChannelLst(),
            getValuesFromDomainLight("OPORTUNIDADPRODUCTOS"),
            getValuesFromDomainLight("MOTIVOSUSPENSION"),
            getValuesFromDomainLight("OPORTUNIDADETIQUETAS"),
            getEmojiAllSel(),
            getInappropriateWordsLst(),
            getPropertySelByName("TIPIFICACION"),
            getUserChannelSel(),
            getPropertiesIncludingName("WAITINGTIMECUSTOMER"),
            getPropertySelByName("LIMITARREASIGNACIONGRUPO"),
        ]))
        setinitial(false)
        return () => {
            dispatch(selectAgent(null))
            dispatch(resetAllMain());
            dispatch(cleanAlerts());
        };
    }, [])

    useEffect(() => {
        if (wsConnected) {
            dispatch(emitEvent({
                event: 'connectChat',
                data: { usertype: 'AGENT' }
            }));
        }
    }, [wsConnected])

    return (
        <>
            <div style={{
                display: 'flex',
                gap: 16,
                width: '100%'
            }}>
                <InboxPanel userType="AGENT" />
            </div>
            <audio ref={audioNewTicket} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/alertzyxmetmp.mp3" />
            <audio ref={audioNewMessage} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/alert2tmpzyxme.mp3" />
        </>
    );
}

export default MessageInbox;