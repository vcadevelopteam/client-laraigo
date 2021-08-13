import { Dictionary, IRequestBody } from '@types';

export const getUserSel = (userid: number): IRequestBody => ({
    method: "UFN_USER_SEL",
    parameters: {
        id: userid,
        all: true
    }
})

export const getOrgUserSel = (userid: number, orgid: number): IRequestBody => ({
    method: "UFN_ORGUSER_SEL",
    parameters: {
        userid,
        orgid,
        all: true
    }
})

export const getPropertySel = (propertyid: number): IRequestBody => ({
    method: "UFN_PROPERTY_SEL",
    parameters: {
        id: propertyid,
        all: propertyid === 0,
    }
});
export const getGroupConfigSel = (groupconfigid: number): IRequestBody => ({
    method: "UFN_GROUPCONFIGURATION_SEL",
    parameters: {
        id: groupconfigid,
        all: groupconfigid === 0,
    }
});

export const getChannelsByOrg = (): IRequestBody => ({
    method: "UFN_COMMUNICATIONCHANNELBYORG_LST",
    parameters: {
    }
});

export const getValuesFromDomain = (domainname: string): IRequestBody => ({
    method: "UFN_DOMAIN_LST_VALORES",
    parameters: {
        domainname
    }
});

export const insProperty = ({ communicationchannelid, id, propertyname, propertyvalue, description, status, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_PROPERTY_INS",
    parameters: { communicationchannelid, id, propertyname, propertyvalue, description, status, type, operation }
});


export const insGroupConfig = ({ id, operation, domainid, description, type, status, quantity, validationtext}: Dictionary): IRequestBody => ({
    method: "UFN_GROUPCONFIGURATION_INS",
    parameters: { id, operation, domainid, description, type, status, quantity, validationtext }
});

export const getWhitelistSel = (whitelistid: number): IRequestBody => ({
    method: "UFN_WHITELIST_SEL",
    parameters: {
        id: whitelistid,
        all: whitelistid === 0,
    }
});

export const insWhitelist = ({ id,operation,documenttype,documentnumber,usergroup,type,status,username }: Dictionary): IRequestBody => ({
    method: "UFN_WHITELIST_INS",
    parameters: { id,operation,documenttype,documentnumber,usergroup,type,status,asesorname:username }
});

export const getInappropriateWordsSel = (id: number): IRequestBody => ({
    method: "UFN_INAPPROPRIATEWORDS_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
});

export const insInappropriateWords = ({ id,description, status, type, username, operation }: Dictionary): IRequestBody => ({
    method: "UFN_INAPPROPRIATEWORDS_INS",
    parameters: { id,description,status, type, username, operation }
});

export const getIntelligentModelsSel = (id: number): IRequestBody => ({
    method: "UFN_INTELLIGENTMODELS_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
});

export const insIntelligentModels = ({ id,operation,description,endpoint,modelid,provider,apikey,type,status }: Dictionary): IRequestBody => ({
    method: "UFN_INTELLIGENTMODELS_INS",
    parameters: { id,operation,description,endpoint,modelid,provider,apikey,type,status }
});

export const getSLASel = (id: number): IRequestBody => ({
    method: "UFN_SLA_SEL",
    parameters: {
        id: id,
        all: id === 0,
    }
});

export const insSLA = ({ id, description, type, company, communicationchannelid, usergroup, status, totaltmo, totaltmomin, totaltmopercentmax, totaltmopercentmin, usertmo, usertmomin, usertmopercentmax, 
                        usertmopercentmin, tme, tmemin, tmepercentmax, tmepercentmin, usertme, usertmemin, usertmepercentmax, usertmepercentmin, productivitybyhour, operation }: Dictionary): IRequestBody => ({
    method: "UFN_SLA_INS",
    parameters: { id, description, type, company, communicationchannelid, usergroup, status, totaltmo, totaltmomin, totaltmopercentmax, totaltmopercentmin, usertmo, usertmomin, usertmopercentmax, 
        usertmopercentmin, tme, tmemin, tmepercentmax, tmepercentmin, usertme, usertmemin, usertmepercentmax, usertmepercentmin, productivitybyhour, operation }
});