import { Dictionary } from '@types';

export interface IRequestBody {
    method: string,
    key?: string,
    parameters: Dictionary
}


export interface ITransaction {
    header: IRequestBody,
    detail: IRequestBody[]
}