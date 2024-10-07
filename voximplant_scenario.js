require(Modules.ACD);
require(Modules.Player);
require(Modules.Conference);
require(Modules.ASR);
require(Modules.AI);
require(Modules.IVR);

const URL_SERVICES = "https://zyxmelinux2.zyxmeapp.com/zyxmetest/services/api/";
const URL_APILARAIGO = "https://testapix.laraigo.com/api/";
const URL_APIVOXIMPLANT = "https://api.voximplant.com/platform_api/";
const SITE_MASK = '';
const VOICE_ES = VoiceList.Microsoft.Neural.es_PE_CamilaNeural;
let conf;

var request,
    origin,
    callMethod = "SIMULTANEO",
    call,
    call2,
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
    welcomeTone = "http://cdn.voximplant.com/toto.mp3",
    holdTone = "http://cdn.voximplant.com/yodl.mp3",
    red = {
        recording: false,
        recordingstorage: "",
        recordingquality: "",
    },
    userQueueIndex = 0,
    userQueueLimit = 10,
    userQueueLength,
    userQueueData = [],
    retryClose = 0,
    afterHour = false,
    messageAfterHour = "",
    configSIP = null,
    flow,
    variables = {};

VoxEngine.addEventListener(AppEvents.Started, (ev) => {
    accountID = ev.accountId;
    applicationID = ev.applicationId;
    sessionID = ev.sessionId;
    accessURL = ev.accessSecureURL;
    Logger.write("voximplant-Started: " + JSON.stringify(ev));
    Logger.write("voximplant: sessionID: " + sessionID);
});

VoxEngine.addEventListener(AppEvents.HttpRequest, (ev) => {
    const parameters = ev.path
        .split("?")[1]
        .split("&")
        .reduce(
            (acc, x) => ({
                ...acc,
                [x.split("=")[0]]: x.split("=")[1],
            }),
            {}
        );

    const userSupervisor = parameters.user;
    const mode = parameters.mode;
    const number = parameters.number;

    Logger.write("HttpRequest-mode: " + mode);

    if (mode === "supervision") {
        const supervisorCall = VoxEngine.callUser(userSupervisor, number, "demo", {
            "X-supervision": "truetruetruetrue",
            "X-identifier": identifier,
            "X-site": site,
            "X-personname": personName,
        });

        supervisorCall.addEventListener(CallEvents.Disconnected, () => {
            VoxEngine.sendMediaBetween(call2, call);
            VoxEngine.destroyConference(conf);
        });

        supervisorCall.addEventListener(CallEvents.Failed, () => {
            VoxEngine.sendMediaBetween(call2, call);
            VoxEngine.destroyConference(conf);
        });

        supervisorCall.addEventListener(CallEvents.Connected, () => {
            Logger.write("eventACD-userSupervisor: " + "Llamada conectada");
            call2.sendMediaTo(conf);
            call.sendMediaTo(conf);
            conf.sendMediaTo(supervisorCall);
            VoxEngine.sendMediaBetween(call2, call);
        });

        conf = VoxEngine.createConference();
    } else if (mode === "transfer") {
        transferTo = parameters.number;
        Logger.write("transfer-transferTo: " + transferTo);
        transferTrigger(transferTo);
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
        platformType: "VOXI",
        personId: callerid,
        type: "text",
        content: content,
        siteId: site,
        postId: sessionID,
        commentId: accessURL,
        smoochWebProfile: `{"firstName": "${callerid}", "phone": "${callerid}", "externalId": "${callerid}"}`,
    };
    //externalid es el pccowner
    Net.httpRequest(
        `${URL_SERVICES}ServiceLogicHook/ProcessMessageIn`,
        (res) => {
            Logger.write("voximplant: createticket: " + res.text);
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
            afterHour = result.Properties?.AfterHours || afterHour;
            messageAfterHour = result.Properties?.MessageAfterHours || messageAfterHour;

            callback(result.NewConversation, afterHour);
        },
        {
            method: "POST",
            postData: JSON.stringify(bodyZyx),
            headers: ["Content-Type: application/json;charset=utf-8"],
        }
    );
}

function createTicket2(origin, callback) {
    const splitIdentifier = (identifier || "0-0-0").split("-");

    const body = {
        communicationchanneltype: "VOXI",
        personcommunicationchannel: `${callerid}_VOXI`,
        communicationchannelsite: site,
        corpid: parseInt(splitIdentifier[0]),
        orgid: parseInt(splitIdentifier[1]),
        communicationchannelid: parseInt(splitIdentifier[2]),
        conversationid: 0,
        userid: lastagentid,
        lastuserid: lastagentid,
        personid: 0,
        typeinteraction: "NINGUNO",
        typemessage: "text",
        lastmessage: origin === "OUTBOUND" ? "LLAMADA SALIENTE" : "LLAMADA ENTRANTE",
        postexternalid: sessionID,
        commentexternalid: accessURL,
        newConversation: true,
        status: "ASIGNADO",
        callrecording: red.recording,
        origin
    };
    //externalid es el pccowner
    Net.httpRequest(
        `${URL_SERVICES}voximplant/createticket`,
        (res) => {
            Logger.write("voximplant: createticket2: " + res.text);
            const result = JSON.parse(res.text);

            if (result.Success !== true) {
                callback(null);
            } else {
                conversationid = identifier?.split("-")[3];
                identifier = result.Result.identifier;
                personName = result.Result.personname;
                configSIP = result.Result.configsip;
                welcomeTone = result.Result.welcometone || welcomeTone;
                holdTone = result.Result.holdTone || holdTone;

                messageWelcome = result.Result.propertiesZyx?.MessageWelcome || messageWelcome;
                messageBusy = result.Result.propertiesZyx?.MessageBusy || messageBusy;
                callMethod = result.Result.propertiesZyx?.CallMethod || callMethod;
                afterHour = result.Result.propertiesZyx?.AfterHours || afterHour;
                messageAfterHour = result.Result.propertiesZyx?.MessageAfterHours || messageAfterHour;

                flow = result.Result?.flow ? JSON.parse(result.Result.flow, afterHour) : null;

                if (result.Result?.red) {
                    red = JSON.parse(result.Result?.red);
                }
                callback(identifier);
            }
        },
        {
            method: "POST",
            postData: JSON.stringify(body),
            headers: ["Content-Type: application/json;charset=utf-8"],
        }
    );
}

function closeTicket(motive, obs = "") {
    if (identifier) {
        const splitIdentifier = identifier.split("-");
        const bodyClose = {
            parameters: {
                p_corpid: parseInt(splitIdentifier[0]),
                p_orgid: parseInt(splitIdentifier[1]),
                p_conversationid: parseInt(splitIdentifier[3]),
                p_status: "CERRADO",
                p_obs: obs ? obs : motive,
                p_motivo: motive,
                p_messagesourcekey1: `${callerid}_VOXI`,
                autoclosetime: 60,
                communicationchannelsite: site,
                communicationchanneltype: "VOXI",
                lastsupervisorid: 0,
                lastasesorid: lastagentid,
                p_username: "voxi-admin",
                p_userid: lastagentid,
                closeby: "CHATFLOW",
                closemessage: "",
            },
        };
        Logger.write("closeTicket-body: " + JSON.stringify(bodyClose));
        Net.httpRequest(
            `${URL_SERVICES}ServiceLogicHook/CloseTicket`,
            (res) => {
                Logger.write("closeTicket-res: " + res.text);
            },
            {
                method: "POST",
                postData: JSON.stringify(bodyClose),
                headers: ["Content-Type: application/json;charset=utf-8"],
            }
        );
    } else {
        if (retryClose < 3) {
            setTimeout(() => {
                closeTicket(motive, obs);
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
        previewagentid: lastagentid,
    };
    Logger.write("reasignAgent-body: " + JSON.stringify(body));
    Net.httpRequest(
        `${URL_SERVICES}voximplant/changeagent`,
        (res) => {
            Logger.write("reasignAgent-res: " + res.text);
        },
        {
            method: "POST",
            postData: JSON.stringify(body),
            headers: ["Content-Type: application/json;charset=utf-8"],
        }
    );
}

function sendInteraction(type, text) {
    const splitIdentifier = identifier.split("-");
    const body = {
        communicationchanneltype: "VOXI",
        personcommunicationchannel: `${callerid}_VOXI`,
        communicationchannelsite: site,
        corpid: parseInt(splitIdentifier[0]),
        orgid: parseInt(splitIdentifier[1]),
        communicationchannelid: parseInt(splitIdentifier[2]),
        conversationid: parseInt(splitIdentifier[3]),
        userid: lastagentid,
        personid: parseInt(splitIdentifier[4]),
        typeinteraction: "NINGUNO",
        typemessage: type,
        lastmessage: text,
        callrecording: red.recording,
    };
    Logger.write("insert/withdata-body: " + JSON.stringify(body));
    Net.httpRequest(
        `${URL_SERVICES}voximplant/call/answered`,
        (res) => {
            Logger.write("insert/withdata-res: " + res.text);
        },
        {
            method: "POST",
            postData: JSON.stringify(body),
            headers: ["Content-Type: application/json;charset=utf-8"],
        }
    );
}
// Handle inbound call
function handleInboundCall(e) {
    if (e.headers["VI-Client-Type"] === "pstn" || e.headers["VI-Client-Type"] === "other") {
        //si la llamada viene de un número de la red pública es atendido por la cola acd.
        origin = "INBOUND";
        call = e.call; // Call del cliente
        callerid = e.callerid;
        site = SITE_MASK || e.destination;
        variables = { ...(variables || {}), origin: "INBOUND" };
        // Add event listeners
        e.call.addEventListener(CallEvents.Connected, handleCallConnected);
        // e.call.addEventListener(CallEvents.PlaybackFinished, handlePlaybackFinished);
        e.call.addEventListener(CallEvents.Failed, (e) =>
            cleanup(`LLAMADA FALLIDA`, `code: ${e.code} - reason ${e.reason} - name: ${e.name}`)
        );
        e.call.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR CLIENTE"));
        // Answer call
        createTicket2(origin, (newConversation, afterHour) => {
            if (!newConversation) {
                //Existe una llamada en curso
                call.hangup();
                return;
            }
            e.call.answer();

            if (!afterHour) {
                if (red.recording) {
                    e.call.record({
                        transcribe: false,
                        language: ASRLanguage.SPANISH_ES,
                        name: identifier + ".mp3",
                        contentDispositionFilename: identifier + ".mp3",
                        recordNamePrefix: "" + site,
                        hd_audio:
                            (red.recordingquality || "default") === "default"
                                ? undefined
                                : red.recordingquality === "hd",
                        lossless:
                            (red.recordingquality || "default") === "default"
                                ? undefined
                                : red.recordingquality === "lossless",
                        expire: cleanExpiration(red.recordingstorage),
                    });
                }
            }
        });
    } else {
        origin = "OUTBOUND";
        if (!e.customData) {
            Logger.write("voximplant: Error, not have customdata with number from to call");
            return;
        }

        identifier = e.customData.split(".")[0];
        site = e.customData.split(".")[1];
        lastagentid = parseInt(e.customData.split(".")[2]);
        callerid = e.destination.replace("+", "");

        //outbound call
        createTicket2(origin, (identiff) => {
            if (!identiff) {
                Logger.write("voximplant: cant create ticket on outbound");
                call.hangup();
                return;
            }
            if (/^\d+$/.test(e.destination.replace("+", ""))) {
                if (configSIP?.SIP) {
                    call = VoxEngine.callSIP(`${configSIP.prefix}${e.destination.replace("51", "")}@${configSIP.peer_address}`, {
                        callerid: `agent${lastagentid}@${configSIP.domain}`,
                        displayName: "Laraigo",
                    });
                } else {
                    call = VoxEngine.callPSTN(e.destination, site);
                }
            } else {
                // es una llamada interna (entre asesores o anexos)
                call = VoxEngine.callUser(e.destination, e.callerid);
            }

            call.addEventListener(CallEvents.Connected, (e) => {
                sendInteraction("LOG", "CLIENTE CONTESTÓ LA LLAMADA");
            });

            if (red.recording) {
                e.call.record({
                    transcribe: false,
                    language: ASRLanguage.SPANISH_ES,
                    name: identifier + ".mp3",
                    contentDispositionFilename: identifier + ".mp3",
                    recordNamePrefix: "" + site,
                    hd_audio:
                        (red.recordingquality || "default") === "default" ? undefined : red.recordingquality === "hd",
                    lossless:
                        (red.recordingquality || "default") === "default"
                            ? undefined
                            : red.recordingquality === "lossless",
                    expire: cleanExpiration(red.recordingstorage),
                });
            }

            VoxEngine.easyProcess(e.call, call);
            call.removeEventListener(CallEvents.Disconnected);
            e.call.removeEventListener(CallEvents.Disconnected);

            call.addEventListener(CallEvents.Failed, (e) =>
                cleanup(`LLAMADA FALLIDA`, `code: ${e.code} - reason ${e.reason} - name: ${e.name}`)
            );
            call.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR CLIENTE"));

            e.call.addEventListener(CallEvents.Failed, (e) =>
                cleanup(`LLAMADA FALLIDA`, `code: ${e.code} - reason ${e.reason} - name: ${e.name}`)
            );
            e.call.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR ASESOR"));

            call2 = e.call; // Call del agente
            holdCall(e.call, call);
        });
    }
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
    } else {
        if (transferCall) {
            transferCall.sendMessage(
                JSON.stringify({
                    operation: "TRANSFER-DISCONNECTED",
                    conversationid: conversationid,
                })
            );
        }
        if (request) {
            // Remove call from queue
            Logger.write("cleanup-request.cancel");
            request.cancel();
            request = null;
        }
        closeTicket(motive, obs);
        // terminate session
        VoxEngine.terminate();
    }
}
// Play music after TTS finish
function handlePlaybackFinished(e) {
    e.call.startPlayback(welcomeTone);
}

function handleSpreadCall() {
    userQueueData
        .slice(userQueueIndex * userQueueLimit, userQueueIndex * userQueueLimit + userQueueLimit)
        .forEach((user) => {
            Logger.write("spreadCall-user: " + JSON.stringify(user));
            let incall = VoxEngine.callUser(user.user_name, callerid, user.user_name, {
                "X-identifier": identifier,
                "X-createdatecall": new Date().toISOString(),
                "X-site": site,
                "X-personname": personName,
                "X-accessURL": accessURL,
                "X-method": "simultaneous",
            });
            incall.addEventListener(CallEvents.Connected, (e) => {
                Logger.write("spreadCall-Connected: " + JSON.stringify(e));
                inboundCalls
                    .filter((ic) => ic.id !== e.id)
                    .forEach((ic2) => {
                        Logger.write("spreadCall-Connected-toHangup: " + JSON.stringify(ic2));
                        ic2.call.sendMessage(
                            JSON.stringify({
                                operation: "SPREAD-HANGUP",
                                conversationid: conversationid,
                            })
                        );
                        ic2.call.hangup();
                    });
                call2 = e.call; // Call del agente
                const agentid = parseInt(
                    inboundCalls
                        .find((ic) => ic.id === e.id)
                        .destination.replace("user", "")
                        .split(".")[0]
                );
                reasignAgent(agentid);
                sendInteraction("LOG", "AGENTE CONTESTÓ LA LLAMADA");
                lastagentid = agentid;
                VoxEngine.sendMediaBetween(e.call, call);
                holdCall(e.call, call);
                e.call.removeEventListener(CallEvents.Failed);
                e.call.removeEventListener(CallEvents.Disconnected);
                e.call.addEventListener(CallEvents.Disconnected, (e2) => {
                    Logger.write("spreadCall-Disconnected: " + JSON.stringify(e2));
                    Logger.write("spreadCall-inTransfer: " + JSON.stringify(inTransfer));
                    if (inTransfer) {
                        inTransfer = null;
                    } else {
                        closeTicket("DESCONECTADO POR ASESOR");
                        VoxEngine.terminate();
                    }
                });
            });
            incall.addEventListener(CallEvents.Failed, (e) => {
                inboundCalls = inboundCalls.filter((ic) => ic.id !== e.id);
                Logger.write("spreadCall-Failed-inboundCalls: " + JSON.stringify(inboundCalls));
                if (inboundCalls.length === 0) {
                    userQueueIndex += 1;
                    if (userQueueIndex < userQueueLength) {
                        handleSpreadCall();
                    } else {
                        closeTicket("NO HAY ASESORES");
                        VoxEngine.terminate();
                    }
                }
            });
            inboundCalls.push({
                id: incall.id(),
                destination: user.user_name,
                call: incall,
            });
        });
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
            "X-accessURL": accessURL,
        },
    });
    // Get call status in queue after it was put in the queue
    request.addEventListener(ACDEvents.Queued, function (acdevent) {
        Logger.write("ACDEvents-Queued: " + JSON.stringify(acdevent));
        request.getStatus();
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
        call.say(messageWelcome, VOICE_ES);
    });
    // Connect caller with operator
    request.addEventListener(ACDEvents.OperatorReached, function (acdevent) {
        Logger.write("ACDEvents-OperatorReached: " + JSON.stringify(acdevent));
        VoxEngine.sendMediaBetween(acdevent.operatorCall, call);
        holdCall(acdevent.operatorCall, call);
        acdevent.operatorCall.addEventListener(CallEvents.Disconnected, () => {
            Logger.write("ACDEvents-OperatorReached-Disconnected: " + JSON.stringify(acdevent));
            Logger.write("ACDEvents-OperatorReached-inTransfer: " + JSON.stringify(inTransfer));
            if (inTransfer) {
                inTransfer = null;
            } else {
                closeTicket("DESCONECTADO POR ASESOR");
                VoxEngine.terminate();
            }
        });
        clearInterval(statusInterval);
        sendInteraction("LOG", "AGENTE CONTESTÓ LA LLAMADA");
    });
    request.addEventListener(ACDEvents.OperatorCallAttempt, function (acdevent) {
        Logger.write("ACDEvents-OperatorCallAttempt: " + JSON.stringify(acdevent));
        call2 = acdevent.operatorCall; // Call del agente
        const agentid = parseInt(acdevent.operatorCall.number().replace("user", "").split(".")[0]);
        Logger.write("ACDEvents-agentid: " + agentid);
        reasignAgent(agentid);
        lastagentid = agentid;
        //acdevent.operatorCall.customData()
    });
    request.addEventListener(ACDEvents.OperatorFailed, function (acdevent) {
        Logger.write("ACDEvents-OperatorFailed: " + JSON.stringify(acdevent));
        Logger.write("eventACD-OperatorCallAttempt: " + JSON.stringify(acdevent));
        setTimeout(() => {
            request.getStatus();
        }, 1000);
    });
    // No operators are available
    request.addEventListener(ACDEvents.Offline, function (acdevent) {
        Logger.write("ACDEvents-Offline: " + JSON.stringify(acdevent));
        call.say(messageBusy, VOICE_ES);
        call.addEventListener(CallEvents.PlaybackFinished, function (e) {
            closeTicket("NO HAY ASESORES");
            VoxEngine.terminate();
        });
    });
    // Get current call status in a queue every 30 seconds
    statusInterval = setInterval(request.getStatus, 30000);
}

// Call connected
async function handleCallConnected(e) {
    if (afterHour) {
        Logger.write("voximplant: afterhour!!");

        call.say(messageAfterHour, VOICE_ES);
        call.addEventListener(CallEvents.PlaybackFinished, function (e) {
            closeTicket("FUERA DE HORARIO");
            VoxEngine.terminate();
        });
    } else {
        if (flow?.genesis) {
            const next = await loopInteractions(call, variables, flow);
            if (next !== "agenttransfer") {
                closeTicket("finish");
                VoxEngine.terminate();
            }
        } else {
            await cardMessage({}, { message: messageWelcome });

            if (callMethod === "SIMULTANEO") {
                handleSimultaneousCall();
            } else {
                handleACDQueue();
            }
        }
    }
}

function handleSimultaneousCall() {
    Net.httpRequest(
        `${URL_APILARAIGO}voximplant/getChildrenAccounts`,
        (res1) => {
            Logger.write("handleCallConnected: " + res1.text);
            const laraigo_res = JSON.parse(res1.text).result;
            const api_key = laraigo_res?.[0]?.api_key;
            if (api_key) {
                Logger.write("handleCallConnected-accountID: " + accountID);
                Logger.write("handleCallConnected-applicationID: " + applicationID);
                Net.httpRequest(
                    `${URL_APIVOXIMPLANT}GetUsers/?account_id=${accountID}&application_id=${applicationID}&api_key=${api_key}&user_active=true&count=20&with_skills=true&with_queues=true&acd_status=READY`,
                    (res2) => {
                        Logger.write("handleCallConnected-GetUsers: " + res2.text);
                        const voxi_res = JSON.parse(res2.text).result;
                        if (voxi_res.length === 0) {
                            call.say(messageBusy, VOICE_ES);
                            call.addEventListener(CallEvents.PlaybackFinished, function (e) {
                                closeTicket("NO HAY ASESORES");
                                VoxEngine.terminate();
                            });
                        } else {
                            userQueueData = voxi_res.filter((user) =>
                                user.acd_queues.map((aq) => aq.acd_queue_name.split(".")?.[1]).includes("laraigo")
                            );
                            userQueueLength = Math.ceil(userQueueData.length / userQueueLimit);
                            call.say(messageWelcome, VOICE_ES);
                            handleSpreadCall();
                        }
                    },
                    { method: "GET" }
                );
            } else {
                handleACDQueue();
            }
        },
        {
            method: "POST",
            postData: JSON.stringify({
                child_account_id: accountID,
            }),
            headers: ["Content-Type: application/json;charset=utf-8"],
        }
    );
}

function transferTrigger(number) {
    // Send holdTone to PSTN
    holdplayer = VoxEngine.createURLPlayer(holdTone, true, true);
    holdplayer.resume();
    holdplayer.sendMediaTo(call);
    holdplayer.sendMediaTo(call2);
    if (/^\d+$/.test(number.replace("+", ""))) {
        transferCall = VoxEngine.callPSTN(number, site, number, {
            "X-transfer": "truetruetruetrue",
            "X-identifier": identifier,
            "X-site": site,
            "X-personname": personName,
            "X-accessURL": accessURL,
            "X-originalnumber": call.number(),
            "X-transfernumber": number,
            "X-conversationid": conversationid,
        });
        VoxEngine.sendMediaBetween(transferCall, call2);
    } else {
        transferCall = VoxEngine.callUser(number, number, "transfer", {
            "X-transfer": "truetruetruetrue",
            "X-identifier": identifier,
            "X-site": site,
            "X-personname": personName,
            "X-accessURL": accessURL,
            "X-originalnumber": call.number(),
            "X-transfernumber": number,
            "X-conversationid": conversationid,
        });
    }
    transferCall.addEventListener(CallEvents.Connected, (e) => {
        transferOnConnect(e, call2);
    });
    transferCall.addEventListener(CallEvents.Failed, (e) => {
        transferOnFailed(e, call2);
    });
    call2.removeEventListener(CallEvents.MessageReceived);
    call2.addEventListener(CallEvents.MessageReceived, (e) => {
        Logger.write("transfer-MessageReceived: " + JSON.stringify(e));
        transferOperations(e);
    });
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
    call2.sendMessage(
        JSON.stringify({
            operation: "TRANSFER-CONNECTED",
        })
    );
    event.call.addEventListener(CallEvents.Disconnected, (e) => {
        Logger.write("transfer-Disconnected: " + JSON.stringify(e));
        if (transferHoldPlayer) {
            transferHoldPlayer.stop();
        }
        // Advise transfer disconnected to 2nd leg
        call2.sendMessage(
            JSON.stringify({
                operation: "TRANSFER-HANGUP",
                conversationid: conversationid,
                number: e.call.number(),
                tranfernumber: e.call.callerid(),
                tranfername: e.call.displayName(),
            })
        );
        transferCall = null;
    });
}

function transferOnFailed(event, call2) {
    // 3rd leg event
    Logger.write("transfer-failed: " + JSON.stringify(event));
    // Advise transfer failed to 2nd leg
    call2.sendMessage(
        JSON.stringify({
            operation: "TRANSFER-FAILED",
            conversationid: conversationid,
            number: event.call.number(),
            tranfernumber: event.call.callerid(),
            tranfername: event.call.displayName(),
        })
    );
    transferCall = null;
}

function transferOperations(event) {
    // 2rd leg event
    const message_json = JSON.parse(event.text);
    switch (message_json.operation) {
        case "HOLD-STOP":
            holdplayer.stop();
            VoxEngine.sendMediaBetween(event.call, call);
            break;
    }
    if (transferCall) {
        switch (message_json.operation) {
            case "TRANSFER-COMPLETE":
                transferComplete(message_json);
                break;
            case "TRANSFER-HANGUP":
                transferCall.sendMessage(
                    JSON.stringify({
                        operation: "TRANSFER-DISCONNECTED",
                        conversationid: conversationid,
                    })
                );
                transferCall.hangup();
                transferCall = null;
                break;
            case "TRANSFER-HOLD":
                if (message_json.hold) {
                    transferCall.stopMediaTo(call2);
                    call2.stopMediaTo(transferCall);
                } else {
                    VoxEngine.sendMediaBetween(transferCall, call2);
                }
                break;
            case "TRANSFER-MUTE":
                call2.stopMediaTo(transferCall);
                break;
            case "TRANSFER-UNMUTE":
                call2.sendMediaTo(transferCall);
                break;
            default:
                break;
        }
    }
}

function transferComplete(data) {
    const { number } = data;
    // Send audio between 1nd, 3er leg
    VoxEngine.sendMediaBetween(transferCall, call);
    holdCall(transferCall, call);
    if (/^\d+$/.test(number.replace("+", ""))) {
        const agentid = number.replace("+", "");
        Logger.write("transfer-Complete-agentid: " + agentid);
        reasignAgent(2);
        lastagentid = 2;
    } else {
        const agentid = parseInt(number.replace("user", "").split(".")[0]);
        Logger.write("transfer-Complete-agentid: " + agentid);
        reasignAgent(agentid);
        lastagentid = agentid;
    }
    // Hangup 2nd leg
    inTransfer = true;
    call2.hangup();
    // Assign 3er leg to 2nd leg
    call2 = transferCall;
    // Add all
    call2.removeEventListener(CallEvents.Disconnected);
    call2.addEventListener(CallEvents.Disconnected, () => cleanup("DESCONECTADO POR ASESOR"));
}




//****************VOICE*BOT***************//
const setVariable = (variables, variable, value) => {
    variables[variable] = value;
    return variables;
}

const replaceTextWithVariables = (input, variables) => {
    let newinput = `${input}`;
    const variablesFound = newinput.match(/({{)(.*?)(}})/g) || [];
    variablesFound.forEach(varr => {
        const value = variables[varr.replace("{{", "").replace("}}", "")] || "";
        newinput = newinput.replaceAll(varr, value);
    })
    return newinput
}

const cardInput = async (variables, { question, output, timeout = 5000 }) => (
    new Promise(async (resolve, reject) => {
        question = replaceTextWithVariables(question, variables);
        let full_result = "";
        let ts = null;
        let tsMuteTotal = null;
        let tsStopOnTime = null;
        call.say(question, VOICE_ES);
        call.addEventListener(CallEvents.PlaybackFinished, () => {
            Logger.write("ASR-REC: start");
            call.removeEventListener(CallEvents.PlaybackFinished);
            call.sendMediaTo(asr);
            tsMuteTotal = setTimeout(() => {
                Logger.write("ASR-REC: tsMuteTotal: " + full_result);
                asr.stop();
                clearTimeout(ts);
                clearTimeout(tsStopOnTime);
                setVariable(variables, output, full_result);
                resolve(full_result)
            }, timeout);

            tsStopOnTime = setTimeout(() => {
                Logger.write("ASR-REC: tsStopOnTime: " + full_result);
                asr.stop();
                clearTimeout(ts);
                clearTimeout(tsMuteTotal);
                setVariable(variables, output, full_result);
                resolve(full_result)
            }, timeout);
        });
        const asr = VoxEngine.createASR({
            profile: ASRProfileList.Microsoft.es_PE,
            model: ASRModelList.Microsoft,
            singleUtterance: true,
            interimResults: true,
        });

        asr.addEventListener(ASREvents.Result, e => {
            Logger.write("ASR-REC: Result: " + e.text);
            clearTimeout(tsMuteTotal);
            // Recognition results arrive here
            full_result += ((e.text || "") + " ");
            // sendInteraction("text", full_result, true);
            // If CaptureStarted wo not be triggered in 2 seconds then stop recognition
            clearTimeout(tsStopOnTime)
            asr.stop();
            setVariable(variables, output, full_result);
            resolve(full_result);
            // ts = setTimeout(() => {
            // }, 1000);
        });

        asr.addEventListener(ASREvents.SpeechCaptured, () => {
            // After speech has been captured - do not stop sending media to ASR
            Logger.write("ASR-REC: SpeechCaptured");
            clearTimeout(tsMuteTotal);
            // call.stopMediaTo(asr);
        });
        asr.addEventListener(ASREvents.CaptureStarted, () => {
            Logger.write("ASR-REC: CaptureStarted");
            // Clear timeout if CaptureStarted has been triggered
            clearTimeout(ts);
        });
    })
)
//type = inputunknown | inputfixed
//if type is inputunknown, should have terminateOn, and else if type is inputfixed, should have inputLength
const cardIVR = async (call, variables, { output, id, type, inputLength, terminateOn, question, attempts }) => (
    new Promise(async (resolve, reject) => {
        const attempt = 0;
        question = replaceTextWithVariables(question, variables);
        // sendInteraction("text", question);
        const extState = new IVRState(id, {
            type,
            inputLength,
            terminateOn,
            prompt: {
                say: question,
                lang: VOICE_ES
            }
        }, (data) => {
            // Extension has been entered
            const response = type === "inputunknown" ? data.replace(terminateOn, "") : data
            // sendInteraction("text", response, true);
            setVariable(variables, output, response);
            resolve({ number: response, success: true });
        }, (_data) => {
            // Timeout
            attempt++
            if (attempt < attempts) {
                extState.enter(Call);
            } else {
                resolve({ message: "attempts were exceeded", success: false });
            }
        }).enter(call);
    })
)

const cardMessage = async (variables, { message }) => (
    new Promise(async (resolve, reject) => {
        message = replaceTextWithVariables(message, variables);
        // sendInteraction("text", message);
        call.say(message, VOICE_ES);
        call.addEventListener(CallEvents.PlaybackFinished, function (e) {
            resolve("ok")
        });
    })
);

const cardAudio = async (variables, { url }) => (
    new Promise(async (resolve, reject) => {
        url = replaceTextWithVariables(url, variables);

        call.startPlayback(url);

        call.addEventListener(CallEvents.PlaybackFinished, function (e) {
            resolve("ok")
        });
    })
);

async function cardHttpRequest(variables, { url, method = 'GET', postData, headers = {}, output }) {
    return new Promise(async (resolve, reject) => {
        try {
            let options = {
                headers: Object.keys(headers).map(x => `${x}: ${headers[x]}`),
                method: method
            }
            if (postData) postData = replaceTextWithVariables(postData, variables);
            if (postData !== undefined) options.postData = postData
            let res = await Net.httpRequestAsync(url, options)
            if (res.code == 200 || res.code == 201) {

                try {
                    if (output && output.length > 0) {
                        const resultJSON = JSON.parse(res.text);

                        // Iterar sobre la configuración de output
                        output.forEach(({ parameterResponse, variable }) => {
                            // Obtener el valor según la ruta definida en parameterResponse
                            let value = parameterResponse.split('.').reduce((acc, key) => {
                                if (acc !== undefined) {
                                    // Manejar acceso a arreglos, por ejemplo: children[0]
                                    const arrayMatch = key.match(/(.+?)\[(\d+)\]/);
                                    if (arrayMatch) {
                                        const arrayKey = arrayMatch[1];
                                        const index = arrayMatch[2];
                                        return acc[arrayKey] && acc[arrayKey][index] !== undefined ? acc[arrayKey][index] : undefined;
                                    } else {
                                        // Acceso normal a objetos
                                        return acc[key] !== undefined ? acc[key] : undefined;
                                    }
                                }
                                return undefined;
                            }, resultJSON);

                            // Verificar si el valor es un objeto o arreglo
                            if (value !== undefined) {
                                if (typeof value === 'object' && value !== null) {
                                    // Guardar el objeto o arreglo como JSON stringificado
                                    variables[variable] = JSON.stringify(value);
                                } else {
                                    // Guardar el valor como texto
                                    variables[variable] = `${value}`;
                                    Logger.write("httprequest-card-variable: " + variable + " = " + `${value}`);
                                }
                            }
                        });
                    }

                } catch (e) {
                    Logger.write("httprequest-card: " + e.message);
                }

                Logger.write("httprequest-card: " + `${url}(200): ${res.text}`);
                sendInteraction("LOG", `${url}(200): ${res.text}`);
                resolve(res.text)
            } else {
                sendInteraction("LOG", `${url}(${res.code}): ${res.text}`);
                resolve(res)
            }
        } catch (err) {
            reject('Error: ' + err)
        }
    })
}

const cleanText = (text) => text
    .trim()
    .toLowerCase()
    .replace(/[.,!¿?¡:;]/g, "")
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')

const cardSetAttribute = (variables, { variable, value }) => {
    const valueCleaned = replaceTextWithVariables(value, variables);
    
    if (valueCleaned === "$NOW()") {
        setVariable(variables, variable, new Date().toISOString());
    } else {
        if (/[+\-%*/()]/.test(valueCleaned)) {
            evaluateExpression(valueCleaned);
        }
        const valueCalculed = /[+\-%*/()]/.test(valueCleaned) ? evaluateExpression(valueCleaned) : valueCleaned;
        setVariable(variables, variable, `${valueCalculed}`);
    }
}

const validateCondition = (variables, condition) => {
    if (!condition) return true;

    const { variable, type, value } = condition;
    const variableValue = cleanText(variables[variable] || "");

    if (type === "equals") return variableValue === cleanText(value);
    if (type === "notequals") return variableValue !== cleanText(value);
    if (type === "greater") return variableValue > cleanText(value);
    if (type === "greaterandequals") return variableValue >= cleanText(value);
    if (type === "lower") return variableValue < cleanText(value);
    if (type === "lowerandequals") return variableValue <= cleanText(value);
    if (type === "includes") {
        const text1 = cleanText(variableValue);
        const words = text1.split(" ");
        return value.split(",").map(x => cleanText(x)).some(x => words.includes(x.trim()) || text1.replace(" ", "") === x.replace(" ", ""));
    }
    if (type === "notincludes") {
        const words = cleanText(variableValue).split(" ");
        return !value.split(",").map(x => cleanText(x)).some(x => words.includes(x.trim() || text1.replace(" ", "") === x.replace(" ", "")));
    };
}

const loopInteractions = async (call, variables, flow, blockid = "genesis") => {
    let next = "";
    for (let i = 0; i < flow[blockid].length; i++) {
        const { id, config, condition } = flow[blockid][i];

        const successCondition = validateCondition(variables, condition);

        if (!successCondition)
            continue;
        Logger.write("flow-card: " + JSON.stringify(config));
        if (id === "input") {
            await cardInput(variables, config);
            Logger.write("cardInput: " + JSON.stringify(variables));
        } else if (id === "ivr") {
            await cardIVR(call, variables, config)
        } else if (id === "text") {
            await cardMessage(variables, config);
        } else if (id === "audio") {
            await cardAudio(variables, config);
        } else if (id === "httprequest") {
            await cardHttpRequest(variables, config);
        } else if (id === "gotoblock") {
            await loopInteractions(call, variables, flow, config.to);
            break;
        } else if (id === "setup") {
            cardSetAttribute(variables, config);
        } else if (id === "agenttransfer") {
            if (config.waitingTone) {
                const waitingTone = replaceTextWithVariables(config.waitingTone, variables);
                call.startPlayback(waitingTone);
            }
            cardReassignAgent(variables, config);
            next = "agenttransfer"
            break;
        }
    }
    return next;
}

const cardReassignAgent = (variables, { messageBusy: messageBusy1, retrytime = 3000, type }) => {
    const messageBusy2 = messageBusy1 ? replaceTextWithVariables(messageBusy1, variables) : messageBusy;
    Logger.write("derivar simultaneous: " + type);
    if (type === "simultaneous") {
        handleSimultaneousCall()
    } else {
        handleACDQueue({ messageBusy2, retrytime })
    }
}

//****************HELPERS***************//
function evaluateExpression(expr) {
    expr = expr.replace(/\s+/g, '');

    function evalSimpleExpression(simpleExpr) {
        let tokens = simpleExpr.match(/\d+|[+/*-]/g).map(token => {
            return isNaN(token) ? token : Number(token);
        });

        let stack = [tokens[0]];
        for (let i = 1; i < tokens.length; i += 2) {
            let operator = tokens[i];
            let nextNumber = tokens[i + 1];
            switch (operator) {
                case '+':
                    stack.push(nextNumber);
                    break;
                case '-':
                    stack.push(-nextNumber);
                    break;
                case '*':
                    stack[stack.length - 1] *= nextNumber;
                    break;
                case '/':
                    stack[stack.length - 1] /= nextNumber;
                    break;
            }
        }
        return stack.reduce((acc, curr) => acc + curr, 0);
    }
    function evalRecursive(expr) {
        while (expr.includes('(')) {
            expr = expr.replace(/\(([^()]+)\)/g, (match, subExpr) => evalRecursive(subExpr));
        }
        return evalSimpleExpression(expr);
    }
    return evalRecursive(expr);
}