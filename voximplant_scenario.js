/* eslint-disable no-undef */
// Enable ACD module
require(Modules.ACD);
require(Modules.Player);
require(Modules.ASR);
require(Modules.Conference);

const URL_SERVICES = "https://zyxmelinux2.zyxmeapp.com/zyxmetest/services/api/";
const URL_APILARAIGO = "https://testapix.laraigo.com/api/";
const URL_APIVOXIMPLANT = "https://api.voximplant.com/platform_api/";

let conf;

var request,
    origin,
    callMethod = "SIMULTANEO",
    originalCall,
    originalCall2,
    inboundCalls = [],
    transferCall,
    transferHoldPlayer,
    inTransfer,
    transferTo,
    callerid,
    conversationid,
    statusInterval,
    holdplayer,
    identifier,
    site,
    personName,
    lastagentid = 2,
    accountID = "",
    applicationID = "",
    sessionID = "",
    accessURL = "",
    messageWelcome = "En estos momentos te estamos derivando con un asesor",
    messageBusy = "Todos los operadores están actualmente fuera de línea, intente llamar de nuevo más tarde",
    welcomeTone = 'http://cdn.voximplant.com/toto.mp3',
    holdTone = 'http://cdn.voximplant.com/yodl.mp3',
    red = {
        recording: false,
        recordingstorage: "",
        recordingquality: "",
    },
    userQueueIndex = 0,
    userQueueLimit = 10,
    userQueueLength,
    userQueueData = [],
    retryClose = 0;

VoxEngine.addEventListener(AppEvents.Started, (ev) => {
    accountID = ev.accountId;
    applicationID = ev.applicationId;
    sessionID = ev.sessionId;
    accessURL = ev.accessSecureURL;
    Logger.write("voximplant-Started: " + JSON.stringify(ev));
    Logger.write("voximplant: sessionID: " + sessionID);
});

VoxEngine.addEventListener(AppEvents.HttpRequest, (ev) => {
    const parameters = ev.path.split("?")[1].split("&").reduce((acc, x) => ({
        ...acc,
        [x.split("=")[0]]: x.split("=")[1]
    }), {});

    const userSupervisor = parameters.user;
    const mode = parameters.mode;
    const number = parameters.number;
    
    Logger.write("HttpRequest-mode: " + mode);

    if (mode === "supervision") {
        const supervisorCall = VoxEngine.callUser(userSupervisor, number, "demo", {
            "X-supervision": "truetruetruetrue",
            "X-identifier": identifier,
            "X-site": site,
            "X-personname": personName
        });

        supervisorCall.addEventListener(CallEvents.Disconnected, () => {
            VoxEngine.sendMediaBetween(originalCall2, originalCall);
            VoxEngine.destroyConference(conf);
        });

        supervisorCall.addEventListener(CallEvents.Failed, () => {
            VoxEngine.sendMediaBetween(originalCall2, originalCall);
            VoxEngine.destroyConference(conf);
        });

        supervisorCall.addEventListener(CallEvents.Connected, () => {
            Logger.write("eventACD-userSupervisor: " + "Llamada conectada");
            originalCall2.sendMediaTo(conf);
            originalCall.sendMediaTo(conf);
            conf.sendMediaTo(supervisorCall);
            VoxEngine.sendMediaBetween(originalCall2, originalCall);
        });

        conf = VoxEngine.createConference();
    }
    else if (mode === 'transfer') {
        transferTo = parameters.number;
        Logger.write("transfer-transferTo: " + transferTo);
        transferTrigger(transferTo)
    }
});

VoxEngine.addEventListener(AppEvents.CallAlerting, handleInboundCall);

function cleanExpiration(time) {
    if (time === "month3") {
        return VoxEngine.RecordExpireTime.DEFAULT;
    } else if (time === "month6") {
        return VoxEngine.RecordExpireTime.SIXMONTHS;
    } else if (time === "year1") {
        return VoxEngine.RecordExpireTime.ONEYEAR;
    } else if (time === "year2") {
        return VoxEngine.RecordExpireTime.TWOYEARS;
    } else if (time === "year3") {
        return VoxEngine.RecordExpireTime.THREEYEARS;
    }
    return VoxEngine.RecordExpireTime.DEFAULT;
}

function createTicket(content, callback) {
    const bodyZyx = {
        "platformType": "VOXI",
        "personId": callerid,
        "type": "text",
        "content": content,
        "siteId": site,
        "postId": sessionID,
        "commentId": accessURL,
        "smoochWebProfile": `{"firstName": "${callerid}", "phone": "${callerid}", "externalId": "${callerid}"}`
    }
    //externalid es el pccowner
    Net.httpRequest(`${URL_SERVICES}ServiceLogicHook/ProcessMessageIn`, (res) => {
        const result = JSON.parse(res.text).Result;

        const identiff = result.Identifier.split("#");
        try {
            if (identiff[1]) {
                const aa = JSON.parse(identiff[1]);
                if (aa) {
                    red = aa;
                }
            }
        } catch (e) { }

        conversationid = result?.Conversationid;
        identifier = identiff[0];
        personName = result.Name || callerid;
        messageWelcome = result.Properties?.MessageWelcome || messageWelcome;
        messageBusy = result.Properties?.MessageBusy || messageBusy;
        welcomeTone = result.Properties?.WelcomeTone || welcomeTone;
        holdTone = result.Properties?.HoldTone || holdTone;
        callMethod = result.Properties?.CallMethod || callMethod;

        Logger.write("voximplant: createticket: " + res.text);
        callback(result.NewConversation)
    }, {
        method: "POST",
        postData: JSON.stringify(bodyZyx),
        headers: [
            "Content-Type: application/json;charset=utf-8"
        ]
    })
}

function createTicket2(callback) {
    const splitIdentifier = identifier.split("-");

    const body = {
        "communicationchanneltype": "VOXI",
        "personcommunicationchannel": `${callerid}_VOXI`,
        "communicationchannelsite": site,
        "corpid": parseInt(splitIdentifier[0]),
        "orgid": parseInt(splitIdentifier[1]),
        "communicationchannelid": parseInt(splitIdentifier[2]),
        "conversationid": 0,
        "userid": lastagentid,
        "lastuserid": lastagentid,
        "personid": 0,
        "typeinteraction": "NINGUNO",
        "typemessage": "text",
        "lastmessage": "LLAMADA SALIENTE",
        "postexternalid": sessionID,
        "commentexternalid": accessURL,
        "newConversation": true,
        "status": "ASIGNADO",
        "origin": "OUTBOUND"
    }
    //externalid es el pccowner
    Net.httpRequest(`${URL_SERVICES}voximplant/createticket`, (res) => {
        Logger.write("voximplant: createticket2: " + res.text);
        const result = JSON.parse(res.text);

        if (result.Success !== true) {
            callback(null)
        } else {
            identifier = result.Result.split("#")[0]
            personName = result.Result.split("#")[1];

            conversationid = identifier?.split("-")[3];

            callback(identifier)
        }
    }, {
        method: "POST",
        postData: JSON.stringify(body),
        headers: [
            "Content-Type: application/json;charset=utf-8"
        ]
    })
}

function closeTicket(motive, obs = "") {
    if (identifier) {
        const splitIdentifier = identifier.split("-");
        const bodyClose = {
            "parameters": {
                "p_corpid": parseInt(splitIdentifier[0]),
                "p_orgid": parseInt(splitIdentifier[1]),
                "p_conversationid": parseInt(splitIdentifier[3]),
                "p_status": "CERRADO",
                "p_obs": obs ? obs : motive,
                "p_motivo": motive,
                "p_messagesourcekey1": `${callerid}_VOXI`,
                "autoclosetime": 60,
                "communicationchannelsite": site,
                "communicationchanneltype": "VOXI",
                "lastsupervisorid": 0,
                "lastasesorid": lastagentid,
                "p_username": "voxi-admin",
                "p_userid": lastagentid,
                "closeby": "CHATFLOW",
                "closemessage": ""
            }
        }
        Logger.write("closeTicket-body: " + JSON.stringify(bodyClose));
        Net.httpRequest(`${URL_SERVICES}ServiceLogicHook/CloseTicket`, (res) => {
            Logger.write("closeTicket-res: " + res.text);
        }, {
            method: "POST",
            postData: JSON.stringify(bodyClose),
            headers: [
                "Content-Type: application/json;charset=utf-8"
            ]
        })
    } else {
        if (retryClose < 3) {
            setTimeout(() => {
                closeTicket(motive, obs)
            }, 1000);
        }
        retryClose = retryClose + 1;
    }
}
function reasignAgent(agentid) {
    const body = {
        agentid,
        identifier,
        callerid,
        site,
        platformtype: "VOXI",
        previewagentid: lastagentid
    }
    Logger.write("reasignAgent-body: " + JSON.stringify(body));
    Net.httpRequest(`${URL_SERVICES}voximplant/changeagent`, (res) => {
        Logger.write("reasignAgent-res: " + res.text);
    }, {
        method: "POST",
        postData: JSON.stringify(body),
        headers: [
            "Content-Type: application/json;charset=utf-8"
        ]
    })
}

function sendInteraction(type, text) {
    const splitIdentifier = identifier.split("-");
    const body = {
        "communicationchanneltype": "VOXI",
        "personcommunicationchannel": `${callerid}_VOXI`,
        "communicationchannelsite": site,
        "corpid": parseInt(splitIdentifier[0]),
        "orgid": parseInt(splitIdentifier[1]),
        "communicationchannelid": parseInt(splitIdentifier[2]),
        "conversationid": parseInt(splitIdentifier[3]),
        "userid": lastagentid,
        "personid": parseInt(splitIdentifier[4]),
        "typeinteraction": "NINGUNO",
        "typemessage": type,
        "lastmessage": text,
    }
    Logger.write("insert/withdata-body: " + JSON.stringify(body));
    Net.httpRequest(`${URL_SERVICES}voximplant/call/answered`, (res) => {
        Logger.write("insert/withdata-res: " + res.text);
    }, {
        method: "POST",
        postData: JSON.stringify(body),
        headers: [
            "Content-Type: application/json;charset=utf-8"
        ]
    })
}
// Handle inbound call
function handleInboundCall(e) {
    if (e.headers["VI-Client-Type"] === "pstn") { //si la llamada viene de un número de la red pública es atendido por la cola acd.
        origin = origin || 'INBOUND';
        originalCall = e.call; // Call del cliente
        callerid = e.callerid;
        site = e.destination;
        // Add event listeners
        e.call.addEventListener(CallEvents.Connected, handleCallConnected);
        e.call.addEventListener(CallEvents.PlaybackFinished, handlePlaybackFinished);
        e.call.addEventListener(CallEvents.Failed, (e) => cleanup(`LLAMADA FALLIDA`, `code: ${e.code} - reason ${e.reason} - name: ${e.name}`));
        e.call.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR CLIENTE"));
        // Answer call
        createTicket("LLAMADA ENTRANTE", (newConversation) => {
            if (!newConversation) {
                //Existe una llamada en curso
                originalCall.hangup()
                return;
            }
            e.call.answer();
            if (red.recording) {
                e.call.record({
                    transcribe: false,
                    language: ASRLanguage.SPANISH_ES,
                    name: identifier + ".mp3",
                    contentDispositionFilename: identifier + ".mp3",
                    recordNamePrefix: "" + site,
                    hd_audio: ((red.recordingquality || "default") === "default" ? undefined : red.recordingquality === "hd"),
                    lossless: ((red.recordingquality || "default") === "default" ? undefined : red.recordingquality === "lossless"),
                    expire: cleanExpiration(red.recordingstorage),

                })
            }
        })
    }
    else {
        origin = origin || 'OUTBOUND';
        if (!e.customData) {
            Logger.write("voximplant: Error, not have customdata with number from to call");
            return
        }

        identifier = e.customData.split(".")[0];
        site = e.customData.split(".")[1];
        lastagentid = parseInt(e.customData.split(".")[2]);
        callerid = e.destination.replace("+", "");

        const identiff = e.customData.split(".")[3];
        try {
            if (identiff) {
                Logger.write("eventACD-red: " + identiff);
                const aa = JSON.parse(identiff);
                if (aa) {
                    red = aa
                }
            }
        } catch (e) { }

        //outbound call
        createTicket2((identiff) => {
            if (!identiff) {
                Logger.write("voximplant: cant create ticket on outbound");
                return
            }
            if (/^\d+$/.test(e.destination.replace("+", ""))) {
                originalCall = VoxEngine.callPSTN(e.destination, site);
            } else { // es una llamada interna (entre asesores o anexos)
                originalCall = VoxEngine.callUser(e.destination, e.callerid);
            }

            originalCall.addEventListener(CallEvents.Connected, (e) => {
                sendInteraction("LOG", "CLIENTE CONTESTÓ LA LLAMADA")
            });
												 
            if (red.recording) {
                e.call.record({
                    transcribe: false,
                    language: ASRLanguage.SPANISH_ES,
                    name: identifier + ".mp3",
                    contentDispositionFilename: identifier + ".mp3",
                    recordNamePrefix: "" + site,
                    hd_audio: ((red.recordingquality || "default") === "default" ? undefined : red.recordingquality === "hd"),
                    lossless: ((red.recordingquality || "default") === "default" ? undefined : red.recordingquality === "lossless"),
                    expire: cleanExpiration(red.recordingstorage)
                })
            }

            VoxEngine.easyProcess(e.call, originalCall);
            originalCall.removeEventListener(CallEvents.Disconnected);
            e.call.removeEventListener(CallEvents.Disconnected);

            originalCall.addEventListener(CallEvents.Failed, (e) => cleanup(`LLAMADA FALLIDA`, `code: ${e.code} - reason ${e.reason} - name: ${e.name}`));
            originalCall.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR CLIENTE"));

            e.call.addEventListener(CallEvents.Failed, (e) => cleanup(`LLAMADA FALLIDA`, `code: ${e.code} - reason ${e.reason} - name: ${e.name}`));
            e.call.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR ASESOR"));

            originalCall2 = e.call; // Call del agente
            holdCall(e.call, originalCall)
        })
    };
}

function holdCall(a, b) {
    a.addEventListener(CallEvents.OnHold, function (e) {
        holdplayer = VoxEngine.createURLPlayer(holdTone, true, true);
        Logger.write("incoming leg on hold");
        holdplayer.resume();
        holdplayer.sendMediaTo(b);
        holdplayer.sendMediaTo(a);
    });
    a.addEventListener(CallEvents.OffHold, function (e) {
        Logger.write("incoming leg off hold");
        holdplayer.stop();
        VoxEngine.sendMediaBetween(a, b);
    });
}

// Terminate call and session
function cleanup(motive, obs = "") {
    Logger.write("cleanup-inTransfer: " + JSON.stringify(inTransfer));
    if (inTransfer) {
        inTransfer = null;
    }
    else {
        if (transferCall) {
            transferCall.sendMessage(JSON.stringify({
                operation: "TRANSFER-DISCONNECTED",
                conversationid: conversationid
            }));
        }
        if (request) {
            // Remove call from queue
            Logger.write("cleanup-request.cancel");
            request.cancel();
            request = null;
        }
        closeTicket(motive, obs)
        // terminate session
        VoxEngine.terminate();
    }
}
// Play music after TTS finish
function handlePlaybackFinished(e) {
    e.call.startPlayback(welcomeTone);
}

function handleSpreadCall() {
    userQueueData.slice(userQueueIndex * userQueueLimit, userQueueIndex * userQueueLimit + userQueueLimit).forEach(user => {
        Logger.write("spreadCall-user: " + JSON.stringify(user));
        let incall = VoxEngine.callUser(user.user_name, callerid, user.user_name, {
            "X-identifier": identifier,
            "X-createdatecall": new Date().toISOString(),
            "X-site": site,
            "X-personname": personName,
            "X-accessURL": accessURL,
            "X-method": "simultaneous",
        })
        incall.addEventListener(CallEvents.Connected, (e) => {
            Logger.write("spreadCall-Connected: " + JSON.stringify(e));
            inboundCalls.filter(ic => ic.id !== e.id).forEach(ic2 => {
                Logger.write("spreadCall-Connected-toHangup: " + JSON.stringify(ic2));
                ic2.call.sendMessage(JSON.stringify({
                    operation: "SPREAD-HANGUP",
                    conversationid: conversationid,
                }))
                ic2.call.hangup();
            })
            originalCall2 = e.call; // Call del agente
            const agentid = parseInt(inboundCalls.find(ic => ic.id === e.id).destination.replace("user", "").split(".")[0])
            reasignAgent(agentid)
            sendInteraction("LOG", "AGENTE CONTESTÓ LA LLAMADA")
            lastagentid = agentid;
            VoxEngine.sendMediaBetween(e.call, originalCall);
            holdCall(e.call, originalCall)
            e.call.removeEventListener(CallEvents.Failed)
            e.call.removeEventListener(CallEvents.Disconnected)
            e.call.addEventListener(CallEvents.Disconnected, (e2) => {
                Logger.write("spreadCall-Disconnected: " + JSON.stringify(e2));
                Logger.write("spreadCall-inTransfer: " + JSON.stringify(inTransfer));
                if (inTransfer) {
                    inTransfer = null;
                }
                else {
                    closeTicket("DESCONECTADO POR ASESOR");
                    VoxEngine.terminate()
                }
            });
        });
        incall.addEventListener(CallEvents.Failed, (e) => {
            inboundCalls = inboundCalls.filter(ic => ic.id !== e.id)
            Logger.write("spreadCall-Failed-inboundCalls: " + JSON.stringify(inboundCalls));
            if (inboundCalls.length === 0) {
                userQueueIndex += 1;
                if (userQueueIndex < userQueueLength) {
                    handleSpreadCall()
                }
                else {
                    closeTicket("NO HAY ASESORES")
                    VoxEngine.terminate()
                }
            }
        });
        inboundCalls.push({
            id: incall.id(),
            destination: user.user_name,
            call: incall,
        })
    })
    Logger.write("spreadCall-inboundCalls: " + JSON.stringify(inboundCalls));
}

function handleACDQueue() {
    // Put the call into the queue 'MainQueue'
    request = VoxEngine.enqueueACDRequest(`${site}.laraigo`, callerid, {
        headers: {
            "X-identifier": identifier,
            "X-createdatecall": new Date().toISOString(),
            "X-site": site,
            "X-personname": personName,
            "X-accessURL": accessURL
        }
    });
    // Get call status in queue after it was put in the queue
    request.addEventListener(ACDEvents.Queued, function (acdevent) {
        Logger.write("ACDEvents-Queued: " + JSON.stringify(acdevent));
        request.getStatus()
    });
    // Notify caller about his position in the queue
    request.addEventListener(ACDEvents.Waiting, function (acdevent) {
        Logger.write("ACDEvents-Waiting: " + JSON.stringify(acdevent));
        // var minutesLeft = acdevent.ewt + 1;
        // var minutesWord = " minuto.";
        // if (minutesLeft > 1) {
        //     minutesWord = " minutos.";
        // }
        //ordinal_suffix_of(acdevent.position)
        //const speech = `Tú eres el número ${acdevent.position} en la cola. El asesor le responderá en ${(acdevent.ewt + 1)} ${minutesWord}`;
        //const speech = `Tú eres el número ${acdevent.position} en la cola.`;
        originalCall.say(messageWelcome, VoiceList.Amazon.es_MX_Mia);
    });
    // Connect caller with operator
    request.addEventListener(ACDEvents.OperatorReached, function (acdevent) {
        Logger.write("ACDEvents-OperatorReached: " + JSON.stringify(acdevent));
        VoxEngine.sendMediaBetween(acdevent.operatorCall, originalCall);
        holdCall(acdevent.operatorCall, originalCall)
        acdevent.operatorCall.addEventListener(CallEvents.Disconnected, () => {
            Logger.write("ACDEvents-OperatorReached-Disconnected: " + JSON.stringify(acdevent));
            Logger.write("ACDEvents-OperatorReached-inTransfer: " + JSON.stringify(inTransfer));
            if (inTransfer) {
                inTransfer = null;
            }
            else {
                closeTicket("DESCONECTADO POR ASESOR");
                VoxEngine.terminate()
            }
        });
        clearInterval(statusInterval);
        sendInteraction("LOG", "AGENTE CONTESTÓ LA LLAMADA")
    });
    request.addEventListener(ACDEvents.OperatorCallAttempt, function (acdevent) {
        Logger.write("ACDEvents-OperatorCallAttempt: " + JSON.stringify(acdevent));
        originalCall2 = acdevent.operatorCall; // Call del agente
        const agentid = parseInt(acdevent.operatorCall.number().replace("user", "").split(".")[0])
        Logger.write("ACDEvents-agentid: " + agentid);
        reasignAgent(agentid)
        lastagentid = agentid;
        //acdevent.operatorCall.customData()
    });
    request.addEventListener(ACDEvents.OperatorFailed, function (acdevent) {
        Logger.write("ACDEvents-OperatorFailed: " + JSON.stringify(acdevent));
        Logger.write("eventACD-OperatorCallAttempt: " + JSON.stringify(acdevent));
        setTimeout(() => {
            request.getStatus()
        }, 1000)
    });
    // No operators are available
    request.addEventListener(ACDEvents.Offline, function (acdevent) {
        Logger.write("ACDEvents-Offline: " + JSON.stringify(acdevent));
        originalCall.say(messageBusy, VoiceList.Amazon.es_MX_Mia);
        originalCall.addEventListener(CallEvents.PlaybackFinished, function (e) {
            closeTicket("NO HAY ASESORES")
            VoxEngine.terminate();
        });
    });
    // Get current call status in a queue every 30 seconds
    statusInterval = setInterval(request.getStatus, 30000);
}

// Call connected
function handleCallConnected(e) {
    if (callMethod === "SIMULTANEO") {
        handleSimultaneousCall()
    } else {
        handleACDQueue()
    }
}

function handleSimultaneousCall() {
    Net.httpRequest(`${URL_APILARAIGO}voximplant/getChildrenAccounts`, (res1) => {
        Logger.write("handleCallConnected: " + res1.text);
        const laraigo_res = JSON.parse(res1.text).result;
        const api_key = laraigo_res?.[0]?.api_key;
        if (api_key) {
            Logger.write("handleCallConnected-accountID: " + accountID);
            Logger.write("handleCallConnected-applicationID: " + applicationID);
            Net.httpRequest(`${URL_APIVOXIMPLANT}GetUsers/?account_id=${accountID}&application_id=${applicationID}&api_key=${api_key}&user_active=true&count=20&with_skills=true&with_queues=true&acd_status=READY`, (res2) => {
                Logger.write("handleCallConnected-GetUsers: " + res2.text);
                const voxi_res = JSON.parse(res2.text).result;
                if (voxi_res.length === 0) {
                    closeTicket("NO HAY ASESORES")
                    VoxEngine.terminate();
                }
                else {
                    userQueueData = voxi_res.filter(user => user.acd_queues.map(aq => aq.acd_queue_name.split('.')?.[1]).includes('laraigo'))
                    userQueueLength = Math.ceil(userQueueData.length / userQueueLimit);
                    originalCall.say(messageWelcome, VoiceList.Amazon.es_MX_Mia);
                    handleSpreadCall()
                }
            }, { method: "GET" })
        }
        else {
            handleACDQueue()
        }
    }, {
        method: "POST",
        postData: JSON.stringify({
            child_account_id: accountID
        }),
        headers: [
            "Content-Type: application/json;charset=utf-8"
        ]
    });
}

function transferTrigger(number) {
    // Send holdTone to PSTN
    holdplayer = VoxEngine.createURLPlayer(holdTone, true, true);
    holdplayer.resume();
    holdplayer.sendMediaTo(originalCall);
    holdplayer.sendMediaTo(originalCall2);
    if (/^\d+$/.test(number.replace("+", ""))) {
        transferCall = VoxEngine.callPSTN(number, site, number, {
            "X-transfer": "truetruetruetrue",
            "X-identifier": identifier,
            "X-site": site,
            "X-personname": personName,
            "X-accessURL": accessURL,
            "X-originalnumber": originalCall.number(),
            "X-transfernumber": number,
            "X-conversationid": conversationid,
        });
        VoxEngine.sendMediaBetween(transferCall, originalCall2);
    } else {
        transferCall = VoxEngine.callUser(number, number, "transfer", {
            "X-transfer": "truetruetruetrue",
            "X-identifier": identifier,
            "X-site": site,
            "X-personname": personName,
            "X-accessURL": accessURL,
            "X-originalnumber": originalCall.number(),
            "X-transfernumber": number,
            "X-conversationid": conversationid,
        });
    }
    transferCall.addEventListener(CallEvents.Connected, (e) => {
        transferOnConnect(e, originalCall2)
    });
    transferCall.addEventListener(CallEvents.Failed, (e) => {
        transferOnFailed(e, originalCall2)
    });
    originalCall2.removeEventListener(CallEvents.MessageReceived);
    originalCall2.addEventListener(CallEvents.MessageReceived, (e) => {
        Logger.write("transfer-MessageReceived: " + JSON.stringify(e));
        transferOperations(e);
    })
}

function transferHold(a, b) {
    a.addEventListener(CallEvents.OnHold, function (e) {
        transferHoldPlayer = VoxEngine.createURLPlayer(holdTone, true, true);
        Logger.write("incoming leg on hold");
        transferHoldPlayer.resume();
        transferHoldPlayer.sendMediaTo(b);
        transferHoldPlayer.sendMediaTo(a);
    });
    a.addEventListener(CallEvents.OffHold, function (e) {
        Logger.write("incoming leg off hold");
        transferHoldPlayer.stop();
        VoxEngine.sendMediaBetween(a, b);
    });
}

function transferOnConnect(event, call2) {
    // 3rd leg event
    Logger.write("transfer-connected: " + JSON.stringify(event));
    // Send audio between 2nd, 3er leg
    VoxEngine.sendMediaBetween(event.call, call2);
    transferHold(event.call, call2);
    // Advise transfer complete to 2nd leg
    call2.sendMessage(JSON.stringify({
        operation: "TRANSFER-CONNECTED"
    }));
    event.call.addEventListener(CallEvents.Disconnected, (e) => {
        Logger.write("transfer-Disconnected: " + JSON.stringify(e));
        if (transferHoldPlayer) {
            transferHoldPlayer.stop();
        }
        // Advise transfer disconnected to 2nd leg
        call2.sendMessage(JSON.stringify({
            operation: "TRANSFER-HANGUP",
            conversationid: conversationid,
            number: e.call.number(),
            tranfernumber: e.call.callerid(),
            tranfername: e.call.displayName(),
        }));
        transferCall = null;
    });
}

function transferOnFailed(event, call2) {
    // 3rd leg event
    Logger.write("transfer-failed: " + JSON.stringify(event));
    // Advise transfer failed to 2nd leg
    call2.sendMessage(JSON.stringify({
        operation: "TRANSFER-FAILED",
        conversationid: conversationid,
        number: event.call.number(),
        tranfernumber: event.call.callerid(),
        tranfername: event.call.displayName(),
    }));
    transferCall = null;
}

function transferOperations(event) {
    // 2rd leg event
    const message_json = JSON.parse(event.text);
    switch (message_json.operation) {
        case 'HOLD-STOP':
            holdplayer.stop();
            VoxEngine.sendMediaBetween(event.call, originalCall);
            break;
    }
    if (transferCall) {
        switch (message_json.operation) {
            case 'TRANSFER-COMPLETE':
                transferComplete(message_json)
                break;
            case 'TRANSFER-HANGUP':
                transferCall.sendMessage(JSON.stringify({
                    operation: "TRANSFER-DISCONNECTED",
                    conversationid: conversationid
                }));
                transferCall.hangup();
                transferCall = null;
                break;
            case 'TRANSFER-HOLD':
                if (message_json.hold) {
                    transferCall.stopMediaTo(originalCall2)
                    originalCall2.stopMediaTo(transferCall)
                }
                else {
                    VoxEngine.sendMediaBetween(transferCall, originalCall2);
                }
                break;
            case 'TRANSFER-MUTE':
                originalCall2.stopMediaTo(transferCall)
                break;
            case 'TRANSFER-UNMUTE':
                originalCall2.sendMediaTo(transferCall)
                break;
            default:
                break;
        }
    }
}

function transferComplete(data) {
    const { number } = data;
    // Send audio between 1nd, 3er leg
    VoxEngine.sendMediaBetween(transferCall, originalCall);
    holdCall(transferCall, originalCall)
    if (/^\d+$/.test(number.replace("+", ""))) {
        const agentid = number.replace("+", "")
        Logger.write("transfer-Complete-agentid: " + agentid);
        reasignAgent(2)
        lastagentid = 2;
    } else {
        const agentid = parseInt(number.replace("user", "").split(".")[0])
        Logger.write("transfer-Complete-agentid: " + agentid);
        reasignAgent(agentid)
        lastagentid = agentid;
    }
    // Hangup 2nd leg
    inTransfer = true;
    originalCall2.hangup();
    // Assign 3er leg to 2nd leg
    originalCall2 = transferCall;
    // Add all 
    originalCall2.removeEventListener(CallEvents.Disconnected);
    originalCall2.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR ASESOR"));
}
