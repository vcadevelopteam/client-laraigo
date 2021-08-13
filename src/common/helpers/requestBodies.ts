import { Dictionary, IRequestBody } from '@types';

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

export const insUser = ({ id, usr, doctype, docnum, password, firstname, lastname, email, type, status, description, operation, company, twofactorauthentication, registercode }: Dictionary): IRequestBody => ({
    method: "UFN_USER_INS",
    key: "UFN_USER_INS",
    parameters: { id, usr, doctype, docnum, pwd: password, firstname, lastname, email, pwdchangefirstlogin: false, type, status, description, operation, company, twofactorauthentication, registercode }
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