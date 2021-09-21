/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { setUserType, emitEvent } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import InboxPanel from 'components/inbox/InboxPanel'
import { getMultiCollection } from 'store/main/actions';
import { getValuesFromDomain, getListUsers, getClassificationLevel1, getListQuickReply } from 'common/helpers';

const MessageInbox: React.FC = () => {
    const dispatch = useDispatch();
  
    useEffect(() => {
        dispatch(setUserType("AGENT"));
        dispatch(getMultiCollection([
            getValuesFromDomain("MOTIVOCIERRE"),
            getListUsers(),
            getClassificationLevel1("TIPIFICACION"),
            getValuesFromDomain("GRUPOS"),
            getListQuickReply()
        ]))

        dispatch(emitEvent({
            event: 'connectChat',
            data: { usertype: 'AGENT' }
        }));
    }, [])

    return (
        <div style={{
            display: 'flex',
            gap: 16,
            borderTop: '1px solid #EBEAED',
            width: '100%'
        }}>
            <InboxPanel userType="AGENT" />
        </div>
    );
}

export default MessageInbox;