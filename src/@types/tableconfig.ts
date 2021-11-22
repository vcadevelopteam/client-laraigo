export interface Dictionary {
    [key: string]: any
}

export interface MultiData {
    data: Dictionary[];
    success: boolean;
    key?: string;
}

export interface TableConfig {
    columns: any;
    data: Dictionary[];
    filterrange?: boolean;
    totalrow?: number;
    fetchData?(param?: any | undefined): void;
    pageCount?: number;
    titlemodule?: string;
    methodexport?: string;
    exportPersonalized?(param?: any): void;
    importCSV?: (param?: any) => void
    handleTemplate?: (param?: any) => void
    download?: boolean;
    register?: boolean;
    handleRegister?(param: any): void;
    HeadComponent?: () => JSX.Element |null;
    ButtonsElement?: () => JSX.Element |null;
    pageSizeDefault?: number;
    filterGeneral?: boolean;
    hoverShadow?: boolean;
    loading?: boolean;
    updateCell?(index: number, id: any, value: any): void;
    updateColumn?(index: number[], id: any, value: any): void;
    skipAutoReset?: boolean;
    useSelection?: boolean;
    selectionKey?: string;
    selectionFilter?: {key: string, value: string};
    initialSelectedRows?: any;
    setSelectedRows?: (param?: any) => void;
    allRowsSelected?: boolean;
    setAllRowsSelected?: (value: boolean) => void;
    autotrigger?: boolean;
    toolsFooter?: boolean;
    autoRefresh?: {value: boolean, callback: (value: boolean) => void};
    onClickRow?: (param?: any) => void
}

export interface Pagination {
    sorts: Dictionary,
    filters: Dictionary,
    pageIndex: number,
    trigger?: boolean
}

export interface IFetchData {
    sorts: Dictionary;
    filters: Dictionary;
    pageIndex: number;
    pageSize: number;
    daterange: any;
}