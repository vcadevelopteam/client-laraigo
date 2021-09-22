import { Dictionary } from "@types";

export class SelectedColumns {
    primarykey: string;
    column: boolean[];
    columns: string[];
    firstname: string;
    lastname: string;
    constructor() {
        this.primarykey = '';
        this.column = [];
        this.columns = [];
        this.firstname = '';
        this.lastname = '';
    }
}

export interface ICampaign {
    isnew: boolean,
    id: number,
	communicationchannelid: string,
    communicationchanneltype: string,
	usergroup: string,
	type: string,
	status: string,
	title: string,
	description: string,
	startdate: string,
	enddate: string,
	repeatable: boolean,
	frecuency: number,
    source: string,
	messagetemplateid: string,
	messagetemplatename: string,
	messagetemplatenamespace: string,
	messagetemplateheader: Dictionary,
	messagetemplatebuttons: Dictionary[],
	executiontype: string,
	batchjson: Dictionary[],
	fields: Dictionary,
    operation: string,

    headers: any[],
    jsonData: any[],
    selectedColumns: SelectedColumns,
	selection: any[],
	person: any[],

	subject: string,
	message: string, 
}