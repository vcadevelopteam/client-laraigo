/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'hooks';
import { setUserType, emitEvent, cleanAlerts } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import InboxPanel from 'components/inbox/InboxPanel'
import { getMultiCollection, resetAllMain } from 'store/main/actions';
import { getMessageTemplateSel, getValuesFromDomain, getListUsers, getClassificationLevel1, getListQuickReply } from 'common/helpers';

const MessageInbox: React.FC = () => {
    const dispatch = useDispatch();

    const wsConnected = useSelector(state => state.inbox.wsConnected);
    const user = useSelector(state => state.login.validateToken.user);
    const aNewTicket = useSelector(state => state.inbox.aNewTicket);
    const aNewMessage = useSelector(state => state.inbox.aNewMessage);
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
        dispatch(setUserType("AGENT"));
        dispatch(getMultiCollection([
            getValuesFromDomain("MOTIVOCIERRE"),
            getListUsers(),
            getClassificationLevel1("TIPIFICACION"),
            getValuesFromDomain("GRUPOS"),
            getListQuickReply(),
            getMessageTemplateSel(0)
        ]))
        setinitial(false)
        return () => {
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