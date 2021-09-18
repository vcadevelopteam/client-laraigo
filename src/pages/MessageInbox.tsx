/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { setUserType } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import InboxPanel from 'components/inbox/InboxPanel'
import useSocket from 'components/inbox/useSocket'
import { useSelector } from 'hooks';


const MessageInbox: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);

    const [sendMessage] = useSocket({ userType: 'AGENT', userId: user?.userid!!, orgId: user?.orgid!! });

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
            <InboxPanel userType="AGENT" sendMessage={sendMessage} />
        </div>
    );
}

export default MessageInbox;