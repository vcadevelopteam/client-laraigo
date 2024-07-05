import { Dictionary } from "@types";

export class SelectedColumns {
    primarykey: string;
    column: boolean[];
    columns: string[];
    firstname: string;
    lastname: string;
    campaignvariables: { [key: string]: { column: string, value: any, type: string, index: string, carouselIndex: number | null } };
    allVariables: { [key: string]: { column: string, value: any } }; 

    constructor() {
        this.primarykey = '';
        this.column = [];
        this.columns = [];
        this.firstname = '';
        this.lastname = '';
        this.campaignvariables = {};
		this.allVariables = {};
    }
}

export interface ICampaign {
	isnew?: boolean,
	id?: number,
	communicationchannelid?: number,
	communicationchanneltype?: string,
	usergroup?: string,
	type?: string,
	status?: string,
	title?: string,
	description?: string,
	startdate?: string,
	enddate?: string,
	repeatable?: boolean,
	frecuency?: number,
	source?: string,
	messagetemplateid?: number,
	messagetemplatename?: string,
	messagetemplatenamespace?: string,
	messagetemplatetype?: string,
	messagetemplateheader?: Dictionary,
	messagetemplatebuttons?: Dictionary[],
	messagetemplatefooter?: string,
	messagetemplateattachment?: string,
	messagetemplatelanguage?: string,
	messagetemplatepriority?: string,
	executiontype?: string,
	batchjson?: Dictionary[] | Dictionary,
	fields?: Dictionary,
	operation?: string,
	carouseljson?: Dictionary[],
	variableshidden?: string[],
	headers?: any[],
	jsonData?: any[],
	selectedColumns?: SelectedColumns,
	selectedRows?: any,
	person?: any[],
	subject?: string,
	message?: string,
	variablereplace?: string[],
	sourcechanged?: boolean,
}

export interface ICampaignLst {
	description: string;
	enddate: string;
	id: number;
	startdate: string;
	status: string;
	title: string;
	type: string;
}