import { Middleware, Dispatch } from 'redux';
import typeVoximplant from 'store/voximplant/actionTypes';
import typeInbox from 'store/inbox/actionTypes';
import * as VoxImplant from 'voximplant-websdk'
import { CallSettings } from 'voximplant-websdk/Structures';
import { ICallGo, ITicket } from '@types';
import { Call } from "voximplant-websdk/Call/Call";
import { emitEvent, connectAgentUI, connectAgentAPI } from 'store/inbox/actions';
import { execute } from 'store/main/actions';
import { conversationTransferStatus } from 'common/helpers';

const cleanNumber = (number: string | null) => number?.includes("@") ? number?.split("@")[0].split(":")?.[1] : (number?.includes("_") ? number?.split("_")[0] : number);
const sdk = VoxImplant.getInstance();
let alreadyLoad = false;
let transferdata: any = {};

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
                    const method = headers["X-method"]
                    const supervision = headers["X-supervision"]
                    const splitIdentifier = headers["X-identifier"].split("-");
                    const number = headers["X-transfer"] ? cleanNumber(headers["X-originalnumber"]) : cleanNumber(e?.call?.number());
                    const name = headers["X-personname"] || number;

                    if (supervision) {
                        dispatch({
                            type: typeVoximplant.INIT_CALL,
                            payload: {
                                call: e.call,
                                type: "SUPERVISION",
                                number: number,
                                identifier: headers["X-identifier"],
                                name
                            }
                        })
                        e.call.answer();
                        return;
                    }
                    if (method !== "simultaneous") {
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
                            displayname: name || "",
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

                        //agregar el ticket con el control de llamada
                        dispatch({
                            type: typeInbox.NEW_TICKET_CALL,
                            payload: {
                                ...data,
                                call: e.call
                            }
                        })
                    }

                    //iniciar la llamada en managecall
                    dispatch({
                        type: typeVoximplant.INIT_CALL,
                        payload: {
                            call: e.call,
                            type: "INBOUND",
                            number,
                            name,
                            identifier: headers["X-identifier"],
                            statusCall: "CONNECTING",
                            method: method,
                            initCallDate: headers["X-createdatecall"],
                            accessURL: headers["X-accessURL"],
                            personAnswerCallDate: new Date().toISOString()
                        }
                    })

                    e.call.on(VoxImplant.CallEvents.Disconnected, (e: any) => {
                        const headers = (e.call as Call).headers()
                        if (headers["X-transfer"] && headers["X-conversationid"]) {
                            dispatch(emitEvent({
                                event: 'deleteTicket',
                                data: {
                                    conversationid: +headers["X-conversationid"],
                                    userid: 0, //userType === "AGENT" ? 0 : agentSelected?.userid,
                                    getToken: false //userType === "SUPERVISOR"
                                }
                            }));
                        }
                        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
                    });
                    e.call.on(VoxImplant.CallEvents.Failed, (e: any) => {
                        const headers = (e.call as Call).headers()
                        if (headers["X-transfer"] && headers["X-conversationid"]) {
                            dispatch(emitEvent({
                                event: 'deleteTicket',
                                data: {
                                    conversationid: +headers["X-conversationid"],
                                    userid: 0, //userType === "AGENT" ? 0 : agentSelected?.userid,
                                    getToken: false //userType === "SUPERVISOR"
                                }
                            }));
                        }
                        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
                    });
                    e.call.on(VoxImplant.CallEvents.MessageReceived, (e: any) => {
                        try {
                            const headers = (e.call as Call).headers();
                            const number = headers["X-transfer"] ? cleanNumber(headers["X-originalnumber"]) : cleanNumber(e?.call?.number());
                            const message_json = JSON.parse(e.text)
                            switch (message_json.operation) {
                                case 'TRANSFER-CONNECTED':
                                    dispatch({
                                        type: typeVoximplant.CONNECTED_TRANSFER_CALL,
                                        payload: {
                                            number,
                                            call: e.call,
                                        }
                                    })
                                    break;
                                case 'TRANSFER-DISCONNECTED':
                                    dispatch(emitEvent({
                                        event: 'deleteTicket',
                                        data: {
                                            conversationid: message_json?.conversationid,
                                            userid: 0, //userType === "AGENT" ? 0 : agentSelected?.userid,
                                            getToken: false //userType === "SUPERVISOR"
                                        }
                                    }));
                                    break;
                                case 'TRANSFER-HANGUP': case 'TRANSFER-FAILED':
                                    if (transferdata[`${message_json?.conversationid}`] === message_json.tranfernumber
                                        || transferdata[`${message_json?.conversationid}`] === message_json.tranfername
                                    ) {
                                        dispatch({
                                            type: typeVoximplant.RESET_TRANSFER_CALL,
                                            payload: {
                                                number,
                                            }
                                        })
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        catch (e) { console.log(e) }
                    })
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
                number: payload.number,
                statusCall: "CONNECTING"
            }
        })

        call.on(VoxImplant.CallEvents.Connected, (e) => {
            const number = cleanNumber(e?.call?.number());
            dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "CONNECTED", number } });
            //actualizar la fecha de contestado en la lista de tickets
            dispatch({ type: typeInbox.CALL_CONNECTED, payload: `${number}_VOXI` });
        });
        call.on(VoxImplant.CallEvents.Disconnected, (e) => {
            const number = cleanNumber(e?.call?.number());
            dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
        });
        call.on(VoxImplant.CallEvents.Failed, (e) => {
            const number = cleanNumber(e?.call?.number());
            dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
        });
        call.on(VoxImplant.CallEvents.MessageReceived, (e: any) => {
            try {
                const headers = (e.call as Call).headers();
                const number = headers["X-transfer"] ? cleanNumber(headers["X-originalnumber"]) : cleanNumber(e?.call?.number());
                console.log(`MessageReceived-text: ${e.text}`)
                const message_json = JSON.parse(e.text)
                switch (message_json.operation) {
                    case 'TRANSFER-CONNECTED':
                        dispatch({
                            type: typeVoximplant.CONNECTED_TRANSFER_CALL,
                            payload: {
                                number,
                                call: e.call,
                            }
                        })
                        break;
                    case 'TRANSFER-DISCONNECTED':
                        dispatch(emitEvent({
                            event: 'deleteTicket',
                            data: {
                                conversationid: message_json?.conversationid,
                                userid: 0, //userType === "AGENT" ? 0 : agentSelected?.userid,
                                getToken: false //userType === "SUPERVISOR"
                            }
                        }));
                        break;
                    case 'TRANSFER-HANGUP': case 'TRANSFER-FAILED':
                        if (transferdata[`${message_json?.conversationid}`] === message_json.tranfernumber
                            || transferdata[`${message_json?.conversationid}`] === message_json.tranfername
                        ) {
                            dispatch({
                                type: typeVoximplant.RESET_TRANSFER_CALL,
                                payload: {
                                    number,
                                }
                            })
                        }
                        break;
                    default:
                        break;
                }
            }
            catch (e) { console.log(e) }
        })
        return
    } else if (type === typeVoximplant.ANSWER_CALL) {
        const call = payload.call;
        const method = payload.method;
        const number = cleanNumber(payload.number);
        call?.answer();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "CONNECTED", number } });

        if (method === "simultaneous") {
            const callGo = payload.callComplete as ICallGo;
            const splitIdentifier = callGo.identifier.split("-");
            const data: ITicket = {
                conversationid: parseInt(splitIdentifier[3]),
                ticketnum: splitIdentifier[5],
                personid: parseInt(splitIdentifier[4]),
                communicationchannelid: parseInt(splitIdentifier[2]),
                status: "ASIGNADO",
                imageurldef: "",
                firstconversationdate: callGo.initCallDate || "",
                personlastreplydate: callGo.personAnswerCallDate || "",
                countnewmessages: 1,
                usergroup: "",
                displayname: callGo.name,
                coloricon: "",
                communicationchanneltype: "VOXI",
                lastmessage: "LLAMADA ENTRANTE",
                personcommunicationchannel: `${number}_VOXI`,
                communicationchannelsite: callGo.site || "",
                lastreplyuser: "",
                commentexternalid: callGo.accessURL || ""
            }
            //enviar a los otros supervisores
            dispatch(emitEvent({
                event: 'newCallTicket',
                data: {
                    ...data,
                    newuserid: 0,
                    corpid: parseInt(splitIdentifier[0]),
                    orgid: parseInt(splitIdentifier[1]),
                }
            }));

            //agregar el ticket con el control de llamada
            dispatch({
                type: typeInbox.NEW_TICKET_CALL,
                payload: {
                    ...data,
                    call: callGo.call
                }
            })
        }
        //actualizar la fecha de contestado en la lista de tickets
        dispatch({ type: typeInbox.CALL_CONNECTED, payload: action.payload.conversationid });
        return
    } else if (type === typeVoximplant.REJECT_CALL) {
        const { call, ticketSelected } = payload;
        const headers = (call as Call).headers()
        const number = cleanNumber(payload.number);
        call?.reject();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
        if (headers["X-transfer"]) {
            dispatch(emitEvent({
                event: 'deleteTicket',
                data: {
                    conversationid: ticketSelected?.conversationid,
                    ticketnum: ticketSelected?.ticketnum,
                    status: ticketSelected?.status,
                    isanswered: ticketSelected?.isAnswered,
                    usergroup: ticketSelected?.usergroup,
                    userid: 0, //userType === "AGENT" ? 0 : agentSelected?.userid,
                    getToken: false //userType === "SUPERVISOR"
                }
            }));
        }
        return
    } else if (type === typeVoximplant.HANGUP_CALL) {
        const call = payload.call;
        const ticketSelected = payload.ticketSelected;
        const number = cleanNumber(payload.number);
        call?.hangup();
        dispatch({ type: typeVoximplant.MANAGE_STATUS_CALL, payload: { status: "DISCONNECTED", number } });
        if (ticketSelected) {
            const headers = (call as Call).headers()
            if (headers["X-transfer"]) {
                dispatch(emitEvent({
                    event: 'deleteTicket',
                    data: {
                        conversationid: ticketSelected?.conversationid,
                        ticketnum: ticketSelected?.ticketnum,
                        status: ticketSelected?.status,
                        isanswered: ticketSelected?.isAnswered,
                        usergroup: ticketSelected?.usergroup,
                        userid: 0, //userType === "AGENT" ? 0 : agentSelected?.userid,
                        getToken: false //userType === "SUPERVISOR"
                    }
                }));
            }
        }
        return
    } else if (type === typeVoximplant.HOLD_CALL) {
        const call = payload.call;
        if ((call as Call).active() !== payload.flag) {
            // const number = cleanNumber(payload.number);
            await call?.setActive(payload.flag);
        }
        else if (payload.flag === true) {
            call?.sendMessage(JSON.stringify({
                operation: 'HOLD-STOP'
            }))
        }
        return
    } else if (type === typeVoximplant.MUTE_CALL) {
        const call = payload.call;
        // const number = cleanNumber(payload.number);
        call?.muteMicrophone();
        return
    } else if (type === typeVoximplant.UNMUTE_CALL) {
        const call = payload.call;
        // const number = cleanNumber(payload.number);
        call?.unmuteMicrophone();
        return
    } else if (type === typeVoximplant.TRANSFER_CALL ) {
        const { url, number, transfernumber, transfername, conversationid } = payload;
        const cleannumber = cleanNumber(number);
        transferdata[`${conversationid}`] = transfernumber;
        dispatch({
            type: typeVoximplant.INIT_TRANSFER_CALL,
            payload: {
                number: cleannumber,
                transfernumber: transfernumber,
                transfername: transfername,
            }
        })
        fetch(url, { method: 'GET' })
            .catch(x => {
            console.log(x)
            })
            .then(() => {
                dispatch(execute(
                    conversationTransferStatus({
                        conversationid: conversationid,
                        status: "ACTIVO",
                        type: "TRANSFER"
                    })
                ))
            });
        return
    } else if (type === typeVoximplant.COMPLETE_TRANSFER_CALL) {
        const { call, number, conversationid } = payload;
        call?.sendMessage(JSON.stringify({
            operation: 'TRANSFER-COMPLETE',
            number: number
        }))
        dispatch(execute(
            conversationTransferStatus({
                conversationid: conversationid,
                status: "INACTIVO",
                type: "TRANSFER"
            })
        ))
        return
    } else if (type === typeVoximplant.HANGUP_TRANSFER_CALL) {
        const call = payload;
        const number = cleanNumber(call?.number());
        call?.sendMessage(JSON.stringify({
            operation: 'TRANSFER-HANGUP'
        }))
        dispatch({
            type: typeVoximplant.RESET_TRANSFER_CALL,
            payload: {
                number,
            }
        })
        return
    } else if (type === typeVoximplant.HOLD_TRANSFER_CALL) {
        const call = payload.call;
        const number = cleanNumber(call?.number());
        dispatch({
            type: typeVoximplant.SET_TRANSFER_CALL,
            payload: {
                number,
                hold: !payload.hold,
                holddate: !payload.hold ? new Date().toISOString() : undefined,
            }
        })
        call?.sendMessage(JSON.stringify({
            operation: 'TRANSFER-HOLD',
            hold: !payload.hold
        }))
        return
    } else if (type === typeVoximplant.MUTE_TRANSFER_CALL) {
        const call = payload;
        const number = cleanNumber(call?.number());
        dispatch({
            type: typeVoximplant.SET_TRANSFER_CALL,
            payload: {
                number,
                mute: true
            }
        })
        call?.sendMessage(JSON.stringify({
            operation: 'TRANSFER-MUTE',
            hold: !payload.hold
        }))
        return
    } else if (type === typeVoximplant.UNMUTE_TRANSFER_CALL) {
        const call = payload;
        const number = cleanNumber(call?.number());
        dispatch({
            type: typeVoximplant.SET_TRANSFER_CALL,
            payload: {
                number,
                mute: false
            }
        })
        call?.sendMessage(JSON.stringify({
            operation: 'TRANSFER-UNMUTE',
            hold: !payload.hold
        }))
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
            return
        }
    }

    return next(action)
};

export default calVoximplantMiddleware;