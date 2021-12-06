export interface IApplication {
    delete: boolean;
    insert: boolean;
    modify: boolean;
    view: boolean;
    path: string;
    description: string;
}

interface ObjectApps {
    [key: string]: boolean[]
}

interface Organization {
    orgid: number;
    corpid: number;
    orgdesc: string;
    corpdesc: string;
}

interface Properties {
    alertTicketNew: boolean | undefined;
    alertMessageIn: boolean | undefined;
}

export interface IUser {
    email: string;
    firstname: string;
    lastname: string;
    status: string;
    token: string;
    usr: string;
    roledesc: string;
    corpdesc: string;
    orgdesc: string;
    redirect: string;
    userid: number;
    corpid: number;
    orgid: number;
    menu: ObjectApps;
    image: string | null;
    organizations: Organization[];
    automaticConnection?: boolean;
    properties: Properties;
    countrycode: string;
    currencysymbol: string;
    pwdchangefirstlogin: boolean;
    notifications: Notification[];
}

interface Notification {
    notificationtype: string | null;
    [key: string]: any;
}

export interface LeadActivityNotification {
    assignto: string;
    changeby: string;
    changedate: string;
    corpid: number;
    createby: string;
    createdate: string;
    description: string;
    duedate: string;
    feedback: string;
    leadactivityid: number;
    leadid: number;
    leadname: string;
    notificationtype: "LEADACTIVITY"
    orgid: number;
    status: string;
    type: string;
}
