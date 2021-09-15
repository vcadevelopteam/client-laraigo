import { IAction, IListStatePaginated, IObjectState, IProcessState, ITemplate } from "@types";

interface IHandler<T> {
    [x: string]: (state: T, action: IAction) => any;
}

export function createReducer<T>(initialState: T, handlers: IHandler<T>) {
    return (state = initialState, action: IAction): T => {
        if (action.type && handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    };
}

export const initialListPaginatedState: IListStatePaginated<any> = {
    data: [],
    count: 0,
    loading: false,
    code: undefined,
    error: false,
    message: undefined,
};

export const initialObjectState: IObjectState<any> = {
    value: undefined,
    error: false,
    loading: false,
    code: undefined,
    message: undefined,
};

export const initialProccessState: IProcessState = {
    error: false,
    loading: false,
    success: false,
    code: undefined,
    message: undefined,
};

export const initialCommon: ITemplate = {
    loading: false,
    code: undefined,
    error: undefined,
    message: undefined,
};
