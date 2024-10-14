import { Dictionary, ICampaign, MultiData } from "@types";

export interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

export interface FrameProps {
    page: number,
    checkPage: boolean,
    valid: Dictionary;
    executeSave: boolean,
}

export interface LocalTableVariableMap {
    [key: string]: string;
}

export interface TableColumn {
    label: string;
    description: string;
    persistent: boolean;
}  

export type BreadCrumb = {
    id: string,
    name: string
}

export interface ColumnTmp {
    Header: string;
    accessor: string;
    prefixTranslation?: string;
    type?: string;
}

export interface CampaignProps {
    arrayBread: BreadCrumb[];
    setAuxViewSelected: (view: string) => void;  
}

export interface DetailPropsDetail {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void;
    handleStart: (id: number) => void;
}

export interface DetailPropsGeneral {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetaildata: (data: ICampaign) => void;
    multiData: MultiData[];
    fetchData: () => void;
    frameProps: FrameProps;
    setFrameProps: (value: FrameProps) => void;
    setPageSelected: (page: number) => void;
    setSave: (value: Dictionary) => void;
    setIdAux: (value: number) => void;
    setTemplateAux: (value: Dictionary) => void;
    setDetectionChangeSource: (value: boolean) => void;
}

export interface FilePreviewProps {
    onClose?: (f: string) => void;
    src: File | string;
}

export interface PdfAttachmentProps {
    url: string;
}

export interface TemplatePreviewProps {
    selectedTemplate: Dictionary;
    bodyVariableValues?: Dictionary;
    bubbleVariableValues?: Dictionary;
    headerVariableValues?: Dictionary;
    videoHeaderValue?: string;
    cardImageValues?: Dictionary;
    dynamicUrlValues?: Dictionary;
    carouselVariableValues?: Dictionary;
    selectedAuthVariable?: string;
}

export interface DetailPropsTabMessage {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetaildata: (data: ICampaign) => void;
    multiData: MultiData[];
    fetchData: () => void;
    tablevariable: Dictionary[];
    frameProps: FrameProps;
    setFrameProps: (value: FrameProps) => void;
    setPageSelected: (page: number) => void;
    setSave: (value: string) => void;
    messageVariables: Dictionary[];
    setMessageVariables: (value: Dictionary[]) => void;
    templateAux: Dictionary;
    jsonPersons: Dictionary;
    detectionChangeSource: boolean;
    dataButtons: Dictionary[];
}

export interface DetailPropsTabPerson {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetaildata: (data: ICampaign) => void;
    multiData: MultiData[];
    fetchData: () => void;
    frameProps: FrameProps;
    setFrameProps: (value: FrameProps) => void;
    setPageSelected: (page: number) => void;
    setSave: (value: Dictionary) => void;
    idAux: number;
    templateAux: Dictionary;
    setJsonPersons:  (value: Dictionary) => void;
    detectionChangeSource: boolean;
}

export interface DetailProps {
    setViewSelected: (view: string) => void;
}

export interface Row {
    id: number;
    name: string;
    reason: string;
    date: string;
    phone: string;
    description: string;
}

export interface UploadData {
    id?: number;
    phone?: string;
    description?: string;
    type?: string;
    status?: string;
    operation?: string;
    [key: string]: string | number | undefined;
}

export interface ModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    fetchData: () => void;
    row: Row | null;
}