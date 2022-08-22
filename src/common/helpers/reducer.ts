import { IAction, IListState, IListStatePaginated, IObjectState, IProcessState, ITemplate } from "@types";

interface IHandler<T> {
    [x: string]: (state: T, action: IAction) => any;
}

interface Options {
    log: boolean;
}

export function createReducer<T>(initialState: T, handlers: IHandler<T>, options: Options = { log: false }) {
    return (state = initialState, action: IAction): T => {
        if (action.type && handlers.hasOwnProperty(action.type)) {
            const newState = handlers[action.type](state, action);
            if (options.log) console.log('action:', action.type, 'state:', newState);
            return newState;
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

export const initialListState: IListState<any> = {
    data: [],
    loading: false,
    code: undefined,
    error: false,
    message: undefined,
};

export const initialDisplayState: 'BOARD' | 'GRID' = 'BOARD';