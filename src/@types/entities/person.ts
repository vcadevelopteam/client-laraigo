interface Dictionary {
    [key: string]: any
}

export interface IPerson {
    corpid: number;
    corpdesc: string;
    observation?: string;
    orgid: number;
    orgdesc: string;
    personid: number;
    description?: string;
    groups: any; // edit
    status: string;
    type: string;
    name: string;
    persontype: string; // edit
    personstatus: string;
    phone?: string; // edit
    email?: string; // edit
    alternativephone?: string; // edit
    alternativeemail?: string; // edit
    firstcontact: string;
    lastcontact: string;
    lastcommunicationchannelid: number;
    communicationchannelname?: string;
    documenttype: string; // edit
    documentnumber: string; // edit
    firstname: string;
    lastname: string;
    nickname?: string;
    imageurldef?: string;
    sex: string; // edit
    gender?: string;
    genderdesc?: string;
    birthday: string | null;
    civilstatus?: string; // edit
    civilstatusdesc?: string; // edit
    addressreference?: string;
    occupation?: string; // edit
    occupationdesc?: string; // edit
    educationlevel?: string; // edit
    educationleveldesc?: string; // edit
    lastcommunicationchannel?: string;
    totaltickets?: number;
    country: string;
    region?: string;
    province?: string;
    phonewhatsapp?: string;
    district?: string;
    latitude?: string;
    longitude?: string;
    referringpersonid: number;
    referringpersonname?: string;
    // displayname: string;
    variablecontext: Dictionary;
    locked?: boolean;
    createby: string;
    createdate: string;
    changeby: string;
    changedate: string;
    // personcommunicationchannel: string;
    havelead: boolean;
    haveclassification: boolean;
    address?: string;
    healthprofessional?: string;
    referralchannel?: string;
    usergroup?: string;
    pinnedmessages?: any;
    tags?: string;
}

export interface IPersonCommunicationChannel {
    channeltype: string;
    personcommunicationchannel: string;
    personcommunicationchannelowner: string;
    displayname: string;
}

export interface IPersonImport extends IPerson, IPersonCommunicationChannel {
    pcc: IPersonCommunicationChannel[];
}

export interface IPersonEdit {
    groups: any;
    persontype: string;
    phone?: string;
    email?: string;
    alternativephone?: string;
    alternativeemail?: string;
    documenttype: string;
    documentnumber: string;
    sex: string;
    civilstatus?: string;
    civilstatusdesc?: string;
    occupation?: string;
    occupationdesc?: string;
    educationlevel?: string;
    educationleveldesc?: string;
}

export interface IPersonReferrer {
    name: string;
    documenttype: string;
    documentnumber: string;
}

export interface IPersonChannel {
    corpid: number;
    displayname: string;
    globalid: number;
    originpersonid?: number;
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
    postexternalid?: string|null;
    callanswereddate?: string | null;
    tme: string;
    tmr: string;
    tmo: string;
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
    channeldesc: string;
    channeltype: string;
}

export interface IPersonLead {
    changeby: string;
    changedate: string;
    columnid: number;
    corpid: number;
    createby: string;
    date_deadline: string;
    createdate: string;
    expected_revenue: string;
    priority: string;
    ticketnum: string;
    description: string;
    index: number;
    orgid: number;
    personcommunicationchannel: string;
    personid: number;
    status: string;
    type: string;
}
