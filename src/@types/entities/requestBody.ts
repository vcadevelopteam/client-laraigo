import { Dictionary } from '@types';

export interface ParametersPaginated extends Dictionary {
    skip: number;
    take: number;
    filters: Dictionary;
    sorts: Dictionary;
    origin: string;
    offset?: number;
}

export interface IRequestBody {
    method: string,
    key?: string,
    parameters: Dictionary
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