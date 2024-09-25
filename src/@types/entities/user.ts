import { Dictionary } from "@types";

export interface IApplication {
    delete: boolean;
    insert: boolean;
    modify: boolean;
    view: boolean;
    path: string;
    description: string;
}

export interface ObjectApps {
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
    hide_log_conversation: boolean;
    limit_reassign_group: boolean;
    auto_close: Dictionary;
    auto_close_holding: Dictionary;
    time_reassign_call: number | undefined;
    seconds_to_answer_call: number | undefined;
    waiting_customer_message: string | undefined;
    holding_by_supervisor: "TODO" | "CANAL" | "GRUPO" | undefined;
    bot_by_supervisor: "TODO" | "CANAL" | "GRUPO" | undefined;
    environment: string;
    ringer_volume: number;
    origin_label: boolean;
    lock_send_file_pc: boolean;
    range_date_filter: number | undefined;
    enable_send_audio: boolean;
    obligatory_tipification_close_ticket: boolean;
}

interface Domains {
    reasons_disconnection: Dictionary[];
}

type ValueArray = [number, number, number, number, number, string, number];

export type IApplicationsRecord = Record<string, ValueArray>;

interface ILanguageSettings {
    languagereview: string;
    gramaticalactivation: string;
    languagetranslation: string;
    sendingmode: string;
}
export interface IUser {
    email: string;
    firstname: string;
    lastname: string;
    status: string;
    token: string;
    usr: string;
    /**SUPERADMIN | ASESOR | ... */
    roledesc: string;
    channels: string;
    corpdesc: string;
    ownervoxi: string | null;
    sitevoxi: string | null;
    ccidvoxi: number | null;
    groups: string;
    plan: string;
    orgdesc: string;
    redirect: string;
    paymentmethod: string;
    userid: number;
    corpid: number;
    orgid: number;
    newChannels: boolean;
    menu: IApplicationsRecord;
    image: string | null;
    domains: Domains;
    organizations: Organization[];
    automaticConnection?: boolean;
    properties: Properties;
    countrycode: string;
    currencysymbol: string;
    pwdchangefirstlogin: boolean;
    voximplantcallsupervision: boolean;
    partnerid: number;
    companyuser?: string;
    logourl?: string;
    startlogourl?: string;
    iconurl?: string;
    samlAuth?: boolean;
    languagesettings?: ILanguageSettings;    
    // notifications: Notification[];
}

export interface NotificationZyx {
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
