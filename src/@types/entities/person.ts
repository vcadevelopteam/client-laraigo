interface Dictionary {
    [key: string]: any
}

export interface IPerson {
    corpid: number;
    corpdesc: string;
    orgid: number;
    orgdesc: string;
    personid: number;
    description?: string;
    groups: any;
    status: string;
    type: string;
    name: string;
    persontype: string;
    personstatus: string;
    phone?: string;
    email?: string;
    alternativephone?: string;
    alternativeemail?: string;
    firstcontact: string;
    lastcontact: string;
    lastcommunicationchannelid: number;
    communicationchannelname?: string;
    documenttype: string;
    documentnumber: string;
    firstname: string;
    lastname: string;
    imageurldef?: string;
    sex: string;
    gender?: string;
    birthday: string;
    civilstatus?: string;
    occupation?: string;
    educationlevel?: string;
    country: string;
    region?: string;
    province?: string;
    district?: string;
    latitude?: string;
    longitude?: string;
    referringpersonid: number;
    referringpersonname?: string;
    displayname: string;
    variablecontext: Dictionary;
    locked?: boolean;
}
