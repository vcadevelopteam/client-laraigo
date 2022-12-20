import { Dictionary } from "@types";

export interface IDomain {
    domainid: number;
    domainvalue: string;
    domaindesc: string;
    bydefault?: boolean;
}

export interface IPersonDomains {
    docTypes: IDomain[];
    genders: IDomain[];
    occupations: IDomain[];
    civilStatuses: IDomain[];
    educationLevels: IDomain[];
    personTypes: IDomain[];
    groups: IDomain[];
    personGenTypes: IDomain[];
    channelTypes: IDomain[];
    agents?: Dictionary[];
    templates?: Dictionary[];
    channels?: Dictionary[];
    company?: Dictionary[];
    billinggroups?: Dictionary[];
    genericstatus?: Dictionary[];
    userstatus?: Dictionary[];
    roles?: Dictionary[];
    usergroup?: Dictionary[];
    ocupationProperty?: Dictionary[];
}