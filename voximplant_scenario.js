/* eslint-disable no-undef */
// Enable ACD module
require(Modules.ACD);
require(Modules.Player);
require(Modules.ASR);

const URL_SERVICES = "https://zyxmelinux2.zyxmeapp.com/zyxme/services/api/";

var request,
    originalCall,
    callerid,
    statusInterval,
    holdplayer,
    identifier,
    site,
    personName,
    lastagentid = 2,
    sessionID = "",
    messageWelcome = "En estos momentos te estamos derivando con un asesor",
    messageBusy = "Todos los operadores están actualmente fuera de línea, intente llamar de nuevo más tarde",
    welcomeTone = 'http://cdn.voximplant.com/toto.mp3',
    holdTone = 'http://cdn.voximplant.com/yodl.mp3',
    red = {
        recording: false,
        recordingstorage: "",
        recordingquality: "",
    };

VoxEngine.addEventListener(AppEvents.Started, (ev) => {
    sessionID = ev.sessionId;
    Logger.write("voximplant: sessionID: " + sessionID);
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

        identifier = identiff[0];
        personName = result.Name || callerid;
        messageWelcome = result.Properties?.MessageWelcome || messageWelcome;
        messageBusy = result.Properties?.MessageBusy || messageBusy;
        welcomeTone = result.Properties?.WelcomeTone || welcomeTone;
        holdTone = result.Properties?.HoldTone || holdTone;

        Logger.write("voximplant: createticket: " + res.text);
        callback()
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
        "commentexternalid": sessionID,
        "newConversation":  true,
        "status": "ASIGNADO",
        "origin": "OUTBOUND"
    }
    //externalid es el pccowner
    Net.httpRequest(`${URL_SERVICES}voximplant/createticket`, (res) => {
        Logger.write("voximplant: createticket2: " + res.text);
        const result = JSON.parse(res.text);

        if (result.Success != true) {
            callback(null)
        } else {
            identifier = result.Result.split("#")[0]
            personName = result.Result.split("#")[1];
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

function closeTicket(motive) {
    const splitIdentifier = identifier.split("-");
    const bodyClose = {
        "parameters": {
            "p_corpid": parseInt(splitIdentifier[0]),
            "p_orgid": parseInt(splitIdentifier[1]),
            "p_conversationid": parseInt(splitIdentifier[3]),
            "p_status": "CERRADO",
            "p_obs": motive,
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
    if (e.headers["VI-Client-Type"] == "pstn") { //si la llamada viene de un número de la red pública es atendido por la cola acd.
        originalCall = e.call;
        callerid = e.callerid;
        site = e.destination;

        // Add event listeners
        e.call.addEventListener(CallEvents.Connected, handleCallConnected);
        e.call.addEventListener(CallEvents.PlaybackFinished, handlePlaybackFinished);
        e.call.addEventListener(CallEvents.Failed, () => cleanup("LLAMADA FALLIDA"));
        e.call.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR CLIENTE"));
        // Answer call
        createTicket("LLAMADA ENTRANTE", () => {
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

            // saveSessionID()

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

            originalCall.addEventListener(CallEvents.Failed, () => cleanup("LLAMADA FALLIDA"));
            originalCall.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR CLIENTE"));

            e.call.addEventListener(CallEvents.Failed, () => cleanup("LLAMADA FALLIDA"));
            e.call.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR ASESOR"));
            VoxEngine.easyProcess(e.call, originalCall);

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
function cleanup(motive) {
    if (request) {
        // Remove call from queue
        request.cancel();
        request = null;
    }
    closeTicket(motive)
    // terminate session
    VoxEngine.terminate();
}
// Play music after TTS finish
function handlePlaybackFinished(e) {
    e.call.startPlayback(welcomeTone);
}
// Call connected
function handleCallConnected(e) {
    // Put the call into the queue 'MainQueue'
    request = VoxEngine.enqueueACDRequest(`${site}.laraigo`, callerid, {
        headers: {
            "X-identifier": identifier,
            "X-createdatecall": new Date().toISOString(),
            "X-site": site,
            "X-personname": personName
        }
    });
    // Get call status in queue after it was put in the queue
    request.addEventListener(ACDEvents.Queued, function (acdevent) {
        Logger.write("eventACD-Queued: " + JSON.stringify(acdevent));
        request.getStatus()
    });
    // Notify caller about his position in the queue
    request.addEventListener(ACDEvents.Waiting, function (acdevent) {
        Logger.write("eventACD-Waiting: " + JSON.stringify(acdevent));
        var minutesLeft = acdevent.ewt + 1;
        var minutesWord = " minuto.";
        if (minutesLeft > 1) {
            minutesWord = " minutos.";
        }
        //ordinal_suffix_of(acdevent.position)
        //const speech = `Tú eres el número ${acdevent.position} en la cola. El asesor le responderá en ${(acdevent.ewt + 1)} ${minutesWord}`;
        //const speech = `Tú eres el número ${acdevent.position} en la cola.`;
        originalCall.say(messageWelcome, VoiceList.Amazon.es_MX_Mia);
    });
    // Connect caller with operator
    request.addEventListener(ACDEvents.OperatorReached, function (acdevent) {
        VoxEngine.sendMediaBetween(acdevent.operatorCall, originalCall);
        holdCall(acdevent.operatorCall, originalCall)
        acdevent.operatorCall.addEventListener(CallEvents.Disconnected, () => {
            Logger.write("eventACD-CallEvents.Disconnected: " + JSON.stringify(acdevent));
            closeTicket("DESCONECTADO POR ASESOR");
            VoxEngine.terminate()
        });
        clearInterval(statusInterval);
        sendInteraction("LOG", "AGENTE CONTESTÓ LA LLAMADA")
    });
    request.addEventListener(ACDEvents.OperatorCallAttempt, function (acdevent) {
        Logger.write("eventACD-OperatorCallAttempt: " + JSON.stringify(acdevent));
        const agentid = parseInt(acdevent.operatorCall.number().replace("user", "").split(".")[0])
        Logger.write("eventACD-agentid: " + agentid);
        reasignAgent(agentid)
        lastagentid = agentid;
        //acdevent.operatorCall.customData()
    });
    request.addEventListener(ACDEvents.OperatorFailed, function (acdevent) {
        Logger.write("eventACD-OperatorCallAttempt: " + JSON.stringify(acdevent));
        setTimeout(() => {
            request.getStatus()
        }, 1000)
    });
    // No operators are available
    request.addEventListener(ACDEvents.Offline, function (acdevent) {
        Logger.write("eventACD-Offline: " + JSON.stringify(acdevent));
        originalCall.say(messageBusy, VoiceList.Amazon.es_MX_Mia);
        originalCall.addEventListener(CallEvents.PlaybackFinished, function (e) {
            closeTicket("NO HAY ASESORES")
            VoxEngine.terminate();
        });
    });
    // Get current call status in a queue every 30 seconds
    statusInterval = setInterval(request.getStatus, 30000);
}