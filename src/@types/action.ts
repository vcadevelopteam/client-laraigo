import { AxiosError, AxiosResponse } from 'axios';
import { Action } from 'redux';

export interface IAction extends Action<string | null | undefined> {
    payload?: any;
}

export interface IActionTypes {
    loading: string;
    success: string;
    failure: string;
}

export interface IActionCall extends IAction {
    callAPI?: () => Promise<AxiosResponse>;
    types?: IActionTypes;
}

export interface IAPIMiddlewareAction extends IActionCall {
    shouldCallAPI?: (state: any) => boolean;
    successFunction?: (res: { [id: string]: string }) => void;
    failureFunction?: (res: AxiosError) => void;
}
