import io from 'socket.io-client';
import { apiUrls } from 'common/constants';
import { Middleware, Dispatch } from 'redux';
import typesInbox from 'store/inbox/actionTypes';

const eventsListeners = [
    { event: 'deleteTicket', type: typesInbox.DELETE_TICKET },
    { event: 'connectAgent', type: typesInbox.CONNECT_AGENT },
    { event: 'newMessageFromClient', type: typesInbox.NEW_MESSAGE_FROM_CLIENT, extra: { usertype: 'client' } },
    { event: 'newMessageFromBot', type: typesInbox.NEW_MESSAGE_FROM_CLIENT, extra: { newConversation: false, usertype: 'agent' } },
]

let socket = io(apiUrls.WS_URL, {
    autoConnect: false
});

const callWSMiddleware: Middleware = ({ dispatch }) => (next: Dispatch) => async (action) => {
    const { type, payload } = action;

    if (type === "WS_CONNECT") {
        const loginData = { data: payload }

        if (!socket.connected) {
            socket.auth = loginData;
            socket.connect();
        }

        eventsListeners.forEach(({ event, type, extra = {} }) => {
            socket.on(event, (datatmp) =>
                dispatch({ type, payload: { ...datatmp, ...extra } })
            );
        });

        socket?.on("connect", () => {
            console.log("connect", socket.id);
        });

        return;
    } else if (type === "EMIT_EVENT") {
        socket.emit(payload.event, payload.data);
        return;
    }
    
    return next(action)
};

export default callWSMiddleware;