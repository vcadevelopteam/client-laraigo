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
}
