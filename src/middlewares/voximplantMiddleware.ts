import io from 'socket.io-client';
import { apiUrls } from 'common/constants';
import { Middleware, Dispatch } from 'redux';
import typeVoximplant from 'store/voximplant/actionTypes';
import typesLogin from 'store/login/actionTypes';
import * as VoxImplant from 'voximplant-websdk'
import { Call } from 'voximplant-websdk/Call/Call';

const sdk = VoxImplant.getInstance();

declare module 'socket.io-client' {
    interface Socket {
        _callbacks?: any
    }
}

const calVoximplantMiddleware: Middleware = ({ dispatch }) => (next: Dispatch) => async (action) => {
    const { type, payload } = action;

    if (type === typeVoximplant.INIT_SDK) {
        try {
            dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: false, message: "", loading: true } })

            await sdk.init({
                micRequired: true,
                showDebugInfo: true,
                progressTone: true,
                progressToneCountry: 'US',
            });
            try {
                await sdk.connect();
            } catch (e) {
                dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: true, message: "Connection failed!", loading: false } })
                console.log("voximplant: Connection failed!");
                return;
            }
            try {
                await sdk.login("fdcarlosd1@app-test.fdcarlosdz1.n2.voximplant.com", "12345678");
                dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: false, message: "", loading: false } })
                console.log("voximplant: Logged in!");

                sdk.on(VoxImplant.Events.IncomingCall, (e) => {
                    console.log("llamada entrante!!")
                    dispatch({ type: typeVoximplant.INIT_CALL, payload: { call: e.call, type: "INBOUND", number: e.call.number() }})
                })

                return
            } catch (e) {
                dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: true, message: "Login failure!", loading: false } })
                console.log("voximplant: Login failure!");
                return;
            }
        } catch (e) {
            dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: true, message: "SDK init failure!", loading: false } })
            console.log("voximplant: SDK init failure!");
            return;
        }
    } else if (type === typeVoximplant.MAKE_CALL) {
        const callSettings = {
            number: payload.number,
            videoFlags: {
                sendVideo: false,
                receiveVideo: false
            }
        };
        const call = sdk?.call(callSettings);
        dispatch({ type: typeVoximplant.INIT_CALL, payload: { call, type: "OUTBOUND", number: payload.number } })

        call.on(VoxImplant.CallEvents.Connected, () => {
            dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "CONNECTED" });
        });
        call.on(VoxImplant.CallEvents.Disconnected, () => {
            dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "DISCONNECTED" });
        });
        call.on(VoxImplant.CallEvents.Failed, () => {
            dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "DISCONNECTED" });
        });
        return
    } else if (type === typeVoximplant.ANSWER_CALL) {
        const call = payload.call;
        call?.answer();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "CONNECTED" });
        return
    } else if (type === typeVoximplant.REJECT_CALL) {
        const call = payload.call;
        call?.reject();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "DISCONNECTED" });
        return
    }

    return next(action)
};

export default calVoximplantMiddleware;