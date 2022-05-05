import io from 'socket.io-client';
import { apiUrls } from 'common/constants';
import { Middleware, Dispatch } from 'redux';
import typesInbox from 'store/inbox/actionTypes';
import typesLogin from 'store/login/actionTypes';

const eventsListeners = [
    { event: 'deleteTicket', type: typesInbox.DELETE_TICKET },
    { event: 'connectAgent', type: typesInbox.CONNECT_AGENT_WS },
    { event: 'newMessageFromClient', type: typesInbox.NEW_MESSAGE_FROM_CLIENT, extra: {} },
    { event: 'newMessageFromBot', type: typesInbox.NEW_MESSAGE_FROM_CLIENT, extra: {} },
    { event: 'personSawChat', type: typesInbox.PERSON_SAW_CHAT, extra: {} },
    { event: 'forceddisconnect', type: typesInbox.FORCEDDISCONECTION },
    { event: 'changeStatusTicket', type: typesInbox.CHANGE_STATUS_TICKET_WS },
    { event: 'newNotification', type: typesLogin.NEW_NOTIFICATION },
]

const socket = io(apiUrls.WS_URL, {
    autoConnect: false
});
declare module 'socket.io-client' {
    interface Socket {
        _callbacks?: any
    }
}

const callWSMiddleware: Middleware = ({ dispatch }) => (next: Dispatch) => async (action) => {
    const { type, payload } = action;

    if (type === typesInbox.WS_CONNECT) {
        const loginData = { data: payload };

        if (socket.connected) {
            // console.log("vamos a desconectar")
            socket.disconnect();
        }
        socket.auth = loginData;
        socket.connect();
        if (!socket._callbacks) {
            console.log("load eventsListeners")
            eventsListeners.forEach(({ event, type, extra = {} }) => {
                socket.on(event, (datatmp) => {
                    console.log("voximplant: event ", event, datatmp)
                    dispatch({ type, payload: { ...datatmp, ...extra } })
                });
            });
        }
        socket?.on("connect", () => {
            console.log("connect connected", socket.connected, socket.id)
            if (socket.connected) {
                dispatch({ type: typesInbox.WS_CONNECTED, payload: true })
            } else {
                dispatch({ type: typesInbox.WS_CONNECTED, payload: false })
            }
        });

        socket?.on("disconnect", () => {
            console.log("from event disconnect", socket.id);
            dispatch({ type: typesInbox.WS_CONNECTED, payload: false })
        });

        return;
    } else if (type === typesInbox.EMIT_EVENT) {
        socket.emit(payload.event, payload.data);
        return;
    } else if (type === typesInbox.WS_DISCONNECT) {
        console.log("disconnect!")
        socket.disconnect();
        return;
    }

    return next(action)
};

export default callWSMiddleware;