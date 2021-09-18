/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { setUserType } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import InboxPanel from 'components/inbox/InboxPanel'

const MessageInbox: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setUserType("AGENT"));
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