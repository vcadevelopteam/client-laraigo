import io from 'socket.io-client';
import { apiUrls } from 'common/constants';
import { Middleware, Dispatch } from 'redux';
import typesInbox from 'store/inbox/actionTypes';
import typesVoximplant from 'store/voximplant/actionTypes';
import typesLogin from 'store/login/actionTypes';

const eventsListeners = [
    { event: 'deleteTicket', type: typesVoximplant.MODIFY_CALL },
    { event: 'deleteTicket', type: typesInbox.DELETE_TICKET },
    { event: 'connectAgent', type: typesInbox.CONNECT_AGENT_WS },
    { event: 'newMessageFromClient', type: typesInbox.NEW_MESSAGE_FROM_CLIENT, extra: {} },
    { event: 'newMessageFromBot', type: typesInbox.NEW_MESSAGE_FROM_CLIENT, extra: {} },
    { event: 'personSawChat', type: typesInbox.PERSON_SAW_CHAT, extra: {} },
    { event: 'forceddisconnect', type: typesInbox.FORCEDDISCONECTION },
    { event: 'changeStatusTicket', type: typesInbox.CHANGE_STATUS_TICKET_WS },
    { event: 'updateCounterAgents', type: typesInbox.UPDATE_COUNTER_AGENTS },
    { event: 'newNotification', type: typesLogin.NEW_NOTIFICATION },
    { event: 'callWasAnswred', type: typesInbox.ANSWERED_CALL, extra: {} },
    { event: 'updateExternalIDs', type: typesInbox.UPDATE_EXTERNAL_IDS, extra: {} },
    { event: 'updateQuickreply', type: typesInbox.UPD_QUICKREPLIES, extra: {} },
    { event: 'variables-sync', type: typesInbox.VARIABLESSYNC, extra: {} },
]

const socket = io(`${apiUrls.WS_URL}`, {
    autoConnect: false,
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

        if (socket.connected || socket.recovered) {
            socket.disconnect();
        }

        socket.auth = loginData;
        socket.connect();

        if (!socket._callbacks) {
            console.log("load eventsListeners")
            eventsListeners.forEach(({ event, type, extra = {} }) => {
                socket.on(event, (datatmp) => {
                    if (event === "forceddisconnect") {
                        socket.disconnect();
                    }
                    dispatch({ type, payload: { ...datatmp, ...extra } })
                });
            });
        }

        socket.emit("pong", {});

        socket.on("ping", (datatmp) => {
            dispatch({ type: typesLogin.UPDATE_CONNECTION, payload: datatmp })
            setTimeout(() => {
                socket.emit("pong", {});
            }, 20000);
        });

        socket?.on("connect", () => {
            console.log("connect connected", socket.connected, socket.id)
            if (socket.connected || socket.recovered) {
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
        socket.emit("disconnectOnSession", {});
        setTimeout(() => {
            socket.disconnect();
        }, 500);
        return;
    }

    return next(action)
};

export default callWSMiddleware;