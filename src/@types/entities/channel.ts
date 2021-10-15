export interface IChannel {
    apikey: string;
    appintegrationid: number;
    botconfigurationid: string | number | null;
    botenabled: boolean | null;
    /**RAW JSON */
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
    resolvelithium: any;
    schedule: any;
    /**RAW JSON - service payload */
    servicecredentials: string;
    status: string;
    statusdesc: string;
    type: string;
    typedesc: string;
    updintegration: string;
}
