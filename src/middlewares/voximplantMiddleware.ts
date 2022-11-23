import { Middleware, Dispatch } from 'redux';
import typeVoximplant from 'store/voximplant/actionTypes';
import typeInbox from 'store/inbox/actionTypes';
import * as VoxImplant from 'voximplant-websdk'
import { CallSettings } from 'voximplant-websdk/Structures';
import { ITicket } from '@types';
import { Call } from "voximplant-websdk/Call/Call";
import { emitEvent, connectAgentUI, connectAgentAPI } from 'store/inbox/actions';

const cleanNumber = (number: string | null) => number?.includes("@") ? number?.split("@")[0].split(":")?.[1] : number;
const sdk = VoxImplant.getInstance();
let alreadyLoad = false;

const calVoximplantMiddleware: Middleware = ({ dispatch }) => (next: Dispatch) => async (action) => {
    const { type, payload } = action;

    if (type === typeVoximplant.INIT_SDK) {
        try {
            dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: false, message: "", loading: true } })
            if (!alreadyLoad) {
                await sdk.init({
                    micRequired: true,
                    showDebugInfo: false,
                    progressTone: true,
                    progressToneCountry: 'US',
                });

                sdk.on(VoxImplant.Events.ACDStatusUpdated, (e) => {
                    if (e.status === "BANNED") {
                        dispatch(connectAgentAPI(false, "BANNED", "BANNED"));
                        dispatch(connectAgentUI(false))
                        dispatch(emitEvent({
                            event: 'connectAgent',
                            data: {
                                isconnected: false,
                                userid: 0,
                                orgid: 0
                            }
                        }));
                    }
                })

                sdk.on(VoxImplant.Events.IncomingCall, (e) => {
                    const headers = (e.call as Call).headers()
                    const supervision = headers["X-supervision"]
                    const splitIdentifier = headers["X-identifier"].split("-");
                    const number = cleanNumber(e.call.number());
                    if (supervision) {
                        dispatch({
                            type: typeVoximplant.INIT_CALL,
                            payload: {
                                call: e.call,
                                type: "SUPERVISION",
                                number: "",
                                identifier: headers["X-identifier"]
                            }
                        })
                        e.call.answer();
                        return;
                    }

                    const data: ITicket = {
                        conversationid: parseInt(splitIdentifier[3]),
                        ticketnum: splitIdentifier[5],
                        personid: parseInt(splitIdentifier[4]),
                        communicationchannelid: parseInt(splitIdentifier[2]),
                        status: "ASIGNADO",
                        imageurldef: "",
                        firstconversationdate: headers["X-createdatecall"],
                        personlastreplydate: new Date().toISOString(),
                        countnewmessages: 1,
                        usergroup: "",
                        displayname: headers["X-personname"],
                        coloricon: "",
                        communicationchanneltype: "VOXI",
                        lastmessage: "LLAMADA ENTRANTE",
                        personcommunicationchannel: `${number}_VOXI`,
                        communicationchannelsite: headers["X-site"],
                        lastreplyuser: "",
                        commentexternalid: headers["X-accessURL"]
                    }
                    //enviar a los otros supervisores
                    dispatch(emitEvent({
                        event: 'newCallTicket',
                        data: {
                            ...data,
                            newuserid: 0,
                            orpid: parseInt(splitIdentifier[0]),
                            orgid: parseInt(splitIdentifier[1]),
                        }
                    }));

                    //iniciar la llamada en managecall
                    dispatch({
                        type: typeVoximplant.INIT_CALL,
                        payload: {
                            call: e.call,
                            type: "INBOUND",
                            number: cleanNumber(number),
                            identifier: headers["X-identifier"],
                            status: "CONNECTING"
                        }
                    })
                    //agregar el ticket con el control de llamada
                    dispatch({
                        type: typeInbox.NEW_TICKET_CALL,
                        payload: {
                            ...data,
                            call: e.call
                        }
                    })

                    e.call.on(VoxImplant.CallEvents.Disconnected, () => {
                        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
                    });
                    e.call.on(VoxImplant.CallEvents.Failed, () => {
                        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
                    });
                })
            }
            try {
                await sdk.connect();
                alreadyLoad = true
            } catch (e) {
                dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: true, message: "Connection failed!", loading: false } })
                console.warn("voximplant: Connection failed!");
                return;
            }
            try {
                await sdk.login(`${payload.user}@${payload.application}`, "Laraigo2022$CDFD");

                if (payload?.automaticConnection) {
                    sdk.setOperatorACDStatus(VoxImplant.OperatorACDStatuses.Ready);
                }

                dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: false, message: "", loading: false } })
                console.log("voximplant: Logged in!");

                return
            } catch (e) {
                dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: true, message: "Login failure!", loading: false } })
                console.warn("voximplant: Login failure!");
                return;
            }
        } catch (e) {
            dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: true, message: "SDK init failure!", loading: false } })
            console.warn("voximplant: SDK init failure!");
            return;
        }
    } else if (type === typeVoximplant.MAKE_CALL) {
        const callSettings: CallSettings = {
            number: payload.number,
            video: {
                sendVideo: false,
                receiveVideo: false
            },
            customData: payload.site
        };
        const call = sdk?.call(callSettings);

        dispatch({
            type: typeVoximplant.INIT_CALL,
            payload: {
                call,
                type: "OUTBOUND",
                number: payload.number
            }
        })

        call.on(VoxImplant.CallEvents.Connected, (e) => {
            const number = cleanNumber(e?.call?.number());
            dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "CONNECTED", number } });
            //actualizar la fecha de contestado en la lista de tickets
            dispatch({ type: typeInbox.CALL_CONNECTED, payload: action.payload.data.personcommunicationchannel });
        });
        call.on(VoxImplant.CallEvents.Disconnected, (e) => {
            const number = cleanNumber(e?.call?.number());
            dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
        });
        call.on(VoxImplant.CallEvents.Failed, (e) => {
            const number = cleanNumber(e?.call?.number());
            dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
        });
        return
    } else if (type === typeVoximplant.ANSWER_CALL) {
        const call = payload.call;
        const number = payload.number;

        call?.answer();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
        //actualizar la fecha de contestado en la lista de tickets
        dispatch({ type: typeInbox.CALL_CONNECTED, payload: action.payload.conversationid });
        return
    } else if (type === typeVoximplant.REJECT_CALL) {
        const call = payload;
        call?.reject();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "DISCONNECTED" });
        return
    } else if (type === typeVoximplant.HANGUP_CALL) {
        const call = payload;
        call?.hangup();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: "DISCONNECTED" });
        return
    } else if (type === typeVoximplant.HOLD_CALL) {
        const call = payload.call;
        await call?.setActive(payload.flag);
        return
    } else if (type === typeVoximplant.MUTE_CALL) {
        const call = payload;
        call?.muteMicrophone();
        return
    } else if (type === typeVoximplant.UNMUTE_CALL) {
        const call = payload;
        call?.unmuteMicrophone();
        return
    } else if (type === typeVoximplant.MANAGE_STATUS_VOX) {
        try {
            if (payload) {
                sdk.setOperatorACDStatus(VoxImplant.OperatorACDStatuses.Online).then(() => sdk.setOperatorACDStatus(VoxImplant.OperatorACDStatuses.Ready));
            } else {
                sdk.setOperatorACDStatus(VoxImplant.OperatorACDStatuses.Offline);
            }
        } catch (error) {

        }
        return
    } else if (type === typeVoximplant.DISCONNECT) {
        dispatch({ type: typeVoximplant.MANAGE_CONNECTION, payload: { error: true, message: "", loading: false } })
        try {
            if (alreadyLoad) {
                sdk?.disconnect();
            }
            return
        } catch (error) {
            console.log("aaaaxxxxx")
            return
        }
    }

    return next(action)
};

export default calVoximplantMiddleware;