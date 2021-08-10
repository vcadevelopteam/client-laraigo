import { Dictionary, IRequestBody } from '@types';

export const getUserSel = (userid: number): IRequestBody => ({
    method: "UFN_USER_SEL",
    parameters: {
        id: userid,
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