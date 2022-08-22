export interface DashboardTemplateSave {
    id: number | String;
	description: string;
	status: string;
	type: string;
	detailjson: string;
	layoutjson: string;
	operation: "INSERT" | "UPDATE" | "DELETE";
}

export interface DashboardTemplate {
	changeby: string;
	changedate: string;
	corpid: number;
	createby: string;
	createdate: string;
	dashboardtemplateid: number;
	description: string;
	/**object json */
	detailjson: string;
	edit: number;
	/**array json */
	layoutjson: string;
	orgid: number;
	status: string;
	type: string;
}
