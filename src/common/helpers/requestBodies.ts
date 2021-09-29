import { Dictionary, IChatWebAdd, IRequestBody, IRequestBodyPaginated } from '@types';
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

export const getInfoPerson = (personid: ID): IRequestBody => ({
    method: "UFN_CONVERSATION_PERSON_SEL",
    key: "UFN_CONVERSATION_PERSON_SEL",
    parameters: { personid }
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


export const insUser = ({ id, usr, doctype, docnum, password = "", firstname, lastname, email, type, status, description = "", operation, company, twofactorauthentication, registercode, billinggroupid }: Dictionary): IRequestBody => ({
    method: "UFN_USER_INS",
    key: "UFN_USER_INS",
    parameters: { id, usr, doctype, docnum, password: password, firstname, lastname, email, pwdchangefirstlogin: false, type, status, description, operation, company, twofactorauthentication, registercode, billinggroup: billinggroupid }
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
export const getOrgSel = (id: number): IRequestBody => ({
    method: "UFN_ORG_SEL",
    parameters: {
        orgid: id,
        all: id === 0,
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

export const getEmojiGroupSel = (all: boolean): IRequestBody => ({
    method: "UFN_EMOJI_GROUP_SEL",
    key: "UFN_EMOJI_GROUP_SEL",
    parameters: {
        all
    }
})

export const getEmojiSel = (emojidec: string): IRequestBody => ({
    method: "UFN_EMOJI_SEL",
    key: "UFN_EMOJI_SEL",
    parameters: {
        emojidec
    }
})

export const getEmojiAllSel = (): IRequestBody => ({
    method: "UFN_EMOJI_ALL_SEL",
    key: "UFN_EMOJI_ALL_SEL",
    parameters: {
        all: true
    }
})

export const updateEmojiOrganization = ({ ...allParameters }: Dictionary): IRequestBody => ({
    method: "UFN_EMOJI_UPDATE",
    key: "UFN_EMOJI_UPDATE",
    parameters: {
        favoritechannels: allParameters['favoritechannels'] === undefined ? 'undefined' : allParameters['favoritechannels'],
        restrictedchannels: allParameters['restrictedchannels'] === undefined ? 'undefined' : allParameters['restrictedchannels'],
        orgid: allParameters['orgid'] ? allParameters['orgid'] : 0,
        emojidec: allParameters['emojidec'] ? allParameters['emojidec'] : "",
    }
})

export const updateEmojiChannels = (emojidec: string, isfavorite: boolean): IRequestBody => ({
    method: "UFN_EMOJI_CHANNELS_UPD",
    key: "UFN_EMOJI_CHANNELS_UPD",
    parameters: {
        emojidec,
        isfavorite
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

export const insOrg = ({ description, status, type, id, operation }: Dictionary): IRequestBody => ({
    method: "UFN_ORG_INS",
    key: "UFN_ORG_INS",
    parameters: { id, description, status, type, operation }
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
export const getPaginatedPerson = ({ skip, take, filters, sorts, startdate, enddate }: Dictionary): IRequestBodyPaginated => ({
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
        footerenabled,
        footer,
        buttonsenabled,
        buttons,
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
            footerenabled,
            footer,
            buttonsenabled,
            buttons: JSON.stringify(buttons),
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

export const insIntegrationManager = (
    {
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

export const getChannelSel = (id: number): IRequestBody => ({
    method: "UFN_COMMUNICATIONCHANNEL_SEL",
    parameters: {
        communicationchannelid: id,
        personcommunicationchannel: "",
        all: id === 0,
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
export const getInsertChatwebChannel = (name: string, auto: boolean, service: IChatWebAdd): IRequestBody<IChatWebAdd> => ({
    method: "UFN_COMMUNICATIONCHANNEL_INS",
    parameters: {
        id: 0,
        description: name,
        type: "",
        communicationchannelsite: "id del canal",
        communicationchannelowner: "id del canal",
        chatflowenabled: auto,
        integrationid: "",
        color: "",
        icons: "",
        other: "",
        form: "",
        apikey: "",
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
export const getTicketListByPersonBody = (personId: ID, offset = 0) => ({
    method: "UFN_CONVERSATION_SEL_PERSON",
    parameters: {
        personid: personId,
        offset,
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
export const getReportTemplate = (reporttemplateid: number, all: boolean) => ({
    method: "UFN_REPORTTEMPLATE_SEL",
    parameters: {
        reporttemplateid,
        all
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
        isNotPaginated: true
    }
});

export const getCampaignReportProactiveExport = (table: Dictionary[]): IRequestBody => ({
    method: "UFN_CAMPAIGNREPORT_PROACTIVE_EXPORT",
    key: "UFN_CAMPAIGNREPORT_PROACTIVE_EXPORT",
    parameters: {
        origin: "campaignreport",
        table: JSON.stringify(table),
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        isNotPaginated: true
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