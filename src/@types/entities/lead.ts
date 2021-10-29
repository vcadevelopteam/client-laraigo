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
    conversationid: number;
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
	operation: string;
}
