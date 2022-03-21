

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
    variables?: any[]
}
export interface AutomatizationRuleSave {
	id: number,
    operation: string,
    description: string,
    communicationchannelid: number,
    columnid: number,
    shippingtype: string,
    xdays: string,
    status: string,
    type: string,
    schedule: string,
    tags: string,
    products: string,
    messagetemplateid: number,
    hsmtemplatename: string,
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
}

export interface ICrmColumn {
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
    userid: number;
    /**id del usuario de la sesión - OBLIGATORIO no puede ser cero */
    supervisorid: number;
	all?: boolean;
}
