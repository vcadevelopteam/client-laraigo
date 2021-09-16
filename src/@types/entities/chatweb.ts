export interface IChatWebAdd {
    interface: IChatwebAddInterface;
    color: IChatWebAddColor;
    form: IChatWebAddFormField[];
    bubble: IChatWebAddBubble;
    extra: IChatWebAddExtra;
}

export interface IChatwebAddInterface {
    chattitle: string;
    chatsubtitle: string;
    iconbutton: string | File | null;
    iconheader: string | File | null;
    iconbot: string | File | null;
}

export interface IChatWebAddColor {
    header: string;
    background: string;
    border: string;
    client: string;
    bot: string;
}

export interface IChatWebAddFormField {
    field: string;
    type: string;
    required: boolean;
    label: string;
    placeholder: string;
    validationtext: string;
    inputvalidation: string;
    keyvalidation: string;
}

export interface IChatWebAddBubble {
    active: boolean;
    iconbubble: string | File | null;
    messagebubble: string;
}

export interface IChatWebAddExtra {
    uploadfile: boolean;
    uploadvideo: boolean;
    uploadlocation: boolean;
    uploadimage: boolean;
    uploadaudio: boolean;
    reloadchat: boolean;
    poweredby: boolean;
    persistentinput: boolean;
    abandonevent: boolean;
    alertsound: boolean;
    formhistory: boolean;
    enablemetadata: boolean;
    customcss: string;
    customjs: string;
    botnameenabled: boolean;
    botnametext: string;
}
