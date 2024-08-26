require(Modules.ACD);
require(Modules.Player);
require(Modules.CallList); // Enable CallList module
require(Modules.AI);
require(Modules.ASR);
require(Modules.IVR); // enable IVR module

const URL_SERVICES = "https://zyxmelinux2.zyxmeapp.com/zyxmetest/services/api/";
const URL_APILARAIGO = "https://testapix.laraigo.com/api/";
const URL_APIVOXIMPLANT = "https://api.voximplant.com/platform_api/";
const VOICE_ES = VoiceList.Microsoft.Neural.es_PE_CamilaNeural;
//const VOICE_ES = {"language": VoiceList.Microsoft.Neural.es_PE_CamilaNeural, "ttsOptions": {"rate":"x-fast"}};

let flow = {};
let variables = {};
var call,
    list_id,
    task_id,
    phone_number,
    inTransfer,
    message,
    applicationID = "",
    inboundCalls = [],
    caller_id, // Rented or verified phone number
    sessionID = "",
    accessURL = "",
    identifier,
    request,
    personName = "",
    accountID = "",
    lastagentid = 2,
    callmethod = "COLA",
    messageBusy = "Adios",
    dataCampaign = {
        type: "",
        hsmhistoryid: 0,
        campaignhistoryid: 0,
        campaignmbemberid: 0,
        campaignid: 0,
    },
    corpid = 0,
    orgid = 0,
    userQueueIndex = 0,
    userQueueLimit = 10,
    userQueueLength,
    userQueueData = [],
    detectvoicemail = false,
    communicationchannelid = 0,
    welcomeTone = "http://cdn.voximplant.com/toto.mp3",
    holdTone = "http://cdn.voximplant.com/yodl.mp3",
    red = {
        recording: false,
        recordingstorage: "",
        recordingquality: "",
    },
    onlybot = false,
    delivered = false,
    configSIP = null;

function createTicket2(callback) {
    const body = {
        "communicationchanneltype": "VOXI",
        "personcommunicationchannel": `${phone_number}_VOXI`,
        "communicationchannelsite": caller_id,
        "corpid": corpid,
        "orgid": orgid,
        "communicationchannelid": communicationchannelid,
        "conversationid": 0,
        "userid": 2,
        "lastuserid": 2,
        "personid": 0,
        "typeinteraction": "NINGUNO",
        "typemessage": "text",
        "lastmessage": "LLAMADA SALIENTE",
        "postexternalid": sessionID,
        "commentexternalid": accessURL,
        "newConversation": true,
        "status": "ASIGNADO",
        "callrecording": red.recording,
        "origin": "OUTBOUND"
    }
    //externalid es el pccowner
    Net.httpRequest(`${URL_SERVICES}voximplant/createticket`, (res) => {
        Logger.write("voximplant: createticket2: " + res.text);
        const result = JSON.parse(res.text);

        if (result.Success !== true) {
            callback(null)
        } else {
            identifier = result.Result.identifier || result.Result.split("#")[0];
            personName = result.Result.personname || result.Result.split("#")[1];
            configSIP = result.Result.configsip;
            welcomeTone = result.Result.welcometone;
            holdTone = result.Result.holdTone;
            detectvoicemail = result.Result.detectvoicemail || false;

            if (flow || result.Result?.flow) {
                flow = !flow ? JSON.parse(result.Result.flow) : flow;
            }
            if (result.Result?.red) {
                red = JSON.parse(result.Result?.red);
            }
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
        parameters: {
            p_corpid: parseInt(splitIdentifier[0]),
            p_orgid: parseInt(splitIdentifier[1]),
            p_conversationid: parseInt(splitIdentifier[3]),
            p_status: "CERRADO",
            p_obs: motive,
            p_motivo: motive,
            p_messagesourcekey1: `${phone_number}_VOXI`,
            autoclosetime: 60,
            communicationchannelsite: caller_id,
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
}

function sendInteraction(type, text, customer = false) {
    const splitIdentifier = identifier.split("-");
    const body = {
        communicationchanneltype: "VOXI",
        personcommunicationchannel: `${phone_number}_VOXI`,
        communicationchannelsite: caller_id,
        corpid: parseInt(splitIdentifier[0]),
        orgid: parseInt(splitIdentifier[1]),
        communicationchannelid: parseInt(splitIdentifier[2]),
        conversationid: parseInt(splitIdentifier[3]),
        userid: customer ? null : lastagentid,
        personid: parseInt(splitIdentifier[4]),
        typeinteraction: "NINGUNO",
        typemessage: type,
        lastmessage: text,
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

function reasignAgent(agentid) {
    const body = {
        agentid,
        identifier,
        callerid: phone_number,
        site: caller_id,
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

function deliveryCall(success, message = "") {
    delivered = true;
    const splitIdentifier = identifier.split("-");
    const body = {
        success,
        msg: message,
        metadata: {
            corpid: parseInt(splitIdentifier[0]),
            orgid: parseInt(splitIdentifier[1]),
            ...dataCampaign,
        },
    };
    Logger.write("voximplant/deliveryCall-body: " + JSON.stringify(body));
    Net.httpRequest(
        `${URL_SERVICES}voximplant/deliveryCall`,
        (res) => {
            Logger.write("voximplant/deliveryCall-res: " + res.text);
        },
        {
            method: "POST",
            postData: JSON.stringify(body),
            headers: ["Content-Type: application/json;charset=utf-8"],
        }
    );
}

VoxEngine.addEventListener(AppEvents.Started, (ev) => {
    sessionID = ev.sessionId;
    accountID = ev.accountId;
    applicationID = ev.applicationId;
    accessURL = ev.accessSecureURL;
    Logger.write("voximplant: sessionID: " + sessionID);
});

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

VoxEngine.addEventListener(AppEvents.Started, function (e) {
    Logger.write(`VoxEngine.customData() ${VoxEngine.customData()}`);

    const data = JSON.parse(VoxEngine.customData()); // <-- data from CSV string in JSON format
    list_id = data.list_id;
    task_id = data.task_id;
    phone_number = data.personcommunicationchannelowner;
    onlybot = data.onlybot;
    caller_id = data.caller_id;
    corpid = data.corpid;
    orgid = data.orgid;
    communicationchannelid = data.communicationchannelid;
    callmethod = data.callmethod;
    site = data.caller_id;
    message = data.message;
    flow = data.flow;
    variables = { ...(data.variables || {}), origin: "OUTBOUND" };
    variables.phone = phone_number;

    dataCampaign = {
        type: data.type || "CAMPAIGN",
        campaignhistoryid: data.campaignhistoryid || 0,
        campaignmbemberid: data.campaignmbemberid || 0,
        campaignid: data.campaignid || 0,
        hsmhistoryid: data.hsmhistoryid || 0,
    };
    Logger.write(`Calling ${list_id} with  ${task_id} on ${phone_number}`);

    createTicket2((identifier) => {
        if (!identifier) {
            call.hangup();
            return;
        }
        const amd = detectvoicemail ? AMD.create({ model: AMD.Model.PE }) : undefined;

        if (configSIP?.SIP) {
            call = VoxEngine.callSIP(`${configSIP.prefix}${phone_number.replace("51", "")}@${configSIP.peer_address}`, {
                callerid: `agent${lastagentid}@${configSIP.domain}`,
                displayName: "Laraigo",
                amd
            });
        } else {
            call = VoxEngine.callPSTN(phone_number, caller_id);
        }

        //detect voice mail
        if (detectvoicemail) {
            amd.addEventListener(AMD.Events.DetectionComplete, (result) => {
                Logger.write(`VOICEMAIL: Machine answer detection is complete.`);
                if (result.resultClass === AMD.ResultClass.VOICEMAIL) {
                    Logger.write(`VOICEMAIL: detected with a ${result.confidence}% confidence.`);
                    voicemailDetected(call, result.confidence);
                } else {
                    Logger.write('VOICEMAIL: not detected.');
                }
            });

            amd.addEventListener(AMD.Events.DetectionError, (error) => {
                Logger.write(`Detection failed with an error:`);
                Logger.write(error);
            });
        }

        if (red.recording) {
            Logger.write("Recording... ");
            call.record({
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

        // Add event listeners
        call.addEventListener(CallEvents.Connected, handleCallConnected);
        call.addEventListener(CallEvents.Failed, handleCallFailed);
        call.addEventListener(CallEvents.Disconnected, handleCallDisconnected);
    });
});

function voicemailDetected(call, confidence) {
    deliveryCall(false, "customer did not answer the call");
    if (confidence >= 75) {
        closeTicket("LLAMADA NO CONTESTADA");
        VoxEngine.CallList.reportError("Voicemail", VoxEngine.terminate);
        call.hangup();
    }
}

function handleSpreadCall() {
    userQueueData
        .slice(userQueueIndex * userQueueLimit, userQueueIndex * userQueueLimit + userQueueLimit)
        .forEach((user) => {
            Logger.write("spreadCall-user: " + JSON.stringify(user));
            let incall = VoxEngine.callUser(user.user_name, phone_number, user.user_name, {
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
                // originalCall2 = e.call; // Call del agente
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
                            closeTicket("NO HAY ASESORES");
                            VoxEngine.terminate();
                        } else {
                            userQueueData = voxi_res.filter((user) =>
                                user.acd_queues.map((aq) => aq.acd_queue_name.split(".")?.[1]).includes("laraigo")
                            );
                            userQueueLength = Math.ceil(userQueueData.length / userQueueLimit);
                            // originalCall.say(messageWelcome, VoiceList.Amazon.es_MX_Mia);
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


const handleACDQueue = ({ messageBusy2, retrytime }) => {
    request = VoxEngine.enqueueACDRequest(`${site}.laraigo`, phone_number, {
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
        // call2 = acdevent.operatorCall; // Call del agente
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
        closeTicket("NO HAY ASESORES");
        call.say(messageBusy2, VoiceList.Amazon.es_MX_Mia);
        call.addEventListener(CallEvents.PlaybackFinished, function (e) {

            VoxEngine.terminate();
        });
    });
    // Get current call status in a queue every 30 seconds
    statusInterval = setInterval(request.getStatus, retrytime);
}

// Call connected successfully
async function handleCallConnected(e) {
    if (onlybot) {
        sendInteraction("LOG", "CLIENTE CONTESTÓ LA LLAMADA");
        const next = await loopInteractions(call, variables, flow);
        if (next !== "agenttransfer") {
            closeTicket("finish");
            VoxEngine.terminate();
        }
    } else {
        const type = callmethod !== "COLA" ? "simultaneous" : "queue";
        await cardMessage({}, { message });
        call.startPlayback(welcomeTone);
        cardReassignAgent(null, { type });
    }
}

// Play music after TTS finish
function handlePlaybackFinished(e) {
    e.call.startPlayback(welcomeTone);
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

function handleCallDisconnected(e) {
    // Tell CallList processor about successful call result
    if (!delivered) {
        deliveryCall(false, "The customer hung up the call before being answered");
    }
    closeTicket("DESCONECTADO POR CLIENTE");
    CallList.reportResult(
        {
            result: true,
            duration: e.duration,
        },
        VoxEngine.terminate
    );
}

function handleCallFailed(e) {
    // depending on the request options it either try to launch the scenario again after some time
    // or write the result (failed call) into result_data column of the CSV file with results
    Logger.write("event-handleCallFailed: " + JSON.stringify(e));
    deliveryCall(false, e.reason);
    closeTicket("LLAMADA FALLIDA");
    CallList.reportError(
        {
            result: false,
            msg: "Failed",
            code: e.code,
        },
        VoxEngine.terminate
    );
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