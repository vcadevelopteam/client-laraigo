import io from 'socket.io-client';
import { apiUrls } from 'common/constants';
import { Middleware, Dispatch } from 'redux';
import typeVoximplant from 'store/voximplant/actionTypes';
import * as VoxImplant from 'voximplant-websdk'
import { Call } from 'voximplant-websdk/Call/Call';

const sdk = VoxImplant.getInstance();
let alreadyLoad = false;

const calVoximplantMiddleware: Middleware = ({ dispatch }) => (next: Dispatch) => async (action) => {
    const { type, payload } = action;

    if (type === typeVoximplant.INIT_SDK) {
        console.log("voximplant: alreadyLoad", alreadyLoad)
        try {
            dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: false, message: "", loading: true } })
            if (!alreadyLoad) {
                await sdk.init({
                    micRequired: true,
                    showDebugInfo: true,
                    progressTone: true,
                    progressToneCountry: 'US',
                });

                sdk.on(VoxImplant.Events.ACDStatusUpdated, (e) => {
                    console.log("voximplant: status->", e);
                })

                sdk.on(VoxImplant.Events.IncomingCall, (e) => {
                    console.log("voximplant: llamada entrante!!")
                    dispatch({ type: typeVoximplant.INIT_CALL, payload: { call: e.call, type: "INBOUND", number: e.call.number() }})

                    e.call.on(VoxImplant.CallEvents.Disconnected, () => {
                        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "DISCONNECTED" });
                    });
                    e.call.on(VoxImplant.CallEvents.Failed, () => {
                        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "DISCONNECTED" });
                    });
                })
            }
            try {
                await sdk.connect();
                alreadyLoad = true
            } catch (e) {
                dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: true, message: "Connection failed!", loading: false } })
                console.log("voximplant: Connection failed!");
                return;
            }
            try {
                console.log(`voximplant: ${payload.user}@${payload.application}`)
                await sdk.login(`${payload.user}@${payload.application}`, "Laraigo2022$CDFD");
                
                if (payload?.automaticConnection) {
                    sdk.setOperatorACDStatus(VoxImplant.OperatorACDStatuses.Ready);
                }

                dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: false, message: "", loading: false } })
                console.log("voximplant: Logged in!", typeVoximplant.MANAGE_CONNECTION);

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
            number: payload,
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
        const call = payload;
        call?.answer();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "CONNECTED" });
        return
    } else if (type === typeVoximplant.REJECT_CALL) {
        const call = payload;
        call?.reject();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "DISCONNECTED" });
        return
    }  else if (type === typeVoximplant.HANGUP_CALL) {
        const call = payload;
        call?.hangup();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "DISCONNECTED" });
        return
    }  else if (type === typeVoximplant.HOLD_CALL) {
        const call = payload.call;
        await call?.setActive(payload.flag);
        return
    }  else if (type === typeVoximplant.MUTE_CALL) {
        const call = payload;
        call?.muteMicrophone();
        return
    }  else if (type === typeVoximplant.UNMUTE_CALL) {
        const call = payload;
        call?.unmuteMicrophone();
        return
    } else if (type === typeVoximplant.MANAGE_STATUS_VOX) {
        sdk.setOperatorACDStatus(payload ? VoxImplant.OperatorACDStatuses.Ready : VoxImplant.OperatorACDStatuses.Offline);
        return
    } else if (type === typeVoximplant.DISCONNECT) {
        try {
            sdk?.disconnect();
        } catch (error) {
            
        }
    }

    return next(action)
};

export default calVoximplantMiddleware;