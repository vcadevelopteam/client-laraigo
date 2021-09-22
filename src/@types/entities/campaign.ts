import { Dictionary } from "@types";

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
	subject: string,
	message: string, 
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

    selection: any,
    selectedColumns: any,
    jsondata: any
}