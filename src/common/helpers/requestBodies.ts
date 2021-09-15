import { Dictionary, IRequestBody, IRequestBodyPaginated } from '@types';

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
export const getOrgsByCorp = (orgid: number): IRequestBody => ({
    method: "UFN_CORP_ORG_SEL",
    key: "UFN_CORP_ORG_SEL",
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

export const getTickets = (userid: number | null): IRequestBody => ({
    method: "UFN_CONVERSATION_SEL_TICKETSBYUSER",
    key: "UFN_CONVERSATION_SEL_TICKETSBYUSER",
    parameters: { ...(userid && { userid }) }
})

export const getInfoPerson = (personid: number): IRequestBody => ({
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

export const getPropertySel = (propertyid: number): IRequestBody => ({
    method: "UFN_PROPERTY_SEL",
    key: "UFN_PROPERTY_SEL",
    parameters: {
        id: propertyid,
        all: propertyid === 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1
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

export const getValuesFromDomain = (domainname: string): IRequestBody => ({
    method: "UFN_DOMAIN_LST_VALORES",
    key: "UFN_DOMAIN_LST_VALORES",
    parameters: {
        domainname
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

export const insProperty = ({ communicationchannelid, id, propertyname, propertyvalue, description, status, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_PROPERTY_INS",
    key: "UFN_PROPERTY_INS",
    parameters: { communicationchannelid, id, propertyname, propertyvalue, description, status, type, operation }
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

export const insInappropriateWords = ({ id, description, status, type, username, operation,classification,defaultanswer }: Dictionary): IRequestBody => ({
    method: "UFN_INAPPROPRIATEWORDS_INS",
    parameters: { id, description, status, type, username, operation,classification,defaultanswer }
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

export const getReportFilterSel = (filter: string): IRequestBody => ({
    method: filter,
    key: filter,
    parameters: {
        supervisorid: 1,
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
        supervisorid: 1,
        allParameters,
        userid: allParameters["userid"],
        channel: allParameters["channel"],
        hours: "",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const getReportExport = (methodExport: string, origin: string, { filters, sorts, startdate, enddate }: Dictionary): IRequestBody => ({
    method: methodExport,
    key: methodExport,
    parameters: {
        origin: origin,
        filters,
        startdate,
        enddate,
        sorts,
        supervisorid: 1,
        channel: "",
        hours: "",
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

export const insQuickreplies = ({ id, classificationid, description, quickreply, status, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_QUICKREPLY_INS",
    key: "UFN_QUICKREPLY_INS",
    parameters: { id, classificationid, description, quickreply, status, type, operation }
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
            buttons: buttons ? JSON.stringify(buttons) : "",
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