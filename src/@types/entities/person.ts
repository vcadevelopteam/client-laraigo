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
    createby: string;
    createdate: string;
    changeby: string;
    changedate: string;
}

export interface IPersonChannel {
    corpid: number;
    displayname: string;
    globalid: number;
    orgid: number;
    personcommunicationchannel: string;
    personcommunicationchannelowner: string;
    personid: number;
    status: string;
    statusdesc: string;
    type: string;
    typedesc: string;
    conversations?: number;
    firstcontact: string;
    lastcontact: string;
}

export interface IPersonAdditionalInfo {
    corpid: number;
    orgid: number;
    personid: number;
    personaddinfoid: number;
    description: string;
    status: string;
    type: string;
    createdate: string;
    createby: string;
    changedate: string;
    changeby: string;
    longdesc: number;
    globalid: number;
    addinfo: string;
    edit: boolean;
}

export interface IPersonConversation {
    asesorfinal: string;
    asesorinicial: string;
    closetype: string;
    empresa?: string;
    fechafin: string;
    fechahandoff?: string;
    fechainicio: string;
    grupo?: string;
    labels?: string;
    personcommunicationchannel: string;
    personid: number;
    realduration: string;
    status: string;
    ticketnum: string;
    tiempopromediorespuestaasesor: string;
    tiempopromediorespuestapersona: string;
    tipification?: string;
    totalduration: string;
    totalpausaduration: string;
    firstreplytime: string;
    totalpauseduration: string;
}
