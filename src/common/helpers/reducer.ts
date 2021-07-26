import { IAction, IListStatePaginated } from "@types";

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
    error: undefined,
    message: undefined,
};
