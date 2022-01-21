import { Dictionary } from '@types';

export interface ParametersPaginated extends Dictionary {
    skip: number;
    take: number;
    filters: Dictionary;
    sorts: Dictionary;
    origin: string;
    offset?: number;
}

export interface IRequestBody<TService = object> {
    method: string,
    key?: string,
    parameters: Dictionary,
    type?: string;
    service?: TService;
}

export interface IRequestBodyPaginated {
    methodCollection: string,
    methodCount?: string,
    parameters: ParametersPaginated
}


export interface ITransaction {
    header: IRequestBody | null,
    detail: (IRequestBody | null)[]
}

// type IColumnTemplate = {
//     key: string;
//     value: string;
//     filter: string;
// }

// type IFilter = {
//     column: string;
//     start?: string | null | undefined;
//     end?: string | null | undefined;
//     value?: string | null | undefined; 
// }

export interface IRequestBodyDynamic {
    columns: Dictionary[];
    summaries: Dictionary[];
    filters: Dictionary[];
    parameters: Dictionary
}