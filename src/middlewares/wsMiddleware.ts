import io from 'socket.io-client';
import { apiUrls } from 'common/constants';
import { Middleware, Dispatch } from 'redux';
import typesInbox from 'store/inbox/actionTypes';

const eventsListeners = [
    { event: 'deleteTicket', type: typesInbox.DELETE_TICKET },
    { event: 'connectAgent', type: typesInbox.CONNECT_AGENT_WS },
    { event: 'newMessageFromClient', type: typesInbox.NEW_MESSAGE_FROM_CLIENT, extra: {} },
    { event: 'newMessageFromBot', type: typesInbox.NEW_MESSAGE_FROM_CLIENT, extra: {} },
]

let socket = io(apiUrls.WS_URL, {
    autoConnect: false
});

const callWSMiddleware: Middleware = ({ dispatch }) => (next: Dispatch) => async (action) => {
    const { type, payload } = action;

    if (type === typesInbox.WS_CONNECT) {
        const loginData = { data: payload }
        if (!socket.connected) {
            socket.disconnect();
        }
        socket.auth = loginData;
        socket.connect();

        eventsListeners.forEach(({ event, type, extra = {} }) => {
            console.log("load eventsListeners")
            socket.on(event, (datatmp) => {
                console.log("event ", event)
                dispatch({ type, payload: { ...datatmp, ...extra } })
            });
        });

        socket?.on("connect", () => {
            console.log("connect", socket.id);
            dispatch({ type: typesInbox.WS_CONNECTED, payload: true })
        });

        socket?.on("disconnect", () => {
            dispatch({ type: typesInbox.WS_CONNECTED, payload: false })
            console.log("connect", socket.id);
        });

        return;
    } else if (type === typesInbox.EMIT_EVENT) {
        socket.emit(payload.event, payload.data);
        return;
    }

    return next(action)
};

export default callWSMiddleware;