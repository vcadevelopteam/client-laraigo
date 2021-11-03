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
    status: string;
    /**separado por comas */
    tags: string;
    type: string;
    phone: string | null;
    email: string | null;
    /**asesor */
    userid: string | number | null;
    phase: string | null;
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
}

export interface ICrmLeadActivitySave {
	leadid: number;
	leadactivityid: number;
	description: string;
	duedate: string;
	assignto: string;
	type: string;
	status: string;
	username: string | null;
	operation: "UPDATE" | "INSERT" | "DELETE";
}

export interface ICrmLeadNoteSave {
    leadid: number;
	leadnotesid: number;
	description: string;
	type: string;
	status: string;
    media: string | File | null;
	username: string | null | undefined;
	operation: "UPDATE" | "INSERT" | "DELETE";
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
	type: string;
	status: string;
}
