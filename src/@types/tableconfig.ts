export interface Dictionary {
    [key: string]: any
}

export interface TableConfig {
    columns: any,
    data: Dictionary[],
    filterrange?: boolean,
    totalrow?: number,
    fetchData?(param?: any | undefined): void,
    pageCount?: number,
    titlemodule?: string,
    methodexport?: string,
    exportPersonalized?(param?: any): void,
    download?: boolean,
    register?: boolean,
    selectrow?(param: any): void,
    HeadComponent?: () => JSX.Element |null ,
    pageSizeDefault?: number,
    filterGeneral?: boolean
}

export interface Pagination {
    sorts: Dictionary,
    filters: Dictionary,
    pageIndex: number
}