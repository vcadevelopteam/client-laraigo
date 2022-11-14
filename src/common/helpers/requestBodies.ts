import { DashboardTemplateSave, Dictionary, IChannel, IChatWebAdd, ICrmLead, ICrmLeadActivitySave, ICrmLeadHistoryIns, ICrmLeadNoteSave, ICrmLeadSel, ICrmLeadTagsSave, ILead, IPerson, IRequestBody, IRequestBodyPaginated } from '@types';
import { uuidv4 } from '.';

type ID = string | number;

export const getUserSel = (userid: number): IRequestBody => ({
    method: "UFN_USER_SEL",
    key: "UFN_USER_SEL",
    parameters: {
        id: userid,
        all: true
    }
})

export const getOrgUserSel = (userid: number, orgid: number): IRequestBody => ({
    method: "UFN_ORGUSER_SEL",
    key: "UFN_ORGUSER_SEL",
    parameters: {
        userid,
        orgid,
        all: true
    }
})
export const callUpdateToken = (): IRequestBody => ({
    method: "UFN_TEST",
    key: "UFN_TEST",
    parameters: {}
})
export const getConversationSelVoxi = (): IRequestBody => ({
    method: "UFN_CONVERSATION_SEL_VOXI",
    key: "UFN_CONVERSATION_SEL_VOXI",
    parameters: {
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const getUserChannelSel = (): IRequestBody => ({
    method: "UFN_USER_CHANNEL_SEL",
    key: "UFN_USER_CHANNEL_SEL",
    parameters: {
    }
})
export const getOrgsByCorp = (orgid: number, keytmp?: number): IRequestBody => ({
    method: "UFN_CORP_ORG_SEL",
    key: "UFN_CORP_ORG_SEL" + (keytmp || ""),
    parameters: {
        id: orgid,
        all: true
    }
})
export const getUsersBySupervisor = (): IRequestBody => ({
    method: "UFN_USERBYSUPERVISOR_SEL",
    key: "UFN_USERBYSUPERVISOR_SEL",
    parameters: {}
})
export const getUsersBySupervisorLst = (): IRequestBody => ({
    method: "UFN_USERBYSUPERVISOR_LST",
    key: "UFN_USERBYSUPERVISOR_LST",
    parameters: {}
})

export const getListQuickReply = (): IRequestBody => ({
    method: "UFN_QUICKREPLY_LIST_SEL",
    key: "UFN_QUICKREPLY_LIST_SEL",
    parameters: { classificationid: 0, all: true }
})

export const insertClassificationConversation = (conversationid: number, classificationid: number, jobplan: string, operation: string): IRequestBody => ({
    method: "UFN_CONVERSATIONCLASSIFICATION_INS",
    key: "UFN_CONVERSATIONCLASSIFICATION_INS",
    parameters: { conversationid, classificationid, jobplan, operation }
})

export const getTickets = (userid: number | null): IRequestBody => ({
    method: "UFN_CONVERSATION_SEL_TICKETSBYUSER",
    key: `UFN_CONVERSATION_SEL_TICKETSBYUSER_${userid}`,
    parameters: { ...(userid && { agentid: userid }) }
})

export const getInfoPerson = (personid: ID, conversationid: number): IRequestBody => ({
    method: "UFN_CONVERSATION_PERSON_SEL",
    key: "UFN_CONVERSATION_PERSON_SEL",
    parameters: { personid, conversationid }
})

export const getTicketsByPerson = (personid: number, conversationid: number): IRequestBody => ({
    method: "UFN_CONVERSATION_SEL_TICKETSBYPERSON",
    key: "UFN_CONVERSATION_SEL_TICKETSBYPERSON",
    parameters: { personid, conversationid }
})

export const getInteractionsByConversation = (conversationid: number, lock: boolean, conversationold: number): IRequestBody => ({
    method: "UFN_CONVERSATION_SEL_INTERACTION",
    key: `UFN_CONVERSATION_SEL_INTERACTION_${conversationid}`,
    parameters: { conversationid, lock, conversationold }
})

export const getIntentByConversation = (conversationid: number): IRequestBody => ({
    method: "UFN_CONVERSATION_SEL_INTENT",
    key: "UFN_CONVERSATION_SEL_INTENT",
    parameters: { conversationid }
})

export const getRolesByOrg = (): IRequestBody => ({
    method: "UFN_ROLE_LST",
    key: "UFN_ROLE_LST",
    parameters: {
    }
})
export const getSupervisors = (orgid: number, userid: number, keytmp?: any): IRequestBody => ({
    method: "UFN_USER_SUPERVISOR_LST",
    key: "UFN_USER_SUPERVISOR_LST" + (keytmp || ""),
    parameters: {
        orgid,
        userid
    }
})

export const getApplicationsByRole = (roleid: number, keytmp?: number): IRequestBody => ({
    method: "UFN_APPS_DATA_SEL",
    key: "UFN_APPS_DATA_SEL" + (keytmp || ""),
    parameters: {
        roleid
    }
})

export const getPropertySel = (corpid: number, propertyname: string, description: string, category: string, level: string, propertyid: number): IRequestBody => ({
    method: "UFN_PROPERTY_SEL",
    key: "UFN_PROPERTY_SEL",
    parameters: {
        corpid,
        propertyname,
        description,
        category,
        level,
        id: propertyid,
        all: propertyid === 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getDistinctPropertySel = (category: string, level: string): IRequestBody => ({
    method: "UFN_DISTINCT_PROPERTY_SEL",
    key: "UFN_DISTINCT_PROPERTY_SEL",
    parameters: {
        category,
        level
    }
});

export const getGroupConfigSel = (groupconfigid: number): IRequestBody => ({
    method: "UFN_GROUPCONFIGURATION_SEL",
    key: "UFN_GROUPCONFIGURATION_SEL",
    parameters: {
        id: groupconfigid,
        all: groupconfigid === 0,
    }
});

export const getChannelsByOrg = (orgid?: number | null, keytmp?: any): IRequestBody => ({
    method: "UFN_COMMUNICATIONCHANNELBYORG_LST",
    key: "UFN_COMMUNICATIONCHANNELBYORG_LST" + (keytmp || ""),
    parameters: {
        orgid: orgid || undefined
    }
});

export const getValuesFromDomain = (domainname: string, keytmp?: any, orgid?: number | null, corpid?: number | null): IRequestBody => ({
    method: "UFN_DOMAIN_LST_VALORES",
    key: "UFN_DOMAIN_LST_VALORES" + (keytmp || ""),
    parameters: {
        domainname,
        orgid: orgid || undefined,
        corpid: corpid || undefined
    }
});
export const getReportschedulerreportsSel = () => ({
    method: "UFN_REPORTSCHEDULER_REPORTSEL",
    key: "UFN_REPORTSCHEDULER_REPORTSEL",
    parameters: {}
});
// solo devuelve desc y value, no id (USAR ESTE PARA LOS SELECTS SIMPLES DE DOMINIOS)
export const getValuesFromDomainLight = (domainname: string, keytmp?: any, orgid?: number | null): IRequestBody => ({
    method: "UFN_DOMAIN_LST_VALUES_ONLY_DATA",
    key: "UFN_DOMAIN_LST_VALUES_ONLY_DATA_" + (domainname),
    parameters: {
        domainname,
        orgid: orgid || undefined
    }
});

export const getValuesFromDomainCorp = (domainname: string, keytmp?: any, corpid?: number | null, orgid?: number | null): IRequestBody => ({
    method: "UFN_DOMAIN_LST_VALORES",
    key: "UFN_DOMAIN_LST_VALORES" + (keytmp || ""),
    parameters: {
        domainname,
        corpid: corpid || undefined,
        orgid: orgid || undefined
    }
});

export const getListUsers = (): IRequestBody => ({
    method: "UFN_CONVERSATION_LST_USRDELEGATE2",
    key: "UFN_CONVERSATION_LST_USRDELEGATE2",
    parameters: {}
});

export const getClassificationLevel1 = (type: string): IRequestBody => ({
    method: "UFN_CONVERSATIONCLASSIFICATIONLIST_LEVEL1_SEL",
    key: "UFN_CONVERSATIONCLASSIFICATIONLIST_LEVEL1_SEL",
    parameters: { type }
});

export const getClassificationLevel2 = (type: string, classificationid: number): IRequestBody => ({
    method: "UFN_CONVERSATIONCLASSIFICATIONLIST_LEVEL2_SEL",
    key: "UFN_CONVERSATIONCLASSIFICATIONLIST_LEVEL2_SEL",
    parameters: { type, classificationid }
});


export const insUser = ({ id, usr, doctype, send_password_by_email, docnum, password = "", firstname, lastname, email, pwdchangefirstlogin, type, status, description = "", operation, company = "", twofactorauthentication, registercode, billinggroupid, image, language, key = "UFN_USER_INS" }: Dictionary): IRequestBody => ({
    method: "UFN_USER_INS",
    key,
    parameters: { id, usr, doctype, docnum, password: password, firstname, lastname, email, pwdchangefirstlogin, type, status, description, operation, company, twofactorauthentication, sendMailPassword: send_password_by_email, registercode, billinggroup: billinggroupid || 0, image, language }
});

export const insOrgUser = ({ roleid, orgid, bydefault, labels, groups, channels, status, type, supervisor = "", operation, redirect }: Dictionary): IRequestBody => ({
    method: "UFN_ORGUSER_INS",
    key: "UFN_ORGUSER_INS",
    parameters: { orgid, roleid, usersupervisor: supervisor, bydefault, labels, groups, channels, status, type, defaultsort: 1, operation, redirect }
});
export const selOrgSimpleList = (): IRequestBody => ({
    method: "UFN_ORG_LST_SIMPLE",
    key: "UFN_ORG_LST_SIMPLE",
    parameters: { }
});

export const insProperty = ({ orgid, communicationchannelid, id, propertyname, propertyvalue, description, status, type, category, domainname, group, level, operation, corpid }: Dictionary): IRequestBody => ({
    method: "UFN_PROPERTY_INS",
    key: "UFN_PROPERTY_INS",
    parameters: { orgid, communicationchannelid, id, propertyname, propertyvalue, description, status, type, category, domainname, group, level, operation, corpid }
});


export const insGroupConfig = ({ id, operation, domainid, description, type, status, quantity, validationtext }: Dictionary): IRequestBody => ({
    method: "UFN_GROUPCONFIGURATION_INS",
    key: "UFN_GROUPCONFIGURATION_INS",
    parameters: { id, operation, domainid, description, type, status, quantity, validationtext }
});

export const getWhitelistSel = (whitelistid: number): IRequestBody => ({
    method: "UFN_WHITELIST_SEL",
    key: "UFN_WHITELIST_SEL",
    parameters: {
        id: whitelistid,
        all: whitelistid === 0,
    }
});
export const getSecurityRules = (): IRequestBody => ({
    method: "UFN_SECURITYRULES_SEL",
    key: "UFN_SECURITYRULES_SEL",
    parameters: {}
});

export const updSecurityRules = ({ id, mincharacterspwd, maxcharacterspwd, specialcharacterspwd, numericalcharacterspwd, uppercaseletterspwd, lowercaseletterspwd, allowsconsecutivenumbers, numequalconsecutivecharacterspwd, periodvaliditypwd, maxattemptsbeforeblocked, pwddifferentchangelogin, }: Dictionary): IRequestBody => ({
    method: "UFN_SECURITYRULES_UPD",
    key: "UFN_SECURITYRULES_UPD",
    parameters: {
        id, mincharacterspwd, maxcharacterspwd,
        specialcharacterspwd: specialcharacterspwd || "04",
        numericalcharacterspwd: numericalcharacterspwd || "04",
        uppercaseletterspwd: uppercaseletterspwd || "04",
        lowercaseletterspwd: lowercaseletterspwd || "04", allowsconsecutivenumbers, numequalconsecutivecharacterspwd, periodvaliditypwd, maxattemptsbeforeblocked, pwddifferentchangelogin,
    }
});
export const insWhitelist = ({ id, operation, documenttype, phone, documentnumber, usergroup, type, status, username }: Dictionary): IRequestBody => ({
    method: "UFN_WHITELIST_INS",
    key: "UFN_WHITELIST_INS",
    parameters: { id, operation, documenttype, phone: phone.toString() || "", documentnumber: documentnumber.toString(), usergroup, type, status, asesorname: username }
});

export const getInappropriateWordsSel = (id: number): IRequestBody => ({
    method: "UFN_INAPPROPRIATEWORDS_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
});

export const getInappropriateWordsLst = (): IRequestBody => ({
    method: "UFN_INAPPROPRIATEWORDS_LST",
    parameters: {}
});

export const insInappropriateWords = ({ id, description, status, type, username, operation, classification, defaultanswer }: Dictionary): IRequestBody => ({
    method: "UFN_INAPPROPRIATEWORDS_INS",
    parameters: { id, description, status, type, username, operation, classification, defaultanswer }
});

export const insarrayInappropriateWords = (table: Dictionary[]): IRequestBody => ({
    method: "UFN_INAPPROPRIATEWORDS_INS_ARRAY",
    parameters: {
        table: JSON.stringify(table)
    }
});

export const getIntelligentModelsSel = (id: number): IRequestBody => ({
    method: "UFN_INTELLIGENTMODELS_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
});

export const insIntelligentModels = ({ id, operation, description, endpoint, modelid, provider, apikey, type, status }: Dictionary): IRequestBody => ({
    method: "UFN_INTELLIGENTMODELS_INS",
    parameters: { id, operation, description, endpoint, modelid, provider, apikey, type, status }
});

export const getSLASel = (id: number): IRequestBody => ({
    method: "UFN_SLA_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
});
export const getCorpSel = (id: number): IRequestBody => ({
    method: "UFN_CORP_SEL",
    key: "UFN_CORP_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
});
export const getOrgSel = (id: number, corpid?: number): IRequestBody => ({
    method: "UFN_ORG_SEL",
    key: "UFN_ORG_SEL",
    parameters: {
        orgid: id,
        all: id === 0,
        corpid
    }
});

export const getOrgSelList = (id: number): IRequestBody => ({
    method: "UFN_ORG_LIST",
    parameters: {
        corpid: id,
    }
});

export const insSLA = ({ id, description, type, company, communicationchannelid, usergroup, status, totaltmo, totaltmomin, totaltmopercentmax, usertmo, usertmomin, usertmopercentmax,
    usertme, usertmepercentmax, productivitybyhour, operation }: Dictionary): IRequestBody => ({
        method: "UFN_SLA_INS",
        parameters: {
            id,
            description,
            type,
            company,
            communicationchannelid,
            usergroup,
            status,
            totaltmo,
            totaltmomin,
            totaltmopercentmax: parseFloat(totaltmopercentmax),
            totaltmopercentmin: 0.01,
            usertmo,
            usertmomin,
            usertmopercentmax: parseFloat(usertmopercentmax),
            usertmopercentmin: 0.01,
            tme: "00:00:00",
            tmemin: "00:00:00",
            tmepercentmax: 0,
            tmepercentmin: 0.01,
            usertme,
            usertmemin: "00:00:00",
            usertmepercentmax: parseFloat(usertmepercentmax),
            usertmepercentmin: 0.01,
            productivitybyhour: parseFloat(productivitybyhour),
            operation
        }
    });

export const getReportSel = (reportname: string): IRequestBody => ({
    method: "UFN_REPORT_SEL",
    key: "UFN_REPORT_SEL",
    parameters: {
        reportname: reportname,
        all: true
    }
});

export const getReportColumnSel = (functionname: string): IRequestBody => ({
    method: "UFN_REPORT_COLUMN_SEL",
    key: "UFN_REPORT_COLUMN_SEL",
    parameters: {
        function: functionname,
        all: false
    }
});

export const getReportFilterSel = (filter: string, key: string, domainname: string): IRequestBody => ({
    method: filter,
    key: key,
    parameters: {
        domainname,
        all: false
    }
});

export const getPaginatedForReports = (methodCollection: string, methodCount: string, origin: string, { skip, take, filters, sorts, startdate, enddate, ...allParameters }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: methodCollection,
    methodCount: methodCount,
    parameters: {
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        origin: origin,
        ...allParameters,
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        hours: allParameters['hours'] ? allParameters['hours'] : "",
        asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getReportExport = (methodExport: string, origin: string, { filters, sorts, startdate, enddate, ...allParameters }: Dictionary): IRequestBody => ({
    method: methodExport,
    key: methodExport,
    parameters: {
        origin: origin,
        filters,
        startdate,
        enddate,
        sorts,
        ...allParameters,
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        hours: allParameters['hours'] ? allParameters['hours'] : "",
        asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getReportGraphic = (method: string, origin: string, { filters, sorts, startdate, enddate, ...allParameters }: Dictionary): IRequestBody => ({
    method: method,
    key: method,
    parameters: {
        startdate,
        enddate,
        filters,
        sorts,
        origin: origin,
        ...allParameters,
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        hours: allParameters['hours'] ? allParameters['hours'] : "",
        asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getUserProductivitySel = ({ ...allParameters }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_USERPRODUCTIVITY_SEL",
    key: "UFN_REPORT_USERPRODUCTIVITY_SEL",
    parameters: {
        ...allParameters,
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        userstatus: allParameters['userstatus'] ? allParameters['userstatus'] : "",
        usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "",
        bot: allParameters['bot'] ? allParameters['bot'] : false,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getUserProductivityGraphic = ({ ...allParameters }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_USERPRODUCTIVITY_GRAPHIC",
    key: "UFN_REPORT_USERPRODUCTIVITY_GRAPHIC",
    parameters: {
        filters: {}, sorts: {},
        ...allParameters,
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        userstatus: allParameters['userstatus'] ? allParameters['userstatus'] : "",
        usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "",
        bot: allParameters['bot'] ? allParameters['bot'] : false,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getEmojiAllSel = (): IRequestBody => ({
    method: "UFN_EMOJI_ALL_SEL",
    key: "UFN_EMOJI_ALL_SEL",
    parameters: {
        all: true
    }
})

export const getEmojiSel = (emojidec: string): IRequestBody => ({
    method: "UFN_EMOJI_SEL",
    key: "UFN_EMOJI_SEL",
    parameters: {
        emojidec
    }
})

export const insEmoji = ({ favorite, restricted, ...allParameters }: Dictionary): IRequestBody => ({
    method: "UFN_EMOJI_INS",
    key: "UFN_EMOJI_INS",
    parameters: {
        ...allParameters,
        favoritechannels: "",
        restrictedchannels: "",
        favorite,
        restricted,
    }
})

export const getPaginatedTicket = ({ skip, take, filters, sorts, startdate, enddate, ...allParameters }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_CONVERSATIONGRID_SEL",
    methodCount: "UFN_CONVERSATIONGRID_TOTALRECORDS",
    parameters: {
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        origin: "ticket",
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        campaignid: allParameters['campaignid'] ? allParameters['campaignid'] : "",
        usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "",
        lastuserid: allParameters['lastuserid'] ? allParameters['lastuserid'] : "",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const selUniqueContactsPcc = ({ corpid, orgid,year, month, channeltype, skip, take, filters, sorts }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_REPORT_UNIQUECONTACTS_PCC_SEL",
    methodCount: "UFN_REPORT_UNIQUECONTACTS_PCC_TOTALRECORDS",
    parameters: {
        skip,
        take,
        filters,
        sorts,
        year,
        month,
        channeltype:channeltype||'',
        corpid,
        orgid,
        origin: "uniquecontacts",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const selUniqueContactsConversation = ({ corpid, orgid,year, month, channeltype, skip, take, filters, sorts }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_REPORT_UNIQUECONTACTS_CONVERSATION_SEL",
    methodCount: "UFN_REPORT_UNIQUECONTACTS_CONVERSATION_TOTALRECORDS",
    parameters: {
        skip,
        take,
        filters,
        sorts,
        corpid,
        orgid,
        year:parseInt(year),
        month:parseInt(month),
        channeltype:channeltype||'',
        origin: "uniquecontactsconversation",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getTicketExport = ({ filters, sorts, startdate, enddate, ...allParameters }: Dictionary): IRequestBody => ({
    method: "UFN_CONVERSATIONGRID_EXPORT",
    key: "UFN_CONVERSATIONGRID_EXPORT",
    parameters: {
        origin: "ticket",
        filters,
        startdate,
        enddate,
        sorts,
        lastuserid: allParameters['lastuserid'] ? allParameters['lastuserid'] : "",
        usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "",
        campaignid: allParameters['campaignid'] ? allParameters['campaignid'] : "",
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getUniqueContactsExport = ({ corpid,orgid,filters, sorts, year, month, channeltype }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_UNIQUECONTACTS_PCC_EXPORT",
    key: "UFN_REPORT_UNIQUECONTACTS_PCC_EXPORT",
    parameters: {
        origin: "uniquecontacts",
        filters,
        sorts,
        year,
        month,
        corpid,
        orgid,
        channeltype,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getUniqueContactsConversationExport = ({ corpid,orgid,filters, sorts, year, month, channeltype }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_UNIQUECONTACTS_CONVERSATION_EXPORT",
    key: "UFN_REPORT_UNIQUECONTACTS_CONVERSATION_EXPORT",
    parameters: {
        origin: "uniquecontactsconversation",
        filters,
        sorts,
        year,
        month,
        corpid,
        orgid,
        channeltype,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getComunicationChannelDelegate = (communicationchannelid: string): IRequestBody => ({
    method: "UFN_COMMUNICATIONCHANNELID_LST_USRDELEGATE",
    key: "UFN_COMMUNICATIONCHANNELID_LST_USRDELEGATE",
    parameters: {
        communicationchannelid
    }
})

export const insConversationClassificationMassive = (conversationid: string, classificationid: number): IRequestBody => ({
    method: "UFN_CONVERSATIONCLASSIFICATION_INS_MASSIVE",
    key: "UFN_CONVERSATIONCLASSIFICATION_INS_MASSIVE",
    parameters: {
        conversationid,
        classificationid,
    }
});

export const getDomainSel = (domainname: string): IRequestBody => ({
    method: "UFN_DOMAIN_SEL",
    key: "UFN_DOMAIN_SEL",
    parameters: {
        domainname: domainname,
        all: true
    }
})
export const getReportSchedulerSel = (id: number): IRequestBody => ({
    method: "UFN_REPORTSCHEDULER_SEL",
    key: "UFN_REPORTSCHEDULER_SEL",
    parameters: {
        id: id,
        all: true
    }
})
export const reportSchedulerIns = ({ id, title, status, origin, origintype, reportid, reportname, filterjson, frecuency, schedule, datarange, mailto, mailcc, mailsubject, mailbody, mailbodyobject, operation }: Dictionary): IRequestBody => ({
    method: "UFN_REPORTSCHEDULER_INS",
    key: "UFN_REPORTSCHEDULER_INS",
    parameters: {
        id, title, status, origin, origintype, reportid, reportname, filterjson, frecuency, schedule, datarange, mailto, mailcc, mailsubject, mailbody, operation,
        mailbodyobject: JSON.stringify(mailbodyobject),
        description: "",
        type: "",
    }
})

export const getDomainValueSel = (domainname: string): IRequestBody => ({
    method: "UFN_DOMAIN_VALUES_SEL",
    key: "UFN_DOMAIN_VALUES_SEL",
    parameters: {
        domainname: domainname,
        all: true
    }
})

export const insDomain = ({ domainname, description, type, status, operation }: Dictionary): IRequestBody => ({
    method: "UFN_DOMAIN_INS",
    key: "UFN_DOMAIN_INS",
    parameters: { id: 0, domainname, description, type, status, operation }
});

export const insDomainvalue = ({ id, domainname, description, domainvalue, domaindesc, status, type, bydefault, operation }: Dictionary): IRequestBody => ({
    method: "UFN_DOMAIN_VALUES_INS",
    key: "UFN_DOMAIN_VALUES_INS",
    parameters: { id, domainname, description, domainvalue, domaindesc, system: false, status, type, bydefault, operation }
});

export const getQuickrepliesSel = (id: number): IRequestBody => ({
    method: "UFN_QUICKREPLY_SEL",
    parameters: {
        id: id,
        all: true
    }
})

export const insCorp = ({ id, description, type, status, logo, logotype, operation, paymentplanid = 0, doctype = "", docnum = "", businessname = "", fiscaladdress = "", sunatcountry = "", contactemail = "", contact = "", autosendinvoice = false, billbyorg = false, credittype = "", paymentmethod = "", automaticpayment, automaticperiod, automaticinvoice, partner }: Dictionary): IRequestBody => ({
    method: "UFN_CORP_INS",
    key: "UFN_CORP_INS",
    parameters: { companysize: null, id, description, type, status, logo, logotype, operation, paymentplanid, doctype, docnum, businessname, fiscaladdress, sunatcountry, contactemail, contact, autosendinvoice, billbyorg, credittype, paymentmethod, automaticpayment, automaticperiod, automaticinvoice, partner }
});
export const insOrg = ({ corpid, description, status, type, id, operation, currency, email = "", password = "", port = 0, host, ssl, default_credentials, private_mail, doctype = "", docnum = "", businessname = "", fiscaladdress = "", sunatcountry = "", contactemail = "", contact = "", autosendinvoice = false, iconbot = "", iconadvisor = "", iconclient = "", credittype = "", timezone, timezoneoffset, automaticpayment, automaticperiod, automaticinvoice, voximplantautomaticrecharge, voximplantrechargerange, voximplantrechargepercentage, voximplantrechargefixed, voximplantadditionalperchannel }: Dictionary): IRequestBody => ({
    method: "UFN_ORG_INS",
    key: "UFN_ORG_INS",
    parameters: { corpid, id, description, status, type, operation, currency, email, password, port: parseInt(port), host, ssl, default_credentials, private_mail, country: null, doctype, docnum, businessname, fiscaladdress, sunatcountry, contactemail, contact, autosendinvoice, iconbot, iconadvisor, iconclient, credittype, timezone, timezoneoffset, automaticpayment, automaticperiod, automaticinvoice, voximplantautomaticrecharge, voximplantrechargerange, voximplantrechargepercentage, voximplantrechargefixed, voximplantadditionalperchannel }
});

export const insQuickreplies = ({ id, classificationid, description, quickreply, status, type, operation, favorite }: Dictionary): IRequestBody => ({
    method: "UFN_QUICKREPLY_INS",
    key: "UFN_QUICKREPLY_INS",
    parameters: { id, classificationid, description, quickreply, status, type, operation, favorite }
});

export const getTimeZoneSel = () => ({
    method: "UFN_TIMEZONE_SEL",
    key: "UFN_TIMEZONE_SEL",
    parameters: {}
})
export const getClassificationSel = (id: number): IRequestBody => ({
    method: "UFN_CLASSIFICATION_SEL",
    key: "UFN_CLASSIFICATION_SEL",
    parameters: {
        id: id,
        all: true
    }
})
export const insInvoice = ({ corpid = 0,
    orgid = 0, year, month, description, status, receiverdoctype, receiverdocnum, receiverbusinessname, receiverfiscaladdress, receivercountry, receivermail, invoicetype, serie, correlative, invoicedate, expirationdate, invoicestatus, paymentstatus, paymentdate, paidby, paymenttype, totalamount, exchangerate, currency, urlcdr, urlpdf, urlxml, purchaseorder, comments, credittype, }: Dictionary): IRequestBody => ({
        method: "UFN_INVOICE_IMPORT",
        key: "UFN_INVOICE_IMPORT",
        parameters: {
            corpid,
            orgid,
            year,
            month,
            description,
            status,
            receiverdoctype,
            receiverdocnum,
            receiverbusinessname,
            receiverfiscaladdress,
            receivercountry,
            receivermail,
            invoicetype,
            serie,
            correlative,
            invoicedate,
            expirationdate,
            invoicestatus,
            paymentstatus,
            paymentdate,
            paidby,
            paymenttype,
            totalamount,
            exchangerate,
            currency,
            urlcdr,
            urlpdf,
            urlxml,
            purchaseorder,
            comments,
            credittype,
        }
    })

export const insClassification = ({ id, title, description, parent, communicationchannel, status, type, operation, tags, jobplan = null }: Dictionary): IRequestBody => ({
    method: "UFN_CLASSIFICATION_INS",
    key: "UFN_CLASSIFICATION_INS",
    parameters: {
        id, title, description, parent, communicationchannel, status, type, operation, tags, jobplan, usergroup: 0, schedule: ""
    }
})
//tabla paginada
export const getPaginatedPerson = ({ skip, take, filters, sorts, startdate, enddate, userids = "", channeltypes = "" }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_PERSON_SEL",
    methodCount: "UFN_PERSON_TOTALRECORDS",
    parameters: {
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        origin: "person",
        userids,
        channeltypes,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const getPaginatedPersonLead = ({ skip, take, filters, sorts, startdate, enddate, userids = "", channeltypes = "" }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_LEAD_PERSON_SEL",
    methodCount: "UFN_LEAD_PERSON_TOTALRECORDS",
    parameters: {
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        origin: "person",
        userids,
        channeltypes,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
//tabla paginada
export const getPaginatedPersonLink = ({ skip, take, filters, sorts, originpersonid }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_PERSON_LINK_SEL",
    methodCount: "UFN_PERSON_LINK_TOTALRECORDS",
    parameters: {
        originpersonid,
        skip,
        take,
        filters,
        sorts,
        origin: "person",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
//tabla paginada
export const getPersonExport = ({ filters, sorts, startdate, enddate, userids, personcommunicationchannels }: Dictionary): IRequestBody => ({
    method: "UFN_PERSON_EXPORT",
    key: "UFN_PERSON_EXPORT",
    parameters: {
        origin: "person",
        filters,
        startdate,
        enddate,
        sorts,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        userids,
        personcommunicationchannels, // channel types
    }
});

export const getConfigurationVariables = (communicationchannelid: number): IRequestBody => ({
    method: "UFN_TABLEVARIABLECONFIGURATIONBYCHANNEL_SEL",
    key: "UFN_TABLEVARIABLECONFIGURATIONBYCHANNEL_SEL",
    parameters: { communicationchannelid }
});

export const getCommChannelLst = (): IRequestBody => ({
    method: "UFN_COMMUNICATIONCHANNEL_LST",
    key: "UFN_COMMUNICATIONCHANNEL_LST",
    parameters: {
    }
});

export const getValuesForTree = (type = "QUICKREPLY"): IRequestBody => ({
    method: "UFN_CLASSIFICATION_QUICKREPLYTREE_SEL",
    key: "UFN_CLASSIFICATION_QUICKREPLYTREE_SEL",
    parameters: {
        type
    }
});

export const getParentSel = (): IRequestBody => ({
    method: "UFN_CLASSIFICATION_LST_PARENT",
    parameters: {
        classificationid: 0,
    }
});

export const getMessageTemplateSel = (id: number): IRequestBody => ({
    method: "UFN_MESSAGETEMPLATE_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
});

export const getMessageTemplateLst = (type: string): IRequestBody => ({
    method: "UFN_MESSAGETEMPLATE_LST",
    parameters: {
        type: type,
    }
});

export const insMessageTemplate = (
    {
        id,
        description,
        type,
        status,
        name,
        namespace,
        category,
        language,
        templatetype,
        headerenabled,
        headertype,
        header,
        body,
        bodyobject,
        footerenabled,
        footer,
        buttonsenabled,
        buttons,
        priority,
        attachment,
        fromprovider,
        externalid,
        externalstatus,
        communicationchannelid,
        communicationchanneltype,
        exampleparameters,
        operation
    }: Dictionary): IRequestBody => ({

        method: "UFN_MESSAGETEMPLATE_INS",
        parameters: {
            id,
            description,
            type,
            status,
            name,
            namespace,
            category,
            language,
            templatetype,
            headerenabled,
            headertype,
            header,
            body,
            bodyobject: JSON.stringify(bodyobject),
            footerenabled,
            footer,
            buttonsenabled,
            buttons: JSON.stringify(buttons),
            priority,
            attachment,
            fromprovider,
            externalid,
            externalstatus,
            communicationchannelid,
            communicationchanneltype,
            exampleparameters,
            operation
        }
    });

export const getIntegrationManagerSel = (id: number): IRequestBody => ({
    method: "UFN_INTEGRATIONMANAGER_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
});

export const insIntegrationManager = ({
    id,
    description,
    type,
    status,
    name,
    method,
    url,
    authorization,
    headers,
    bodytype,
    body,
    parameters,
    variables,
    level,
    fields,
    apikey,
    operation,
    orgid
}: Dictionary): IRequestBody => ({
    method: "UFN_INTEGRATIONMANAGER_INS",
    parameters: {
        id,
        description,
        type,
        status,
        name,
        method,
        url,
        authorization: JSON.stringify(authorization),
        headers: JSON.stringify(headers),
        bodytype,
        body: body,
        parameters: JSON.stringify(parameters),
        variables: JSON.stringify(variables),
        level,
        fields: JSON.stringify(fields),
        apikey,
        operation,
        orgid
    }
});

export const insarrayIntegrationManager = (id: number, table: Dictionary[]): IRequestBody => ({
    method: "UFN_INTEGRATIONMANAGER_IMPORT",
    parameters: {
        id: id,
        table: JSON.stringify(table)
    }
});

export const importPerson = (table: Dictionary[]): IRequestBody => ({
    method: "UDTT_PERSON_PCC_IMPORT",
    parameters: {
        table: JSON.stringify(table)
    }
});

export const deldataIntegrationManager = (id: number): IRequestBody => ({
    method: "UFN_INTEGRATIONMANAGER_DELETEDATA",
    parameters: {
        id: id
    }
});

export const getdataIntegrationManager = (id: number): IRequestBody => ({
    method: "UFN_INTEGRATIONMANAGER_EXPORT",
    parameters: {
        id: id
    }
});

export const getChannelSel = (id: number, orgid?: number, corpid?: number): IRequestBody => ({
    method: "UFN_COMMUNICATIONCHANNEL_SEL",
    parameters: {
        communicationchannelid: id,
        personcommunicationchannel: "",
        all: id === 0,
        orgid,
        corpid
    }
});
export const getasesoresbyorgid = (closedby: string): IRequestBody => ({
    method: "UFN_USER_REPORT_HEATMAP_ASESOR_LST",
    parameters: {
        bot: closedby.includes("BOT")
    }
});

export const getChatflowBlockLst = (): IRequestBody => ({
    method: "UFN_CHATFLOW_BLOCK_LST",
    parameters: {}
});

export const getChatflowBlockSel = (id: string): IRequestBody => ({
    method: "UFN_CHATFLOW_BLOCK_SEL",
    parameters: {
        chatblockid: id
    }
});

export const insChatflowBlock = ({
    communicationchannelid,
    chatblockid,
    title,
    description,
    defaultgroupid,
    defaultblockid,
    firstblockid,
    aiblockid,
    blockgroup,
    variablecustom,
    color,
    icontype,
    tag,
    status,
    chatblockversionid,
    surveyid,
    queryprocess,
}: Dictionary): IRequestBody => ({
    method: "UFN_CHATFLOW_BLOCK_INS",
    parameters: {
        communicationchannelid,
        chatblockid,
        title,
        description,
        defaultgroupid,
        defaultblockid,
        firstblockid,
        aiblockid,
        blockgroup: JSON.stringify(blockgroup),
        variablecustom: JSON.stringify(variablecustom),
        color,
        icontype,
        tag,
        status,
        chatblockversionid,
        surveyid,
        queryprocess,
    }
});

export const dupChatflowBlock = ({
    corpid,
    orgid,
    chatblockid,
    defaultgroupid,
    defaultblockid,
    firstblockid,
    blockgroup
}: Dictionary): IRequestBody => ({
    method: "UFN_CHATFLOW_BLOCK_DUP",
    parameters: {
        corpid,
        orgid,
        chatblockidold: chatblockid,
        chatblockidnew: uuidv4(),
        defaultgroupid,
        defaultblockid,
        firstblockid,
        blockgroup: JSON.stringify(blockgroup),
    }
});

export const getVariableConfigurationLst = (): IRequestBody => ({
    method: "UFN_VARIABLECONFIGURATION_LST",
    parameters: {}
});

export const getTicketsByFilter = (lastmessage: string, start_createticket: string, end_createticket: string, channels: string, conversationstatus: string, displayname: string, phone: string): IRequestBody => ({
    method: "UFN_CONVERSATION_SEL_TICKETSBYUSER_FILTER",
    parameters: {
        lastmessage,
        start_createticket,
        end_createticket,
        channels,
        conversationstatus,
        displayname,
        phone,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});


export const getVariableConfigurationSel = (id: string): IRequestBody => ({
    method: "UFN_VARIABLECONFIGURATION_SEL",
    parameters: {
        chatblockid: id
    }
});



export const insVariableConfiguration = ({
    corpid,
    orgid,
    chatblockid,
    variable,
    description,
    fontcolor,
    fontbold,
    priority,
    visible
}: Dictionary): IRequestBody => ({
    method: "UFN_VARIABLECONFIGURATION_INS",
    parameters: {
        corpid,
        orgid,
        chatblockid,
        variable,
        description,
        fontcolor,
        fontbold,
        priority,
        visible
    }
});
export const insarrayVariableConfiguration = (table: Dictionary[]): IRequestBody => ({
    method: "UFN_VARIABLECONFIGURATION_INS_ARRAY",
    parameters: {
        table: JSON.stringify(table)
    }
});

export const getInsertChatwebChannel = (name: string, auto: boolean, iconColor: string, service: IChatWebAdd): IRequestBody<IChatWebAdd> => ({
    method: "UFN_COMMUNICATIONCHANNEL_INS",
    parameters: {
        id: 0,
        description: name,
        type: "",
        communicationchannelsite: "id del canal",
        communicationchannelowner: "id del canal",
        chatflowenabled: auto,
        integrationid: "",
        color: iconColor,
        icons: "",
        other: "",
        form: "",
        apikey: "",
        coloricon: iconColor,
    },
    type: "CHATWEB",
    service,
});

export const getEditChannel = (id: number, payload: IChannel, name: string, auto: boolean, iconColor: string, welcometoneurl?: string, holdingtoneurl?: string): IRequestBody<IChannel> => ({
    method: "UFN_COMMUNICATIONCHANNEL_INS",
    parameters: {
        ...payload,
        operation: 'UPDATE',
        id: id,
        description: name,
        chatflowenabled: auto,
        color: iconColor,
        coloricon: iconColor,
        corpid: null,
        orgid: null,
        username: null,
        apikey: "",
        updintegration: null,
        motive: "Edited from API",
        voximplantwelcometone: welcometoneurl || "",
        voximplantholdtone: holdingtoneurl || "",
    },
});

export const getEditChatWebChannel = (id: number, channel: IChannel, service: IChatWebAdd, name: string, auto: boolean, iconColor: string): IRequestBody<IChatWebAdd> => ({
    method: "UFN_COMMUNICATIONCHANNEL_INS",
    parameters: {
        ...channel,
        operation: 'UPDATE',
        id: id,
        description: name,
        chatflowenabled: auto,
        color: iconColor,
        coloricon: iconColor,
        corpid: null,
        orgid: null,
        username: null,
        apikey: "",
        updintegration: null,
        motive: "Edited from API",
    },
    type: "CHATWEB",
    service,
});

export const getCampaignLst = (): IRequestBody => ({
    method: "UFN_CAMPAIGN_LST",
    parameters: {}
});

export const getCampaignSel = (id: number): IRequestBody => ({
    method: "UFN_CAMPAIGN_SEL",
    parameters: {
        id
    }
});

export const insCampaign = ({
    id,
    communicationchannelid,
    usergroup,
    type,
    status,
    title,
    description,
    subject,
    message,
    startdate,
    enddate,
    repeatable,
    frecuency,
    messagetemplateid,
    messagetemplatename,
    messagetemplatenamespace,
    messagetemplateheader,
    messagetemplatebuttons,
    messagetemplatefooter,
    messagetemplatetype,
    messagetemplateattachment,
    source,
    messagetemplatelanguage,
    messagetemplatepriority,
    executiontype,
    batchjson,
    fields,
    operation,
    selectedColumns
}: Dictionary): IRequestBody => ({
    method: "UFN_CAMPAIGN_INS",
    parameters: {
        id,
        communicationchannelid,
        usergroup,
        type,
        status,
        title,
        description,
        subject,
        message,
        startdate,
        enddate,
        repeatable,
        frecuency,
        messagetemplateid,
        messagetemplatename,
        messagetemplatenamespace,
        messagetemplateheader: JSON.stringify(messagetemplateheader),
        messagetemplatebuttons: JSON.stringify(messagetemplatebuttons),
        messagetemplatefooter: messagetemplatefooter || null,
        messagetemplatetype: messagetemplatetype || null,
        messagetemplateattachment: messagetemplateattachment || null,
        source: source || null,
        messagetemplatelanguage: messagetemplatelanguage || null,
        messagetemplatepriority: messagetemplatepriority || null,
        executiontype,
        batchjson: JSON.stringify(batchjson),
        fields: JSON.stringify(selectedColumns || fields),
        operation
    }
});

export const delCampaign = ({
    id,
    status,
    operation
}: Dictionary): IRequestBody => ({
    method: "UFN_CAMPAIGN_DEL",
    parameters: {
        id,
        status,
        operation
    }
});

export const stopCampaign = ({ campaignid }: Dictionary): IRequestBody => ({
    method: "UFN_CAMPAIGN_STOP",
    parameters: {
        campaignid
    }
});

export const campaignPersonSel = ({ skip, take, filters, sorts, startdate, enddate }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_CAMPAIGN_PERSON_SEL",
    methodCount: "UFN_CAMPAIGN_PERSON_TOTALRECORDS",
    parameters: {
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        origin: "campaignperson",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const campaignLeadPersonSel = ({ skip, take, filters, sorts, startdate, enddate }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_CAMPAIGN_LEAD_PERSON_SEL",
    methodCount: "UFN_CAMPAIGN_LEAD_PERSON_TOTALRECORDS",
    parameters: {
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        origin: "campaignleadperson",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getUserGroupsSel = (): IRequestBody => ({
    method: "UFN_USER_GROUPS_SEL",
    parameters: {}
});

export const getCampaignMemberSel = (campaignid: number): IRequestBody => ({
    method: "UFN_CAMPAIGNMEMBER_SEL",
    parameters: {
        campaignid
    }
});

export const insCampaignMember = ({
    id,
    campaignid,
    personid,
    personcommunicationchannel,
    personcommunicationchannelowner,
    type,
    displayname,
    status,
    field1,
    field2,
    field3,
    field4,
    field5,
    field6,
    field7,
    field8,
    field9,
    field10,
    field11,
    field12,
    field13,
    field14,
    field15,
    batchindex,
    operation,
}: Dictionary): IRequestBody => ({
    method: "UFN_CAMPAIGNMEMBER_INS",
    parameters: {
        id,
        campaignid,
        personid,
        personcommunicationchannel,
        personcommunicationchannelowner,
        type,
        displayname,
        status,
        field1,
        field2,
        field3,
        field4,
        field5,
        field6,
        field7,
        field8,
        field9,
        field10,
        field11,
        field12,
        field13,
        field14,
        field15,
        batchindex,
        operation,
    }
});

export const getTicketListByPersonBody = (personId: ID, { filters, sorts, take, skip, offset = 0 }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_CONVERSATION_SEL_PERSON",
    methodCount: "UFN_CONVERSATION_SEL_PERSON_TOTALRECORDS",
    parameters: {
        origin: "person",
        personid: personId,
        filters,
        sorts,
        take,
        skip,
        offset,
    },
});

export const getReferrerByPersonBody = (personId: ID) => ({
    method: "UFN_PERSONREFERRER_SEL",
    parameters: {
        personid: personId,
    },
});

export const insPersonUpdateLocked = ({ personid, locked }: Dictionary) => ({
    method: "UFN_PERSONCOMMUNICATIONCHANNEL_UPDATE_LOCKED",
    parameters: {
        personid,
        personcommunicationchannel: "",
        locked
    },
});

export const getChannelListByPersonBody = (personId: ID) => ({
    method: "UFN_PERSONCOMMUNICATIONCHANNEL_SEL",
    parameters: {
        personid: personId,
        personcommunicationchannel: "",
        all: true,
    },
});

export const getAdditionalInfoByPersonBody = (personId: ID) => ({
    method: "UFN_PERSONADDINFO_SEL",
    parameters: {
        personid: personId,
    },
});

/**Person Leads */
export const getOpportunitiesByPersonBody = (personId: ID) => ({
    method: "",
    parameters: {
        personid: personId,
    },
});

export const getTagsChatflow = () => ({
    method: "UFN_CHATFLOW_TAG_SEL",
    parameters: {},
});
export const getReportTemplateSel = (reporttemplateid = 0) => ({
    method: "UFN_REPORTTEMPLATE_SEL",
    key: "UFN_REPORTTEMPLATE_SEL",
    parameters: {
        reporttemplateid,
        all: reporttemplateid === 0,
    },
});
export const insertReportTemplate = (
    { id,
        description,
        status,
        type,
        columnjson,
        filterjson,
        dataorigin,
        summaryjson,
        operation }: Dictionary
) => ({
    method: "UFN_REPORTTEMPLATE_INS",
    parameters: {
        id,
        description,
        status,
        type,
        columnjson,
        filterjson,
        summaryjson,
        dataorigin,
        communicationchannelid: '',
        operation,
    },
});

export const insBlacklist = ({ id, description, type, status, phone, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BLACKLIST_INS",
    parameters: {
        id,
        description,
        type,
        status,
        phone,
        operation,
    },
});

export const insarrayBlacklist = (table: Dictionary[]): IRequestBody => ({
    method: "UFN_BLACKLIST_INS_ARRAY",
    parameters: {
        table: JSON.stringify(table)
    },
});

export const getBlacklistPaginated = ({ filters, sorts, take, skip }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_BLACKLIST_SEL",
    methodCount: "UFN_BLACKLIST_TOTALRECORDS",
    parameters: {
        origin: "blacklist",
        filters,
        sorts,
        take,
        skip,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getBlacklistExport = ({ filters, sorts }: Dictionary): IRequestBody => ({
    method: "UFN_BLACKLIST_EXPORT",
    key: "UFN_BLACKLIST_EXPORT",
    parameters: {
        origin: "blacklist",
        filters,
        sorts,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getCampaignReportPaginated = ({ startdate, enddate, filters, sorts, take, skip }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_CAMPAIGNREPORT_SEL",
    methodCount: "UFN_CAMPAIGNREPORT_TOTALRECORDS",
    parameters: {
        origin: "campaignreport",
        startdate,
        enddate,
        filters,
        sorts,
        take,
        skip,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getCampaignReportExport = (table: Dictionary[]): IRequestBody => ({
    method: "UFN_CAMPAIGNREPORT_EXPORT",
    key: "UFN_CAMPAIGNREPORT_EXPORT",
    parameters: {
        origin: "campaignreport",
        table: JSON.stringify(table),
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});

export const getCampaignReportProactiveExport = (table: Dictionary[]): IRequestBody => ({
    method: "UFN_CAMPAIGNREPORT_PROACTIVE_EXPORT",
    key: "UFN_CAMPAIGNREPORT_PROACTIVE_EXPORT",
    parameters: {
        origin: "campaignreport",
        table: JSON.stringify(table),
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});

export const getCampaignStart = (id: number): IRequestBody => ({
    method: "UFN_CAMPAIGN_START",
    parameters: {
        id,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    },
});

export const getCampaignStatus = (id: number): IRequestBody => ({
    method: "UFN_CAMPAIGN_STATUS",
    parameters: {
        id,
    },
});

export const getBlocksUserFromChatfow = (communicationchannelid: number): IRequestBody => ({
    method: "UFN_CHATFLOW_ISSELFBLOCK_SEL",
    parameters: { communicationchannelid },
});

export const reassignMassiveTicket = (conversationid: string, newuserid: number, comment: string, newusergroup: string): IRequestBody => ({
    method: "UFN_CONVERSATION_REASSIGNTICKET_MASSIVE",
    parameters: {
        conversationid,
        newuserid: newusergroup !== "" && newuserid === 0 ? 3 : newuserid,
        comment,
        newusergroup
    },
});

export const getIntelligentModelsConfigurations = (): IRequestBody => ({
    method: "UFN_INTELLIGENTMODELSCONFIGURATION_LST",
    parameters: {}
});

export const getIntelligentModels = (): IRequestBody => ({
    method: "UFN_INTELLIGENTMODELS_LST",
    parameters: {}
});

export const insInteligentModelConfiguration = ({ channels, id, operation, description, type, status, color, icontype, services }: Dictionary): IRequestBody => ({
    method: 'UFN_INTELLIGENTMODELSCONFIGURATION_INS',
    key: "UFN_INTELLIGENTMODELSCONFIGURATION_INS",
    parameters: {
        communicationchannelid: channels,
        intelligentmodelsconfigurationid: id,
        operation,
        description,
        type,
        status,
        color,
        icontype,
        parameters: services
    }
});
export const gerencialTMOsel = ({ startdate, enddate, channel, group, company, closedby = "ASESOR,BOT", min = "", max = "", target = 0, skipdown = 0, skipup = 0, bd = true }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_SEL",
    parameters: {
        startdate, enddate, channel, group, company, level: 0, closedby, min: min === "" ? "00:00:00" : min, max: max === "" ? "99:00:00" : max, target: target / 100, skipdown: skipdown / 100, skipup: skipup / 100, bd, offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialTMOselData = ({ startdate, enddate, channel, group, company, bd = true }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, level: 0, closedby: "ASESOR,BOT", min: 0, max: 0, target: 0, skipdown: 0, skipup: 0, bd, offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialTMEsel = ({ startdate, enddate, channel, group, company, closedby = "ASESOR,BOT", min = "", max = "", target = 0, skipdown = 0, skipup = 0, bd = true }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_TME_GENERAL_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_TME_GENERAL_SEL",
    parameters: {
        startdate, enddate, channel, group, company, level: 0, closedby, min: min === "" ? "00:00:00" : min, max: max === "" ? "99:00:00" : max, target: target / 100, skipdown: skipdown / 100, skipup: skipup / 100, bd, offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialTMEselData = ({ startdate, enddate, channel, group, company, bd = true }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_TME_GENERAL_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_TME_GENERAL_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, level: 0, closedby: "ASESOR,BOT", min: 0, max: 0, target: 0, skipdown: 0, skipup: 0, bd, offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialEncuestassel = ({ startdate, enddate, channel, group, company, question, closedby = "ASESOR,BOT", target = 0, bd = true }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_ENCUESTA3_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_ENCUESTA3_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        level: 0,
        closedby,
        question,
        target: target / 100,
        bd,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialsummarysel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_SUMMARY_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_SUMMARY_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialsummaryseldata = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_SUMMARY_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_SUMMARY_DATA_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialencuestasel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_ENCUESTA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_ENCUESTA_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        closedby: "",
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }

});
export const gerencialEncuesta3selData = ({ startdate, enddate, channel, group, company, question }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_ENCUESTA3_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_ENCUESTA3_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, question, closedby: "ASESOR,BOT", target: 0, offset: (new Date().getTimezoneOffset() / 60) * -1,
    }

});
export const gerencialEncuesta2selData = ({ startdate, enddate, channel, group, company, question }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_ENCUESTA2_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_ENCUESTA2_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, question, closedby: "ASESOR,BOT", target: 0, offset: (new Date().getTimezoneOffset() / 60) * -1,
    }

});
export const gerencialconversationsel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_CONVERSATION_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_CONVERSATION_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialconversationseldata = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_CONVERSATION_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_CONVERSATION_DATA_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialinteractionsel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_INTERACTION_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_INTERACTION_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialinteractionseldata = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_INTERACTION_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_INTERACTION_DATA_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialchannelsel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_CHANNEL_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_CHANNEL_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialetiquetassel = ({ startdate, enddate, channel, group, company, limit = 5 }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_ETIQUETAS_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_ETIQUETAS_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        limit,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialetiquetasseldata = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_ETIQUETAS_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_ETIQUETAS_DATA_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        limit: 5,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialasesoresconectadosbarsel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialasesoresconectadosbarseldata = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_DATA_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});

/// Settings tab (drawer)
export const getCountConfigurationsBody = (): IRequestBody => ({
    method: "UFN_COUNT_CONFIGURATION",
    parameters: {}
});
export const getSupervisorsSel = (): IRequestBody => ({
    method: 'UFN_USER_SUPERVISORBYORGID_LST',
    key: "UFN_USER_SUPERVISORBYORGID_LST",
    parameters: {}
});
export const getLabelsSel = (): IRequestBody => ({
    method: 'UFN_LABEL_LST',
    key: "UFN_LABEL_LST",
    parameters: {}
});
export const getdashboardPushHSMCATEGORYRANKSel = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_HSMCATEGORYRANK_SEL',
    key: "UFN_DASHBOARD_PUSH_HSMCATEGORYRANK_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushHSMCATEGORYRANKSelData = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_HSMCATEGORYRANK_DATA_SEL',
    key: "UFN_DASHBOARD_PUSH_HSMCATEGORYRANK_DATA_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushSUMMARYSel = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_SUMMARY_SEL',
    key: "UFN_DASHBOARD_PUSH_SUMMARY_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushSUMMARYSelData = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_SUMMARY_DATA_SEL',
    key: "UFN_DASHBOARD_PUSH_SUMMARY_DATA_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushHSMRANKSel = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_HSMRANK_SEL',
    key: "UFN_DASHBOARD_PUSH_HSMRANK_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushHSMRANKSelData = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_HSMRANK_DATA_SEL',
    key: "UFN_DASHBOARD_PUSH_HSMRANK_DATA_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushMENSAJEXDIASel = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_MENSAJEXDIA_SEL',
    key: "UFN_DASHBOARD_PUSH_MENSAJEXDIA_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardRankingPushSel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_TAG_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_TAG_SEL",
    parameters: { startdate, enddate, channel, group, company, offset: (new Date().getTimezoneOffset() / 60) * -1 }
});
export const getdashboardRankingPushDataSel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_TAG_DATA_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_TAG_DATA_SEL",
    parameters: { startdate, enddate, channel, group, company, offset: (new Date().getTimezoneOffset() / 60) * -1 }
});
export const getdashboardPushAppSel = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_APPLICATION_SEL',
    key: "UFN_DASHBOARD_PUSH_APPLICATION_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushAppDataSel = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_APPLICATION_DATA_SEL',
    key: "UFN_DASHBOARD_PUSH_APPLICATION_DATA_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushMENSAJEXDIASelData = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_MENSAJEXDIA_DATA_SEL',
    key: "UFN_DASHBOARD_PUSH_MENSAJEXDIA_DATA_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardoperativoTMOGENERALSel = ({ startdate, enddate, channel, group, company, label, supervisor, closedby = "ASESOR", bd = true, min = "", max = "", target = 0, skipdown = 0, skipup = 0 }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        level: 0,
        closedby,
        skipdown: skipdown / 100,
        skipup: skipup / 100,
        bd,
        min: min === "" ? "00:00:00" : min,
        max: max === "" ? "99:00:00" : max,
        target: target / 100,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoTMOGENERALSeldata = ({ startdate, enddate, channel, group, company, label, supervisor, bd = true }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_DATA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        level: 0,
        closedby: "",
        skipdown: 0,
        skipup: 0,
        bd,
        min: "00:00:00",
        max: "00:00:00",
        target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoTMEGENERALSel = ({ startdate, enddate, channel, group, company, bd = true, label, supervisor, closedby = "ASESOR", min = "", max = "", target = 0, skipdown = 0, skipup = 0 }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_TME_GENERAL_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_TME_GENERAL_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        level: 0,
        closedby,
        skipdown: skipdown / 100,
        skipup: skipup / 100,
        bd,
        min: min === "" ? "00:00:00" : min,
        max: max === "" ? "99:00:00" : max,
        target: target / 100,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoTMEGENERALSeldata = ({ startdate, enddate, channel, group, company, label, supervisor, bd = true }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_TME_GENERAL_DATA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_TME_GENERAL_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        level: 0,
        closedby: "",
        skipdown: 0,
        skipup: 0,
        bd,
        min: "00:00:00",
        max: "00:00:00",
        target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardgerencialconverstionxhoursel = ({ startdate, enddate, channel, group, company, skipdown, skipup }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_CONVERSATIONXHOUR_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_CONVERSATIONXHOUR_SEL",
    parameters: {
        startdate, enddate, channel, group, company,
        skipdown: skipdown / 100,
        skipup: skipup / 100,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const getdashboardoperativoSummarySel = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_SUMMARY_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_SUMMARY_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        skipdowntmo: 0,
        skipuptmo: 0,
        skipdowntme: 0,
        skipuptme: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoTMOdistseldata = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_TMODIST_DATA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_TMODIST_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        skipdowntmo: 0,
        skipuptmo: 0,
        skipdowntme: 0,
        skipuptme: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoTMEdistseldata = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_TMEDIST_DATA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_TMEDIST_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        skipdowntmo: 0,
        skipuptmo: 0,
        skipdowntme: 0,
        skipuptme: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoProdxHoraSel = ({ startdate, enddate, channel, group, company, label, supervisor, level }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_PRODXHORA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_PRODXHORA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        level,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoProdxHoraDistSel = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_PRODXHORADIST_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_PRODXHORADIST_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoProdxHoraDistSeldata = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_PRODXHORADIST_DATA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_PRODXHORADIST_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoEncuesta3Sel = ({ startdate, enddate, channel, group, company, label, question, closedby, target, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA3_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA3_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label, question, closedby, target: target / 100,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoEncuestaSel = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label, closedby: "",
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoEncuesta3Seldata = ({ startdate, enddate, channel, group, company, label, supervisor, question }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA3_DATA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA3_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label, question, closedby: "ASESOR,BOT", target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoEncuesta2Seldata = ({ startdate, enddate, channel, group, company, label, supervisor, question }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA2_DATA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA2_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label, question, closedby: "ASESOR,BOT", target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});

export const getPropertySelByName = (propertyname: string, key = ""): IRequestBody => ({
    method: 'UFN_PROPERTY_SELBYNAME',
    key: `UFN_PROPERTY_SELBYNAME${key}`,
    parameters: {
        propertyname
    }
});

export const getPropertySelByNameOrg = (propertyname: string, orgid: number, key: string): IRequestBody => ({
    method: 'UFN_PROPERTY_SELBYNAME',
    key: "UFN_PROPERTY_SELBYNAME" + key,
    parameters: {
        propertyname, orgid
    }
});

export const getConversationClassification2 = (conversationid: number): IRequestBody => ({
    method: 'UFN_CONVERSATIONCLASSIFICATION_SEL2',
    key: "UFN_CONVERSATIONCLASSIFICATION_SEL2",
    parameters: {
        conversationid
    }
});

/// Settings tab (drawer)
export const getPropertyConfigurationsBody = (): IRequestBody[] => ([
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'MAXIMONUMEROTICKETS' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONSESIONASESOR' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONSESIONADMINISTRADOR' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'CIERREAUTOMATICO' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONSESIONSUPERVISOR' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'ACCIONFUERAHORARIO' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONENCUESTA' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'WAITINGMESSAGE' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'WAITINGREPETITIVEMESSAGE' },
    },
]);

export const insPersonBody = (person: Dictionary): IRequestBody => ({
    method: 'UFN_PERSON_INS',
    parameters: {
        ...person,
        corpid: null,
        orgid: null,
        phone: person?.phone?.replaceAll('+', ''),
        observation: person.observation || '',
    },
});

export const insPersonCommunicationChannel = (pcc: Dictionary): IRequestBody => ({
    method: 'UFN_PERSONCOMMUNICATIONCHANNEL_INS',
    parameters: {
        ...pcc,
        corpid: null,
        type: pcc.type || "VOXI",
        orgid: null,
    },
});
export const personInsValidation = ({ id, phone, email, alternativephone, alternativeemail, operation }: Dictionary): IRequestBody => ({
    method: 'UFN_PERSON_INS_VALIDATION',
    parameters: {
        id,
        phone: phone?.replaceAll('+', '') || "",
        email,
        alternativephone: alternativephone?.replaceAll('+', '') || "",
        alternativeemail,
        operation
    },
});
export const personImportValidation = ({ table }: Dictionary): IRequestBody => ({
    method: 'UFN_PERSON_IMPORT_VALIDATION',
    parameters: {
        table
    },
});

export const editPersonBody = (person: IPerson): IRequestBody => ({
    method: 'UFN_PERSON_PCC_INS',
    parameters: {
        ...person,
        alternativephone: person?.alternativephone?.replaceAll('+', '') || "",
        id: person.personid,
        operation: person.personid ? 'UPDATE' : 'INSERT',
        observation: person.observation || '',
        phone: person?.phone?.replaceAll('+', '') || "",
    },
});

// export const insLead = (lead: ILead, operation: string): IRequestBody => ({
//     method: 'UFN_LEAD_INS',
//     parameters: {
//         ...lead,
//         id: lead.leadid,
//         operation
//     },
// });

export const insLeadPerson = (lead: ILead, firstname: string, lastname: string, email: string, phone: string, personid: number): IRequestBody => ({
    method: 'UFN_LEAD_PERSON_INS',
    parameters: {
        ...lead,
        id: lead.leadid,
        firstname,
        lastname,
        email,
        phone,
        personid,
    },
});
export const getColumnsSel = (id: number, lost: boolean = false): IRequestBody => ({
    method: "UFN_COLUMN_SEL",
    key: "UFN_COLUMN_SEL",
    parameters: {
        id: id,
        all: true,
        lost
    }
})

export const getLeadsSel = (params: ICrmLeadSel): IRequestBody => ({
    method: "UFN_LEAD_SEL",
    key: "UFN_LEAD_SEL",
    parameters: {
        ...params,
        all: params.id === 0,
    }
})
export const getAutomatizationRulesSel = ({ id, communicationchannelid }: Dictionary): IRequestBody => ({
    method: "UFN_LEADAUTOMATIZATIONRULES_SEL",
    key: "UFN_LEADAUTOMATIZATIONRULES_SEL",
    parameters: {
        id,
        communicationchannelid,
        all: id === 0
    }
})

export const insAutomatizationRules = ({ id, description, status, type, columnid, communicationchannelid, messagetemplateid, messagetemplateparameters, shippingtype, xdays, schedule, tags, products, operation }: Dictionary): IRequestBody => ({
    method: 'UFN_LEADAUTOMATIZATIONRULES_INS',
    key: "UFN_LEADAUTOMATIZATIONRULES_INS",
    parameters: {
        id,
        description,
        status,
        type,
        columnid,
        communicationchannelid,
        messagetemplateid,
        messagetemplateparameters,
        shippingtype,
        xdays,
        schedule,
        tags,
        products,
        operation,
    }
});
export const insColumns = ({ id, description, type, status, edit = true, index, operation, delete_all = false }: Dictionary): IRequestBody => ({
    method: 'UFN_COLUMN_INS',
    key: "UFN_COLUMN_INS",
    parameters: {
        id,
        description,
        type,
        status,
        edit,
        index,
        operation,
        delete_all
    }
});

export const updateColumnsLeads = ({ cards_startingcolumn, cards_finalcolumn, startingcolumn_uuid, finalcolumn_uuid, leadid = null }: Dictionary): IRequestBody => ({
    method: 'UFN_UPDATE_LEADS',
    key: "UFN_UPDATE_LEADS",
    parameters: {
        cards_startingcolumn,
        cards_finalcolumn,
        startingcolumn_uuid,
        finalcolumn_uuid,
        leadid
    }
});

export const updateColumnsOrder = ({ columns_uuid }: Dictionary): IRequestBody => ({
    method: 'UFN_UPDATE_COLUMNS',
    key: "UFN_UPDATE_COLUMNS",
    parameters: {
        cards_uuid: columns_uuid,
    }
});

export const insLead = ({ leadid, description, status, type, expected_revenue, date_deadline, tags, personcommunicationchannel, priority, conversationid, columnid, column_uuid, index, operation, phone, email, phase }: Dictionary): IRequestBody => ({
    method: 'UFN_LEAD_INS',
    key: "UFN_LEAD_INS",
    parameters: {
        leadid,
        description,
        status,
        type,
        expected_revenue,
        date_deadline,
        tags,
        personcommunicationchannel,
        priority,
        conversationid,
        columnid,
        column_uuid,
        index,
        phone,
        email,
        phase,
        operation
    }
});

export const insLead2 = (lead: ICrmLead, operation: "UPDATE" | "INSERT" | "DELETE" = "INSERT"): IRequestBody => ({
    method: 'UFN_LEAD_INS',
    key: "UFN_LEAD_INS",
    parameters: {
        ...lead,
        id: lead.leadid,
        username: null,
        operation,
    },
});

export const getOneLeadSel = (id: string | number): IRequestBody => ({
    method: "UFN_LEAD_SEL",
    key: "UFN_LEAD_SEL",
    parameters: {
        id: id,
        fullname: '',
        leadproduct: '',
        campaignid: 0,
        tags: '',
        userid: 0, // filtro asesor
        supervisorid: 0, // id del usuario de la sesión 
        all: false,
    },
});

export const adviserSel = (): IRequestBody => ({
    method: 'UFN_ADVISERS_SEL',
    key: "UFN_ADVISERS_SEL",
    parameters: {},
});

//tabla paginada
export const paginatedPersonWithoutDateSel = ({ skip, take, filters, sorts }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_PERSONWITHOUTDATE_SEL",
    methodCount: "UFN_PERSONWITHOUTDATE_TOTALRECORDS",
    parameters: {
        skip,
        take,
        filters,
        sorts,
        origin: "person",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const leadActivityIns = (parameters: ICrmLeadActivitySave): IRequestBody => ({
    key: "UFN_LEADACTIVITY_INS",
    method: "UFN_LEADACTIVITY_INS",
    parameters,
});

export const leadActivitySel = (leadid: string | number): IRequestBody => ({
    key: "UFN_LEADACTIVITY_SEL",
    method: "UFN_LEADACTIVITY_SEL",
    parameters: {
        leadid,
        leadactivityid: 0,
        all: true,
    }
});

export const leadLogNotesSel = (leadid: string | number): IRequestBody => ({
    key: "UFN_LEADNOTES_SEL",
    method: "UFN_LEADNOTES_SEL",
    parameters: {
        leadid,
        leadnotesid: 0,
        all: true,
    }
});

export const leadLogNotesIns = (parameters: ICrmLeadNoteSave): IRequestBody => ({
    key: "UFN_LEADNOTES_INS",
    method: "UFN_LEADNOTES_INS",
    parameters,
});

export const getPaginatedLead = ({ skip, take, filters, sorts, startdate, enddate, ...allParameters }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_LEADGRID_SEL",
    methodCount: "UFN_LEADGRID_TOTALRECORDS",
    parameters: {
        origin: "lead",
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0,
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        contact: allParameters['contact'] ? allParameters['contact'] : "",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getLeadExport = ({ filters, sorts, startdate, enddate, ...allParameters }: Dictionary): IRequestBody => ({
    method: "UFN_LEADGRID_EXPORT",
    key: "UFN_LEADGRID_EXPORT",
    parameters: {
        origin: "lead",
        startdate,
        enddate,
        filters,
        sorts,
        asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0,
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        contact: allParameters['contact'] ? allParameters['contact'] : "",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const insArchiveLead = (lead: ICrmLead): IRequestBody => ({
    method: 'UFN_LEAD_INS',
    key: "UFN_LEAD_INS",
    parameters: {
        ...lead,
        id: lead.leadid,
        username: null,
        status: "CERRADO",
        operation: "UPDATE",
    },
});

export const heatmapresumensel = ({ communicationchannel, startdate, enddate, closedby }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_RESUMEN_SEL",
    method: "UFN_REPORT_HEATMAP_RESUMEN_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage1 = ({ communicationchannel, startdate, enddate, closedby }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE1_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE1_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage1detail = ({ communicationchannel, startdate, enddate, closedby, horanum, option }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE1_DATE_DETAIL_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE1_DATE_DETAIL_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        horanum,
        option,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage2 = ({ communicationchannel, startdate, enddate, closedby, company, group }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE2_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE2_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        company,
        group,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage2detail1 = ({ communicationchannel, startdate, enddate, closedby, company, group, agentid, option }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE2_1_AGENT_DETAIL_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE2_1_AGENT_DETAIL_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        company,
        group,
        agentid,
        option,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage2detail2 = ({ communicationchannel, startdate, enddate, closedby, company, group, agentid, option }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE2_2_AGENT_DETAIL_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE2_2_AGENT_DETAIL_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        company,
        group,
        agentid,
        option,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage3 = ({ communicationchannel, startdate, enddate }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_SEL",
    method: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage3detail = ({ communicationchannel, startdate, enddate, horanum }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_DETAIL_SEL",
    method: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_DETAIL_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        horanum,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const leadHistorySel = (leadid: string | number): IRequestBody => ({
    key: "UFN_LEADACTIVITYHISTORY_SEL",
    method: "UFN_LEADACTIVITYHISTORY_SEL",
    parameters: {
        leadid,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});

export const updateLeadTagsIns = (tags: ICrmLeadTagsSave): IRequestBody => ({
    key: "UFN_UPDATE_LEAD_TAGS",
    method: "UFN_UPDATE_LEAD_TAGS",
    parameters: tags,
});

export const leadHistoryIns = ({ leadid, historyleadid, description, type, status, operation }: ICrmLeadHistoryIns): IRequestBody => ({
    key: "UFN_HISTORYLEAD_INS",
    method: "UFN_HISTORYLEAD_INS",
    parameters: {
        leadid,
        historyleadid: historyleadid || 0,
        description,
        type,
        status: status || 'ACTIVO',
        operation
    }
});

export const changePasswordOnFirstLoginIns = (userid: number | string, password: string): IRequestBody => ({
    key: "UFN_USERPASSWORD_UPDATE",
    method: "UFN_USERPASSWORD_UPDATE",
    parameters: { password, userid },
});

export const getPlanSel = (): IRequestBody => ({
    method: "UFN_SUPPORTPLAN_SEL",
    key: "UFN_SUPPORTPLAN_SEL",
    parameters: {}
})

export const getPaymentPlanSel = (): IRequestBody => ({
    method: "UFN_PAYMENTPLAN_SEL",
    key: "UFN_PAYMENTPLAN_SEL",
    parameters: {
        code: 0,
        all: true
    }
})

export const getPhoneTax = (): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SEL_PHONETAX",
    key: "UFN_BILLINGPERIOD_SEL_PHONETAX",
    parameters: {}
})

export const getBillingSupportSel = ({ year, month, plan }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGSUPPORT_SEL",
    key: "UFN_BILLINGSUPPORT_SEL",
    parameters: { year, month, plan }
})

export const billingSupportIns = ({ year, month, plan, basicfee, starttime, finishtime, status, description, id, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGSUPPORT_INS",
    key: "UFN_BILLINGSUPPORT_INS",
    parameters: { year, month, plan, basicfee, starttime, finishtime, status, type, description, operation, id }
})

export const getBillingConfigurationSel = ({ year, month, plan }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONFIGURATION_SEL",
    key: "UFN_BILLINGCONFIGURATION_SEL",
    parameters: { year, month, plan }
})

export const billingConfigurationIns = ({ year, month, plan, id, basicfee, userfreequantity, useradditionalfee, channelfreequantity, channelwhatsappfee, channelotherfee, clientfreequantity, clientadditionalfee, allowhsm, hsmfee, description, status, whatsappconversationfreequantity, freewhatsappchannel, usercreateoverride, channelcreateoverride, vcacomissionperhsm, vcacomissionpervoicechannel, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONFIGURATION_INS",
    key: "UFN_BILLINGCONFIGURATION_INS",
    parameters: { year, month, plan, id, basicfee, userfreequantity, useradditionalfee, channelfreequantity, channelwhatsappfee, channelotherfee, clientfreequantity, clientadditionalfee, allowhsm, hsmfee, description, status, whatsappconversationfreequantity, freewhatsappchannel, usercreateoverride, channelcreateoverride, vcacomissionperhsm, vcacomissionpervoicechannel, type, operation }
})

export const getBillingConversationSel = ({ year, month, countrycode = "" }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONVERSATION_SEL",
    key: "UFN_BILLINGCONVERSATION_SEL",
    parameters: { year, month, countrycode: countrycode ? countrycode : "" }
})


export const billingConversationIns = ({ year, month, countrycode, id, companystartfee, clientstartfee, vcacomission, freeconversations, description, status, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONVERSATION_INS",
    key: "UFN_BILLINGCONVERSATION_INS",
    parameters: { year, month, countrycode, id, companystartfee, clientstartfee, vcacomission, freeconversations, description, status, type, operation }
})

export const getBillingPeriodSel = ({ corpid, orgid, year, month, billingplan, supportplan }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SEL",
    key: "UFN_BILLINGPERIOD_SEL",
    parameters: { corpid, orgid, year, month, billingplan, supportplan }
})
export const billingPeriodUpd = ({ corpid, orgid, year, month, billingplan, supportplan, basicfee, userfreequantity, useradditionalfee, channelfreequantity, channelwhatsappfee, channelotherfee, clientfreequantity, clientadditionalfee, supportbasicfee, unitpricepersms, vcacomissionpersms, unitepricepermail, vcacomissionpermail, additionalservicename1, additionalservicefee1, additionalservicename2, additionalservicefee2, additionalservicename3, additionalservicefee3, freewhatsappchannel, freewhatsappconversations, usercreateoverride, channelcreateoverride, vcacomissionperconversation, vcacomissionperhsm, minimumsmsquantity, minimummailquantity, vcacomissionpervoicechannel, force }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_UPD",
    key: "UFN_BILLINGPERIOD_UPD",
    parameters: { corpid, orgid, year, month, billingplan, supportplan, basicfee, userfreequantity, useradditionalfee, channelfreequantity, channelwhatsappfee, channelotherfee, clientfreequantity, clientadditionalfee, supportbasicfee, unitpricepersms, vcacomissionpersms, unitepricepermail, vcacomissionpermail, additionalservicename1, additionalservicefee1, additionalservicename2, additionalservicefee2, additionalservicename3, additionalservicefee3, freewhatsappchannel, freewhatsappconversations, usercreateoverride, channelcreateoverride, vcacomissionperconversation, vcacomissionperhsm, minimumsmsquantity, minimummailquantity, vcacomissionpervoicechannel, force }
})

export const getBillingPeriodSummarySel = ({ corpid, orgid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SUMMARYORG",
    key: "UFN_BILLINGPERIOD_SUMMARYORG",
    parameters: { corpid, orgid: corpid === 0 ? corpid : orgid, year, month, force: true }
})
export const getBillingPeriodSummarySelCorp = ({ corpid, orgid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SUMMARYCORP",
    key: "UFN_BILLINGPERIOD_SUMMARYCORP",
    parameters: { corpid, orgid: corpid === 0 ? corpid : orgid, year, month, force: true }
})
export const billingpersonreportsel = ({ corpid, orgid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLING_REPORT_PERSON",
    key: "UFN_BILLING_REPORT_PERSON",
    parameters: { corpid, orgid, year, month }
})
export const billinguserreportsel = ({ corpid, orgid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLING_REPORT_USER",
    key: "UFN_BILLING_REPORT_USER",
    parameters: { corpid, orgid, year, month }
})
export const getInputValidationSel = (id: number): IRequestBody => ({
    method: "UFN_INPUTVALIDATION_SEL",
    key: "UFN_INPUTVALIDATION_SEL",
    parameters: { id }
})
export const inputValidationins = ({ id, operation, description, inputvalue, type, status }: Dictionary): IRequestBody => ({
    method: "UFN_INPUTVALIDATION_INS",
    key: "UFN_INPUTVALIDATION_INS",
    parameters: { id, operation, description, inputvalue, type, status }
})
export const getRecordHSMList = ({ startdate, enddate }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_SENTMESSAGES_LST",
    key: "UFN_REPORT_SENTMESSAGES_LST",
    parameters: {
        startdate, enddate,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const getRecordHSMReport = ({ name, from, date }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_SENTMESSAGES_REPORT",
    key: "UFN_REPORT_SENTMESSAGES_REPORT",
    parameters: {
        date,
        name,
        from,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const getRecordHSMGraphic = ({ startdate, enddate, column, summarization }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_SENTMESSAGES_GRAPHIC",
    key: "UFN_REPORT_SENTMESSAGES_GRAPHIC",
    parameters: {
        filters: {}, sorts: {}, startdate, enddate, column, summarization,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getDashboardTemplateSel = (dashboardtemplateId: number | string = 0) => ({
    method: "UFN_DASHBOARDTEMPLATE_SEL",
    key: "UFN_DASHBOARDTEMPLATE_SEL",
    parameters: {
        id: dashboardtemplateId,
        all: dashboardtemplateId === 0 || dashboardtemplateId === '0',
    },
});

export const getDashboardTemplateIns = (parameters: DashboardTemplateSave) => ({
    method: "UFN_DASHBOARDTEMPLATE_INS",
    key: "UFN_DASHBOARDTEMPLATE_INS",
    parameters,
});
export const getBillingPeriodCalc = ({ corpid, year, month }: Dictionary) => ({
    method: "UFN_BILLINGPERIOD_CALC",
    key: "UFN_BILLINGPERIOD_CALC",
    parameters: {
        corpid, year, month, force: true
    },
});

export const getBusinessDocType = () => ({
    method: "UFN_BUSINESSDOCTYPE_SEL",
    key: "UFN_BUSINESSDOCTYPE_SEL",
    parameters: {},
});

export const selInvoice = ({ corpid, orgid, year, month, invoiceid, currency, paymentstatus }: Dictionary) => ({
    method: "UFN_INVOICE_SEL",
    key: "UFN_INVOICE_SEL",
    parameters: { corpid, orgid, year, month, invoiceid: invoiceid ? invoiceid : 0, currency, paymentstatus },
});

export const selInvoiceClient = ({ corpid, orgid, year, month, invoiceid, currency, paymentstatus }: Dictionary) => ({
    method: "UFN_INVOICE_SELCLIENT",
    key: "UFN_INVOICE_SELCLIENT",
    parameters: { corpid, orgid, year, month, invoiceid: invoiceid ? invoiceid : 0, currency, paymentstatus },
});

export const deleteInvoice = ({ corpid, orgid, invoiceid }: Dictionary) => ({
    method: "UFN_INVOICE_DELETE",
    key: "UFN_INVOICE_DELETE",
    parameters: { corpid, orgid, invoiceid },
});

export const getLeadTasgsSel = () => ({
    method: "UFN_LEAD_TAGSDISTINCT_SEL",
    key: "UFN_LEAD_TAGSDISTINCT_SEL",
    parameters: {},
});

export const getHistoryStatusConversation = (personid: number, conversationid: number, communicationchannelid: number) => ({
    method: "UFN_CONVERSATIONSTATUS_SEL",
    key: "UFN_CONVERSATIONSTATUS_SEL",
    parameters: {
        personid,
        conversationid,
        communicationchannelid
    },
});

export const selKPIManager = (kpiid: number = 0) => ({
    method: "UFN_KPI_SEL",
    key: "UFN_KPI_SEL",
    parameters: {
        kpiid
    },
});

export const insKPIManager = ({ id = 0, kpiname, description, status, type, sqlselect, sqlwhere, target, cautionat, alertat, taskperiod, taskinterval, taskstartdate, operation }: Dictionary): IRequestBody => ({
    method: "UFN_KPI_INS",
    key: "UFN_KPI_INS",
    parameters: {
        id, kpiname, description, status, type, sqlselect, sqlwhere, target, cautionat, alertat, taskperiod, taskinterval, taskstartdate, operation,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const duplicateKPIManager = (kpiid: number = 0): IRequestBody => ({
    method: "UFN_KPI_DUPLICATE",
    key: "UFN_KPI_DUPLICATE",
    parameters: {
        kpiid
    }
});

export const selKPIManagerHistory = ({ kpiid, startdate, enddate }: Dictionary) => ({
    method: "UFN_KPIHISTORY_SEL",
    key: "UFN_KPIHISTORY_SEL",
    parameters: {
        kpiid,
        startdate,
        enddate,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    },
});

export const calcKPIManager = (kpiid: number = 0): IRequestBody => ({
    method: "UFN_KPI_CALC",
    key: "UFN_KPI_CALC",
    parameters: {
        kpiid,
        task: false
    }
});
export const getAppsettingInvoiceSel = () => ({
    method: "UFN_APPSETTING_INVOICE_SEL",
    key: "UFN_APPSETTING_INVOICE_SEL",
    parameters: {},
});

export const updateAppsettingInvoice = ({ ruc, businessname, tradename, fiscaladdress, ubigeo, country, emittertype, currency, invoiceserie, invoicecorrelative, annexcode, igv, printingformat, xmlversion, ublversion, returnpdf, returnxmlsunat, returnxml, invoiceprovider, sunaturl, token, sunatusername, paymentprovider, publickey, privatekey, ticketserie, ticketcorrelative, invoicecreditserie, invoicecreditcorrelative, ticketcreditserie, ticketcreditcorrelative, detraction, detractioncode, detractionaccount, operationcodeperu, operationcodeother, culqiurl, detractionminimum, culqiurlcardcreate, culqiurlclient, culqiurltoken, culqiurlcharge, culqiurlcardget, culqiurlcarddelete }: Dictionary): IRequestBody => ({
    method: "UFN_APPSETTING_INVOICE_UPDATE",
    key: "UFN_APPSETTING_INVOICE_UPDATE",
    parameters: { ruc, businessname, tradename, fiscaladdress, ubigeo, country, emittertype, currency, invoiceserie, invoicecorrelative, annexcode, igv, printingformat, xmlversion, ublversion, returnpdf, returnxmlsunat, returnxml, invoiceprovider, sunaturl, token, sunatusername, paymentprovider, publickey, privatekey, ticketserie, ticketcorrelative, invoicecreditserie, invoicecreditcorrelative, ticketcreditserie, ticketcreditcorrelative, detraction, detractioncode, detractionaccount, operationcodeperu, operationcodeother, culqiurl, detractionminimum, culqiurlcardcreate, culqiurlclient, culqiurltoken, culqiurlcharge, culqiurlcardget, culqiurlcarddelete }
});

export const getBillingNotificationSel = ({ year, month, countrycode = "" }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGNOTIFICATION_SEL",
    key: "UFN_BILLINGNOTIFICATION_SEL",
    parameters: { year, month, countrycode: countrycode ? countrycode : "" }
})


export const billingNotificationIns = ({ year, month, countrycode, id, vcacomission, c250000, c750000, c2000000, c3000000, c4000000, c5000000, c10000000, c25000000, description, status, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGNOTIFICATION_INS",
    key: "UFN_BILLINGNOTIFICATION_INS",
    parameters: { year, month, countrycode, id, vcacomission, c250000, c750000, c2000000, c3000000, c4000000, c5000000, c10000000, c25000000, description, status, type, operation }
})

/**bloquear o desbloquear personas de forma masiva */
export const personcommunicationchannelUpdateLockedArrayIns = (table: { personid: number, locked: boolean }[]) => ({
    method: "UFN_PERSONCOMMUNICATIONCHANNEL_UPDATE_LOCKED_ARRAY",
    key: "UFN_PERSONCOMMUNICATIONCHANNEL_UPDATE_LOCKED_ARRAY",
    parameters: { table: JSON.stringify(table) },
});

export const changeStatus = ({ conversationid, status, obs, motive }: {
    conversationid: number;
    status: string;
    obs: string;
    motive: string;
}) => ({
    method: "UFN_CONVERSATION_CHANGESTATUS",
    key: "UFN_CONVERSATION_CHANGESTATUS",
    parameters: {
        conversationid,
        status,
        obs,
        type: motive,
    },
});
export const getBillingPeriodCalcRefreshAll = (year: number, month: number, corpid: number, orgid: number): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_CALC_REFRESHALL",
    key: "UFN_BILLINGPERIOD_CALC_REFRESHALL",
    parameters: {
        year,
        month,
        corpid,
        orgid,
    },
});

export const getTableOrigin = (): IRequestBody => ({
    method: "UFN_REPORT_PERSONALIZED_ORIGIN_SEL",
    key: "UFN_REPORT_PERSONALIZED_ORIGIN_SEL",
    parameters: {},
});

export const getColumnsOrigin = (tablename: string): IRequestBody => ({
    method: "UFN_REPORT_PERSONALIZED_COLUMNS_SEL",
    key: "UFN_REPORT_PERSONALIZED_COLUMNS_SEL",
    parameters: { tablename },
});
export const getBillingMessagingSel = ({ year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGMESSAGING_SEL",
    key: "UFN_BILLINGMESSAGING_SEL",
    parameters: { year, month }
})


export const billingMessagingIns = ({ year, month, id, pricepersms, vcacomissionpersms, pricepermail, vcacomissionpermail, description, status, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGMESSAGING_INS",
    key: "UFN_BILLINGMESSAGING_INS",
    parameters: { year, month, id, pricepersms, vcacomissionpersms, pricepermail, vcacomissionpermail, description, status, type, operation }
})

export const invoiceRefresh = ({ corpid, orgid, invoiceid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_INVOICE_REFRESH",
    key: "UFN_INVOICE_REFRESH",
    parameters: { corpid, orgid, invoiceid, year, month },
});

export const getAdviserFilteredUserRol = (): IRequestBody => ({
    method: "UFN_ADVISERSBYUSERID_SEL",
    key: "UFN_ADVISERSBYUSERID_SEL",
    parameters: {},
});

export const getVariablesByOrg = (): IRequestBody => ({
    method: "UFN_REPORT_PERSONALIZED_VARIABLE_SEL",
    key: "UFN_REPORT_PERSONALIZED_VARIABLE_SEL",
    parameters: {},
});

export const getKpiSel = () => ({
    method: "UFN_KPI_LST",
    key: "UFN_KPI_LST",
    parameters: {},
});

export const changePlan = (paymentplancode: string) => ({
    method: "UFN_CORP_PAYMENTPLAN_UPD",
    key: "UFN_CORP_PAYMENTPLAN_UPD",
    parameters: {
        paymentplancode
    },
});

export const cancelSuscription = () => ({
    method: "UFN_CORP_PAYMENTPLAN_CANCEL",
    key: "UFN_CORP_PAYMENTPLAN_CANCEL",
    parameters: {
        offset: (new Date().getTimezoneOffset() / 60) * -1
    },
});

export const getMeasureUnit = (): IRequestBody => ({
    method: "UFN_MEASUREUNIT_SEL",
    key: "UFN_MEASUREUNIT_SEL",
    parameters: {},
});

export const getConversationsWhatsapp = ({ startdate, enddate }: Dictionary): IRequestBody => ({
    method: "UFN_CONVERSATIONWHATSAPP_REPORT",
    key: "UFN_CONVERSATIONWHATSAPP_REPORT",
    parameters: {
        startdate, enddate,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getInvoiceDetail = (corpid: number, orgid: number, invoiceid: number): IRequestBody => ({
    method: "UFN_INVOICEDETAIL_SELBYINVOICEID",
    key: "UFN_INVOICEDETAIL_SELBYINVOICEID",
    parameters: { corpid, orgid, invoiceid },
});

export const checkUserPaymentPlan = (): IRequestBody => ({
    key: "UFN_USER_PAYMENTPLAN_CHECK",
    method: "UFN_USER_PAYMENTPLAN_CHECK",
    parameters: {}
});

export const selBalanceData = ({ corpid, orgid, balanceid, type, operationtype, all }: Dictionary) => ({
    method: "UFN_BALANCE_SEL",
    key: "UFN_BALANCE_SEL",
    parameters: { corpid, orgid, balanceid, type, operationtype, all },
});

export const getBillingMessagingCurrent = (year: number, month: number, country: string): IRequestBody => ({
    method: "UFN_BILLINGMESSAGING_CURRENT",
    key: "UFN_BILLINGMESSAGING_CURRENT",
    parameters: {
        year: year,
        month: month,
        country: country,
    }
});

export const getBalanceSelSent = (corpid: number, orgid: number, date: any, type: string, module: string, messagetemplateid: number): IRequestBody => ({
    method: "UFN_BALANCE_SEL_SENT",
    key: "UFN_BALANCE_SEL_SENT",
    parameters: {
        corpid: corpid,
        orgid: orgid,
        date: date,
        type: type,
        module: module,
        messagetemplateid: messagetemplateid,
    }
});

export const getCorpSelVariant = (corpid: number, orgid: number, username: string): IRequestBody => ({
    method: "UFN_CORP_SEL",
    key: "UFN_CORP_SEL",
    parameters: {
        corpid: corpid,
        orgid: orgid,
        username: username,
        id: 0,
        all: true,
    }
});

export const billingReportConversationWhatsApp = ({ corpid, orgid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLING_REPORT_CONVERSATIONWHATSAPP",
    key: "UFN_BILLING_REPORT_CONVERSATIONWHATSAPP",
    parameters: { corpid, orgid, year, month }
})

export const billingReportHsmHistory = ({ corpid, orgid, year, month, type }: Dictionary): IRequestBody => ({
    method: "UFN_BILLING_REPORT_HSMHISTORY",
    key: "UFN_BILLING_REPORT_HSMHISTORY",
    parameters: { corpid, orgid, year, month, type }
})

export const selCalendar = (id: number = 0) => ({
    method: "UFN_CALENDAREVENT_SEL",
    key: "UFN_CALENDAREVENT_SEL",
    parameters: {
        id,
        all: id === 0,
    },
});
export const selBookingCalendar = (startdate: string, enddate: string, calendareventid: number) => ({
    method: "UFN_CALENDARBOOKING_REPORT",
    key: "UFN_CALENDARBOOKING_REPORT",
    parameters: {
        startdate,
        enddate,
        calendareventid,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    },
});

export const calendarBookingCancel = ({ calendareventid, id, cancelcomment }: Dictionary) => ({
    method: "UFN_CALENDARBOOKING_CANCEL",
    key: "UFN_CALENDARBOOKING_CANCEL",
    parameters: {
        calendareventid,
        id,
        cancelcomment,
    },
});
export const calendarBookingSelOne = ({ corpid, orgid, calendareventid, id }: Dictionary) => ({
    method: "UFN_CALENDARBOOKING_SEL_ONE",
    key: "UFN_CALENDARBOOKING_SEL_ONE",
    parameters: {
        corpid, orgid, calendareventid, id,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    },
});

export const insCommentsBooking = (parameters: Dictionary) => ({
    method: "UFN_CALENDARYBOOKING_COMMENT",
    key: "UFN_CALENDARYBOOKING_COMMENT",
    parameters,
});

export const insCalendar = ({
    id = 0, description, descriptionobject, status, type,
    code, name, locationtype, location, eventlink, color, notificationtype, messagetemplateid,
    daterange, daysduration, startdate, enddate,
    timeduration, timeunit,
    availability,
    timebeforeeventduration, timebeforeeventunit, timeaftereventduration, timeaftereventunit,
    increments,
    operation, reminderperiod,reminderfrecuency,reminderhsmmessage,
    communicationchannelid,notificationmessage,reminderenable,remindertype,reminderhsmtemplateid,remindermailmessage,remindermailtemplateid,reminderhsmcommunicationchannelid
}: Dictionary): IRequestBody => ({
    method: "UFN_CALENDAREVENT_INS",
    key: "UFN_CALENDAREVENT_INS",
    parameters: {
        id, description,
        descriptionobject: JSON.stringify(descriptionobject), status, type,
        code, name, locationtype, location, eventlink, color, notificationtype, messagetemplateid,
        daterange, daysduration, daystype: "CALENDAR", startdate, enddate,
        timeduration, timeunit,
        availability: JSON.stringify(availability),
        timebeforeeventduration, timebeforeeventunit, timeaftereventduration, timeaftereventunit,
        increments,reminderperiod,reminderfrecuency,
        reminderhsmtemplateid: reminderhsmtemplateid||0,reminderhsmcommunicationchannelid,
        remindermailtemplateid: remindermailtemplateid||0,reminderhsmmessage,
        operation,notificationmessage,reminderenable,remindertype,remindermailmessage,
        communicationchannelid: communicationchannelid || 0
    }
});

export const getEventByCode = (orgid: number, code: string, personid: number): IRequestBody => ({
    key: "QUERY_EVENT_BY_CODE",
    method: "QUERY_EVENT_BY_CODE",
    parameters: {
        orgid, code, personid
    }
});

export const validateCalendaryBooking = (params: Dictionary): IRequestBody => ({
    key: "UFN_CALENDARYBOOKING_SEL_DATETIME",
    method: "UFN_CALENDARYBOOKING_SEL_DATETIME",
    parameters: {
        ...params,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const CalendaryBookingReport = ({ period = "", startdate, enddate, take, skip }: Dictionary): IRequestBody => ({
    key: "UFN_CALENDARYBOOKING_REPORT",
    method: "UFN_CALENDARYBOOKING_REPORT",
    parameters: {
        period, startdate, enddate, take, skip,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const insBookingCalendar = (params: Dictionary): IRequestBody => ({
    key: "UFN_CALENDARYBOOKING_INS",
    method: "UFN_CALENDARYBOOKING_INS",
    parameters: params
});

export const getPersonFromBooking = (params: Dictionary): IRequestBody => ({
    key: "QUERY_GET_PERSON_FROM_BOOKING",
    method: "QUERY_GET_PERSON_FROM_BOOKING",
    parameters: params
});

export const getPaginatedProductCatalog = ({ skip, take, filters, sorts, startdate, enddate }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_PRODUCTCATALOG_SEL",
    methodCount: "UFN_PRODUCTCATALOG_TOTALRECORDS",
    parameters: {
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        origin: "productcatalog",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getProductCatalogSel = (id: number = 0, category: string = ''): IRequestBody => ({
    method: "UFN_PRODUCTCATALOG_SEL_NORMAL",
    parameters: {
        id: id,
        category: category,
        all: true
    }
})

export const productCatalogIns = ({ id, productid, title, link, imagelink, additionalimagelink, brand, condition, availability, category, material, color, pattern, currency, price, saleprice, customlabel1, customlabel2, customlabel3, customlabel4, customlabel5, labels, catalogid, catalogname, description, status, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_PRODUCTCATALOG_INS",
    key: "UFN_PRODUCTCATALOG_INS",
    parameters: {
        id, productid, title, link, imagelink, additionalimagelink, brand, condition, availability, category, material, color, pattern, currency, price, saleprice, customlabel1, customlabel2, customlabel3, customlabel4, customlabel5, labels, catalogid, catalogname, description, status, type, operation,
    }
})
export const listPaymentCard = ({ corpid, orgid, id }: Dictionary) => ({
    method: "UFN_PAYMENTCARD_LST",
    key: "UFN_PAYMENTCARD_LST",
    parameters: { corpid, orgid, id },
});

export const paymentCardInsert = ({ corpid, orgid, paymentcardid, cardnumber, cardcode, firstname, lastname, mail, favorite, clientcode, status, type, username }: Dictionary) => ({
    method: "UFN_PAYMENTCARD_INS",
    key: "UFN_PAYMENTCARD_INS",
    parameters: {
        corpid,
        orgid,
        id: paymentcardid || 0,
        cardnumber,
        cardcode,
        firstname,
        lastname,
        mail,
        favorite,
        clientcode,
        status,
        type,
        username,
        operation: paymentcardid ? 'UPDATE' : 'INSERT',
    },
});

export const conversationCallHold = ({ conversationid, holdtime }: Dictionary) => ({
    method: "UFN_CONVERSATION_CALLHOLD",
    parameters: {
        conversationid,
        holdtime
    },
});

export const getInvoiceReportSummary = ({ year, currency = '' }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_INVOICE_SUMMARY_SEL",
    key: "UFN_REPORT_INVOICE_SUMMARY_SEL",
    parameters: {
        year, currency,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getInvoiceReportDetail = ({ corpid, year, month, currency }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_INVOICE_DETAIL_SEL",
    key: "UFN_REPORT_INVOICE_DETAIL_SEL",
    parameters: {
        corpid, year, month, currency,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getCurrencyList = (): IRequestBody => ({
    method: "UFN_CURRENCY_SEL",
    key: "UFN_CURRENCY_SEL",
    parameters: {}
});

export const conversationOutboundIns = ({ number, communicationchannelid, personcommunicationchannelowner, interactiontype, interactiontext }: Dictionary) => ({
    method: "UFN_CONVERSATION_OUTBOUND_INS",
    key: "UFN_CONVERSATION_OUTBOUND_INS",
    parameters: {
        personid: 0,
        personcommunicationchannel: `${number}_VOXI`,
        communicationchannelid,
        closetype: "",
        status: 'ASIGNADO',
        finishdate: false,
        handoff: false,
        usergroup: "",
        phone: number,
        extradata: "",
        lastreplydate: true,
        personlastreplydate: false,
        origin: "OUTBOUND",
        firstname: number,
        lastname: "",
        communicationchanneltype: "VOXI",
        interactiontype,
        interactiontext,
        personcommunicationchannelowner
    },
});
export const conversationSupervisionStatus = ({ conversationid, status, type }: Dictionary) => ({
    method: "UFN_CONVERSATION_SUPERVISIONSTATUS",
    key: "UFN_CONVERSATION_SUPERVISIONSTATUS",
    parameters: {
        conversationid, 
        status, 
        type
    },
});
export const conversationCloseUpd = ({ communicationchannelid, personid, personcommunicationchannel, conversationid, motive, obs }: Dictionary) => ({
    method: "UFN_CONVERSATION_CLOSE_UPD",
    key: "UFN_CONVERSATION_CLOSE_UPD",
    parameters: {
        communicationchannelid,
        personid,
        personcommunicationchannel,
        conversationid,
        motive,
        obs
    },
});

export const getAdvisorListVoxi = (): IRequestBody => ({
    method: "UFN_PERSONCOMMUNICATIONCHANNEL_SEL_VOXI",
    key: "UFN_PERSONCOMMUNICATIONCHANNEL_SEL_VOXI",
    parameters: {}
});

export const getUserAsesorByOrgID = (): IRequestBody => ({
    method: "UFN_USER_ASESORBYORGID_LST",
    parameters: {}
});

export const getDisconnectionTimes = ({ startdate, enddate, asesorid, supervisorid }: Dictionary): IRequestBody => ({
    method: "UFN_DASHBOARD_DICONNECTIONTIMES_SEL",
    key: "UFN_DASHBOARD_DICONNECTIONTIMES_SEL",
    parameters: {
        startdate,
        enddate,
        asesorid,
        supervisorid,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const ufnlinkPersons = ({ personidfrom, personidto, imageurl, lastname, name, firstname, documenttype, documentnumber, persontype, birthday, gender, phone, alternativephone, observation, email, alternativeemail, civilstatus, occupation, educationlevel, address, healthprofessional, referralchannel }: Dictionary): IRequestBody => ({
    method: "UFN_CONVERSATION_LINKEDPERSON_EXECUTE",
    key: "UFN_CONVERSATION_LINKEDPERSON_EXECUTE",
    parameters: {
        personidfrom,
        personidto,
        imageurl: imageurl || "",
        name: name || "",
        firstname: firstname || "",
        observation: observation || "",
        lastname: lastname || "",
        documenttype: documenttype || "",
        documentnumber: documentnumber || "",
        persontype: persontype || "",
        birthday: birthday || "",
        gender: gender || "",
        phone: phone || "",
        alternativephone: alternativephone || "",
        email: email || "",
        alternativeemail: alternativeemail || "",
        civilstatus: civilstatus || "",
        occupation: occupation || "",
        educationlevel: educationlevel || "",
        groups: "",
        address: address || "",
        healthprofessional: healthprofessional || "",
        referralchannel: referralchannel || "",
    }
})

export const unLinkPerson = ({ personid, personcommunicationchannel }: Dictionary): IRequestBody => ({
    method: "UFN_CONVERSATION_UNLINKPERSON_EXECUTE",
    key: "UFN_CONVERSATION_UNLINKPERSON_EXECUTE",
    parameters: {
        personid, personcommunicationchannel
    }
})

export const getDisconnectionDataTimes = ({ startdate, enddate, asesorid, supervisorid }: Dictionary): IRequestBody => ({
    method: "UFN_DASHBOARD_DISCONNECTIONTIMES_DATA_SEL",
    key: "UFN_DASHBOARD_DISCONNECTIONTIMES_DATA_SEL",
    parameters: {
        startdate,
        enddate,
        asesorid,
        supervisorid,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

//getPaginatedTicket
export const getasesorvsticketsSel = ({ skip, take, filters, sorts, startdate, enddate }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_REPORT_ASESOR_VS_TICKET_SEL",
    methodCount: "UFN_REPORT_ASESOR_VS_TICKET_TOTALRECORDS",
    parameters: {
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        origin: "ticketvsadviser",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getTicketvsAdviserExport = ({ filters, sorts, startdate, enddate }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_ASESOR_VS_TICKET_EXPORT",
    key: "UFN_REPORT_ASESOR_VS_TICKET_EXPORT",
    parameters: {
        origin: "ticketvsadviser",
        filters,
        startdate,
        enddate,
        sorts,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});

export const getHSMHistoryList = ({ startdate, enddate }: Dictionary): IRequestBody => ({
    method: "UFN_HSMHISTORY_LST",
    key: "UFN_HSMHISTORY_LST",
    parameters: {
        startdate, enddate,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const getUniqueContactsSel = ({ year, channeltype }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_UNIQUECONTACTS_SEL",
    key: `UFN_REPORT_UNIQUECONTACTS_SEL`,
    parameters: {
        year, channeltype,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getHSMHistoryReport = ({ campaign = "", date }: Dictionary): IRequestBody => ({
    method: "UFN_HSMHISTORY_REPORT",
    key: "UFN_HSMHISTORY_REPORT",
    parameters: {
        date,
        campaignname: campaign,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getHSMHistoryReportExport = (table: Dictionary[]): IRequestBody => ({
    method: "UFN_HSMHISTORY_REPORT_EXPORT",
    key: "UFN_HSMHISTORY_REPORT_EXPORT",
    parameters: {
        origin: "hsmreport",
        table: JSON.stringify(table),
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
})

export const getPropertiesIncludingName = (propertyname: string): IRequestBody => ({
    method: "UFN_PROPERTY_SEL_BY_INCLUDE_NAME",
    key: "UFN_PROPERTY_SEL_BY_INCLUDE_NAME",
    parameters: {
        propertyname
    }
})

export const deleteClassificationTree = (id: number): IRequestBody => ({
    method: "UFN_CLASSIFICATION_DEL",
    key: "UFN_CLASSIFICATION_DEL",
    parameters: {
        id
    }
})

export const selCommunicationChannelWhatsApp = (): IRequestBody => ({
    method: "UFN_COMMUNICATIONCHANNEL_SEL_WHATSAPP",
    key: "UFN_COMMUNICATIONCHANNEL_SEL_WHATSAPP",
    parameters: {}
})

export const getPaginatedLocation = ({ skip, take, filters, sorts, locationid = "" }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_LOCATION_SEL",
    methodCount: "UFN_LOCATION_TOTALRECORDS",
    parameters: {
        skip,
        take,
        filters,
        sorts,
        locationid,
        origin: "location",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getLocationExport = ({ filters, sorts }: Dictionary): IRequestBody => ({
    method: "UFN_LOCATION_EXPORT",
    key: "UFN_LOCATION_EXPORT",
    parameters: {
        origin: "location",
        filters,
        sorts,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const locationIns = ({ id, operation, name, address, district, city, country, schedule, phone, alternativephone, email, alternativeemail, latitude, longitude, googleurl, description, status, type, username }: Dictionary): IRequestBody => ({
    method: "UFN_LOCATION_INS",
    key: "UFN_LOCATION_INS",
    parameters: {
        id, operation, name, address, district, city, country, schedule, phone, alternativephone, email, alternativeemail, latitude, longitude, googleurl, description, status, type, username
    }
});

export const getReportKpiOperativoSel = ({ date, ...allParameters }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_KPI_OPERATIVO_SEL",
    key: "UFN_REPORT_KPI_OPERATIVO_SEL",
    parameters: {
        origin: "kpioperativo",
        date,
        ...allParameters,
        usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const insInvoiceComment = ({ corpid, orgid, invoiceid, invoicecommentid, description, status, type, username, commentcontent, commenttype, commentcaption }: Dictionary): IRequestBody => ({
    method: "UFN_INVOICECOMMENT_INS",
    key: "UFN_INVOICECOMMENT_INS",
    parameters: { corpid, orgid, invoiceid, invoicecommentid, description, status, type, username, commentcontent, commenttype, commentcaption }
});

export const selInvoiceComment = ({ corpid, orgid, invoiceid, invoicecommentid }: Dictionary): IRequestBody => ({
    method: "UFN_INVOICECOMMENT_SEL",
    key: "UFN_INVOICECOMMENT_SEL",
    parameters: { corpid, orgid, invoiceid, invoicecommentid }
});
export const selIntent = (): IRequestBody => ({
    method: "UFN_WITAI_INTENT_SEL",
    key: "UFN_WITAI_INTENT_SEL",
    parameters: {}
})

export const selUtterance = (intent: string): IRequestBody => ({
    method: "UFN_WITAI_UTTERANCE_SEL",
    key: "UFN_WITAI_UTTERANCE_SEL",
    parameters: { intent }
})

export const selEntities = (): IRequestBody => ({
    method: "UFN_WITAI_ENTITY_SEL",
    key: "UFN_WITAI_ENTITY_SEL",
    parameters: {}
})

export const insertutterance = ({ name, description, datajson, utterance_datajson, operation }: Dictionary): IRequestBody => ({
    method: "UFN_WITAI_INTENT_UTTERANCE_INS",
    key: "UFN_WITAI_INTENT_UTTERANCE_INS",
    parameters: { name, description, datajson, utterance_datajson, operation }
})

export const insertentity = ({ name, datajson, operation }: Dictionary): IRequestBody => ({
    method: "UFN_WITAI_ENTITY_INS",
    key: "UFN_WITAI_ENTITY_INS",
    parameters: { name, datajson, operation }
})
export const utterancedelete = ({ table }: Dictionary): IRequestBody => ({
    method: "UFN_WITUFN_WITAI_INTENT_UTTERANCE_DEL",
    key: "UFN_WITUFN_WITAI_INTENT_UTTERANCE_DEL",
    parameters: { table, model: "" }
})

export const entitydelete = ({ table, }: Dictionary): IRequestBody => ({
    method: "UFN_WITAI_ENTITY_DEL",
    key: "UFN_WITAI_ENTITY_DEL",
    parameters: { table, model: "" }
})

export const getChatflowVariableSel = (): IRequestBody => ({
    method: "UFN_CHATFLOW_VARIABLE_SEL",
    parameters: {}
});
export const billingConfigurationNewMonth = ({ year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONFIGURATION_NEWMONTH",
    key: "UFN_BILLINGCONFIGURATION_NEWMONTH",
    parameters: { year, month }
})

export const artificialIntelligencePlanIns = ({ freeinteractions, basicfee, additionalfee, description, operation }: Dictionary): IRequestBody => ({
    method: "UFN_ARTIFICIALINTELLIGENCEPLAN_INS",
    key: "UFN_ARTIFICIALINTELLIGENCEPLAN_INS",
    parameters: { freeinteractions, basicfee, additionalfee, description, operation }
})

export const artificialIntelligencePlanSel = ({ description }: Dictionary): IRequestBody => ({
    method: "UFN_ARTIFICIALINTELLIGENCEPLAN_SEL",
    key: "UFN_ARTIFICIALINTELLIGENCEPLAN_SEL",
    parameters: { description }
})

export const artificialIntelligenceServiceIns = ({ provider, service, type, description, measureunit, charlimit, operation }: Dictionary): IRequestBody => ({
    method: "UFN_ARTIFICIALINTELLIGENCESERVICE_INS",
    key: "UFN_ARTIFICIALINTELLIGENCESERVICE_INS",
    parameters: { provider, service, type, description, measureunit, charlimit, operation }
})

export const artificialIntelligenceServiceSel = ({ provider, service }: Dictionary): IRequestBody => ({
    method: "UFN_ARTIFICIALINTELLIGENCESERVICE_SEL",
    key: "UFN_ARTIFICIALINTELLIGENCESERVICE_SEL",
    parameters: { provider, service }
})

export const billingArtificialIntelligenceIns = ({ year, month, id, provider, measureunit, charlimit, plan, freeinteractions, basicfee, additionalfee, description, status, type, username, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGARTIFICIALINTELLIGENCE_INS",
    key: "UFN_BILLINGARTIFICIALINTELLIGENCE_INS",
    parameters: { year, month, id, provider, measureunit, charlimit, plan, freeinteractions, basicfee, additionalfee, description, status, type, username, operation }
})

export const billingArtificialIntelligenceSel = ({ year, month, provider, type, plan }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGARTIFICIALINTELLIGENCE_SEL",
    key: "UFN_BILLINGARTIFICIALINTELLIGENCE_SEL",
    parameters: { year, month, provider, type, plan }
})

export const billingPeriodArtificialIntelligenceIns = ({ id, corpid, orgid, year, month, provider, measureunit, charlimit, plan, freeinteractions, basicfee, additionalfee, description, aiquantity, aicost, status, type, username, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIODARTIFICIALINTELLIGENCE_INS",
    key: "UFN_BILLINGPERIODARTIFICIALINTELLIGENCE_INS",
    parameters: { id, corpid, orgid, year, month, provider, measureunit, charlimit, plan, freeinteractions, basicfee, additionalfee, description, aiquantity, aicost, status, type, username, operation }
})

export const billingPeriodArtificialIntelligenceSel = ({ corpid, orgid, year, month, provider, type, plan, userid }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIODARTIFICIALINTELLIGENCE_SEL",
    key: "UFN_BILLINGPERIODARTIFICIALINTELLIGENCE_SEL",
    parameters: { corpid, orgid, year, month, provider, type, plan, userid }
})

export const billingPeriodArtificialIntelligenceInsArray = (corpid: number, orgid: number, table: Dictionary[]): IRequestBody => ({
    method: "UFN_BILLINGPERIODARTIFICIALINTELLIGENCE_INS_ARRAY",
    parameters: {
        corpid: corpid,
        orgid: orgid,
        table: JSON.stringify(table),
    },
});
export const exportintent = ({name_json}:Dictionary): IRequestBody => ({
    method: "UFN_WITAI_INTENT_EXPORT",
    key: "UFN_WITAI_INTENT_EXPORT",
    parameters: {name_json}
})

export const productCatalogInsArray = (catalogid: string, catalogname: string, table: Dictionary[], username: string): IRequestBody => ({
    method: "UFN_PRODUCTCATALOG_INS_ARRAY",
    parameters: {
        catalogid: catalogid,
        catalogname: catalogname,
        table: JSON.stringify(table),
        username: username,
    }
});

export const productCatalogUpdArray = (table: Dictionary[], username: string): IRequestBody => ({
    method: "UFN_PRODUCTCATALOG_UPD_ARRAY",
    parameters: {
        table: JSON.stringify(table),
        username: username,
    }
});