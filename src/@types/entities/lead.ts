

export interface ILead {
    leadid: number;
    description: string;
    type: string;
    status: string;
    expected_revenue: number | null;
    date_deadline: string | null;
    tags: string;
    personcommunicationchannel: string;
    priority: string;
    conversationid: number | null;
    columnid: number;
    index: number;
    products: string;
    /**asesor */
    userid: string | number | null;
}

export interface ICrmLead {
    maxyellow: string;
    maxgreen: string;
    lastchangestatusdate: string;
    changeby: string;
    changedate: string;
    column_uuid: string;
    columnid: number;
    conversationid: number | null;
    corpid: number;
    createby: string;
    createdate: string;
    date_deadline: string;
    description: string;
    displayname: string;
    expected_revenue: string;
    index: number;
    leadid: number;
    orgid: number;
    personcommunicationchannel: string;
    priority: string | undefined;
    /**ACTIVO, CERRADO, ELIMINADO */
    status: string;
    /**separado por comas */
    tags: string;
    type: string;
    phone: string | null;
    firstname?: string | null;
    lastname?: string | null;
    documenttype?: string | null;
    documentnumber?: string | null;
    email: string | null;
    personid?: bigint;
    /**asesor */
    userid: string | number | null;
    phase: string | null;

    /**separado por comas */
    leadproduct: string;
    campaignid: number;
    /**descripción de la campaña (campaignid) */
    campaign: string;
    persontype: string;
    persontypedesc?: string;
    ticketnum?: string;
    estimatedimplementationdate?: string;
    estimatedbillingdate?: string;
    variablecontext?:any;
}
export interface IServiceDeskLead2 {
    leadid: number;
    description:string, 
    ticketnum:string, 
    type:string, 
    personid:string, 
    company:string, 
    email:string, 
    phone:string, 
    urgency:string, 
    impact:string, 
    priority:string,  
    tags:string, 
    leadgroups:string, 
    userid:string, 
    columnid:string, 
    index:string, 
    status:string, 
    column_uuid:string, 
    column_description?: string | null;
}

export interface IServiceDeskLead {
    resolution_deadline: any;
    changeby: string;
    changedate: string;
    column_uuid: string;
    columnid: number;
    conversationid: number | null;
    corpid: number;
    createby: string;
    createdate: string;
    date_deadline: string;
    description: string;
    displayname: string;
    expected_revenue: string;
    index: number;
    leadid: number;
    orgid: number;
    personcommunicationchannel: string;
    priority: string | undefined;
    /**ACTIVO, CERRADO, ELIMINADO */
    status: string;
    /**separado por comas */
    tags: string;
    type: string;
    phone: string | null;
    firstname?: string | null;
    lastname?: string | null;
    documenttype?: string | null;
    documentnumber?: string | null;
    email: string | null;
    personid?: bigint;
    /**asesor */
    userid: string | number | null;
    phase: string | null;

    /**separado por comas */
    leadproduct: string;
    campaignid: number;
    /**descripción de la campaña (campaignid) */
    campaign: string;
    persontypedesc?: string;
    ticketnum?:string;
    sd_request?: string;
    company?: string;
    impact?: string;
    sla_date?: string | null;
    resolution_date?: string | null;
    leadgroups?: string;
    urgency?: string;
    first_contact_date?: string | null;
    first_contact_deadline?: string | null;
    column_description?: string | null;
}

export interface ICRmSaveLead {
	id: number;
	description: string;
	type: string;
	status: string;
	expected_revenue: string;
	date_deadline: string;
	tags: string;
	personcommunicationchannel: string;
	priority: string;
	conversationid: number;
	columnid: number;
	column_uuid: string;
	username: string;
	index: number;
	phone: string;
	email: string;
    userid: string | number | null;
    phase: string;
	operation: string;
    /**seperado por comas */
    leadproduct: string;
    campaignid: number;
}

export interface ICrmLeadActivitySave {
	leadid: number;
	leadactivityid: number;
	description: string;
	duedate: string;
	assignto: string;
	type: string;
	status: "PROGRAMADO" | "REALIZADO" | "ELIMINADO";
	username: string | null;
	operation: "UPDATE" | "INSERT" | "DELETE";
    feedback: string;
    /**array json type: Descendant[] (RichText) */
    detailjson: string;
    sendhsm?: string;
    assigneduser?: number;

    hsmtemplateid?: number;
    communicationchannelid?: number;
    communicationchanneltype?: string;
    hsmtemplatename?: string;
    hsmtemplatetype?: string;
    variables?: any[]
    calendar?: number
    linkcalendar?: string
    calendarbookingid?:number
}
export interface AutomatizationRuleSave {
	id: number,
    operation: string,
    description: string,
    communicationchannelid: number,
    communicationchannelorigin?: number,
    columnid: number,
    columnname: string,
    shippingtype: string,
    xdays: string,
    status: string,
    type: string,
    schedule: string,
    orderstatus: string,
    tags: string,
    products: string,
    messagetemplateid: number,
    hsmtemplatename: string,
    order: boolean,
    variables?: any[],
}

export interface ICrmLeadNoteSave {
    leadid: number;
	leadnotesid: number;
	description: string;
	type: string;
	status: string;
    /** splited by ,  */
    media: string | File[] | null;
	username: string | null | undefined;
	operation: "UPDATE" | "INSERT" | "DELETE";

    createby?: string;
    createdate?: string | number;
}

export interface ICrmLeadNote {
    changedate: string;
    corpid: number;
    createdate: string;
    description: string;
    leadid: number;
    leadnotesid: number;
    orgid: number;
    status: string;
    type: string;
    createby: string;
    media: string | null;
}

export interface IcrmLeadActivity {
    leadid: number;
	leadactivityid: number;
	description: string;
	duedate: string;
	assignto: string;
	assigneduser?: number;
	type: string;
	status: "PROGRAMADO" | "REALIZADO" | "ELIMINADO";
    feedback: string | null;
    /**array json type: Descendant[] (RichText) */
    detailjson: string;

    communicationchannelid?: number;
    hsmtemplateid?: number;
    hsmtemplatetype?: string;
    calendar?:number;
    calendarbookingid?: number
}

export interface ICrmColumn {
    criticality?: any;
    changeby: string;
    changedate: string;
    column_uuid: string;
    columnid: number;
    corpid: number;
    createby: string;
    createdate: string;
    description: string;
    edit: boolean;
    index: number;
    orgid: number;
    status: string;
    type: string;
}

export interface ICrmLeadHistory {
    createdate: string;
    description: string;
    leadid: number;
    type: string;
}

export interface ICrmLeadTagsSave {
	leadid: number;
	tags: string;
	history_description: string;
	history_type: "NEWTAG" | "REMOVETAG";
	history_status: string;
}

export interface ICrmLeadProductsSave {
	leadid: number;
	products: string;
	history_description: string;
	history_type: "NEWPRODUCT" | "REMOVEPRODUCT";
	history_status: string;
}

export interface ICrmLeadHistoryIns {
    leadid: number | string;
    historyleadid?: number;
    description: string;
    type: string;
    status?: "ACTIVO" | "ELIMINADO";
    operation: "UPDATE" | "INSERT" | "DELETE";
}

export interface ICrmGridPerson {
    corpid: number;
    orgid: number;
    leadid: number;
    opportunity: string;
    changedate: Date;
    contact_name: string;
    email: string;
    phone: string;
    priority: string;
    asesorname: string;
    phase: string;
    status: string;
    tags: string;
    notedate: Date;
    notedescription: string;
    notemedia: string;
    activitydate: Date;
    activitydescription: string;
}

export interface ICrmLeadSel {
    /**0 ==> all: true */
    id: number;
    /**customer fullname filter */
	fullname: string;
    /**products filter */
	leadproduct: string;
    /**campaign filter */
	campaignid: number;
    /**tags filter */
    tags: string; 
    /**filtro asesor por ID */
    userid: string;
    /**id del usuario de la sesión - OBLIGATORIO no puede ser cero */
    supervisorid: number;
    persontype: string;
    ordertype: string;
    orderby: string;
	all?: boolean;
}

export interface ISDLeadSel {
    /**0 ==> all: true */
    id: number;
    /**customer fullname filter */
	fullname: string;
    /**products filter */
	leadproduct: string;
    /**tags filter */
    tags: string; 
    /**filtro asesor por ID */
    supervisorid: number;
    company: string;
    groups: string;
    startdate?: any;
    enddate?: any;
    offset?: any;
	all?: boolean;
}