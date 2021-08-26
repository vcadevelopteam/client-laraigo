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

export const getRolesByOrg = (): IRequestBody => ({
    method: "UFN_ROLE_LST",
    key: "UFN_ROLE_LST",
    parameters: {
    }
})
export const getSupervisors = (orgid: number, userid: number): IRequestBody => ({
    method: "UFN_USER_SUPERVISOR_LST",
    key: "UFN_USER_SUPERVISOR_LST",
    parameters: {
        orgid,
        userid
    }
})
export const getApplicationsByRole = (roleid: number): IRequestBody => ({
    method: "UFN_APPS_DATA_SEL",
    key: "UFN_APPS_DATA_SEL",
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

export const getChannelsByOrg = (orgid?: number | null): IRequestBody => ({
    method: "UFN_COMMUNICATIONCHANNELBYORG_LST",
    key: "UFN_COMMUNICATIONCHANNELBYORG_LST",
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

export const insInappropriateWords = ({ id, description, status, type, username, operation }: Dictionary): IRequestBody => ({
    method: "UFN_INAPPROPRIATEWORDS_INS",
    parameters: { id, description, status, type, username, operation }
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

export const insSLA = ({ id, description, type, company, communicationchannelid, usergroup, status, totaltmo, totaltmomin, totaltmopercentmax, totaltmopercentmin, usertmo, usertmomin, usertmopercentmax,
    usertmopercentmin, tme, tmemin, tmepercentmax, tmepercentmin, usertme, usertmemin, usertmepercentmax, usertmepercentmin, productivitybyhour, operation }: Dictionary): IRequestBody => ({
        method: "UFN_SLA_INS",
        parameters: {
            id, description, type, company, communicationchannelid, usergroup, status, totaltmo, totaltmomin, totaltmopercentmax, totaltmopercentmin, usertmo, usertmomin, usertmopercentmax,
            usertmopercentmin, tme, tmemin, tmepercentmax, tmepercentmin, usertme, usertmemin, usertmepercentmax, usertmepercentmin, productivitybyhour, operation
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

export const insDomain = ({ domainname, operation }: Dictionary): IRequestBody => ({
    method: "UFN_DOMAIN_INS",
    key: "UFN_DOMAIN_INS",
    parameters: { id: 0, domainname, operation }
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
    parameters: { id,description,status,type,operation }
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