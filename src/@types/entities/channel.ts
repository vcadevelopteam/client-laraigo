export interface IChannel {
    apikey: string;
    appintegrationid: number;
    botconfigurationid: string | number | null;
    botenabled: boolean | null;
    channelparameters: string;
    chatflowenabled: boolean;
    color: string | null;
    coloricon: string | null;
    communicationchannelcontact: string;
    communicationchanneldesc: string;
    communicationchannelid: number;
    communicationchannelowner: string;
    communicationchannelsite: string;
    communicationchanneltoken: string | null;
    corpdesc: string;
    corpid: number;
    country: string | null;
    customicon: string | null;
    form: string;
    globalid: number;
    icons: string;
    integrationid: string;
    orgdesc: string;
    orgid: number;
    other: string;
    phone: string;
    resolvelithium: boolean;
    schedule: string;
    servicecredentials: string;
    status: string;
    statusdesc: string;
    type: string;
    typedesc: string;
    updintegration: string;
    voximplantcallsupervision?: boolean;
    voximplantholdtone?: string;
    voximplantrecording?: string;
    voximplantwelcometone?: string;
}