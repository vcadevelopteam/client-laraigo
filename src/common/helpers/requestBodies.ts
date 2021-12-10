import { DashboardTemplateSave, Dictionary, IChannel, IChatWebAdd, ICrmLead, ICrmLeadActivitySave, ICrmLeadNoteSave, ICrmLeadTagsSave, ILead, IPerson, IRequestBody, IRequestBodyPaginated } from '@types';
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
    key: "UFN_CONVERSATION_SEL_TICKETSBYUSER",
    parameters: { ...(userid && { userid }) }
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
    key: "UFN_CONVERSATION_SEL_INTERACTION",
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

export const getValuesFromDomain = (domainname: string, keytmp?: any, orgid?: number | null): IRequestBody => ({
    method: "UFN_DOMAIN_LST_VALORES",
    key: "UFN_DOMAIN_LST_VALORES" + (keytmp || ""),
    parameters: {
        domainname,
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


export const insUser = ({ id, usr, doctype, docnum, password = "", firstname, lastname, email, pwdchangefirstlogin, type, status, description = "", operation, company, twofactorauthentication, registercode, billinggroupid, image }: Dictionary): IRequestBody => ({
    method: "UFN_USER_INS",
    key: "UFN_USER_INS",
    parameters: { id, usr, doctype, docnum, password: password, firstname, lastname, email, pwdchangefirstlogin, type, status, description, operation, company, twofactorauthentication, registercode, billinggroup: billinggroupid, image }
});

export const insOrgUser = ({ roleid, orgid, bydefault, labels, groups, channels, status, type, supervisor, operation, redirect }: Dictionary): IRequestBody => ({
    method: "UFN_ORGUSER_INS",
    key: "UFN_ORGUSER_INS",
    parameters: { orgid, roleid, usersupervisor: supervisor, bydefault, labels, groups, channels, status, type, defaultsort: 1, operation, redirect }
});

export const insProperty = ({ orgid, communicationchannelid, id, propertyname, propertyvalue, description, status, type, category, domainname, group, level, operation }: Dictionary): IRequestBody => ({
    method: "UFN_PROPERTY_INS",
    key: "UFN_PROPERTY_INS",
    parameters: { orgid, communicationchannelid, id, propertyname, propertyvalue, description, status, type, category, domainname, group, level, operation }
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

export const insWhitelist = ({ id, operation, documenttype, documentnumber, usergroup, type, status, username }: Dictionary): IRequestBody => ({
    method: "UFN_WHITELIST_INS",
    key: "UFN_WHITELIST_INS",
    parameters: { id, operation, documenttype, documentnumber, usergroup, type, status, asesorname: username }
});

export const getInappropriateWordsSel = (id: number): IRequestBody => ({
    method: "UFN_INAPPROPRIATEWORDS_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
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
    parameters: {
        id: id,
        all: id === 0,
    }
});
export const getOrgSel = (id: number): IRequestBody => ({
    method: "UFN_ORG_SEL",
    parameters: {
        orgid: id,
        all: id === 0,
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

export const insEmoji = ({ ...allParameters }: Dictionary): IRequestBody => ({
    method: "UFN_EMOJI_INS",
    key: "UFN_EMOJI_INS",
    parameters: {
        ...allParameters,
        favoritechannels: allParameters['favoritechannels'] === undefined ? 'undefined' : allParameters['favoritechannels'],
        restrictedchannels: allParameters['restrictedchannels'] === undefined ? 'undefined' : allParameters['restrictedchannels'],
        orgid: allParameters['orgid'] ? allParameters['orgid'] : 0
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
        usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "",
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
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        usergroup: allParameters['usergroup'] ? allParameters['usergroup'] : "",
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

export const insCorp = ({ id, description, type, status, logo, logotype, operation }: Dictionary): IRequestBody => ({
    method: "UFN_CORP_INS",
    key: "UFN_CORP_INS",
    parameters: { id, description, type, status, logo, logotype, operation }
});
export const insOrg = ({ corpid ,description, status, type, id, operation,currency,email="",password="",port=0,host,ssl,default_credentials,private_mail }: Dictionary): IRequestBody => ({
    method: "UFN_ORG_INS",
    key: "UFN_ORG_INS",
    parameters: { corpid, id, description, status, type, operation,currency,email,password,port: parseInt(port),host,ssl,default_credentials,private_mail }
});

export const insQuickreplies = ({ id, classificationid, description, quickreply, status, type, operation, favorite }: Dictionary): IRequestBody => ({
    method: "UFN_QUICKREPLY_INS",
    key: "UFN_QUICKREPLY_INS",
    parameters: { id, classificationid, description, quickreply, status, type, operation, favorite }
});

export const getClassificationSel = (id: number): IRequestBody => ({
    method: "UFN_CLASSIFICATION_SEL",
    key: "UFN_CLASSIFICATION_SEL",
    parameters: {
        id: id,
        all: true
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
//tabla paginada
export const getPersonExport = ({ filters, sorts, startdate, enddate }: Dictionary): IRequestBody => ({
    method: "UFN_PERSON_EXPORT",
    key: "UFN_PERSON_EXPORT",
    parameters: {
        origin: "person",
        filters,
        startdate,
        enddate,
        sorts,
        offset: (new Date().getTimezoneOffset() / 60) * -1
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

export const getValuesForTree = (): IRequestBody => ({
    method: "UFN_CLASSIFICATION_QUICKREPLYTREE_SEL",
    key: "UFN_CLASSIFICATION_QUICKREPLYTREE_SEL",
    parameters: {
        type: 'QUICKREPLY'
    }
});

export const getParentSel = (): IRequestBody => ({
    method: "UFN_CLASSIFICATION_LST_PARENT",
    parameters: {
        classificationid: 0
    }
});

export const getMessageTemplateSel = (id: number): IRequestBody => ({
    method: "UFN_MESSAGETEMPLATE_SEL",
    parameters: {
        id: id,
        all: id === 0,
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
    operation
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
        operation
    }
});

export const insarrayIntegrationManager = (id: number, table: Dictionary[]): IRequestBody => ({
    method: "UFN_INTEGRATIONMANAGER_IMPORT",
    parameters: {
        id: id,
        table: JSON.stringify(table)
    }
});

export const deldataIntegrationManager = (id: number): IRequestBody => ({
    method: "UFN_INTEGRATIONMANAGER_DELETEDATA",
    parameters: {
        id: id
    }
});

export const getChannelSel = (id: number): IRequestBody => ({
    method: "UFN_COMMUNICATIONCHANNEL_SEL",
    parameters: {
        communicationchannelid: id,
        personcommunicationchannel: "",
        all: id === 0,
    }
});
export const getasesoresbyorgid = (): IRequestBody => ({
    method: "UFN_USER_ASESORBYORGID_LST",
    parameters: {
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

export const getTicketsByFilter = (lastmessage: string, start_createticket: string, end_createticket: string, channels: string, conversationstatus: string, displayname: string, phone: string ): IRequestBody => ({
    method: "UFN_CONVERSATION_SEL_TICKETSBYUSER_FILTER",
    parameters: {
        lastmessage,
        start_createticket,
        end_createticket,
        channels,
        conversationstatus,
        displayname,
        phone
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

export const getEditChannel = (id: number, payload: IChannel, name: string, auto: boolean, iconColor: string): IRequestBody<IChannel> => ({
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

export const insPersonUpdateLocked = ({personid, personcommunicationchannel, locked }: Dictionary) => ({
    method: "UFN_PERSONCOMMUNICATIONCHANNEL_UPDATE_LOCKED",
    parameters: {
        personid,
        personcommunicationchannel,
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

export const getCampaignReportPaginated = ({ filters, sorts, take, skip }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_CAMPAIGNREPORT_SEL",
    methodCount: "UFN_CAMPAIGNREPORT_TOTALRECORDS",
    parameters: {
        origin: "campaignreport",
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

export const reassignMassiveTicket = (conversationid: string, newuserid: number, comment: string): IRequestBody => ({
    method: "UFN_CONVERSATION_REASSIGNTICKET_MASSIVE",
    parameters: {
        conversationid,
        newuserid,
        comment
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
export const gerencialTMOsel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_TMO_GENERAL_SEL",
    parameters: {
        startdate, enddate, channel, group, company, level: 0, closedby: "ASESOR,BOT", min: 0, max: 0, target: 0, skipdown: 0, skipup: 0, bd: true, offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialTMOselData = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_DATA_TMO_GENERAL_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_DATA_TMO_GENERAL_SEL",
    parameters: { startdate, enddate, channel, group, company, level: 0, closedby: "ASESOR,BOT", min: 0, max: 0, target: 0, skipdown: 0, skipup: 0, bd: true, offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialTMEsel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_TME_GENERAL_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_TME_GENERAL_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        level: 0,
        closedby: "ASESOR,BOT",
        min: 0,
        max: 0,
        target: 0,
        skipdown: 0,
        skipup: 0,
        bd: true,
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
    method: 'UFN_DATA_DASHBOARD_GERENCIAL_SUMMARY_SEL',
    key: "UFN_DATA_DASHBOARD_GERENCIAL_SUMMARY_SEL",
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
export const gerencialencuestaseldata = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DATA_DASHBOARD_GERENCIAL_ENCUESTA_SEL',
    key: "UFN_DATA_DASHBOARD_GERENCIAL_ENCUESTA_SEL",
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
    method: 'UFN_DATA_DASHBOARD_GERENCIAL_CONVERSATION_SEL',
    key: "UFN_DATA_DASHBOARD_GERENCIAL_CONVERSATION_SEL",
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
    method: 'UFN_DATA_DASHBOARD_GERENCIAL_INTERACTION_SEL',
    key: "UFN_DATA_DASHBOARD_GERENCIAL_INTERACTION_SEL",
    parameters: {
        startdate,
        enddate,
        channel,
        group,
        company,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});
export const gerencialetiquetassel = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_GERENCIAL_ETIQUETAS_SEL',
    key: "UFN_DASHBOARD_GERENCIAL_ETIQUETAS_SEL",
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
export const gerencialetiquetasseldata = ({ startdate, enddate, channel, group, company }: Dictionary): IRequestBody => ({
    method: 'UFN_DATA_DASHBOARD_GERENCIAL_ETIQUETAS_SEL',
    key: "UFN_DATA_DASHBOARD_GERENCIAL_ETIQUETAS_SEL",
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
    method: 'UFN_DATA_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_SEL',
    key: "UFN_DATA_DASHBOARD_GERENCIAL_ASESORESCONECTADOSBAR_SEL",
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
export const getdashboardPushSUMMARYSel = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_SUMMARY_SEL',
    key: "UFN_DASHBOARD_PUSH_SUMMARY_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushHSMRANKSel = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_HSMRANK_SEL',
    key: "UFN_DASHBOARD_PUSH_HSMRANK_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardPushMENSAJEXDIASel = ({ startdate, enddate, channel, group, company, label, category, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_PUSH_MENSAJEXDIA_SEL',
    key: "UFN_DASHBOARD_PUSH_MENSAJEXDIA_SEL",
    parameters: { startdate, enddate, channel, group, company, label, category, offset: (new Date().getTimezoneOffset() / 60) * -1, userid: supervisor }
});
export const getdashboardoperativoTMOGENERALSel = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_TMO_GENERAL_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        level: 0,
        closedby: "",
        skipdown: 0,
        skipup: 0,
        bd: true,
        min: "00:00:00",
        max: "00:00:00",
        target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1, 
        supervisorid: supervisor
    }
});
export const getdashboardoperativoTMOGENERALSeldata = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DATA_DASHBOARD_OPERATIVO_TMO_GENERAL_SEL',
    key: "UFN_DATA_DASHBOARD_OPERATIVO_TMO_GENERAL_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        level: 0,
        closedby: "",
        skipdown: 0,
        skipup: 0,
        bd: true,
        min: "00:00:00",
        max: "00:00:00",
        target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1, 
        supervisorid: supervisor
    }
});
export const getdashboardoperativoTMEGENERALSel = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_TME_GENERAL_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_TME_GENERAL_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        level: 0,
        closedby: "",
        skipdown: 0,
        skipup: 0,
        bd: true,
        min: "00:00:00",
        max: "00:00:00",
        target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1, 
        supervisorid: supervisor
    }
});
export const getdashboardoperativoTMEGENERALSeldata = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DATA_DASHBOARD_OPERATIVO_TME_GENERAL_SEL',
    key: "UFN_DATA_DASHBOARD_OPERATIVO_TME_GENERAL_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
        level: 0,
        closedby: "",
        skipdown: 0,
        skipup: 0,
        bd: true,
        min: "00:00:00",
        max: "00:00:00",
        target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1, 
        supervisorid: supervisor
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
export const getdashboardoperativoSummarySeldata = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DATA_DASHBOARD_OPERATIVO_SUMMARY_SEL',
    key: "UFN_DATA_DASHBOARD_OPERATIVO_SUMMARY_SEL",
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
    method: 'UFN_DATA_DASHBOARD_OPERATIVO_PRODXHORADIST_SEL',
    key: "UFN_DATA_DASHBOARD_OPERATIVO_PRODXHORADIST_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label,
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
export const getdashboardoperativoEncuestaSeldata = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DATA_DASHBOARD_OPERATIVO_ENCUESTA_SEL',
    key: "UFN_DATA_DASHBOARD_OPERATIVO_ENCUESTA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label, closedby: "",
        offset: (new Date().getTimezoneOffset() / 60) * -1, 
        supervisorid: supervisor
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
    },
});

export const insPersonCommunicationChannel = (pcc: Dictionary): IRequestBody => ({
    method: 'UFN_PERSONCOMMUNICATIONCHANNEL_INS',
    parameters: {
        ...pcc,
        corpid: null,
        orgid: null,
    },
});

export const editPersonBody = (person: IPerson): IRequestBody => ({
    method: 'UFN_PERSON_INS',
    parameters: {
        ...person,
        id: person.personid,
        operation: person.personid ? 'UPDATE' : 'INSERT',
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
export const getColumnsSel = (id:number, lost: boolean = false): IRequestBody => ({
    method: "UFN_COLUMN_SEL",
    key: "UFN_COLUMN_SEL",
    parameters: {
        id: id,
        all: true,
        lost
    }
})

export const getLeadsSel = (id:number): IRequestBody => ({
    method: "UFN_LEAD_SEL",
    key: "UFN_LEAD_SEL",
    parameters: {
        id: id,
        all: true
    }
})

export const insColumns = ({ id, description, type, status, edit, index, operation, delete_all = false }: Dictionary): IRequestBody => ({
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

export const updateColumnsLeads = ({ cards_startingcolumn, cards_finalcolumn, startingcolumn_uuid, finalcolumn_uuid, leadid = null}: Dictionary): IRequestBody => ({
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
        all: false
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
        communicationchannel , 
        startdate , 
        enddate ,
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
export const heatmappage2 = ({ communicationchannel, startdate, enddate, closedby,company }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE3_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE3_SEL",
    parameters: {
        communicationchannel, 
        startdate, 
        enddate,
        closedby,
        company,
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

export const leadHistoryIns = ({ leadid, historyleadid, description, type, status, operation }: Dictionary): IRequestBody => ({
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
    parameters: { }
})
export const getPaymentPlanSel = (): IRequestBody => ({
    method: "UFN_PAYMENTPLAN_SEL",
    key: "UFN_PAYMENTPLAN_SEL",
    parameters: { 
        code:0,
        all:true
    }
})

export const getBillingSupportSel = ({ year,month,plan }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGSUPPORT_SEL",
    key: "UFN_BILLINGSUPPORT_SEL",
    parameters: { year,month,plan }
})

export const billingSupportIns = ({ year,month,plan,basicfee,starttime,finishtime,status,description,id,type,operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGSUPPORT_INS",
    key: "UFN_BILLINGSUPPORT_INS",
    parameters: { year,month,plan,basicfee,starttime,finishtime,status,type,description,operation,id }
})

export const getBillingConfigurationSel = ({ year,month,plan }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONFIGURATION_SEL",
    key: "UFN_BILLINGCONFIGURATION_SEL",
    parameters: { year,month,plan }
})

export const billingConfigurationIns = ({ year,month,plan,id,basicfee,userfreequantity,useradditionalfee,channelfreequantity,channelwhatsappfee,channelotherfee=0,clientfreequantity,clientadditionalfee,allowhsm,hsmfee,description,status,type,operation}: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONFIGURATION_INS",
    key: "UFN_BILLINGCONFIGURATION_INS",
    parameters: { year,month,plan,id,basicfee,userfreequantity,useradditionalfee,channelfreequantity,channelwhatsappfee,channelotherfee,clientfreequantity,clientadditionalfee,allowhsm,hsmfee,description,status,type,operation }
})

export const getBillingConversationSel = ({ year,month,countrycode="" }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONVERSATION_SEL",
    key: "UFN_BILLINGCONVERSATION_SEL",
    parameters: { year,month,countrycode:countrycode?countrycode:"" }
})


export const billingConversationIns = ({ year,month,countrycode,id,companystartfee,clientstartfee,c250000,c750000,c2000000,c3000000,c4000000,c5000000,c10000000,c25000000,description,status,type,operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONVERSATION_INS",
    key: "UFN_BILLINGCONVERSATION_INS",
    parameters: { year,month,countrycode,id,companystartfee,clientstartfee,c250000,c750000,c2000000,c3000000,c4000000,c5000000,c10000000,c25000000,description,status,type,operation }
})

export const getBillingPeriodSel = ({ corpid, orgid, year,month,billingplan, supportplan}: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SEL",
    key: "UFN_BILLINGPERIOD_SEL",
    parameters: { corpid, orgid, year,month,billingplan, supportplan }
})
export const billingPeriodUpd = ({ corpid,orgid,year,month,billingplan,supportplan,basicfee,userfreequantity,useradditionalfee,channelfreequantity,channelwhatsappfee,channelotherfee,clientfreequantity,clientadditionalfee,supportbasicfee,additionalservicename1,additionalservicefee1,additionalservicename2,additionalservicefee2,additionalservicename3,additionalservicefee3,force}: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_UPD",
    key: "UFN_BILLINGPERIOD_UPD",
    parameters: { corpid,orgid,year,month,billingplan,supportplan,basicfee,userfreequantity,useradditionalfee,channelfreequantity,channelwhatsappfee,channelotherfee,clientfreequantity,clientadditionalfee,supportbasicfee,additionalservicename1,additionalservicefee1,additionalservicename2,additionalservicefee2,additionalservicename3,additionalservicefee3,force}
})

export const getBillingPeriodHSMSel = ({ corpid,orgid,year,month}: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIODHSM_SEL",
    key: "UFN_BILLINGPERIODHSM_SEL",
    parameters: {  corpid,orgid,year,month}
})
export const billingPeriodHSMUpd = ({ corpid, orgid, year, month, hsmutilityfee, force}: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIODHSM_UPD",
    key: "UFN_BILLINGPERIODHSM_UPD",
    parameters: {  corpid, orgid, year, month, hsmutilityfee, force}
})
export const getBillingPeriodSummarySel = ({ corpid,orgid,year,month}: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SUMMARYORG",
    key: "UFN_BILLINGPERIOD_SUMMARYORG",
    parameters: {  corpid,orgid:corpid===0?corpid:orgid,year,month,force:true}
})
export const getBillingPeriodSummarySelCorp = ({ corpid,orgid,year,month}: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SUMMARYCORP",
    key: "UFN_BILLINGPERIOD_SUMMARYCORP",
    parameters: {  corpid,orgid:corpid===0?corpid:orgid,year,month,force:true}
})
export const billingpersonreportsel = ({ corpid,orgid,year,month}: Dictionary): IRequestBody => ({
    method: "UFN_BILLING_REPORT_PERSON",
    key: "UFN_BILLING_REPORT_PERSON",
    parameters: {  corpid,orgid,year,month}
})
export const billinguserreportsel = ({ corpid,orgid,year,month}: Dictionary): IRequestBody => ({
    method: "UFN_BILLING_REPORT_USER",
    key: "UFN_BILLING_REPORT_USER",
    parameters: {  corpid,orgid,year,month}
})
export const getInputValidationSel = (id: number): IRequestBody => ({
    method: "UFN_INPUTVALIDATION_SEL",
    key: "UFN_INPUTVALIDATION_SEL",
    parameters: {  id}
})
export const inputValidationins = ({ id, operation, description, inputvalue, type, status}: Dictionary): IRequestBody => ({
    method: "UFN_INPUTVALIDATION_INS",
    key: "UFN_INPUTVALIDATION_INS",
    parameters: {  id, operation, description, inputvalue, type, status}
})
export const getRecordHSMList = ({ startdate,enddate}: Dictionary): IRequestBody => ({
    method: "UFN_HSMHISTORY_LST",
    key: "UFN_HSMHISTORY_LST",
    parameters: { startdate,enddate,
        offset: (new Date().getTimezoneOffset() / 60) * -1}
})
export const getRecordHSMReport = ({ campaignname, date}: Dictionary): IRequestBody => ({
    method: "UFN_HSMHISTORY_REPORT",
    key: "UFN_HSMHISTORY_REPORT",
    parameters: { campaignname, date,
        offset: (new Date().getTimezoneOffset() / 60) * -1}
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
