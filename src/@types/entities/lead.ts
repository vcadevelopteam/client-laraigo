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