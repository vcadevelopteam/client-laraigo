import { BoxProps } from "@material-ui/core";
import { Dictionary, IObjectState, IPerson, IPersonChannel, IPersonConversation, IPersonDomains } from "@types";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";

export interface SimpleTabProps {
    person: IPerson;
}

export interface ChannelTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: UseFormSetValue<IPerson>;
    domains: IObjectState<IPersonDomains>;
}

export interface DialogSendTemplateProps {
    setOpenModal: (param: any) => void;
    openModal: boolean;
    persons: IPerson[];
    type: "HSM" | "MAIL" | "SMS";
    onSubmitTrigger?: () => void;
}

export interface ChannelItemProps {
    channel: IPersonChannel;
    person: any;
}

export interface ConversationItemProps {
    conversation: IPersonConversation;
    person: Dictionary;
}

export interface CustomVariableTabProps {
    setTableData: (x: Dictionary[]) => void;
    tableData: Dictionary[];
}

export interface ExtraDataTabProps {
    getValues: UseFormGetValues<IPerson>;
    setValue: any;
    trigger: any;
}

export interface GeneralInformationTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: any;
    trigger: any;
    domains: IObjectState<IPersonDomains>;
    errors: any;
    control: any;
    extraTriggers: any;
    watch: any;
    addressbook: any;
    setExtraTriggers: (trig: any) => void;
}

export interface LocationTabProps {
    setValue: any;
    watch: any;
    addressbook: any;
}

export interface PersonalDataTabProps {
    getValues: UseFormGetValues<IPerson>;
    setValue: any;
    trigger: any;
    domains: IObjectState<IPersonDomains>;
    errors: any;
    control: any;
    extraTriggers: any;
    setExtraTriggers: (trig: any) => void;
}

export interface TabPanelProps {
    value: string;
    index: string;
}


export interface DetailLocationProps {
    row: any;
    setValue: any;
    editmass?: any
}

export interface PhotoProps {
    src: string;
    radius: number;
    setValue: any;
}

export interface PropertyProps extends Omit<BoxProps, 'title'> {
    icon?: React.ReactNode;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    isLink?: Boolean;
    classesAlt?: any;
}

export interface SideOverviewProps {
    classes: any;
    person: any;
    setValue: any;
}

export interface TemplateIconsProps {
    sendHSM?: (data: any) => void;
    sendSMS: (data: any) => void;
    sendMAIL: (data: any) => void;
}

export interface SideDataProps {
    items: any;
    person?: any;
    setItems?: (x: any) => void;
    availableFields?: any;
}