/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { setUserType } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import InboxPanel from 'components/inbox/InboxPanel'
import useSocket from 'components/inbox/useSocket'
import { useSelector } from 'hooks';
import { getMultiCollection } from 'store/main/actions';
import { getValuesFromDomain, getListUsers, getClassificationLevel1, getListQuickReply } from 'common/helpers';

const MessageInbox: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);

    const [socketEmitEvent] = useSocket({ userType: 'AGENT', userId: user?.userid!!, orgId: user?.orgid!! });

    useEffect(() => {
        dispatch(setUserType("AGENT"));
        dispatch(getMultiCollection([
            getValuesFromDomain("MOTIVOCIERRE"),
            getListUsers(),
            getClassificationLevel1("TIPIFICACION"),
            getValuesFromDomain("GRUPOS"),
            getListQuickReply()
        ]))
    }, [])

    return (
        <div style={{
            display: 'flex',
            gap: 16,
            borderTop: '1px solid #EBEAED',
            width: '100%'
        }}>
            <InboxPanel userType="AGENT" socketEmitEvent={socketEmitEvent} />
        </div>
    );
}

export default MessageInbox;